# Errors: Rationale

## What the current console does
Raw AWS errors: ThrottlingException, ValidationException, ModelTimeoutException, etc. The error message is the technical string returned by the service. Users must search documentation to understand what went wrong and what to do.

## What changed

- **Practitioner**: Full table with timestamp, error code, raw message, cause, action, and doc link. Sortable by any column.
- **Builder**: Per-error cards showing the error code prominently alongside a friendly translation, technical detail explaining the mechanism, the cause, a concrete next step, and a link to relevant documentation.
- **Explorer**: Cards that lead with plain language ("The text you sent was too long for this model to process at once"). No error codes visible unless the user expands "Show technical details". The focus is on what happened and what to do, not what went wrong internally.

## Why
Errors are the highest-friction moment in any developer tool. For non-technical users, a raw ThrottlingException is a dead end. For experienced users, it is an annoyance that could be made slightly more convenient.

The redesign applies the same principle at every tier: cause plus one concrete next step. At Explorer, the cause is in everyday language. At Builder, it includes the technical mechanism. At Practitioner, it is the raw message plus structured context. No tier shows an error without an action.
