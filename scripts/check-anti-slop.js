#!/usr/bin/env node
/**
 * scripts/check-anti-slop.js
 * Unified Entry-Point Bridge to scripts/check-anti-slop.mjs (Single Source of Truth)
 */

import('./check-anti-slop.mjs').catch((err) => {
  console.error(err);
  process.exit(1);
});
