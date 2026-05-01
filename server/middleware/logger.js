/**
 * Structured Logger for Google Cloud
 * Outputs logs in JSON format compatible with Google Cloud Logging.
 * Provides severity-based logging and request context tracking.
 * @module middleware/logger
 */

/** Log severity levels aligned with Google Cloud Logging */
const SEVERITY = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

/**
 * Create a structured log entry compatible with Google Cloud Logging.
 * @param {string} severity - Log severity level
 * @param {string} message - Log message
 * @param {object} [context={}] - Additional context data
 * @returns {void}
 */
function log(severity, message, context = {}) {
  const entry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    service: 'chunav-guru',
    ...context,
  };

  if (severity === SEVERITY.ERROR || severity === SEVERITY.CRITICAL) {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/**
 * Express middleware that logs HTTP request/response details.
 * Tracks response time and status codes for monitoring.
 * @returns {Function} Express middleware function
 */
function requestLogger() {
  return (req, res, next) => {
    const start = Date.now();

    // Log after response is sent
    res.on('finish', () => {
      const duration = Date.now() - start;
      const entry = {
        httpRequest: {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          userAgent: req.get('User-Agent') || 'unknown',
          remoteIp: req.ip,
          latency: `${duration}ms`,
        },
      };

      // Only log API requests to reduce noise
      if (req.originalUrl.startsWith('/api')) {
        if (res.statusCode >= 500) {
          log(SEVERITY.ERROR, `${req.method} ${req.originalUrl} ${res.statusCode}`, entry);
        } else if (res.statusCode >= 400) {
          log(SEVERITY.WARNING, `${req.method} ${req.originalUrl} ${res.statusCode}`, entry);
        } else {
          log(SEVERITY.INFO, `${req.method} ${req.originalUrl} ${res.statusCode}`, entry);
        }
      }
    });

    next();
  };
}

module.exports = { log, requestLogger, SEVERITY };
