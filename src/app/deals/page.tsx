import type { Metadata } from "next";
import { BadgeIndianRupee, ShieldCheck } from "lucide-react";
import { PriceStatusBadge } from "@/components/price-status-badge";
import { PriceHistoryChart } from "@/components/price-history-chart";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Deals",
  description: "Source-aware smartphone pricing with freshness, stock and retailer-state rules.",
};

const states = ["live", "stale", "preorder", "out_of_stock", "unknown"] as const;

export default function DealsPage() {
  return (
    <section className="page-shell py-14 md:py-20">
      <SectionHeading
        eyebrow="Deals"
        title="Price intelligence comes after price integrity."
        description="Amazon India, Flipkart and Reliance Digital adapters normalize retailer feeds into one strict offer contract. No timestamped source means no live-price claim."
      />
      <div className="soft-panel grid gap-5 p-6 md:grid-cols-2 md:p-8">
        <div className="rounded-[22px] bg-[var(--surface-2)] p-6">
          <BadgeIndianRupee size={20} />
          <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">Retailer-ready pricing layer</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Provider adapters are ready for verified feed wiring. Product URLs and affiliate URLs remain separate so monetization never rewrites source data.</p>
        </div>
        <div className="rounded-[22px] bg-[var(--surface-2)] p-6">
          <ShieldCheck size={20} />
          <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">No fake urgency</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">No invented “lowest ever” badge, countdown or bank-offer math without evidence.</p>
        </div>
      </div>
      <div className="mt-5 rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Offer presentation states</p>
        <div className="mt-4 flex flex-wrap gap-2">{states.map((state) => <PriceStatusBadge key={state} state={state} />)}</div>
        <p className="mt-4 max-w-2xl text-xs leading-5 text-[var(--muted)]">A fresh in-stock offer may be labeled live. Old data is visibly stale; preorder, out-of-stock and unknown availability are never collapsed into the same state.</p>
      </div>
      <div className="mt-5"><PriceHistoryChart snapshots={[]} currency="INR" /></div>
    </section>
  );
}
