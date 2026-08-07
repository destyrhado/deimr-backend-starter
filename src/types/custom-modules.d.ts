declare module 'bcryptjs';

declare module 'swagger-ui-express' {
  import type { Handler } from 'express';
  const swaggerUi: {
    serve: Handler;
    setup: (swaggerSpec: unknown) => Handler;
  };
  export default swaggerUi;
}
