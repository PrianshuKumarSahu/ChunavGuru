/**
 * Chatbot Component — AI-powered election Q&A using Gemini.
 */
class ChatbotComponent {
  constructor() {
    this.history = [];
  }

  render() {
    const suggestions = [
      'How does voting work in India?',
      'What is an EVM?',
      'Explain the election process',
      'Who can vote in India?',
      'What is NOTA?',
      'How is the PM elected?',
    ];

    const suggestionBtns = suggestions.map((s, i) =>
      `<button class="chat-suggestion-btn" data-question="${s}" id="chat-suggest-${i}">${s}</button>`
    ).join('');

    return `
      <div class="chat-container">
        <div class="chat-header">
          <span class="section-badge">🤖 AI-Powered</span>
          <h2 class="chat-header__title">Ask <span class="gradient-text">ChunavGuru</span></h2>
          <p class="chat-header__subtitle">Your AI election expert — powered by Google Gemini</p>
        </div>

        <div class="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
          <div class="chat-message">
            <div class="chat-message__avatar">🗳️</div>
            <div class="chat-message__bubble">
              Namaste! 🙏 I'm <strong>ChunavGuru</strong>, your AI guide to Indian elections. Ask me anything about the voting process, Election Commission, EVMs, election history, or your rights as a voter!
            </div>
          </div>
          <div class="chat-suggestions" id="chat-suggestions">${suggestionBtns}</div>
        </div>

        <div class="chat-input-area">
          <textarea class="chat-input" id="chat-input" placeholder="Ask about Indian elections..." rows="1" aria-label="Type your question" maxlength="2000"></textarea>
          <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">➤</button>
        </div>
      </div>
    `;
  }

  init() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');

    // Send message
    sendBtn.addEventListener('click', () => this._sendMessage());

    // Enter to send (Shift+Enter for new line)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // Suggestion buttons
    document.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.question;
        this._sendMessage();
      });
    });
  }

  async _sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    input.style.height = 'auto';

    // Hide suggestions after first message
    const suggestions = document.getElementById('chat-suggestions');
    if (suggestions) suggestions.style.display = 'none';

    // Add user message
    this._addMessage(message, 'user');

    // Add to history
    this.history.push({ role: 'user', text: message });

    // Show typing indicator
    const typingId = this._showTyping();

    // Disable input while waiting
    document.getElementById('chat-send-btn').disabled = true;

    try {
      const response = await window.apiService.chat(message, this.history.slice(-10));
      this._removeTyping(typingId);
      this._addMessage(response, 'bot');
      this.history.push({ role: 'model', text: response });
    } catch (error) {
      this._removeTyping(typingId);
      this._addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }

    document.getElementById('chat-send-btn').disabled = false;
    document.getElementById('chat-input').focus();
  }

  _addMessage(text, sender) {
    const messagesEl = document.getElementById('chat-messages');
    const isUser = sender === 'user';

    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${isUser ? 'chat-message--user' : ''}`;

    // Format text with basic markdown
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    messageEl.innerHTML = `
      <div class="chat-message__avatar">${isUser ? '👤' : '🗳️'}</div>
      <div class="chat-message__bubble">${formatted}</div>
    `;

    messagesEl.appendChild(messageEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  _showTyping() {
    const messagesEl = document.getElementById('chat-messages');
    const id = 'typing-' + Date.now();

    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message';
    typingEl.id = id;
    typingEl.innerHTML = `
      <div class="chat-message__avatar">🗳️</div>
      <div class="chat-message__bubble">
        <div class="chat-typing">
          <div class="chat-typing__dot"></div>
          <div class="chat-typing__dot"></div>
          <div class="chat-typing__dot"></div>
        </div>
      </div>
    `;

    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  _removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}

window.ChatbotComponent = new ChatbotComponent();
