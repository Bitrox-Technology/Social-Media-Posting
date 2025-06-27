import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import http from 'http';
import router from "./routes/index.js";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize';
import sanitizeHtml from 'sanitize-html';
import hpp from 'hpp';
import compression from 'compression';
import { ApiError } from "./utils/ApiError.js";
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import i18n from "./utils/i18n.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import logger from "./middlewares/logger.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { csrfSynchronisedProtection, generateToken } from './utils/csrf.js';
import { INTERNAL_SERVER_ERROR } from "./utils/apiResponseCode.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import initSocket from "./socket/socket.js";
import { checkExpiredSubscriptions } from "./config/scheduler.js";


// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const corsOptions = {
  origin: [process.env.FRONTEND_CLIENT_URL || 'http://localhost:5173', process.env.FRONTEND_ADMIN_URL || 'http://localhost:5174', 'https://mercury-uat.phonepe.com'],
  methods: ["GET", "POST", "PUT", "DELETE", 'OPTIONS'],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", 'X-Requested-With', 'X-Merchant-Id', 'X-Transaction-Id'],
  credentials: true,
  exposedHeaders: ['Set-Cookie'],
}
const { updatePaymentStatus } = initSocket(server, corsOptions);

// Enable trust proxy for proper IP extraction
app.set('trust proxy', 1);


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'https://yourdomain.com'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(cors(corsOptions));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


// Data sanitization against NoSQL injection
app.use(mongoSanitize());


// Data sanitization against XSS using sanitize-html
app.use((req, res, next) => {
  const sanitizeObject = (obj, allowHtmlFields = []) => {
    if (!obj || typeof obj !== 'object') return obj;
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        // Allow HTML in specified fields (e.g., content)
        const options = allowHtmlFields.includes(key)
          ? {
            allowedTags: [
              'h2', 'h3', 'p', 'ul', 'ol', 'li', 'a', 'b', 'i', 'strong', 'em',
              'br', 'div', 'span', 'img', 'blockquote', 'code', 'pre', 'table',
              'thead', 'tr', 'th', 'td', 'tbody'
            ],
            allowedAttributes: {
              a: ['href', 'title', 'target'],
              img: ['src', 'alt', 'title'],
              div: ['class'],
              span: ['class'],
            },
            // Prevent XSS by disallowing scripts and unsafe attributes
            disallowedTagsMode: 'discard',
          }
          : {
            allowedTags: [], // Strip all tags for other fields
            allowedAttributes: {},
          };
        obj[key] = sanitizeHtml(obj[key], options);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key], allowHtmlFields);
      }
    });
    return obj;
  };

  // Sanitize request body, query, and params
  if (req.body) {
    req.body = sanitizeObject(req.body, ['content']); // Allow HTML in content
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
});
// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// Morgan logging
morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms');
app.use(morgan('custom'));


app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: req.headers,
  });
  next();
});
// Session middleware
app.use(session({
  secret: process.env.CSRF_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
    autoRemove: 'native',
  }).on('error', (error) => {
    logger.error('MongoStore error', { message: error.message, stack: error.stack });
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
    domain: process.env.DOMAIN,
    path: '/',
  },
}), (req, res, next) => {
  logger.info('Session details', {
    sessionID: req.sessionID,
    csrfToken: req.session.csrfToken,
    headers: req.headers,
  });
  next()
});

app.use((req, res, next) => {
  try {
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.getClientIp ? req.getClientIp(req) : 'unknown',
      headers: req.headers || {},
      sessionID: req.sessionID,
    });
  } catch (error) {
    logger.error('Logging middleware error', { message: error.message, stack: error.stack });
  }
  next();
});

app.use((req, res, next) => {
  try {
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateToken(req);
      req.session.csrfTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
      req.session.modified = true;
      logger.info('CSRF token generated', {
        sessionID: req.sessionID,
        csrfToken: req.session.csrfToken,
        expiresAt: req.session.csrfTokenExpiresAt,
      });
    }
    res.locals.csrfToken = req.session.csrfToken;
    logger.info('CSRF token state', {
      sessionID: req.sessionID,
      csrfToken: req.session.csrfToken,
      method: req.method,
      path: req.path,
    });
  } catch (error) {
    logger.error('Failed to generate CSRF token', { message: error.message, stack: error.stack });
    return res.status(INTERNAL_SERVER_ERROR).json(new ApiResponse(INTERNAL_SERVER_ERROR, null, i18n.__("FAILED_GENERATE_CSRF")));
  }
  next();
});

app.use('/api/v1', (req, res, next) => {
  if (req.path === '/csrf/csrf-token') {
    return next(); // Skip CSRF protection for token fetch
  }
  csrfSynchronisedProtection(req, res, (err) => {
    if (err) {
      logger.error('CSRF validation failed', {
        message: err.message,
        sessionID: req.sessionID,
        receivedToken: req.get('X-CSRF-Token') || 'none',
        expectedToken: req.session.csrfToken || 'none',
      });
      return res.status(403).json(new ApiResponse(403, null, i18n.__("INVALID_CSRF_TOKEN")));
    }
    logger.info('CSRF validation passed', {
      sessionID: req.sessionID,
      receivedToken: req.get('X-CSRF-Token') || 'none',
      expectedToken: req.session.csrfToken || 'none',
      method: req.method,
      path: req.path,
    });
    next();
  });
});

app.use(globalRateLimiter);

// Initialize i18n
app.use(i18n.init);

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

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use("/api/v1", router);

app.set('updatePaymentStatus', updatePaymentStatus);
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
    checkExpiredSubscriptions();
    server.listen(PORT, () => {
      logger.info(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed", { message: err.message, stack: err.stack });
    process.exit(1);
  });