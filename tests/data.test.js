const { describe, it } = require('node:test');
const assert = require('node:assert');
const QUIZ_DATA = require('../public/js/data/quizData');
const FLASHCARD_DATA = require('../public/js/data/flashcardData');
const TIMELINE_DATA = require('../public/js/data/timelineData');
const GUIDE_DATA = require('../public/js/data/guideData');

describe('Quiz Data Validation', () => {
  it('should have at least 30 questions', () => {
    assert.ok(QUIZ_DATA.length >= 30, `Expected 30+ questions, got ${QUIZ_DATA.length}`);
  });

  it('every question should have required fields', () => {
    QUIZ_DATA.forEach((q, i) => {
      assert.ok(q.id, `Question ${i} missing id`);
      assert.ok(q.question, `Question ${i} missing question text`);
      assert.ok(Array.isArray(q.options), `Question ${i} options is not an array`);
      assert.strictEqual(q.options.length, 4, `Question ${i} should have 4 options`);
      assert.ok(typeof q.correctIndex === 'number', `Question ${i} missing correctIndex`);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `Question ${i} correctIndex out of range`);
      assert.ok(q.explanation, `Question ${i} missing explanation`);
      assert.ok(q.category, `Question ${i} missing category`);
      assert.ok(q.difficulty, `Question ${i} missing difficulty`);
    });
  });

  it('should have unique question IDs', () => {
    const ids = QUIZ_DATA.map(q => q.id);
    const unique = new Set(ids);
    assert.strictEqual(ids.length, unique.size, 'Duplicate question IDs found');
  });

  it('should have multiple categories', () => {
    const categories = new Set(QUIZ_DATA.map(q => q.category));
    assert.ok(categories.size >= 5, `Expected 5+ categories, got ${categories.size}`);
  });

  it('should have multiple difficulty levels', () => {
    const difficulties = new Set(QUIZ_DATA.map(q => q.difficulty));
    assert.ok(difficulties.has('easy'), 'Missing easy questions');
    assert.ok(difficulties.has('medium'), 'Missing medium questions');
    assert.ok(difficulties.has('hard'), 'Missing hard questions');
  });
});

describe('Flashcard Data Validation', () => {
  it('should have at least 30 flashcards', () => {
    assert.ok(FLASHCARD_DATA.length >= 30, `Expected 30+ cards, got ${FLASHCARD_DATA.length}`);
  });

  it('every card should have required fields', () => {
    FLASHCARD_DATA.forEach((c, i) => {
      assert.ok(c.id, `Card ${i} missing id`);
      assert.ok(c.category, `Card ${i} missing category`);
      assert.ok(c.front, `Card ${i} missing front text`);
      assert.ok(c.back, `Card ${i} missing back text`);
    });
  });
});

describe('Timeline Data Validation', () => {
  it('should have at least 15 milestones', () => {
    assert.ok(TIMELINE_DATA.length >= 15, `Expected 15+ items, got ${TIMELINE_DATA.length}`);
  });

  it('should be in chronological order', () => {
    for (let i = 1; i < TIMELINE_DATA.length; i++) {
      const prev = parseInt(TIMELINE_DATA[i - 1].year);
      const curr = parseInt(TIMELINE_DATA[i].year);
      assert.ok(curr >= prev, `Timeline not sorted: ${TIMELINE_DATA[i-1].year} > ${TIMELINE_DATA[i].year}`);
    }
  });
});

describe('Guide Data Validation', () => {
  it('should have at least 8 steps', () => {
    assert.ok(GUIDE_DATA.length >= 8, `Expected 8+ steps, got ${GUIDE_DATA.length}`);
  });

  it('every step should have required fields', () => {
    GUIDE_DATA.forEach((s, i) => {
      assert.ok(s.id, `Step ${i} missing id`);
      assert.ok(s.title, `Step ${i} missing title`);
      assert.ok(s.summary, `Step ${i} missing summary`);
      assert.ok(Array.isArray(s.details), `Step ${i} details is not an array`);
      assert.ok(s.details.length >= 3, `Step ${i} should have 3+ details`);
    });
  });
});
