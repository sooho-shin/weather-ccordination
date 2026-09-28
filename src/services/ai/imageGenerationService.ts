import { AIOutfitGenerationRequest, AIOutfitGenerationResponse } from '../../types/outfit';

/**
 * AI 이미지 생성 인터페이스 추상화
 * - 현재: .env 직결 구현체 (EnvImageGenerationService)
 * - 향후: 서버리스 프록시(Cloudflare Workers / Supabase) 구현체로 코드 변경 없이 손쉽게 대체 가능
 */
export interface ImageGenerationService {
  generateOutfit(request: AIOutfitGenerationRequest): Promise<AIOutfitGenerationResponse>;
}
