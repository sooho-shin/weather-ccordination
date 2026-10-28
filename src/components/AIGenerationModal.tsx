import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gender, WeatherData } from '../types/weather';
import { GenerationStage } from '../types/outfit';

interface AIGenerationModalProps {
  visible: boolean;
  weather: WeatherData;
  gender: Gender;
  onClose: () => void;
  stage: GenerationStage;
  errorMessage: string | null;
  onGenerate: (mood: string) => Promise<void>;
}

const STYLE_MOODS = ['캐주얼', '모던 미니멀', '시크 스트릿', '클래식 포멀'];

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  visible,
  weather,
  gender,
  onClose,
  stage,
  errorMessage,
  onGenerate,
}) => {
  const [selectedMood, setSelectedMood] = useState(STYLE_MOODS[0]);
  const loading = stage !== null;

  const handleStartGenerate = () => {
    if (!loading) void onGenerate(selectedMood);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={loading ? () => {} : onClose}
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
                {stage === 'recommendation' ? '날씨와 스타일에 맞는 코디를 작성하고 있어요...' : '추천 아이템으로 사진을 생성하고 있어요...'}
              </Text>

            </View>
          ) : (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color="#007AFF" />
              <Text style={styles.infoText}>
                이 브라우저에서 코디 작성과 사진 생성은 각각 하루 10회까지 이용할 수 있어요. 사진 재시도도 생성 횟수에 포함돼요.
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
