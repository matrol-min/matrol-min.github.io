# 폰트 스케일 참고표

이 사이트가 쓰는 [modern-resume-theme](https://github.com/sproogen/modern-resume-theme)의
실제 타이포그래피 규칙(`_sass/type.scss`, `_sass/base.scss`)을 정리한 표입니다.
디자인/폰트 크기 수정을 지시할 때 이 표에 있는 이름으로 얘기하면 바로 어느 값을 바꿀지 알 수 있습니다.

**단위는 항상 `rem`을 씁니다.** 이 테마는 전부 `rem` 기준이고, 루트(`<html>`)를 따로 축소하지 않아서
`1rem = 16px`로 고정입니다. `em`은 부모 요소의 계산된 font-size를 기준으로 상대 계산되기 때문에,
같은 값을 넣어도 위치에 따라 실제 크기가 달라질 수 있어 이 프로젝트에서는 쓰지 않습니다.

## 원본 테마 기본값 (`_sass/type.scss`, 전역)

| 이름 | 크기 | px 환산 | 어디에 쓰이는지 |
|---|---|---|---|
| h1 | 4rem | 64px | CV 이름 (`cv_name`) |
| h3 | 3rem | 48px | 섹션 제목 (경력/학력/논문/특허 등 `content_sections`의 `title`) — 가운데 정렬, 점선 밑줄 |
| h4 | 2.5rem | 40px | 항목 제목 (Experience/Education/Awards의 `title`: 회사명, 학교명 등) |
| h2 | 2rem | 32px | 직함 (`title` front matter 필드) |
| p, ul (전역 기본) | 1.6rem | 25.6px | 본문 문단 전체 — 항목 설명(`description`), 캡션/부제(`.details p`: `sub_title`/`caption`), 기술 스택 텍스트 등 |
| a i (아이콘 폰트) | 1.6rem | 25.6px | 헤더의 GitHub/LinkedIn 등 아이콘 |
| button / input / label | 1rem | 16px | 폼 요소용. 실제 콘텐츠에는 쓰이지 않음 |
| body 기준선 | 1rem | 16px (인쇄 시 0.9rem) | 기술적 기준선. 실제 콘텐츠는 거의 다 위 규칙들로 덮어써짐 |
| mark (하이라이트) | 부모의 90% | — | About 소개글의 `<mark>` 강조 텍스트 |

## 이 프로젝트에서 커스텀한 값 (`assets/main.scss`, `.cv-onecol` 안에서만 적용)

`.cv-onecol`은 논문/특허 섹션에만 붙는 클래스라, 아래 값들은 **논문/특허 리스트에만** 적용되고
경력/학력/수상 등 다른 섹션은 원본 테마 기본값(위 표)을 그대로 씁니다.

| 이름 | 크기 | px 환산 | 어디에 쓰이는지 |
|---|---|---|---|
| `.cv-onecol .details h4` | 2rem | 32px | 논문/특허 제목 (원본 h4 기본값 2.5rem보다 한 단계 작게) |
| `.cv-onecol .content p` | 1.6rem | 25.6px | 논문/특허 서지정보(저자·연도·저널·번호 등) — 색만 `#444`로 차분하게, 크기는 테마 기본 문단(1.6rem)과 동일 |
| `.cv-onecol .row.layout.layout-divider .details h4` | 2rem (위 h4 규칙 상속, 별도 지정 없음) | 32px | 논문/특허 리스트 안 "국제"/"국내" 같은 소제목 (`layout: divider` 항목). 굵게 + 강조색(`#477dca`)만 다르고 크기는 논문/특허 제목과 동일 |

## 간격/정렬 규칙 (`.cv-onecol` — 논문/특허 리스트)

원본 테마는 `.details`/`.content` 2단(좌우) 레이아웃을 전제로 간격·정렬이 잡혀 있어서,
1컬럼으로 세로로 쌓는 `.cv-onecol`에서는 아래 항목들을 명시적으로 눌러줘야 함:

| 항목 | 원본 테마 기본값 | `.cv-onecol` 오버라이드 | 이유 |
|---|---|---|---|
| `.row` 좌우 마진 (Bootstrap) | `-15px` | `0` | 컬럼 패딩을 0으로 지운 상태에서 이 마진까지 남아있으면 본문이 `h3` 섹션 제목보다 15px 왼쪽으로 밀려남 |
| `.details` 아래 여백 | `margin-bottom: 2rem`(32px, `.layout-left .details`) | `0` | 2단 레이아웃용 여백이라 세로로 쌓으면 제목-본문 사이가 과하게 벌어짐 |
| `.details`/`.content` 텍스트 정렬 | 767px 이하에서 가운데 정렬로 강제 전환 | 항상 좌측 정렬 (`text-align:left !important`) | 목록형 콘텐츠라 가운데 정렬이면 가독성이 떨어짐 |

## 수정 시 참고

- 새로운 크기가 필요하면 위 표에서 가장 가까운 기존 값을 먼저 재사용할 수 있는지 확인합니다.
- 정말 새 값이 필요하면 반드시 `rem` 단위로, `assets/main.scss`에만 추가합니다 (`_sass/`는 원본 테마 그대로 유지).
- "OO 제목을 몇 rem으로" 처럼 이 표의 이름 + rem 값으로 지시하면 어느 CSS 규칙을 바꿀지 바로 특정할 수 있습니다.
