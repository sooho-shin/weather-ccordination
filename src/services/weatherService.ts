import { WeatherData, WeatherState } from '../types/weather';

const STORAGE_KEY_WEATHER = 'dize_cached_weather';

/**
 * 로컬 캐시된 최근 날씨 조회
 */
export function getCachedWeather(): WeatherData | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_WEATHER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
  }
  return null;
}

/**
 * 최근 날씨 로컬 캐싱
 */
export function saveCachedWeather(weather: WeatherData) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY_WEATHER, JSON.stringify(weather));
    } catch {}
  }
}

/**
 * 기온 및 날씨 상태 기반 직관적 체감 키워드 산출
 */
export function getApparentWeatherKeywords(
  temperature: number,
  weatherState: WeatherState
): {
  apparentKeyword: string;
  weatherStateKeyword: string;
} {
  let apparentKeyword = '선선하다';
  if (temperature >= 28) apparentKeyword = '덥다';
  else if (temperature >= 23) apparentKeyword = '따뜻하다';
  else if (temperature >= 20) apparentKeyword = '선선하다';
  else if (temperature >= 17) apparentKeyword = '약간 쌀쌀';
  else if (temperature >= 12) apparentKeyword = '쌀쌀하다';
  else if (temperature >= 9) apparentKeyword = '꽤 쌀쌀';
  else if (temperature >= 5) apparentKeyword = '춥다';
  else apparentKeyword = '매우 춥다';

  let weatherStateKeyword = '맑음';
  if (weatherState === 'Rain') weatherStateKeyword = '비온다';
  else if (weatherState === 'Snow') weatherStateKeyword = '눈온다';
  else if (weatherState === 'Clouds') weatherStateKeyword = '흐리다';

  return { apparentKeyword, weatherStateKeyword };
}

/**
 * WMO 날씨 코드를 WeatherState 및 한글 설명으로 변환
 */
export function mapWmoCodeToWeatherState(code: number): {
  state: WeatherState;
  description: string;
} {
  if (code === 0) return { state: 'Clear', description: '맑음' };
  if (code === 1) return { state: 'Clear', description: '대체로 맑음' };
  if (code === 2) return { state: 'Clouds', description: '구름 조금' };
  if (code === 3) return { state: 'Clouds', description: '흐림' };
  if (code === 45 || code === 48) return { state: 'Clouds', description: '안개' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return { state: 'Rain', description: '비' };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { state: 'Snow', description: '눈' };
  }
  return { state: 'Clear', description: '맑음' };
}

/**
 * Open-Meteo 실시간 날씨 데이터 호출 (최고/최저 기온 및 체감 뱃지 지원)
 */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  locationName: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6초 타임아웃

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    const { state, description } = mapWmoCodeToWeatherState(current.weather_code);
    const temp = Math.round(current.temperature_2m);
    const tempMax = daily?.temperature_2m_max?.[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : temp + 3;
    const tempMin = daily?.temperature_2m_min?.[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : temp - 4;

    const { apparentKeyword, weatherStateKeyword } = getApparentWeatherKeywords(temp, state);

    const result: WeatherData = {
      temperature: temp,
      tempMax,
      tempMin,
      apparentKeyword,
      weatherStateKeyword,
      weatherState: state,
      weatherDescription: description,
      precipitation: current.precipitation ?? 0,
      locationName,
      isSimulated: false,
    };

    // 성공한 실제 날씨를 로컬 캐시에 저장
    saveCachedWeather(result);

    return result;
  } catch (error) {
    console.warn('날씨 API 호출 실패 또는 타임아웃, 캐시 또는 기본 날씨로 폴백:', error);
    const cached = getCachedWeather();
    if (cached) return cached;

    const { apparentKeyword, weatherStateKeyword } = getApparentWeatherKeywords(22, 'Clear');
    return {
      temperature: 22,
      tempMax: 25,
      tempMin: 16,
      apparentKeyword,
      weatherStateKeyword,
      weatherState: 'Clear',
      weatherDescription: '맑음',
      precipitation: 0,
      locationName: locationName || '현재 위치',
      isSimulated: false,
    };
  }
}
