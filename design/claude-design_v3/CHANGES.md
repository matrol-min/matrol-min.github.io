# 주요 변경점 & 확인 필요 사항 (v3, 2026-10-06)

## 주요 변경점 (v2 시안 C → 최종 2a)
1. **번호 열 삭제** — 논문·특허 목록의 `[1]` `[2]` 열 제거. `<ol>` 시맨틱은 유지(`list-style: none`). 항목 그리드 = 연도 52px | 내용(모바일 44px).
2. **배지 = YAML 값**
   - 논문 `role`: `first` → "1st author"(solid) · `corresponding` → "Corresponding"(outline) · `co` → 배지 없음. 논문당 최대 1개.
   - 특허 `status`: `registered` → "Registered"(solid) · `pending` → "Pending"(outline). ("Granted"/"Filed" 폐기)
   - 인쇄: solid → 흰 바탕 + 검정 1px + 700 / outline → #8a8f96 1px + 600.
3. **메타 표기** — 논문은 `venue` 문자열 그대로, `doi`가 있을 때만 링크(없으면 자리 자체를 렌더하지 않음). 특허는 `number` 문자열 그대로, 줄바꿈 허용(`overflow-wrap:anywhere`). `관청 · 날짜` 분리 표기 폐기.
4. **지표·건수** — Papers 31 · First-author 10 · Patents filed 153 · Registered patents 70. 그룹: International Papers 27 · Domestic Papers 4 · International Patents 108 · Domestic Patents 45. 실제 구현에선 데이터에서 집계.
5. **Sticky 점프 바 (B에서 이식)** — Publications 바로 앞 `<nav aria-label="Lists">`, `position: sticky; top: 0`, 흰 배경 + 아래 1px #1b1e23. 링크 4개(라벨 + 건수 pill #e4ecf7 / #2f5f9e / radius 999px), 높이 ≥ 44px. 데스크톱 4열, 모바일 2×2, 인쇄 숨김.
6. **연도 구분 (A에서 이식)** — 그룹 안 최신순 정렬. 연도가 바뀌는 첫 항목에만 날짜 열에 연도(0.9375rem 600 ink) 표시, 그 행 위 1px #8a8f96 선. 같은 연도 항목 사이는 1px #dfe2e6. 화면 기본 노출은 그룹당 최신 3건 + `+ N more` / `Show less`. 인쇄는 전부 펼침.
7. **`cv-data.js` 필드 교체** — papers `{title, authors[], venue, year, doi, role, scope}`, patents `{title, inventors[], number, year, status, scope}`. `first`/`corr`/`granted`/`office`/`date`/`self` 인덱스 제거. 본인 굵게는 이름 `S.-Y. Min` 일치로 판정.

변경하지 않은 것: IBM Plex Sans, 색 토큰, 정사각 사진(헤더 왼쪽), 섹션 순서, 앵커 id, 인쇄 2열 규칙, 최소 폰트 기준표.

## 확인 필요 사항 (구현 전 사용자에게 확인)
1. **특허 번호 안의 한글 "등록"** — 예시 문자열(`10-2011-0100762 (2011.10.04), 등록 10-1374401 (2014.03.07)`)을 그대로 샘플에 넣었다. 영문 페이지에 한글이 섞여 보이고 IBM Plex Sans에 한글 글리프가 없어 폴백 폰트로 렌더된다. YAML 원문을 영문(예: `Registered`)으로 바꿀지, 렌더 시 치환할지, 그대로 둘지 확인.
2. **지표 라벨** — "Registered patents"로 적용했다. 요구 문서에 `Registered 70` 표기도 있어 짧은 "Registered"를 원하면 `LABELS.en.mRegistered` 한 곳만 바꾸면 된다.
3. **샘플 데이터** — 이름·직위·소속 외 논문·특허 목록, 경력, 학력 등은 전부 샘플. 실제 `cv-data/*.yml`로 교체 필요. `counts`는 발췌 샘플용 고정값이므로 구현에선 집계로 대체.
4. **프로필 사진** — `cv-data/SYMin-050.jpeg` 파일은 번들에 없다. 저장소 해당 경로에 둘 것(없으면 회색 placeholder).
5. **doi** — 현재 데이터 대부분이 비어 있어 링크가 거의 안 보이는 게 정상. 샘플엔 확인용으로 1건만 넣었다.
