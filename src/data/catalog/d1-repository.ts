import { and, eq, inArray, like, or } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { z } from "zod";
import type { CatalogQuery, CatalogRepository } from "@/data/catalog/repository";
import {
  brands,
  deviceVariants,
  devices,
  sourceClaims,
} from "@/db/schema";
import type { Device, DeviceSource, DeviceSpecs } from "@/lib/device";

type D1Schema = {
  brands: typeof brands;
  deviceVariants: typeof deviceVariants;
  devices: typeof devices;
  sourceClaims: typeof sourceClaims;
};

const specsJsonSchema = z.object({
  displayPanel: z.string().optional(),
  displayResolution: z.string().optional(),
  rearCameras: z.array(z.string()).optional(),
  frontCameras: z.array(z.string()).optional(),
  storageStandard: z.string().optional(),
  operatingSystem: z.string().optional(),
}).passthrough();

const marketLabels: Record<string, string> = {
  IN: "India",
  CN: "China",
  GLOBAL: "Global",
  EU: "Europe",
  US: "United States",
  JP: "Japan",
  KR: "South Korea",
};

const brandAccents: Record<string, string> = {
  Apple: "#8b8d92",
  ASUS: "#458cff",
  Google: "#4285f4",
  HMD: "#6256ff",
  HONOR: "#00a4ef",
  Infinix: "#6fcf42",
  Lava: "#e24c3d",
  Motorola: "#4d8cff",
  Nothing: "#d8302f",
  Nokia: "#124191",
  OnePlus: "#ff5038",
  OPPO: "#16a566",
  POCO: "#ffd400",
  ROG: "#e82c2c",
  Redmi: "#ff6b35",
  Samsung: "#6f8dff",
  TECNO: "#2596ff",
  Xiaomi: "#ff6900",
  iQOO: "#ffd52a",
  realme: "#ffc915",
  vivo: "#4b78ff",
};

type Db = DrizzleD1Database<D1Schema>;

type DeviceRow = {
  id: number;
  name: string;
  slug: string;
  market: string;
  status: string;
  chipset: string | null;
  displaySizeMilliInches: number | null;
  refreshRateHz: number | null;
  batteryMah: number | null;
  chargingW: number | null;
  wirelessChargingW: number | null;
  weightMilliGrams: number | null;
  specsJson: unknown;
  brand: string;
};

function explicit(value: string | undefined) {
  return value?.trim() || "Not verified";
}

function displayLabel(row: DeviceRow, extra: z.infer<typeof specsJsonSchema>) {
  const pieces = [
    row.displaySizeMilliInches ? `${(row.displaySizeMilliInches / 1000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}-inch` : undefined,
    extra.displayPanel,
    extra.displayResolution,
  ].filter(Boolean);
  return pieces.length ? pieces.join(" · ") : "Not verified";
}

function cameraLabel(extra: z.infer<typeof specsJsonSchema>) {
  const rear = extra.rearCameras?.length ? `${extra.rearCameras.join(" + ")} rear` : "";
  const front = extra.frontCameras?.length ? `${extra.frontCameras.join(" + ")} front` : "";
  return explicit([rear, front].filter(Boolean).join(" · "));
}

function statusLabel(status: string) {
  if (status === "available") return "Available";
  if (status === "announced") return "Announced";
  if (status === "discontinued") return "Discontinued";
  return status;
}

function sourcesFor(
  deviceId: number,
  claims: Array<typeof sourceClaims.$inferSelect>,
  brand: string,
): DeviceSource[] {
  return claims
    .filter((claim) => claim.deviceId === deviceId)
    .map((claim) => ({
      label: `${brand} · ${claim.sourceType} source`,
      url: claim.sourceUrl,
      region: marketLabels[claim.region] ?? claim.region,
      checkedAt: claim.verifiedAt,
      confidence: claim.confidence === "secondary" ? "secondary" : "primary",
    }));
}

function specsFor(
  row: DeviceRow,
  variants: Array<typeof deviceVariants.$inferSelect>,
): DeviceSpecs {
  const parsed = specsJsonSchema.safeParse(row.specsJson ?? {});
  const extra = parsed.success ? parsed.data : {};
  const storageValues = [...new Set(
    variants
      .filter((variant) => variant.deviceId === row.id && variant.storageGb)
      .map((variant) => variant.storageGb as number),
  )].sort((a, b) => a - b);

  const storageCapacity = storageValues.length
    ? storageValues.map((value) => value >= 1024 ? `${value / 1024}TB` : `${value}GB`).join(" / ")
    : "";
  const storage = [storageCapacity, extra.storageStandard].filter(Boolean).join(" · ");

  return {
    chipset: explicit(row.chipset ?? undefined),
    display: displayLabel(row, extra),
    refreshRate: row.refreshRateHz ? `Up to ${row.refreshRateHz}Hz` : "Not verified",
    battery: row.batteryMah ? `${row.batteryMah.toLocaleString("en-IN")}mAh` : "Not verified",
    charging: [
      row.chargingW ? `${row.chargingW}W wired` : "",
      row.wirelessChargingW ? `${row.wirelessChargingW}W wireless` : "",
    ].filter(Boolean).join(" · ") || "Not verified",
    cameras: cameraLabel(extra),
    weight: row.weightMilliGrams ? `${row.weightMilliGrams / 1000}g` : "Not verified",
    storage: explicit(storage),
    os: explicit(extra.operatingSystem),
  };
}

function toDevice(
  row: DeviceRow,
  claims: Array<typeof sourceClaims.$inferSelect>,
  variants: Array<typeof deviceVariants.$inferSelect>,
): Device {
  const sources = sourcesFor(row.id, claims, row.brand);
  return {
    slug: row.slug,
    brand: row.brand,
    name: row.name,
    market: marketLabels[row.market] ?? row.market,
    status: statusLabel(row.status),
    accent: brandAccents[row.brand] ?? "#6f7278",
    summary: sources.length
      ? `Verified catalog record with ${sources.length} attached source${sources.length === 1 ? "" : "s"}.`
      : "Catalog record awaiting source presentation metadata.",
    specs: specsFor(row, variants),
    sources,
  };
}

export function createD1CatalogRepository(db: Db): CatalogRepository {
  return {
    async list(query: CatalogQuery = {}) {
      const conditions = [
        query.q?.trim()
          ? or(
              like(devices.name, `%${query.q.trim()}%`),
              like(brands.name, `%${query.q.trim()}%`),
              like(devices.chipset, `%${query.q.trim()}%`),
            )
          : undefined,
        query.brand?.trim() ? like(brands.name, `%${query.brand.trim()}%`) : undefined,
        query.market?.trim() ? eq(devices.market, query.market.trim()) : undefined,
        query.chipset?.trim() ? like(devices.chipset, `%${query.chipset.trim()}%`) : undefined,
      ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));

      const rows = await db
        .select({
          id: devices.id,
          name: devices.name,
          slug: devices.slug,
          market: devices.market,
          status: devices.status,
          chipset: devices.chipset,
          displaySizeMilliInches: devices.displaySizeMilliInches,
          refreshRateHz: devices.refreshRateHz,
          batteryMah: devices.batteryMah,
          chargingW: devices.chargingW,
          wirelessChargingW: devices.wirelessChargingW,
          weightMilliGrams: devices.weightMilliGrams,
          specsJson: devices.specsJson,
          brand: brands.name,
        })
        .from(devices)
        .innerJoin(brands, eq(devices.brandId, brands.id))
        .where(conditions.length ? and(...conditions) : undefined);

      if (!rows.length) return [];

      const ids = rows.map((row) => row.id);
      const [claims, variants] = await Promise.all([
        db.select().from(sourceClaims).where(inArray(sourceClaims.deviceId, ids)),
        db.select().from(deviceVariants).where(inArray(deviceVariants.deviceId, ids)),
      ]);

      return rows.map((row) => toDevice(row, claims, variants));
    },

    async getBySlug(slug) {
      const rows = await db
        .select({
          id: devices.id,
          name: devices.name,
          slug: devices.slug,
          market: devices.market,
          status: devices.status,
          chipset: devices.chipset,
          displaySizeMilliInches: devices.displaySizeMilliInches,
          refreshRateHz: devices.refreshRateHz,
          batteryMah: devices.batteryMah,
          chargingW: devices.chargingW,
          wirelessChargingW: devices.wirelessChargingW,
          weightMilliGrams: devices.weightMilliGrams,
          specsJson: devices.specsJson,
          brand: brands.name,
        })
        .from(devices)
        .innerJoin(brands, eq(devices.brandId, brands.id))
        .where(eq(devices.slug, slug))
        .limit(1);

      const row = rows[0];
      if (!row) return undefined;

      const [claims, variants] = await Promise.all([
        db.select().from(sourceClaims).where(eq(sourceClaims.deviceId, row.id)),
        db.select().from(deviceVariants).where(eq(deviceVariants.deviceId, row.id)),
      ]);
      return toDevice(row, claims, variants);
    },

    async listBrands() {
      const rows = await db.select({ name: brands.name }).from(brands).orderBy(brands.name);
      return rows.map((row) => row.name);
    },
  };
}
