import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");
const isoTimestamp = z.string().datetime({ offset: true });

export const regionCodeSchema = z.enum(["IN", "CN", "GLOBAL", "EU", "US", "JP", "KR", "OTHER"]);
export const deviceStatusSchema = z.enum(["announced", "available", "discontinued"]);
export const sourceTypeSchema = z.enum([
  "manufacturer",
  "regulatory",
  "retailer",
  "press_release",
  "manual",
  "carrier",
]);
export const sourceConfidenceSchema = z.enum(["primary", "secondary"]);

export const sourceClaimSchema = z.object({
  fieldPath: z.string().min(1),
  sourceType: sourceTypeSchema,
  sourceUrl: z.string().url(),
  region: regionCodeSchema,
  confidence: sourceConfidenceSchema,
  verifiedAt: isoDate,
});

export const deviceSpecsSchema = z.object({
  chipset: z.string().min(1).optional(),
  displayPanel: z.string().min(1).optional(),
  displaySizeInches: z.number().positive().max(10).optional(),
  displayResolution: z.string().min(1).optional(),
  refreshRateHz: z.number().int().positive().max(1000).optional(),
  batteryMah: z.number().int().positive().max(20000).optional(),
  chargingW: z.number().int().nonnegative().max(1000).optional(),
  wirelessChargingW: z.number().int().nonnegative().max(1000).optional(),
  weightGrams: z.number().positive().max(1000).optional(),
  rearCameras: z.array(z.string().min(1)).default([]),
  frontCameras: z.array(z.string().min(1)).default([]),
  storageStandard: z.string().min(1).optional(),
  operatingSystem: z.string().min(1).optional(),
});

export const deviceVariantSchema = z.object({
  sourceKey: z.string().min(1).optional(),
  ramGb: z.number().int().positive().max(128).optional(),
  storageGb: z.number().int().positive().max(8192).optional(),
  color: z.string().min(1).optional(),
  region: regionCodeSchema,
  sku: z.string().min(1).optional(),
});

export const retailerOfferInputSchema = z.object({
  retailerKey: z.string().min(1),
  variantSourceKey: z.string().min(1).optional(),
  region: regionCodeSchema,
  currency: z.string().length(3).transform((value) => value.toUpperCase()),
  amountMinor: z.number().int().nonnegative(),
  listAmountMinor: z.number().int().nonnegative().optional(),
  availability: z.enum(["in_stock", "out_of_stock", "preorder", "unknown"]),
  offerUrl: z.string().url(),
  checkedAt: isoTimestamp,
});

export const deviceImportSchema = z.object({
  sourceKey: z.string().min(1),
  brand: z.string().min(1),
  name: z.string().min(1),
  modelNumber: z.string().min(1).optional(),
  region: regionCodeSchema,
  status: deviceStatusSchema,
  announcedAt: isoDate.optional(),
  launchedAt: isoDate.optional(),
  specs: deviceSpecsSchema,
  variants: z.array(deviceVariantSchema).default([]),
  claims: z.array(sourceClaimSchema).min(1),
  offers: z.array(retailerOfferInputSchema).default([]),
});

export type RegionCode = z.infer<typeof regionCodeSchema>;
export type DeviceImport = z.infer<typeof deviceImportSchema>;
export type DeviceSpecsInput = z.infer<typeof deviceSpecsSchema>;
export type SourceClaim = z.infer<typeof sourceClaimSchema>;
export type RetailerOfferInput = z.infer<typeof retailerOfferInputSchema>;
