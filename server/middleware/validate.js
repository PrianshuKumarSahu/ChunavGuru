/**
 * Input Validation Middleware
 * Provides reusable validation functions for API request bodies.
 * Follows the principle of fail-fast to prevent invalid data from reaching services.
 * @module middleware/validate
 */

/**
 * Validation rules for different API endpoints.
 * Each rule returns null if valid, or an error message string if invalid.
 */
const validators = {
  /**
   * Validate chat message request body.
   * @param {object} body - Request body
   * @returns {string|null} Error message or null
   */
  chat(body) {
    if (!body || typeof body !== 'object') {
      return 'Request body must be a JSON object.';
    }
    if (!body.message || typeof body.message !== 'string') {
      return 'Message is required and must be a string.';
    }
    if (body.message.trim().length === 0) {
      return 'Message cannot be empty.';
    }
    if (body.message.length > 2000) {
      return 'Message must be under 2000 characters.';
    }
    if (body.history && !Array.isArray(body.history)) {
      return 'History must be an array.';
    }
    return null;
  },

  /**
   * Validate translation request body.
   * @param {object} body - Request body
   * @returns {string|null} Error message or null
   */
  translate(body) {
    if (!body || typeof body !== 'object') {
      return 'Request body must be a JSON object.';
    }
    
    const { text, targetLanguage } = body;

    if (!text) {
      return 'Text is required.';
    }

    if (Array.isArray(text)) {
      if (text.length === 0) return 'Texts array cannot be empty.';
      if (text.length > 50) return 'Maximum 50 strings per batch.';
      for (const t of text) {
        if (typeof t !== 'string') return 'All texts must be strings.';
        if (t.length > 5000) return 'Each string must be under 5000 characters.';
      }
    } else if (typeof text !== 'string') {
      return 'Text must be a string or an array of strings.';
    } else if (text.length > 5000) {
      return 'Text must be under 5000 characters.';
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return 'Target language is required.';
    }
    const supportedLangs = ['en', 'hi', 'te', 'ta', 'bn', 'mr', 'kn', 'gu', 'ml', 'pa'];
    if (!supportedLangs.includes(targetLanguage)) {
      return `Unsupported language. Supported: ${supportedLangs.join(', ')}`;
    }
    return null;
  },

  /**
   * Validate TTS request body.
   * @param {object} body - Request body
   * @returns {string|null} Error message or null
   */
  tts(body) {
    if (!body || typeof body !== 'object') {
      return 'Request body must be a JSON object.';
    }
    if (!body.text || typeof body.text !== 'string') {
      return 'Text is required and must be a string.';
    }
    if (body.text.trim().length === 0) {
      return 'Text cannot be empty.';
    }
    if (body.text.length > 5000) {
      return 'Text must be under 5000 characters.';
    }
    return null;
  },
};

/**
 * Express middleware factory for request validation.
 * @param {string} type - Validation type ('chat', 'translate', 'tts')
 * @returns {Function} Express middleware function
 */
function validate(type) {
  return (req, res, next) => {
    const validator = validators[type];
    if (!validator) {
      return next();
    }
    const error = validator(req.body);
    if (error) {
      return res.status(400).json({ error, validationType: type });
    }
    next();
  };
}

module.exports = { validate, validators };
