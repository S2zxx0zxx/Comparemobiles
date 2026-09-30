import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="CompareMobile home">
      <span className="relative grid size-8 place-items-center rounded-[10px] border border-[var(--line-strong)] bg-[var(--ink)] text-[var(--paper)] shadow-[var(--shadow-1)]">
        <span className="text-[13px] font-black tracking-[-0.08em]">CM</span>
        <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[var(--paper)] bg-[var(--accent)]" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--ink)]">CompareMobile</span>
    </Link>
  );
}
