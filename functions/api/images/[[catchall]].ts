// Cloudflare Pages Function: /api/images/* (R2 서빙)
export async function onRequestGet(context: any) {
  try {
    const r2 = context.env?.R2;
    const url = new URL(context.request.url);
    const key = url.pathname.replace('/api/images/', '');

    if (!r2) {
      return new Response('R2 binding not configured', { status: 404 });
    }

    const object = await r2.get(key);
    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(object.body, { headers });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
