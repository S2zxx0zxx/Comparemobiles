import type { RetailerOfferInput } from "@/data/contracts/catalog";

export function effectiveDiscountPercent(offer: RetailerOfferInput) {
  if (!offer.listAmountMinor || offer.listAmountMinor <= 0 || offer.amountMinor >= offer.listAmountMinor) {
    return null;
  }

  return Math.round((1 - offer.amountMinor / offer.listAmountMinor) * 1000) / 10;
}

export function isFreshOffer(offer: RetailerOfferInput, now = new Date(), maxAgeHours = 24) {
  const checkedAt = new Date(offer.checkedAt);
  const ageMs = now.getTime() - checkedAt.getTime();
  return ageMs >= 0 && ageMs <= maxAgeHours * 60 * 60 * 1000;
}

export function canLabelAsLivePrice(offer: RetailerOfferInput, now = new Date()) {
  return offer.availability !== "unknown" && isFreshOffer(offer, now);
}
