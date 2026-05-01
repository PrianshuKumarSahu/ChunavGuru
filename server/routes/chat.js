const express = require('express');
const geminiService = require('../services/gemini');
const router = express.Router();

/**
 * POST /api/chat
 * Send a message to the AI election assistant.
 * Body: { message: string, history?: Array<{role: string, text: string}> }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message must be under 2000 characters.' });
    }

    // History is sanitized, slice to last 10
    const validHistory = Array.isArray(history)
      ? history.filter(h => h.role && h.text).slice(-10) // Keep last 10 messages
      : [];

    const response = await geminiService.chat(message.trim(), validHistory);
    res.json({ response });
  } catch (error) {
    console.error('[ChatRoute] Error:', error.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

module.exports = router;
