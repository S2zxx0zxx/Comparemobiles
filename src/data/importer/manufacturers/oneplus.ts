import { z } from "zod";
import type { SourceImporter } from "@/data/importer/source-importer";
import type { DeviceImport } from "@/data/contracts/catalog";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const onePlusRecordSchema = z.object({
  sourceKey: z.string().min(1),
  productName: z.string().min(1),
  modelNumber: z.string().min(1).optional(),
  region: z.enum(["IN", "CN", "GLOBAL", "EU", "US", "JP", "KR", "OTHER"]),
  status: z.enum(["announced", "available", "discontinued"]),
  sourceUrl: z.string().url(),
  announcedAt: z.string().optional(),
  launchedAt: z.string().optional(),
  chipset: z.string().optional(),
  display: z.object({
    panel: z.string().optional(),
    sizeInches: z.number().optional(),
    resolution: z.string().optional(),
    refreshRateHz: z.number().int().optional(),
  }).default({}),
  batteryMah: z.number().int().optional(),
  wiredChargingW: z.number().int().optional(),
  wirelessChargingW: z.number().int().optional(),
  weightGrams: z.number().optional(),
  operatingSystem: z.string().optional(),
  storageStandard: z.string().optional(),
  rearCameras: z.array(z.string()).default([]),
  frontCameras: z.array(z.string()).default([]),
  variants: z.array(z.object({
    sourceKey: z.string().optional(),
    ramGb: z.number().int().optional(),
    storageGb: z.number().int().optional(),
    color: z.string().optional(),
    sku: z.string().optional(),
  })).default([]),
});

export type OnePlusOfficialRecord = z.input<typeof onePlusRecordSchema>;

export class OnePlusOfficialImporter implements SourceImporter<OnePlusOfficialRecord> {
  readonly key = "oneplus-official";
  readonly sourceType = "manufacturer" as const;

  constructor(private readonly load: ManufacturerLoader<OnePlusOfficialRecord>) {}

  fetch(context: Parameters<ManufacturerLoader<OnePlusOfficialRecord>>[0]) {
    return this.load(context);
  }

  transform(raw: OnePlusOfficialRecord, context: Parameters<ManufacturerLoader<OnePlusOfficialRecord>>[0]): DeviceImport {
    const record = onePlusRecordSchema.parse(raw);
    const region = normalizeManufacturerRegion(record.region, context);
    return {
      sourceKey: record.sourceKey, brand: "OnePlus", name: record.productName, modelNumber: record.modelNumber, region, status: record.status,
      announcedAt: record.announcedAt, launchedAt: record.launchedAt,
      specs: {
        chipset: record.chipset, displayPanel: record.display.panel, displaySizeInches: record.display.sizeInches,
        displayResolution: record.display.resolution, refreshRateHz: record.display.refreshRateHz,
        batteryMah: record.batteryMah, chargingW: record.wiredChargingW, wirelessChargingW: record.wirelessChargingW,
        weightGrams: record.weightGrams, rearCameras: record.rearCameras, frontCameras: record.frontCameras,
        storageStandard: record.storageStandard, operatingSystem: record.operatingSystem,
      },
      variants: record.variants.map((variant) => ({ ...variant, region })),
      claims: [primaryManufacturerClaim(record.sourceUrl, region, context)],
      offers: [],
    };
  }
}
