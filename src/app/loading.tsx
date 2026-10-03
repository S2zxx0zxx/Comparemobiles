export default function Loading() {
  return (
    <section className="page-shell py-14 md:py-20" aria-label="Loading content" aria-busy="true">
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded-full bg-[var(--surface-3)]" />
        <div className="mt-5 h-12 w-full max-w-xl rounded-2xl bg-[var(--surface-2)]" />
        <div className="mt-3 h-5 w-full max-w-2xl rounded-xl bg-[var(--surface-2)]" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="min-h-[360px] rounded-[26px] border border-[var(--line)] bg-[var(--surface-1)] p-5">
              <div className="mx-auto mt-8 h-48 w-28 rounded-[28px] bg-[var(--surface-2)]" />
              <div className="mt-10 h-5 w-2/3 rounded-lg bg-[var(--surface-2)]" />
              <div className="mt-3 h-4 w-1/2 rounded-lg bg-[var(--surface-2)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
