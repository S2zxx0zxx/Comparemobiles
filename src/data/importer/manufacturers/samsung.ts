import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const samsungRecordSchema = z.object({
  catalogId: z.string().min(1), title: z.string().min(1), modelCode: z.string().min(1).optional(),
  market: z.enum(["IN", "CN", "GLOBAL", "EU", "US", "JP", "KR", "OTHER"]),
  lifecycle: z.enum(["announced", "available", "discontinued"]), canonicalUrl: z.string().url(),
  announcedAt: z.string().optional(), launchedAt: z.string().optional(), processor: z.string().optional(),
  screen: z.object({ technology: z.string().optional(), inches: z.number().optional(), resolution: z.string().optional(), maxRefreshHz: z.number().int().optional() }).default({}),
  batteryCapacityMah: z.number().int().optional(), chargingWatts: z.number().int().optional(), wirelessChargingWatts: z.number().int().optional(),
  massGrams: z.number().optional(), platform: z.string().optional(), storageTech: z.string().optional(),
  rearCameraSummary: z.array(z.string()).default([]), frontCameraSummary: z.array(z.string()).default([]),
  skus: z.array(z.object({ key: z.string().optional(), memoryGb: z.number().int().optional(), storageGb: z.number().int().optional(), colorName: z.string().optional(), sku: z.string().optional() })).default([]),
});

export type SamsungOfficialRecord = z.input<typeof samsungRecordSchema>;

export class SamsungOfficialImporter implements SourceImporter<SamsungOfficialRecord> {
  readonly key = "samsung-official";
  readonly sourceType = "manufacturer" as const;
  constructor(private readonly load: ManufacturerLoader<SamsungOfficialRecord>) {}
  fetch(context: Parameters<ManufacturerLoader<SamsungOfficialRecord>>[0]) { return this.load(context); }
  transform(raw: SamsungOfficialRecord, context: Parameters<ManufacturerLoader<SamsungOfficialRecord>>[0]): DeviceImport {
    const record = samsungRecordSchema.parse(raw);
    const region = normalizeManufacturerRegion(record.market, context);
    return {
      sourceKey: record.catalogId, brand: "Samsung", name: record.title, modelNumber: record.modelCode, region, status: record.lifecycle,
      announcedAt: record.announcedAt, launchedAt: record.launchedAt,
      specs: {
        chipset: record.processor, displayPanel: record.screen.technology, displaySizeInches: record.screen.inches, displayResolution: record.screen.resolution,
        refreshRateHz: record.screen.maxRefreshHz, batteryMah: record.batteryCapacityMah, chargingW: record.chargingWatts,
        wirelessChargingW: record.wirelessChargingWatts, weightGrams: record.massGrams, rearCameras: record.rearCameraSummary,
        frontCameras: record.frontCameraSummary, storageStandard: record.storageTech, operatingSystem: record.platform,
      },
      variants: record.skus.map((variant) => ({ sourceKey: variant.key, ramGb: variant.memoryGb, storageGb: variant.storageGb, color: variant.colorName, sku: variant.sku, region })),
      claims: [primaryManufacturerClaim(record.canonicalUrl, region, context)], offers: [],
    };
  }
}
