import { OutfitLookbook } from '../types/outfit';

export const PRESET_LOOKBOOKS: OutfitLookbook[] = [
  // =========================================================================
  // 1. [여성 / 20~22도 / 맑음 & 봄가을] - 29CM/W컨셉 5대 대표 스타일
  // =========================================================================
  {
    id: 'f_20to22_clear_1',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '한남동 미니멀 테일러드',
    styleDescription: '오버핏 모카 블레이저와 플루이드 와이드 슬랙스로 완성한 감각적인 29CM 룩',
    imageUrl: require('../../assets/lookbooks/female_trendy_22c_1.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'f1_outer', category: 'outer', name: '오버핏 모카 블레이저', iconName: 'shirt-outline', description: '자연스러운 드롭숄더의 프리미엄 울 블레이저' },
      { id: 'f1_top', category: 'top', name: '아이보리 파인 골지니트', iconName: 'shirt-outline', description: '부드러운 캐시미어 블렌드 라운드넥' },
      { id: 'f1_bottom', category: 'bottom', name: '차콜 핀턱 와이드 슬랙스', iconName: 'git-commit-outline', description: '유려하게 떨어지는 하이웨이스트 투턱 슬랙스' },
      { id: 'f1_shoes', category: 'shoes', name: '포인티드 토 키튼힐 부츠', iconName: 'footsteps-outline', description: '날렵한 실루엣의 시크한 블랙 가죽 부츠' },
      { id: 'f1_acc', category: 'accessory', name: '미니멀 레더 숄더백', iconName: 'bag-handle-outline', description: '은은한 광택의 하프문 숄더백' },
    ],
  },
  {
    id: 'f_20to22_clear_2',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '프렌치 모던 트렌치',
    styleDescription: '래글런 맥 트렌치코트와 스트라이프 니트로 연출한 프렌치 시크',
    imageUrl: require('../../assets/lookbooks/female_trendy_22c_2.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'f2_outer', category: 'outer', name: '래글런 맥 트렌치코트', iconName: 'shirt-outline', description: '에크루 베이지 컬러의 유려한 A라인 맥코트' },
      { id: 'f2_top', category: 'top', name: '보트넥 스트라이프 니트', iconName: 'shirt-outline', description: '네이비 & 화이트 마린 스트라이프 니트' },
      { id: 'f2_bottom', category: 'bottom', name: '딥인디고 롤업 생지데님', iconName: 'git-commit-outline', description: '깔끔한 롤업 디테일의 스트레이트 데님' },
      { id: 'f2_shoes', category: 'shoes', name: '버건디 페니 로퍼', iconName: 'footsteps-outline', description: '골드 호스빗 포인트 소가죽 로퍼' },
    ],
  },
  {
    id: 'f_20to22_clear_3',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'daily',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '소프트 데일리 가디건',
    styleDescription: '포근한 버터크림 알파카 가디건과 아이보리 코튼 팬츠의 톤온톤 조화',
    imageUrl: require('../../assets/lookbooks/female_trendy_22c_3.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'f3_outer', category: 'outer', name: '버터크림 V넥 알파카 가디건', iconName: 'shirt-outline', description: '헤어리한 텍스처의 포근한 루즈핏 가디건' },
      { id: 'f3_top', category: 'top', name: '수피마 크루넥 반팔티', iconName: 'shirt-outline', description: '이너로 받쳐입기 좋은 화이트 수피마 코튼' },
      { id: 'f3_bottom', category: 'bottom', name: '아이보리 핀턱 와이드 치노', iconName: 'git-commit-outline', description: '체형을 커버해주는 내추럴 릴랙스 핏' },
      { id: 'f3_shoes', category: 'shoes', name: '미니멀 코트 스니커즈', iconName: 'footsteps-outline', description: '어디에나 어울리는 올화이트 레더 스니커즈' },
    ],
  },
  {
    id: 'f_20to22_clear_4',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '시크 크롭 레더 자켓',
    styleDescription: '스탠드카라 비건 레더 자켓과 빈티지 와이드 진의 트렌디 믹스',
    imageUrl: require('../../assets/lookbooks/female_trendy_22c_4.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'f4_outer', category: 'outer', name: '크롭 비건 레더 자켓', iconName: 'shirt-outline', description: '스탠드 카라와 포켓 디테일의 빈티지 레더' },
      { id: 'f4_top', category: 'top', name: '소프트 멜란지 그레이 티', iconName: 'shirt-outline', description: '감각적인 드레이프의 코튼 티셔츠' },
      { id: 'f4_bottom', category: 'bottom', name: '빈티지 차콜 와이드 진', iconName: 'git-commit-outline', description: '은은한 샌드 워싱이 들어간 맥시 와이드' },
      { id: 'f4_shoes', category: 'shoes', name: '스퀘어토 레더 앵클부츠', iconName: 'footsteps-outline', description: '시크한 실루엣의 블랙 첼시 앵클부츠' },
    ],
  },
  {
    id: 'f_20to22_clear_5',
    gender: 'female',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '스포티 고프코어 시티룩',
    styleDescription: '세이지 배색 윈드브레이커와 파라슈트 카고 팬츠의 어반 스트릿',
    imageUrl: require('../../assets/lookbooks/female_trendy_22c_5.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'f5_outer', category: 'outer', name: '투톤 세이지 윈드브레이커', iconName: 'shirt-outline', description: '가볍고 방풍성이 우수한 테크니컬 바람막이' },
      { id: 'f5_top', category: 'top', name: '슬림핏 크롭 티셔츠', iconName: 'shirt-outline', description: '허리선을 살려주는 베이직 화이트 탑' },
      { id: 'f5_bottom', category: 'bottom', name: '슬레이트 파라슈트 카고', iconName: 'git-commit-outline', description: '밑단 스트링으로 조절 가능한 나일론 팬츠' },
      { id: 'f5_shoes', category: 'shoes', name: '테크니컬 트레일 슈즈', iconName: 'footsteps-outline', description: '접지력과 쿠셔닝이 뛰어난 고프코어 스니커즈' },
    ],
  },

  // =========================================================================
  // 2. [남성 / 20~22도 / 맑음 & 봄가을] - 무신사/29CM 5대 대표 스타일
  // =========================================================================
  {
    id: 'm_20to22_clear_1',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '어반 빈티지 레더 믹스',
    styleDescription: '워시드 카라 레더 블루종과 오트밀 니트로 완성한 감각적인 무신사 스트릿 룩',
    imageUrl: require('../../assets/lookbooks/male_trendy_22c_1.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'm1_outer', category: 'outer', name: '워시드 카라 레더 블루종', iconName: 'shirt-outline', description: '은은한 워싱 디테일의 비건 레더 오버핏 자켓' },
      { id: 'm1_top', category: 'top', name: '오트밀 헤더 파인니트', iconName: 'shirt-outline', description: '포근하고 단정한 크루넥 파인게이지 니트' },
      { id: 'm1_bottom', category: 'bottom', name: '차콜 원턱 와이드 슬랙스', iconName: 'git-commit-outline', description: '신발 위로 자연스럽게 턱이 잡히는 와이드 팬츠' },
      { id: 'm1_shoes', category: 'shoes', name: '스퀘어토 레더 첼시부츠', iconName: 'footsteps-outline', description: '시크한 스퀘어토 쉐입의 블랙 가죽 부츠' },
    ],
  },
  {
    id: 'm_20to22_clear_2',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '클래식 시티보이 맥코트',
    styleDescription: '세이지 맥코트와 화이트 팝린 셔츠로 연출한 단정하고 감각적인 시티보이 룩',
    imageUrl: require('../../assets/lookbooks/male_trendy_22c_2.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'm2_outer', category: 'outer', name: '세이지카키 싱글 맥코트', iconName: 'shirt-outline', description: '미니멀한 실루엣의 방풍 코튼 블렌드 코트' },
      { id: 'm2_top', category: 'top', name: '오버핏 화이트 팝린 셔츠', iconName: 'shirt-outline', description: '탄탄하고 깔끔한 클래식 드레스 셔츠' },
      { id: 'm2_bottom', category: 'bottom', name: '다크네이비 와이드 치노', iconName: 'git-commit-outline', description: '원턱 디테일의 여유로운 테이퍼드 치노' },
      { id: 'm2_shoes', category: 'shoes', name: '다크브라운 페니 로퍼', iconName: 'footsteps-outline', description: '클래식한 품격의 가죽 로퍼' },
    ],
  },
  {
    id: 'm_20to22_clear_3',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'daily',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '하프집업 니트 레이어드',
    styleDescription: '네이비 하프집업 스웨터와 크림 와이드 슬랙스로 연출한 깔끔한 남친룩',
    imageUrl: require('../../assets/lookbooks/male_trendy_22c_3.jpg'),
    imageSource: 'preset',
    items: [
      { id: 'm3_outer', category: 'outer', name: '네이비 골지 하프집업 니트', iconName: 'shirt-outline', description: '지퍼 조절로 하이넥/오픈 연출이 가능한 스웨터' },
      { id: 'm3_top', category: 'top', name: '레이어드용 화이트 크루넥', iconName: 'shirt-outline', description: '밑단 레이어드 포인트를 주는 탄탄한 코튼 티' },
      { id: 'm3_bottom', category: 'bottom', name: '크림베이지 와이드 슬랙스', iconName: 'git-commit-outline', description: '부드러운 컬러감의 핀턱 스트레이트 슬랙스' },
      { id: 'm3_shoes', category: 'shoes', name: '미니멀 레더 더비슈즈', iconName: 'footsteps-outline', description: '깔끔하고 댄디한 플랫 솔 더비슈즈' },
    ],
  },
  {
    id: 'm_20to22_clear_4',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '모던 미니멀 셋업 블레이저',
    styleDescription: '드롭숄더 다크 차콜 블레이저와 와이드 팬츠로 완성한 컨템포러리 셋업',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm4_outer', category: 'outer', name: '오버핏 차콜 싱글 블레이저', iconName: 'shirt-outline', description: '자연스러운 어깨 패드의 세련된 미니멀 자켓' },
      { id: 'm4_top', category: 'top', name: '모달 블렌드 블랙 크루넥', iconName: 'shirt-outline', description: '차르르 떨어지는 고급스러운 블랙 반팔티' },
      { id: 'm4_bottom', category: 'bottom', name: '셋업 투턱 와이드 트라우저', iconName: 'git-commit-outline', description: '블레이저와 셋업으로 매치하는 차콜 슬랙스' },
      { id: 'm4_shoes', category: 'shoes', name: '스퀘어토 레더 로퍼', iconName: 'footsteps-outline', description: '모던한 스퀘어토 라인의 블랙 슈즈' },
    ],
  },
  {
    id: 'm_20to22_clear_5',
    gender: 'male',
    tempBand: '20to22',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#선선한_가을바람","#일교차_대비","#감각적인_레이어드"],
    styleTitle: '유틸리티 코튼 셔켓 캐주얼',
    styleDescription: '포켓 디테일의 코튼 오버셔츠와 데님을 매치한 편안한 데일리 룩',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm5_outer', category: 'outer', name: '유틸리티 포켓 코튼 셔켓', iconName: 'shirt-outline', description: '아우터처럼 툭 걸치기 좋은 오버사이즈 셔츠' },
      { id: 'm5_top', category: 'top', name: '헤비웨이트 애쉬그레이 티', iconName: 'shirt-outline', description: '비침 없이 탄탄한 20수 코튼 티셔츠' },
      { id: 'm5_bottom', category: 'bottom', name: '미드블루 루즈핏 데님', iconName: 'git-commit-outline', description: '편안한 무드의 워시드 스트레이트 데님' },
      { id: 'm5_shoes', category: 'shoes', name: '클래식 캔버스 스니커즈', iconName: 'footsteps-outline', description: '어디에나 가볍게 매치하기 좋은 스니커즈' },
    ],
  },

  // =========================================================================
  // 3. [여성 / 28도 이상 / 한여름 폭염] - 29CM/W컨셉 서머 5대 대표 스타일
  // =========================================================================
  {
    id: 'f_over28_clear_1',
    gender: 'female',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '리조트 서머 린넨 셋업',
    styleDescription: '뜨거운 태양 아래 쾌적함을 유지하는 고급스러운 내추럴 린넨 탑 & 숏츠',
    imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_s1_top', category: 'top', name: '스퀘어넥 린넨 슬리브리스', iconName: 'shirt-outline', description: '통기성이 뛰어난 내추럴 오트밀 린넨 탑' },
      { id: 'f_s1_bottom', category: 'bottom', name: '하이웨이스트 린넨 숏츠', iconName: 'git-commit-outline', description: '시원하고 활동성 좋은 핀턱 숏팬츠' },
      { id: 'f_s1_shoes', category: 'shoes', name: '스트랩 가죽 샌들', iconName: 'footsteps-outline', description: '발이 편안하고 시원한 에크루 스트랩 샌들' },
      { id: 'f_s1_acc', category: 'accessory', name: 'UV 차단 선글라스', iconName: 'glasses-outline', description: '자외선 완벽 차단 볼드 프레임 선글라스' },
    ],
  },
  {
    id: 'f_over28_clear_2',
    gender: 'female',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '내추럴 맥시 린넨 원피스',
    styleDescription: '바람이 잘 통하는 A라인 실루엣의 에크루 린넨 롱드레스 룩',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_s2_top', category: 'top', name: '백슬릿 린넨 맥시 드레스', iconName: 'shirt-outline', description: '우아하게 퍼지는 릴랙스 핏 롱원피스' },
      { id: 'f_s2_shoes', category: 'shoes', name: '우븐 레더 뮬', iconName: 'footsteps-outline', description: '부드러운 가죽으로 엮은 서머 뮬' },
      { id: 'f_s2_acc', category: 'accessory', name: '라피아 토트백', iconName: 'bag-handle-outline', description: '여름 무드가 물씬 풍기는 핸드메이드 라피아 백' },
    ],
  },
  {
    id: 'f_over28_clear_3',
    gender: 'female',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'daily',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '쿨 시어 셔츠 & 버뮤다 룩',
    styleDescription: '은은한 시스루 셔츠와 와이드 버뮤다 팬츠로 연출한 도회적 시크',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_s3_outer', category: 'outer', name: '시어 오버핏 반팔 셔츠', iconName: 'shirt-outline', description: '에어컨 바람과 자외선을 막아주는 얇은 시스루 셔츠' },
      { id: 'f_s3_top', category: 'top', name: '골지 립 크롭 슬리브리스', iconName: 'shirt-outline', description: '이너로 가볍게 받쳐입는 코튼 탑' },
      { id: 'f_s3_bottom', category: 'bottom', name: '원턱 와이드 버뮤다 팬츠', iconName: 'git-commit-outline', description: '무릎 기장의 시원하고 포멀한 슬랙스 쇼츠' },
      { id: 'f_s3_shoes', category: 'shoes', name: '피셔맨 레더 샌들', iconName: 'footsteps-outline', description: '발등을 안정적으로 감싸주는 블랙 가죽 샌들' },
    ],
  },
  {
    id: 'f_over28_clear_4',
    gender: 'female',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '서머 홀터 니트 & 플루이드 팬츠',
    styleDescription: '시원한 홀터넥 골지 니트와 차르르 흐르는 린넨 슬랙스의 올드머니 서머',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_s4_top', category: 'top', name: '쿨 터치 홀터넥 니트', iconName: 'shirt-outline', description: '몸에 달라붙지 않는 기능성 서머 얀 탑' },
      { id: 'f_s4_bottom', category: 'bottom', name: '플루이드 핀턱 린넨 트라우저', iconName: 'git-commit-outline', description: '우아한 드레이프의 아이보리 와이드 팬츠' },
      { id: 'f_s4_shoes', category: 'shoes', name: '미니멀 스트랩 플랫', iconName: 'footsteps-outline', description: '발목을 돋보이게 하는 가죽 플랫 슈즈' },
    ],
  },
  {
    id: 'f_over28_clear_5',
    gender: 'female',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '스포티 파라슈트 서머 스트릿',
    styleDescription: '쿨맥스 크롭 티셔츠와 경량 파라슈트 롱스커트의 트렌디 스트릿 믹스',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_s5_top', category: 'top', name: '쿨맥스 슬림 크롭 반팔', iconName: 'shirt-outline', description: '흡습속건이 우수한 스포티 크롭 티셔츠' },
      { id: 'f_s5_bottom', category: 'bottom', name: '나일론 드로스트링 맥시 스커트', iconName: 'git-commit-outline', description: '초경량 발수 나일론의 트렌디 롱스커트' },
      { id: 'f_s5_shoes', category: 'shoes', name: '청키 플랫폼 샌들', iconName: 'footsteps-outline', description: '키높이와 편안한 쿠셔닝을 겸비한 서머 샌들' },
    ],
  },

  // =========================================================================
  // 4. [남성 / 28도 이상 / 한여름 폭염] - 무신사 서머 5대 대표 스타일
  // =========================================================================
  {
    id: 'm_over28_clear_1',
    gender: 'male',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '클린 서머 린넨 & 버뮤다',
    styleDescription: '땀 흡수가 뛰어나고 시원한 린넨 셔츠와 단정한 버뮤다 반바지',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_s1_top', category: 'top', name: '오픈카라 린넨 반팔 셔츠', iconName: 'shirt-outline', description: '목선이 시원한 스카이블루 린넨 셔츠' },
      { id: 'm_s1_bottom', category: 'bottom', name: '코튼 버뮤다 팬츠', iconName: 'git-commit-outline', description: '무릎 살짝 위의 단정한 베이지 숏팬츠' },
      { id: 'm_s1_shoes', category: 'shoes', name: '우븐 슬립온', iconName: 'footsteps-outline', description: '통기성과 경량성을 갖춘 서머 슈즈' },
    ],
  },
  {
    id: 'm_over28_clear_2',
    gender: 'male',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '시티 서머 스트라이프 셔츠',
    styleDescription: '여유로운 핏의 시어서커 스트라이프 셔츠와 와이드 치노 쇼츠',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_s2_top', category: 'top', name: '시어서커 오버핏 반팔 셔츠', iconName: 'shirt-outline', description: '피부에 닿는 면적이 적어 쾌적한 요루 원단' },
      { id: 'm_s2_bottom', category: 'bottom', name: '와이드 원턱 치노 숏츠', iconName: 'git-commit-outline', description: '풍성한 실루엣의 올리브 카키 쇼츠' },
      { id: 'm_s2_shoes', category: 'shoes', name: '독일군 서머 스니커즈', iconName: 'footsteps-outline', description: '가볍고 슬림한 화이트 스웨이드 스니커즈' },
    ],
  },
  {
    id: 'm_over28_clear_3',
    gender: 'male',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'daily',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '헤비웨이트 박시티 & 유틸리티 쇼츠',
    styleDescription: '체형을 보정해주는 탄탄한 오버핏 반팔과 기능성 나일론 쇼츠의 조화',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_s3_top', category: 'top', name: '헤비웨이트 16수 코튼 티', iconName: 'shirt-outline', description: '목 늘어남 없는 탄탄한 블랙 오버핏 티' },
      { id: 'm_s3_bottom', category: 'bottom', name: '나일론 유틸리티 포켓 쇼츠', iconName: 'git-commit-outline', description: '방수 가공된 그레이 카고 반바지' },
      { id: 'm_s3_shoes', category: 'shoes', name: '테크니컬 스트랩 샌들', iconName: 'footsteps-outline', description: '쿠션감이 뛰어난 비브람솔 샌들' },
    ],
  },
  {
    id: 'm_over28_clear_4',
    gender: 'male',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '서머 카라 니트 & 린넨 트라우저',
    styleDescription: '고급스러운 피케 카라 니트와 긴 기장의 린넨 슬랙스로 연출한 단정한 룩',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_s4_top', category: 'top', name: '오픈카라 하프 슬리브 니트', iconName: 'shirt-outline', description: '통기성이 좋은 썸머 부클레 원사의 카라 니트' },
      { id: 'm_s4_bottom', category: 'bottom', name: '투턱 와이드 린넨 슬랙스', iconName: 'git-commit-outline', description: '시원하면서도 드레시한 차콜 린넨 팬츠' },
      { id: 'm_s4_shoes', category: 'shoes', name: '가죽 위빙 로퍼', iconName: 'footsteps-outline', description: '맨발에 신어도 쾌적한 위빙 레더 슈즈' },
    ],
  },
  {
    id: 'm_over28_clear_5',
    gender: 'male',
    tempBand: 'over28',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#통기성_린넨","#자외선_차단","#선글라스_추천"],
    styleTitle: '어반 아웃도어 그래픽 캐주얼',
    styleDescription: '감각적인 백프린팅 티셔츠와 이지 웨이스트 밴딩 쇼츠의 스트릿 무드',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_s5_top', category: 'top', name: '빈티지 아카이브 그래픽 티', iconName: 'shirt-outline', description: '피그먼트 워싱이 들어간 오버사이즈 티셔츠' },
      { id: 'm_s5_bottom', category: 'bottom', name: '이지 밴딩 코튼 숏츠', iconName: 'git-commit-outline', description: '허리 스트링으로 편안한 착용감의 반바지' },
      { id: 'm_s5_shoes', category: 'shoes', name: '클래식 슬립온 캔버스', iconName: 'footsteps-outline', description: '활동적인 무드의 체커보드 슬립온' },
    ],
  },

  // =========================================================================
  // 5. [여성 / 12~16도 / 간절기 & 쌀쌀한 가을] - 29CM/W컨셉 5대 대표 스타일
  // =========================================================================
  {
    id: 'f_12to16_clear_1',
    gender: 'female',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '클래식 하운드투스 블레이저',
    styleDescription: '차가운 바람을 막아주는 탄탄한 하운드투스 체크 울 자켓과 모크넥 니트',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_f1_outer', category: 'outer', name: '오버핏 하운드투스 블레이저', iconName: 'shirt-outline', description: '멋스러운 실루엣의 도톰한 울 혼방 자켓' },
      { id: 'f_f1_top', category: 'top', name: '파인게이지 모크넥 니트', iconName: 'shirt-outline', description: '목을 부드럽게 감싸는 파인 울 니트' },
      { id: 'f_f1_bottom', category: 'bottom', name: '스트레이트 딥인디고 진', iconName: 'git-commit-outline', description: '자켓과 매치하기 좋은 깔끔한 슬림 스트레이트 데님' },
      { id: 'f_f1_shoes', category: 'shoes', name: '스퀘어토 레더 앵클 부츠', iconName: 'footsteps-outline', description: '안정적인 굽의 블랙 가죽 부츠' },
    ],
  },
  {
    id: 'f_12to16_clear_2',
    gender: 'female',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '빈티지 레더 & 맥시 데님 스커트',
    styleDescription: '바이크 무드의 비건 레더 블루종과 슬릿 롱 데님 스커트의 시크 룩',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_f2_outer', category: 'outer', name: '빈티지 오버핏 레더 블루종', iconName: 'shirt-outline', description: '은은한 광택과 루즈한 핏의 가죽 자켓' },
      { id: 'f_f2_top', category: 'top', name: '슬림 소프트 립 롱슬리브', iconName: 'shirt-outline', description: '이너로 부해 보이지 않는 텐셀 골지 티' },
      { id: 'f_f2_bottom', category: 'bottom', name: '프론트 슬릿 맥시 데님 스커트', iconName: 'git-commit-outline', description: '발목까지 길게 떨어지는 트렌디 롱스커트' },
      { id: 'f_f2_shoes', category: 'shoes', name: '바이커 링클 부츠', iconName: 'footsteps-outline', description: '버클 디테일의 청키 레더 롱부츠' },
    ],
  },
  {
    id: 'f_12to16_clear_3',
    gender: 'female',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'daily',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '헤비 램스울 집업 & 와이드 슬랙스',
    styleDescription: '두툼한 골지 투웨이 집업 카디건과 핀턱 와이드 슬랙스의 포근한 데일리',
    imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_f3_outer', category: 'outer', name: '투웨이 골지 울 집업 가디건', iconName: 'shirt-outline', description: '위아래로 열리는 하이넥 램스울 스웨터' },
      { id: 'f_f3_bottom', category: 'bottom', name: '딥모카 핀턱 와이드 슬랙스', iconName: 'git-commit-outline', description: '차분한 가을 컬러감의 유려한 팬츠' },
      { id: 'f_f3_shoes', category: 'shoes', name: '스웨이드 플랫 로퍼', iconName: 'footsteps-outline', description: '따뜻한 감성의 브라운 스웨이드 신발' },
    ],
  },
  {
    id: 'f_12to16_clear_4',
    gender: 'female',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '스웨이드 크롭 바시티 & 치노',
    styleDescription: '클래식한 카멜 스웨이드 점퍼와 크림 와이드 코튼 팬츠의 웜 톤온톤',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_f4_outer', category: 'outer', name: '카멜 스웨이드 바시티 자켓', iconName: 'shirt-outline', description: '부드러운 스웨이드 터치감의 숏 블루종' },
      { id: 'f_f4_top', category: 'top', name: '울 블렌드 크루넥 니트', iconName: 'shirt-outline', description: '도톰하고 깔끔한 아이보리 스웨터' },
      { id: 'f_f4_bottom', category: 'bottom', name: '크림 핀턱 와이드 치노', iconName: 'git-commit-outline', description: '탄탄한 고밀도 코튼 팬츠' },
      { id: 'f_f4_shoes', category: 'shoes', name: '클래식 레더 스니커즈', iconName: 'footsteps-outline', description: '어디에나 매치하기 좋은 베이지 배색 단화' },
    ],
  },
  {
    id: 'f_12to16_clear_5',
    gender: 'female',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '다이아 퀼팅 자켓 & 코듀로이 룩',
    styleDescription: '가벼운 패딩 충전재의 다이아 퀼팅 자켓과 따뜻한 골덴 팬츠',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_f5_outer', category: 'outer', name: '라이트 다이아 퀼팅 자켓', iconName: 'shirt-outline', description: '코듀로이 카라 배색의 경량 퀼팅 아우터' },
      { id: 'f_f5_bottom', category: 'bottom', name: '와이드 코듀로이 팬츠', iconName: 'git-commit-outline', description: '포근한 골지 텍스처의 스트레이트 팬츠' },
      { id: 'f_f5_shoes', category: 'shoes', name: '청키 레더 더비슈즈', iconName: 'footsteps-outline', description: '도톰한 아웃솔의 가죽 로우 슈즈' },
    ],
  },

  // =========================================================================
  // 6. [남성 / 12~16도 / 간절기 & 쌀쌀한 가을] - 무신사 5대 대표 스타일
  // =========================================================================
  {
    id: 'm_12to16_clear_1',
    gender: 'male',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '모던 워크웨어 필드 자켓',
    styleDescription: '간절기 든든하고 활동적인 카키 야상 자켓과 와플 니트 레이어드',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_f1_outer', category: 'outer', name: '워시드 M-65 필드 자켓', iconName: 'shirt-outline', description: '포켓 디테일이 돋보이는 오버핏 카키 야상' },
      { id: 'm_f1_top', category: 'top', name: '헤비 와플 크루넥 니트', iconName: 'shirt-outline', description: '보온성 높고 탄탄한 조직감의 스웨터' },
      { id: 'm_f1_bottom', category: 'bottom', name: '슬림 테이퍼드 치노', iconName: 'git-commit-outline', description: '깔끔한 실루엣의 차콜 팬츠' },
      { id: 'm_f1_shoes', category: 'shoes', name: '코만도솔 레더 더비슈즈', iconName: 'footsteps-outline', description: '클래식한 가죽 더비슈즈' },
    ],
  },
  {
    id: 'm_12to16_clear_2',
    gender: 'male',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'office',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '클래식 해링턴 블루종 & 셀비지',
    styleDescription: '단정한 스탠드 카라 해링턴 자켓과 롤업 생지 데님의 클래식 캐주얼',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_f2_outer', category: 'outer', name: '해링턴 코튼 블루종 자켓', iconName: 'shirt-outline', description: '타탄 체크 안감이 매력적인 네이비 자켓' },
      { id: 'm_f2_top', category: 'top', name: '옥스포드 버튼다운 셔츠', iconName: 'shirt-outline', description: '클래식한 화이트 옥스포드 셔츠' },
      { id: 'm_f2_bottom', category: 'bottom', name: '스트레이트 셀비지 데님', iconName: 'git-commit-outline', description: '단단한 원단의 딥인디고 롤업 진' },
      { id: 'm_f2_shoes', category: 'shoes', name: '스웨이드 왈라비 부츠', iconName: 'footsteps-outline', description: '모카신 형태의 편안한 스웨이드 슈즈' },
    ],
  },
  {
    id: 'm_12to16_clear_3',
    gender: 'male',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'daily',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '헤링본 울 트위드 자켓 & 터틀넥',
    styleDescription: '세련된 헤링본 패턴 블레이저와 블랙 모크넥으로 완성한 댄디 룩',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_f3_outer', category: 'outer', name: '헤링본 울 트위드 자켓', iconName: 'shirt-outline', description: '도톰하고 클래식한 그레이 헤링본 블레이저' },
      { id: 'm_f3_top', category: 'top', name: '메리노 울 모크넥 니트', iconName: 'shirt-outline', description: '부드러운 감촉의 슬림 블랙 니트' },
      { id: 'm_f3_bottom', category: 'bottom', name: '원턱 세미와이드 슬랙스', iconName: 'git-commit-outline', description: '깔끔하게 떨어지는 다크차콜 팬츠' },
      { id: 'm_f3_shoes', category: 'shoes', name: '클래식 페니 로퍼', iconName: 'footsteps-outline', description: '은은한 광택의 블랙 가죽 로퍼' },
    ],
  },
  {
    id: 'm_12to16_clear_4',
    gender: 'male',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '오버핏 모헤어 니트 & 와이드 카고',
    styleDescription: '브러쉬드 모헤어 니트와 블랙 와이드 카고 슬랙스의 트렌디 스트릿',
    imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_f4_top', category: 'top', name: '헤어리 브러쉬드 모헤어 니트', iconName: 'shirt-outline', description: '풍성한 볼륨감의 올리브 그린 라운드 스웨터' },
      { id: 'm_f4_bottom', category: 'bottom', name: '투포켓 와이드 카고 슬랙스', iconName: 'git-commit-outline', description: '포멀함과 스트릿 무드가 공존하는 팬츠' },
      { id: 'm_f4_shoes', category: 'shoes', name: '스퀘어토 더비 슈즈', iconName: 'footsteps-outline', description: '트렌디한 앞코 라인의 가죽 슈즈' },
    ],
  },
  {
    id: 'm_12to16_clear_5',
    gender: 'male',
    tempBand: '12to16',
    weatherState: 'Clear',
    tpo: 'street',
    weatherDefenseTags: ["#일교차_아우터","#아침저녁_쌀쌀","#단정한_가을룩"],
    styleTitle: '덕 캔버스 카펜터 자켓 캐주얼',
    styleDescription: '탄탄한 덕 캔버스 워크자켓과 그레이 후디를 매치한 시티 캐주얼',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_f5_outer', category: 'outer', name: '덕 캔버스 코듀로이 카라 자켓', iconName: 'shirt-outline', description: '내구성이 뛰어난 브라운 워크웨어 자켓' },
      { id: 'm_f5_top', category: 'top', name: '헤비웨이트 기모 후드티', iconName: 'shirt-outline', description: '모각이 잘 잡히는 도톰한 그레이 후디' },
      { id: 'm_f5_bottom', category: 'bottom', name: '루즈핏 워시드 블랙 진', iconName: 'git-commit-outline', description: '자연스러운 캣워싱의 데님 팬츠' },
      { id: 'm_f5_shoes', category: 'shoes', name: '레트로 캔버스 하이탑', iconName: 'footsteps-outline', description: '빈티지 아이보리 컬러의 스니커즈' },
    ],
  },

  // =========================================================================
  // 7. [여성 / 4도 이하 / 한겨울 한파 & 강설] - 29CM/W컨셉 5대 윈터 스타일
  // =========================================================================
  {
    id: 'f_under4_snow_1',
    gender: 'female',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'office',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '윈터 웜 구스다운 & 코듀로이',
    styleDescription: '눈 오는 한겨울 바람을 막아주는 프리미엄 롱 구스다운과 골덴 팬츠',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_w1_outer', category: 'outer', name: '프리미엄 롱 구스다운 패딩', iconName: 'shirt-outline', description: '풍성한 볼륨과 완벽 방한 방풍 롱패딩' },
      { id: 'f_w1_top', category: 'top', name: '캐시미어 블렌드 터틀넥', iconName: 'shirt-outline', description: '목까지 따뜻하게 감싸주는 소프트 니트' },
      { id: 'f_w1_bottom', category: 'bottom', name: '기모 안감 코듀로이 팬츠', iconName: 'git-commit-outline', description: '보온성과 빈티지 무드의 아이보리 골덴 바지' },
      { id: 'f_w1_shoes', category: 'shoes', name: '양털 안감 웜 퍼 부츠', iconName: 'footsteps-outline', description: '발끝까지 포근하고 미끄럼 방지되는 부츠' },
    ],
  },
  {
    id: 'f_under4_snow_2',
    gender: 'female',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'office',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '오버사이즈 시어링 롱무스탕',
    styleDescription: '풍성한 양털 시어링 안감의 롱 무스탕 코트와 부츠컷 팬츠의 글램 룩',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_w2_outer', category: 'outer', name: '에코 시어링 롱 무스탕 코트', iconName: 'shirt-outline', description: '강력한 보온성과 럭셔리한 실루엣의 아우터' },
      { id: 'f_w2_top', category: 'top', name: '골지 하이넥 스웨터', iconName: 'shirt-outline', description: '체온을 가둬주는 탄탄한 터틀넥' },
      { id: 'f_w2_bottom', category: 'bottom', name: '기모 슬릿 부츠컷 슬랙스', iconName: 'git-commit-outline', description: '다리 라인을 길고 슬림하게 잡아주는 팬츠' },
      { id: 'f_w2_shoes', category: 'shoes', name: '청키 솔 가죽 앵클부츠', iconName: 'footsteps-outline', description: '빙판길에도 안정적인 그립력의 워커' },
    ],
  },
  {
    id: 'f_under4_snow_3',
    gender: 'female',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'daily',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '글로시 숏 푸퍼 & 후드 셋업',
    styleDescription: '트렌디한 유광 크롭 다운 자켓과 기모 조거팬츠의 영앤트렌디 룩',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_w3_outer', category: 'outer', name: '글로시 크롭 숏 푸퍼 패딩', iconName: 'shirt-outline', description: '은은한 광택감의 트렌디 하이넥 다운 점퍼' },
      { id: 'f_w3_top', category: 'top', name: '헤비 기모 오버핏 후드티', iconName: 'shirt-outline', description: '따뜻하고 편안한 오트밀 기모 스웨트셔츠' },
      { id: 'f_w3_bottom', category: 'bottom', name: '셋업 기모 와이드 스웨트팬츠', iconName: 'git-commit-outline', description: '밑단 스트링 조절이 가능한 조거 팬츠' },
      { id: 'f_w3_shoes', category: 'shoes', name: '패딩 스노우 부츠', iconName: 'footsteps-outline', description: '가볍고 방한 효과가 뛰어난 숏 패딩 부츠' },
    ],
  },
  {
    id: 'f_under4_snow_4',
    gender: 'female',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'street',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '캐시미어 더블 롱코트 & 머플러',
    styleDescription: '우아한 카멜 캐시미어 코트에 풍성한 울 머플러를 두른 올드머니 윈터',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_w4_outer', category: 'outer', name: '핸드메이드 캐시미어 더블 코트', iconName: 'shirt-outline', description: '발목까지 감싸는 프리미엄 카멜 롱코트' },
      { id: 'f_w4_top', category: 'top', name: '파인 메리노울 터틀넥', iconName: 'shirt-outline', description: '부드럽고 얇지만 보온성이 우수한 니트' },
      { id: 'f_w4_bottom', category: 'bottom', name: '투턱 울 트라우저', iconName: 'git-commit-outline', description: '코트와 완벽하게 어우러지는 모카 슬랙스' },
      { id: 'f_w4_acc', category: 'accessory', name: '헤비 프린지 캐시미어 머플러', iconName: 'happy-outline', description: '목 전체를 포근하게 감싸는 대형 머플러' },
      { id: 'f_w4_shoes', category: 'shoes', name: '클래식 레더 롱부츠', iconName: 'footsteps-outline', description: '무릎 아래까지 감싸는 가죽 라이딩 부츠' },
    ],
  },
  {
    id: 'f_under4_snow_5',
    gender: 'female',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'street',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '테크니컬 다운 아노락 & 웜 조거',
    styleDescription: '영하의 눈보라 속에서도 완벽한 방풍 발수 아노락 패딩 스타일',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_w5_outer', category: 'outer', name: '발수 코팅 하프집 다운 아노락', iconName: 'shirt-outline', description: '눈이 스며들지 않는 테크니컬 충전재 아우터' },
      { id: 'f_w5_bottom', category: 'bottom', name: '플리스 본딩 나일론 조거', iconName: 'git-commit-outline', description: '안감 전체가 기모 플리스로 제작된 방한 바지' },
      { id: 'f_w5_shoes', category: 'shoes', name: '고어텍스 윈터 트레킹화', iconName: 'footsteps-outline', description: '눈길 미끄럼 방지 특수 비브람 솔 장착' },
    ],
  },

  // =========================================================================
  // 8. [남성 / 4도 이하 / 한겨울 한파 & 강설] - 무신사 5대 윈터 스타일
  // =========================================================================
  {
    id: 'm_under4_snow_1',
    gender: 'male',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'office',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '헤비 윈터 다운 파카',
    styleDescription: '영하의 추위와 눈보라에도 끄떡없는 헤비 덕다운 파카와 기모 카고',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_w1_outer', category: 'outer', name: '헤비 덕다운 익스페디션 파카', iconName: 'shirt-outline', description: '발수 코팅과 극강의 보온성을 갖춘 대장급 패딩' },
      { id: 'm_w1_top', category: 'top', name: '플리스 안감 헤비 후드티', iconName: 'shirt-outline', description: '레이어드하기 좋은 탄탄한 후디' },
      { id: 'm_w1_bottom', category: 'bottom', name: '본딩 기모 조거 카고팬츠', iconName: 'git-commit-outline', description: '방풍 안감이 들어간 기능성 카고' },
      { id: 'm_w1_shoes', category: 'shoes', name: '방수 트레킹 부츠', iconName: 'footsteps-outline', description: '미끄럼 방지 러버솔 방한화' },
    ],
  },
  {
    id: 'm_under4_snow_2',
    gender: 'male',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'office',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '클래식 발마칸 울 롱코트',
    styleDescription: '두툼한 이중지 울 원사의 싱글 래글런 발마칸 코트와 캐시미어 니트',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_w2_outer', category: 'outer', name: '헤비 울 래글런 발마칸 코트', iconName: 'shirt-outline', description: '바람을 막아주는 카라 비조 디테일의 롱코트' },
      { id: 'm_w2_top', category: 'top', name: '케이블 조직 캐시미어 니트', iconName: 'shirt-outline', description: '도톰하고 고급스러운 아이보리 스웨터' },
      { id: 'm_w2_bottom', category: 'bottom', name: '원턱 울 플란넬 슬랙스', iconName: 'git-commit-outline', description: '따뜻한 모직 소재의 와이드 팬츠' },
      { id: 'm_w2_shoes', category: 'shoes', name: '소가죽 첼시 부츠', iconName: 'footsteps-outline', description: '날렵하고 클래식한 블랙 앵클 슈즈' },
    ],
  },
  {
    id: 'm_under4_snow_3',
    gender: 'male',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'daily',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '밀리터리 몬스터 다운 파카',
    styleDescription: '레벨7 몬스터 파카 기반 오버핏 다운과 스웨트 셋업의 어반 밀리터리',
    imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_w3_outer', category: 'outer', name: '밀리터리 레벨7 몬스터 파카', iconName: 'shirt-outline', description: '초경량 고보온 프리마로프트 충전 패딩' },
      { id: 'm_w3_top', category: 'top', name: '기모 하프집업 스웨트셔츠', iconName: 'shirt-outline', description: '넥라인 보온성이 뛰어난 이너 탑' },
      { id: 'm_w3_bottom', category: 'bottom', name: '헤비 기모 스웨트 조거팬츠', iconName: 'git-commit-outline', description: '밑단 밴딩으로 찬바람을 차단하는 바지' },
      { id: 'm_w3_shoes', category: 'shoes', name: '아웃도어 트레일 스니커즈', iconName: 'footsteps-outline', description: '겨울철 안전한 접지력의 테크 신발' },
    ],
  },
  {
    id: 'm_under4_snow_4',
    gender: 'male',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'street',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '빈티지 레더 무스탕 자켓',
    styleDescription: '두터운 양털 카라의 브라운 레더 무스탕과 묵직한 생지 데님 룩',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_w4_outer', category: 'outer', name: 'B-3 양털 무스탕 자켓', iconName: 'shirt-outline', description: '천연 양털 칼라와 빈티지 가죽의 헤비 아우터' },
      { id: 'm_w4_top', category: 'top', name: '헤비 터틀넥 울 스웨터', iconName: 'shirt-outline', description: '목을 감싸는 굵은 게이지의 니트' },
      { id: 'm_w4_bottom', category: 'bottom', name: '와이드 셀비지 진', iconName: 'git-commit-outline', description: '바람이 통하지 않는 고온스 데님 팬츠' },
      { id: 'm_w4_shoes', category: 'shoes', name: '레더 워커 부츠', iconName: 'footsteps-outline', description: '남성미를 강조하는 코만도솔 가죽 워커' },
    ],
  },
  {
    id: 'm_under4_snow_5',
    gender: 'male',
    tempBand: 'under4',
    weatherState: 'Snow',
    tpo: 'street',
    weatherDefenseTags: ["#한파대비_패딩","#목도리_필수","#빙판길_주의"],
    styleTitle: '미니멀 숏 푸퍼 & 골덴 팬츠',
    styleDescription: '군더더기 없는 블랙 유광 숏패딩과 브라운 코듀로이 턱팬츠의 캐주얼',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_w5_outer', category: 'outer', name: '미니멀 스탠드카라 숏패딩', iconName: 'shirt-outline', description: '밑단 스트링으로 핏을 조절하는 숏 다운' },
      { id: 'm_w5_top', category: 'top', name: '캐시미어 블렌드 라운드 니트', iconName: 'shirt-outline', description: '단정하고 따뜻한 크림톤 니트' },
      { id: 'm_w5_bottom', category: 'bottom', name: '투턱 코듀로이 와이드 팬츠', iconName: 'git-commit-outline', description: '따뜻한 계절감을 주는 골덴 팬츠' },
      { id: 'm_w5_shoes', category: 'shoes', name: '스웨이드 윈터 스니커즈', iconName: 'footsteps-outline', description: '도톰한 폼 인솔이 들어간 방한 스니커즈' },
    ],
  },

  // =========================================================================
  // 9. [여성 / 비 오는 날 / Rain] - 29CM/W컨셉 5대 레인 룩북
  // =========================================================================
  {
    id: 'f_rain_1',
    gender: 'female',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'office',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '레인 프로텍션 윈드브레이커',
    styleDescription: '빗방울을 튕겨내는 발수 윈드브레이커와 감각적인 첼시 레인부츠',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_r1_outer', category: 'outer', name: '방수 레인 윈드브레이커', iconName: 'umbrella-outline', description: '비바람을 완벽 차단하는 발수 자켓' },
      { id: 'f_r1_top', category: 'top', name: '베이직 코튼 롱슬리브', iconName: 'shirt-outline', description: '단독으로도 깔끔한 라운드넥 긴팔' },
      { id: 'f_r1_bottom', category: 'bottom', name: '크롭 테이퍼드 슬랙스', iconName: 'git-commit-outline', description: '비에 젖지 않도록 기장감이 깔끔한 바지' },
      { id: 'f_r1_shoes', category: 'shoes', name: '첼시 고무 레인부츠', iconName: 'footsteps-outline', description: '빗길에도 끄떡없는 매트 레더 느낌의 부츠' },
    ],
  },
  {
    id: 'f_rain_2',
    gender: 'female',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'office',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '방수 코팅 싱글 레인 트렌치',
    styleDescription: '테플론 발수 가공된 싱글 트렌치코트와 크롭 데님의 프렌치 레인 룩',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_r2_outer', category: 'outer', name: '발수 코팅 싱글 맥 트렌치', iconName: 'umbrella-outline', description: '빗물이 또르르 흘러내리는 경량 트렌치' },
      { id: 'f_r2_top', category: 'top', name: '보트넥 스트라이프 탑', iconName: 'shirt-outline', description: '경쾌한 무드의 네이비 마린 티' },
      { id: 'f_r2_bottom', category: 'bottom', name: '앵클 컷팅 롤업 데님', iconName: 'git-commit-outline', description: '발목 위로 올라오는 산뜻한 기장의 진' },
      { id: 'f_r2_shoes', category: 'shoes', name: '미들 기장 레인부츠', iconName: 'footsteps-outline', description: '비 오는 날 물웅덩이도 걱정 없는 부츠' },
    ],
  },
  {
    id: 'f_rain_3',
    gender: 'female',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'daily',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '오버핏 하프집 아노락 & 쇼츠',
    styleDescription: '스포티한 방풍 나일론 아노락과 퀵드라이 쇼츠, 롱 레인부츠의 믹스매치',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_r3_outer', category: 'outer', name: '나일론 투웨이 레인 아노락', iconName: 'umbrella-outline', description: '가볍고 습기를 빠르게 방출하는 기능성 아우터' },
      { id: 'f_r3_bottom', category: 'bottom', name: '퀵드라이 발수 나일론 숏츠', iconName: 'git-commit-outline', description: '물이 튀어도 바로 마르는 이지 쇼츠' },
      { id: 'f_r3_shoes', category: 'shoes', name: '니하이 클래식 레인부츠', iconName: 'footsteps-outline', description: '종아리까지 완벽 보호하는 롱 레인부츠' },
    ],
  },
  {
    id: 'f_rain_4',
    gender: 'female',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'street',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '후디드 롱 레인파카 & 조거',
    styleDescription: '무릎까지 덮어주는 방수 후드 파카와 조거팬츠로 완성한 편안한 출근룩',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_r4_outer', category: 'outer', name: '드로스트링 롱 레인파카', iconName: 'umbrella-outline', description: '허리 스트링으로 실루엣을 조절하는 올리브 파카' },
      { id: 'f_r4_top', category: 'top', name: '수피마 라운드 반팔티', iconName: 'shirt-outline', description: '통기성이 좋은 이너 반팔' },
      { id: 'f_r4_bottom', category: 'bottom', name: '나일론 테이퍼드 조거팬츠', iconName: 'git-commit-outline', description: '발목 밴딩으로 물 튐을 방지하는 팬츠' },
      { id: 'f_r4_shoes', category: 'shoes', name: '방수 레더 슬립온', iconName: 'footsteps-outline', description: '신고 벗기 편한 생활 방수 슈즈' },
    ],
  },
  {
    id: 'f_rain_5',
    gender: 'female',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'street',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '테크니컬 고프코어 쉘 & 파라슈트',
    styleDescription: '투습 방수 3레이어 쉘 자켓과 나일론 파라슈트 팬츠의 어반 테크웨어',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'f_r5_outer', category: 'outer', name: '3레이어 고어쉘 후드자켓', iconName: 'umbrella-outline', description: '폭우에도 끄떡없는 고기능성 하드쉘' },
      { id: 'f_r5_bottom', category: 'bottom', name: '와이드 파라슈트 발수팬츠', iconName: 'git-commit-outline', description: '밑단 조절 가능한 트렌디 나일론 팬츠' },
      { id: 'f_r5_shoes', category: 'shoes', name: '고어텍스 트레일 러닝화', iconName: 'footsteps-outline', description: '비 오는 날 최고의 그립력을 선사하는 신발' },
    ],
  },

  // =========================================================================
  // 10. [남성 / 비 오는 날 / Rain] - 무신사 5대 레인 룩북
  // =========================================================================
  {
    id: 'm_rain_1',
    gender: 'male',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'office',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '어반 고어텍스 쉘자켓 코디',
    styleDescription: '우천 시 쾌적한 출퇴근을 위한 투습 방수 하이엔드 쉘자켓과 발수 조거',
    imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_r1_outer', category: 'outer', name: '고어텍스 후드 쉘자켓', iconName: 'umbrella-outline', description: '투습 방수 기능의 하이엔드 블랙 쉘자켓' },
      { id: 'm_r1_top', category: 'top', name: '퀵드라이 스웨트셔츠', iconName: 'shirt-outline', description: '빠르게 마르는 기능성 맨투맨' },
      { id: 'm_r1_bottom', category: 'bottom', name: '발수 나일론 조거팬츠', iconName: 'git-commit-outline', description: '오염에 강한 신축성 발수 팬츠' },
      { id: 'm_r1_shoes', category: 'shoes', name: '방수 고어텍스 스니커즈', iconName: 'footsteps-outline', description: '물웅덩이도 안심인 방수 러닝화' },
    ],
  },
  {
    id: 'm_rain_2',
    gender: 'male',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'office',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '비즈니스 발수 싱글 맥코트',
    styleDescription: '비에 젖지 않는 방수 코팅 원사의 네이비 맥코트와 옥스포드 셔츠 룩',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_r2_outer', category: 'outer', name: '워터프루프 싱글 맥코트', iconName: 'umbrella-outline', description: '단정하고 포멀한 비즈니스 겸용 레인코트' },
      { id: 'm_r2_top', category: 'top', name: '링클프리 드레스 셔츠', iconName: 'shirt-outline', description: '습한 날씨에도 구김이 덜한 클래식 셔츠' },
      { id: 'm_r2_bottom', category: 'bottom', name: '크롭 테이퍼드 슬랙스', iconName: 'git-commit-outline', description: '기장감이 짧아 빗물 튐이 방지되는 바지' },
      { id: 'm_r2_shoes', category: 'shoes', name: '러버솔 방수 더비슈즈', iconName: 'footsteps-outline', description: '물기가 스며들지 않는 특수 고무창 가죽 구두' },
    ],
  },
  {
    id: 'm_rain_3',
    gender: 'male',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'daily',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '테크 아노락 & 유틸리티 쇼츠',
    styleDescription: '하프집업 발수 아노락과 무릎 위 숏팬츠, 워터프루프 부츠의 쿨 캐주얼',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_r3_outer', category: 'outer', name: '유틸리티 나일론 레인 아노락', iconName: 'umbrella-outline', description: '대형 캥거루 포켓이 달린 발수 자켓' },
      { id: 'm_r3_bottom', category: 'bottom', name: '나일론 이지 쇼츠', iconName: 'git-commit-outline', description: '비 오는 날 활동성이 극대화되는 숏팬츠' },
      { id: 'm_r3_shoes', category: 'shoes', name: '러버 첼시 레인부츠', iconName: 'footsteps-outline', description: '깔끔한 숏 기장의 남성용 레인부츠' },
    ],
  },
  {
    id: 'm_rain_4',
    gender: 'male',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'street',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '후디드 윈드쉘 & 와이드 치노',
    styleDescription: '가볍게 걸치기 좋은 라이트 윈드쉘과 롤업 와이드 팬츠의 시티 데일리',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_r4_outer', category: 'outer', name: '초경량 팩커블 윈드쉘', iconName: 'umbrella-outline', description: '갑작스러운 소나기에도 꺼내입기 좋은 자켓' },
      { id: 'm_r4_top', category: 'top', name: '코튼 롱슬리브 크루넥', iconName: 'shirt-outline', description: '부드러운 촉감의 기본 긴팔 티셔츠' },
      { id: 'm_r4_bottom', category: 'bottom', name: '원턱 롤업 와이드 치노', iconName: 'git-commit-outline', description: '발목을 살짝 접어 올려 입는 캐주얼 팬츠' },
      { id: 'm_r4_shoes', category: 'shoes', name: '비브람 솔 레인 스니커즈', iconName: 'footsteps-outline', description: '미끄러운 대리석과 아스팔트에서 안전한 신발' },
    ],
  },
  {
    id: 'm_rain_5',
    gender: 'male',
    tempBand: '17to19',
    weatherState: 'Rain',
    tpo: 'street',
    weatherDefenseTags: ["#우산_필수","#밝은바지_금지","#방수_레인부츠"],
    styleTitle: '셔츠형 레인 자켓 & 테크 팬츠',
    styleDescription: '스냅 버튼의 오버핏 셔켓과 발수 카고 팬츠로 연출한 모던 테크 룩',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1080&q=85',
    imageSource: 'preset',
    items: [
      { id: 'm_r5_outer', category: 'outer', name: '발수 코팅 스냅 셔켓', iconName: 'umbrella-outline', description: '자켓처럼 단정한 셔츠형 레인 아우터' },
      { id: 'm_r5_top', category: 'top', name: '쿨맥스 에센셜 반팔티', iconName: 'shirt-outline', description: '습기를 빠르게 날려주는 기능성 티' },
      { id: 'm_r5_bottom', category: 'bottom', name: '스트링 발수 카고 슬랙스', iconName: 'git-commit-outline', description: '포켓 디테일과 발수 기능이 들어간 팬츠' },
      { id: 'm_r5_shoes', category: 'shoes', name: '블랙 캔버스 러버 스니커즈', iconName: 'footsteps-outline', description: '고무 토캡으로 앞코가 젖지 않는 신발' },
    ],
  },
];

/**
 * 주어진 날씨/기온대/성별/TPO에 가장 적합한 룩북 목록을 찾아 반환
 */
export function findMatchingLookbooks(
  gender: 'female' | 'male' | 'all',
  tempBand: string,
  weatherState: string,
  tpo?: 'office' | 'daily' | 'street'
): OutfitLookbook[] {
  // 1. 성별 풀 필터 (all이면 남/여 모두 포함)
  let pool = gender === 'all'
    ? PRESET_LOOKBOOKS
    : PRESET_LOOKBOOKS.filter((b) => b.gender === gender);

  // 2. 비 또는 눈 올 때 우선 매칭
  if (weatherState === 'Rain' || weatherState === 'Snow') {
    const weatherPool = pool.filter((b) => b.weatherState === weatherState);
    if (weatherPool.length > 0) {
      if (tpo) {
        const tpoMatches = weatherPool.filter((b) => b.tpo === tpo);
        if (tpoMatches.length > 0) return tpoMatches;
      }
      return weatherPool;
    }
  }

  // 3. 기온대 일치 필터
  const bandPool = pool.filter((b) => b.tempBand === tempBand);
  if (bandPool.length > 0) {
    if (tpo) {
      const tpoMatches = bandPool.filter((b) => b.tpo === tpo);
      if (tpoMatches.length > 0) return tpoMatches;
    }
    return bandPool;
  }

  // 4. 인접 기온대 매칭
  let targetBand = '20to22';
  if (tempBand === 'over28' || tempBand === '23to27') targetBand = 'over28';
  else if (tempBand === '20to22' || tempBand === '17to19') targetBand = '20to22';
  else if (tempBand === '12to16' || tempBand === '9to11') targetBand = '12to16';
  else if (tempBand === '5to8' || tempBand === 'under4') targetBand = 'under4';

  const neighborPool = pool.filter((b) => b.tempBand === targetBand);
  if (neighborPool.length > 0) {
    if (tpo) {
      const tpoMatches = neighborPool.filter((b) => b.tpo === tpo);
      if (tpoMatches.length > 0) return tpoMatches;
    }
    return neighborPool;
  }

  // 5. TPO 일치 룩북
  if (tpo) {
    const tpoMatches = pool.filter((b) => b.tpo === tpo);
    if (tpoMatches.length > 0) return tpoMatches;
  }

  return pool.length > 0 ? pool : PRESET_LOOKBOOKS.slice(0, 5);
}
