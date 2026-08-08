# Operations Runbook

This runbook covers the production-facing parts of the Deimr Backend Starter API.

## Runtime Checks

- `/health` is the liveness endpoint. It verifies the Node process can respond.
- `/ready` is the readiness endpoint. It returns `503` unless MongoDB is configured and connected.
- `/metrics` exposes Prometheus-style process counters for HTTP request totals, response status classes, and cumulative response duration.

Render uses `/ready` as the service health check so deployment health depends on database connectivity, not only process uptime.

## Required Production Configuration

Production startup fails fast when required configuration is missing or unsafe:

- `MONGODB_URI`; `MONGO_URI` is also accepted as a compatibility alias
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `APP_URL` or Render's external URL

JWT secrets must be production values of at least 32 characters. Development fallback secrets are accepted only outside production.

## Deployment Verification

After pushing to `main`:

1. GitHub Actions runs lint, format check, tests, TypeScript build, and Docker build.
2. The CI job starts a MongoDB service container and runs the Mongo-backed auth integration suite with `MONGODB_TEST_URI`.
3. Render builds with `npm install && npm run build`, then starts with `npm run start`.
4. The live smoke-test workflow verifies `/`, `/health`, `/ready`, `/metrics`, and Swagger markers on the deployed Render URL.

## Manual Smoke Test

```bash
curl -fsS https://deimr-backend-starter.onrender.com/health
curl -fsS https://deimr-backend-starter.onrender.com/ready
curl -fsS https://deimr-backend-starter.onrender.com/metrics
curl -fsS https://deimr-backend-starter.onrender.com/api/docs/swagger-ui-init.js
```

Expected production readiness:

- `/health` returns `status: "ok"`.
- `/ready` returns `status: "ready"` and `checks.database.ready: true`.
- Swagger has a non-empty production server URL.

## Incident Checklist

1. Check `/ready` to determine whether the API process is live but dependency readiness is failing.
2. Check Render logs for startup config errors, Mongo connection errors, or graceful shutdown messages.
3. Check MongoDB Atlas availability and connection string access rules.
4. Check GitHub Actions for the last CI and live smoke-test results.
5. Roll back to the last known good commit or redeploy the last passing Render deploy if a recent change caused the failure.

## Token Security Operations

Refresh tokens are stored as HMAC-SHA256 digests, not raw tokens. Refresh-token records include a token-family id. When a rotated token is reused, the API marks the whole family as reused and revoked.

MongoDB TTL indexes remove expired refresh-token records after their `expiresAt` time.
