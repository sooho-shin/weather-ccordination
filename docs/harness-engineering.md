# 날씨 코디 앱 하네스 엔지니어링 (Harness Engineering)

이 프로젝트는 Ouroboros와 Antigravity의 요구사항 관리 체계를 따르며, 코드와 제품의 신뢰성을 보장하기 위해 독자적인 **프로젝트 내부 자동 검증 하네스**를 운영합니다.

---

## 1. 하네스 경계 (Harness Boundaries)

- **Ouroboros / Seed (`seed_7b53e0878006`)**:
  - 사용자 인터뷰, 모호도 측정, Seed(목표, 제약사항, 인수 기준) 정의, QA 사이클 관리
- **프로젝트 하네스 (`scripts/run_harness.py`)**:
  - TypeScript 정적 타입 검증 (`npx tsc --noEmit`)
  - 기온대/날씨 매핑, 룩북 데이터 무결성, AI 프롬프트 생성기 유닛 테스트 (`tests/unit/*.test.ts`)
  - Seed Acceptance Criteria (AC-01 ~ AC-10) 일치성 검증
  - 하네스 결과 리포트 자동 생성 (`docs/reports/verification-report.json`)

---

## 2. 통합 검증 실행 명령

터미널에서 아래 명령어로 하네스 전체를 한 번에 실행합니다:

```bash
python3 scripts/run_harness.py
# 또는
npm test
```

### 실행 파이프라인
1. **STAGE 1: TypeScript 정적 검증**
   - `npx tsc --noEmit` 실행하여 컴파일 및 타입 에러 0개 보장
2. **STAGE 2: 핵심 도메인 유닛 테스트**
   - 8단계 기온대 경계값(28°C, 23°C, 20°C, 17°C, 12°C, 9°C, 5°C, 4°C 이하) 테스트
   - WMO 코드 -> WeatherState(Clear, Clouds, Rain, Snow) 변환 테스트
   - 남/여 및 날씨별 프리셋 룩북 데이터 완전성(이미지 URL, 3개 이상 코디 아이템) 테스트
   - 날씨 무드/성별 기반 AI 프롬프트 생성기 테스트
3. **STAGE 3: Acceptance Criteria 검증**
   - Seed에 명시된 10대 핵심 인수 기준의 실제 파일 구현 여부 및 매핑 상태 검증
4. **STAGE 4: 리포트 자동 생성**
   - `docs/reports/verification-report.json`에 타임스탬프와 단계별 실행 결과 영구 기록

---

## 3. 하네스 필수 준수 원칙

1. **포트 즉시 정리 원칙**:
   - Expo Web(`npx expo start --web`) 등으로 브라우저 검증을 진행한 후에는 **반드시 확인 즉시 포트(8081 등)를 안전하게 kill**해야 합니다.
2. **커밋 메시지 원칙**:
   - 모든 Git 커밋 메시지는 무조건 **한글**로 명확하게 작성합니다.
3. **폴백 안전성 원칙**:
   - GPS 위치 실패나 AI API 실패/타임아웃(20초) 발생 시 절대 앱이 크래시되지 않고 프리셋 데이터로 매끄럽게 폴백되어야 합니다.
