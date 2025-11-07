const loadingScreen = document.querySelector(".loading-screen");

const quizForm = document.querySelector("#quizForm");
const categoryDropdown = document.querySelector("#categoryDropdown");
const difficultyDropdown = document.querySelector("#difficultyDropdown");
const rangeInput = document.querySelector("#rangeInput");
const rangeNumber = document.querySelector("#rangeNumber");
const quizSettings = document.querySelector(".quiz-settings");

const questionCard = document.querySelector(".question-card");
const questionCategory = document.querySelector(".question-category");
const quizScore = document.querySelector(".quiz-score");
const questionWrapper = document.querySelector(".question-wrapper");
const quitQuizBtn = document.querySelector(".quit-btn");

const timeLeft = document.getElementById("timeLeft");
const timerProgressCircle = document.querySelector(".timer-progress");

const questionsProgress = document.querySelector(".questions-progress");
const nextQuestionBtn = document.querySelector(".next-question-btn");

const confirmModal = document.querySelector(".confirm-modal");
const resultModal = document.querySelector(".result-modal");
const resultMessage = document.querySelector(".result-message");

class Question {
  constructor(questionData, index) {
    this.index = index;
    this.category = questionData.category;
    this.difficulty = questionData.difficulty;
    this.question = questionData.question;
    this.correctAnswer = questionData.correct_answer;
    this.incorrectAnswers = questionData.incorrect_answers;
    this.allOptions = this.shuffleOptions();
    this.isAnswered = false;
  }
  shuffleOptions() {
    return [...this.incorrectAnswers, this.correctAnswer].sort();
  }

  createQuestionMarkup() {
    return `
      <h2 class="question-title">
        Q${this.index + 1}. ${this.question}
      </h2>
      <div class="question-options">
        ${this.allOptions
          .map((option, index) => {
            const letters = ["a", "b", "c", "d"];
            return `
            <div class="question-option" data-value="${option}" data-index="${index}">
              <p class="letter">${letters[index]}</p>
              <p>${option}</p>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  checkAnswer(selectedOption) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    const answer = selectedOption.dataset.value;
    if (answer === this.correctAnswer) {
      selectedOption.classList.add(
        "correct",
        "animate__animated",
        "animate__bounce"
      );
      return true;
    } else {
      selectedOption.classList.add(
        "wrong",
        "animate__animated",
        "animate__shakeX"
      );
      this.showCorrectAnswer();
      return false;
    }
  }

  showCorrectAnswer() {
    const correctOption = questionWrapper.querySelector(
      `[data-value="${this.correctAnswer}"]`
    );
    if (correctOption) {
      correctOption.classList.add("correct");
    }
  }
}
class QuizApp {
  constructor() {
    this.timer = 15;
    this.timerInterval = null;
    this.timerPaused = false;
    this.radius = 20;
    this.circumference = 2 * Math.PI * this.radius;

    this.totalQuestions = 0;
    this.currentQuestionIndex = 0;
    this.isQuestionAnswered = false;

    this.questions = [];
    this.score = 0;

    this.BASE_URL = "https://opentdb.com/api.php";
    this.amount = "";
    this.category = "";
    this.difficulty = "";

    this.init();
  }

  init() {
    loadingScreen.classList.remove("show");
    nextQuestionBtn.disabled = true;
    this.setupEventListeners();
    this.setupDropdowns();
    this.updateRangeSliderBackground();
  }

  setupEventListeners() {
    quizForm.addEventListener("submit", this.submitForm.bind(this));

    rangeInput.addEventListener(
      "input",
      this.updateRangeSliderBackground.bind(this)
    );

    nextQuestionBtn.addEventListener(
      "click",
      this.handleNextQuestion.bind(this)
    );

    quitQuizBtn.addEventListener("click", () => {
      confirmModal.classList.add("show");
    });

    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) this.toggleModal(modal);
      });
    });

    document
      .querySelector(".confirm-modal .cancel-btn")
      .addEventListener("click", () => {
        this.toggleModal(confirmModal);
      });

    document
      .querySelector(".confirm-modal .quit-btn")
      .addEventListener("click", () => {
        this.toggleModal(confirmModal);
        clearInterval(this.timerInterval);
        window.location.reload();
      });

    document
      .querySelector(".result-modal .again-btn")
      .addEventListener("click", () => {
        this.toggleModal(resultModal);
        clearInterval(this.timerInterval);
        window.location.reload();
      });
  }
  setupDropdowns() {
    quizSettings.addEventListener("click", (e) => {
      const dropdown = e.target.closest(".dropdown");
      if (!dropdown) {
        this.closeAllDropdowns();
        return;
      }
      this.toggleDropdown(dropdown);
    });
  }
  toggleDropdown(dropdown) {
    const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
    const dropdownMenu = dropdown.querySelector(".dropdown-menu");
    dropdownToggle.classList.toggle("active");
    dropdownMenu.classList.toggle("show");

    dropdownMenu.addEventListener("click", (e) => {
      const dropdownItem = e.target.closest(".dropdown-item");
      if (!dropdownItem) return;
      this.selectDropdownItem(dropdownToggle, dropdownMenu, dropdownItem);
    });
  }
  selectDropdownItem(dropdownToggle, dropdownMenu, dropdownItem) {
    dropdownToggle.querySelector("p").textContent = dropdownItem.textContent;
    dropdownItem.classList.add("selected");
    dropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      if (item !== dropdownItem) {
        item.classList.remove("selected");
      }
    });
  }
  closeAllDropdowns() {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
      const dropdownMenu = dropdown.querySelector(".dropdown-menu");
      dropdownToggle.classList.remove("active");
      dropdownMenu.classList.remove("show");
    });
  }

  updateRangeSliderBackground() {
    rangeNumber.textContent = `Total Questions: ${rangeInput.value}`;

    // setting slider background
    const min = +rangeInput.min;
    const max = +rangeInput.max;
    const val = +rangeInput.value;
    const percentage = ((val - min) / (max - min)) * 100;
    rangeInput.style.background = `linear-gradient(
      to right,
      var(--primary) 0%,
      var(--primary) ${percentage}%,
      var(--light-gray) ${percentage}%,
      var(--light-gray) 100%
    )`;
  }

  getAPIUrl() {
    return `${this.BASE_URL}?amount=${this.amount}&category=${this.category}&difficulty=${this.difficulty}`;
  }
  async fetchQuestions() {
    try {
      const response = await fetch(this.getAPIUrl.call(this));
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
    }
  }
  async handleFetchedQuestions() {
    loadingScreen.classList.add("show");

    try {
      const questionsData = await this.fetchQuestions();
      this.questions = questionsData.map(
        (question, index) => new Question(question, index)
      );
      this.renderCurrentQuestion();
      this.toggleCards();
      this.startTimer();
    } catch (error) {
      alert(error);
    } finally {
      loadingScreen.classList.remove("show");
    }
  }
  async submitForm(e) {
    e.preventDefault();

    const category = categoryDropdown.querySelector(".dropdown-item.selected")
      ? categoryDropdown.querySelector(".dropdown-item.selected").dataset.value
      : "";

    const difficulty = difficultyDropdown.querySelector(
      ".dropdown-item.selected"
    )
      ? difficultyDropdown.querySelector(".dropdown-item.selected").dataset
          .value
      : "";

    const amount = rangeInput.value || 10;

    this.amount = amount;
    this.category = category;
    this.difficulty = difficulty;

    this.totalQuestions = +this.amount - 1;

    this.handleFetchedQuestions();
  }

  toggleCards() {
    if (quizSettings.style.display === "block") {
      quizSettings.style.display = "block";
      questionCard.style.display = "none";
      return;
    }
    quizSettings.style.display = "none";
    questionCard.style.display = "block";
  }

  startTimer() {
    this.timer = 15;
    this.updateTimerProgress.call(this, this.timer);
    clearInterval(this.timerInterval);
    this.timerPaused = false;
    this.isQuestionAnswered = false;

    this.timerInterval = setInterval(() => {
      if (this.timerPaused) return;
      this.timer--;
      this.updateTimerProgress.call(this, this.timer);
      timeLeft.textContent = this.timer;
      if (this.timer === 0) {
        clearInterval(this.timerInterval);
        if (!this.isQuestionAnswered) {
          this.showCorrectAnswerOnTimeout();
        }
      }
    }, 1000);
  }
  updateTimerProgress(time) {
    const offset = this.circumference * (1 - time / 15);
    timerProgressCircle.style.strokeDashoffset = offset;
    timeLeft.textContent = time;
  }

  handleNextQuestion() {
    if (this.currentQuestionIndex < this.totalQuestions) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      questionsProgress.value =
        (this.currentQuestionIndex / this.totalQuestions) * 100;
      this.totalTime = 15;
      this.startTimer();
      nextQuestionBtn.disabled = true;
    }
  }

  toggleModal(modal) {
    modal.classList.toggle("show");
  }

  updateScore() {
    quizScore.textContent = `Score: ${this.score}`;
  }

  handleAnswerSelection(question) {
    questionWrapper.addEventListener("click", (e) => {
      const option = e.target.closest(".question-option");
      if (!option) return;
      const isCorrect = question.checkAnswer.call(question, option);
      this.timerPaused = true;
      this.disableOptions();
      nextQuestionBtn.disabled = false;
      if (isCorrect) {
        this.score++;
        this.updateScore();
      }
    });
  }
  renderCurrentQuestion() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const formattedCategory = currentQuestion.category.replace(/&amp;/g, "&");
    questionCategory.textContent = `Category: ${formattedCategory}`;
    this.updateScore();
    questionWrapper.innerHTML = currentQuestion.createQuestionMarkup();
    this.handleAnswerSelection(currentQuestion);
    this.handleNextBtn();
  }
  showCorrectAnswerOnTimeout() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    currentQuestion.showCorrectAnswer();
    this.disableOptions();
    this.timerPaused = true;
    nextQuestionBtn.disabled = false;
  }
  disableOptions() {
    questionWrapper.querySelectorAll(".question-option").forEach((option) => {
      option.style.pointerEvents = "none";
      option.style.cursor = "not-allowed";
    });
  }

  handleNextBtn() {
    if (this.currentQuestionIndex === this.totalQuestions) {
      nextQuestionBtn.innerText = "Show Result";
      nextQuestionBtn.addEventListener("click", () => {
        this.renderResult();
      });
    }
  }
  renderResult() {
    resultModal.classList.add("show");
    resultMessage.innerText = `You scored: ${this.score}/${this.amount}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new QuizApp();
});
