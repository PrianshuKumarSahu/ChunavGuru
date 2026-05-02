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

  // --- DOM Reference Caching (Efficiency) ---
  const DOM = {
    headerTitle: document.getElementById('header-title'),
    pageContainer: document.getElementById('page-container'),
    langSelect: document.getElementById('lang-select'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    menuToggle: document.getElementById('menu-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    body: document.body,
  };

  /**
   * Initialize the application.
   * Sets up routing, theme, menu, and language features.
   * @returns {void}
   */
  function init() {
    setupRouting();
    setupThemeToggle();
    setupMobileMenu();
    setupLanguageSwitcher();
    navigateToHash();
  }

  /**
   * Set up the hash-based SPA router listener.
   * @returns {void}
   */
  function setupRouting() {
    window.addEventListener('hashchange', navigateToHash);
  }

  /**
   * Parse the URL hash and navigate to the corresponding page.
   * @returns {void}
   */
  function navigateToHash() {
    const hash = window.location.hash.replace('#/', '') || 'dashboard';
    const page = PAGE_TITLES[hash] ? hash : 'dashboard';
    navigateTo(page);
  }

  /**
   * Render a specific page component and update app state.
   * @param {string} page - The key of the page to navigate to (e.g., 'quiz', 'dashboard').
   * @returns {void}
   */
  function navigateTo(page) {
    if (!COMPONENTS[page]) return;

    currentPage = page;

    // Update page title using cached DOM
    if (DOM.headerTitle) {
      DOM.headerTitle.textContent = PAGE_TITLES[page];
      DOM.headerTitle.dataset.originalText = PAGE_TITLES[page];
    }
    document.title = `${PAGE_TITLES[page]} — ChunavGuru`;

    // Render page content
    if (!DOM.pageContainer) return;
    DOM.pageContainer.style.animation = 'none';
    DOM.pageContainer.offsetHeight; // Trigger reflow
    DOM.pageContainer.style.animation = '';
    DOM.pageContainer.innerHTML = COMPONENTS[page].render();

    // Initialize component
    COMPONENTS[page].init();

    // Check if we need to translate the newly loaded page
    const lang = DOM.langSelect?.value || 'en';
    if (lang !== 'en') {
      translateCurrentPage(lang);
    }

    // Update active nav links
    updateActiveNav(page);

    // Close mobile sidebar
    closeMobileSidebar();

    // Scroll to top
    if (DOM.pageContainer) DOM.pageContainer.parentElement.scrollTop = 0;
  }

  function updateActiveNav(page) {
    // Sidebar nav
    document.querySelectorAll('.sidebar__link').forEach(link => {
      const isActive = link.dataset.page === page;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    // Mobile nav
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      const isActive = link.dataset.page === page;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  /** 
   * Set up theme toggling logic (Dark/Light mode).
   * @returns {void}
   */
  function setupThemeToggle() {
    if (!DOM.themeToggle || !DOM.themeIcon || !DOM.body) return;

    // Load saved theme
    const saved = localStorage.getItem('chunavguru-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    DOM.themeIcon.textContent = saved === 'dark' ? '🌙' : '☀️';

    DOM.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('chunavguru-theme', next);
      DOM.themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  /** 
   * Set up mobile sidebar menu toggling.
   * @returns {void}
   */
  function setupMobileMenu() {
    if (!DOM.menuToggle || !DOM.sidebar || !DOM.sidebarOverlay) return;

    DOM.menuToggle.addEventListener('click', () => {
      DOM.sidebar.classList.toggle('open');
      DOM.sidebarOverlay.classList.toggle('active');
    });

    DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  /**
   * Close the mobile sidebar menu safely.
   * @returns {void}
   */
  function closeMobileSidebar() {
    DOM.sidebar?.classList.remove('open');
    DOM.sidebarOverlay?.classList.remove('active');
  }

  /** 
   * Set up language switcher logic using API batching.
   * @returns {void}
   */
  function setupLanguageSwitcher() {
    if (!DOM.langSelect) return;
    DOM.langSelect.addEventListener('change', () => {
      const lang = DOM.langSelect.value;
      if (window.translateClient) {
        window.translateClient.setLanguage(lang);
      }
      // Re-render current page to apply translations
      if (lang !== 'en') {
        translateCurrentPage(lang);
      }
    });
  }

  async function translateCurrentPage(lang) {
    const elements = Array.from(document.querySelectorAll(
      '.dashboard-hero__title, .dashboard-hero__subtitle, .stat-card__label, ' +
      '.feature-card__title, .feature-card__desc, ' +
      '.guide-header__title, .guide-header__subtitle, .guide-step__title, .guide-step__summary, .guide-step__detail-item, ' +
      '.timeline-header__title, .timeline-header__subtitle, .timeline-item__title, .timeline-item__desc, ' +
      '.quiz-header__title, .quiz-question__text, .quiz-option span, ' +
      '.flashcards-header__title, .flashcard__text, ' +
      '.chat-header__title, .chat-header__subtitle, .chat-suggestion-btn, .section-badge, ' +
      '.sidebar__link-text, #header-title'
    ));

    const textsToTranslate = elements.map(el => {
      if (!el.dataset.originalText) {
        el.dataset.originalText = el.innerHTML;
      }
      return el.dataset.originalText;
    });

    try {
      const translatedTexts = await window.translateClient.translate(textsToTranslate);
      elements.forEach((el, i) => {
        el.innerHTML = translatedTexts[i];
      });
      // Update HTML lang attribute for accessibility and SEO
      document.documentElement.setAttribute('lang', lang);
    } catch (e) {
      console.error('[App] Translation batch failed:', e.message);
    }
  }

  // Boot the app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
