import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const brands = sqliteTable(
  "brands",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("brands_slug_unique").on(table.slug)],
);

export const brandAliases = sqliteTable(
  "brand_aliases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    brandId: integer("brand_id").notNull().references(() => brands.id),
    alias: text("alias").notNull(),
    normalizedAlias: text("normalized_alias").notNull(),
  },
  (table) => [
    uniqueIndex("brand_aliases_normalized_unique").on(table.normalizedAlias),
    index("brand_aliases_brand_idx").on(table.brandId),
  ],
);

export const devices = sqliteTable(
  "devices",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    brandId: integer("brand_id").notNull().references(() => brands.id),
    sourceKey: text("source_key").notNull(),
    identityKey: text("identity_key").notNull(),
    modelNumber: text("model_number"),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    market: text("market").notNull(),
    status: text("status").notNull(),
    announcedAt: text("announced_at"),
    launchedAt: text("launched_at"),
    chipset: text("chipset"),
    displaySizeMilliInches: integer("display_size_milli_inches"),
    refreshRateHz: integer("refresh_rate_hz"),
    batteryMah: integer("battery_mah"),
    chargingW: integer("charging_w"),
    wirelessChargingW: integer("wireless_charging_w"),
    weightMilliGrams: integer("weight_milli_grams"),
    specsJson: text("specs_json", { mode: "json" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("devices_slug_unique").on(table.slug),
    uniqueIndex("devices_identity_unique").on(table.identityKey),
    uniqueIndex("devices_source_key_unique").on(table.sourceKey),
    index("devices_market_status_idx").on(table.market, table.status),
    index("devices_brand_idx").on(table.brandId),
  ],
);

export const deviceVariants = sqliteTable(
  "device_variants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: integer("device_id").notNull().references(() => devices.id),
    sourceKey: text("source_key"),
    identityKey: text("identity_key").notNull(),
    ramGb: integer("ram_gb"),
    storageGb: integer("storage_gb"),
    color: text("color"),
    region: text("region").notNull(),
    sku: text("sku"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("device_variants_identity_unique").on(table.identityKey),
    index("device_variants_device_idx").on(table.deviceId),
    index("device_variants_region_idx").on(table.region),
  ],
);

export const sourceClaims = sqliteTable(
  "source_claims",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: integer("device_id").notNull().references(() => devices.id),
    fieldPath: text("field_path").notNull(),
    sourceType: text("source_type").notNull(),
    sourceUrl: text("source_url").notNull(),
    region: text("region").notNull(),
    confidence: text("confidence").notNull(),
    valueHash: text("value_hash"),
    verifiedAt: text("verified_at").notNull(),
  },
  (table) => [
    index("source_claims_device_field_idx").on(table.deviceId, table.fieldPath),
    index("source_claims_verified_idx").on(table.verifiedAt),
  ],
);

export const verificationQueue = sqliteTable(
  "verification_queue",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: integer("device_id").references(() => devices.id),
    sourceKey: text("source_key").notNull(),
    fieldPath: text("field_path").notNull(),
    reason: text("reason").notNull(),
    payloadJson: text("payload_json", { mode: "json" }),
    priority: integer("priority").notNull().default(100),
    status: text("status").notNull().default("pending"),
    createdAt: text("created_at").notNull(),
    resolvedAt: text("resolved_at"),
  },
  (table) => [
    index("verification_queue_status_priority_idx").on(table.status, table.priority),
    index("verification_queue_device_idx").on(table.deviceId),
  ],
);

export const retailers = sqliteTable(
  "retailers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    retailerKey: text("retailer_key").notNull(),
    name: text("name").notNull(),
    region: text("region").notNull(),
    homepageUrl: text("homepage_url"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("retailers_key_unique").on(table.retailerKey)],
);

export const offers = sqliteTable(
  "offers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: integer("device_id").notNull().references(() => devices.id),
    deviceVariantId: integer("device_variant_id").references(() => deviceVariants.id),
    retailerId: integer("retailer_id").notNull().references(() => retailers.id),
    offerUrl: text("offer_url").notNull(),
    currency: text("currency").notNull(),
    currentPriceMinor: integer("current_price_minor").notNull(),
    listPriceMinor: integer("list_price_minor"),
    availability: text("availability").notNull(),
    checkedAt: text("checked_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("offers_device_idx").on(table.deviceId),
    index("offers_variant_idx").on(table.deviceVariantId),
    index("offers_retailer_idx").on(table.retailerId),
    index("offers_checked_at_idx").on(table.checkedAt),
  ],
);

export const priceSnapshots = sqliteTable(
  "price_snapshots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    offerId: integer("offer_id").notNull().references(() => offers.id),
    amountMinor: integer("amount_minor").notNull(),
    availability: text("availability").notNull(),
    capturedAt: text("captured_at").notNull(),
  },
  (table) => [index("price_snapshots_offer_time_idx").on(table.offerId, table.capturedAt)],
);

export const affiliateLinks = sqliteTable(
  "affiliate_links",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    offerId: integer("offer_id").notNull().references(() => offers.id),
    provider: text("provider").notNull(),
    affiliateUrl: text("affiliate_url").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("affiliate_links_offer_provider_unique").on(table.offerId, table.provider),
  ],
);

export const ingestionRuns = sqliteTable(
  "ingestion_runs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sourceType: text("source_type").notNull(),
    sourceKey: text("source_key").notNull(),
    status: text("status").notNull(),
    recordsSeen: integer("records_seen").notNull().default(0),
    recordsWritten: integer("records_written").notNull().default(0),
    recordsRejected: integer("records_rejected").notNull().default(0),
    errorSummary: text("error_summary"),
    startedAt: text("started_at").notNull(),
    completedAt: text("completed_at"),
  },
  (table) => [index("ingestion_runs_source_time_idx").on(table.sourceKey, table.startedAt)],
);
