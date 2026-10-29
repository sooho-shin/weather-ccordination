import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gender } from '../types/weather';
import { TpoCategory } from '../types/outfit';
import { TPO_OPTIONS } from './TpoTabBar';

interface MenuSheetProps {
  visible: boolean;
  onClose: () => void;
  gender: Gender;
  onSelectGender: (gender: Gender) => void;
  selectedTpo: TpoCategory;
  onSelectTpo: (tpo: TpoCategory) => void;
  canShuffle: boolean;
  onShuffle: () => void;
  isAiGenerating: boolean;
  onQuickAiGenerate: () => void;
  onOpenAiMood: () => void;
  onOpenWardrobe: () => void;
  onOpenSimulator: () => void;
}

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: 'female', label: '여' },
  { key: 'male', label: '남' },
  { key: 'all', label: '모두' },
];

interface ActionRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  description?: string;
  onPress: () => void;
  disabled?: boolean;
}

const ActionRow: React.FC<ActionRowProps> = ({ icon, label, description, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.actionRow, disabled && styles.actionRowDisabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <View style={styles.actionIcon}>
      <Ionicons name={icon} size={20} color="#111111" />
    </View>
    <View style={styles.actionTextBox}>
      <Text style={styles.actionLabel}>{label}</Text>
      {!!description && <Text style={styles.actionDescription}>{description}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
  </TouchableOpacity>
);

export const MenuSheet: React.FC<MenuSheetProps> = ({
  visible,
  onClose,
  gender,
  onSelectGender,
  selectedTpo,
  onSelectTpo,
  canShuffle,
  onShuffle,
  isAiGenerating,
  onQuickAiGenerate,
  onOpenAiMood,
  onOpenWardrobe,
  onOpenSimulator,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* 바깥 영역을 누르면 닫기 */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="메뉴 닫기"
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>메뉴</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Ionicons name="close" size={24} color="#111111" />
            </TouchableOpacity>
          </View>

          {/* 성별 */}
          <Text style={styles.sectionLabel}>성별</Text>
          <View style={styles.segment}>
            {GENDER_OPTIONS.map((opt) => {
              const active = gender === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.segmentOption, active && styles.segmentOptionActive]}
                  onPress={() => onSelectGender(opt.key)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 코디 종류 (TPO) */}
          <Text style={styles.sectionLabel}>코디 종류</Text>
          <View style={styles.segment}>
            {TPO_OPTIONS.map((opt) => {
              const active = selectedTpo === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.segmentOption, active && styles.segmentOptionActive]}
                  onPress={() => onSelectTpo(opt.key)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    style={[styles.segmentText, active && styles.segmentTextActive]}
                    numberOfLines={1}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 기능 목록 */}
          <View style={styles.actions}>
            <ActionRow
              icon="shuffle"
              label="코디 셔플"
              description="다른 코디를 랜덤으로 보여줘요"
              onPress={onShuffle}
              disabled={!canShuffle}
            />
            <ActionRow
              icon="sparkles"
              label="AI 맞춤 코디"
              description={isAiGenerating ? '생성 중이에요' : '지금 날씨에 맞게 새로 만들어요'}
              onPress={onQuickAiGenerate}
              disabled={isAiGenerating}
            />
            <ActionRow
              icon="color-wand-outline"
              label="AI 무드 선택"
              description="원하는 분위기로 AI 코디를 만들어요"
              onPress={onOpenAiMood}
            />
            <ActionRow
              icon="bookmark-outline"
              label="내 옷장 보관함"
              description="저장한 코디를 모아봐요"
              onPress={onOpenWardrobe}
            />
            <ActionRow
              icon="partly-sunny-outline"
              label="날씨 시뮬레이터"
              description="다른 날씨로 코디를 미리 봐요"
              onPress={onOpenSimulator}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    // 웹에서 데스크톱처럼 넓은 화면이어도 시트가 지나치게 퍼지지 않게
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.4,
  },
  sectionLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 3,
  },
  segmentOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOptionActive: {
    backgroundColor: '#111111',
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#3C3C43',
    letterSpacing: -0.2,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  actions: {
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
  },
  actionRowDisabled: {
    opacity: 0.4,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextBox: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  actionDescription: {
    marginTop: 2,
    fontSize: 12.5,
    color: '#8E8E93',
  },
});
