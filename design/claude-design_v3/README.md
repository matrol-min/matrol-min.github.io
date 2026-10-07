# Handoff: Academic CV — 영문 페이지 최종안 (C v3)

GitHub Pages(정적, 빌드 도구 없음)로 운영할 민성용(Sung-Yong Min) 학술 CV의 **영문 페이지** 최종 디자인. 레이아웃은 **C — Date-column rows** 하나로 확정.
**먼저 `CHANGES.md`를 읽을 것** — 주요 변경점과 구현 전 확인할 사항이 있다.

## 산출물 형식
번들의 `.dc.html`은 **디자인 레퍼런스(프로토타입)** 다. 그대로 배포하지 말고 **`index.html` + `style.css` + 소량의 vanilla JS**로 다시 구현한다.
프로토타입은 인라인 스타일과 `mode` prop(`desktop` | `mobile` | `print1` | `print2`)으로 상태를 흉내 냈다. 실제 구현은 `@media (max-width: 720px)`, `@media print`로 바꾼다.
Fidelity: **High** — 색·타이포·간격·상호작용은 최종값. 콘텐츠는 이름·직위·소속 외 전부 샘플.

## Files
- `CV-C Preview.dc.html` — 4개 상태(Desktop 1280 / Mobile 400 / 인쇄 A4 첫 쪽 / 인쇄 A4 목록 쪽) 캔버스. 브라우저로 열기(같은 폴더의 `support.js` 필요).
- `CV-C.dc.html` — 최종 시안 본체.
- `cv-data.js` — 라벨(`LABELS.en`), 샘플 데이터(`DATA`, YAML과 같은 필드명), 뷰 모델(`view()`).
- `support.js`, `image-slot.js` — 프로토타입 런타임(구현에는 불필요).
- `screenshots/` — `desktop.png`, `mobile.png`, `print-page1.png`, `print-list.png`.
- `reference/` — 요구사항 원문 `design-prompt-draft.md`, `design-prompt-v3.md`.
- `CHANGES.md` — 변경점 + 확인 필요 사항.

## 구조
### 섹션 순서 (고정)
Profile → Research Summary → Experience → Education → Research Interests → Research Projects → Skills → Awards → (sticky 점프 바) → Publications(International → Domestic) → Patents(International → Domestic)

### Anchor id
`#profile` `#summary` `#experience` `#education` `#interests` `#projects` `#skills` `#awards` `#publications` `#patents`, 그룹 h3에 `#intl-papers` `#dom-papers` `#intl-patents` `#dom-patents`. (프로토타입의 `2a-d-` 같은 접두사는 캔버스용, 실제 구현에서는 없음.)

### Heading
h1 = 이름, h2 = 섹션(왼쪽 열), h3 = 항목 제목 / 목록 그룹. 목록은 `<ol>`(`list-style:none`) `<li>`.

### 레이아웃
- 컨테이너 max 1080px, 패딩 64px 48px 96px(모바일 32px 20px 56px).
- 섹션 = 그리드 `200px minmax(0,1fr)`, gap 32px, padding 28px 0, 아래 1px #dfe2e6.
- 경력·학력·프로젝트 행 = `132px minmax(0,1fr)`(날짜 | 내용).
- 목록 항목 = `52px minmax(0,1fr)`(연도 | 내용). 번호 열 없음.
- 그룹 머리: 위 2px ink 선, 아래 1px ink 선, 오른쪽에 "N papers/patents".
- 헤더: 정사각 사진(radius 4px, 9rem / 모바일·인쇄 6.5rem) | 이름·직함 | 소속·학위·이메일(오른쪽 정렬), 아래 3px ink 선.
- 모바일: 모든 2열 그리드 → 1열(날짜가 위로), 지표 2×2, 헤더 정보 왼쪽 정렬.

### Research Summary
- 지표 4개: Papers · First-author · Patents filed · Registered patents. 위아래 1px ink 선, 숫자 2rem 600 tabular-nums, 라벨 0.875rem muted.
- 점프 표 4행: 그룹명 | 건수 | "Go to list →"(인쇄 시 열 제거).

### 목록 항목
- 논문: 제목(600 ink) / 저자(본인 `S.-Y. Min` `<strong>` 700) / `venue` + (doi 있을 때만) `doi:` 링크 + 배지.
- 특허: 제목 / 발명자(본인 굵게) / `number` 문자열 + 배지.
- 배지: 0.875rem, padding 0 6px, radius 0. solid = #3b6fb6 배경 흰 글자, outline = #9db8df 테두리 #2f5f9e 글자.
- 연도 표시·구분선, sticky 점프 바, 접기 규칙은 `CHANGES.md` 5–6번.
- 각 그룹 끝: `+ N more`/`Show less`(텍스트 버튼, `aria-expanded`) · "↑ Back to summary" → `#summary`. 둘 다 인쇄 숨김.
- 구현 권장: 모든 항목을 DOM에 렌더하고 숨김은 클래스로 → 인쇄에서 `display: revert !important`.

### 인쇄
```css
@page { size: A4 portrait; margin: 18mm; }
nav, .back-link, .toggle, .jump-col { display: none !important; }
h2, h3, .group-head { break-after: avoid; }
li, article, img { break-inside: avoid; }
body { background: #fff; color: #000; }
a { color: inherit; text-decoration: none; }
```
2열 유지(제목 열 128px, 날짜 열 104px, gap 20px), 연속 페이지, 접힌 항목 전부 펼침, 배지 흑백. **쪽수를 맞추려고 글자를 줄이지 않는다.**

## Design Tokens
| token | value | 용도 |
|---|---|---|
| ink | #1b1e23 | 제목, 강조, 굵은 선 |
| body | #454b54 | 본문 |
| muted | #5b616b | 날짜, 메타 |
| rule | #dfe2e6 | 가는 선 |
| rule-year | #8a8f96 | 연도 경계선, 인쇄 outline 배지 |
| accent | #3b6fb6 | solid 배지, 포커스 |
| accent-text | #2f5f9e | 링크, pill 글자 |
| accent-line | #9db8df | outline 배지 |
| accent-tint | #e4ecf7 | 건수 pill 배경 |
| bg | #ffffff | |

Dark(`prefers-color-scheme: dark`, 인쇄는 항상 light): ink #eceef1 · body #c3c8cf · muted #9aa1ab · rule #2e333a · bg #15181c · accent #6f9be0 · accent-text #8fb3ea · accent-line #3c5a85 · accent-tint #1f2e44.

### Typography — IBM Plex Sans 400/500/600/700
| 용도 | 화면 | 인쇄 |
|---|---|---|
| 본문 | 1rem, lh 1.55 | 11pt |
| 서지 메타 | 0.9375rem, lh 1.45 | 10pt |
| 배지·날짜·캡션·Back | 0.875rem (절대 하한) | 9pt |
| 항목 제목 | 1rem 600 | 11pt |
| h2 | 1.375rem 600 | 1.25rem(15pt) |
| h1 | 3rem 600 −0.02em (모바일 2.125, 인쇄 2.375) | |
```css
:root { --fs-min: .875rem; --fs-list: .9375rem; --fs-body: 1rem; --fs-h2: 1.375rem;
  --fs-name: clamp(2.125rem, 1.4rem + 2.5vw, 3rem); --measure: 75ch; }
@media print { :root { --fs-min: 9pt; --fs-list: 10pt; --fs-body: 11pt; --fs-h2: 15pt; --fs-name: 24pt; } }
```
숫자 `tabular-nums`. rem 단위, 고정 높이·`nowrap` 금지, 그리드 `minmax(0,1fr)`, 텍스트 블록 `max-width: 75ch`.

### 접근성
`:focus-visible { outline: 2px solid #3b6fb6; outline-offset: 2px; }` · 토글 `aria-expanded` · 링크 #2f5f9e(대비 ≥ 5:1) · `<html lang="en">`.

## Data
- 실제 데이터: `cv-data/*.yml` → JSON(빌드/Actions) → `index.html`에서 fetch 후 렌더. 라벨은 `labels.en.json` 한 곳.
- 필드: papers `{title, authors[], venue, year, doi, role: first|corresponding|co, scope: international|domestic}`, patents `{title, inventors[], number, year, status: registered|pending, scope}`.
- 집계(하드코딩 금지): Papers = 논문 수, First-author = `role: first` 수, Patents filed = 특허 수, Registered patents = `status: registered` 수, 그룹 건수 = `scope`별 수.
- 사진: `profile.yml`의 `photo: cv-data/SYMin-050.jpeg`, `alt: Portrait of Sung-Yong Min`. `<img width="152" height="152" style="object-fit:cover;aspect-ratio:1">`, 로드 실패 시 같은 크기 #f2f4f7 박스 + "SM".
- 공개 정보는 이름·직위·이메일만.
