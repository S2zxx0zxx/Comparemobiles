# CompareMobile Execution Tracker

## Foundation
- [x] Dedicated feature branch
- [x] Next.js + strict TypeScript foundation
- [x] Tailwind 4 tokenized visual system
- [x] Base UI search dialog
- [x] Motion reveal primitives
- [x] TanStack Table v9 comparison surface
- [x] Responsive header + mobile dock + dark mode
- [x] SEO metadata, robots and sitemap
- [x] CI lint, typecheck, test and build gates

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

## Data platform
- [x] Canonical Zod import contracts
- [x] Brand and region normalization
- [x] Stable device and variant identity rules
- [x] Duplicate detection for import batches
- [x] Field-level provenance coverage guard
- [x] D1-oriented Drizzle schema
- [x] Initial SQL migration
- [x] Retailer and price snapshot schema
- [x] Affiliate URL separation
- [x] Price freshness/current-price integrity rules
- [x] Unit tests for normalization, provenance, dedupe and pricing
- [ ] Create actual Cloudflare D1 database and add real binding IDs
- [ ] Apply migration to Cloudflare D1
- [ ] Build manufacturer-specific source adapters
- [ ] Build verification queue/admin operations
- [ ] Expand to 150–300 India-relevant launch devices
- [ ] Add authorized/licensed device media pipeline

## Commerce and SEO
- [ ] Retailer feed adapters
- [ ] Price history queries and charts
- [ ] Affiliate program adapters
- [ ] Best-under-budget generated pages
- [ ] Chipset/category landing pages
- [ ] Structured-data eligibility audit
- [ ] Analytics event schema

## Release quality
- [ ] Mobile visual QA on real devices
- [ ] Desktop visual QA at target breakpoints
- [ ] Accessibility smoke test
- [ ] Performance/Lighthouse audit
- [ ] Cloudflare preview deployment
- [ ] Production domain + canonical URL
- [ ] Main-branch merge only after all required checks are green
