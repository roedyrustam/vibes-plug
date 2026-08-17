---
name: angular-expert
description: "Expert guide for Angular 19+ enterprise applications — Signals, Standalone Components, NgRx SignalStore, SSR with Hydration, and Angular Material 3 / Panduan ahli aplikasi enterprise Angular 19+."
author: "vibes-plug-swarm"
---

# Angular Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`typescript-expert`**: Strict TypeScript typing and decorators in Angular 19+.
- **`api-design-expert`**: REST and GraphQL client architecture with Angular `HttpClient`.
- **`e2e-testing-expert`**: Playwright and Cypress end-to-end testing for Angular apps.
- **`global-a11y-i18n-expert`**: Angular localized translations (`@angular/localize`) and accessibility compliance.
- **`ci-cd-devops-architect`**: Dockerizing and deploying Angular SSR applications.

### Description
Production-ready guide for building scalable, enterprise-grade web applications using Angular 19+. Covers modern Standalone Components (NgModule-free), fine-grained Signals (`signal()`, `computed()`, `effect()`), Signal-based inputs/outputs, NgRx SignalStore, deferrable views (`@defer`), SSR with Event Replay hydration, and Angular Material 3.

### Trigger Conditions
- Building or refactoring enterprise-scale Angular applications.
- Migrating legacy Angular (NgModules / RxJS heavy) to Angular 19+ Standalone Components & Signals.
- Implementing state management with NgRx SignalStore.
- Configuring Angular SSR with hydration and deferrable views (`@defer`).

---

### Core Architecture & Modern Patterns

#### 1. Standalone Component with Signals & Signal Inputs
```typescript
import { Component, signal, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserItem {
  id: string;
  name: string;
  role: 'admin' | 'member';
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-card" [class.admin]="isAdmin()">
      <h3>{{ user().name }}</h3>
      <p>Role: {{ user().role }}</p>
      <button (click)="onRoleChange()">Promote</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  // Signal inputs & outputs (Angular 19+)
  user = input.required<UserItem>();
  roleUpdated = output<string>();

  isAdmin = computed(() => this.user().role === 'admin');

  onRoleChange() {
    this.roleUpdated.emit(this.user().id);
  }
}
```

#### 2. NgRx SignalStore
```typescript
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface ProductsState {
  products: Array<{ id: string; title: string; price: number }>;
  isLoading: boolean;
  filter: string;
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  filter: '',
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ products, filter }) => ({
    filteredProducts: computed(() =>
      products().filter((p) => p.title.toLowerCase().includes(filter().toLowerCase()))
    ),
    totalCount: computed(() => products().length),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    updateFilter(filter: string) {
      patchState(store, { filter });
    },
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          http.get<Array<{ id: string; title: string; price: number }>>('/api/products').pipe(
            tap((products) => patchState(store, { products, isLoading: false }))
          )
        )
      )
    ),
  }))
);
```

#### 3. Deferrable Views (`@defer`)
```html
@defer (on viewport; prefetch on idle) {
  <app-analytics-dashboard [data]="dashboardData()" />
} @placeholder {
  <div class="skeleton-loader">Loading analytics widget...</div>
} @error {
  <p>Failed to load analytics dashboard.</p>
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`typescript-expert`**: Penggunaan TypeScript ketat dan dekorator pada Angular 19+.
- **`api-design-expert`**: Arsitektur klien REST dan GraphQL dengan `HttpClient`.
- **`e2e-testing-expert`**: Pengujian end-to-end menggunakan Playwright atau Cypress.

### Deskripsi
Panduan produksi untuk membangun aplikasi web skala enterprise menggunakan Angular 19+. Mencakup Standalone Components tanpa NgModule, reaktivitas modern berbasis Signals, NgRx SignalStore, deferrable views (`@defer`), SSR dengan hidrasi Event Replay, dan integrasi Angular Material 3.

### Kondisi Pemicu
- Membangun atau merestrukturisasi aplikasi enterprise Angular.
- Migrasi Angular lama (berbasis NgModule/RxJS berat) ke Angular 19+ Standalone & Signals.
- Mengelola state aplikasi menggunakan NgRx SignalStore.
- Mengoptimalkan performa rendering dengan deferrable views dan SSR hydration.
