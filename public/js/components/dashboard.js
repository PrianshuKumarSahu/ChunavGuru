/**
 * Dashboard Component — Landing page with hero, stats, and feature cards.
 */
class DashboardComponent {
  render() {
    return `
      <section class="dashboard-hero" aria-label="Welcome section">
        <div class="particles" id="particles" aria-hidden="true"></div>
        <div style="position: relative; z-index: 1;">
          <span class="section-badge">🇮🇳 Your Election Education Hub</span>
          <h2 class="dashboard-hero__title">
            Learn <span class="gradient-text">Indian Democracy</span><br>the Interactive Way
          </h2>
          <p class="dashboard-hero__subtitle">
            Quizzes, flashcards, timelines, and an AI-powered assistant — everything you need to understand how India votes.
          </p>
        </div>
      </section>

      <section aria-label="Election statistics">
        <h3 style="font-size: var(--fs-lg); margin-bottom: var(--space-lg);">📊 India's Democracy in Numbers</h3>
        <div class="stats-grid stagger-in" id="stats-grid">
          <div class="glass-card stat-card">
            <div class="stat-card__number gradient-text" data-count="968">0</div>
            <div class="stat-card__label">Million Eligible Voters (2024)</div>
          </div>
          <div class="glass-card stat-card">
            <div class="stat-card__number" style="color: var(--green)" data-count="543">0</div>
            <div class="stat-card__label">Lok Sabha Constituencies</div>
          </div>
          <div class="glass-card stat-card">
            <div class="stat-card__number" style="color: var(--navy-light)" data-count="4120">0</div>
            <div class="stat-card__label">State Assembly Seats</div>
          </div>
          <div class="glass-card stat-card">
            <div class="stat-card__number" style="color: var(--gold)" data-count="18">0</div>
            <div class="stat-card__label">General Elections Since 1951</div>
          </div>
        </div>
      </section>

      <section aria-label="Features">
        <h3 style="font-size: var(--fs-lg); margin-bottom: var(--space-lg);">🚀 Explore Features</h3>
        <div class="features-grid stagger-in" id="features-grid">
          <div class="glass-card feature-card" data-navigate="guide" role="button" tabindex="0" id="feature-guide">
            <span class="feature-card__icon">📖</span>
            <h4 class="feature-card__title">Election Guide</h4>
            <p class="feature-card__desc">Step-by-step walkthrough of the entire Indian election process from announcement to government formation.</p>
          </div>
          <div class="glass-card feature-card" data-navigate="timeline" role="button" tabindex="0" id="feature-timeline">
            <span class="feature-card__icon">📅</span>
            <h4 class="feature-card__title">Timeline</h4>
            <p class="feature-card__desc">Journey through key milestones in Indian electoral history from 1950 to present day.</p>
          </div>
          <div class="glass-card feature-card" data-navigate="quiz" role="button" tabindex="0" id="feature-quiz">
            <span class="feature-card__icon">🧠</span>
            <h4 class="feature-card__title">Interactive Quiz</h4>
            <p class="feature-card__desc">Test your knowledge with 30+ questions across multiple categories with instant feedback.</p>
          </div>
          <div class="glass-card feature-card" data-navigate="flashcards" role="button" tabindex="0" id="feature-flashcards">
            <span class="feature-card__icon">🃏</span>
            <h4 class="feature-card__title">Flashcards</h4>
            <p class="feature-card__desc">Master key election concepts with interactive flip cards covering terms, articles, and processes.</p>
          </div>
          <div class="glass-card feature-card" data-navigate="chat" role="button" tabindex="0" id="feature-chat">
            <span class="feature-card__icon">🤖</span>
            <h4 class="feature-card__title">AI Assistant</h4>
            <p class="feature-card__desc">Ask ChunavGuru anything about Indian elections — powered by Google Gemini AI.</p>
          </div>
          <div class="glass-card feature-card" style="cursor: default;" id="feature-languages">
            <span class="feature-card__icon">🌐</span>
            <h4 class="feature-card__title">10 Languages</h4>
            <p class="feature-card__desc">Available in English, Hindi, Telugu, Tamil, Bengali, Marathi, Kannada, Gujarati, and more.</p>
          </div>
        </div>
      </section>
    `;
  }

  init() {
    this._animateCounters();
    this._createParticles();
    this._bindFeatureCards();
  }

  _animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(el => {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(animate);
    });
  }

  _createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['#FF6B35', '#2ECC71', '#FFFFFF'];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 6 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --tx: ${(Math.random() - 0.5) * 200}px;
        --ty: ${-Math.random() * 300 - 100}px;
        animation-duration: ${Math.random() * 5 + 5}s;
        animation-delay: ${Math.random() * 3}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      container.appendChild(particle);
    }
  }

  _bindFeatureCards() {
    document.querySelectorAll('.feature-card[data-navigate]').forEach(card => {
      const handler = () => {
        window.location.hash = '#/' + card.dataset.navigate;
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') handler(); });
    });
  }
}

window.DashboardComponent = new DashboardComponent();
