/**
 * Custom in-memory rate limiter middleware.
 * Tracks request counts per IP within a sliding time window.
 */
class RateLimiter {
  constructor({ windowMs = 60000, maxRequests = 100 } = {}) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.clients = new Map();
    this._cleanupInterval = setInterval(() => this._cleanup(), windowMs);
  }

  /** Remove expired client entries */
  _cleanup() {
    const now = Date.now();
    for (const [key, data] of this.clients) {
      if (now - data.startTime > this.windowMs) {
        this.clients.delete(key);
      }
    }
  }

  /** Express middleware function */
  middleware() {
    return (req, res, next) => {
      const clientIP = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!this.clients.has(clientIP)) {
        this.clients.set(clientIP, { count: 1, startTime: now });
        return next();
      }

      const client = this.clients.get(clientIP);

      // Reset window if expired
      if (now - client.startTime > this.windowMs) {
        client.count = 1;
        client.startTime = now;
        return next();
      }

      client.count++;

      if (client.count > this.maxRequests) {
        return res.status(429).json({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((client.startTime + this.windowMs - now) / 1000)
        });
      }

      next();
    };
  }

  /** Cleanup interval on shutdown */
  destroy() {
    clearInterval(this._cleanupInterval);
  }
}

module.exports = RateLimiter;
