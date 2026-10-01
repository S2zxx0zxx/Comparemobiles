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

export const devices = sqliteTable(
  "devices",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    brandId: integer("brand_id").notNull().references(() => brands.id),
    identityKey: text("identity_key").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    modelNumber: text("model_number"),
    region: text("region").notNull(),
    status: text("status").notNull(),
    announcedAt: text("announced_at"),
    launchedAt: text("launched_at"),
    chipset: text("chipset"),
    displaySizeMilliInches: integer("display_size_milli_inches"),
    refreshRateHz: integer("refresh_rate_hz"),
    batteryMah: integer("battery_mah"),
    chargingW: integer("charging_w"),
    weightGrams: integer("weight_grams"),
    specsJson: text("specs_json", { mode: "json" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("devices_slug_unique").on(table.slug),
    uniqueIndex("devices_identity_unique").on(table.identityKey),
    index("devices_region_status_idx").on(table.region, table.status),
    index("devices_chipset_idx").on(table.chipset),
  ],
);

export const deviceVariants = sqliteTable(
  "device_variants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: integer("device_id").notNull().references(() => devices.id),
    sourceKey: text("source_key"),
    ramGb: integer("ram_gb"),
    storageGb: integer("storage_gb"),
    color: text("color"),
    region: text("region").notNull(),
    sku: text("sku"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
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
    verifiedAt: text("verified_at").notNull(),
  },
  (table) => [index("source_claims_device_field_idx").on(table.deviceId, table.fieldPath)],
);

export const retailers = sqliteTable(
  "retailers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    key: text("key").notNull(),
    homepageUrl: text("homepage_url"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("retailers_key_unique").on(table.key)],
);

export const priceSnapshots = sqliteTable(
  "price_snapshots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceVariantId: integer("device_variant_id").notNull().references(() => deviceVariants.id),
    retailerId: integer("retailer_id").notNull().references(() => retailers.id),
    region: text("region").notNull(),
    currency: text("currency").notNull(),
    amountMinor: integer("amount_minor").notNull(),
    listAmountMinor: integer("list_amount_minor"),
    availability: text("availability").notNull(),
    productUrl: text("product_url").notNull(),
    affiliateUrl: text("affiliate_url"),
    sponsored: integer("sponsored").notNull().default(0),
    checkedAt: text("checked_at").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("price_snapshots_variant_checked_idx").on(table.deviceVariantId, table.checkedAt),
    index("price_snapshots_retailer_checked_idx").on(table.retailerId, table.checkedAt),
  ],
);

export const changeHistory = sqliteTable(
  "change_history",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    fieldPath: text("field_path").notNull(),
    oldValue: text("old_value"),
    newValue: text("new_value"),
    sourceUrl: text("source_url"),
    changedAt: text("changed_at").notNull(),
  },
  (table) => [index("change_history_entity_idx").on(table.entityType, table.entityId, table.changedAt)],
);
