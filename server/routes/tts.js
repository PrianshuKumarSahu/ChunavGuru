const express = require('express');
const ttsService = require('../services/ttsService');
const { validate } = require('../middleware/validate');
const router = express.Router();

/**
 * POST /api/tts
 * Convert text to speech audio (MP3).
 * Body: { text: string, language?: string }
 */
router.post('/', validate('tts'), async (req, res) => {
  try {
    const { text, language } = req.body;

    // Map language code to TTS language code
    const langMap = {
      en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN',
      bn: 'bn-IN', mr: 'mr-IN', kn: 'kn-IN', gu: 'gu-IN',
      ml: 'ml-IN', pa: 'pa-IN',
    };
    const langCode = langMap[language] || 'en-IN';

    const audioContent = await ttsService.synthesize(text.trim(), langCode);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioContent.length,
      'Cache-Control': 'public, max-age=86400', // Cache audio for 24h
    });
    res.send(audioContent);
  } catch (error) {
    console.error('[TTSRoute] Error:', error.message);
    res.status(500).json({ error: 'Text-to-speech failed. Please try again.' });
  }
});

module.exports = router;
