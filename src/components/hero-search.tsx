"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/phones?q=${encodeURIComponent(q)}` : "/phones");
  }

  return (
    <form onSubmit={submit} className="hero-search">
      <Search size={19} className="shrink-0 text-[var(--muted)]" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search phones"
        placeholder="Search a phone, brand or chipset"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
      />
      <button className="hero-search-go" type="submit" aria-label="Search">
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
