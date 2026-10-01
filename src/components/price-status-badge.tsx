import { Clock3, CircleCheck, CircleHelp, PackageX, Sparkles } from "lucide-react";
import type { OfferPresentationState } from "@/data/pricing/status";

const config: Record<OfferPresentationState, { label: string; icon: typeof CircleCheck }> = {
  live: { label: "Live price", icon: CircleCheck },
  stale: { label: "Stale price", icon: Clock3 },
  out_of_stock: { label: "Out of stock", icon: PackageX },
  preorder: { label: "Preorder", icon: Sparkles },
  unknown: { label: "Availability unknown", icon: CircleHelp },
};

export function PriceStatusBadge({ state }: { state: OfferPresentationState }) {
  const item = config[state];
  const Icon = item.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
      <Icon size={13} aria-hidden="true" />
      {item.label}
    </span>
  );
}
