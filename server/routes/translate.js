const express = require('express');
const translatorService = require('../services/translator');
const { validate } = require('../middleware/validate');
const router = express.Router();

/**
 * POST /api/translate
 * Translate text to a target Indian language.
 * Body: { text: string, targetLanguage: string }
 */
router.post('/', validate('translate'), async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    const translated = await translatorService.translate(text, targetLanguage);
    res.json({ translatedText: translated, sourceLanguage: 'en', targetLanguage });
  } catch (error) {
    console.error('[TranslateRoute] Error:', error.message);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

/**
 * GET /api/translate/languages
 * Get list of supported languages.
 */
router.get('/languages', (req, res) => {
  res.json({ languages: translatorService.getSupportedLanguages() });
});

module.exports = router;
