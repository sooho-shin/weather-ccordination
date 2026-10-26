import test from 'node:test';
import assert from 'node:assert/strict';
import { mapWmoCodeToWeatherState, getApparentWeatherKeywords } from '../../src/services/weatherService';

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

test('기온 및 상태별 체감 키워드 산출 검증', () => {
  // 30도 폭염
  const hot = getApparentWeatherKeywords(30, 'Clear');
  assert.equal(hot.apparentKeyword, '덥다');
  assert.equal(hot.weatherStateKeyword, '맑음');

  // 14도 쌀쌀한 비오는 날
  const chillyRain = getApparentWeatherKeywords(14, 'Rain');
  assert.equal(chillyRain.apparentKeyword, '쌀쌀하다');
  assert.equal(chillyRain.weatherStateKeyword, '비온다');

  // -2도 영하 한파 눈
  const winterSnow = getApparentWeatherKeywords(-2, 'Snow');
  assert.equal(winterSnow.apparentKeyword, '매우 춥다');
  assert.equal(winterSnow.weatherStateKeyword, '눈온다');
});
