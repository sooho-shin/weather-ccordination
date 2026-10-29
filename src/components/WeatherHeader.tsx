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
import { Gender, WeatherData } from '../types/weather';

// 기온 숫자: 기존 48px 대비 3.5배
const TEMP_FONT_BASE = 48;
const TEMP_FONT_SCALE = 3.5;
const TEMP_FONT_SIZE = TEMP_FONT_BASE * TEMP_FONT_SCALE;
const HEADER_HORIZONTAL_PADDING = 20;
const STATE_ICON_SIZE = 24;
const TEMP_ROW_GAP = 6;

/**
 * 기온 숫자가 가로 폭을 넘지 않도록 글자 수에 맞춰 폰트 크기를 줄인다.
 * (영하 두 자리 같은 긴 값에서도 잘리지 않게 하는 안전장치. 일반적인 값은 3.5배 그대로.)
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
  gender: Gender;
  onSelectGender: (gender: Gender) => void;
  onOpenSimulator: () => void;
  onOpenAIGenerator: () => void;
  onOpenWardrobe?: () => void;
  isWeatherReady?: boolean;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  gender,
  onSelectGender,
  onOpenSimulator,
  onOpenAIGenerator,
  onOpenWardrobe,
  isWeatherReady = true,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w !== containerWidth) setContainerWidth(w);
  };

  const getWeatherIcon = () => {
    switch (weather.weatherState) {
      case 'Clear':
        return 'sunny';
      case 'Clouds':
        return 'cloudy';
      case 'Rain':
        return 'rainy';
      case 'Snow':
        return 'snow';
      default:
        return 'partly-sunny';
    }
  };

  const getWeatherIconColor = () => {
    switch (weather.weatherState) {
      case 'Clear':
        return '#FFB800';
      case 'Clouds':
        return '#E5E5EA';
      case 'Rain':
        return '#5AC8FA';
      case 'Snow':
        return '#FFFFFF';
      default:
        return '#FFB800';
    }
  };

  const apparentBadge = weather.apparentKeyword || '선선하다';
  const stateBadge = weather.weatherStateKeyword || weather.weatherDescription;

  const temperatureText = `${weather.temperature}°`;
  const availableTempWidth =
    (containerWidth || windowWidth) -
    HEADER_HORIZONTAL_PADDING * 2 -
    STATE_ICON_SIZE -
    TEMP_ROW_GAP;
  const temperatureFontSize = getTemperatureFontSize(temperatureText, availableTempWidth);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* 1. 상단 바: 위치 및 유틸리티 버튼 */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={12} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.locationText} numberOfLines={1}>
              {weather.locationName}
            </Text>
            {weather.isSimulated && <Text style={styles.simulatedTag}>테스트</Text>}
          </View>
        </View>

        {/* 유틸리티 액션 버튼 (미니멀) */}
        <View style={styles.actionButtonsRow}>
          {onOpenWardrobe && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onOpenWardrobe}
              activeOpacity={0.7}
              accessibilityLabel="내 옷장 보관함"
            >
              <Ionicons name="bookmark-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenSimulator}
            activeOpacity={0.7}
            accessibilityLabel="날씨 시뮬레이터"
          >
            <Ionicons name="menu" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.aiButtonHighlight]}
            onPress={onOpenAIGenerator}
            activeOpacity={0.7}
            accessibilityLabel="AI 생성 모달"
          >
            <Ionicons name="sparkles" size={15} color="#FFD60A" />
            <Text style={styles.aiButtonText}>AI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. 메인 체감 날씨 및 기온 정보 */}
      <View style={styles.weatherMain}>
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
            color={getWeatherIconColor()}
            style={styles.stateIcon}
          />
        </View>

        {/* 최고/최저 기온 */}
        <Text style={styles.rangeText}>
          최고 {weather.tempMax ?? weather.temperature + 3}° / 최저 {weather.tempMin ?? weather.temperature - 4}°
        </Text>

        <View style={styles.weatherMetaRow}>
          {/* 체감 키워드 뱃지 그룹 */}
          <View style={styles.badgeRow}>
            <View style={styles.apparentBadge}>
              <Text style={styles.apparentBadgeText}>{apparentBadge}</Text>
            </View>
            <View style={styles.stateBadge}>
              <Text style={styles.stateBadgeText}>{stateBadge}</Text>
            </View>
          </View>

        {/* 3. 성별 선택 (여 / 남 / 모두 3버튼) */}
        <View style={styles.genderControl}>
          <View style={styles.genderToggle}>
            <TouchableOpacity
              style={[styles.genderOption, gender === 'female' && styles.genderOptionActive]}
              onPress={() => onSelectGender('female')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                여
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderOption, gender === 'male' && styles.genderOptionActive]}
              onPress={() => onSelectGender('male')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                남
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderOption, gender === 'all' && styles.genderOptionActive]}
              onPress={() => onSelectGender('all')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderText, gender === 'all' && styles.genderTextActive]}>
                모두
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 28,
    paddingBottom: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.92)',
    fontWeight: '600',
    marginLeft: 3,
    maxWidth: 130,
  },
  simulatedTag: {
    marginLeft: 4,
    fontSize: 9,
    color: '#FF9500',
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiButtonHighlight: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    width: 'auto',
    gap: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderColor: 'rgba(255, 214, 10, 0.5)',
  },
  aiButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFD60A',
  },
  weatherMain: {
    alignItems: 'stretch',
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
  weatherMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  stateIcon: {
    marginBottom: 6,
  },
  rangeText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apparentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      } as any,
    }),
  },
  apparentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  stateBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  stateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  genderControl: {
    alignItems: 'flex-end',
  },
  genderToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    borderRadius: 18,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderOption: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
  },
  genderOptionActive: {
    backgroundColor: '#FFFFFF',
  },
  genderText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
});
