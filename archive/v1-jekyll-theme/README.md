# CV — 국문/영문 (GitHub Pages + 자동 카운트 + PDF)

[modern-resume-theme](https://github.com/sproogen/modern-resume-theme) 디자인 그대로,
**국문/영문 두 페이지**를 만들고 상단 **KO / EN 버튼**으로 전환합니다.
논문/특허는 데이터 파일에만 적으면 **카운트가 자동 계산**되고, 두 언어 모두에 반영됩니다.

- 국문(기본): `https://<아이디>.github.io/`
- 영문: `https://<아이디>.github.io/en/`

## 평소 사용법

### 논문 추가 — `_data/publications.yml`

```yaml
- year: 2025
  role: first            # first(1저자) / corresponding(교신) / co(공저)
  authors: "Hong, G., ..."
  title: "논문 제목"
  venue: "저널/학회, 권(호), 쪽"
  doi: "10.xxxx/xxxx"
```

논문 제목/저자는 보통 영문 표기 그대로 두 페이지에 공통으로 씁니다.

### 특허 추가 — `_data/patents.yml`

```yaml
- year: 2025
  status: registered     # registered(등록) / pending(출원)
  title_ko: "특허 명칭(국문)"
  title_en: "Patent title (English)"
  number: "10-1234567"
  inventors_ko: "홍길동"
  inventors_en: "G. Hong"
```

특허는 국/영문 명칭을 따로 적습니다.

저장 → 푸시 → 끝. 두 페이지의 카운트 표·섹션 제목 `(N)`·목록이 모두 자동 갱신되고,
국문/영문 PDF도 자동 생성됩니다(Actions → Artifacts → cv-pdf).

### 인적사항/일반 섹션 수정

- 국문: `index.html` 의 front matter (맨 위 `---` 사이)
- 영문: `en.html` 의 front matter

About / Experience(경력) / Education(학력) / Awards(수상) 등은 여기서 직접 고칩니다.
논문·특허 자동 구역(`# <auto:publications>` ~ `# </auto:publications>`)은 건드리지 마세요.

## 최초 1회 설정

1. 깃헙 저장소 생성 (개인 페이지면 이름을 `<아이디>.github.io`)
2. 이 폴더 전체 푸시
3. **Settings → Pages → Source** 를 **GitHub Actions** 로 설정
4. 끝. 이후 `main` 푸시마다 자동 빌드·배포·PDF 실행

## 로컬 미리보기

```bash
pip install pyyaml
python scripts/build_publications.py
bundle install
bundle exec jekyll serve    # http://localhost:4000 (국문), /en/ (영문)
```

## 섹션을 직접 추가하기

`index.html`(국문) / `en.html`(영문) 의 front matter 안 `content_sections:`
목록에 항목을 추가하면 됩니다. 단, 논문/특허 자동 구역
(`# <auto:publications>` ~ `# </auto:publications>`) **사이가 아닌 위나 아래**에 넣으세요.
(자동 구역은 빌드할 때마다 스크립트가 덮어씁니다.)

**리스트형** (경력·학력처럼 여러 항목):

```yaml
  - title: 프로젝트
    layout: list
    content:
      - layout: left
        title: 프로젝트 이름
        sub_title: 역할/부제
        caption: 2023 - 2024
        description: |
          설명을 적습니다.
      - layout: left
        title: 두 번째 항목
        caption: 2022
        description: |
          또 다른 설명.
```

**텍스트형** (자유 서술):

```yaml
  - title: 기술 스택
    layout: text
    content: |
      프로그래밍: Python, C++, MATLAB

      언어: 한국어(원어민), 영어(비즈니스)
```

섹션 순서는 목록에 적힌 순서 그대로 페이지에 표시됩니다.
(영문 페이지는 `en.html` 에 같은 방식으로 추가)

## 섹션 제목 바꾸기

**직접 만든 섹션**(경력·학력·수상 등) — 해당 페이지 front matter의 `title:` 수정:

```yaml
content_sections:
  - title: 연구 경력      # ← 여기만 바꾸면 됨
    layout: list
```

국문은 `index.html`, 영문은 `en.html` 에서 각각.

**자동 생성 섹션**(연구실적 요약·논문·특허) — `scripts/build_publications.py`
맨 위 라벨 딕셔너리에서 수정:

```python
"ko": {
    "summary": "연구실적 요약",   # 요약 섹션 제목
    "pub_section": "논문",        # 논문 섹션 제목 (옆의 (N)은 자동)
    "pat_section": "특허",        # 특허 섹션 제목
    ...
"en": {
    "summary": "Publication Summary",
    "pub_section": "Publications",
    ...
```

카운트 `(N)` 은 자동으로 붙으므로 제목 텍스트만 바꾸면 됩니다.

## 폰트

- **한글**: 나눔고딕(Nanum Gothic) — 구글 폰트로 로드되어 모든 OS에서 동일하게 보입니다.
- **영문**: 테마 기본 폰트(Helvetica Neue / Roboto 계열) 유지.

폰트를 바꾸려면 `assets/main.scss` 의 `$cv-font` 변수와 상단 `@import url(...)` 줄을 수정하세요.

## 구조

```
index.html               ← 국문 페이지 (인적사항+섹션, front matter)
en.html                  ← 영문 페이지
_data/publications.yml    ← 논문 (공통)
_data/patents.yml         ← 특허 (국/영문 명칭)
_layouts/default.html     ← KO/EN 버튼 + page.* 기반 렌더링
_includes/header.html, about.html  ← page.* 에서 읽도록 수정됨
_sass/, assets/main.scss  ← 테마 디자인 + 버튼/배지/인쇄 스타일
scripts/
  build_publications.py   ← 카운트 계산 + 두 페이지 자동 구역 생성
  make_pdf.js             ← 국문/영문 PDF 생성
.github/workflows/build.yml ← 자동화
```

## 디자인 관련 참고

테마 원본은 콘텐츠를 `site.*` 전역 변수에서 읽지만, 두 언어 페이지를 위해
`page.*`(각 페이지 front matter)에서 읽도록 `_layouts`/`_includes` 를 수정했습니다.
**디자인(레이아웃·색상·폰트)은 원본 테마 그대로**이며, 데이터 출처만 바뀐 것입니다.
이 때문에 `remote_theme` 대신 테마 파일을 로컬에 포함했습니다.
