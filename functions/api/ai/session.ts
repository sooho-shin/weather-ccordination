import { createSession, json } from '../../lib/aiGuard';

export async function onRequestGet({ request, env }: any) {
  if (!env?.AI_SESSION_SECRET) return json({ error: 'AI 세션 설정이 준비되지 않았습니다.' }, 503);
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({ error: '이 사이트에서 다시 연결해 주세요.' }, 403);
  return createSession(request, env.AI_SESSION_SECRET);
}
