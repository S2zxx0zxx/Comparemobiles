import type { DeviceImport } from "@/data/contracts/catalog";
import { deviceIdentityKey, deviceSlug, variantIdentityKey } from "@/data/dedupe/device-identity";
import { normalizeDeviceInput } from "@/data/normalization";
import { assertProvenanceCoverage } from "@/data/provenance/coverage";

export type PreparedDeviceImport = {
  device: DeviceImport;
  identityKey: string;
  slug: string;
  variants: Array<DeviceImport["variants"][number] & { identityKey: string }>;
};

export function prepareDeviceImport(input: unknown): PreparedDeviceImport {
  const device = normalizeDeviceInput(input);
  assertProvenanceCoverage(device);

  const identityKey = deviceIdentityKey(device);
  const slug = deviceSlug(device);

  return {
    device,
    identityKey,
    slug,
    variants: device.variants.map((variant) => ({
      ...variant,
      identityKey: variantIdentityKey({
        deviceIdentity: identityKey,
        region: variant.region,
        ramGb: variant.ramGb,
        storageGb: variant.storageGb,
        color: variant.color,
        sku: variant.sku,
      }),
    })),
  };
}
