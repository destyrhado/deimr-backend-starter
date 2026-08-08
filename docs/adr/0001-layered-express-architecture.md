# ADR 0001: Layered Express Architecture

## Status

Accepted

## Context

The API includes authentication, RBAC, validation, persistence, and public documentation. Keeping all behavior inside route handlers would make authorization and persistence rules difficult to test.

## Decision

Use a layered structure:

- routes wire HTTP paths and middleware
- controllers handle request and response translation
- services own application and authorization-sensitive behavior
- repositories isolate MongoDB access
- models define persistence shape

## Consequences

The code has more files than a small CRUD demo, but business rules are easier to test without Express internals and persistence details stay out of controllers.
