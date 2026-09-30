import type { Metadata } from "next";
import { BadgeIndianRupee, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return <section className="page-shell py-14 md:py-20"><SectionHeading eyebrow="Deals" title="Price intelligence comes after price integrity." description="Retailer and affiliate feeds will plug into a separate pricing layer. Until a price can be timestamped and sourced, it will not be presented as live." /><div className="soft-panel grid gap-5 p-6 md:grid-cols-2 md:p-8"><div className="rounded-[22px] bg-[var(--surface-2)] p-6"><BadgeIndianRupee size={20} /><h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">Live price feed</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Adapter planned for retailer/affiliate feeds with checked-at timestamps and region-specific variants.</p></div><div className="rounded-[22px] bg-[var(--surface-2)] p-6"><ShieldCheck size={20} /><h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">No fake urgency</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">No invented “lowest ever” badge, countdown or bank-offer math without evidence.</p></div></div></section>;
}
