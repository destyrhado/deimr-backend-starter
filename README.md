# Deimr Backend Starter API

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?logo=render&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A production ready backend starter built with **Node.js**, **TypeScript**, **Express.js**, and **MongoDB Atlas**.

I created this project as a reusable foundation for building secure, scalable, and maintainable REST APIs. It reflects the architecture, coding standards, and engineering practices I follow when developing production backend services.

Although inspired by the engineering practices used while building **Deimr**, this repository is completely independent and does **not** contain Deimr's production code, proprietary business logic, private infrastructure, credentials, or customer data.

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Swagger / OpenAPI
- Docker
- Render
- GitHub Actions
- ESLint
- Prettier

---

## Features

The project is designed to support production-oriented backend functionality including:

- User Registration
- User Login
- JWT Access Token Authentication
- Refresh Token Authentication
- Role-Based Access Control (RBAC)
- RESTful API Architecture
- API Versioning
- Request Validation
- Centralized Error Handling
- Structured Logging
- Environment-Based Configuration
- Swagger API Documentation
- Health Check Endpoint
- Pagination
- Filtering
- Sorting
- Docker Support
- Automated Testing
- CI/CD Pipeline

> Features should be marked as implemented only after the corresponding code has been added to the repository.

---

## Architecture

The project follows a layered backend architecture designed to keep application responsibilities separated and maintainable.

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
MongoDB Atlas
```

### Layer Responsibilities

**Routes**

Define application endpoints and connect HTTP requests to controllers.

**Controllers**

Handle requests and responses while keeping business logic outside the HTTP layer.

**Services**

Contain application and business logic.

**Repositories**

Handle database access and isolate persistence logic from the service layer.

**Models**

Define MongoDB schemas and application data structures.

**Middleware**

Handles authentication, authorization, validation, security, logging, and errors.

---

## Project Structure

```text
deimr-backend-starter/
│
├── src/
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── docs/
│   │   ├── openapi.ts
│   │   └── swagger.ts
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── validators/
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── package.json
├── prettier.config.js
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/destyrhado/deimr-backend-starter.git
```

Move into the project directory:

```bash
cd deimr-backend-starter
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Update `.env` with your local configuration.

Example:

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deimr_backend_starter

JWT_ACCESS_SECRET=your_access_token_secret

JWT_REFRESH_SECRET=your_refresh_token_secret

JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_EXPIRES_IN=7d
```

Never commit production credentials or real secrets to source control.

---

## Running the Application

### Development

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Compile the TypeScript application |
| `npm run start` | Run the production build |
| `npm test` | Execute unit and integration tests |
| `npm run test:coverage` | Generate test coverage |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix supported ESLint issues |
| `npm run format` | Format source code using Prettier |

---

## API Versioning

Application routes are versioned under:

```text
/api/v1
```

This allows future API versions to be introduced without breaking existing clients.

---

## API Endpoints

### Authentication

#### Register

```http
POST /api/v1/auth/register
```

#### Login

```http
POST /api/v1/auth/login
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

#### Logout

```http
POST /api/v1/auth/logout
```

---

### Users

#### List Users

```http
GET /api/v1/users
```

#### Get User

```http
GET /api/v1/users/:id
```

#### Update User

```http
PATCH /api/v1/users/:id
```

#### Delete User

```http
DELETE /api/v1/users/:id
```

---

## Health Check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "status": "ok",
  "service": "deimr-backend-starter"
}
```

The health endpoint can be used by deployment platforms, monitoring tools, and load balancers to verify that the application is running.

---

## Example Success Response

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "66b5e7d5",
    "email": "john@example.com"
  }
}
```

---

## Example Error Response

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized"
}
```

Consistent response structures make the API easier to integrate with frontend applications and external services.

---

## Swagger API Documentation

The API includes interactive **OpenAPI 3.0 documentation** using **Swagger UI**.

Swagger allows developers to inspect and test endpoints directly from the browser without requiring Postman or another external API client.

### Local Swagger

Start the API:

```bash
npm run dev
```

Then open:

```text
http://localhost:5000/api/docs
```

### Production Swagger

After deployment to Render:

```text
https://deimr-backend-starter.onrender.com/api/docs
```

### Swagger Features

- Interactive API Explorer
- JWT Bearer Authentication
- Request Schemas
- Response Schemas
- HTTP Status Codes
- Endpoint Documentation
- Try-It-Out API Testing
- API Version Information
- OpenAPI Specification

---

## Using JWT Authentication in Swagger

### 1. Register a user

```http
POST /api/v1/auth/register
```

### 2. Login

```http
POST /api/v1/auth/login
```

A successful login returns an access token.

Example:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Open Swagger UI

```text
http://localhost:5000/api/docs
```

### 4. Click `Authorize`

Enter:

```text
Bearer YOUR_ACCESS_TOKEN
```

### 5. Test Protected Endpoints

Swagger will include the JWT token when calling protected routes.

---

## Swagger Authentication Flow

```text
Register
   │
   ▼
Login
   │
   ▼
Receive JWT
   │
   ▼
Open Swagger
   │
   ▼
Authorize
   │
   ▼
Test Protected Endpoints
```

---

## Swagger Installation

```bash
npm install swagger-ui-express swagger-jsdoc
```

TypeScript definitions:

```bash
npm install -D @types/swagger-ui-express
```

---

## Swagger Configuration Example

```ts
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Deimr Backend Starter API",
      version: "1.0.0",
      description:
        "A production-ready REST API built with Node.js, TypeScript, Express.js, and MongoDB Atlas."
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development"
      },
      {
        url: "https://your-app.onrender.com",
        description: "Production"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: [
    "./src/routes/**/*.ts",
    "./src/docs/**/*.ts"
  ]
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
```

Swagger UI can then be registered in the Express application:

```ts
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
```

---

## Authentication

Authentication uses JWT access and refresh tokens.

Example authorization header:

```http
Authorization: Bearer <access_token>
```

The authentication layer is designed to support:

- Short-lived Access Tokens
- Refresh Tokens
- Protected Routes
- Role-Based Authorization
- Token Revocation
- Refresh Token Rotation

---

## Role-Based Access Control

Application permissions can be controlled using roles.

Example:

```text
USER
ADMIN
SUPER_ADMIN
```

A route can require a specific role before allowing access.

Example:

```text
GET /api/v1/users
Required Role: ADMIN
```

---

## Security

The project is designed to use common backend security practices including:

- JWT Authentication
- Refresh Tokens
- Password Hashing with bcrypt
- Role-Based Access Control
- Request Validation
- Helmet Security Headers
- CORS Configuration
- Rate Limiting
- Environment Variable Protection
- Centralized Error Handling
- Secure Password Storage
- Protected Routes

Security-sensitive data should never be returned in API responses or written to logs.

---

## Validation

Incoming requests should be validated before reaching application business logic.

Example input:

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

Invalid requests should return predictable errors.

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed"
}
```

---

## Error Handling

Errors are handled through centralized middleware.

This helps keep controllers clean and provides consistent error responses across the API.

Example:

```json
```
