import winston from 'winston';
import { config } from '../config/constant.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    // Log to console (always enabled)
    new winston.transports.Console(),
    // Log to /tmp/logs in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: path.join('/tmp', 'logs', 'error.log'),
            level: 'error'
          }),
          new winston.transports.File({
            filename: path.join('/tmp', 'logs', 'combined.log')
          })
        ]
      : [
          // Local file logging
          new winston.transports.File({
            filename: path.join(__dirname, '../logs', 'error.log'),
            level: 'error'
          }),
          new winston.transports.File({
            filename: path.join(__dirname, '../logs', 'combined.log')
          })
        ])
  ]
});

// Ensure /tmp/logs exists in production (optional, as winston creates it)
if (process.env.NODE_ENV === 'production') {
  import('fs').then(fs => {
    const logDir = '/tmp/logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  });
}

export default logger;