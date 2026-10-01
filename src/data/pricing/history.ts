export type PriceHistorySnapshot = { amountMinor: number; capturedAt: string };

export type PriceHistoryPoint = PriceHistorySnapshot & { x: number; y: number };

export function buildPriceHistorySeries(snapshots: PriceHistorySnapshot[]) {
  const sorted = [...snapshots]
    .filter((snapshot) => Number.isFinite(snapshot.amountMinor) && snapshot.amountMinor >= 0 && !Number.isNaN(new Date(snapshot.capturedAt).getTime()))
    .sort((a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime());

  if (sorted.length === 0) return { points: [] as PriceHistoryPoint[], min: 0, max: 0 };
  const values = sorted.map((snapshot) => snapshot.amountMinor);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const denominator = Math.max(1, sorted.length - 1);

  return {
    min,
    max,
    points: sorted.map((snapshot, index) => ({
      ...snapshot,
      x: (index / denominator) * 100,
      y: 100 - ((snapshot.amountMinor - min) / range) * 100,
    })),
  };
}
