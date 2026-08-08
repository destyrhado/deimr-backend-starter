# Deimr Backend Starter API

![Node.js](https://img.shields.io/badge/Node.js-20.16%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

Production-oriented REST API starter built with Node.js, TypeScript, Express, MongoDB Atlas, JWT access/refresh tokens, RBAC, Swagger/OpenAPI, Docker, GitHub Actions, and Render.

This repository is an independent public reference inspired by backend practices used while building Deimr. It does not contain Deimr production source code, proprietary business logic, private infrastructure, credentials, or customer data.

## Live Deployment

| Surface      | URL                                                   |
| ------------ | ----------------------------------------------------- |
| API root     | `https://deimr-backend-starter.onrender.com`          |
| Health check | `https://deimr-backend-starter.onrender.com/health`   |
| Swagger UI   | `https://deimr-backend-starter.onrender.com/api/docs` |

The live service is hosted on Render. The repository includes `render.yaml`; production secrets are configured in Render, not committed to GitHub.

## Tech Stack

- Node.js 20.16+; CI, Docker, and Render are configured for Node.js 22
- TypeScript 5
- Express 4
- MongoDB Atlas with Mongoose
- JWT authentication with refresh token rotation and revocation
- Swagger UI with OpenAPI 3.0.3
- Docker and Docker Compose
- GitHub Actions CI
- ESLint and Prettier

## Implemented Features

- Public registration, login, token refresh, and logout
- JWT Bearer authentication
- Refresh token persistence, rotation, expiry checks, and revocation
- Role-based access control for `USER`, `ADMIN`, and `SUPER_ADMIN`
- User profile read/update endpoints
- Admin user list/read/update/delete endpoints
- Super admin role update endpoint
- Pagination, search, role filtering, status filtering, and whitelisted sorting for user lists
- Request validation with consistent validation error payloads
- Centralized error handling with request IDs
- Helmet, CORS, rate limiting, and HTTP request logging
- Swagger/OpenAPI documentation and contract tests
- Unit and integration tests using `node:test`
- Docker image and Docker Compose local runtime
- Render Blueprint deployment config
- GitHub Actions CI for lint, format, tests, and build

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

## Project Structure

```text
deimr-backend-starter/
├── .github/workflows/ci.yml
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
- OpenAPI path/schema/query contract checks
- Documented unauthenticated endpoint behavior
- RBAC middleware behavior
- User list pagination/search/filter/sort logic

GitHub Actions runs on pushes to `main` and pull requests:

```text
npm ci
npm run lint
npm run format:check
npm test
npm run build
```

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

| Setting           | Value                     |
| ----------------- | ------------------------- |
| Runtime           | Node                      |
| Node version      | `22`                      |
| Build command     | `npm ci && npm run build` |
| Start command     | `npm run start`           |
| Health check path | `/health`                 |

Production secrets are not committed. Configure these in Render:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

`APP_URL` is optional on Render because the app falls back to Render's `RENDER_EXTERNAL_URL`. Set `APP_URL` only when using a custom domain or non-Render host.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT access and refresh secrets must be strong production values.
- Refresh tokens are stored, rotated on refresh, and revocable on logout.
- Protected routes require Bearer tokens and role checks.
- Password hashes, JWT secrets, refresh tokens, and MongoDB credentials are not returned in API responses.
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
