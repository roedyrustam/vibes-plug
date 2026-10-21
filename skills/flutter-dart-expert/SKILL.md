---
name: flutter-dart-expert
description: "Expert guide for Flutter 3.27+ and Dart 3.7+ cross-platform development. Covers Material 3 adaptive theming, Riverpod 3, go_router, Impeller rendering, platform channels, and Firebase/Supabase integration / Panduan ahli pengembangan lintas platform Flutter 3.27+ dan Dart 3.7+."
author: "Roedy Rustam"
version: "4.4.2"
---

# Flutter & Dart Expert (Flutter 3.27 / Dart 3.7 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects with: `brainstorming`, `zero-to-prod-orchestrator`, `design-system-architect`, `ui-ux-pro-max`, `visual-ui-auditor`, `anti-slop`, `database-orm-expert`, `authentication-identity-expert`, `firebase-security-expert`, `ci-cd-devops-architect`, `e2e-testing-expert`, `apple-ecosystem-expert`, `session-memory-manager`.

### Description
Expert guide for building production-grade cross-platform applications using **Flutter 3.27+** and **Dart 3.7+**. Covers Material 3 adaptive theming, Riverpod 3 state management, go_router declarative navigation, Impeller rendering engine, platform channels, custom render objects, and Firebase/Supabase backend integration for iOS, Android, Web, macOS, Windows, and Linux targets.

### Trigger Conditions
- Building a new Flutter/Dart cross-platform application (mobile, web, desktop).
- Using **Riverpod 3** for state management with code generation.
- Implementing **Material 3** adaptive design with `ColorScheme.fromSeed`.
- Setting up **go_router** declarative navigation with typed routes.
- Writing **platform channels** (MethodChannel/EventChannel) or FFI.
- Integrating Flutter with Firebase, Supabase, or custom REST/GraphQL APIs.
- Optimizing rendering performance with **Impeller** (default engine).
- Building Flutter plugins or packages for pub.dev.

### What's New in 2026

#### Dart 3.7 — Language Improvements
- **Static Metaprogramming (Macros)**: Compile-time code generation for JSON serialization, data classes, and ORM models without build_runner.
- **Pattern Matching Enhancements**: Exhaustive switch expressions with sealed class hierarchies.
- **Extension Types (Stable)**: Zero-cost wrappers for type safety without runtime overhead.
- **Enhanced Enums**: Enum members with fields, methods, and interface implementations.

#### Flutter 3.27 — Framework Updates
- **Impeller (Default)**: Hardware-accelerated rendering engine — eliminates shader compilation jank on iOS, Android, and desktop.
- **Material 3 Complete**: Full M3 component set with adaptive layouts for mobile/tablet/desktop.
- **Platform Views v2**: Improved hybrid composition for embedding native views (maps, ads, WebView).
- **DevTools 2026**: Enhanced performance profiling, widget inspector, and memory analysis.
- **WebAssembly (Stable)**: Flutter web compiled to Wasm for near-native performance.
- **Dart-only Packages**: Build backend APIs with `dart_frog` or `shelf` using the same Dart codebase.

### Core Architecture Patterns

#### 1. Project Setup (Flutter 3.27 + Material 3)
```bash
# Create new Flutter project with all platforms
flutter create --platforms=android,ios,web,macos,windows,linux my_app
cd my_app

# Add core dependencies
flutter pub add flutter_riverpod riverpod_annotation
flutter pub add go_router
flutter pub add freezed_annotation json_annotation
flutter pub add dev:riverpod_generator dev:build_runner dev:freezed dev:json_serializable
```

#### 2. Material 3 Adaptive Theming
```dart
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF1A73E8),
      brightness: Brightness.light,
    ),
    typography: Typography.material2021(),
    visualDensity: VisualDensity.adaptivePlatformDensity,
  );

  static ThemeData dark() => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF1A73E8),
      brightness: Brightness.dark,
    ),
    typography: Typography.material2021(),
    visualDensity: VisualDensity.adaptivePlatformDensity,
  );
}
```

#### 3. Riverpod 3 State Management (Code Generation)
```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'user_provider.g.dart';

@riverpod
class UserNotifier extends _$UserNotifier {
  @override
  FutureOr<User?> build() async {
    return await ref.watch(authRepositoryProvider).getCurrentUser();
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(authRepositoryProvider).signIn(email, password),
    );
  }
}

@riverpod
Future<List<Product>> products(ProductsRef ref, {required String category}) async {
  final repo = ref.watch(productRepositoryProvider);
  return repo.getByCategory(category);
}
```

#### 4. go_router Declarative Navigation
```dart
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final isLoginRoute = state.matchedLocation == '/login';
      if (!isLoggedIn && !isLoginRoute) return '/login';
      if (isLoggedIn && isLoginRoute) return '/';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      ShellRoute(
        builder: (_, __, child) => AppShell(child: child),
        routes: [
          GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
          GoRoute(
            path: '/products/:id',
            builder: (_, state) => ProductScreen(
              id: state.pathParameters['id']!,
            ),
          ),
        ],
      ),
    ],
  );
});
```

#### 5. Freezed Data Classes & JSON Serialization
```dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'product.freezed.dart';
part 'product.g.dart';

@freezed
class Product with _$Product {
  const factory Product({
    required String id,
    required String name,
    required double price,
    @Default('') String description,
    @Default([]) List<String> imageUrls,
    required DateTime createdAt,
  }) = _Product;

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
}
```

#### 6. Platform Channels (Native Interop)
```dart
// Dart side
class BatteryService {
  static const _channel = MethodChannel('com.app/battery');

  Future<int> getBatteryLevel() async {
    final level = await _channel.invokeMethod<int>('getBatteryLevel');
    return level ?? -1;
  }
}

// Kotlin side (Android)
class BatteryPlugin : MethodCallHandler {
  override fun onMethodCall(call: MethodCall, result: Result) {
    if (call.method == "getBatteryLevel") {
      val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
      val level = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
      result.success(level)
    } else {
      result.notImplemented()
    }
  }
}
```

#### 7. Performance Best Practices
- **Impeller Engine**: Default in Flutter 3.27 — eliminates shader compilation jank. No action needed.
- **const constructors**: Mark widgets `const` wherever possible to skip rebuilds.
- **RepaintBoundary**: Isolate expensive paint operations.
- **ListView.builder**: Always use builder constructors for large lists.
- **Image caching**: Use `cached_network_image` with `CachedNetworkImageProvider`.
- **Isolates**: Use `Isolate.run()` for CPU-intensive work (JSON parsing, image processing).
- **DevTools profiling**: Monitor frame rendering, memory allocation, and widget rebuilds.

#### 8. Testing Strategy
```dart
// Unit test with Riverpod
void main() {
  test('UserNotifier signs in successfully', () async {
    final container = ProviderContainer(
      overrides: [
        authRepositoryProvider.overrideWithValue(MockAuthRepository()),
      ],
    );
    final notifier = container.read(userNotifierProvider.notifier);
    await notifier.signIn('test@example.com', 'password');
    expect(container.read(userNotifierProvider).value, isNotNull);
  });
}

// Widget test
testWidgets('ProductCard displays name and price', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(home: ProductCard(product: testProduct)),
    ),
  );
  expect(find.text('Test Product'), findsOneWidget);
  expect(find.text('\$29.99'), findsOneWidget);
});

// Integration test
integration_test/app_test.dart:
  testWidgets('Full purchase flow', (tester) async {
    app.main();
    await tester.pumpAndSettle();
    await tester.tap(find.text('Products'));
    await tester.pumpAndSettle();
    expect(find.byType(HomeScreen), findsOneWidget);
  });
```

### Anti-Patterns to Avoid
1. **Using `setState` for complex state** — Use Riverpod 3 with code generation.
2. **Nested Navigator stacks** — Use go_router with ShellRoute for tab navigation.
3. **Heavy computation on main isolate** — Offload to `Isolate.run()`.
4. **Ignoring `const` constructors** — Causes unnecessary widget rebuilds.
5. **Using deprecated `Navigator.push`** — Migrate to go_router declarative navigation.
6. **Manual JSON serialization** — Use freezed + json_serializable with build_runner or Dart macros.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dengan: `brainstorming`, `zero-to-prod-orchestrator`, `design-system-architect`, `ui-ux-pro-max`, `visual-ui-auditor`, `anti-slop`, `database-orm-expert`, `authentication-identity-expert`, `firebase-security-expert`, `ci-cd-devops-architect`, `e2e-testing-expert`, `apple-ecosystem-expert`, `session-memory-manager`.

### Deskripsi
Panduan ahli untuk membangun aplikasi lintas platform tingkat produksi menggunakan **Flutter 3.27+** dan **Dart 3.7+**. Mencakup theming adaptif Material 3, state management Riverpod 3, navigasi deklaratif go_router, mesin rendering Impeller, platform channels, custom render objects, dan integrasi backend Firebase/Supabase untuk target iOS, Android, Web, macOS, Windows, dan Linux.

### Kondisi Pemicu
- Membangun aplikasi lintas platform Flutter/Dart baru (mobile, web, desktop).
- Menggunakan **Riverpod 3** untuk state management dengan code generation.
- Mengimplementasikan desain adaptif **Material 3** dengan `ColorScheme.fromSeed`.
- Menyiapkan navigasi deklaratif **go_router** dengan typed routes.
- Menulis **platform channels** (MethodChannel/EventChannel) atau FFI.
- Mengintegrasikan Flutter dengan Firebase, Supabase, atau API REST/GraphQL kustom.

### Pola Arsitektur Inti

#### 1. Struktur Folder Standar
```
lib/
├── main.dart                 # Entry point & ProviderScope
├── app/                      # Router & tema
│   ├── router.dart
│   └── theme.dart
├── features/                 # Fitur berbasis domain
│   ├── auth/
│   │   ├── data/             # Repository, data source
│   │   ├── domain/           # Model, entity
│   │   └── presentation/     # Screen, widget, provider
│   └── products/
│       ├── data/
│       ├── domain/
│       └── presentation/
├── shared/                   # Widget & utilitas bersama
│   ├── widgets/
│   └── utils/
└── core/                     # Konstanta, konfigurasi, DI
    ├── constants.dart
    └── providers.dart
```

#### 2. State Management dengan Riverpod 3
Gunakan `@riverpod` annotation untuk code generation otomatis. Pilihan provider:
- **`@riverpod`** (function): Untuk state sederhana, computed values, dan API calls.
- **`@riverpod` class**: Untuk state kompleks yang butuh methods (CRUD operations).
- **`AsyncNotifierProvider`**: Untuk state async dengan loading/error handling bawaan.

#### 3. Navigasi Deklaratif dengan go_router
Gunakan `GoRouter` dengan `ShellRoute` untuk navigasi tab, `redirect` untuk auth guards, dan `pathParameters` untuk deep linking.

#### 4. Praktik Terbaik Performa
- **Impeller Engine**: Default di Flutter 3.27 — menghilangkan shader jank.
- **`const` constructor**: Tandai widget `const` untuk menghindari rebuild yang tidak perlu.
- **`RepaintBoundary`**: Isolasi operasi paint mahal.
- **`ListView.builder`**: Selalu gunakan builder constructor untuk daftar panjang.
- **Isolates**: Gunakan `Isolate.run()` untuk komputasi berat (parsing JSON, pemrosesan gambar).

#### 5. Strategi Testing
- **Unit test**: Test provider dan repository dengan `ProviderContainer` overrides.
- **Widget test**: Test UI komponen secara isolasi dengan `testWidgets`.
- **Integration test**: Test alur pengguna lengkap dengan `integration_test` package.
