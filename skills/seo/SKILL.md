---
name: seo
description: "Run a broad SEO audit across technical SEO, on-page SEO, schema, sitemaps, content quality, AI search readiness, and GEO. Use as the umbrella skill when the user asks for a full SEO analysis or strategy."
author: "Roedy Rustam"
github: "https://github.com/roedyrustam/vibes-plug"
risk: unknown
source: "https://github.com/AgriciDaniel/claude-seo"
date_added: "2026-03-21"
user-invokable: true
argument-hint: "[command] [url]"
---

# SEO: Universal SEO Analysis Skill (Advanced Edition)

Comprehensive SEO analysis across all industries (SaaS, local services, e-commerce, publishers, agencies). Orchestrates specialized sub-skills and subagents, heavily emphasizing **Modern Web Performance** and **AI Search Readiness (GEO)**.

## When to Use
- Use when the user asks for a full SEO audit or broad SEO strategy.
- Use as the umbrella entry point when multiple SEO dimensions are in scope.
- Use when the task spans technical SEO, content, schema, sitemaps, and AI search readiness together.

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/seo audit <url>` | Full website audit with parallel subagent delegation |
| `/seo page <url>` | Deep single-page analysis |
| `/seo sitemap <url or generate>` | Analyze or generate XML sitemaps |
| `/seo schema <url>` | Detect, validate, and generate Schema.org markup |
| `/seo images <url>` | Image optimization analysis (WebP, lazy-load, alt-text) |
| `/seo technical <url>` | Technical SEO audit (Architecture, CWV, Crawlability) |
| `/seo content <url>` | E-E-A-T and content quality analysis |
| `/seo geo <url>` | AI Overviews / Generative Engine Optimization |
| `/seo plan <business-type>` | Strategic SEO planning |
| `/seo programmatic [url\|plan]` | Programmatic SEO analysis and planning |
| `/seo competitor-pages [url\|generate]` | Competitor comparison page generation |
| `/seo hreflang [url]` | Hreflang/i18n SEO audit and generation |

## Orchestration Logic

When the user invokes `/seo audit`, delegate to subagents in parallel:
1. Detect business type (SaaS, local, ecommerce, publisher, agency, other).
2. Spawn subagents: `seo-technical`, `seo-content`, `seo-schema`, `seo-sitemap`, `seo-performance`, `seo-geo`.
3. Collect results and generate a unified report with an **SEO Health Score (0-100)**.
4. Create prioritized action plan (Critical -> High -> Medium -> Low).

For individual commands, load the relevant sub-skill directly.

## Industry Detection & Custom Rules

Detect business type from homepage signals:
- **SaaS**: pricing page, /features, /integrations, /docs, "free trial"
- **Local Service**: phone number, address, service area, Google Maps embed
- **E-commerce**: /products, /collections, /cart, product schema
- **Publisher**: /blog, /articles, article schema, author pages
- **Agency**: /case-studies, /portfolio, client logos

## Quality Gates & Modern Web Rules

- **Thin Content**: WARNING at 30+ location pages (enforce 60%+ unique content).
- **Programmatic Limits**: HARD STOP at 50+ auto-generated pages (require user justification).
- **Schema Deprecations**: Never recommend HowTo schema (deprecated Sept 2023). FAQ schema only for government and healthcare sites.
- **Core Web Vitals**: All performance references must use INP (Interaction to Next Paint), never FID. LCP must be < 2.5s.
- **AI-First Indexing**: Always check for `llms.txt` readiness, semantic HTML tags, and clean text extraction for LLM crawlers.

## Scoring Methodology

### SEO Health Score (0-100)
Weighted aggregate of all categories:

| Category | Weight | Focus Area |
|----------|--------|------------|
| Technical SEO | 20% | Crawlability, HTTPS, Architecture |
| Content Quality (E-E-A-T) | 20% | Depth, Originality, Authoritativeness |
| On-Page SEO | 15% | Title, Meta, Headers, Keywords |
| Performance (CWV) | 15% | LCP, INP, CLS, Mobile-First |
| AI Search Readiness (GEO) | 15% | Citability, llms.txt, Semantic HTML |
| Schema / Structured Data | 10% | Rich Snippets Eligibility |
| Media & Images | 5% | Alt-text, WebP, Lazy Loading |

### Priority Levels
- **Critical**: Blocks indexing or causes penalties (immediate fix required).
- **High**: Significantly impacts rankings or CWV (fix within 1 week).
- **Medium**: Optimization opportunity (fix within 1 month).
- **Low**: Nice to have (backlog).

## Sub-Skills & Subagents

This skill orchestrates multiple specialized sub-skills for comprehensive analysis:
- **seo-technical**: Crawlability, indexability, security, CWV.
- **seo-content**: E-E-A-T, readability, thin content.
- **seo-schema**: Detection, validation, generation.
- **seo-sitemap**: Structure, coverage, quality gates.
- **seo-performance**: Core Web Vitals measurement.
- **seo-geo**: AI crawler access, `llms.txt`, citability, brand mention signals.

## Error Handling

| Scenario | Action |
|----------|--------|
| Unrecognized command | List available commands from the Quick Reference table. Suggest the closest matching command. |
| URL unreachable | Report the error and suggest the user verify the URL. Do not attempt to guess site content. |
| Sub-skill fails | Report partial results from successful sub-skills. Clearly note which sub-skill failed and suggest manual verification. |

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
