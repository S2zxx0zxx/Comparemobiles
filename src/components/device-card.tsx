import { ArrowUpRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import type { Device } from "@/lib/device";
import { PhoneVisual } from "@/components/phone-visual";

export function DeviceCard({ device }: { device: Device }) {
  return (
    <article className="device-card group">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow"><BadgeCheck size={13} /> Primary source</span>
        <span className="text-[11px] font-medium text-[var(--muted)]">{device.market}</span>
      </div>
      <PhoneVisual accent={device.accent} label={device.name} />
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">{device.brand}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{device.name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span className="spec-chip">{device.specs.refreshRate}</span>
          <span className="spec-chip">{device.specs.battery}</span>
        </div>
        <Link href={`/phones/${device.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
          Explore device <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
