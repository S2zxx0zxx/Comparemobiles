-- Verified preview seed only. Production catalog ingestion must use the typed importer pipeline.
INSERT OR IGNORE INTO brands (id, name, slug, created_at, updated_at) VALUES
  (1, 'OnePlus', 'oneplus', '2026-10-01', '2026-10-01'),
  (2, 'Samsung', 'samsung', '2026-10-01', '2026-10-01'),
  (3, 'iQOO', 'iqoo', '2026-10-01', '2026-10-01');

INSERT OR IGNORE INTO brand_aliases (brand_id, alias, normalized_alias) VALUES
  (1, 'One Plus', 'one plus'),
  (1, 'OnePlus', 'oneplus'),
  (2, 'Samsung Electronics', 'samsung electronics'),
  (3, 'iQOO', 'iqoo'),
  (3, 'i QOO', 'i qoo');

INSERT OR IGNORE INTO devices (
  id, brand_id, source_key, identity_key, name, slug, market, status,
  chipset, display_size_milli_inches, refresh_rate_hz, battery_mah,
  charging_w, wireless_charging_w, specs_json, created_at, updated_at
) VALUES
  (
    1, 1, 'oneplus:15:IN', 'oneplus::oneplus 15::IN', 'OnePlus 15', 'oneplus-15-in', 'IN', 'available',
    'Snapdragon 8 Elite Gen 5', 6780, 165, 7300, 120, 50,
    '{"storageStandard":"UFS 4.1","operatingSystem":"OxygenOS 16 based on Android 16"}',
    '2026-10-01', '2026-10-01'
  ),
  (
    2, 2, 'samsung:galaxy-s26:IN', 'samsung::galaxy s26::IN', 'Galaxy S26', 'samsung-galaxy-s26-in', 'IN', 'available',
    NULL, 6300, 120, 4300, NULL, NULL,
    '{"operatingSystem":"Android"}',
    '2026-10-01', '2026-10-01'
  ),
  (
    3, 3, 'iqoo:16:CN', 'iqoo::iqoo 16::CN', 'iQOO 16', 'iqoo-16-cn', 'CN', 'available',
    '6th-gen Snapdragon 8 flagship platform (China naming)', 6850, 165, 8400, 100, 40,
    '{"storageStandard":"UFS 4.1","operatingSystem":"OriginOS 7 based on Android 17"}',
    '2026-10-01', '2026-10-01'
  );

INSERT INTO source_claims (device_id, field_path, source_type, source_url, region, confidence, verified_at)
SELECT 1, 'specs.*', 'manufacturer', 'https://www.oneplus.in/oneplus-15', 'IN', 'primary', '2026-10-01'
WHERE NOT EXISTS (SELECT 1 FROM source_claims WHERE device_id = 1 AND field_path = 'specs.*');

INSERT INTO source_claims (device_id, field_path, source_type, source_url, region, confidence, verified_at)
SELECT 2, 'specs.*', 'manufacturer', 'https://www.samsung.com/in/business/smartphones/galaxy-s/galaxy-s26-white-256gb-sm-s942wzwcins/', 'IN', 'primary', '2026-10-01'
WHERE NOT EXISTS (SELECT 1 FROM source_claims WHERE device_id = 2 AND field_path = 'specs.*');

INSERT INTO source_claims (device_id, field_path, source_type, source_url, region, confidence, verified_at)
SELECT 3, 'specs.*', 'manufacturer', 'https://www.vivo.com.cn/vivo/param/iqoo16', 'CN', 'primary', '2026-10-01'
WHERE NOT EXISTS (SELECT 1 FROM source_claims WHERE device_id = 3 AND field_path = 'specs.*');
