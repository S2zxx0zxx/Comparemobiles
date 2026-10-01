import { LineChart } from "lucide-react";
import { buildPriceHistorySeries, type PriceHistorySnapshot } from "@/data/pricing/history";

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amountMinor / 100);
}

export function PriceHistoryChart({ snapshots, currency = "INR" }: { snapshots: PriceHistorySnapshot[]; currency?: string }) {
  const series = buildPriceHistorySeries(snapshots);

  if (series.points.length < 2) {
    return (
      <div className="rounded-[22px] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-6">
        <LineChart size={20} className="text-[var(--muted)]" />
        <h3 className="mt-8 text-lg font-semibold tracking-[-0.03em]">Price history needs verified snapshots</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">The chart stays empty until at least two timestamped retailer snapshots exist. CompareMobile does not synthesize a price curve.</p>
      </div>
    );
  }

  const path = series.points.map((point, index) => (index === 0 ? "M " : "L ") + point.x.toFixed(2) + " " + point.y.toFixed(2)).join(" ");
  return (
    <div className="rounded-[22px] border border-[var(--line-strong)] bg-[var(--surface-1)] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Verified price history</p><h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">{series.points.length} snapshots</h3></div>
        <div className="text-right text-xs text-[var(--muted)]"><div>Low {formatMoney(series.min, currency)}</div><div>High {formatMoney(series.max, currency)}</div></div>
      </div>
      <div className="mt-6 h-44 w-full overflow-hidden rounded-xl bg-[var(--surface-2)] p-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Verified price history line chart">
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
