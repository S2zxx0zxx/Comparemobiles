import { ArrowLeftRight, Home, Search, SlidersHorizontal, Smartphone } from "lucide-react";
import Link from "next/link";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Phones", href: "/phones", icon: Smartphone },
  { label: "Compare", href: "/compare", icon: ArrowLeftRight },
  { label: "Finder", href: "/finder", icon: SlidersHorizontal },
  { label: "Search", href: "/phones", icon: Search },
] as const;

export function MobileDock() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[22px] border border-[var(--line-strong)] bg-[color:var(--paper-alpha-strong)] p-1.5 shadow-[var(--shadow-3)] backdrop-blur-2xl lg:hidden" aria-label="Mobile navigation">
      {items.map(({ label, href, icon: Icon }) => (
        <Link key={label} href={href} className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]">
          <Icon size={17} />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
