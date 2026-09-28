import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gender, WeatherData } from '../types/weather';

interface WeatherHeaderProps {
  weather: WeatherData;
  gender: Gender;
  onToggleGender: () => void;
  onOpenSimulator: () => void;
  onOpenAIGenerator: () => void;
  onRefreshLookbook?: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  gender,
  onToggleGender,
  onOpenSimulator,
  onOpenAIGenerator,
  onRefreshLookbook,
}) => {
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

  return (
    <View style={styles.container}>
      {/* 좌측: 기온, 날씨 상태, 위치 */}
      <View style={styles.weatherInfo}>
        <Text style={styles.temperature}>{weather.temperature}°</Text>
        <View style={styles.weatherStateRow}>
          <Ionicons
            name={getWeatherIcon()}
            size={22}
            color={getWeatherIconColor()}
            style={styles.stateIcon}
          />
          <Text style={styles.weatherStateText}>{weather.weatherDescription}</Text>
        </View>
        <View style={styles.locationBadge}>
          <Ionicons name="location-sharp" size={13} color="rgba(255, 255, 255, 0.9)" />
          <Text style={styles.locationText} numberOfLines={1}>
            {weather.locationName}
          </Text>
          {weather.isSimulated && <Text style={styles.simulatedTag}>테스트</Text>}
        </View>
      </View>

      {/* 우측 컨트롤: 성별 전환 토글 및 시뮬레이터/AI 버튼 */}
      <View style={styles.controls}>
        {/* 성별 토글 스위치 */}
        <TouchableOpacity
          style={styles.genderToggle}
          onPress={onToggleGender}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.genderOption,
              gender === 'female' && styles.genderOptionActive,
            ]}
          >
            <Text
              style={[
                styles.genderText,
                gender === 'female' && styles.genderTextActive,
              ]}
            >
              여성 👩
            </Text>
          </View>
          <View
            style={[
              styles.genderOption,
              gender === 'male' && styles.genderOptionActive,
            ]}
          >
            <Text
              style={[
                styles.genderText,
                gender === 'male' && styles.genderTextActive,
              ]}
            >
              남성 👨
            </Text>
          </View>
        </TouchableOpacity>

        {/* 유틸리티 액션 버튼들 */}
        <View style={styles.actionButtonsRow}>
          {onRefreshLookbook && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRefreshLookbook}
              activeOpacity={0.7}
              accessibilityLabel="코디 새로고침"
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenSimulator}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.aiButtonHighlight]}
            onPress={onOpenAIGenerator}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={16} color="#FFD60A" />
            <Text style={styles.aiButtonText}>AI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 54,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  weatherStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  stateIcon: {
    marginRight: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  weatherStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    marginLeft: 4,
    fontWeight: '500',
  },
  simulatedTag: {
    fontSize: 10,
    color: '#FFD60A',
    fontWeight: '700',
    marginLeft: 5,
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  controls: {
    alignItems: 'flex-end',
  },
  genderToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderRadius: 22,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  genderOptionActive: {
    backgroundColor: '#FFFFFF',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  genderTextActive: {
    color: '#000000',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiButtonHighlight: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: 'auto',
    gap: 4,
    backgroundColor: 'rgba(28, 28, 30, 0.65)',
    borderColor: '#FFD60A',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
