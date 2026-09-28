import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
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
  onNextLookbook: () => void;
  onOpenAIGenerator: () => void;
}

export const StyleGuideSheet: React.FC<StyleGuideSheetProps> = ({
  lookbook,
  currentIndex,
  totalCount,
  onSelectIndex,
  onNextLookbook,
  onOpenAIGenerator,
}) => {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={70} tint="light" style={styles.blurContainer}>
        {/* 상단 탭 헤더 */}
        <View style={styles.header}>
          <View style={styles.styleGuideBadge}>
            <Text style={styles.styleGuideText}>STYLE GUIDE ({currentIndex + 1}/{totalCount})</Text>
            <Ionicons name="chevron-down" size={14} color="#6C6C70" style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.title}>오늘의 코디 추천</Text>
          <Text style={styles.styleSubtitle}>{lookbook.styleTitle}</Text>
        </View>

        {/* 코디 세부 아이템 가로 스크롤 리스트 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {lookbook.items.map((item) => (
            <OutfitItemCard key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* 하단 페이징 인디케이터 및 액션 */}
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

          {/* 버튼 그룹: 다음 스타일 새로고침 & AI 모달 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.nextStyleBtn}
              onPress={onNextLookbook}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={13} color="#000000" />
              <Text style={styles.nextStyleBtnText}>다음 코디</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aiButton}
              onPress={onOpenAIGenerator}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={13} color="#FF9500" />
              <Text style={styles.aiButtonLabel}>AI 맞춤</Text>
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
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
      } as any,
    }),
  },
  blurContainer: {
    backgroundColor:
      Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.88)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  styleGuideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  styleGuideText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#48484A',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  styleSubtitle: {
    fontSize: 12.5,
    color: '#3C3C43',
    fontWeight: '600',
    marginTop: 2,
  },
  scrollList: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#000000',
  },
  inactiveDot: {
    width: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextStyleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  nextStyleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  aiButtonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
});
