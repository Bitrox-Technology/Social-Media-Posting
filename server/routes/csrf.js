import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { INTERNAL_SERVER_ERROR, OK } from "../utils/apiResponseCode.js";
import i18n from "../utils/i18n.js";
import { generateToken } from "../utils/csrf.js";
import logger from "../middlewares/logger.js";
import { ApiError } from "../utils/ApiError.js";
const csrfRouter = Router()

csrfRouter.get('/csrf-token', (req, res) => {
 try {
   let csrfToken = req.session.csrfToken;
   let expiresAt = req.session.csrfTokenExpiresAt;
 
   // Generate new token if missing or expired
   if (!csrfToken || !expiresAt || Date.now() > expiresAt) {
     csrfToken = generateToken(req);
     expiresAt = Date.now() + 24 * 60 * 60 * 1000;
     req.session.csrfToken = csrfToken;
     req.session.csrfTokenExpiresAt = expiresAt;
     req.session.modified = true;
   }
   logger.info('CSRF token provided', {
     sessionID: req.sessionID,
     csrfToken,
     expiresAt,
     ip: req.getClientIp ? req.getClientIp() : 'unknown',
   });
   res.status(OK).json(new ApiResponse(OK, { csrfToken, expiresAt }, i18n.__("CSRF_TOKEN")));
 } catch (error) {
    logger.error('Failed to provide CSRF token', {
      message: error.message,
      stack: error.stack,
      sessionID: req.sessionID,
      ip: req.getClientIp ? req.getClientIp() : 'unknown',
    });
    throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__('FAILED_GENERATE_CSRF'));
 }
})

export default csrfRouter