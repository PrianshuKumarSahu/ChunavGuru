const express = require('express');
const translatorService = require('../services/translator');
const router = express.Router();

/**
 * POST /api/translate
 * Translate text to a target Indian language.
 * Body: { text: string, targetLanguage: string }
 */
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required.' });
    }
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return res.status(400).json({ error: 'Target language is required.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text must be under 5000 characters.' });
    }

    const translated = await translatorService.translate(text, targetLanguage);
    res.json({ translatedText: translated, sourceLanguage: 'en', targetLanguage });
  } catch (error) {
    console.error('[TranslateRoute] Error:', error.message);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

/**
 * POST /api/translate/batch
 * Translate multiple texts efficiently.
 * Body: { texts: string[], targetLanguage: string }
 */
router.post('/batch', async (req, res) => {
  try {
    const { texts, targetLanguage } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required.' });
    }
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return res.status(400).json({ error: 'Target language is required.' });
    }
    
    const translated = await translatorService.translate(texts, targetLanguage);
    res.json({ translatedTexts: translated, sourceLanguage: 'en', targetLanguage });
  } catch (error) {
    console.error('[TranslateRoute] Batch Error:', error.message);
    res.status(500).json({ error: 'Batch translation failed.' });
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
