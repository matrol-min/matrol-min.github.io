# cv-data — 디자인과 무관한 CV 원본 데이터

| 파일 | 내용 |
|---|---|
| publications.yml | 논문 31편 (year, role, scope, authors, title, venue, doi) |
| patents.yml | 특허 153건 (title_ko/en, inventors_ko/en, scope, status, application_number/date, registration_number/date) — 화면엔 등록건은 등록번호, 출원건은 출원번호만 표시 |
| profile_ko.yml / profile_en.yml | 인적사항 + 경력/학력/연구관심/프로젝트/기술역량/수상 (CV docx에서 옮김. 영문은 한글뿐인 항목 보류) |
| 민성용_CurrVitae_사내용_20260625.docx | CV 원본 |
| SYMin-050.jpeg | 프로필 사진 후보 |

새 사이트는 이 파일들을 입력으로 쓴다. 이전 Jekyll 버전은 ../archive/v1-jekyll-theme/ 참고.

사이트 데이터 빌드: `python3 scripts/build_data.py` → `data/cv.json` (건수 자동 집계 포함). yml 수정 후 반드시 재실행.

---

# 이력 업데이트 방법

main에 푸시하면 GitHub Actions가 건수를 다시 세고 PDF를 새로 만들어 사이트(https://matrol-min.github.io/)에 올린다(1~2분).

## 1. 어디를 고치나

| 고칠 내용 | 파일 |
|---|---|
| 소개 문구, 소속, 학위, 이메일, 사이트 주소, 사진 | `cv-data/profile_en.yml` 맨 아래 `site:` 블록 |
| 경력, 학력, 연구 관심 분야, 연구 프로젝트, 기술 역량, 수상 | `cv-data/profile_en.yml`의 `sections:` 아래 |
| 논문 추가 | `cv-data/publications.yml` 맨 아래에 항목 추가 |
| 특허 추가, 등록 상태 변경 | `cv-data/patents.yml` |
| 화면 문구(섹션 제목, 버튼 글자 등) | `data/labels.en.json` |

### 논문 항목
필드: `year`, `scope`(`international` / `domestic`), `role`(`first` / `corresponding` / `co`), `authors`, `title`, `venue`, `doi`.
- 본인 이름은 `S.-Y. Min`으로 쓰면 자동으로 굵게 표시된다.
- `scope`를 빼먹으면 국제 논문으로 처리된다.
- 화면에서는 `scope`별로 나뉘고, 그 안에서 연도 최신순으로 정렬된다(같은 연도는 파일 순서).

### 특허 항목
필드: `year`, `scope`, `status`, `title_ko`, `title_en`, `inventors_ko`, `inventors_en`, 번호/날짜.
- `status: pending`(출원만): `application_number`, `application_date` **필수**. 화면에는 출원번호가 나온다.
- `status: registered`(등록): `registration_number`, `registration_date`만 있어도 된다(`application_*`는 없어도 읽는 데 문제없음). 화면에는 등록번호가 나온다. 출원번호를 남겨 두고 싶으면 같이 적어도 되지만 화면에는 나오지 않는다.
- 한쪽 언어의 특허명이 없으면 `""`로 비워 둔다(임의 번역 금지). 국내 특허는 `한글 (영문)`, 국제 특허는 `영문 (한글)`으로 표시되고, 한쪽만 있으면 그것만 표시된다.
- 영문 페이지에는 `inventors_en`이 표시된다. 본인(`민성용` 또는 `S.-Y. Min`)은 굵게 표시된다.

### YAML 주의
- 필드는 두 칸 들여쓰고, 새 항목은 `- year:`로 시작한다.
- 문장에 큰따옴표나 콜론이 들어가면 문장 전체를 큰따옴표(`"..."`)로 감싼다.
- 실패하면 대개 YAML 문법 오류다. GitHub의 Actions 탭 로그를 확인한다.

## 2. 터미널 명령어 (순서대로)

```bash
# 0) 프로젝트 폴더로 이동
cd "/Users/syong/Documents/개인 업무/CV/CV_github"

# 1) 파일을 고친 뒤 데이터 다시 만들기 (건수 자동 집계, data/cv.json 갱신)
python3 scripts/build_data.py

# 2) (선택) 화면 확인: 서버를 켠 뒤 브라우저에서 http://localhost:8765/ 열기. 끝낼 때 Ctrl+C
python3 -m http.server 8765

# 3) (선택) PDF를 로컬에서 만들어 보기 -> assets/cv.pdf (Chrome 필요, 커밋되지 않음)
scripts/make_pdf.sh

# 4) 바뀐 내용 확인
git status
git diff --stat

# 5) 커밋 (cv-data의 yml과 갱신된 data/cv.json을 함께 올린다)
git add cv-data data
git commit -m "Update CV: <무엇을 바꿨는지 한 줄>"

# 6) 푸시 -> GitHub Actions가 사이트와 PDF를 자동 갱신
git push origin main

# 7) (선택) 배포 진행 상황 확인
gh run list --limit 3
gh run watch        # 진행 중인 실행을 실시간으로 보기
```

- 화면 문구나 디자인 파일(`data/labels.en.json`, `assets/`, `index.html`)도 고쳤다면 5번에서 `git add cv-data data assets index.html`처럼 함께 추가한다.
- 푸시가 거절되면(원격이 앞서 있을 때) `git pull --rebase origin main` 후 다시 `git push origin main`.
- 푸시 후 사이트가 안 바뀌어 보이면 브라우저 캐시를 비운다(Safari: `Cmd+Option+E` 후 `Cmd+R`).
