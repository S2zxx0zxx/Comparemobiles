PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS brands_slug_unique ON brands (slug);

CREATE TABLE IF NOT EXISTS brand_aliases (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  alias TEXT NOT NULL,
  normalized_alias TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS brand_aliases_normalized_unique ON brand_aliases (normalized_alias);
CREATE INDEX IF NOT EXISTS brand_aliases_brand_idx ON brand_aliases (brand_id);

CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  source_key TEXT NOT NULL,
  identity_key TEXT NOT NULL,
  model_number TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  market TEXT NOT NULL,
  status TEXT NOT NULL,
  announced_at TEXT,
  launched_at TEXT,
  chipset TEXT,
  display_size_milli_inches INTEGER,
  refresh_rate_hz INTEGER,
  battery_mah INTEGER,
  charging_w INTEGER,
  wireless_charging_w INTEGER,
  weight_milli_grams INTEGER,
  specs_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS devices_slug_unique ON devices (slug);
CREATE UNIQUE INDEX IF NOT EXISTS devices_identity_unique ON devices (identity_key);
CREATE UNIQUE INDEX IF NOT EXISTS devices_source_key_unique ON devices (source_key);
CREATE INDEX IF NOT EXISTS devices_market_status_idx ON devices (market, status);
CREATE INDEX IF NOT EXISTS devices_brand_idx ON devices (brand_id);

CREATE TABLE IF NOT EXISTS device_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_id INTEGER NOT NULL REFERENCES devices(id),
  source_key TEXT,
  identity_key TEXT NOT NULL,
  ram_gb INTEGER,
  storage_gb INTEGER,
  color TEXT,
  region TEXT NOT NULL,
  sku TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS device_variants_identity_unique ON device_variants (identity_key);
CREATE INDEX IF NOT EXISTS device_variants_device_idx ON device_variants (device_id);
CREATE INDEX IF NOT EXISTS device_variants_region_idx ON device_variants (region);

CREATE TABLE IF NOT EXISTS source_claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_id INTEGER NOT NULL REFERENCES devices(id),
  field_path TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  region TEXT NOT NULL,
  confidence TEXT NOT NULL,
  value_hash TEXT,
  verified_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS source_claims_device_field_idx ON source_claims (device_id, field_path);
CREATE INDEX IF NOT EXISTS source_claims_verified_idx ON source_claims (verified_at);

CREATE TABLE IF NOT EXISTS verification_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_id INTEGER REFERENCES devices(id),
  source_key TEXT NOT NULL,
  field_path TEXT NOT NULL,
  reason TEXT NOT NULL,
  payload_json TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  resolved_at TEXT
);
CREATE INDEX IF NOT EXISTS verification_queue_status_priority_idx ON verification_queue (status, priority);
CREATE INDEX IF NOT EXISTS verification_queue_device_idx ON verification_queue (device_id);

CREATE TABLE IF NOT EXISTS retailers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  retailer_key TEXT NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  homepage_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS retailers_key_unique ON retailers (retailer_key);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_id INTEGER NOT NULL REFERENCES devices(id),
  device_variant_id INTEGER REFERENCES device_variants(id),
  retailer_id INTEGER NOT NULL REFERENCES retailers(id),
  offer_url TEXT NOT NULL,
  currency TEXT NOT NULL,
  current_price_minor INTEGER NOT NULL,
  list_price_minor INTEGER,
  availability TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS offers_device_idx ON offers (device_id);
CREATE INDEX IF NOT EXISTS offers_variant_idx ON offers (device_variant_id);
CREATE INDEX IF NOT EXISTS offers_retailer_idx ON offers (retailer_id);
CREATE INDEX IF NOT EXISTS offers_checked_at_idx ON offers (checked_at);

CREATE TABLE IF NOT EXISTS price_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  offer_id INTEGER NOT NULL REFERENCES offers(id),
  amount_minor INTEGER NOT NULL,
  availability TEXT NOT NULL,
  captured_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS price_snapshots_offer_time_idx ON price_snapshots (offer_id, captured_at);

CREATE TABLE IF NOT EXISTS affiliate_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  offer_id INTEGER NOT NULL REFERENCES offers(id),
  provider TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS affiliate_links_offer_provider_unique ON affiliate_links (offer_id, provider);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  source_type TEXT NOT NULL,
  source_key TEXT NOT NULL,
  status TEXT NOT NULL,
  records_seen INTEGER NOT NULL DEFAULT 0,
  records_written INTEGER NOT NULL DEFAULT 0,
  records_rejected INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE INDEX IF NOT EXISTS ingestion_runs_source_time_idx ON ingestion_runs (source_key, started_at);
