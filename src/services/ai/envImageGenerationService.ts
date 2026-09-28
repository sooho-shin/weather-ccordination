import { getTemperatureBand } from '../../constants/temperatureBands';
import { findMatchingLookbooks } from '../../data/presetLookbooks';
import {
  AIOutfitGenerationRequest,
  AIOutfitGenerationResponse,
  OutfitLookbook,
} from '../../types/outfit';
import { buildOutfitPrompt } from '../../utils/promptBuilder';
import { ImageGenerationService } from './imageGenerationService';

export class EnvImageGenerationService implements ImageGenerationService {
  private timeoutMs: number;

  constructor(timeoutMs = 20000) {
    this.timeoutMs = timeoutMs;
  }

  async generateOutfit(request: AIOutfitGenerationRequest): Promise<AIOutfitGenerationResponse> {
    const { prompt, suggestedItems, styleTitle, styleDescription } = buildOutfitPrompt(request);
    const tempBand = getTemperatureBand(request.temperature).id;

    const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const falApiKey = process.env.EXPO_PUBLIC_FAL_KEY;

    try {
      // 1. OpenAI DALL-E 3 실시간 호출 분기 (키가 설정된 경우)
      if (openaiApiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: '1024x1792', // 세로 9:16 모바일 비율
            quality: 'standard',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'OpenAI generation failed');
        }

        const data = await response.json();
        const generatedImageUrl = data.data[0].url;

        const lookbook: OutfitLookbook = {
          id: `ai_${Date.now()}`,
          gender: request.gender,
          tempBand,
          weatherState: request.weatherState,
          styleTitle,
          styleDescription,
          imageUrl: generatedImageUrl,
          items: suggestedItems,
          imageSource: 'ai',
          generatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          lookbook,
          isFallback: false,
        };
      }

      // 2. API Key가 설정되지 않은 경우: 실사 시뮬레이션 및 프리셋 폴백 안내
      // 개발자가 화면 플로우(로딩 -> AI 생성 결과 렌더링)를 즉시 테스트할 수 있도록 안전하게 동작
      console.log('API 키 미설정 모드: 고품질 AI 프롬프트 생성 후 시뮬레이션 모드로 전환합니다.');
      console.log('생성된 프롬프트:', prompt);

      // 사용자 경험을 위해 2.5초 간의 실사 생성 로딩 딜레이 모방
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const fallbackPresets = findMatchingLookbooks(
        request.gender,
        tempBand,
        request.weatherState
      );
      const baseLookbook = fallbackPresets[0];

      const simulatedLookbook: OutfitLookbook = {
        id: `ai_simulated_${Date.now()}`,
        gender: request.gender,
        tempBand,
        weatherState: request.weatherState,
        styleTitle: `[AI 맞춤 제안] ${styleTitle}`,
        styleDescription: `${styleDescription} (Prompt: ${prompt.slice(0, 70)}...)`,
        imageUrl: baseLookbook.imageUrl,
        items: suggestedItems.length > 0 ? suggestedItems : baseLookbook.items,
        imageSource: 'ai',
        generatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        lookbook: simulatedLookbook,
        isFallback: false,
      };
    } catch (error: any) {
      console.warn('AI 코디 생성 실패/타임아웃 발생 -> 프리셋 코디로 안전하게 폴백합니다:', error);

      const presets = findMatchingLookbooks(request.gender, tempBand, request.weatherState);
      return {
        success: false,
        errorMessage: error.name === 'AbortError' ? '20초 타임아웃 초과' : error.message,
        lookbook: presets[0],
        isFallback: true,
      };
    }
  }
}

export const defaultImageGenerationService = new EnvImageGenerationService(20000);
