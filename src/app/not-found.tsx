import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="page-shell grid min-h-[68vh] place-items-center py-16 text-center">
      <div className="max-w-xl">
        <span className="eyebrow">404 · Not found</span>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">This route is not in the catalog.</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[var(--muted)] md:text-base">The device, comparison or discovery page may have moved, or the record is not verified yet.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)]"><ArrowLeft size={16} /> Home</Link>
          <Link href="/phones" className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold"><Search size={16} /> Browse phones</Link>
        </div>
      </div>
    </section>
  );
}
