import requestIp from 'request-ip';
import logger from '../middlewares/logger.js';

const getClientIp = (req) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        if (!clientIp) {
            logger.warn('Unable to determine client IP', { headers: req.headers });
            return 'unknown-ip';
        }
        return clientIp;
    } catch (error) {
        logger.error('Error extracting client IP', { error: error.message, headers: req.headers });
        return 'unknown-ip';
    }
};

export default getClientIp;