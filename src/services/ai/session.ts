let pending: Promise<void> | null = null;

export async function ensureAiSession(signal?: AbortSignal) {
  if (!pending) {
    pending = (async () => {
      const response = await fetch('/api/ai/session', { credentials: 'same-origin', signal });
      if (!response.ok) throw new Error('AI 연결을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.');
    })().finally(() => { pending = null; });
  }
  await pending;
}

export async function aiErrorMessage(response: Response) {
  try {
    const body = await response.json();
    if (typeof body.error === 'string') return body.error;
  } catch { /* JSON이 아닌 서비스 장애 응답도 사용자 안내로 변환합니다. */ }
  return response.status === 429 ? 'AI 생성 한도에 도달했어요. 잠시 후 다시 시도해 주세요.' : 'AI 생성에 실패했어요. 잠시 후 다시 시도해 주세요.';
}
