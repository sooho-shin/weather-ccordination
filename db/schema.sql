-- ========================================================
-- Cloudflare D1 Schema: dize-db
-- 날씨 맞춤 코디(OOTD) 영구 보관용 테이블
-- ========================================================

CREATE TABLE IF NOT EXISTS saved_outfits (
  id TEXT PRIMARY KEY,
  style_title TEXT NOT NULL,
  style_description TEXT,
  gender TEXT NOT NULL,
  temp_band TEXT,
  weather_state TEXT,
  temperature INTEGER,
  tpo TEXT,
  weather_defense_tags TEXT, -- JSON Array: ["#방수", "#일교차"]
  items TEXT,                -- JSON Array: OutfitItem[]
  image_url TEXT NOT NULL,   -- R2 서빙 이미지 URL (/api/images/outfits/{id}.png)
  image_r2_key TEXT,         -- R2 내부 키 (outfits/{id}.png)
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_saved_outfits_created_at ON saved_outfits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_outfits_gender ON saved_outfits(gender);
