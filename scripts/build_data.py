#!/usr/bin/env python3
"""cv-data/*.yml -> data/cv.json (영문 페이지용). 실행: python3 scripts/build_data.py

- 건수(논문/1저자/특허/등록/그룹별)는 여기서 자동 집계한다.
- 특허 표시 번호: registered -> 등록번호(+등록일), pending -> 출원번호(+출원일)만 노출.
- 특허명 표기: 국내 특허는 "한글 (영문)", 국제 특허는 "영문 (한글)". 한쪽만 있으면 그것만 표시.
- 발명자는 영문 페이지이므로 inventors_en를 그대로 사용한다.
"""
import json, re, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
CV = ROOT / "cv-data"
SELF = ("S.-Y. Min", "민성용")


def load(name):
    with open(CV / name, encoding="utf-8") as f:
        return yaml.safe_load(f)


def people(s):
    return [x.strip() for x in str(s).split(",") if x.strip()]


def patent_title(p):
    ko, en = (p.get("title_ko") or "").strip(), (p.get("title_en") or "").strip()
    first, second = (ko, en) if p["scope"] == "domestic" else (en, ko)
    return f"{first} ({second})" if first and second else first or second


def bullets(text):
    return [re.sub(r"^-\s*", "", l).strip() for l in str(text).splitlines() if l.strip()]


papers_src = load("publications.yml")
patents_src = load("patents.yml")
pres_src = load("presentations.yml")
prof = load("profile_en.yml")
sections = {s["title"]: s for s in prof["sections"]}

papers = [
    {
        "title": p["title"].strip(),
        "authors": people(p["authors"]),
        "venue": p.get("venue", ""),
        "year": p["year"],
        "doi": p.get("doi") or "",
        "role": p.get("role", "co"),
        "scope": p.get("scope", "international"),
    }
    for p in papers_src
]

patents = []
for p in patents_src:
    reg = p["status"] == "registered"
    num = p["registration_number"] if reg else p["application_number"]
    date = p["registration_date"] if reg else p["application_date"]
    patents.append({
        "title": patent_title(p),
        "inventors": people(p["inventors_en"]),
        "number": f"{num} ({date})",
        "year": p["year"],
        "status": p["status"],
        "scope": p["scope"],
    })

count = lambda xs, k, v: sum(1 for x in xs if x[k] == v)
presentations = [
    {"title": x["title"].strip(), "authors": people(x["authors"]), "venue": x["venue"], "year": x["year"],
     "type": x["type"], "scope": x["scope"]}
    for x in pres_src
]

counts = {
    "papers": len(papers),
    "firstAuthor": count(papers, "role", "first"),
    "patentsFiled": len(patents),
    "registered": count(patents, "status", "registered"),
    "intlPapers": count(papers, "scope", "international"),
    "domPapers": count(papers, "scope", "domestic"),
    "intlPatents": count(patents, "scope", "international"),
    "domPatents": count(patents, "scope", "domestic"),
    "intlPresentations": count(presentations, "scope", "international"),
    "domPresentations": count(presentations, "scope", "domestic"),
    "intlRegistered": sum(1 for p in patents if p["scope"] == "international" and p["status"] == "registered"),
    "domRegistered": sum(1 for p in patents if p["scope"] == "domestic" and p["status"] == "registered"),
}

exp = sections["Professional Experiences"]["content"]
edu = sections["Education"]["content"]
proj = sections["Research Experiences"]["content"]
awards = sections["Honors and Awards"]["content"]

site = prof["site"]
data = {
    "person": {
        "name": prof["cv_name"], "title": site["headline"], "org": site["org"],
        "degree": site["degree"], "email": prof["email"], "website": site.get("website", ""),
        "photo": site["photo"], "photoAlt": site["photo_alt"],
    },
    "self": list(SELF),
    "profile": [" ".join(str(t).split()) for t in site["profile"]],
    "counts": counts,
    "experience": [{"period": e["caption"], "title": e["sub_title"], "sub": e["title"], "bullets": e.get("bullets", [])} for e in exp],
    "education": [{"period": e["caption"], "title": e["sub_title"], "sub": e["title"],
                   "bullets": [e["description"].strip()] if e.get("description") else []} for e in edu],
    "interests": bullets(sections["Research Interests"]["content"]),
    "projects": [{"period": e["caption"], "title": e["title"], "sub": e["sub_title"], "bullets": []} for e in proj],
    "skills": sections["Technical Skills"]["content"],
    "awards": [{"k": a["caption"], "v": a["title"], "sub": a.get("sub_title", "")} for a in awards],
    "papers": papers,
    "patents": patents,
    "presentations": presentations,
}

out = ROOT / "data" / "cv.json"
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"wrote {out.relative_to(ROOT)}: {counts}")
