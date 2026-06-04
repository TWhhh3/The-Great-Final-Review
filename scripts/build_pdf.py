from pathlib import Path
import html
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE_MD = ROOT / "output" / "review_outline.md"
OUTPUT_PDF = ROOT / "output" / "微机原理核心复习提纲.pdf"


def find_chinese_font() -> tuple[str, Path]:
    font_dir = Path("C:/Windows/Fonts")
    candidates = [
        "msyh.ttc",      # Microsoft YaHei
        "simhei.ttf",    # SimHei
        "simsun.ttc",    # SimSun
        "msyh.ttf",
        "Deng.ttf",
    ]
    for name in candidates:
        path = font_dir / name
        if path.exists():
            return "ChineseFont", path
    raise FileNotFoundError(
        "Cannot find a Chinese font in C:/Windows/Fonts. "
        "Please install or provide a Chinese font such as Microsoft YaHei, SimHei, or SimSun."
    )


def sanitize_text(text: str) -> str:
    replacements = {
        "\u2011": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2212": "-",
        "\uf0d8": "",
        "\u200c": "",
        "\u200b": "",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def split_sections(text: str, pattern: str) -> dict[int, str]:
    matches = list(re.finditer(pattern, text, flags=re.MULTILINE))
    sections: dict[int, str] = {}
    for index, match in enumerate(matches):
        number = int(match.group(1))
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        sections[number] = text[start:end].strip()
    return sections


def extract_between(text: str, start_pattern: str, end_pattern: str | None = None) -> str:
    start = re.search(start_pattern, text, flags=re.MULTILINE)
    if not start:
        return ""
    end_pos = len(text)
    if end_pattern:
        end = re.search(end_pattern, text[start.end():], flags=re.MULTILINE)
        if end:
            end_pos = start.end() + end.start()
    return text[start.start():end_pos].strip()


def merge_outline(raw: str) -> str:
    raw = sanitize_text(raw)
    if "# 期末强化版补充" in raw:
        main, supplement = raw.split("# 期末强化版补充", 1)
    else:
        main, supplement = raw, ""

    title = "# 微机原理核心复习提纲\n\n"
    intro = ""
    intro_match = re.search(r"^> 依据：.*?(?=\n## )", main, flags=re.MULTILINE | re.DOTALL)
    if intro_match:
        intro = intro_match.group(0).strip() + "\n\n"

    exam = extract_between(main, r"^## 考试题型总览", r"^## 第1章")
    review_actions = extract_between(supplement, r"^## 总表：题型与复习动作", r"^## 第1章强化")
    main_chapters = split_sections(main, r"^## 第(\d+)章")
    supplement_chapters = split_sections(supplement, r"^## 第(\d+)章强化")
    cross = extract_between(main, r"^## 跨章节高频考点清单")
    final_tables = extract_between(supplement, r"^## 考前最后一页：高频辨析总表")

    parts = [title, intro, exam, review_actions]
    for number in range(1, 10):
        chapter = main_chapters.get(number, "")
        strengthened = supplement_chapters.get(number, "")
        if strengthened:
            strengthened = re.sub(r"^## 第\d+章强化：.*", "### 期末强化复习", strengthened, count=1)
        parts.append("\n\n".join(part for part in [chapter, strengthened] if part))

    if cross:
        parts.append(cross)
    if final_tables:
        parts.append(final_tables)

    return "\n\n---\n\n".join(part.strip() for part in parts if part.strip())


def inline_markup(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r'<font name="ChineseFont">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    return text


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(inline_markup(text), style)


def parse_table(lines: list[str], font_name: str) -> Table:
    rows: list[list[str]] = []
    for line in lines:
        row = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", cell) for cell in row):
            continue
        rows.append(row)

    max_cols = max(len(row) for row in rows)
    normalized = [row + [""] * (max_cols - len(row)) for row in rows]
    data = [[Paragraph(inline_markup(cell), TABLE_CELL) for cell in row] for row in normalized]

    available_width = A4[0] - 3.2 * cm
    widths = [available_width / max_cols] * max_cols
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -1), font_name),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EAF1F8")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#12324A")),
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#AEB8C2")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def parse_markdown(md: str) -> list:
    story = []
    lines = md.splitlines()
    index = 0
    in_code = False
    code_lines: list[str] = []

    while index < len(lines):
        raw_line = lines[index]
        line = raw_line.rstrip()

        if line.startswith("```"):
            if not in_code:
                in_code = True
                code_lines = []
            else:
                in_code = False
                code = "\n".join(code_lines).rstrip()
                if code:
                    story.append(Preformatted(code, CODE))
                    story.append(Spacer(1, 0.18 * cm))
            index += 1
            continue

        if in_code:
            code_lines.append(raw_line)
            index += 1
            continue

        if not line.strip():
            index += 1
            continue

        if line.strip() == "---":
            story.append(Spacer(1, 0.15 * cm))
            index += 1
            continue

        if line.startswith("|") and index + 1 < len(lines) and lines[index + 1].startswith("|"):
            table_lines = [line]
            index += 1
            while index < len(lines) and lines[index].startswith("|"):
                table_lines.append(lines[index].rstrip())
                index += 1
            story.append(parse_table(table_lines, FONT_NAME))
            story.append(Spacer(1, 0.25 * cm))
            continue

        heading_match = re.match(r"^(#{1,4})\s+(.*)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            if level == 1:
                story.append(Paragraph(inline_markup(text), H1))
            elif level == 2:
                if story:
                    story.append(PageBreak())
                story.append(Paragraph(inline_markup(text), H2))
            elif level == 3:
                story.append(Paragraph(inline_markup(text), H3))
            else:
                story.append(Paragraph(inline_markup(text), H4))
            story.append(Spacer(1, 0.1 * cm))
            index += 1
            continue

        if line.startswith(">"):
            quote = line.lstrip("> ").strip()
            story.append(Paragraph(inline_markup(quote), NOTE))
            index += 1
            continue

        list_match = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", line)
        if list_match:
            items = []
            ordered = list_match.group(2).endswith(".")
            while index < len(lines):
                current = lines[index].rstrip()
                current_match = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", current)
                if not current_match:
                    break
                item_text = current_match.group(3)
                items.append(ListItem(paragraph(item_text, BODY), leftIndent=12))
                index += 1
            bullet_type = "1" if ordered else "bullet"
            story.append(ListFlowable(items, bulletType=bullet_type, leftIndent=18))
            story.append(Spacer(1, 0.08 * cm))
            continue

        story.append(paragraph(line, BODY))
        story.append(Spacer(1, 0.08 * cm))
        index += 1

    return story


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT_NAME, 9)
    canvas.setFillColor(colors.HexColor("#667085"))
    canvas.drawString(1.6 * cm, 1.0 * cm, "微机原理核心复习提纲")
    canvas.drawRightString(A4[0] - 1.6 * cm, 1.0 * cm, f"第 {doc.page} 页")
    canvas.restoreState()


def build_pdf() -> None:
    if not SOURCE_MD.exists():
        raise FileNotFoundError(f"Missing source markdown: {SOURCE_MD}")

    raw = SOURCE_MD.read_text(encoding="utf-8")
    merged = merge_outline(raw)
    story = parse_markdown(merged)

    frame = Frame(1.6 * cm, 1.5 * cm, A4[0] - 3.2 * cm, A4[1] - 3.1 * cm, id="normal")
    doc = BaseDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=1.6 * cm,
        rightMargin=1.6 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title="微机原理核心复习提纲",
        author="Codex",
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=add_page_number)])
    doc.build(story)
    print(f"PDF generated: {OUTPUT_PDF.relative_to(ROOT)}")


FONT_NAME, FONT_PATH = find_chinese_font()
pdfmetrics.registerFont(TTFont(FONT_NAME, str(FONT_PATH)))

styles = getSampleStyleSheet()
H1 = ParagraphStyle(
    "H1",
    parent=styles["Title"],
    fontName=FONT_NAME,
    fontSize=22,
    leading=30,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#12324A"),
    spaceAfter=0.35 * cm,
    wordWrap="CJK",
)
H2 = ParagraphStyle(
    "H2",
    parent=styles["Heading1"],
    fontName=FONT_NAME,
    fontSize=16,
    leading=22,
    textColor=colors.HexColor("#12324A"),
    backColor=colors.HexColor("#EAF1F8"),
    borderPadding=(6, 6, 6),
    spaceBefore=0.1 * cm,
    spaceAfter=0.22 * cm,
    wordWrap="CJK",
)
H3 = ParagraphStyle(
    "H3",
    parent=styles["Heading2"],
    fontName=FONT_NAME,
    fontSize=13,
    leading=18,
    textColor=colors.HexColor("#1F4E79"),
    spaceBefore=0.18 * cm,
    spaceAfter=0.12 * cm,
    wordWrap="CJK",
)
H4 = ParagraphStyle(
    "H4",
    parent=styles["Heading3"],
    fontName=FONT_NAME,
    fontSize=11.5,
    leading=16,
    textColor=colors.HexColor("#344054"),
    spaceBefore=0.12 * cm,
    spaceAfter=0.08 * cm,
    wordWrap="CJK",
)
BODY = ParagraphStyle(
    "BODY",
    parent=styles["BodyText"],
    fontName=FONT_NAME,
    fontSize=9.8,
    leading=15,
    alignment=TA_LEFT,
    textColor=colors.HexColor("#111827"),
    wordWrap="CJK",
)
NOTE = ParagraphStyle(
    "NOTE",
    parent=BODY,
    fontSize=9.5,
    leading=14,
    leftIndent=8,
    rightIndent=8,
    borderColor=colors.HexColor("#D0D5DD"),
    borderWidth=0.6,
    borderPadding=6,
    backColor=colors.HexColor("#F8FAFC"),
)
TABLE_CELL = ParagraphStyle(
    "TABLE_CELL",
    parent=BODY,
    fontName=FONT_NAME,
    fontSize=8.3,
    leading=11,
    wordWrap="CJK",
)
CODE = ParagraphStyle(
    "CODE",
    parent=styles["Code"],
    fontName=FONT_NAME,
    fontSize=7.8,
    leading=10.5,
    leftIndent=8,
    rightIndent=4,
    borderColor=colors.HexColor("#D0D5DD"),
    borderWidth=0.5,
    borderPadding=5,
    backColor=colors.HexColor("#F5F7FA"),
)


if __name__ == "__main__":
    print(f"Using Chinese font: {FONT_PATH}")
    build_pdf()
