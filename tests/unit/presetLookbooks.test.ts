import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_LOOKBOOKS, findMatchingLookbooks } from '../../src/data/presetLookbooks';

test('프리셋 룩북 50종 데이터 무결성 검증', () => {
  assert.ok(PRESET_LOOKBOOKS.length >= 50, `최소 50개 이상의 룩북이 정의되어야 함 (현재: ${PRESET_LOOKBOOKS.length})`);

  for (const lb of PRESET_LOOKBOOKS) {
    assert.ok(lb.id, `ID 누락: ${JSON.stringify(lb)}`);
    assert.ok(['female', 'male'].includes(lb.gender), `성별 오류: ${lb.gender}`);
    assert.ok(
      typeof lb.imageUrl === 'string'
        ? lb.imageUrl.length > 0
        : Boolean(lb.imageUrl),
      `유효한 이미지 소스 필요: ${lb.imageUrl}`
    );
    assert.ok(lb.styleTitle.length > 0, `스타일 제목 누락: ${lb.id}`);
    assert.ok(Array.isArray(lb.items), `아이템 배열 필요: ${lb.id}`);
    assert.ok(lb.items.length >= 3, `최소 3개 이상의 코디 아이템 필요: ${lb.id}`);

    for (const item of lb.items) {
      assert.ok(item.id, `아이템 ID 누락 in ${lb.id}`);
      assert.ok(item.name, `아이템 이름 누락 in ${lb.id}`);
      assert.ok(
        ['outer', 'top', 'bottom', 'shoes', 'accessory'].includes(item.category),
        `아이템 카테고리 오류: ${item.category}`
      );
      assert.ok(item.iconName, `아이템 아이콘 누락 in ${lb.id}`);
    }
  }
});

test('5대 핵심 날씨 카테고리별 남/녀 각각 5종 슬라이드 보장 검증', () => {
  const scenarios: Array<{ gender: 'female' | 'male'; tempBand: string; state: string; name: string }> = [
    // 1. 봄가을 온화한 날
    { gender: 'female', tempBand: '20to22', state: 'Clear', name: '여성 20~22°C 맑음' },
    { gender: 'male', tempBand: '20to22', state: 'Clear', name: '남성 20~22°C 맑음' },
    // 2. 한여름 폭염
    { gender: 'female', tempBand: 'over28', state: 'Clear', name: '여성 28°C 이상 폭염' },
    { gender: 'male', tempBand: 'over28', state: 'Clear', name: '남성 28°C 이상 폭염' },
    // 3. 간절기 쌀쌀한 날
    { gender: 'female', tempBand: '12to16', state: 'Clear', name: '여성 12~16°C 간절기' },
    { gender: 'male', tempBand: '12to16', state: 'Clear', name: '남성 12~16°C 간절기' },
    // 4. 한겨울 한파 & 강설
    { gender: 'female', tempBand: 'under4', state: 'Snow', name: '여성 4°C 이하 강설' },
    { gender: 'male', tempBand: 'under4', state: 'Snow', name: '남성 4°C 이하 강설' },
    // 5. 우천 비오는 날
    { gender: 'female', tempBand: '17to19', state: 'Rain', name: '여성 우천' },
    { gender: 'male', tempBand: '17to19', state: 'Rain', name: '남성 우천' },
  ];

  for (const s of scenarios) {
    const matches = findMatchingLookbooks(s.gender, s.tempBand, s.state);
    assert.equal(
      matches.length,
      5,
      `[${s.name}] 시나리오에서 반드시 5개의 룩북 슬라이드가 보장되어야 합니다 (현재: ${matches.length})`
    );
    for (const m of matches) {
      assert.equal(m.gender, s.gender, `[${s.name}] 성별 일치 필요: ${m.gender}`);
    }
  }
});

test('20~22도 대표 코디(여성, 맑음) 스타일 및 아이템 검증', () => {
  const matches = findMatchingLookbooks('female', '20to22', 'Clear');
  assert.equal(matches.length, 5);

  const first = matches[0];
  assert.equal(first.gender, 'female');
  assert.equal(first.tempBand, '20to22');

  const itemNames = first.items.map((i) => i.name);
  assert.ok(
    itemNames.some((n) => n.includes('블레이저') || n.includes('트렌치코트')),
    '아우터(블레이저 또는 트렌치코트) 포함 필요'
  );
  assert.ok(itemNames.some((n) => n.includes('니트') || n.includes('셔츠')), '상의 포함 필요');
  assert.ok(itemNames.some((n) => n.includes('슬랙스') || n.includes('데님')), '하의 포함 필요');
  assert.ok(itemNames.some((n) => n.includes('부츠') || n.includes('로퍼')), '신발 포함 필요');
});
