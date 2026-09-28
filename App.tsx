import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { Gender, WeatherData, WeatherState } from './src/types/weather';
import { OutfitLookbook } from './src/types/outfit';
import { getTemperatureBand } from './src/constants/temperatureBands';
import { findMatchingLookbooks } from './src/data/presetLookbooks';
import { getCurrentLocation, DEFAULT_FALLBACK_LOCATION } from './src/services/locationService';
import { fetchCurrentWeather } from './src/services/weatherService';

import { FullscreenBackground } from './src/components/FullscreenBackground';
import { WeatherHeader } from './src/components/WeatherHeader';
import { StyleGuideSheet } from './src/components/StyleGuideSheet';
import { AIGenerationModal } from './src/components/AIGenerationModal';
import { WeatherSimulatorModal } from './src/components/WeatherSimulatorModal';

export default function App() {
  // 1. 상태 관리: 성별, 날씨, 현재 선택된 룩북 인덱스, 모달 가시성
  const [gender, setGender] = useState<Gender>('female');

  // 기본 즉시 렌더링을 위한 22° 맑음 초기값 (0초 로딩 보장)
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
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

  // 2. 실시간 GPS 위치 및 실제 날씨 비동기 로딩 (백그라운드에서 부드럽게 업데이트)
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

  // 3. 현재 기온대 및 성별에 매칭되는 룩북 목록 계산
  const currentTempBand = useMemo(
    () => getTemperatureBand(weather.temperature).id,
    [weather.temperature]
  );

  const availableLookbooks = useMemo(() => {
    const presets = findMatchingLookbooks(gender, currentTempBand, weather.weatherState);
    if (aiCustomLookbook && aiCustomLookbook.gender === gender) {
      return [aiCustomLookbook, ...presets];
    }
    return presets;
  }, [gender, currentTempBand, weather.weatherState, aiCustomLookbook]);

  // 슬라이드 인덱스 범위 초과 방지
  const safeIndex = activeSlideIndex >= availableLookbooks.length ? 0 : activeSlideIndex;
  const currentLookbook = availableLookbooks[safeIndex] || availableLookbooks[0];

  // 성별 전환 핸들러
  const handleToggleGender = () => {
    setGender((prev) => (prev === 'female' ? 'male' : 'female'));
    setActiveSlideIndex(0);
  };

  // 날씨 시뮬레이션 적용 핸들러
  const handleApplySimulatedWeather = (
    temp: number,
    state: WeatherState,
    description: string
  ) => {
    setWeather((prev) => ({
      ...prev,
      temperature: temp,
      weatherState: state,
      weatherDescription: description,
      isSimulated: true,
    }));
    setActiveSlideIndex(0);
  };

  // 다음/이전 룩북 순환 핸들러 (5대 스타일 순환)
  const handleNextLookbook = useCallback(() => {
    setActiveSlideIndex((prev) => (prev + 1) % availableLookbooks.length);
  }, [availableLookbooks.length]);

  const handlePrevLookbook = useCallback(() => {
    setActiveSlideIndex(
      (prev) => (prev - 1 + availableLookbooks.length) % availableLookbooks.length
    );
  }, [availableLookbooks.length]);

  const handleRefreshLookbook = useCallback(() => {
    setActiveSlideIndex((prev) => (prev + 1) % availableLookbooks.length);
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
        {/* 상단 날씨 정보 및 성별 토글 헤더 */}
        <WeatherHeader
          weather={weather}
          gender={gender}
          onToggleGender={handleToggleGender}
          onOpenSimulator={() => setSimulatorVisible(true)}
          onOpenAIGenerator={() => setAiModalVisible(true)}
          onRefreshLookbook={handleRefreshLookbook}
        />

        {/* 좌우 코디 넘기기 플로팅 버튼 */}
        <View style={styles.sideNavRow} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.navChevronBtn}
            onPress={handlePrevLookbook}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navChevronBtn}
            onPress={handleNextLookbook}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 하단 글래스모피즘 코디 가이드 시트 */}
        {currentLookbook && (
          <StyleGuideSheet
            lookbook={currentLookbook}
            currentIndex={safeIndex}
            totalCount={availableLookbooks.length}
            onSelectIndex={(index) => setActiveSlideIndex(index)}
            onNextLookbook={handleNextLookbook}
            onOpenAIGenerator={() => setAiModalVisible(true)}
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
        gender={gender}
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
    top: '48%',
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  navChevronBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
});
