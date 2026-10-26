import { WeatherData, Gender } from '../../types/weather';
import { OutfitLookbook, TpoCategory, OutfitItem } from '../../types/outfit';
import { getTemperatureBand } from '../../constants/temperatureBands';
import { findMatchingLookbooks } from '../../data/presetLookbooks';

export interface DeepSeekOotdResult {
  success: boolean;
  styleTitle?: string;
  styleDescription?: string;
  weatherDefenseTags?: string[];
  items?: OutfitItem[];
  imagePrompt?: string;
  lookbook?: OutfitLookbook;
  errorMessage?: string;
}

/**
 * TheHive.ai / DeepSeek API 환경설정 조회
 */
export function getDeepSeekConfig() {
  let customKey = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    customKey = window.localStorage.getItem('dize_hive_secret_key') || '';
  }

  const apiKey =
    customKey ||
    process.env.EXPO_PUBLIC_HIVE_SECRET_KEY ||
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.EXPO_PUBLIC_HIVE_API_KEY ||
    '';

  const baseUrl =
    process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL ||
    process.env.DEEPSEEK_BASE_URL ||
    'https://api-cdn.thehive.ai/api/v3';

  const model =
    process.env.EXPO_PUBLIC_DEEPSEEK_MODEL ||
    process.env.DEEPSEEK_MODEL ||
    'deepseek-ai/deepseek-v4.1-flash-1017';

  return { apiKey, baseUrl, model };
}

export function isDeepSeekConfigured(): boolean {
  return Boolean(getDeepSeekConfig().apiKey);
}

/**
 * 클라이언트 단에서 커스텀 Hive/DeepSeek API Key 저장
 */
export function setCustomDeepSeekKey(key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (key.trim()) {
      window.localStorage.setItem('dize_hive_secret_key', key.trim());
    } else {
      window.localStorage.removeItem('dize_hive_secret_key');
    }
  }
}

/**
 * LLM 응답 텍스트에서 안전하게 JSON 파싱
 */
function cleanAndParseJson(content: string): any {
  // 1. 추론 모델(R1 등)의 <think>...</think> 태그 제거
  let text = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. 마크다운 코드블록 제거
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/g, '').trim();

  // 3. 가장 외곽의 { ... } JSON 블록 추출
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return JSON.parse(text);
}

/**
 * 카테고리별 추천 아이콘 매핑
 */
function getCategoryIcon(category: string, name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('우산') || lowerName.includes('umbrella')) return 'umbrella-outline';
  if (lowerName.includes('가방') || lowerName.includes('백') || lowerName.includes('bag')) return 'bag-handle-outline';
  if (lowerName.includes('모자') || lowerName.includes('캡') || lowerName.includes('비니')) return 'happy-outline';
  if (lowerName.includes('선글라스') || lowerName.includes('안경')) return 'glasses-outline';
  if (lowerName.includes('머플러') || lowerName.includes('목도리') || lowerName.includes('스카프')) return 'ribbon-outline';

  switch (category) {
    case 'outer':
      return 'shirt-outline';
    case 'top':
      return 'shirt-outline';
    case 'bottom':
      return 'git-commit-outline';
    case 'shoes':
      return 'footsteps-outline';
    default:
      return 'bag-handle-outline';
  }
}

/**
 * AI 코디에 어울리는 최적의 고화질 실사 룩북 배경 이미지 선택
 */
function selectBestImageForAi(gender: Gender, weather: WeatherData, tpo: TpoCategory) {
  const tempBand = getTemperatureBand(weather.temperature).id;
  const presets = findMatchingLookbooks(gender, tempBand, weather.weatherState, tpo);
  if (presets.length > 0) {
    // 첫 번째 가장 적합한 프리셋의 고화질 화보 이미지 사용
    return presets[0].imageUrl;
  }
  return require('../../../assets/lookbooks/female_trendy_22c_1.jpg');
}

/**
 * DeepSeek V4.1 Flash를 이용한 날씨 & TPO 맞춤 코디 및 실시간 AI 패션 디렉팅
 */
export async function generateOotdWithDeepSeek(
  weather: WeatherData,
  tpo: TpoCategory,
  gender: Gender,
  styleMood?: string
): Promise<DeepSeekOotdResult> {
  const { apiKey, baseUrl, model } = getDeepSeekConfig();

  if (!apiKey) {
    return {
      success: false,
      errorMessage: 'TheHive / DeepSeek API 키가 설정되지 않았습니다. .env 또는 브라우저 설정을 확인해주세요.',
    };
  }

  const tpoLabels: Record<TpoCategory, string> = {
    office: '출근 / 단정 (오피스, 비즈니스 캐주얼, 테일러드)',
    daily: '데일리 / 캐주얼 (편안하고 감각적인 일상 룩)',
    street: '스트릿 / 힙 (트렌디한 고프코어, 오버핏, 스트릿)',
  };

  const genderLabel = gender === 'female' ? '여성' : gender === 'male' ? '남성' : '성별 무관';
  const moodDesc = styleMood ? `\n- 희망 스타일 무드: ${styleMood}` : '';

  const systemPrompt = `당신은 29CM, 무신사, W컨셉 스타일링을 총괄하는 대한민국 최고의 미니멀 패션 디렉터이자 dize. OOTD AI입니다.
주어진 날씨(기온, 일교차, 강수/적설 상태)와 TPO(출근, 데일리, 스트릿), 성별을 분석하여 완벽한 코디네이션과 실용적인 날씨 방어 태그를 JSON으로 추천해야 합니다.

반드시 마크다운 백틱 없이 순수 JSON 객체만 출력하십시오.
{
  "styleTitle": "스타일 명칭 (예: 레인 프로프 오피스 시크)",
  "styleDescription": "날씨와 TPO를 고려한 매력적인 1~2줄 코디 설명",
  "weatherDefenseTags": ["#태그1", "#태그2", "#태그3"],
  "items": [
    {"category": "outer", "name": "아이템명", "description": "날씨 방어 및 스타일링 디테일 설명"},
    {"category": "top", "name": "아이템명", "description": "소재 및 레이어링 디테일 설명"},
    {"category": "bottom", "name": "아이템명", "description": "실루엣 및 방수/보온 디테일 설명"},
    {"category": "shoes", "name": "아이템명", "description": "날씨와 어울리는 신발 설명"},
    {"category": "accessory", "name": "아이템명", "description": "가방, 우산 등 소품 설명"}
  ],
  "imagePrompt": "A full-body high-fashion editorial photo of an attractive Korean model..."
}`;

  const userPrompt = `[현재 기상 및 착장 조건]
- 현재 기온: ${weather.temperature}°C (최고: ${weather.tempMax ?? weather.temperature + 3}°C / 최저: ${weather.tempMin ?? weather.temperature - 4}°C)
- 날씨 상태: ${weather.weatherState} (${weather.weatherDescription})
- 체감 키워드: ${weather.apparentKeyword ?? '선선함'}
- 강수량: ${weather.precipitation}mm
- 선택 성별: ${genderLabel}
- 목적(TPO): ${tpoLabels[tpo]}${moodDesc}

날씨 방어 태그에는 비가 오면 #우산_필수, #밝은바지_금지 등을, 일교차가 크면 #일교차_아우터, 햇빛이 강하면 #자외선_차단 등의 실용적인 행동 지침 3~4개를 넣어주세요.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000); // 16초 타임아웃

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
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`TheHive/DeepSeek API 오류 (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('DeepSeek로부터 응답 내용을 전달받지 못했습니다.');
    }

    const parsed = cleanAndParseJson(rawContent);

    // 아이템 정규화
    const items: OutfitItem[] = (parsed.items || []).map((item: any, idx: number) => ({
      id: `ai_item_${idx}_${Date.now()}`,
      category: item.category || 'top',
      name: item.name || '추천 아이템',
      description: item.description || '',
      iconName: getCategoryIcon(item.category || 'top', item.name || ''),
    }));

    // AI 룩북 객체 빌드
    const tempBand = getTemperatureBand(weather.temperature).id;
    const aiLookbook: OutfitLookbook = {
      id: `ai_deepseek_${Date.now()}`,
      gender,
      tempBand,
      weatherState: weather.weatherState,
      tpo,
      styleTitle: parsed.styleTitle || 'DeepSeek AI 날씨 맞춤 코디',
      styleDescription: parsed.styleDescription || '날씨와 기온을 분석하여 생성된 최적의 룩입니다.',
      weatherDefenseTags: parsed.weatherDefenseTags || ['#DeepSeek_AI', '#날씨맞춤'],
      imageUrl: selectBestImageForAi(gender, weather, tpo),
      items,
      imageSource: 'ai',
      generatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      styleTitle: parsed.styleTitle,
      styleDescription: parsed.styleDescription,
      weatherDefenseTags: parsed.weatherDefenseTags,
      items,
      imagePrompt: parsed.imagePrompt,
      lookbook: aiLookbook,
    };
  } catch (error: any) {
    console.warn('DeepSeek AI 코디 추천 호출 실패:', error);
    return {
      success: false,
      errorMessage: error?.message || 'DeepSeek 연동 실패',
    };
  }
}
