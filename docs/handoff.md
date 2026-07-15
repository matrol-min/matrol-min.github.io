# 작업 인수인계 (2026-07-15 세션)

이 문서는 이번 세션에서 한 작업을 다른 컴퓨터/세션에서 이어가기 위한 참고용 기록입니다.
**아직 아무것도 git commit 되지 않았습니다** — 아래 "Git 상태" 참고.

## 오늘 한 일 요약

1. **인적사항 반영** (`index.html`, `en.html` front matter)
   - 이름: 민성용 (Sung-Yong Min), 직함: Ph.D., 이메일: matrol.min@gmail.com
   - 전화번호는 공개 페이지 노출 리스크 때문에 **넣지 않기로 결정** (필요하면 별도 PDF에만)
   - `website` 필드는 **비워둠** (CV 자체가 그 주소라 자기 링크가 중복이라 판단)
   - `github_username` / `linkedin_username` / `orcid_username` / `googlescholar_username`은
     아직 실제 계정이 없어서 **주석 처리**만 해둠 (나중에 채워서 주석만 풀면 됨)
   - 프로필 사진, About 소개 문구는 **플레이스홀더 그대로 유지** (사용자가 나중에 직접 교체 예정)
   - 경력/학력/수상 섹션 내용도 **플레이스홀더 유지** (형태 참고용, 사용자가 나중에 직접 채움)

2. **섹션 구조 재편** — 겹치는 후보들(주요 성과/연구 성과 하이라이트/실적 요약)을 정리해서:
   - "주요 성과"(사내 전용 개념)는 **별도 섹션으로 안 만들고 경력(Experience) 설명에 녹이기로 결정**
     (아직 미반영 — 경력 내용 자체가 플레이스홀더라 나중에 실제 경력 채울 때 같이 반영 필요)
   - "연구 성과 하이라이트"는 `publications.yml`의 `highlight: true` 플래그로 **자동화**
   - 최종 섹션 순서: 경력 → 학력 → 연구 관심 분야(신규) → [자동: 연구실적 요약 → 연구 성과
     하이라이트 → 논문 → 특허] → 연구 프로젝트(신규) → 기술 역량(기존 "기술 스택"에서 개명) → 수상
   - "연구 관심 분야", "연구 프로젝트"는 신규 섹션으로 추가했고 **내용은 플레이스홀더** (사용자가 채울 것)

3. **`scripts/build_publications.py` 대폭 수정**
   - **버그 수정**: 특허 카운트가 "출원"이라는 라벨 아래 `status==pending`인 것만 세고 있었음
     (등록된 것 제외). CLAUDE.md에 문서화된 정책("출원=등록 포함 전체, 특허=그중 등록건")과
     실제 코드가 어긋나 있던 것 — 이제 "특허 출원"=전체(`pat_total`), "등록"=그 중 등록건(`pat_reg`)으로
     맞춤. 실제 데이터 기준 특허 출원 153건, 등록 70건으로 정상 집계됨.
   - **국내/국제 소제목 분리**: 논문/특허 리스트 안에 `layout: divider` 항목(소제목)을 자동 삽입해서
     국내 그룹 → 국제 그룹 순으로 보여줌.
     - 특허: `number` 필드 접두어로 판별 (`PCT/US/EP/JP/DE/CN/GB/IN/TW` → 국제, 그 외 국내)
     - 논문: 새 `scope` 필드 (`domestic`/`international`, 기본값 international) — **기존 논문
       데이터에는 이 필드가 없으니, 실제 논문 채울 때 각 항목에 `scope`를 꼭 추가해야 함**
   - **연구 성과 하이라이트 자동화**: `publications.yml` 항목에 `highlight: true`를 추가하면
     그 논문만 모아 "연구 성과 하이라이트" 섹션이 자동 생성됨 (하이라이트 항목이 하나도 없으면
     섹션 자체가 생략됨 — 지금은 예시로 1개 논문에 `highlight: true` 넣어둠).
   - Windows 콘솔(cp949)에서 한글 print가 깨져서 스크립트가 죽는 문제 수정 (`sys.stdout.reconfigure`)

4. **`layout: divider` 구현 방식** — `_includes/section-list.html` 등 원본 테마 파일은
   **전혀 수정하지 않음**. `item.layout` 값이 이미 CSS 클래스(`layout-{{item.layout}}`)로
   그대로 노출되는 걸 이용해서 `assets/main.scss`에 `.cv-onecol .row.layout.layout-divider` 스타일만
   추가. (처음엔 section-list.html 수정이 필요하다고 잘못 판단했었는데, 실제로는 필요 없었음.)

5. **`assets/main.scss` 디자인 수정 여러 건** (`.cv-onecol` = 논문/특허 섹션 한정)
   - 서지정보(저자·연도·서지 등) 글자 크기: `1.6rem` (테마의 기본 문단 크기와 동일하게 통일.
     원래 `0.95em`으로 축소돼 있던 게 너무 작다는 피드백으로 수정)
   - 논문/특허 제목(h4): `2rem` (원본 테마 h4 기본값 2.5rem보다 한 단계 작게)
   - 제목-본문 사이 여백: 원본 테마의 `.details { margin-bottom: 2rem }`(2단 레이아웃 전제)을
     `.cv-onecol` 안에서 무력화해서 세로 배치에 맞게 줄임
   - Bootstrap `.row`의 기본 `-15px` 마진이 컬럼 패딩 제거와 겹쳐서 본문이 섹션 제목보다
     왼쪽으로 밀려나던 문제 수정 (`margin-left/right: 0 !important` 추가)
   - 767px 이하에서 텍스트를 가운데 정렬로 바꾸는 원본 테마의 반응형 규칙을 눌러서 항상 좌측 정렬 유지
   - divider(소제목) 색상은 기존에 이미 쓰이던 강조색 `#477dca` 재사용 (임의로 고른 색 아님)
   - **단위는 항상 `rem`** (이 테마는 전부 rem 기준, em을 쓰면 부모 상속 때문에 의도한 크기가 안 나옴 —
     오늘 실제로 이 문제로 한 번 헤맴)
   - **아직 안 한 것**: divider 소제목 색깔을 사용자가 "일단 넘어가고 나중에 수정하자"고 함
     (지금은 `#477dca` 그대로, 나중에 다른 색으로 바꿀 수도 있음)

6. **새 참고 문서 작성**
   - `docs/font-scale.md`: 테마의 실제 rem 폰트 스케일 표 + `.cv-onecol` 커스텀 값 + 간격/정렬 규칙.
     폰트/간격 수정 지시할 때 이 표를 먼저 참고하면 됨.
   - `CLAUDE.md`에도 이 문서 존재와 `scope`/`highlight` 필드, divider 구현 방식을 반영해둠.

7. **`_data/publications.yml`**: 아직 예시 데이터 그대로 (사용자가 나중에 실제 논문으로 교체 예정).
   구조 검증용으로 `scope: domestic/international`, `highlight: true` 필드를 예시 3개 항목에 추가해둠.

8. **`_data/patents.yml`**: 이전 세션(어제, 2026-07-14)에 이미 실제 특허 데이터로 채워져 있었음
   (153건, git상 아직 미커밋 상태). 오늘 세션에서는 내용은 안 건드리고 집계 로직만 고침.
   - **참고**: 일부 항목의 `title_en`이 실제 영문 번역이 아니라 국문 원문이 그대로 들어가 있음
     (예: "마이크로 LED 칩 및 이의 제조 방법 {MICRO LIGHT EMITTING DIODE CHIP...}"). 영문 페이지에서
     이 항목들은 국문으로 노출됨 — 나중에 영문 번역 채우면 자동 반영됨. 오늘 작업 범위 밖이라 손대지 않음.

## 검증한 것 / 안 한 것

- 검증함: `build_publications.py` 정상 실행, front matter YAML 파싱 정상, 섹션 순서 정상,
  국내/국제 특허 카운트(국내 45 + 국제 108 = 153) 합산 일치.
  또한 `.cv-onecol` divider 스타일은 실제 `_sass`를 dart-sass로 로컬 컴파일해서
  (`npx sass --load-path=_sass`) 정적 목업으로 브라우저에서 직접 확인.
- **검증 못 함**: 이 컴퓨터에 Ruby/Jekyll이 없어서(`ruby`, `bundle` 명령 없음) `bundle exec jekyll serve`로
  실제 사이트 전체를 로컬 렌더링해서 보지는 못했음. Node.js는 있어서 sass만 별도 컴파일해 CSS 목업으로
  검증한 것. **다른 컴퓨터에 Ruby가 있다면 `bundle install && bundle exec jekyll serve`로 최종
  확인 권장.**
- PDF 생성(`node scripts/make_pdf.js`)은 이번 세션에서 시도 안 함.

## Git 상태 (이 세션 종료 시점)

- 아직 **아무것도 커밋 안 됨**. `git status --short` 기준 변경 파일:
  `_data/patents.yml`(수정, 어제 세션분), `_data/publications.yml`(수정),
  `assets/main.scss`(수정), `en.html`(수정), `index.html`(수정), `scripts/build_publications.py`(수정)
- 새 파일(미추적): `CLAUDE.md`, `docs/`(이 문서 포함), `.omc/`
- **정리 안 된 임시 파일**: `_data/patents_260714.yml`, `_data/patents_260714b.yml`,
  `_data/patents_add.yml` — 어제 세션의 백업/초안으로 추정, 사용자가 "일단 무시하고 둬" 라고 해서
  안 건드림. 나중에 필요 없으면 삭제하면 됨.
- `template/` 폴더: 원본 테마(`sproogen/resume-theme`) 참고용 예제 사본. 프로젝트 코드가 아니라
  디자인 룰 대조용으로 있음 (오늘 확인해보니 `_sass`가 없어서 실제 대조엔 못 씀 — 우리 `_sass`가
  이미 원본 그대로임을 확인).

## 다음에 할 일 (남은 작업)

1. `_data/publications.yml`을 실제 논문 데이터로 교체 (각 항목에 `scope` 필드 꼭 추가,
   대표 논문엔 `highlight: true`)
2. 경력/학력/수상/연구 관심 분야/연구 프로젝트/기술 역량 섹션의 실제 내용 채우기
   (지금은 전부 플레이스홀더). 경력 채울 때 "주요 성과"(사내 성과) 내용을 경력 설명에 녹이기로
   했던 것도 같이 반영.
3. 특허 `title_en`이 국문으로 남아있는 항목들 영문 번역 채우기 (선택, 급하지 않음)
4. GitHub/LinkedIn/ORCID/Google Scholar 아이디 확보되면 front matter의 주석 풀고 채우기
5. 프로필 사진 실제 파일로 교체
6. divider 소제목 색깔 재검토 (사용자가 나중에 다시 보자고 함)
7. `_data/patents_260714*.yml`, `patents_add.yml` 백업 파일 정리 여부 결정
8. Ruby/Jekyll 있는 환경에서 `bundle exec jekyll serve`로 최종 렌더링 확인
9. 확인 끝나면 git add/commit (지금까지 전부 미커밋 상태)
