const { TranslationServiceClient } = require('@google-cloud/translate');

/** Supported Indian languages with their BCP-47 codes */
const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  bn: 'Bengali',
  mr: 'Marathi',
  kn: 'Kannada',
  gu: 'Gujarati',
  ml: 'Malayalam',
  pa: 'Punjabi',
};

class TranslatorService {
  constructor() {
    this.client = null;
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || 'acoustic-atom-495011-a2';
    this._initialize();
  }

  _initialize() {
    try {
      this.client = new TranslationServiceClient();
      console.log('[TranslatorService] Initialized successfully.');
    } catch (error) {
      console.warn('[TranslatorService] Init warning:', error.message);
    }
  }

  /**
   * Translate text(s) to the target language.
   * @param {string|string[]} contents - Single string or array of strings to translate.
   * @param {string} targetLanguage - BCP-47 language code.
   * @returns {Promise<string|string[]>} Translated text or array of translated texts.
   */
  async translate(contents, targetLanguage) {
    const isArray = Array.isArray(contents);
    const textArray = isArray ? contents : [contents];

    if (!targetLanguage || targetLanguage === 'en') {
      return contents; // No translation needed for English
    }

    if (!SUPPORTED_LANGUAGES[targetLanguage]) {
      throw new Error(`Unsupported language: ${targetLanguage}`);
    }

    if (!this.client) {
      throw new Error('Translation service not available');
    }

    let lastError;
    for (let i = 0; i < 3; i++) {
      try {
        const request = {
          parent: `projects/${this.projectId}/locations/global`,
          contents: textArray,
          mimeType: 'text/html',
          targetLanguageCode: targetLanguage,
          sourceLanguageCode: 'en',
        };

        const [response] = await this.client.translateText(request);
        const results = response.translations.map(t => t.translatedText);
        
        return isArray ? results : results[0];
      } catch (error) {
        lastError = error;
        console.warn(`[TranslatorService] Translation attempt ${i + 1} failed:`, error.message);
      }
    }
    throw lastError;
  }

  /** Get list of supported languages */
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }
}

module.exports = new TranslatorService();
