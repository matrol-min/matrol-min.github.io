#!/usr/bin/env python3
"""
_data/publications.yml, _data/patents.yml 을 읽어서 카운트를 계산하고,
국문(index.html)과 영문(en.html)의 자동생성 구역(마커 사이)에
언어에 맞는 문구로 Publication Summary / Publications / Patents 섹션을 써넣습니다.

마커:  # <auto:publications>  ~  # </auto:publications>

사용법:  python scripts/build_publications.py
"""
import yaml
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBS = ROOT / "_data" / "publications.yml"
PATS = ROOT / "_data" / "patents.yml"

START = "# <auto:publications>"
END = "# </auto:publications>"

# 언어별 라벨
L = {
    "ko": {
        "summary": "연구실적 요약",
        "pub_section": "논문",
        "pat_section": "특허",
        "papers": "학술지 · 학회 논문",
        "first": "1저자",
        "corr": "교신저자",
        "co": "공저자",
        "patents": "특허",
        "registered": "등록",
        "pending": "출원",
        "badge_first": "1저자",
        "badge_corr": "교신",
    },
    "en": {
        "summary": "Publication Summary",
        "pub_section": "Publications",
        "pat_section": "Patents",
        "papers": "Journal & Conference Papers",
        "first": "First author",
        "corr": "Corresponding author",
        "co": "Co-author",
        "patents": "Patents",
        "registered": "Registered",
        "pending": "Pending",
        "badge_first": "1st author",
        "badge_corr": "corresponding",
    },
}


def load(path):
    if not path.exists():
        return []
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or []


pubs = load(PUBS)
pats = load(PATS)

c = {
    "pub_total": len(pubs),
    "pub_first": sum(1 for p in pubs if p.get("role") == "first"),
    "pub_corr": sum(1 for p in pubs if p.get("role") == "corresponding"),
    "pub_co": sum(1 for p in pubs if p.get("role") == "co"),
    "pat_total": len(pats),
    "pat_reg": sum(1 for p in pats if p.get("status") == "registered"),
    "pat_pend": sum(1 for p in pats if p.get("status") == "pending"),
}

pubs_sorted = sorted(pubs, key=lambda p: p.get("year", 0), reverse=True)
pats_sorted = sorted(pats, key=lambda p: p.get("year", 0), reverse=True)


def esc(s):
    return str(s).replace("\\", "\\\\").replace('"', '\\"')


def indent_block(text, spaces):
    pad = " " * spaces
    return "\n".join(pad + line if line else pad.rstrip()
                     for line in text.rstrip("\n").split("\n"))


def build_block(lang):
    t = L[lang]
    lines = [START]

    # ---- Publication Summary (markdown table) ----
    summary_md = (
        f"| | |\n"
        f"|---|---|\n"
        f"| **{t['papers']}** | **{c['pub_total']}** |\n"
        f"| &nbsp;&nbsp;{t['first']} | {c['pub_first']} |\n"
        f"| &nbsp;&nbsp;{t['corr']} | {c['pub_corr']} |\n"
        f"| &nbsp;&nbsp;{t['co']} | {c['pub_co']} |\n"
        f"| **{t['patents']}** | **{c['pat_total']}** |\n"
        f"| &nbsp;&nbsp;{t['registered']} | {c['pat_reg']} |\n"
        f"| &nbsp;&nbsp;{t['pending']} | {c['pat_pend']} |\n"
    )
    lines.append(f"  - title: {t['summary']}")
    lines.append("    layout: text")
    lines.append("    class: cv-summary")
    lines.append("    content: |")
    lines.append(indent_block(summary_md, 6))
    lines.append("")

    # ---- Publications (list, 1-column top layout) ----
    # 제목은 details(상단), 서지정보(연도·저자·저널·doi)는 content(하단) 한 줄에.
    lines.append(f"  - title: {t['pub_section']}")
    lines.append("    layout: list")
    lines.append("    class: cv-onecol")
    lines.append("    content:")
    for p in pubs_sorted:
        tag = ""
        if p.get("role") == "first":
            tag = f' <span class="cv-badge cv-badge-accent">{t["badge_first"]}</span>'
        elif p.get("role") == "corresponding":
            tag = f' <span class="cv-badge cv-badge-accent">{t["badge_corr"]}</span>'
        # 서지정보: 저자 (연도). *저널/서지정보*. doi
        bib = f"{esc(p.get('authors',''))}{tag}"
        meta = []
        if p.get("year"):
            meta.append(f"({p.get('year')})")
        if p.get("venue"):
            meta.append(f"*{esc(p.get('venue'))}*")
        if p.get("doi"):
            meta.append(f"doi: {esc(p['doi'])}")
        if meta:
            bib += "  \n  " + " ".join(meta)
        lines.append("      - layout: left")
        lines.append(f"        title: \"{esc(p.get('title',''))}\"")
        lines.append("        description: |")
        lines.append(indent_block(bib, 10))
    lines.append("")

    # ---- Patents (list, 1-column top layout) ----
    lines.append(f"  - title: {t['pat_section']}")
    lines.append("    layout: list")
    lines.append("    class: cv-onecol")
    lines.append("    content:")
    for p in pats_sorted:
        is_reg = p.get("status") == "registered"
        badge_class = "cv-badge-accent" if is_reg else "cv-badge-muted"
        label = t["registered"] if is_reg else t["pending"]
        title = p.get(f"title_{lang}", p.get("title", ""))
        inventors = p.get(f"inventors_{lang}", p.get("inventors", ""))
        # 서지정보: 발명자 (연도). 출원/등록번호. [등록/출원]
        bib = f"{esc(inventors)}"
        meta = []
        if p.get("year"):
            meta.append(f"({p.get('year')})")
        if p.get("number"):
            meta.append(f"{esc(p.get('number'))}")
        bib += "  \n  " + " ".join(meta)
        bib += f' <span class="cv-badge {badge_class}">{label}</span>'
        lines.append("      - layout: left")
        lines.append(f"        title: \"{esc(title)}\"")
        lines.append("        description: |")
        lines.append(indent_block(bib, 10))
    lines.append(END)
    return "\n".join(lines)


def inject(page_path, lang):
    text = page_path.read_text(encoding="utf-8")
    if START not in text or END not in text:
        raise SystemExit(f"‼ {page_path.name} 에 마커가 없습니다.")
    pre = text.split(START)[0]
    post = text.split(END, 1)[1]
    page_path.write_text(pre + build_block(lang) + post, encoding="utf-8")


inject(ROOT / "index.html", "ko")
inject(ROOT / "en.html", "en")

print("✅ 국문/영문 자동 섹션 갱신 완료")
print(f"   논문 {c['pub_total']}편 (1저자 {c['pub_first']}, 교신 {c['pub_corr']}, 공저 {c['pub_co']})")
print(f"   특허 {c['pat_total']}건 (등록 {c['pat_reg']}, 출원 {c['pat_pend']})")
