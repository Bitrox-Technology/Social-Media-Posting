import { csrfSync } from 'csrf-sync';
import { ApiError } from './apiError.js';
import { FORBIDDEN } from './apiResponseCode.js';
import i18n from './i18n.js';

const { csrfSynchronisedProtection, generateToken, revokeToken } = csrfSync({
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
  getSessionIdentifier: (req) => req.sessionID,
  size: 64,
  saltSize: 8,
  onCSRFError: (err, req, res, next) => {
    logger.error('CSRF Error', {
      message: err.message,
      sessionID: req.sessionID,
      method: req.method,
      path: req.path,
      headers: req.headers,
    });
    throw new ApiError(FORBIDDEN, i18n.__("INVALID_CSRF_TOKEN"))
  },
});

const RevokeToken = (req) => {
  revokeToken(req);
  const newCsrfToken = generateToken(req);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  req.session.csrfToken = newCsrfToken;
  req.session.csrfTokenExpiresAt = expiresAt;
  return {newCsrfToken, expiresAt}
}

export { csrfSynchronisedProtection, generateToken, revokeToken, RevokeToken };