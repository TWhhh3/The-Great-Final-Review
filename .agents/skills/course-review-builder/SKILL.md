---
name: course-review-builder
description: Build reusable course review materials from local class resources. Use when Codex needs to process PPT, PDF, Word, image, or mixed course files in a local materials folder and generate exam-focused review outlines, concept explanations, printable PDFs, question-bank JSON, and a native HTML/CSS/JavaScript self-test web app while preserving original materials and marking unclear source support.
---

# Course Review Builder

## 使用场景

使用本 skill 将本地课程资料整理成期末复习用成果。当用户提供或指定 `materials` 文件夹中的 PPT、PDF、Word、图片等资料，并要求生成复习提纲、重点概念、PDF、题库 JSON 或本地网页自测程序时，按本流程执行。

核心原则：

- 不修改 `materials` 中的原始资料。
- 所有中间文本放到 `extracted`。
- 所有生成结果放到 `output`。
- 网页程序放到 `app`。
- 脚本放到 `scripts`。
- 内容必须尽量基于资料，不要凭空编造。
- 如果资料不明确，写明“资料未明确说明”。
- 代码尽量简单，优先让初学者能看懂。

## 输入文件夹结构

期望项目根目录包含：

```text
materials/   原始课程资料：PPT、PDF、Word、图片等，只读，不修改
extracted/   从资料提取出的文本、OCR 文本、合并文本
output/      复习提纲、重点概念详解、PDF、题库 JSON
app/         本地网页自测程序
scripts/     Python 脚本
```

如果目录不存在，先创建缺失目录。创建目录不等于可以修改 `materials` 中已有文件。

## 输出文件夹结构

推荐输出：

```text
extracted/
  extracted_text.md          按资料来源整理的提取文本
  source_index.json          资料文件索引、页码或章节线索

output/
  review_outline.md          核心复习提纲
  key_concepts.md            重点概念详解
  question_bank.json         题库 JSON
  review_printable.pdf       可打印 PDF

app/
  index.html                 自测页面
  style.css                  页面样式
  script.js                  答题逻辑
```

可按项目需要增加文件，但不要把生成结果写回 `materials`。

## 资料提取流程

1. 扫描 `materials`，记录文件名、类型、大小、可能的章节信息。
2. 按文件类型提取文本：
   - PDF：优先使用 Python PDF 文本提取库；若文字为空，再考虑 OCR。
   - PPT/PPTX：提取每页标题、正文、备注中的文字。
   - Word/DOCX：提取正文、标题、表格中的文字。
   - 图片：如资料依赖图片文字，使用 OCR；无法 OCR 时标注“资料未明确说明”。
3. 将提取文本按来源写入 `extracted/extracted_text.md`。
4. 为每段文本保留来源线索，例如文件名、页码、幻灯片编号或章节标题。
5. 将资料清单和来源线索写入 `extracted/source_index.json`。
6. 如果提取失败，不要猜测内容；在输出中说明失败文件和原因。

提取文本格式建议：

```markdown
## 来源：文件名.pdf

### 页码/页/幻灯片：1

提取到的文字...
```

## 复习提纲生成流程

1. 只基于 `extracted` 中已提取的资料生成提纲。
2. 先识别课程主题、章节、反复出现的概念、复习重点、公式、端口、寄存器、总线、存储器、接口、中断、汇编程序等考试相关内容。
3. 将内容整理成适合期末复习的结构：
   - 考试范围或章节范围
   - 核心知识点
   - 常考点
   - 易混点
   - 需要记忆的表格、步骤或格式
   - 典型程序或设计题思路
4. 每个重要结论尽量附来源线索。
5. 遇到资料中没有明确说明的定义、结论、公式、答案或推导，标注“资料未明确说明”。
6. 输出到 `output/review_outline.md`。

## 重点概念详解生成流程

1. 从提纲和提取文本中筛选高频、核心、易错概念。
2. 每个概念建议包含：
   - 概念名称
   - 资料中的定义或描述
   - 通俗解释
   - 常见考法
   - 易混点
   - 来源线索
3. 通俗解释可以帮助理解，但不能把资料没有的内容写成确定事实。
4. 资料不足时写“资料未明确说明”。
5. 输出到 `output/key_concepts.md`。

## 题库生成流程

题库必须包含：

- 选择题
- 填空题
- 简答题
- 程序阅读分析题
- 系统扩展设计题
- 程序设计题

生成要求：

1. 题目基于 `extracted` 中的资料内容和 `output/review_outline.md`。
2. 每道题尽量提供来源线索。
3. 不确定答案或资料依据不足时，答案或解析中标注“资料未明确说明”。
4. 选择题必须提供选项、正确答案和解析。
5. 程序阅读分析题应包含代码片段、问题、参考答案和分析过程。
6. 系统扩展设计题应包含设计条件、要求、参考思路和关键步骤。
7. 程序设计题应包含题目要求、参考程序或伪代码、关键说明。
8. 输出 JSON 到 `output/question_bank.json`，保持字段简单稳定，便于网页读取。

推荐 JSON 结构：

```json
[
  {
    "id": "q001",
    "type": "选择题",
    "question": "题干",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A",
    "explanation": "解析",
    "source": "文件名.pdf 第 3 页",
    "confidence": "基于资料"
  }
]
```

`type` 使用中文题型名。`confidence` 可使用 `基于资料`、`资料部分明确`、`资料未明确说明`。

## PDF 生成流程

1. 优先从 `output/review_outline.md` 和 `output/key_concepts.md` 生成可打印 PDF。
2. PDF 内容应适合考试复习，结构清晰，避免过度装饰。
3. 推荐顺序：
   - 封面或标题
   - 核心复习提纲
   - 重点概念详解
   - 高频题型提示
   - 资料未明确说明的内容清单
4. 使用 Python 生成 PDF。若中文字体显示异常，寻找可用中文字体并在脚本中明确指定。
5. 输出到 `output/review_printable.pdf`。
6. 生成后检查 PDF 是否存在、页数是否合理、中文是否乱码。

## 网页自测程序生成流程

1. 在 `app` 中生成原生 HTML、CSS、JavaScript 文件。
2. 不使用复杂框架。
3. 网页优先读取 `output/question_bank.json`。如果浏览器本地读取 JSON 受限，可在 `script.js` 中说明需要用本地服务器运行。
4. 基础功能：
   - 题目浏览
   - 按题型筛选
   - 答题
   - 查看答案和解析
   - 简单统计正确率
5. 页面设计简单清晰，适合本地复习。避免复杂动画和不必要装饰。
6. 推荐运行方式：

```powershell
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000/app/
```

## 质量要求

- 不修改 `materials` 中任何原始资料。
- 生成内容必须能追溯到资料；没有依据时标注“资料未明确说明”。
- 不把推测写成确定结论。
- 题库覆盖所有指定题型。
- JSON 必须是合法 JSON。
- PDF 必须能打开，中文不乱码。
- 网页程序必须能在本地浏览器运行。
- Python 脚本尽量短小，变量名清楚，注释少而必要。
- 每次生成前后检查目录位置，避免输出到错误文件夹。

## 最终回复格式

完成任务后，按以下格式简洁回复用户：

```markdown
已完成。

改动文件：
- `extracted/...`
- `output/...`
- `app/...`
- `scripts/...`

如何运行：
- 提取资料：`python scripts/...`
- 生成 PDF：`python scripts/...`
- 打开自测网页：`python -m http.server 8000`，访问 `http://localhost:8000/app/`

结果位置：
- 复习提纲：`output/review_outline.md`
- 重点概念：`output/key_concepts.md`
- PDF：`output/review_printable.pdf`
- 题库：`output/question_bank.json`
- 网页：`app/index.html`

需要你检查：
- 资料是否都放在 `materials`
- 提纲是否符合老师复习重点
- 题库答案是否与课堂要求一致
- PDF 中文是否正常显示
```

如果某一步失败，说明失败原因、受影响文件、下一步需要什么输入。不要省略“资料未明确说明”的标注要求。
