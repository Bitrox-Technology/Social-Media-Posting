import rateLimit from 'express-rate-limit';
import { config } from '../config/constant.js';
import getClientIp from '../utils/getClientIp.js';
import logger from './logger.js';
import {ApiError} from "../utils/ApiError.js"


const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = getClientIp(req);
    logger.info('Global rate limit check', { ip, path: req.path });
    return ip;
  },
  message: (req, res) => {
    const resetTime = new Date(Date.now() + config.rateLimit.global.windowMs);
    logger.warn('Global rate limit exceeded', { ip: getClientIp(req), path: req.path });
    return {
      success: false,
      message: 'Too many requests, please try again later.',
      resetTime,
    };
  },
  statusCode: 429,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});


const otpGeneratorRateLimiter = rateLimit({
  windowMs: config.rateLimit.otp.windowMs,
  max: config.rateLimit.otp.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body.email?.toLowerCase();
    if (!email) {
      logger.warn('Email missing for OTP rate limiting', { body: req.body });
      throw new ApiError('Email is required for OTP rate limiting');
    }
    logger.info('OTP rate limit check', { email });
    return `otp:${email}`;
  },
  message: (req, res) => {
    const resetTime = new Date(Date.now() + config.rateLimit.otp.windowMs);
    logger.warn('OTP rate limit exceeded', { email: req.body.email?.toLowerCase() });
    return {
      success: false,
      message: 'Too many OTP requests, please wait before trying again.',
      resetTime,
    };
  },
  statusCode: 429,
  skipFailedRequests: true,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

export { globalRateLimiter, otpGeneratorRateLimiter };