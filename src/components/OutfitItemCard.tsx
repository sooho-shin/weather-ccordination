import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutfitItem } from '../types/outfit';

interface OutfitItemCardProps {
  item: OutfitItem;
}

export const OutfitItemCard: React.FC<OutfitItemCardProps> = ({ item }) => {
  const iconSize = item.category === 'outer' ? 30
    : item.category === 'top' || item.category === 'bottom' ? 28 : 26;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.iconName as React.ComponentProps<typeof Ionicons>['name']}
          size={iconSize}
          color="#2C2C2E"
        />
      </View>
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
