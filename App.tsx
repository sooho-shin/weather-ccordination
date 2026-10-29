import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { Gender, WeatherData, WeatherState } from './src/types/weather';
import { OutfitLookbook, TpoCategory, GenerationStage } from './src/types/outfit';
import { getTemperatureBand } from './src/constants/temperatureBands';
import { findMatchingLookbooks } from './src/data/presetLookbooks';
import { getCurrentLocation, getCachedLocation } from './src/services/locationService';
import { fetchCurrentWeather, getCachedWeather, getApparentWeatherKeywords } from './src/services/weatherService';

import { FullscreenBackground } from './src/components/FullscreenBackground';
import { WeatherHeader } from './src/components/WeatherHeader';
import { MenuSheet } from './src/components/MenuSheet';
import { StyleGuideSheet } from './src/components/StyleGuideSheet';
import { AIGenerationModal } from './src/components/AIGenerationModal';
import { WeatherSimulatorModal } from './src/components/WeatherSimulatorModal';
import { WardrobeModal } from './src/components/WardrobeModal';
import { generateOotdWithDeepSeek, retryLookbookImage } from './src/services/ai/deepseekService';
import { saveOutfitToWardrobe, fetchWardrobeOutfits } from './src/services/wardrobeService';
import { matchesLookbookContext, matchesLookbookWeather } from './src/utils/lookbookContext';
import { useHorizontalSwipe } from './src/hooks/useHorizontalSwipe';

export default function App() {
  // 0. 웹 및 네이티브 폰트 안전 로드
  useFonts({
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

  // 0. 캐시된 날씨 또는 최근 위치 기반 초기값 (서울특별시 덜컹거림 원천 차단)
  const [weather, setWeather] = useState<WeatherData>(() => {
    const cached = getCachedWeather();
    if (cached) return cached;

    const cachedLoc = getCachedLocation();
    return {
      temperature: 18,
      tempMax: 21,
      tempMin: 12,
      apparentKeyword: getApparentWeatherKeywords(18, 'Clear').apparentKeyword,
      weatherStateKeyword: '날씨 확인중',
      weatherState: 'Clear',
      weatherDescription: '맑음',
      precipitation: 0,
      locationName: cachedLoc?.name || '현재 위치 확인 중...',
      isSimulated: false,
    };
  });

  const [isWeatherReady, setIsWeatherReady] = useState(() => Boolean(getCachedWeather()));
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [aiCustomLookbook, setAiCustomLookbook] = useState<OutfitLookbook | null>(null);
  const [generationStage, setGenerationStage] = useState<GenerationStage>(null);
  const isAiGenerating = generationStage !== null;
  const generationLocked = useRef(false);
  const savingLocked = useRef(false);
  const loadedImage = useRef<{ id: string; source: unknown; uri: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [operationNotice, setOperationNotice] = useState<string | null>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [simulatorVisible, setSimulatorVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [wardrobeVisible, setWardrobeVisible] = useState(false);
  const [savedOutfitIds, setSavedOutfitIds] = useState<Set<string>>(() => new Set());

  // 메뉴 시트를 닫은 뒤 다른 모달/동작을 연다 (네이티브에서 모달 두 개가 겹쳐 뜨지 않도록 약간 지연)
  const runAfterMenuClose = useCallback((action: () => void) => {
    setMenuVisible(false);
    setTimeout(action, Platform.OS === 'web' ? 0 : 350);
  }, []);

  // 2. 실시간 GPS 위치 및 실제 날씨 비동기 로딩
  const loadRealWeather = useCallback(async () => {
    try {
      const loc = await getCurrentLocation();
      const realWeather = await fetchCurrentWeather(loc.latitude, loc.longitude, loc.name);
      setWeather(realWeather);
      setIsWeatherReady(true);
    } catch (e) {
      console.warn('날씨 로딩 실패, 기존값 유지:', e);
      setIsWeatherReady(true);
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
      if (matchesLookbookContext(aiCustomLookbook, weather, gender, selectedTpo)) {
        return [aiCustomLookbook, ...presets];
      }
    }
    return presets;
  }, [gender, currentTempBand, weather, selectedTpo, aiCustomLookbook]);

  // 슬라이드 인덱스 범위 초과 방지
  const safeIndex = activeSlideIndex >= availableLookbooks.length ? 0 : activeSlideIndex;
  const currentLookbook = availableLookbooks[safeIndex] || availableLookbooks[0];
  const latestContext = useRef({ weather, gender, selectedTpo, lookbookId: currentLookbook?.id });
  latestContext.current = { weather, gender, selectedTpo, lookbookId: currentLookbook?.id };

  useEffect(() => {
    fetchWardrobeOutfits().then((list) => setSavedOutfitIds(new Set(list.map((item) => item.id)))).catch(() => {});
  }, []);


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
    // 체감 문구는 weatherService의 단일 정의를 사용 (중복 정의로 문구가 어긋나지 않게)
    const { apparentKeyword, weatherStateKeyword } = getApparentWeatherKeywords(temp, state);

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

  // 하단 카드를 좌우로 밀어서 룩북 넘기기
  const swipeHandlers = useHorizontalSwipe(handlePrevLookbook, handleNextLookbook);

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

  const handleSaveCurrentOutfit = useCallback(async () => {
    if (!currentLookbook || savingLocked.current) return;
    savingLocked.current = true;
    setIsSaving(true);
    setOperationNotice(null);
    try {
      const resolved = loadedImage.current;
      const result = await saveOutfitToWardrobe({ ...currentLookbook,
        imageUrl: resolved?.id === currentLookbook.id && resolved.source === currentLookbook.imageUrl ? resolved.uri : currentLookbook.imageUrl,
      });
      if (result.success) {
        setSavedOutfitIds((prev) => new Set(prev).add(currentLookbook.id));
        setOperationNotice('이 브라우저에 사진과 코디를 저장했어요.');
      } else {
        setOperationNotice(result.errorMessage || '코디를 저장하지 못했어요.');
      }
    } finally {
      savingLocked.current = false;
      setIsSaving(false);
    }
  }, [currentLookbook]);

  const handleApplyWardrobeOutfit = useCallback((outfit: OutfitLookbook) => {
    if (!matchesLookbookWeather(outfit, weather)) {
      setOperationNotice('저장한 코디의 기온대·날씨가 현재와 달라 적용하지 않았어요. 현재 날씨로 새 코디를 생성해 주세요.');
      return;
    }
    setGender(outfit.gender);
    setSelectedTpo(outfit.tpo || 'daily');
    setAiCustomLookbook(outfit);
    setActiveSlideIndex(0);
  }, [weather]);

  const handleGenerate = useCallback(async (mood?: string) => {
    if (generationLocked.current) return;
    generationLocked.current = true;
    setGenerationStage('recommendation');
    setAiError(null);
    setOperationNotice(null);
    const started = latestContext.current;
    const targetTpo = mood ? (mood === '클래식 포멀' ? 'office' : mood === '시크 스트릿' ? 'street' : 'daily') : started.selectedTpo;
    try {
      const result = await generateOotdWithDeepSeek(started.weather, targetTpo, started.gender === 'all' ? 'female' : started.gender, mood, setGenerationStage);
      if (!result.success || !result.lookbook) {
        setAiError(result.errorMessage || '코디를 생성하지 못했어요. 다시 시도해 주세요.');
        setAiModalVisible(true);
        return;
      }
      const latest = latestContext.current;
      if (latest.selectedTpo !== started.selectedTpo || !matchesLookbookContext(result.lookbook, latest.weather, latest.gender, targetTpo)) {
        setOperationNotice('생성 중 날씨나 선택 조건이 바뀌었어요. 현재 조건으로 다시 생성해 주세요.');
        return;
      }
      setSelectedTpo(targetTpo);
      setAiCustomLookbook(result.lookbook);
      setActiveSlideIndex(0);
      setAiModalVisible(false);
    } catch {
      setAiError('코디를 작성하지 못했어요. 잠시 후 다시 시도해 주세요.');
      setAiModalVisible(true);
    } finally {
      generationLocked.current = false;
      setGenerationStage(null);
    }
  }, []);

  const handleRetryImage = useCallback(async () => {
    if (!currentLookbook || generationLocked.current) return;
    generationLocked.current = true;
    setGenerationStage('image');
    setAiError(null);
    setOperationNotice(null);
    try {
      const updated = await retryLookbookImage(currentLookbook, setGenerationStage);
      const latest = latestContext.current;
      if (latest.lookbookId !== currentLookbook.id || !matchesLookbookContext(updated, latest.weather, latest.gender, latest.selectedTpo)) {
        setOperationNotice('생성 중 날씨나 선택 코디가 바뀌었어요. 현재 코디에서 다시 시도해 주세요.');
        return;
      }
      setAiCustomLookbook(updated);
      if (!updated.imageGenerationFailed) {
        setSavedOutfitIds((prev) => { const next = new Set(prev); next.delete(updated.id); return next; });
      }
    } catch {
      setOperationNotice('사진을 다시 생성하지 못했어요. 추천 코디는 그대로 유지됩니다.');
    } finally {
      generationLocked.current = false;
      setGenerationStage(null);
    }
  }, [currentLookbook]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. 풀스크린 실사 배경 화보 */}
      {currentLookbook && (
        <FullscreenBackground imageUrl={currentLookbook.imageUrl} onImageReady={(uri) => {
          loadedImage.current = { id: currentLookbook.id, source: currentLookbook.imageUrl, uri };
        }} />
      )}

      {/* 2. 안전 영역 내 오버레이 UI */}
      <SafeAreaView style={styles.safeArea}>
        {/* 상단: 큰 현재 기온, 현재 위치/최저~최고, 햄버거 메뉴 */}
        <View>
          <WeatherHeader
            weather={weather}
            onOpenMenu={() => setMenuVisible(true)}
            isWeatherReady={isWeatherReady}
          />
        </View>

        {/* 하단: 코디 카드 (제목/설명 + 아이템 목록 + 페이지 점 + 저장). 좌우로 밀어서 코디 넘기기 */}
        {currentLookbook && (
          <StyleGuideSheet
            lookbook={currentLookbook}
            currentIndex={safeIndex}
            totalCount={availableLookbooks.length}
            onSelectIndex={(index) => setActiveSlideIndex(index)}
            swipeHandlers={swipeHandlers}
            onSaveToWardrobe={handleSaveCurrentOutfit}
            isSavedToWardrobe={Boolean(currentLookbook && savedOutfitIds.has(currentLookbook.id))}
            isAiGenerating={isAiGenerating}
            generationStage={generationStage}
            onRetryImage={handleRetryImage}
            notice={operationNotice || aiError}
            isSaving={isSaving}
            isAiGenerated={currentLookbook.imageSource === 'ai'}
          />
        )}
      </SafeAreaView>

      {/* 3. 모달 레이어 */}
      <MenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        gender={gender}
        onSelectGender={handleSelectGender}
        selectedTpo={selectedTpo}
        onSelectTpo={handleSelectTpo}
        canShuffle={availableLookbooks.length > 1}
        onShuffle={() => runAfterMenuClose(handleShuffleLookbook)}
        isAiGenerating={isAiGenerating}
        onQuickAiGenerate={() => runAfterMenuClose(() => { void handleGenerate(); })}
        onOpenAiMood={() => runAfterMenuClose(() => setAiModalVisible(true))}
        onOpenWardrobe={() => runAfterMenuClose(() => setWardrobeVisible(true))}
        onOpenSimulator={() => runAfterMenuClose(() => setSimulatorVisible(true))}
      />

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
        stage={generationStage}
        errorMessage={aiError || operationNotice}
        onGenerate={handleGenerate}
      />

      <WardrobeModal
        visible={wardrobeVisible}
        onClose={() => setWardrobeVisible(false)}
        onApplyOutfit={handleApplyWardrobeOutfit}
        onDeleteOutfit={(id) => setSavedOutfitIds((prev) => { const next = new Set(prev); next.delete(id); return next; })}
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
