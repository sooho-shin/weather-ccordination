import { useRef } from 'react';
import { GestureResponderHandlers, PanResponder } from 'react-native';

const SWIPE_THRESHOLD = 40;

/**
 * 좌우로 밀어서 이전/다음 항목으로 이동하는 제스처 핸들러.
 * 세로 스크롤과 구분하기 위해 가로 이동이 세로 이동보다 충분히 클 때만 반응한다.
 * 반환값을 대상 View에 `{...handlers}`로 펼쳐서 사용한다.
 */
export function useHorizontalSwipe(onPrev: () => void, onNext: () => void): GestureResponderHandlers {
  // 렌더마다 최신 콜백을 쓰되 PanResponder 자체는 한 번만 만든다.
  const latest = useRef({ onPrev, onNext });
  latest.current = { onPrev, onNext };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderRelease: (_, g) => {
        if (g.dx <= -SWIPE_THRESHOLD) latest.current.onNext();
        else if (g.dx >= SWIPE_THRESHOLD) latest.current.onPrev();
      },
    })
  ).current;

  return panResponder.panHandlers;
}
