import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow-text">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)] md:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] md:text-[15px]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
