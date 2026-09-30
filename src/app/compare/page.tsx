import type { Metadata } from "next";
import { CompareLab } from "@/components/compare-lab";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Compare phones", description: "Compare source-backed smartphone specifications side by side." };

export default function ComparePage() {
  return <section className="wide-shell py-14 md:py-20"><SectionHeading eyebrow="Compare Lab" title="Meaningful differences, side by side." description="Switch between primary-source preview devices. No hidden winner score and no region mixing." /><CompareLab /></section>;
}
