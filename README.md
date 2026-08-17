# Bedrock Mantle UI: Adaptive Console Redesign

## Overview

This is a redesign of the Amazon Bedrock Mantle console. The existing UI is optimized for the bedrock-mantle endpoint (supporting OpenAI Responses API, OpenAI Chat Completions API, and Anthropic Messages API) and works well for engineers, but poorly for everyone else.

**Redesign thesis:** The console should change shape based on the user's real proficiency, and keep adapting as they learn. Same product, same capabilities, different amounts exposed at once.

---

## Research and Analysis

### Heuristic Evaluation

A heuristic evaluation of the current Bedrock Mantle UI identified critical usability issues across multiple dimensions:

| Heuristic | Finding | Severity |
|-----------|---------|----------|
| Visibility of system status | Most of Mantle is documentation, not model responses, deployment status, or errors. Status/errors are only in the dashboard, repeated ambiguously in navigation. | 3 (Major) |
| Match between system and real world | Heavy technical jargon, no personalized guided onboarding for users unfamiliar with Bedrock Mantle. | 4 (Catastrophe) |
| Recognition rather than recall | Forces users to remember API names, model IDs, parameters, and configuration requirements. | 2 (Minor) |
| Flexibility and efficiency of use | No clear starting point, very technical language, no shortcuts or API/code options readily available. | 4 (Catastrophe) |
| Aesthetic and minimalist design | Interface overwhelmed by technical information with no clear hierarchy or starting point. | 4 (Catastrophe) |
| Help and documentation | Users must leave the console and search AWS documentation. No contextual help, no FAQ, no chat assistant. | 3 (Major) |

Three of the six evaluated heuristics scored a **severity 4** (usability catastrophe: fix before product release), indicating fundamental gaps in how the console serves non-expert users.

### User Journey Maps

Three journey maps were developed to understand how different users experience the current UI:

**Journey 1: New user — "I want to understand what Mantle does and where to start"**
- Emotional arc: Curious → uncertain → overwhelmed → more confident (if they persist)
- Key pain point: The interface introduces technical terms before the user understands them. Multiple capabilities make it difficult to determine where to begin. Users must rely on outside AWS documentation.
- Opportunity: Help users choose a starting point based on their goal rather than requiring them to understand AWS terminology first.

**Journey 2: Developer — "I want to understand what's happening with my project"**
- Emotional arc: Focused → curious → uncertain → potentially frustrated → informed (if data is interpretable)
- Key pain point: Lots of information presented at once. Technical metrics don't immediately communicate meaning or importance. Users can see something changed but aren't given context for why or what to do next.
- Opportunity: Explain technical metrics in plain language, show meaningful trends, highlight unusual activity, and provide recommended next steps instead of simply displaying numbers.

**Journey 3: Developer — "I want to test a model and see the result"**
- Emotional arc: Interested → focused → uncertain → frustrated if blocked → satisfied when successful
- Key pain point: The workflow requires understanding technical concepts before getting started. Many configuration options are only relevant to experienced users. Beginners don't know which settings matter; experienced developers find extra explanations slow them down.
- Opportunity: Give users sensible defaults. Explain unfamiliar settings in context. Hide advanced options until needed. Give clear ways to iterate from experimentation toward implementation.

---

## Design Approach

### Problem Statement

The Bedrock Mantle console serves a single user profile (experienced AWS engineers) while the actual user base spans from business analysts who know their problem domain but not cloud computing, to senior developers who want complete control. This mismatch results in severity-4 usability issues where non-technical users cannot accomplish basic tasks without external documentation.

### Solution: Proficiency-Adaptive UI

Three distinct render modes of the same screens. Not tooltip toggles or simplified "lite" versions, but fundamentally different interaction patterns that match how each user type thinks about their work.

**Key design principles:**

1. **Never remove capability.** Simpler tiers hide and translate, but every feature is reachable in one click. An Explorer can always expand technical details.
2. **Adapt based on behavior, not self-assessment.** Onboarding asks behavioral questions ("Have you called an API before?"), not confidence ratings. Ongoing signals (code panel opens, glossary expansions) inform promotion suggestions.
3. **Never auto-demote.** Dropping someone to a simpler view uninvited reads as condescending. Promotion is suggested and dismissible.
4. **Opinionated where it helps.** Explorers get pre-configured templates and model recommendations. Builders get guided evaluation with technical context. Practitioners get raw data and full control.

### How the Redesign Addresses Each Finding

| Heuristic Issue | Redesign Response |
|-----------------|-------------------|
| No visibility of system status | Project view shows health status (healthy/needs-attention/degraded) with interpreted metrics and "what to do next" at every tier |
| Technical jargon mismatch | Explorer tier uses task-first language throughout; Builder tier adds inline glosses; Practitioner tier preserves technical density |
| Forces recall of IDs/params | Templates pre-configure everything; Builder shows IDs with context; code samples are copy-ready |
| No flexibility for different expertise | Three complete render modes, each optimized for its audience's mental model |
| Overwhelming information hierarchy | Explorer hides complexity behind expandable sections; Builder groups and prioritizes; Practitioner gets full density |
| No contextual help | 24/7 AI assistant on every screen, tier-adapted responses, suggested questions for Explorers |

---

## Proficiency Tiers

### Explorer
**Who:** Very new to AWS or even to cloud computing. They know their business problem well. We help them with opinionated templates and pre-built flows.

**Design philosophy:** Task-first, opinionated, template-driven. The console makes decisions for them and explains why in plain language.

- Template gallery maps business tasks ("summarize documents", "extract data from messy notes") to pre-configured models
- "Help me choose" wizard asks 4 simple questions and recommends a model with transparent reasoning
- Cost shown as dollars per 100 uses (never tokens)
- Model IDs, endpoints, and code hidden by default
- Technical details available via expandable sections (one click away, never removed)
- Errors explained as cause + concrete next step in plain language

### Builder
**Who:** More experienced, hands-on users. They can get guided help as needed but also have support in areas they are not familiar with while understanding and evaluating various models.

**Design philosophy:** Guided comparison with technical detail. Show the full picture with annotations and context so they can make informed decisions.

- Model IDs and endpoints visible with inline glosses ("This is the model ID you use in API calls")
- Configurable evaluation criteria with industry benchmark scores
- Specs grouped and prioritized: context window, pricing, quotas, regions
- Service tiers framed as tradeoffs ("Priority = fastest/costliest. Flexible = cheapest/may queue.")
- Code samples with per-line annotations explaining each section
- Benchmark comparison table with color-coded scores

### Practitioner
**Who:** Well-versed in AWS and cloud computing with multiple years of hands-on experience. Very familiar with the concepts. They need complete control and can query for information as needed.

**Design philosophy:** Full density, maximum control, minimal chrome. Get out of their way.

- Full sortable tables with every spec column
- Raw model IDs, pricing in $/M tokens, quota numbers
- Compact evaluation interface with results as dense data tables
- Keyboard navigation, assistant collapsed until summoned
- No annotations or glosses cluttering the interface
- Complete API/code access without intermediary steps

---

## Feature: Model Evaluation Engine

Directly addresses Journey Map #3 ("I want to test a model") by removing the requirement to understand technical concepts before getting started.

**How it works:**

1. User answers questions about their task, priorities (cost, accuracy, speed, privacy, multilingual), volume, and input size
2. The engine scores each model against industry benchmarks (accuracy, speed, cost efficiency, privacy, multilingual capability)
3. Models are ranked with transparent reasoning explaining the recommendation
4. Results include monthly cost estimates, strengths, and tradeoffs

**Per-tier adaptation:**
- Explorer: Step-by-step wizard (one question at a time), top recommendation highlighted, plain-language reasoning
- Builder: All criteria configurable via dropdowns, toggleable metric depth, benchmark table
- Practitioner: Compact selectors, results as a sortable table with all columns visible

---

## Feature: 24/7 AI Assistant

Directly addresses the heuristic finding that users must leave the console to search documentation (severity 3). A floating chat widget available on every screen across all tiers.

**Tier adaptations:**
- Explorer: Friendly greeting, suggested questions to tap, proactive tips, simple language
- Builder: API/configuration-focused responses with technical context
- Practitioner: Minimal chrome, fast Q&A, no hand-holding

**Coverage:** Models, pricing, quotas, errors, APIs, getting started, concepts (tokens, context windows, service tiers).

---

## Screens and How They Map to Research

| Surface | Journey Map Addressed | Core Problem Solved |
|---------|----------------------|---------------------|
| Model catalog | #1 (where to start), #3 (test a model) | Opinionated templates eliminate the "which model?" paralysis; evaluation wizard removes need to understand specs |
| Projects | #2 (understand my project) | Health status + interpreted metrics + "what to do next" replaces raw numbers without context |
| Code samples | #3 (test a model) | Per-line annotations at lower tiers; "Show me the code" toggle for Explorers who aren't ready |
| Errors | #2 (understand my project) | Cause + one concrete next step replaces raw AWS error strings |
| Quotas/pricing | #1 (where to start), #3 (test a model) | Cost calculator answers "can I afford N items?" without token math |

---

## Technical Architecture

```
src/
├── hooks/
│   └── useProficiency.ts      # ALL tier logic lives here. Single source of truth.
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

### Key Architectural Decisions

- **Centralized tier logic.** `useProficiency.ts` is the single source of truth. Components read the tier from React context and render accordingly. Tier checks are never scattered throughout the codebase.
- **Mock data only.** Runs with zero AWS credentials. Every mock includes both technical fields (for practitioners) and plain-language fields (for explorers). A real bedrock-mantle client goes behind an env flag later.
- **Cloudscape Design System.** Uses AWS Cloudscape components throughout so this reads as a plausible evolution of the Bedrock console, not a replacement. Preserves Cloudscape spacing, type scale, form patterns, and color roles.
- **Persisted state.** Tier selection, onboarding answers, and proficiency signals persist in localStorage across sessions.

---

## Adaptation System

### Onboarding (addresses Journey #1: "where to start")
Three behavioral questions determine initial tier:
1. "Have you called a web API before?"
2. "Have you used a large language model?"
3. "Have you read API documentation to build something?"

All three "yes" → Practitioner. One or two → Builder. None → Explorer.

### Ongoing Signals Tracked
- Glossary expansions (expanding technical detail sections)
- Code panel opens (toggling "Show me the code")
- Code snippets copied
- Repeated errors encountered
- Unassisted task completions
- API calls made

### Promotion Rules
- Explorer → Builder: suggested after 5 code panel opens or 3 code snippets copied
- Builder → Practitioner: suggested after 3 unassisted completions + API calls made
- Promotion is always a dismissible banner, never automatic
- Never auto-demote
- Manual tier switching always available via the header segmented control
- "Why this view?" link explains the current tier and reassures nothing is removed

---

## Design Constraints

- **Cloudscape Design System**: Spacing, type scale, form patterns, color roles
- **Existing surface names preserved**: Model catalog, projects, evaluations, usage insights, code samples (so users who know the console stay oriented)
- **WCAG 2.1 AA**: Keyboard navigation, correct ARIA on progressive disclosure controls, visible focus states, screen reader labels on all toggles
- **Desktop and tablet only**
- **No em dashes in UI copy**
- **No capability removed at any tier**: Simpler tiers hide and translate, never take features away

---

## Running Locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173/. No AWS credentials needed. All data is mocked.

### Production Build
```bash
npm run build
npm run preview
```

---

## Out of Scope

- Authentication and IAM
- Real fine-tuning or evaluation runs
- Mobile layout
- Any Bedrock console surface not listed in the screens table
- Real bedrock-mantle API integration (mocked, env flag for later)

---

## Rationale Documents

Each screen has a detailed rationale in `docs/rationale/` explaining what the current console does, what changed, and why:

- [`model-catalog.md`](docs/rationale/model-catalog.md)
- [`project-view.md`](docs/rationale/project-view.md)
- [`code-samples.md`](docs/rationale/code-samples.md)
- [`errors.md`](docs/rationale/errors.md)
- [`quotas-pricing.md`](docs/rationale/quotas-pricing.md)

---

## Tech Stack

- **Vite** — Build tool and dev server
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Cloudscape Design System** — AWS component library
- **React Router v6** — Client-side routing
