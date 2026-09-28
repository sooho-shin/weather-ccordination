import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutfitItem } from '../types/outfit';

interface OutfitItemCardProps {
  item: OutfitItem;
}

export const OutfitItemCard: React.FC<OutfitItemCardProps> = ({ item }) => {
  // 아이템 카테고리별 맞춤 아이콘 매핑
  const renderIcon = () => {
    switch (item.category) {
      case 'outer':
        return <Ionicons name="shirt-outline" size={30} color="#2C2C2E" />;
      case 'top':
        return <Ionicons name="shirt-outline" size={28} color="#2C2C2E" />;
      case 'bottom':
        return <Ionicons name="git-commit-outline" size={28} color="#2C2C2E" />;
      case 'shoes':
        return <Ionicons name="footsteps-outline" size={26} color="#2C2C2E" />;
      default:
        return <Ionicons name="glasses-outline" size={26} color="#2C2C2E" />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 104,
    height: 114,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
      } as any,
    }),
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 16,
  },
});
