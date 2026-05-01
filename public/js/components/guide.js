/**
 * Guide Component — Step-by-step election process walkthrough.
 */
class GuideComponent {
  render() {
    const steps = GUIDE_DATA.map((step, idx) => `
      <div class="glass-card guide-step" id="guide-step-${step.id}" data-step="${idx}">
        <button class="guide-step__header" aria-expanded="false" aria-controls="guide-content-${step.id}">
          <span class="guide-step__icon">${step.icon}</span>
          <div class="guide-step__info">
            <div class="guide-step__title">Step ${step.id}: ${step.title}</div>
            <div class="guide-step__summary">${step.summary}</div>
          </div>
          <span class="guide-step__toggle" aria-hidden="true">▼</span>
        </button>
        <div class="guide-step__content" id="guide-content-${step.id}" role="region">
          <div class="guide-step__details">
            ${step.details.map(d => `<div class="guide-step__detail-item">${d}</div>`).join('')}
            ${step.funFact ? `<div class="guide-step__fun-fact">💡 <strong>Fun Fact:</strong> ${step.funFact}</div>` : ''}
            <button class="guide-step__tts-btn" data-tts-text="${this._escapeTTS(step)}" aria-label="Listen to this step">
              🔊 Listen
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const progressDots = GUIDE_DATA.map((step, idx) => `
      <span class="guide-progress__dot" data-step="${idx}" title="Step ${step.id}">${step.id}</span>
      ${idx < GUIDE_DATA.length - 1 ? '<span class="guide-progress__line"></span>' : ''}
    `).join('');

    return `
      <div class="guide-container">
        <div class="guide-header">
          <span class="section-badge">📖 Step-by-Step</span>
          <h2 class="guide-header__title">Indian <span class="gradient-text">Election Process</span></h2>
          <p class="guide-header__subtitle">Follow the complete journey from election announcement to government formation</p>
        </div>
        <div class="guide-progress" aria-label="Guide progress">${progressDots}</div>
        <div class="stagger-in">${steps}</div>
      </div>
    `;
  }

  _escapeTTS(step) {
    const text = `Step ${step.id}: ${step.title}. ${step.summary}. ${step.details.join('. ')}`;
    return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  init() {
    // Toggle step expansion
    document.querySelectorAll('.guide-step__header').forEach(header => {
      header.addEventListener('click', () => {
        const step = header.closest('.guide-step');
        const wasOpen = step.classList.contains('open');

        // Close all steps
        document.querySelectorAll('.guide-step').forEach(s => {
          s.classList.remove('open');
          s.querySelector('.guide-step__header').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked step
        if (!wasOpen) {
          step.classList.add('open');
          header.setAttribute('aria-expanded', 'true');

          const idx = parseInt(step.dataset.step);
          this._updateProgress(idx);
        }
      });
    });

    // Progress dot clicks
    document.querySelectorAll('.guide-progress__dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.step);
        const step = document.querySelector(`[data-step="${idx}"]`);
        if (step) {
          step.querySelector('.guide-step__header').click();
          step.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // TTS buttons
    document.querySelectorAll('.guide-step__tts-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.ttsText;
        if (window.ttsClient.isSpeaking()) {
          window.ttsClient.stop();
          btn.textContent = '🔊 Listen';
        } else {
          window.ttsClient.speak(text, window.translateClient.getCurrentLanguage());
          btn.textContent = '⏹️ Stop';
          // Reset button when speech ends
          setTimeout(() => { btn.textContent = '🔊 Listen'; }, 30000);
        }
      });
    });

    // Open first step by default
    const firstHeader = document.querySelector('.guide-step__header');
    if (firstHeader) firstHeader.click();
  }

  _updateProgress(activeIdx) {
    document.querySelectorAll('.guide-progress__dot').forEach((dot, idx) => {
      dot.classList.remove('active', 'completed');
      if (idx < activeIdx) dot.classList.add('completed');
      else if (idx === activeIdx) dot.classList.add('active');
    });
  }
}

window.GuideComponent = new GuideComponent();
