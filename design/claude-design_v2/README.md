# Handoff: Academic CV 웹사이트 — 영문 페이지 (시안 3종)

## Overview
GitHub Pages(정적 HTML/CSS, 빌드 도구 없음)로 운영할 민성용(Sung-Yong Min) 학술 CV의 **영문 페이지** 디자인 시안 3종.
레이아웃 방향이 서로 다른 독립된 완성안이다. **하나를 고른 뒤 그 시안만 구현한다.** 고른 안이 아직 없으면 사용자에게 먼저 묻는다.

- **A — Single column document** (`CV-A.dc.html`): 상단 헤더, 단일 컬럼(max 820px), 흑백, 숫자 스트립과 점선 목차형 점프 링크, 연도별 접기/펼치기.
- **B — Sidebar + body** (`CV-B.dc.html`): 고정(sticky) 좌측 사이드바(신원·Profile·실적 요약·점프 링크), 본문은 타임라인(점+선), 목록은 "Show all N" 펼치기.
- **C — Date-column rows** (`CV-C.dc.html`): 왼쪽 섹션 제목 열 | 오른쪽 내용. 모든 항목이 날짜 열 기준 표형 행. 목록은 "+ N more". 인쇄에서도 2열 유지.

## About the Design Files
번들 안의 파일은 **HTML로 만든 디자인 레퍼런스**다(동작과 모습을 보여주는 프로토타입). 그대로 배포하지 말고,
요구된 산출물 형식 — **단일 `index.html`(영문) + `style.css` + 소량의 vanilla JS** — 로 다시 구현한다.
`.dc.html` 파일은 같은 폴더의 `support.js`가 있어야 브라우저에서 열린다. `Academic CV Options.dc.html`을 열면 3개 시안 × 4개 상태(Desktop 1280 / Mobile 400 / 인쇄 A4 첫 쪽 / 인쇄 A4 목록 쪽)가 캔버스로 보인다.
프로토타입은 인라인 스타일 + JS의 `mode` prop으로 화면/모바일/인쇄를 흉내 냈다. 실제 구현에서는 **CSS 미디어 쿼리(`@media (max-width: 720px)`, `@media print`)** 로 바꾼다.

## Fidelity
**High-fidelity.** 색, 타이포, 간격, 상호작용은 최종값. 픽셀 단위로 재현한다. 콘텐츠는 이름·직위·소속 외 전부 샘플이다.

## 공통 구조 (3안 동일)

### 섹션 순서 (고정)
Profile → Research Summary → Experience → Education → Research Interests → Research Projects → Skills → Awards → Publications(International → Domestic) → Patents(International → Domestic)
(B는 Profile·Summary가 사이드바에 있다. DOM 순서는 위 순서 그대로 두면 모바일/인쇄 1열에서도 순서가 맞다.)

### Anchor id (정확히 이 값)
`#profile` `#summary` `#experience` `#education` `#interests` `#projects` `#skills` `#awards` `#publications` `#patents`
`#intl-papers` `#dom-papers` `#intl-patents` `#dom-patents` — 각 그룹의 h3에 부여.
(프로토타입은 캔버스 안에 여러 인스턴스가 있어 `1a-d-` 같은 접두사를 붙였다. 실제 구현에서는 접두사 없음.)

### Heading 구조
h1 = 이름, h2 = 섹션, h3 = 항목 제목(경력·학력·프로젝트) / 목록 그룹(International Papers 등). 목록 항목은 `<ol><li>`.

### Research Summary
- 지표 4개(샘플): Papers 31 · First-author 10 · Patents filed 153 · Patents granted 70. **값은 데이터에서 자동 집계**(빌드/로드 시 주입, 하드코딩 금지).
- 점프 링크 4개, 순서 고정, 각 링크에 그룹별 건수: International Papers 24 → `#intl-papers`, Domestic Papers 7 → `#dom-papers`, International Patents 108 → `#intl-patents`, Domestic Patents 45 → `#dom-patents`. (논문 국내/국제 값은 샘플)
- 각 목록 그룹 끝에 "↑ Back to summary" → `#summary` (인쇄 시 숨김).

### 논문 / 특허 항목
- 논문: 제목(600, ink) / 저자 — **본인 이름 `<strong>` 700** / `저널 권, 페이지 (연도)` + `doi:` 링크 / 배지(1st author = solid, Corresponding = outline).
- 특허: 제목 / 발명자(본인 굵게) / `번호 · 관청 · 날짜` / 배지(Granted = solid, Filed = outline).
- 각 `li`에 `break-inside: avoid`.

### 접기/펼치기 (화면 전용, 인쇄에 영향 없음)
- A: 그룹 안을 연도별로 묶고, 연도 행이 `<button aria-expanded>` 토글. 기본은 그룹별 최신 연도만 펼침. 표시: 연도(좌) / "N papers" + `+`/`−`(우).
- B: 그룹당 처음 3건 표시, `Show all N ▾` / `Show less ▴` 버튼(outline, accent).
- C: 처음 3건 + 텍스트 버튼 `+ N more` / `Show less`.
- 구현 권장: 모든 항목을 DOM에 렌더하고 숨김은 클래스(`.is-collapsed [data-extra] {display:none}`)로 처리 → `@media print { [data-extra], .is-collapsed * { display: revert !important } }`. `<details>`를 쓸 경우 `beforeprint`에서 전부 `open`, `afterprint`에서 복원.

### 인쇄 (`@media print`)
```css
@page { size: A4 portrait; margin: 18mm; }
nav, .back-link, .toggle, .show-more, .search { display: none !important; }
h2, h3, .group-head { break-after: avoid; }
li, article { break-inside: avoid; }
body { background: #fff; color: #000; }
a { color: inherit; text-decoration: none; }
```
- 연속 페이지(쪽수 제한 없음). 접힌 항목 전부 펼침.
- A: 그대로 단일 컬럼. 숫자 스트립 유지, 점프 링크 화살표 숨김(목차처럼 남김).
- B: 사이드바 → 상단 블록(배경 없음, 아래 1px #1b1e23 선), 지표 타일 4열, 본문 1열. 그룹 밴드는 회색 배경 대신 1px ink 테두리.
- C: 2열 유지(제목 열 128px, 날짜 열 104px, gap 20px). "Go to list" 열 제거.
- 배지: 흑백 — solid → 흰 바탕 + 검정 1px 테두리 + 700 / outline → #8a8f96 테두리 + 600.
- 쪽 머리글/번호는 선택(프로토타입은 아래쪽에 "Sung-Yong Min — CV · 쪽번호"를 예시로 표시).

### 반응형
- 브레이크포인트 720px 이하 = 모바일(검토 기준 폭 400px).
- A: 좌우 패딩 20px, 이름 34px, 지표 2×2, 관심분야/Skills 1열.
- B: 사이드바가 위로 쌓이고(sticky 해제), 패딩 32px 20px.
- C: 모든 2열 그리드 → 1열(날짜가 위로), 헤더 오른쪽 정보 → 왼쪽 정렬.

### 접근성
- 포커스 표시: 모든 링크/버튼 `:focus-visible { outline: 2px solid #3b6fb6; outline-offset: 2px; }`
- 토글 버튼 `aria-expanded`. 내비 `<nav aria-label="Sections">`(A).
- 링크 텍스트 색 #2f5f9e(흰 바탕 대비 ≥ 5:1). #3b6fb6는 배지 배경/포커스/점에만.

## Design Tokens

### Color (light)
| token | value | 용도 |
|---|---|---|
| ink | #1b1e23 | 제목, 강조 텍스트, 굵은 구분선 |
| body | #454b54 | 본문 |
| muted | #5b616b (B·C) / #6b717b (A) | 보조 텍스트, 날짜, 메타 |
| rule | #dfe2e6 (A·C) / #dde2e8 (B) | 가는 구분선 |
| accent | #3b6fb6 | 배지 solid, 타임라인 점, 포커스 |
| accent-text | #2f5f9e | 링크, B의 직함·숫자 |
| accent-line | #9db8df | B 섹션 밑줄, outline 배지 테두리 |
| accent-soft | #c9d7ec | B 타임라인 선, 태그 테두리 |
| accent-tint | #e4ecf7 | B 건수 pill 배경 |
| surface-2 | #f2f4f7 | B 사이드바, 그룹 밴드 |
| bg | #ffffff | |

### Color (dark — 프로토타입에는 미표시, 같은 토큰 구조로 `@media (prefers-color-scheme: dark)`)
ink #eceef1 · body #c3c8cf · muted #9aa1ab · rule #2e333a · bg #15181c · surface-2 #1d2127 · accent #6f9be0 · accent-text #8fb3ea · accent-line #3c5a85 · accent-soft #2c4363 · accent-tint #1f2e44. 인쇄에는 항상 light.

### Typography — 최소 크기 기준 (3안 공통, 필수)
단위는 **rem**(1rem = 16px). 사용자 글자 크기 설정·200% 확대에서도 깨지지 않게 고정 높이/`nowrap` 금지, 그리드는 `minmax(0,1fr)`.

| 용도 | 화면 | 인쇄(A4) |
|---|---|---|
| 본문·소개·경력 설명 | ≥ 1rem (16–18px) | ≥ 11pt (최소 10pt) |
| 논문/특허 서지정보·항목 | ≥ 0.9375rem (15px, 권장 16) | ≥ 10pt |
| 배지·날짜·번호·캡션·Back 링크 | ≥ 0.875rem (14px, 절대 하한) | ≥ 9pt (절대 하한) |
| 항목 제목 | ≥ 본문 (16–18px) | ≥ 본문 |
| 섹션 제목 / 이름 | 22–28px / ≥ 32px | 14–16pt / ≥ 20pt |

하한은 한곳에서 정의하고, 반응형 축소·`clamp()`에서도 하한 아래로 내려가지 않게 한다:
```css
:root {
  --fs-min: 0.875rem;   /* 14px — 보조 텍스트 절대 하한 */
  --fs-list: 0.9375rem; /* 15px — 서지정보 */
  --fs-body: 1rem;      /* 16px */
  --fs-item: 1.0625rem; /* 17px — 항목 제목 */
  --fs-h2: 1.375rem;    /* 22px (B 본문 1.5rem) */
  --fs-name: clamp(2rem, 1.4rem + 2.5vw, 3rem); /* ≥ 32px */
  --lh-body: 1.55; --lh-list: 1.45;
  --measure: 75ch;      /* 한 줄 ≈ 45–80자 */
}
@media print {
  :root { --fs-min: 9pt; --fs-list: 10pt; --fs-body: 11pt; --fs-item: 11pt; --fs-h2: 15pt; --fs-name: 24pt; }
}
.caption, .badge, .date, .num, .back-link { font-size: max(var(--fs-min), 0.875em); }
```
- 줄 간격: 본문 1.55, 목록 항목 1.45 (≥ 1.4). 본문·항목 텍스트 블록에 `max-width: var(--measure)`.
- **인쇄에서 쪽수를 맞추려고 글자를 줄이지 않는다.** 논문 31편·특허 153건이 길어도 10pt 이상 유지하고 쪽수가 늘어나게 둔다.
- 프로토타입 값: 섹션 제목 화면 1.375rem(B 본문 1.5rem) / 인쇄 1.25rem(=15pt), 서지 메타 0.9375rem, 배지·지표 라벨 0.875rem.
- A: 제목 **Poppins** 500/600, 본문 **Source Sans 3** 400/600/700. h1 2.875rem(모바일 2.125) 600 −0.01em · h2 1.375rem 600 uppercase 0.08em + 아래 1px 선 · h3 1.0625–1.125rem 600 · 지표 숫자 2.375rem 600 · 지표 라벨 0.875rem uppercase 0.06em · 메타 0.9375rem · 배지 0.875rem.
- B: 제목 **Montserrat** 600/700, 본문 **Source Sans 3**. h1 2.125rem(모바일 2) · 사이드바 h2 1.375rem 600 + 1px #9db8df 선 · 본문 h2 1.5rem 600 + 1px #9db8df 선 · h3 1rem 600 · 지표 숫자 1.75rem 600 accent-text · 메타 0.9375rem italic.
- C: 전부 **IBM Plex Sans** 400/500/600/700 (한글 페이지 시 IBM Plex Sans KR로 자연 확장). h1 3rem(인쇄 2.375, 모바일 2.125) 600 −0.02em · h2 1.375rem 600(왼쪽 열, 길면 2줄) · h3 1–1.0625rem 600 · 지표 숫자 2rem 600 · 날짜 0.875rem tabular-nums.
- 숫자는 모두 `font-variant-numeric: tabular-nums`.
- 폰트 스택 예: `'Source Sans 3', system-ui, -apple-system, 'Segoe UI', sans-serif`. 한글 페이지에서는 `:lang(ko)`에서 스택만 교체(Pretendard / Noto Sans KR 등).

### Spacing / shape
- 섹션 간격 44px(A·B), C는 섹션마다 padding 28px 0 + 아래 1px 선.
- 항목 간격 14–22px. 그룹 머리 위 2px ink 선(A·C), B는 패딩 10px 14px 밴드(radius 4).
- Radius: 배지 3px(A) / pill 999px(B) / 0(C). 지표 타일(B) 6px. 그림자 없음.
- 레이아웃 폭: A max 820px · B 사이드바 340px + 본문(padding 48px) · C max 1080px, 제목 열 200px, 날짜 열 132px, 목록 연도 52px + 번호 36px.

## Data & i18n
- `cv-data.js`에 라벨(`LABELS.en`)과 샘플 데이터(`DATA`), 뷰 모델 빌더(`view()`)가 모여 있다. 이 구조를 그대로 따른다:
  - 실제 데이터: `cv-data/*.yml` → (GitHub Actions 등에서) JSON 변환 → `index.html`에서 fetch 후 렌더.
  - 라벨은 `labels.en.json` / 추후 `labels.ko.json` 한 곳에. 마크업에 섹션 제목을 하드코딩하지 않는다.
  - 레이아웃은 언어별로 복제하지 않는다. `<html lang="en">` 과 폰트 스택만 바꾼다. KO/EN 전환 UI는 지금 만들지 않음(헤더 오른쪽에 자리만).
- 집계: papers = 전체 논문 수, firstAuthor = `first: true` 수, patentsFiled = 전체 특허 수, patentsGranted = `status: granted` 수, 그룹별 건수 = 각 리스트 길이.
- 공개 정보는 이름·직위·이메일만(전화번호 없음).

## Files
- `Academic CV Options.dc.html` — 3안 비교 캔버스(진입점)
- `CV-A.dc.html`, `CV-B.dc.html`, `CV-C.dc.html` — 각 시안. `mode` prop: `desktop` | `mobile` | `print1` | `print2`
- `cv-data.js` — 라벨, 샘플 데이터, 뷰 모델 빌더
- `support.js`, `image-slot.js` — 프로토타입 런타임(구현에는 불필요)
- `screenshots/` — 시안별 `desktop` / `mobile` / `print-page1` / `print-list` PNG 12장 (사진 자리는 placeholder 상태)
- `reference/` — 원본 요구사항 문서(`design-prompt-draft.md`)와 참고 PNG 4장

### 프로필 사진 (필수, 3안 공통)
- 파일 경로는 **한 곳**에서 지정: `cv-data.js`의 `DATA.person.photo = 'cv-data/SYMin-050.jpeg'` (실제 구현에서는 `profile.yml`의 `photo` 필드). `alt`도 같은 곳: `photoAlt: 'Portrait of Sung-Yong Min'`.
- 마크업: `<img class="photo" src="cv-data/SYMin-050.jpeg" alt="Portrait of Sung-Yong Min" width="152" height="152" decoding="async">`, CSS `object-fit: cover; aspect-ratio: 1; `.
- 크롭/크기 (모바일은 크기만 축소, 인쇄에도 표시):
  - A: 헤더 왼쪽 **원형**, 9.5rem / 모바일 7.5rem / 인쇄 7rem. 6px #f2f4f7 테두리.
  - B: 사이드바 맨 위 **원형**, 10rem / 모바일 8rem / 인쇄 7rem. 6px #fff 테두리(인쇄는 테두리 없음 가능).
  - C: 헤더 왼쪽 **정사각**, radius 4px, 9rem / 모바일 6.5rem / 인쇄 6.5rem.
- 플레이스홀더: 파일이 없거나 로드 실패(`onerror`) 시 같은 크기·크롭의 회색(#f2f4f7) 박스 + 이니셜 "SM"(ink #5b616b, 600) 또는 사람 아이콘을 보이고 `alt`는 유지. 레이아웃이 밀리지 않도록 박스 크기는 고정.
  ```js
  img.addEventListener('error', () => img.replaceWith(placeholderEl), { once: true });
  ```
- 인쇄: `img { break-inside: avoid; }`, 흑백 출력 대비 그대로(필터 없음).
- 프로토타입에서는 같은 경로를 먼저 확인하고, 파일이 없으면 드래그&드롭 placeholder("Photo")를 보여준다.

## Assets
프로필 사진 `cv-data/SYMin-050.jpeg`(사용자 제공, 번들에는 미포함 — 저장소의 해당 경로에 둔다. 정사각에 가까운 600px 이상 권장). 아이콘 없음. 폰트는 Google Fonts(Poppins, Montserrat, Source Sans 3, IBM Plex Sans). 외부 의존을 줄이려면 고른 안의 폰트만 self-host(woff2)하고 system-ui 폴백 유지.
