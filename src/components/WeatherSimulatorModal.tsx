import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData, WeatherState } from '../types/weather';

interface WeatherSimulatorModalProps {
  visible: boolean;
  currentWeather: WeatherData;
  onClose: () => void;
  onApplyScenario: (temp: number, state: WeatherState, description: string) => void;
  onResetToRealGPS: () => void;
}

const PRESET_SCENARIOS: Array<{
  label: string;
  temp: number;
  state: WeatherState;
  desc: string;
  icon: string;
}> = [
  {
    label: '봄/가을 (목업 기준 룩)',
    temp: 22,
    state: 'Clear',
    desc: '맑음',
    icon: 'sunny',
  },
  {
    label: '한여름 폭염 룩',
    temp: 30,
    state: 'Clear',
    desc: '맑음',
    icon: 'flame',
  },
  {
    label: '간절기 쌀쌀한 가을',
    temp: 14,
    state: 'Clouds',
    desc: '구름 많음',
    icon: 'partly-sunny',
  },
  {
    label: '우천 비오는 날',
    temp: 18,
    state: 'Rain',
    desc: '비',
    icon: 'rainy',
  },
  {
    label: '한겨울 눈보라 한파',
    temp: -2,
    state: 'Snow',
    desc: '눈',
    icon: 'snow',
  },
];

export const WeatherSimulatorModal: React.FC<WeatherSimulatorModalProps> = ({
  visible,
  currentWeather,
  onClose,
  onApplyScenario,
  onResetToRealGPS,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>날씨 시뮬레이션 모드</Text>
              <Text style={styles.subtitle}>
                원하는 계절과 기온을 선택하여 코디 전환을 즉시 테스트해 보세요.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* 현재 적용 상태 */}
          <View style={styles.currentStatusBadge}>
            <Text style={styles.currentStatusLabel}>현재 적용 상태:</Text>
            <Text style={styles.currentStatusValue}>
              {currentWeather.temperature}°C ({currentWeather.weatherDescription})
            </Text>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {/* 프리셋 시나리오 버튼 목록 */}
            <Text style={styles.sectionHeader}>대표 계절 / 날씨 시나리오</Text>
            {PRESET_SCENARIOS.map((scenario) => {
              const isActive =
                currentWeather.temperature === scenario.temp &&
                currentWeather.weatherState === scenario.state;

              return (
                <TouchableOpacity
                  key={scenario.label}
                  style={[styles.scenarioCard, isActive && styles.scenarioCardActive]}
                  onPress={() => {
                    onApplyScenario(scenario.temp, scenario.state, scenario.desc);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.scenarioIconWrap}>
                    <Ionicons
                      name={scenario.icon as any}
                      size={20}
                      color={isActive ? '#007AFF' : '#1C1C1E'}
                    />
                  </View>
                  <View style={styles.scenarioTextWrap}>
                    <Text
                      style={[
                        styles.scenarioTitle,
                        isActive && styles.scenarioTitleActive,
                      ]}
                    >
                      {scenario.label}
                    </Text>
                    <Text style={styles.scenarioDetails}>
                      {scenario.temp}°C · {scenario.desc}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={22} color="#007AFF" />
                  )}
                </TouchableOpacity>
              );
            })}

            {/* 수동 기온 미세 조절 버튼 */}
            <Text style={styles.sectionHeader}>기온 단계별 미세 조절</Text>
            <View style={styles.tempAdjustRow}>
              <TouchableOpacity
                style={styles.tempBtn}
                onPress={() =>
                  onApplyScenario(
                    currentWeather.temperature - 3,
                    currentWeather.weatherState,
                    currentWeather.weatherDescription
                  )
                }
              >
                <Text style={styles.tempBtnText}>-3°C 내리기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tempBtn}
                onPress={() =>
                  onApplyScenario(
                    currentWeather.temperature + 3,
                    currentWeather.weatherState,
                    currentWeather.weatherDescription
                  )
                }
              >
                <Text style={styles.tempBtnText}>+3°C 올리기</Text>
              </TouchableOpacity>
            </View>

            {/* 실제 GPS로 복귀 버튼 */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                onResetToRealGPS();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="locate" size={16} color="#FF3B30" style={{ marginRight: 6 }} />
              <Text style={styles.resetBtnText}>실시간 GPS 실제 날씨로 복귀</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#8E8E93',
    marginTop: 4,
  },
  closeBtn: {
    padding: 4,
  },
  currentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  currentStatusLabel: {
    fontSize: 13,
    color: '#636366',
    marginRight: 6,
  },
  currentStatusValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  list: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3A3A3C',
    marginTop: 10,
    marginBottom: 8,
  },
  scenarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F9F9FB',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  scenarioCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#007AFF',
  },
  scenarioIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scenarioTextWrap: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  scenarioTitleActive: {
    color: '#007AFF',
  },
  scenarioDetails: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  tempAdjustRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tempBtn: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  tempBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2F2',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
    marginBottom: 14,
  },
  resetBtnText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '700',
  },
});
