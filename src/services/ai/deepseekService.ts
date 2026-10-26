import { WeatherData, Gender } from '../../types/weather';
import { OutfitLookbook, TpoCategory, OutfitItem } from '../../types/outfit';

export interface DeepSeekOotdResult {
  success: boolean;
  styleTitle?: string;
  styleDescription?: string;
  weatherDefenseTags?: string[];
  items?: OutfitItem[];
  imagePrompt?: string;
  errorMessage?: string;
}

/**
 * TheHive.ai / DeepSeek API 환경설정 조회
 */
export function getDeepSeekConfig() {
  const apiKey =
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.EXPO_PUBLIC_HIVE_API_KEY ||
    '';

  const baseUrl =
    process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL ||
    process.env.DEEPSEEK_BASE_URL ||
    'https://api.thehive.ai/v1';

  const model =
    process.env.EXPO_PUBLIC_DEEPSEEK_MODEL ||
    process.env.DEEPSEEK_MODEL ||
    'deepseek-chat';

  return { apiKey, baseUrl, model };
}

export function isDeepSeekConfigured(): boolean {
  return Boolean(getDeepSeekConfig().apiKey);
}

/**
 * DeepSeek를 이용한 날씨 & TPO 맞춤 코디 및 날씨 방어 태그 실시간 생성
 */
export async function generateOotdWithDeepSeek(
  weather: WeatherData,
  tpo: TpoCategory,
  gender: Gender
): Promise<DeepSeekOotdResult> {
  const { apiKey, baseUrl, model } = getDeepSeekConfig();

  if (!apiKey) {
    return {
      success: false,
      errorMessage: 'DeepSeek API 키가 설정되지 않았습니다. .env를 확인해주세요.',
    };
  }

  const tpoLabels: Record<TpoCategory, string> = {
    office: '출근 / 단정 (오피스, 비즈니스 캐주얼, 테일러드)',
    daily: '데일리 / 캐주얼 (편안하고 감각적인 일상 룩)',
    street: '스트릿 / 힙 (트렌디한 고프코어, 오버핏, 스트릿)',
  };

  const genderLabel = gender === 'female' ? '여성' : gender === 'male' ? '남성' : '성별 무관';

  const systemPrompt = `당신은 29CM, 무신사, W컨셉 스타일링을 총괄하는 대한민국 최고의 미니멀 패션 디렉터이자 dize. OOTD AI입니다.
주어진 날씨(기온, 일교차, 강수/적설 상태)와 TPO(출근, 데일리, 스트릿), 성별을 분석하여 완벽한 코디네이션과 날씨 방어 태그를 JSON으로 추천해야 합니다.

반드시 다음 JSON 포맷만 순수하게 출력하십시오 (마크다운 백틱 없이 JSON만):
{
  "styleTitle": "스타일 명칭 (예: 한남동 테일러드 미니멀)",
  "styleDescription": "날씨와 TPO를 고려한 매력적인 1~2줄 코디 설명",
  "weatherDefenseTags": ["#태그1", "#태그2", "#태그3"],
  "items": [
    {"category": "outer", "name": "아이템명", "iconName": "shirt-outline", "description": "디테일 설명"},
    {"category": "top", "name": "아이템명", "iconName": "shirt-outline", "description": "디테일 설명"},
    {"category": "bottom", "name": "아이템명", "iconName": "git-commit-outline", "description": "디테일 설명"},
    {"category": "shoes", "name": "아이템명", "iconName": "footsteps-outline", "description": "디테일 설명"},
    {"category": "accessory", "name": "아이템명", "iconName": "bag-handle-outline", "description": "디테일 설명"}
  ],
  "imagePrompt": "A full-body high-fashion editorial photo of an attractive Korean model..."
}`;

  const userPrompt = `[현재 기상 및 착장 조건]
- 현재 기온: ${weather.temperature}°C (최고: ${weather.tempMax ?? weather.temperature + 3}°C / 최저: ${weather.tempMin ?? weather.temperature - 4}°C)
- 날씨 상태: ${weather.weatherState} (${weather.weatherDescription})
- 체감 키워드: ${weather.apparentKeyword ?? '선선함'}
- 강수량: ${weather.precipitation}mm
- 선택 성별: ${genderLabel}
- 목적(TPO): ${tpoLabels[tpo]}

날씨 방어 태그에는 비가 오면 #우산_필수, #밝은바지_금지 등을, 일교차가 크면 #일교차_아우터, 햇빛이 강하면 #자외선_차단 등의 실용적인 행동 지침 2~3개를 넣어주세요.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12초 타임아웃

    const endpoint = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API 오류 (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('DeepSeek로부터 빈 응답이 반환되었습니다.');
    }

    // 마크다운 코드 블록 제거 후 파싱
    const cleanJson = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      success: true,
      styleTitle: parsed.styleTitle,
      styleDescription: parsed.styleDescription,
      weatherDefenseTags: parsed.weatherDefenseTags || ['#오늘의코디', '#dize_추천'],
      items: parsed.items || [],
      imagePrompt: parsed.imagePrompt,
    };
  } catch (error: any) {
    console.warn('DeepSeek 코디 추천 생성 실패, 프리셋으로 폴백:', error);
    return {
      success: false,
      errorMessage: error?.message || 'DeepSeek 연동 실패',
    };
  }
}
