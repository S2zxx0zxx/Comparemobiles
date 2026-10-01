import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const vivoIqooRecordSchema = z.object({
  recordKey: z.string().min(1), brand: z.enum(["vivo", "iQOO"]), deviceName: z.string().min(1), model: z.string().min(1).optional(),
  region: z.enum(["IN", "CN", "GLOBAL", "EU", "US", "JP", "KR", "OTHER"]), state: z.enum(["announced", "available", "discontinued"]),
  sourceUrl: z.string().url(), announcedAt: z.string().optional(), launchedAt: z.string().optional(), platformName: z.string().optional(),
  displaySpec: z.object({ type: z.string().optional(), size: z.number().optional(), resolution: z.string().optional(), refreshHz: z.number().int().optional() }).default({}),
  typicalBatteryMah: z.number().int().optional(), wiredChargeW: z.number().int().optional(), wirelessChargeW: z.number().int().optional(),
  weightGrams: z.number().optional(), osName: z.string().optional(), storageType: z.string().optional(),
  rearCameras: z.array(z.string()).default([]), frontCameras: z.array(z.string()).default([]),
  variants: z.array(z.object({ id: z.string().optional(), ramGb: z.number().int().optional(), storageGb: z.number().int().optional(), color: z.string().optional(), sku: z.string().optional() })).default([]),
});

export type VivoIqooOfficialRecord = z.input<typeof vivoIqooRecordSchema>;

export class VivoIqooOfficialImporter implements SourceImporter<VivoIqooOfficialRecord> {
  readonly key = "vivo-iqoo-official";
  readonly sourceType = "manufacturer" as const;
  constructor(private readonly load: ManufacturerLoader<VivoIqooOfficialRecord>) {}
  fetch(context: Parameters<ManufacturerLoader<VivoIqooOfficialRecord>>[0]) { return this.load(context); }
  transform(raw: VivoIqooOfficialRecord, context: Parameters<ManufacturerLoader<VivoIqooOfficialRecord>>[0]): DeviceImport {
    const record = vivoIqooRecordSchema.parse(raw);
    const region = normalizeManufacturerRegion(record.region, context);
    return {
      sourceKey: record.recordKey, brand: record.brand, name: record.deviceName, modelNumber: record.model, region, status: record.state,
      announcedAt: record.announcedAt, launchedAt: record.launchedAt,
      specs: {
        chipset: record.platformName, displayPanel: record.displaySpec.type, displaySizeInches: record.displaySpec.size,
        displayResolution: record.displaySpec.resolution, refreshRateHz: record.displaySpec.refreshHz, batteryMah: record.typicalBatteryMah,
        chargingW: record.wiredChargeW, wirelessChargingW: record.wirelessChargeW, weightGrams: record.weightGrams,
        rearCameras: record.rearCameras, frontCameras: record.frontCameras, storageStandard: record.storageType, operatingSystem: record.osName,
      },
      variants: record.variants.map((variant) => ({ sourceKey: variant.id, ramGb: variant.ramGb, storageGb: variant.storageGb, color: variant.color, sku: variant.sku, region })),
      claims: [primaryManufacturerClaim(record.sourceUrl, region, context)], offers: [],
    };
  }
}
