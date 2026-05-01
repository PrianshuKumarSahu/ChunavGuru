/**
 * Text-to-Speech client — uses the server TTS endpoint (Google Cloud TTS).
 * Falls back to browser SpeechSynthesis if server TTS is unavailable.
 */
class TTSClient {
  constructor() {
    this.audio = null;
    this.speaking = false;
  }

  /** Speak text using server TTS, with browser fallback */
  async speak(text, language = 'en') {
    if (this.speaking) this.stop();

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        this.audio = new Audio(url);
        this.speaking = true;

        this.audio.onended = () => {
          this.speaking = false;
          URL.revokeObjectURL(url);
        };

        this.audio.onerror = () => {
          this.speaking = false;
          URL.revokeObjectURL(url);
          this._browserFallback(text, language);
        };

        await this.audio.play();
        return;
      }
    } catch (error) {
      console.warn('[TTS] Server TTS failed, using browser fallback:', error.message);
    }

    this._browserFallback(text, language);
  }

  /** Browser SpeechSynthesis fallback */
  _browserFallback(text, language) {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    const langMap = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', bn: 'bn-IN' };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => { this.speaking = false; };
    this.speaking = true;
    window.speechSynthesis.speak(utterance);
  }

  /** Stop current speech */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
  }

  /** Check if currently speaking */
  isSpeaking() {
    return this.speaking;
  }
}

window.ttsClient = new TTSClient();
