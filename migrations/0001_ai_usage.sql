CREATE TABLE IF NOT EXISTS ai_usage (
  id TEXT PRIMARY KEY,
  at INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('deepseek', 'flux'))
);
CREATE INDEX IF NOT EXISTS ai_usage_day ON ai_usage(kind, at);
CREATE INDEX IF NOT EXISTS ai_usage_session ON ai_usage(session_id, kind, at);
CREATE INDEX IF NOT EXISTS ai_usage_ip ON ai_usage(ip_hash, at);
CREATE TABLE IF NOT EXISTS photo_usage (
  id TEXT PRIMARY KEY,
  at INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind = 'photo')
);
CREATE INDEX IF NOT EXISTS photo_usage_day ON photo_usage(kind, at);
CREATE INDEX IF NOT EXISTS photo_usage_session ON photo_usage(session_id, kind, at);
CREATE INDEX IF NOT EXISTS photo_usage_ip ON photo_usage(ip_hash, at);
