# ADR 0002: Refresh Token Rotation And Reuse Detection

## Status

Accepted

## Context

JWT access tokens are stateless and short lived. Refresh tokens need server-side state so logout, rotation, expiry checks, and stolen-token detection are possible.

## Decision

Persist HMAC-SHA256 refresh-token digests with a token-family id. On refresh, revoke the old token and issue a new token in the same family. If a revoked token is reused, mark the whole token family as reused and revoked.

## Consequences

The database can verify refresh-token validity without storing raw refresh tokens. Reuse detection improves stolen-token protection. The tradeoff is additional persistence complexity and the need for MongoDB availability during refresh and logout.
