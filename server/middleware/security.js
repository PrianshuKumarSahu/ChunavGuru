const helmet = require('helmet');

/**
 * Security middleware stack:
 * - Helmet for standard security headers
 * - Custom input sanitization to prevent XSS
 */
function securityMiddleware() {
  return [
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
          mediaSrc: ["'self'", "blob:"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
    // Input sanitization middleware
    (req, res, next) => {
      if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
      }
      next();
    }
  ];
}

/** Recursively sanitize all string values in an object */
function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .trim()
        .slice(0, 5000); // Limit input length
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

module.exports = securityMiddleware;
