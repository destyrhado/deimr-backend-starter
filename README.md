# Production REST API

A production-ready REST API built with **Node.js**, **TypeScript**, **Express.js**, and **MongoDB Atlas**.

This project demonstrates how I design and build scalable backend applications using clean architecture, secure authentication, automated testing, API documentation, and modern software engineering practices. It serves as a foundation for developing secure, maintainable, and production-ready REST APIs.

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB Atlas
- JWT Authentication
- Swagger (OpenAPI)
- Docker
- AWS Elastic Beanstalk
- GitHub Actions

---

## Current Features

- User Registration
- User Authentication (JWT)
- Role-Based Authorization
- RESTful API Architecture
- Request Validation
- Centralized Error Handling
- Logging
- Environment Configuration
- Interactive Swagger API Documentation

> Additional features will be implemented as the project evolves.

---

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
├── docs/
├── app.ts
└── server.ts

tests/
├── unit/
└── integration/
```

---

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

Create the environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

---

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

Never commit production credentials or secrets to the repository.

---

## API Endpoints

### Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

### Users

```text
GET    /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

---

## API Documentation

Interactive API documentation is available through **Swagger UI**.

Once deployed:

```text
Swagger UI
https://your-app.elasticbeanstalk.com/api/docs
```

Swagger allows developers to:

- Browse all available endpoints
- Authenticate using JWT Bearer tokens
- Test API requests directly from the browser
- View request and response schemas
- Explore the API without external tools

---

## Deployment

The application will be deployed using:

- AWS Elastic Beanstalk
- MongoDB Atlas
- GitHub Actions

Production URLs:

```text
API
https://your-app.elasticbeanstalk.com

Health Check
https://your-app.elasticbeanstalk.com/health

Swagger
https://your-app.elasticbeanstalk.com/api/docs
```

---

## Development Principles

This project follows a few core engineering principles:

- Clean Architecture
- Separation of Concerns
- Service & Repository Pattern
- REST API Best Practices
- Secure Authentication
- Environment-based Configuration
- Centralized Error Handling
- Production-ready Project Structure

---

## Testing

Run all tests:

```bash
npm test
```

Generate coverage:

```bash
npm run test:coverage
```

---

## Docker

Build the application:

```bash
docker build -t production-rest-api .
```

Run the container:

```bash
docker run -p 5000:5000 --env-file .env production-rest-api
```

---

## CI/CD

GitHub Actions will automatically:

- Install dependencies
- Run ESLint
- Execute unit and integration tests
- Build the TypeScript application
- Deploy to AWS Elastic Beanstalk

---

## Roadmap

Planned improvements include:

- Refresh Token Rotation
- Email Verification
- Password Reset
- AWS S3 File Upload
- Redis Caching
- Rate Limiting
- Unit & Integration Testing
- API Versioning
- Monitoring & Logging
- Docker Compose
- Production Deployment

---

## Status

🚧 **Active Development**

This project is being developed incrementally to demonstrate production-level backend engineering practices. New features, improvements, and deployment workflows will be added over time.

---

## Author

**Ibrahim Destiny**

Full-Stack Software Engineer

- Node.js
- TypeScript
- Express.js
- MongoDB
- AWS
- Software Architecture
- SaaS Development
