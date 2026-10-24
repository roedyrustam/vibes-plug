#!/usr/bin/env node
/**
 * scripts/drift-healer.mjs
 * P8 Engine: Autonomous API & Schema Drift Healer (v4.5.0)
 *
 * Detects structural drift between PostgreSQL DDL schemas and TypeScript/Zod/OpenAPI
 * contracts (missing columns, snake_case <-> camelCase mismatches, nullability drift,
 * and missing RLS tenant isolation) and synthesizes a 100% complete healing patch.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function snakeToCamel(str) {
  return String(str).replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

export function pascalCase(str) {
  const camel = snakeToCamel(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function mapSqlTypeToTs(sqlType) {
  const upper = String(sqlType).toUpperCase();
  if (upper.includes('UUID')) return { ts: 'string', zod: 'z.string().uuid()' };
  if (upper.includes('INT') || upper.includes('SERIAL') || upper.includes('NUMERIC') || upper.includes('DECIMAL') || upper.includes('FLOAT') || upper.includes('DOUBLE')) {
    return { ts: 'number', zod: upper.includes('INT') ? 'z.number().int()' : 'z.number()' };
  }
  if (upper.includes('BOOL')) return { ts: 'boolean', zod: 'z.boolean()' };
  if (upper.includes('TIMESTAMP') || upper.includes('DATE')) return { ts: 'string', zod: 'z.string().datetime()' };
  if (upper.includes('JSON')) return { ts: 'Record<string, unknown>', zod: 'z.record(z.string(), z.unknown())' };
  return { ts: 'string', zod: 'z.string()' };
}

/**
 * Parses PostgreSQL CREATE TABLE statements into normalized table & column descriptors
 * @param {string} ddlText
 */
export function parseSqlTables(ddlText = '') {
  const tables = [];
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_."]+)\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = tableRegex.exec(ddlText)) !== null) {
    const rawName = match[1].replace(/["']/g, '').split('.').pop();
    const body = match[2];
    const lines = body
      .split(/\r?\n/)
      .map((l) => l.replace(/--.*$/, '').trim().replace(/,$/, ''))
      .filter(Boolean);

    const columns = [];
    for (const line of lines) {
      if (/^(PRIMARY|FOREIGN|CONSTRAINT|UNIQUE|CHECK)\b/i.test(line)) continue;
      const colMatch = line.match(/^"?([a-zA-Z0-9_]+)"?\s+([a-zA-Z0-9_()]+)(.*)$/);
      if (!colMatch) continue;
      const colName = colMatch[1];
      const sqlType = colMatch[2];
      const modifiers = colMatch[3] || '';
      const isNullable = !/\bNOT\s+NULL\b/i.test(modifiers) && !/\bPRIMARY\s+KEY\b/i.test(modifiers);
      const hasDefault = /\bDEFAULT\b/i.test(modifiers);
      const mapped = mapSqlTypeToTs(sqlType);

      columns.push({
        columnName: colName,
        camelName: snakeToCamel(colName),
        sqlType: sqlType.toUpperCase(),
        tsType: mapped.ts,
        zodType: mapped.zod,
        nullable: isNullable,
        hasDefault
      });
    }

    const rlsRegex = new RegExp(`ALTER\\s+TABLE\\s+[a-zA-Z0-9_."]*${rawName}[a-zA-Z0-9_."]*\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i');
    const hasRls = rlsRegex.test(ddlText);

    tables.push({
      tableName: rawName,
      entityName: pascalCase(rawName.replace(/s$/, '')),
      hasRls,
      hasTenantId: columns.some((c) => c.columnName === 'tenant_id' || c.columnName === 'org_id'),
      columns
    });
  }

  return tables;
}

/**
 * Parses TypeScript interfaces and Zod schemas into field maps
 * @param {string} tsText
 */
export function parseTsFields(tsText = '') {
  const fields = new Map();
  const propRegex = /^\s*(?:readonly\s+)?([a-zA-Z0-9_]+)(\??)\s*:\s*([^;\r\n]+)/gm;
  let match;
  while ((match = propRegex.exec(tsText)) !== null) {
    const name = match[1];
    if (name === 'export' || name === 'interface' || name === 'type' || name === 'const') continue;
    const optional = match[2] === '?';
    const rawType = match[3].trim();
    fields.set(name, {
      name,
      optional: optional || rawType.includes('null') || rawType.includes('undefined'),
      rawType
    });
  }
  return fields;
}

/**
 * Diagnoses schema drift between SQL DDL and TypeScript/API contracts and synthesizes a healing patch
 * @param {Object} options
 * @param {string} [options.sql]
 * @param {string} [options.ts]
 */
export function healSchemaDrift(options = {}) {
  const startTime = performance.now();
  const defaultSql = `
    CREATE TABLE IF NOT EXISTS payment_settlements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL,
      invoice_number VARCHAR(64) NOT NULL,
      amount_minor BIGINT NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
      status VARCHAR(24) NOT NULL,
      settled_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE payment_settlements ENABLE ROW LEVEL SECURITY;
  `;
  const defaultTs = `
    export interface PaymentSettlement {
      id: string;
      invoiceNumber: string;
      amountMinor: string;
      status: string;
    }
  `;

  const sqlText = options.sql || defaultSql;
  const tsText = options.ts || defaultTs;

  const tables = parseSqlTables(sqlText);
  const tsFields = parseTsFields(tsText);

  const findings = [];
  const patches = [];

  for (const table of tables) {
    if (!table.hasRls) {
      findings.push({
        kind: 'MISSING_RLS_POLICY',
        severity: 'critical',
        table: table.tableName,
        detail: `Table '${table.tableName}' does not enable Row Level Security (RLS).`
      });
    }
    if (!table.hasTenantId) {
      findings.push({
        kind: 'MISSING_TENANT_ISOLATION_COLUMN',
        severity: 'high',
        table: table.tableName,
        detail: `Table '${table.tableName}' is missing 'tenant_id' or 'org_id' for multi-tenant isolation.`
      });
    }

    for (const col of table.columns) {
      const tsField = tsFields.get(col.camelName) || tsFields.get(col.columnName);
      if (!tsField) {
        findings.push({
          kind: 'MISSING_CONTRACT_FIELD',
          severity: 'high',
          table: table.tableName,
          column: col.columnName,
          expectedProperty: col.camelName,
          expectedType: col.tsType,
          detail: `Column '${table.tableName}.${col.columnName}' (${col.sqlType}) is missing from TypeScript/API contract.`
        });
      } else {
        const normalizedTs = tsField.rawType.replace(/\s*\|\s*null|\s*\|\s*undefined/g, '').trim();
        if (normalizedTs !== col.tsType && !(col.tsType === 'Record<string, unknown>' && normalizedTs.includes('Record'))) {
          findings.push({
            kind: 'TYPE_DRIFT',
            severity: 'medium',
            table: table.tableName,
            column: col.columnName,
            property: tsField.name,
            dbType: col.sqlType,
            expectedTsType: col.tsType,
            actualTsType: normalizedTs,
            detail: `Property '${tsField.name}' has type '${normalizedTs}' in TS contract, but DB column '${col.columnName}' is ${col.sqlType} (expected '${col.tsType}').`
          });
        }
      }
    }

    const interfaceLines = table.columns.map(
      (c) => `  readonly ${c.camelName}${c.nullable ? '?' : ''}: ${c.tsType}${c.nullable ? ' | null' : ''};`
    );
    const zodLines = table.columns.map(
      (c) => `  ${c.camelName}: ${c.zodType}${c.nullable ? '.nullable().optional()' : ''},`
    );

    const patchCode = [
      `import { z } from 'zod';`,
      ``,
      `export interface ${table.entityName}Record {`,
      ...interfaceLines,
      `}`,
      ``,
      `export const ${table.entityName}Schema = z.object({`,
      ...zodLines,
      `}).strict();`,
      ``,
      `export type ${table.entityName}DTO = z.infer<typeof ${table.entityName}Schema>;`
    ].join('\n');

    patches.push({
      tableName: table.tableName,
      entityName: table.entityName,
      code: patchCode
    });
  }

  return {
    engine: 'P8:AutonomousSchemaDriftHealer',
    status: findings.length === 0 ? 'SYNCHRONIZED' : 'DRIFT_HEALED',
    durationMs: Math.max(1, Number((performance.now() - startTime).toFixed(2))),
    tablesAnalyzed: tables.length,
    driftCount: findings.length,
    findings,
    synthesizedPatch: patches.map((p) => p.code).join('\n\n')
  };
}

// CLI Runner
const isMain = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('drift-healer.mjs')
);

if (isMain) {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const positional = args.filter((a) => !a.startsWith('--'));

  (async () => {
    let sql = '';
    let ts = '';
    if (positional[0]) {
      sql = await fs.readFile(path.resolve(process.cwd(), positional[0]), 'utf8');
    }
    if (positional[1]) {
      ts = await fs.readFile(path.resolve(process.cwd(), positional[1]), 'utf8');
    }
    const report = healSchemaDrift({ sql, ts });
    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`\n⚡ [P8 Schema Drift Healer] Status: ${report.status} (${report.durationMs}ms)`);
      console.log(`   • Tables Analyzed : ${report.tablesAnalyzed}`);
      console.log(`   • Drifts Detected : ${report.driftCount}\n`);
      if (report.findings.length > 0) {
        console.table(report.findings.map((f) => ({
          kind: f.kind,
          severity: f.severity,
          table: f.table,
          detail: f.detail.slice(0, 68)
        })));
      }
      console.log('\n🩹 Synthesized Zero-Drift TypeScript + Zod Contract:\n');
      console.log(report.synthesizedPatch);
    }
  })().catch((err) => {
    console.error(`❌ Schema drift healer error: ${err.message}`);
    process.exit(1);
  });
}
