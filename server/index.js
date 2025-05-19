import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import morgan from "morgan";
import helmet from "helmet";
import { ApiError } from "./utils/ApiError.js";
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import i18n from "./utils/i18n.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import logger from "./middlewares/logger.js";
import mongoose from "mongoose";

// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable trust proxy for proper IP extraction
app.set('trust proxy', 1); // Trust the first proxy (adjust based on your setup)

// Middleware
app.use(express.json());

// Initialize i18n
app.use(i18n.init);

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    credentials: true,
  })
);

// Morgan logging with custom format
morgan.format("custom", ":method :url :status :res[content-length] - :response-time ms");
app.use(morgan("custom"));

// Request logging with Winston (in addition to Morgan)
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: req.headers,
  });
  next();
});

// Apply global rate limiter to all routes
app.use(globalRateLimiter);

// Security headers with Helmet
app.use(helmet());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Set i18n locale based on request headers
app.use(function (req, res, next) {
  if (req.headers && req.headers.lang && req.headers.lang == 'ar') {
    i18n.setLocale(req.headers.lang);
  } else if (req.headers && req.headers.lang && req.headers.lang == 'sp') {
    i18n.setLocale(req.headers.lang);
  } else {
    i18n.setLocale('en');
  }
  next();
});

// Routes
app.use("/api/v1", router);

// Error handling middleware
app.use(function (err, req, res, next) {
  // Log the error with Winston
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Standardize the error response structure
  const status = err.status || err.statusCode || 500; // Default to 500 for server errors
  const response = {
    status,
    success: false,
    message: '',
    details: null,
  };

  // if (err instanceof ApiError) {
  //   return res.status(err.statusCode).json({
  //     status: err.statusCode,
  //     message: err.message,
  //     data: err.data,
  //     success: err.success,
  //     errors: err.errors,
  //   });
  // }

  // Handle specific error types
  if (err.message === "jwt expired" || err.message === "Authentication error") {
    response.status = 401;
    response.message = err.message;
  } else if (err instanceof ApiError) {
    response.status = err.statusCode;
    response.message = err.message;
    response.details = {
      data: err.data,
      errors: err.errors,
    };
  } else if (err.status === 429) {
    response.status = 429;
    response.message = err.message || "Too many requests";
    response.details = { resetTime: err.resetTime || new Date(Date.now() + 15 * 60 * 1000) };
  } else if (err.status === 503) {
    response.status = 503;
    response.message = "Service temporarily unavailable";
  } else {
    // Generic error: avoid exposing sensitive info
    response.message = err.message || "An unexpected error occurred";
    response.status = status;
    if (process.env.NODE_ENV !== 'production') {
      response.details = { stack: err.stack }; // Include stack trace in development only
    }
  }

  // Send the response
  return res.status(response.status).json(response);
});

// Connect to MongoDB and start the server
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
  process.exit(1); // Exit to prevent running in an undefined state
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason.message || reason, promise });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down: Closing MongoDB connection');
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
  process.exit(0);
});

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed", { message: err.message, stack: err.stack });
    process.exit(1);
  });