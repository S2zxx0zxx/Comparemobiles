PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS brands_slug_unique ON brands (slug);

CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  brand_id INTEGER NOT NULL,
  identity_key TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  model_number TEXT,
  region TEXT NOT NULL,
  status TEXT NOT NULL,
  announced_at TEXT,
  launched_at TEXT,
  chipset TEXT,
  display_size_milli_inches INTEGER,
  refresh_rate_hz INTEGER,
  battery_mah INTEGER,
  charging_w INTEGER,
  weight_grams INTEGER,
  specs_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS devices_slug_unique ON devices (slug);
CREATE UNIQUE INDEX IF NOT EXISTS devices_identity_unique ON devices (identity_key);
CREATE INDEX IF NOT EXISTS devices_region_status_idx ON devices (region, status);
CREATE INDEX IF NOT EXISTS devices_chipset_idx ON devices (chipset);

CREATE TABLE IF NOT EXISTS device_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_id INTEGER NOT NULL,
  source_key TEXT,
  ram_gb INTEGER,
  storage_gb INTEGER,
  color TEXT,
  region TEXT NOT NULL,
  sku TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX IF NOT EXISTS device_variants_device_idx ON device_variants (device_id);
CREATE INDEX IF NOT EXISTS device_variants_region_idx ON device_variants (region);

CREATE TABLE IF NOT EXISTS source_claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_id INTEGER NOT NULL,
  field_path TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  region TEXT NOT NULL,
  confidence TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX IF NOT EXISTS source_claims_device_field_idx ON source_claims (device_id, field_path);

CREATE TABLE IF NOT EXISTS retailers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  homepage_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS retailers_key_unique ON retailers (key);

CREATE TABLE IF NOT EXISTS price_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  device_variant_id INTEGER NOT NULL,
  retailer_id INTEGER NOT NULL,
  region TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  list_amount_minor INTEGER,
  availability TEXT NOT NULL,
  product_url TEXT NOT NULL,
  affiliate_url TEXT,
  sponsored INTEGER NOT NULL DEFAULT 0,
  checked_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (device_variant_id) REFERENCES device_variants(id),
  FOREIGN KEY (retailer_id) REFERENCES retailers(id)
);

CREATE INDEX IF NOT EXISTS price_snapshots_variant_checked_idx ON price_snapshots (device_variant_id, checked_at);
CREATE INDEX IF NOT EXISTS price_snapshots_retailer_checked_idx ON price_snapshots (retailer_id, checked_at);

CREATE TABLE IF NOT EXISTS change_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  field_path TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  source_url TEXT,
  changed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS change_history_entity_idx ON change_history (entity_type, entity_id, changed_at);
