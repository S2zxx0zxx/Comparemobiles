import { describe, expect, it } from "vitest";
import { deviceIdentityKey } from "../src/data/dedupe/device-identity";
import { normalizeBrand } from "../src/data/normalization";
import { prepareDeviceImport } from "../src/data/importer/prepare-device";
import { canLabelAsLivePrice, effectiveDiscountPercent } from "../src/data/pricing/integrity";

const baseDevice = {
  sourceKey: "manufacturer:demo-1",
  brand: "One Plus",
  name: "Demo Phone",
  modelNumber: "DM-100",
  region: "IN" as const,
  status: "available" as const,
  specs: {
    chipset: "Demo Silicon",
    batteryMah: 5000,
    chargingW: 80,
  },
  variants: [{ region: "IN" as const, ramGb: 12, storageGb: 256, color: "Black" }],
  claims: [
    {
      fieldPath: "specs.*",
      sourceType: "manufacturer" as const,
      sourceUrl: "https://example.com/demo-phone",
      region: "IN" as const,
      confidence: "primary" as const,
      verifiedAt: "2026-10-01",
    },
  ],
  offers: [],
};

describe("catalog pipeline", () => {
  it("normalizes known brand aliases", () => {
    expect(normalizeBrand("  One Plus ")).toBe("OnePlus");
  });

  it("keeps regional records distinct", () => {
    const indiaKey = deviceIdentityKey(baseDevice);
    const chinaKey = deviceIdentityKey({ ...baseDevice, region: "CN" });
    expect(indiaKey).not.toBe(chinaKey);
  });

  it("prepares a deterministic identity and variant identity", () => {
    const prepared = prepareDeviceImport(baseDevice);
    expect(prepared.device.brand).toBe("OnePlus");
    expect(prepared.slug).toContain("oneplus-demo-phone-in");
    expect(prepared.variants[0]?.identityKey).toContain("DM-100".toLowerCase());
  });

  it("rejects important spec fields without provenance", () => {
    expect(() =>
      prepareDeviceImport({
        ...baseDevice,
        claims: [{ ...baseDevice.claims[0], fieldPath: "specs.chipset" }],
      }),
    ).toThrow(/batteryMah/);
  });
});

describe("price integrity", () => {
  const offer = {
    retailerKey: "demo-retailer",
    region: "IN" as const,
    currency: "INR",
    amountMinor: 90000,
    listAmountMinor: 100000,
    availability: "in_stock" as const,
    offerUrl: "https://example.com/offer",
    checkedAt: "2026-10-01T04:00:00.000Z",
  };

  it("calculates discounts from integer minor units", () => {
    expect(effectiveDiscountPercent(offer)).toBe(10);
  });

  it("only labels fresh known-availability prices as live", () => {
    expect(canLabelAsLivePrice(offer, new Date("2026-10-01T05:00:00.000Z"))).toBe(true);
    expect(canLabelAsLivePrice(offer, new Date("2026-10-03T05:00:00.000Z"))).toBe(false);
  });
});
