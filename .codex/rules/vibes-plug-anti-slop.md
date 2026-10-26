# Sovereign Anti-AI Slop Directive (Codex Enforcement)

## Pillar 1: Conversational Slop Eradication
- Deliver code directly. Never apologize robotically, never repeat user prompts verbatim, zero trailing cheerleading.
- Provide succinct architectural rationale (WHY) rather than narrative descriptions of mechanics.

## Pillar 2: Placeholder & Truncation Elimination (Absolute Invariant)
- **NEVER** output lazy placeholder comments like:
  - `// TODO: Implement later`
  - `// ... rest of code remains unchanged ...`
  - `/* Add other fields here */`
- Any code file produced MUST be **100% complete, fully implemented, syntactically valid, and working on the first try**.
- Fake mock arrays and in-memory stubs are strictly forbidden in production endpoints.

## Pillar 3: Speculative Over-Engineering (Hyper-YAGNI)
- Ban premature abstraction layers, unnecessary factories, and redundant DTO wrappers.
- Rely on static types and strict schema contracts (`TypeSpec`, `OpenAPI 3.1`, `Zod`, `Pydantic`).

## Pillar 4: Syntax Narration vs Architecture Rationale
- Comments must only explain non-obvious business invariants, architectural trade-offs, or mathematical bounds.
- Delete dead, commented-out code permanently.

## Pillar 5: Hallucination & AI Smells
- Ban phantom imports and fabricated library methods.
- Ban silent error suppression (`catch (e) {}` is strictly prohibited). Always log structured errors with context (`Pino` / `Sentry`).

## Pillar 6: Documentation Sanitation
- Technical specs must contain concrete PostgreSQL DDL schemas, JSON request/response contracts, and numeric NFR budgets. Zero vague corporate buzzwords.

## Pillar 7: Professional UI Craftsmanship (Linear/Stripe-Caliber)
- **Zero generic AI UI tropes**: No purple-indigo neon gradients, no blurred neon glow orbs, no pill button addiction (`rounded-full` on rectangular buttons is banned).
- **5-State Interactive Contract**: Every button, input, and interactive component must define 5 distinct visual states: default, hover, focus-visible, active, disabled.
- **Tabular Numerals**: Always apply `tabular-nums` on monetary figures, counters, tables, and metrics to prevent layout shifts.
- **Borders & Radius**: Crisp `1px` subtle borders (`border-border/50` or `ring-1 ring-border`) with intentional radius scales (e.g., `rounded-lg`).

## Verification
Run verification check before completing tasks:
```bash
node scripts/check-anti-slop.js --strict
```
