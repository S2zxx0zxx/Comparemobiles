import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  ["Phones", "/phones"],
  ["Compare", "/compare"],
  ["Finder", "/finder"],
  ["Upcoming", "/upcoming"],
  ["Guides", "/guides"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--paper-alpha)] backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <BrandMark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
