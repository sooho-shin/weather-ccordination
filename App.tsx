import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
        />

        {/* 하단 글래스모피즘 코디 가이드 시트 */}
        {currentLookbook && (
          <StyleGuideSheet
            lookbook={currentLookbook}
            currentIndex={safeIndex}
            totalCount={availableLookbooks.length}
            onSelectIndex={(index) => setActiveSlideIndex(index)}
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
});
