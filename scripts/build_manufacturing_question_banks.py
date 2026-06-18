from __future__ import annotations

import json
import re
import shutil
import sys
from collections import OrderedDict
from datetime import datetime
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "materials" / "manufacturing"
APP_DATA_DIR = ROOT / "app" / "data"
APP_MEDIA_DIR = APP_DATA_DIR / "media" / "manufacturing"

MOCK_SOURCE = "制造模拟题库.md"
PAST_SOURCE = "制造往年真题.md"
MOCK_OUTPUT = "manufacturing.json"
PAST_OUTPUT = "past_exams_manufacturing.json"

FIELDS = {
    "编号",
    "章节",
    "题型",
    "难度",
    "题干",
    "选项",
    "答案",
    "解析",
    "知识点来源",
    "评分要点",
    "题目来源",
    "年份",
    "来源",
}

ASSET_DIRS = [
    "机械制造技术基础_300题期末考试题库_assets",
    "机械制造技术基础_往年试卷数字化题库_assets",
]

IMAGE_RE = re.compile(
    r"!\[([^\]]*)\]\(([^)]+)\)|<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>",
    re.IGNORECASE | re.DOTALL,
)


def clean_value(value: str) -> str:
    lines = [line.rstrip() for line in value.strip().splitlines()]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines).strip()


def clean_option(value: str) -> str:
    return re.sub(r"^\s*-\s*(?=[A-Z][\.\．、])", "", value.strip())


def clean_ref(ref: str) -> str:
    return ref.strip().replace("\\", "/").split("#", 1)[0].split("?", 1)[0]


def safe_posix_parts(ref: str) -> list[str]:
    return [part for part in PurePosixPath(ref).parts if part not in {"", ".", ".."}]


def rewrite_image_ref(ref: str) -> str:
    clean = clean_ref(ref)
    parts = safe_posix_parts(clean)
    if not parts:
        return clean
    if parts[0] == "media":
        return "/".join(parts)
    if parts[0] in ASSET_DIRS:
        return "/".join(["media", "manufacturing", *parts])
    return clean


def rewrite_images(value: str) -> str:
    def replace(match: re.Match[str]) -> str:
        alt = match.group(1)
        md_src = match.group(2)
        html_src = match.group(3)
        if md_src is not None:
            return f"![{alt}]({rewrite_image_ref(md_src)})"
        original = match.group(0)
        new_src = rewrite_image_ref(html_src or "")
        return re.sub(r"src=[\"'][^\"']+[\"']", f'src="{new_src}"', original, count=1, flags=re.IGNORECASE)

    return IMAGE_RE.sub(replace, value)


def infer_year(fields: dict[str, str], qid: str) -> str:
    explicit = fields.get("年份", "").strip()
    if explicit:
        return explicit
    for value in [qid, fields.get("来源", ""), fields.get("题目来源", "")]:
        match = re.search(r"(20\d{2})", value)
        if match:
            return match.group(1)
    return ""


def parse_block(default_id: str, body: str, source_name: str, source_type: str) -> dict:
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

    field_pattern = re.compile(rf"^- ({'|'.join(sorted(FIELDS))})：(.*)$")
    option_pattern = re.compile(r"^\s*-\s*([A-Z])[\.\．、]\s*(.*)$")

    for raw_line in body.splitlines():
        line = raw_line.rstrip()
        field_match = field_pattern.match(line)
        option_match = option_pattern.match(line)

        if field_match:
            flush_current()
            name, value = field_match.group(1), field_match.group(2).strip()
            in_options = name == "选项"
            if in_options:
                if value and value not in {"无", "见题干"}:
                    options.append(clean_option(value))
                continue
            current_name = name
            current_lines = [value]
            continue

        if in_options and option_match:
            options.append(clean_option(f"{option_match.group(1)}. {option_match.group(2).strip()}"))
            continue

        if current_name:
            current_lines.append(line)

    flush_current()

    qid = fields.get("编号", default_id).strip() or default_id
    explanation = fields.get("解析", "").strip()
    scoring = fields.get("评分要点", "").strip()
    if scoring:
        explanation = "\n\n".join(part for part in [explanation, f"评分要点：{scoring}"] if part)

    source_path = f"materials/manufacturing/{source_name}"
    question = {
        "编号": qid,
        "章节": fields.get("章节", "资料未明确说明").strip() or "资料未明确说明",
        "题型": fields.get("题型", "资料未明确说明").strip() or "资料未明确说明",
        "难度": fields.get("难度", "未标注").strip() or "未标注",
        "题干": rewrite_images(fields.get("题干", "资料未明确说明").strip() or "资料未明确说明"),
        "选项": [rewrite_images(option) for option in options],
        "答案": rewrite_images(fields.get("答案", "资料未明确说明").strip() or "资料未明确说明"),
        "解析": rewrite_images(explanation or "资料未明确说明"),
        "知识点来源": fields.get("知识点来源", source_path).strip() or source_path,
    }

    if source_type == "past_exam":
        source_text = fields.get("题目来源", fields.get("来源", source_path)).strip() or source_path
        question.update(
            {
                "题目来源": source_text,
                "year": infer_year(fields, qid),
                "source_type": "past_exam",
                "source": source_text,
            }
        )

    return question


def parse_markdown(source: Path, source_type: str) -> list[dict]:
    text = source.read_text(encoding="utf-8")
    parts = re.split(r"^#{3,4}\s+(.+?)\s*$", text, flags=re.MULTILINE)
    questions: list[dict] = []
    for index in range(1, len(parts), 2):
        qid = parts[index].strip()
        body = parts[index + 1]
        if "- 题干：" not in body and "- 编号：" not in body:
            continue
        questions.append(parse_block(qid, body, source.name, source_type))
    return questions


def group_by_chapter(questions: list[dict], source_name: str) -> list[dict]:
    groups: OrderedDict[str, list[dict]] = OrderedDict()
    for question in questions:
        groups.setdefault(question["章节"], []).append(question)
    return [{"章节": chapter, "说明": f"来自 materials/manufacturing/{source_name}", "题目": items} for chapter, items in groups.items()]


def build_bank(source: Path, questions: list[dict], source_type: str) -> dict:
    return {
        "metadata": {
            "课程": "机械制造技术基础",
            "来源": f"materials/manufacturing/{source.name}",
            "source_type": source_type,
            "生成时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "说明": "本题库由 materials/manufacturing 中的 Markdown 解析生成，未修改 materials 原始资料。",
            "总题数": len(questions),
        },
        "chapters": group_by_chapter(questions, source.name),
    }


def validate(questions: list[dict]) -> None:
    problems: list[str] = []
    seen_ids: set[str] = set()
    for question in questions:
        qid = question["编号"]
        if qid in seen_ids:
            problems.append(f"{qid}: 编号重复")
        seen_ids.add(qid)
        for name in ["编号", "章节", "题型", "题干", "答案", "解析"]:
            if not str(question.get(name, "")).strip():
                problems.append(f"{qid}: 缺少 {name}")
    if problems:
        raise RuntimeError("题库校验失败：\n" + "\n".join(problems[:80]))


def image_refs_from_questions(questions: list[dict]) -> set[str]:
    refs: set[str] = set()
    for question in questions:
        values = [
            question.get("题干", ""),
            question.get("答案", ""),
            question.get("解析", ""),
            question.get("知识点来源", ""),
            *question.get("选项", []),
        ]
        for value in values:
            for match in IMAGE_RE.finditer(str(value)):
                refs.add(clean_ref(match.group(2) or match.group(3) or ""))
    return refs


def copy_media_dirs() -> tuple[int, int]:
    APP_MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    copied = 0
    missing_dirs = 0
    for dirname in ASSET_DIRS:
        source = SOURCE_DIR / dirname
        target = APP_MEDIA_DIR / dirname
        if not source.exists():
            missing_dirs += 1
            continue
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)
        copied += sum(1 for path in target.rglob("*") if path.is_file())
    return copied, missing_dirs


def validate_image_refs(refs: set[str]) -> int:
    missing = 0
    for ref in sorted(refs):
        parts = safe_posix_parts(ref)
        if not parts or parts[0] != "media":
            continue
        target = APP_DATA_DIR.joinpath(*parts)
        if not target.exists():
            print(f"图片缺失：{ref}")
            missing += 1
    return missing


def write_bank(source_name: str, output_name: str, source_type: str) -> tuple[int, set[str]]:
    source = SOURCE_DIR / source_name
    if not source.exists():
        raise FileNotFoundError(f"未找到源文件：{source}")
    questions = parse_markdown(source, source_type)
    if not questions:
        raise RuntimeError(f"{source.name} 未解析到题目。")
    validate(questions)
    bank = build_bank(source, questions, source_type)
    output = APP_DATA_DIR / output_name
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    json.loads(output.read_text(encoding="utf-8"))
    return len(questions), image_refs_from_questions(questions)


def main() -> None:
    past_only = "--past-only" in sys.argv
    media_refs: set[str] = set()

    if not past_only:
        mock_count, mock_refs = write_bank(MOCK_SOURCE, MOCK_OUTPUT, "mock")
        media_refs.update(mock_refs)
        print(f"机械制造模拟题：{mock_count} 题 -> app/data/{MOCK_OUTPUT}")

    past_count, past_refs = write_bank(PAST_SOURCE, PAST_OUTPUT, "past_exam")
    media_refs.update(past_refs)
    copied, missing_dirs = copy_media_dirs()
    missing_images = validate_image_refs(media_refs)

    print(f"机械制造往年真题：{past_count} 题 -> app/data/{PAST_OUTPUT}")
    print(f"图片资产：复制 {copied} 个，缺失目录 {missing_dirs} 个，缺失引用 {missing_images} 个 -> app/data/media/manufacturing")
    if missing_dirs or missing_images:
        raise RuntimeError("机械制造图片资产校验失败。")


if __name__ == "__main__":
    main()
