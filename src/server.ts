import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    if (env.mongoUri) {
      await mongoose.connect(env.mongoUri);
    }

    app.listen(env.port, () => {
      console.log(`Server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
