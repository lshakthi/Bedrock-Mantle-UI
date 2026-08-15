# Quotas and Pricing: Rationale

## What the current console does
Token-based pricing tables ($/M input tokens, $/M output tokens) and quota limits (RPM, TPM). Understanding cost requires knowing average token counts per request and doing multiplication. Understanding quota requires knowing your throughput pattern.

## What changed

- **Practitioner**: Full table with all quota and pricing columns, current utilization alongside limits, sortable.
- **Builder**: Per-model cards with pricing annotated ("Tokens are roughly 0.75 words each"), visual quota utilization bars with color-coded thresholds (green < 50%, amber 50-80%, red > 80%), and cost per 100 typical uses as a bridge metric.
- **Explorer**: A cost calculator that answers "Can I afford to run this on N records?" directly. The user picks a model, enters a record count, and sees estimated cost in dollars, estimated time, and cost per 100 items. No token math exposed. Below the calculator, a simple per-model price comparison using the $/100 uses metric.

## Why
The question "can I afford this?" is universal. Token pricing answers it, but only after calculation. The Explorer calculator eliminates that step entirely by assuming typical input/output sizes and presenting the answer in dollars and minutes.

The Builder tier keeps token pricing visible because builders need to optimize, but adds the "roughly 0.75 words per token" gloss so they can do quick mental math. The utilization bars give an at-a-glance sense of how close they are to rate limits without needing to compare two numbers.

The Practitioner view preserves the raw data density that power users expect when capacity planning.
