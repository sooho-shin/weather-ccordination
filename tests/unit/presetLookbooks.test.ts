import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_LOOKBOOKS, findMatchingLookbooks } from '../../src/data/presetLookbooks';

test('프리셋 룩북 50종 데이터 무결성 및 TPO/방어태그 검증', () => {
  assert.ok(PRESET_LOOKBOOKS.length >= 50, `최소 50개 이상의 룩북이 정의되어야 함 (현재: ${PRESET_LOOKBOOKS.length})`);

  for (const lb of PRESET_LOOKBOOKS) {
    assert.ok(lb.id, `ID 누락: ${JSON.stringify(lb)}`);
    assert.ok(['female', 'male', 'all'].includes(lb.gender), `성별 오류: ${lb.gender}`);
    assert.ok(
      typeof lb.imageUrl === 'string'
        ? lb.imageUrl.length > 0
        : Boolean(lb.imageUrl),
      `유효한 이미지 소스 필요: ${lb.imageUrl}`
    );
    assert.ok(lb.styleTitle.length > 0, `스타일 제목 누락: ${lb.id}`);
    assert.ok(['office', 'daily', 'street'].includes(lb.tpo || 'daily'), `TPO 분류 오류: ${lb.tpo}`);
    assert.ok(Array.isArray(lb.weatherDefenseTags) && lb.weatherDefenseTags.length >= 2, `날씨 방어 태그 누락: ${lb.id}`);
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

test('TPO 3분할(출근, 데일리, 스트릿) 필터링 동작 검증', () => {
  const officeMatches = findMatchingLookbooks('female', '20to22', 'Clear', 'office');
  assert.ok(officeMatches.length > 0, '출근/단정 룩북이 매칭되어야 함');
  assert.ok(officeMatches.every((b) => b.tpo === 'office'), '모든 항목이 office TPO여야 함');

  const dailyMatches = findMatchingLookbooks('male', '20to22', 'Clear', 'daily');
  assert.ok(dailyMatches.length > 0, '데일리/캐주얼 룩북이 매칭되어야 함');
  assert.ok(dailyMatches.every((b) => b.tpo === 'daily'), '모든 항목이 daily TPO여야 함');

  const streetMatches = findMatchingLookbooks('female', '20to22', 'Clear', 'street');
  assert.ok(streetMatches.length > 0, '스트릿/힙 룩북이 매칭되어야 함');
  assert.ok(streetMatches.every((b) => b.tpo === 'street'), '모든 항목이 street TPO여야 함');
});

test('성별 "all(모두)" 선택 시 남/여 통합 매칭 검증', () => {
  const allMatches = findMatchingLookbooks('all', '20to22', 'Clear');
  assert.ok(allMatches.length >= 5, '최소 5개 이상의 룩북이 반환되어야 함');
});

test('우천 시 날씨 방어 태그(#우산_필수 등) 포함 검증', () => {
  const rainMatches = findMatchingLookbooks('female', '17to19', 'Rain');
  assert.ok(rainMatches.length > 0);
  const first = rainMatches[0];
  assert.ok(
    first.weatherDefenseTags?.some((t) => t.includes('우산') || t.includes('밝은바지')),
    '우천 시 우산 또는 밝은바지 방어 태그가 포함되어야 함'
  );
});
