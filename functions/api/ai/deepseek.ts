// Cloudflare Pages Function: /api/ai/deepseek
export async function onRequestPost(context: any) {
  try {
    const request = context.request;
    const body = await request.json();

    const apiKey = context.env?.HIVE_SECRET_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'HIVE_SECRET_KEY is not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const hiveResponse = await fetch('https://api-cdn.thehive.ai/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await hiveResponse.text();

    return new Response(data, {
      status: hiveResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Serverless proxy error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}
