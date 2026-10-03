import { describe, expect, it } from "vitest";
import { previewCatalogRepository } from "@/data/catalog/preview-repository";

describe("catalog repository boundary", () => {
  it("searches across brand, model and chipset without leaking UI implementation", async () => {
    const byBrand = await previewCatalogRepository.list({ q: "OnePlus" });
    const byChip = await previewCatalogRepository.list({ q: "Snapdragon 8 Elite Gen 5" });
    expect(byBrand.some((device) => device.brand === "OnePlus")).toBe(true);
    expect(byChip.length).toBeGreaterThan(0);
  });

  it("supports region and brand filters", async () => {
    const results = await previewCatalogRepository.list({ market: "India", brand: "Samsung" });
    expect(results.every((device) => device.market === "India" && device.brand === "Samsung")).toBe(true);
  });

  it("returns deterministic unique brand names", async () => {
    const brands = await previewCatalogRepository.listBrands();
    expect(new Set(brands).size).toBe(brands.length);
    expect(brands).toEqual([...brands].sort((a, b) => a.localeCompare(b)));
  });
});
