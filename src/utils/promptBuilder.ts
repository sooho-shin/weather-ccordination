import { getTemperatureBand } from '../constants/temperatureBands';
import { AIOutfitGenerationRequest, OutfitItem } from '../types/outfit';

export interface PromptBuildResult {
  prompt: string;
  suggestedItems: OutfitItem[];
  styleTitle: string;
  styleDescription: string;
}

export function buildOutfitPrompt(request: AIOutfitGenerationRequest): PromptBuildResult {
  const { gender, temperature, weatherState, styleMood = '트렌디 어반 데일리' } = request;
  const tempBand = getTemperatureBand(temperature);

  const genderEn = gender === 'female' ? 'stylish 20s-30s Korean woman' : 'stylish 20s-30s Korean man';
  const weatherAtmosphere = {
    Clear: 'warm soft natural sunlight, clear blue sky in modern Seoul European-style city street',
    Clouds: 'gentle overcast diffuse soft lighting, chic moody aesthetic city street',
    Rain: 'rainy city day, wet pavement reflections, holding a minimalist modern umbrella, raindrops',
    Snow: 'falling soft snowflakes, winter city street, cozy atmospheric lighting',
  }[weatherState];

  let outfitDescriptionEn = '';
  let suggestedItems: OutfitItem[] = [];
  const styleTitle = `${styleMood} 룩`;
  let styleDescription = `${temperature}°C 날씨에 최적화된 감각적인 AI 추천 코디`;

  if (temperature >= 28) {
    if (gender === 'female') {
      outfitDescriptionEn =
        'wearing breathable cream linen short-sleeve top, high-waisted beige cotton bermuda shorts, minimalist leather strap sandals';
      suggestedItems = [
        { id: 'ai_t', category: 'top', name: '크림 린넨 반팔탑', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '베이지 버뮤다 핀턱숏츠', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '스트랩 레더 샌들', iconName: 'footsteps-outline' },
        { id: 'ai_a', category: 'accessory', name: '실버 프레임 선글라스', iconName: 'glasses-outline' },
      ];
    } else {
      outfitDescriptionEn =
        'wearing breathable open-collar mint linen shirt, tailored relaxed ivory shorts, woven slip-on loafers';
      suggestedItems = [
        { id: 'ai_t', category: 'top', name: '오픈카라 민트 린넨셔츠', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '아이보리 코튼 숏츠', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '우븐 레더 슬립온', iconName: 'footsteps-outline' },
      ];
    }
  } else if (temperature >= 20) {
    // 20~22도
    if (gender === 'female') {
      outfitDescriptionEn =
        'wearing a classic lightweight beige trench coat unbuttoned, crisp white tailored linen-cotton shirt, stylish wide-leg denim jeans, brown classic loafers, hands casually in pockets';
      suggestedItems = [
        { id: 'ai_o', category: 'outer', name: '라이트 베이지 트렌치코트', iconName: 'shirt-outline' },
        { id: 'ai_t', category: 'top', name: '화이트 코튼 린넨 셔츠', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '와이드핏 데님 팬츠', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '브라운 클래식 로퍼', iconName: 'footsteps-outline' },
      ];
    } else {
      outfitDescriptionEn =
        'wearing an unbuttoned lightweight Mac coat, clean light-blue poplin shirt, charcoal relaxed pleated trousers, black leather penny loafers';
      suggestedItems = [
        { id: 'ai_o', category: 'outer', name: '미니멀 싱글 맥코트', iconName: 'shirt-outline' },
        { id: 'ai_t', category: 'top', name: '라이트블루 팝린 셔츠', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '차콜 원턱 와이드 슬랙스', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '블랙 페니 로퍼', iconName: 'footsteps-outline' },
      ];
    }
  } else if (temperature >= 12) {
    // 12~19도
    if (gender === 'female') {
      outfitDescriptionEn =
        'wearing an oversized tailored houndstooth blazer jacket, fitted soft knit sweater, straight leg dark jeans, stylish leather ankle boots';
      suggestedItems = [
        { id: 'ai_o', category: 'outer', name: '테일러드 체크 블레이저', iconName: 'shirt-outline' },
        { id: 'ai_t', category: 'top', name: '모크넥 파인 니트', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '다크 스트레이트진', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '스퀘어토 앵클부츠', iconName: 'footsteps-outline' },
      ];
    } else {
      outfitDescriptionEn =
        'wearing a structured field utility jacket, oatmeal crewneck knit, washed black denim, chunky leather derbies';
      suggestedItems = [
        { id: 'ai_o', category: 'outer', name: '유틸리티 필드 자켓', iconName: 'shirt-outline' },
        { id: 'ai_t', category: 'top', name: '오트밀 크루넥 스웨터', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '워싱 블랙 데님', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '코만도솔 더비슈즈', iconName: 'footsteps-outline' },
      ];
    }
  } else {
    // 11도 이하 겨울
    if (gender === 'female') {
      outfitDescriptionEn =
        'wearing a luxurious heavy goose down puffer coat, cozy ribbed turtleneck knit, wool flannel wide pants, stylish fleece-lined boots, fluffy scarf';
      suggestedItems = [
        { id: 'ai_o', category: 'outer', name: '프리미엄 구스다운 패딩', iconName: 'shirt-outline' },
        { id: 'ai_t', category: 'top', name: '캐시미어 터틀넥 니트', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '울 플란넬 와이드 팬츠', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '방한 퍼 첼시부츠', iconName: 'footsteps-outline' },
      ];
    } else {
      outfitDescriptionEn =
        'wearing a black minimalist oversized puffer parka, thick charcoal hoodie, warm fleece-lined cargo trousers, rugged winter boots';
      suggestedItems = [
        { id: 'ai_o', category: 'outer', name: '오버핏 롱 다운 파카', iconName: 'shirt-outline' },
        { id: 'ai_t', category: 'top', name: '헤비웨이트 기모 후드티', iconName: 'shirt-outline' },
        { id: 'ai_b', category: 'bottom', name: '방한 본딩 카고팬츠', iconName: 'git-commit-outline' },
        { id: 'ai_s', category: 'shoes', name: '방수 트레킹 슈즈', iconName: 'footsteps-outline' },
      ];
    }
  }

  const prompt = [
    `Ultra-realistic 8k full-body candid fashion editorial photograph of a ${genderEn}`,
    `walking naturally outdoors, ${outfitDescriptionEn}`,
    `Weather and mood: ${weatherAtmosphere}, temperature feeling around ${temperature}°C (${tempBand.summary})`,
    'Natural candid smile, high fashion magazine quality, Leica 50mm f/1.4 lens bokeh, sharp authentic fabric textures and seams, hyper-realistic, 8k resolution, cinematic composition',
  ].join(', ');

  return {
    prompt,
    suggestedItems,
    styleTitle,
    styleDescription,
  };
}
