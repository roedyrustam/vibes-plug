# Vibes-Plug Testing & Verification Standards (Codex Edition)

When writing or executing tests, Codex MUST enforce these standards:

## 1. Autonomous TDD & Quality Gate
- **Test-First Execution**: When implementing new features, write failing tests first (Red), implement the minimum code to pass (Green), then refactor (Clean).
- **Zero Mocks in Production Logic**: Mocks are strictly confined to test fixtures. Never commit fake mocks or in-memory array stubs into production service code.
- **Determinism**: Eliminate flaky tests by utilizing deterministic clocks (`vi.useFakeTimers()` or Playwright Clock API) and avoiding non-deterministic `sleep()` intervals.
- **Coverage Criteria**: Test both the happy path and edge cases: invalid inputs, boundary values, permission denials, and network failure modes.
- **E2E Standards**: Use ARIA role selectors (`getByRole`, `getByLabel`) rather than brittle CSS or XPath selectors.
