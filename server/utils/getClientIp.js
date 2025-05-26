// utils/getClientIp.js
import requestIp from 'request-ip';
import logger from '../middlewares/logger.js';

const getClientIp = (req) => {
  try {
    if (!req) {
      logger.warn('Request object is undefined');
      return 'unknown-ip';
    }

    const clientIp = requestIp.getClientIp(req);
    if (!clientIp) {
      logger.warn('Unable to determine client IP', { headers: req.headers || {} });
      return 'unknown-ip';
    }

    logger.info('Client IP extracted', { clientIp, headers: req.headers || {} });
    return clientIp;
  } catch (error) {
    logger.error('Error extracting client IP', {
      error: error.message,
      stack: error.stack,
      headers: req.headers || {},
    });
    return 'unknown-ip';
  }
};

export default getClientIp;