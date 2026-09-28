import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

interface FullscreenBackgroundProps {
  imageUrl: any;
}

export const FullscreenBackground: React.FC<FullscreenBackgroundProps> = ({ imageUrl }) => {
  const imageSource = typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image
        source={imageSource}
        style={styles.image}
        contentFit="cover"
        transition={600}
        cachePolicy="memory-disk"
      />
      {/* 상단 텍스트 및 하단 카드의 가독성을 위한 은은한 비네팅 그라디언트 레이어 */}
      <View style={styles.topVignette} pointerEvents="none" />
      <View style={styles.bottomVignette} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
});
