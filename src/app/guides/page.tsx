import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Guides" };

const guideArchitecture = [
  ["Buying guides", "Best-under-budget pages combine structured filters with editorial context."],
  ["Technology explainers", "UFS, LTPO, charging, camera sensors and chipsets explained without jargon inflation."],
  ["Decision guides", "Use-case-first guidance for parents, gaming, compact phones, cameras and long-term ownership."],
];

export default function GuidesPage() {
  return <section className="page-shell py-14 md:py-20"><SectionHeading eyebrow="Guides" title="Content that helps a decision." description="SEO pages are designed as useful product discovery surfaces first, articles second." /><div className="grid gap-4 md:grid-cols-3">{guideArchitecture.map(([title, text], index) => <article key={title} className="group rounded-[24px] border border-[var(--line)] bg-[var(--surface-1)] p-6"><span className="text-xs font-semibold text-[var(--muted)]">0{index + 1}</span><h2 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p><ArrowUpRight size={18} className="mt-8 text-[var(--muted)]" /></article>)}</div></section>;
}
