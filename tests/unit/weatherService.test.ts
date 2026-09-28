import test from 'node:test';
import assert from 'node:assert/strict';
import { mapWmoCodeToWeatherState } from '../../src/services/weatherService';

test('WMO 날씨 코드 -> WeatherState 및 한글 설명 변환 검증', () => {
  // Clear
  assert.deepEqual(mapWmoCodeToWeatherState(0), { state: 'Clear', description: '맑음' });
  assert.deepEqual(mapWmoCodeToWeatherState(1), { state: 'Clear', description: '대체로 맑음' });

  // Clouds
  assert.deepEqual(mapWmoCodeToWeatherState(2), { state: 'Clouds', description: '구름 조금' });
  assert.deepEqual(mapWmoCodeToWeatherState(3), { state: 'Clouds', description: '흐림' });
  assert.deepEqual(mapWmoCodeToWeatherState(45), { state: 'Clouds', description: '안개' });

  // Rain
  assert.deepEqual(mapWmoCodeToWeatherState(61), { state: 'Rain', description: '비' });
  assert.deepEqual(mapWmoCodeToWeatherState(80), { state: 'Rain', description: '비' });
  assert.deepEqual(mapWmoCodeToWeatherState(95), { state: 'Rain', description: '비' });

  // Snow
  assert.deepEqual(mapWmoCodeToWeatherState(71), { state: 'Snow', description: '눈' });
  assert.deepEqual(mapWmoCodeToWeatherState(85), { state: 'Snow', description: '눈' });
});
