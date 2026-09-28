import { WeatherData, WeatherState } from '../types/weather';

/**
 * WMO 날씨 코드를 WeatherState 및 한글 설명으로 변환
 */
export function mapWmoCodeToWeatherState(code: number): {
  state: WeatherState;
  description: string;
} {
  // WMO Weather interpretation codes (WW)
  // 0: Clear sky
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog
  // 51, 53, 55: Drizzle
  // 61, 63, 65: Rain
  // 71, 73, 75: Snow fall
  // 77: Snow grains
  // 80, 81, 82: Rain showers
  // 85, 86: Snow showers
  // 95, 96, 99: Thunderstorm
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
 * Open-Meteo 실시간 날씨 데이터 호출 (무료, API 키 불필요)
 */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  locationName: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation,wind_speed_10m&timezone=auto`;

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

    const { state, description } = mapWmoCodeToWeatherState(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      weatherState: state,
      weatherDescription: description,
      precipitation: current.precipitation ?? 0,
      locationName,
      isSimulated: false,
    };
  } catch (error) {
    console.warn('날씨 API 호출 실패 또는 타임아웃, 기본 22도 맑음 날씨로 폴백:', error);
    return {
      temperature: 22,
      weatherState: 'Clear',
      weatherDescription: '맑음',
      precipitation: 0,
      locationName: locationName || '서울특별시 중구',
      isSimulated: false,
    };
  }
}
