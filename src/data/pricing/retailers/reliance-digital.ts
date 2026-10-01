import { z } from "zod";
import type { RetailerAdapter, RetailerLookup } from "@/data/pricing/retailer-adapter";
import { assertRetailRegion, offerBase, type RetailerLoader } from "@/data/pricing/retailers/shared";

const schema = z.object({
  sku: z.string().min(1), productUrl: z.string().url(), offerPriceMinor: z.number().int().nonnegative(),
  mrpMinor: z.number().int().nonnegative().optional(), availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PREORDER", "UNKNOWN"]),
  checkedAt: z.string().datetime({ offset: true }), variantSourceKey: z.string().optional(),
});
export type RelianceDigitalRecord = z.input<typeof schema>;

export class RelianceDigitalAdapter implements RetailerAdapter {
  readonly key = "reliance-digital-in";
  readonly regions = ["IN"] as const;
  constructor(private readonly load: RetailerLoader<RelianceDigitalRecord>) {}
  fetchOffers(lookup: RetailerLookup) { assertRetailRegion(this.regions, lookup); return this.load(lookup); }
  normalizeOffer(raw: unknown, lookup: RetailerLookup) {
    assertRetailRegion(this.regions, lookup);
    const record = schema.parse(raw);
    const availability = record.availability === "IN_STOCK" ? "in_stock" : record.availability === "OUT_OF_STOCK" ? "out_of_stock" : record.availability === "PREORDER" ? "preorder" : "unknown";
    return offerBase(this.key, lookup, { variantSourceKey: record.variantSourceKey ?? lookup.variantSourceKey, currency: "INR", amountMinor: record.offerPriceMinor, listAmountMinor: record.mrpMinor, availability, offerUrl: record.productUrl, checkedAt: record.checkedAt });
  }
}
