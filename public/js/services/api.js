/**
 * API Client — handles all server communication.
 */
class ApiService {
  constructor() {
    this.baseUrl = '';
  }

  async _fetch(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`[API] ${url}:`, error.message);
      throw error;
    }
  }

  /** Send a chat message to the AI assistant */
  async chat(message, history = []) {
    const response = await this._fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
    const data = await response.json();
    return data.response;
  }

  /** Translate text to target language */
  async translate(text, targetLanguage) {
    const response = await this._fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLanguage }),
    });
    const data = await response.json();
    return data.translatedText;
  }

  /** Get supported languages */
  async getLanguages() {
    const response = await this._fetch('/api/translate/languages');
    const data = await response.json();
    return data.languages;
  }

  /** Health check */
  async health() {
    const response = await this._fetch('/api/health');
    return response.json();
  }
}

// Global singleton
window.apiService = new ApiService();
