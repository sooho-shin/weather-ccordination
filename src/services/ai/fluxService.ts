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
  const apiKey =
    process.env.EXPO_PUBLIC_HIVE_SECRET_KEY ||
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY ||
    '';

  // 웹 브라우저 환경에서는 CORS 우회를 위해 프록시 엔드포인트(/api/ai/flux) 우선 사용
  const endpoint =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? '/api/ai/flux'
      : 'https://api-cdn.thehive.ai/api/v3/black-forest-labs/flux-schnell';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (endpoint.startsWith('http')) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

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
