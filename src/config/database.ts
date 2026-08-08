import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

const connectionState = (state: number) => {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

export const connectDatabase = async () => {
  if (!env.mongoUri) {
    logger.warn(
      'MONGODB_URI is not configured; persistence endpoints will fail.',
    );
    return;
  }

  await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connection established.');
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed.');
  }
};

export const getDatabaseHealth = () => {
  const state = connectionState(mongoose.connection.readyState);
  const connected = state === 'connected';

  return {
    configured: Boolean(env.mongoUri) || connected,
    state,
    ready: connected,
  };
};
