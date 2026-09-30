import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pb-28 pt-10 lg:pb-10">
      <div className="page-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-lg space-y-4">
          <BrandMark />
          <p className="text-sm leading-6 text-[var(--muted)]">Smartphone discovery and comparison built around source transparency, useful differences and fast decision-making.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          <Link href="/compare" className="hover:text-[var(--ink)]">Compare</Link>
          <Link href="/finder" className="hover:text-[var(--ink)]">Finder</Link>
          <Link href="/guides" className="hover:text-[var(--ink)]">Guides</Link>
        </div>
      </div>
    </footer>
  );
}
