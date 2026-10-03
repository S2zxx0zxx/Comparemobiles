import type { DeviceImport, RegionCode } from "@/data/contracts/catalog";
import type { ImporterContext } from "@/data/importer/source-importer";

export type ManufacturerLoader<RawRecord> = (
  context: ImporterContext,
) => Promise<RawRecord[]>;

export function checkedDate(context: ImporterContext) {
  return context.checkedAt.includes("T") ? context.checkedAt.slice(0, 10) : context.checkedAt;
}

export function normalizeManufacturerRegion(region: RegionCode, context: ImporterContext) {
  if (context.region !== region) {
    throw new Error("Importer context region " + context.region + " does not match record region " + region);
  }
  return region;
}

export function primaryManufacturerClaim(
  sourceUrl: string,
  region: RegionCode,
  context: ImporterContext,
): DeviceImport["claims"][number] {
  return {
    fieldPath: "specs.*",
    sourceType: "manufacturer",
    sourceUrl,
    region,
    confidence: "primary",
    verifiedAt: checkedDate(context),
  };
}
