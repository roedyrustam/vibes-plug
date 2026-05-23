---
name: senior-frontend
description: Frontend development skill for React 19, Next.js 15, TypeScript, and Tailwind CSS v4 applications. Use when building React components, optimizing Next.js performance, analyzing bundle sizes, scaffolding frontend projects, implementing accessibility, or reviewing frontend code quality.
author: "Roedy Rustam"
github: "https://github.com/roedyrustam/vibes-plug"
risk: safe
source: https://github.com/alirezarezvani/claude-skills
date_added: "2026-03-07"
---

# Senior Frontend

Frontend development patterns, performance optimization, and automation tools for React 19 / Next.js 15 applications with Tailwind CSS v4 and TypeScript.

## When to Use
- Use when scaffolding a new React or Next.js 15 project with TypeScript and Tailwind CSS v4.
- Use when generating new components, custom hooks, or Server Actions.
- Use when analyzing and optimizing bundle sizes for frontend applications.
- Use to implement or review advanced React 19 patterns (Compound Components, `useActionState`, `useOptimistic`).
- Use to ensure accessibility compliance and implement robust testing strategies.
- Use when setting up Turbopack for lightning-fast dev server HMR.

## Table of Contents

- [Project Scaffolding](#project-scaffolding)
- [Component Generation](#component-generation)
- [Bundle Analysis](#bundle-analysis)
- [React Patterns](#react-patterns)
- [Next.js 15 Optimization](#nextjs-15-optimization)
- [React 19 Patterns](#react-19-patterns)
- [Accessibility and Testing](#accessibility-and-testing)

---

## Project Scaffolding

Generate a new Next.js 15 or React 19 project with TypeScript, Tailwind CSS v4, and best practice configurations.

### Workflow: Create New Frontend Project

1. Run the scaffolder with your project name and template:

   ```bash
   python scripts/frontend_scaffolder.py my-app --template nextjs
   ```

2. Add optional features (auth, api, forms, testing, storybook):

   ```bash
   python scripts/frontend_scaffolder.py dashboard --template nextjs --features auth,api
   ```

3. Navigate to the project and install dependencies:

   ```bash
   cd my-app && npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Scaffolder Options

| Option               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `--template nextjs`  | Next.js 15 with App Router, Turbopack, and RSC    |
| `--template react`   | React 19 + Vite with TypeScript                   |
| `--features auth`    | Add Clerk or Auth.js authentication               |
| `--features api`     | Add TanStack Query v5 + API client                |
| `--features forms`   | Add React Hook Form + Zod validation              |
| `--features testing` | Add Vitest + Testing Library + Playwright          |
| `--features ai`      | Add Vercel AI SDK with streaming chat              |
| `--dry-run`          | Preview files without creating them               |

### Generated Structure (Next.js 15)

```
my-app/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   ├── globals.css         # Tailwind CSS v4 (CSS-first config)
│   ├── actions/            # Server Actions (Zod-validated mutations)
│   └── api/health/route.ts
├── components/
│   ├── ui/                 # shadcn/ui: Button, Input, Card
│   └── layout/             # Header, Footer, Sidebar
├── hooks/                  # useDebounce, useLocalStorage, useMediaQuery
├── lib/                    # utils (cn), constants, db client
├── types/                  # TypeScript interfaces & Zod schemas
├── next.config.ts          # Next.js 15 config (TypeScript)
└── package.json
```

---

## Component Generation

Generate React components with TypeScript, tests, and Storybook stories.

### Workflow: Create a New Component

1. Generate a client component:

   ```bash
   python scripts/component_generator.py Button --dir src/components/ui
   ```

2. Generate a server component:

   ```bash
   python scripts/component_generator.py ProductCard --type server
   ```

3. Generate with test and story files:

   ```bash
   python scripts/component_generator.py UserProfile --with-test --with-story
   ```

4. Generate a custom hook:
   ```bash
   python scripts/component_generator.py FormValidation --type hook
   ```

### Generator Options

| Option          | Description                                  |
| --------------- | -------------------------------------------- |
| `--type client` | Client component with 'use client' (default) |
| `--type server` | Async server component                       |
| `--type hook`   | Custom React hook                            |
| `--with-test`   | Include test file                            |
| `--with-story`  | Include Storybook story                      |
| `--flat`        | Create in output dir without subdirectory    |
| `--dry-run`     | Preview without creating files               |

### Generated Component Example

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Button({ className, children }: ButtonProps) {
  return <div className={cn("", className)}>{children}</div>;
}
```

---

## Bundle Analysis

Analyze package.json and project structure for bundle optimization opportunities.

### Workflow: Optimize Bundle Size

1. Run the analyzer on your project:

   ```bash
   python scripts/bundle_analyzer.py /path/to/project
   ```

2. Review the health score and issues:

   ```
   Bundle Health Score: 75/100 (C)

   HEAVY DEPENDENCIES:
     moment (290KB)
       Alternative: date-fns (12KB) or dayjs (2KB)

     lodash (71KB)
       Alternative: lodash-es with tree-shaking
   ```

3. Apply the recommended fixes by replacing heavy dependencies.

4. Re-run with verbose mode to check import patterns:
   ```bash
   python scripts/bundle_analyzer.py . --verbose
   ```

### Bundle Score Interpretation

| Score  | Grade | Action                         |
| ------ | ----- | ------------------------------ |
| 90-100 | A     | Bundle is well-optimized       |
| 80-89  | B     | Minor optimizations available  |
| 70-79  | C     | Replace heavy dependencies     |
| 60-69  | D     | Multiple issues need attention |
| 0-59   | F     | Critical bundle size problems  |

### Heavy Dependencies Detected

The analyzer identifies these common heavy packages:

| Package       | Size  | Alternative                    |
| ------------- | ----- | ------------------------------ |
| moment        | 290KB | date-fns (12KB) or dayjs (2KB) |
| lodash        | 71KB  | lodash-es with tree-shaking    |
| axios         | 14KB  | Native fetch or ky (3KB)       |
| jquery        | 87KB  | Native DOM APIs                |
| @mui/material | Large | shadcn/ui or Radix UI          |

---

## React Patterns

Reference: `references/react_patterns.md`

### Compound Components

Share state between related components:

```tsx
const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.List = TabList;
Tabs.Panel = TabPanel;

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab>One</Tabs.Tab>
    <Tabs.Tab>Two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content 1</Tabs.Panel>
  <Tabs.Panel>Content 2</Tabs.Panel>
</Tabs>;
```

### Custom Hooks

Extract reusable logic:

```tsx
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 300);
```

### Render Props

Share rendering logic:

```tsx
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);

  return render({ data, loading });
}

// Usage
<DataFetcher
  url="/api/users"
  render={({ data, loading }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
/>;
```

---

## Next.js 15 Optimization

Reference: `references/nextjs_optimization_guide.md`

### Server vs Client Components

Use Server Components by default. Add `'use client'` only when you need:

- Event handlers (onClick, onChange)
- State (useState, useReducer)
- Effects (useEffect)
- Browser APIs

```tsx
// Server Component (default) - no 'use client'
async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next.js 15: params is async
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} /> {/* Client component */}
    </div>
  );
}

// Client Component
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [adding, setAdding] = useState(false);
  return <button onClick={() => addToCart(productId)}>Add</button>;
}
```

### Image Optimization

```tsx
import Image from 'next/image';

// Above the fold - load immediately
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>

// Responsive image with fill
<div className="relative aspect-video">
  <Image
    src="/product.jpg"
    alt="Product"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>
```

### Data Fetching Patterns

```tsx
// Parallel fetching
async function Dashboard() {
  const [user, stats] = await Promise.all([getUser(), getStats()]);
  return <div>...</div>;
}

// Streaming with Suspense
async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={id} />
      </Suspense>
    </div>
  );
}
```

---

## React 19 Patterns

React 19 introduces new primitives for handling form mutations, optimistic UI updates, and async transitions.

### Server Actions with `useActionState`

```tsx
'use client';

import { useActionState } from 'react';
import { createWorkspace } from '@/app/actions/workspace';

function CreateWorkspaceForm() {
  const [state, formAction, isPending] = useActionState(createWorkspace, null);

  return (
    <form action={formAction}>
      <input
        name="name"
        placeholder="Workspace name"
        disabled={isPending}
        className="border rounded px-3 py-2"
      />
      <input
        name="slug"
        placeholder="URL slug"
        disabled={isPending}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? 'Creating...' : 'Create Workspace'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

### Optimistic UI with `useOptimistic`

```tsx
'use client';

import { useOptimistic } from 'react';
import { toggleLike } from '@/app/actions/likes';

function LikeButton({ liked, count }: { liked: boolean; count: number }) {
  const [optimisticState, setOptimistic] = useOptimistic(
    { liked, count },
    (current, _action: boolean) => ({
      liked: !current.liked,
      count: current.liked ? current.count - 1 : current.count + 1,
    })
  );

  async function handleToggle() {
    setOptimistic(!optimisticState.liked);
    await toggleLike();
  }

  return (
    <button onClick={handleToggle}>
      {optimisticState.liked ? '❤️' : '🤍'} {optimisticState.count}
    </button>
  );
}
```

### Form Status with `useFormStatus`

```tsx
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-blue-600 text-white px-4 py-2 rounded">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage inside a <form> with a Server Action
<form action={createPost}>
  <textarea name="content" required />
  <SubmitButton />
</form>
```

---

## Accessibility and Testing

Reference: `references/frontend_best_practices.md`

### Accessibility Checklist

1. **Semantic HTML**: Use proper elements (`<button>`, `<nav>`, `<main>`)
2. **Keyboard Navigation**: All interactive elements focusable
3. **ARIA Labels**: Provide labels for icons and complex widgets
4. **Color Contrast**: Minimum 4.5:1 for normal text
5. **Focus Indicators**: Visible focus states

```tsx
// Accessible button
<button
  type="button"
  aria-label="Close dialog"
  onClick={onClose}
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
>
  <XIcon aria-hidden="true" />
</button>

// Skip link for keyboard users
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Testing Strategy

```tsx
// Component test with React Testing Library
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("button triggers action on click", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);

  await userEvent.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledTimes(1);
});

// Test accessibility
test("dialog is accessible", async () => {
  render(<Dialog open={true} title="Confirm" />);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby");
});
```

---

## Quick Reference

### Common Next.js 15 Config

```ts
// next.config.ts (TypeScript config in Next.js 15)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'cdn.example.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
};

export default nextConfig;
```

### Tailwind CSS v4 Utilities

Tailwind CSS v4 uses CSS-first configuration (`@theme` directive in CSS) instead of `tailwind.config.ts`.

```css
/* app/globals.css — Tailwind CSS v4 with CSS-first config */
@import 'tailwindcss';

@theme {
  --color-primary: oklch(0.55 0.22 260);
  --color-primary-hover: oklch(0.48 0.22 260);
  --color-surface: oklch(0.99 0 0);
  --color-muted: oklch(0.55 0.01 260);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --font-sans: 'Inter', sans-serif;
}
```

```tsx
// Conditional classes with cn()
import { cn } from '@/lib/utils';

<button
  className={cn(
    'px-4 py-2 rounded-md',
    variant === 'primary' && 'bg-primary text-white hover:bg-primary-hover',
    disabled && 'opacity-50 cursor-not-allowed',
  )}
/>;```

### TypeScript Patterns

```tsx
// Props with children
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

---

## Resources

- React Patterns: `references/react_patterns.md`
- Next.js 15 Optimization: `references/nextjs_optimization_guide.md`
- Best Practices: `references/frontend_best_practices.md`

## Troubleshooting

**Problem:** `params` or `searchParams` causing type errors in Next.js 15 page components  
**Solution:** In Next.js 15, `params` and `searchParams` are now `Promise`-based. Use `const { id } = await params;` instead of direct destructuring.

**Problem:** Tailwind CSS v4 custom classes not applying  
**Solution:** Tailwind v4 uses CSS-first configuration. Define custom theme tokens via `@theme { }` inside your CSS file, not `tailwind.config.ts`. The config file is no longer required.

**Problem:** `useFormStatus` returning `pending: false` when a Server Action is running  
**Solution:** `useFormStatus` must be rendered inside the `<form>` element whose `action` prop triggers the Server Action. It does not work if used in a parent component above the form.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
