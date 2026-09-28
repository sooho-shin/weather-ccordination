import { TemperatureBandId, TemperatureBandInfo } from '../types/weather';

export const TEMPERATURE_BANDS: Record<TemperatureBandId, TemperatureBandInfo> = {
  over28: {
    id: 'over28',
    minTemp: 28,
    maxTemp: 100,
    label: '28°C 이상',
    summary: '민소매, 반팔, 숏팬츠, 린넨',
    recommendedKeywords: ['린넨 셔츠', '슬리브리스', '숏팬츠', '린넨 팬츠', '스트랩 샌들', '선글라스'],
  },
  '23to27': {
    id: '23to27',
    minTemp: 23,
    maxTemp: 27.9,
    label: '23°C ~ 27°C',
    summary: '반팔, 얇은 셔츠, 면바지',
    recommendedKeywords: ['반팔 티셔츠', '오픈카라 셔츠', '면 치노팬츠', '버뮤다 팬츠', '스니커즈'],
  },
  '20to22': {
    id: '20to22',
    minTemp: 20,
    maxTemp: 22.9,
    label: '20°C ~ 22°C',
    summary: '긴팔 티셔츠, 얇은 가디건, 슬랙스',
    recommendedKeywords: ['린넨 셔츠', '가벼운 트렌치코트', '와이드 데님 팬츠', '클래식 로퍼', '얇은 가디건'],
  },
  '17to19': {
    id: '17to19',
    minTemp: 17,
    maxTemp: 19.9,
    label: '17°C ~ 19°C',
    summary: '얇은 니트, 맨투맨, 가디건, 바람막이',
    recommendedKeywords: ['오버핏 맨투맨', '라이트 니트', '슬랙스', '데님 자켓', '캐주얼 스니커즈'],
  },
  '12to16': {
    id: '12to16',
    minTemp: 12,
    maxTemp: 16.9,
    label: '12°C ~ 16°C',
    summary: '자켓, 가디건, 야상, 청자켓, 슬랙스',
    recommendedKeywords: ['테일러드 자켓', '니트 베스트', '스트레이트 진', '더비 슈즈', '블레이저'],
  },
  '9to11': {
    id: '9to11',
    minTemp: 9,
    maxTemp: 11.9,
    label: '9°C ~ 11°C',
    summary: '트렌치코트, 야상, 점퍼, 기모바지',
    recommendedKeywords: ['클래식 트렌치코트', '터틀넥 니트', '기모 슬랙스', '첼시 부츠', '야상 점퍼'],
  },
  '5to8': {
    id: '5to8',
    minTemp: 5,
    maxTemp: 8.9,
    label: '5°C ~ 8°C',
    summary: '울 코트, 가죽 자켓, 히트텍',
    recommendedKeywords: ['싱글 울 코트', '헤비 캐시미어 니트', '울 슬랙스', '가죽 앵클 부츠', '가죽 자켓'],
  },
  under4: {
    id: 'under4',
    minTemp: -100,
    maxTemp: 4.9,
    label: '4°C 이하',
    summary: '패딩, 두꺼운 코트, 목도리, 장갑',
    recommendedKeywords: ['롱 구스다운 패딩', '헤비 터틀넥 니트', '코듀로이 팬츠', '머플러', '방한 부츠'],
  },
};

export function getTemperatureBand(temperature: number): TemperatureBandInfo {
  if (temperature >= 28) return TEMPERATURE_BANDS.over28;
  if (temperature >= 23) return TEMPERATURE_BANDS['23to27'];
  if (temperature >= 20) return TEMPERATURE_BANDS['20to22'];
  if (temperature >= 17) return TEMPERATURE_BANDS['17to19'];
  if (temperature >= 12) return TEMPERATURE_BANDS['12to16'];
  if (temperature >= 9) return TEMPERATURE_BANDS['9to11'];
  if (temperature >= 5) return TEMPERATURE_BANDS['5to8'];
  return TEMPERATURE_BANDS.under4;
}
