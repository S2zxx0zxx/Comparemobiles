import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import {
  type ManufacturerLoader,
  normalizeManufacturerRegion,
  primaryManufacturerClaim,
} from "@/data/importer/manufacturers/shared";

const longTailRecordSchema = z.object({
  sourceKey: z.string().min(1),
  brand: z.enum(["HONOR", "HMD", "Nokia", "ASUS", "ROG", "TECNO", "Infinix", "Lava"]),
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

export type LongTailOfficialRecord = z.input<typeof longTailRecordSchema>;

function transformRecord(
  raw: LongTailOfficialRecord,
  context: Parameters<ManufacturerLoader<LongTailOfficialRecord>>[0],
  allowedBrands: ReadonlySet<LongTailOfficialRecord["brand"]>,
): DeviceImport {
  const record = longTailRecordSchema.parse(raw);
  if (!allowedBrands.has(record.brand)) {
    throw new Error(`Brand ${record.brand} is not supported by this manufacturer adapter`);
  }
  const region = normalizeManufacturerRegion(record.region, context);
  return {
    sourceKey: record.sourceKey,
    brand: record.brand,
    name: record.productName,
    modelNumber: record.modelNumber,
    region,
    status: record.status,
    announcedAt: record.announcedAt,
    launchedAt: record.launchedAt,
    specs: {
      chipset: record.chipset,
      displayPanel: record.display.panel,
      displaySizeInches: record.display.sizeInches,
      displayResolution: record.display.resolution,
      refreshRateHz: record.display.refreshRateHz,
      batteryMah: record.batteryMah,
      chargingW: record.wiredChargingW,
      wirelessChargingW: record.wirelessChargingW,
      weightGrams: record.weightGrams,
      rearCameras: record.rearCameras,
      frontCameras: record.frontCameras,
      storageStandard: record.storageStandard,
      operatingSystem: record.operatingSystem,
    },
    variants: record.variants.map((variant) => ({ ...variant, region })),
    claims: [primaryManufacturerClaim(record.sourceUrl, region, context)],
    offers: [],
  };
}

abstract class LongTailBaseImporter implements SourceImporter<LongTailOfficialRecord> {
  abstract readonly key: string;
  readonly sourceType = "manufacturer" as const;
  protected abstract readonly allowedBrands: ReadonlySet<LongTailOfficialRecord["brand"]>;

  constructor(private readonly load: ManufacturerLoader<LongTailOfficialRecord>) {}

  fetch(context: Parameters<ManufacturerLoader<LongTailOfficialRecord>>[0]) {
    return this.load(context);
  }

  transform(
    raw: LongTailOfficialRecord,
    context: Parameters<ManufacturerLoader<LongTailOfficialRecord>>[0],
  ): DeviceImport {
    return transformRecord(raw, context, this.allowedBrands);
  }
}

export class HonorOfficialImporter extends LongTailBaseImporter {
  readonly key = "honor-official";
  protected readonly allowedBrands = new Set<LongTailOfficialRecord["brand"]>(["HONOR"]);
}

export class HmdNokiaOfficialImporter extends LongTailBaseImporter {
  readonly key = "hmd-nokia-official";
  protected readonly allowedBrands = new Set<LongTailOfficialRecord["brand"]>(["HMD", "Nokia"]);
}

export class AsusRogOfficialImporter extends LongTailBaseImporter {
  readonly key = "asus-rog-official";
  protected readonly allowedBrands = new Set<LongTailOfficialRecord["brand"]>(["ASUS", "ROG"]);
}

export class TranssionOfficialImporter extends LongTailBaseImporter {
  readonly key = "transsion-official";
  protected readonly allowedBrands = new Set<LongTailOfficialRecord["brand"]>(["TECNO", "Infinix"]);
}

export class LavaOfficialImporter extends LongTailBaseImporter {
  readonly key = "lava-official";
  protected readonly allowedBrands = new Set<LongTailOfficialRecord["brand"]>(["Lava"]);
}
