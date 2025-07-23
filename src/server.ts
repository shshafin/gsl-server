/* eslint-disable no-console */
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

const port = config.port;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

connectDB();

// Start server **only in local/dev**
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running locally on port ${port}`);
  });

  process.on('unhandledRejection', () => {
    console.log('😈🙉 UnhandledRejection detected. Shutting down...');
    process.exit(1);
  });

  process.on('uncaughtException', () => {
    console.log('😈🙉 UncaughtException detected. Shutting down...');
    process.exit(1);
  });
}

// Export for Vercel
export default app;
