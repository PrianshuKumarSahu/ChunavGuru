/**
 * Quiz Component — Interactive quiz with scoring, timer, and feedback.
 */
class QuizComponent {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.selectedCategory = 'All';
    this.timerInterval = null;
    this.timeLeft = 30;
  }

  render() {
    const categories = ['All', ...new Set(QUIZ_DATA.map(q => q.category))];
    const categoryBtns = categories.map(c =>
      `<button class="quiz-category-btn ${c === 'All' ? 'active' : ''}" data-category="${c}" id="quiz-cat-${c.replace(/\s/g,'')}">${c}</button>`
    ).join('');

    return `
      <div class="quiz-container">
        <div class="quiz-header">
          <span class="section-badge">🧠 Test Your Knowledge</span>
          <h2 class="quiz-header__title">Election <span class="gradient-text">Quiz</span></h2>
        </div>

        <div class="quiz-setup" id="quiz-setup">
          <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">Choose a category and test your knowledge about Indian elections!</p>
          <div class="quiz-categories" id="quiz-categories">${categoryBtns}</div>
          <button class="quiz-start-btn" id="quiz-start-btn">Start Quiz →</button>
        </div>

        <div class="quiz-active" id="quiz-active">
          <div class="quiz-progress-bar"><div class="quiz-progress-bar__fill" id="quiz-progress-fill"></div></div>
          <div class="quiz-meta">
            <span id="quiz-counter">Question 1 / 10</span>
            <span class="quiz-timer" id="quiz-timer">⏱️ <span id="quiz-time">30</span>s</span>
            <span id="quiz-score-display">Score: 0</span>
          </div>
          <div class="glass-card quiz-question-card" id="quiz-question-card">
            <div class="quiz-question__text" id="quiz-question-text"></div>
            <div class="quiz-options" id="quiz-options"></div>
            <div class="quiz-explanation" id="quiz-explanation"></div>
            <button class="quiz-next-btn" id="quiz-next-btn">Next Question →</button>
          </div>
        </div>

        <div class="quiz-results glass-card" id="quiz-results">
          <div class="quiz-results__score score-animate" id="quiz-results-score"></div>
          <div class="quiz-results__message" id="quiz-results-message"></div>
          <p class="quiz-results__detail" id="quiz-results-detail"></p>
          <button class="quiz-retry-btn" id="quiz-retry-btn">Try Again 🔄</button>
        </div>
      </div>
    `;
  }

  init() {
    // Category selection
    document.querySelectorAll('.quiz-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quiz-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.category;
      });
    });

    // Start quiz
    document.getElementById('quiz-start-btn').addEventListener('click', () => this._startQuiz());

    // Next question
    document.getElementById('quiz-next-btn').addEventListener('click', () => this._nextQuestion());

    // Retry
    document.getElementById('quiz-retry-btn').addEventListener('click', () => this._resetQuiz());
  }

  _startQuiz() {
    // Filter and shuffle questions
    let pool = this.selectedCategory === 'All'
      ? [...QUIZ_DATA]
      : QUIZ_DATA.filter(q => q.category === this.selectedCategory);

    // Shuffle using Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    this.questions = pool.slice(0, 10);
    this.currentIndex = 0;
    this.score = 0;

    document.getElementById('quiz-setup').style.display = 'none';
    document.getElementById('quiz-active').classList.add('visible');
    document.getElementById('quiz-results').classList.remove('visible');

    this._showQuestion();
  }

  _showQuestion() {
    const q = this.questions[this.currentIndex];
    this.answered = false;

    // Update UI
    document.getElementById('quiz-counter').textContent = `Question ${this.currentIndex + 1} / ${this.questions.length}`;
    document.getElementById('quiz-score-display').textContent = `Score: ${this.score}`;
    document.getElementById('quiz-progress-fill').style.width = `${((this.currentIndex) / this.questions.length) * 100}%`;

    document.getElementById('quiz-question-text').textContent = q.question;
    document.getElementById('quiz-explanation').classList.remove('visible');
    document.getElementById('quiz-next-btn').classList.remove('visible');

    const letters = ['A', 'B', 'C', 'D'];
    const optionsHTML = q.options.map((opt, idx) =>
      `<button class="quiz-option" data-index="${idx}" id="quiz-opt-${idx}">
        <span class="quiz-option__letter">${letters[idx]}</span>
        <span>${opt}</span>
      </button>`
    ).join('');
    document.getElementById('quiz-options').innerHTML = optionsHTML;

    // Bind option clicks
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => this._selectAnswer(parseInt(btn.dataset.index)));
    });

    // Start timer
    this._startTimer();
  }

  _startTimer() {
    this.timeLeft = 30;
    document.getElementById('quiz-time').textContent = this.timeLeft;
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('quiz-time').textContent = this.timeLeft;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        if (!this.answered) this._selectAnswer(-1); // Time's up
      }
    }, 1000);
  }

  _selectAnswer(selectedIndex) {
    if (this.answered) return;
    this.answered = true;
    clearInterval(this.timerInterval);

    const q = this.questions[this.currentIndex];
    const options = document.querySelectorAll('.quiz-option');

    // Disable all options
    options.forEach(opt => opt.classList.add('disabled'));

    // Highlight correct answer
    options[q.correctIndex].classList.add('correct');
    options[q.correctIndex].classList.add('correct-pulse');

    // Highlight wrong answer if applicable
    if (selectedIndex >= 0 && selectedIndex !== q.correctIndex) {
      options[selectedIndex].classList.add('wrong');
      options[selectedIndex].classList.add('wrong-shake');
    } else if (selectedIndex === q.correctIndex) {
      this.score++;
      document.getElementById('quiz-score-display').textContent = `Score: ${this.score}`;
    }

    // Show explanation
    const explanation = document.getElementById('quiz-explanation');
    explanation.innerHTML = `<strong>${selectedIndex === q.correctIndex ? '✅ Correct!' : selectedIndex < 0 ? '⏱️ Time\'s up!' : '❌ Wrong!'}</strong> ${q.explanation}`;
    explanation.classList.add('visible');

    // Show next button
    document.getElementById('quiz-next-btn').classList.add('visible');
    document.getElementById('quiz-next-btn').textContent =
      this.currentIndex < this.questions.length - 1 ? 'Next Question →' : 'See Results →';
  }

  _nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this._showQuestion();
    } else {
      this._showResults();
    }
  }

  _showResults() {
    document.getElementById('quiz-active').classList.remove('visible');
    document.getElementById('quiz-results').classList.add('visible');

    const percentage = Math.round((this.score / this.questions.length) * 100);
    document.getElementById('quiz-results-score').innerHTML = `<span class="gradient-text">${percentage}%</span>`;

    let message = '';
    if (percentage >= 90) message = '🏆 Outstanding! You\'re an election expert!';
    else if (percentage >= 70) message = '🌟 Great job! You know your elections well!';
    else if (percentage >= 50) message = '👍 Good effort! Keep learning!';
    else message = '📚 Keep studying! Try the guide and flashcards!';

    document.getElementById('quiz-results-message').textContent = message;
    document.getElementById('quiz-results-detail').textContent = `You answered ${this.score} out of ${this.questions.length} questions correctly.`;

    document.getElementById('quiz-progress-fill').style.width = '100%';

    // Confetti for high scores
    if (percentage >= 70) this._showConfetti();
  }

  _showConfetti() {
    const colors = ['#FF6B35', '#2ECC71', '#F4C430', '#1A5276', '#FFFFFF'];
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay: ${Math.random() * 1}s;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }

  _resetQuiz() {
    document.getElementById('quiz-results').classList.remove('visible');
    document.getElementById('quiz-active').classList.remove('visible');
    document.getElementById('quiz-setup').style.display = '';
    clearInterval(this.timerInterval);
  }
}

window.QuizComponent = new QuizComponent();
