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
          onLoad={(event) => {
            // RN Web은 nativeEvent로 DOM load 이벤트를 넘겨 source가 없다. 로드된 <img>의 src로 주소를 얻는다
            const native = event.nativeEvent as { source?: { uri?: string }; target?: { src?: string } };
            const uri = native.source?.uri ?? native.target?.src;
            if (uri) onImageReady?.(uri);
          }}
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
      {/* 상단 날씨 헤더 가독성을 위한 은은한 그라데이션 */}
      <SoftGradient edge="top" height={280} maxOpacity={0.38} />
      {/* 하단 카드 주변 가독성을 위한 은은한 그라데이션 */}
      <SoftGradient edge="bottom" height={340} maxOpacity={0.32} />
    </View>
  );
};

// 추가 패키지 없이 얇은 띠를 겹쳐 만든 그라데이션. 가장자리에서 maxOpacity, 안쪽으로 갈수록 투명해진다.
const GRADIENT_STEPS = 28;

const SoftGradient: React.FC<{ edge: 'top' | 'bottom'; height: number; maxOpacity: number }> = ({ edge, height, maxOpacity }) => {
  // 띠 경계를 정수 픽셀로 맞춰 겹치거나 틈이 생겨 줄무늬가 보이지 않게 한다
  const boundary = (i: number) => Math.round((height * i) / GRADIENT_STEPS);
  return (
    <View style={[styles.gradient, { height, [edge]: 0 }]} pointerEvents="none">
      {Array.from({ length: GRADIENT_STEPS }, (_, i) => {
        const t = 1 - i / GRADIENT_STEPS; // 가장자리 1 → 안쪽 0
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              [edge]: boundary(i),
              height: boundary(i + 1) - boundary(i),
              backgroundColor: `rgba(0, 0, 0, ${(maxOpacity * t * t).toFixed(3)})`,
            }}
          />
        );
      })}
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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
