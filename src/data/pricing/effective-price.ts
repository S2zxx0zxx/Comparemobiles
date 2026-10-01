export type PriceSnapshot = {
  amountMinor: number;
  listAmountMinor?: number;
  currency: string;
  checkedAt: string;
  availability: "in_stock" | "out_of_stock" | "preorder" | "unknown";
};

export function discountPercent(snapshot: PriceSnapshot) {
  const { amountMinor, listAmountMinor } = snapshot;
  if (!listAmountMinor || listAmountMinor <= amountMinor || listAmountMinor <= 0) return 0;
  return Math.round(((listAmountMinor - amountMinor) / listAmountMinor) * 100);
}

export function isPriceFresh(snapshot: PriceSnapshot, now = new Date(), maxAgeHours = 24) {
  const checkedAt = new Date(snapshot.checkedAt);
  if (Number.isNaN(checkedAt.getTime())) return false;
  const ageMs = now.getTime() - checkedAt.getTime();
  return ageMs >= 0 && ageMs <= maxAgeHours * 60 * 60 * 1000;
}

export function canPresentAsCurrentPrice(snapshot: PriceSnapshot, now = new Date()) {
  return snapshot.availability !== "unknown" && isPriceFresh(snapshot, now);
}
