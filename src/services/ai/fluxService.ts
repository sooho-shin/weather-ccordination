import { Platform } from 'react-native';
import { MASTER_FULLBODY_PROMPT_DIRECTIVE } from '../../constants/framingStandards';

export interface FluxGenerationResult {
  success: boolean;
  imageUrl?: string;
  errorMessage?: string;
}

/**
 * TheHive Flux Schnell API를 통한 실시간 고화질 실사 패션 화보 생성
 * 모든 생성 이미지는 '전신 스탠딩 9:16 구도' 표준 규격을 엄격하게 준수합니다.
 */
export async function generateFashionImageWithFlux(
  prompt: string,
  timeoutMs = 28000
): Promise<FluxGenerationResult> {
  // Native clients must use an authenticated backend integration; never ship a Hive key.
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { success: false, errorMessage: 'AI 생성은 현재 웹에서만 지원됩니다.' };
  }
  const endpoint = '/api/ai/flux';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 마스터 전신 구도 표준 결합 (얼굴 확대 방지, 하반신/신발 100% 노출 강제)
    const standardizedPrompt = `${MASTER_FULLBODY_PROMPT_DIRECTIVE} Outfit details: ${prompt}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        input: {
          prompt: standardizedPrompt,
          image_size: {
            width: 768,
            height: 1344, // 9:16 모바일 전신 황금 비율
          },
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Flux Schnell API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const imageUrl = data.output?.[0]?.url;

    if (!imageUrl) {
      throw new Error('Flux 생성 이미지 URL이 응답에 없습니다.');
    }

    return {
      success: true,
      imageUrl,
    };
  } catch (error: any) {
    console.warn('TheHive Flux Schnell 생성 실패, 프리셋 화보로 폴백:', error);
    return {
      success: false,
      errorMessage: error?.message || 'Flux 이미지 생성 실패',
    };
  }
}
