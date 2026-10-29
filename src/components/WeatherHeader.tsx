import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../types/weather';

// 기온 숫자: 기존 48px 대비 3.5배
const TEMP_FONT_BASE = 48;
const TEMP_FONT_SCALE = 3.5;
const TEMP_FONT_SIZE = TEMP_FONT_BASE * TEMP_FONT_SCALE;
const HEADER_HORIZONTAL_PADDING = 20;
const STATE_ICON_SIZE = 36;
const TEMP_ROW_GAP = 8;

/**
 * 기온 숫자가 가로 폭을 넘지 않도록 글자 수에 맞춰 폰트 크기를 줄인다.
 * (영하 두 자리 같은 긴 값이나 좁은 화면에서도 잘리지 않게 하는 안전장치. 일반적인 값은 3.5배 그대로.)
 */
const getTemperatureFontSize = (text: string, availableWidth: number): number => {
  const widthInEm = Array.from(text).reduce((sum, ch) => {
    if (ch === '-') return sum + 0.4;
    if (ch === '°') return sum + 0.45;
    return sum + 0.6;
  }, 0);
  return Math.min(TEMP_FONT_SIZE, Math.floor(availableWidth / widthInEm));
};

interface WeatherHeaderProps {
  weather: WeatherData;
  onOpenMenu: () => void;
  isWeatherReady?: boolean;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  onOpenMenu,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w !== containerWidth) setContainerWidth(w);
  };

  // 시안: 흰색 외곽선(outline) 날씨 아이콘
  const getWeatherIcon = (): React.ComponentProps<typeof Ionicons>['name'] => {
    switch (weather.weatherState) {
      case 'Clear':
        return 'sunny-outline';
      case 'Clouds':
        return 'cloud-outline';
      case 'Rain':
        return 'rainy-outline';
      case 'Snow':
        return 'snow-outline';
      default:
        return 'partly-sunny-outline';
    }
  };

  const tempMax = weather.tempMax ?? weather.temperature + 3;
  const tempMin = weather.tempMin ?? weather.temperature - 4;

  const temperatureText = `${weather.temperature}°`;
  const availableTempWidth =
    (containerWidth || windowWidth) -
    HEADER_HORIZONTAL_PADDING * 2 -
    STATE_ICON_SIZE -
    TEMP_ROW_GAP;
  const temperatureFontSize = getTemperatureFontSize(temperatureText, availableTempWidth);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* 1. 상단 바: 현재 위치 / 최저~최고 (좌), 햄버거 메뉴 (우) */}
      <View style={styles.topBar}>
        <View style={styles.locationBlock}>
          <View style={styles.locationRow}>
            <Text style={styles.locationText} numberOfLines={1}>
              {weather.locationName}
            </Text>
            {weather.isSimulated && <Text style={styles.simulatedTag}>테스트</Text>}
          </View>
          <Text style={styles.rangeText}>
            {tempMin}° ~ {tempMax}°
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={onOpenMenu}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="메뉴 열기"
        >
          <Ionicons name="menu" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 2. 현재 기온 (3.5배) + 날씨 아이콘 */}
      <View style={styles.tempRow}>
        <Text
          style={[
            styles.temperature,
            {
              fontSize: temperatureFontSize,
              lineHeight: Math.round(temperatureFontSize * 1.1),
              letterSpacing: -Math.round(temperatureFontSize * 0.03),
            },
          ]}
          numberOfLines={1}
        >
          {temperatureText}
        </Text>
        <Ionicons
          name={getWeatherIcon()}
          size={STATE_ICON_SIZE}
          color="#FFFFFF"
          style={styles.stateIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingTop: Platform.OS === 'ios' ? 44 : 28,
    paddingBottom: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationBlock: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    maxWidth: 200,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  simulatedTag: {
    marginLeft: 6,
    fontSize: 11,
    color: '#FF9500',
    fontWeight: '700',
  },
  rangeText: {
    marginTop: 2,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.92)',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(120, 120, 128, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMP_ROW_GAP,
  },
  // fontSize / lineHeight / letterSpacing은 화면 폭에 맞춰 컴포넌트에서 계산해 덮어쓴다.
  temperature: {
    fontSize: TEMP_FONT_SIZE,
    fontWeight: '300',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  stateIcon: {
    marginBottom: 6,
  },
});
