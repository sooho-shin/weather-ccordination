/**
 * 화면에 표시할 위치 이름.
 * 서울은 구 단위까지 보여주지 않고 시 단위("서울특별시")로만 표기한다.
 * 그 외 지역은 받은 이름 그대로 사용한다.
 */
export function formatLocationLabel(name: string | undefined | null): string {
  const trimmed = (name ?? '').trim();
  if (/^서울(특별시|시)?(\s|$)/.test(trimmed)) return '서울특별시';
  return trimmed;
}
