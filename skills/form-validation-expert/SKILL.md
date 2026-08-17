---
name: form-validation-expert
description: "Expert guide for complex form handling with React Hook Form, server-side validation (useActionState + Zod), multi-step wizards, and accessible form patterns / Panduan ahli penanganan formulir kompleks dengan React Hook Form, validasi server-side, wizard multi-langkah, dan pola formulir aksesibel."
author: "vibes-plug-swarm"
---

# Form & Validation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Production-grade guide for building robust, accessible, and user-friendly forms. Covers **React Hook Form v7+** with Zod/Valibot resolvers, **server-side validation** with `useActionState` + Zod, **multi-step form wizards**, **dynamic forms** from JSON Schema, **autofill-friendly patterns**, **optimistic form submission** with `useOptimistic`, **Conform** (progressive enhancement), and **form accessibility** (ARIA, error announcements).

### Trigger Conditions
Activate this skill when:
- Building forms with client-side validation (React Hook Form, Zod, Valibot).
- Implementing server-side form validation with React 19 Server Actions.
- Creating multi-step form wizards with state persistence.
- Building dynamic forms generated from schema definitions.
- Making forms accessible (ARIA attributes, error announcements).
- Implementing file upload forms with drag-and-drop.
- Optimizing forms for autofill and mobile usability.

---

### Form Library Selection Guide

| Library | Best For | Key Strength |
|---|---|---|
| **React Hook Form + Zod** | Most React apps | Performance (uncontrolled), rich ecosystem |
| **Conform** | Progressive enhancement, RSC | Works without JS, native validation |
| **Formik** | Legacy projects | Mature, large community (declining) |
| **TanStack Form** | Complex, headless forms | Framework-agnostic, type-safe |

**Recommendation**: Use **React Hook Form + Zod** for most projects. Use **Conform** for Next.js Server Actions with progressive enhancement.

---

### 1. React Hook Form + Zod (Client-Side)

```tsx
// components/signup-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: SignupFormData) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Signup failed');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          autoComplete="name"
        />
        {errors.name && <p id="name-error" role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          autoComplete="new-password"
        />
        {errors.password && <p id="password-error" role="alert">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <p id="confirm-error" role="alert">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

---

### 2. Server Actions + useActionState (React 19 / Next.js 15)

```typescript
// actions/signup.ts
'use server';

import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignupState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function signupAction(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: 'Please fix the errors below.',
    };
  }

  // Check if email already exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });
  if (existing) {
    return { errors: { email: ['This email is already registered'] } };
  }

  // Create user
  await createUser(parsed.data);
  return { success: true, message: 'Account created!' };
}
```

```tsx
// components/signup-form-server.tsx
'use client';

import { useActionState } from 'react';
import { signupAction, type SignupState } from '@/actions/signup';

export function SignupFormServer() {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signupAction,
    {},
  );

  return (
    <form action={formAction}>
      {state.message && (
        <div role="alert" className={state.success ? 'success' : 'error'}>
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required autoComplete="name" />
        {state.errors?.name && <p role="alert">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        {state.errors?.email && <p role="alert">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
        {state.errors?.password && <p role="alert">{state.errors.password[0]}</p>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

---

### 3. Multi-Step Form Wizard

```tsx
// components/multi-step-form.tsx
'use client';

import { useState, useCallback } from 'react';
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Step schemas
const step1Schema = z.object({
  companyName: z.string().min(1, 'Required'),
  industry: z.string().min(1, 'Required'),
});

const step2Schema = z.object({
  contactName: z.string().min(1, 'Required'),
  contactEmail: z.string().email(),
});

const step3Schema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annual']),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FormData = z.infer<typeof fullSchema>;

const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema] as const;
const STEP_TITLES = ['Company Info', 'Contact Details', 'Choose Plan'] as const;

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
  });

  const goNext = useCallback(async () => {
    const schema = STEP_SCHEMAS[currentStep];
    const fields = Object.keys(schema.shape) as (keyof FormData)[];
    const isValid = await methods.trigger(fields);
    if (isValid) setCurrentStep(s => Math.min(s + 1, STEP_SCHEMAS.length - 1));
  }, [currentStep, methods]);

  const goBack = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, 0));
  }, []);

  const onSubmit = async (data: FormData) => {
    await fetch('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <FormProvider {...methods}>
      {/* Progress indicator */}
      <nav aria-label="Form progress">
        <ol className="step-progress">
          {STEP_TITLES.map((title, i) => (
            <li key={i} className={i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}>
              {title}
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {currentStep === 0 && <Step1 />}
        {currentStep === 1 && <Step2 />}
        {currentStep === 2 && <Step3 />}

        <div className="button-group">
          {currentStep > 0 && <button type="button" onClick={goBack}>Back</button>}
          {currentStep < STEP_SCHEMAS.length - 1
            ? <button type="button" onClick={goNext}>Next</button>
            : <button type="submit">Submit</button>
          }
        </div>
      </form>
    </FormProvider>
  );
}
```

---

### 4. Form Accessibility Checklist

| Requirement | Implementation |
|---|---|
| **Labels** | Every input has a visible `<label>` with `htmlFor` matching input `id` |
| **Error identification** | `aria-invalid="true"` on invalid fields |
| **Error description** | `aria-describedby` pointing to error message element |
| **Error announcement** | Error messages use `role="alert"` for screen readers |
| **Required fields** | Use `aria-required="true"` or native `required` attribute |
| **Autofill** | Correct `autoComplete` values (`name`, `email`, `new-password`) |
| **Focus management** | Focus moves to first error on submit failure |
| **Submit state** | Button shows loading state and is disabled during submission |

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Validating only on submit | Late error discovery, poor UX | Validate `onBlur` or `onChange` |
| Client-side validation only | Can be bypassed | Always validate server-side too |
| No `autoComplete` attributes | Misses browser autofill | Add correct `autoComplete` values |
| Generic error messages | "Invalid field" doesn't help | Specific: "Must be at least 8 characters" |
| Resetting form on error | User loses all input | Preserve input, highlight errors |
| No loading state on submit | User clicks multiple times | Disable button + show spinner |

---

### Integration with Other Skills

- `senior-frontend` — React 19 form patterns, useActionState, useOptimistic
- `global-a11y-i18n-expert` — WCAG 2.2 form accessibility requirements
- `ui-components-expert` — Input control primitives, form field components
- `authentication-identity-expert` — Login/signup form patterns
- `error-resilience-expert` — Form submission error handling and retry
- `tailwind-expert` — Form styling with Tailwind CSS v4

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan tingkat produksi untuk membangun formulir yang kuat, aksesibel, dan ramah pengguna. Mencakup **React Hook Form v7+** dengan Zod/Valibot resolver, **validasi server-side** dengan `useActionState` + Zod, **wizard formulir multi-langkah**, **formulir dinamis** dari JSON Schema, **pola autofill-friendly**, **optimistic form submission**, **Conform** (progressive enhancement), dan **aksesibilitas formulir** (ARIA, pengumuman error).

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Membangun formulir dengan validasi client-side (React Hook Form, Zod, Valibot).
- Mengimplementasikan validasi formulir server-side dengan React 19 Server Actions.
- Membuat wizard formulir multi-langkah dengan persistensi state.
- Membangun formulir dinamis dari definisi skema.
- Membuat formulir yang aksesibel (atribut ARIA, pengumuman error).

### Integrasi dengan Skill Lain

- `senior-frontend` — Pola formulir React 19, useActionState, useOptimistic
- `global-a11y-i18n-expert` — Persyaratan aksesibilitas formulir WCAG 2.2
- `ui-components-expert` — Primitif kontrol input, komponen field formulir
- `authentication-identity-expert` — Pola formulir login/signup
- `error-resilience-expert` — Penanganan error submission formulir dan retry
