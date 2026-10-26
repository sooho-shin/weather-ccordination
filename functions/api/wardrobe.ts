// Cloudflare Pages Function: /api/wardrobe (D1 + R2)
export async function onRequestGet(context: any) {
  try {
    const db = context.env?.DB;

    if (db) {
      const { results } = await db.prepare(
        'SELECT * FROM saved_outfits ORDER BY created_at DESC'
      ).all();

      const outfits = (results || []).map((row: any) => ({
        id: row.id,
        styleTitle: row.style_title,
        styleDescription: row.style_description,
        gender: row.gender,
        tempBand: row.temp_band,
        weatherState: row.weather_state,
        temperature: row.temperature,
        tpo: row.tpo,
        weatherDefenseTags: typeof row.weather_defense_tags === 'string' ? JSON.parse(row.weather_defense_tags) : row.weather_defense_tags,
        items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
        imageUrl: row.image_url,
        imageR2Key: row.image_r2_key,
        createdAt: row.created_at,
      }));

      return new Response(JSON.stringify({ success: true, outfits }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ success: true, outfits: [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestPost(context: any) {
  try {
    const db = context.env?.DB;
    const r2 = context.env?.R2;
    const payload = await context.request.json();

    const id = payload.id || `outfit_${Date.now()}`;
    const r2Key = `outfits/${id}.png`;
    let servedUrl = payload.imageUrl;

    // R2 버킷이 바인딩되어 있고 원격 이미지 URL인 경우 다운로드하여 R2에 저장
    if (r2 && payload.imageUrl && typeof payload.imageUrl === 'string' && payload.imageUrl.startsWith('http')) {
      try {
        const imgRes = await fetch(payload.imageUrl);
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          await r2.put(r2Key, buffer, {
            httpMetadata: { contentType: 'image/png' },
          });
          servedUrl = `/api/images/${r2Key}`;
        }
      } catch (r2Err) {
        console.warn('R2 저장 경고:', r2Err);
      }
    }

    // D1 데이터베이스에 메타데이터 저장
    if (db) {
      await db.prepare(`
        INSERT INTO saved_outfits (
          id, style_title, style_description, gender, temp_band, weather_state,
          temperature, tpo, weather_defense_tags, items, image_url, image_r2_key, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
        ON CONFLICT(id) DO UPDATE SET
          style_title = excluded.style_title,
          style_description = excluded.style_description,
          image_url = excluded.image_url
      `).bind(
        id,
        payload.styleTitle || '감각적인 맞춤 코디',
        payload.styleDescription || '',
        payload.gender || 'female',
        payload.tempBand || '',
        payload.weatherState || 'Clear',
        payload.temperature ?? 20,
        payload.tpo || 'daily',
        JSON.stringify(payload.weatherDefenseTags || []),
        JSON.stringify(payload.items || []),
        servedUrl,
        r2Key
      ).run();
    }

    return new Response(JSON.stringify({
      success: true,
      outfit: {
        ...payload,
        id,
        imageUrl: servedUrl,
        imageR2Key: r2Key,
      },
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestDelete(context: any) {
  try {
    const db = context.env?.DB;
    const r2 = context.env?.R2;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'id required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (r2) {
      await r2.delete(`outfits/${id}.png`);
    }

    if (db) {
      await db.prepare('DELETE FROM saved_outfits WHERE id = ?').bind(id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    },
  });
}
