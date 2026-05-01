/**
 * Translation client — uses server translation endpoint (Google Cloud Translation).
 * Caches translations to reduce API calls.
 */
class TranslateClient {
  constructor() {
    this.cache = new Map();
    this.currentLang = 'en';
  }

  /** Set the current language */
  setLanguage(lang) {
    this.currentLang = lang;
  }

  /** Translate text to the current language */
  async translate(text) {
    if (this.currentLang === 'en') return text;

    const cacheKey = `${this.currentLang}:${text}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    try {
      const translated = await window.apiService.translate(text, this.currentLang);
      this.cache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.warn('[Translate] Failed:', error.message);
      return text; // Return original text on failure
    }
  }

  /** Get current language */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /** Clear the translation cache */
  clearCache() {
    this.cache.clear();
  }
}

window.translateClient = new TranslateClient();
