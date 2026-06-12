---
name: seo-geo
description: "Advanced Generative Engine Optimization (GEO). Optimize content for AI Overviews, ChatGPT, Perplexity, and other AI search systems. Analyzes citability, llms.txt readiness, crawler accessibility, semantic structure, and brand mention authority."
author: "Roedy Rustam"
user-invokable: true
argument-hint: "[url]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebFetch
---

# AI Search / GEO Optimization (Advanced Edition - May 2026)

## Kondisi Pemicu
- Use when improving visibility in AI Overviews (Google), ChatGPT Search, Perplexity, or similar AI search systems.
- Use when evaluating `llms.txt` readiness, AI crawler access, or citation-oriented content structure.
- Use when the user asks about GEO, AI SEO, LLM visibility, or preventing AI hallucinations regarding their brand.

## Key Statistics & Paradigm Shift

| Metric | Value | Insight |
|--------|-------|---------|
| AI Overviews reach | 1.5 billion+ users/month | Google dominates top-of-funnel discovery. |
| AI-referred sessions growth | 527% (Jan-May 2025) | AI is replacing traditional 10-blue-links search. |
| ChatGPT weekly active users | 900+ million | ChatGPT is the primary alternative search engine. |

## Critical Insight: Brand Mentions & Semantic Trust > Backlinks

**Brand mentions and structured entity data correlate 3x more strongly with AI visibility than traditional backlinks.**
(Ahrefs December 2025 study of 75,000 brands)

- **Only 11% of domains** are cited by both ChatGPT and Google AI Overviews for the same query.
- **Hallucination Prevention:** AI relies on definitive, unambiguous, and semantically tagged facts. Vague content leads to exclusion or hallucinated summaries.

---

## GEO Analysis Criteria (Advanced)

### 1. Citability Score (25%)
**Optimal passage length: 134-167 words** for AI citation.
- **Strong signals:** Clear, quotable sentences. Direct answers in the first 40-60 words. Claims attributed to primary sources. Definitions using "X is..." formats.
- **Weak signals:** Vague statements, opinions without evidence, buried conclusions.

### 2. Semantic HTML & Structural Readability (20%)
LLMs digest structure to understand context.
- **Strong signals:** Strict `H1 -> H2 -> H3` hierarchy. Semantic tags (`<article>`, `<main>`, `<section>`, `<aside>`). `<blockquote>` for quotes.
- **Weak signals:** `<div>` soup. Inconsistent heading hierarchy. Text walls.

### 3. Multi-Modal & Structured Content (15%)
Content with multi-modal elements sees **156% higher selection rates** by AI.
- **Check for:** Text paired with relevant images/infographics. Embedded videos. Markdown-friendly tables for comparative data. Ordered/unordered lists for step-by-step content.

### 4. Authority, Entity & Brand Signals (20%)
AI systems verify facts across platforms before citing.
- **Strong signals:** Entity presence in Wikipedia/Wikidata. Mentions on Reddit, YouTube, LinkedIn. Author bylines with `Person` schema and credentials. Consistent "About" data (`Organization` schema).

### 5. Technical Accessibility for LLMs (20%)
**AI crawlers do NOT execute JavaScript.** Server-side rendering (SSR) or Static Site Generation (SSG) is absolute mandatory.
- **Check for:** Client-only content (fails AI crawl). AI crawler access in `robots.txt`. `llms.txt` configuration. RSL 1.0 licensing terms.

---

## AI Crawler Detection & Permissions

Check `robots.txt` for these AI crawlers:

| Crawler | Owner | Purpose | Recommendation |
|---------|-------|---------|----------------|
| GPTBot / OAI-SearchBot | OpenAI | ChatGPT search | **Allow** |
| ClaudeBot | Anthropic | Claude web features | **Allow** |
| PerplexityBot | Perplexity | Perplexity search | **Allow** |
| CCBot | Common Crawl | Training data | Optional (Often Blocked) |
| Bytespider | ByteDance | TikTok/Douyin AI | Optional |

---

## llms.txt Standard

The **llms.txt** standard provides AI crawlers with structured content guidance, bypassing visual noise.
**Location:** `/llms.txt` (root of domain)

**Format:**
```markdown
# Title of site
> Brief description

## Main sections
- `Page title -> https://example.com/page`: Description

## Optional: Key facts (Hallucination Prevention)
- Fact 1 (e.g. "Company X was founded in 2020.")
- Fact 2 (e.g. "Product Y costs $99/month.")
```

---

## Output / Deliverable

Generate `GEO-ANALYSIS.md` with:

1. **GEO Readiness Score: XX/100**
2. **Platform Breakdown** (Google AIO vs ChatGPT vs Perplexity estimates)
3. **AI Crawler Access Status** (Allowed/Blocked)
4. **llms.txt Status** (Present/Missing + ready-to-use template if missing)
5. **Brand Mention & Entity Analysis** (Wikipedia, Reddit, Social Presence)
6. **Passage-Level Citability** (Identified 134-167 word blocks)
7. **Semantic HTML & SSR Check** (JavaScript dependency analysis)
8. **Top 5 Highest-Impact Changes**

---

## Prioritized Action Plan (Quick Wins to High Impact)

### Quick Wins
1. Add "What is [topic]?" definition in the first 60 words of key pages.
2. Ensure H2/H3 headings match common user query questions.
3. Allow `GPTBot`, `ClaudeBot`, and `PerplexityBot` in `robots.txt`.

### Medium Effort
1. Create and deploy an `/llms.txt` file outlining core facts and URLs.
2. Refactor `<div>` layouts into semantic `<article>`, `<section>`, and `<main>` tags.
3. Ensure SSR/SSG is used for primary content (No pure SPA for public pages).

### High Impact
1. Implement comprehensive entity linking (`sameAs` schema linking to Wikipedia/LinkedIn).
2. Create original data surveys (unique citability source for LLMs).
3. Build brand presence on Reddit and YouTube to create cross-platform verification signals.

## Error Handling

| Scenario | Action |
|----------|--------|
| AI crawlers blocked by robots.txt | Report exactly which crawlers are blocked. Provide specific robots.txt directives to add for enabling AI search visibility. |
| No llms.txt found | Note the absence and provide a ready-to-use llms.txt template based on the site's content structure. |
| Heavy Client-Side Rendering | WARN the user that AI bots will see blank pages. Recommend Next.js SSR, Nuxt, or pre-rendering. |

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
