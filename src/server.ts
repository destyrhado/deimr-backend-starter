import type { Server } from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  let server: Server | undefined;
  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.info(`${signal} received; shutting down gracefully.`);

    const forceExit = setTimeout(() => {
      logger.error('Graceful shutdown timed out.');
      process.exit(1);
    }, 10_000);
    forceExit.unref();

    try {
      await new Promise<void>((resolve, reject) => {
        if (!server) {
          resolve();
          return;
        }

        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
      await disconnectDatabase();
      logger.info('Graceful shutdown complete.');
      process.exit(0);
    } catch (error) {
      logger.error(`Graceful shutdown failed: ${(error as Error).message}`);
      process.exit(1);
    }
  };

  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      logger.info(`Server is running on http://localhost:${env.port}`);
    });

    server.on('error', (error: any) => {
      if (error?.code === 'EADDRINUSE') {
        logger.error(
          `Port ${env.port} is already in use. Please free port ${env.port} and try again.`,
        );
      } else {
        logger.error(`Server error: ${(error as Error).message}`);
      }
      process.exit(1);
    });

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('uncaughtException', (error) => {
      logger.error(`Uncaught exception: ${error.message}`);
      void shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
      logger.error(`Unhandled rejection: ${String(reason)}`);
      void shutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();
