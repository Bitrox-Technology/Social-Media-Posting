import { schedule } from 'node-cron';
import Subscription from '../models/subscription.js';
import logger from '../middlewares/logger.js';

const checkExpiredSubscriptions = () => {
  schedule('0 0 * * *', async () => { // Run daily at midnight
    try {
      const now = new Date();
      const expiredSubscriptions = await Subscription.find({
        status: 'ACTIVE',
        expiryDate: { $lte: now },
      });

      for (const subscription of expiredSubscriptions) {
        subscription.status = 'EXPIRED';
        await subscription.save();
        logger.info('Subscription expired', {
          subscriptionId: subscription._id,
          userId: subscription.userId,
          planTitle: subscription.planTitle,
        });
      }
      logger.info('Checked expired subscriptions', { count: expiredSubscriptions.length });
    } catch (error) {
      logger.error('Failed to check expired subscriptions', {
        message: error.message,
        stack: error.stack,
      });
    }
  });
};

export { checkExpiredSubscriptions };