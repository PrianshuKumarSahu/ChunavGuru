require('dotenv').config();
const express = require('express');
const path = require('path');
const securityMiddleware = require('./middleware/security');
const RateLimiter = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Middleware ---
app.use(...securityMiddleware());
app.use(express.json({ limit: '1mb' }));

// Rate limiting: 100 requests per minute for API routes
const apiLimiter = new RateLimiter({ windowMs: 60000, maxRequests: 100 });
app.use('/api', apiLimiter.middleware());

// --- Static Files ---
app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: '1d',
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
