const express = require('express');
const geminiService = require('../services/gemini');
const { validate } = require('../middleware/validate');
const router = express.Router();

/**
 * POST /api/chat
 * Send a message to the AI election assistant.
 * Body: { message: string, history?: Array<{role: string, text: string}> }
 */
router.post('/', validate('chat'), async (req, res) => {
  try {
    const { message, history } = req.body;

    // History is sanitized, slice to last 10
    const validHistory = Array.isArray(history)
      ? history.filter(h => h.role && h.text).slice(-10)
      : [];

    const response = await geminiService.chat(message.trim(), validHistory);
    res.json({ response });
  } catch (error) {
    console.error('[ChatRoute] Error:', error.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

module.exports = router;
