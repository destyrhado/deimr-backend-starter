# Production REST API

A backend REST API built with Node.js, TypeScript, Express.js, and MongoDB.

I created this project to demonstrate how I structure and develop backend applications with a focus on maintainability, security, testing, and deployment.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- JWT
- Docker
- AWS
- GitHub Actions

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- RESTful API design
- Request validation
- Centralized error handling
- Logging
- Pagination and filtering
- Environment-based configuration
- API documentation
- Docker support
- Automated testing
- CI/CD workflow

## Project Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── repositories/
├── routes/
├── services/
├── types/
├── utils/
├── validators/
├── app.ts
└── server.ts

tests/
├── unit/
└── integration/
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/destyrhado/production-rest-api.git
cd production-rest-api
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

## Environment Variables

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Never commit real credentials or production secrets to the repository.

## API

The API will include endpoints for authentication, users, roles, and application resources.

Example:

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

GET    /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

## Development Standards

The project follows a few principles:

- Keep controllers small
- Separate business logic into services
- Validate incoming data
- Use consistent API responses
- Handle errors centrally
- Keep secrets outside the source code
- Write tests for important application behavior
- Run automated checks before deployment

## Testing

```bash
npm test
```

For coverage:

```bash
npm run test:coverage
```

## Docker

Build the application:

```bash
docker build -t production-rest-api .
```

Run the container:

```bash
docker run -p 5000:5000 --env-file .env production-rest-api
```

## CI/CD

GitHub Actions will be used to automatically:

1. Install dependencies
2. Run linting
3. Run tests
4. Build the TypeScript application

Deployment will only proceed when the required checks pass.

## Status

This project is under active development.

I'm adding each part incrementally so the repository reflects the same development process I use when building larger applications.

## Author

**Ibrahim Destiny**

Full-Stack Software Engineer

- Node.js
- TypeScript
- Vue.js
- AWS
- SaaS Development
- Software Architecture
