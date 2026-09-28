# Acceptance Criteria 하네스 매핑 (Acceptance Harness Map)

이 문서는 Seed(`seed_7b53e0878006`)에 정의된 요구사항과 실제 코드 파일, 자동 테스트, 검증 방식을 1:1로 매핑합니다.

| AC ID | 요구사항 (Seed Acceptance Criteria) | 구현 대상 파일 | 검증 방법 / 테스트 파일 | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **AC-01** | 앱 실행 시 1.5초 이내 날씨 위젯 및 프리셋 룩북 렌더링 | [`App.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/App.tsx) | 정적 프리셋 초기값 0초 즉시 렌더링 + 비동기 GPS 갱신 | **구현 완료** |
| **AC-02** | 4대 핵심 날씨 상태(Clear, Clouds, Rain, Snow) 지원 | [`src/types/weather.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/types/weather.ts), [`src/services/weatherService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/weatherService.ts) | [`tests/unit/weatherService.test.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/tests/unit/weatherService.test.ts) | **구현 완료** |
| **AC-03** | 한국 표준 8단계 기온대(4°C 이하 패딩 ~ 28°C 이상 린넨/반팔) 매핑 | [`src/constants/temperatureBands.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/constants/temperatureBands.ts) | [`tests/unit/temperatureBands.test.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/tests/unit/temperatureBands.test.ts) | **구현 완료** |
| **AC-04** | 상단 남/여 성별 전환 토글 및 UI/룩북 즉각 전환 | [`src/components/WeatherHeader.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/WeatherHeader.tsx) | 필 스위치 상태 변경 및 룩북 재필터링 | **구현 완료** |
| **AC-05** | 날씨/기온/성별당 최소 2~3종 이상의 스타일 슬라이드 제공 | [`src/data/presetLookbooks.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/data/presetLookbooks.ts) | [`tests/unit/presetLookbooks.test.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/tests/unit/presetLookbooks.test.ts) | **구현 완료** |
| **AC-06** | 하단 글래스모피즘 코디 가이드 시트 (아우터, 상의, 하의, 신발 칩) | [`src/components/StyleGuideSheet.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/StyleGuideSheet.tsx), [`OutfitItemCard.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/OutfitItemCard.tsx) | 목업 UI 100% 매칭 및 expo-blur 적용 | **구현 완료** |
| **AC-07** | GPS 위치 자동 조회 및 거부 시 서울 기본 위치 폴백 | [`src/services/locationService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/locationService.ts) | `expo-location` 권한 흐름 및 기본 서울 좌표 반환 | **구현 완료** |
| **AC-08** | 계절/날씨 시뮬레이션 모드 지원 (영하, 한여름, 비 등) | [`src/components/WeatherSimulatorModal.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/WeatherSimulatorModal.tsx) | 시나리오 원클릭 변경 및 기온 미세 조절 기능 | **구현 완료** |
| **AC-09** | 온디맨드 AI 생성 아키텍처 분리 (.env 직결 -> 서버리스 전환 대비) | [`src/services/ai/imageGenerationService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/ai/imageGenerationService.ts) | 인터페이스 분리 및 `.env.example` 구성 | **구현 완료** |
| **AC-10** | 온디맨드 AI 생성 20초 타임아웃 및 실패 시 프리셋 안전 폴백 | [`src/services/ai/envImageGenerationService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/ai/envImageGenerationService.ts), [`AIGenerationModal.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/AIGenerationModal.tsx) | AbortController 20초 타임아웃 및 프리셋 자동 복귀 | **구현 완료** |

---

## 검증 실행

모든 AC의 일치성과 테스트 통과는 다음 명령으로 일괄 검증됩니다:

```bash
python3 scripts/run_harness.py
```
