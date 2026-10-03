import { describe, expect, it } from "vitest";
import { buildPriceHistorySeries } from "@/data/pricing/history";

describe("price history series", () => {
  it("sorts snapshots chronologically and normalizes chart coordinates", () => {
    const series = buildPriceHistorySeries([
      { amountMinor: 4500000, capturedAt: "2026-10-02T00:00:00Z" },
      { amountMinor: 5000000, capturedAt: "2026-10-01T00:00:00Z" },
      { amountMinor: 4000000, capturedAt: "2026-10-03T00:00:00Z" },
    ]);
    expect(series.points.map((point) => point.amountMinor)).toEqual([5000000, 4500000, 4000000]);
    expect(series.points[0]?.x).toBe(0);
    expect(series.points[2]?.x).toBe(100);
    expect(series.min).toBe(4000000);
    expect(series.max).toBe(5000000);
  });

  it("drops invalid snapshots instead of charting them", () => {
    const series = buildPriceHistorySeries([
      { amountMinor: -1, capturedAt: "2026-10-01T00:00:00Z" },
      { amountMinor: 100, capturedAt: "not-a-date" },
    ]);
    expect(series.points).toEqual([]);
  });
});
