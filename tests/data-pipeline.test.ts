import { describe, expect, it } from "vitest";
import { prepareDeviceBatch, prepareDeviceImport } from "@/data/importers/pipeline";
import { normalizeBrand, normalizeRegion, slugify } from "@/data/normalization";
import { missingProvenancePaths } from "@/data/provenance/coverage";

const validDevice = {
  sourceKey: "manufacturer:example-x1:in",
  brand: "  One Plus ",
  name: " Example X1 ",
  modelNumber: "EX-1",
  region: "IN",
  status: "available",
  specs: {
    chipset: "Example SoC",
    batteryMah: 5000,
    refreshRateHz: 120,
  },
  claims: [
    {
      fieldPath: "specs.*",
      sourceType: "manufacturer",
      sourceUrl: "https://example.com/device",
      region: "IN",
      confidence: "primary",
      verifiedAt: "2026-10-01",
    },
  ],
};

describe("catalog normalization", () => {
  it("normalizes known brands and regions", () => {
    expect(normalizeBrand(" one plus ")).toBe("OnePlus");
    expect(normalizeRegion("India")).toBe("IN");
    expect(slugify("iQOO 16 Pro")).toBe("iqoo-16-pro");
  });

  it("prepares a stable regional identity", () => {
    const prepared = prepareDeviceImport(validDevice);
    expect(prepared.payload.brand).toBe("OnePlus");
    expect(prepared.slug).toBe("oneplus-example-x1-in");
    expect(prepared.identityKey).toBe("oneplus::ex-1::IN");
  });

  it("rejects duplicate device identities inside one import batch", () => {
    expect(() => prepareDeviceBatch([validDevice, validDevice])).toThrow(/Duplicate device identity/);
  });
});

describe("provenance coverage", () => {
  it("reports fields without a matching claim", () => {
    const parsed = {
      ...validDevice,
      claims: [
        {
          ...validDevice.claims[0],
          fieldPath: "specs.chipset",
        },
      ],
    };
    const prepared = prepareDeviceImport({
      ...parsed,
      specs: { chipset: "Example SoC" },
    });
    expect(missingProvenancePaths(prepared.payload)).toEqual([]);
  });

  it("rejects an imported spec that lacks provenance", () => {
    expect(() =>
      prepareDeviceImport({
        ...validDevice,
        claims: [{ ...validDevice.claims[0], fieldPath: "specs.chipset" }],
      }),
    ).toThrow(/Missing provenance claims/);
  });
});
