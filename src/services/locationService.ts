import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { LocationData } from '../types/weather';
import { formatLocationLabel } from '../utils/locationLabel';

export const DEFAULT_FALLBACK_LOCATION: LocationData = {
  latitude: 37.5665,
  longitude: 126.978,
  name: '서울특별시',
};

const STORAGE_KEY_LOCATION = 'dize_last_location';

/**
 * 로컬 캐시된 최근 위치 조회
 */
export function getCachedLocation(): LocationData | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_LOCATION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
  }
  return null;
}

/**
 * 최근 위치 로컬 캐싱
 */
export function saveCachedLocation(loc: LocationData) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(loc));
    } catch {}
  }
}

/**
 * 웹 브라우저 네이티브 Geolocation을 이용한 초고속 위치 획득
 */
function getWebFastLocation(): Promise<{ latitude: number; longitude: number } | null> {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => resolve(null),
        { timeout: 3500, maximumAge: 60000 }
      );
    });
  }
  return Promise.resolve(null);
}

/**
 * 사용자 현재 위치를 조회하고, 실패 또는 거부 시 서울로 폴백
 */
export async function getCurrentLocation(): Promise<LocationData> {
  try {
    let lat: number | null = null;
    let lon: number | null = null;

    // 1. 웹 브라우저 환경인 경우 네이티브 geolocation 우선 시도 (초고속 응답)
    if (Platform.OS === 'web') {
      const fastCoords = await getWebFastLocation();
      if (fastCoords) {
        lat = fastCoords.latitude;
        lon = fastCoords.longitude;
      }
    }

    // 2. 웹에서 획득 실패했거나 네이티브 환경인 경우 Expo Location 호출
    if (lat === null || lon === null) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('위치 권한 거부됨 -> 기본 위치(서울) 사용');
        const fallback = getCachedLocation() || DEFAULT_FALLBACK_LOCATION;
        return fallback;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      lat = location.coords.latitude;
      lon = location.coords.longitude;
    }

    // 3. 역지오코딩 시도 (동/구 단위 행정구역명 획득)
    let name = '현재 위치';
    try {
      const reverse = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (reverse && reverse.length > 0) {
        const place = reverse[0];
        const region = place.region || place.city || '';
        const district = place.district || place.subregion || '';
        // 서울은 구 단위 없이 시 단위로만 표기
        name = formatLocationLabel(`${region} ${district}`) || '현재 위치';
      }
    } catch {
      name = '현재 위치';
    }

    const result: LocationData = {
      latitude: lat,
      longitude: lon,
      name,
    };

    // 캐시에 저장하여 다음 로딩 시 0초 즉시 복원
    saveCachedLocation(result);

    return result;
  } catch (err) {
    console.warn('위치 조회 실패, 캐시 또는 기본 위치(서울) 사용:', err);
    return getCachedLocation() || DEFAULT_FALLBACK_LOCATION;
  }
}
