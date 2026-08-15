# Bedrock Mantle UI: Adaptive Console Redesign

A redesign of the Amazon Bedrock console that adapts its presentation based on user proficiency. Same product, same capabilities, different amounts exposed at once.

## Thesis

The console should change shape based on the user's real proficiency and keep adapting as they learn. Simpler tiers hide and translate but never remove capability.

## Proficiency Tiers

- **Explorer**: Task-first language, cost in dollars per 100 uses, code hidden by default, model chosen for them with reasoning.
- **Builder**: Model IDs and endpoints visible with inline glosses, code with annotations, specs grouped and prioritized.
- **Practitioner**: Full density, raw specs, sortable tables, keyboard navigation. The current console, essentially.

## Screens

| Surface | Purpose |
|---------|---------|
| Model catalog | Compare and choose models |
| Projects | Understand project health and what to do next |
| Code samples | Learn and copy API integration patterns |
| Errors | Understand what went wrong and fix it |
| Quotas and pricing | Answer "can I afford this?" |

## Running locally

```bash
npm install
npm run dev
```

Runs with zero AWS credentials. All data is mocked in `src/mocks/`.

## Architecture

- Vite + React + TypeScript + Cloudscape Design System
- All tier logic in `src/hooks/useProficiency.ts`
- Components read the tier and render accordingly; tier checks never scattered
- Mock data in `src/mocks/`; real bedrock-mantle client goes behind an env flag later

## Design rationale

Each screen has a rationale document in `docs/rationale/` explaining what the current console does, what changed, and why.

## Constraints

- WCAG 2.1 AA: keyboard nav, correct ARIA, visible focus, screen reader labels
- Desktop and tablet only
- Cloudscape spacing, type scale, form patterns, and color roles
- No em dashes in UI copy
