import type { DeviceImport, RegionCode } from "@/data/contracts/catalog";
import { deviceImportSchema } from "@/data/contracts/catalog";
import { brandAliases, regionAliases } from "@/data/normalization/aliases";

export function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizedToken(value: string) {
  return normalizeWhitespace(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function normalizeBrand(value: string) {
  const cleaned = normalizeWhitespace(value);
  return brandAliases[normalizedToken(cleaned)] ?? cleaned;
}

export function normalizeRegion(value: string): RegionCode {
  return regionAliases[normalizedToken(value)] ?? "OTHER";
}

export function slugify(value: string) {
  return normalizedToken(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeDeviceInput(input: unknown): DeviceImport {
  const parsed = deviceImportSchema.parse(input);
  return {
    ...parsed,
    brand: normalizeBrand(parsed.brand),
    name: normalizeWhitespace(parsed.name),
    modelNumber: parsed.modelNumber ? normalizeWhitespace(parsed.modelNumber) : undefined,
    variants: parsed.variants.map((variant) => ({
      ...variant,
      color: variant.color ? normalizeWhitespace(variant.color) : undefined,
      sku: variant.sku ? normalizeWhitespace(variant.sku) : undefined,
    })),
    claims: parsed.claims.map((claim) => ({
      ...claim,
      fieldPath: normalizeWhitespace(claim.fieldPath),
    })),
  };
}
