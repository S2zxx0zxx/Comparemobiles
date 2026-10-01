# CompareMobile

**Compare smarter. Choose better.**

CompareMobile is a source-first smartphone discovery and comparison platform focused on clean decision-making, transparent specifications and fast product exploration.

## Current branch scope

The foundation includes a premium responsive UI shell, primary-source preview catalog, phone detail pages, Compare Lab, Finder Lab, SEO primitives, D1-oriented data contracts, provenance-aware ingestion rules, pricing integrity boundaries and CI quality gates.

> The preview catalog is intentionally small. Production data expansion must follow `docs/DATA_POLICY.md`; competitor databases are not copied as a shortcut.

## Stack

- Next.js 16.3.8 + React 19.2 + strict TypeScript
- Tailwind CSS 4.3
- Base UI primitives
- Motion for React
- TanStack Table v9
- Zod canonical ingestion contracts
- Drizzle ORM + Cloudflare D1 schema/migrations
- Wrangler for local/remote D1 migrations
- Vitest for data-pipeline unit tests

## Local development

```bash
pnpm install
pnpm dev
```

Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm data:validate
pnpm test
pnpm build
```

Data-platform commands:

```bash
pnpm db:migrate:local
pnpm db:seed:local
pnpm data:validate-import ./path/to/import.json
```

Remote D1 provisioning is intentionally not faked in source control. After a real D1 database is created, replace the placeholder `database_id` in `wrangler.jsonc` and run the remote migration explicitly.

## Architecture and decisions

- `docs/ARCHITECTURE.md`
- `docs/DATA_POLICY.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/TODO.md`
