import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { OutfitLookbook } from '../types/outfit';
import { OutfitItemCard } from './OutfitItemCard';

interface StyleGuideSheetProps {
  lookbook: OutfitLookbook;
  currentIndex: number;
  totalCount: number;
  onSelectIndex: (index: number) => void;
  onShuffle: () => void;
  onOpenAIGenerator: () => void;
  onQuickAiGenerate?: () => void;
  isAiGenerating?: boolean;
  isAiGenerated?: boolean;
}

export const StyleGuideSheet: React.FC<StyleGuideSheetProps> = ({
  lookbook,
  currentIndex,
  totalCount,
  onSelectIndex,
  onShuffle,
  onOpenAIGenerator,
  onQuickAiGenerate,
  isAiGenerating = false,
  isAiGenerated = false,
}) => {
  const defenseTags = lookbook.weatherDefenseTags || ['#오늘의_OOTD', '#날씨맞춤'];

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={75} tint="light" style={styles.blurContainer}>
        {/* 1. 상단 헤더: 스타일 타이틀 및 설명 */}
        <View style={styles.header}>
          <View style={styles.topBadgeRow}>
            <View style={styles.guideBadge}>
              <Text style={styles.guideBadgeText}>
                OOTD Curation ({currentIndex + 1}/{totalCount})
              </Text>
            </View>
            {isAiGenerated && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={11} color="#FF9500" />
                <Text style={styles.aiBadgeText}>AI Curation</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{lookbook.styleTitle}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {lookbook.styleDescription}
          </Text>
        </View>

        {/* 2. 날씨 방어 태그 영역 (기획서 핵심: #우산_필수, #밝은바지_금지 등) */}
        <View style={styles.defenseTagsRow}>
          {defenseTags.map((tag, idx) => (
            <View key={idx} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 3. 코디 세부 아이템 가로 스크롤 카드 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {lookbook.items.map((item) => (
            <OutfitItemCard key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* 4. 하단 셔플 및 AI 버튼 액션 영역 */}
        <View style={styles.footer}>
          {/* 페이징 인디케이터 도트 */}
          <View style={styles.paginationDots}>
            {Array.from({ length: totalCount }).map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => onSelectIndex(idx)}
                style={[
                  styles.dot,
                  idx === currentIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* 버튼 그룹: 코디 셔플 🔀 & DeepSeek AI 실시간 추천 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.shuffleBtn}
              onPress={onShuffle}
              activeOpacity={0.8}
            >
              <Ionicons name="shuffle" size={14} color="#000000" />
              <Text style={styles.shuffleBtnText}>코디 셔플</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aiButton, isAiGenerating && styles.aiButtonDisabled]}
              onPress={onQuickAiGenerate || onOpenAIGenerator}
              disabled={isAiGenerating}
              activeOpacity={0.8}
            >
              {isAiGenerating ? (
                <ActivityIndicator size="small" color="#FF9500" style={{ marginRight: 4 }} />
              ) : (
                <Ionicons name="sparkles" size={13} color="#FF9500" />
              )}
              <Text style={styles.aiButtonLabel}>
                {isAiGenerating ? 'AI 분석중...' : 'AI 맞춤'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreAiBtn}
              onPress={onOpenAIGenerator}
              activeOpacity={0.7}
              accessibilityLabel="AI 무드 선택"
            >
              <Ionicons name="options-outline" size={14} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 22,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
      } as any,
    }),
  },
  blurContainer: {
    backgroundColor:
      Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.48)' : 'rgba(255, 255, 255, 0.90)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 6,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  guideBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  guideBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#3C3C43',
    letterSpacing: 0.5,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#3C3C43',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  defenseTagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  tagChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  scrollList: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#000000',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  shuffleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  aiButtonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
  },
  aiButtonDisabled: {
    opacity: 0.6,
  },
  moreAiBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
});
