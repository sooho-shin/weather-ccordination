---
name: weather-coordination-engineering
description: 날씨 코디 추천 Expo/React Native 프로젝트에서 기능 추가, UI 수정, 날씨/코디 매핑, AI 이미지 생성 개선 등의 개발 작업을 수행할 때 사용하는 핵심 엔지니어링 스킬. 하네스 자동 검증, 브라우저 포트 자동 종료, 한글 커밋 메시지 규칙을 강제한다.
---

# Weather Coordination Engineering

## 1. 개요 및 목적

이 프로젝트는 현재 날씨와 기온에 맞춘 남/여 실사 코디 추천 앱을 개발하는 환경입니다.  
개발 과정에서 코드 품질을 일정하게 유지하고 사용자의 프로젝트 규칙을 엄격하게 준수하기 위해 본 스킬의 절차를 따릅니다.

---

## 2. 필수 개발 절차 (Loop Engineering)

### 1단계: 요구사항 및 영향도 분석
- 변경할 기능이 8단계 기온대(`TEMPERATURE_BANDS`), 날씨 상태(Clear, Clouds, Rain, Snow), 성별(female, male) 중 어디에 영향을 주는지 확인합니다.
- [`docs/acceptance-harness-map.md`](file:///Users/shinsooho/Desktop/practice/weather-coordination/docs/acceptance-harness-map.md)를 참조하여 관련 AC를 식별합니다.

### 2단계: 코드 수정 및 추가
- Expo SDK 57 및 React Native 표준 패턴을 준수합니다.
- UI 수정 시 상단 날씨 헤더, 중앙 풀스크린 실사 배경, 하단 글래스모피즘 코디 가이드 시트의 조화와 가독성을 유지합니다.
- AI 생성 인터페이스(`ImageGenerationService`)의 추상화 경계를 훼손하지 않습니다.

### 3단계: 하네스 자동 검증 (필수)
모든 코드 수정 후에는 반드시 통합 하네스를 실행합니다:

```bash
python3 scripts/run_harness.py
```

- `TypeScript 타입 검사` 오류 0개 확인
- `핵심 도메인 유닛 테스트(7종 이상)` 100% 통과 확인
- `Acceptance Criteria (AC-01~10)` 매핑 확인

### 4단계: 브라우저 실물 검증 및 포트 즉시 종료 (절대 준수 규칙)
- 실물 UI 확인을 위해 브라우저 개발 서버(`npx expo start --web`)를 실행한 경우, **확인이 끝나는 즉시 반드시 포트를 죽여야 합니다.**

```bash
# 실행 확인 후 포트 프로세스 종료 명령
lsof -ti :8081 | xargs kill -9 2>/dev/null || true
```

### 5단계: 형상 관리 (Git 커밋)
- Git 커밋 메시지는 무조건 **한글**로 명확하고 상세하게 작성합니다.
- 예시: `feat: 간절기 린넨 셔츠 코디 아이템 세부 스펙 추가`

---

## 3. 핵심 규칙 체크리스트

- [ ] 한글로 응답할 것
- [ ] 브라우저 확인 후 개발 포트를 죽였는가?
- [ ] `python3 scripts/run_harness.py`를 실행하여 통과했는가?
- [ ] git commit 메시지를 한글로 작성했는가?
