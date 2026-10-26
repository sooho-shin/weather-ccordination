import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import { Gender, WeatherData, WeatherState } from './src/types/weather';
import { OutfitLookbook, TpoCategory } from './src/types/outfit';
import { getTemperatureBand } from './src/constants/temperatureBands';
import { findMatchingLookbooks } from './src/data/presetLookbooks';
import { getCurrentLocation } from './src/services/locationService';
import { fetchCurrentWeather } from './src/services/weatherService';

import { FullscreenBackground } from './src/components/FullscreenBackground';
import { WeatherHeader } from './src/components/WeatherHeader';
import { TpoTabBar } from './src/components/TpoTabBar';
import { StyleGuideSheet } from './src/components/StyleGuideSheet';
import { AIGenerationModal } from './src/components/AIGenerationModal';
import { WeatherSimulatorModal } from './src/components/WeatherSimulatorModal';

export default function App() {
  // 0. 웹 및 네이티브 폰트 안전 로드
  const [fontsLoaded] = useFonts({
    Ionicons: require('./assets/fonts/Ionicons.ttf'),
  });

  // 웹 브라우저 환경에서 아이콘 폰트(Ionicons) CDN 및 디스플레이 보장
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'dize-font-fixes';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @font-face {
            font-family: 'ionicons';
            src: url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf') format('truetype');
            font-display: swap;
          }
          @font-face {
            font-family: 'Ionicons';
            src: url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf') format('truetype');
            font-display: swap;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // 1. 상태 관리: 성별(여/남/모두), TPO 탭(출근/데일리/스트릿), 날씨, 슬라이드 인덱스
  const [gender, setGender] = useState<Gender>('female');
  const [selectedTpo, setSelectedTpo] = useState<TpoCategory>('office');

  // 기본 즉시 렌더링용 22° 맑음 초기값 (체감 키워드 및 최고/최저 기온 포함)
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    tempMax: 25,
    tempMin: 16,
    apparentKeyword: '선선하다',
    weatherStateKeyword: '맑음',
    weatherState: 'Clear',
    weatherDescription: '맑음',
    precipitation: 0,
    locationName: '서울특별시 중구',
    isSimulated: false,
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [aiCustomLookbook, setAiCustomLookbook] = useState<OutfitLookbook | null>(null);

  const [simulatorVisible, setSimulatorVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // 2. 실시간 GPS 위치 및 실제 날씨 비동기 로딩
  const loadRealWeather = useCallback(async () => {
    try {
      const loc = await getCurrentLocation();
      const realWeather = await fetchCurrentWeather(loc.latitude, loc.longitude, loc.name);
      setWeather(realWeather);
    } catch (e) {
      console.warn('날씨 로딩 실패, 기본값 유지:', e);
    }
  }, []);

  useEffect(() => {
    loadRealWeather();
  }, [loadRealWeather]);

  // 3. 현재 기온대 및 성별, TPO에 매칭되는 룩북 목록 계산
  const currentTempBand = useMemo(
    () => getTemperatureBand(weather.temperature).id,
    [weather.temperature]
  );

  const availableLookbooks = useMemo(() => {
    const presets = findMatchingLookbooks(
      gender,
      currentTempBand,
      weather.weatherState,
      selectedTpo
    );

    // 사용자가 커스텀 생성한 AI 룩북이 있을 때 현재 TPO나 성별 조건과 부합하면 맨 앞 배치
    if (aiCustomLookbook) {
      const isGenderMatch = gender === 'all' || aiCustomLookbook.gender === gender;
      const isTpoMatch = !aiCustomLookbook.tpo || aiCustomLookbook.tpo === selectedTpo;
      if (isGenderMatch && isTpoMatch) {
        return [aiCustomLookbook, ...presets];
      }
    }
    return presets;
  }, [gender, currentTempBand, weather.weatherState, selectedTpo, aiCustomLookbook]);

  // 슬라이드 인덱스 범위 초과 방지
  const safeIndex = activeSlideIndex >= availableLookbooks.length ? 0 : activeSlideIndex;
  const currentLookbook = availableLookbooks[safeIndex] || availableLookbooks[0];

  // 성별 변경 핸들러
  const handleSelectGender = (newGender: Gender) => {
    setGender(newGender);
    setActiveSlideIndex(0);
  };

  // TPO 탭 변경 핸들러
  const handleSelectTpo = (newTpo: TpoCategory) => {
    setSelectedTpo(newTpo);
    setActiveSlideIndex(0);
  };

  // 날씨 시뮬레이션 적용 핸들러
  const handleApplySimulatedWeather = (
    temp: number,
    state: WeatherState,
    description: string
  ) => {
    let apparentKeyword = '선선하다';
    if (temp >= 28) apparentKeyword = '덥다';
    else if (temp >= 23) apparentKeyword = '따뜻하다';
    else if (temp >= 20) apparentKeyword = '선선하다';
    else if (temp >= 17) apparentKeyword = '약간 쌀쌀';
    else if (temp >= 12) apparentKeyword = '쌀쌀하다';
    else if (temp >= 9) apparentKeyword = '꽤 쌀쌀';
    else if (temp >= 5) apparentKeyword = '춥다';
    else apparentKeyword = '매우 춥다';

    let weatherStateKeyword = '맑음';
    if (state === 'Rain') weatherStateKeyword = '비온다';
    else if (state === 'Snow') weatherStateKeyword = '눈온다';
    else if (state === 'Clouds') weatherStateKeyword = '흐리다';

    setWeather((prev) => ({
      ...prev,
      temperature: temp,
      tempMax: temp + 3,
      tempMin: temp - 4,
      apparentKeyword,
      weatherStateKeyword,
      weatherState: state,
      weatherDescription: description,
      isSimulated: true,
    }));
    setActiveSlideIndex(0);
  };

  // 코디 셔플 핸들러 (기획서 핵심 UX: 랜덤 착장 전환)
  const handleShuffleLookbook = useCallback(() => {
    if (availableLookbooks.length <= 1) return;
    setActiveSlideIndex((prev) => {
      let nextIndex = Math.floor(Math.random() * availableLookbooks.length);
      if (nextIndex === prev) {
        nextIndex = (prev + 1) % availableLookbooks.length;
      }
      return nextIndex;
    });
  }, [availableLookbooks.length]);

  const handleNextLookbook = useCallback(() => {
    setActiveSlideIndex((prev) => (prev + 1) % availableLookbooks.length);
  }, [availableLookbooks.length]);

  const handlePrevLookbook = useCallback(() => {
    setActiveSlideIndex(
      (prev) => (prev - 1 + availableLookbooks.length) % availableLookbooks.length
    );
  }, [availableLookbooks.length]);

  // 웹 브라우저 환경에서 좌우 방향키로 룩북 넘기기 지원
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          handleNextLookbook();
        } else if (e.key === 'ArrowLeft') {
          handlePrevLookbook();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleNextLookbook, handlePrevLookbook]);

  // AI 생성 완료 핸들러
  const handleGenerationSuccess = (newLookbook: OutfitLookbook) => {
    setAiCustomLookbook(newLookbook);
    setActiveSlideIndex(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. 풀스크린 실사 배경 화보 */}
      {currentLookbook && (
        <FullscreenBackground imageUrl={currentLookbook.imageUrl} />
      )}

      {/* 2. 안전 영역 내 오버레이 UI */}
      <SafeAreaView style={styles.safeArea}>
        {/* 상단: dize. 브랜딩, 체감 뱃지, 최고/최저 기온, 성별 토글 */}
        <View>
          <WeatherHeader
            weather={weather}
            gender={gender}
            onSelectGender={handleSelectGender}
            onOpenSimulator={() => setSimulatorVisible(true)}
            onOpenAIGenerator={() => setAiModalVisible(true)}
          />

          {/* 중앙 상단: TPO 3분할 탭 바 ([ 출근/단정 ] [ 데일리/캐주얼 ] [ 스트릿/힙 ]) */}
          <TpoTabBar
            selectedTpo={selectedTpo}
            onSelectTpo={handleSelectTpo}
          />
        </View>

        {/* 좌우 코디 넘기기 플로팅 버튼 */}
        <View style={styles.sideNavRow} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.navChevronBtn}
            onPress={handlePrevLookbook}
            activeOpacity={0.7}
            accessibilityLabel="이전 코디"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navChevronBtn}
            onPress={handleNextLookbook}
            activeOpacity={0.7}
            accessibilityLabel="다음 코디"
          >
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 하단: 글래스모피즘 코디 가이드 시트 (날씨 방어 태그 + 셔플 버튼 + 세부 아이템 칩) */}
        {currentLookbook && (
          <StyleGuideSheet
            lookbook={currentLookbook}
            currentIndex={safeIndex}
            totalCount={availableLookbooks.length}
            onSelectIndex={(index) => setActiveSlideIndex(index)}
            onShuffle={handleShuffleLookbook}
            onOpenAIGenerator={() => setAiModalVisible(true)}
            isAiGenerated={currentLookbook.imageSource === 'ai'}
          />
        )}
      </SafeAreaView>

      {/* 3. 모달 레이어 */}
      <WeatherSimulatorModal
        visible={simulatorVisible}
        currentWeather={weather}
        onClose={() => setSimulatorVisible(false)}
        onApplyScenario={handleApplySimulatedWeather}
        onResetToRealGPS={loadRealWeather}
      />

      <AIGenerationModal
        visible={aiModalVisible}
        weather={weather}
        gender={gender === 'all' ? 'female' : gender}
        onClose={() => setAiModalVisible(false)}
        onGenerationSuccess={handleGenerationSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sideNavRow: {
    position: 'absolute',
    top: '49%',
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  navChevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
});
