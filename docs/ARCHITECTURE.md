# CompareMobile Architecture V1

## Product principle

The public product is static/cache-first. Dynamic infrastructure exists only where interaction or fresh data actually needs it.

```text
Primary/open sources
  -> ingestion + validation
  -> normalized catalog
  -> Cloudflare D1 (source of truth)
  -> Next.js public surfaces
       -> static/cache-first phone & SEO pages
       -> dynamic compare/finder/search where useful
  -> R2 for eligible owned/licensed media
```

## Runtime direction

- Next.js 16.3.x + strict TypeScript
- Tailwind CSS 4.x design tokens
- shadcn-style local components on Base UI primitives
- Motion for deliberate interaction motion
- TanStack Table v9 for headless comparison logic
- Drizzle ORM + Cloudflare D1 for structured data
- Cloudflare R2 for media when licensing permits
- GitHub Actions for lint/typecheck/build gates

## Non-goals in V1

No Kubernetes, microservices, Redis, Elasticsearch, paid CMS, paid phone-spec API, user accounts, social feed, or unverified price scraping.


## Cloudflare deployment compatibility

The canonical Next.js workflow remains available. A parallel vinext path is kept in CI so Cloudflare Workers compatibility is proven before remote deployment:

```text
pnpm build          -> canonical Next.js production build
pnpm check:vinext   -> known compatibility scan
pnpm build:vinext   -> Vite/vinext production build
```

Remote deployment is intentionally not enabled until a real Cloudflare account, D1 database ID and deployment credentials are available. No placeholder account or database identifiers are treated as production configuration.
