import Quiz from "./Quiz.js";
import UI from "./UI.js";

class QuizApp {
  constructor() {
    this.ui = new UI();
    this.quiz = null;
    this.timer = 15;
    this.timerInterval = null;
    this.timerPaused = false;

    this.init();
  }
  init() {
    this.ui.hideLoading();
    this.ui.disableNextButton();
    this.ui.updateRangeSliderBackground();
    this.setupEventListeners();
    this.setupDropdowns();
  }
  setupEventListeners() {
    // Setup UI event listeners with bound handlers
    this.ui.setupEventListeners({
      onRangeInput: this.handleRangeInput.bind(this),
      onQuitClick: this.handleQuitClick.bind(this),
      onCancelQuit: this.handleCancelQuit.bind(this),
      onConfirmQuit: this.handleConfirmQuit.bind(this),
      onPlayAgain: this.handlePlayAgain.bind(this),
      onNextQuestion: this.handleNextQuestion.bind(this),
    });

    // Start quiz form submission
    const quizForm = document.querySelector("#quizForm");
    if (quizForm) {
      quizForm.addEventListener("submit", this.handleStartQuiz.bind(this));
    } else {
      // If no form element, attach to start button directly
      const startBtn = document.querySelector("#startBtn");
      if (startBtn) {
        startBtn.addEventListener("click", this.handleStartQuiz.bind(this));
      }
    }
  }
  setupDropdowns() {
    this.ui.setupDropdown(this.ui.categoryDropdown);
    this.ui.setupDropdown(this.ui.difficultyDropdown);
  }
  // ============ Event Handlers ============
  handleRangeInput() {
    this.ui.updateRangeSliderBackground();
  }
  handleQuitClick() {
    this.ui.toggleModal(this.ui.confirmModal);
  }
  handleCancelQuit() {
    this.ui.toggleModal(this.ui.confirmModal);
  }
  handleConfirmQuit() {
    this.ui.toggleModal(this.ui.confirmModal);
    this.resetQuiz();
  }
  handlePlayAgain() {
    this.ui.toggleModal(this.ui.resultModal);
    this.resetQuiz();
  }
  async handleStartQuiz(e) {
    if (e) e.preventDefault();

    const formData = this.ui.getFormData();
    this.ui.showLoading();

    try {
      this.quiz = new Quiz(
        formData.amount,
        formData.category,
        formData.difficulty
      );
      await this.quiz.fetchQuestions();

      this.ui.toggleScreens();
      this.renderCurrentQuestion();
      this.startTimer();
    } catch (error) {
      alert(error.message);
    } finally {
      this.ui.hideLoading();
    }
  }
  handleNextQuestion() {
    if (this.quiz.isLastQuestion()) {
      this.showResult();
    } else {
      this.quiz.nextQuestion();
      this.renderCurrentQuestion();
      this.startTimer();
    }
  }
  // ============ Quiz Logic Methods ============
  renderCurrentQuestion() {
    const question = this.quiz.getCurrentQuestion();
    this.ui.renderQuestion(question);
    this.ui.updateScore(this.quiz.getScore());
    this.ui.updateProgress(this.quiz.getProgress());
    this.ui.updateNextButtonText(this.quiz.isLastQuestion());
    this.ui.disableNextButton();

    this.setupQuestionEventListeners(question);
  }
  setupQuestionEventListeners(question) {
    this.ui.questionWrapper.addEventListener("click", (e) => {
      const option = e.target.closest(".question-option");
      if (!option) return;
      this.handleAnswerSelection(option, question);
    });
  }
  handleAnswerSelection(selectedOption, question) {
    const isCorrect = question.checkAnswer(selectedOption);

    // If question already answered, return
    if (isCorrect === null) return;

    this.timerPaused = true;
    this.ui.disableOptions();
    this.ui.enableNextButton();

    if (isCorrect) {
      this.ui.markAnswerCorrect(selectedOption);
      this.quiz.incrementScore();
      this.ui.updateScore(this.quiz.getScore());
    } else {
      this.ui.markAnswerWrong(selectedOption);
      this.ui.highlightCorrectAnswer(question);
    }
  }
  // ============ Timer Methods ============
  startTimer() {
    this.timer = 15;
    this.timerPaused = false;
    clearInterval(this.timerInterval);

    this.ui.updateTimer(this.timer);

    this.timerInterval = setInterval(() => {
      if (this.timerPaused) return;

      this.timer--;
      this.ui.updateTimer(this.timer);

      if (this.timer === 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }
  handleTimeout() {
    const question = this.quiz.getCurrentQuestion();
    if (!question.isAnswered) {
      question.isAnswered = true;
      this.ui.highlightCorrectAnswer(question);
      this.ui.disableOptions();
      this.ui.enableNextButton();
      this.timerPaused = true;
    }
  }
  // ============ Result Methods ============
  showResult() {
    clearInterval(this.timerInterval);
    const results = this.quiz.getResults();
    this.ui.showResultModal(results.score, results.total);
  }
  // ============ Reset Methods ============
  resetQuiz() {
    clearInterval(this.timerInterval);
    window.location.reload();
  }
}

export default QuizApp;
