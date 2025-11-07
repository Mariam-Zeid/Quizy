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
  shuffleOptions() {
    return [...this.incorrectAnswers, this.correctAnswer].sort();
  }
  checkAnswer(selectedOption) {
    if (this.isAnswered) return null;
    this.isAnswered = true;
    const answer = selectedOption.dataset.value;
    return answer === this.correctAnswer;
  }
  getCorrectAnswer() {
    return this.correctAnswer;
  }
}

export default Question;
