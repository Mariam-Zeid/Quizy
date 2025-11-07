# Quizy
A simple Quiz App built with Vanilla JavaScript to practice core concepts like DOM manipulation, event handling, data fetching, and dynamic rendering.

### 🌐 Visit the website: [Quizy](https://quizy-mz.vercel.app/)

## 📸 Preview

![Quiz App](assets/imgs/main-page.png)

## Features

* Select question category, difficulty, and number of questions.
* Countdown timer for each question.
* Immediate answer feedback (correct/incorrect).
* Score tracking and result display.
* Responsive UI with modal dialogs for quitting or restarting.
* Animated transitions for better user experience.

## 💡Future Enhancements

- Add a **progress summary** after each quiz  
- Introduce **category-based leaderboards**  
- Allow users to **review incorrect answers** 

## 📸 Flowchart

![Quiz App Flowchart](assets/imgs/app%20logic/Flowchart.jpeg)

## 📁 Folder Structure

```bash
quizy/
│
├── assets/
│   ├── css/
│   │   └── all.css
│   │
│   ├── imgs/
│   │   └── main-page.png
│   │
│   └── js/
│       ├── Question.js   # Handles question data and logic
│       ├── Quiz.js       # Manages quiz flow (fetching, score, next question, etc.)
│       ├── UI.js         # Controls DOM manipulation and screen transitions
│       └── QuizApp.js    # Bootstraps and connects all modules
│
├── index.html
└── README.md
```

## Technologies Used

* HTML
* CSS
* JavaScript (ES6+)

## Customization

* Modify the `BASE_URL` in the JavaScript file to use a different API endpoint.
* Adjust the timer duration in the `startTimer` method in the JavaScript file.