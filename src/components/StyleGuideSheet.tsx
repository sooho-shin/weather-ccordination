import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { GestureResponderHandlers } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GenerationStage, OutfitItemCategory, OutfitLookbook } from '../types/outfit';

interface StyleGuideSheetProps {
  lookbook: OutfitLookbook;
  currentIndex: number;
  totalCount: number;
  onSelectIndex: (index: number) => void;
  /** 좌우로 밀어서 이전/다음 코디로 이동하는 제스처 핸들러 (useHorizontalSwipe 결과) */
  swipeHandlers?: GestureResponderHandlers;
  onSaveToWardrobe?: () => void;
  isSavedToWardrobe?: boolean;
  isAiGenerating?: boolean;
  isAiGenerated?: boolean;
  generationStage?: GenerationStage;
  onRetryImage?: () => void;
  notice?: string | null;
  isSaving?: boolean;
}

const CATEGORY_LABEL: Record<OutfitItemCategory, string> = {
  outer: '아우터',
  top: '상의',
  bottom: '하의',
  shoes: '신발',
  accessory: '액세서리',
};

/** 설명 속 기온(예: 4°, -3°)을 굵게 표시하기 위해 문장을 쪼갠다. */
const renderDescription = (text?: string) =>
  (text ?? '').split(/(-?\d+°)/g).map((part, idx) =>
    /^-?\d+°$/.test(part) ? (
      <Text key={idx} style={styles.descriptionStrong}>
        {part}
      </Text>
    ) : (
      part
    )
  );

export const StyleGuideSheet: React.FC<StyleGuideSheetProps> = ({
  lookbook,
  currentIndex,
  totalCount,
  onSelectIndex,
  swipeHandlers,
  onSaveToWardrobe,
  isSavedToWardrobe = false,
  isAiGenerating = false,
  isAiGenerated = false,
  generationStage = null,
  onRetryImage,
  notice,
  isSaving = false,
}) => {
  const saveLabel = isSaving ? '저장 중...' : isSavedToWardrobe ? '보관됨' : '저장';

  return (
    <View style={styles.wrapper} {...swipeHandlers}>
      <View style={styles.card}>
        {/* 1. 제목 / 설명 */}
        {(isAiGenerated || lookbook.imageGenerationFailed) && (
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={11} color="#D97706" />
            <Text style={styles.aiBadgeText}>
              {lookbook.imageGenerationFailed ? '기존 사진 · 참고용' : 'AI 맞춤'}
            </Text>
          </View>
        )}
        <Text style={styles.title}>{lookbook.styleTitle}</Text>
        <Text style={styles.description}>{renderDescription(lookbook.styleDescription)}</Text>

        {/* 2. 상태 안내 (AI 생성 진행 / 이미지 실패 / 저장 결과 등) */}
        {isAiGenerating && (
          <View style={styles.progressRow}>
            <ActivityIndicator size="small" color="#FF9500" />
            <Text style={styles.progressText}>
              {generationStage === 'image' ? '이미지 생성 중...' : '코디 작성 중...'}
            </Text>
          </View>
        )}
        {lookbook.imageGenerationFailed && (
          <View style={styles.imageNotice}>
            <Text style={styles.noticeText} accessibilityRole="alert">
              {lookbook.imageGenerationError ? `${lookbook.imageGenerationError}\n` : ''}
              이미지 생성에 실패해 기존 사진으로 대체했어요. 사진은 참고용이며 추천 아이템과 다를 수 있어요.
            </Text>
            {onRetryImage && (
              <TouchableOpacity onPress={onRetryImage} disabled={isAiGenerating} accessibilityRole="button">
                <Text style={styles.retryText}>
                  {generationStage === 'image' ? '사진 생성 중...' : '사진만 다시 생성'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {!!notice && (
          <Text style={[styles.noticeText, styles.noticeStandalone]} accessibilityRole="alert">
            {notice}
          </Text>
        )}

        {/* 3. 아이템 목록 (아우터 / 상의 / 하의 ...) */}
        <View style={styles.rows}>
          {lookbook.items.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.row, idx === lookbook.items.length - 1 && styles.rowLast]}
            >
              <Text style={styles.rowLabel}>{CATEGORY_LABEL[item.category] ?? item.category}</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>

        {/* 4. 하단: 페이지 점 + 저장 */}
        <View style={styles.footer}>
          <View style={styles.paginationDots}>
            {Array.from({ length: totalCount }).map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => onSelectIndex(idx)}
                hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
                accessibilityRole="button"
                accessibilityLabel={`${idx + 1}번째 코디`}
                style={[styles.dot, idx === currentIndex ? styles.activeDot : styles.inactiveDot]}
              />
            ))}
          </View>

          {onSaveToWardrobe && (
            <TouchableOpacity
              style={[styles.saveBtn, isSavedToWardrobe && styles.saveBtnActive]}
              onPress={onSaveToWardrobe}
              disabled={isSaving}
              activeOpacity={0.8}
              accessibilityLabel="내 옷장에 저장"
            >
              <Ionicons
                name={isSavedToWardrobe ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isSavedToWardrobe ? '#FF9500' : '#111111'}
              />
              <Text style={[styles.saveText, isSavedToWardrobe && styles.saveTextActive]}>
                {saveLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 12,
    right: 12,
    // 웹에서 마우스로 밀 때 글자가 선택되지 않게
    ...Platform.select({ web: { userSelect: 'none' } as any }),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
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
  aiBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 23,
    color: '#48484A',
    fontWeight: '400',
  },
  descriptionStrong: {
    fontWeight: '800',
    color: '#111111',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },
  imageNotice: {
    backgroundColor: '#FFF3D6',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  noticeText: { color: '#704400', fontSize: 12, lineHeight: 18 },
  noticeStandalone: { marginTop: 10 },
  retryText: { color: '#704400', fontSize: 13, fontWeight: '700', paddingTop: 10 },
  rows: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
  },
  rowLast: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
  },
  rowValue: {
    flex: 1,
    marginLeft: 16,
    textAlign: 'right',
    fontSize: 16,
    color: '#8E8E93',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: '#111111',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#D1D1D6',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  saveBtnActive: {
    borderColor: '#FF9500',
    backgroundColor: 'rgba(255, 149, 0, 0.06)',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  saveTextActive: {
    color: '#FF9500',
  },
});
