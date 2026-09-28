import test from 'node:test';
import assert from 'node:assert/strict';
import { getTemperatureBand, TEMPERATURE_BANDS } from '../../src/constants/temperatureBands';

test('8단계 기온대 경계값 및 매핑 검증', () => {
  // 1. over28 (28°C 이상)
  assert.equal(getTemperatureBand(35).id, 'over28');
  assert.equal(getTemperatureBand(28).id, 'over28');

  // 2. 23to27 (23°C ~ 27.9°C)
  assert.equal(getTemperatureBand(27.9).id, '23to27');
  assert.equal(getTemperatureBand(25).id, '23to27');
  assert.equal(getTemperatureBand(23).id, '23to27');

  // 3. 20to22 (20°C ~ 22.9°C) - 목업 기준 기온대
  assert.equal(getTemperatureBand(22.9).id, '20to22');
  assert.equal(getTemperatureBand(22).id, '20to22');
  assert.equal(getTemperatureBand(20).id, '20to22');

  // 4. 17to19 (17°C ~ 19.9°C)
  assert.equal(getTemperatureBand(19.9).id, '17to19');
  assert.equal(getTemperatureBand(18).id, '17to19');
  assert.equal(getTemperatureBand(17).id, '17to19');

  // 5. 12to16 (12°C ~ 16.9°C)
  assert.equal(getTemperatureBand(16.9).id, '12to16');
  assert.equal(getTemperatureBand(14).id, '12to16');
  assert.equal(getTemperatureBand(12).id, '12to16');

  // 6. 9to11 (9°C ~ 11.9°C)
  assert.equal(getTemperatureBand(11.9).id, '9to11');
  assert.equal(getTemperatureBand(10).id, '9to11');
  assert.equal(getTemperatureBand(9).id, '9to11');

  // 7. 5to8 (5°C ~ 8.9°C)
  assert.equal(getTemperatureBand(8.9).id, '5to8');
  assert.equal(getTemperatureBand(7).id, '5to8');
  assert.equal(getTemperatureBand(5).id, '5to8');

  // 8. under4 (4.9°C 이하)
  assert.equal(getTemperatureBand(4.9).id, 'under4');
  assert.equal(getTemperatureBand(0).id, 'under4');
  assert.equal(getTemperatureBand(-10).id, 'under4');
});

test('기온대 메타데이터 및 추천 키워드 유효성 검증', () => {
  const bands = Object.values(TEMPERATURE_BANDS);
  assert.equal(bands.length, 8);

  for (const band of bands) {
    assert.ok(band.label.length > 0);
    assert.ok(band.summary.length > 0);
    assert.ok(Array.isArray(band.recommendedKeywords));
    assert.ok(band.recommendedKeywords.length >= 3);
  }
});
