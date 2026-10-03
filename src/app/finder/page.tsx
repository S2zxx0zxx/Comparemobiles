import type { Metadata } from "next";
import { FinderLab } from "@/components/finder-lab";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Phone Finder", description: "Filter source-backed devices by market and brand." };

export default async function FinderPage({ searchParams }: { searchParams: Promise<{ market?: string; brand?: string }> }) {
  const { market, brand } = await searchParams;
  return (
    <section className="wide-shell py-14 md:py-20">
      <SectionHeading eyebrow="Finder" title="Narrow the field without noise." description="Verified filters are shareable through the URL. Technical filters activate as ingestion coverage expands." />
      <FinderLab initialMarket={market} initialBrand={brand} />
    </section>
  );
}
