"use client";

import { tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import { verifiedPreviewDevices } from "@/data/verified-preview";

type CompareRow = { label: string; left: string; right: string };
const features = tableFeatures({});

export function CompareLab() {
  const [leftSlug, setLeftSlug] = useState("oneplus-15");
  const [rightSlug, setRightSlug] = useState("galaxy-s26");
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const left = verifiedPreviewDevices.find((d) => d.slug === leftSlug) ?? verifiedPreviewDevices[0];
  const right = verifiedPreviewDevices.find((d) => d.slug === rightSlug) ?? verifiedPreviewDevices[1];

  const allData = useMemo<CompareRow[]>(() => [
    { label: "Market", left: left.market, right: right.market },
    { label: "Chipset", left: left.specs.chipset, right: right.specs.chipset },
    { label: "Display", left: left.specs.display, right: right.specs.display },
    { label: "Refresh rate", left: left.specs.refreshRate, right: right.specs.refreshRate },
    { label: "Battery", left: left.specs.battery, right: right.specs.battery },
    { label: "Charging", left: left.specs.charging, right: right.specs.charging },
    { label: "Cameras", left: left.specs.cameras, right: right.specs.cameras },
    { label: "Weight", left: left.specs.weight, right: right.specs.weight },
    { label: "Storage", left: left.specs.storage, right: right.specs.storage },
    { label: "Software", left: left.specs.os, right: right.specs.os },
  ], [left, right]);

  const data = useMemo(
    () => differencesOnly ? allData.filter((row) => row.left !== row.right) : allData,
    [allData, differencesOnly],
  );

  const columns = useMemo<Array<ColumnDef<typeof features, CompareRow>>>(() => [
    { accessorKey: "label", header: "Specification" },
    { accessorKey: "left", header: left.name },
    { accessorKey: "right", header: right.name },
  ], [left.name, right.name]);

  const table = useTable({ key: "compare-lab", features, columns, data });

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <DeviceSelect label="Device one" value={leftSlug} onChange={setLeftSlug} exclude={rightSlug} />
        <DeviceSelect label="Device two" value={rightSlug} onChange={setRightSlug} exclude={leftSlug} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3">
        <p className="text-xs text-[var(--muted)]">{data.length} of {allData.length} specification rows visible</p>
        <button
          type="button"
          aria-pressed={differencesOnly}
          onClick={() => setDifferencesOnly((value) => !value)}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${differencesOnly ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]"}`}
        >
          <ListFilter size={14} /> Differences only
        </button>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)] shadow-[var(--shadow-1)]">
        <div className="flex items-start gap-2 border-b border-[var(--line)] px-4 py-3 text-xs leading-5 text-[var(--muted)] sm:px-5">
          <BadgeCheck size={14} className="mt-0.5 shrink-0 text-[var(--positive)]" />
          Values below come only from attached primary sources in the preview catalog.
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-2 border-b border-[var(--line)] bg-[var(--surface-2)]">
            <DeviceColumnLabel name={left.name} market={left.market} />
            <DeviceColumnLabel name={right.name} market={right.market} border />
          </div>
          <div>
            {data.map((row) => (
              <div key={row.label} className="border-b border-[var(--line)] last:border-0">
                <p className="px-4 pt-4 text-[10px] font-bold uppercase tracking-[0.11em] text-[var(--muted)]">
                  {row.label}
                </p>
                <div className="grid grid-cols-2">
                  <div className="min-w-0 px-4 pb-4 pt-2 text-[13px] font-medium leading-5 text-[var(--ink)]">
                    {row.left}
                  </div>
                  <div className="min-w-0 border-l border-[var(--line)] px-4 pb-4 pt-2 text-[13px] font-medium leading-5 text-[var(--ink)]">
                    {row.right}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden max-h-[70vh] overflow-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[var(--surface-2)] shadow-[0_1px_0_var(--line)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border-b border-[var(--line)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--line)] last:border-0">
                  {row.getAllCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={index === 0
                        ? "w-[22%] px-5 py-4 text-xs font-semibold text-[var(--muted)]"
                        : "px-5 py-4 text-sm font-medium leading-5 text-[var(--ink)]"}
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DeviceColumnLabel({ name, market, border = false }: { name: string; market: string; border?: boolean }) {
  return (
    <div className={`min-w-0 px-4 py-3 ${border ? "border-l border-[var(--line)]" : ""}`}>
      <p className="truncate text-xs font-semibold text-[var(--ink)]">{name}</p>
      <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">{market}</p>
    </div>
  );
}

function DeviceSelect({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  exclude: string;
}) {
  return (
    <label className="rounded-[20px] border border-[var(--line)] bg-[var(--surface-1)] p-4">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[var(--ink)] outline-none">
        {verifiedPreviewDevices
          .filter((device) => device.slug !== exclude || device.slug === value)
          .map((device) => (
            <option key={device.slug} value={device.slug}>{device.name} · {device.market}</option>
          ))}
      </select>
    </label>
  );
}
