import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PRESET_LOOKBOOKS } from '../../src/data/presetLookbooks';

describe('프리셋 룩북 전신 화보 무결성 및 외부 얼굴 클로즈업 사진 방지 검증', () => {
  it('PRESET_LOOKBOOKS 내 모든 항목의 imageUrl은 외부 Unsplash URL을 포함하지 않아야 한다', () => {
    for (const lookbook of PRESET_LOOKBOOKS) {
      if (typeof lookbook.imageUrl === 'string') {
        assert.ok(
          !lookbook.imageUrl.includes('unsplash.com'),
          `[FAIL] Lookbook ${lookbook.id} (${lookbook.styleTitle}) contains Unsplash URL: ${lookbook.imageUrl}`
        );
      }
    }
  });

  it('PRESET_LOOKBOOKS 내 모든 항목은 유효한 이미지 소스를 가져야 한다', () => {
    for (const lookbook of PRESET_LOOKBOOKS) {
      assert.ok(
        lookbook.imageUrl !== undefined && lookbook.imageUrl !== null && lookbook.imageUrl !== '',
        `[FAIL] Lookbook ${lookbook.id} has no valid imageUrl`
      );
    }
  });

  it('현재 가을 날씨(12~16도 대역)의 모든 룩북은 로컬 고화질 9:16 전신 화보 에셋을 참조해야 한다', () => {
    const autumnLookbooks = PRESET_LOOKBOOKS.filter((b) => b.tempBand === '12to16');
    assert.ok(autumnLookbooks.length >= 8, '가을 룩북은 최소 8종 이상 존재해야 함');
    for (const lb of autumnLookbooks) {
      // 외부 URL이 아니어야 함
      assert.ok(
        !String(lb.imageUrl).startsWith('http'),
        `[FAIL] ${lb.id}는 외부 URL이 아닌 로컬 9:16 전신 에셋이어야 합니다`
      );
    }
  });
});
