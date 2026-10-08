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

이력 업데이트 방법과 터미널 명령어는 루트의 [`README.md`](../README.md)에 있다.
