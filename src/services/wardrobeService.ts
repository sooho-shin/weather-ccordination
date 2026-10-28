import { OutfitLookbook } from '../types/outfit';
import { ensureAiSession, aiErrorMessage } from './ai/session';

const STORAGE_KEY = 'dize_saved_wardrobe';

function storage(): Storage {
  try {
    if (typeof window === 'undefined' || !window.localStorage) throw new Error('Unavailable');
    return window.localStorage;
  } catch {
    throw new Error('브라우저 저장이 차단됐어요. 사이트의 저장 권한을 확인해 주세요.');
  }
}

function readWardrobe(): OutfitLookbook[] {
  let saved: string | null;
  try { saved = storage().getItem(STORAGE_KEY); }
  catch { throw new Error('브라우저 저장이 차단됐어요. 사이트의 저장 권한을 확인해 주세요.'); }
  if (!saved) return [];
  try {
    const list = JSON.parse(saved);
    if (!Array.isArray(list) || list.some((item) => !item || typeof item.id !== 'string' || !Array.isArray(item.items))) throw new Error('Invalid wardrobe');
    return list;
  } catch {
    throw new Error('저장된 옷장 정보를 읽지 못했어요. 기존 데이터는 그대로 보관했습니다.');
  }
}

function writeWardrobe(list: OutfitLookbook[]) {
  const target = storage();
  const encoded = JSON.stringify(list);
  target.setItem(STORAGE_KEY, encoded);
  if (target.getItem(STORAGE_KEY) !== encoded) throw new Error('저장 결과를 확인하지 못했어요.');
}

async function durableImage(imageUrl: OutfitLookbook['imageUrl']) {
  const uri = typeof imageUrl === 'string' ? imageUrl : imageUrl?.uri;
  if (typeof uri !== 'string') throw new Error('사진이 로딩된 뒤 다시 저장해 주세요.');
  if (uri.startsWith('data:')) return uri;
  // Generated image URLs expire, so keep the image bytes with this browser's wardrobe.
  const signal = AbortSignal.timeout(15000);
  const remote = uri.startsWith('https://hive-data-prod-cdn.thehive.ai/');
  if (remote) await ensureAiSession(signal);
  const response = remote
    ? await fetch('/api/ai/photo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: uri }), signal })
    : await fetch(uri, { signal });
  if (!response.ok) throw new Error(remote ? await aiErrorMessage(response) : '사진을 보관하지 못했어요. 네트워크를 확인하고 다시 저장해 주세요.');
  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('사진 형식을 확인하지 못했어요.');
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('사진을 보관하지 못했어요. 다시 시도해 주세요.'));
    reader.readAsDataURL(blob);
  });
}

export async function saveOutfitToWardrobe(
  outfit: OutfitLookbook,
): Promise<{ success: boolean; outfit?: OutfitLookbook; errorMessage?: string }> {
  try {
    readWardrobe();
    const savedOutfit = { ...outfit, imageUrl: await durableImage(outfit.imageUrl) };
    // Re-read after downloading: preserve saves made in another tab while waiting.
    writeWardrobe([savedOutfit, ...readWardrobe().filter((item) => item.id !== outfit.id)]);
    return { success: true, outfit: savedOutfit };
  } catch (error: any) {
    const message = error?.name === 'QuotaExceededError'
      ? '브라우저 저장 공간이 부족해요. 필요 없는 코디를 삭제한 뒤 다시 저장해 주세요.'
      : error?.name === 'TimeoutError' || error?.name === 'TypeError'
        ? '사진을 보관하지 못했어요. 네트워크를 확인하고 다시 저장해 주세요.'
        : error?.message || '코디를 저장하지 못했어요. 브라우저 저장 설정을 확인해 주세요.';
    return { success: false, errorMessage: message };
  }
}

export async function fetchWardrobeOutfits(): Promise<OutfitLookbook[]> {
  return readWardrobe();
}

export async function deleteOutfitFromWardrobe(id: string): Promise<boolean> {
  try {
    writeWardrobe(readWardrobe().filter((item) => item.id !== id));
    return true;
  } catch {
    return false;
  }
}
