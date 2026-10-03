import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeviceCard } from "@/components/device-card";
import { SectionHeading } from "@/components/section-heading";
import { getDevicesByChipsetSlug, getDiscoverableChipsets } from "@/lib/chipsets";

export function generateStaticParams() {
  return getDiscoverableChipsets().map((chipset) => ({ slug: chipset.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chipset = getDiscoverableChipsets().find((item) => item.slug === slug);
  if (!chipset) return {};
  return {
    title: chipset.name + " phones",
    description: "Browse source-backed phones using " + chipset.name + " in the verified CompareMobile catalog.",
  };
}

export default async function ChipsetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chipset = getDiscoverableChipsets().find((item) => item.slug === slug);
  if (!chipset) notFound();
  const devices = getDevicesByChipsetSlug(slug);
  return (
    <section className="page-shell py-14 md:py-20">
      <SectionHeading
        eyebrow="Chipset"
        title={chipset.name}
        description="This route is generated only from source-backed catalog records. It does not infer compatibility or performance scores."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => <DeviceCard key={device.slug} device={device} />)}
      </div>
    </section>
  );
}
