# TODO (2026-10-07 갱신)

## 영문 페이지 후속 작업
- [x] (2026-10-07 완료) 특허명 한글/영문 분리·보강, 사내 직급(CL) 삭제, Profile 불릿 반영.
- [ ] **특허 `inventors_en`의 한글 이름**(117건): 영문 페이지에 한글 그대로 표시 중. 영문 표기로 바꿀지 결정.
- [ ] **doi 채우기**: `publications.yml`의 `doi`가 대부분 비어 있어 링크가 거의 안 보임.
- [ ] Skills는 원본이 키 없는 목록이라 불릿으로 표시 중(시안의 Process/Characterization/Tools 3행 구조 아님). 필요하면 yml을 분류형으로 바꾸기.
- [ ] 논문 `role: corresponding` 표기 확인: 현재 데이터엔 `first` 10, `co` 21뿐이고 공동 1저자(`S.-Y. Min+`)는 `co`로 들어 있음.

## 콘텐츠 보강 (사용자 요청 2026-10-06)
- [x] (2026-10-07 완료) **Contact에 사이트 주소 추가**: 헤더 contact 영역(이메일 아래)에 https://matrol-min.github.io/ 링크 표시. `profile_en.yml`의 `site`에 `website` 필드를 추가하고 `build_data.py`/`app.js`에서 렌더.
- [x] (2026-10-07 완료) **Profile**: 사용자가 준 3문단으로 교체(`site.profile`, 문단 리스트). LinkedIn 대조는 필요 시 추가.
- [x] (2026-10-07 완료) **Experience 항목 보강**: 영문 CV(`cv-data/민성용_CurrVitae_사내용_20260625.docx` 등) 내용을 참고해 담당 업무·성과 bullet 추가. 현재는 직책/조직/기간만 있음(`entries()`는 bullets 지원, `build_data.py`의 experience bullets가 빈 배열 → yml에서 읽도록 확장 필요). 이때 '주요 성과'(사내 성과)는 별도 섹션 없이 경력 설명에 녹이기로 한 이전 결정 반영.

## CV 파일(PDF/DOCX) 제공
- [ ] **CV를 docx / pdf로 전환 테스트**: 현재 사이트를 PDF로 인쇄하면 A4 25쪽(Chrome headless `--print-to-pdf`로 확인). docx는 별도 변환 경로 필요(예: HTML→docx 변환 도구 또는 yml→docx 직접 생성) — 품질·서식 비교 후 방식 결정.
- [ ] **사이트에 CV PDF 다운로드 링크 추가**: 헤더 또는 Research Summary 근처에 "Download CV (PDF)" 링크(인쇄 시 숨김).
- [ ] **페이지 갱신 시 업로드된 CV PDF 자동 갱신**: yml 수정 → push 시 GitHub Actions가 `build_data.py` 실행 → 헤드리스 Chrome으로 PDF 생성 → 배포물에 포함(예: `assets/cv.pdf` 또는 Pages 아티팩트). 기존 `.github/workflows/build.yml` 교체 작업과 함께 진행. 최신 PDF가 항상 사이트와 일치하도록 커밋된 PDF를 쓰지 않고 CI에서 생성하는 방식 권장.

## 한글 페이지
- [ ] `data/labels.ko.json` + `profile_ko.yml` 기반 `index.ko.html`(또는 `ko/`) 추가. 레이아웃은 복제하지 말고 `<html lang="ko">` + 폰트 스택(`:lang(ko)`)만 교체. 영문 페이지 헤더에 KO/EN 링크 자리 확보.
- [ ] `build_data.py`를 언어 인자(`--lang ko`)로 확장해 `data/cv.ko.json` 생성(국문 title_ko/inventors_ko 사용).

## 배포 / 정리
- [ ] **GitHub Actions**(`.github/workflows/build.yml`)가 옛 Jekyll 구조(`scripts/build_publications.py`)를 가정함. 새 정적 사이트용으로 교체 필요(Jekyll 빌드 제거, `python3 scripts/build_data.py` 실행 후 루트 그대로 Pages 배포, 필요하면 PDF 단계 유지).
- [ ] `data/cv.json`을 저장소에 커밋할지(현재 그렇게 둠) / CI에서 생성할지 결정.
- [ ] 인쇄 PDF 자동 생성(`node scripts/make_pdf.js`는 옛 구조 기준).
- [ ] 미커밋 상태 정리: `archive/` 이동분(스테이징됨), `design/`, `docs/`, `cv-data/`, 새 사이트 파일. 한 번에 커밋하기 전에 구분해서 나눠 커밋 권장.
- [ ] 배경 파일: `cv-data/patents_260714*.yml`, `patents_add.yml` 백업 정리 여부(이전 인수인계 문서).
- [ ] 폴더명 `claude-design_v2`, `claude-design_v3` 보관 여부 결정(용량 작음, 비교용).

## 특허 데이터 후속 (2026-10-07)
- [x] (2026-10-07 완료) `inventors_ko`의 영문 이름 18건을 한글로 교정(이태우·민성용·김태식·서문도·문현수·안교한).
- [ ] 한글 특허명이 없는 국제 특허 67건(`title_ko: ""`), 영문명이 없는 5건(`title_en: ""`): CV docx에 해당 언어 표기가 없어 비워 둠(임의 번역 금지 원칙). 같은 패밀리의 국내 출원 한글명을 연결할지는 별도 결정 필요.
- [x] (2026-10-07 완료) 한글 폰트: 나눔고딕(400/700) 자체 내장(`assets/fonts/`, 2MB/184조각, 필요한 조각만 로드). 라틴은 IBM Plex Sans, 한글은 나눔고딕. IBM Plex Sans는 아직 구글 폰트 CDN 사용 — 필요하면 같은 방식으로 자체 내장.
