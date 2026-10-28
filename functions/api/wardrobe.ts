// Wardrobes are private to this browser until authenticated cloud storage is available.
function localWardrobeOnly() {
  return new Response(JSON.stringify({ success: false, error: '옷장은 이 브라우저에 저장됩니다. 앱을 새로고침해 주세요.' }), {
    status: 410, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export const onRequestGet = localWardrobeOnly;
export const onRequestPost = localWardrobeOnly;
export const onRequestDelete = localWardrobeOnly;
