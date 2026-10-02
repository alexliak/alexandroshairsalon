-- Κριτικές προϊόντων (Cloudflare D1)
CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product    TEXT    NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  name       TEXT    NOT NULL,
  email      TEXT,
  title      TEXT,
  text       TEXT    NOT NULL,
  lang       TEXT    DEFAULT 'el',
  status     TEXT    NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  verified   INTEGER NOT NULL DEFAULT 0,          -- 1 = επιβεβαιωμένη αγορά (μπαίνει με τις πληρωμές)
  reply      TEXT,
  ip_hash    TEXT,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews (product, status);
CREATE INDEX IF NOT EXISTS idx_reviews_ip ON reviews (ip_hash, created_at);
