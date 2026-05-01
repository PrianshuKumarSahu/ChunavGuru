/**
 * ChunavGuru Main App Controller
 * Handles routing, theme toggle, language switching, and navigation.
 */
(function () {
  'use strict';

  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    guide: 'Election Guide',
    timeline: 'Timeline',
    quiz: 'Quiz',
    flashcards: 'Flashcards',
    chat: 'AI Assistant',
  };

  const COMPONENTS = {
    dashboard: window.DashboardComponent,
    guide: window.GuideComponent,
    timeline: window.TimelineComponent,
    quiz: window.QuizComponent,
    flashcards: window.FlashcardsComponent,
    chat: window.ChatbotComponent,
  };

  let currentPage = 'dashboard';

  /** Initialize the app */
  function init() {
    setupRouting();
    setupThemeToggle();
    setupMobileMenu();
    setupLanguageSwitcher();
    navigateToHash();
  }

  /** Hash-based SPA router */
  function setupRouting() {
    window.addEventListener('hashchange', navigateToHash);
  }

  function navigateToHash() {
    const hash = window.location.hash.replace('#/', '') || 'dashboard';
    const page = PAGE_TITLES[hash] ? hash : 'dashboard';
    navigateTo(page);
  }

  function navigateTo(page) {
    if (!COMPONENTS[page]) return;

    currentPage = page;

    // Update page title
    document.getElementById('header-title').textContent = PAGE_TITLES[page];
    document.title = `${PAGE_TITLES[page]} — ChunavGuru`;

    // Render page content
    const container = document.getElementById('page-container');
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    container.style.animation = '';
    container.innerHTML = COMPONENTS[page].render();

    // Initialize component
    COMPONENTS[page].init();

    // Check if we need to translate the newly loaded page
    const lang = document.getElementById('lang-select').value;
    if (lang !== 'en') {
      translateCurrentPage(lang);
    }

    // Update active nav links
    updateActiveNav(page);

    // Close mobile sidebar
    closeMobileSidebar();

    // Scroll to top
    document.getElementById('main-content').scrollTop = 0;
  }

  function updateActiveNav(page) {
    // Sidebar nav
    document.querySelectorAll('.sidebar__link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
    // Mobile nav
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  /** Theme toggle (dark/light) */
  function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    // Load saved theme
    const saved = localStorage.getItem('chunavguru-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    icon.textContent = saved === 'dark' ? '🌙' : '☀️';

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('chunavguru-theme', next);
      icon.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  /** Mobile menu toggle */
  function setupMobileMenu() {
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
  }

  /** Language switcher */
  function setupLanguageSwitcher() {
    const select = document.getElementById('lang-select');
    select.addEventListener('change', () => {
      const lang = select.value;
      window.translateClient.setLanguage(lang);
      // Re-render current page to apply translations
      if (lang !== 'en') {
        translateCurrentPage(lang);
      }
    });
  }

  async function translateCurrentPage(lang) {
    // Translate visible text elements
    const elements = document.querySelectorAll(
      '.dashboard-hero__title, .dashboard-hero__subtitle, .stat-card__label, ' +
      '.feature-card__title, .feature-card__desc, ' +
      '.guide-header__title, .guide-header__subtitle, .guide-step__title, .guide-step__summary, .guide-step__detail-item, ' +
      '.timeline-header__title, .timeline-header__subtitle, .timeline-item__title, .timeline-item__desc, ' +
      '.quiz-header__title, .quiz-question__text, .quiz-option span, ' +
      '.flashcards-header__title, .flashcard__text, ' +
      '.chat-header__title, .chat-header__subtitle, .chat-suggestion-btn, .section-badge'
    );

    for (const el of elements) {
      if (!el.dataset.originalText) {
        el.dataset.originalText = el.textContent;
      }
      try {
        const translated = await window.translateClient.translate(el.dataset.originalText);
        el.textContent = translated;
      } catch (e) {
        // Keep original text on failure
      }
    }
  }

  // Boot the app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
