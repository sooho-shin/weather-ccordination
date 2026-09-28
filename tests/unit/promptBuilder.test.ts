import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOutfitPrompt } from '../../src/utils/promptBuilder';

test('AI 프롬프트 빌더 여성/남성 및 기온대별 조립 검증', () => {
  // 1. 여성 22도 맑음
  const femaleResult = buildOutfitPrompt({
    gender: 'female',
    temperature: 22,
    weatherState: 'Clear',
    styleMood: '프렌치 시크',
  });

  assert.ok(femaleResult.prompt.includes('Korean woman'));
  assert.ok(femaleResult.prompt.includes('trench coat'));
  assert.ok(femaleResult.prompt.includes('Clear') || femaleResult.prompt.includes('sunlight'));
  assert.ok(femaleResult.suggestedItems.length >= 3);
  assert.equal(femaleResult.styleTitle, '프렌치 시크 룩');

  // 2. 남성 30도 폭염
  const maleResult = buildOutfitPrompt({
    gender: 'male',
    temperature: 30,
    weatherState: 'Clear',
  });

  assert.ok(maleResult.prompt.includes('Korean man'));
  assert.ok(maleResult.prompt.includes('linen'));
  assert.ok(maleResult.suggestedItems.length >= 3);

  // 3. 한겨울 0도 눈
  const winterResult = buildOutfitPrompt({
    gender: 'female',
    temperature: 0,
    weatherState: 'Snow',
  });

  assert.ok(winterResult.prompt.includes('puffer') || winterResult.prompt.includes('down'));
  assert.ok(winterResult.prompt.includes('snow') || winterResult.prompt.includes('Snow'));
});
