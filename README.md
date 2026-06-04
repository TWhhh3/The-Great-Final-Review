# The-Great-Final-Review

由于往年试卷资料太少，于是用 ChatGPT 生成题库，用于期末复习。

本应用由 Codex vibe coding 而成。项目一开始是网页端，后来改成 Electron 桌面端，所以主体使用原生 HTML、CSS、JavaScript 编写。

刚开始做，也暂时只是为了满足我的期末复习的临时需求，所以做得很naive（）。

当前已内置“微机原理”题库，其他科目预留了入口。

## 运行桌面应用

首次运行前安装依赖：

```bash
npm install
```

启动桌面应用：

```bash
npm start
```

也可以双击项目根目录下的 `期末复习题库.vbs` 启动。

## 当前题库数据

- 微机原理：`app/data/microcomputer.json`
- 传感与信号处理：`app/data/sensor_signal.json`
- 机械制造技术基础：`app/data/manufacturing.json`
- 工业机器人应用技术：`app/data/industrial_robot.json`
- 成型技术基础：`app/data/forming_technology.json`

当前只有 `app/data/microcomputer.json` 已建立。其他科目的 JSON 文件不存在时，应用会显示“尚未添加题库”占位页，后续应该会添加。
不知道后面能不能联网用AI即时生成题库，但是我光生成这一门的题库就用了20分钟……估计很难……

## 添加新科目题库

1. 按 `app/main.js` 中 `subjects` 配置的 `file` 路径放入对应 JSON 文件。
2. JSON 可以使用当前微机原理题库的对象格式，也可以使用题目数组格式。
3. 重启应用后，主菜单会自动检测题库是否可用。

建议题目字段继续使用中文字段：

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

伟大的本科生期末大复习万岁！
