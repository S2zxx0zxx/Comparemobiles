import type { Metadata } from "next";
import { ArrowLeftRight, BadgeCheck, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhoneVisual } from "@/components/phone-visual";
import { getPreviewDevice, verifiedPreviewDevices } from "@/data/verified-preview";
import { buildProductJsonLd, safeJsonLd } from "@/lib/seo/product-jsonld";

export function generateStaticParams() {
  return verifiedPreviewDevices.map((device) => ({ slug: device.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const device = getPreviewDevice(slug);
  return device ? { title: device.name, description: `${device.name} source-backed specifications and comparison context.` } : {};
}

export default async function PhoneDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const device = getPreviewDevice(slug);
  if (!device) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const productJsonLd = buildProductJsonLd(device, siteUrl);

  const rows = [
    ["Chipset", device.specs.chipset],
    ["Display", device.specs.display],
    ["Refresh rate", device.specs.refreshRate],
    ["Battery", device.specs.battery],
    ["Charging", device.specs.charging],
    ["Cameras", device.specs.cameras],
    ["Weight", device.specs.weight],
    ["Storage", device.specs.storage],
    ["Software", device.specs.os],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }} />
      <section className="page-shell py-12 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="soft-panel min-h-[430px] p-4"><PhoneVisual accent={device.accent} label={device.name} /></div>
          <div>
            <div className="flex flex-wrap gap-2"><span className="eyebrow"><BadgeCheck size={13} /> Primary-source record</span><span className="eyebrow"><MapPin size={13} /> {device.market}</span></div>
            <p className="mt-8 text-sm font-semibold text-[var(--muted)]">{device.brand}</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">{device.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">{device.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/compare" className="inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)]"><ArrowLeftRight size={16} /> Compare</Link><a href={device.sources[0]?.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold"><ExternalLink size={16} /> Official source</a></div>
          </div>
        </div>
      </section>

      <section className="page-shell py-10 md:py-16">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Display", device.specs.display], ["Battery", device.specs.battery], ["Refresh", device.specs.refreshRate], ["Weight", device.specs.weight]].map(([label, value]) => <div key={label} className="metric-card"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p><p className="mt-3 text-lg font-semibold tracking-[-0.03em]">{value}</p></div>)}
        </div>
      </section>

      <section className="page-shell py-10 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)]">
            <div className="border-b border-[var(--line)] p-5"><h2 className="text-xl font-semibold tracking-[-0.04em]">Key specifications</h2></div>
            {rows.map(([label, value]) => <div key={label} className="grid gap-2 border-b border-[var(--line)] px-5 py-4 last:border-0 sm:grid-cols-[170px_1fr]"><span className="text-xs font-semibold text-[var(--muted)]">{label}</span><span className="text-sm font-medium leading-6">{value}</span></div>)}
          </div>
          <aside className="h-fit rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-1)] p-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-[var(--positive)]" /> Source trail</div>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Region and verification date stay attached so specifications from different markets are not silently merged.</p>
            <div className="mt-5 space-y-3">{device.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-[var(--line)] p-4 transition hover:bg-[var(--surface-2)]"><p className="text-xs font-semibold leading-5">{source.label}</p><p className="mt-2 text-[11px] text-[var(--muted)]">{source.region} · checked {source.checkedAt}</p></a>)}</div>
          </aside>
        </div>
      </section>
    </>
  );
}
