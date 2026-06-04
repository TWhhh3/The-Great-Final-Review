from __future__ import annotations

import json
import re
import shutil
from collections import OrderedDict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MATERIALS_DIR = ROOT / "materials"
OUTPUT_DIR = ROOT / "output"
APP_DIR = ROOT / "app"

SOURCE_NAME_KEYWORD = "模拟题库"
REQUIRED_FIELDS = ["章节", "题型", "难度", "题干", "答案", "解析", "知识点来源"]


def find_source_markdown() -> Path:
    candidates = [p for p in MATERIALS_DIR.glob("*.md") if SOURCE_NAME_KEYWORD in p.name]
    if not candidates:
        candidates = list(MATERIALS_DIR.glob("*.md"))
    if not candidates:
        raise FileNotFoundError("materials 中没有找到 Markdown 题库文件。")
    if len(candidates) > 1:
        names = "、".join(p.name for p in candidates)
        raise RuntimeError(f"找到多个 Markdown 文件，请只保留一个模拟题库文件或调整脚本：{names}")
    return candidates[0]


def clean_value(value: str) -> str:
    lines = [line.rstrip() for line in value.strip().splitlines()]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines).strip()


def parse_block(qid: str, body: str) -> dict:
    fields: dict[str, str] = {}
    options: list[str] = []
    current_name: str | None = None
    current_lines: list[str] = []
    in_options = False

    def flush_current() -> None:
        nonlocal current_name, current_lines
        if current_name:
            fields[current_name] = clean_value("\n".join(current_lines))
        current_name = None
        current_lines = []

    for raw_line in body.splitlines():
        line = raw_line.rstrip()
        field_match = re.match(r"^- (章节|题型|难度|题干|选项|答案|解析|知识点来源)：(.*)$", line)
        option_match = re.match(r"^\s*-\s*([A-D])\.\s*(.*)$", line)

        if field_match:
            flush_current()
            name, value = field_match.group(1), field_match.group(2)
            in_options = name == "选项"
            if in_options:
                continue
            current_name = name
            current_lines = [value.strip()]
            continue

        if in_options and option_match:
            options.append(f"{option_match.group(1)}. {option_match.group(2).strip()}")
            continue

        if current_name:
            current_lines.append(line)

    flush_current()

    question = {
        "编号": qid,
        "章节": fields.get("章节", "资料未明确说明"),
        "题型": fields.get("题型", "资料未明确说明"),
        "难度": fields.get("难度", "资料未明确说明"),
        "题干": fields.get("题干", "资料未明确说明"),
        "选项": options,
        "答案": fields.get("答案", "资料未明确说明"),
        "解析": fields.get("解析", "资料未明确说明"),
        "知识点来源": fields.get("知识点来源", "资料未明确说明"),
    }
    return question


def parse_markdown(text: str) -> list[dict]:
    parts = re.split(r"^###\s+(Q\d+)\s*$", text, flags=re.MULTILINE)
    questions: list[dict] = []
    for index in range(1, len(parts), 2):
        qid = parts[index].strip()
        body = parts[index + 1]
        question = parse_block(qid, body)
        questions.append(question)
    return questions


def group_by_chapter(questions: list[dict]) -> list[dict]:
    groups: OrderedDict[str, list[dict]] = OrderedDict()
    for question in questions:
        chapter = question["章节"]
        groups.setdefault(chapter, []).append(question)
    return [{"章节": chapter, "说明": "来自 materials/模拟题库.md", "题目": items} for chapter, items in groups.items()]


def validate_questions(questions: list[dict]) -> list[str]:
    problems: list[str] = []
    seen_ids: set[str] = set()
    for question in questions:
        qid = question["编号"]
        if qid in seen_ids:
            problems.append(f"{qid}: 编号重复")
        seen_ids.add(qid)

        for field_name in REQUIRED_FIELDS:
            if not str(question.get(field_name, "")).strip():
                problems.append(f"{qid}: 缺少 {field_name}")

        qtype = question.get("题型", "")
        if "选择" in qtype and len(question.get("选项", [])) != 4:
            problems.append(f"{qid}: 选择题选项数量不是 4 个")

    return problems


def build_bank(source: Path, questions: list[dict]) -> dict:
    return {
        "metadata": {
            "课程": "微机原理",
            "来源": f"materials/{source.name}",
            "生成时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "说明": "本题库由模拟题库.md 直接解析生成，未修改 materials 原始资料。",
            "总题数": len(questions),
        },
        "chapters": group_by_chapter(questions),
    }


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    APP_DIR.mkdir(exist_ok=True)

    source = find_source_markdown()
    text = source.read_text(encoding="utf-8")
    questions = parse_markdown(text)
    if not questions:
        raise RuntimeError(f"{source} 中没有解析到 ### Q 编号题。")

    problems = validate_questions(questions)
    if problems:
        print("解析后发现以下问题：")
        for problem in problems[:50]:
            print(f"- {problem}")
        if len(problems) > 50:
            print(f"... 还有 {len(problems) - 50} 个问题")
        raise RuntimeError("题库存在不完整题目，请先修正 Markdown 或调整解析规则。")

    bank = build_bank(source, questions)
    output_path = OUTPUT_DIR / "question_bank.json"
    app_path = APP_DIR / "question_bank.json"

    output_path.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    shutil.copyfile(output_path, app_path)

    type_counts: OrderedDict[str, int] = OrderedDict()
    chapter_counts: OrderedDict[str, int] = OrderedDict()
    for question in questions:
        type_counts[question["题型"]] = type_counts.get(question["题型"], 0) + 1
        chapter_counts[question["章节"]] = chapter_counts.get(question["章节"], 0) + 1

    print(f"来源文件：{source}")
    print(f"已生成：{output_path}")
    print(f"已同步：{app_path}")
    print(f"总题数：{len(questions)}")
    print("按题型统计：")
    for qtype, count in type_counts.items():
        print(f"- {qtype}: {count}")
    print("按章节统计：")
    for chapter, count in chapter_counts.items():
        print(f"- {chapter}: {count}")


if __name__ == "__main__":
    main()
