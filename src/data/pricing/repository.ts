import type { OfferPresentationState } from "@/data/pricing/status";
import type { PriceHistorySnapshot } from "@/data/pricing/history";

export type CatalogOfferView = {
  offerId: number;
  retailerKey: string;
  retailerName: string;
  region: string;
  currency: string;
  amountMinor: number;
  listAmountMinor?: number;
  availability: "in_stock" | "out_of_stock" | "preorder" | "unknown";
  offerUrl: string;
  outboundUrl: string;
  affiliateProvider?: string;
  checkedAt: string;
  state: OfferPresentationState;
};

export type RetailerPriceHistory = {
  offerId: number;
  retailerKey: string;
  retailerName: string;
  currency: string;
  snapshots: PriceHistorySnapshot[];
};

export interface PricingRepository {
  listDeviceOffers(deviceSlug: string): Promise<CatalogOfferView[]>;
  getOfferHistory(offerId: number): Promise<RetailerPriceHistory | undefined>;
}
