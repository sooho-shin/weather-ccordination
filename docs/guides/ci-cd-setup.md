# CI/CD 자동 배포 구축 가이드 (GitHub Actions & Cloudflare Pages)

본 프로젝트는 GitHub Actions를 통해 `main` 브랜치에 코드가 푸시되면 자동으로 검증(TypeScript, 유닛 테스트, 하네스 검증) 후 Expo 웹 번들을 빌드하여 Cloudflare Pages로 배포하도록 파이프라인이 구성되어 있습니다.

---

## 1. 파이프라인 동작 방식

1. **테스트 단계 (`test`)**
   - Node.js 20 & Python 3.11 환경 구성
   - `npm ci` 의존성 설치
   - `python3 scripts/run_harness.py` 하네스 실행 (TypeScript 컴파일, 13대 도메인 유닛 테스트, AC-01~11 인수 기준 검증)
2. **배포 단계 (`deploy`)**
   - 테스트 100% 통과 시에만 실행 (`main` 브랜치 push 트리거)
   - `npx expo export -p web` 웹 번들 빌드
   - `npx wrangler pages deploy dist` Cloudflare Pages 실배포

---

## 2. GitHub Secrets 설정 가이드

GitHub 저장소(`sooho-shin/weather-ccordination`)의 **Settings > Secrets and variables > Actions**에서 **New repository secret** 버튼을 눌러 아래 비밀값을 등록합니다.

### 필수 비밀값 (Cloudflare 배포용)

| Secret 이름 | 설명 | 확인/발급 방법 |
| :--- | :--- | :--- |
| **`CLOUDFLARE_API_TOKEN`** | Cloudflare Pages 배포 권한 토큰 | [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) > **API 토큰 생성** > **Cloudflare Pages 편집 (Edit Cloudflare Pages)** 템플릿 사용 |
| **`CLOUDFLARE_ACCOUNT_ID`** | Cloudflare 계정 식별자 | Cloudflare 대시보드 우측 사이드바 또는 브라우저 주소창(`dash.cloudflare.com/<ACCOUNT_ID>`)에서 복사 |

### 선택/권장 비밀값 (AI 화보 및 추천 연동)
Secrets에 등록하지 않을 경우 기본 키(로컬 .env 기본값)로 자동 폴백되지만, 안전한 관리를 위해 등록을 권장합니다:
- `EXPO_PUBLIC_HIVE_SECRET_KEY`
- `EXPO_PUBLIC_HIVE_ACCESS_KEY`
- `EXPO_PUBLIC_DEEPSEEK_API_KEY`
- `EXPO_PUBLIC_DEEPSEEK_BASE_URL`
- `EXPO_PUBLIC_DEEPSEEK_MODEL`

---

## 3. Cloudflare API 토큰 발급 3단계

1. [Cloudflare 대시보드 API 토큰 페이지](https://dash.cloudflare.com/profile/api-tokens) 접속
2. **토큰 생성(Create Token)** 클릭 후, `Cloudflare Pages 편집` 템플릿 선택
3. 계정 리소스(Account Resources)에서 본인의 계정 선택 후 **계속해서 요약 보기** > **토큰 생성** 클릭 후 토큰 값 복사
