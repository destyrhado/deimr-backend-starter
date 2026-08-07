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
    }).on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${env.port} is already in use. Please free port ${env.port} and try again.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
