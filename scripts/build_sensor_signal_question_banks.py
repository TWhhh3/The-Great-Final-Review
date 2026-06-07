from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from collections import OrderedDict
from datetime import datetime
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "materials" / "sensor_signal"
APP_DATA_DIR = ROOT / "app" / "data"
APP_MEDIA_DIR = APP_DATA_DIR / "media" / "sensor_signal"
TMP_DIR = ROOT / "tmp"

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

IMAGE_RE = re.compile(
    r"!\[[^\]]*\]\(([^)]+)\)|<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>",
    re.IGNORECASE | re.DOTALL,
)


def clean_value(value: str) -> str:
    lines = [line.rstrip() for line in value.strip().splitlines()]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines).strip()


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
                    options.append(value)
                continue
            current_name = name
            current_lines = [value]
            continue

        if in_options and option_match:
            options.append(f"{option_match.group(1)}. {option_match.group(2).strip()}")
            continue

        if current_name:
            current_lines.append(line)

    flush_current()

    qid = fields.get("编号", default_id).strip() or default_id
    explanation = fields.get("解析", "").strip()
    scoring = fields.get("评分要点", "").strip()
    if scoring:
        explanation = "\n\n".join(part for part in [explanation, f"评分要点：{scoring}"] if part)

    question = {
        "编号": qid,
        "章节": fields.get("章节", "资料未明确说明").strip() or "资料未明确说明",
        "题型": fields.get("题型", "资料未明确说明").strip() or "资料未明确说明",
        "难度": fields.get("难度", "未标注").strip() or "未标注",
        "题干": fields.get("题干", "资料未明确说明").strip() or "资料未明确说明",
        "选项": options,
        "答案": fields.get("答案", "资料未明确说明").strip() or "资料未明确说明",
        "解析": explanation or "资料未明确说明",
        "知识点来源": fields.get("知识点来源", f"materials/sensor_signal/{source_name}").strip()
        or f"materials/sensor_signal/{source_name}",
    }

    if source_type == "past_exam":
        question.update(
            {
                "题目来源": fields.get("题目来源", fields.get("来源", "")).strip(),
                "year": fields.get("年份", "").strip(),
                "source_type": "past_exam",
                "source": fields.get("题目来源", fields.get("来源", f"materials/sensor_signal/{source_name}")).strip()
                or f"materials/sensor_signal/{source_name}",
            }
        )

    return question


def parse_markdown(source: Path, source_type: str) -> list[dict]:
    text = source.read_text(encoding="utf-8")
    parts = re.split(r"^#{3,4}\s+([A-Z]{2}-\d+)\s*$", text, flags=re.MULTILINE)
    questions: list[dict] = []
    for index in range(1, len(parts), 2):
        qid = parts[index].strip()
        body = parts[index + 1]
        questions.append(parse_block(qid, body, source.name, source_type))
    return questions


def group_by_chapter(questions: list[dict], source_name: str) -> list[dict]:
    groups: OrderedDict[str, list[dict]] = OrderedDict()
    for question in questions:
        groups.setdefault(question["章节"], []).append(question)
    return [{"章节": chapter, "说明": f"来自 materials/sensor_signal/{source_name}", "题目": items} for chapter, items in groups.items()]


def build_bank(source: Path, questions: list[dict], source_type: str) -> dict:
    return {
        "metadata": {
            "课程": "传感与信号处理",
            "来源": f"materials/sensor_signal/{source.name}",
            "source_type": source_type,
            "生成时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "说明": "本题库由 materials/sensor_signal 中的 Markdown 解析生成，未修改 materials 原始资料。",
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
                refs.add((match.group(1) or match.group(2)).strip())
    return refs


def clean_ref(ref: str) -> str:
    return ref.split("#", 1)[0].split("?", 1)[0].replace("\\", "/")


def media_target_from_ref(clean: str) -> Path:
    relative = PurePosixPath(clean).relative_to("media")
    safe_parts = [part for part in relative.parts if part not in {"", ".", ".."}]
    if not safe_parts:
        raise ValueError(f"无效图片路径：{clean}")
    if safe_parts[-1].lower().endswith(".wmf"):
        safe_parts[-1] = re.sub(r"\.wmf$", ".png", safe_parts[-1], flags=re.IGNORECASE)
    return APP_MEDIA_DIR.joinpath(*safe_parts)


def cp437_mojibake(value: str) -> str:
    try:
        return value.encode("utf-8").decode("cp437")
    except UnicodeDecodeError:
        return value


def source_candidates(clean: str) -> list[Path]:
    parts = [part for part in PurePosixPath(clean).parts if part not in {"", ".", ".."}]
    candidates = [SOURCE_DIR.joinpath(*parts)]
    mojibake_parts = [cp437_mojibake(part) for part in parts]
    mojibake_path = SOURCE_DIR.joinpath(*mojibake_parts)
    if mojibake_path != candidates[0]:
        candidates.append(mojibake_path)
    return candidates


def first_existing(paths: list[Path]) -> Path | None:
    for path in paths:
        if path.exists():
            return path
    return None


def copy_and_convert_media(refs: set[str]) -> tuple[int, int, int]:
    APP_MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    conversions: list[dict[str, str]] = []
    copied = 0
    missing = 0

    for ref in sorted(refs):
        clean = clean_ref(ref)
        if not clean.startswith("media/"):
            continue
        source = first_existing(source_candidates(clean))
        target = media_target_from_ref(clean)
        target.parent.mkdir(parents=True, exist_ok=True)

        if source and source.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".webp"}:
            shutil.copyfile(source, target)
            copied += 1
            continue

        wmf_source = first_existing([candidate.with_suffix(".wmf") for candidate in source_candidates(clean)])
        if clean.lower().endswith(".png") and wmf_source:
            conversions.append({"source": str(wmf_source), "target": str(target)})
            continue

        missing += 1

    converted = convert_wmf_files(conversions)
    return copied, converted, missing


def convert_wmf_files(items: list[dict[str, str]]) -> int:
    if not items:
        return 0

    TMP_DIR.mkdir(parents=True, exist_ok=True)
    list_path = TMP_DIR / "sensor_signal_wmf_conversions.json"
    script_path = TMP_DIR / "convert_sensor_signal_wmf.ps1"
    list_path.write_text(json.dumps(items, ensure_ascii=False), encoding="utf-8")
    script_path.write_text(
        r"""
param([string]$ListPath)
Add-Type -AssemblyName System.Drawing
$items = Get-Content -LiteralPath $ListPath -Encoding UTF8 | ConvertFrom-Json
$count = 0
foreach ($item in $items) {
  try {
    $targetDir = Split-Path -Parent $item.target
    if (-not (Test-Path -LiteralPath $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir | Out-Null
    }
    $image = [System.Drawing.Image]::FromFile($item.source)
    $image.Save($item.target, [System.Drawing.Imaging.ImageFormat]::Png)
    $image.Dispose()
    $count += 1
  } catch {
    Write-Error "WMF convert failed: $($item.source) -> $($item.target): $($_.Exception.Message)"
  }
}
Write-Output $count
""".strip(),
        encoding="utf-8",
    )

    result = subprocess.run(
        [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(script_path),
            "-ListPath",
            str(list_path),
        ],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
    )
    if result.returncode != 0:
        print(result.stderr)
        raise RuntimeError("WMF 图片转换失败。")
    numbers = re.findall(r"\d+", result.stdout)
    return int(numbers[-1]) if numbers else 0


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
        mock_count, mock_refs = write_bank("传感模拟题.md", "sensor_signal.json", "mock")
        media_refs.update(mock_refs)
        print(f"传感模拟题：{mock_count} 题 -> app/data/sensor_signal.json")

    past_count, past_refs = write_bank("传感往年真题.md", "past_exams_sensor_signal.json", "past_exam")
    media_refs.update(past_refs)
    copied, converted, missing = copy_and_convert_media(media_refs)

    print(f"传感往年真题：{past_count} 题 -> app/data/past_exams_sensor_signal.json")
    print(f"图片资产：复制 {copied} 个，WMF 转 PNG {converted} 个，缺失 {missing} 个 -> app/data/media/sensor_signal")


if __name__ == "__main__":
    main()
