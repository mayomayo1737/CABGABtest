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
    category: "math",
    question: "(36 - 12) ÷ 6 + 7 の値は？",
    choices: ["9", "10", "11", "13"],
    answer: "11",
  },
  {
    category: "math",
    question: "x : 24 = 3 : 4 のとき、x は？",
    choices: ["16", "18", "20", "32"],
    answer: "18",
  },
  {
    category: "logic",
    question: "次の図形列の『?』に入るものを選んでください。",
    figure: {
      sequence: "▲ ■ ● ｜ ▲ ■ ● ｜ ▲ ■ ？",
      legend: "同じ3つの図形が順番に繰り返されています。",
    },
    choices: ["▲", "■", "●", "◆"],
    answer: "●",
  },
  {
    category: "logic",
    question: "次の図形列の規則に従うと、次に来る図形は？",
    figure: {
      sequence: "○ △ □ ｜ △ □ ○ ｜ □ ○ △ ｜ ？",
      legend: "3図形が左に1つずつローテーションしています。",
    },
    choices: ["○", "△", "□", "◇"],
    answer: "○",
  },
  {
    category: "logic",
    question: "次の図形列で『?』に入るものを選んでください。",
    figure: {
      sequence: "★ ☆ ★ ☆ ★ ？",
      legend: "塗りつぶしと白抜きが交互に並んでいます。",
    },
    choices: ["★", "☆", "●", "▲"],
    answer: "☆",
  },
  {
    category: "logic",
    question: "数列 2, 6, 12, 20, 30, ? に続く数は？",
    choices: ["36", "40", "42", "44"],
    answer: "42",
  },
  {
    category: "code",
    question: "図形暗号の対応に従うと、『◇ ▲ ■』が表す数字はどれ？",
    figure: {
      sequence: "●=1 / ▲=2 / ■=3 / ◆=4 / ◇=5",
      legend: "左から順に数字として読んでください。",
    },
    choices: ["523", "532", "5230", "253"],
    answer: "523",
  },
  {
    category: "code",
    question: "図形暗号：『■ ● ▲』が表す数字は？",
    figure: {
      sequence: "●=1 / ▲=2 / ■=3 / ◆=4 / ◇=5",
      legend: "企業試験で出る記号置換の基本パターンです。",
    },
    choices: ["312", "321", "132", "213"],
    answer: "312",
  },
  {
    category: "code",
    question: "対応表に従い『◆ ◇ ●』を数字へ変換すると？",
    figure: {
      sequence: "●=1 / ▲=2 / ■=3 / ◆=4 / ◇=5",
      legend: "3桁の数字として読み取ります。",
    },
    choices: ["451", "415", "541", "145"],
    answer: "451",
  },
  {
    category: "code",
    question: "次の図形暗号で『?』に入る記号を選んでください。",
    figure: {
      sequence: "● ▲ ■ ◆ ◇ ｜ 1 2 3 4 5 ｜ 2 4 ?",
      legend: "数字2,4,5に対応する図形を順に選ぶ問題です。",
    },
    choices: ["▲", "◆", "◇", "■"],
    answer: "◇",
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
  {
    category: "verbal",
    question: "『抑制』の反対語として最も適切なのは？",
    choices: ["促進", "停滞", "分析", "同調"],
    answer: "促進",
  },
  {
    category: "verbal",
    question: "文脈上、空欄に入る語として最も適切なのは？『原因を___して再発を防ぐ。』",
    choices: ["特定", "放置", "分散", "削除"],
    answer: "特定",
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
const figurePrompt = document.getElementById("figurePrompt");
const choices = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("scoreText");
const weaknessList = document.getElementById("weaknessList");

let currentQuestions = [];
let index = 0;
let correctCount = 0;
const wrongByCategory = { math: 0, logic: 0, code: 0, verbal: 0 };

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function renderFigure(figure) {
  if (!figure) {
    figurePrompt.classList.add("hidden");
    figurePrompt.innerHTML = "";
    return;
  }

  figurePrompt.classList.remove("hidden");
  figurePrompt.innerHTML = `
    <div class="sequence">${figure.sequence}</div>
    <div class="legend">${figure.legend}</div>
  `;
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
  wrongByCategory.code = 0;
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
  renderFigure(q.figure);
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
    code: "暗号",
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
  if (!currentQuestions[index]) {
    return;
  }

  wrongByCategory[currentQuestions[index].category] += 1;
  index += 1;
  showQuestion();
});
retryBtn.addEventListener("click", startQuiz);
