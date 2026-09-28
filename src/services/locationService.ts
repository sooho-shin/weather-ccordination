import * as Location from 'expo-location';
import { LocationData } from '../types/weather';

export const DEFAULT_FALLBACK_LOCATION: LocationData = {
  latitude: 37.5665,
  longitude: 126.978,
  name: '서울특별시 중구',
};

/**
 * 사용자 현재 위치를 조회하고, 실패 또는 거부 시 서울로 폴백
 */
export async function getCurrentLocation(): Promise<LocationData> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('위치 권한 거부됨 -> 서울 기본 위치로 대체합니다.');
      return DEFAULT_FALLBACK_LOCATION;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // 역지오코딩 시도
    let name = '현재 위치';
    try {
      const reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverse && reverse.length > 0) {
        const place = reverse[0];
        const region = place.region || place.city || '';
        const district = place.district || place.subregion || '';
        name = `${region} ${district}`.trim() || '현재 위치';
      }
    } catch {
      name = '현재 위치';
    }

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      name,
    };
  } catch (err) {
    console.warn('위치 조회 실패, 기본 위치(서울) 사용:', err);
    return DEFAULT_FALLBACK_LOCATION;
  }
}
