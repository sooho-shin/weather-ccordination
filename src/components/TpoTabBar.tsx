import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { TpoCategory } from '../types/outfit';

interface TpoTabBarProps {
  selectedTpo: TpoCategory;
  onSelectTpo: (tpo: TpoCategory) => void;
}

interface TpoOption {
  key: TpoCategory;
  label: string;
  subLabel: string;
}

const TPO_OPTIONS: TpoOption[] = [
  { key: 'office', label: '출근 / 단정', subLabel: '오피스·포멀' },
  { key: 'daily', label: '데일리 / 캐주얼', subLabel: '편안한 일상' },
  { key: 'street', label: '스트릿 / 힙', subLabel: '트렌디·고프코어' },
];

export const TpoTabBar: React.FC<TpoTabBarProps> = ({
  selectedTpo,
  onSelectTpo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabTrack}>
        {TPO_OPTIONS.map((opt) => {
          const isActive = selectedTpo === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onSelectTpo(opt.key)}
              activeOpacity={0.75}
            >
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 6,
    zIndex: 10,
  },
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 24,
    padding: 3,
    backdropFilter: 'blur(16px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      } as any,
    }),
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
      } as any,
    }),
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: '#1C1C1E',
    fontWeight: '800',
  },
});
