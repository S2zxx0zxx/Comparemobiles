import type { Metadata } from "next";
import { DeviceCard } from "@/components/device-card";
import { SectionHeading } from "@/components/section-heading";
import { verifiedPreviewDevices } from "@/data/verified-preview";

export const metadata: Metadata = { title: "Phones", description: "Browse CompareMobile's source-backed smartphone catalog." };

export default async function PhonesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const devices = query ? verifiedPreviewDevices.filter((device) => `${device.brand} ${device.name} ${device.specs.chipset}`.toLowerCase().includes(query)) : verifiedPreviewDevices;

  return (
    <section className="page-shell py-14 md:py-20">
      <SectionHeading eyebrow="Catalog" title={query ? `Results for “${q}”` : "Phones"} description="This branch starts with a deliberately small, primary-source preview catalog. The production ingestion pipeline will expand coverage without compromising provenance." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => <DeviceCard key={device.slug} device={device} />)}
      </div>
      {!devices.length ? <div className="soft-panel mt-4 p-10 text-center"><p className="font-semibold">No verified preview result yet.</p><p className="mt-2 text-sm text-[var(--muted)]">Try a brand or model already present in the preview catalog.</p></div> : null}
    </section>
  );
}
