import { describe, expect, it } from "vitest";
import { canPresentAsCurrentPrice, discountPercent, isPriceFresh } from "@/data/pricing/effective-price";
import { outboundRetailUrl } from "@/data/pricing/affiliate";

describe("pricing integrity", () => {
  it("computes discounts only when a valid list price is higher", () => {
    expect(discountPercent({ amountMinor: 9000, listAmountMinor: 10000, currency: "INR", checkedAt: "2026-10-01T00:00:00+00:00", availability: "in_stock" })).toBe(10);
    expect(discountPercent({ amountMinor: 10000, listAmountMinor: 9000, currency: "INR", checkedAt: "2026-10-01T00:00:00+00:00", availability: "in_stock" })).toBe(0);
  });

  it("does not call stale or unknown offers current", () => {
    const now = new Date("2026-10-01T12:00:00Z");
    const fresh = { amountMinor: 10000, currency: "INR", checkedAt: "2026-10-01T06:00:00+00:00", availability: "in_stock" as const };
    const stale = { ...fresh, checkedAt: "2026-09-28T06:00:00+00:00" };
    expect(isPriceFresh(fresh, now)).toBe(true);
    expect(canPresentAsCurrentPrice(fresh, now)).toBe(true);
    expect(canPresentAsCurrentPrice(stale, now)).toBe(false);
    expect(canPresentAsCurrentPrice({ ...fresh, availability: "unknown" }, now)).toBe(false);
  });

  it("keeps affiliate destination separate from product source URL", () => {
    expect(outboundRetailUrl({ productUrl: "https://retailer.example/p", affiliateUrl: "https://affiliate.example/p" })).toBe("https://affiliate.example/p");
    expect(outboundRetailUrl({ productUrl: "https://retailer.example/p" })).toBe("https://retailer.example/p");
  });
});
