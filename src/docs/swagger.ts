import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Deimr Backend Starter API',
    version: '1.0.0',
    description: 'A production-ready starter API built with Node.js, TypeScript, Express, and MongoDB.'
  },
  servers: [
    { url: 'https://deimr-backend-starter.onrender.com', description: 'Production' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['./src/routes/**/*.ts', './src/docs/**/*.ts']
});
