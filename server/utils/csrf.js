import { csrfSync } from 'csrf-sync';

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
    return res.status(403).json({
      status: 403,
      success: false,
      message: "Invalid CSRF token",
      details: null,
    });
  },
});

const RevokeToken = (req) => {
  revokeToken(req);
  const newCsrfToken = generateToken(req);
  return newCsrfToken
}

export { csrfSynchronisedProtection, generateToken, revokeToken, RevokeToken };