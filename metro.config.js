const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');
const {
  saveOutfitToD1AndR2,
  getSavedOutfitsFromD1,
  deleteOutfitFromD1AndR2,
  getR2ImageFile,
} = require('./src/services/db/localD1R2Store');

const config = getDefaultConfig(__dirname);

const HIVE_SECRET_KEY = process.env.HIVE_SECRET_KEY;

/**
 * TheHive API 프록시 헬퍼 함수
 */
function proxyHiveRequest(targetUrl, reqBody, clientRes) {
  if (!HIVE_SECRET_KEY) {
    clientRes.writeHead(503, { 'Content-Type': 'application/json' });
    clientRes.end(JSON.stringify({ error: 'HIVE_SECRET_KEY is not configured' }));
    return;
  }
  const url = new URL(targetUrl);
  const data = JSON.stringify(reqBody);

  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      Authorization: `Bearer ${HIVE_SECRET_KEY}`,
    },
  };

  const proxyReq = https.request(options, (hiveRes) => {
    let body = '';
    hiveRes.on('data', (chunk) => (body += chunk));
    hiveRes.on('end', () => {
      clientRes.writeHead(hiveRes.statusCode || 200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      });
      clientRes.end(body);
    });
  });

  proxyReq.on('error', (err) => {
    clientRes.writeHead(500, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    clientRes.end(JSON.stringify({ error: err.message }));
  });

  proxyReq.write(data);
  proxyReq.end();
}

// 개발 서버 미들웨어 확장 (로컬 D1 SQLite + R2 이미지 스토어 에뮬레이션)
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware) => {
    return async (req, res, next) => {
      // CORS Preflight 처리
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        });
        res.end();
        return;
      }

      // 1. [R2 로컬 에뮬레이션] 이미지 스트리밍 서빙 (/api/images/outfits/...)
      if (req.url.startsWith('/api/images/')) {
        const imageKey = req.url.replace('/api/images/', '').split('?')[0];
        const buffer = getR2ImageFile(imageKey);
        if (buffer) {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(buffer);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Image not found in local R2 store');
        }
        return;
      }

      // 2. [D1 + R2 로컬 에뮬레이션] 내 옷장 저장/조회/삭제 API (/api/wardrobe)
      if (req.url.startsWith('/api/wardrobe')) {
        const urlObj = new URL(req.url, 'http://localhost:8081');

        if (req.method === 'GET') {
          const list = getSavedOutfitsFromD1();
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success: true, outfits: list }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (c) => (body += c));
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const saved = await saveOutfitToD1AndR2(payload);
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: true, outfit: saved }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.method === 'DELETE') {
          const id = urlObj.searchParams.get('id');
          if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'id parameter is required' }));
            return;
          }
          const success = deleteOutfitFromD1AndR2(id);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success }));
          return;
        }
      }

      // 3. DeepSeek V4.1 AI 프록시
      if (req.url.startsWith('/api/ai/deepseek')) {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            proxyHiveRequest(
              'https://api-cdn.thehive.ai/api/v3/chat/completions',
              parsed,
              res
            );
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          }
        });
        return;
      }

      // 4. Flux Schnell 패션 화보 프록시
      if (req.url.startsWith('/api/ai/flux')) {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            proxyHiveRequest(
              'https://api-cdn.thehive.ai/api/v3/black-forest-labs/flux-schnell',
              parsed,
              res
            );
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          }
        });
        return;
      }

      return metroMiddleware(req, res, next);
    };
  },
};

module.exports = config;
