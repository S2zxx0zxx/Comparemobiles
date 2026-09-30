"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { verifiedPreviewDevices } from "@/data/verified-preview";
import { DeviceCard } from "@/components/device-card";

export function FinderLab() {
  const [market, setMarket] = useState("All");
  const [brand, setBrand] = useState("All");
  const brands = ["All", ...Array.from(new Set(verifiedPreviewDevices.map((device) => device.brand)))];
  const markets = ["All", ...Array.from(new Set(verifiedPreviewDevices.map((device) => device.market)))];

  const results = useMemo(() => verifiedPreviewDevices.filter((device) =>
    (market === "All" || device.market === market) && (brand === "All" || device.brand === brand),
  ), [market, brand]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-1)] lg:sticky lg:top-24">
        <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]"><SlidersHorizontal size={16} /> Filters</div>
        <FilterGroup title="Market" items={markets} value={market} onChange={setMarket} />
        <div className="my-5 h-px bg-[var(--line)]" />
        <FilterGroup title="Brand" items={brands} value={brand} onChange={setBrand} />
        <div className="mt-5 rounded-2xl bg-[var(--surface-2)] p-4 text-xs leading-5 text-[var(--muted)]">More technical filters will activate as verified catalog coverage grows.</div>
      </aside>
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-[var(--muted)]"><strong className="text-[var(--ink)]">{results.length}</strong> verified preview devices</p>
          <button type="button" onClick={() => { setMarket("All"); setBrand("All"); }} className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Reset filters</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((device) => <DeviceCard key={device.slug} device={device} />)}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, items, value, onChange }: { title: string; items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{title}</legend>
      <div className="space-y-1.5">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${value === item ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"}`}>
            {item}
            {value === item ? <span className="size-1.5 rounded-full bg-[var(--accent)]" /> : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
