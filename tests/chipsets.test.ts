import { describe, expect, it } from "vitest";
import { chipsetSlug, getDiscoverableChipsets, isDiscoverableChipset } from "@/lib/chipsets";

describe("chipset discovery", () => {
  it("creates stable SEO slugs", () => {
    expect(chipsetSlug("Snapdragon 8 Elite Gen 5")).toBe("snapdragon-8-elite-gen-5");
  });
  it("excludes placeholder chipset labels", () => {
    expect(isDiscoverableChipset("Market-dependent")).toBe(false);
    expect(isDiscoverableChipset("Official detail pending")).toBe(false);
  });
  it("returns unique discoverable chipset routes", () => {
    const chipsets = getDiscoverableChipsets();
    expect(new Set(chipsets.map((item) => item.slug)).size).toBe(chipsets.length);
  });
});
