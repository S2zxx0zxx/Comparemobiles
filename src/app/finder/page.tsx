import type { Metadata } from "next";
import { FinderLab } from "@/components/finder-lab";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Phone Finder", description: "Filter source-backed devices by market and brand." };

export default function FinderPage() {
  return <section className="wide-shell py-14 md:py-20"><SectionHeading eyebrow="Finder" title="Narrow the field without noise." description="The first interactive filters are intentionally tied to verified catalog attributes. Technical filters activate as ingestion coverage expands." /><FinderLab /></section>;
}
