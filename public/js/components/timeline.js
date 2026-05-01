/**
 * Timeline Component — Visual history of Indian elections.
 */
class TimelineComponent {
  render() {
    const items = TIMELINE_DATA.map(item => `
      <div class="timeline-item" id="timeline-${item.id}">
        <div class="timeline-item__dot"></div>
        <div class="glass-card timeline-item__card">
          <div class="timeline-item__year">${item.year}</div>
          <h3 class="timeline-item__title">
            <span>${item.icon}</span> ${item.title}
          </h3>
          <p class="timeline-item__desc">${item.description}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="timeline-container">
        <div class="timeline-header">
          <span class="section-badge">📅 Electoral History</span>
          <h2 class="timeline-header__title">Key <span class="gradient-text">Milestones</span></h2>
          <p class="timeline-header__subtitle">From the first election to modern reforms — India's democratic journey</p>
        </div>
        <div class="timeline" role="list" aria-label="Election history timeline">
          ${items}
        </div>
      </div>
    `;
  }

  init() {
    // Animate items as they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item').forEach(item => {
      observer.observe(item);
    });
  }
}

window.TimelineComponent = new TimelineComponent();
