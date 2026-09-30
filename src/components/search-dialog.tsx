"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { verifiedPreviewDevices } from "@/data/verified-preview";

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return verifiedPreviewDevices;
    return verifiedPreviewDevices.filter((device) =>
      `${device.brand} ${device.name} ${device.specs.chipset}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Dialog.Root>
      <Dialog.Trigger className="search-trigger">
        <Search size={15} />
        <span className="hidden sm:inline">Search phones</span>
        <kbd className="hidden rounded-md border border-[var(--line)] bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--muted)] md:inline">⌘K</kbd>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[3px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-[12vh] z-50 w-[min(92vw,680px)] -translate-x-1/2 overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-[var(--paper)] shadow-[var(--shadow-3)] outline-none transition-[transform,opacity] data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0">
          <Dialog.Title className="sr-only">Search CompareMobile</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-[var(--line)] px-5">
            <Search size={19} className="text-[var(--muted)]" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search phone, brand or chipset"
              className="h-16 flex-1 bg-transparent text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            />
            <Dialog.Close className="icon-button" aria-label="Close search"><X size={16} /></Dialog.Close>
          </div>
          <div className="max-h-[55vh] overflow-y-auto p-3">
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {query ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Primary-source preview catalog"}
            </div>
            {results.length ? results.map((device) => (
              <Dialog.Close key={device.slug} render={<Link href={`/phones/${device.slug}`} className="search-result" />}>
                <span className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-bold">{device.brand.slice(0, 2).toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--ink)]">{device.name}</span>
                  <span className="block truncate text-xs text-[var(--muted)]">{device.market} · {device.specs.chipset}</span>
                </span>
                <ArrowRight size={16} className="text-[var(--muted)]" />
              </Dialog.Close>
            )) : (
              <div className="rounded-2xl border border-dashed border-[var(--line-strong)] p-8 text-center text-sm text-[var(--muted)]">
                No verified preview device matches this search yet.
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
