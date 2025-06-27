import mongoose from 'mongoose';
import logger from '../middlewares/logger.js'; // Assuming this is your winston logger

const connectDB = async () => {

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const dbUrl = NODE_ENV === 'production' ? process.env.MONGODB_ATLAS_URL : process.env.MONGODB_URL;
  const dbName = NODE_ENV === 'production' ? process.env.ATLAS_DB_NAME : process.env.DB_NAME;
  try {

    logger.info('Attempting to connect to MongoDB', {
      url: dbUrl,
      dbName: dbName,
    });

    // Connect to MongoDB with connection pool settings
    const connectionInstance = await mongoose.connect(
      `${dbUrl}/${dbName}`,
      {
        maxPoolSize: 50,
        minPoolSize: 5,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000,
      }
    );

    // Log successful connection
    logger.info('MongoDB connected successfully', {
      host: connectionInstance.connection.host,
      port: connectionInstance.connection.port,
      dbName: connectionInstance.connection.name,
    });
  } catch (error) {
    // Log the error with stack trace
    logger.error('MongoDB connection failed', {
      error: error.message,
      stack: error.stack,
    });

    // Retry logic: Attempt to reconnect up to 3 times with a 5-second delay
    const maxRetries = 3;
    let attempt = 1;
    while (attempt <= maxRetries) {
      try {
        logger.info(`Retrying MongoDB connection (attempt ${attempt}/${maxRetries})`);
        const connectionInstance = await mongoose.connect(
          `${dbUrl}/${dbName}`,
          {
            maxPoolSize: 50,
            minPoolSize: 5,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 30000,
          }
        );
        logger.info('MongoDB connected successfully after retry', {
          host: connectionInstance.connection.host,
          port: connectionInstance.connection.port,
          dbName: connectionInstance.connection.name,
        });
        return; // Exit the retry loop on success
      } catch (retryError) {
        logger.error('MongoDB retry failed', {
          attempt,
          error: retryError.message,
          stack: retryError.stack,
        });
        if (attempt === maxRetries) {
          logger.error('All MongoDB connection retries failed. Exiting process.');
          process.exit(1);
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        attempt++;
      }
    }
  }

  // Set up connection event listeners for monitoring
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected successfully');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', {
      error: error.message,
      stack: error.stack,
    });
  });
};

export default connectDB;