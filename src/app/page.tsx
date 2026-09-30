import { ArrowRight, ArrowUpRight, BadgeCheck, CircleGauge, Database, SearchCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { DeviceCard } from "@/components/device-card";
import { HeroSearch } from "@/components/hero-search";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { verifiedPreviewDevices } from "@/data/verified-preview";

export default function Home() {
  return (
    <>
      <section className="page-shell pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow"><BadgeCheck size={13} /> Source-first smartphone discovery</span>
            <h1 className="mt-6 text-balance text-[clamp(3.3rem,9vw,7.3rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-[var(--ink)]">
              Find the phone<br /><span className="text-[var(--muted)]">that actually fits.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-[var(--muted)] md:text-lg">
              Compare meaningful differences, trace important specs to their sources and cut through the marketing noise.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-9 flex justify-center"><HeroSearch /></div>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-[var(--muted)]">
              <Link href="/compare" className="rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 hover:text-[var(--ink)]">Compare devices</Link>
              <Link href="/finder" className="rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 hover:text-[var(--ink)]">Open phone finder</Link>
              <Link href="/phones" className="rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 hover:text-[var(--ink)]">Browse verified preview</Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-14 grid gap-3 md:grid-cols-4">
            {[
              { title: "Primary-source first", description: "No scraped competitor database", icon: ShieldCheck },
              { title: "Region aware", description: "India and global variants stay separate", icon: SearchCheck },
              { title: "Explainable data", description: "Source + checked date travel with specs", icon: Database },
              { title: "Built for speed", description: "Static-first pages, dynamic when useful", icon: CircleGauge },
            ].map(({ title, description, icon: Icon }) => (
              <div key={title} className="metric-card text-left">
                <Icon size={18} className="mb-8 text-[var(--muted)]" />
                <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="page-shell py-16 md:py-24">
        <SectionHeading
          eyebrow="Verified preview"
          title="Real devices. Primary sources attached."
          description="The initial catalog is deliberately small while the ingestion pipeline is built. Quality wins over an inflated device count."
          action={<Link href="/phones" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">View catalog <ArrowRight size={15} /></Link>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {verifiedPreviewDevices.map((device, index) => (
            <Reveal key={device.slug} delay={index * 0.05}><DeviceCard device={device} /></Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell py-16 md:py-24">
        <div className="soft-panel overflow-hidden p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow-text">Comparison lab</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em] md:text-5xl">See the difference.<br /><span className="text-[var(--muted)]">Skip the spreadsheet headache.</span></h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[var(--muted)] md:text-[15px]">A clean comparison surface prioritizes the specs that changed, keeps region context visible and preserves the original source trail.</p>
              <Link href="/compare" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)]">Open Compare Lab <ArrowUpRight size={16} /></Link>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-2)] p-3 md:p-5">
              {["Chipset", "Display", "Battery", "Cameras", "Software"].map((row, index) => (
                <div key={row} className="grid grid-cols-[1fr_1.2fr_1.2fr] gap-3 border-b border-[var(--line)] px-3 py-4 text-xs last:border-0">
                  <span className="font-semibold text-[var(--muted)]">{row}</span>
                  <span className="font-medium text-[var(--ink)]">{index === 0 ? "Verified value" : "Primary source"}</span>
                  <span className="font-medium text-[var(--ink)]">{index === 0 ? "Region-aware" : "Checked date"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 md:py-24">
        <SectionHeading eyebrow="Decision system" title="Discovery without the portal clutter." description="The product is organized around three actions: discover, compare and decide." />
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["01", "Discover", "Search brands, models and chipsets with a lightweight command-style experience.", "/phones"],
            ["02", "Compare", "Put devices side by side and focus on material differences instead of identical rows.", "/compare"],
            ["03", "Decide", "Use filters, source confidence and regional context to narrow the shortlist.", "/finder"],
          ].map(([number, title, description, href]) => (
            <Link key={title} href={href} className="group rounded-[24px] border border-[var(--line)] bg-[var(--surface-1)] p-6 transition hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-2)]">
              <span className="text-xs font-semibold text-[var(--muted)]">{number}</span>
              <h3 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
              <ArrowUpRight size={18} className="mt-8 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
