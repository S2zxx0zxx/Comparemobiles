# CompareMobile Execution Tracker

## Foundation
- [x] Dedicated feature branch
- [x] Next.js + strict TypeScript foundation
- [x] Tailwind 4 tokenized visual system
- [x] Base UI search dialog
- [x] Motion reveal primitives
- [x] TanStack Table comparison surface
- [x] Drizzle D1-oriented schema foundation
- [x] Responsive header + mobile dock + dark mode
- [x] SEO metadata, robots and sitemap
- [x] CI quality gates

## Public V1 surfaces
- [x] Premium homepage shell
- [x] Phone catalog page
- [x] Primary-source phone detail pages
- [x] Compare Lab
- [x] Finder Lab
- [x] Upcoming policy surface
- [x] Deals/pricing integrity surface
- [x] Guides architecture surface
- [x] Brands surface
- [x] Chipset discovery surface

## Data platform
- [x] D1 binding/config checked into the repo
- [ ] Provision remote Cloudflare D1 database and replace placeholder database ID
- [x] Drizzle schema + first migration
- [x] D1-backed catalog repository implementation (runtime binding pending)
- [x] Local verified-preview seed command
- [x] Source importer interface
- [x] Zod canonical input contracts
- [x] Brand/region normalization + alias engine
- [x] Region-aware deterministic dedupe keys
- [x] Field-level provenance coverage checks
- [x] Verification queue schema
- [x] Ingestion run audit schema
- [x] Batch validation/rejection path
- [x] OnePlus official-source adapter
- [x] Samsung official-source adapter
- [x] vivo / iQOO official-source adapter
- [x] Core launch manufacturer adapters (Apple, Google, Xiaomi/Redmi/POCO, OPPO/realme, Motorola, Nothing)
- [x] Add long-tail manufacturer adapters for HONOR, HMD/Nokia, ASUS/ROG, TECNO/Infinix and Lava
- [ ] Ingest 150–300 India-relevant launch catalog

## Commerce / pricing
- [x] Retailer adapter interface
- [x] Integer minor-unit money contract
- [x] Freshness rules for live-price labels
- [x] Append-only price snapshot schema
- [x] Affiliate URL separation from canonical retailer offers
- [x] Initial retailer adapters (Amazon India / Flipkart / Reliance Digital)
- [x] Historical price chart component + honest empty state
- [x] D1 pricing repository for current offers and per-retailer history
- [ ] Wire chart to live verified retailer snapshots
- [x] Deal confidence / stale-price UI states

## SEO / discovery
- [ ] Best-under-budget generated pages (blocked until verified price coverage)
- [x] Chipset landing pages
- [x] Region-aware Product JSON-LD policy
- [x] Editorial buying-guide content pipeline
- [x] Privacy-safe analytics event schema

## Quality before main merge
- [x] ESLint gate
- [x] Strict TypeScript gate
- [x] Preview catalog validation gate
- [x] Unit-test gate wired into CI
- [x] Production build gate
- [x] Local D1 migration + seed smoke test
- [ ] Mobile visual QA
- [ ] Desktop visual QA
- [x] Accessibility smoke test (Playwright + axe, serious/critical violations gate)
- [ ] Production deployment smoke test

> Rule: do not merge to `main` until the current branch is green and the remaining release checks required for the intended milestone are complete.
