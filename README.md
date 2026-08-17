# Bedrock Mantle UI: Adaptive Console Redesign

## Overview

This is a redesign of the Amazon Bedrock console's model selection and evaluation experience. The core thesis: **the console should change shape based on the user's real proficiency, and keep adapting as they learn.** Same product, same capabilities, different amounts exposed at once.

The existing Bedrock Mantle UI serves engineers well but creates friction for everyone else. This redesign introduces three proficiency tiers that render the same screens differently, translating technical concepts into business language for newer users while preserving full control for experts.

---

## Design Approach

### The Problem

The current Bedrock console presents all users with the same interface: raw model IDs, token-based pricing, context window numbers, and quota tables. This works for engineers who already understand these concepts. For product managers, business analysts, or developers new to AI services, it creates an immediate comprehension gap.

### The Solution

Three distinct render modes of the same screens. Not tooltip toggles or simplified "lite" versions, but fundamentally different interaction patterns that match how each user type thinks about their work.

**Key design principles:**

1. **Never remove capability.** Simpler tiers hide and translate, but every feature is reachable in one click. An Explorer can always expand technical details.
2. **Adapt based on behavior, not self-assessment.** Onboarding asks behavioral questions ("Have you called an API before?"), not confidence ratings. Ongoing signals (code panel opens, glossary expansions) inform promotion suggestions.
3. **Never auto-demote.** Dropping someone to a simpler view uninvited reads as condescending. Promotion is suggested and dismissible.
4. **Opinionated where it helps.** Explorers get pre-configured templates and model recommendations. Builders get guided evaluation with technical context. Practitioners get raw data and full control.

---

## Proficiency Tiers

### Explorer
**Who:** New to AWS, cloud computing, or AI services. Understands their business problem well but not the technical implementation.

**Design philosophy:** Task-first, opinionated, template-driven. The console makes decisions for them and explains why in plain language.

- Template gallery maps business tasks to pre-configured models
- "Help me choose" wizard asks 4 simple questions and recommends a model with reasoning
- Cost shown as dollars per 100 uses (never tokens)
- Model IDs, endpoints, and code hidden by default
- Technical details available via "Show technical details" expandable sections
- Errors explained as cause + concrete next step

### Builder
**Who:** Hands-on developers with some experience. Can read code, understand API concepts, but may not be deeply familiar with every model's characteristics.

**Design philosophy:** Guided comparison with technical detail. Show the full picture with annotations and context so they can make informed decisions.

- Model IDs and endpoints visible with inline glosses
- Configurable evaluation criteria with benchmark scores
- Specs grouped and prioritized: context window, pricing, quotas, regions
- Service tiers framed as tradeoffs ("Priority = fastest/costliest")
- Code samples with per-line annotations
- Toggle to show all metrics during evaluation

### Practitioner
**Who:** Well-versed in AWS and cloud computing with multiple years of hands-on experience. Familiar with LLM concepts, token economics, and API patterns.

**Design philosophy:** Full density, maximum control, minimal chrome. Get out of their way.

- Full sortable tables with every spec column
- Raw model IDs, pricing in $/M tokens, quota numbers
- Compact evaluation interface with results as dense data tables
- Keyboard navigation, assistant collapsed until summoned
- No annotations or glosses cluttering the interface

---

## Feature: Model Evaluation Engine

A guided model recommendation system that asks users about their requirements and suggests models based on industry benchmark scores.

**How it works:**

1. User answers questions about their task, priorities, volume, and input size
2. The engine scores each model against benchmarks (accuracy, speed, cost efficiency, privacy, multilingual capability)
3. Models are ranked with transparent reasoning explaining why each scored the way it did
4. Results include monthly cost estimates, strengths, and tradeoffs

**The evaluation adapts per tier:**
- Explorer: Step-by-step wizard, one question at a time, top recommendation highlighted with a trophy icon
- Builder: Dropdowns on one screen with toggleable detail depth
- Practitioner: Compact selectors, results as a sortable table with all columns visible

---

## Feature: 24/7 AI Assistant

A floating chat widget available on every screen across all tiers. Answers questions about models, pricing, errors, quotas, APIs, and getting started.

**Tier adaptations:**
- Explorer: Friendly greeting, suggested questions to tap, proactive tips, simple language
- Builder: API/configuration-focused responses with technical context
- Practitioner: Minimal chrome, fast Q&A, no hand-holding

**Architecture:** Currently uses keyword-based FAQ matching against a curated knowledge base. In production, this would call a real model via the bedrock-mantle endpoint (behind an env flag).

---

## Screens

| Surface | Explorer | Builder | Practitioner |
|---------|----------|---------|--------------|
| Model catalog | Template gallery + guided wizard | Annotated cards + configurable evaluation + benchmarks | Sortable table + compact evaluation |
| Projects | Health status cards + plain-language next steps | Metrics with interpretation + error explanations | Full metrics table, sortable |
| Code samples | Hidden by default, "Show me the code" toggle | Visible with per-line annotations | Raw code, copy-ready |
| Errors | Plain cause + what to do | Error code + technical detail + docs link | Full table with raw messages |
| Quotas/pricing | Cost calculator ("can I afford N items?") | Token pricing with glosses + utilization bars | Raw numbers table |

---

## Technical Architecture

```
src/
├── hooks/
│   └── useProficiency.ts      # ALL tier logic lives here
├── types/
│   └── proficiency.ts         # Type definitions for the tier system
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx      # Shell with nav, tier switcher, assistant
│   └── shared/
│       ├── TierSwitcher.tsx   # Segmented control, always visible in header
│       ├── PromotionBanner.tsx # Dismissible tier upgrade suggestion
│       └── AiAssistant.tsx    # Floating chat widget
├── pages/
│   ├── OnboardingPage.tsx     # Behavioral questions → tier assignment
│   ├── ModelCatalogPage.tsx   # Templates, evaluation, full catalog
│   ├── ProjectViewPage.tsx    # Health monitoring and metrics
│   ├── CodeSamplesPage.tsx    # API examples with annotations
│   ├── ErrorsPage.tsx         # Error interpretation
│   └── QuotasPricingPage.tsx  # Cost calculator and quota visibility
├── mocks/
│   ├── models.ts              # 5 model specs with explorer-friendly fields
│   ├── templates.ts           # 6 pre-configured business task templates
│   ├── evaluation.ts          # Benchmark data + recommendation engine
│   ├── projects.ts            # 3 projects with health interpretation
│   ├── codeSamples.ts         # 3 API format examples with annotations
│   ├── errors.ts              # 5 error types with tiered explanations
│   ├── quotas.ts              # Quota data + batch cost estimator
│   └── assistant.ts           # FAQ entries + response generation
├── App.tsx                    # Router + proficiency provider
└── main.tsx                   # Entry point
```

### Key architectural decisions

- **Centralized tier logic.** `useProficiency.ts` is the single source of truth. Components read the tier from React context and render accordingly. No scattered tier checks throughout the codebase.
- **Mock data only.** Runs with zero AWS credentials. Every mock includes both technical fields (for practitioners) and plain-language fields (for explorers). A real bedrock-mantle client goes behind an env flag later.
- **Cloudscape Design System.** Uses AWS Cloudscape components throughout to read as a plausible evolution of the Bedrock console, not a replacement.
- **Persisted state.** Tier selection and onboarding answers persist in localStorage across sessions.

---

## Adaptation System

### Onboarding
Three behavioral questions determine initial tier:
1. "Have you called a web API before?"
2. "Have you used a large language model?"
3. "Have you read API documentation to build something?"

Answering all three "yes" → Practitioner. One or two → Builder. None → Explorer.

### Ongoing signals tracked
- Glossary expansions (expanding technical detail sections)
- Code panel opens (toggling code visibility)
- Code snippets copied
- Repeated errors encountered
- Unassisted task completions
- API calls made

### Promotion rules
- Explorer → Builder suggested after 5 code panel opens or 3 code snippets copied
- Builder → Practitioner suggested after 3 unassisted completions + API calls made
- Promotion is always a dismissible banner, never automatic
- Manual tier switching always available via the segmented control in the header

---

## Running Locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173/. No AWS credentials needed.

### Build for production
```bash
npm run build
npm run preview
```

---

## Design Constraints

- **Cloudscape Design System**: Spacing, type scale, form patterns, color roles all from Cloudscape
- **Existing surface names preserved**: Model catalog, projects, evaluations, usage insights, code samples
- **WCAG 2.1 AA**: Keyboard navigation, correct ARIA on progressive disclosure controls, visible focus states, screen reader labels on all toggles
- **Desktop and tablet only**: No mobile layout
- **No em dashes in UI copy**

---

## Out of Scope

- Authentication and IAM
- Real fine-tuning or evaluation runs
- Mobile layout
- Any Bedrock console surface not in the screens table above
- Real bedrock-mantle API integration (mocked for now)

---

## Rationale Documents

Each screen has a detailed rationale in `docs/rationale/`:

- [`model-catalog.md`](docs/rationale/model-catalog.md) — Template-first design, task language, progressive disclosure
- [`project-view.md`](docs/rationale/project-view.md) — Health status patterns, metric interpretation
- [`code-samples.md`](docs/rationale/code-samples.md) — Hidden-by-default code, learning pathway signals
- [`errors.md`](docs/rationale/errors.md) — Cause + action pattern, tiered technical depth
- [`quotas-pricing.md`](docs/rationale/quotas-pricing.md) — Cost calculator, eliminating token math

---

## Tech Stack

- **Vite** — Build tool and dev server
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Cloudscape Design System** — AWS component library
- **React Router v6** — Client-side routing
