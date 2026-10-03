"use client";

import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { verifiedPreviewDevices } from "@/data/verified-preview";
import { DeviceCard } from "@/components/device-card";

export function FinderLab({ initialMarket = "All", initialBrand = "All" }: { initialMarket?: string; initialBrand?: string }) {
  const router = useRouter();
  const brands = ["All", ...Array.from(new Set(verifiedPreviewDevices.map((device) => device.brand)))];
  const markets = ["All", ...Array.from(new Set(verifiedPreviewDevices.map((device) => device.market)))];
  const [market, setMarket] = useState(markets.includes(initialMarket) ? initialMarket : "All");
  const [brand, setBrand] = useState(brands.includes(initialBrand) ? initialBrand : "All");

  const results = useMemo(() => verifiedPreviewDevices.filter((device) =>
    (market === "All" || device.market === market) && (brand === "All" || device.brand === brand),
  ), [market, brand]);

  function updateUrl(nextMarket: string, nextBrand: string) {
    const params = new URLSearchParams();
    if (nextMarket !== "All") params.set("market", nextMarket);
    if (nextBrand !== "All") params.set("brand", nextBrand);
    router.replace(params.size ? `/finder?${params.toString()}` : "/finder", { scroll: false });
  }

  function updateMarket(next: string) { setMarket(next); updateUrl(next, brand); }
  function updateBrand(next: string) { setBrand(next); updateUrl(market, next); }
  function reset() { setMarket("All"); setBrand("All"); router.replace("/finder", { scroll: false }); }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-1)] lg:sticky lg:top-24">
        <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]"><SlidersHorizontal size={16} /> Filters</div>
        <FilterGroup title="Market" items={markets} value={market} onChange={updateMarket} />
        <div className="my-5 h-px bg-[var(--line)]" />
        <FilterGroup title="Brand" items={brands} value={brand} onChange={updateBrand} />
        <div className="mt-5 rounded-2xl bg-[var(--surface-2)] p-4 text-xs leading-5 text-[var(--muted)]">Filter state is reflected in the URL so a shortlist can be shared or bookmarked.</div>
      </aside>
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-[var(--muted)]"><strong className="text-[var(--ink)]">{results.length}</strong> verified preview devices</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Reset filters</button>
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
          <button key={item} type="button" aria-pressed={value === item} onClick={() => onChange(item)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${value === item ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"}`}>
            {item}
            {value === item ? <span className="size-1.5 rounded-full bg-[var(--accent)]" /> : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
