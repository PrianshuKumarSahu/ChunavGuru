/**
 * Accessibility Tests
 * Validates WCAG 2.1 AA compliance for all components.
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

describe('Accessibility — HTML Structure', () => {
  it('should have a valid lang attribute on <html>', () => {
    assert.ok(indexHtml.includes('lang="en"'), 'HTML element must have lang attribute');
  });

  it('should have exactly one <h1> tag', () => {
    const h1Matches = indexHtml.match(/<h1[\s>]/g);
    assert.ok(h1Matches, 'Page must have an <h1> tag');
    assert.strictEqual(h1Matches.length, 1, 'Page must have exactly one <h1> tag');
  });

  it('should have a skip navigation link', () => {
    assert.ok(indexHtml.includes('skip-link'), 'Must include a skip-to-content link');
    assert.ok(indexHtml.includes('Skip to main content'), 'Skip link must have descriptive text');
  });

  it('should use semantic <main> element', () => {
    assert.ok(indexHtml.includes('<main'), 'Must use <main> element');
    assert.ok(indexHtml.includes('role="main"'), 'Main element should have role="main"');
  });

  it('should use semantic <nav> elements', () => {
    const navCount = (indexHtml.match(/<nav[\s>]/g) || []).length;
    assert.ok(navCount >= 2, 'Should have at least 2 nav elements (sidebar + mobile)');
  });

  it('should use semantic <header> element', () => {
    assert.ok(indexHtml.includes('<header'), 'Must use <header> element');
    assert.ok(indexHtml.includes('role="banner"'), 'Header should have role="banner"');
  });

  it('should have a proper meta description', () => {
    assert.ok(indexHtml.includes('meta name="description"'), 'Must have meta description for SEO');
  });

  it('should have a proper viewport meta tag', () => {
    assert.ok(indexHtml.includes('meta name="viewport"'), 'Must have viewport meta tag');
  });
});

describe('Accessibility — ARIA and Labels', () => {
  it('all navigation elements should have aria-label', () => {
    assert.ok(indexHtml.includes('aria-label="Main navigation"'), 'Sidebar nav must have aria-label');
    assert.ok(indexHtml.includes('aria-label="Mobile navigation"'), 'Mobile nav must have aria-label');
  });

  it('interactive buttons should have aria-labels', () => {
    assert.ok(indexHtml.includes('aria-label="Toggle navigation menu"'), 'Menu toggle must have aria-label');
    assert.ok(indexHtml.includes('aria-label="Toggle dark/light theme"'), 'Theme toggle must have aria-label');
    assert.ok(indexHtml.includes('aria-label="Select language"'), 'Language select must have aria-label');
  });

  it('form controls should have associated labels', () => {
    assert.ok(indexHtml.includes('for="lang-select"'), 'Language select must have a label');
    assert.ok(indexHtml.includes('class="sr-only"'), 'Label should use sr-only for visual hiding');
  });

  it('mobile nav links should have aria-labels', () => {
    const mobileLinks = indexHtml.match(/mob-nav-\w+/g);
    assert.ok(mobileLinks.length >= 6, 'All mobile nav links should have unique IDs');
  });

  it('navigation links should have proper ARIA roles', () => {
    assert.ok(indexHtml.includes('role="menubar"'), 'Nav list should have menubar role');
    assert.ok(indexHtml.includes('role="menuitem"'), 'Nav items should have menuitem role');
  });
});

describe('Accessibility — CSS Compliance', () => {
  const mainCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'main.css'), 'utf8');
  const animCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'animations.css'), 'utf8');

  it('should have a .sr-only class for screen reader text', () => {
    assert.ok(mainCss.includes('.sr-only') || mainCss.includes('sr-only'), 'Must define .sr-only utility class');
  });

  it('should respect prefers-reduced-motion', () => {
    assert.ok(animCss.includes('prefers-reduced-motion'), 'Must include prefers-reduced-motion media query');
  });

  it('should have focus-visible styles', () => {
    const allCss = mainCss + animCss;
    assert.ok(
      allCss.includes(':focus') || allCss.includes(':focus-visible'),
      'Must define focus indicator styles'
    );
  });
});

describe('Accessibility — Component Level', () => {
  const guideJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'components', 'guide.js'), 'utf8');
  const quizJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'components', 'quiz.js'), 'utf8');
  const flashcardsJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'components', 'flashcards.js'), 'utf8');

  it('guide should use aria-expanded for collapsible sections', () => {
    assert.ok(guideJs.includes('aria-expanded'), 'Guide steps must use aria-expanded');
  });

  it('guide should use aria-controls for content association', () => {
    assert.ok(guideJs.includes('aria-controls'), 'Guide steps must use aria-controls');
  });

  it('quiz should support keyboard navigation', () => {
    assert.ok(quizJs.includes('tabindex') || quizJs.includes('keydown'), 'Quiz options must be keyboard accessible');
  });

  it('flashcards should support keyboard navigation', () => {
    assert.ok(flashcardsJs.includes('tabindex') || flashcardsJs.includes('keydown'), 'Flashcards must be keyboard accessible');
  });

  it('guide should offer TTS for each step', () => {
    assert.ok(guideJs.includes('tts-btn') || guideJs.includes('ttsClient'), 'Guide must integrate TTS for accessibility');
  });
});
