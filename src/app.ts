import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import { swaggerSpec } from './docs/swagger.js';
import { swaggerCustomCss } from './docs/swagger.css.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { logger } from './config/logger.js';
import { requestContext } from './middleware/requestContext.js';
import { API_VERSION, SERVICE_NAME } from './constants/api.js';
import { metricsHandler, metricsMiddleware } from './middleware/metrics.js';
import { getDatabaseHealth } from './config/database.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(requestContext);
app.use(metricsMiddleware);
morgan.token('request-id', (req) => (req as Request).id ?? '-');
app.use(
  morgan(
    ':remote-addr :request-id - :method :url :status :res[content-length] - :response-time ms',
    { stream: logger.stream },
  ),
);
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Deimr Backend Starter API is running.' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: SERVICE_NAME,
    environment: env.nodeEnv,
    version: API_VERSION,
    status: 'ok',
    uptime: process.uptime(),
  });
});

app.get('/ready', (_req: Request, res: Response) => {
  const database = getDatabaseHealth();
  const ready = database.ready;

  res.status(ready ? 200 : 503).json({
    service: SERVICE_NAME,
    environment: env.nodeEnv,
    version: API_VERSION,
    status: ready ? 'ready' : 'not_ready',
    uptime: process.uptime(),
    checks: {
      database,
    },
  });
});

app.get('/metrics', metricsHandler);

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: swaggerCustomCss(env.nodeEnv),
    customSiteTitle: 'Deimr Backend Starter API',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: false,
      deepLinking: true,
      displayOperationId: false,
      tryItOutEnabled: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 2,
    },
  }),
);
app.use('/api/v1', apiRateLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
