# ADR 0003: Readiness, Smoke Tests, And Observability

## Status

Accepted

## Context

A deployed API can respond to HTTP requests while still being unable to serve real traffic if MongoDB is unavailable or Swagger is stale.

## Decision

Separate liveness and readiness:

- `/health` reports process liveness
- `/ready` reports dependency readiness
- `/metrics` exposes lightweight process metrics
- the live smoke-test workflow checks root, health, readiness, metrics, and Swagger after CI succeeds on `main`

## Consequences

Render health checks now catch database readiness failures. The smoke test provides stronger public-deployment confidence, while metrics remain intentionally lightweight and do not replace a full observability stack.
