from __future__ import annotations

import json
import re
from collections import OrderedDict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "materials" / "microcomputer" / "往年真题.md"
OUTPUT_PATH = ROOT / "app" / "data" / "past_exams_microcomputer.json"


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
        field_match = re.match(r"^- (编号|章节|题型|题干|选项|答案|解析|年份|题目来源|来源)：(.*)$", line)
        option_match = re.match(r"^\s*-\s*([A-Z])\.\s*(.*)$", line)

        if field_match:
            flush_current()
            name, value = field_match.group(1), field_match.group(2)
            in_options = name == "选项"
            if in_options:
                if value.strip() and value.strip() != "无":
                    options.append(value.strip())
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

    stem = fields.get("题干", "资料未明确说明").strip() or "资料未明确说明"
    qtype = fields.get("题型", "资料未明确说明").strip() or "资料未明确说明"
    if "选择" in qtype and not options:
        stem, options = split_inline_options(stem)

    answer = fields.get("答案", "").strip()
    explanation = fields.get("解析", "").strip() or "原始真题中未提供解析"
    question_source = fields.get("题目来源", fields.get("来源", "")).strip()

    return {
        "编号": fields.get("编号", qid).strip() or qid,
        "章节": fields.get("章节", "资料未明确说明").strip() or "资料未明确说明",
        "题型": qtype,
        "题干": stem,
        "选项": options,
        "答案": answer,
        "解析": explanation,
        "知识点来源": "materials/往年真题.md",
        "题目来源": question_source,
        "year": fields.get("年份", "").strip(),
        "source_type": "past_exam",
        "source": question_source or fields.get("来源", "materials/往年真题.md").strip() or "materials/往年真题.md",
    }


def split_inline_options(stem: str) -> tuple[str, list[str]]:
    option_pattern = re.compile(
        r"([A-D])\s*[、.．]\s*(.*?)(?=\s+[A-D]\s*[、.．]\s*|$)",
        flags=re.DOTALL,
    )
    matches = list(option_pattern.finditer(stem))
    labels = [match.group(1) for match in matches]
    if labels != ["A", "B", "C", "D"]:
        return stem, []

    options = [f"{match.group(1)}. {clean_value(match.group(2))}" for match in matches]
    clean_stem = stem[: matches[0].start()].rstrip()
    return clean_stem, options


def parse_markdown(text: str) -> list[dict]:
    parts = re.split(r"^###\s*(.+?)\s*$", text, flags=re.MULTILINE)
    questions: list[dict] = []
    for index in range(1, len(parts), 2):
        qid = parts[index].strip()
        body = parts[index + 1]
        questions.append(parse_block(qid, body))
    return questions


def group_by_chapter(questions: list[dict]) -> list[dict]:
    groups: OrderedDict[str, list[dict]] = OrderedDict()
    for question in questions:
        groups.setdefault(question["章节"], []).append(question)
    return [{"章节": chapter, "说明": "来自 materials/往年真题.md", "题目": items} for chapter, items in groups.items()]


def validate(questions: list[dict]) -> list[str]:
    problems: list[str] = []
    seen_ids: set[str] = set()
    for question in questions:
        qid = question["编号"]
        if qid in seen_ids:
            problems.append(f"{qid}: 编号重复")
        seen_ids.add(qid)
        for name in ["章节", "题型", "题干", "解析"]:
            if not str(question.get(name, "")).strip():
                problems.append(f"{qid}: 缺少 {name}")
        if "选择" in question.get("题型", "") and not question.get("选项"):
            problems.append(f"{qid}: 选择题缺少选项")
    return problems


def build_bank(source: Path, questions: list[dict]) -> dict:
    return {
        "metadata": {
            "课程": "微机原理",
            "来源": f"materials/{source.name}",
            "source_type": "past_exam",
            "生成时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "说明": "本题库由往年真题.md 解析生成，未修改 materials 原始资料；缺少解析的题目标注为原始真题中未提供解析。",
            "总题数": len(questions),
        },
        "chapters": group_by_chapter(questions),
    }


def main() -> None:
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"未找到源文件：{SOURCE_PATH}")

    text = SOURCE_PATH.read_text(encoding="utf-8")
    questions = parse_markdown(text)
    if not questions:
        raise RuntimeError("没有解析到任何 ### 题目。")

    problems = validate(questions)
    if problems:
        print("解析后发现以下问题：")
        for problem in problems[:80]:
            print(f"- {problem}")
        if len(problems) > 80:
            print(f"... 还有 {len(problems) - 80} 个问题")
        raise RuntimeError("往年真题 JSON 校验失败。")

    bank = build_bank(SOURCE_PATH, questions)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")

    # Re-read to ensure the generated JSON is valid.
    parsed = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    total = sum(len(chapter.get("题目", [])) for chapter in parsed.get("chapters", []))

    type_counts: OrderedDict[str, int] = OrderedDict()
    for question in questions:
        qtype = question["题型"]
        type_counts[qtype] = type_counts.get(qtype, 0) + 1

    print(f"来源文件：{SOURCE_PATH}")
    print(f"已生成：{OUTPUT_PATH}")
    print(f"总题数：{total}")
    print("按题型统计：")
    for qtype, count in type_counts.items():
        print(f"- {qtype}: {count}")


if __name__ == "__main__":
    main()
