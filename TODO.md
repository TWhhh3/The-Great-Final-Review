# TODO.md

本文件用于交接给新的 Codex thread。新的 thread 即使不知道前面的对话，也应能通过本文件快速理解当前项目背景、已有架构、现有功能、目标功能和下一步改造任务。

## 1. 项目背景

当前项目是一个“课程题库自测应用”。它最初是用于《微机原理》期末复习的本地网页版题库程序，题库来自项目中的课程资料和 `materials/模拟题库.md`，当前网页放在 `app/` 目录。

现在用户希望把它升级为桌面端多科目题库应用，目标是：

- 做成桌面端应用。
- 启动后先进入主菜单。
- 主菜单中选择科目。
- 点击科目后进入对应题库页面。
- 未添加题库的科目显示“尚未添加题库”和“该科目的题库文件尚未建立，后续可添加。”
- 后续可以继续添加其他科目的题库 JSON。

重要项目规则：

- 不要修改 `materials/` 中的原始资料。
- 网页程序继续放在 `app/`。
- 代码尽量简单，保留原生 HTML、CSS、JavaScript，不要引入 React、Vue、Next.js。
- 每次修改后说明改了哪些文件、如何运行、结果在哪里、需要用户检查什么。

## 2. 当前已有功能

根据当前 `app/index.html`、`app/style.css`、`app/main.js` 和 `app/question_bank.json` 检查，已有功能如下：

- 已有《微机原理》题库。
- 当前题库 JSON 路径是 `app/question_bank.json`。
- `output/question_bank.json` 也存在一份同源题库。
- 当前 `app/question_bank.json` 题库总数为 845 道。
- 题型统计：
  - 单项选择题：270
  - 填空题：270
  - 简答题：135
  - 程序阅读题：135
  - 系统扩展题：15
  - 程序设计题：20
- 当前题库 JSON 是对象结构，包含 `metadata` 和 `chapters`，不是简单数组。
- 支持章节筛选。
- 支持题型筛选。
- 支持难度筛选。
- 支持随机出题。
- 支持上一题、下一题。
- 支持提交答案。
- 单项选择题按选项字母自动判断。
- 填空题忽略大小写和多余空格做简单判断。
- 简答题、系统扩展题、程序阅读题、程序设计题按文本重合度给自评分，并显示自评提示。
- 显示参考答案。
- 显示解析。
- 显示知识点来源。
- 显示得分、已答、正确率。
- 有错题本功能：
  - 答错自动加入错题本。
  - 可手动加入错题本。
  - 错题本记录题干、选项、我的答案、参考答案、解析、知识点来源。
  - 错题本使用浏览器 `localStorage`，键名为 `mcuWrongBook`。
- 有模拟考试功能：
  - 单项选择题 15 道。
  - 填空题 10 道。
  - 程序阅读题 2 道。
  - 简答题 2 道。
  - 系统扩展题 1 道。
  - 程序设计题 4 道。
  - 总计 34 道。
  - 抽题时按章节尽量均衡。
  - 可选两小时倒计时。

当前不存在或尚未确认的功能：

- 不存在 Electron 桌面端入口。
- 不存在 `package.json`。
- 不存在 `README.md`。
- 不存在 `app/data/` 目录。
- 不存在多科目主菜单。
- 不存在未添加题库科目的占位页。
- 不存在 Electron `main.js` 或 `preload.js`。
- 尚未确认是否需要打包安装程序；当前目标先实现本地 Electron 启动。

## 3. 当前项目结构

当前根目录实际结构重点如下：

```text
微机原理复习/
├─ AGENTS.md
├─ requirements.txt
├─ .agents/
│  └─ skills/
│     └─ course-review-builder/
│        ├─ SKILL.md
│        └─ agents/
├─ app/
│  ├─ index.html
│  ├─ style.css
│  ├─ main.js
│  └─ question_bank.json
├─ extracted/
├─ materials/
│  └─ 模拟题库.md
├─ output/
│  ├─ question_bank.json
│  ├─ review_outline.md
│  ├─ 微机原理核心复习提纲.pdf
│  └─ playwright/
├─ scripts/
│  ├─ build_pdf.py
│  ├─ build_question_bank.py
│  ├─ build_question_bank_from_markdown.py
│  ├─ extract_materials.py
│  ├─ ocr_scanned_pdfs.py
│  └─ windows_ocr_image.ps1
└─ tmp/
```

当前不存在：

- `package.json`：不存在。
- `README.md`：不存在。
- `app/data/`：不存在。
- `data/`：不存在。
- `electron/`：不存在。
- Electron 相关文件：不存在。

当前题库 JSON 文件：

- `app/question_bank.json`：网页当前读取的题库。
- `output/question_bank.json`：输出目录中的题库副本。

当前网页入口：

- `app/index.html`
- `app/style.css`
- `app/main.js`

## 4. 目标架构

目标是把当前网页版《微机原理》题库改造成 Electron 桌面端多科目题库应用。

建议目标结构如下，需结合当前项目实际逐步迁移：

```text
微机原理复习/
├─ app/
│  ├─ index.html
│  ├─ style.css
│  ├─ main.js
│  └─ data/
│     ├─ microcomputer.json
│     ├─ sensor_signal.json
│     ├─ manufacturing.json
│     ├─ industrial_robot.json
│     └─ forming_technology.json
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ package.json
├─ TODO.md
├─ README.md
├─ AGENTS.md
├─ scripts/
├─ output/
├─ extracted/
└─ materials/
```

改造原则：

- 保留当前 `app/index.html`、`app/style.css`、`app/main.js` 的主体功能。
- 不要为了 Electron 重写成复杂框架。
- Electron 只负责提供桌面窗口和加载本地页面。
- 题库数据逐步统一迁移到 `app/data/`。
- 当前 `app/question_bank.json` 需要迁移或复制为 `app/data/microcomputer.json`。

## 5. 科目列表

目标主菜单包含以下科目：

1. 微机原理
2. 传感与信号处理
3. 机械制造技术基础
4. 工业机器人应用技术
5. 成型技术基础

当前只有“微机原理”题库已经存在，路径是 `app/question_bank.json`，下一步应迁移为 `app/data/microcomputer.json`。

其他科目题库暂时未建立。点击这些科目时应显示：

```text
尚未添加题库
该科目的题库文件尚未建立，后续可添加。
```

未添加题库的科目不能让页面报错，也不能卡在加载状态。

## 6. 数据文件设计

目标题库数据文件路径：

- 微机原理：`app/data/microcomputer.json`
- 传感与信号处理：`app/data/sensor_signal.json`
- 机械制造技术基础：`app/data/manufacturing.json`
- 工业机器人应用技术：`app/data/industrial_robot.json`
- 成型技术基础：`app/data/forming_technology.json`

当前项目中题库仍是：

- `app/question_bank.json`

下一步需要：

1. 创建 `app/data/` 目录。
2. 把 `app/question_bank.json` 复制或迁移为 `app/data/microcomputer.json`。
3. 修改 `app/main.js`，不再固定读取 `question_bank.json`，而是根据当前科目读取对应的 `subjects[i].file`。

注意当前微机原理题库格式：

```json
{
  "metadata": {},
  "chapters": [
    {
      "章节": "...",
      "说明": "...",
      "题目": []
    }
  ]
}
```

如果后续新科目题库使用数组格式，也需要在代码中兼容。建议 `flattenBank()` 同时支持：

- 当前对象格式：`{ chapters: [{ 题目: [...] }] }`
- 简单数组格式：`[{ 编号, 章节, 题型, ... }]`

状态判断建议：

- 如果 JSON 文件存在且是非空数组，则显示“已添加题库”。
- 如果 JSON 文件存在且是当前微机原理格式，并且 `chapters` 中能展开出题目，也显示“已添加题库”。
- 如果 JSON 文件不存在、为空、格式错误，或无法展开出题目，则显示“尚未添加题库”。
- 点击未添加题库的科目时不能报错，要进入占位页。

## 7. subjects 配置设计

后续代码应使用一个 `subjects` 配置数组统一管理科目，例如：

```js
const subjects = [
  {
    id: "microcomputer",
    name: "微机原理",
    file: "data/microcomputer.json"
  },
  {
    id: "sensor_signal",
    name: "传感与信号处理",
    file: "data/sensor_signal.json"
  },
  {
    id: "manufacturing",
    name: "机械制造技术基础",
    file: "data/manufacturing.json"
  },
  {
    id: "industrial_robot",
    name: "工业机器人应用技术",
    file: "data/industrial_robot.json"
  },
  {
    id: "forming_technology",
    name: "成型技术基础",
    file: "data/forming_technology.json"
  }
];
```

建议实现方式：

- 页面启动后先显示主菜单。
- 主菜单遍历 `subjects` 生成 5 张科目卡片。
- 对每个 subject 尝试读取 `subject.file`。
- 如果 JSON 文件存在且是非空数组，则显示“已添加题库”。
- 如果 JSON 文件存在且是当前对象格式并能展开出题目，也显示“已添加题库”。
- 如果 JSON 文件不存在、为空、格式错误，则显示“尚未添加题库”。
- 点击已添加题库的科目，进入题库页面并加载对应题库。
- 点击未添加题库的科目，进入占位页，显示“尚未添加题库”和“该科目的题库文件尚未建立，后续可添加。”
- 当前错题本的 `localStorage` 键名应从固定 `mcuWrongBook` 改成按科目区分，例如 `wrongBook:microcomputer`。

## 8. Electron 改造任务

需要完成的 Electron 改造任务：

- 新增或完善 `package.json`。
- 安装 Electron。
- 新增 Electron 主进程文件，例如 `electron/main.js`。
- 可选新增 `electron/preload.js`。
- 设置默认窗口大小约 `1200 x 800`。
- 配置 `npm start` 启动桌面应用。
- Electron 主窗口加载 `app/index.html`。
- 保留现有 HTML/CSS/JS。
- 不引入 React、Vue、Next.js。
- 保证当前网页功能在 Electron 中仍然可用：
  - 题库加载。
  - 章节筛选。
  - 题型筛选。
  - 难度筛选。
  - 随机出题。
  - 上一题、下一题。
  - 提交答案。
  - 查看答案、解析、知识点来源。
  - 得分、已答、正确率统计。
  - 错题本。
  - 模拟考试。
  - 两小时计时。
- 优先先实现 `npm start` 能启动桌面窗口，不急着做安装包。

建议 `package.json` 基本方向：

```json
{
  "name": "course-question-bank-desktop",
  "version": "0.1.0",
  "private": true,
  "main": "electron/main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^版本号待安装时确定"
  }
}
```

注意：实际安装 Electron 时请根据当前环境和用户确认执行 `npm install --save-dev electron`。

## 9. 页面功能目标

### 主菜单页面

- 显示标题：`课程题库主菜单`。
- 以卡片形式显示 5 门科目。
- 每张卡片显示题库状态：
  - `已添加题库`
  - `尚未添加题库`
- 每张卡片可点击。
- 点击已添加题库的科目进入题库页面。
- 点击未添加题库的科目进入未添加题库占位页。

### 题库页面

- 显示当前科目名称。
- 保留原有刷题功能。
- 支持返回主菜单。
- 微机原理使用现有题库数据。
- 筛选项应来自当前科目题库，而不是固定微机原理。
- 模拟考试功能可以先沿用当前题型配比；后续如果其他科目题型不同，再做科目级配置。
- 错题本建议按科目隔离保存。

### 未添加题库页面

- 显示：`尚未添加题库`。
- 显示：`该科目的题库文件尚未建立，后续可添加。`
- 显示当前科目名称。
- 提供“返回主菜单”按钮。

## 10. 后续添加新科目的方法

后续用户添加新科目题库时，只需要：

1. 用 ChatGPT 或 Codex 根据该课程资料生成对应科目的 JSON 题库。
2. 放入 `app/data/` 目录。
3. 文件名与 `subjects` 配置一致：
   - `app/data/sensor_signal.json`
   - `app/data/manufacturing.json`
   - `app/data/industrial_robot.json`
   - `app/data/forming_technology.json`
4. 重启桌面应用。
5. 应用自动识别该科目已添加题库。

建议新科目题库字段继续使用当前中文字段，方便复用现有答题逻辑：

```json
{
  "编号": "Q0001",
  "章节": "第1章 ...",
  "题型": "单项选择题",
  "难度": "基础",
  "题干": "...",
  "选项": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "答案": "A",
  "解析": "...",
  "知识点来源": "..."
}
```

选择题必须有 4 个选项。非选择题 `选项` 可以为空数组。

## 11. 待办清单

- [ ] 检查当前网页题库功能。
- [ ] 备份现有 `app/question_bank.json`。
- [ ] 创建 `app/data/` 目录。
- [ ] 迁移微机原理题库到 `app/data/microcomputer.json`。
- [ ] 新增 `subjects` 配置。
- [ ] 让题库加载逻辑从固定 `question_bank.json` 改为读取当前 subject 的 JSON。
- [ ] 让 `flattenBank()` 同时兼容当前 `{ chapters: [...] }` 格式和数组格式。
- [ ] 改造首页为多科目主菜单。
- [ ] 在主菜单显示每门课的题库状态。
- [ ] 实现未添加题库占位页。
- [ ] 给微机原理题库页添加返回主菜单按钮。
- [ ] 让错题本按科目隔离保存。
- [ ] 检查模拟考试功能在微机原理题库中仍正常。
- [ ] 添加 Electron 主进程 `electron/main.js`。
- [ ] 视需要添加 `electron/preload.js`。
- [ ] 添加 `package.json` 和 `npm start`。
- [ ] 安装 Electron。
- [ ] 测试 Electron 应用启动。
- [ ] 测试主菜单。
- [ ] 测试微机原理题库。
- [ ] 测试未添加题库科目。
- [ ] 测试返回主菜单。
- [ ] 测试错题本在 Electron 中是否能保存。
- [ ] 测试模拟考试和两小时计时。
- [ ] 更新或创建 `README.md`。

## 12. 新 thread 启动提示

给新的 Codex thread 的启动指令：

```text
请先阅读 TODO.md、AGENTS.md 和当前项目文件结构。不要急着重写项目。先总结你理解的当前架构和待办任务，然后提出改造方案，等用户确认后再修改代码。

重点注意：
1. 不要修改 materials/ 中的原始资料。
2. 当前 app/ 是一个可运行的原生 HTML/CSS/JavaScript 网页题库。
3. 当前题库在 app/question_bank.json，下一步需要迁移到 app/data/microcomputer.json。
4. 当前没有 package.json、README.md、electron/ 目录。
5. 目标是 Electron 桌面端多科目题库应用，不要引入 React、Vue、Next.js。
6. 未添加题库的科目必须显示占位页，不能报错。
```
