/**
 * Server-side Unit Tests
 * Tests API route handlers, middleware, and service layer logic.
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');

// --- Rate Limiter Tests ---
describe('RateLimiter Middleware', () => {
  const RateLimiter = require('../server/middleware/rateLimit');

  it('should allow requests within the limit', () => {
    const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 5 });
    const middleware = limiter.middleware();

    let nextCalled = false;
    const req = { ip: '127.0.0.1', connection: { remoteAddress: '127.0.0.1' } };
    const res = {};
    const next = () => { nextCalled = true; };

    middleware(req, res, next);
    assert.strictEqual(nextCalled, true, 'next() should be called for first request');
    limiter.destroy();
  });

  it('should block requests exceeding the limit', () => {
    const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 2 });
    const middleware = limiter.middleware();

    let statusCode = null;
    let responseBody = null;
    const req = { ip: '192.168.1.1', connection: { remoteAddress: '192.168.1.1' } };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (body) => { responseBody = body; },
    };
    const next = () => {};

    // First two requests should pass
    middleware(req, res, next);
    middleware(req, res, next);

    // Third request should be blocked
    middleware(req, res, next);
    assert.strictEqual(statusCode, 429, 'Should return 429 status');
    assert.ok(responseBody.error, 'Should include error message');
    assert.ok(responseBody.retryAfter > 0, 'Should include retryAfter');
    limiter.destroy();
  });

  it('should track clients independently per IP', () => {
    const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 1 });
    const middleware = limiter.middleware();

    let callCount = 0;
    const next = () => { callCount++; };
    const res = { status: () => ({ json: () => {} }) };

    middleware({ ip: '10.0.0.1', connection: {} }, res, next);
    middleware({ ip: '10.0.0.2', connection: {} }, res, next);

    assert.strictEqual(callCount, 2, 'Different IPs should be tracked independently');
    limiter.destroy();
  });
});

// --- Security Middleware Tests ---
describe('Security Middleware', () => {
  const securityMiddleware = require('../server/middleware/security');

  it('should return an array of middleware functions', () => {
    const middlewares = securityMiddleware();
    assert.ok(Array.isArray(middlewares), 'Should return an array');
    assert.ok(middlewares.length >= 2, 'Should include Helmet + sanitizer');
  });

  it('sanitizer should clean XSS from request body', () => {
    const middlewares = securityMiddleware();
    const sanitizer = middlewares[middlewares.length - 1]; // Last one is the sanitizer

    const req = {
      body: {
        message: '<script>alert("xss")</script>Hello',
        nested: { value: 'test onmouseover="hack()"' },
      },
    };
    const res = {};
    let nextCalled = false;

    sanitizer(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true, 'next() should be called');
    assert.ok(!req.body.message.includes('<script>'), 'Script tags should be removed');
    assert.ok(!req.body.nested.value.includes('onmouseover'), 'Event handlers should be removed');
  });

  it('sanitizer should truncate long strings', () => {
    const middlewares = securityMiddleware();
    const sanitizer = middlewares[middlewares.length - 1];

    const longString = 'A'.repeat(10000);
    const req = { body: { text: longString } };

    sanitizer(req, {}, () => {});

    assert.ok(req.body.text.length <= 5000, 'Strings should be truncated to 5000 chars');
  });
});

// --- Gemini Service Tests ---
describe('GeminiService Fallback Responses', () => {
  const geminiService = require('../server/services/gemini');

  it('should return vote-related response for voting queries', () => {
    const response = geminiService._fallbackResponse('How do I vote?');
    assert.ok(response.includes('Voter ID') || response.includes('vote'), 'Should mention voting process');
  });

  it('should return EVM-related response for EVM queries', () => {
    const response = geminiService._fallbackResponse('What is an EVM?');
    assert.ok(response.includes('Electronic Voting Machine') || response.includes('EVM'), 'Should mention EVMs');
  });

  it('should return ECI response for election commission queries', () => {
    const response = geminiService._fallbackResponse('Tell me about the Election Commission');
    assert.ok(response.includes('Election Commission'), 'Should mention Election Commission');
  });

  it('should return generic response for unrelated queries', () => {
    const response = geminiService._fallbackResponse('random query xyz');
    assert.ok(response.includes('ChunavGuru'), 'Should mention ChunavGuru');
  });
});

// --- Translator Service Tests ---
describe('TranslatorService', () => {
  const translatorService = require('../server/services/translator');

  it('should return original text for English target', async () => {
    const result = await translatorService.translate('Hello World', 'en');
    assert.strictEqual(result, 'Hello World', 'English text should pass through unchanged');
  });

  it('should reject unsupported languages', async () => {
    await assert.rejects(
      () => translatorService.translate('Hello', 'xx'),
      { message: 'Unsupported language: xx' },
      'Should throw for unsupported language'
    );
  });

  it('should list all 10 supported languages', () => {
    const languages = translatorService.getSupportedLanguages();
    const codes = Object.keys(languages);
    assert.strictEqual(codes.length, 10, 'Should support exactly 10 languages');
    assert.ok(codes.includes('en'), 'Should include English');
    assert.ok(codes.includes('hi'), 'Should include Hindi');
    assert.ok(codes.includes('te'), 'Should include Telugu');
    assert.ok(codes.includes('ta'), 'Should include Tamil');
    assert.ok(codes.includes('bn'), 'Should include Bengali');
  });
});

// --- Server Configuration Tests ---
describe('Server Configuration', () => {
  it('should have valid package.json with required fields', () => {
    const pkg = require('../package.json');
    assert.ok(pkg.name, 'Should have a name');
    assert.ok(pkg.version, 'Should have a version');
    assert.ok(pkg.description, 'Should have a description');
    assert.ok(pkg.main, 'Should have a main entry point');
    assert.ok(pkg.scripts.start, 'Should have a start script');
    assert.ok(pkg.scripts.test, 'Should have a test script');
  });

  it('should list all required Google Cloud dependencies', () => {
    const pkg = require('../package.json');
    assert.ok(pkg.dependencies['@google/generative-ai'], 'Should depend on Google Generative AI');
    assert.ok(pkg.dependencies['@google-cloud/translate'], 'Should depend on Cloud Translation');
    assert.ok(pkg.dependencies['@google-cloud/text-to-speech'], 'Should depend on Cloud TTS');
    assert.ok(pkg.dependencies['express'], 'Should depend on Express');
    assert.ok(pkg.dependencies['helmet'], 'Should depend on Helmet');
  });

  it('Dockerfile should exist and use multi-stage build', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const dockerfile = fs.readFileSync(path.join(__dirname, '..', 'Dockerfile'), 'utf8');
    assert.ok(dockerfile.includes('FROM'), 'Dockerfile should have FROM directive');
    assert.ok(dockerfile.includes('AS builder'), 'Should use multi-stage build');
    assert.ok(dockerfile.includes('USER'), 'Should switch to non-root user');
    assert.ok(dockerfile.includes('HEALTHCHECK'), 'Should have a health check');
  });
});
