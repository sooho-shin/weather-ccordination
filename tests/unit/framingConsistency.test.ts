import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MASTER_FULLBODY_PROMPT_DIRECTIVE,
  MANDATORY_FULLBODY_KEYWORDS,
  enforceFullBodyFraming,
} from '../../src/constants/framingStandards';
import { buildOutfitPrompt } from '../../src/utils/promptBuilder';

test('전신 구도 마스터 지침 필수 키워드 포함 검증', () => {
  const directiveLower = MASTER_FULLBODY_PROMPT_DIRECTIVE.toLowerCase();

  for (const keyword of MANDATORY_FULLBODY_KEYWORDS) {
    assert.ok(
      directiveLower.includes(keyword.toLowerCase()),
      `마스터 구도 지침에 필수 키워드 '${keyword}'가 포함되어야 합니다.`
    );
  }

  // 금지 조건(NO close-up, NO cropped) 확인
  assert.ok(directiveLower.includes('no close-up'), '클로즈업 금지 규칙이 포함되어야 합니다.');
  assert.ok(directiveLower.includes('no cropped feet'), '발/신발 잘림 금지 규칙이 포함되어야 합니다.');
  assert.ok(directiveLower.includes('no cropped head'), '머리 잘림 금지 규칙이 포함되어야 합니다.');
});

test('enforceFullBodyFraming 함수 구도 강제 검증', () => {
  const result = enforceFullBodyFraming('beige trench coat and sneakers', 'female');
  assert.ok(result.includes('Korean female model'));
  assert.ok(result.includes('head-to-toe'));
  assert.ok(result.includes('beige trench coat and sneakers'));
});

test('buildOutfitPrompt 전신 스탠딩 9:16 구도 키워드 검증', () => {
  const femaleResult = buildOutfitPrompt({
    gender: 'female',
    temperature: 20,
    weatherState: 'Clear',
  });

  assert.ok(femaleResult.prompt.includes('full-body'));
  assert.ok(femaleResult.prompt.includes('head-to-toe'));
  assert.ok(femaleResult.prompt.includes('9:16'));
  assert.ok(femaleResult.prompt.includes('shoes and feet fully visible'));

  const maleResult = buildOutfitPrompt({
    gender: 'male',
    temperature: 15,
    weatherState: 'Clouds',
  });

  assert.ok(maleResult.prompt.includes('full-body'));
  assert.ok(maleResult.prompt.includes('head-to-toe'));
  assert.ok(maleResult.prompt.includes('shoes and feet fully visible'));
});
