import { OutfitLookbook } from '../types/outfit';

export const PRESET_LOOKBOOKS: OutfitLookbook[] = [
  // 1. [여성 / 20~22도 / 맑음] - 사용자 목업 대표 룩
  {
    id: 'f_20to22_clear_1',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    styleTitle: '프렌치 모던 시크',
    styleDescription: '선선한 바람과 따사로운 햇살에 어울리는 클래식 트렌치 룩',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'f1_outer',
        category: 'outer',
        name: '가벼운 트렌치코트',
        iconName: 'shirt-outline',
        description: '가볍고 구김 없는 나일론/코튼 혼방',
      },
      {
        id: 'f1_top',
        category: 'top',
        name: '통기성 좋은 린넨 셔츠',
        iconName: 'shirt-outline',
        description: '화사하고 내추럴한 화이트 오버핏',
      },
      {
        id: 'f1_bottom',
        category: 'bottom',
        name: '와이드 데님 팬츠',
        iconName: 'git-commit-outline',
        description: '체형을 커버해주는 편안한 스트레이트핏',
      },
      {
        id: 'f1_shoes',
        category: 'shoes',
        name: '클래식 로퍼',
        iconName: 'footsteps-outline',
        description: '은은한 광택의 브라운 소가죽 로퍼',
      },
    ],
  },
  {
    id: 'f_20to22_clear_2',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    styleTitle: '소프트 데일리 캐주얼',
    styleDescription: '기온차가 있는 낮과 저녁을 위한 포근한 가디건 레이어드',
    imageUrl:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'f2_outer',
        category: 'outer',
        name: '소프트 크롭 가디건',
        iconName: 'shirt-outline',
        description: '어깨에 살짝 걸치거나 착용하기 좋은 니트',
      },
      {
        id: 'f2_top',
        category: 'top',
        name: '베이직 슬림 반팔티',
        iconName: 'shirt-outline',
        description: '부드러운 프리미엄 수피마 코튼',
      },
      {
        id: 'f2_bottom',
        category: 'bottom',
        name: '하이웨이스트 슬랙스',
        iconName: 'git-commit-outline',
        description: '찰랑거리는 핏의 베이지 슬랙스',
      },
      {
        id: 'f2_shoes',
        category: 'shoes',
        name: '화이트 스니커즈',
        iconName: 'footsteps-outline',
        description: '어디에나 매치하기 편한 레더 스니커즈',
      },
    ],
  },

  // 2. [남성 / 20~22도 / 맑음]
  {
    id: 'm_20to22_clear_1',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    styleTitle: '클래식 시티 보이',
    styleDescription: '맑은 날씨에 제격인 정갈한 옥스포드 셔츠와 와이드 치노 룩',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'm1_outer',
        category: 'outer',
        name: '라이트 맥코트',
        iconName: 'shirt-outline',
        description: '미니멀한 실루엣의 방풍 코튼 코트',
      },
      {
        id: 'm1_top',
        category: 'top',
        name: '화이트 옥스포드 셔츠',
        iconName: 'shirt-outline',
        description: '단정하고 탄탄한 코튼 100% 셔츠',
      },
      {
        id: 'm1_bottom',
        category: 'bottom',
        name: '원턱 와이드 슬랙스',
        iconName: 'git-commit-outline',
        description: '여유로운 테이퍼드 핏 네이비 팬츠',
      },
      {
        id: 'm1_shoes',
        category: 'shoes',
        name: '페니 로퍼',
        iconName: 'footsteps-outline',
        description: '포멀함과 캐주얼을 아우르는 블랙 로퍼',
      },
    ],
  },
  {
    id: 'm_20to22_clear_2',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    styleTitle: '어반 캐주얼 미니멀',
    styleDescription: '가벼운 자켓과 화사한 이너의 경쾌한 조화',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'm2_outer',
        category: 'outer',
        name: '코튼 셔츠 자켓',
        iconName: 'shirt-outline',
        description: '자켓처럼 걸치기 좋은 오버셔츠',
      },
      {
        id: 'm2_top',
        category: 'top',
        name: '헤비웨이트 크루넥',
        iconName: 'shirt-outline',
        description: '탄탄한 핏감의 그레이 긴팔 티셔츠',
      },
      {
        id: 'm2_bottom',
        category: 'bottom',
        name: '테이퍼드 생지 데님',
        iconName: 'git-commit-outline',
        description: '다리가 길어 보이는 다크 인디고 데님',
      },
      {
        id: 'm2_shoes',
        category: 'shoes',
        name: '미니멀 레더 스니커즈',
        iconName: 'footsteps-outline',
        description: '군더더기 없는 화이트 스니커즈',
      },
    ],
  },

  // 3. [28도 이상 / 폭염 & 여름]
  {
    id: 'f_over28_clear_1',
    gender: 'female',
    tempBand: 'over28',
    weatherState: 'Clear',
    styleTitle: '리조트 서머 캐주얼',
    styleDescription: '뜨거운 태양 아래 쾌적함을 유지하는 린넨 룩',
    imageUrl:
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'f_s1_top',
        category: 'top',
        name: '린넨 슬리브리스',
        iconName: 'shirt-outline',
        description: '통기성이 뛰어난 내추럴 린넨 탑',
      },
      {
        id: 'f_s1_bottom',
        category: 'bottom',
        name: '하이웨이스트 린넨 숏츠',
        iconName: 'git-commit-outline',
        description: '시원하고 활동성 좋은 핀턱 숏팬츠',
      },
      {
        id: 'f_s1_shoes',
        category: 'shoes',
        name: '스트랩 가죽 샌들',
        iconName: 'footsteps-outline',
        description: '발이 편안하고 시원한 스트랩 샌들',
      },
      {
        id: 'f_s1_acc',
        category: 'accessory',
        name: 'UV 차단 선글라스',
        iconName: 'glasses-outline',
        description: '자외선 완벽 차단 클래식 프레임',
      },
    ],
  },
  {
    id: 'm_over28_clear_1',
    gender: 'male',
    tempBand: 'over28',
    weatherState: 'Clear',
    styleTitle: '클린 서머 바이브',
    styleDescription: '땀 흡수가 뛰어나고 시원한 린넨 셔츠와 반바지',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'm_s1_top',
        category: 'top',
        name: '오픈카라 린넨 반팔 셔츠',
        iconName: 'shirt-outline',
        description: '목선이 시원한 스카이블루 린넨 셔츠',
      },
      {
        id: 'm_s1_bottom',
        category: 'bottom',
        name: '코튼 버뮤다 팬츠',
        iconName: 'git-commit-outline',
        description: '무릎 살짝 위의 단정한 베이지 숏팬츠',
      },
      {
        id: 'm_s1_shoes',
        category: 'shoes',
        name: '우븐 슬립온',
        iconName: 'footsteps-outline',
        description: '통기성과 경량성을 갖춘 서머 슈즈',
      },
    ],
  },

  // 4. [12~16도 / 간절기]
  {
    id: 'f_12to16_clear_1',
    gender: 'female',
    tempBand: '12to16',
    weatherState: 'Clear',
    styleTitle: '클래식 테일러드 룩',
    styleDescription: '차가운 공기를 막아주는 감각적인 블레이저 룩',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'f_f1_outer',
        category: 'outer',
        name: '오버핏 체크 블레이저',
        iconName: 'shirt-outline',
        description: '멋스러운 실루엣의 울 혼방 자켓',
      },
      {
        id: 'f_f1_top',
        category: 'top',
        name: '모크넥 니트',
        iconName: 'shirt-outline',
        description: '목을 부드럽게 감싸는 파인 울 니트',
      },
      {
        id: 'f_f1_bottom',
        category: 'bottom',
        name: '스트레이트 핏 데님',
        iconName: 'git-commit-outline',
        description: '자켓과 매치하기 좋은 중청 데님',
      },
      {
        id: 'f_f1_shoes',
        category: 'shoes',
        name: '레더 앵클 부츠',
        iconName: 'footsteps-outline',
        description: '안정적인 굽의 블랙 가죽 부츠',
      },
    ],
  },
  {
    id: 'm_12to16_clear_1',
    gender: 'male',
    tempBand: '12to16',
    weatherState: 'Clear',
    styleTitle: '모던 워크웨어 캐주얼',
    styleDescription: '간절기 든든하고 활동적인 자켓 레이어드',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'm_f1_outer',
        category: 'outer',
        name: '워시드 필드 자켓',
        iconName: 'shirt-outline',
        description: '포켓 디테일이 돋보이는 카키 야상 자켓',
      },
      {
        id: 'm_f1_top',
        category: 'top',
        name: '와플 니트 스웨터',
        iconName: 'shirt-outline',
        description: '보온성 높은 크루넥 니트',
      },
      {
        id: 'm_f1_bottom',
        category: 'bottom',
        name: '슬림 테이퍼드 치노',
        iconName: 'git-commit-outline',
        description: '깔끔한 실루엣의 차콜 팬츠',
      },
      {
        id: 'm_f1_shoes',
        category: 'shoes',
        name: '더비 슈즈',
        iconName: 'footsteps-outline',
        description: '클래식한 코만도 솔 더비슈즈',
      },
    ],
  },

  // 5. [4도 이하 / 한겨울 한파]
  {
    id: 'f_under4_snow_1',
    gender: 'female',
    tempBand: 'under4',
    weatherState: 'Snow',
    styleTitle: '윈터 웜 미니멀',
    styleDescription: '눈 오는 한겨울 바람을 막아주는 프리미엄 구스다운 코디',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'f_w1_outer',
        category: 'outer',
        name: '롱 구스다운 패딩',
        iconName: 'shirt-outline',
        description: '풍성한 볼륨과 완벽 방한 구스다운',
      },
      {
        id: 'f_w1_top',
        category: 'top',
        name: '캐시미어 터틀넥',
        iconName: 'shirt-outline',
        description: '목까지 따뜻하게 감싸주는 니트',
      },
      {
        id: 'f_w1_bottom',
        category: 'bottom',
        name: '기모 코듀로이 팬츠',
        iconName: 'git-commit-outline',
        description: '보온성과 빈티지 무드의 골덴 팬츠',
      },
      {
        id: 'f_w1_shoes',
        category: 'shoes',
        name: '어그 웜 퍼 부츠',
        iconName: 'footsteps-outline',
        description: '발끝까지 포근한 양털 안감 부츠',
      },
    ],
  },
  {
    id: 'm_under4_snow_1',
    gender: 'male',
    tempBand: 'under4',
    weatherState: 'Snow',
    styleTitle: '헤비 윈터 아웃도어',
    styleDescription: '영하의 추위와 눈보라에도 끄떡없는 헤비 다운 파카',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'm_w1_outer',
        category: 'outer',
        name: '헤비 덕다운 파카',
        iconName: 'shirt-outline',
        description: '발수 코팅과 극강의 보온성',
      },
      {
        id: 'm_w1_top',
        category: 'top',
        name: '플리스 안감 후드티',
        iconName: 'shirt-outline',
        description: '레이어드하기 좋은 헤비웨이트 후디',
      },
      {
        id: 'm_w1_bottom',
        category: 'bottom',
        name: '본딩 기모 카고 팬츠',
        iconName: 'git-commit-outline',
        description: '방풍 안감이 들어간 조거 카고',
      },
      {
        id: 'm_w1_shoes',
        category: 'shoes',
        name: '방수 트레킹 부츠',
        iconName: 'footsteps-outline',
        description: '미끄럼 방지 그립 솔 부츠',
      },
    ],
  },

  // 6. [비 오는 날 / Rain]
  {
    id: 'f_rain_1',
    gender: 'female',
    tempBand: '17to19',
    weatherState: 'Rain',
    styleTitle: '레인 프로텍션 시크',
    styleDescription: '빗방울을 튕겨내는 방수 아우터와 감각적인 레인부츠',
    imageUrl:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'f_r1_outer',
        category: 'outer',
        name: '방수 레인 윈드브레이커',
        iconName: 'umbrella-outline',
        description: '비바람을 완벽 차단하는 발수 자켓',
      },
      {
        id: 'f_r1_top',
        category: 'top',
        name: '베이직 코튼 롱슬리브',
        iconName: 'shirt-outline',
        description: '단독으로도 깔끔한 라운드넥',
      },
      {
        id: 'f_r1_bottom',
        category: 'bottom',
        name: '크롭 테이퍼드 팬츠',
        iconName: 'git-commit-outline',
        description: '비에 젖지 않도록 기장감이 깔끔한 슬랙스',
      },
      {
        id: 'f_r1_shoes',
        category: 'shoes',
        name: '첼시 레인부츠',
        iconName: 'footsteps-outline',
        description: '빗길에도 끄떡없는 고무 첼시 부츠',
      },
    ],
  },
  {
    id: 'm_rain_1',
    gender: 'male',
    tempBand: '17to19',
    weatherState: 'Rain',
    styleTitle: '어반 웻웨더 가드',
    styleDescription: '우천 시 쾌적한 출퇴근을 위한 테크웨어 자켓 코디',
    imageUrl:
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      {
        id: 'm_r1_outer',
        category: 'outer',
        name: '고어텍스 후드 자켓',
        iconName: 'umbrella-outline',
        description: '투습 방수 기능의 하이엔드 쉘자켓',
      },
      {
        id: 'm_r1_top',
        category: 'top',
        name: '퀵드라이 맨투맨',
        iconName: 'shirt-outline',
        description: '빠르게 마르는 기능성 스웨트셔츠',
      },
      {
        id: 'm_r1_bottom',
        category: 'bottom',
        name: '발수 나일론 조거팬츠',
        iconName: 'git-commit-outline',
        description: '오염에 강한 신축성 발수 팬츠',
      },
      {
        id: 'm_r1_shoes',
        category: 'shoes',
        name: '방수 고어텍스 스니커즈',
        iconName: 'footsteps-outline',
        description: '물웅덩이도 안심인 방수 러닝화',
      },
    ],
  },
];

/**
 * 주어진 날씨/기온대/성별에 가장 적합한 룩북 목록(최소 1~3개)을 찾아 반환
 */
export function findMatchingLookbooks(
  gender: 'female' | 'male',
  tempBand: string,
  weatherState: string
): OutfitLookbook[] {
  // 1차: 성별 + 날씨상태(비/눈일 때) 우선 필터
  if (weatherState === 'Rain' || weatherState === 'Snow') {
    const weatherMatches = PRESET_LOOKBOOKS.filter(
      (b) => b.gender === gender && b.weatherState === weatherState
    );
    if (weatherMatches.length > 0) return weatherMatches;
  }

  // 2차: 성별 + 기온대 일치
  const bandMatches = PRESET_LOOKBOOKS.filter(
    (b) => b.gender === gender && b.tempBand === tempBand
  );
  if (bandMatches.length > 0) return bandMatches;

  // 3차: 성별만 일치하는 기본 룩북
  const genderMatches = PRESET_LOOKBOOKS.filter((b) => b.gender === gender);
  if (genderMatches.length > 0) return genderMatches;

  // 4차: 전체 프리셋 중 첫 번째
  return [PRESET_LOOKBOOKS[0]];
}
