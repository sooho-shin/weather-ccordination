import { getTemperatureBand } from '../../constants/temperatureBands';
import { findMatchingLookbooks } from '../../data/presetLookbooks';
import {
  AIOutfitGenerationRequest,
  AIOutfitGenerationResponse,
  OutfitLookbook,
} from '../../types/outfit';
import { buildOutfitPrompt } from '../../utils/promptBuilder';
import { ImageGenerationService } from './imageGenerationService';
import { generateFashionImageWithFlux } from './fluxService';

export class EnvImageGenerationService implements ImageGenerationService {
  private timeoutMs: number;

  constructor(timeoutMs = 25000) {
    this.timeoutMs = timeoutMs;
  }

  async generateOutfit(request: AIOutfitGenerationRequest): Promise<AIOutfitGenerationResponse> {
    const { prompt, suggestedItems, styleTitle, styleDescription } = buildOutfitPrompt(request);
    const tempBand = getTemperatureBand(request.temperature).id;

    try {
      // 1. TheHive Flux Schnell 실시간 패션 화보 생성 시도
      const fluxResult = await generateFashionImageWithFlux(prompt, this.timeoutMs);
      if (fluxResult.success && fluxResult.imageUrl) {
        const lookbook: OutfitLookbook = {
          id: `ai_flux_${Date.now()}`,
          gender: request.gender,
          tempBand,
          weatherState: request.weatherState,
          styleTitle,
          styleDescription,
          weatherDefenseTags: ['#오늘의_OOTD', '#날씨맞춤'],
          imageUrl: fluxResult.imageUrl,
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

      // 2. 프리셋 실사 화보 매칭 폴백
      const fallbackPresets = findMatchingLookbooks(
        request.gender,
        tempBand,
        request.weatherState
      );
      const randomIndex = Math.floor(Math.random() * fallbackPresets.length);
      const baseLookbook = fallbackPresets[randomIndex] || fallbackPresets[0];

      const simulatedLookbook: OutfitLookbook = {
        id: `ai_simulated_${Date.now()}`,
        gender: request.gender,
        tempBand,
        weatherState: request.weatherState,
        styleTitle,
        styleDescription,
        weatherDefenseTags: ['#오늘의_OOTD', '#날씨맞춤'],
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

export const defaultImageGenerationService = new EnvImageGenerationService(25000);
