const textToSpeech = require('@google-cloud/text-to-speech');

class TTSService {
  constructor() {
    this.client = null;
    this._initialize();
  }

  _initialize() {
    try {
      this.client = new textToSpeech.TextToSpeechClient();
      console.log('[TTSService] Initialized successfully.');
    } catch (error) {
      console.warn('[TTSService] Init warning:', error.message);
    }
  }

  /**
   * Convert text to speech audio.
   * @param {string} text - Text to synthesize
   * @param {string} languageCode - BCP-47 language code (e.g., 'en-IN', 'hi-IN')
   * @returns {Buffer} MP3 audio data
   */
  async synthesize(text, languageCode = 'en-IN') {
    if (!this.client) {
      throw new Error('Text-to-Speech service not available');
    }

    // Truncate text to avoid API limits
    const truncatedText = text.slice(0, 5000);

    const voiceMap = {
      'en-IN': { name: 'en-IN-Standard-A', ssmlGender: 'FEMALE' },
      'hi-IN': { name: 'hi-IN-Standard-A', ssmlGender: 'FEMALE' },
      'te-IN': { name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
      'ta-IN': { name: 'ta-IN-Standard-A', ssmlGender: 'FEMALE' },
      'bn-IN': { name: 'bn-IN-Standard-A', ssmlGender: 'FEMALE' },
      'mr-IN': { name: 'mr-IN-Standard-A', ssmlGender: 'FEMALE' },
      'kn-IN': { name: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' },
      'gu-IN': { name: 'gu-IN-Standard-A', ssmlGender: 'FEMALE' },
      'ml-IN': { name: 'ml-IN-Standard-A', ssmlGender: 'FEMALE' },
      'pa-IN': { name: 'pa-IN-Standard-A', ssmlGender: 'FEMALE' },
    };

    const voice = voiceMap[languageCode] || voiceMap['en-IN'];

    try {
      const [response] = await this.client.synthesizeSpeech({
        input: { text: truncatedText },
        voice: {
          languageCode: languageCode,
          name: voice.name,
          ssmlGender: voice.ssmlGender,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95,
          pitch: 0,
        },
      });

      return response.audioContent;
    } catch (error) {
      console.error('[TTSService] Synthesis error:', error.message);
      throw error;
    }
  }
}

module.exports = new TTSService();
