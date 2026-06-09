const dom = {
  appTitle: document.getElementById("appTitle"),
  loadStatus: document.getElementById("loadStatus"),
  toastMessage: document.getElementById("toastMessage"),
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
  examAbandonBtn: document.getElementById("examAbandonBtn"),
  examExitBtn: document.getElementById("examExitBtn"),
  examNavRow: document.getElementById("examNavRow"),
  examPrevBtn: document.getElementById("examPrevBtn"),
  examNextBtn: document.getElementById("examNextBtn"),
  examQuestionNav: document.getElementById("examQuestionNav"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),
  currentSubjectText: document.getElementById("currentSubjectText"),
  courseMaterialsBtn: document.getElementById("courseMaterialsBtn"),
  favoriteZoneBtn: document.getElementById("favoriteZoneBtn"),
  favoriteView: document.getElementById("favoriteView"),
  favoriteHome: document.getElementById("favoriteHome"),
  favoriteListPage: document.getElementById("favoriteListPage"),
  favoriteBackBtn: document.getElementById("favoriteBackBtn"),
  favoriteListBackBtn: document.getElementById("favoriteListBackBtn"),
  mockFavoriteBtn: document.getElementById("mockFavoriteBtn"),
  pastFavoriteBtn: document.getElementById("pastFavoriteBtn"),
  favoriteListTitle: document.getElementById("favoriteListTitle"),
  favoriteTypeFilters: document.getElementById("favoriteTypeFilters"),
  favoriteList: document.getElementById("favoriteList"),
  materialsView: document.getElementById("materialsView"),
  materialsHome: document.getElementById("materialsHome"),
  materialsListPage: document.getElementById("materialsListPage"),
  materialsBackBtn: document.getElementById("materialsBackBtn"),
  materialsCategoryBackBtn: document.getElementById("materialsCategoryBackBtn"),
  materialsSubjectTitle: document.getElementById("materialsSubjectTitle"),
  pptMaterialsBtn: document.getElementById("pptMaterialsBtn"),
  paperMaterialsBtn: document.getElementById("paperMaterialsBtn"),
  materialsCategoryTitle: document.getElementById("materialsCategoryTitle"),
  materialsFileList: document.getElementById("materialsFileList"),
  practiceMockBtn: document.getElementById("practiceMockBtn"),
  practicePastBtn: document.getElementById("practicePastBtn"),
  chapterFilter: document.getElementById("chapterFilter"),
  typeFilter: document.getElementById("typeFilter"),
  questionSourceField: document.getElementById("questionSourceField"),
  questionSourceFilter: document.getElementById("questionSourceFilter"),
  difficultyField: document.getElementById("difficultyField"),
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
  startPastExamBtn: document.getElementById("startPastExamBtn"),
  examHistoryBtn: document.getElementById("examHistoryBtn"),
  continueExamBtn: document.getElementById("continueExamBtn"),
  examHistoryView: document.getElementById("examHistoryView"),
  examHistoryHome: document.getElementById("examHistoryHome"),
  examHistoryListPage: document.getElementById("examHistoryListPage"),
  examHistoryBackBtn: document.getElementById("examHistoryBackBtn"),
  examHistoryListBackBtn: document.getElementById("examHistoryListBackBtn"),
  mockExamHistoryBtn: document.getElementById("mockExamHistoryBtn"),
  pastExamHistoryBtn: document.getElementById("pastExamHistoryBtn"),
  examHistoryListTitle: document.getElementById("examHistoryListTitle"),
  examHistoryList: document.getElementById("examHistoryList"),
  examGrid: document.querySelector(".exam-grid"),
  submitExamBtn: document.getElementById("submitExamBtn"),
  exitExamBtn: document.getElementById("exitExamBtn"),
  clearWrongBtn: document.getElementById("clearWrongBtn"),
  wrongBookCountText: document.getElementById("wrongBookCountText"),
  wrongTypeFilters: document.getElementById("wrongTypeFilters"),
  wrongList: document.getElementById("wrongList"),
  clearPastWrongBtn: document.getElementById("clearPastWrongBtn"),
  pastWrongBookCountText: document.getElementById("pastWrongBookCountText"),
  pastWrongTypeFilters: document.getElementById("pastWrongTypeFilters"),
  pastWrongList: document.getElementById("pastWrongList"),
  qidText: document.getElementById("qidText"),
  chapterText: document.getElementById("chapterText"),
  typeText: document.getElementById("typeText"),
  difficultyText: document.getElementById("difficultyText"),
  questionSourceText: document.getElementById("questionSourceText"),
  questionStem: document.getElementById("questionStem"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  optionsBox: document.getElementById("optionsBox"),
  answerBox: document.getElementById("answerBox"),
  submitBtn: document.getElementById("submitBtn"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  addWrongBtn: document.getElementById("addWrongBtn"),
  favoriteReturnBtn: document.getElementById("favoriteReturnBtn"),
  resultPanel: document.getElementById("resultPanel"),
  resultTitle: document.getElementById("resultTitle"),
  questionScore: document.getElementById("questionScore"),
  resultText: document.getElementById("resultText"),
  referenceAnswer: document.getElementById("referenceAnswer"),
  explanationText: document.getElementById("explanationText"),
  sourceText: document.getElementById("sourceText"),
  selfReviewTip: document.getElementById("selfReviewTip"),
  imagePreviewModal: document.getElementById("imagePreviewModal"),
  imagePreviewImg: document.getElementById("imagePreviewImg"),
  imagePreviewCaption: document.getElementById("imagePreviewCaption"),
  imagePreviewClose: document.getElementById("imagePreviewClose"),
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

const defaultExamPlan = [
  { label: "单项选择题", count: 15, match: (type) => isChoiceType(type) },
  { label: "填空题", count: 10, match: (type) => isFillType(type) },
  { label: "程序阅读题", count: 2, match: (type) => isProgramReadingType(type) },
  { label: "简答题", count: 2, match: (type) => isShortAnswerType(type) },
  { label: "系统扩展题", count: 1, match: (type) => isSystemExpandType(type) },
  { label: "程序设计题", count: 4, match: (type) => isProgramDesignType(type) },
];

const subjectExamPlans = {
  sensor_signal: [
    { label: "单项选择题", count: 15, match: (type) => isChoiceType(type) },
    { label: "判断题", count: 10, match: (type) => isJudgeType(type) },
    { label: "填空题", count: 10, match: (type) => isFillType(type) },
    { label: "简答题", count: 4, match: (type) => isShortAnswerType(type) },
    { label: "计算题", count: 5, match: (type) => isCalculationType(type) },
  ],
};

const pastExamSources = {
  microcomputer: "data/past_exams_microcomputer.json",
  sensor_signal: "data/past_exams_sensor_signal.json",
};

const zoomStep = 0.08;
const minZoomFactor = 0.7;
const maxZoomFactor = 1.6;
let zoomFactor = 1;

const state = {
  allQuestions: [],
  pastPracticeQuestions: [],
  filteredQuestions: [],
  currentIndex: 0,
  score: 0,
  answered: 0,
  submittedCurrent: false,
  mode: "practice",
  practiceSource: "mock",
  favoriteSource: "mock",
  favoriteTypeFilters: { mock: "", past: "" },
  examSource: "mock",
  currentSubject: null,
  subjectStatuses: new Map(),
  wrongQuestions: [],
  pastWrongQuestions: [],
  wrongBookTypeFilter: "",
  pastWrongBookTypeFilter: "",
  wrongPracticeReturnState: null,
  favoriteReturnState: null,
  lastFocusedInput: "",
  toastTimer: null,
  sessionWrongCount: 0,
  practiceStates: new Map(),
  practiceAnswers: new Map(),
  practiceSubmissions: new Map(),
  wrongPracticeAnswers: new Map(),
  wrongPracticeSubmissions: new Map(),
  pastWrongPracticeAnswers: new Map(),
  pastWrongPracticeSubmissions: new Map(),
  favoritePracticeAnswers: new Map(),
  favoritePracticeSubmissions: new Map(),
  examAnswers: new Map(),
  examResults: new Map(),
  pastExamQuestions: [],
  examSubmitted: false,
  examAbandoned: false,
  examStartedAt: null,
  viewingExamHistory: false,
  examHistorySource: "",
  timerId: null,
  examEndTime: null,
};

function field(question, name) {
  return question[name] ?? "";
}

function cleanMetaText(value) {
  return String(value ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}

function setMetaBadge(element, value, prefix = "") {
  const text = cleanMetaText(value);
  element.textContent = text ? `${prefix}${text}` : "";
  element.title = text ? element.textContent : "";
  element.classList.toggle("hidden", !text);
}

function isChoiceType(type) {
  return String(type).includes("选择");
}

function isMultipleChoiceType(type) {
  const text = String(type);
  return text.includes("多项选择") || text.includes("多选");
}

function isFillType(type) {
  return String(type).includes("填空");
}

function isJudgeType(type) {
  const text = String(type);
  return text.includes("判断") || text.includes("正误");
}

function isCalculationType(type) {
  return String(type).includes("计算");
}

function isOptionAnswerType(type) {
  return isChoiceType(type) || isJudgeType(type);
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
    || isProgramDesignType(type)
    || isCalculationType(type);
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

function chapterNumber(value) {
  const match = String(value).match(/第\s*(\d+)\s*章/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortChaptersByNumber(chapters) {
  return [...chapters].sort((a, b) => chapterNumber(a) - chapterNumber(b) || String(a).localeCompare(String(b), "zh-CN"));
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

async function readJsonFile(file) {
  if (window.courseApi && typeof window.courseApi.readJson === "function") {
    const result = await window.courseApi.readJson(file);
    if (!result.ok) {
      throw new Error(result.error || "数据加载失败。");
    }
    return result.data;
  }

  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`数据加载失败：HTTP ${response.status}`);
  }
  return response.json();
}

async function loadPastExamQuestions(subject) {
  const file = pastExamSources[subject.id];
  if (!file) {
    return [];
  }
  const bank = await readJsonFile(file);
  return flattenBank(bank);
}

function practiceQuestions() {
  return state.practiceSource === "past" ? state.pastPracticeQuestions : state.allQuestions;
}

function updatePracticeSourceControls() {
  const isPast = state.practiceSource === "past";
  dom.practiceMockBtn.classList.toggle("active", !isPast);
  dom.practicePastBtn.classList.toggle("active", isPast);
  dom.questionSourceField.classList.toggle("hidden", !isPast);
  dom.difficultyField.classList.toggle("hidden", isPast);
  if (isPast) {
    dom.difficultyFilter.value = "";
  } else {
    dom.questionSourceFilter.value = "";
  }
}

function refreshPracticeFilters() {
  const questions = practiceQuestions();
  const chapters = uniqueValues(questions, (q) => field(q, "章节"));
  fillSelect(dom.chapterFilter, state.practiceSource === "past" ? sortChaptersByNumber(chapters) : chapters, "全部章节");
  fillSelect(dom.typeFilter, uniqueValues(questions, (q) => field(q, "题型")), "全部题型");
  fillSelect(dom.questionSourceFilter, uniqueValues(questions, (q) => field(q, "题目来源")), "全部来源");
  fillSelect(dom.difficultyFilter, uniqueValues(questions, (q) => field(q, "难度")), "全部难度");
  updatePracticeSourceControls();
}

async function getSubjectStatus(subject) {
  try {
    const bank = await readSubjectBank(subject);
    const questions = flattenBank(bank);
    const pastQuestions = await loadPastExamQuestions(subject).catch(() => []);
    return {
      available: questions.length > 0,
      count: questions.length,
      pastCount: pastQuestions.length,
      error: "",
    };
  } catch (error) {
    return {
      available: false,
      count: 0,
      pastCount: 0,
      error: error.message,
    };
  }
}

function questionCountText(mockCount, pastCount) {
  return `${mockCount} 道模拟题，${pastCount} 道真题`;
}

function currentExamPlan() {
  const subjectId = state.currentSubject ? state.currentSubject.id : "";
  return subjectExamPlans[subjectId] || defaultExamPlan;
}

function updateExamPanelPlan() {
  if (!dom.examGrid) {
    return;
  }
  dom.examGrid.innerHTML = "";
  currentExamPlan().forEach((item) => {
    const span = document.createElement("span");
    span.textContent = `${item.label.replace(/题$/, "")} ${item.count}`;
    dom.examGrid.appendChild(span);
  });
}

function showView(viewName) {
  dom.menuView.classList.toggle("hidden", viewName !== "menu");
  dom.questionView.classList.toggle("hidden", viewName !== "question");
  dom.placeholderView.classList.toggle("hidden", viewName !== "placeholder");
  dom.favoriteView.classList.toggle("hidden", viewName !== "favorite");
  dom.examHistoryView.classList.toggle("hidden", viewName !== "examHistory");
  dom.materialsView.classList.toggle("hidden", viewName !== "materials");
  dom.scoreboard.classList.toggle("hidden", viewName !== "question");
  updateExamLayout();
}

function updateExamLayout() {
  const isExam = state.mode === "exam";
  const isFocusedPractice = isFavoritePracticeMode() || isWrongPracticeMode();
  dom.questionView.classList.toggle("exam-layout", isExam);
  dom.questionView.classList.toggle("favorite-layout", isFocusedPractice);
  dom.examToolbar.classList.toggle("hidden", !isExam);
  dom.examNavRow.classList.toggle("hidden", !isExam);
  dom.examQuestionNav.classList.toggle("hidden", !isExam);
  if (!dom.questionView.classList.contains("hidden")) {
    dom.scoreboard.classList.toggle("hidden", isExam && !state.examSubmitted);
  }
  const submitRow = document.querySelector(".submit-row");
  if (submitRow) {
    submitRow.classList.toggle("hidden", isExam && !state.examSubmitted);
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
      ? `共 ${questionCountText(status.count, status.pastCount || 0)}`
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

function showMaterialsHome() {
  if (!state.currentSubject) {
    return;
  }
  showView("materials");
  dom.materialsHome.classList.remove("hidden");
  dom.materialsListPage.classList.add("hidden");
  dom.appTitle.textContent = "课程资料";
  dom.loadStatus.textContent = state.currentSubject.name;
  dom.materialsSubjectTitle.textContent = state.currentSubject.name;
}

function returnFromMaterials() {
  if (state.currentSubject) {
    showView("question");
    dom.appTitle.textContent = `${state.currentSubject.name}题库自测`;
    dom.loadStatus.textContent = `已加载${questionCountText(state.allQuestions.length, state.pastPracticeQuestions.length)}`;
  } else {
    renderMenu();
  }
}

async function showMaterialsCategory(category, title) {
  if (!state.currentSubject) {
    return;
  }
  showView("materials");
  dom.materialsHome.classList.add("hidden");
  dom.materialsListPage.classList.remove("hidden");
  dom.materialsCategoryTitle.textContent = title;
  dom.materialsFileList.textContent = "正在加载...";

  if (!window.courseApi || typeof window.courseApi.listMaterialFiles !== "function") {
    dom.materialsFileList.textContent = "当前运行环境不支持打开课程资料。请通过 Electron 桌面端启动。";
    return;
  }

  const result = await window.courseApi.listMaterialFiles(state.currentSubject.id, category);
  if (!result.ok) {
    dom.materialsFileList.textContent = `未找到资料文件：${result.error}`;
    return;
  }
  if (!result.files.length) {
    dom.materialsFileList.textContent = "该分类下暂无文件。";
    return;
  }

  dom.materialsFileList.innerHTML = "";
  result.files.forEach((fileName) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "material-file-item";
    button.textContent = fileName;
    button.addEventListener("click", async () => {
      const openResult = await window.courseApi.openMaterialFile(state.currentSubject.id, category, fileName);
      if (!openResult.ok) {
        alert(`打开文件失败：${openResult.error}`);
      }
    });
    dom.materialsFileList.appendChild(button);
  });
}

function examHistoryKey(source) {
  const subjectId = state.currentSubject ? state.currentSubject.id : "unknown";
  return `examHistory:${subjectId}:${source}`;
}

function examHistoryTitle(source) {
  return source === "past" ? "真题考试记录" : "模拟考试记录";
}

function loadExamHistory(source) {
  try {
    const records = JSON.parse(localStorage.getItem(examHistoryKey(source)) || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function saveExamHistory(source, records) {
  localStorage.setItem(examHistoryKey(source), JSON.stringify(records.slice(0, 10)));
}

function saveExamHistoryRecord(answeredCount, wrongCount, status = "submitted") {
  const source = state.examSource;
  const record = {
    id: Date.now(),
    source,
    title: currentExamTitle(),
    startedAt: state.examStartedAt || new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    questionCount: state.filteredQuestions.length,
    answeredCount,
    wrongCount,
    score: state.score,
    status,
    questions: state.filteredQuestions,
    answers: [...state.examAnswers.entries()],
    results: [...state.examResults.entries()],
  };
  saveExamHistory(source, [record, ...loadExamHistory(source)]);
}

function deleteExamHistoryRecord(source, index) {
  const records = loadExamHistory(source);
  if (!records[index]) {
    return;
  }
  if (!confirm("确认删除这条考试记录吗？")) {
    return;
  }
  records.splice(index, 1);
  saveExamHistory(source, records);
  showExamHistoryList(source);
}

function formatExamHistoryTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "时间未知";
  }
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showExamHistoryHome() {
  if (!state.currentSubject) {
    return;
  }
  showView("examHistory");
  dom.examHistoryHome.classList.remove("hidden");
  dom.examHistoryListPage.classList.add("hidden");
  dom.appTitle.textContent = "考试历史记录";
  dom.loadStatus.textContent = state.currentSubject.name;
}

function returnFromExamHistory() {
  if (state.currentSubject) {
    showView("question");
    dom.appTitle.textContent = `${state.currentSubject.name}题库自测`;
    dom.loadStatus.textContent = `已加载 ${questionCountText(state.allQuestions.length, state.pastPracticeQuestions.length)}`;
    showQuestion(state.currentIndex);
  } else {
    renderMenu();
  }
}

function showExamHistoryList(source) {
  showView("examHistory");
  dom.examHistoryHome.classList.add("hidden");
  dom.examHistoryListPage.classList.remove("hidden");
  dom.examHistoryListTitle.textContent = examHistoryTitle(source);
  dom.examHistoryList.innerHTML = "";

  const records = loadExamHistory(source);
  for (let index = 0; index < 10; index += 1) {
    const record = records[index];
    const row = document.createElement("div");
    row.className = "exam-history-row";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "exam-history-item";
    if (record) {
      button.textContent = `${formatExamHistoryTime(record.startedAt)}｜${record.questionCount} 题｜错题 ${record.wrongCount}｜得分 ${Number(record.score || 0).toFixed(2)}`;
      button.addEventListener("click", () => openExamHistoryRecord(source, index));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "exam-history-delete";
      deleteButton.textContent = "删除";
      deleteButton.addEventListener("click", () => deleteExamHistoryRecord(source, index));
      row.appendChild(button);
      row.appendChild(deleteButton);
    } else {
      button.textContent = `第 ${index + 1} 条：暂无记录`;
      button.disabled = true;
      row.appendChild(button);
    }
    dom.examHistoryList.appendChild(row);
  }
}

function openExamHistoryRecord(source, index) {
  const record = loadExamHistory(source)[index];
  if (!record) {
    return;
  }
  stopTimer();
  state.mode = "exam";
  state.examSource = record.source || source;
  state.filteredQuestions = record.questions || [];
  state.currentIndex = 0;
  state.score = Number(record.score || 0);
  state.answered = Number(record.answeredCount ?? record.questionCount ?? state.filteredQuestions.length);
  state.sessionWrongCount = Number(record.wrongCount || 0);
  state.examAnswers = new Map(record.answers || []);
  state.examResults = new Map(record.results || []);
  state.examSubmitted = true;
  state.examAbandoned = record.status === "abandoned";
  state.examStartedAt = record.startedAt || null;
  state.viewingExamHistory = true;
  state.examHistorySource = source;
  state.wrongQuestions = loadWrongBook();
  state.pastWrongQuestions = loadPastWrongBook();
  updateStats();
  renderWrongBook();
  renderPastWrongBook();
  showView("question");
  dom.appTitle.textContent = `${state.currentSubject.name}题库自测`;
  dom.loadStatus.textContent = `${record.title || currentExamTitle()}历史记录：${formatExamHistoryTime(record.startedAt)}`;
  showQuestion(0);
}

function returnToExamHistoryList() {
  const source = state.examHistorySource || state.examSource || "mock";
  stopTimer();
  state.mode = "practice";
  state.examSource = "mock";
  state.examAnswers = new Map();
  state.examResults = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  state.examStartedAt = null;
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  state.filteredQuestions = getFilteredQuestions();
  state.currentIndex = 0;
  updateStats();
  showExamHistoryList(source);
}

function handleExamExitClick() {
  if (state.viewingExamHistory) {
    returnToExamHistoryList();
    return;
  }
  exitExam();
}

function examDraftKey() {
  return state.currentSubject ? `examDraft:${state.currentSubject.id}` : "examDraft:unknown";
}

function getRemainingExamSeconds() {
  if (!state.examEndTime) {
    return null;
  }
  return Math.max(0, Math.ceil((state.examEndTime - Date.now()) / 1000));
}

function loadExamDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(examDraftKey()) || "null");
    return draft && Array.isArray(draft.questions) && draft.questions.length ? draft : null;
  } catch {
    return null;
  }
}

function saveExamDraft() {
  if (state.mode !== "exam" || state.examSubmitted || state.viewingExamHistory || !state.filteredQuestions.length) {
    return;
  }
  const draft = {
    source: state.examSource,
    questions: state.filteredQuestions,
    answers: [...state.examAnswers.entries()],
    currentIndex: state.currentIndex,
    startedAt: state.examStartedAt,
    remainingSeconds: getRemainingExamSeconds(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(examDraftKey(), JSON.stringify(draft));
  updateExamDraftControls();
}

function clearExamDraft() {
  localStorage.removeItem(examDraftKey());
  updateExamDraftControls();
}

function updateExamDraftControls() {
  const hasDraft = Boolean(loadExamDraft());
  dom.continueExamBtn.classList.toggle("hidden", !hasDraft);
  dom.startExamBtn.disabled = hasDraft;
  dom.startPastExamBtn.disabled = hasDraft;
}

function restoreExamDraft() {
  const draft = loadExamDraft();
  if (!draft) {
    updateExamDraftControls();
    return;
  }
  state.mode = "exam";
  state.examSource = draft.source === "past" ? "past" : "mock";
  state.filteredQuestions = draft.questions;
  state.pastExamQuestions = state.examSource === "past" ? draft.questions : [];
  state.currentIndex = Math.max(0, Math.min(Number(draft.currentIndex || 0), state.filteredQuestions.length - 1));
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.submittedCurrent = false;
  state.examAnswers = new Map(draft.answers || []);
  state.examResults = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  state.examStartedAt = draft.startedAt || new Date().toISOString();
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  state.wrongQuestions = loadWrongBook();
  state.pastWrongQuestions = loadPastWrongBook();
  updateStats();
  renderWrongBook();
  renderPastWrongBook();

  if (Number.isFinite(draft.remainingSeconds) && draft.remainingSeconds > 0) {
    startTimer(draft.remainingSeconds);
  } else {
    stopTimer();
  }
  showView("question");
  dom.loadStatus.textContent = state.examSource === "past" ? "真题考试（未完成）" : "模拟考试（未完成）";
  showQuestion(state.currentIndex);
}

function favoriteKey(source) {
  const subjectId = state.currentSubject ? state.currentSubject.id : "unknown";
  return `favoriteBook:${subjectId}:${source}`;
}

function favoriteTitle(source) {
  return source === "past" ? "真题收藏" : "模拟题收藏";
}

function currentFavoriteSource() {
  if (state.mode === "exam") {
    return state.examSource === "past" ? "past" : "mock";
  }
  if (state.mode === "practice") {
    return state.practiceSource === "past" ? "past" : "mock";
  }
  if (isPastWrongPracticeMode()) {
    return "past";
  }
  if (state.mode === "wrongPractice") {
    return "mock";
  }
  if (isFavoritePracticeMode()) {
    return state.favoriteSource === "past" ? "past" : "mock";
  }
  return "mock";
}

function loadFavorites(source) {
  try {
    const items = JSON.parse(localStorage.getItem(favoriteKey(source)) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveFavorites(source, items) {
  localStorage.setItem(favoriteKey(source), JSON.stringify(items));
}

function makeFavoriteRecord(question) {
  return {
    编号: field(question, "编号"),
    章节: field(question, "章节"),
    题型: field(question, "题型"),
    难度: field(question, "难度"),
    题干: field(question, "题干"),
    选项: field(question, "选项") || [],
    答案: field(question, "答案"),
    解析: field(question, "解析"),
    知识点来源: field(question, "知识点来源"),
    题目来源: field(question, "题目来源"),
    year: field(question, "year"),
    source_type: field(question, "source_type"),
    source: field(question, "source"),
    收藏时间: new Date().toLocaleString(),
  };
}

function isFavoriteQuestion(question, source = currentFavoriteSource()) {
  const id = field(question, "编号");
  return Boolean(id && loadFavorites(source).some((item) => item.编号 === id));
}

function updateFavoriteButton(question) {
  const canFavorite = Boolean(question) && (
    state.mode === "practice"
    || state.mode === "exam"
    || isWrongPracticeMode()
  );
  dom.favoriteBtn.classList.toggle("hidden", isFavoritePracticeMode());
  dom.favoriteBtn.disabled = !canFavorite;
  const favorited = canFavorite && isFavoriteQuestion(question);
  dom.favoriteBtn.classList.toggle("active", favorited);
  dom.favoriteBtn.textContent = favorited ? "已收藏" : "收藏";
}

function currentAnswerLocked(question) {
  if (!question) {
    return true;
  }
  if (state.mode === "exam") {
    return state.examSubmitted;
  }
  return Boolean(isPracticeAnswerMode() && getPracticeSubmission(question));
}

function syncCurrentInputs(focusTarget = "") {
  const hasQuestion = Boolean(state.filteredQuestions.length);
  dom.questionJumpInput.disabled = !hasQuestion;
  dom.questionJumpInput.readOnly = false;
  dom.questionJumpInput.style.pointerEvents = "auto";

  const question = currentQuestion();
  const locked = currentAnswerLocked(question);
  document.querySelectorAll("input[name='choice']").forEach((input) => {
    input.disabled = locked;
    input.style.pointerEvents = "auto";
  });

  const answerInput = document.getElementById("answerInput");
  if (answerInput) {
    answerInput.disabled = locked;
    answerInput.readOnly = false;
    answerInput.style.pointerEvents = "auto";
  }

  const target = focusTarget || state.lastFocusedInput;
  if (target === "answerInput" && answerInput && !answerInput.disabled) {
    answerInput.focus({ preventScroll: true });
  } else if (target === "questionJumpInput" && !dom.questionJumpInput.disabled) {
    dom.questionJumpInput.focus({ preventScroll: true });
  }
}

function showToast(message) {
  if (!dom.toastMessage) {
    return;
  }
  window.clearTimeout(state.toastTimer);
  dom.toastMessage.textContent = message;
  dom.toastMessage.classList.add("show");
  state.toastTimer = window.setTimeout(() => {
    dom.toastMessage.classList.remove("show");
  }, 2000);
}

function setPracticeStatus(message, focusTarget = "") {
  showToast(message);
  syncCurrentInputs(focusTarget);
}

function addCurrentFavorite() {
  const question = currentQuestion();
  if (!question) {
    return;
  }
  const source = currentFavoriteSource();
  const id = field(question, "编号");
  const items = loadFavorites(source);
  const record = makeFavoriteRecord(question);
  const existingIndex = items.findIndex((item) => item.编号 === id);
  if (existingIndex >= 0) {
    items.splice(existingIndex, 1);
    saveFavorites(source, items);
    updateFavoriteButton(question);
    dom.favoriteBtn.blur();
    setPracticeStatus("已取消收藏");
    return;
  }
  items.unshift(record);
  saveFavorites(source, items);
  updateFavoriteButton(question);
  dom.favoriteBtn.blur();
  setPracticeStatus(`已收藏到${source === "past" ? "真题" : "模拟题"}收藏区`);
}

function showFavoriteHome() {
  if (!state.currentSubject) {
    return;
  }
  if (state.mode === "practice" && !dom.questionView.classList.contains("hidden")) {
    saveCurrentPracticeAnswer();
    const question = currentQuestion();
    state.favoriteReturnState = {
      index: state.currentIndex,
      questionId: question ? field(question, "编号") : "",
    };
  }
  showView("favorite");
  dom.favoriteHome.classList.remove("hidden");
  dom.favoriteListPage.classList.add("hidden");
  dom.appTitle.textContent = "收藏区";
  dom.loadStatus.textContent = state.currentSubject.name;
}

function returnFromFavorite() {
  if (state.currentSubject) {
    const returnState = state.favoriteReturnState;
    state.mode = "practice";
    state.filteredQuestions = getFilteredQuestions();
    const returnIndex = returnState?.questionId ? findQuestionIndex(returnState.questionId) : -1;
    state.currentIndex = returnIndex >= 0 ? returnIndex : Math.min(returnState?.index || 0, Math.max(0, state.filteredQuestions.length - 1));
    state.favoritePracticeAnswers = new Map();
    state.favoritePracticeSubmissions = new Map();
    state.favoriteReturnState = null;
    updateStats();
    showView("question");
    dom.appTitle.textContent = `${state.currentSubject.name}题库自测`;
    dom.loadStatus.textContent = `已加载 ${questionCountText(state.allQuestions.length, state.pastPracticeQuestions.length)}`;
    showQuestion(state.currentIndex);
  } else {
    renderMenu();
  }
}

function showFavoriteList(source) {
  showView("favorite");
  dom.favoriteHome.classList.add("hidden");
  dom.favoriteListPage.classList.remove("hidden");
  dom.favoriteListTitle.textContent = favoriteTitle(source);
  dom.favoriteList.innerHTML = "";

  const items = loadFavorites(source);
  let activeType = state.favoriteTypeFilters[source] || "";
  if (activeType && !itemTypes(items).includes(activeType)) {
    activeType = "";
    state.favoriteTypeFilters[source] = "";
  }
  renderTypeFilters(items, dom.favoriteTypeFilters, activeType, (type) => {
    state.favoriteTypeFilters[source] = type;
    showFavoriteList(source);
  });
  if (!items.length) {
    dom.favoriteList.textContent = "暂无收藏题目";
    return;
  }

  const filteredItems = filterItemsByType(items, activeType);
  if (!filteredItems.length) {
    dom.favoriteList.textContent = "暂无该题型收藏题目";
    return;
  }

  filteredItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-list-item";
    button.textContent = `${item.编号}｜${item.题型}｜${item.章节}`;
    button.addEventListener("click", () => openFavoriteQuestion(source, index));
    dom.favoriteList.appendChild(button);
  });
}

function openFavoriteQuestion(source, index) {
  const items = filterItemsByType(loadFavorites(source), state.favoriteTypeFilters[source] || "");
  if (!items.length) {
    showFavoriteList(source);
    return;
  }
  state.mode = "favoritePractice";
  state.favoriteSource = source;
  state.filteredQuestions = items;
  state.currentIndex = Math.max(0, Math.min(index, items.length - 1));
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.favoritePracticeAnswers = new Map();
  state.favoritePracticeSubmissions = new Map();
  state.examSubmitted = false;
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  stopTimer();
  updateStats();
  showView("question");
  dom.appTitle.textContent = `${state.currentSubject.name}题库自测`;
  dom.loadStatus.textContent = favoriteTitle(source);
  showQuestion(state.currentIndex);
}

function returnToFavoriteList() {
  saveCurrentPracticeAnswer();
  const source = state.favoriteSource || "mock";
  state.mode = "practice";
  state.favoritePracticeAnswers = new Map();
  state.favoritePracticeSubmissions = new Map();
  state.filteredQuestions = getFilteredQuestions();
  state.currentIndex = 0;
  updateStats();
  showFavoriteList(source);
}

function returnFromWrongPractice() {
  saveCurrentPracticeAnswer();
  const returnState = state.wrongPracticeReturnState;
  state.mode = "practice";
  state.filteredQuestions = getFilteredQuestions();
  const returnIndex = returnState?.questionId ? findQuestionIndex(returnState.questionId) : -1;
  state.currentIndex = returnIndex >= 0 ? returnIndex : Math.min(returnState?.index || 0, Math.max(0, state.filteredQuestions.length - 1));
  state.wrongPracticeAnswers = new Map();
  state.wrongPracticeSubmissions = new Map();
  state.pastWrongPracticeAnswers = new Map();
  state.pastWrongPracticeSubmissions = new Map();
  state.wrongPracticeReturnState = null;
  updateStats();
  showView("question");
  updatePracticeLoadStatus();
  showQuestion(state.currentIndex);
}

function returnFromFocusedPractice() {
  if (isWrongPracticeMode()) {
    returnFromWrongPractice();
    return;
  }
  returnToFavoriteList();
}

function removeCurrentFavoriteQuestion() {
  const question = currentQuestion();
  if (!question || !isFavoritePracticeMode()) {
    return;
  }
  const source = state.favoriteSource || "mock";
  const id = field(question, "编号");
  const items = loadFavorites(source).filter((item) => item.编号 !== id);
  const nextIndex = Math.min(state.currentIndex, Math.max(0, state.filteredQuestions.length - 2));
  saveFavorites(source, items);
  state.filteredQuestions = state.filteredQuestions.filter((item) => field(item, "编号") !== id);
  state.favoritePracticeAnswers.delete(id);
  state.favoritePracticeSubmissions.delete(id);
  updateStats();
  if (!state.filteredQuestions.length) {
    returnToFavoriteList();
    return;
  }
  showQuestion(nextIndex);
}

function resetSession() {
  state.allQuestions = [];
  state.pastPracticeQuestions = [];
  state.filteredQuestions = [];
  state.currentIndex = 0;
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.submittedCurrent = false;
  state.mode = "practice";
  state.practiceSource = "mock";
  state.favoriteSource = "mock";
  state.practiceAnswers = new Map();
  state.practiceSubmissions = new Map();
  state.wrongPracticeAnswers = new Map();
  state.wrongPracticeSubmissions = new Map();
  state.pastWrongPracticeAnswers = new Map();
  state.pastWrongPracticeSubmissions = new Map();
  state.favoritePracticeAnswers = new Map();
  state.favoritePracticeSubmissions = new Map();
  state.examAnswers = new Map();
  state.examResults = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  state.examStartedAt = null;
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  stopTimer();
  updateStats();
}

function savePracticeState() {
  if (!state.currentSubject || state.mode !== "practice") {
    return;
  }
  state.practiceStates.set(state.currentSubject.id, {
    score: state.score,
    answered: state.answered,
    sessionWrongCount: state.sessionWrongCount,
    practiceAnswers: new Map(state.practiceAnswers),
    practiceSubmissions: new Map(state.practiceSubmissions),
  });
}

function restorePracticeState(subject) {
  const saved = state.practiceStates.get(subject.id);
  if (!saved) {
    return;
  }
  state.score = saved.score;
  state.answered = saved.answered;
  state.sessionWrongCount = saved.sessionWrongCount;
  state.practiceAnswers = new Map(saved.practiceAnswers);
  state.practiceSubmissions = new Map(saved.practiceSubmissions);
  updateStats();
}

async function loadBank(subject) {
  showView("question");
  resetSession();
  state.currentSubject = subject;
  restorePracticeState(subject);
  state.wrongQuestions = loadWrongBook();
  state.pastWrongQuestions = loadPastWrongBook();
  updateExamPanelPlan();
  dom.appTitle.textContent = `${subject.name}题库自测`;
  dom.currentSubjectText.textContent = subject.name;
  dom.loadStatus.textContent = "正在加载题库...";

  const bank = await readSubjectBank(subject);
  state.allQuestions = flattenBank(bank);
  if (!state.allQuestions.length) {
    throw new Error("题库为空。");
  }
  state.pastPracticeQuestions = await loadPastExamQuestions(subject).catch(() => []);
  state.filteredQuestions = [...state.allQuestions];

  refreshPracticeFilters();

  dom.loadStatus.textContent = `已加载 ${questionCountText(state.allQuestions.length, state.pastPracticeQuestions.length)}`;
  renderWrongBook();
  renderPastWrongBook();
  await restoreSubjectSession(true);
  updateExamDraftControls();
}

function applyFilters() {
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  state.mode = "practice";
  state.examAnswers = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  stopTimer();
  state.filteredQuestions = getFilteredQuestions();
  updatePracticeLoadStatus();
  showQuestion(0);
}

function getFilteredQuestions() {
  const chapter = dom.chapterFilter.value;
  const type = dom.typeFilter.value;
  const questionSource = state.practiceSource === "past" ? dom.questionSourceFilter.value : "";
  const difficulty = state.practiceSource === "past" ? "" : dom.difficultyFilter.value;

  return practiceQuestions().filter((question) => {
    return (!chapter || field(question, "章节") === chapter)
      && (!type || field(question, "题型") === type)
      && (!questionSource || field(question, "题目来源") === questionSource)
      && (!difficulty || field(question, "难度") === difficulty);
  });
}

function practiceSourceLabel() {
  return state.practiceSource === "past" ? "真题" : "模拟题";
}

function updatePracticeLoadStatus() {
  const count = practiceQuestions().length;
  if (state.practiceSource === "past" && !count) {
    dom.loadStatus.textContent = "尚未添加往年真题";
    return;
  }
  dom.loadStatus.textContent = `已加载 ${count} 道${practiceSourceLabel()}`;
}

async function switchPracticeSource(source, session = null, keepCombinedStatus = false) {
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  state.mode = "practice";
  state.examAnswers = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  stopTimer();
  state.practiceSource = source;

  if (source === "past") {
    try {
      state.pastPracticeQuestions = await loadPastExamQuestions(state.currentSubject);
    } catch {
      state.pastPracticeQuestions = [];
    }
  }

  refreshPracticeFilters();
  if (session) {
    setSelectValueIfExists(dom.chapterFilter, session.chapter);
    setSelectValueIfExists(dom.typeFilter, session.type);
    setSelectValueIfExists(dom.questionSourceFilter, session.questionSource);
    setSelectValueIfExists(dom.difficultyFilter, session.difficulty);
  }
  state.filteredQuestions = getFilteredQuestions();
  if (keepCombinedStatus) {
    dom.loadStatus.textContent = `已加载 ${questionCountText(state.allQuestions.length, state.pastPracticeQuestions.length)}`;
  } else {
    updatePracticeLoadStatus();
  }
  const restoredIndex = findQuestionIndex(session?.questionId);
  const fallbackIndex = Number.isInteger(session?.index) ? session.index : 0;
  showQuestion(restoredIndex >= 0 ? restoredIndex : fallbackIndex);
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
    practiceSource: state.practiceSource,
    chapter: dom.chapterFilter.value,
    type: dom.typeFilter.value,
    questionSource: state.practiceSource === "past" ? dom.questionSourceFilter.value : "",
    difficulty: state.practiceSource === "past" ? "" : dom.difficultyFilter.value,
    questionId: question ? field(question, "编号") : "",
    index: state.currentIndex,
  };
  localStorage.setItem(key, JSON.stringify(session));
}

async function restoreSubjectSession(keepCombinedStatus = false) {
  let session = null;
  const key = subjectSessionKey();
  if (key) {
    try {
      session = JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      session = null;
    }
  }

  await switchPracticeSource(session?.practiceSource === "past" ? "past" : "mock", session, keepCombinedStatus);
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

function displayQuestionId(question) {
  if (state.mode === "exam" && question["考试编号"]) {
    return `第 ${question["考试编号"]} 题`;
  }
  return field(question, "编号");
}

function currentExamTitle() {
  return state.examSource === "past" ? "真题考试" : "模拟考试";
}

function isPastWrongPracticeMode() {
  return state.mode === "pastWrongPractice";
}

function isWrongPracticeMode() {
  return state.mode === "wrongPractice" || isPastWrongPracticeMode();
}

function isFavoritePracticeMode() {
  return state.mode === "favoritePractice";
}

function isPracticeAnswerMode() {
  return state.mode === "practice" || isWrongPracticeMode() || isFavoritePracticeMode();
}

function syncQuestionJumpInput(value) {
  if (document.activeElement !== dom.questionJumpInput) {
    dom.questionJumpInput.value = value;
  }
}

function showQuestion(index) {
  updateExamLayout();
  const total = state.filteredQuestions.length;
  const safeIndex = total ? Math.max(0, Math.min(index, total - 1)) : 0;
  state.currentIndex = safeIndex;
  state.submittedCurrent = false;
  dom.submitBtn.disabled = state.mode === "exam" && state.examSubmitted;
  dom.resultPanel.classList.add("hidden");

  dom.modeText.textContent = state.mode === "exam"
    ? `当前模式：${currentExamTitle()}`
    : state.mode === "wrongPractice"
    ? "当前模式：错题本重做"
    : isPastWrongPracticeMode()
    ? "当前模式：真题错题重做"
    : isFavoritePracticeMode()
    ? `当前模式：收藏题重做（${state.favoriteSource === "past" ? "真题" : "模拟题"}）`
    : `当前模式：练习模式（${practiceSourceLabel()}）`;
  dom.poolText.textContent = `当前题池：${total}`;
  dom.positionText.textContent = total ? `第 ${safeIndex + 1} / ${total} 题` : "第 0 / 0 题";
  dom.examPositionText.textContent = total ? `第 ${safeIndex + 1} / ${total} 题` : "第 0 / 0 题";
  dom.prevBtn.disabled = !total;
  dom.nextBtn.disabled = !total;
  dom.examPrevBtn.disabled = !total;
  dom.examNextBtn.disabled = !total;
  dom.resetPoolBtn.disabled = !total;
  dom.randomBtn.disabled = state.mode !== "practice" || !total;
  dom.jumpQuestionBtn.disabled = !total;
  dom.questionJumpInput.disabled = !total;
  if (dom.submitExamBtn) {
    dom.submitExamBtn.disabled = state.mode !== "exam" || !total || state.examSubmitted;
  }
  dom.examSubmitBtn.disabled = state.mode !== "exam" || !total || state.examSubmitted;
  dom.examAbandonBtn.disabled = state.mode !== "exam" || !total || state.examSubmitted;
  dom.examExitBtn.disabled = state.mode !== "exam";
  dom.examSubmitBtn.classList.toggle("hidden", state.viewingExamHistory);
  dom.examAbandonBtn.classList.toggle("hidden", state.viewingExamHistory || state.examSubmitted);
  dom.examExitBtn.textContent = state.viewingExamHistory ? "返回" : "退出考试";
  dom.submitBtn.textContent = state.mode === "exam" ? "保存答案" : "提交答案";
  dom.favoriteReturnBtn.classList.toggle("hidden", !(isFavoritePracticeMode() || isWrongPracticeMode()));
  dom.favoriteReturnBtn.textContent = "返回";
  dom.submitBtn.classList.toggle("hidden", state.mode === "exam" && state.examSubmitted);
  dom.showAnswerBtn.classList.toggle("hidden", state.mode === "exam" && state.examSubmitted);
  dom.prevBtn.classList.toggle("hidden", state.mode === "exam" && state.examSubmitted);
  dom.nextBtn.classList.toggle("hidden", state.mode === "exam" && state.examSubmitted);
  dom.showAnswerBtn.disabled = state.mode === "exam" && !state.examSubmitted;
  dom.addWrongBtn.disabled = state.mode === "exam" && !state.examSubmitted;
  dom.addWrongBtn.textContent = isFavoritePracticeMode()
    ? "取消收藏"
    : isWrongPracticeMode()
    ? "移出错题本"
    : "加入错题本";

  if (!total) {
    setMetaBadge(dom.qidText, "-");
    setMetaBadge(dom.chapterText, "-");
    setMetaBadge(dom.typeText, "-");
    setMetaBadge(dom.difficultyText, "");
    setMetaBadge(dom.questionSourceText, "");
    syncQuestionJumpInput("");
    dom.questionStem.textContent = "没有符合条件的题目";
    dom.optionsBox.innerHTML = "";
    dom.answerBox.innerHTML = "";
    dom.favoriteBtn.disabled = true;
    dom.favoriteBtn.classList.remove("active");
    dom.favoriteBtn.classList.remove("hidden");
    dom.favoriteBtn.textContent = "收藏";
    renderExamQuestionNav();
    return;
  }

  const question = state.filteredQuestions[safeIndex];
  const examTitle = dom.examToolbar.querySelector("strong");
  if (examTitle) {
    examTitle.textContent = currentExamTitle();
  }
  setMetaBadge(dom.qidText, displayQuestionId(question));
  syncQuestionJumpInput(state.mode === "exam" ? String(question["考试编号"] || safeIndex + 1) : field(question, "编号"));
  setMetaBadge(dom.chapterText, field(question, "章节"));
  setMetaBadge(dom.typeText, field(question, "题型"));
  setMetaBadge(dom.difficultyText, field(question, "难度"));
  setMetaBadge(dom.questionSourceText, field(question, "题目来源"), "来源：");
  renderQuestionStem(field(question, "题干"));
  updateFavoriteButton(question);
  renderAnswerInput(question);
  syncCurrentInputs();
  renderExamQuestionNav();
  const submission = isPracticeAnswerMode() ? getPracticeSubmission(question) : null;
  if (submission) {
    state.submittedCurrent = true;
    dom.submitBtn.disabled = true;
    showResult(question, submission.result);
  }
  if (state.mode === "exam" && state.examSubmitted) {
    const examRecord = getExamResult(question);
    if (examRecord) {
      showExamQuestionResult(question, examRecord);
    }
  }
  saveExamDraft();
  saveSubjectSession();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveImageSource(src) {
  const clean = String(src).trim().replace(/\\/g, "/").split("#", 1)[0].split("?", 1)[0];
  if (state.currentSubject && state.currentSubject.id === "sensor_signal" && clean.startsWith("media/")) {
    const relativePath = clean
      .replace(/^media\//, "")
      .split("/")
      .filter((part) => part && part !== "." && part !== "..")
      .join("/")
      .replace(/\.wmf$/i, ".png");
    return `data/media/sensor_signal/${relativePath}`;
  }
  return clean.replace(/\.wmf$/i, ".png");
}

function decodeLatexEntities(value) {
  return String(value)
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function normalizeLatexInput(value) {
  return String(value)
    .replace(/\u0003c9/g, "\\omega")
    .replace(/\u0003b1/g, "\\alpha")
    .replace(/_{2,}/g, "\\underline{\\hspace{2em}}")
    .replace(/(?<!\\)varphipprox/g, "\\varphi\\approx")
    .replace(/(?<!\\)varphi/g, "\\varphi")
    .replace(/(?<![\\a])rctan/g, "\\arctan")
    .replace(/(?<!\\)arctg/g, "\\arctan")
    .replace(/(?<!\\)ctg/g, "\\cot")
    .replace(/(?<!\\)tg/g, "\\tan")
    .replace(/(?<![\\a])pprox/g, "\\approx")
    .replace(/\bApprox(?=[0-9.-])/g, "A\\approx")
    .replace(/(?<!\\)varepsilon/g, "\\varepsilon")
    .replace(/(?<!\\)lambda/g, "\\lambda");
}

function renderLatex(latex, displayMode) {
  const normalizedLatex = normalizeLatexInput(decodeLatexEntities(latex));
  if (window.katex && typeof window.katex.renderToString === "function") {
    try {
      return window.katex.renderToString(normalizedLatex, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      // Fall through to a readable text representation.
    }
  }
  const delimiter = displayMode ? "$$" : "$";
  return `<span class="math-fallback">${escapeHtml(`${delimiter}${normalizedLatex}${delimiter}`)}</span>`;
}

function renderInlineHtml(text) {
  const images = [];
  const imageToken = "\uE100IMG";
  let value = String(text).replace(/!\[[^\]]*\]\(([^)]+)\)|<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, (_match, mdSrc, htmlSrc) => {
    const index = images.length;
    images.push(mdSrc || htmlSrc || "");
    return `${imageToken}${index}\uE101`;
  });

  value = escapeHtml(value);
  value = value
    .replace(/&lt;(\/?)(sub|sup)&gt;/gi, "<$1$2>")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br>");

  value = value.replace(/\\\[([\s\S]+?)\\\]|\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g, (
    _match,
    bracketDisplay,
    dollarDisplay,
    parenInline,
    dollarInline,
  ) => {
    const displayLatex = bracketDisplay ?? dollarDisplay;
    const inlineLatex = parenInline ?? dollarInline;
    return renderLatex(displayLatex ?? inlineLatex, displayLatex !== undefined);
  });

  images.forEach((src, index) => {
    const resolved = escapeHtml(resolveImageSource(src));
    const original = escapeHtml(src);
    const imageHtml = `<img class="question-image" src="${resolved}" alt="${original}" data-preview-src="${resolved}" data-preview-title="${original}" tabindex="0" role="button" onerror="this.replaceWith(Object.assign(document.createElement('span'), {className: 'image-missing', textContent: '图片无法显示：${original}'}))">`;
    value = value.replace(`${imageToken}${index}\uE101`, imageHtml);
  });

  return value.replace(/\n/g, "<br>");
}

function openImagePreview(image) {
  if (!dom.imagePreviewModal || !dom.imagePreviewImg) {
    return;
  }
  const src = image.dataset.previewSrc || image.currentSrc || image.src;
  const title = image.dataset.previewTitle || image.alt || "";
  dom.imagePreviewImg.src = src;
  dom.imagePreviewImg.alt = title || "图片预览";
  if (dom.imagePreviewCaption) {
    dom.imagePreviewCaption.textContent = title;
  }
  dom.imagePreviewModal.classList.remove("hidden");
  document.body.classList.add("preview-open");
  if (dom.imagePreviewClose) {
    dom.imagePreviewClose.focus();
  }
}

function closeImagePreview() {
  if (!dom.imagePreviewModal || dom.imagePreviewModal.classList.contains("hidden")) {
    return;
  }
  dom.imagePreviewModal.classList.add("hidden");
  document.body.classList.remove("preview-open");
  if (dom.imagePreviewImg) {
    dom.imagePreviewImg.removeAttribute("src");
  }
}

function renderRichContent(container, text) {
  container.innerHTML = "";
  const parts = String(text).split(/```(?:\w+)?\n([\s\S]*?)```/g);

  parts.forEach((part, index) => {
    if (!part) {
      return;
    }
    if (index % 2 === 1) {
      const pre = document.createElement("pre");
      pre.textContent = part.trimEnd();
      container.appendChild(pre);
      return;
    }

    part.split(/\n{2,}/).forEach((paragraphText) => {
      const clean = paragraphText.trim();
      if (!clean) {
        return;
      }
      const paragraph = document.createElement("p");
      paragraph.innerHTML = renderInlineHtml(clean);
      container.appendChild(paragraph);
    });
  });
}

function renderRichInline(container, text) {
  container.classList.add("rich-inline");
  container.innerHTML = renderInlineHtml(text);
}

function renderQuestionStem(text) {
  renderRichContent(dom.questionStem, text);
}

function renderAnswerInput(question) {
  dom.optionsBox.innerHTML = "";
  dom.answerBox.innerHTML = "";
  const type = field(question, "题型");

  if (isOptionAnswerType(type)) {
    const isMultiple = isMultipleChoiceType(type);
    const practiceSubmission = isPracticeAnswerMode() ? getPracticeSubmission(question) : null;
    const practiceAnswer = isPracticeAnswerMode() ? getPracticeAnswer(question) : "";
    const options = isJudgeType(type) && !(field(question, "选项") || []).length
      ? ["√", "×"]
      : field(question, "选项") || [];
    options.forEach((optionText) => {
      const label = document.createElement("label");
      label.className = "option-item";
      const input = document.createElement("input");
      input.type = isMultiple ? "checkbox" : "radio";
      input.name = "choice";
      input.value = optionText.trim().slice(0, 1).toUpperCase();
      input.disabled = (state.mode === "exam" && state.examSubmitted) || Boolean(practiceSubmission);
      if (practiceSubmission && choiceAnswerIncludes(practiceSubmission.userAnswer, input.value)) {
        input.checked = true;
      }
      if (!practiceSubmission && choiceAnswerIncludes(practiceAnswer, input.value)) {
        input.checked = true;
      }
      if (isPracticeAnswerMode() && !practiceSubmission) {
        input.addEventListener("change", saveCurrentPracticeAnswer);
      }
      if (state.mode === "exam" && choiceAnswerIncludes(getExamAnswer(question), input.value)) {
        input.checked = true;
      }
      if (state.mode === "exam") {
        input.addEventListener("change", saveCurrentExamAnswer);
      }
      const span = document.createElement("span");
      renderRichInline(span, optionText);
      label.appendChild(input);
      label.appendChild(span);
      dom.optionsBox.appendChild(label);
    });
    return;
  }

  const hint = document.createElement("p");
  hint.textContent = state.mode === "exam"
    ? "考试模式中可随时修改答案，点击保存答案或切换题目会保留当前作答，交卷后统一显示答案。"
    : isFillType(type)
    ? "填写关键词即可，判断时会忽略大小写和多余空格。"
    : "输入你的作答。提交后会显示参考答案、解析和按文本重合度估算的自评分。";
  dom.answerBox.appendChild(hint);

  if (isFillType(type)) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answerInput";
    input.placeholder = "请输入答案";
    const practiceSubmission = isPracticeAnswerMode() ? getPracticeSubmission(question) : null;
    input.disabled = (state.mode === "exam" && state.examSubmitted) || Boolean(practiceSubmission);
    if (practiceSubmission) {
      input.value = practiceSubmission.userAnswer;
    } else if (isPracticeAnswerMode()) {
      input.value = getPracticeAnswer(question);
      input.addEventListener("input", saveCurrentPracticeAnswer);
    }
    if (state.mode === "exam") {
      input.value = getExamAnswer(question);
      input.addEventListener("input", () => saveCurrentExamAnswer(false));
    }
    dom.answerBox.appendChild(input);
  } else {
    const textarea = document.createElement("textarea");
    textarea.id = "answerInput";
    textarea.placeholder = "请输入你的答案、分析过程或程序";
    const practiceSubmission = isPracticeAnswerMode() ? getPracticeSubmission(question) : null;
    textarea.disabled = (state.mode === "exam" && state.examSubmitted) || Boolean(practiceSubmission);
    if (practiceSubmission) {
      textarea.value = practiceSubmission.userAnswer;
    } else if (isPracticeAnswerMode()) {
      textarea.value = getPracticeAnswer(question);
      textarea.addEventListener("input", saveCurrentPracticeAnswer);
    }
    if (state.mode === "exam") {
      textarea.value = getExamAnswer(question);
      textarea.addEventListener("input", () => saveCurrentExamAnswer(false));
    }
    dom.answerBox.appendChild(textarea);
  }
  ensureEditableExamAnswerInput();
}

function ensureEditableExamAnswerInput() {
  syncCurrentInputs();
}

function currentQuestion() {
  return state.filteredQuestions[state.currentIndex] || null;
}

function questionKey(question) {
  const id = field(question, "编号") || String(state.currentIndex);
  return state.mode === "practice" ? `${state.practiceSource}:${id}` : id;
}

function getPracticeSubmission(question) {
  const submissions = state.mode === "wrongPractice"
    ? state.wrongPracticeSubmissions
    : isPastWrongPracticeMode()
    ? state.pastWrongPracticeSubmissions
    : isFavoritePracticeMode()
    ? state.favoritePracticeSubmissions
    : state.practiceSubmissions;
  return submissions.get(questionKey(question)) || null;
}

function getPracticeAnswer(question) {
  const answers = state.mode === "wrongPractice"
    ? state.wrongPracticeAnswers
    : isPastWrongPracticeMode()
    ? state.pastWrongPracticeAnswers
    : isFavoritePracticeMode()
    ? state.favoritePracticeAnswers
    : state.practiceAnswers;
  return answers.get(questionKey(question)) || "";
}

function saveCurrentPracticeAnswer() {
  if (!isPracticeAnswerMode()) {
    return;
  }
  const question = currentQuestion();
  if (!question || getPracticeSubmission(question)) {
    return;
  }
  const answers = state.mode === "wrongPractice"
    ? state.wrongPracticeAnswers
    : isPastWrongPracticeMode()
    ? state.pastWrongPracticeAnswers
    : isFavoritePracticeMode()
    ? state.favoritePracticeAnswers
    : state.practiceAnswers;
  answers.set(questionKey(question), getUserAnswer(question).trim());
}

function getExamAnswer(question) {
  return state.examAnswers.get(questionKey(question)) || "";
}

function getExamResult(question) {
  return state.examResults.get(questionKey(question)) || null;
}

function saveCurrentExamAnswer(updateNav = true) {
  if (state.mode !== "exam" || state.examSubmitted) {
    return;
  }
  const question = currentQuestion();
  if (!question) {
    return;
  }
  state.examAnswers.set(questionKey(question), getUserAnswer(question).trim());
  if (updateNav) {
    renderExamQuestionNav();
  } else {
    updateCurrentExamNavButton();
  }
  saveExamDraft();
}

function updateCurrentExamNavButton() {
  if (state.mode !== "exam" || !dom.examQuestionNav) {
    return;
  }
  const question = currentQuestion();
  const number = question ? String(question["考试编号"] || state.currentIndex + 1) : "";
  const button = [...dom.examQuestionNav.querySelectorAll("button")]
    .find((item) => item.textContent === number);
  if (button && !state.examSubmitted) {
    button.classList.toggle("answered", Boolean(question && getExamAnswer(question)));
  }
}

function questionMaxScore(question) {
  const type = field(question, "题型");
  if (isMultipleChoiceType(type)) {
    return Math.max(1, parseChoiceLetters(field(question, "答案")).length);
  }
  return 1;
}

function getUserAnswer(question) {
  if (isOptionAnswerType(field(question, "题型"))) {
    const checked = [...document.querySelectorAll("input[name='choice']:checked")];
    return checked.map((input) => input.value).sort().join("");
  }
  const input = document.getElementById("answerInput");
  return input ? input.value : "";
}

function lockCurrentAnswerInput(question) {
  if (isOptionAnswerType(field(question, "题型"))) {
    document.querySelectorAll("input[name='choice']").forEach((input) => {
      input.disabled = true;
    });
    return;
  }
  const input = document.getElementById("answerInput");
  if (input) {
    input.disabled = true;
  }
}

function stripIgnoredNonChoiceChars(value) {
  const text = String(value).toLowerCase().replace(/\s+/g, "");
  try {
    return text.replace(/[\p{P}，。；：、“”‘’（）《》【】]/gu, "");
  } catch {
    return text.replace(/[，。；：、“”‘’（）《》【】[\]{}.,;:!?'""`~\-_/\\|]/g, "");
  }
}

function normalizeFill(value) {
  return stripIgnoredNonChoiceChars(value);
}

function normalizeNonChoiceAnswer(value) {
  return stripIgnoredNonChoiceChars(value);
}

function parseChoiceLetters(value) {
  return [...new Set(String(value).toUpperCase().match(/[A-Z]/g) || [])].sort();
}

function choiceAnswerIncludes(answer, value) {
  return parseChoiceLetters(answer).includes(String(value).toUpperCase());
}

function normalizeChineseAnswer(value) {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。；：、“”‘’（）《》【】\[\]{}.,;:!?'""`~\-_/\\|=+*#@%^&$]/g, "");
}

function normalizeJudgeAnswer(value) {
  const text = normalizeChineseAnswer(value);
  if (!text) {
    return "";
  }
  if (text.includes("√") || text.includes("对") || text.includes("正确") || text === "true" || text === "t") {
    return "√";
  }
  if (text.includes("×") || text.includes("错") || text.includes("错误") || text === "false" || text === "f") {
    return "×";
  }
  return String(value).trim().slice(0, 1);
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
  const normalized = normalizeNonChoiceAnswer(value);
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
  const userText = normalizeNonChoiceAnswer(userAnswer);
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
    if (isMultipleChoiceType(type)) {
      const expectedLetters = parseChoiceLetters(answer);
      const actualLetters = parseChoiceLetters(userAnswer);
      const wrongLetters = actualLetters.filter((letter) => !expectedLetters.includes(letter));
      const matchedCount = actualLetters.filter((letter) => expectedLetters.includes(letter)).length;
      const score = wrongLetters.length ? 0 : matchedCount;
      const correct = expectedLetters.length > 0
        && wrongLetters.length === 0
        && matchedCount === expectedLetters.length;
      return {
        score,
        correct,
        title: correct ? "回答正确" : "回答错误",
        text: `你的答案：${actualLetters.join("") || "未填写"}；正确答案：${expectedLetters.join("") || "未提供"}`,
        className: correct ? "ok" : "bad",
        tip: "多项选择题按选项字母判断：选对一个正确选项得 1 分；只要选择了错误选项，本题得 0 分。",
      };
    }

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

  if (isJudgeType(type)) {
    const expected = normalizeJudgeAnswer(answer);
    const actual = normalizeJudgeAnswer(userAnswer);
    return {
      score: actual && actual === expected ? 1 : 0,
      correct: actual && actual === expected,
      title: actual && actual === expected ? "回答正确" : "回答错误",
      text: `你的答案：${actual || "未填写"}；正确答案：${expected || answer}`,
      className: actual && actual === expected ? "ok" : "bad",
      tip: "判断题按“√/×”自动判断。",
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
  if (isCalculationType(type)) {
    return "自评提示：计算题重点核对公式选择、代入过程、单位换算和最终数值。";
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
    setPracticeStatus("请先输入或选择答案", isOptionAnswerType(field(question, "题型")) ? "" : "answerInput");
    return;
  }

  const result = evaluate(question, userAnswer);
  state.score += result.score;
  state.answered += 1;
  if (!result.correct) {
    state.sessionWrongCount += 1;
  }
  state.submittedCurrent = true;
  const answers = state.mode === "wrongPractice"
    ? state.wrongPracticeAnswers
    : isPastWrongPracticeMode()
    ? state.pastWrongPracticeAnswers
    : isFavoritePracticeMode()
    ? state.favoritePracticeAnswers
    : state.practiceAnswers;
  const submissions = state.mode === "wrongPractice"
    ? state.wrongPracticeSubmissions
    : isPastWrongPracticeMode()
    ? state.pastWrongPracticeSubmissions
    : isFavoritePracticeMode()
    ? state.favoritePracticeSubmissions
    : state.practiceSubmissions;
  answers.set(questionKey(question), userAnswer);
  submissions.set(questionKey(question), { userAnswer, result });
  dom.submitBtn.disabled = true;
  lockCurrentAnswerInput(question);
  updateStats();
  showResult(question, result);
  syncCurrentInputs();

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
  syncCurrentInputs();
}

function showResult(question, result) {
  dom.resultPanel.classList.remove("hidden");
  dom.resultTitle.textContent = result.title;
  dom.questionScore.textContent = `${result.score.toFixed(2)} 分`;
  dom.resultText.className = `result-text ${result.className}`;
  dom.resultText.textContent = result.text;
  renderRichContent(dom.referenceAnswer, field(question, "答案"));
  renderRichContent(dom.explanationText, field(question, "解析"));
  renderRichContent(dom.sourceText, [
    field(question, "知识点来源") ? `知识点来源：${field(question, "知识点来源")}` : "",
    field(question, "题目来源") ? `题目来源：${field(question, "题目来源")}` : "",
  ].filter(Boolean).join("\n") || "无");
  dom.selfReviewTip.textContent = result.tip;
}

function showExamQuestionResult(question, record) {
  showResult(question, record.result);
  dom.resultTitle.textContent = `第 ${question["考试编号"] || state.currentIndex + 1} 题｜${record.result.title}`;
  dom.resultText.textContent = record.result.unanswered
    ? record.result.text
    : `${record.result.text}；本题得分 ${record.result.score.toFixed(2)} / ${questionMaxScore(question).toFixed(2)} 分。`;
}

function updateStats() {
  dom.scoreText.textContent = state.score.toFixed(1);
  dom.answeredText.textContent = String(state.answered);
  const accuracy = state.answered ? (state.score / state.answered) * 100 : 0;
  dom.accuracyText.textContent = `${accuracy.toFixed(0)}%`;
  dom.wrongCountText.textContent = String(state.sessionWrongCount);
  dom.wrongBookCountText.textContent = String(state.wrongQuestions.length);
  dom.pastWrongBookCountText.textContent = String(state.pastWrongQuestions.length);
}

function showPrevious() {
  if (!state.filteredQuestions.length) {
    return;
  }
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  const previousIndex = (state.currentIndex - 1 + state.filteredQuestions.length) % state.filteredQuestions.length;
  showQuestion(previousIndex);
}

function showNext() {
  if (!state.filteredQuestions.length) {
    return;
  }
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  const nextIndex = (state.currentIndex + 1) % state.filteredQuestions.length;
  showQuestion(nextIndex);
}

function showRandom() {
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  if (state.mode === "practice") {
    state.filteredQuestions = getFilteredQuestions();
  }
  if (!state.filteredQuestions.length) {
    showQuestion(0);
    return;
  }
  const randomIndex = Math.floor(Math.random() * state.filteredQuestions.length);
  updatePracticeLoadStatus();
  showQuestion(randomIndex);
}

function resetCurrentPool() {
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  if (state.mode === "practice") {
    state.practiceAnswers = new Map();
    state.practiceSubmissions = new Map();
    if (state.currentSubject) {
      state.practiceStates.delete(state.currentSubject.id);
    }
    state.score = 0;
    state.answered = 0;
    state.sessionWrongCount = 0;
    updateStats();
  }
  if (isPastWrongPracticeMode()) {
    state.pastWrongPracticeAnswers = new Map();
    state.pastWrongPracticeSubmissions = new Map();
    state.score = 0;
    state.answered = 0;
    state.sessionWrongCount = 0;
    updateStats();
  }
  if (state.mode === "wrongPractice") {
    state.wrongPracticeAnswers = new Map();
    state.wrongPracticeSubmissions = new Map();
    state.score = 0;
    state.answered = 0;
    state.sessionWrongCount = 0;
    updateStats();
  }
  if (state.mode === "practice") {
    state.filteredQuestions = getFilteredQuestions();
  }
  showQuestion(0);
}

function refocusQuestionJumpInput(selectText = false) {
  syncCurrentInputs("questionJumpInput");
  if (selectText && !dom.questionJumpInput.disabled) {
    dom.questionJumpInput.select();
  }
}

function jumpToQuestion() {
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  const input = dom.questionJumpInput.value.trim();
  if (!input) {
    dom.loadStatus.textContent = "请输入题号或序号。";
    refocusQuestionJumpInput(false);
    return;
  }

  const index = findQuestionIndexByInput(input);
  if (index < 0) {
    dom.loadStatus.textContent = "当前题池中没有找到该题，请重新输入。";
    refocusQuestionJumpInput(true);
    return;
  }
  dom.questionJumpInput.blur();
  updatePracticeLoadStatus();
  showQuestion(index);
}

function findQuestionIndexByInput(input) {
  const normalized = normalizeQuestionId(input);
  if (state.mode === "exam") {
    const examNumber = Number.parseInt(input.replace(/^第\s*/i, "").replace(/\s*题$/i, ""), 10);
    if (Number.isInteger(examNumber) && examNumber > 0) {
      const examIndex = state.filteredQuestions.findIndex((question, index) => (question["考试编号"] || index + 1) === examNumber);
      if (examIndex >= 0) {
        return examIndex;
      }
    }
  }

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

function renderExamQuestionNav() {
  if (state.mode !== "exam") {
    dom.examQuestionNav.innerHTML = "";
    return;
  }

  dom.examQuestionNav.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = "题号导航";
  dom.examQuestionNav.appendChild(title);

  const groups = new Map();
  state.filteredQuestions.forEach((question, index) => {
    const type = field(question, "题型") || "其他题型";
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    groups.get(type).push({ question, index });
  });

  groups.forEach((items, type) => {
    const group = document.createElement("section");
    group.className = "exam-nav-group";

    const heading = document.createElement("h4");
    heading.textContent = type;
    group.appendChild(heading);

    const buttons = document.createElement("div");
    buttons.className = "exam-nav-buttons";

    items.forEach(({ question, index }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(question["考试编号"] || index + 1);
      button.classList.toggle("current", index === state.currentIndex);
      button.classList.toggle("answered", !state.examSubmitted && Boolean(getExamAnswer(question)));
      if (state.examSubmitted) {
        const record = getExamResult(question);
        if (record) {
          const maxScore = questionMaxScore(question);
          button.classList.toggle("score-unanswered", Boolean(record.result.unanswered));
          button.classList.toggle("score-full", !record.result.unanswered && record.result.score >= maxScore);
          button.classList.toggle("score-zero", !record.result.unanswered && record.result.score <= 0);
          button.classList.toggle("score-partial", !record.result.unanswered && record.result.score > 0 && record.result.score < maxScore);
        }
      }
      button.addEventListener("click", () => {
        saveCurrentExamAnswer();
        showQuestion(index);
      });
      buttons.appendChild(button);
    });

    group.appendChild(buttons);
    dom.examQuestionNav.appendChild(group);
  });
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

function allocateCountsByType(typeCounts, totalCount) {
  const entries = [...typeCounts.entries()].filter(([, count]) => count > 0);
  if (!entries.length || totalCount <= 0) {
    return new Map();
  }

  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const allocations = entries.map(([type, count]) => {
    const raw = (count / total) * totalCount;
    const base = totalCount >= entries.length ? Math.max(1, Math.floor(raw)) : 0;
    return { type, count, value: base, remainder: raw - Math.floor(raw) };
  });

  let assigned = allocations.reduce((sum, item) => sum + item.value, 0);
  while (assigned > totalCount) {
    const item = allocations
      .filter((entry) => entry.value > 0)
      .sort((a, b) => a.remainder - b.remainder || b.value - a.value)[0];
    if (!item) {
      break;
    }
    item.value -= 1;
    assigned -= 1;
  }
  while (assigned < totalCount) {
    const item = allocations
      .sort((a, b) => b.remainder - a.remainder || b.count - a.count)[0];
    item.value += 1;
    assigned += 1;
  }

  return new Map(allocations.filter((item) => item.value > 0).map((item) => [item.type, item.value]));
}

function pastExamTypeQuotas(sourceQuestions) {
  const quotas = new Map();
  currentExamPlan().forEach((plan) => {
    const typeCounts = new Map();
    sourceQuestions.forEach((question) => {
      const type = field(question, "题型");
      if (!plan.match(type)) {
        return;
      }
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    });
    allocateCountsByType(typeCounts, plan.count).forEach((count, type) => {
      quotas.set(type, count);
    });
  });
  return quotas;
}

function examPlanCoverageKey(plan) {
  return plan.match("单项选择题") && plan.match("多项选择题") ? "选择题" : plan.label;
}

function pastExamCoverageKey() {
  return state.currentSubject ? `pastExamCoverage:${state.currentSubject.id}` : "pastExamCoverage:unknown";
}

function loadPastExamCoverage(sourceQuestions) {
  let coverage = null;
  try {
    coverage = JSON.parse(localStorage.getItem(pastExamCoverageKey()) || "null");
  } catch {
    coverage = null;
  }
  const byType = {};
  const validIdsByType = new Map();
  sourceQuestions.forEach((question) => {
    const type = field(question, "题型");
    if (!validIdsByType.has(type)) {
      validIdsByType.set(type, new Set());
    }
    validIdsByType.get(type).add(field(question, "编号"));
  });
  currentExamPlan().forEach((plan) => {
    const key = examPlanCoverageKey(plan);
    if (!validIdsByType.has(key)) {
      validIdsByType.set(key, new Set());
    }
    sourceQuestions
      .filter((question) => plan.match(field(question, "题型")))
      .forEach((question) => validIdsByType.get(key).add(field(question, "编号")));
  });

  Object.entries(coverage?.byType || {}).forEach(([type, ids]) => {
    const validIds = validIdsByType.get(type) || new Set();
    byType[type] = Array.isArray(ids) ? ids.filter((id) => validIds.has(id)) : [];
  });
  return { byType };
}

function savePastExamCoverage(coverage) {
  localStorage.setItem(pastExamCoverageKey(), JSON.stringify(coverage));
}

function pickCoverageBalanced(pool, count, usedIds, seenIds) {
  const picked = [];
  const firstPool = pool.filter((question) => !seenIds.has(field(question, "编号")));
  const firstPick = pickBalanced(firstPool, Math.min(count, firstPool.length), usedIds);
  picked.push(...firstPick);
  firstPick.forEach((question) => seenIds.add(field(question, "编号")));

  if (picked.length >= count) {
    return picked;
  }

  seenIds.clear();
  const secondPool = pool.filter((question) => !usedIds.has(field(question, "编号")));
  const secondPick = pickBalanced(secondPool, count - picked.length, usedIds);
  picked.push(...secondPick);
  secondPick.forEach((question) => seenIds.add(field(question, "编号")));
  return picked;
}

function examTypeOrder(question) {
  const type = field(question, "题型");
  if (isChoiceType(type)) {
    return isMultipleChoiceType(type) ? 1 : 0;
  }
  if (isJudgeType(type)) {
    return 2;
  }
  if (isFillType(type)) {
    return 3;
  }
  if (isProgramReadingType(type)) {
    return 4;
  }
  if (isShortAnswerType(type)) {
    return 5;
  }
  if (isSystemExpandType(type)) {
    return 6;
  }
  if (isProgramDesignType(type)) {
    return 7;
  }
  if (isCalculationType(type)) {
    return 8;
  }
  return 99;
}

function orderExamPaper(paper) {
  return paper
    .map((question, index) => ({ question, index }))
    .sort((a, b) => {
      const orderDiff = examTypeOrder(a.question) - examTypeOrder(b.question);
      return orderDiff || a.index - b.index;
    })
    .map((item) => item.question);
}

function buildExamPaper(sourceQuestions = state.allQuestions) {
  const usedIds = new Set();
  const paper = [];
  const warnings = [];

  currentExamPlan().forEach((item) => {
    const pool = sourceQuestions.filter((question) => item.match(field(question, "题型")));
    const picked = pickBalanced(pool, item.count, usedIds);
    paper.push(...picked);
    if (picked.length < item.count) {
      warnings.push(`${item.label} 题量不足，只抽到 ${picked.length} 道`);
    }
  });

  if (warnings.length) {
    alert(warnings.join("\n"));
  }
  return orderExamPaper(paper).map((question, index) => ({
    ...question,
    考试编号: index + 1,
  }));
}

function buildPastExamPaper(sourceQuestions) {
  const usedIds = new Set();
  const paper = [];
  const warnings = [];
  const coverage = loadPastExamCoverage(sourceQuestions);

  currentExamPlan().forEach((plan) => {
    const key = examPlanCoverageKey(plan);
    const pool = sourceQuestions.filter((question) => plan.match(field(question, "题型")));
    const seenIds = new Set(coverage.byType[key] || []);
    const picked = pickCoverageBalanced(pool, plan.count, usedIds, seenIds);
    paper.push(...picked);
    coverage.byType[key] = [...seenIds];
    if (picked.length < plan.count) {
      warnings.push(`${key} 题量不足，只抽到 ${picked.length} 道`);
    }
  });

  if (warnings.length) {
    alert(warnings.join("\n"));
  }
  savePastExamCoverage(coverage);
  return orderExamPaper(paper).map((question, index) => ({
    ...question,
    考试编号: index + 1,
  }));
}

function recentPastExamKey() {
  return state.currentSubject ? `pastExamRecentIds:${state.currentSubject.id}` : "pastExamRecentIds:unknown";
}

function loadRecentPastExamIds() {
  try {
    return JSON.parse(localStorage.getItem(recentPastExamKey()) || "[]");
  } catch {
    return [];
  }
}

function saveRecentPastExamIds(questions) {
  const ids = questions.map((question) => field(question, "编号")).filter(Boolean);
  localStorage.setItem(recentPastExamKey(), JSON.stringify(ids));
}

async function startExam(source = "mock") {
  if (loadExamDraft()) {
    alert("存在未完成考试，请先继续并完成当前考试。");
    updateExamDraftControls();
    return;
  }
  saveCurrentExamAnswer();
  let sourceQuestions = state.allQuestions;
  if (source === "past") {
    try {
      sourceQuestions = await loadPastExamQuestions(state.currentSubject);
    } catch (error) {
      dom.loadStatus.textContent = "尚未添加往年真题";
      dom.questionStem.textContent = "该科目的往年真题文件尚未建立，后续可添加。";
      dom.optionsBox.innerHTML = "";
      dom.answerBox.innerHTML = "";
      dom.resultPanel.classList.add("hidden");
      return;
    }
    if (!sourceQuestions.length) {
      dom.loadStatus.textContent = "尚未添加往年真题";
      dom.questionStem.textContent = "该科目的往年真题文件尚未建立，后续可添加。";
      dom.optionsBox.innerHTML = "";
      dom.answerBox.innerHTML = "";
      dom.resultPanel.classList.add("hidden");
      return;
    }
  }

  let paper = [];
  if (source === "past") {
    paper = buildPastExamPaper(sourceQuestions);
  } else {
    paper = buildExamPaper(sourceQuestions);
  }
  if (!paper.length) {
    alert("没有可用于考试模式的题目。");
    return;
  }
  state.mode = "exam";
  state.examSource = source;
  state.pastExamQuestions = source === "past" ? sourceQuestions : [];
  state.wrongQuestions = loadWrongBook();
  state.pastWrongQuestions = loadPastWrongBook();
  state.filteredQuestions = paper;
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.submittedCurrent = false;
  state.examAnswers = new Map();
  state.examResults = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  state.examStartedAt = new Date().toISOString();
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  updateStats();

  if (dom.timerToggle.checked) {
    startTimer(2 * 60 * 60);
  } else {
    stopTimer();
  }
  dom.loadStatus.textContent = source === "past" ? "真题考试" : "模拟考试";
  showQuestion(0);
  saveExamDraft();
}

function startMockExam() {
  startExam("mock");
}

function startPastExam() {
  startExam("past");
}

function exitExam() {
  saveCurrentExamAnswer();
  saveExamDraft();
  state.mode = "practice";
  state.examSource = "mock";
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.examAnswers = new Map();
  state.examResults = new Map();
  state.pastExamQuestions = [];
  state.examSubmitted = false;
  state.examAbandoned = false;
  state.examStartedAt = null;
  state.viewingExamHistory = false;
  state.examHistorySource = "";
  stopTimer();
  dom.loadStatus.textContent = `已加载 ${questionCountText(state.allQuestions.length, state.pastPracticeQuestions.length)}`;
  state.filteredQuestions = getFilteredQuestions();
  state.wrongQuestions = loadWrongBook();
  state.pastWrongQuestions = loadPastWrongBook();
  renderWrongBook();
  renderPastWrongBook();
  updateExamDraftControls();
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
  state.examResults = new Map();

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
    state.examResults.set(questionKey(question), { userAnswer, result });
    totalScore += result.score;
    if (userAnswer) {
      answeredCount += 1;
    }
    if (!result.correct) {
      wrongCount += 1;
    }
  });

  state.score = Number(totalScore.toFixed(2));
  state.answered = state.filteredQuestions.length;
  state.sessionWrongCount = wrongCount;
  state.examSubmitted = true;
  state.examAbandoned = false;
  saveExamHistoryRecord(answeredCount, wrongCount, "submitted");
  clearExamDraft();
  stopTimer();
  updateStats();
  renderWrongBook();
  renderPastWrongBook();
  dom.loadStatus.textContent = `已提交 ${state.filteredQuestions.length} 道题，作答 ${answeredCount} 道，错题/需复核 ${wrongCount} 道。`;
  showQuestion(state.currentIndex);
}

function abandonExamPaper() {
  if (state.mode !== "exam" || state.examSubmitted) {
    return;
  }
  saveCurrentExamAnswer();
  if (!state.filteredQuestions.length) {
    return;
  }
  if (!confirm("确认放弃本次考试吗？已作答题目会判分，未作答题目只显示答案解析且不计分。")) {
    return;
  }

  let totalScore = 0;
  let answeredCount = 0;
  let wrongCount = 0;
  state.examResults = new Map();

  state.filteredQuestions.forEach((question) => {
    const userAnswer = getExamAnswer(question);
    if (!userAnswer) {
      state.examResults.set(questionKey(question), {
        userAnswer: "",
        result: {
          score: 0,
          correct: true,
          unanswered: true,
          title: "未作答",
          text: "本题未作答，已显示参考答案和解析，不计入本次判分。",
          className: "warn",
          tip: "放弃考试后，未作答题目仅供查看参考答案和解析，不计分。",
        },
      });
      return;
    }

    const result = evaluate(question, userAnswer);
    state.examResults.set(questionKey(question), { userAnswer, result });
    totalScore += result.score;
    answeredCount += 1;
    if (!result.correct) {
      wrongCount += 1;
    }
  });

  state.score = Number(totalScore.toFixed(2));
  state.answered = answeredCount;
  state.sessionWrongCount = wrongCount;
  state.examSubmitted = true;
  state.examAbandoned = true;
  saveExamHistoryRecord(answeredCount, wrongCount, "abandoned");
  clearExamDraft();
  stopTimer();
  updateStats();
  renderWrongBook();
  renderPastWrongBook();
  dom.loadStatus.textContent = `已放弃考试，作答 ${answeredCount} 道，错题/需复核 ${wrongCount} 道，未作答题目不计分。`;
  showQuestion(state.currentIndex);
}

function showExamResult(lines, wrongLines, answeredCount) {
  dom.resultPanel.classList.remove("hidden");
  dom.resultTitle.textContent = `${currentExamTitle()}结果`;
  dom.questionScore.textContent = `${state.score.toFixed(2)} 分`;
  dom.resultText.className = `result-text ${wrongLines.length ? "bad" : "ok"}`;
  dom.resultText.textContent = `已提交 ${state.filteredQuestions.length} 道题，作答 ${answeredCount} 道。错题/需复核 ${wrongLines.length} 道。`;
  renderRichContent(dom.referenceAnswer, lines.join("\n\n------------------------------\n\n"));
  renderRichContent(dom.explanationText, wrongLines.length
    ? wrongLines.join("\n")
    : "本次模拟试卷没有错题。");
  renderRichContent(dom.sourceText, "每题知识点来源已列在左侧答案汇总中。");
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
  if (dom.timerText) {
    dom.timerText.textContent = "未开启";
  }
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
  if (dom.timerText) {
    dom.timerText.textContent = timeText;
  }
  dom.examTimerText.textContent = timeText;
  saveExamDraft();
  if (remaining <= 0) {
    stopTimer();
    alert("考试模式时间到。");
    if (state.mode === "exam" && !state.examSubmitted) {
      submitExamPaperWithoutConfirm();
    }
  }
}

function submitExamPaperWithoutConfirm() {
  submitExamPaper(false);
}

function loadWrongBook() {
  return loadStoredWrongBook(wrongBookKey());
}

function loadPastWrongBook() {
  return loadStoredWrongBook(pastWrongBookKey());
}

function loadStoredWrongBook(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function wrongBookKey() {
  return state.currentSubject ? `wrongBook:${state.currentSubject.id}` : "wrongBook:unknown";
}

function pastWrongBookKey() {
  return state.currentSubject ? `pastWrongBook:${state.currentSubject.id}` : "pastWrongBook:unknown";
}

function saveWrongBook() {
  localStorage.setItem(wrongBookKey(), JSON.stringify(state.wrongQuestions));
}

function savePastWrongBook() {
  localStorage.setItem(pastWrongBookKey(), JSON.stringify(state.pastWrongQuestions));
}

function makeWrongRecord(question, userAnswer = "") {
  const id = field(question, "编号");
  return {
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
    题目来源: field(question, "题目来源"),
    year: field(question, "year"),
    source_type: field(question, "source_type"),
    source: field(question, "source"),
    记录时间: new Date().toLocaleString(),
  };
}

function addWrongQuestion(question, userAnswer = "", manual = true) {
  const id = field(question, "编号");
  const record = makeWrongRecord(question, userAnswer);
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
    setPracticeStatus("已加入错题本");
  }
}

function addPastWrongQuestion(question, userAnswer = "", manual = true) {
  const id = field(question, "编号");
  const record = makeWrongRecord(question, userAnswer);
  const existingIndex = state.pastWrongQuestions.findIndex((item) => item.编号 === id);
  if (existingIndex >= 0) {
    state.pastWrongQuestions[existingIndex] = record;
  } else {
    state.pastWrongQuestions.unshift(record);
  }
  savePastWrongBook();
  renderPastWrongBook();
  updateStats();
  if (manual) {
    setPracticeStatus("已加入真题错题本");
  }
}

function removeWrongQuestion(id) {
  state.wrongQuestions = state.wrongQuestions.filter((item) => item.编号 !== id);
  saveWrongBook();
  renderWrongBook();
  updateStats();
}

function removePastWrongQuestion(id) {
  state.pastWrongQuestions = state.pastWrongQuestions.filter((item) => item.编号 !== id);
  savePastWrongBook();
  renderPastWrongBook();
  updateStats();
}

function removeCurrentWrongPracticeQuestion() {
  const question = currentQuestion();
  if (!question || !isWrongPracticeMode()) {
    return;
  }
  const id = field(question, "编号");
  const nextIndex = Math.min(state.currentIndex, Math.max(0, state.filteredQuestions.length - 2));

  if (state.mode === "wrongPractice") {
    state.wrongQuestions = state.wrongQuestions.filter((item) => item.编号 !== id);
    state.filteredQuestions = state.filteredQuestions.filter((item) => item.编号 !== id);
    state.wrongPracticeAnswers.delete(id);
    state.wrongPracticeSubmissions.delete(id);
    saveWrongBook();
    renderWrongBook();
  } else {
    state.pastWrongQuestions = state.pastWrongQuestions.filter((item) => item.编号 !== id);
    state.filteredQuestions = state.filteredQuestions.filter((item) => item.编号 !== id);
    state.pastWrongPracticeAnswers.delete(id);
    state.pastWrongPracticeSubmissions.delete(id);
    savePastWrongBook();
    renderPastWrongBook();
  }

  updateStats();
  showQuestion(state.filteredQuestions.length ? nextIndex : 0);
}

function renderWrongBook() {
  renderWrongBookFilters(state.wrongQuestions, dom.wrongTypeFilters, state.wrongBookTypeFilter, (type) => {
    state.wrongBookTypeFilter = type;
    renderWrongBook();
  });
  const items = filterWrongBookItems(state.wrongQuestions, state.wrongBookTypeFilter);
  renderWrongBookList(items, dom.wrongList, state.wrongBookTypeFilter ? "暂无该题型错题" : "暂无错题", practiceWrongQuestion, removeWrongQuestion);
}

function renderPastWrongBook() {
  renderWrongBookFilters(state.pastWrongQuestions, dom.pastWrongTypeFilters, state.pastWrongBookTypeFilter, (type) => {
    state.pastWrongBookTypeFilter = type;
    renderPastWrongBook();
  });
  const items = filterWrongBookItems(state.pastWrongQuestions, state.pastWrongBookTypeFilter);
  renderWrongBookList(items, dom.pastWrongList, state.pastWrongBookTypeFilter ? "暂无该题型真题错题" : "暂无真题错题", practicePastWrongQuestion, removePastWrongQuestion);
}

function itemType(item) {
  return cleanMetaText(item.题型) || "未分类";
}

function itemTypes(items) {
  return [...new Set(items.map(itemType))];
}

function filterItemsByType(items, type) {
  return type ? items.filter((item) => itemType(item) === type) : items;
}

function renderTypeFilters(items, filterDom, activeType, selectHandler) {
  const types = itemTypes(items);
  if (activeType && !types.includes(activeType)) {
    activeType = "";
    if (filterDom === dom.wrongTypeFilters) {
      state.wrongBookTypeFilter = "";
    } else if (filterDom === dom.pastWrongTypeFilters) {
      state.pastWrongBookTypeFilter = "";
    } else {
      state.favoriteTypeFilters[state.favoriteSource || "mock"] = "";
    }
  }

  filterDom.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.textContent = "全部题型";
  allButton.classList.toggle("active", !activeType);
  allButton.addEventListener("click", () => selectHandler(""));
  filterDom.appendChild(allButton);

  types.forEach((type) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = type;
    button.classList.toggle("active", activeType === type);
    button.addEventListener("click", () => selectHandler(type));
    filterDom.appendChild(button);
  });
}

function filterWrongBookItems(items, type) {
  return filterItemsByType(items, type);
}

function renderWrongBookFilters(items, filterDom, activeType, selectHandler) {
  renderTypeFilters(items, filterDom, activeType, selectHandler);
}

function renderWrongBookList(items, listDom, emptyText, practiceHandler, removeHandler) {
  if (!items.length) {
    listDom.textContent = emptyText;
    updateStats();
    return;
  }

  listDom.innerHTML = "";
  items.forEach((item) => {
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
    const sourceLines = [
      item.year ? `年份：${item.year}` : "",
      item.source ? `来源：${item.source}` : "",
    ].filter(Boolean);
    answer.textContent = [
      `我的答案：${item.我的答案 || "未记录"}`,
      `参考答案：${item.答案}`,
      `解析：${item.解析}`,
      `知识点来源：${item.知识点来源 || "无"}`,
      item.题目来源 ? `题目来源：${item.题目来源}` : "",
      ...sourceLines,
    ].filter(Boolean).join("\n");
    details.appendChild(answer);

    const actions = document.createElement("div");
    actions.className = "button-row";

    const goButton = document.createElement("button");
    goButton.type = "button";
    goButton.textContent = "练这题";
    goButton.addEventListener("click", () => practiceHandler(item));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "移除";
    removeButton.addEventListener("click", () => removeHandler(item.编号));

    actions.appendChild(goButton);
    actions.appendChild(removeButton);
    details.appendChild(actions);
    listDom.appendChild(details);
  });
  updateStats();
}

function practiceWrongQuestion(item) {
  const returnQuestion = state.mode === "practice" ? currentQuestion() : null;
  state.wrongPracticeReturnState = {
    index: state.currentIndex,
    questionId: returnQuestion ? field(returnQuestion, "编号") : "",
  };
  state.mode = "wrongPractice";
  stopTimer();
  state.filteredQuestions = filterWrongBookItems(state.wrongQuestions, state.wrongBookTypeFilter);
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.wrongPracticeAnswers = new Map();
  state.wrongPracticeSubmissions = new Map();
  updateStats();
  dom.loadStatus.textContent = "错题重做";
  showView("question");
  showQuestion(findWrongPracticeIndex(item.编号));
}

function practicePastWrongQuestion(item) {
  const returnQuestion = state.mode === "practice" ? currentQuestion() : null;
  state.wrongPracticeReturnState = {
    index: state.currentIndex,
    questionId: returnQuestion ? field(returnQuestion, "编号") : "",
  };
  state.mode = "pastWrongPractice";
  state.examSource = "past";
  state.filteredQuestions = filterWrongBookItems(state.pastWrongQuestions, state.pastWrongBookTypeFilter);
  state.score = 0;
  state.answered = 0;
  state.sessionWrongCount = 0;
  state.pastWrongPracticeAnswers = new Map();
  state.pastWrongPracticeSubmissions = new Map();
  state.examSubmitted = false;
  state.examAbandoned = false;
  stopTimer();
  updateStats();
  dom.loadStatus.textContent = "错题重做";
  showView("question");
  showQuestion(findWrongPracticeIndex(item.编号));
}

function findWrongPracticeIndex(id) {
  const index = state.filteredQuestions.findIndex((question) => field(question, "编号") === id);
  return index >= 0 ? index : 0;
}

function clearWrongBook() {
  if (!state.wrongQuestions.length) {
    return;
  }
  if (!confirm("确认清空错题本吗？")) {
    return;
  }
  state.wrongQuestions = [];
  state.wrongBookTypeFilter = "";
  saveWrongBook();
  renderWrongBook();
}

function clearPastWrongBook() {
  if (!state.pastWrongQuestions.length) {
    return;
  }
  if (!confirm("确认清空真题错题本吗？")) {
    return;
  }
  state.pastWrongQuestions = [];
  state.pastWrongBookTypeFilter = "";
  savePastWrongBook();
  renderPastWrongBook();
}

function returnToMenu() {
  saveCurrentPracticeAnswer();
  saveCurrentExamAnswer();
  saveSubjectSession();
  savePracticeState();
  renderMenu();
}

function handlePageZoom(event) {
  if (!event.ctrlKey || !window.courseApi || typeof window.courseApi.setZoomFactor !== "function") {
    return;
  }
  event.preventDefault();
  const direction = event.deltaY < 0 ? 1 : -1;
  zoomFactor = Math.max(minZoomFactor, Math.min(maxZoomFactor, Number((zoomFactor + direction * zoomStep).toFixed(2))));
  window.courseApi.setZoomFactor(zoomFactor);
}

window.addEventListener("wheel", handlePageZoom, { passive: false });
document.addEventListener("click", (event) => {
  const image = event.target.closest?.(".question-image");
  if (image) {
    openImagePreview(image);
    return;
  }
  if (event.target === dom.imagePreviewModal) {
    closeImagePreview();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImagePreview();
    return;
  }
  if ((event.key === "Enter" || event.key === " ") && event.target?.classList?.contains("question-image")) {
    event.preventDefault();
    openImagePreview(event.target);
  }
});
window.addEventListener("beforeunload", () => {
  saveCurrentExamAnswer();
  saveExamDraft();
});

dom.applyFilterBtn.addEventListener("click", applyFilters);
dom.practiceMockBtn.addEventListener("click", () => {
  switchPracticeSource("mock").catch((error) => {
    dom.loadStatus.textContent = error.message;
  });
});
dom.practicePastBtn.addEventListener("click", () => {
  switchPracticeSource("past").catch((error) => {
    dom.loadStatus.textContent = error.message;
  });
});
dom.randomBtn.addEventListener("click", showRandom);
dom.jumpQuestionBtn.addEventListener("mousedown", (event) => {
  event.preventDefault();
});
dom.jumpQuestionBtn.addEventListener("click", jumpToQuestion);
dom.questionJumpInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    jumpToQuestion();
  }
});
dom.questionJumpInput.addEventListener("pointerdown", () => {
  if (state.filteredQuestions.length) {
    dom.questionJumpInput.disabled = false;
  }
});
dom.questionJumpInput.addEventListener("focusin", () => {
  state.lastFocusedInput = "questionJumpInput";
});
dom.answerBox.addEventListener("focusin", (event) => {
  if (event.target && (event.target.id === "answerInput" || event.target.name === "choice")) {
    state.lastFocusedInput = "answerInput";
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
    if (isFavoritePracticeMode()) {
      removeCurrentFavoriteQuestion();
    } else if (isWrongPracticeMode()) {
      removeCurrentWrongPracticeQuestion();
    } else if (currentFavoriteSource() === "past") {
      addPastWrongQuestion(question, getUserAnswer(question), true);
    } else {
      addWrongQuestion(question, getUserAnswer(question), true);
    }
  }
});
dom.startExamBtn.addEventListener("click", startMockExam);
dom.startPastExamBtn.addEventListener("click", startPastExam);
if (dom.submitExamBtn) {
  dom.submitExamBtn.addEventListener("click", () => submitExamPaper());
}
dom.examSubmitBtn.addEventListener("click", () => submitExamPaper());
dom.examAbandonBtn.addEventListener("click", abandonExamPaper);
if (dom.exitExamBtn) {
  dom.exitExamBtn.addEventListener("click", exitExam);
}
dom.examExitBtn.addEventListener("click", handleExamExitClick);
dom.clearWrongBtn.addEventListener("click", clearWrongBook);
dom.clearPastWrongBtn.addEventListener("click", clearPastWrongBook);
dom.backToMenuBtn.addEventListener("click", returnToMenu);
dom.placeholderBackBtn.addEventListener("click", renderMenu);
dom.favoriteZoneBtn.addEventListener("click", showFavoriteHome);
dom.favoriteBackBtn.addEventListener("click", returnFromFavorite);
dom.favoriteListBackBtn.addEventListener("click", showFavoriteHome);
dom.mockFavoriteBtn.addEventListener("click", () => showFavoriteList("mock"));
dom.pastFavoriteBtn.addEventListener("click", () => showFavoriteList("past"));
dom.favoriteBtn.addEventListener("click", addCurrentFavorite);
dom.favoriteReturnBtn.addEventListener("click", returnFromFocusedPractice);
dom.examHistoryBtn.addEventListener("click", showExamHistoryHome);
dom.continueExamBtn.addEventListener("click", restoreExamDraft);
dom.examHistoryBackBtn.addEventListener("click", returnFromExamHistory);
dom.examHistoryListBackBtn.addEventListener("click", showExamHistoryHome);
dom.mockExamHistoryBtn.addEventListener("click", () => showExamHistoryList("mock"));
dom.pastExamHistoryBtn.addEventListener("click", () => showExamHistoryList("past"));
dom.courseMaterialsBtn.addEventListener("click", showMaterialsHome);
dom.materialsBackBtn.addEventListener("click", returnFromMaterials);
dom.materialsCategoryBackBtn.addEventListener("click", showMaterialsHome);
dom.pptMaterialsBtn.addEventListener("click", () => showMaterialsCategory("ppt", "上课PPT"));
dom.paperMaterialsBtn.addEventListener("click", () => showMaterialsCategory("papers", "试卷原卷"));
if (dom.imagePreviewClose) {
  dom.imagePreviewClose.addEventListener("click", closeImagePreview);
}

renderMenu().catch((error) => {
  dom.loadStatus.textContent = error.message;
  dom.subjectGrid.textContent = "主菜单加载失败。请确认 app/data/ 目录可访问。";
  console.error(error);
});
