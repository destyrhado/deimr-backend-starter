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
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { logger } from './config/logger.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(morgan('combined', { stream: logger.stream }));
app.use(apiRateLimiter);
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Deimr Backend Starter API is running.' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', service: 'deimr-backend-starter' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
