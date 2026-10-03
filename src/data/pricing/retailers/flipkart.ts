import { z } from "zod";
import type { RetailerAdapter, RetailerLookup } from "@/data/pricing/retailer-adapter";
import { assertRetailRegion, offerBase, type RetailerLoader } from "@/data/pricing/retailers/shared";

const schema = z.object({
  listingId: z.string().min(1), productUrl: z.string().url(), sellingPriceMinor: z.number().int().nonnegative(),
  mrpMinor: z.number().int().nonnegative().optional(), stock: z.enum(["available", "unavailable", "preorder", "unknown"]),
  checkedAt: z.string().datetime({ offset: true }), variantSourceKey: z.string().optional(),
});
export type FlipkartRecord = z.input<typeof schema>;

export class FlipkartAdapter implements RetailerAdapter {
  readonly key = "flipkart-in";
  readonly regions = ["IN"] as const;
  constructor(private readonly load: RetailerLoader<FlipkartRecord>) {}
  fetchOffers(lookup: RetailerLookup) { assertRetailRegion(this.regions, lookup); return this.load(lookup); }
  normalizeOffer(raw: unknown, lookup: RetailerLookup) {
    assertRetailRegion(this.regions, lookup);
    const record = schema.parse(raw);
    const availability = record.stock === "available" ? "in_stock" : record.stock === "unavailable" ? "out_of_stock" : record.stock;
    return offerBase(this.key, lookup, { variantSourceKey: record.variantSourceKey ?? lookup.variantSourceKey, currency: "INR", amountMinor: record.sellingPriceMinor, listAmountMinor: record.mrpMinor, availability, offerUrl: record.productUrl, checkedAt: record.checkedAt });
  }
}
