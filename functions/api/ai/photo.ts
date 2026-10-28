import { json, readBody, reserveUsage } from '../../lib/aiGuard';

export async function onRequestPost(context: any) {
  try {
    const { url } = await readBody(context.request);
    if (typeof url !== 'string' || url.length > 4096) return json({ error: '사진 주소가 올바르지 않습니다.' }, 400);
    const source = new URL(url);
    if (source.protocol !== 'https:' || source.hostname !== 'hive-data-prod-cdn.thehive.ai' || source.port || source.username || source.password || !source.pathname.startsWith('/image_generation/')) {
      return json({ error: '이 앱에서 생성한 사진만 보관할 수 있어요.' }, 400);
    }
    const denied = await reserveUsage(context, 'photo');
    if (denied) return denied;
    const response = await fetch(source.href, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
    if (!response.ok || !/^image\/(png|jpeg|webp)(;|$)/.test(response.headers.get('Content-Type') || '')) return json({ error: '사진을 가져오지 못했어요. 사진을 다시 생성한 뒤 저장해 주세요.' }, 502);
    const reader = response.body?.getReader();
    if (!reader) return json({ error: '사진 내용이 없습니다.' }, 502);
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4 * 1024 * 1024) { await reader.cancel(); return json({ error: '사진 파일이 너무 큽니다.' }, 413); }
      chunks.push(value);
    }
    if (size === 0) return json({ error: '사진 내용이 없습니다.' }, 502);
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return new Response(bytes, { headers: { 'Content-Type': response.headers.get('Content-Type')!, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) {
    if (error instanceof Response) return error;
    console.warn('Photo preservation failed', error instanceof Error ? error.name : 'UnknownError');
    return json({ error: '사진을 보관하지 못했어요. 잠시 후 다시 시도해 주세요.' }, 502);
  }
}
