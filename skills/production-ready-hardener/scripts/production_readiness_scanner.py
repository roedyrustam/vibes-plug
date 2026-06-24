#!/usr/bin/env python3
"""
Production Readiness Scanner
Automated scanner that runs all 7 phases of the Production-Ready Hardener
checklist against a target project.
"""

import os
import sys
import json
import argparse
import re
from pathlib import Path
from typing import Dict, List, Tuple


class ProductionReadinessScanner:
    """Scans a project for production readiness across 7 phases."""

    PHASE_WEIGHTS = {
        'architecture': 0.10,
        'frontend': 0.15,
        'backend': 0.15,
        'security': 0.25,
        'testing': 0.15,
        'performance': 0.10,
        'devops': 0.10,
    }

    def __init__(self, target_path: str, verbose: bool = False):
        self.target_path = Path(target_path)
        self.verbose = verbose
        self.phases: Dict[str, Dict] = {}
        self.overall_score = 0

    def run(self) -> Dict:
        """Execute the full production readiness scan."""
        print("🛡️  Production Readiness Scanner")
        print(f"📁 Target: {self.target_path}")
        print("=" * 60)

        if not self.target_path.exists():
            print(f"❌ Target path does not exist: {self.target_path}")
            sys.exit(1)

        # Run all 7 phases
        self._phase_1_architecture()
        self._phase_2_frontend()
        self._phase_3_backend()
        self._phase_4_security()
        self._phase_5_testing()
        self._phase_6_performance()
        self._phase_7_devops()

        # Calculate overall score
        self._calculate_overall_score()
        self._generate_report()

        return {
            'target': str(self.target_path),
            'overall_score': self.overall_score,
            'phases': self.phases,
        }

    def _init_phase(self, name: str, display_name: str) -> Dict:
        """Initialize a phase result structure."""
        phase = {
            'name': display_name,
            'score': 100,
            'checks': [],
            'critical': 0,
            'warnings': 0,
            'passed': 0,
        }
        self.phases[name] = phase
        if self.verbose:
            print(f"\n{'─' * 40}")
            print(f"📋 Phase: {display_name}")
            print(f"{'─' * 40}")
        return phase

    def _check(self, phase: Dict, name: str, passed: bool, severity: str = 'warning', penalty: int = 5):
        """Record a check result."""
        phase['checks'].append({
            'name': name,
            'passed': passed,
            'severity': severity,
        })
        if passed:
            phase['passed'] += 1
            if self.verbose:
                print(f"  ✅ {name}")
        else:
            if severity == 'critical':
                phase['critical'] += 1
                phase['score'] -= max(penalty, 15)
            else:
                phase['warnings'] += 1
                phase['score'] -= penalty
            phase['score'] = max(0, phase['score'])
            icon = '🔴' if severity == 'critical' else '🟡'
            if self.verbose:
                print(f"  {icon} {name}")

    def _file_exists(self, *paths: str) -> bool:
        """Check if any of the given file paths exist."""
        return any((self.target_path / p).exists() for p in paths)

    def _dir_exists(self, *paths: str) -> bool:
        """Check if any of the given directory paths exist."""
        return any((self.target_path / p).is_dir() for p in paths)

    def _file_contains(self, filepath: str, pattern: str) -> bool:
        """Check if a file contains a pattern."""
        fp = self.target_path / filepath
        if not fp.exists():
            return False
        try:
            return pattern in fp.read_text(errors='ignore')
        except (IOError, OSError):
            return False

    def _grep_project(self, pattern: str, extensions: List[str] = None) -> List[str]:
        """Search for a pattern in project files."""
        matches = []
        exts = extensions or ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs']
        for ext in exts:
            for f in self.target_path.rglob(f'*{ext}'):
                if 'node_modules' in str(f) or '.next' in str(f) or 'dist' in str(f):
                    continue
                try:
                    content = f.read_text(errors='ignore')
                    if re.search(pattern, content):
                        matches.append(str(f.relative_to(self.target_path)))
                except (IOError, OSError):
                    continue
        return matches

    # ─── PHASE 1: Architecture & Code Quality ───

    def _phase_1_architecture(self):
        phase = self._init_phase('architecture', 'Architecture & Code Quality')

        # Project structure
        self._check(phase, 'Has organized source directory (src/ or app/)',
                    self._dir_exists('src', 'app'))

        # TypeScript strict mode
        has_tsconfig = self._file_exists('tsconfig.json')
        strict_ts = self._file_contains('tsconfig.json', '"strict": true') if has_tsconfig else False
        self._check(phase, 'TypeScript strict mode enabled', strict_ts or not has_tsconfig)

        # Package.json exists
        self._check(phase, 'package.json exists', self._file_exists('package.json'))

        # No any types (basic check)
        any_matches = self._grep_project(r': any\b|as any\b', ['.ts', '.tsx'])
        self._check(phase, 'No TypeScript `any` types found',
                    len(any_matches) == 0, penalty=3)

        # .env.example exists
        self._check(phase, '.env.example documents required env vars',
                    self._file_exists('.env.example', '.env.template'))

        # Input validation library
        has_validation = False
        if self._file_exists('package.json'):
            try:
                pkg = json.loads((self.target_path / 'package.json').read_text())
                deps = {**pkg.get('dependencies', {}), **pkg.get('devDependencies', {})}
                has_validation = any(v in deps for v in ['zod', 'joi', 'yup', 'class-validator'])
            except (json.JSONDecodeError, IOError):
                pass
        self._check(phase, 'Input validation library installed (Zod/Joi/Yup)',
                    has_validation)

    # ─── PHASE 2: Frontend Hardening ───

    def _phase_2_frontend(self):
        phase = self._init_phase('frontend', 'Frontend Hardening')

        # Next.js or frontend framework
        has_frontend = self._file_exists(
            'next.config.js', 'next.config.ts', 'next.config.mjs',
            'vite.config.ts', 'vite.config.js', 'nuxt.config.ts',
        )
        self._check(phase, 'Frontend framework detected', has_frontend)

        if not has_frontend:
            return  # Skip frontend checks if no frontend

        # Error boundary
        error_files = self._grep_project(r'error\.(tsx?|jsx?)$|ErrorBoundary', ['.ts', '.tsx', '.js', '.jsx'])
        self._check(phase, 'Error boundaries implemented',
                    len(error_files) > 0)

        # Loading states / Suspense
        loading_files = self._grep_project(r'loading\.(tsx?|jsx?)$|Suspense|Skeleton', ['.ts', '.tsx', '.js', '.jsx'])
        self._check(phase, 'Loading states (Suspense/Skeleton) implemented',
                    len(loading_files) > 0)

        # Image optimization
        image_opt = self._grep_project(r'next/image|Image|loading="lazy"', ['.ts', '.tsx', '.js', '.jsx'])
        self._check(phase, 'Image optimization (next/image or lazy loading)',
                    len(image_opt) > 0)

        # Meta tags / SEO
        meta_tags = self._grep_project(r'metadata|generateMetadata|Head>|<title', ['.ts', '.tsx', '.js', '.jsx'])
        self._check(phase, 'SEO meta tags configured',
                    len(meta_tags) > 0)

    # ─── PHASE 3: Backend Hardening ───

    def _phase_3_backend(self):
        phase = self._init_phase('backend', 'Backend Hardening')

        # Database migrations
        has_migrations = self._dir_exists(
            'migrations', 'prisma/migrations', 'drizzle', 'alembic',
            'db/migrations', 'sql/migrations',
        )
        self._check(phase, 'Database migrations directory exists', has_migrations)

        # Health check endpoint
        health_files = self._grep_project(r'healthz|readyz|health.*check|/health', ['.ts', '.tsx', '.js', '.py', '.go', '.rs'])
        self._check(phase, 'Health check endpoints implemented',
                    len(health_files) > 0)

        # Structured logging
        logging_files = self._grep_project(r'pino|winston|structlog|slog|tracing::', ['.ts', '.js', '.py', '.go', '.rs'])
        self._check(phase, 'Structured logging configured',
                    len(logging_files) > 0, penalty=3)

        # Rate limiting
        rate_limit = self._grep_project(r'rate.?limit|rateLimit|throttle|limiter', ['.ts', '.js', '.py', '.go'])
        self._check(phase, 'Rate limiting configured',
                    len(rate_limit) > 0)

    # ─── PHASE 4: Security Hardening ───

    def _phase_4_security(self):
        phase = self._init_phase('security', 'Security Hardening')

        # .gitignore includes .env
        gitignore = self.target_path / '.gitignore'
        env_ignored = False
        if gitignore.exists():
            content = gitignore.read_text(errors='ignore')
            env_ignored = '.env' in content
        self._check(phase, '.env in .gitignore', env_ignored, severity='critical', penalty=20)

        # No hardcoded secrets
        secret_patterns = [
            r'sk_live_[a-zA-Z0-9]',
            r'sk_test_[a-zA-Z0-9]',
            r'password\s*[=:]\s*["\'][^"\']{8,}',
            r'api_key\s*[=:]\s*["\'][a-zA-Z0-9]',
        ]
        secret_matches = []
        for pattern in secret_patterns:
            matches = self._grep_project(pattern, ['.ts', '.tsx', '.js', '.jsx', '.py'])
            secret_matches.extend(matches)
        self._check(phase, 'No hardcoded secrets detected',
                    len(set(secret_matches)) == 0, severity='critical', penalty=25)

        # HTTPS / Security headers
        security_headers = self._grep_project(
            r'Strict-Transport-Security|Content-Security-Policy|X-Frame-Options',
            ['.ts', '.js', '.mjs']
        )
        self._check(phase, 'Security headers configured (HSTS, CSP)',
                    len(security_headers) > 0)

        # CORS configuration
        cors_files = self._grep_project(r'cors|Access-Control-Allow-Origin', ['.ts', '.js', '.py', '.go'])
        cors_wildcard = self._grep_project(r'origin:\s*["\']?\*["\']?|Access-Control-Allow-Origin.*\*', ['.ts', '.js', '.py', '.go'])
        if cors_files:
            self._check(phase, 'CORS does not use wildcard (*)',
                        len(cors_wildcard) == 0, severity='critical', penalty=15)

        # Authentication middleware
        auth_files = self._grep_project(
            r'clerkMiddleware|NextAuth|lucia|passport\.authenticate|auth\.protect|Firebase.*Auth',
            ['.ts', '.tsx', '.js', '.py']
        )
        self._check(phase, 'Authentication middleware configured',
                    len(auth_files) > 0)

        # SQL injection prevention (parameterized queries)
        raw_sql = self._grep_project(r'\.query\(\s*`|\.execute\(\s*f"|sql\s*=\s*f"', ['.ts', '.js', '.py'])
        self._check(phase, 'No raw SQL string interpolation detected',
                    len(raw_sql) == 0, severity='critical', penalty=20)

    # ─── PHASE 5: Testing & QA ───

    def _phase_5_testing(self):
        phase = self._init_phase('testing', 'Testing & Quality Assurance')

        # Test framework
        has_test_config = self._file_exists(
            'vitest.config.ts', 'vitest.config.js',
            'jest.config.ts', 'jest.config.js',
            'pytest.ini', 'conftest.py', 'setup.cfg',
        )
        has_test_dir = self._dir_exists('__tests__', 'tests', 'test', 'spec', 'e2e')
        self._check(phase, 'Testing framework configured',
                    has_test_config or has_test_dir)

        # E2E tests
        has_e2e = self._file_exists('playwright.config.ts', 'cypress.config.ts', 'cypress.config.js')
        has_e2e_dir = self._dir_exists('e2e', 'cypress')
        self._check(phase, 'E2E test framework configured (Playwright/Cypress)',
                    has_e2e or has_e2e_dir)

        # Lint configuration
        has_lint = self._file_exists(
            'eslint.config.js', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml',
            'biome.json', 'ruff.toml', 'pyproject.toml',
        )
        self._check(phase, 'Linting configured (ESLint/Biome/Ruff)',
                    has_lint)

        # Pre-commit hooks
        has_hooks = self._file_exists('.husky/pre-commit', '.pre-commit-config.yaml')
        self._check(phase, 'Pre-commit hooks configured (Husky/pre-commit)',
                    has_hooks, penalty=3)

    # ─── PHASE 6: Performance & SEO ───

    def _phase_6_performance(self):
        phase = self._init_phase('performance', 'Performance & SEO')

        # Sitemap
        has_sitemap = self._file_exists('public/sitemap.xml') or \
                      len(self._grep_project(r'sitemap', ['.ts', '.tsx', '.js'])) > 0
        self._check(phase, 'Sitemap configured', has_sitemap, penalty=3)

        # robots.txt
        self._check(phase, 'robots.txt exists',
                    self._file_exists('public/robots.txt'))

        # Bundle analyzer available
        if self._file_exists('package.json'):
            try:
                pkg = json.loads((self.target_path / 'package.json').read_text())
                deps = {**pkg.get('dependencies', {}), **pkg.get('devDependencies', {})}
                has_analyzer = '@next/bundle-analyzer' in deps or 'webpack-bundle-analyzer' in deps
                self._check(phase, 'Bundle analyzer available', has_analyzer, penalty=3)
            except (json.JSONDecodeError, IOError):
                pass

    # ─── PHASE 7: DevOps & Deployment ───

    def _phase_7_devops(self):
        phase = self._init_phase('devops', 'DevOps & Deployment')

        # CI/CD pipeline
        has_ci = self._dir_exists('.github/workflows') or \
                 self._file_exists('.gitlab-ci.yml', 'Jenkinsfile', '.circleci/config.yml')
        self._check(phase, 'CI/CD pipeline configured', has_ci)

        # Dockerfile
        has_docker = self._file_exists('Dockerfile')
        self._check(phase, 'Dockerfile exists', has_docker, penalty=5)

        if has_docker:
            # Multi-stage build
            try:
                dockerfile_content = (self.target_path / 'Dockerfile').read_text()
                multi_stage = dockerfile_content.count('FROM ') >= 2
                self._check(phase, 'Docker multi-stage build', multi_stage, penalty=3)

                # Non-root user
                has_user = 'USER ' in dockerfile_content or 'adduser' in dockerfile_content
                self._check(phase, 'Docker non-root user', has_user)

                # HEALTHCHECK
                has_healthcheck = 'HEALTHCHECK' in dockerfile_content
                self._check(phase, 'Docker HEALTHCHECK configured', has_healthcheck, penalty=3)
            except (IOError, OSError):
                pass

        # .dockerignore
        self._check(phase, '.dockerignore exists',
                    self._file_exists('.dockerignore'), penalty=3)

        # Documentation
        self._check(phase, 'README.md exists',
                    self._file_exists('README.md'))

        self._check(phase, 'CHANGELOG.md exists',
                    self._file_exists('CHANGELOG.md'), penalty=2)

    # ─── Scoring & Reporting ───

    def _calculate_overall_score(self):
        """Calculate weighted overall score."""
        total = 0
        for phase_key, weight in self.PHASE_WEIGHTS.items():
            if phase_key in self.phases:
                total += self.phases[phase_key]['score'] * weight
        self.overall_score = round(total)

    def _get_grade(self, score: int) -> str:
        """Convert score to letter grade."""
        if score >= 95:
            return 'A+'
        elif score >= 90:
            return 'A'
        elif score >= 85:
            return 'B+'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'

    def _generate_report(self):
        """Print the final production readiness report."""
        grade = self._get_grade(self.overall_score)
        total_critical = sum(p['critical'] for p in self.phases.values())
        total_warnings = sum(p['warnings'] for p in self.phases.values())
        total_passed = sum(p['passed'] for p in self.phases.values())

        print(f"\n{'=' * 60}")
        print("🛡️  PRODUCTION READINESS REPORT")
        print(f"{'=' * 60}")
        print(f"\n  Overall Score: {self.overall_score}/100 ({grade})")
        print(f"  Passed: {total_passed} | Warnings: {total_warnings} | Critical: {total_critical}")

        if self.overall_score >= 95:
            print("  Status: ✅ PRODUCTION READY")
        elif self.overall_score >= 80:
            print("  Status: ⚠️ NEEDS MINOR FIXES")
        elif self.overall_score >= 60:
            print("  Status: 🟡 SIGNIFICANT ISSUES")
        else:
            print("  Status: 🔴 NOT PRODUCTION READY")

        print(f"\n{'─' * 60}")
        print("  Phase Breakdown:")
        print(f"{'─' * 60}")
        print(f"  {'Phase':<35} {'Score':>6} {'Critical':>9} {'Warnings':>9}")
        print(f"  {'─' * 59}")

        for phase_key in self.PHASE_WEIGHTS:
            if phase_key in self.phases:
                p = self.phases[phase_key]
                weight_pct = int(self.PHASE_WEIGHTS[phase_key] * 100)
                icon = '✅' if p['score'] >= 90 else ('🟡' if p['score'] >= 70 else '🔴')
                print(f"  {icon} {p['name']:<32} {p['score']:>4}/100  {p['critical']:>6}    {p['warnings']:>6}")

        # List critical issues
        critical_issues = []
        for phase_key, phase in self.phases.items():
            for check in phase['checks']:
                if not check['passed'] and check['severity'] == 'critical':
                    critical_issues.append((phase['name'], check['name']))

        if critical_issues:
            print(f"\n{'─' * 60}")
            print("  🔴 CRITICAL ISSUES (Must Fix Before Production):")
            print(f"{'─' * 60}")
            for phase_name, issue in critical_issues:
                print(f"    [{phase_name}] {issue}")

        print(f"\n{'=' * 60}\n")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Production Readiness Scanner — comprehensive pre-production audit"
    )
    parser.add_argument(
        'target',
        help='Target project path to scan'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output (show all checks)'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output results as JSON'
    )
    parser.add_argument(
        '--output', '-o',
        help='Output file path'
    )

    args = parser.parse_args()

    scanner = ProductionReadinessScanner(
        args.target,
        verbose=args.verbose
    )

    results = scanner.run()

    if args.json:
        output = json.dumps(results, indent=2, default=str)
        if args.output:
            with open(args.output, 'w') as f:
                f.write(output)
            print(f"Results written to {args.output}")
        else:
            print(output)


if __name__ == '__main__':
    main()
