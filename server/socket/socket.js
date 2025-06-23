import { Server } from 'socket.io';
import Payment from '../models/payment.js';
import logger from '../middlewares/logger.js';
import Subscription from '../models/subscription.js';

const initSocket = (server, corsOptions) => {
  const io = new Server(server, { cors: corsOptions });

  io.on('connection', (socket) => {
    logger.info('Client connected', { socketId: socket.id });

    socket.on('joinTransaction', async (transactionId) => {
      socket.join(transactionId);
      try {
        const payment = await Payment.findOne({ transactionId }).lean();
        if (payment) {
          const subscription = await Subscription.findOne({ transactionId }).lean();
          socket.emit('paymentStatus', {
            status: payment.status,
            transactionId,
            subscriptionStatus: subscription?.status || 'PENDING',
            data: payment.paymentDetails,
          });
          logger.info('Sent initial payment status', { transactionId, status: payment.status });
        } else {
          logger.warn('Payment not found for WebSocket', { transactionId });
        }
      } catch (error) {
        logger.error('Error fetching payment status for WebSocket', {
          message: error.message,
          stack: error.stack,
        });
      }
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected', { socketId: socket.id });
    });
  });

  const updatePaymentStatus = async (transactionId, status) => {
    try {
      const subscription = await Subscription.findOne({ transactionId }).lean();
      io.to(transactionId).emit('paymentStatus', {
        ...status,
        subscriptionStatus: subscription?.status || 'PENDING',
      });
      logger.info('Emitted payment status', { transactionId, status: status.status });
    } catch (error) {
      logger.error('Error emitting payment status', {
        message: error.message,
        stack: error.stack,
      });
    }
  };

  return { updatePaymentStatus };
};
export default initSocket;