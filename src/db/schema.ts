import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    market: text("market").notNull(),
    status: text("status").notNull(),
    announcedAt: text("announced_at"),
    launchedAt: text("launched_at"),
    chipset: text("chipset"),
    displaySizeInches: integer("display_size_milli_inches"),
    refreshRateHz: integer("refresh_rate_hz"),
    batteryMah: integer("battery_mah"),
    chargingW: integer("charging_w"),
    weightGrams: integer("weight_grams"),
    specsJson: text("specs_json", { mode: "json" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("devices_slug_unique").on(table.slug)],
);

export const deviceVariants = sqliteTable("device_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: integer("device_id").notNull().references(() => devices.id),
  ramGb: integer("ram_gb"),
  storageGb: integer("storage_gb"),
  color: text("color"),
  region: text("region").notNull(),
  sku: text("sku"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: integer("device_id").notNull().references(() => devices.id),
  fieldPath: text("field_path").notNull(),
  sourceType: text("source_type").notNull(),
  sourceUrl: text("source_url").notNull(),
  region: text("region").notNull(),
  confidence: text("confidence").notNull(),
  verifiedAt: text("verified_at").notNull(),
});
