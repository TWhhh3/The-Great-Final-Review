const dom = {
  appTitle: document.getElementById("appTitle"),
  loadStatus: document.getElementById("loadStatus"),
  scoreboard: document.querySelector(".scoreboard"),
  menuView: document.getElementById("menuView"),
  subjectGrid: document.getElementById("subjectGrid"),
  placeholderView: document.getElementById("placeholderView"),
  placeholderBackBtn: document.getElementById("placeholderBackBtn"),
  placeholderSubject: document.getElementById("placeholderSubject"),
  questionView: document.getElementById("questionView"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),
  currentSubjectText: document.getElementById("currentSubjectText"),
  chapterFilter: document.getElementById("chapterFilter"),
  typeFilter: document.getElementById("typeFilter"),
  difficultyFilter: document.getElementById("difficultyFilter"),
  applyFilterBtn: document.getElementById("applyFilterBtn"),
  randomBtn: document.getElementById("randomBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  modeText: document.getElementById("modeText"),
  poolText: document.getElementById("poolText"),
  positionText: document.getElementById("positionText"),
  scoreText: document.getElementById("scoreText"),
  answeredText: document.getElementById("answeredText"),
  accuracyText: document.getElementById("accuracyText"),
  wrongCountText: document.getElementById("wrongCountText"),
  timerToggle: document.getElementById("timerToggle"),
  timerText: document.getElementById("timerText"),
  startExamBtn: document.getElementById("startExamBtn"),
  exitExamBtn: document.getElementById("exitExamBtn"),
  clearWrongBtn: document.getElementById("clearWrongBtn"),
  wrongList: document.getElementById("wrongList"),
  qidText: document.getElementById("qidText"),
  chapterText: document.getElementById("chapterText"),
  typeText: document.getElementById("typeText"),
  difficultyText: document.getElementById("difficultyText"),
  questionStem: document.getElementById("questionStem"),
  optionsBox: document.getElementById("optionsBox"),
  answerBox: document.getElementById("answerBox"),
  submitBtn: document.getElementById("submitBtn"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  addWrongBtn: document.getElementById("addWrongBtn"),
  resultPanel: document.getElementById("resultPanel"),
  resultTitle: document.getElementById("resultTitle"),
  questionScore: document.getElementById("questionScore"),
  resultText: document.getElementById("resultText"),
  referenceAnswer: document.getElementById("referenceAnswer"),
  explanationText: document.getElementById("explanationText"),
  sourceText: document.getElementById("sourceText"),
  selfReviewTip: document.getElementById("selfReviewTip"),
};

const subjects = [
  {
    id: "microcomputer",
    name: "微机原理",
    file: "data/microcomputer.json",
  },
  {
    id: "sensor_signal",
    name: "传感与信号处理",
    file: "data/sensor_signal.json",
  },
  {
    id: "manufacturing",
    name: "机械制造技术基础",
    file: "data/manufacturing.json",
  },
  {
    id: "industrial_robot",
    name: "工业机器人应用技术",
    file: "data/industrial_robot.json",
  },
  {
    id: "forming_technology",
    name: "成型技术基础",
    file: "data/forming_technology.json",
  },
];

const examPlan = [
  { label: "单项选择题", count: 15, match: (type) => isChoiceType(type) },
  { label: "填空题", count: 10, match: (type) => isFillType(type) },
  { label: "程序阅读题", count: 2, match: (type) => isProgramReadingType(type) },
  { label: "简答题", count: 2, match: (type) => isShortAnswerType(type) },
  { label: "系统扩展题", count: 1, match: (type) => isSystemExpandType(type) },
  { label: "程序设计题", count: 4, match: (type) => isProgramDesignType(type) },
];

const state = {
  allQuestions: [],
  filteredQuestions: [],
  currentIndex: 0,
  score: 0,
  answered: 0,
  submittedCurrent: false,
  mode: "practice",
  currentSubject: null,
  subjectStatuses: new Map(),
  wrongQuestions: [],
  timerId: null,
  examEndTime: null,
};

function field(question, name) {
  return question[name] ?? "";
}

function isChoiceType(type) {
  return String(type).includes("选择");
}

function isFillType(type) {
  return String(type).includes("填空");
}

function isShortAnswerType(type) {
  return String(type).includes("简答");
}

function isSystemExpandType(type) {
  return String(type).includes("系统扩展");
}

function isProgramReadingType(type) {
  return String(type).includes("程序阅读");
}

function isProgramDesignType(type) {
  return String(type).includes("程序设计");
}

function isSubjectiveType(type) {
  return isShortAnswerType(type)
    || isSystemExpandType(type)
    || isProgramReadingType(type)
    || isProgramDesignType(type);
}

function uniqueValues(items, getter) {
  return [...new Set(items.map(getter).filter(Boolean))];
}

function fillSelect(select, values, allLabel) {
  select.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = allLabel;
  select.appendChild(allOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function flattenBank(bank) {
  if (Array.isArray(bank)) {
    return bank;
  }

  const result = [];
  (bank.chapters || []).forEach((chapter) => {
    (chapter["题目"] || []).forEach((question) => {
      result.push(question);
    });
  });
  return result;
}

async function readSubjectBank(subject) {
  if (window.courseApi && typeof window.courseApi.readJson === "function") {
    const result = await window.courseApi.readJson(subject.file);
    if (!result.ok) {
      throw new Error(result.error || "题库加载失败。");
    }
    return result.data;
  }

  const response = await fetch(subject.file);
  if (!response.ok) {
    throw new Error(`题库加载失败：HTTP ${response.status}`);
  }
  return response.json();
}

async function getSubjectStatus(subject) {
  try {
    const bank = await readSubjectBank(subject);
    const questions = flattenBank(bank);
    return {
      available: questions.length > 0,
      count: questions.length,
      error: "",
    };
  } catch (error) {
    return {
      available: false,
      count: 0,
      error: error.message,
    };
  }
}

function showView(viewName) {
  dom.menuView.classList.toggle("hidden", viewName !== "menu");
  dom.questionView.classList.toggle("hidden", viewName !== "question");
  dom.placeholderView.classList.toggle("hidden", viewName !== "placeholder");
  dom.scoreboard.classList.toggle("hidden", viewName !== "question");
}

async function renderMenu() {
  showView("menu");
  stopTimer();
  dom.appTitle.textContent = "课程题库主菜单";
  dom.loadStatus.textContent = "请选择科目";
  dom.subjectGrid.innerHTML = "";
  state.currentSubject = null;

  subjects.forEach((subject) => {
    renderSubjectCard(subject, { available: false, count: 0, loading: true });
  });

  const statuses = await Promise.all(subjects.map(async (subject) => {
    const status = await getSubjectStatus(subject);
    state.subjectStatuses.set(subject.id, status);
    return { subject, status };
  }));

  dom.subjectGrid.innerHTML = "";
  statuses.forEach(({ subject, status }) => renderSubjectCard(subject, status));
}

function renderSubjectCard(subject, status) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "subject-card";

  const textBox = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = subject.name;
  const description = document.createElement("p");
  description.textContent = status.loading
    ? "正在检测题库文件..."
    : status.available
      ? `共 ${status.count} 道题`
      : "该科目后续可添加题库文件";
  textBox.appendChild(title);
  textBox.appendChild(description);

  const badge = document.createElement("span");
  badge.className = `subject-status ${status.available ? "ready" : "missing"}`;
  badge.textContent = status.loading
    ? "检测中"
    : status.available
      ? "已添加题库"
      : "尚未添加题库";

  button.appendChild(textBox);
  button.appendChild(badge);
  button.addEventListener("click", () => openSubject(subject));
  dom.subjectGrid.appendChild(button);
}

async function openSubject(subject) {
  const status = state.subjectStatuses.get(subject.id) || await getSubjectStatus(subject);
  state.subjectStatuses.set(subject.id, status);
  if (!status.available) {
    showPlaceholder(subject);
    return;
  }
  loadBank(subject).catch((error) => {
    console.error(error);
    showPlaceholder(subject);
  });
}

function showPlaceholder(subject) {
  showView("placeholder");
  stopTimer();
  state.currentSubject = subject;
  dom.appTitle.textContent = subject.name;
  dom.loadStatus.textContent = "尚未添加题库";
  dom.placeholderSubject.textContent = subject.name;
}

function resetSession() {
  state.allQuestions = [];
  state.filteredQuestions = [];
  state.currentIndex = 0;
  state.score = 0;
  state.answered = 0;
  state.submittedCurrent = false;
  state.mode = "practice";
  stopTimer();
  updateStats();
}

async function loadBank(subject) {
  showView("question");
  resetSession();
  state.currentSubject = subject;
  state.wrongQuestions = loadWrongBook();
  dom.appTitle.textContent = `${subject.name}题库自测`;
  dom.currentSubjectText.textContent = subject.name;
  dom.loadStatus.textContent = "正在加载题库...";

  const bank = await readSubjectBank(subject);
  state.allQuestions = flattenBank(bank);
  if (!state.allQuestions.length) {
    throw new Error("题库为空。");
  }
  state.filteredQuestions = [...state.allQuestions];

  fillSelect(dom.chapterFilter, uniqueValues(state.allQuestions, (q) => field(q, "章节")), "全部章节");
  fillSelect(dom.typeFilter, uniqueValues(state.allQuestions, (q) => field(q, "题型")), "全部题型");
  fillSelect(dom.difficultyFilter, uniqueValues(state.allQuestions, (q) => field(q, "难度")), "全部难度");

  dom.loadStatus.textContent = `已加载 ${state.allQuestions.length} 道题`;
  renderWrongBook();
  showQuestion(0);
}

function applyFilters() {
  state.mode = "practice";
  stopTimer();
  state.filteredQuestions = getFilteredQuestions();
  showQuestion(0);
}

function getFilteredQuestions() {
  const chapter = dom.chapterFilter.value;
  const type = dom.typeFilter.value;
  const difficulty = dom.difficultyFilter.value;

  return state.allQuestions.filter((question) => {
    return (!chapter || field(question, "章节") === chapter)
      && (!type || field(question, "题型") === type)
      && (!difficulty || field(question, "难度") === difficulty);
  });
}

function showQuestion(index) {
  state.currentIndex = index;
  state.submittedCurrent = false;
  dom.submitBtn.disabled = false;
  dom.resultPanel.classList.add("hidden");

  const total = state.filteredQuestions.length;
  dom.modeText.textContent = state.mode === "exam" ? "当前模式：模拟考试" : "当前模式：普通练习";
  dom.poolText.textContent = `当前题池：${total}`;
  dom.positionText.textContent = total ? `第 ${index + 1} / ${total} 题` : "第 0 / 0 题";
  dom.prevBtn.disabled = !total;
  dom.nextBtn.disabled = !total;
  dom.randomBtn.disabled = state.mode === "exam" || !total;

  if (!total) {
    dom.qidText.textContent = "-";
    dom.chapterText.textContent = "-";
    dom.typeText.textContent = "-";
    dom.difficultyText.textContent = "-";
    dom.questionStem.textContent = "没有符合条件的题目";
    dom.optionsBox.innerHTML = "";
    dom.answerBox.innerHTML = "";
    return;
  }

  const question = state.filteredQuestions[index];
  dom.qidText.textContent = field(question, "编号");
  dom.chapterText.textContent = field(question, "章节");
  dom.typeText.textContent = field(question, "题型");
  dom.difficultyText.textContent = field(question, "难度");
  renderQuestionStem(field(question, "题干"));
  renderAnswerInput(question);
}

function renderQuestionStem(text) {
  dom.questionStem.innerHTML = "";
  const parts = String(text).split(/```(?:\w+)?\n([\s\S]*?)```/g);

  parts.forEach((part, index) => {
    if (!part) {
      return;
    }
    if (index % 2 === 1) {
      const pre = document.createElement("pre");
      pre.textContent = part.trimEnd();
      dom.questionStem.appendChild(pre);
      return;
    }

    part.split(/\n{2,}/).forEach((paragraphText) => {
      const clean = paragraphText.trim();
      if (!clean) {
        return;
      }
      const paragraph = document.createElement("p");
      paragraph.textContent = clean;
      dom.questionStem.appendChild(paragraph);
    });
  });
}

function renderAnswerInput(question) {
  dom.optionsBox.innerHTML = "";
  dom.answerBox.innerHTML = "";
  const type = field(question, "题型");

  if (isChoiceType(type)) {
    (field(question, "选项") || []).forEach((optionText) => {
      const label = document.createElement("label");
      label.className = "option-item";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = optionText.trim().slice(0, 1).toUpperCase();
      const span = document.createElement("span");
      span.textContent = optionText;
      label.appendChild(input);
      label.appendChild(span);
      dom.optionsBox.appendChild(label);
    });
    return;
  }

  const hint = document.createElement("p");
  hint.textContent = isFillType(type)
    ? "填写关键词即可，判断时会忽略大小写和多余空格。"
    : "输入你的作答。提交后会显示参考答案、解析和按文本重合度估算的自评分。";
  dom.answerBox.appendChild(hint);

  if (isFillType(type)) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answerInput";
    input.placeholder = "请输入答案";
    dom.answerBox.appendChild(input);
  } else {
    const textarea = document.createElement("textarea");
    textarea.id = "answerInput";
    textarea.placeholder = "请输入你的答案、分析过程或程序";
    dom.answerBox.appendChild(textarea);
  }
}

function currentQuestion() {
  return state.filteredQuestions[state.currentIndex] || null;
}

function getUserAnswer(question) {
  if (isChoiceType(field(question, "题型"))) {
    const checked = document.querySelector("input[name='choice']:checked");
    return checked ? checked.value : "";
  }
  const input = document.getElementById("answerInput");
  return input ? input.value : "";
}

function normalizeFill(value) {
  return String(value).toLowerCase().replace(/\s+/g, "");
}

function normalizeChineseAnswer(value) {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。；：、“”‘’（）《》【】\[\]{}.,;:!?'""`~\-_/\\|=+*#@%^&$]/g, "");
}

function normalizeProgram(value) {
  return String(value)
    .toLowerCase()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("")
    .replace(/\s+/g, "");
}

function tokensForSubjective(value, type) {
  const normalized = isProgramDesignType(type) ? normalizeProgram(value) : normalizeChineseAnswer(value);
  const asciiTokens = normalized.match(/[a-z0-9_#@]+/g) || [];
  const chineseTokens = normalized.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  const chunks = [];
  chineseTokens.forEach((token) => {
    if (token.length <= 4) {
      chunks.push(token);
    } else {
      for (let i = 0; i <= token.length - 2; i += 2) {
        chunks.push(token.slice(i, i + 2));
      }
    }
  });
  return [...new Set([...asciiTokens, ...chunks].filter((token) => token.length >= 2))];
}

function overlapScore(userAnswer, referenceAnswer, type) {
  const refTokens = tokensForSubjective(referenceAnswer, type);
  if (!refTokens.length) {
    return 0;
  }
  const userText = isProgramDesignType(type) ? normalizeProgram(userAnswer) : normalizeChineseAnswer(userAnswer);
  let hits = 0;
  refTokens.forEach((token) => {
    if (userText.includes(token)) {
      hits += 1;
    }
  });
  return Math.max(0, Math.min(1, hits / refTokens.length));
}

function evaluate(question, userAnswer) {
  const type = field(question, "题型");
  const answer = field(question, "答案");

  if (isChoiceType(type)) {
    const expected = String(answer).trim().slice(0, 1).toUpperCase();
    const actual = String(userAnswer).trim().slice(0, 1).toUpperCase();
    return {
      score: actual === expected ? 1 : 0,
      correct: actual === expected,
      title: actual === expected ? "回答正确" : "回答错误",
      text: `你的答案：${actual || "未填写"}；正确答案：${expected}`,
      className: actual === expected ? "ok" : "bad",
      tip: "选择题按选项字母自动判断。",
    };
  }

  if (isFillType(type)) {
    const correct = normalizeFill(userAnswer) === normalizeFill(answer);
    return {
      score: correct ? 1 : 0,
      correct,
      title: correct ? "回答正确" : "回答错误",
      text: `你的答案：${userAnswer || "未填写"}`,
      className: correct ? "ok" : "bad",
      tip: "填空题已忽略大小写和多余空格；同义表达需要你人工确认。",
    };
  }

  const ratio = overlapScore(userAnswer, answer, type);
  const score = Number(ratio.toFixed(2));
  return {
    score,
    correct: ratio >= 0.7,
    title: "参考评分",
    text: `文本重合度约 ${(ratio * 100).toFixed(0)}%，本题自评分 ${score.toFixed(2)} 分。`,
    className: ratio >= 0.7 ? "ok" : ratio >= 0.35 ? "warn" : "bad",
    tip: subjectiveTip(type),
  };
}

function subjectiveTip(type) {
  if (isShortAnswerType(type)) {
    return "自评提示：简答题已忽略空格和常见符号，但仍需要你核对是否覆盖关键概念、作用和易错点。";
  }
  if (isProgramDesignType(type)) {
    return "自评提示：程序设计题已忽略空行和空格，重点核对初始化、关键寄存器/指令、循环或中断流程是否正确。";
  }
  if (isProgramReadingType(type)) {
    return "自评提示：程序阅读题重点核对寄存器变化、循环次数、标志位和最终结果。";
  }
  if (isSystemExpandType(type)) {
    return "自评提示：系统扩展题重点核对地址线、数据线、控制线、片选和访问指令。";
  }
  return "自评提示：请核对参考答案中的关键点。";
}

function submitAnswer() {
  const question = currentQuestion();
  if (!question || state.submittedCurrent) {
    return;
  }

  const userAnswer = getUserAnswer(question).trim();
  if (!userAnswer) {
    alert("请先输入或选择答案。");
    return;
  }

  const result = evaluate(question, userAnswer);
  state.score += result.score;
  state.answered += 1;
  state.submittedCurrent = true;
  dom.submitBtn.disabled = true;
  updateStats();
  showResult(question, result);

  if (!result.correct) {
    addWrongQuestion(question, userAnswer, false);
  }
}

function showReferenceOnly() {
  const question = currentQuestion();
  if (!question) {
    return;
  }
  const result = {
    score: 0,
    title: "参考答案",
    text: "已显示参考答案。本次未计入答题统计。",
    className: "warn",
    tip: isSubjectiveType(field(question, "题型"))
      ? subjectiveTip(field(question, "题型"))
      : "查看答案后可以继续练习下一题。",
  };
  showResult(question, result);
}

function showResult(question, result) {
  dom.resultPanel.classList.remove("hidden");
  dom.resultTitle.textContent = result.title;
  dom.questionScore.textContent = `${result.score.toFixed(2)} 分`;
  dom.resultText.className = `result-text ${result.className}`;
  dom.resultText.textContent = result.text;
  dom.referenceAnswer.textContent = field(question, "答案");
  dom.explanationText.textContent = field(question, "解析");
  dom.sourceText.textContent = field(question, "知识点来源");
  dom.selfReviewTip.textContent = result.tip;
}

function updateStats() {
  dom.scoreText.textContent = state.score.toFixed(1);
  dom.answeredText.textContent = String(state.answered);
  const accuracy = state.answered ? (state.score / state.answered) * 100 : 0;
  dom.accuracyText.textContent = `${accuracy.toFixed(0)}%`;
  dom.wrongCountText.textContent = String(state.wrongQuestions.length);
}

function showPrevious() {
  if (!state.filteredQuestions.length) {
    return;
  }
  const previousIndex = (state.currentIndex - 1 + state.filteredQuestions.length) % state.filteredQuestions.length;
  showQuestion(previousIndex);
}

function showNext() {
  if (!state.filteredQuestions.length) {
    return;
  }
  const nextIndex = (state.currentIndex + 1) % state.filteredQuestions.length;
  showQuestion(nextIndex);
}

function showRandom() {
  if (state.mode !== "exam") {
    state.filteredQuestions = getFilteredQuestions();
  }
  if (!state.filteredQuestions.length) {
    showQuestion(0);
    return;
  }
  const randomIndex = Math.floor(Math.random() * state.filteredQuestions.length);
  showQuestion(randomIndex);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickBalanced(pool, count, usedIds) {
  const byChapter = new Map();
  shuffle(pool).forEach((question) => {
    const id = field(question, "编号");
    if (usedIds.has(id)) {
      return;
    }
    const chapter = field(question, "章节");
    if (!byChapter.has(chapter)) {
      byChapter.set(chapter, []);
    }
    byChapter.get(chapter).push(question);
  });

  const picked = [];
  const chapterKeys = shuffle([...byChapter.keys()]);
  while (picked.length < count && chapterKeys.length) {
    let changed = false;
    for (const chapter of chapterKeys) {
      const list = byChapter.get(chapter) || [];
      const question = list.shift();
      if (question) {
        picked.push(question);
        usedIds.add(field(question, "编号"));
        changed = true;
        if (picked.length >= count) {
          break;
        }
      }
    }
    if (!changed) {
      break;
    }
  }
  return picked;
}

function buildExamPaper() {
  const usedIds = new Set();
  const paper = [];
  const warnings = [];

  examPlan.forEach((item) => {
    const pool = state.allQuestions.filter((question) => item.match(field(question, "题型")));
    const picked = pickBalanced(pool, item.count, usedIds);
    paper.push(...picked);
    if (picked.length < item.count) {
      warnings.push(`${item.label} 题量不足，只抽到 ${picked.length} 道`);
    }
  });

  if (warnings.length) {
    alert(warnings.join("\n"));
  }
  return paper;
}

function startExam() {
  const paper = buildExamPaper();
  if (!paper.length) {
    alert("没有可用于模拟考试的题目。");
    return;
  }
  state.mode = "exam";
  state.filteredQuestions = paper;
  state.score = 0;
  state.answered = 0;
  state.submittedCurrent = false;
  updateStats();

  if (dom.timerToggle.checked) {
    startTimer(2 * 60 * 60);
  } else {
    stopTimer();
  }
  showQuestion(0);
}

function exitExam() {
  state.mode = "practice";
  stopTimer();
  state.filteredQuestions = getFilteredQuestions();
  showQuestion(0);
}

function startTimer(seconds) {
  stopTimer();
  state.examEndTime = Date.now() + seconds * 1000;
  updateTimerText();
  state.timerId = window.setInterval(updateTimerText, 1000);
}

function stopTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
  }
  state.timerId = null;
  state.examEndTime = null;
  dom.timerText.textContent = "未开启";
}

function updateTimerText() {
  if (!state.examEndTime) {
    return;
  }
  const remaining = Math.max(0, Math.ceil((state.examEndTime - Date.now()) / 1000));
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  dom.timerText.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  if (remaining <= 0) {
    stopTimer();
    alert("模拟考试时间到。");
  }
}

function loadWrongBook() {
  const key = wrongBookKey();
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function wrongBookKey() {
  return state.currentSubject ? `wrongBook:${state.currentSubject.id}` : "wrongBook:unknown";
}

function saveWrongBook() {
  localStorage.setItem(wrongBookKey(), JSON.stringify(state.wrongQuestions));
}

function addWrongQuestion(question, userAnswer = "", manual = true) {
  const id = field(question, "编号");
  const record = {
    编号: id,
    章节: field(question, "章节"),
    题型: field(question, "题型"),
    难度: field(question, "难度"),
    题干: field(question, "题干"),
    选项: field(question, "选项") || [],
    我的答案: userAnswer,
    答案: field(question, "答案"),
    解析: field(question, "解析"),
    知识点来源: field(question, "知识点来源"),
    记录时间: new Date().toLocaleString(),
  };

  const existingIndex = state.wrongQuestions.findIndex((item) => item.编号 === id);
  if (existingIndex >= 0) {
    state.wrongQuestions[existingIndex] = record;
  } else {
    state.wrongQuestions.unshift(record);
  }
  saveWrongBook();
  renderWrongBook();
  updateStats();
  if (manual) {
    alert("已加入错题本。");
  }
}

function removeWrongQuestion(id) {
  state.wrongQuestions = state.wrongQuestions.filter((item) => item.编号 !== id);
  saveWrongBook();
  renderWrongBook();
  updateStats();
}

function renderWrongBook() {
  if (!state.wrongQuestions.length) {
    dom.wrongList.textContent = "暂无错题";
    updateStats();
    return;
  }

  dom.wrongList.innerHTML = "";
  state.wrongQuestions.forEach((item) => {
    const details = document.createElement("details");
    details.className = "wrong-item";

    const summary = document.createElement("summary");
    summary.textContent = `${item.编号}｜${item.题型}｜${item.章节}`;
    details.appendChild(summary);

    const stem = document.createElement("p");
    stem.textContent = item.题干;
    details.appendChild(stem);

    if (item.选项 && item.选项.length) {
      const options = document.createElement("pre");
      options.textContent = item.选项.join("\n");
      details.appendChild(options);
    }

    const answer = document.createElement("pre");
    answer.textContent = `我的答案：${item.我的答案 || "未记录"}\n参考答案：${item.答案}\n解析：${item.解析}\n知识点来源：${item.知识点来源}`;
    details.appendChild(answer);

    const actions = document.createElement("div");
    actions.className = "button-row";

    const goButton = document.createElement("button");
    goButton.type = "button";
    goButton.textContent = "练这题";
    goButton.addEventListener("click", () => {
      state.mode = "practice";
      stopTimer();
      state.filteredQuestions = state.allQuestions.filter((question) => field(question, "编号") === item.编号);
      showQuestion(0);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "移除";
    removeButton.addEventListener("click", () => removeWrongQuestion(item.编号));

    actions.appendChild(goButton);
    actions.appendChild(removeButton);
    details.appendChild(actions);
    dom.wrongList.appendChild(details);
  });
  updateStats();
}

function clearWrongBook() {
  if (!state.wrongQuestions.length) {
    return;
  }
  if (!confirm("确认清空错题本吗？")) {
    return;
  }
  state.wrongQuestions = [];
  saveWrongBook();
  renderWrongBook();
}

dom.applyFilterBtn.addEventListener("click", applyFilters);
dom.randomBtn.addEventListener("click", showRandom);
dom.prevBtn.addEventListener("click", showPrevious);
dom.nextBtn.addEventListener("click", showNext);
dom.submitBtn.addEventListener("click", submitAnswer);
dom.showAnswerBtn.addEventListener("click", showReferenceOnly);
dom.addWrongBtn.addEventListener("click", () => {
  const question = currentQuestion();
  if (question) {
    addWrongQuestion(question, getUserAnswer(question), true);
  }
});
dom.startExamBtn.addEventListener("click", startExam);
dom.exitExamBtn.addEventListener("click", exitExam);
dom.clearWrongBtn.addEventListener("click", clearWrongBook);
dom.backToMenuBtn.addEventListener("click", renderMenu);
dom.placeholderBackBtn.addEventListener("click", renderMenu);

renderMenu().catch((error) => {
  dom.loadStatus.textContent = error.message;
  dom.subjectGrid.textContent = "主菜单加载失败。请确认 app/data/ 目录可访问。";
  console.error(error);
});
