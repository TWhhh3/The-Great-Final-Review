from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTLINE = ROOT / "output" / "review_outline.md"
OUTPUT = ROOT / "output" / "question_bank.json"

LETTERS = ["A", "B", "C", "D"]
REQUIRED_FIELDS = ["编号", "章节", "题型", "难度", "题干", "选项", "答案", "解析", "知识点来源"]

CHAPTERS = [
    {
        "num": 1,
        "name": "第1章 单片机应用基础概述",
        "source": "output/review_outline.md 第1章；extracted/上课PPT/第1章 单片机应用基础概述-修改.txt；extracted/教材",
        "topic": "单片机基础、计算机结构、总线和程序设计过程",
    },
    {
        "num": 2,
        "name": "第2章 MCS-51 单片机硬件结构",
        "source": "output/review_outline.md 第2章；extracted/上课PPT/第2章  MCS-51的结构-修改.txt；extracted/教材",
        "topic": "8051硬件资源、存储器、SFR、I/O口和引脚功能",
    },
    {
        "num": 3,
        "name": "第3章 MCS-51 指令系统与汇编程序设计",
        "source": "output/review_outline.md 第3章；extracted/上课PPT/第3章 MCS-51指令系统及编程举例.txt；extracted/往年试卷",
        "topic": "寻址方式、MOV/MOVC/MOVX、循环、分支和汇编程序阅读",
    },
    {
        "num": 4,
        "name": "第4章 C51 程序设计及应用",
        "source": "output/review_outline.md 第4章；extracted/上课PPT/第4章C51程序设计及应用.txt；extracted/教材",
        "topic": "C51数据类型、存储类型、sbit/sfr、函数和端口程序",
    },
    {
        "num": 5,
        "name": "第5章 51 单片机中断系统",
        "source": "output/review_outline.md 第5章；extracted/上课PPT/第5章 中断系统.txt；extracted/往年试卷",
        "topic": "中断源、中断允许、优先级、入口地址和中断服务程序",
    },
    {
        "num": 6,
        "name": "第6章 定时器/计数器",
        "source": "output/review_outline.md 第6章；extracted/上课PPT/第6章 定时器，计数器.txt；extracted/往年试卷",
        "topic": "T0/T1、TMOD、TCON、工作方式、初值计算和定时中断",
    },
    {
        "num": 7,
        "name": "第7章 单片机串行口及应用",
        "source": "output/review_outline.md 第7章；extracted/上课PPT/第7章单片机串行口及应用.txt；extracted/往年试卷",
        "topic": "串行通信、SCON、SBUF、TI/RI和串口方式",
    },
    {
        "num": 8,
        "name": "第8章 单片机系统接口",
        "source": "output/review_outline.md 第8章；extracted/上课PPT/第8章 单片机系统的接口.txt；extracted/教材",
        "topic": "I/O口、键盘、LED显示、消抖和接口程序",
    },
    {
        "num": 9,
        "name": "第9章 单片机系统扩展",
        "source": "output/review_outline.md 第9章；extracted/上课PPT/第9章 单片机的系统扩展.txt；extracted/往年试卷",
        "topic": "外部存储器、P0/P2总线、ALE、PSEN、RD/WR和地址译码",
    },
]

WRONGS = {
    1: [
        "单片机内部不包含存储器、I/O接口、定时器或中断资源。",
        "哈佛结构把程序和数据放在同一存储空间并完全共用同一组总线。",
        "冯·诺依曼结构要求程序存储器和数据存储器必须完全分开寻址。",
        "汇编语言属于高级语言，和机器指令没有对应关系。",
        "总线只包括数据总线，不包括地址总线和控制总线。",
        "RAM主要用于永久保存程序，断电后内容仍然保持不变。",
        "程序设计只需要写出代码，不需要调试和整理资料。",
        "单片机没有逻辑判断、定时计数或中断处理能力。",
    ],
    2: [
        "8051只有1个8位I/O口，不能提供4个8位并行口。",
        "P0口在外部扩展时只输出高8位地址，P2口分时复用低8位地址和数据。",
        "8051复位后SP通常为00H。",
        "PC是普通SFR，程序可以像访问P1口一样直接读写PC。",
        "SFR区和片内低128B RAM是同一块普通RAM，没有功能差异。",
        "RS1 RS0=10时选择第0组工作寄存器。",
        "8051没有串行口，也没有定时器/计数器。",
        "P0口扩展外部总线时不需要低地址锁存。",
    ],
    3: [
        "MOVC用于访问片外数据存储器，MOVX用于访问程序存储器。",
        "立即寻址的操作数前面不需要写#号。",
        "DJNZ指令只减1，不会根据结果控制跳转。",
        "位寻址可以对8051全部内部RAM字节任意按位访问。",
        "DPTR只能访问片内低128B RAM，不能参与查表或外部访问。",
        "相对转移的rel不是偏移量，而是16位绝对地址。",
        "汇编程序阅读题不需要关注寄存器和标志位变化。",
        "MOV、MOVC、MOVX三类指令访问的空间完全相同。",
    ],
    4: [
        "C51的sbit用于定义普通整型变量，不能对应可位寻址对象。",
        "C51中interrupt关键字和中断函数无关。",
        "C51程序不需要包含头文件就能直接使用所有8051 SFR名称。",
        "P1口读写在C51中不能直接用P1这样的SFR名表示。",
        "C51数组下标访问和查表程序完全无关。",
        "C51程序没有while循环和for循环结构。",
        "中断函数中一定不能访问全局变量。",
        "C51的bit类型等同于16位无符号整型。",
    ],
    5: [
        "EA=0时仍然能响应所有已单独允许的中断。",
        "外部中断0的入口地址不是0003H。",
        "中断服务程序结束时应使用SJMP返回主程序。",
        "IE用于设置中断优先级，IP用于打开或关闭中断。",
        "中断处理不需要保护现场，因为硬件会自动保存所有寄存器。",
        "IT0/IT1与外部中断触发方式无关。",
        "中断优先级固定不可设置。",
        "RI和TI是定时器溢出标志。",
    ],
    6: [
        "定时器/计数器的本质不是加1计数器，而是减1计数器。",
        "定时方式和计数方式的输入脉冲来源完全相同。",
        "TMOD可以位寻址，因此能用SETB直接设置任意一位。",
        "TR0是T0溢出标志，TF0是T0启动控制位。",
        "方式1是8位自动重装，方式2是16位方式。",
        "12MHz晶振下，常规8051的机器周期就是12us。",
        "定时器工作时必须由CPU每个机器周期手动加1。",
        "TCON只控制串口，不参与定时器启动或溢出标志。",
    ],
    7: [
        "SBUF不是数据缓冲寄存器，发送和接收都不经过SBUF。",
        "TI是接收完成标志，RI是发送完成标志。",
        "SCON与串行口工作方式选择无关。",
        "串行通信只存在并行传输，不需要一位一位发送。",
        "方式0是标准10位异步串口方式。",
        "REN=0时仍然允许串行口接收数据。",
        "串口发送程序写SBUF后不需要等待TI。",
        "波特率和定时器设置没有任何关系。",
    ],
    8: [
        "P1口只能输出，不能读取外部按键状态。",
        "按键程序不需要消抖，任何机械按键都不会产生抖动。",
        "LED动态显示不需要位选和段选配合。",
        "接口程序中读端口和写端口没有区别。",
        "矩阵键盘扫描不需要逐行逐列判断。",
        "七段数码管显示码和数字之间没有对应关系。",
        "I/O口接口题不需要考虑上拉、输入输出方向或连接方式。",
        "软件延时和定时器延时在程序思路上完全相同。",
    ],
    9: [
        "扩展外部数据存储器时，P0只作为普通I/O口，不承担地址/数据总线作用。",
        "ALE用于读外部程序存储器数据，不用于锁存低8位地址。",
        "PSEN主要用于访问片外数据存储器。",
        "RD和WR信号主要用于外部程序存储器读写控制。",
        "外部扩展时P2口通常不参与高位地址输出。",
        "MOVX访问程序存储器，MOVC访问片外数据存储器。",
        "系统扩展题不用计算地址范围，也不用画清地址线、数据线和控制线。",
        "74LS373在外扩系统中用于锁存高8位地址，而不是低8位地址。",
    ],
}

EXTRA_FILLS = {
    1: [
        ("单片机", "把CPU、存储器、I/O、定时器、中断等资源集成在一个芯片上的微型计算机"),
        ("冯·诺依曼结构", "程序和数据使用统一存储空间、共用总线的结构"),
        ("哈佛结构", "程序存储器和数据存储器分开的结构"),
        ("总线", "地址总线、数据总线和控制总线的统称"),
        ("RAM", "常用于可读写数据存储"),
        ("ROM", "常用于程序存储"),
        ("汇编语言", "机器语言的符号化表示"),
        ("顺序结构", "结构化程序设计的基本结构之一"),
        ("选择结构", "结构化程序设计的基本结构之一"),
        ("循环结构", "结构化程序设计的基本结构之一"),
    ],
    2: [
        ("PC", "保存下一条要执行指令地址的程序计数器"),
        ("SP", "堆栈指针，8051复位后常考初值为07H"),
        ("PSW", "含CY、AC、OV、P、RS1、RS0等标志位的程序状态字"),
        ("SFR", "控制I/O、中断、定时器、串口等功能的特殊功能寄存器"),
        ("P0", "扩展外部总线时分时复用低8位地址线和数据线"),
        ("P2", "扩展外部总线时常提供高8位地址线"),
        ("RS1 RS0", "选择当前工作寄存器组的PSW位"),
        ("07H", "8051复位后SP的常见考点初值"),
        ("10H-17H", "RS1 RS0=10时选中第2组工作寄存器的地址范围"),
        ("位寻址区", "8051可按位操作的片内RAM区域"),
    ],
    3: [
        ("MOV", "常用于片内RAM、SFR和寄存器之间的数据传送"),
        ("MOVC", "访问程序存储器，常用于查表"),
        ("MOVX", "访问片外数据存储器"),
        ("立即寻址", "操作数本身在指令中并用#标记"),
        ("直接寻址", "指令直接给出片内RAM或SFR地址"),
        ("寄存器间接寻址", "用@R0、@R1或@DPTR指向地址"),
        ("变址寻址", "常见于MOVC A,@A+DPTR查表"),
        ("位寻址", "直接对可位寻址单元或SFR位操作"),
        ("DJNZ", "减1后不为0则转移的循环控制指令"),
        ("rel", "相对转移中的8位带符号偏移量"),
    ],
    4: [
        ("sbit", "定义可位寻址位变量"),
        ("sfr", "定义特殊功能寄存器变量"),
        ("interrupt", "C51中断函数关键字"),
        ("using", "C51中断函数中可指定寄存器组的关键字"),
        ("P1", "C51中可直接读写的并行I/O口SFR名"),
        ("bit", "C51中常用于一位逻辑量的数据类型"),
        ("while", "C51常用循环结构"),
        ("for", "C51常用循环结构"),
        ("数组", "C51查表和批量数据处理常用结构"),
        ("头文件", "通常用来提供reg51相关SFR定义"),
    ],
    5: [
        ("EA", "总中断允许位"),
        ("EX0", "外部中断0允许位"),
        ("ET0", "定时器0中断允许位"),
        ("IT0", "外部中断0触发方式控制位"),
        ("IE", "中断允许寄存器"),
        ("IP", "中断优先级寄存器"),
        ("0003H", "外部中断0入口地址"),
        ("000BH", "定时器0中断入口地址"),
        ("RETI", "中断服务程序返回指令"),
        ("现场保护", "中断服务程序中保存和恢复关键寄存器内容"),
    ],
    6: [
        ("TMOD", "设置T0/T1工作方式和定时/计数选择"),
        ("TCON", "控制启动并保存溢出标志"),
        ("TR0", "定时器0启动控制位"),
        ("TF0", "定时器0溢出标志"),
        ("方式1", "16位定时/计数方式"),
        ("方式2", "8位自动重装方式"),
        ("机器周期", "常规8051中12个振荡周期构成1个机器周期"),
        ("1us", "12MHz晶振下常规8051的一个机器周期"),
        ("初值", "定时器从该值开始加1计数直到溢出"),
        ("加1计数器", "定时器/计数器的本质"),
    ],
    7: [
        ("SCON", "串行口控制寄存器"),
        ("SBUF", "串行数据缓冲寄存器"),
        ("TI", "发送完成标志"),
        ("RI", "接收完成标志"),
        ("REN", "允许串行接收控制位"),
        ("方式0", "串行口移位寄存器方式"),
        ("方式1", "常用8位UART方式"),
        ("方式2", "9位UART方式"),
        ("波特率", "串行通信每秒传送的码元数"),
        ("串行通信", "数据按位顺序传送的通信方式"),
    ],
    8: [
        ("P1口", "常用于按键输入或LED输出的并行I/O口"),
        ("消抖", "按键程序中滤除机械抖动影响的处理"),
        ("段选", "数码管显示中控制显示段码"),
        ("位选", "动态显示中选择当前显示位"),
        ("动态显示", "通过快速轮流点亮多位数码管形成稳定显示"),
        ("矩阵键盘", "通过行列扫描识别按键的键盘结构"),
        ("七段码", "七段数码管显示数字所需的编码"),
        ("软件延时", "用循环消耗时间的延时方式"),
        ("接口", "单片机与外设连接和交换信息的通道"),
        ("I/O口", "输入输出端口"),
    ],
    9: [
        ("P0", "外扩时分时复用低8位地址线和数据线"),
        ("P2", "外扩时常输出高8位地址线"),
        ("ALE", "锁存低8位地址的控制信号"),
        ("PSEN", "访问外部程序存储器的读选通信号"),
        ("RD", "访问外部数据存储器时的读控制信号"),
        ("WR", "访问外部数据存储器时的写控制信号"),
        ("74LS373", "外扩系统中常用于锁存低8位地址"),
        ("MOVX", "访问片外数据存储器的指令"),
        ("MOVC", "访问程序存储器查表的指令"),
        ("地址译码", "根据高位地址线产生片选信号的过程"),
    ],
}


def clean_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^\s*[-*]\s+", "", text)
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = text.replace("\uf0d8", "")
    text = text.replace("\u200b", "")
    text = text.replace("\u200c", "")
    text = text.replace("——", "-")
    text = text.replace("–", "-")
    text = text.replace("—", "-")
    text = re.sub(r"\s+", " ", text)
    return text.strip(" 。")


META_FACT_PREFIXES = (
    "选择",
    "选择/填空",
    "选择/判断",
    "填空",
    "简答",
    "判断",
    "程序设计",
    "读程序",
    "计算",
    "联系后续章节考",
    "模拟试卷明确",
    "模拟试卷选择题",
    "OCR",
    "提示说明",
    "答题要点",
    "要求",
    "常见考法",
)

META_FACT_CONTAINS = (
    "考试常考问法",
    "常见考法",
    "自测小题",
    "往年题",
    "往年卷",
    "模拟试卷",
    "OCR",
    "答题时",
    "资料",
    "题目常",
    "题目中",
    "题型",
    "简答题",
    "程序设计题",
    "要先写清",
    "哪个端口输入",
    "哪个端口输出",
    "判断 if",
    "判断指令写法",
    "复习",
    "来考",
    "常考",
    "考试",
    "考前",
    "课堂",
    "必背",
    "必练",
    "考察",
)


def is_exam_knowledge_fact(fact: str) -> bool:
    """Keep facts that can become exam questions, skip review-strategy text."""
    if not fact or len(fact) < 6:
        return False
    if fact.startswith(META_FACT_PREFIXES):
        return False
    if any(marker in fact for marker in META_FACT_CONTAINS):
        return False
    return True


def sanitize_stem(text: str) -> str:
    text = text.replace("与资料一致", "正确")
    text = text.replace("与资料不一致", "错误")
    text = text.replace("根据资料，", "")
    text = text.replace("根据资料", "")
    text = text.replace("资料强调：", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"[；;。]", text)
    return [part.strip() for part in parts if part.strip()]


def extract_block(lines: list[str], heading: str) -> str:
    start = None
    for index, line in enumerate(lines):
        if line.strip() == heading:
            start = index
            break
    if start is None:
        return ""
    end = len(lines)
    for index in range(start + 1, len(lines)):
        if lines[index].startswith("## "):
            end = index
            break
    return "\n".join(lines[start:end])


def term_from_fact(fact: str) -> str | None:
    text = fact
    if text.startswith("重点："):
        text = text[3:]
    if text.startswith("重点:"):
        text = text[3:]
    for sep in ["：", ":"]:
        if sep in text:
            term = text.split(sep, 1)[0].strip()
            term = term.strip("“”\"'、，,。；;()（）")
            if 1 <= len(term) <= 18 and not term.startswith("资料"):
                return term
    m = re.search(
        r"\b(MOVX|MOVC|MOV|P0|P1|P2|P3|TMOD|TCON|SCON|SBUF|IE|IP|PSW|SP|PC|DPTR|ALE|PSEN|RD|WR|EA|EX0|ET0|TR0|TF0|TI|RI)\b",
        text,
    )
    if m:
        return m.group(1)
    return None


def extract_facts(outline: str) -> dict[int, list[str]]:
    lines = outline.splitlines()
    facts_by_chapter: dict[int, list[str]] = {}
    for chapter in CHAPTERS:
        num = chapter["num"]
        main = extract_block(lines, f"## 第{num}章 {chapter['name'].split(' ', 1)[1] if ' ' in chapter['name'] else chapter['name']}")
        if not main:
            for line in lines:
                if line.startswith(f"## 第{num}章 ") and "强化" not in line:
                    main = extract_block(lines, line)
                    break
        supplement = ""
        for line in lines:
            if line.startswith(f"## 第{num}章强化"):
                supplement = extract_block(lines, line)
                break

        facts: list[str] = []
        for block in [main, supplement]:
            for raw_line in block.splitlines():
                line = raw_line.strip()
                if line.startswith("- "):
                    fact = clean_text(line)
                    if len(fact) >= 8 and not fact.startswith("答案") and is_exam_knowledge_fact(fact):
                        facts.append(fact)
                elif line.startswith("|") and "---" not in line:
                    cells = [clean_text(cell) for cell in line.strip("|").split("|")]
                    if len(cells) >= 2 and cells[0] not in {"项目", "题型", "易错点", "名称"}:
                        fact = f"{cells[0]}：{cells[1]}"
                        if is_exam_knowledge_fact(fact):
                            facts.append(fact)

        for term, desc in EXTRA_FILLS[num]:
            facts.append(f"{term}：{desc}")

        unique: list[str] = []
        seen = set()
        for fact in facts:
            if fact not in seen:
                seen.add(fact)
                unique.append(fact)
        facts_by_chapter[num] = unique
    return facts_by_chapter


def difficulty(index: int) -> str:
    if index < 12:
        return "基础"
    if index < 24:
        return "中等"
    return "综合"


def make_id(chapter_num: int | str, type_code: str, index: int) -> str:
    if isinstance(chapter_num, int):
        prefix = f"CH{chapter_num:02d}"
    else:
        prefix = chapter_num
    return f"{prefix}-{type_code}-{index:03d}"


def rotate_options(correct: str, wrongs: list[str], index: int) -> tuple[list[str], str]:
    chosen = [wrongs[(index * 3 + offset) % len(wrongs)] for offset in range(3)]
    options = chosen[:]
    answer_pos = index % 4
    options.insert(answer_pos, correct)
    return [f"{LETTERS[i]}. {text}" for i, text in enumerate(options)], LETTERS[answer_pos]


def add_question(
    questions: list[dict],
    qid: str,
    chapter: str,
    qtype: str,
    level: str,
    stem: str,
    answer: str,
    explanation: str,
    source: str,
    options: list[str] | None = None,
    scoring: list[str] | None = None,
) -> None:
    item = {
        "编号": qid,
        "章节": chapter,
        "题型": qtype,
        "难度": level,
        "题干": sanitize_stem(stem),
        "选项": options or [],
        "答案": answer.strip(),
        "解析": explanation.strip(),
        "知识点来源": source,
    }
    if scoring:
        item["评分要点"] = scoring
    questions.append(item)


def generate_choice_questions(chapter: dict, facts: list[str], questions: list[dict]) -> None:
    num = chapter["num"]
    source = chapter["source"]
    wrongs = WRONGS[num]
    usable = [fact for fact in facts if len(fact) <= 120 and is_exam_knowledge_fact(fact)]
    correct_templates = [
        "关于“{term}”，下列说法正确的是（ ）。",
        "在本章知识点“{term}”中，表述正确的一项是（ ）。",
        "下列对“{term}”的理解，正确的是（ ）。",
        "有关“{term}”的叙述，正确的是（ ）。",
    ]
    wrong_templates = [
        "关于“{term}”，下列说法错误的是（ ）。",
        "下列有关“{term}”的叙述中，错误的一项是（ ）。",
        "判断下列说法，错误的是（ ）。",
    ]
    for i in range(30):
        fact = usable[i % len(usable)]
        term = term_from_fact(fact) or chapter["topic"]
        if i % 5 == 4:
            correct_items = [usable[(i + offset + 1) % len(usable)] + "。" for offset in range(3)]
            wrong = wrongs[i % len(wrongs)]
            answer_pos = i % 4
            raw_options = correct_items[:]
            raw_options.insert(answer_pos, wrong)
            options = [f"{LETTERS[pos]}. {text}" for pos, text in enumerate(raw_options)]
            answer = LETTERS[answer_pos]
            stem = wrong_templates[i % len(wrong_templates)].format(term=term)
            explanation = f"{answer}项为错误表述；正确结论应为：{fact}。"
        else:
            options, answer = rotate_options(fact + "。", wrongs, i)
            stem = correct_templates[i % len(correct_templates)].format(term=term)
            explanation = f"正确项来自本章提纲：{fact}。其余选项是常见混淆或相反说法。"
        add_question(
            questions,
            make_id(num, "XZ", i + 1),
            chapter["name"],
            "选择题",
            difficulty(i),
            sanitize_stem(stem),
            answer,
            explanation,
            source,
            options=options,
        )


def generate_fill_questions(chapter: dict, facts: list[str], questions: list[dict]) -> None:
    num = chapter["num"]
    source = chapter["source"]
    items: list[tuple[str, str]] = []
    seen = set()
    for fact in facts:
        if not is_exam_knowledge_fact(fact):
            continue
        term = term_from_fact(fact)
        if not term or len(term) > 18:
            continue
        desc = fact.split("：", 1)[1] if "：" in fact else fact
        desc = desc.strip()
        if desc.startswith(("错", "对", "资料")):
            continue
        key = (term, desc)
        if key not in seen:
            seen.add(key)
            items.append(key)
    templates = [
        "{desc}，对应的关键词为______。",
        "本章中，“{desc}”通常称为______。",
        "与“{short}”直接对应的术语为______。",
        "完成填空：______是指{desc}。",
        "描述“{short}”时，应填写的名称是______。",
        "{desc}。该知识点名称为______。",
    ]
    for i in range(30):
        term, desc = items[i % len(items)]
        template = templates[i % len(templates)]
        stem = template.format(desc=desc, short=desc[:60])
        add_question(
            questions,
            make_id(num, "TK", i + 1),
            chapter["name"],
            "填空题",
            difficulty(i),
            sanitize_stem(stem),
            term,
            f"答案应尽量填写关键词“{term}”。依据：{desc}。",
            source,
        )


def generate_short_questions(chapter: dict, facts: list[str], questions: list[dict]) -> None:
    num = chapter["num"]
    source = chapter["source"]
    usable = [fact for fact in facts if len(fact) <= 150]
    for i in range(15):
        fact = usable[(i * 2) % len(usable)]
        term = term_from_fact(fact) or chapter["topic"]
        points = split_sentences(fact)
        scoring = points[:3]
        if len(scoring) < 2:
            scoring.append("能说明该知识点在本章中的作用或常见考法。")
        stems = [
            f"简述“{term}”的基本内容。",
            f"说明“{term}”在MCS-51系统中的作用。",
            f"写出“{term}”相关的两个关键点。",
            f"分析“{term}”容易混淆的地方。",
            f"结合本章内容，说明“{term}”的使用场景。",
        ]
        add_question(
            questions,
            make_id(num, "JD", i + 1),
            chapter["name"],
            "简答题",
            "基础" if i < 6 else "中等",
            stems[i % len(stems)],
            "参考答案：" + fact + "。",
            "评分时重点看是否说清定义/作用、相关寄存器或指令、以及容易混淆的点。",
            source,
            scoring=scoring,
        )


def program_reading_questions(questions: list[dict]) -> None:
    chapter_map = {chapter["num"]: chapter for chapter in CHAPTERS}

    def code_block(language: str, code: str) -> str:
        return f"```{language}\n{code}\n```"

    for i in range(10):
        init = i + 1
        loops = 3 + (i % 5)
        final = init + loops
        code = f"""MOV A,#{init:02X}H
MOV R2,#{loops:02X}H
LOOP: INC A
      DJNZ R2,LOOP"""
        add_question(
            questions,
            make_id(3, "YD", i + 1),
            chapter_map[3]["name"],
            "程序阅读题",
            "中等",
            f"阅读下面汇编程序，程序执行结束后A和R2的值分别是多少？\n\n{code_block('asm', code)}",
            f"A={final:02X}H，R2=00H",
            f"DJNZ每次使R2减1，不为0继续循环；INC A执行{loops}次，所以A从{init:02X}H变为{final:02X}H。",
            chapter_map[3]["source"],
            scoring=["判断DJNZ循环次数", "计算A的最终值", "说明R2结束为00H"],
        )

    for i in range(10):
        n = 3 + (i % 5)
        total = n * (n - 1) // 2
        code = f"""unsigned char i, sum = 0;
for (i = 0; i < {n}; i++) {{
    sum += i;
}}
P1 = sum;"""
        add_question(
            questions,
            make_id(4, "YD", i + 1),
            chapter_map[4]["name"],
            "程序阅读题",
            "中等",
            f"阅读下面C51程序片段，执行后P1输出的值是多少？\n\n{code_block('c', code)}",
            f"P1={total}",
            f"for循环中sum依次累加0到{n - 1}，总和为{total}，最后赋给P1。",
            chapter_map[4]["source"],
            scoring=["判断for循环范围", "计算累加结果", "指出P1输出sum"],
        )

    for i in range(10):
        init = 0xFE - i
        mask = 1 << (i % 4)
        final = init ^ mask
        code = f"""sbit LED = P1^{i % 4};
void int0_service(void) interrupt 0
{{
    P1 = P1 ^ 0x{mask:02X};
}}
// 假设中断前P1=0x{init:02X}，外部中断0触发一次。"""
        add_question(
            questions,
            make_id(5, "YD", i + 1),
            chapter_map[5]["name"],
            "程序阅读题",
            "中等",
            f"阅读下面C51外部中断程序片段，外部中断0触发一次后P1的值是多少？\n\n{code_block('c', code)}",
            f"P1=0x{final:02X}",
            f"interrupt 0表示外部中断0服务函数；P1与0x{mask:02X}异或，目标位翻转，其余位保持不变。",
            chapter_map[5]["source"],
            scoring=["识别interrupt 0", "理解异或翻转", "计算P1最终值"],
        )

    for i in range(10):
        threshold = 5 + (i % 6)
        interrupts = threshold * 2 + (i % 3)
        toggles = interrupts // threshold
        code = f"""void timer0_service(void) interrupt 1
{{
    tick++;
    if (tick >= {threshold}) {{
        tick = 0;
        LED = !LED;
    }}
}}
// 假设tick初值为0，T0中断连续发生{interrupts}次。"""
        add_question(
            questions,
            make_id(6, "YD", i + 1),
            chapter_map[6]["name"],
            "程序阅读题",
            "中等",
            f"阅读下面定时器中断程序，LED会翻转几次？中断结束后tick是多少？\n\n{code_block('c', code)}",
            f"LED翻转{toggles}次，tick={interrupts % threshold}",
            f"每{threshold}次中断tick清零并翻转LED；{interrupts}次中断可完成{toggles}组，余{interrupts % threshold}次。",
            chapter_map[6]["source"],
            scoring=["判断interrupt 1对应T0", "计算分组次数", "给出LED翻转次数和tick余数"],
        )

    for i in range(10):
        value = 0x30 + i
        code = f"""SBUF = 0x{value:02X};
while (TI == 0);
TI = 0;"""
        add_question(
            questions,
            make_id(7, "YD", i + 1),
            chapter_map[7]["name"],
            "程序阅读题",
            "基础",
            f"阅读下面串口发送程序片段，该程序发送的数据是什么？为什么最后要清TI？\n\n{code_block('c', code)}",
            f"发送0x{value:02X}；清TI是为了为下一次发送完成判断做准备。",
            "写SBUF启动发送；TI置1表示发送完成，软件清TI后才能可靠判断下一次发送。",
            chapter_map[7]["source"],
            scoring=["指出发送数据来自SBUF", "说明TI是发送完成标志", "说明TI需要软件清零"],
        )

    for i in range(10):
        key_bit = i % 4
        led_bit = (i + 1) % 4
        code = f"""sbit KEY = P1^{key_bit};
sbit LED = P1^{led_bit};
if (KEY == 0) {{
    delay();
    if (KEY == 0) {{
        LED = 0;
        while (KEY == 0);
    }}
}}"""
        add_question(
            questions,
            make_id(8, "YD", i + 1),
            chapter_map[8]["name"],
            "程序阅读题",
            "基础",
            f"阅读下面按键接口程序片段，说明它完成什么功能，并指出delay的作用。\n\n{code_block('c', code)}",
            f"检测P1.{key_bit}按键按下后，使P1.{led_bit}对应LED有效；delay用于软件消抖。",
            "KEY为0表示按键按下；延时后再次判断可滤除机械抖动；while等待按键释放。",
            chapter_map[8]["source"],
            scoring=["识别低电平按键", "说明LED控制效果", "说明消抖和等待释放"],
        )

    for i in range(10):
        addr = 0x8000 + i
        init = 0x20 + i
        final = (init + 1) & 0xFF
        code = f"""MOV DPTR,#{addr:04X}H
MOV A,#{init:02X}H
MOVX @DPTR,A
INC A
MOVX @DPTR,A"""
        add_question(
            questions,
            make_id(9, "YD", i + 1),
            chapter_map[9]["name"],
            "程序阅读题",
            "中等",
            f"阅读下面外部数据存储器访问程序，片外地址{addr:04X}H最后保存的数据是多少？\n\n{code_block('asm', code)}",
            f"{final:02X}H",
            f"MOVX @DPTR,A访问片外数据存储器；第一次写入{init:02X}H，INC A后第二次写入{final:02X}H，后一次覆盖前一次。",
            chapter_map[9]["source"],
            scoring=["识别MOVX访问片外数据存储器", "判断DPTR地址", "计算最终写入值"],
        )


def system_extension_questions(questions: list[dict]) -> None:
    chapter = CHAPTERS[8]
    source = chapter["source"]
    stems = [
        (
            "设计8051扩展8KB外部数据RAM，地址范围0000H-1FFFH。说明P0、P2、ALE、RD、WR的连接思路。",
            "P0分时输出A0-A7和D0-D7，需用74LS373在ALE作用下锁存低8位地址；P2提供高位地址；RD接外部RAM读控制，WR接写控制；片选由高位地址译码得到。",
        ),
        (
            "设计8051扩展8KB外部程序存储器，地址范围0000H-1FFFH。说明主要控制信号。",
            "P0/P2提供地址总线，P0还复用数据总线并用ALE锁存低8位地址；访问外部程序存储器时使用PSEN作为读选通信号；片选由高位地址线译码产生。",
        ),
        (
            "某外设映射到片外数据空间8000H，要求CPU读写该外设。应使用哪类指令和哪些控制信号？",
            "应使用MOVX类指令访问片外数据空间；读外设用RD，写外设用WR；P0/P2提供地址，P0同时传送数据，片选由地址译码产生。",
        ),
        (
            "外扩系统中为什么P0口后面常接74LS373？",
            "P0口分时复用低8位地址和8位数据，地址阶段必须用74LS373等锁存器在ALE控制下锁存A0-A7，随后P0才能作为数据总线使用。",
        ),
        (
            "若题目给出多个外部芯片，系统扩展题中地址译码应先做什么？",
            "先确定每个芯片容量和地址范围，再根据高位地址线产生片选信号；低位地址接芯片内部地址端，数据线接D0-D7，控制线按程序/数据空间分别连接。",
        ),
        (
            "说明扩展外部程序存储器和外部数据存储器时控制信号的主要区别。",
            "外部程序存储器读操作主要使用PSEN；外部数据存储器读写使用RD和WR。两者都可能用P0/P2形成地址/数据总线，但访问指令和控制信号不同。",
        ),
        (
            "设计把片外输入口映射到9000H，并由程序读取。给出关键硬件和软件思路。",
            "硬件上P0/P2形成地址总线，P0接数据线，地址译码产生9000H对应片选，RD接输入口读控制；软件用DPTR=9000H，再用MOVX A,@DPTR读取。",
        ),
        (
            "设计把片外输出口映射到A000H，并由程序写数据。给出关键硬件和软件思路。",
            "硬件上地址译码产生A000H片选，P0接数据线，WR接输出口写控制；软件将DPTR置A000H，把待输出数据送A，再用MOVX @DPTR,A写出。",
        ),
        (
            "说明系统扩展题中P0、P2、ALE三者的配合关系。",
            "P0先输出低8位地址，同时P2输出高8位地址；ALE有效时锁存P0上的低地址；随后P0转为数据总线进行读写传输。",
        ),
        (
            "如果题图要求区分程序空间查表和片外数据空间读写，应如何选择指令？",
            "程序空间查表使用MOVC，例如MOVC A,@A+DPTR；片外数据空间读写使用MOVX，例如MOVX A,@DPTR或MOVX @DPTR,A。具体地址范围以题图译码为准。",
        ),
        (
            "设计8051扩展一片6264作为外部数据RAM，容量8KB，要求说明该芯片需要多少根片内地址线以及高位地址线如何用于片选。",
            "8KB=2^13，因此6264片内地址端需要A0-A12；A0-A7由P0经74LS373锁存得到，A8-A12可由P2低5位提供；更高位地址线用于译码产生片选信号。",
        ),
        (
            "若外部数据RAM容量为8KB，起始地址为2000H，结束地址应是多少？地址译码时应关注哪些高位地址线？",
            "8KB地址范围长度为2000H，因此2000H开始的结束地址为3FFFH；译码时应关注A15-A13等高位地址线以确定该8KB区间，低13位作为芯片内部地址。",
        ),
        (
            "外部程序存储器和外部数据存储器都接在P0/P2形成的地址总线上，怎样避免控制信号混淆？",
            "访问外部程序存储器时主要使用PSEN读选通信号，程序空间通常由MOVC或取指访问；访问外部数据存储器时使用RD/WR控制读写，软件使用MOVX指令。控制信号不同是区分两类空间的关键。",
        ),
        (
            "用74LS138进行片选译码时，系统扩展题中应怎样说明地址范围和片选输出的关系？",
            "先确定芯片容量需要的低位地址线，再用剩余高位地址线接74LS138输入端；某一组高位地址组合对应一个片选输出有效，从而确定芯片地址范围。具体输出端和有效电平以题图为准。",
        ),
        (
            "扩展片外并行输入口，地址为0C000H，读入数据后送P1口。硬件连接应重点说明哪些线？",
            "P0/P2提供地址，P0还接输入口数据线；地址译码产生0C000H对应片选；RD作为读控制信号；软件用DPTR=0C000H和MOVX A,@DPTR读入，再送P1。",
        ),
        (
            "扩展片外并行输出口，地址为0E000H，把A中的数据输出。硬件和软件关键点是什么？",
            "硬件上地址译码产生0E000H片选，P0接输出口数据线，WR作为写控制信号；软件设置DPTR=0E000H，执行MOVX @DPTR,A。若输出口需锁存，应说明写信号触发锁存。",
        ),
        (
            "系统扩展题中，为什么不能只画数据线而不画地址线和控制线？",
            "外扩芯片必须同时由地址线确定单元或片选，由数据线传送数据，由控制线确定读写或程序空间访问。只画数据线无法完成寻址和读写控制，属于扩展题常见失分点。",
        ),
        (
            "设计外扩ROM查表系统时，若程序中使用MOVC A,@A+DPTR，应如何解释DPTR、A和PSEN的作用？",
            "DPTR提供表首地址，A提供表内偏移，MOVC按A+DPTR形成程序存储器地址取表项；外部程序存储器读操作由PSEN参与控制。若表在片内程序存储器，则外部控制信号按题图条件判断。",
        ),
        (
            "外部数据存储器扩展中，P0口既接地址锁存器又接数据总线，会不会冲突？说明原因。",
            "不会。P0是分时复用端口：地址阶段输出A0-A7并由ALE锁存，随后P0转为D0-D7数据总线。地址被锁存后，P0可用于数据传输。",
        ),
        (
            "给定外部数据存储器地址范围8000H-9FFFH，判断容量并说明应把哪些地址线送入芯片内部地址端。",
            "范围长度为2000H，即8KB，需要A0-A12作为芯片内部地址线；高位地址线用于译码产生片选。P0锁存后提供A0-A7，P2相关位提供A8及以上地址。",
        ),
    ]
    for i, (stem, answer) in enumerate(stems, 1):
        add_question(
            questions,
            make_id(9, "XT", i),
            chapter["name"],
            "系统扩展题",
            "综合",
            stem,
            answer,
            "系统扩展题按总线连接、地址译码、控制信号、访问指令四步组织。若题图给出具体芯片型号或片选极性，应以题图为准。",
            source,
            scoring=["说明P0/P2地址和数据作用", "说明ALE或锁存低地址", "说明PSEN/RD/WR或MOVC/MOVX的选择"],
        )


def program_design_questions(questions: list[dict]) -> None:
    source = "output/review_outline.md 第3-9章及考前程序设计模板；extracted/上课PPT 第3-9章；extracted/往年试卷"
    designs = [
        (
            "用汇编编写程序：统计片内RAM 30H-3FH中最高位为1的数据个数，结果存入40H。",
            """参考程序：
MOV R0,#30H
MOV R2,#10H
MOV R7,#00H
LOOP: MOV A,@R0
      JB ACC.7,NEG
      SJMP NEXT
NEG:  INC R7
NEXT: INC R0
      DJNZ R2,LOOP
      MOV 40H,R7
END""",
            "考察寄存器间接寻址、循环、位判断和结果保存。",
        ),
        (
            "用汇编编写程序：把程序存储器表TAB中第3个字节取出并送P1口。",
            """参考程序：
MOV DPTR,#TAB
MOV A,#02H
MOVC A,@A+DPTR
MOV P1,A
TAB: DB 3FH,06H,5BH,4FH
END""",
            "第3个字节下标为2；MOVC访问程序存储器查表。",
        ),
        (
            "用汇编编写程序：把片外数据存储器8000H开始的8个字节复制到8100H开始的区域。",
            """参考思路：
MOV R7,#08H
MOV R0,#00H
LOOP:
MOV DPTR,#8000H
MOV A,R0
ADD A,DPL
MOV DPL,A
MOVX A,@DPTR
PUSH ACC
MOV DPTR,#8100H
MOV A,R0
ADD A,DPL
MOV DPL,A
POP ACC
MOVX @DPTR,A
INC R0
DJNZ R7,LOOP
END""",
            "考察MOVX、DPTR、循环和片外数据空间。实际考试可按给定地址简化。",
        ),
        (
            "用汇编编写程序：外部中断0触发后翻转P1.0，要求写出入口地址和返回指令。",
            """参考程序：
ORG 0000H
LJMP MAIN
ORG 0003H
LJMP INT0_ISR
MAIN:
SETB IT0
SETB EX0
SETB EA
SJMP $
INT0_ISR:
CPL P1.0
RETI
END""",
            "考察INT0入口0003H、IE允许位、IT0触发方式和RETI。",
        ),
        (
            "用汇编编写程序：T0方式1定时中断中累计20次后翻转P1.0。",
            """参考程序：
ORG 0000H
LJMP MAIN
ORG 000BH
LJMP T0_ISR
MAIN:
MOV R7,#20
MOV TMOD,#01H
MOV TH0,#3CH
MOV TL0,#0B0H
SETB ET0
SETB EA
SETB TR0
SJMP $
T0_ISR:
MOV TH0,#3CH
MOV TL0,#0B0H
DJNZ R7,EXIT
MOV R7,#20
CPL P1.0
EXIT:
RETI
END""",
            "考察T0入口000BH、方式1、重装初值、中断累计计数。",
        ),
        (
            "用汇编编写程序：串口发送累加器A中的一个字节，发送完成后清TI。",
            """参考程序：
MOV SBUF,A
WAIT: JNB TI,WAIT
CLR TI
END""",
            "考察SBUF发送、TI发送完成标志和软件清零。",
        ),
        (
            "用C51编写程序：按下P1.0连接的按键后点亮P1.1连接的LED，并进行软件消抖。",
            """参考程序：
#include <reg51.h>
sbit KEY = P1^0;
sbit LED = P1^1;
void delay(void) { unsigned int i; for(i=0;i<5000;i++); }
void main(void)
{
    while (1) {
        if (KEY == 0) {
            delay();
            if (KEY == 0) {
                LED = 0;
                while (KEY == 0);
            }
        }
    }
}""",
            "考察sbit、端口读写、按键低电平有效和消抖。",
        ),
        (
            "用C51编写程序：T0中断每20次翻转一次LED，函数声明必须符合C51中断格式。",
            """参考程序：
#include <reg51.h>
sbit LED = P1^0;
unsigned char tick = 0;
void timer0_service(void) interrupt 1
{
    TH0 = 0x3C;
    TL0 = 0xB0;
    tick++;
    if (tick >= 20) {
        tick = 0;
        LED = !LED;
    }
}
void main(void)
{
    TMOD = 0x01;
    TH0 = 0x3C;
    TL0 = 0xB0;
    ET0 = 1;
    EA = 1;
    TR0 = 1;
    while (1);
}""",
            "考察C51 interrupt n格式、T0方式1、EA/ET0/TR0和中断重装。",
        ),
        (
            "用C51编写程序：串口发送P1口当前数据，发送完成后清TI。",
            """参考程序：
#include <reg51.h>
void main(void)
{
    SCON = 0x50;
    SBUF = P1;
    while (TI == 0);
    TI = 0;
    while (1);
}""",
            "考察SCON、SBUF、TI和端口数据发送。波特率细节若题目未给出可标注资料未明确说明。",
        ),
        (
            "用汇编编写程序：将P1口数据读入A，再通过串口发送。",
            """参考程序：
MOV A,P1
MOV SBUF,A
WAIT: JNB TI,WAIT
CLR TI
END""",
            "考察端口输入、串口发送和TI标志。",
        ),
        (
            "用汇编编写程序：从片外数据存储器9000H读一个字节，加1后写回9000H。",
            """参考程序：
MOV DPTR,#9000H
MOVX A,@DPTR
INC A
MOVX @DPTR,A
END""",
            "考察DPTR和MOVX对片外数据存储器的读写。",
        ),
        (
            "用C51编写程序：从片外地址0x8000读取一个字节并送P1口。",
            """参考程序：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *p;
    p = (unsigned char xdata *)0x8000;
    P1 = *p;
    while (1);
}""",
            "考察C51片外数据空间访问和xdata指针。若课堂给出固定宏写法，以课堂要求为准。",
        ),
        (
            "用汇编编写程序：比较片内RAM 30H和31H两个无符号数，把较大值存入32H。",
            """参考程序：
MOV A,30H
CLR C
SUBB A,31H
JC B_BIG
MOV A,30H
MOV 32H,A
SJMP DONE
B_BIG:
MOV A,31H
MOV 32H,A
DONE:
END""",
            "考察直接寻址、SUBB比较、进位标志和分支。",
        ),
        (
            "用汇编编写程序：把30H开始的4个字节累加，低8位结果存入40H。",
            """参考程序：
MOV R0,#30H
MOV R2,#04H
MOV A,#00H
LOOP:
ADD A,@R0
INC R0
DJNZ R2,LOOP
MOV 40H,A
END""",
            "考察寄存器间接寻址、ADD和DJNZ循环。",
        ),
        (
            "用C51编写程序：接收串口1个字节后送P1口，并清RI。",
            """参考程序：
#include <reg51.h>
void main(void)
{
    SCON = 0x50;
    while (RI == 0);
    P1 = SBUF;
    RI = 0;
    while (1);
}""",
            "考察串口接收、RI标志、SBUF和端口输出。",
        ),
        (
            "用汇编编写程序：把片内RAM 30H-3FH全部清零。",
            """参考程序：
MOV R0,#30H
MOV R2,#10H
CLR A
LOOP:
MOV @R0,A
INC R0
DJNZ R2,LOOP
END""",
            "考察寄存器间接寻址、循环次数控制和片内RAM写操作。",
        ),
        (
            "用汇编编写程序：在片内RAM 30H-37H中找最大无符号数，结果存入40H。",
            """参考程序：
MOV R0,#30H
MOV R2,#08H
MOV A,@R0
MOV 40H,A
INC R0
DEC R2
LOOP:
MOV A,40H
CLR C
SUBB A,@R0
JNC NEXT
MOV A,@R0
MOV 40H,A
NEXT:
INC R0
DJNZ R2,LOOP
END""",
            "考察无符号数比较、进位标志C、间接寻址和循环。",
        ),
        (
            "用汇编编写程序：查七段码表，把数字5对应的段码送P1口。",
            """参考程序：
MOV DPTR,#TAB
MOV A,#05H
MOVC A,@A+DPTR
MOV P1,A
TAB: DB 3FH,06H,5BH,4FH,66H,6DH,7DH,07H,7FH,6FH
END""",
            "考察MOVC查表、DPTR表首地址和端口输出。",
        ),
        (
            "用汇编编写程序：把片外数据存储器8000H中的数据读出，取反后写到片外数据存储器8001H。",
            """参考程序：
MOV DPTR,#8000H
MOVX A,@DPTR
CPL A
MOV DPTR,#8001H
MOVX @DPTR,A
END""",
            "考察MOVX读写片外数据存储器、DPTR地址切换和累加器运算。",
        ),
        (
            "用汇编编写程序：等待P1.0为低电平后，将P2口输出55H。",
            """参考程序：
WAIT:
JB P1.0,WAIT
MOV P2,#55H
END""",
            "考察位判断、端口输入和端口输出。若按键电平与题图不同，应按题图修改判断条件。",
        ),
        (
            "用汇编编写程序：T0中断服务程序中只完成TH0/TL0重装并翻转P1.0，要求保护ACC和PSW。",
            """参考程序：
ORG 000BH
T0_ISR:
PUSH ACC
PUSH PSW
MOV TH0,#3CH
MOV TL0,#0B0H
CPL P1.0
POP PSW
POP ACC
RETI
END""",
            "考察中断入口、现场保护、定时器初值重装和RETI。",
        ),
        (
            "用汇编编写程序：串口接收一个字节，若接收值为55H则置位P1.0，否则清零P1.0。",
            """参考程序：
WAIT:
JNB RI,WAIT
CLR RI
MOV A,SBUF
CJNE A,#55H,NOT_EQ
SETB P1.0
SJMP DONE
NOT_EQ:
CLR P1.0
DONE:
END""",
            "考察RI接收标志、SBUF、CJNE条件判断和位操作。",
        ),
        (
            "用C51编写程序：把数组中8个字节求和，低8位结果送P1口。",
            """参考程序：
#include <reg51.h>
unsigned char code table[8] = {1,2,3,4,5,6,7,8};
void main(void)
{
    unsigned char i;
    unsigned char sum = 0;
    for (i = 0; i < 8; i++) {
        sum += table[i];
    }
    P1 = sum;
    while (1);
}""",
            "考察C51数组、code存储区、for循环和端口输出。",
        ),
        (
            "用C51编写程序：P1.0按键按下时翻转P1.7连接的LED，要求等待按键释放。",
            """参考程序：
#include <reg51.h>
sbit KEY = P1^0;
sbit LED = P1^7;
void delay(void) { unsigned int i; for (i = 0; i < 5000; i++); }
void main(void)
{
    while (1) {
        if (KEY == 0) {
            delay();
            if (KEY == 0) {
                LED = !LED;
                while (KEY == 0);
            }
        }
    }
}""",
            "考察sbit、按键消抖、等待释放和位翻转。",
        ),
        (
            "用C51编写程序：外部中断0触发时把P2口数据加1。",
            """参考程序：
#include <reg51.h>
void int0_service(void) interrupt 0
{
    P2++;
}
void main(void)
{
    IT0 = 1;
    EX0 = 1;
    EA = 1;
    while (1);
}""",
            "考察C51外部中断0函数、IT0触发方式、EX0和EA允许位。",
        ),
        (
            "用C51编写程序：T0方式1定时中断中让P1口循环加1输出。",
            """参考程序：
#include <reg51.h>
void timer0_service(void) interrupt 1
{
    TH0 = 0x3C;
    TL0 = 0xB0;
    P1++;
}
void main(void)
{
    TMOD = 0x01;
    TH0 = 0x3C;
    TL0 = 0xB0;
    ET0 = 1;
    EA = 1;
    TR0 = 1;
    while (1);
}""",
            "考察T0中断、TMOD方式1、初值重装和端口输出。具体初值按课堂给定晶振和定时时间调整。",
        ),
        (
            "用C51编写程序：串口收到一个字节后立即原样发回。",
            """参考程序：
#include <reg51.h>
void main(void)
{
    unsigned char dat;
    SCON = 0x50;
    while (1) {
        while (RI == 0);
        RI = 0;
        dat = SBUF;
        SBUF = dat;
        while (TI == 0);
        TI = 0;
    }
}""",
            "考察串口接收RI、发送TI、SBUF和主循环。",
        ),
        (
            "用C51编写程序：从片外数据地址0x9000读取数据，加1后写回原地址。",
            """参考程序：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *p;
    unsigned char dat;
    p = (unsigned char xdata *)0x9000;
    dat = *p;
    dat++;
    *p = dat;
    while (1);
}""",
            "考察xdata指针、片外数据空间读写和简单数据处理。",
        ),
        (
            "用汇编编写程序：把P1口低4位作为查表输入，查表后把结果送P2口。",
            """参考程序：
MOV A,P1
ANL A,#0FH
MOV DPTR,#TAB
MOVC A,@A+DPTR
MOV P2,A
TAB: DB 00H,01H,04H,09H,10H,19H,24H,31H
     DB 40H,51H,64H,79H,90H,0A9H,0C4H,0E1H
END""",
            "考察端口输入、屏蔽低4位、MOVC查表和端口输出。",
        ),
        (
            "用汇编编写程序：片内RAM 30H-39H中查找是否存在00H，若存在置位P1.0，否则清零P1.0。",
            """参考程序：
MOV R0,#30H
MOV R2,#0AH
CLR P1.0
LOOP:
MOV A,@R0
JZ FOUND
INC R0
DJNZ R2,LOOP
SJMP DONE
FOUND:
SETB P1.0
DONE:
END""",
            "考察间接寻址、JZ判断、循环查找和位输出。",
        ),
        (
            "外扩输入口地址为8000H，编写程序读取该口数据并送P1口显示。",
            """参考答案：

汇编写法：
MOV DPTR,#8000H
MOVX A,@DPTR
MOV P1,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *in_port;
    in_port = (unsigned char xdata *)0x8000;
    P1 = *in_port;
    while (1);
}""",
            "考察片外I/O地址映射、MOVX读外设、xdata指针和端口输出。",
        ),
        (
            "外扩输出锁存器地址为9000H，编写程序把55H写入该输出口。",
            """参考答案：

汇编写法：
MOV DPTR,#9000H
MOV A,#55H
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *out_port;
    out_port = (unsigned char xdata *)0x9000;
    *out_port = 0x55;
    while (1);
}""",
            "考察片外输出口写操作、WR控制对应的软件访问形式和MOVX @DPTR,A。",
        ),
        (
            "外扩输入口地址为0A000H，输出口地址为0A001H，编写程序把输入口数据取反后送输出口。",
            """参考答案：

汇编写法：
MOV DPTR,#0A000H
MOVX A,@DPTR
CPL A
MOV DPTR,#0A001H
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *in_port = (unsigned char xdata *)0xA000;
    unsigned char xdata *out_port = (unsigned char xdata *)0xA001;
    *out_port = ~(*in_port);
    while (1);
}""",
            "考察外扩输入/输出口连续地址、MOVX读写、累加器取反和xdata访问。",
        ),
        (
            "外扩8255的端口A、B、C、控制口地址分别为0C000H、0C001H、0C002H、0C003H。编写程序将8255初始化为A口输入、B口输出，并把A口数据送B口。",
            """参考答案：

汇编写法：
MOV DPTR,#0C003H
MOV A,#90H
MOVX @DPTR,A
MOV DPTR,#0C000H
MOVX A,@DPTR
MOV DPTR,#0C001H
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *pa = (unsigned char xdata *)0xC000;
    unsigned char xdata *pb = (unsigned char xdata *)0xC001;
    unsigned char xdata *ctrl = (unsigned char xdata *)0xC003;
    *ctrl = 0x90;
    *pb = *pa;
    while (1);
}""",
            "考察8255片外端口地址、控制字写入、A口输入和B口输出。控制字以常见方式0配置为例。",
        ),
        (
            "外扩并行输入口8000H连接8个开关，外扩输出口8001H连接8个LED。编写循环程序，使LED持续显示开关状态。",
            """参考答案：

汇编写法：
LOOP:
MOV DPTR,#8000H
MOVX A,@DPTR
MOV DPTR,#8001H
MOVX @DPTR,A
SJMP LOOP
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *sw = (unsigned char xdata *)0x8000;
    unsigned char xdata *led = (unsigned char xdata *)0x8001;
    while (1) {
        *led = *sw;
    }
}""",
            "考察片外外设循环访问、输入口读、输出口写和持续刷新。",
        ),
        (
            "外扩A/D转换器数据口地址为0B000H，启动口地址为0B001H。编写程序启动一次转换，延时后读取转换结果并送P1口。",
            """参考答案：

汇编写法：
MOV DPTR,#0B001H
MOV A,#01H
MOVX @DPTR,A
ACALL DELAY
MOV DPTR,#0B000H
MOVX A,@DPTR
MOV P1,A
END

C51写法：
#include <reg51.h>
void delay(void) { unsigned int i; for (i = 0; i < 5000; i++); }
void main(void)
{
    unsigned char xdata *ad_data = (unsigned char xdata *)0xB000;
    unsigned char xdata *ad_start = (unsigned char xdata *)0xB001;
    *ad_start = 0x01;
    delay();
    P1 = *ad_data;
    while (1);
}""",
            "考察外扩A/D接口的启动口、数据口、片外读写和延时等待。转换完成信号未给出时用延时处理。",
        ),
        (
            "外扩D/A转换器数据口地址为0D000H。编写程序向D/A连续输出00H、40H、80H、0C0H四个数据。",
            """参考答案：

汇编写法：
MOV DPTR,#0D000H
MOV A,#00H
MOVX @DPTR,A
MOV A,#40H
MOVX @DPTR,A
MOV A,#80H
MOVX @DPTR,A
MOV A,#0C0H
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *da = (unsigned char xdata *)0xD000;
    *da = 0x00;
    *da = 0x40;
    *da = 0x80;
    *da = 0xC0;
    while (1);
}""",
            "考察片外D/A数据口写操作和按地址连续输出数据。",
        ),
        (
            "外扩输出口地址为0E000H，P1.0接按键。编写程序：按键为低电平时向输出口写0FFH，否则写00H。",
            """参考答案：

汇编写法：
MOV DPTR,#0E000H
JB P1.0,KEY_UP
MOV A,#0FFH
SJMP WRITE
KEY_UP:
MOV A,#00H
WRITE:
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
sbit KEY = P1^0;
void main(void)
{
    unsigned char xdata *out_port = (unsigned char xdata *)0xE000;
    if (KEY == 0) {
        *out_port = 0xFF;
    } else {
        *out_port = 0x00;
    }
    while (1);
}""",
            "考察片外输出口、位判断、按键电平判断和条件输出。",
        ),
        (
            "片外RAM 8000H保存外设采样值，外扩输出口9000H连接显示锁存器。编写程序将采样值加1后送显示锁存器。",
            """参考答案：

汇编写法：
MOV DPTR,#8000H
MOVX A,@DPTR
INC A
MOV DPTR,#9000H
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *sample = (unsigned char xdata *)0x8000;
    unsigned char xdata *display = (unsigned char xdata *)0x9000;
    *display = *sample + 1;
    while (1);
}""",
            "考察片外RAM读、外扩输出口写和简单数据处理。",
        ),
        (
            "外扩输入口0F000H连接状态字，外扩输出口0F001H连接控制寄存器。编写程序检测状态字D0位，D0=1时向控制寄存器写01H，D0=0时写00H。",
            """参考答案：

汇编写法：
MOV DPTR,#0F000H
MOVX A,@DPTR
JB ACC.0,SET_CTL
MOV A,#00H
SJMP WRITE_CTL
SET_CTL:
MOV A,#01H
WRITE_CTL:
MOV DPTR,#0F001H
MOVX @DPTR,A
END

C51写法：
#include <reg51.h>
void main(void)
{
    unsigned char xdata *status = (unsigned char xdata *)0xF000;
    unsigned char xdata *control = (unsigned char xdata *)0xF001;
    if ((*status & 0x01) != 0) {
        *control = 0x01;
    } else {
        *control = 0x00;
    }
    while (1);
}""",
            "考察片外状态寄存器读取、位测试、外扩控制寄存器写入和MOVX读写。",
        ),
    ]
    for i, (stem, answer, explanation) in enumerate(designs, 1):
        add_question(
            questions,
            make_id("ZH", "SJ", i),
            "程序设计综合题",
            "程序设计题",
            "综合",
            stem,
            answer,
            explanation,
            source,
            scoring=["程序结构完整", "关键寄存器/指令使用正确", "能说明初始化、循环或中断处理思路"],
        )


def build_bank() -> dict:
    if not OUTLINE.exists():
        raise FileNotFoundError(f"缺少提纲文件：{OUTLINE}")
    outline = OUTLINE.read_text(encoding="utf-8")
    facts_by_chapter = extract_facts(outline)
    chapters_output = []

    for chapter in CHAPTERS:
        questions: list[dict] = []
        facts = facts_by_chapter[chapter["num"]]
        if len(facts) < 10:
            raise ValueError(f"{chapter['name']} 可用知识点过少，无法稳妥生成题库")
        generate_choice_questions(chapter, facts, questions)
        generate_fill_questions(chapter, facts, questions)
        generate_short_questions(chapter, facts, questions)
        chapters_output.append(
            {
                "章节": chapter["name"],
                "说明": chapter["topic"],
                "题目": questions,
            }
        )

    program_reading_questions_by_chapter: dict[str, list[dict]] = defaultdict(list)
    program_questions: list[dict] = []
    program_reading_questions(program_questions)
    for item in program_questions:
        program_reading_questions_by_chapter[item["章节"]].append(item)

    for chapter in chapters_output:
        chapter["题目"].extend(program_reading_questions_by_chapter.get(chapter["章节"], []))

    system_questions: list[dict] = []
    system_extension_questions(system_questions)
    for chapter in chapters_output:
        if chapter["章节"] == CHAPTERS[8]["name"]:
            chapter["题目"].extend(system_questions)
            break

    design_questions: list[dict] = []
    program_design_questions(design_questions)
    chapters_output.append(
        {
            "章节": "程序设计综合题",
            "说明": "综合考察汇编、C51、端口、中断、定时器、串口和片外扩展访问。",
            "题目": design_questions,
        }
    )

    all_questions = [question for chapter in chapters_output for question in chapter["题目"]]
    type_counts = Counter(question["题型"] for question in all_questions)
    chapter_counts = {chapter["章节"]: len(chapter["题目"]) for chapter in chapters_output}
    return {
        "metadata": {
            "课程": "微机原理",
            "生成依据": [
                "output/review_outline.md",
                "extracted/上课PPT",
                "extracted/教材",
                "extracted/微机原理往年试卷",
                "extracted/模拟试卷（题型说明）",
            ],
            "考试题型": ["选择题", "填空题", "程序阅读题", "简答题", "系统扩展题", "程序设计题"],
            "注意": [
                "系统扩展题只放在第9章。",
                "程序设计题单独作为综合部分。",
                "第1章和第2章资料以概念和硬件结构为主，未硬凑程序阅读题。",
                "涉及OCR往年卷答案的内容已尽量采用提纲中较明确的结论；如课堂题图给出不同条件，以课堂题图为准。",
            ],
            "题型统计": dict(type_counts),
            "章节题量": chapter_counts,
        },
        "chapters": chapters_output,
    }


def audit(bank: dict) -> None:
    ids = set()
    problems: list[str] = []
    all_questions = [question for chapter in bank["chapters"] for question in chapter["题目"]]
    bad_stem_phrases = [
        "与资料一致",
        "与资料不一致",
        "根据资料",
        "资料强调",
        "若题目要求",
        "如果题目要求",
        "若课堂",
        "按课堂",
        "复习",
        "常考",
        "往年",
    ]
    for question in all_questions:
        for field in REQUIRED_FIELDS:
            if field not in question:
                problems.append(f"{question.get('编号', '未知编号')} 缺少字段 {field}")
            elif question[field] in ("", None):
                problems.append(f"{question.get('编号', '未知编号')} 字段为空 {field}")
        qid = question.get("编号")
        if qid in ids:
            problems.append(f"编号重复：{qid}")
        ids.add(qid)
        stem = question.get("题干", "")
        for phrase in bad_stem_phrases:
            if phrase in stem:
                problems.append(f"{qid} 题干含不适合考试卷面的表述：{phrase}")
        if question.get("题型") == "选择题":
            if len(question.get("选项", [])) != 4:
                problems.append(f"{qid} 选择题选项不是4个")
            if question.get("答案") not in LETTERS:
                problems.append(f"{qid} 选择题答案不是A/B/C/D")
        else:
            if question.get("选项"):
                problems.append(f"{qid} 非选择题不应有选项")
        if question.get("题型") == "填空题" and len(question.get("答案", "")) > 20:
            problems.append(f"{qid} 填空题答案偏长：{question.get('答案')}")
        if question.get("题型") == "系统扩展题" and question.get("章节") != "第9章 单片机系统扩展":
            problems.append(f"{qid} 系统扩展题不在第9章")
        if not question.get("题干") or not question.get("答案") or not question.get("解析"):
            problems.append(f"{qid} 题干/答案/解析存在空值")

    if problems:
        raise ValueError("题库审核发现问题：\n" + "\n".join(problems[:30]))

    counts = Counter(question["题型"] for question in all_questions)
    print("题库审核通过。")
    print(f"总题量：{len(all_questions)}")
    for qtype, count in sorted(counts.items()):
        print(f"{qtype}：{count}")
    for chapter in bank["chapters"]:
        chapter_counts = Counter(question["题型"] for question in chapter["题目"])
        print(f"{chapter['章节']}：{dict(chapter_counts)}")


def main() -> None:
    bank = build_bank()
    audit(bank)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding="utf-8")
    json.loads(OUTPUT.read_text(encoding="utf-8"))
    print(f"JSON已生成并可正常解析：{OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
