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

  /** Translate text to the target language */
  async translate(text, targetLanguage) {
    if (!targetLanguage || targetLanguage === 'en') {
      return text; // No translation needed for English
    }

    if (!SUPPORTED_LANGUAGES[targetLanguage]) {
      throw new Error(`Unsupported language: ${targetLanguage}`);
    }

    if (!this.client) {
      throw new Error('Translation service not available');
    }

    try {
      const request = {
        parent: `projects/${this.projectId}/locations/global`,
        contents: [text],
        mimeType: 'text/html',
        targetLanguageCode: targetLanguage,
        sourceLanguageCode: 'en',
      };

      const [response] = await this.client.translateText(request);
      return response.translations[0].translatedText;
    } catch (error) {
      console.error('[TranslatorService] Translation error:', error.message);
      throw error;
    }
  }

  /** Get list of supported languages */
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }
}

module.exports = new TranslatorService();
