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

  /**
   * Translate text(s) to the current language.
   * @param {string|string[]} contents - Single string or array of strings to translate.
   * @returns {Promise<string|string[]>} Translated text or array of translated texts.
   */
  async translate(contents) {
    if (this.currentLang === 'en') return contents;

    const isArray = Array.isArray(contents);
    const textArray = isArray ? contents : [contents];
    
    // Check cache and identify missing translations
    const results = new Array(textArray.length);
    const missingIndices = [];
    const missingTexts = [];

    textArray.forEach((text, idx) => {
      const cacheKey = `${this.currentLang}:${text}`;
      if (this.cache.has(cacheKey)) {
        results[idx] = this.cache.get(cacheKey);
      } else {
        missingIndices.push(idx);
        missingTexts.push(text);
      }
    });

    // Fetch missing translations in one batch
    if (missingTexts.length > 0) {
      try {
        const translatedBatch = await window.apiService.translate(missingTexts, this.currentLang);
        const translatedArray = Array.isArray(translatedBatch) ? translatedBatch : [translatedBatch];
        
        translatedArray.forEach((translated, i) => {
          const original = missingTexts[i];
          const cacheKey = `${this.currentLang}:${original}`;
          this.cache.set(cacheKey, translated);
          results[missingIndices[i]] = translated;
        });
      } catch (error) {
        console.warn('[Translate] Batch failed:', error.message);
        // Fallback: use original text for missing ones
        missingIndices.forEach((originalIdx, i) => {
          results[originalIdx] = missingTexts[i];
        });
      }
    }

    return isArray ? results : results[0];
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
