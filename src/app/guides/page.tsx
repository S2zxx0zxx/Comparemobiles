import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { guideRegistry } from "@/content/guides/registry";

export const metadata: Metadata = {
  title: "Guides",
  description: "Source-aware smartphone buying guides, explainers and decision frameworks from CompareMobile.",
};

export default function GuidesPage() {
  return (
    <section className="page-shell py-14 md:py-20">
      <SectionHeading
        eyebrow="Guides"
        title="Content that helps a decision."
        description="Guide publishing is typed and source-gated: planned ideas can exist without sources, but published guides cannot."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {guideRegistry.map((guide, index) => (
          <article key={guide.slug} className="group rounded-[24px] border border-[var(--line)] bg-[var(--surface-1)] p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[var(--muted)]">0{index + 1}</span>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{guide.status}</span>
            </div>
            <h2 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">{guide.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{guide.description}</p>
            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="text-[11px] font-medium text-[var(--muted)]">{guide.region} · updated {guide.updatedAt}</span>
              <ArrowUpRight size={18} className="text-[var(--muted)]" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
