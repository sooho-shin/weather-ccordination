import React from 'react';
import { StyleSheet, View, Platform, Image as RNImage } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

interface FullscreenBackgroundProps {
  imageUrl: any;
  onImageReady?: (uri: string) => void;
}

export const FullscreenBackground: React.FC<FullscreenBackgroundProps> = ({ imageUrl, onImageReady }) => {
  const imageSource = typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 웹 브라우저 환경에서는 expo-image의 opacity 버그를 방지하기 위해 표준 RN Web Image 사용 */}
      {Platform.OS === 'web' ? (
        <RNImage
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          onLoad={(event) => onImageReady?.(event.nativeEvent.source.uri)}
        />
      ) : (
        <ExpoImage
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />
      )}
      {/* 하단 카드 주변 가독성을 위한 은은한 비네팅 (상단 딤은 제거) */}
      <View style={styles.bottomVignette} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 340,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
});
