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
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--line-strong)] bg-[color:var(--paper-alpha-strong)] px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {items.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
        >
          <Icon size={16} strokeWidth={1.9} />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
