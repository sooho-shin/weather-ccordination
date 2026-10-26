import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutfitLookbook } from '../types/outfit';
import { fetchWardrobeOutfits, deleteOutfitFromWardrobe } from '../services/wardrobeService';

interface WardrobeModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyOutfit: (outfit: OutfitLookbook) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  visible,
  onClose,
  onApplyOutfit,
}) => {
  const [outfits, setOutfits] = useState<OutfitLookbook[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWardrobe = async () => {
    setLoading(true);
    try {
      const data = await fetchWardrobeOutfits();
      setOutfits(data);
    } catch (err) {
      console.warn('옷장 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadWardrobe();
    }
  }, [visible]);

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation?.();
    const success = await deleteOutfitFromWardrobe(id);
    if (success) {
      setOutfits((prev) => prev.filter((item) => item.id !== id));
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
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="bookmark" size={18} color="#FF9500" />
              <Text style={styles.title}>내 옷장 (보관함)</Text>
              <Text style={styles.countText}>{outfits.length}개</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Cloudflare D1 데이터베이스와 R2 스토리지에 영구 보관된 나만의 코디 화보입니다.
          </Text>

          {/* 목록 영역 */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#FF9500" />
              <Text style={styles.loadingText}>내 옷장 데이터를 불러오는 중...</Text>
            </View>
          ) : outfits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="shirt-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>저장된 코디가 없습니다</Text>
              <Text style={styles.emptyDesc}>
                마음에 드는 날씨 코디를 찾았을 때 하단의 북마크 버튼을 눌러 옷장에 저장해보세요.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            >
              <View style={styles.grid}>
                {outfits.map((item) => {
                  const imageSource =
                    typeof item.imageUrl === 'string'
                      ? { uri: item.imageUrl }
                      : item.imageUrl;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.card}
                      activeOpacity={0.85}
                      onPress={() => {
                        onApplyOutfit(item);
                        onClose();
                      }}
                    >
                      {/* 이미지 썸네일 */}
                      <View style={styles.imageWrapper}>
                        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
                        {/* 삭제 버튼 */}
                        <TouchableOpacity
                          style={styles.deleteBadge}
                          onPress={(e) => handleDelete(item.id, e)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={13} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>

                      {/* 정보 텍스트 */}
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.styleTitle}
                        </Text>
                        <Text style={styles.cardDesc} numberOfLines={1}>
                          {item.styleDescription}
                        </Text>
                        <View style={styles.tagsRow}>
                          {(item.weatherDefenseTags || []).slice(0, 2).map((tag, idx) => (
                            <View key={idx} style={styles.tagChip}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      web: {
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
      } as any,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9500',
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    marginBottom: 14,
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginTop: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  listContainer: {
    paddingBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#E5E5EA',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#555555',
  },
});
