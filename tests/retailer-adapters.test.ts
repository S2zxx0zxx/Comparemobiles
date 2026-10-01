import { describe, expect, it } from "vitest";
import { AmazonIndiaAdapter } from "@/data/pricing/retailers/amazon-india";
import { FlipkartAdapter } from "@/data/pricing/retailers/flipkart";
import { RelianceDigitalAdapter } from "@/data/pricing/retailers/reliance-digital";
import { offerPresentationState } from "@/data/pricing/status";

const lookup = { deviceSourceKey: "device:test", region: "IN" as const };
const checkedAt = "2026-10-01T08:00:00+05:30";

describe("retailer adapters", () => {
  it("normalizes Amazon India records", () => {
    const adapter = new AmazonIndiaAdapter(async () => []);
    const offer = adapter.normalizeOffer({ asin: "ABC", productUrl: "https://amazon.in/dp/ABC", priceMinor: 4999900, mrpMinor: 5499900, availabilityStatus: "IN_STOCK", checkedAt }, lookup);
    expect(offer.retailerKey).toBe("amazon-in");
    expect(offer.availability).toBe("in_stock");
  });

  it("normalizes Flipkart records", () => {
    const adapter = new FlipkartAdapter(async () => []);
    const offer = adapter.normalizeOffer({ listingId: "L1", productUrl: "https://www.flipkart.com/item", sellingPriceMinor: 3999900, stock: "preorder", checkedAt }, lookup);
    expect(offer.availability).toBe("preorder");
  });

  it("normalizes Reliance Digital records", () => {
    const adapter = new RelianceDigitalAdapter(async () => []);
    const offer = adapter.normalizeOffer({ sku: "R1", productUrl: "https://www.reliancedigital.in/item", offerPriceMinor: 3599900, availability: "OUT_OF_STOCK", checkedAt }, lookup);
    expect(offer.availability).toBe("out_of_stock");
  });

  it("classifies stale prices without presenting them as live", () => {
    const adapter = new AmazonIndiaAdapter(async () => []);
    const offer = adapter.normalizeOffer({ asin: "ABC", productUrl: "https://amazon.in/dp/ABC", priceMinor: 4999900, availabilityStatus: "IN_STOCK", checkedAt: "2026-09-29T08:00:00+05:30" }, lookup);
    expect(offerPresentationState(offer, new Date("2026-10-01T09:00:00+05:30"))).toBe("stale");
  });

  it("blocks India-only adapters from other regions", () => {
    const adapter = new FlipkartAdapter(async () => []);
    expect(() => adapter.normalizeOffer({}, { deviceSourceKey: "x", region: "US" })).toThrow(/does not support region/);
  });
});
