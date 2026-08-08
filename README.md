# Deimr Backend Starter API

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

Production-oriented REST API starter built with Node.js, TypeScript, Express, MongoDB Atlas, JWT access/refresh tokens, RBAC, Swagger/OpenAPI, runtime metrics, Docker, GitHub Actions, and Render.

This repository is an independent public reference inspired by backend practices used while building Deimr. It does not contain Deimr production source code, proprietary business logic, private infrastructure, credentials, or customer data.

## Live Deployment

| Surface      | URL                                                   |
| ------------ | ----------------------------------------------------- |
| API root     | `https://deimr-backend-starter.onrender.com`          |
| Health check | `https://deimr-backend-starter.onrender.com/health`   |
| Metrics      | `https://deimr-backend-starter.onrender.com/metrics`  |
| Swagger UI   | `https://deimr-backend-starter.onrender.com/api/docs` |

The live service is hosted on Render. The repository includes `render.yaml`; production secrets are configured in Render, not committed to GitHub.

## Tech Stack

- Node.js 22 for local production parity, CI, Docker, and Render
- TypeScript 5
- Express 4
- MongoDB Atlas with Mongoose
- JWT authentication with refresh token rotation and revocation
- Swagger UI with OpenAPI 3.0.3
- Prometheus-style process metrics
- Docker and Docker Compose
- GitHub Actions CI
- ESLint and Prettier

## Implemented Features

- Public registration, login, token refresh, and logout
- JWT Bearer authentication with HMAC-hashed refresh token persistence
- Refresh token rotation, expiry checks, logout revocation, and token-family reuse detection
- Role-based access control for `USER`, `ADMIN`, and `SUPER_ADMIN`
- User profile read/update endpoints
- Admin user list/read/update/delete endpoints
- Super admin role update endpoint
- Pagination, search, role filtering, status filtering, and whitelisted sorting for user lists
- Request validation with consistent validation error payloads
- Centralized error handling with request IDs
- Helmet, CORS, rate limiting, and HTTP request logging
- Prometheus-style HTTP request metrics at `/metrics`
- Swagger/OpenAPI documentation and contract tests
- Unit, integration, and Mongo-backed auth-flow tests using `node:test`
- Docker, Docker Compose, GitHub Actions CI, and Render deployment config
- Live deployment smoke-test workflow

## Architecture

```text
Routes
  -> Controllers
  -> Services
  -> Repositories
  -> MongoDB Atlas
```

Responsibilities are split by layer:

- `routes`: endpoint registration and middleware wiring
- `controllers`: HTTP request/response handling
- `services`: application logic and authorization-sensitive business rules
- `repositories`: MongoDB persistence operations
- `models`: Mongoose schemas
- `middleware`: authentication, authorization, request IDs, rate limiting, and errors
- `docs`: Swagger/OpenAPI definition and Swagger UI styling
- `validators`: request payload validation

## Architectural Decisions

- The layered structure keeps HTTP concerns, application rules, and persistence code separate, which makes auth-sensitive behavior easier to test and review.
- Controllers stay thin and delegate authorization-sensitive behavior to services, where it can be exercised without depending on Express internals.
- Repositories isolate Mongoose access so query construction, pagination, and token persistence do not leak across controllers and services.
- JWT access tokens keep authenticated requests stateless, while persisted refresh-token digests allow rotation, expiry checks, and logout-based revocation.
- MongoDB Atlas with Mongoose fits the document-shaped user and refresh-token data model while keeping local setup and hosted deployment straightforward.

## Engineering Decisions

- Node 22, TypeScript, and ESM are used consistently across local development, CI, Docker, and Render.
- The project uses Node's built-in `node:test` runner to keep the test stack small while still covering unit, integration, RBAC, and OpenAPI contract behavior.
- Swagger/OpenAPI is treated as part of the API contract, with tests that keep documented endpoints, schemas, examples, and runtime behavior aligned.
- Validation and error handling are centralized so clients receive consistent response shapes with request IDs across public and protected endpoints.
- TypeScript and required type packages are production dependencies because the current Render build command compiles during deployment with `npm install && npm run build`.
- CI verifies linting, formatting, tests, TypeScript compilation, and Docker image construction before code is considered shippable.

## Project Structure

```text
deimr-backend-starter/
├── .github/workflows/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── docs/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   └── unit/
├── .dockerignore
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Local Setup

```bash
git clone https://github.com/destyrhado/deimr-backend-starter.git
cd deimr-backend-starter
npm install
cp .env.example .env
npm run dev
```

Default local API URL:

```text
http://localhost:5001
```

Local Swagger UI:

```text
http://localhost:5001/api/docs
```

## Environment Variables

| Variable                 |            Required | Default in code/example                   | Purpose                                                                                      |
| ------------------------ | ------------------: | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `PORT`                   |                  No | `5001`                                    | HTTP port                                                                                    |
| `NODE_ENV`               |                  No | `development`                             | Runtime environment                                                                          |
| `APP_URL`                |                  No | `http://localhost:5001` in `.env.example` | Public API URL used by Swagger; production also falls back to Render's `RENDER_EXTERNAL_URL` |
| `MONGODB_URI`            | Yes for persistence | empty                                     | MongoDB Atlas connection string                                                              |
| `MONGODB_TEST_URI`       |   Only for DB tests | empty                                     | Disposable MongoDB database used by the Mongo-backed auth integration suite                  |
| `JWT_ACCESS_SECRET`      |   Yes in production | `dev-access-secret`                       | Access token signing secret                                                                  |
| `JWT_REFRESH_SECRET`     |   Yes in production | `dev-refresh-secret`                      | Refresh token signing secret                                                                 |
| `JWT_ACCESS_EXPIRES_IN`  |                  No | `15m`                                     | Access token lifetime                                                                        |
| `JWT_REFRESH_EXPIRES_IN` |                  No | `7d`                                      | Refresh token lifetime                                                                       |
| `CORS_ORIGIN`            |                  No | `http://localhost:3000`                   | Allowed browser origin                                                                       |
| `RATE_LIMIT_WINDOW_MS`   |                  No | `900000`                                  | Rate limit window                                                                            |
| `RATE_LIMIT_MAX`         |                  No | `100`                                     | Requests allowed per window per IP                                                           |

## Scripts

| Command                 | What it does                                              |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Starts the development server with `tsx watch`            |
| `npm run build`         | Compiles TypeScript to `dist/`                            |
| `npm run start`         | Runs `dist/server.js`                                     |
| `npm run serve`         | Alias for `npm run start`                                 |
| `npm test`              | Runs unit and integration tests                           |
| `npm run test:coverage` | Runs `node:test` with Node's experimental coverage output |
| `npm run lint`          | Runs ESLint                                               |
| `npm run lint:fix`      | Runs ESLint with autofix                                  |
| `npm run format`        | Formats files with Prettier                               |
| `npm run format:check`  | Checks formatting with Prettier                           |
| `npm run ci`            | Runs lint, format check, tests, and build locally         |

## API Endpoints

| Method   | Path                     | Auth | Roles                          | Description                                                                           |
| -------- | ------------------------ | ---- | ------------------------------ | ------------------------------------------------------------------------------------- |
| `GET`    | `/`                      | No   | Public                         | API root status message                                                               |
| `GET`    | `/health`                | No   | Public                         | Service health payload                                                                |
| `GET`    | `/metrics`               | No   | Public                         | Prometheus-style process metrics                                                      |
| `GET`    | `/api/docs`              | No   | Public                         | Swagger UI                                                                            |
| `POST`   | `/api/v1/auth/register`  | No   | Public                         | Register a `USER` account                                                             |
| `POST`   | `/api/v1/auth/login`     | No   | Public                         | Login and receive access/refresh tokens                                               |
| `POST`   | `/api/v1/auth/refresh`   | No   | Public                         | Rotate refresh token and issue new tokens                                             |
| `POST`   | `/api/v1/auth/logout`    | No   | Public                         | Revoke a refresh token                                                                |
| `GET`    | `/api/v1/users/me`       | Yes  | `USER`, `ADMIN`, `SUPER_ADMIN` | Get authenticated profile                                                             |
| `PATCH`  | `/api/v1/users/me`       | Yes  | `USER`, `ADMIN`, `SUPER_ADMIN` | Update authenticated profile fields                                                   |
| `GET`    | `/api/v1/users`          | Yes  | `ADMIN`, `SUPER_ADMIN`         | List users with pagination/search/filter/sort                                         |
| `GET`    | `/api/v1/users/:id`      | Yes  | `ADMIN`, `SUPER_ADMIN`         | Get a user by MongoDB ObjectId                                                        |
| `PATCH`  | `/api/v1/users/:id`      | Yes  | `ADMIN`, `SUPER_ADMIN`         | Update user fields except role                                                        |
| `DELETE` | `/api/v1/users/:id`      | Yes  | `ADMIN`, `SUPER_ADMIN`         | Delete a user; self-delete is rejected                                                |
| `PATCH`  | `/api/v1/users/:id/role` | Yes  | `SUPER_ADMIN`                  | Update a user's role; self-role changes and demoting another super admin are rejected |

### User List Query Parameters

`GET /api/v1/users` supports:

| Query    | Default      | Notes                                                                                            |
| -------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `page`   | `1`          | Integer greater than or equal to 1                                                               |
| `limit`  | `20`         | Integer from 1 to 100                                                                            |
| `search` | none         | Case-insensitive search across name and email                                                    |
| `role`   | none         | `USER`, `ADMIN`, or `SUPER_ADMIN`; lowercase input is normalized                                 |
| `status` | none         | `ACTIVE`, `INACTIVE`, or `SUSPENDED`; lowercase input is normalized                              |
| `sort`   | `-createdAt` | One of `name`, `email`, `role`, `status`, `createdAt`, `updatedAt`, optionally prefixed with `-` |

## Response Shapes

Health response:

```json
{
  "service": "deimr-backend-starter",
  "environment": "production",
  "version": "1.0.0",
  "status": "ok",
  "uptime": 12.345
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>",
    "user": {
      "id": "66b7f1a2c0a4f7b5f0d9a111",
      "name": "Jane Doe",
      "email": "jane@example.test",
      "role": "USER",
      "status": "ACTIVE",
      "createdAt": "2026-08-08T00:00:00.000Z",
      "updatedAt": "2026-08-08T00:00:00.000Z"
    }
  },
  "statusCode": 200
}
```

Error response:

```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401,
  "requestId": "7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823"
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Invalid login data",
  "statusCode": 400,
  "requestId": "7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823",
  "errors": [
    {
      "field": "email",
      "message": "A valid email address is required."
    }
  ]
}
```

## Swagger

Swagger UI is mounted at `/api/docs`. The OpenAPI definition is built in `src/docs/swagger.ts` and re-exported from `src/docs/openapi.ts` for tests.

Swagger includes:

- OpenAPI `3.0.3`
- JWT Bearer auth
- Request schemas
- Success and error response schemas
- Role-labeled login examples using non-production `example.test` credentials
- Query parameter documentation for user listing
- Protected endpoint security declarations

To call protected endpoints in Swagger:

1. Register or login.
2. Copy `data.accessToken`.
3. Click `Authorize`.
4. Enter `Bearer <access-token>`.

## Testing and CI

Tests use Node's built-in `node:test` runner.

Current test coverage includes:

- `/health` unit and integration behavior
- Mongo-backed registration, login, profile, refresh rotation, refresh-token reuse detection, and logout behavior
- OpenAPI path/schema/query contract checks
- Documented unauthenticated endpoint behavior
- RBAC middleware behavior
- User list pagination/search/filter/sort logic

`MONGODB_TEST_URI` must point at a disposable database whose name includes `test`; the integration suite drops that database before and after the Mongo-backed auth test. GitHub Actions provides this through a MongoDB service container.

GitHub Actions runs on pushes to `main` and pull requests:

```text
npm ci
npm run lint
npm run format:check
npm test
npm run build
docker build -t deimr-backend-starter .
```

The live smoke-test workflow runs after successful CI on `main` and can also be triggered manually. It verifies the deployed Render root, health, metrics, and Swagger surfaces.

## Docker

Build:

```bash
docker build -t deimr-backend-starter .
```

Run:

```bash
docker run --env-file .env -p 5001:5001 deimr-backend-starter
```

Docker Compose:

```bash
docker compose up --build
docker compose down
```

## Render Deployment

The repository includes `render.yaml` for Render Blueprint deployment.

Render configuration:

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| Runtime           | Node                           |
| Node version      | `22.x`                         |
| Build command     | `npm install && npm run build` |
| Start command     | `npm run start`                |
| Health check path | `/health`                      |

Production secrets are not committed. Configure these in Render:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

`APP_URL` is optional on Render because the app falls back to Render's `RENDER_EXTERNAL_URL`. Set `APP_URL` only when using a custom domain or non-Render host.

The build command matches the current Render dashboard command. TypeScript and the type packages needed by `tsc` are listed under production dependencies so Render can compile even when dev dependencies are omitted during production builds.

## Future Improvements

- Add structured audit events for login, refresh-token rotation, logout, role changes, and admin user management.
- Add per-user session management so users can revoke individual active sessions.
- Expose a machine-readable OpenAPI JSON endpoint for external tooling in addition to the Swagger UI.
- Add production observability hooks for metrics scraping, uptime alerts, and centralized log shipping.
- Add a privileged admin bootstrap path or seed workflow for non-public admin account creation.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT access and refresh secrets must be strong production values and must not use the development defaults.
- Refresh tokens are returned to clients only at login/refresh time; the database stores HMAC-SHA256 token digests for lookup, rotation, revocation, and token-family reuse detection.
- Protected routes require Bearer tokens and role checks.
- Helmet, CORS, and rate limiting are enabled globally.
- Password hashes, JWT secrets, stored token digests, and MongoDB credentials are not returned in API responses.
- `.env`, `node_modules`, `dist`, and coverage output are excluded from Git.

## About Deimr

This repository is a public backend reference. It does not include:

- Deimr production source code
- Proprietary business logic
- Production credentials
- Private infrastructure configuration
- Customer information
- Internal APIs
- Payment infrastructure

## License

Released under the MIT License. See `LICENSE`.

## Author

Ibrahim Destiny

- GitHub: https://github.com/destyrhado
- LinkedIn: https://linkedin.com/in/ibrahim-destiny-a24062268
