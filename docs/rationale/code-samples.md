# Code Samples: Rationale

## What the current console does
Prefilled code snippets for the three supported APIs (OpenAI Responses, OpenAI Chat Completions, Anthropic Messages). The code is syntactically correct and copy-paste ready, but assumes the reader can parse Python imports, HTTP headers, JSON payloads, and response navigation without guidance.

## What changed

- **Practitioner**: Raw code in a dark-themed code block. No annotations. This is what experienced developers want: clean, copy-ready.
- **Builder**: Same code with inline annotations on key lines. Annotations explain what each section does and why (e.g., "Temperature controls creativity: 0 = focused, 1 = varied"). Both explorer-tier and builder-tier annotations are shown.
- **Explorer**: Code hidden by default behind a persistent "Show me the code" toggle. The page leads with task descriptions ("Ask a model a question and get a text answer back"). When the toggle is activated, code appears with explorer-level annotations that explain in non-technical terms.

## Why
Code samples are one of the most common landing points for new users. The gap between "I want to ask an AI a question" and "construct a JSON payload with Authorization: Bearer header" is enormous. The Explorer tier bridges this by leading with intent and making code optional.

The "Show me the code" toggle is tracked as a proficiency signal. Users who consistently open it are candidates for promotion to Builder tier. This creates a natural learning pathway without forcing anyone through it.
