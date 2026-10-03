import type { PreparedDeviceImport } from "@/data/importer/prepare-device";
import { prepareDeviceImport } from "@/data/importer/prepare-device";

export function prepareImportBatch(records: unknown[]) {
  const accepted: PreparedDeviceImport[] = [];
  const rejected: Array<{ index: number; reason: string }> = [];
  const identities = new Set<string>();
  const sourceKeys = new Set<string>();

  records.forEach((record, index) => {
    try {
      const prepared = prepareDeviceImport(record);

      if (identities.has(prepared.identityKey)) {
        throw new Error(`Duplicate device identity: ${prepared.identityKey}`);
      }

      if (sourceKeys.has(prepared.device.sourceKey)) {
        throw new Error(`Duplicate source key: ${prepared.device.sourceKey}`);
      }

      identities.add(prepared.identityKey);
      sourceKeys.add(prepared.device.sourceKey);
      accepted.push(prepared);
    } catch (error) {
      rejected.push({
        index,
        reason: error instanceof Error ? error.message : "Unknown import error",
      });
    }
  });

  return { accepted, rejected };
}
