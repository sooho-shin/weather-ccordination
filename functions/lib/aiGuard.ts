export type AiKind = 'deepseek' | 'flux';
export const AI_LIMITS = { sessionDaily: 10, ipDaily: 20, ipMinute: 4, deepseekDaily: 100, fluxDaily: 50, photoDaily: 150 };
const COOKIE = '__Host-dize-ai';

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

async function signingKey(secret: string) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signature(secret: string, value: string) {
  const bytes = await crypto.subtle.sign('HMAC', await signingKey(secret), new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sessionId(request: Request, secret: string): Promise<string | null> {
  const token = request.headers.get('Cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return null;
  const [id, expiry, mac] = token.split('.');
  if (!/^[a-f0-9-]{36}$/.test(id || '') || !/^\d+$/.test(expiry || '') || !/^[a-f0-9]{64}$/.test(mac || '') || Number(expiry) <= Date.now()) return null;
  const valid = await crypto.subtle.verify('HMAC', await signingKey(secret), new Uint8Array(mac.match(/../g)!.map((byte) => parseInt(byte, 16))), new TextEncoder().encode(`${new URL(request.url).origin}|${id}.${expiry}`));
  return valid ? id : null;
}

export async function createSession(request: Request, secret: string) {
  if (await sessionId(request, secret)) return json({ ready: true });
  const payload = `${crypto.randomUUID()}.${Date.now() + 86400000}`;
  const token = `${payload}.${await signature(secret, `${new URL(request.url).origin}|${payload}`)}`;
  return json({ ready: true }, 200, { 'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400` });
}

// A single conditional write reserves all quotas atomically, including across isolates.
export const RESERVE_USAGE_SQL = `INSERT INTO ai_usage (id, at, session_id, ip_hash, kind)
  SELECT ?, ?, ?, ?, ? WHERE
  (SELECT COUNT(*) FROM ai_usage WHERE kind = ? AND at >= ?) < ? AND
  (SELECT COUNT(*) FROM ai_usage WHERE session_id = ? AND kind = ? AND at >= ?) < ? AND
  (SELECT COUNT(*) FROM ai_usage WHERE ip_hash = ? AND kind = ? AND at >= ?) < ? AND
  (SELECT COUNT(*) FROM ai_usage WHERE ip_hash = ? AND at >= ?) < ?
  RETURNING id`;

export async function reserveUsage(context: any, kind: AiKind | 'photo'): Promise<Response | null> {
  const { request, env } = context;
  if (request.headers.get('Origin') !== new URL(request.url).origin) return json({ error: '이 사이트에서 다시 시도해 주세요.' }, 403);
  if (!env?.AI_SESSION_SECRET || !env?.AI_LIMITS) return json({ error: 'AI 사용량 보호 설정이 준비되지 않았습니다.' }, 503);
  const session = await sessionId(request, env.AI_SESSION_SECRET);
  if (!session) return json({ error: 'AI 세션이 만료됐거나 쿠키가 차단됐어요. 이 사이트의 쿠키를 허용하고 다시 시도해 주세요.' }, 401);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return json({ error: '접속 정보를 확인할 수 없습니다.' }, 403);
  const ipHash = await signature(env.AI_SESSION_SECRET, `ip|${ip}`);
  const now = Date.now();
  const day = Math.floor((now + 9 * 3600000) / 86400000) * 86400000 - 9 * 3600000;
  const table = kind === 'photo' ? 'photo_usage' : 'ai_usage';
  const dailyLimit = kind === 'photo' ? AI_LIMITS.photoDaily : kind === 'flux' ? AI_LIMITS.fluxDaily : AI_LIMITS.deepseekDaily;
  const sessionLimit = kind === 'photo' ? 20 : AI_LIMITS.sessionDaily;
  const ipLimit = kind === 'photo' ? 40 : AI_LIMITS.ipDaily;
  const result = await env.AI_LIMITS.prepare(RESERVE_USAGE_SQL.replaceAll('ai_usage', table)).bind(
    crypto.randomUUID(), now, session, ipHash, kind,
    kind, day, dailyLimit,
    session, kind, day, sessionLimit,
    ipHash, kind, day, ipLimit,
    ipHash, now - 60000, AI_LIMITS.ipMinute,
  ).all();
  if (!result.results?.length) {
    const counts = await env.AI_LIMITS.prepare(`SELECT
      (SELECT COUNT(*) FROM ${table} WHERE kind = ? AND at >= ?) AS total,
      (SELECT COUNT(*) FROM ${table} WHERE session_id = ? AND kind = ? AND at >= ?) AS session,
      (SELECT COUNT(*) FROM ${table} WHERE ip_hash = ? AND kind = ? AND at >= ?) AS ip
    `).bind(kind, day, session, kind, day, ipHash, kind, day).all();
    const count = counts.results?.[0];
    const daily = count && (count.total >= dailyLimit || count.session >= sessionLimit || count.ip >= ipLimit);
    return json({ error: daily ? '오늘 AI 생성 한도에 도달했어요. 내일 다시 이용해 주세요.' : '요청이 너무 빠르게 이어지고 있어요. 1분 뒤 다시 시도해 주세요.' }, 429, {
      'Retry-After': String(daily ? Math.max(1, Math.ceil((day + 86400000 - now) / 1000)) : 60),
    });
  }
  // Raw IP addresses are never stored. Keep only the current quota window.
  context.waitUntil?.(env.AI_LIMITS.prepare(`DELETE FROM ${table} WHERE at < ?`).bind(day).run().catch(() => {}));
  return null;
}

export async function readBody(request: Request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw json({ error: 'JSON 요청만 지원합니다.' }, 415);
  const reader = request.body?.getReader();
  if (!reader) throw json({ error: '요청 내용이 없습니다.' }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); throw json({ error: '요청 내용이 너무 큽니다.' }, 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw json({ error: '요청 형식이 올바르지 않습니다.' }, 400); }
}

function safePayload(body: any, kind: AiKind) {
  if (kind === 'flux') {
    const input = body?.input;
    if (typeof input?.prompt !== 'string' || !input.prompt.trim() || input.prompt.length > 1024 ||
      (input.num_images !== undefined && input.num_images !== 1) ||
      (input.image_size !== undefined && (input.image_size?.width !== 768 || input.image_size?.height !== 1344))) throw json({ error: '이미지 요청은 1024자 이내, 768×1344 한 장만 지원합니다.' }, 400);
    return { input: { prompt: input.prompt, num_images: 1, image_size: { width: 768, height: 1344 }, num_inference_steps: 4, output_format: 'jpeg', output_quality: 85 } };
  }
  if (body?.model !== 'deepseek-ai/deepseek-v4.1-flash-1017' || !Array.isArray(body.messages) || body.messages.length !== 2 ||
    body.messages.some((message: any, i: number) => message?.role !== (i === 0 ? 'system' : 'user') || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 6000)) throw json({ error: '코디 요청 형식이 올바르지 않습니다.' }, 400);
  return { model: body.model, messages: body.messages.map(({ role, content }: any) => ({ role, content })), max_completion_tokens: 2500, reasoning_effort: 'none', temperature: 0.85, stream: false };
}

export async function handleAiRequest(context: any, kind: AiKind) {
  try {
    if (!context.env?.HIVE_SECRET_KEY) return json({ error: 'HIVE_SECRET_KEY is not configured' }, 503);
    const payload = safePayload(await readBody(context.request), kind);
    const denied = await reserveUsage(context, kind);
    if (denied) return denied;
    const endpoint = kind === 'flux' ? 'black-forest-labs/flux-schnell' : 'chat/completions';
    const upstream = await fetch(`https://api-cdn.thehive.ai/api/v3/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${context.env.HIVE_SECRET_KEY}` },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(25000),
    });
    if (!upstream.ok) {
      console.warn('AI upstream rejected request', kind, upstream.status);
      return json({ error: 'AI 생성 서비스가 일시적으로 응답하지 않아요. 잠시 후 다시 시도해 주세요.' }, upstream.status === 429 ? 429 : 502);
    }
    return new Response(await upstream.text(), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: 'AI 생성 요청을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.' }, 503);
  }
}
