class UI {
  constructor() {
    // DOM Elements - Loading
    this.loadingScreen = document.querySelector(".loading-screen");

    // DOM Elements - Quiz Settings
    this.quizSettings = document.querySelector(".quiz-settings");
    this.categoryDropdown = document.querySelector("#categoryDropdown");
    this.difficultyDropdown = document.querySelector("#difficultyDropdown");
    this.rangeInput = document.querySelector("#rangeInput");
    this.rangeNumber = document.querySelector("#rangeNumber");

    // DOM Elements - Question Card
    this.questionCard = document.querySelector(".question-card");
    this.questionCategory = document.querySelector(".question-category");
    this.quizScore = document.querySelector(".quiz-score");
    this.questionWrapper = document.querySelector(".question-wrapper");
    this.questionsProgress = document.querySelector(".questions-progress");
    this.timeLeft = document.getElementById("timeLeft");
    this.timerProgressCircle = document.querySelector(".timer-progress");
    this.nextQuestionBtn = document.querySelector(".next-question-btn");
    this.quitQuizBtn = document.querySelector(".quit-btn");

    // DOM Elements - Modals
    this.confirmModal = document.querySelector(".confirm-modal");
    this.resultModal = document.querySelector(".result-modal");
    this.resultMessage = document.querySelector(".result-message");

    // Timer properties
    this.radius = 20;
    this.circumference = 2 * Math.PI * this.radius;
  }
  // ============ Loading Methods ============
  showLoading() {
    this.loadingScreen.classList.add("show");
  }
  hideLoading() {
    this.loadingScreen.classList.remove("show");
  }
  // ============ Dropdown Methods ============
  setupDropdown(dropdown) {
    const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
    const dropdownMenu = dropdown.querySelector(".dropdown-menu");

    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown(dropdown);
    });

    dropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.selectDropdownItem(dropdownToggle, dropdownMenu, item);
      });
    });
  }
  toggleDropdown(dropdown) {
    const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
    const dropdownMenu = dropdown.querySelector(".dropdown-menu");

    // Close all other dropdowns
    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== dropdown) {
        const toggle = d.querySelector(".dropdown-toggle");
        const menu = d.querySelector(".dropdown-menu");
        toggle.classList.remove("active");
        menu.classList.remove("show");
      }
    });

    dropdownToggle.classList.toggle("active");
    dropdownMenu.classList.toggle("show");
  }
  selectDropdownItem(dropdownToggle, dropdownMenu, dropdownItem) {
    dropdownToggle.querySelector("p").textContent = dropdownItem.textContent;
    dropdownItem.classList.add("selected");
    dropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      if (item !== dropdownItem) {
        item.classList.remove("selected");
      }
    });

    this.closeAllDropdowns();
  }
  closeAllDropdowns() {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
      const dropdownMenu = dropdown.querySelector(".dropdown-menu");
      dropdownToggle.classList.remove("active");
      dropdownMenu.classList.remove("show");
    });
  }
  // ============ Range Slider Methods ============
  updateRangeSliderBackground() {
    this.rangeNumber.textContent = `Total Questions: ${this.rangeInput.value}`;

    const min = +this.rangeInput.min;
    const max = +this.rangeInput.max;
    const val = +this.rangeInput.value;
    const percentage = ((val - min) / (max - min)) * 100;
    this.rangeInput.style.background = `linear-gradient(
      to right,
      var(--primary) 0%,
      var(--primary) ${percentage}%,
      var(--light-gray) ${percentage}%,
      var(--light-gray) 100%
    )`;
  }
  // ============ Form Data Methods ============
  getFormData() {
    const categoryItem = this.categoryDropdown.querySelector(
      ".dropdown-item.selected"
    );
    const difficultyItem = this.difficultyDropdown.querySelector(
      ".dropdown-item.selected"
    );

    return {
      category: categoryItem ? categoryItem.dataset.value : "",
      difficulty: difficultyItem ? difficultyItem.dataset.value : "",
      amount: this.rangeInput.value || 10,
    };
  }
  // ============ Screen Toggle Methods ============
  toggleScreens() {
    if (this.quizSettings.style.display === "none") {
      this.quizSettings.style.display = "block";
      this.questionCard.style.display = "none";
    } else {
      this.quizSettings.style.display = "none";
      this.questionCard.style.display = "block";
    }
  }
  // ============ Question Rendering Methods ============
  renderQuestion(question) {
    const formattedCategory = question.category.replace(/&amp;/g, "&");
    this.questionCategory.textContent = `Category: ${formattedCategory}`;
    this.questionWrapper.innerHTML = question.createQuestionMarkup();
  }
  updateScore(score) {
    this.quizScore.textContent = `Score: ${score}`;
  }
  updateProgress(progress) {
    this.questionsProgress.value = progress;
  }
  // ============ Timer Methods ============
  updateTimer(time) {
    const offset = this.circumference * (1 - time / 15);
    this.timerProgressCircle.style.strokeDashoffset = offset;
    this.timeLeft.textContent = time;
  }
  // ============ Answer Methods ============
  markAnswerCorrect(option) {
    option.classList.add("correct", "animate__animated", "animate__bounce");
  }
  markAnswerWrong(option) {
    option.classList.add("wrong", "animate__animated", "animate__shakeX");
  }
  highlightCorrectAnswer(question) {
    const correctOption = this.questionWrapper.querySelector(
      `[data-value="${question.getCorrectAnswer()}"]`
    );
    if (correctOption) {
      correctOption.classList.add("correct");
    }
  }
  disableOptions() {
    this.questionWrapper
      .querySelectorAll(".question-option")
      .forEach((option) => {
        option.style.pointerEvents = "none";
        option.style.cursor = "not-allowed";
      });
  }
  // ============ Button Methods ============
  enableNextButton() {
    this.nextQuestionBtn.disabled = false;
  }
  disableNextButton() {
    this.nextQuestionBtn.disabled = true;
  }
  updateNextButtonText(isLastQuestion) {
    this.nextQuestionBtn.innerText = isLastQuestion
      ? "Show Result"
      : "Next Question";
  }
  // ============ Modal Methods ============
  toggleModal(modal) {
    modal.classList.toggle("show");
  }
  showResultModal(score, total) {
    this.resultMessage.innerText = `You scored: ${score}/${total}`;
    this.toggleModal(this.resultModal);
  }
  // ============ Event Listener Setup ============
  setupEventListeners(handlers) {
    // Range input
    this.rangeInput.addEventListener("input", handlers.onRangeInput);

    // Dropdowns
    document.addEventListener("click", (e) => {
      const dropdown = e.target.closest(".dropdown");
      if (!dropdown) {
        this.closeAllDropdowns();
      }
    });

    // Modal close buttons
    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) this.toggleModal(modal);
      });
    });

    // Quit quiz button
    this.quitQuizBtn.addEventListener("click", handlers.onQuitClick);

    // Confirm modal buttons
    document
      .querySelector(".confirm-modal .cancel-btn")
      .addEventListener("click", handlers.onCancelQuit);

    document
      .querySelector(".confirm-modal .quit-btn")
      .addEventListener("click", handlers.onConfirmQuit);

    // Result modal button
    document
      .querySelector(".result-modal .again-btn")
      .addEventListener("click", handlers.onPlayAgain);

    // Next question button
    this.nextQuestionBtn.addEventListener("click", handlers.onNextQuestion);
  }
}

export default UI;
