import type { RetailerOfferInput } from "@/data/contracts/catalog";
import { isFreshOffer } from "@/data/pricing/integrity";

export type OfferPresentationState = "live" | "stale" | "out_of_stock" | "preorder" | "unknown";

export function offerPresentationState(offer: RetailerOfferInput, now = new Date()): OfferPresentationState {
  if (offer.availability === "out_of_stock") return "out_of_stock";
  if (offer.availability === "preorder") return "preorder";
  if (offer.availability === "unknown") return "unknown";
  return isFreshOffer(offer, now) ? "live" : "stale";
}
