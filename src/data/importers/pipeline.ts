import type { DeviceImport } from "@/data/contracts/catalog";
import { deviceImportSchema } from "@/data/contracts/catalog";
import { deviceIdentityKey, deviceSlug } from "@/data/dedupe/device-identity";
import { normalizeDeviceInput } from "@/data/normalization";
import { assertProvenanceCoverage } from "@/data/provenance/coverage";

export type PreparedDeviceImport = {
  identityKey: string;
  slug: string;
  payload: DeviceImport;
};

export function prepareDeviceImport(input: unknown): PreparedDeviceImport {
  const parsed = deviceImportSchema.parse(input);
  const normalized = normalizeDeviceInput(parsed);
  assertProvenanceCoverage(normalized);

  return {
    identityKey: deviceIdentityKey(normalized),
    slug: deviceSlug(normalized),
    payload: normalized,
  };
}

export function prepareDeviceBatch(inputs: unknown[]) {
  const prepared = inputs.map(prepareDeviceImport);
  const seen = new Set<string>();

  for (const item of prepared) {
    if (seen.has(item.identityKey)) {
      throw new Error(`Duplicate device identity in import batch: ${item.identityKey}`);
    }
    seen.add(item.identityKey);
  }

  return prepared;
}
