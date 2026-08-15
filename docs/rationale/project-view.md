# Project View: Rationale

## What the current console does
Projects display request counts, success rates, latency percentiles, cost figures, and error breakdowns. The numbers are accurate but uninterpreted. A project with 94.5% success rate and 145 timeouts just shows those numbers without guidance.

## What changed

- **Practitioner**: Full metrics table, sortable by any column. Raw model IDs, timestamps, error codes.
- **Builder**: Per-project cards with metrics shown large, contextual interpretation ("Good, some errors worth reviewing"), cost trend badges, and expandable top-errors with friendly descriptions. A "Recommendation" line at the bottom translates data into action.
- **Explorer**: Health-status cards ("Healthy", "Needs attention", "Degraded") with a plain-language summary and a single "What to do next" field. Detailed metrics hidden behind an expandable section.

## Why
Evaluation numbers only become useful when someone understands what they mean in context. A 94.5% success rate might be fine for a batch job but unacceptable for a customer-facing bot. Rather than leaving interpretation to the user, the Builder and Explorer tiers provide the "so what" alongside the data.

The health status pattern (green/yellow/red) is immediately legible without technical context. It answers the first question any project owner asks: "Is this thing working?"
