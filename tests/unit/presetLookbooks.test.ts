import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_LOOKBOOKS, findMatchingLookbooks } from '../../src/data/presetLookbooks';

test('프리셋 룩북 데이터 무결성 검증', () => {
  assert.ok(PRESET_LOOKBOOKS.length >= 8, '최소 8개 이상의 룩북이 정의되어야 함');

  for (const lb of PRESET_LOOKBOOKS) {
    assert.ok(lb.id, `ID 누락: ${JSON.stringify(lb)}`);
    assert.ok(['female', 'male'].includes(lb.gender), `성별 오류: ${lb.gender}`);
    assert.ok(lb.imageUrl.startsWith('https://'), `유효한 이미지 URL 필요: ${lb.imageUrl}`);
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

test('목업 대표 코디(여성, 20~22도, 맑음) 매칭 검증', () => {
  const matches = findMatchingLookbooks('female', '20to22', 'Clear');
  assert.ok(matches.length >= 2, '목업 코디는 2개 이상의 스타일 슬라이드가 있어야 함');

  const first = matches[0];
  assert.equal(first.gender, 'female');
  assert.equal(first.tempBand, '20to22');

  const itemNames = first.items.map((i) => i.name);
  assert.ok(itemNames.some((n) => n.includes('트렌치코트')), '트렌치코트 포함 필요');
  assert.ok(itemNames.some((n) => n.includes('셔츠')), '셔츠 포함 필요');
  assert.ok(itemNames.some((n) => n.includes('데님')), '데님 팬츠 포함 필요');
  assert.ok(itemNames.some((n) => n.includes('로퍼')), '로퍼 포함 필요');
});

test('성별 전환 및 특수 날씨(비, 눈) 매칭 검증', () => {
  // 남성 매칭
  const maleMatches = findMatchingLookbooks('male', '20to22', 'Clear');
  assert.ok(maleMatches.length >= 1);
  assert.equal(maleMatches[0].gender, 'male');

  // 우천 매칭
  const rainMatches = findMatchingLookbooks('female', '17to19', 'Rain');
  assert.ok(rainMatches.length >= 1);
  assert.equal(rainMatches[0].weatherState, 'Rain');

  // 강설 매칭
  const snowMatches = findMatchingLookbooks('male', 'under4', 'Snow');
  assert.ok(snowMatches.length >= 1);
  assert.equal(snowMatches[0].weatherState, 'Snow');
});
