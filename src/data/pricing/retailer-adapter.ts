import type { RegionCode, RetailerOfferInput } from "@/data/contracts/catalog";

export type RetailerLookup = {
  deviceSourceKey: string;
  variantSourceKey?: string;
  region: RegionCode;
};

export interface RetailerAdapter {
  readonly key: string;
  readonly regions: readonly RegionCode[];
  fetchOffers(lookup: RetailerLookup): Promise<unknown[]>;
  normalizeOffer(raw: unknown, lookup: RetailerLookup): RetailerOfferInput;
}
