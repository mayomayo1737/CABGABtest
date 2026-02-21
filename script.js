const questionBank = [
  {
    category: "math",
    question: "x + 18 = 43 のとき、x は？",
    choices: ["21", "25", "61", "35"],
    answer: "25",
  },
  {
    category: "math",
    question: "15 ÷ x = 3 のとき、x は？",
    choices: ["12", "5", "45", "18"],
    answer: "5",
  },
  {
    category: "logic",
    question: "2, 6, 12, 20, 30, ? に続く数は？",
    choices: ["36", "40", "42", "44"],
    answer: "42",
  },
  {
    category: "logic",
    question: "A→C, C→F, F→J のとき、次は？",
    choices: ["K", "L", "M", "O"],
    answer: "O",
  },
  {
    category: "verbal",
    question: "『迅速』に最も近い意味は？",
    choices: ["ゆっくり", "すばやい", "複雑", "丁寧"],
    answer: "すばやい",
  },
  {
    category: "verbal",
    question: "『論理』と最も関係が深い語は？",
    choices: ["推論", "睡眠", "感情", "雑談"],
    answer: "推論",
  },
];

const categorySelect = document.getElementById("categorySelect");
const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const retryBtn = document.getElementById("retryBtn");

const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");
const status = document.getElementById("status");
const questionText = document.getElementById("questionText");
const choices = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("scoreText");
const weaknessList = document.getElementById("weaknessList");

let currentQuestions = [];
let index = 0;
let correctCount = 0;
const wrongByCategory = { math: 0, logic: 0, verbal: 0 };

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  const selected = categorySelect.value;
  currentQuestions =
    selected === "all"
      ? shuffle(questionBank)
      : shuffle(questionBank.filter((q) => q.category === selected));

  index = 0;
  correctCount = 0;
  wrongByCategory.math = 0;
  wrongByCategory.logic = 0;
  wrongByCategory.verbal = 0;

  feedback.textContent = "";
  feedback.className = "";

  resultPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");

  showQuestion();
}

function showQuestion() {
  if (index >= currentQuestions.length) {
    showResult();
    return;
  }

  const q = currentQuestions[index];
  status.textContent = `第 ${index + 1} 問 / ${currentQuestions.length}`;
  questionText.textContent = q.question;
  choices.innerHTML = "";

  q.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = choice;
    button.addEventListener("click", () => answerQuestion(choice));
    choices.appendChild(button);
  });
}

function answerQuestion(selectedChoice) {
  const q = currentQuestions[index];
  const isCorrect = selectedChoice === q.answer;

  if (isCorrect) {
    correctCount += 1;
    feedback.textContent = "正解！その調子です。";
    feedback.className = "correct";
  } else {
    wrongByCategory[q.category] += 1;
    feedback.textContent = `不正解。正解は「${q.answer}」です。`;
    feedback.className = "wrong";
  }

  index += 1;
  setTimeout(() => {
    feedback.textContent = "";
    feedback.className = "";
    showQuestion();
  }, 700);
}

function showResult() {
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  const total = currentQuestions.length;
  const rate = total ? Math.round((correctCount / total) * 100) : 0;
  scoreText.textContent = `${total}問中 ${correctCount}問正解（正答率 ${rate}%）`;

  weaknessList.innerHTML = "";
  const labels = {
    math: "四則逆算",
    logic: "法則性",
    verbal: "言語理解",
  };

  const weakAreas = Object.entries(wrongByCategory)
    .filter(([, wrong]) => wrong > 0)
    .sort((a, b) => b[1] - a[1]);

  if (weakAreas.length === 0) {
    const li = document.createElement("li");
    li.textContent = "全分野でミスなし！次は問題数を増やして挑戦しましょう。";
    weaknessList.appendChild(li);
    return;
  }

  weakAreas.forEach(([key, wrong]) => {
    const li = document.createElement("li");
    li.textContent = `苦手候補：${labels[key]}（ミス ${wrong} 回）`;
    weaknessList.appendChild(li);
  });
}

startBtn.addEventListener("click", startQuiz);
skipBtn.addEventListener("click", () => {
  wrongByCategory[currentQuestions[index].category] += 1;
  index += 1;
  showQuestion();
});
retryBtn.addEventListener("click", startQuiz);
