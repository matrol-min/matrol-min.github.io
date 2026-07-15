#!/usr/bin/env python3
"""
_data/publications.yml, _data/patents.yml 을 읽어서 카운트를 계산하고,
국문(index.html)과 영문(en.html)의 자동생성 구역(마커 사이)에
언어에 맞는 문구로 연구실적 요약 / 연구 성과 하이라이트 / 논문 / 특허 섹션을 써넣습니다.

마커:  # <auto:publications>  ~  # </auto:publications>

논문/특허 리스트는 국내/국제로 나뉘어 각 그룹 위에 소제목(layout: divider)이 붙습니다.
국제/국내 판정:
  - 특허: number 필드가 PCT/US/EP/JP/DE/CN/GB/IN/TW로 시작하면 국제, 그 외는 국내.
  - 논문: publications.yml의 scope 필드 (domestic/international). 없으면 international.

연구 성과 하이라이트: publications.yml 항목에 highlight: true 를 추가하면 그 논문만 모아
"연구 성과 하이라이트" 섹션을 자동 생성합니다 (하이라이트 항목이 하나도 없으면 섹션 자체를 생략).

사용법:  python scripts/build_publications.py
"""
import sys
import yaml
from pathlib import Path

# Windows 콘솔(cp949 등)에서 한글/이모지 print가 깨지는 것 방지
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
PUBS = ROOT / "_data" / "publications.yml"
PATS = ROOT / "_data" / "patents.yml"

START = "# <auto:publications>"
END = "# </auto:publications>"

# 국제 특허로 판정하는 number 필드 접두어
INTL_PATENT_PREFIXES = ("PCT", "US", "EP", "JP", "DE", "CN", "GB", "IN", "TW")

# 언어별 라벨
L = {
    "ko": {
        "summary": "연구실적 요약",
        "highlights": "연구 성과 하이라이트",
        "pub_section": "논문",
        "pat_section": "특허",
        "papers": "학술지 · 학회 논문",
        "first": "1저자",
        "corr": "교신저자",
        "co": "공저자",
        "pat_applied": "특허 출원",
        "registered": "등록",
        "pending": "출원",
        "badge_first": "1저자",
        "badge_corr": "교신",
        "intl": "국제",
        "domestic": "국내",
    },
    "en": {
        "summary": "Publication Summary",
        "highlights": "Research Highlights",
        "pub_section": "Publications",
        "pat_section": "Patents",
        "papers": "Journal & Conference Papers",
        "first": "First author",
        "corr": "Corresponding author",
        "co": "Co-author",
        "pat_applied": "Patent Applications",
        "registered": "Registered",
        "pending": "Pending",
        "badge_first": "1st author",
        "badge_corr": "corresponding",
        "intl": "International",
        "domestic": "Domestic",
    },
}


def load(path):
    if not path.exists():
        return []
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or []


def is_intl_patent(p):
    number = str(p.get("number", "")).strip().upper()
    return number.startswith(INTL_PATENT_PREFIXES)


def is_domestic_pub(p):
    return p.get("scope") == "domestic"


pubs = load(PUBS)
pats = load(PATS)

c = {
    "pub_total": len(pubs),
    "pub_first": sum(1 for p in pubs if p.get("role") == "first"),
    "pub_corr": sum(1 for p in pubs if p.get("role") == "corresponding"),
    "pub_co": sum(1 for p in pubs if p.get("role") == "co"),
    # "출원"은 등록 포함 전체 건수, "특허"(등록)는 그중 등록된 건수 — 등록 특허를 출원 수에서 빼지 않음.
    "pat_total": len(pats),
    "pat_reg": sum(1 for p in pats if p.get("status") == "registered"),
}

pubs_sorted = sorted(pubs, key=lambda p: p.get("year", 0), reverse=True)
pats_sorted = sorted(pats, key=lambda p: p.get("year", 0), reverse=True)


def esc(s):
    return str(s).replace("\\", "\\\\").replace('"', '\\"')


def indent_block(text, spaces):
    pad = " " * spaces
    return "\n".join(pad + line if line else pad.rstrip()
                     for line in text.rstrip("\n").split("\n"))


def add_divider(lines, label):
    lines.append("      - layout: divider")
    lines.append(f"        title: \"{esc(label)}\"")


def add_pub_item(lines, p, t):
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


def add_patent_item(lines, p, t, lang):
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


def emit_pub_group(lines, items, label, t):
    if not items:
        return
    add_divider(lines, label)
    for p in items:
        add_pub_item(lines, p, t)


def emit_patent_group(lines, items, label, t, lang):
    if not items:
        return
    add_divider(lines, label)
    for p in items:
        add_patent_item(lines, p, t, lang)


def build_block(lang):
    t = L[lang]
    lines = [START]

    # ---- 연구실적 요약 (표) ----
    summary_md = (
        f"| | |\n"
        f"|---|---|\n"
        f"| **{t['papers']}** | **{c['pub_total']}** |\n"
        f"| &nbsp;&nbsp;{t['first']} | {c['pub_first']} |\n"
        f"| &nbsp;&nbsp;{t['corr']} | {c['pub_corr']} |\n"
        f"| &nbsp;&nbsp;{t['co']} | {c['pub_co']} |\n"
        f"| **{t['pat_applied']}** | **{c['pat_total']}** |\n"
        f"| &nbsp;&nbsp;{t['registered']} | {c['pat_reg']} |\n"
    )
    lines.append(f"  - title: {t['summary']}")
    lines.append("    layout: text")
    lines.append("    class: cv-summary")
    lines.append("    content: |")
    lines.append(indent_block(summary_md, 6))
    lines.append("")

    # ---- 연구 성과 하이라이트 (highlight: true 인 논문만, 없으면 섹션 생략) ----
    highlighted = [p for p in pubs_sorted if p.get("highlight")]
    if highlighted:
        lines.append(f"  - title: {t['highlights']}")
        lines.append("    layout: list")
        lines.append("    class: cv-onecol")
        lines.append("    content:")
        for p in highlighted:
            add_pub_item(lines, p, t)
        lines.append("")

    # ---- 논문 (국내/국제 소제목으로 구분) ----
    lines.append(f"  - title: {t['pub_section']}")
    lines.append("    layout: list")
    lines.append("    class: cv-onecol")
    lines.append("    content:")
    domestic_pubs = [p for p in pubs_sorted if is_domestic_pub(p)]
    intl_pubs = [p for p in pubs_sorted if not is_domestic_pub(p)]
    emit_pub_group(lines, domestic_pubs, t["domestic"], t)
    emit_pub_group(lines, intl_pubs, t["intl"], t)
    lines.append("")

    # ---- 특허 (국내/국제 소제목으로 구분) ----
    lines.append(f"  - title: {t['pat_section']}")
    lines.append("    layout: list")
    lines.append("    class: cv-onecol")
    lines.append("    content:")
    domestic_pats = [p for p in pats_sorted if not is_intl_patent(p)]
    intl_pats = [p for p in pats_sorted if is_intl_patent(p)]
    emit_patent_group(lines, domestic_pats, t["domestic"], t, lang)
    emit_patent_group(lines, intl_pats, t["intl"], t, lang)
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
print(f"   특허 출원 {c['pat_total']}건 (등록 {c['pat_reg']}건)")
