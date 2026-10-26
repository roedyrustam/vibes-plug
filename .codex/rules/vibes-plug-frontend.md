# Vibes-Plug Frontend & UI Craftsmanship (Codex Edition)

When editing frontend components, user interfaces, or styling files, Codex MUST enforce these standards:

## 1. 5-State Interactive Contract
Every button, form control, navigation link, and interactive widget MUST define 5 explicit visual states:
1. `default`: Crisp 1px border (`border-border/50`), subtle background, legible contrast.
2. `hover`: Subtle brightness/surface shift (`hover:bg-muted/80`), immediate feedback.
3. `focus-visible`: High-contrast keyboard accessibility ring (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`).
4. `active`: Pressed-down scale or elevation (`active:scale-[0.98]` or `active:bg-muted`).
5. `disabled`: Unmistakable disabled visual (`disabled:opacity-50 disabled:pointer-events-none`).

## 2. Professional Visual Craft (Anti-Slop Pillar 7)
- **Banned Clichés**: No generic blue-purple neon gradients, no blurred neon glow balls, no stacked translucent glassmorphism cards.
- **Pill Button Ban**: Banned `rounded-full` on standard rectangular text buttons. Use intentional radius scale (`rounded-lg` or `rounded-md`).
- **Tabular Numerals**: MUST apply `tabular-nums` on all currencies, statistics, tables, and counters to eliminate layout jitter.

## 3. Tech Stack Conventions
- **React 19**: Use `useActionState`, `useOptimistic`, `use`, Server Actions. No unnecessary `useEffect`.
- **Next.js 15**: Async Request APIs (`await params`, `await searchParams`), 'use cache' directives, PPR.
- **Tailwind CSS v4**: CSS-first configuration via `@theme`, OKLCH color spaces.
- **Accessibility**: Semantic HTML (`<main>`, `<nav>`, `<article>`), WCAG 2.2 AA contrast, proper ARIA labels.
