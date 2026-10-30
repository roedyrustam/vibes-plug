#!/usr/bin/env node

/**
 * Vibes-Plug Real-Time Swarm Concurrency Bus (2026 Edition)
 * 
 * Provides an event-driven pub/sub substrate, persistent cross-process A2A Blackboard,
 * and real-time SSE streaming bus for concurrent multi-agent worker coordination,
 * live state telemetry, and inter-agent synchronization across the 176-skill swarm ecosystem.
 * 
 * @author Roedy Rustam
 * @version 4.5.0
 */

import { EventEmitter } from 'node:events';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function getStateDir(cwd = process.cwd()) {
  return path.join(cwd, '.agents', 'memory');
}

function getBlackboardFilePath(cwd = process.cwd()) {
  return path.join(getStateDir(cwd), 'blackboard_state.json');
}

function getBusStateFilePath(cwd = process.cwd()) {
  return path.join(getStateDir(cwd), 'swarm_bus_state.json');
}

class SwarmEventBus extends EventEmitter {
  constructor(maxBufferSize = 150) {
    super();
    this.setMaxListeners(50);
    this.maxBufferSize = maxBufferSize;
    this.eventBuffer = [];
    this.activeSwarms = new Map();
    this.blackboard = new Map();
  }

  /**
   * Persists current blackboard state to disk for cross-process A2A sharing
   */
  _persistBlackboardToDisk() {
    try {
      const dir = getStateDir();
      fs.mkdirSync(dir, { recursive: true });
      const filePath = getBlackboardFilePath();
      let diskEntries = {};
      if (fs.existsSync(filePath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (parsed && typeof parsed.entries === 'object') {
            diskEntries = parsed.entries;
          }
        } catch {
          diskEntries = {};
        }
      }
      for (const [k, v] of this.blackboard.entries()) {
        diskEntries[k] = v;
      }
      fs.writeFileSync(
        filePath,
        JSON.stringify({ updatedAt: new Date().toISOString(), entries: diskEntries }, null, 2),
        'utf8'
      );
    } catch {
      // Non-fatal in read-only sandboxes
    }
  }

  /**
   * Hydrates missing blackboard keys from disk written by sibling processes
   */
  _hydrateBlackboardFromDisk() {
    try {
      const filePath = getBlackboardFilePath();
      if (!fs.existsSync(filePath)) return;
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (parsed && parsed.entries && typeof parsed.entries === 'object') {
        for (const [k, v] of Object.entries(parsed.entries)) {
          if (!this.blackboard.has(k)) {
            this.blackboard.set(k, v);
          }
        }
      }
    } catch {
      // Ignore malformed disk state
    }
  }

  /**
   * Persists active swarms and recent event buffer to disk for cross-process CLI/Studio telemetry
   */
  _persistBusStateToDisk() {
    try {
      const dir = getStateDir();
      fs.mkdirSync(dir, { recursive: true });
      const filePath = getBusStateFilePath();
      const payload = {
        updatedAt: new Date().toISOString(),
        activeSwarms: Object.fromEntries(this.activeSwarms.entries()),
        eventBuffer: this.eventBuffer.slice(-this.maxBufferSize)
      };
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
    } catch {
      // Non-fatal in read-only environments
    }
  }

  /**
   * Hydrates events and active swarms from disk when starting a fresh CLI/MCP process
   */
  _hydrateBusStateFromDisk() {
    if (this.eventBuffer.length > 0 || this.activeSwarms.size > 0) return;
    try {
      const filePath = getBusStateFilePath();
      if (!fs.existsSync(filePath)) return;
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (parsed && Array.isArray(parsed.eventBuffer)) {
        this.eventBuffer = parsed.eventBuffer.slice(-this.maxBufferSize);
      }
      if (parsed && parsed.activeSwarms && typeof parsed.activeSwarms === 'object') {
        for (const [id, sw] of Object.entries(parsed.activeSwarms)) {
          this.activeSwarms.set(id, sw);
        }
      }
    } catch {
      // Ignore malformed state
    }
  }

  /**
   * Sets or updates a shared contract/key on the Swarm Blackboard
   * @param {string} key - e.g. 'schema:db', 'contract:api', 'ui:state'
   * @param {*} value - The shared data/contract
   * @param {string} [authorAgent] - Identifier of the author agent
   * @returns {Object} The updated blackboard entry
   */
  setBlackboard(key, value, authorAgent = 'swarm-director') {
    const existing = this.blackboard.get(key);
    const version = existing ? existing.version + 1 : 1;
    const entry = {
      key,
      value,
      version,
      authorAgent,
      updatedAt: new Date().toISOString()
    };
    this.blackboard.set(key, entry);
    this._persistBlackboardToDisk();

    this.publish('blackboard:update', {
      key,
      version,
      authorAgent,
      timestamp: entry.updatedAt
    });

    return entry;
  }

  /**
   * Retrieves a shared contract from the Blackboard (with cross-process disk fallback)
   * @param {string} key 
   * @returns {Object|null}
   */
  getBlackboard(key) {
    if (!this.blackboard.has(key)) {
      this._hydrateBlackboardFromDisk();
    }
    return this.blackboard.get(key) || null;
  }

  /**
   * Lists all entries currently on the Swarm Blackboard
   * @returns {Array<Object>}
   */
  listBlackboard() {
    this._hydrateBlackboardFromDisk();
    return Array.from(this.blackboard.values());
  }

  /**
   * Publishes an event to all subscribers and appends to in-memory + disk ring buffer
   * @param {string} eventType 
   * @param {Object} payload 
   * @returns {Object} The published event object
   */
  publish(eventType, payload = {}) {
    const event = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: eventType,
      ...payload
    };

    // Update active swarm state map
    if (event.swarmId) {
      const existing = this.activeSwarms.get(event.swarmId) || {
        swarmId: event.swarmId,
        task: event.task || 'Autonomous Swarm Task',
        startedAt: event.timestamp,
        status: 'RUNNING',
        totalWorkers: event.totalWorkers || 0,
        completedWorkers: 0,
        workers: {}
      };

      if (eventType === 'swarm:start') {
        existing.status = 'RUNNING';
        existing.totalWorkers = event.totalWorkers || existing.totalWorkers;
      } else if (eventType === 'worker:done') {
        existing.completedWorkers++;
        if (event.workerId) {
          existing.workers[event.workerId] = { status: 'COMPLETED', ...event };
        }
      } else if (eventType === 'swarm:complete' || eventType === 'swarm:error') {
        existing.status = eventType === 'swarm:complete' ? 'COMPLETED' : 'ERROR';
        existing.completedAt = event.timestamp;
      }

      this.activeSwarms.set(event.swarmId, existing);
    }

    this.eventBuffer.push(event);
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.shift();
    }

    this._persistBusStateToDisk();

    this.emit('swarm-event', event);
    this.emit(eventType, event);

    return event;
  }

  /**
   * Retrieves buffered events with optional type filtering and limit
   * @param {Object} [options]
   * @returns {Array<Object>}
   */
  getEvents(options = {}) {
    this._hydrateBusStateFromDisk();
    let result = [...this.eventBuffer];
    if (options.type) {
      result = result.filter(e => e.type === options.type);
    }
    if (options.swarmId) {
      result = result.filter(e => e.swarmId === options.swarmId);
    }
    const limit = Number(options.limit) || 50;
    return result.slice(-limit);
  }

  /**
   * Returns list of currently active or recently completed swarms
   * @returns {Array<Object>}
   */
  getActiveSwarms() {
    this._hydrateBusStateFromDisk();
    return Array.from(this.activeSwarms.values());
  }

  /**
   * Attaches an HTTP Server-Sent Events (SSE) stream to the bus
   * @param {import('node:http').ServerResponse} res 
   * @param {Object} [options]
   * @returns {() => void} Cleanup function to detach
   */
  attachSseStream(res, options = {}) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*'
    });

    const clientId = crypto.randomUUID();
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId, connectedAt: new Date().toISOString() })}\n\n`);

    // Replay initial recent events if requested
    if (options.replay !== false) {
      const recent = this.getEvents({ limit: options.replayLimit || 15 });
      for (const ev of recent) {
        res.write(`event: message\ndata: ${JSON.stringify(ev)}\n\n`);
      }
    }

    const onEvent = (event) => {
      try {
        res.write(`event: message\ndata: ${JSON.stringify(event)}\n\n`);
      } catch {
        this.removeListener('swarm-event', onEvent);
      }
    };

    this.on('swarm-event', onEvent);

    const cleanup = () => {
      this.removeListener('swarm-event', onEvent);
    };

    res.on('close', cleanup);
    return cleanup;
  }

  /**
   * Clears event history buffer, blackboard, and resets active swarm map
   */
  reset() {
    this.eventBuffer = [];
    this.activeSwarms.clear();
    this.blackboard.clear();
    try {
      const bbFile = getBlackboardFilePath();
      if (fs.existsSync(bbFile)) fs.unlinkSync(bbFile);
      const busFile = getBusStateFilePath();
      if (fs.existsSync(busFile)) fs.unlinkSync(busFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Global Singleton Instance
export const swarmBus = new SwarmEventBus();

/**
 * Convenience helper to emit a swarm lifecycle event
 * @param {string} type 
 * @param {Object} payload 
 * @returns {Object}
 */
export function emitSwarmEvent(type, payload = {}) {
  return swarmBus.publish(type, payload);
}

/**
 * Convenience helper to query recent swarm events
 * @param {Object} [options]
 * @returns {Array<Object>}
 */
export function getRecentSwarmEvents(options = {}) {
  return swarmBus.getEvents(options);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  if (command === 'status' || command === 'events') {
    const limitIdx = args.indexOf('--limit');
    const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 20;
    const events = swarmBus.getEvents({ limit });
    const active = swarmBus.getActiveSwarms();
    const bbEntries = swarmBus.listBlackboard();

    console.log(`
╔══════════════════════════════════════════════════════════╗
║    ⚡ Vibes-Plug Real-Time Swarm Concurrency Bus         ║
║    Multi-Agent Event Stream & Persistent A2A Blackboard  ║
╚══════════════════════════════════════════════════════════╝
`);
    console.log(`📊 Active Swarms      : ${active.length}`);
    console.log(`📋 Blackboard Keys    : ${bbEntries.length}`);
    console.log(`📡 Buffered Events    : ${events.length}`);
    console.log('\nRecent Swarm Events:');

    if (events.length === 0) {
      console.log('  (No swarm events recorded yet. Run "vibes swarm:dispatch" to trigger live execution.)');
    } else {
      for (const ev of events) {
        console.log(`  [${ev.timestamp.slice(11, 19)}] [${ev.type}] ${ev.task || ev.domain || ev.message || JSON.stringify(ev)}`);
      }
    }
    return;
  }

  if (command === 'broadcast') {
    const message = args.slice(1).join(' ') || 'Inter-agent broadcast signal';
    const ev = emitSwarmEvent('agent:broadcast', { message, source: 'CLI' });
    console.log(`✅ Broadcast signal emitted: [${ev.id}] "${message}"`);
    return;
  }

  console.log('Usage: vibes swarm:bus [status|events|broadcast <message>] [--limit <n>]');
}

if (process.argv[1] && process.argv[1].endsWith('swarm-bus.mjs')) {
  main().catch(err => {
    console.error(`\n❌ Swarm Bus Error: ${err.message}`);
    process.exit(1);
  });
}
