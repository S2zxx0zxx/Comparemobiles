import type { DeviceImport, DeviceSpecsInput } from "@/data/contracts/catalog";

const trackedSpecFields: Array<keyof DeviceSpecsInput> = [
  "chipset",
  "displayPanel",
  "displaySizeInches",
  "displayResolution",
  "refreshRateHz",
  "batteryMah",
  "chargingW",
  "wirelessChargingW",
  "weightGrams",
  "storageStandard",
  "operatingSystem",
];

function claimCovers(fieldPath: string, claimPath: string) {
  if (claimPath === "*" || claimPath === "specs.*") return true;
  return claimPath === fieldPath;
}

export function missingProvenancePaths(device: DeviceImport) {
  const presentPaths = trackedSpecFields
    .filter((field) => device.specs[field] !== undefined)
    .map((field) => `specs.${String(field)}`);

  return presentPaths.filter(
    (fieldPath) => !device.claims.some((claim) => claimCovers(fieldPath, claim.fieldPath)),
  );
}

export function assertProvenanceCoverage(device: DeviceImport) {
  const missing = missingProvenancePaths(device);
  if (missing.length) {
    throw new Error(`Missing provenance claims for: ${missing.join(", ")}`);
  }
}
