/**
 * Flashcards Component — Flip cards with category filtering.
 */
class FlashcardsComponent {
  constructor() {
    this.cards = [];
    this.currentIndex = 0;
    this.selectedCategory = 'All';
  }

  render() {
    const categories = ['All', ...new Set(FLASHCARD_DATA.map(c => c.category))];
    const filterBtns = categories.map(c =>
      `<button class="flashcard-filter-btn ${c === 'All' ? 'active' : ''}" data-category="${c}" id="fc-filter-${c.replace(/\s/g,'')}">${c}</button>`
    ).join('');

    return `
      <div class="flashcards-container">
        <div class="flashcards-header">
          <span class="section-badge">🃏 Learn by Cards</span>
          <h2 class="flashcards-header__title">Election <span class="gradient-text">Flashcards</span></h2>
          <p style="color: var(--text-secondary); margin-top: var(--space-sm);">Click to flip • Swipe to navigate</p>
        </div>

        <div class="flashcard-filters" id="flashcard-filters">${filterBtns}</div>
        <div class="flashcard-counter" id="flashcard-counter">Card 1 of ${FLASHCARD_DATA.length}</div>

        <div class="flashcard-wrapper" id="flashcard-wrapper">
          <div class="flashcard" id="flashcard" role="button" tabindex="0" aria-label="Flashcard - click to flip">
            <div class="flashcard__face flashcard__front">
              <span class="flashcard__category" id="fc-category"></span>
              <div class="flashcard__text" id="fc-front-text"></div>
              <span class="flashcard__hint">Click to reveal answer</span>
            </div>
            <div class="flashcard__face flashcard__back">
              <span class="flashcard__category" id="fc-category-back"></span>
              <div class="flashcard__text" id="fc-back-text"></div>
              <button class="guide-step__tts-btn" id="fc-tts-btn" style="margin-top: var(--space-lg);" aria-label="Listen to this card">
                🔊 Listen
              </button>
            </div>
          </div>
        </div>

        <div class="flashcard-nav" id="flashcard-nav">
          <button class="flashcard-nav-btn" id="fc-prev" aria-label="Previous card">◀</button>
          <span id="fc-progress" style="color: var(--text-muted); font-size: var(--fs-sm);">1 / ${FLASHCARD_DATA.length}</span>
          <button class="flashcard-nav-btn" id="fc-next" aria-label="Next card">▶</button>
        </div>
      </div>
    `;
  }

  init() {
    this.cards = [...FLASHCARD_DATA];
    this.currentIndex = 0;

    this._showCard();

    // Flip card
    document.getElementById('flashcard').addEventListener('click', (e) => {
      if (e.target.closest('.guide-step__tts-btn')) return; // Don't flip on TTS button
      document.getElementById('flashcard').classList.toggle('flipped');
    });

    document.getElementById('flashcard').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('flashcard').classList.toggle('flipped');
      }
    });

    // Navigation
    document.getElementById('fc-prev').addEventListener('click', () => this._navigate(-1));
    document.getElementById('fc-next').addEventListener('click', () => this._navigate(1));

    // Category filters
    document.querySelectorAll('.flashcard-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.flashcard-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.category;
        this._filterCards();
      });
    });

    // TTS
    document.getElementById('fc-tts-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const card = this.cards[this.currentIndex];
      const text = `${card.front}. ${card.back}`;
      if (window.ttsClient.isSpeaking()) {
        window.ttsClient.stop();
      } else {
        window.ttsClient.speak(text, window.translateClient.getCurrentLanguage());
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this._navigate(-1);
      else if (e.key === 'ArrowRight') this._navigate(1);
    });

    // Swipe support
    this._setupSwipe();
  }

  _showCard() {
    if (this.cards.length === 0) return;
    const card = this.cards[this.currentIndex];
    document.getElementById('flashcard').classList.remove('flipped');

    document.getElementById('fc-category').textContent = card.category;
    document.getElementById('fc-category-back').textContent = card.category;
    document.getElementById('fc-front-text').textContent = card.front;
    document.getElementById('fc-back-text').textContent = card.back;

    document.getElementById('fc-progress').textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
    document.getElementById('flashcard-counter').textContent = `Card ${this.currentIndex + 1} of ${this.cards.length}`;
  }

  _navigate(direction) {
    this.currentIndex = (this.currentIndex + direction + this.cards.length) % this.cards.length;
    this._showCard();
  }

  _filterCards() {
    this.cards = this.selectedCategory === 'All'
      ? [...FLASHCARD_DATA]
      : FLASHCARD_DATA.filter(c => c.category === this.selectedCategory);
    this.currentIndex = 0;
    this._showCard();
  }

  _setupSwipe() {
    const wrapper = document.getElementById('flashcard-wrapper');
    let startX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 50) {
        this._navigate(diffX > 0 ? -1 : 1);
      }
    }, { passive: true });
  }
}

window.FlashcardsComponent = new FlashcardsComponent();
