const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 로컬 Cloudflare D1 및 R2 에뮬레이션 디렉토리
const WRANGLER_STATE_DIR = path.resolve(__dirname, '../../../.wrangler/state/v3');
const D1_DB_FILE = path.join(WRANGLER_STATE_DIR, 'd1/dize-db.json');
const R2_BUCKET_DIR = path.join(WRANGLER_STATE_DIR, 'r2/dize-lookbooks');

// 초기 디렉토리 안전 생성
function ensureDirs() {
  const d1Dir = path.dirname(D1_DB_FILE);
  if (!fs.existsSync(d1Dir)) fs.mkdirSync(d1Dir, { recursive: true });
  if (!fs.existsSync(R2_BUCKET_DIR)) fs.mkdirSync(R2_BUCKET_DIR, { recursive: true });

  if (!fs.existsSync(D1_DB_FILE)) {
    fs.writeFileSync(D1_DB_FILE, JSON.stringify({ saved_outfits: [] }, null, 2), 'utf-8');
  }
}

ensureDirs();

/**
 * D1 데이터베이스 읽기 (로컬 SQLite 에뮬레이션)
 */
function readD1() {
  ensureDirs();
  try {
    const raw = fs.readFileSync(D1_DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { saved_outfits: [] };
  }
}

/**
 * D1 데이터베이스 쓰기 (로컬 SQLite 에뮬레이션)
 */
function writeD1(data) {
  ensureDirs();
  fs.writeFileSync(D1_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 원격 이미지 URL을 다운로드하여 Buffer로 반환
 */
function downloadImageBuffer(imageUrl) {
  return new Promise((resolve, reject) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return resolve(null);
    }

    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.split(';base64,').pop();
      return resolve(Buffer.from(base64Data, 'base64'));
    }

    const client = imageUrl.startsWith('https') ? https : http;
    client
      .get(imageUrl, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download image: status ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

/**
 * [D1 + R2] 코디 및 실사 이미지 저장
 */
async function saveOutfitToD1AndR2(payload) {
  ensureDirs();
  const db = readD1();

  const id = payload.id || `outfit_${Date.now()}`;
  const r2Key = `outfits/${id}.png`;
  const r2FilePath = path.join(R2_BUCKET_DIR, r2Key);
  const r2Dir = path.dirname(r2FilePath);
  if (!fs.existsSync(r2Dir)) fs.mkdirSync(r2Dir, { recursive: true });

  // 1. R2 에뮬레이터: 이미지 파일을 로컬 하드디스크 폴더에 저장
  let finalServedUrl = payload.imageUrl;
  try {
    if (typeof payload.imageUrl === 'string' && payload.imageUrl.startsWith('http')) {
      const buffer = await downloadImageBuffer(payload.imageUrl);
      if (buffer && buffer.length > 0) {
        fs.writeFileSync(r2FilePath, buffer);
        finalServedUrl = `/api/images/${r2Key}`;
      }
    }
  } catch (err) {
    console.warn('R2 로컬 이미지 저장 중 경고 (기존 URL 유지):', err.message);
  }

  // 2. D1 에뮬레이터: 메타데이터 및 이미지 경로 INSERT
  const record = {
    id,
    style_title: payload.styleTitle || '감각적인 맞춤 코디',
    style_description: payload.styleDescription || '',
    gender: payload.gender || 'female',
    temp_band: payload.tempBand || '',
    weather_state: payload.weatherState || 'Clear',
    temperature: payload.temperature ?? 20,
    tpo: payload.tpo || 'daily',
    weather_defense_tags: JSON.stringify(payload.weatherDefenseTags || []),
    items: JSON.stringify(payload.items || []),
    image_url: finalServedUrl,
    image_r2_key: r2Key,
    created_at: new Date().toISOString(),
  };

  // 기존 id 존재 시 업데이트, 없으면 추가
  const existingIdx = db.saved_outfits.findIndex((item) => item.id === id);
  if (existingIdx >= 0) {
    db.saved_outfits[existingIdx] = record;
  } else {
    db.saved_outfits.unshift(record);
  }

  writeD1(db);

  return {
    id: record.id,
    styleTitle: record.style_title,
    styleDescription: record.style_description,
    gender: record.gender,
    tempBand: record.temp_band,
    weatherState: record.weather_state,
    temperature: record.temperature,
    tpo: record.tpo,
    weatherDefenseTags: JSON.parse(record.weather_defense_tags),
    items: JSON.parse(record.items),
    imageUrl: record.image_url,
    imageR2Key: record.image_r2_key,
    createdAt: record.created_at,
  };
}

/**
 * [D1] 전체 저장된 코디 목록 조회
 */
function getSavedOutfitsFromD1() {
  const db = readD1();
  return (db.saved_outfits || []).map((row) => ({
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
}

/**
 * [D1 + R2] 코디 및 이미지 파일 삭제
 */
function deleteOutfitFromD1AndR2(id) {
  ensureDirs();
  const db = readD1();
  const target = db.saved_outfits.find((r) => r.id === id);

  if (target) {
    // R2 로컬 파일 삭제
    if (target.image_r2_key) {
      const r2FilePath = path.join(R2_BUCKET_DIR, target.image_r2_key);
      if (fs.existsSync(r2FilePath)) {
        try {
          fs.unlinkSync(r2FilePath);
        } catch {}
      }
    }
    db.saved_outfits = db.saved_outfits.filter((r) => r.id !== id);
    writeD1(db);
    return true;
  }
  return false;
}

/**
 * [R2] 로컬 하드디스크에서 이미지 파일 읽기
 */
function getR2ImageFile(r2Key) {
  ensureDirs();
  const cleanKey = r2Key.replace(/^\/+/, '').replace(/^api\/images\//, '');
  const r2FilePath = path.join(R2_BUCKET_DIR, cleanKey);
  if (fs.existsSync(r2FilePath)) {
    return fs.readFileSync(r2FilePath);
  }
  return null;
}

module.exports = {
  saveOutfitToD1AndR2,
  getSavedOutfitsFromD1,
  deleteOutfitFromD1AndR2,
  getR2ImageFile,
  D1_DB_FILE,
  R2_BUCKET_DIR,
};
