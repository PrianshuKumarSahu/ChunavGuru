require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const securityMiddleware = require('./middleware/security');
const RateLimiter = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Middleware ---

// Enable CORS for cross-origin API access
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight for 24h
}));

// Enable gzip compression for all responses
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

app.use(...securityMiddleware());
app.use(express.json({ limit: '1mb' }));

// Rate limiting: 2000 requests per minute for API routes
const apiLimiter = new RateLimiter({ windowMs: 60000, maxRequests: 2000 });
app.use('/api', apiLimiter.middleware());

// --- Static Files ---
app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(jpg|jpeg|png|gif|svg|ico|json)$/)) {
      // Long-term cache for immutable assets
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.match(/\.(js|css)$/)) {
      // Mid-term cache for scripts and styles
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
  etag: true,
}));

// --- API Routes ---
app.use('/api/chat', require('./routes/chat'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/tts', require('./routes/tts'));

// Health check endpoint (used by Cloud Run & Docker healthcheck)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ChunavGuru',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --- SPA Fallback ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start Server ---
const server = app.listen(PORT, () => {
  console.log(`\n🗳️  ChunavGuru is running at http://localhost:${PORT}\n`);
});

// --- Graceful Shutdown ---
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  apiLimiter.destroy();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Export for testing
module.exports = app;
