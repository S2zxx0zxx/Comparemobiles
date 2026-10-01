import { describe, expect, it } from "vitest";
import { prepareDeviceImport } from "@/data/importer/prepare-device";
import { OnePlusOfficialImporter } from "@/data/importer/manufacturers/oneplus";
import { SamsungOfficialImporter } from "@/data/importer/manufacturers/samsung";
import { VivoIqooOfficialImporter } from "@/data/importer/manufacturers/vivo-iqoo";

const context = { checkedAt: "2026-10-01", region: "IN" as const };

describe("manufacturer adapters", () => {
  it("maps OnePlus official records into the canonical contract", () => {
    const importer = new OnePlusOfficialImporter(async () => []);
    const canonical = importer.transform({
      sourceKey: "oneplus:test:in", productName: "OnePlus Test", modelNumber: "OP-T1", region: "IN", status: "available",
      sourceUrl: "https://www.oneplus.in/test", chipset: "Snapdragon Test",
      display: { panel: "AMOLED", sizeInches: 6.7, refreshRateHz: 120 }, batteryMah: 5000,
      variants: [{ ramGb: 12, storageGb: 256 }],
    }, context);
    const prepared = prepareDeviceImport(canonical);
    expect(prepared.device.brand).toBe("OnePlus");
    expect(prepared.device.specs.batteryMah).toBe(5000);
    expect(prepared.variants[0]?.region).toBe("IN");
  });

  it("maps Samsung source-specific field names", () => {
    const importer = new SamsungOfficialImporter(async () => []);
    const canonical = importer.transform({
      catalogId: "samsung:test:in", title: "Galaxy Test", modelCode: "SM-T100", market: "IN", lifecycle: "available",
      canonicalUrl: "https://www.samsung.com/in/test", processor: "Exynos Test",
      screen: { technology: "Dynamic AMOLED", inches: 6.3, maxRefreshHz: 120 }, batteryCapacityMah: 4300,
      skus: [{ memoryGb: 8, storageGb: 256, colorName: "Black" }],
    }, context);
    expect(prepareDeviceImport(canonical).device.brand).toBe("Samsung");
  });

  it("keeps iQOO brand identity while using the vivo/iQOO adapter", () => {
    const importer = new VivoIqooOfficialImporter(async () => []);
    const canonical = importer.transform({
      recordKey: "iqoo:test:in", brand: "iQOO", deviceName: "iQOO Test", region: "IN", state: "available",
      sourceUrl: "https://www.iqoo.com/in/test", platformName: "Snapdragon Test",
      displaySpec: { type: "AMOLED", size: 6.8, refreshHz: 144 }, typicalBatteryMah: 6000,
    }, context);
    expect(prepareDeviceImport(canonical).device.brand).toBe("iQOO");
  });

  it("rejects a record transformed under the wrong market context", () => {
    const importer = new SamsungOfficialImporter(async () => []);
    expect(() => importer.transform({
      catalogId: "samsung:test:cn", title: "Galaxy Test", market: "CN", lifecycle: "available",
      canonicalUrl: "https://www.samsung.com/cn/test", screen: {},
    }, context)).toThrow(/does not match record region/);
  });
});
