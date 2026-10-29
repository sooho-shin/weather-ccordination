import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLocationLabel } from '../../src/utils/locationLabel';

test('서울은 구 단위 없이 시 단위로만 표기', () => {
  assert.equal(formatLocationLabel('서울특별시 중구'), '서울특별시');
  assert.equal(formatLocationLabel('서울특별시 강남구'), '서울특별시');
  assert.equal(formatLocationLabel('서울특별시'), '서울특별시');
  assert.equal(formatLocationLabel('서울 마포구'), '서울특별시');
  assert.equal(formatLocationLabel('서울시 종로구'), '서울특별시');
  assert.equal(formatLocationLabel('  서울특별시 중구  '), '서울특별시');
});

test('서울이 아닌 지역과 안내 문구는 그대로 유지', () => {
  assert.equal(formatLocationLabel('경기도 성남시'), '경기도 성남시');
  assert.equal(formatLocationLabel('부산광역시 해운대구'), '부산광역시 해운대구');
  assert.equal(formatLocationLabel('현재 위치'), '현재 위치');
  assert.equal(formatLocationLabel('현재 위치 확인 중...'), '현재 위치 확인 중...');
  // "서울"로 시작하지만 서울시가 아닌 이름은 건드리지 않는다
  assert.equal(formatLocationLabel('서울산업단지'), '서울산업단지');
  assert.equal(formatLocationLabel(''), '');
  assert.equal(formatLocationLabel(undefined), '');
});
