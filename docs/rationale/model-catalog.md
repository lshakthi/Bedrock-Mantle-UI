# Model Catalog: Rationale

## What the current console does
The existing model catalog presents a sortable table of models with columns for context window, modality, quotas, pricing per million tokens, and region availability. All information is rendered at full density regardless of who is looking at it. Selection requires knowing what "200K context window" means relative to your task.

## What changed
Three render modes of the same screen:

- **Practitioner**: Preserved as-is. Full-density sortable table with every spec column. This is the baseline the other two tiers reduce from.
- **Builder**: Each model gets a dedicated card with Model ID prominently shown (annotated as "this is the model ID you use in API calls"), specs grouped into context/pricing/quotas/regions, and service tiers framed as tradeoffs ("Priority = fastest/costliest. Flexible = cheapest/may queue.").
- **Explorer**: Task-first cards. The heading is what the model is good at, not its ID. Cost shown as dollars per 100 typical uses. A "Show technical details" expandable section ensures nothing is hidden, just de-emphasized.

## Why
The model catalog is the entry point for choosing a model. Non-technical users cannot evaluate "200K tokens at $3/M input" without context. By leading with task descriptions and plain-language cost at Explorer tier, users can make informed decisions without needing to understand token economics. Practitioners retain their full-density view because it already works for them.

The filtering input changes its placeholder per tier: Practitioners get "Filter models", Explorers get "What do you want to do?" This small language shift orients each audience without changing functionality.
