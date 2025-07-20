const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");
const resultEl = document.getElementById("result");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const highScoreEl = document.getElementById("highScore");
const countdownEl = document.getElementById("countdown");
const themeToggle = document.getElementById("themeToggle");
const difficultySelect = document.getElementById("difficulty");

let quote = "";
let timer = null;
let startTime;
let typed = "";
let totalTyped = 0;
let countdown = 3;
let highScore = localStorage.getItem("highWpm") || 0;

const quotes = {
  short: [
    "Practice makes perfect.",
    "Code every day.",
    "Stay curious."
  ],
  medium: [
    "JavaScript is fun to learn and powerful.",
    "Always write clean and reusable code.",
    "Frontend development involves HTML, CSS and JS."
  ],
  long: [
    "Typing fast and accurately requires both focus and continuous practice.",
    "Web development is a constantly evolving field with endless opportunities to learn.",
    "Building responsive, interactive websites needs creativity and logic combined."
  ]
};

startBtn.addEventListener("click", () => {
  resultEl.classList.add("hidden");
  inputEl.value = "";
  inputEl.disabled = true;
  countdown = 3;
  countdownEl.textContent = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownEl.textContent = "";  // Clear countdown display
      startTest();
    } else {
      countdownEl.textContent = countdown;
    }
  }, 1000);
});


function startTest() {
  quote = getRandomQuote();
  quoteEl.innerHTML = quote.split("").map(c => `<span>${c}</span>`).join("");
  inputEl.disabled = false;
  inputEl.focus();
  timeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100";
  totalTyped = 0;
  typed = "";
  startTime = new Date();
  clearInterval(timer);
  timer = setInterval(updateTime, 1000);
}

inputEl.addEventListener("input", () => {
  typed = inputEl.value;
  totalTyped++;
  updateQuoteColors();
  updateStats();

  if (typed === quote) {
    clearInterval(timer);
    inputEl.disabled = true;
    showResults();
  }
});

function updateQuoteColors() {
  const spanElements = quoteEl.querySelectorAll("span");
  spanElements.forEach((span, index) => {
    if (!typed[index]) {
      span.classList.remove("correct", "incorrect");
    } else if (typed[index] === quote[index]) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });
}

function updateTime() {
  const elapsedTime = Math.floor((new Date() - startTime) / 1000);
  timeEl.textContent = elapsedTime;
  updateStats();
}

function updateStats() {
  const elapsedTime = Math.floor((new Date() - startTime) / 1000) || 1;
  const wordsTyped = typed.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / elapsedTime) * 60);
  wpmEl.textContent = wpm;

  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === quote[i]) correct++;
  }

  const accuracy = Math.round((correct / totalTyped) * 100);
  accuracyEl.textContent = accuracy || 0;
}

function showResults() {
  resultEl.classList.remove("hidden");
  finalWpm.textContent = wpmEl.textContent;
  finalAccuracy.textContent = accuracyEl.textContent;

  const currentWpm = parseInt(wpmEl.textContent);
  if (currentWpm > highScore) {
    highScore = currentWpm;
    localStorage.setItem("highWpm", highScore);
  }
  highScoreEl.textContent = highScore;
}

function getRandomQuote() {
  const level = difficultySelect.value;
  const levelQuotes = quotes[level];
  return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
}

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light");
});
