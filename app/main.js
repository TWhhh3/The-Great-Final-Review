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
  examToolbar: document.getElementById("examToolbar"),
  examPositionText: document.getElementById("examPositionText"),
  examTimerText: document.getElementById("examTimerText"),
  examSubmitBtn: document.getElementById("examSubmitBtn"),
  examExitBtn: document.getElementById("examExitBtn"),
  examNavRow: document.getElementById("examNavRow"),
  examPrevBtn: document.getElementById("examPrevBtn"),
  examNextBtn: document.getElementById("examNextBtn"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),
  currentSubjectText: document.getElementById("currentSubjectText"),
  chapterFilter: document.getElementById("chapterFilter"),
  typeFilter: document.getElementById("typeFilter"),
  difficultyFilter: document.getElementById("difficultyFilter"),
  applyFilterBtn: document.getElementById("applyFilterBtn"),
  randomBtn: document.getElementById("randomBtn"),
  questionJumpInput: document.getElementById("questionJumpInput"),
  jumpQuestionBtn: document.getElementById("jumpQuestionBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  resetPoolBtn: document.getElementById("resetPoolBtn"),
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
  submitExamBtn: document.getElementById("submitExamBtn"),
  exitExamBtn: document.getElementById("exitExamBtn"),
  clearWrongBtn: document.getElementById("clearWrongBtn"),
  wrongBookCountText: document.getElementById("wrongBookCountText"),
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
  sessionWrongCount: 0,
  practiceSubmissions: new Map(),
  examAnswers: new Map(),
  examSubmitted: false,
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
  updateExamLayout();
}

function updateExamLayout() {
  const isExam = state.mode === "exam";
  dom.questionView.classList.toggle("exam-layout", isExam);
  dom.examToolbar.classList.toggle("hidden", !isExam);
  dom.examNavRow.classList.toggle("hidden", !isExam);
  if (!dom.questionView.classList.contains("hidden")) {
    dom.scoreboard.classList.toggle("hidden", isExam && !state.examSubmitted);
  }
  const submitRow = document.querySelector(".submit-row");
  if (submitRow) {
    submitRow.classList.toggle("hidden", isExam);
  }
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
  state.sessionWrongCount = 0;
  state.submittedCurrent = false;
  state.mode = "practice";
  state.practiceSubmissions = new Map();
  state.examAnswers = new Map();
  state.examSubmitted = false;
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
  restoreSubjectSession();
}

function applyFilters() {
  saveCurrentExamAnswer();
  state.mode = "practice";
  state.examAnswers = new Map();
  state.examSubmitted = false;
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

function subjectSessionKey() {
  return state.currentSubject ? `subjectSession:${state.currentSubject.id}` : "";
}

function saveSubjectSession() {
  const key = subjectSessionKey();
  if (!key || state.mode !== "practice") {
    return;
  }

  const question = currentQuestion();
  const session = {
    chapter: dom.chapterFilter.value,
    type: dom.typeFilter.value,
    difficulty: dom.difficultyFilter.value,
    questionId: question ? field(question, "编号") : "",
    index: state.currentIndex,
  };
  localStorage.setItem(key, JSON.stringify(session));
}

function restoreSubjectSession() {
  let session = null;
  const key = subjectSessionKey();
  if (key) {
    try {
      session = JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      session = null;
    }
  }

  if (session) {
    setSelectValueIfExists(dom.chapterFilter, session.chapter);
    setSelectValueIfExists(dom.typeFilter, session.type);
    setSelectValueIfExists(dom.difficultyFilter, session.difficulty);
  }

  state.filteredQuestions = getFilteredQuestions();
  const restoredIndex = findQuestionIndex(session?.questionId);
  const fallbackIndex = Number.isInteger(session?.index) ? session.index : 0;
  showQuestion(restoredIndex >= 0 ? restoredIndex : fallbackIndex);
}

function setSelectValueIfExists(select, value) {
  if (!value) {
    select.value = "";
    return;
  }
  const exists = [...select.options].some((option) => option.value === value);
  select.value = exists ? value : "";
}

function findQuestionIndex(questionId) {
  if (!questionId) {
    return -1;
  }
  const target = normalizeQuestionId(questionId);
  return state.filteredQuestions.findIndex((question) => normalizeQuestionId(field(question, "编号")) === target);
}

function normalizeQuestionId(value) {
  return String(value).trim().toUpperCase();
}

function showQuestion(index) {
  updateExamLayout();
  const total = state.filteredQuestions.length;
  const safeIndex = total ? Math.max(0, Math.min(index, total - 1)) : 0;
  state.currentIndex = safeIndex;
  state.submittedCurrent = false;
  dom.submitBtn.disabled = state.mode === "exam" && state.examSubmitted;
  dom.resultPanel.classList.add("hidden");

  dom.modeText.textContent = state.mode === "exam" ? "当前模式：模拟考试" : "当前模式：普通练习";
  dom.poolText.textContent = `当前题池：${total}`;
  dom.positionText.textContent = total ? `第 ${safeIndex + 1} / ${total} 题` : "第 0 / 0 题";
  dom.examPositionText.textContent = total ? `第 ${safeIndex + 1} / ${total} 题` : "第 0 / 0 题";
  dom.prevBtn.disabled = !total;
  dom.nextBtn.disabled = !total;
  dom.examPrevBtn.disabled = !total;
  dom.examNextBtn.disabled = !total;
  dom.resetPoolBtn.disabled = !total;
  dom.randomBtn.disabled = state.mode === "exam" || !total;
  dom.jumpQuestionBtn.disabled = !total;
  dom.questionJumpInput.disabled = !total;
  dom.submitExamBtn.disabled = state.mode !== "exam" || !total || state.examSubmitted;
  dom.examSubmitBtn.disabled = state.mode !== "exam" || !total || state.examSubmitted;
  dom.examExitBtn.disabled = state.mode !== "exam";
  dom.submitBtn.textContent = state.mode === "exam" ? "保存答案" : "提交答案";
  dom.showAnswerBtn.disabled = state.mode === "exam" && !state.examSubmitted;
  dom.addWrongBtn.disabled = state.mode === "exam" && !state.examSubmitted;

  if (!total) {
    dom.qidText.textContent = "-";
    dom.chapterText.textContent = "-";
    dom.typeText.textContent = "-";
    dom.difficultyText.textContent = "-";
    dom.questionJumpInput.value = "";
    dom.questionStem.textContent = "没有符合条件的题目";
    dom.optionsBox.innerHTML = "";
    dom.answerBox.innerHTML = "";
    return;
  }

  const question = state.filteredQuestions[safeIndex];
  dom.qidText.textContent = field(question, "编号");
  dom.questionJumpInput.value = field(question, "编号");
  dom.chapterText.textContent = field(question, "章节");
  dom.typeText.textContent = field(question, "题型");
  dom.difficultyText.textContent = field(question, "难度");
  renderQuestionStem(field(question, "题干"));
  renderAnswerInput(question);
  const submission = state.mode === "practice" ? getPracticeSubmission(question) : null;
  if (submission) {
    state.submittedCurrent = true;
    dom.submitBtn.disabled = true;
    showResult(question, submission.result);
  }
  saveSubjectSession();
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
    const practiceSubmission = state.mode === "practice" ? getPracticeSubmission(question) : null;
    (field(question, "选项") || []).forEach((optionText) => {
      const label = document.createElement("label");
      label.className = "option-item";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = optionText.trim().slice(0, 1).toUpperCase();
      input.disabled = (state.mode === "exam" && state.examSubmitted) || Boolean(practiceSubmission);
      if (practiceSubmission && practiceSubmission.userAnswer === input.value) {
        input.checked = true;
      }
      if (state.mode === "exam" && getExamAnswer(question) === input.value) {
        input.checked = true;
      }
      if (state.mode === "exam") {
        input.addEventListener("change", saveCurrentExamAnswer);
      }
      const span = document.createElement("span");
      span.textContent = optionText;
      label.appendChild(input);
      label.appendChild(span);
      dom.optionsBox.appendChild(label);
    });
    return;
  }

  const hint = document.createElement("p");
  hint.textContent = state.mode === "exam"
    ? "模拟考试中可随时修改答案，点击保存答案或切换题目会保留当前作答，交卷后统一显示答案。"
    : isFillType(type)
    ? "填写关键词即可，判断时会忽略大小写和多余空格。"
    : "输入你的作答。提交后会显示参考答案、解析和按文本重合度估算的自评分。";
  dom.answerBox.appendChild(hint);

  if (isFillType(type)) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answerInput";
    input.placeholder = "请输入答案";
    const practiceSubmission = state.mode === "practice" ? getPracticeSubmission(question) : null;
    input.disabled = (state.mode === "exam" && state.examSubmitted) || Boolean(practiceSubmission);
    if (practiceSubmission) {
      input.value = practiceSubmission.userAnswer;
    }
    if (state.mode === "exam") {
      input.value = getExamAnswer(question);
      input.addEventListener("input", saveCurrentExamAnswer);
    }
    dom.answerBox.appendChild(input);
  } else {
    const textarea = document.createElement("textarea");
    textarea.id = "answerInput";
    textarea.placeholder = "请输入你的答案、分析过程或程序";
    const practiceSubmission = state.mode === "practice" ? getPracticeSubmission(question) : null;
    textarea.disabled = (state.mode === "exam" && state.examSubmitted) || Boolean(practiceSubmission);
    if (practiceSubmission) {
      textarea.value = practiceSubmission.userAnswer;
    }
    if (state.mode === "exam") {
      textarea.value = getExamAnswer(question);
      textarea.addEventListener("input", saveCurrentExamAnswer);
    }
    dom.answerBox.appendChild(textarea);
  }
}

function currentQuestion() {
  return state.filteredQuestions[state.currentIndex] || null;
}

function questionKey(question) {
  return field(question, "编号") || String(state.currentIndex);
}

function getPracticeSubmission(question) {
  return state.practiceSubmissions.get(questionKey(question)) || null;
}

function getExamAnswer(question) {
  return state.examAnswers.get(questionKey(question)) || "";
}

function saveCurrentExamAnswer() {
  if (state.mode !== "exam" || state.examSubmitted) {
    return;
  }
  const question = currentQuestion();
  if (!question) {
    return;
  }
  state.examAnswers.set(questionKey(question), getUserAnswer(question).trim());
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

  if (state.mode === "exam" && state.examSubmitted) {
    return;
  }

  const userAnswer = getUserAnswer(question).trim();
  if (state.mode === "exam") {
    saveCurrentExamAnswer();
    dom.loadStatus.textContent = userAnswer
      ? `已保存 ${field(question, "编号")} 的答案，交卷后统一显示结果。`
      : `已清空 ${field(question, "编号")} 的答案，交卷后统一显示结果。`;
    return;
  }

  if (!userAnswer) {
    alert("请先输入或选择答案。");
    return;
  }

  const result = evaluate(question, userAnswer);
  state.score += result.score;
  state.answered += 1;
  if (!result.correct) {
    state.sessionWrongCount += 1;
  }
  state.submittedCurrent = true;
  state.practiceSubmissions.set(questionKey(question), { userAnswer, result });
  dom.submitBtn.disabled = true;
  updateStats();
  showResult(question, result);

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
  dom.wrongCountText.textContent = String(state.sessionWrongCount);
  dom.wrongBookCountText.textContent = String(state.wrongQuestions.length);
}

function showPrevious() {
  if (!state.filteredQuestions.length) {
    return;
  }
  saveCurrentExamAnswer();
  const previousIndex = (state.currentIndex - 1 + state.filteredQuestions.length) % state.filteredQuestions.length;
  showQuestion(previousIndex);
}

function showNext() {
  if (!state.filteredQuestions.length) {
    return;
  }
  saveCurrentExamAnswer();
  const nextIndex = (state.currentIndex + 1) % state.filteredQuestions.length;
  showQuestion(nextIndex);
}

function showRandom() {
  saveCurrentExamAnswer();
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

function resetCurrentPool() {
  saveCurrentExamAnswer();
  if (state.mode === "practice") {
    state.practiceSubmissions = new Map();
    state.score = 0;
    state.answered = 0;
    state.sessionWrongCount = 0;
    updateStats();
  }
  if (state.mode !== "exam") {
    state.filteredQuestions = getFilteredQuestions();
  }
  showQuestion(0);
}

function jumpToQuestion() {
  saveCurrentExamAnswer();
  const input = dom.questionJumpInput.value.trim();
  if (!input) {
    alert("请输入题号或序号。");
    return;
  }

  const index = findQuestionIndexByInput(input);
  if (index < 0) {
    alert("当前题池中没有找到该题。");
    return;
  }
  showQuestion(index);
}

function findQuestionIndexByInput(input) {
  const normalized = normalizeQuestionId(input);
  const exactIndex = state.filteredQuestions.findIndex((question) => normalizeQuestionId(field(question, "编号")) === normalized);
  if (exactIndex >= 0) {
    return exactIndex;
  }

  const number = Number.parseInt(input.replace(/^Q/i, ""), 10);
  if (!Number.isInteger(number) || number <= 0) {
    return -1;
  }

  const paddedId = `Q${String(number).padStart(4, "0")}`;
  const idIndex = state.filteredQuestions.findIndex((question) => normalizeQuestionId(field(question, "编号")) === paddedId);
  if (idIndex >= 0) {
    return idIndex;
  }

  const ordinalIndex = number - 1;
  return ordinalIndex >= 0 && ordinalIndex < state.filteredQuestions.length ? ordinalIndex : -1;
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
  saveCurrentExamAnswer();
  const paper = buildExamPaper();
  if (!paper.length) {
    alert("没有可用于模拟考试的题目。");
    return;
  }
  state.mode = "exam";
  state.filteredQuestions = paper;
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.submittedCurrent = false;
  state.examAnswers = new Map();
  state.examSubmitted = false;
  updateStats();

  if (dom.timerToggle.checked) {
    startTimer(2 * 60 * 60);
  } else {
    stopTimer();
  }
  showQuestion(0);
}

function exitExam() {
  saveCurrentExamAnswer();
  state.mode = "practice";
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.examAnswers = new Map();
  state.examSubmitted = false;
  stopTimer();
  state.filteredQuestions = getFilteredQuestions();
  showQuestion(0);
}

function submitExamPaper(confirmSubmission = true) {
  if (state.mode !== "exam" || state.examSubmitted) {
    return;
  }
  saveCurrentExamAnswer();
  if (!state.filteredQuestions.length) {
    alert("当前没有模拟试卷。");
    return;
  }
  if (confirmSubmission && !confirm("确认提交整份模拟试卷吗？提交后将统一显示答案，且不能继续修改。")) {
    return;
  }

  let totalScore = 0;
  let answeredCount = 0;
  let wrongCount = 0;
  const lines = [];
  const wrongLines = [];

  state.filteredQuestions.forEach((question, index) => {
    const userAnswer = getExamAnswer(question);
    const result = userAnswer ? evaluate(question, userAnswer) : {
      score: 0,
      correct: false,
      title: "未作答",
      text: "你的答案：未填写",
      className: "bad",
      tip: "",
    };
    totalScore += result.score;
    if (userAnswer) {
      answeredCount += 1;
    }
    if (!result.correct) {
      wrongCount += 1;
      addWrongQuestion(question, userAnswer, false);
      wrongLines.push(`第 ${index + 1} 题｜${field(question, "编号")}｜${field(question, "题型")}｜你的答案：${userAnswer || "未填写"}｜参考答案：${field(question, "答案")}｜得分 ${result.score.toFixed(2)}`);
    }
    lines.push([
      `第 ${index + 1} 题｜${field(question, "编号")}｜${field(question, "题型")}｜${result.correct ? "正确" : "需复核/错误"}｜${result.score.toFixed(2)} 分`,
      `你的答案：${userAnswer || "未填写"}`,
      `参考答案：${field(question, "答案")}`,
      `解析：${field(question, "解析") || "无"}`,
      `知识点来源：${field(question, "知识点来源") || "无"}`,
    ].join("\n"));
  });

  state.score = Number(totalScore.toFixed(2));
  state.answered = state.filteredQuestions.length;
  state.sessionWrongCount = wrongCount;
  state.examSubmitted = true;
  stopTimer();
  updateStats();
  renderWrongBook();
  showExamResult(lines, wrongLines, answeredCount);
  showQuestion(state.currentIndex);
  dom.resultPanel.classList.remove("hidden");
}

function showExamResult(lines, wrongLines, answeredCount) {
  dom.resultPanel.classList.remove("hidden");
  dom.resultTitle.textContent = "模拟试卷结果";
  dom.questionScore.textContent = `${state.score.toFixed(2)} 分`;
  dom.resultText.className = `result-text ${wrongLines.length ? "bad" : "ok"}`;
  dom.resultText.textContent = `已提交 ${state.filteredQuestions.length} 道题，作答 ${answeredCount} 道。错题/需复核 ${wrongLines.length} 道。`;
  dom.referenceAnswer.textContent = lines.join("\n\n------------------------------\n\n");
  dom.explanationText.textContent = wrongLines.length
    ? wrongLines.join("\n")
    : "本次模拟试卷没有错题。";
  dom.sourceText.textContent = "每题知识点来源已列在左侧答案汇总中。";
  dom.selfReviewTip.textContent = "错题/需复核题已列在“解析”区域，并已自动加入错题本；主观题为文本重合度自评分，请结合参考答案人工复核。";
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
  dom.examTimerText.textContent = "未开启";
}

function updateTimerText() {
  if (!state.examEndTime) {
    return;
  }
  const remaining = Math.max(0, Math.ceil((state.examEndTime - Date.now()) / 1000));
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const timeText = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  dom.timerText.textContent = timeText;
  dom.examTimerText.textContent = timeText;
  if (remaining <= 0) {
    stopTimer();
    alert("模拟考试时间到。");
    if (state.mode === "exam" && !state.examSubmitted) {
      submitExamPaperWithoutConfirm();
    }
  }
}

function submitExamPaperWithoutConfirm() {
  submitExamPaper(false);
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

function returnToMenu() {
  saveCurrentExamAnswer();
  saveSubjectSession();
  state.practiceSubmissions = new Map();
  renderMenu();
}

dom.applyFilterBtn.addEventListener("click", applyFilters);
dom.randomBtn.addEventListener("click", showRandom);
dom.jumpQuestionBtn.addEventListener("click", jumpToQuestion);
dom.questionJumpInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    jumpToQuestion();
  }
});
dom.prevBtn.addEventListener("click", showPrevious);
dom.nextBtn.addEventListener("click", showNext);
dom.examPrevBtn.addEventListener("click", showPrevious);
dom.examNextBtn.addEventListener("click", showNext);
dom.resetPoolBtn.addEventListener("click", resetCurrentPool);
dom.submitBtn.addEventListener("click", submitAnswer);
dom.showAnswerBtn.addEventListener("click", showReferenceOnly);
dom.addWrongBtn.addEventListener("click", () => {
  const question = currentQuestion();
  if (question) {
    addWrongQuestion(question, getUserAnswer(question), true);
  }
});
dom.startExamBtn.addEventListener("click", startExam);
dom.submitExamBtn.addEventListener("click", () => submitExamPaper());
dom.examSubmitBtn.addEventListener("click", () => submitExamPaper());
dom.exitExamBtn.addEventListener("click", exitExam);
dom.examExitBtn.addEventListener("click", exitExam);
dom.clearWrongBtn.addEventListener("click", clearWrongBook);
dom.backToMenuBtn.addEventListener("click", returnToMenu);
dom.placeholderBackBtn.addEventListener("click", renderMenu);

renderMenu().catch((error) => {
  dom.loadStatus.textContent = error.message;
  dom.subjectGrid.textContent = "主菜单加载失败。请确认 app/data/ 目录可访问。";
  console.error(error);
});
