import Question from "./Question.js";

class Quiz {
  constructor(amount, category, difficulty) {
    this.BASE_URL = "https://opentdb.com/api.php";
    this.amount = amount;
    this.category = category;
    this.difficulty = difficulty;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
  }
  getAPIUrl() {
    let url = `${this.BASE_URL}?amount=${this.amount}`;
    if (this.category) url += `&category=${this.category}`;
    if (this.difficulty) url += `&difficulty=${this.difficulty}`;
    return url;
  }
  async fetchQuestions() {
    try {
      const response = await fetch(this.getAPIUrl());
      const data = await response.json();
      this.questions = data.results.map(
        (question, index) => new Question(question, index)
      );
      return this.questions;
    } catch (error) {
      throw new Error("Failed to fetch questions: " + error.message);
    }
  }
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }
  isLastQuestion() {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
  getTotalQuestions() {
    return this.questions.length;
  }
  getProgress() {
    return (this.currentQuestionIndex / (this.questions.length - 1)) * 100;
  }
  incrementScore() {
    this.score++;
  }
  getScore() {
    return this.score;
  }
  getResults() {
    return {
      score: this.score,
      total: this.questions.length,
      percentage: Math.round((this.score / this.questions.length) * 100),
    };
  }
  reset() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
  }
}

export default Quiz;
