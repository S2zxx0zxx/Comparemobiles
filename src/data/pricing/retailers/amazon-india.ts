import { z } from "zod";
import type { RetailerAdapter, RetailerLookup } from "@/data/pricing/retailer-adapter";
import { assertRetailRegion, offerBase, type RetailerLoader } from "@/data/pricing/retailers/shared";

const schema = z.object({
  asin: z.string().min(1),
  productUrl: z.string().url(),
  priceMinor: z.number().int().nonnegative(),
  mrpMinor: z.number().int().nonnegative().optional(),
  availabilityStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PREORDER", "UNKNOWN"]),
  checkedAt: z.string().datetime({ offset: true }),
  variantSourceKey: z.string().optional(),
});

export type AmazonIndiaRecord = z.input<typeof schema>;

export class AmazonIndiaAdapter implements RetailerAdapter {
  readonly key = "amazon-in";
  readonly regions = ["IN"] as const;
  constructor(private readonly load: RetailerLoader<AmazonIndiaRecord>) {}
  fetchOffers(lookup: RetailerLookup) { assertRetailRegion(this.regions, lookup); return this.load(lookup); }
  normalizeOffer(raw: unknown, lookup: RetailerLookup) {
    assertRetailRegion(this.regions, lookup);
    const record = schema.parse(raw);
    const availability = record.availabilityStatus === "IN_STOCK" ? "in_stock" : record.availabilityStatus === "OUT_OF_STOCK" ? "out_of_stock" : record.availabilityStatus === "PREORDER" ? "preorder" : "unknown";
    return offerBase(this.key, lookup, { variantSourceKey: record.variantSourceKey ?? lookup.variantSourceKey, currency: "INR", amountMinor: record.priceMinor, listAmountMinor: record.mrpMinor, availability, offerUrl: record.productUrl, checkedAt: record.checkedAt });
  }
}
