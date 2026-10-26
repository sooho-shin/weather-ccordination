import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultImageGenerationService } from '../services/ai/envImageGenerationService';
import { generateOotdWithDeepSeek, isDeepSeekConfigured } from '../services/ai/deepseekService';
import { Gender, WeatherData } from '../types/weather';
import { OutfitLookbook } from '../types/outfit';

interface AIGenerationModalProps {
  visible: boolean;
  weather: WeatherData;
  gender: Gender;
  onClose: () => void;
  onGenerationSuccess: (newLookbook: OutfitLookbook) => void;
}

const STYLE_MOODS = ['캐주얼', '모던 미니멀', '시크 스트릿', '클래식 포멀'];

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  visible,
  weather,
  gender,
  onClose,
  onGenerationSuccess,
}) => {
  const [selectedMood, setSelectedMood] = useState(STYLE_MOODS[0]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [loading, countdown]);

  const handleStartGenerate = async () => {
    setLoading(true);
    setCountdown(20);
    setErrorMessage(null);

    try {
      // 1. DeepSeek API가 설정되어 있는 경우 지능형 코디 엔진 우선 시도
      if (isDeepSeekConfigured()) {
        const targetTpo =
          selectedMood === '클래식 포멀' ? 'office' : selectedMood === '시크 스트릿' ? 'street' : 'daily';
        const dsResult = await generateOotdWithDeepSeek(weather, targetTpo, gender, selectedMood);

        if (dsResult.success && dsResult.lookbook) {
          onGenerationSuccess(dsResult.lookbook);
          onClose();
          return;
        }
      }

      // 2. 기본 이미지 생성 서비스 호출 (OpenAI / Fal / Mock 안전 폴백)
      const result = await defaultImageGenerationService.generateOutfit({
        gender,
        temperature: weather.temperature,
        weatherState: weather.weatherState,
        precipitation: weather.precipitation,
        styleMood: selectedMood,
      });

      if (result.lookbook) {
        onGenerationSuccess(result.lookbook);
        onClose();
      } else {
        setErrorMessage(result.errorMessage || 'AI 코디 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* 닫기 버튼 */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            disabled={loading}
          >
            <Ionicons name="close" size={24} color="#8E8E93" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.sparkleIcon}>
              <Ionicons name="sparkles" size={24} color="#FF9500" />
            </View>
            <Text style={styles.title}>AI 맞춤 코디 생성</Text>
            <Text style={styles.subtitle}>
              오늘의 날씨({weather.temperature}°C {weather.weatherDescription})와{' '}
              {gender === 'female' ? '여성' : '남성'} 스타일에 맞춘 실사 화보를 새롭게 생성합니다.
            </Text>
          </View>

          {/* 스타일 무드 선택 */}
          <Text style={styles.sectionLabel}>스타일 무드 선택</Text>
          <View style={styles.moodsRow}>
            {STYLE_MOODS.map((mood) => {
              const isSelected = selectedMood === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodChip, isSelected && styles.moodChipActive]}
                  onPress={() => setSelectedMood(mood)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.moodChipText,
                      isSelected && styles.moodChipTextActive,
                    ]}
                  >
                    {mood}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 로딩 상태 안내 */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>
                오늘 날씨에 맞춘 실사 화보를 생성하고 있습니다...
              </Text>
              <Text style={styles.countdownText}>
                타임아웃까지 {countdown}초 남음
              </Text>
            </View>
          ) : (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color="#007AFF" />
              <Text style={styles.infoText}>
                API Key가 없는 경우에도 안전한 고품질 A컷 시뮬레이션으로 즉시 테스트할 수 있습니다.
              </Text>
            </View>
          )}

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {/* 생성 버튼 */}
          <TouchableOpacity
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleStartGenerate}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.generateBtnText}>
              {loading ? '생성 중...' : '지금 AI 코디 생성하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sparkleIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF4E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3A3A3C',
    marginBottom: 10,
  },
  moodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  moodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
  },
  moodChipActive: {
    backgroundColor: '#1C1C1E',
  },
  moodChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#48484A',
  },
  moodChipTextActive: {
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 11.5,
    color: '#007AFF',
    lineHeight: 16,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 6,
  },
  countdownText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  generateBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  generateBtnDisabled: {
    backgroundColor: '#A2CFFE',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
