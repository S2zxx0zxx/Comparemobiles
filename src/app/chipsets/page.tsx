import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Cpu } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getDiscoverableChipsets } from "@/lib/chipsets";

export const metadata: Metadata = {
  title: "Chipsets",
  description: "Browse source-backed smartphones by chipset in the verified CompareMobile catalog.",
};

export default function ChipsetsPage() {
  const chipsets = getDiscoverableChipsets();
  return (
    <section className="page-shell py-14 md:py-20">
      <SectionHeading
        eyebrow="Chipsets"
        title="Browse phones by silicon."
        description="Only chipsets attached to source-backed preview records are listed here. Coverage expands with the verified catalog."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {chipsets.map((chipset) => (
          <Link
            key={chipset.slug}
            href={"/chipsets/" + chipset.slug}
            className="group rounded-[24px] border border-[var(--line)] bg-[var(--surface-1)] p-6 transition hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-2)]"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)]"><Cpu size={18} /></span>
              <ArrowUpRight size={18} className="text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
            </div>
            <h2 className="mt-10 text-xl font-semibold tracking-[-0.04em]">{chipset.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {chipset.count} verified preview {chipset.count === 1 ? "device" : "devices"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
