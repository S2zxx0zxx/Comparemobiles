import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { verifiedPreviewDevices } from "@/data/verified-preview";

export const metadata: Metadata = { title: "Brands" };

export default function BrandsPage() {
  const brands = Array.from(new Set(verifiedPreviewDevices.map((device) => device.brand)));
  return <section className="page-shell py-14 md:py-20"><SectionHeading eyebrow="Brands" title="Browse by manufacturer." description="Brand pages will inherit the same source and region rules as every device record." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{brands.map((brand) => <Link key={brand} href={`/phones?q=${encodeURIComponent(brand)}`} className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-1)] p-6 text-xl font-semibold tracking-[-0.04em] transition hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-2)]">{brand}</Link>)}</div></section>;
}
