# Acceptance Criteria 하네스 매핑 (Acceptance Harness Map)

이 문서는 Seed(`seed_7b53e0878006`)에 정의된 요구사항과 실제 코드 파일, 자동 테스트, 검증 방식을 1:1로 매핑합니다.

| AC ID | 요구사항 (Seed Acceptance Criteria) | 구현 대상 파일 | 검증 방법 / 테스트 파일 | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **AC-01** | 앱 실행 시 1.5초 이내 날씨 위젯 및 프리셋 룩북 렌더링 | [`App.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/App.tsx) | 정적 프리셋 초기값 0초 즉시 렌더링 + 비동기 GPS 갱신 | **구현 완료** |
| **AC-02** | 4대 핵심 날씨 상태(Clear, Clouds, Rain, Snow) 지원 | [`src/types/weather.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/types/weather.ts), [`src/services/weatherService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/weatherService.ts) | [`tests/unit/weatherService.test.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/tests/unit/weatherService.test.ts) | **구현 완료** |
| **AC-03** | 한국 표준 8단계 기온대(4°C 이하 패딩 ~ 28°C 이상 린넨/반팔) 매핑 | [`src/constants/temperatureBands.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/constants/temperatureBands.ts) | [`tests/unit/temperatureBands.test.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/tests/unit/temperatureBands.test.ts) | **구현 완료** |
| **AC-04** | 햄버거 메뉴의 남/여/모두 성별 전환 및 UI/룩북 즉각 전환 | [`src/components/MenuSheet.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/MenuSheet.tsx) | 성별 선택 상태 변경 및 룩북 재필터링 | **구현 완료** |
| **AC-05** | 날씨/기온/성별당 최소 2~3종 이상의 스타일 슬라이드 제공 | [`src/data/presetLookbooks.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/data/presetLookbooks.ts) | [`tests/unit/presetLookbooks.test.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/tests/unit/presetLookbooks.test.ts) | **구현 완료** |
| **AC-06** | 하단 코디 카드 (제목·설명, 아우터/상의/하의/신발 행, 페이지 점, 저장) | [`src/components/StyleGuideSheet.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/StyleGuideSheet.tsx) | 개선안(시안) 기준 흰색 카드 레이아웃 및 좌우 스와이프 이동 | **구현 완료** |
| **AC-07** | GPS 위치 자동 조회 및 거부 시 서울 기본 위치 폴백 | [`src/services/locationService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/locationService.ts) | `expo-location` 권한 흐름 및 기본 서울 좌표 반환 | **구현 완료** |
| **AC-08** | 계절/날씨 시뮬레이션 모드 지원 (영하, 한여름, 비 등) | [`src/components/WeatherSimulatorModal.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/WeatherSimulatorModal.tsx) | 시나리오 원클릭 변경 및 기온 미세 조절 기능 | **구현 완료** |
| **AC-09** | 서버 비밀값·세션·원자적 호출 한도로 유료 AI 요청 보호 | [`src/services/ai/imageGenerationService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/ai/imageGenerationService.ts) | 인터페이스 분리 및 `.env.example` 구성 | **구현 완료** |
| **AC-10** | 단계별 생성 상태·타임아웃·참고 사진 안내·이미지만 재시도 | [`src/services/ai/envImageGenerationService.ts`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/services/ai/envImageGenerationService.ts), [`AIGenerationModal.tsx`](file:///Users/shinsooho/Desktop/practice/weather-coordination/src/components/AIGenerationModal.tsx) | AbortController 20초 타임아웃 및 프리셋 자동 복귀 | **구현 완료** |

---

## 검증 실행

모든 AC의 일치성과 테스트 통과는 다음 명령으로 일괄 검증됩니다:

```bash
python3 scripts/run_harness.py
```


## 운영 안정성 검증

- 비용 제한·세션: `tests/unit/aiGuard.test.ts` (병렬 요청, 일일/분별 한도, 쿠키 재발급, 요청 크기·모델·장수 검증).
- 브라우저 옷장: `tests/unit/wardrobeStorage.test.ts` (사진 데이터 보관, 재조회·삭제, 저장 차단·용량 부족·손상된 데이터 보존).
- 날씨 정합성: `tests/unit/lookbookContext.test.ts` (기온대·강수 상태·성별·TPO 변경).
- 생성 진행·재시도: `tests/unit/aiLookbookConsistency.test.ts` (코디 작성→이미지 단계, 기존 아이템을 유지하는 이미지 단독 재시도).
