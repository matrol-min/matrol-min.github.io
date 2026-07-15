# CV 웹사이트 — 프로젝트 개요 (Claude Code용)

이 저장소는 [modern-resume-theme](https://github.com/sproogen/modern-resume-theme)
(Jekyll 기반) 을 커스터마이징한 **국문/영문 이중언어 CV 웹사이트**다.
GitHub Pages로 배포되며, 논문·특허 실적은 데이터 파일만 고치면 카운트가 자동 계산된다.

## 핵심 개념 (반드시 이해하고 시작할 것)

1. **디자인은 원본 테마 그대로.** `_sass/`, `_includes/`(일부 제외)는 손대지 않는 게 원칙.
   요청받은 스타일 변경은 되도록 `assets/main.scss` 안에 추가하는 방식으로 처리한다
   (원본 테마 파일을 직접 고치면 나중에 뭘 바꿨는지 추적이 어려워짐).

2. **콘텐츠는 site가 아니라 page 변수에서 읽는다.** 원본 테마는 `site.*`(전역, `_config.yml`)에서
   콘텐츠를 읽지만, 이 프로젝트는 국문/영문 두 페이지를 지원하기 위해 `_layouts/default.html`과
   `_includes/header.html`, `_includes/about.html`을 수정해서 **`page.*`**
   (각 페이지 front matter)에서 읽도록 바꿨다. 그래서 `_config.yml`에는 인적사항이 없고,
   `index.html`(국문)·`en.html`(영문) 맨 위 front matter에 각각 들어있다.

3. **논문/특허는 자동 생성 영역.** `index.html`/`en.html`의 `content_sections:` 안에
   `# <auto:publications>` ~ `# </auto:publications>` 마커로 둘러싸인 부분이 있는데,
   이 안쪽은 `scripts/build_publications.py`가 매번 덮어쓴다. **절대 이 마커 안을 직접
   수정하지 말 것** — 스크립트를 다시 돌리면 사라진다. 섹션을 추가/수정하려면 마커
   바깥(위나 아래)에 하거나, 스크립트 자체를 고친다.

4. **`page.name`은 Jekyll 예약 속성**이라 CV 이름을 넣는 용도로 쓸 수 없다.
   그래서 front matter에는 `name:` 대신 `cv_name:`을 쓴다
   (`_includes/header.html`이 `page.cv_name`을 읽음).

## 파일 구조

```
index.html                 ← 국문 페이지 (인적사항 + 섹션 구성, front matter)
en.html                    ← 영문 페이지 (동일 구조, 영문 라벨)

_data/
  publications.yml         ← 논문 데이터 (단일 소스, 국/영문 공통)
  patents.yml              ← 특허 데이터 (title_ko/title_en, inventors_ko/inventors_en 분리)

_config.yml                ← 사이트 전역 설정만 (다크모드, sass 옵션 등). 인적사항 없음.

_layouts/default.html      ← KO/EN 전환 버튼 + page.content_sections 순회 렌더링 (수정됨)
_includes/
  header.html               ← page.cv_name 등 page.* 사용 (수정됨)
  about.html                ← page.about_* 사용 (수정됨)
  section-list.html         ← 원본 그대로 (항목 여러 개, 좌:제목 / 우:내용 2단)
  section-text.html         ← 원본 그대로 (자유 서술)
  a.html, footer.html 등     ← 원본 그대로

_sass/                     ← 원본 테마 스타일. 손대지 않음.
assets/main.scss           ← 커스텀 스타일 전부 여기에: 폰트(나눔고딕), KO/EN 버튼,
                              논문/특허 배지, 1컬럼 레이아웃(cv-onecol), 인쇄용 CSS

scripts/
  build_publications.py     ← 논문/특허 카운트 계산 + index.html·en.html 자동 구역 갱신
  make_pdf.js                ← 빌드된 사이트를 Puppeteer로 국/영문 PDF 변환

.github/workflows/build.yml ← push 시: 카운트 계산 → Jekyll 빌드 → Pages 배포 → PDF 생성
images/profile.jpg          ← 프로필 사진 (현재 플레이스홀더)
```

## 데이터 스키마

**`_data/publications.yml`** (논문, 국/영문 공통 — 보통 영문 서지 그대로 사용):
```yaml
- year: 2024
  role: first            # first(1저자) / corresponding(교신) / co(공저)
  scope: international   # international(국제, 기본값) / domestic(국내) — 논문 리스트 소제목 구분용
  highlight: true         # (선택) true면 "연구 성과 하이라이트" 섹션에도 같이 뽑힘
  authors: "Hong, G., Kim, S."
  title: "논문 제목"
  venue: "저널명, 권(호), 쪽수"
  doi: "10.xxxx/xxxx"
```

**`_data/patents.yml`** (특허, 국/영문 명칭·발명자 분리):
```yaml
- year: 2024
  status: registered      # registered(등록번호 있음) / pending(출원만)
  title_ko: "국문 명칭"
  title_en: "영문 명칭"
  number: "출원번호 (출원일), 등록 등록번호 (등록일)"   # 등록 시 이 형식
  inventors_ko: "발명자(국문)"
  inventors_en: "발명자(영문)"
```
번호 형식은 국내(`10-YYYY-XXXXXXX`, 사내 관리번호 `PYYYYXXXXXX`)와 국제(PCT/US/EP/JP/CN/TW/GB/DE/IN
등 국가 코드 + 출원번호)가 섞여 있음. 새 항목 추가 시 **같은 국가/유형의 기존 항목 번호 형식을
그대로 따라 적는다.** (특허는 이 번호 접두어로 국내/국제를 자동 판별하지만, 논문은 이런 신호가
없어서 `scope` 필드를 직접 적어줘야 함 — 안 적으면 international로 간주.)

## 카운트/집계 로직 (scripts/build_publications.py)

- 논문: 전체 편수, role별(1저자/교신/공저) 편수를 계산해 "연구실적 요약" 섹션에 반영
  (섹션 제목에 개수 `(N)` 표시는 끔 — 요청에 따라 제거된 상태).
- 특허: 연구실적 요약 표에 **"특허 출원"(등록 포함 전체 건수)**과 **"등록"(그중 등록된 건수)**
  두 줄로 표시 (등록 특허를 출원 수에서 빼지 않음 — 최근 정책). 리스트의 개별 항목 뱃지는
  건별 상태(등록/출원)를 그대로 보여줌 — 요약 표의 "출원"과 별개 개념이니 혼동 주의.
- **국내/국제 구분**: 특허는 `number` 필드의 접두어로 자동 판별
  (`PCT/US/EP/JP/DE/CN/GB/IN/TW`로 시작하면 국제, 그 외는 국내). 논문은 `scope` 필드
  (`domestic`/`international`, 기본값 international)로 판별. 논문/특허 리스트 안에서
  국내 항목 다음에 국제 항목이 오고, 각 그룹 위에 `layout: divider` 항목(소제목, 예: "국내"/"국제")이
  자동으로 붙음. divider 항목은 `_includes/section-list.html` 수정 없이 `item.layout` 값이
  이미 CSS 클래스(`layout-divider`)로 노출되는 걸 이용한 것 — 스타일은 `assets/main.scss`의
  `.cv-onecol .row.layout.layout-divider` 규칙 (자세한 간격/정렬 규칙은 `docs/font-scale.md` 참고).
- **연구 성과 하이라이트**: `publications.yml`에 `highlight: true`가 붙은 논문이 하나라도 있으면
  "연구 성과 하이라이트" 섹션이 연구실적 요약 바로 다음, 논문 목록 앞에 자동 생성됨. 없으면 섹션
  자체가 생략됨 (빈 섹션 안 보여줌).
- 논문/특허 목록은 연도 내림차순 정렬. **동일 연도 안에서는 yaml에 적힌 순서 그대로 유지**
  (안정 정렬이라 파일 내 순서가 표시 순서). 국내/국제로 나뉜 뒤에도 이 순서는 그룹 내에서 유지됨.
- 결과는 `index.html`(한국어 라벨)과 `en.html`(영문 라벨) 양쪽의 자동 구역에 동시 반영됨.
  라벨 텍스트(예: "논문"→"학술 논문", "국제"→"International")를 바꾸려면 스크립트 상단의
  `L = {"ko": {...}, "en": {...}}` 딕셔너리를 수정.

## 스타일 관련 결정 사항 (assets/main.scss)

- **폰트 크기(rem) 참고표**: `docs/font-scale.md`에 원본 테마의 h1~h4/문단 rem 값과, 이 프로젝트가
  `.cv-onecol`(논문/특허)에 커스텀한 값이 정리돼 있음. 폰트 크기 수정 지시가 오면 먼저 이 표를 확인.
  단위는 항상 `rem` (이 테마는 전부 rem 기준이라 `em`을 쓰면 부모 상속 때문에 의도한 크기가 안 나올 수 있음).


- **폰트**: 한글은 나눔고딕(Nanum Gothic, 구글 폰트), 영문은 테마 원본 폰트(Helvetica Neue/Roboto)
  유지. 모든 사람에게 동일하게 보이도록 웹폰트로 강제 지정함.
- **논문/특허는 1컬럼**: 원본 테마의 `list` 레이아웃은 좌(제목)/우(내용) 2단인데, 논문 제목이
  길면 어색해서 `class: cv-onecol`을 섹션에 붙여 1단으로 강제 변환. 제목 한 줄 → 아래 줄에
  저자/서지정보. `scripts/build_publications.py`가 생성하는 논문/특허 섹션에는 이 클래스가
  자동으로 붙는다.
- **Publication Summary**: 원래 테마 표 스타일이 작고 가운데 정렬이라 어색해서, 본문과 동일한
  폰트 크기·왼쪽 정렬로 오버라이드(`cv-summary` 클래스).
- **배지**: 1저자/교신/등록/출원 표시는 `<span class="cv-badge cv-badge-accent">` 등으로 렌더링.
- **인쇄(PDF) 전용 스타일**: `@media print` 블록에 있음. KO/EN 버튼 숨김, 배지를 흑백 테두리로 전환 등.

## 빌드 & 테스트 방법

```bash
# 1) 논문/특허 데이터 수정 후 카운트 재계산 + 자동 구역 갱신
pip install pyyaml
python scripts/build_publications.py

# 2) Jekyll 빌드 (로컬 미리보기)
bundle install
bundle exec jekyll serve     # http://localhost:4000 (국문), /en/ (영문)

# 3) PDF 생성 (선택)
npm install puppeteer
node scripts/make_pdf.js     # cv-ko.pdf, cv-en.pdf 생성
```

push하면 `.github/workflows/build.yml`이 위 과정을 자동으로 실행하고 GitHub Pages에 배포한다.

## 작업 시 지켜야 할 것

- `_sass/`와 원본 `_includes/*.html`(header.html, about.html, default.html 제외)은 되도록
  수정하지 않는다. 스타일 변경은 `assets/main.scss`에 추가.
- 논문/특허 자동 구역(`# <auto:publications>` ~ `# </auto:publications>`) 안쪽을 직접
  편집하지 않는다 — `scripts/build_publications.py`가 재생성하면 사라짐.
- 데이터를 고쳤으면 항상 `python scripts/build_publications.py`를 실행해서 두 페이지의
  자동 구역과 카운트를 갱신한 다음 커밋한다.
- 새 특허/논문 번호 형식은 같은 유형의 기존 항목을 참고해서 일관되게 적는다.
- 국문/영문 두 페이지(`index.html`, `en.html`)에 대응되는 변경은 **항상 양쪽 다** 반영한다
  (섹션 추가, 라벨 변경 등).
