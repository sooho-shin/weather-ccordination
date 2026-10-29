# 🌦️ Weather Coordination (날씨 기반 실사 패션 코디 추천 앱)

현재 위치의 실시간 날씨와 기온에 맞춘 남/여 고감도 실사 패션 룩북 및 세부 아이템(아우터, 상의, 하의, 신발 등)을 추천해주는 **Expo / React Native** 모바일 애플리케이션입니다.

---

## ✨ 핵심 기능

1. **초고화질 실사 패션 화보 배경 (Head-to-Toe Lookbook)**
   - 29CM, W컨셉, 무신사 스냅 기반의 고감도 트렌디 스타일링 화보 전신샷 제공.
   - 중앙 정렬 및 85mm 아이레벨 구도와 상·하단 UI 여백의 시각적 안정감.
2. **5대 대표 날씨별 남/녀 5종 (총 50종) 프리셋 룩북 DB**
   - **봄/가을 (20~22°C 맑음)**: 테일러드 블레이저, 맥 트렌치코트, 알파카 가디건, 비건 레더, 시티보이 룩 등.
   - **한여름 폭염 (28°C 이상 맑음)**: 린넨 셋업, 시어 셔츠 & 버뮤다 쇼츠, 홀터 니트, 쿨맥스 스트릿 등.
   - **간절기 쌀쌀한 가을 (12~16°C)**: 하운드투스 자켓, 램스울 집업, 해링턴 블루종, 필드 자켓 등.
   - **한겨울 눈보라 한파 (4°C 이하 강설)**: 구스다운 패딩, 롱 무스탕, 몬스터 파카, 캐시미어 코트 등.
   - **우천 비오는 날 (Rain)**: 발수 윈드브레이커, 싱글 레인 트렌치, 고어텍스 쉘, 레인부츠 코디 등.
3. **직관적인 순환 및 탐색 인터랙션**
   - 하단 시트 **'다음 코디'** 버튼으로 5가지 스타일 즉시 순환 (`1/5` ~ `5/5`).
   - 상단 헤더 **새로고침** 버튼 및 화면 좌우 체브론 플로팅 화살표 지원.
   - 웹 브라우저 환경에서 키보드 방향키(`←`, `→`) 네비게이션 지원.
4. **하단 글래스모피즘 코디 가이드 시트**
   - `expo-blur` 기반 반투명 블러 카드와 아우터, 상의, 하의, 신발 개별 아이템 칩.
5. **실시간 GPS 위치 및 날씨 연동 (Open-Meteo)**
   - 오프라인 또는 위치 거부 시 서울 기본 위치 자동 폴백.
   - 한국 표준 8단계 기온대 자동 분류.
6. **시뮬레이션 모드 (`WeatherSimulatorModal`)**
   - 영하 한파부터 한여름 폭염, 비 오는 날까지 다양한 날씨 시나리오를 원클릭 테스트.
7. **온디맨드 AI 맞춤 생성**
   - 코디 작성·이미지 생성 단계를 표시하고, 이미지 실패 시 기존 사진 안내 및 사진만 재시도를 지원합니다.

---

## 🛠️ 기술 스택

- **Framework**: Expo SDK 57 (React Native) + TypeScript
- **Styling & UI**: StyleSheet + `expo-blur` + `@expo/vector-icons`
- **Image**: `expo-image` (고화질 실사 이미지 비동기 캐싱 및 페이드인)
- **Location & Weather**: `expo-location` + Open-Meteo API
- **Verification**: 자체 통합 하네스 (`python3 scripts/run_harness.py`), Node.js 내장 테스트 러너

---

## 🚀 시작하기

### 설치
```bash
npm install
```

### 실행
```bash
# 웹 브라우저에서 실행
npx expo start --web

# iOS 시뮬레이터에서 실행
npx expo start --ios

# Android 에뮬레이터에서 실행
npx expo start --android
```

### 테스트 및 하네스 검증
```bash
python3 scripts/run_harness.py
```

### 배포 및 CI/CD
- **자동 배포(권장)**: `main`에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 타입체크·유닛 테스트 후 `https://dize-weather.pages.dev`에 자동 배포합니다. (상세 가이드: [CI/CD 설정 가이드](docs/guides/ci-cd-setup.md))
  1. Cloudflare 대시보드 → My Profile → API Tokens → Create Token → 권한 `Account / Cloudflare Pages / Edit` 으로 토큰 생성 (`dize-weather` 프로젝트가 있는 계정)
  2. Workers & Pages 화면 오른쪽의 **Account ID** 복사
  3. GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret 으로 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` 등록
  4. Actions 탭 → *Deploy to Cloudflare Pages* → Run workflow 로 현재 `main`을 한 번 배포
- **수동 배포**: `npm run deploy` (사전에 `npx wrangler login` 필요)


## AI 호출 보호 및 옷장 저장
