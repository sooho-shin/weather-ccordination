const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');

const config = getDefaultConfig(__dirname);

const HIVE_SECRET_KEY = process.env.EXPO_PUBLIC_HIVE_SECRET_KEY || '';

/**
 * TheHive API 프록시 헬퍼 함수
 */
function proxyHiveRequest(targetUrl, reqBody, clientRes) {
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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// 개발 서버 미들웨어 확장 (로컬 브라우저 CORS 문제 해결)
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware) => {
    return (req, res, next) => {
      // CORS Preflight 처리
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        res.end();
        return;
      }

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
