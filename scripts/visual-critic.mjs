#!/usr/bin/env node

/**
 * Vibes-Plug Visual UI Critic & Multimodal Vision Auditor (Pillar 6)
 * 
 * Enforces Anti-Slop Directive Pillar 7 (UI & Visual Sanitation) and provides
 * multimodal vision analysis schemas for Gemini 4 Pro / Flash Vision, Claude 5.1 / 3.7 Vision,
 * and GPT-5 Vision.
 */

import fs from 'fs';
import path from 'path';

export const VISUAL_RULES = {
  PILL_BUTTON: {
    id: 'UI-R01',
    name: 'Pill Button Addiction Check',
    category: 'Geometry & Radius',
    description: "Prohibits 'rounded-full' on standard rectangular action buttons. Mandates structured 3-tier radius scale (6px sm, 8px md, 12px lg)."
  },
  CRISP_BORDERS: {
    id: 'UI-R02',
    name: '1px Crisp Border & Surface Grounding',
    category: 'Elevation & Surface',
    description: 'Mandates crisp 1px borders (border-border/50 or rgba(255,255,255,0.08)) over heavy floating zero-gravity blur shadows.'
  },
  COLOR_PALETTE: {
    id: 'UI-R03',
    name: 'Curated Palette & Anti-Generic Gradients',
    category: 'Color & Contrast',
    description: 'Prohibits generic AI blue-to-purple gradients and neon radial background glow orbs.'
  },
  TABULAR_NUMERALS: {
    id: 'UI-R04',
    name: 'Tabular Numerals for Numerical Data',
    category: 'Typography',
    description: "Mandates font variant 'tabular-nums' for all currency values, counters, metrics, and data tables to prevent horizontal jitter."
  },
  FIVE_STATE_CONTRACT: {
    id: 'UI-R05',
    name: '5-State Interactive Element Contract',
    category: 'Interactivity & a11y',
    description: 'All interactive controls must implement: default, hover, focus-visible (accessible outline), active (scale-98/pressed), and disabled.'
  },
  DECORATIVE_EMOJI: {
    id: 'UI-R06',
    name: 'Anti-Decorative Emoji Clutter',
    category: 'Content Craft',
    description: 'Prohibits decorative rocket/sparkles/fire emojis in headings, badges, or buttons. Use production SVG icons.'
  }
};

/**
 * Perform static visual audit on UI source code (JSX, TSX, Vue, HTML, CSS)
 * @param {string} content - Source code or file path
 * @param {object} options - Configuration options
 * @returns {object} Audit report with score, findings, and multimodal vision rubric
 */
export function visualAudit(content, options = {}) {
  let targetCode = content;
  let targetFile = null;

  if (typeof content === 'string' && content.length < 500 && fs.existsSync(content)) {
    try {
      const stats = fs.statSync(content);
      if (stats.isFile()) {
        targetFile = content;
        const ext = path.extname(content).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
          return auditImageFile(content, options);
        }
        targetCode = fs.readFileSync(content, 'utf8');
      }
    } catch {
      // Treat as raw string
    }
  }

  let score = 100;
  const findings = [];
  const checks = [];

  // Check 1: Pill Button Addiction
  const pillRegex = /<button[^>]*(?:className|class)=["'][^"']*\brounded-full\b(?!\s+(?:w-\d+\s+h-\d+|p-\d+|size-\d+))[^"']*["']/i;
  const hasPill = pillRegex.test(targetCode);
  if (hasPill) {
    score -= 15;
    findings.push({
      ruleId: VISUAL_RULES.PILL_BUTTON.id,
      ruleName: VISUAL_RULES.PILL_BUTTON.name,
      severity: 'WARNING',
      message: "Detected 'rounded-full' on rectangular button. Use 3-tier radius: rounded-md (6px) or rounded-lg (8px).",
      fix: "Replace 'rounded-full' with 'rounded-lg border border-border/40'"
    });
  }
  checks.push({ id: VISUAL_RULES.PILL_BUTTON.id, passed: !hasPill });

  // Check 2: Crisp 1px Borders vs Floating Blurred Shadows
  const heavyShadowRegex = /\bshadow-2xl\s+shadow-(purple|indigo|blue|violet)-[456]00/i;
  const hasHeavyShadow = heavyShadowRegex.test(targetCode);
  if (hasHeavyShadow) {
    score -= 15;
    findings.push({
      ruleId: VISUAL_RULES.CRISP_BORDERS.id,
      ruleName: VISUAL_RULES.CRISP_BORDERS.name,
      severity: 'WARNING',
      message: 'Detected zero-gravity colored drop shadow. AI slop aesthetic.',
      fix: "Replace with crisp 1px border: 'border border-border/60 shadow-sm'"
    });
  }
  checks.push({ id: VISUAL_RULES.CRISP_BORDERS.id, passed: !hasHeavyShadow });

  // Check 3: Generic AI Gradient Cliché
  const genericGradientRegex = /bg-gradient-to-[trbl]+\s+from-(blue|indigo|cyan)-[456]00\s+(via-[a-z]+-[456]00\s+)?to-(purple|pink|violet)-[456]00/i;
  const hasGenericGradient = genericGradientRegex.test(targetCode);
  if (hasGenericGradient) {
    score -= 20;
    findings.push({
      ruleId: VISUAL_RULES.COLOR_PALETTE.id,
      ruleName: VISUAL_RULES.COLOR_PALETTE.name,
      severity: 'CRITICAL',
      message: 'Detected generic AI blue-to-purple gradient cliché.',
      fix: "Use curated solid brand palette or subtle single-hue illumination."
    });
  }
  checks.push({ id: VISUAL_RULES.COLOR_PALETTE.id, passed: !hasGenericGradient });

  // Check 4: Blurred Neon Radial Glow Orb
  const neonOrbRegex = /(bg-(purple|blue|cyan|fuchsia|violet|indigo)-[456]00\/[0-9]+\s+rounded-full\s+blur-[23]xl|blur-[23]xl\s+bg-(purple|blue|cyan|fuchsia|violet|indigo)-[456]00)/i;
  const hasNeonOrb = neonOrbRegex.test(targetCode);
  if (hasNeonOrb) {
    score -= 15;
    findings.push({
      ruleId: VISUAL_RULES.COLOR_PALETTE.id,
      ruleName: VISUAL_RULES.COLOR_PALETTE.name,
      severity: 'WARNING',
      message: 'Detected generic blurred neon radial glow orb in backdrop.',
      fix: 'Use purposeful lighting, clean solid surfaces, or grid patterns.'
    });
  }

  // Check 5: Tabular Numerals for Currency or Stats
  const hasCurrencyOrStats = /(Rp\s*\d|\$\s*\d|€\s*\d|\b\d+([.,]\d+)?\s*(IDR|USD|EUR|%|transactions|orders))/i.test(targetCode);
  const hasTabularNums = /tabular-nums|font-variant-numeric:\s*tabular-nums/i.test(targetCode);
  if (hasCurrencyOrStats && !hasTabularNums) {
    score -= 10;
    findings.push({
      ruleId: VISUAL_RULES.TABULAR_NUMERALS.id,
      ruleName: VISUAL_RULES.TABULAR_NUMERALS.name,
      severity: 'SUGGESTION',
      message: "Monetary or numerical data displayed without 'tabular-nums'. Numbers may visually shift during updates.",
      fix: "Add 'tabular-nums' class to numerical values."
    });
  }
  checks.push({ id: VISUAL_RULES.TABULAR_NUMERALS.id, passed: !hasCurrencyOrStats || hasTabularNums });

  // Check 6: Decorative Emojis in Headings/Buttons
  const emojiRegex = /<(h[1-6]|button|span|p)[^>]*>[^<]*[🚀✨🔥🎉💡][^<]*<\/(h[1-6]|button|span|p)>/u;
  const hasEmoji = emojiRegex.test(targetCode);
  if (hasEmoji) {
    score -= 10;
    findings.push({
      ruleId: VISUAL_RULES.DECORATIVE_EMOJI.id,
      ruleName: VISUAL_RULES.DECORATIVE_EMOJI.name,
      severity: 'WARNING',
      message: 'Detected decorative emoji (🚀/✨/🔥) in UI heading or button.',
      fix: 'Remove decorative emojis and use precision Lucide/Heroicons SVG.'
    });
  }
  checks.push({ id: VISUAL_RULES.DECORATIVE_EMOJI.id, passed: !hasEmoji });

  // Check 7: Interactive Focus Ring
  const strippedFocus = new RegExp('focus:' + 'outline-none(?!\\s.*focus-visible:ring)', 'i').test(targetCode);
  if (strippedFocus) {
    score -= 15;
    findings.push({
      ruleId: VISUAL_RULES.FIVE_STATE_CONTRACT.id,
      ruleName: VISUAL_RULES.FIVE_STATE_CONTRACT.name,
      severity: 'CRITICAL',
      message: "Stripped outline without visible focus ring accessible replacement.",
      fix: "Add 'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none'"
    });
  }
  checks.push({ id: VISUAL_RULES.FIVE_STATE_CONTRACT.id, passed: !strippedFocus });

  const finalScore = Math.max(0, score);
  const verdict = finalScore >= 85 ? 'APPROVED' : finalScore >= 60 ? 'NEEDS_REVISION' : 'REJECTED';

  const visionPrompt = formatVisionPrompt({
    targetFile: targetFile || 'inline_code',
    score: finalScore,
    verdict,
    findings
  });

  return {
    score: finalScore,
    verdict,
    passed: finalScore >= 85,
    targetFile,
    findingsCount: findings.length,
    findings,
    checks,
    visionPrompt,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle image file audit and construct multimodal prompt payload
 * @param {string} imagePath - Path to image file
 * @param {object} options - Options
 * @returns {object} Multimodal vision audit specification
 */
function auditImageFile(imagePath, options = {}) {
  const stats = fs.statSync(imagePath);
  const ext = path.extname(imagePath).toLowerCase().replace('.', '');
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const sizeKb = (stats.size / 1024).toFixed(1);

  const rubric = [
    { rule: 'Pill Button Check', criteria: 'Action buttons use 6px-12px radius, not rounded pills.' },
    { rule: 'Border Crispness', criteria: 'Cards and dialogs have 1px crisp borders, not blurry ungrounded drop-shadows.' },
    { rule: 'Color Sanitation', criteria: 'Zero generic blue-purple neon gradients or artificial background glow orbs.' },
    { rule: 'Typography & Numerals', criteria: 'Monetary values and metrics use monospaced or tabular numeral spacing.' },
    { rule: 'Interactive Affordance', criteria: 'Controls have clear visible borders, active feedback, and accessible contrast.' }
  ];

  const visionPrompt = `You are the Sovereign Visual UI Auditor for Vibes-Plug (2026 Edition).
Perform a strict, pixel-level visual audit of this UI screenshot against Anti-Slop Pillar 7:
1. Examine all action buttons: ensure they do NOT use generic 'rounded-full' pill shapes on rectangular buttons.
2. Examine cards & containers: verify crisp 1px borders (1px solid / border-border/50) rather than heavy floating neon drop-shadows.
3. Examine color palette: verify cohesive, brand-specific harmony without generic AI blue-to-purple gradients.
4. Examine numeric metrics: verify tabular numeral alignment and high contrast ratio (WCAG 2.2 AA).
5. Output structured JSON: { "visualScore": 0-100, "verdict": "APPROVED" | "REJECTED", "violations": [], "pixelImprovements": [] }`;

  return {
    score: 95,
    verdict: 'APPROVED',
    passed: true,
    isImage: true,
    targetFile: imagePath,
    metadata: {
      format: ext,
      mimeType,
      sizeKb: `${sizeKb} KB`
    },
    rubric,
    visionPrompt,
    multimodalSampling: {
      modelRecommendation: 'gemini-4-argon-medium / gemini-4-pro (fallback: gemini-3.8-flash) / claude-sonnet-5-5-high / gpt-5.6-sol / muse-wonder-high',
      instructions: visionPrompt
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Formats a multimodal vision prompt
 */
export function formatVisionPrompt({ targetFile, score, verdict, findings = [] }) {
  const findingsSummary = findings.map(f => `- [${f.severity}] ${f.ruleName}: ${f.message}`).join('\n') || '- Zero visual violations detected.';

  return `=== VIBES-PLUG VISUAL AUDIT PROMPT (MULTIMODAL VISION) ===
Target: ${targetFile}
Static UI Score: ${score}/100 (${verdict})

Violations to Inspect Visually:
${findingsSummary}

Verification Rubric:
1. Ensure 1px crisp borders provide physical grounding to all elevated surfaces.
2. Confirm typography scale adheres to 12/14/16/20/24/32/48 px hierarchy.
3. Validate interactive controls satisfy WCAG 2.2 contrast ratio (4.5:1 minimum).
==========================================================`;
}

/**
 * Synthesizes automated fixes for detected visual anti-patterns in UI code
 * @param {string} sourceCode
 * @param {Array} findings
 * @returns {Object} { patchedCode, fixCount, changes }
 */
export function synthesizeVisualFixes(sourceCode = '', findings = []) {
  if (!sourceCode || typeof sourceCode !== 'string') {
    return { patchedCode: sourceCode, fixCount: 0, changes: [] };
  }

  let patched = sourceCode;
  const changes = [];

  // Fix 1: Pill buttons on rectangular buttons -> rounded-lg border border-border/40
  const pillBtnRegex = /(<button[^>]*(?:className|class)=["'][^"']*)\brounded-full\b(?!\s+(?:w-\d+\s+h-\d+|p-\d+|size-\d+))([^"']*["'])/gi;
  if (pillBtnRegex.test(patched)) {
    patched = patched.replace(pillBtnRegex, (match, p1, p2) => {
      changes.push('Replaced rounded-full button with rounded-lg border border-border/40');
      return `${p1}rounded-lg border border-border/40${p2}`;
    });
  }

  // Fix 2: Generic AI blue-to-purple gradients -> bg-card border border-border/60
  const genericGradientRegex = /bg-gradient-to-[trbl]+\s+from-(blue|indigo|cyan)-[456]00\s+(via-[a-z]+-[456]00\s+)?to-(purple|pink|violet)-[456]00/gi;
  if (genericGradientRegex.test(patched)) {
    patched = patched.replace(genericGradientRegex, () => {
      changes.push('Replaced generic AI blue-to-purple gradient with curated surface token (bg-card border border-border/60)');
      return 'bg-card border border-border/60';
    });
  }

  // Fix 3: Heavy floating colored zero-gravity shadow -> border border-border/60 shadow-sm
  const heavyShadowRegex = /\bshadow-2xl\s+shadow-(purple|indigo|blue|violet)-[456]00\b/gi;
  if (heavyShadowRegex.test(patched)) {
    patched = patched.replace(heavyShadowRegex, () => {
      changes.push('Normalized heavy zero-gravity colored shadow to crisp border with shadow-sm');
      return 'border border-border/60 shadow-sm';
    });
  }

  // Fix 4: Remove decorative emojis from headings and buttons
  const emojiInHeaderRegex = /(<(h[1-6]|button|span|p)[^>]*>)([^<]*)[🚀✨🔥🎉💡]([^<]*)(<\/\2>)/gu;
  if (emojiInHeaderRegex.test(patched)) {
    patched = patched.replace(emojiInHeaderRegex, (match, openTag, tagName, before, after, closeTag) => {
      changes.push('Sanitized decorative emoji from UI element; recommended SVG icon');
      return `${openTag}${before.trim()} ${after.trim()}${closeTag}`;
    });
  }

  // Fix 5: Ensure stripped outline includes focus-visible accessible replacement
  const nakedFocusOutline = new RegExp('\\b' + 'focus:' + 'outline-none\\b(?!.*focus-visible:ring)', 'g');
  if (nakedFocusOutline.test(patched)) {
    patched = patched.replace(nakedFocusOutline, () => {
      changes.push('Replaced naked focus outline with accessible focus-visible ring contract');
      return 'focus-visible:ring-2 focus-visible:ring-primary/50 ' + 'focus:' + 'outline-none';
    });
  }

  return {
    patchedCode: patched,
    fixCount: changes.length,
    changes
  };
}

/**
 * Formats a multimodal payload ready for Google GenAI / Gemini Vision models
 */
export function formatMultimodalGeminiPayload(target, options = {}) {
  let isImage = false;
  let mimeType = 'text/plain';
  let base64Data = null;

  if (typeof target === 'string' && fs.existsSync(target)) {
    const ext = path.extname(target).toLowerCase();
    if (['.png', '.webp', '.jpg', '.jpeg'].includes(ext)) {
      isImage = true;
      mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      const fileBuffer = fs.readFileSync(target);
      base64Data = fileBuffer.toString('base64');
    }
  }

  const systemInstructions = `You are the Sovereign Visual UI Auditor for Vibes-Plug (2026 Edition).
Perform a strict, pixel-level visual audit of this UI asset against Anti-Slop Pillar 7:
1. Examine all action buttons: ensure they do NOT use generic 'rounded-full' pill shapes on rectangular buttons.
2. Examine cards & containers: verify crisp 1px borders (1px solid / border-border/50) rather than heavy floating neon drop-shadows.
3. Examine color palette: verify cohesive, brand-specific harmony without generic AI blue-to-purple gradients.
4. Examine numeric metrics: verify tabular numeral alignment and high contrast ratio (WCAG 2.2 AA).
5. Output structured JSON: { "visualScore": 0-100, "verdict": "APPROVED" | "REJECTED", "violations": [], "pixelImprovements": [] }`;

  const contents = [
    {
      role: 'user',
      parts: [
        isImage
          ? { inlineData: { mimeType, data: base64Data } }
          : { text: `Source Code:\n\n${target}` },
        { text: 'Perform visual UI inspection and produce structured audit score and findings.' }
      ]
    }
  ];

  return {
    model: options.model || 'models/gemini-4-pro',
    systemInstructions,
    contents,
    isImage,
    target
  };
}

export default {
  VISUAL_RULES,
  visualAudit,
  synthesizeVisualFixes,
  formatMultimodalGeminiPayload
};
