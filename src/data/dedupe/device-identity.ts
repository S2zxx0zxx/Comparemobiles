import type { DeviceImport, RegionCode } from "@/data/contracts/catalog";
import { normalizeBrand, normalizedToken, slugify } from "@/data/normalization";

export function deviceIdentityKey(
  input: Pick<DeviceImport, "brand" | "name" | "modelNumber" | "region">,
) {
  const brand = slugify(normalizeBrand(input.brand));
  const model = input.modelNumber ? normalizedToken(input.modelNumber) : normalizedToken(input.name);
  return [brand, model, input.region].join("::");
}

export function deviceSlug(input: Pick<DeviceImport, "brand" | "name" | "region">) {
  const base = slugify(`${normalizeBrand(input.brand)} ${input.name}`);
  return input.region === "GLOBAL" ? base : `${base}-${input.region.toLowerCase()}`;
}

export function variantIdentityKey(input: {
  deviceIdentity: string;
  region: RegionCode;
  ramGb?: number;
  storageGb?: number;
  color?: string;
  sku?: string;
}) {
  return [
    input.deviceIdentity,
    input.region,
    input.sku ? normalizedToken(input.sku) : "-",
    input.ramGb ?? "-",
    input.storageGb ?? "-",
    input.color ? normalizedToken(input.color) : "-",
  ].join("::");
}
