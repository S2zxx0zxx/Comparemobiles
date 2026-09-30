"use client";

import { tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table";
import { BadgeCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { verifiedPreviewDevices } from "@/data/verified-preview";

type CompareRow = { label: string; left: string; right: string };
const features = tableFeatures({});

export function CompareLab() {
  const [leftSlug, setLeftSlug] = useState("oneplus-15");
  const [rightSlug, setRightSlug] = useState("galaxy-s26");
  const left = verifiedPreviewDevices.find((d) => d.slug === leftSlug) ?? verifiedPreviewDevices[0];
  const right = verifiedPreviewDevices.find((d) => d.slug === rightSlug) ?? verifiedPreviewDevices[1];

  const data = useMemo<CompareRow[]>(() => [
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
      <div className="overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)] shadow-[var(--shadow-1)]">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-5 py-3 text-xs text-[var(--muted)]">
          <BadgeCheck size={14} className="text-[var(--positive)]" /> Values below come only from attached primary sources in the preview catalog.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="sticky top-0 bg-[var(--surface-2)]">
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
                    <td key={cell.id} className={index === 0 ? "w-[22%] px-5 py-4 text-xs font-semibold text-[var(--muted)]" : "px-5 py-4 text-sm font-medium leading-5 text-[var(--ink)]"}>
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

function DeviceSelect({ label, value, onChange, exclude }: { label: string; value: string; onChange: (value: string) => void; exclude: string }) {
  return (
    <label className="rounded-[20px] border border-[var(--line)] bg-[var(--surface-1)] p-4">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[var(--ink)] outline-none">
        {verifiedPreviewDevices.filter((device) => device.slug !== exclude || device.slug === value).map((device) => (
          <option key={device.slug} value={device.slug}>{device.name} · {device.market}</option>
        ))}
      </select>
    </label>
  );
}
