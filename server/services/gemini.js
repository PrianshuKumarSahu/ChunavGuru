const { GoogleGenerativeAI } = require('@google/generative-ai');

/** System prompt that makes Gemini an Indian election expert */
const SYSTEM_PROMPT = `You are ChunavGuru, an expert AI assistant specialized in the Indian electoral system. Your role:

EXPERTISE:
- Indian Constitution's electoral provisions (Articles 324-329)
- Election Commission of India (ECI) structure and functions
- Lok Sabha, Rajya Sabha, State Assembly, and Local Body elections
- Electoral process: nominations, campaigning, polling, counting
- EVM and VVPAT systems
- Model Code of Conduct
- Voter registration and eligibility
- Electoral reforms and history
- Key constitutional amendments related to elections

GUIDELINES:
- Provide accurate, unbiased, and educational responses
- Use simple language that any citizen can understand
- Include relevant Article numbers or Act references when applicable
- Give examples from real Indian elections when helpful
- Keep responses concise (under 300 words) unless asked for detail
- If asked about non-election topics, politely redirect to election education
- Always encourage democratic participation and voter awareness`;

class GeminiService {
  constructor() {
    this.model = null;
    this._initialize();
  }

  _initialize() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('[GeminiService] No valid GEMINI_API_KEY found. Chatbot will use fallback responses.');
      return;
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
      });
      console.log('[GeminiService] Initialized successfully.');
    } catch (error) {
      console.error('[GeminiService] Initialization error:', error.message);
    }
  }

  /**
   * Send a message to Gemini and get a response.
   * Falls back to a helpful message if API is unavailable.
   */
  async chat(userMessage, history = []) {
    if (!this.model) {
      return this._fallbackResponse(userMessage);
    }

    let lastError;
    for (let i = 0; i < 3; i++) {
      try {
        const chat = this.model.startChat({
          history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }],
          })),
        });
        const result = await chat.sendMessage(userMessage);
        return result.response.text();
      } catch (error) {
        lastError = error;
        console.warn(`[GeminiService] Chat attempt ${i + 1} failed:`, error.message);
        if (i < 2) await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Backoff
      }
    }
    console.error('[GeminiService] All attempts failed:', lastError.message);
    return this._fallbackResponse(userMessage);
  }

  /** Provide helpful responses even without API access */
  _fallbackResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('vote') || q.includes('voting')) {
      return 'Every Indian citizen aged 18 and above can vote. You need a valid Voter ID (EPIC) card. Register at voters.eci.gov.in or through the Voter Helpline App. Voting is done through Electronic Voting Machines (EVMs) with VVPAT verification.';
    }
    if (q.includes('evm') || q.includes('machine')) {
      return 'EVMs (Electronic Voting Machines) have been used in Indian elections since 1982. Each EVM has a Control Unit and a Ballot Unit. Since 2017, VVPAT (Voter Verifiable Paper Audit Trail) machines are attached to EVMs for transparency.';
    }
    if (q.includes('election commission') || q.includes('eci')) {
      return 'The Election Commission of India (ECI) is an autonomous constitutional body established on 25th January 1950. It is responsible for conducting free and fair elections. It consists of the Chief Election Commissioner and two Election Commissioners.';
    }
    return 'ChunavGuru is here to help you learn about Indian elections! Ask me about the voting process, Election Commission, EVMs, election phases, or any aspect of Indian democracy. Note: For full AI-powered responses, please configure the Gemini API key.';
  }
}

module.exports = new GeminiService();
