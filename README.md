# CompareMobile

**Compare smarter. Choose better.**

CompareMobile is a source-first smartphone discovery and comparison platform focused on clean decision-making, transparent specifications and fast product exploration.

## Current branch scope

This foundation includes a premium responsive UI shell, primary-source preview catalog, phone detail pages, Compare Lab, Finder Lab, SEO primitives, D1-oriented schema design and CI quality gates.

> The preview catalog is intentionally small. Production data expansion must follow `docs/DATA_POLICY.md`; competitor databases are not copied as a shortcut.

## Stack

- Next.js 16.3.8 + React 19.2 + strict TypeScript
- Tailwind CSS 4.3
- Base UI primitives
- Motion for React
- TanStack Table v9
- Drizzle ORM with Cloudflare D1 as the intended source of truth
- Cloudflare R2 for eligible media later

## Local development

```bash
pnpm install
pnpm dev
```

Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Architecture and decisions

- `docs/ARCHITECTURE.md`
- `docs/DATA_POLICY.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/TODO.md`
