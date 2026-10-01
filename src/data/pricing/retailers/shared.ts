import type { RegionCode, RetailerOfferInput } from "@/data/contracts/catalog";
import type { RetailerLookup } from "@/data/pricing/retailer-adapter";

export type RetailerLoader<RawRecord> = (lookup: RetailerLookup) => Promise<RawRecord[]>;

export function assertRetailRegion(allowed: readonly RegionCode[], lookup: RetailerLookup) {
  if (!allowed.includes(lookup.region)) {
    throw new Error("Retailer does not support region " + lookup.region);
  }
}

export function offerBase(
  retailerKey: string,
  lookup: RetailerLookup,
  input: Omit<RetailerOfferInput, "retailerKey" | "region">,
): RetailerOfferInput {
  return { retailerKey, region: lookup.region, ...input };
}
