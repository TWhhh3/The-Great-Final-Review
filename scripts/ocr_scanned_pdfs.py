from pathlib import Path
import subprocess
import re


ROOT = Path(__file__).resolve().parents[1]
PDFS = [
    ROOT / "materials" / "微机原理往年试卷" / "单片机期末考试试题(含答案).pdf",
    ROOT / "materials" / "微机原理往年试卷" / "单片机期末考试试题带答案.pdf",
]
OCR_SCRIPT = ROOT / "scripts" / "windows_ocr_image.ps1"
OCR_PAGES_DIR = ROOT / "extracted" / "ocr_pages"


def run(command: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(
        command,
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        check=True,
    )


def output_path_for(pdf_path: Path) -> Path:
    relative = pdf_path.relative_to(ROOT / "materials")
    return (ROOT / "extracted" / relative).with_suffix(".txt")


def render_pdf(pdf_path: Path, page_dir: Path) -> list[Path]:
    if page_dir.exists():
        for old_file in page_dir.glob("*"):
            old_file.unlink()
    else:
        page_dir.mkdir(parents=True, exist_ok=True)

    prefix = page_dir / "page"
    run(["pdftoppm", "-png", "-r", "250", str(pdf_path), str(prefix)])
    return sorted(page_dir.glob("*.png"))


def ocr_image(image_path: Path) -> str:
    result = run([
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        (
            "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; "
            f"& '{OCR_SCRIPT}' -ImagePath '{image_path}'"
        ),
    ])
    return result.stdout.strip()


def clean_ocr_text(text: str) -> str:
    text = re.sub(r"(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])", "", text)
    text = re.sub(r"\s+([，。；：？！、）])", r"\1", text)
    text = re.sub(r"([（])\s+", r"\1", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def ocr_pdf(pdf_path: Path) -> None:
    page_dir = OCR_PAGES_DIR / pdf_path.stem
    images = render_pdf(pdf_path, page_dir)
    out_path = output_path_for(pdf_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    relative_source = pdf_path.relative_to(ROOT).as_posix()
    parts = [
        f"来源文件：{relative_source}",
        "文件类型：.pdf",
        "说明：本文件为扫描版或文字提取质量较差的 PDF，以下内容由 Windows OCR 重新识别。OCR 可能存在错字，请人工核对关键答案。",
        "",
    ]

    for page_number, image_path in enumerate(images, start=1):
        print(f"OCR 第 {page_number} 页：{relative_source}")
        text = clean_ocr_text(ocr_image(image_path))
        parts.append(f"=== OCR 第 {page_number} 页 ===")
        parts.append(text if text else "资料未明确说明：OCR 未识别到文字。")
        parts.append("")

    out_path.write_text("\n".join(parts), encoding="utf-8")
    print(f"已写入：{out_path.relative_to(ROOT).as_posix()}")


def main() -> None:
    OCR_PAGES_DIR.mkdir(parents=True, exist_ok=True)
    for pdf_path in PDFS:
        if not pdf_path.exists():
            print(f"[跳过] 找不到文件：{pdf_path}")
            continue
        ocr_pdf(pdf_path)


if __name__ == "__main__":
    main()
