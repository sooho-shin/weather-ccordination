# dize-weather 작업 인수인계 (새 대화용 맥락)

> 이 파일을 새 대화(데스크톱 앱)에 첨부하고 "이 맥락 이어서 진행해줘"라고 말하면 됩니다.
> 작성 시각: 2026-10-29 14:30 (KST)

## 1. 프로젝트와 내 역할
- 서비스: dize. 날씨 기반 OOTD(코디 추천) 웹/모바일 앱. 출근 전에 한 번 보게 만드는 것이 목표.
- 현재 가오픈 사이트: https://dize-weather.pages.dev/ (Cloudflare Pages)
- GitHub: https://github.com/sooho-shin/weather-ccordination (기본 브랜치 `main`)
- 내 역할: 디자인 + 기획. 협업자는 레포 주인 sooho-shin.
- 기술 스택: Expo SDK 57 (React Native) + TypeScript, 웹으로 export해서 배포.

## 2. 합의된 작업 방식
1. 내가 프롬프트로 디자인 변경을 말하면
2. Claude가 코드에 반영하고 (타입체크 + 테스트 하네스 통과 확인)
3. **`main`에 바로 푸시**한다. (PR/브랜치 방식이 아니라 main 직접 푸시로 정함)
- 레포 규칙은 `AGENTS.md`에 있음 (Expo 문서는 기억에 의존하지 말고 버전별 문서를 확인할 것).
- 검증 명령: `npx tsc --noEmit`, `python3 scripts/run_harness.py`

## 3. 오늘(10/29) 완료한 것
커밋 `7f92c77` "메인 헤더 디자인 수정: 로고 제거, 햄버거 아이콘, 기온 3.5배" 를 `main`에 푸시함.
수정 파일은 `src/components/WeatherHeader.tsx` 하나뿐.
- 상단 `dize.` 로고 텍스트 제거 (위치 배지만 남김)
- 우상단 설정(options) 아이콘 → 햄버거(`menu`) 아이콘
- 기온 숫자 48px → 168px (3.5배). 긴 값(영하 두 자리 등)은 가로 폭에 맞춰 자동 축소
- 큰 숫자와 겹치지 않도록 성별 토글을 뱃지 행 오른쪽으로 이동
- 검증: 타입체크, 유닛 테스트, 하네스 AC-01~11 모두 통과. 린트는 레포에 ESLint 설정이 없어 못 돌림.

## 4. 지켜야 할 것
- **배경 이미지는 건드리지 말 것** (`FullscreenBackground`, 룩북 이미지 등). 사용자가 명시적으로 요청함.
- `package-lock.json`은 원래 `package.json`과 어긋나 있음(wrangler 누락). `npm install`을 하면 바뀌는데, **커밋에 넣지 말고 되돌릴 것** (`git checkout package-lock.json`).
- 하네스(`run_harness.py`)를 돌리면 `docs/reports/verification-report.json`이 덮어써짐. 디자인 변경과 무관하므로 되돌리고 커밋.

## 5. 지금 막힌 문제: 푸시했는데 사이트가 안 바뀜
- 증상: `main` 푸시 후 15분이 지나도 https://dize-weather.pages.dev/ 에 변경이 반영되지 않음.
- 확인한 사실:
  - GitHub 커밋 `7f92c77`에 Cloudflare 빌드 체크/상태/배포 기록이 하나도 없음. GitHub Actions 워크플로도 없음.
  - `package.json`의 배포 스크립트: `"deploy": "npx expo export -p web && npx wrangler pages deploy dist --project-name dize-weather"` → **수동 배포(Direct Upload) 방식으로 보임**.
  - `wrangler.jsonc`: 프로젝트명 `dize-weather`, 출력 폴더 `dist`, D1 바인딩 `AI_LIMITS`.
  - 클라우드 세션에는 Cloudflare 로그인/토큰이 없어 Claude가 직접 배포 불가.
- 아직 확인 못 한 것: Cloudflare 대시보드(Workers & Pages → dize-weather → Deployments)의 가장 위 배포 **Source**가 GitHub인지 Upload인지.
  - GitHub 레포가 적혀 있으면 자동 배포 → 빌드 실패/미실행 원인 확인 필요
  - Upload/wrangler면 수동 배포 → 아래 방법으로 직접 배포 필요
- 수동 배포 방법: 프로젝트 폴더에서 `git pull` → `npm install` → (처음이면) `npx wrangler login` → `npm run deploy`
- 주의: Cloudflare 대시보드에 빌드 폴더를 직접 업로드하는 방식은 비추천. AI 기능용 서버 코드(`functions/`)가 빠질 수 있음.
- 운영 비밀값(`HIVE_SECRET_KEY`, `AI_SESSION_SECRET`)과 D1 DB가 Cloudflare 쪽에 설정돼 있으므로, 배포는 반드시 `dize-weather`가 있는 Cloudflare 계정으로 해야 함.

## 6. 새 대화에서 바로 할 일 (데스크톱 앱, 옆에 브라우저 창 사용)
1. 옆 브라우저로 GitHub 레포를 열어 `7f92c77`이 맨 위인지 확인.
2. Cloudflare 대시보드(사용자가 직접 로그인)에서 `dize-weather` → Deployments → Source 확인.
3. 결과에 따라 자동 배포 오류를 고치거나, 수동 배포(`npm run deploy`)를 진행. **라이브 사이트에 올리는 일이므로 실행 전에 사용자에게 꼭 확인받을 것.**
4. 배포 후 https://dize-weather.pages.dev/ 에서 강력 새로고침(Cmd+Shift+R)으로 변경 확인.

## 7. 아직 정해지지 않은 디자인 결정
- 햄버거 버튼: 지금은 아이콘만 바뀌었고 누르면 여전히 날씨 시뮬레이터가 열림. 햄버거에 어떤 메뉴를 담을지 기획 필요.
- 옷장(북마크) 버튼과 AI 버튼: 시안에는 우상단에 아이콘이 하나뿐이지만 현재는 둘 다 남아 있음. 햄버거 안으로 합칠지 결정 필요.
- 시안(개선안)에 있던 다른 요소(하단 시트의 '저장' 버튼 스타일 등)는 아직 반영하지 않음. 필요하면 다음 프롬프트로 요청.
