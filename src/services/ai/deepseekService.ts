import { Platform } from 'react-native';
import { WeatherData, Gender } from '../../types/weather';
import { OutfitLookbook, TpoCategory, OutfitItem } from '../../types/outfit';
import { getTemperatureBand } from '../../constants/temperatureBands';
import { findMatchingLookbooks } from '../../data/presetLookbooks';
import { generateFashionImageWithFlux } from './fluxService';

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

  // 웹 브라우저 환경에서는 CORS 우회를 위해 /api/ai/deepseek 프록시 사용
  const baseUrl =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? '/api/ai/deepseek'
      : process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL || 'https://api-cdn.thehive.ai/api/v3';

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
  let text = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/g, '').trim();

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
  if (lowerName.includes('가방') || lowerName.includes('백') || lowerName.includes('bag') || lowerName.includes('토트')) return 'bag-handle-outline';
  if (lowerName.includes('모자') || lowerName.includes('캡') || lowerName.includes('비니') || lowerName.includes('버킷')) return 'happy-outline';
  if (lowerName.includes('선글라스') || lowerName.includes('안경') || lowerName.includes('글래스')) return 'glasses-outline';
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
 * AI 코디에 어울리는 최적의 고화질 실사 룩북 배경 이미지 선택 (Flux 실패 시 폴백용)
 */
function selectBestPresetImageForAi(gender: Gender, weather: WeatherData, tpo: TpoCategory) {
  const tempBand = getTemperatureBand(weather.temperature).id;
  const presets = findMatchingLookbooks(gender, tempBand, weather.weatherState, tpo);
  if (presets.length > 0) {
    // 매번 다른 프리셋 이미지가 나오도록 랜덤 선택
    const randomIndex = Math.floor(Math.random() * presets.length);
    return presets[randomIndex].imageUrl;
  }
  return require('../../../assets/lookbooks/female_trendy_22c_1.jpg');
}

/**
 * DeepSeek V4.1 Flash와 TheHive Flux Schnell을 이용한 End-to-End AI 코디 및 실사 화보 생성
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
      errorMessage: 'TheHive / DeepSeek API 키가 설정되지 않았습니다.',
    };
  }

  const tpoLabels: Record<TpoCategory, string> = {
    office: '출근 / 단정 (오피스, 테일러드 수트, 비즈니스 캐주얼, 모던 포멀)',
    daily: '데일리 / 캐주얼 (감각적인 미니멀, 편안한 니트/셔츠, 프렌치 시크)',
    street: '스트릿 / 힙 (트렌디한 고프코어, 오버핏, 바시티, 유틸리티, 힙스터)',
  };

  const genderLabel = gender === 'female' ? '여성' : gender === 'male' ? '남성' : '성별 무관';
  const moodDesc = styleMood ? `\n- 선택 스타일 무드: ${styleMood}` : '';

  // 매번 다른 스타일링을 유도하기 위한 랜덤 시드와 창의적 무드 힌트
  const creativeVariations = [
    '톤온톤 뉴트럴 무드',
    '세련된 실루엣 대비 룩',
    '도시적인 테일러드 믹스매치',
    '가벼운 소재감의 레이어드 룩',
    '모던하고 정갈한 미니멀리즘',
    '센스있는 포인트 컬러 스타일링',
    '활동성과 방풍/보온성을 겸비한 룩',
  ];
  const randomVariation = creativeVariations[Math.floor(Math.random() * creativeVariations.length)];

  const systemPrompt = `당신은 대한민국 최고의 패션 디렉터이자 dize. OOTD AI입니다.
주어진 날씨(기온, 일교차, 강수/적설 상태)와 TPO, 성별을 정밀 분석하여, 매번 신선하고 감각적인 새로운 코디네이션을 제안해야 합니다.

[절대 규칙]
1. 스타일 명칭(styleTitle), 설명(styleDescription), 태그 등에 'DeepSeek', 'V4.1', 'AI', '인공지능', '모델', '생성' 같은 기술 엔진 이름을 절대로 넣지 마십시오. 오직 실제 패션 매거진(29CM, 무신사) 스타일의 감각적인 어휘만 사용하십시오.
2. 정형화되거나 뻔한 아이템(예: 타일러드 체크 블레이저만 반복)을 절대 추천하지 마십시오.
3. 날씨와 기온에 맞춰 다양한 아우터(트렌치코트, 트러커, 블루종, 퀼팅 자켓, 니트 가디건, 레더 자켓, 후드 집업, 맥코트, 코트 등)와 이너(린넨 셔츠, 옥스포드 셔츠, 하프집업, 모헤어 니트, 케이블 니트 등), 팬츠(와이드 슬랙스, 테이퍼드 치노, 카펜터 팬츠, 생지 데님 등), 슈즈(로퍼, 더비, 첼시부츠, 독일군 스니커즈, 뮬 등)를 창의적이고 다채롭게 조합하십시오.
4. 이번 추천 테마: "${randomVariation}"을 반영하십시오.
5. 반드시 순수 JSON 객체만 출력하십시오 (마크다운 백틱 없이):
{
  "styleTitle": "새롭고 감각적인 패션 스타일 명칭 (예: 한남동 세미오버 린넨 셋업)",
  "styleDescription": "날씨와 상황에 어울리는 매력적인 1~2줄 코디 디렉팅 설명",
  "weatherDefenseTags": ["#방어태그1", "#태그2", "#태그3"],
  "items": [
    {"category": "outer", "name": "아이템명", "description": "날씨 방어 및 스타일링 디테일"},
    {"category": "top", "name": "아이템명", "description": "소재 및 레이어링 디테일"},
    {"category": "bottom", "name": "아이템명", "description": "실루엣 및 원단 디테일"},
    {"category": "shoes", "name": "아이템명", "description": "신발 디자인 및 착화감 디테일"},
    {"category": "accessory", "name": "아이템명", "description": "가방, 우산 등 소품 디테일"}
  ],
  "imagePrompt": "A high-fashion full-body editorial photo of a chic Korean model in Seoul, wearing (세부 착장 영문 묘사), 8k, cinematic natural lighting"
}`;

  const userPrompt = `[현재 기상 및 착장 조건 (요청 ID: ${Date.now()})]
- 현재 기온: ${weather.temperature}°C (최고: ${weather.tempMax ?? weather.temperature + 3}°C / 최저: ${weather.tempMin ?? weather.temperature - 4}°C)
- 날씨 상태: ${weather.weatherState} (${weather.weatherDescription})
- 강수량: ${weather.precipitation}mm
- 선택 성별: ${genderLabel}
- 목적(TPO): ${tpoLabels[tpo]}${moodDesc}

날씨 방어 태그에는 비가 오면 #우산_필수, #방수소재 등을, 일교차가 크면 #레이어링, 쌀쌀하면 #체온유지 등의 실용적인 행동 지침 3~4개를 넣어주세요.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const isProxy = baseUrl.startsWith('/');
    const endpoint = isProxy
      ? baseUrl
      : baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (!isProxy) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`TheHive DeepSeek API 오류 (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('DeepSeek 응답 내용이 비어있습니다.');
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

    // [핵심] TheHive Flux Schnell을 이용한 실시간 실사 화보 이미지 동시 생성 시도
    let finalImageUrl: any = selectBestPresetImageForAi(gender, weather, tpo);
    if (parsed.imagePrompt) {
      try {
        const fluxResult = await generateFashionImageWithFlux(parsed.imagePrompt, 20000);
        if (fluxResult.success && fluxResult.imageUrl) {
          finalImageUrl = fluxResult.imageUrl;
        }
      } catch (fluxErr) {
        console.warn('Flux 실시간 이미지 생성 실패 -> 고화질 룩북 프리셋 폴백:', fluxErr);
      }
    }

    const tempBand = getTemperatureBand(weather.temperature).id;
    const aiLookbook: OutfitLookbook = {
      id: `ai_deepseek_${Date.now()}`,
      gender,
      tempBand,
      weatherState: weather.weatherState,
      tpo,
      styleTitle: parsed.styleTitle || '감각적인 날씨 맞춤 코디',
      styleDescription: parsed.styleDescription || '날씨와 상황에 맞춰 새롭게 디자인된 착장입니다.',
      weatherDefenseTags: parsed.weatherDefenseTags || ['#오늘의_OOTD', '#실시간_추천'],
      imageUrl: finalImageUrl,
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
