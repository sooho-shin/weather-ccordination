import { Platform } from 'react-native';
import { OutfitLookbook } from '../types/outfit';
import { WeatherData } from '../types/weather';

const STORAGE_KEY_FALLBACK = 'dize_saved_wardrobe';

/**
 * 내 옷장에 코디 저장 (Cloudflare D1 + R2 에뮬레이션)
 */
export async function saveOutfitToWardrobe(
  outfit: OutfitLookbook,
  weather: WeatherData
): Promise<{ success: boolean; outfit?: OutfitLookbook; errorMessage?: string }> {
  const payload = {
    id: outfit.id,
    styleTitle: outfit.styleTitle,
    styleDescription: outfit.styleDescription,
    gender: outfit.gender,
    tempBand: outfit.tempBand,
    weatherState: outfit.weatherState,
    temperature: weather.temperature,
    tpo: outfit.tpo || 'daily',
    weatherDefenseTags: outfit.weatherDefenseTags || [],
    items: outfit.items || [],
    imageUrl: outfit.imageUrl,
  };

  try {
    const res = await fetch('/api/wardrobe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`서버 저장 오류 (${res.status})`);
    }

    const data = await res.json();
    if (data.success && data.outfit) {
      // 로컬 스토리지에도 동기화 백업
      syncToLocalStorage(data.outfit);
      return { success: true, outfit: data.outfit };
    }
    throw new Error(data.error || '저장 응답 실패');
  } catch (err: any) {
    console.warn('D1/R2 API 저장 실패, 로컬 백업으로 보관:', err);
    // 오프라인 / 폴백 로컬 저장
    syncToLocalStorage(outfit);
    return { success: true, outfit };
  }
}

/**
 * 내 옷장에 저장된 전체 코디 목록 조회 (D1)
 */
export async function fetchWardrobeOutfits(): Promise<OutfitLookbook[]> {
  try {
    const res = await fetch('/api/wardrobe');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.outfits)) {
        return data.outfits;
      }
    }
  } catch (err) {
    console.warn('D1 옷장 목록 조회 실패, 로컬 캐시 조회:', err);
  }

  // 로컬 폴백 목록
  return getLocalStorageOutfits();
}

/**
 * 내 옷장에서 코디 삭제 (D1 + R2)
 */
export async function deleteOutfitFromWardrobe(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/wardrobe?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      removeFromLocalStorage(id);
      return true;
    }
  } catch (err) {
    console.warn('D1 삭제 실패:', err);
  }

  removeFromLocalStorage(id);
  return true;
}

function syncToLocalStorage(outfit: OutfitLookbook) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const list = getLocalStorageOutfits();
      const filtered = list.filter((item) => item.id !== outfit.id);
      filtered.unshift(outfit);
      window.localStorage.setItem(STORAGE_KEY_FALLBACK, JSON.stringify(filtered));
    } catch {}
  }
}

function removeFromLocalStorage(id: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const list = getLocalStorageOutfits();
      const filtered = list.filter((item) => item.id !== id);
      window.localStorage.setItem(STORAGE_KEY_FALLBACK, JSON.stringify(filtered));
    } catch {}
  }
}

function getLocalStorageOutfits(): OutfitLookbook[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_FALLBACK);
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return [];
}
