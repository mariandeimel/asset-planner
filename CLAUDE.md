# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run dev -- --open  # Start and open in browser

# Type checking
npm run check        # One-time check
npm run check:watch  # Watch mode

# Testing
npm test             # Run all tests once
npm run test:unit    # Run tests in watch mode

# Single test file
npx vitest run src/lib/path/to/file.spec.ts

# Build
npm run build
npm run preview
```

The project uses **Deno** as the package manager (see `deno.lock`). Use `npm` scripts as above — they delegate to Deno under the hood.

## Test Architecture

There are two test projects configured in `vite.config.ts`:

- **`client`** — Svelte component tests (`*.svelte.spec.ts`), run in a real Chromium browser via Playwright + `vitest-browser-svelte`. Use `render()` from `vitest-browser-svelte` and `page` from `vitest/browser` for assertions.
- **`server`** — Pure TypeScript unit tests (`*.spec.ts`, excluding `*.svelte.spec.ts`), run in Node.

All tests must include at least one assertion (`requireAssertions: true`).

## Coding Principles

- **KISS** — Prefer the simplest solution that works.
- **DRY** — Extract shared logic, avoid duplication.
- **SOLID** — Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- **YAGNI** — Don't build for hypothetical future requirements.
- **JSDoc** — All functions, classes, interfaces, and exported types must have JSDoc comments. Document parameters, return values, and non-obvious behavior.

## Project Overview

This is a **Portfolio Planner & Fair Value Screener** — a "what if" investment planning tool (not a real-time depot tracker). Currently in early setup; the planned app is documented in `docs/project-info.md`.

## Svelte Configuration

- **Runes mode is forced project-wide** (`svelte.config.js`). All components must use Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`) — not legacy stores or reactive declarations.
- `adapter-auto` is used; switch to a specific adapter for deployment.

## Planned Architecture (from `docs/project-info.md`)

The target structure follows this pattern:

```
src/lib/
├── components/
│   ├── ui/          # shadcn-svelte base components
│   ├── charts/      # ECharts wrappers
│   └── portfolio/   # Domain components (PortfolioCard, HoldingRow, etc.)
├── repositories/    # Data access abstraction (PortfolioRepository interface)
├── services/        # Business logic (portfolio.service, market-data.service)
├── stores/          # Svelte stores
├── types/           # Shared TypeScript types
└── utils/           # formatters.ts, calculations.ts
```

**Critical architectural constraint:** All data access must go through the `PortfolioRepository` interface, not directly to localStorage. This abstraction layer must remain swappable (localStorage → IndexedDB → backend API) without touching UI code. The interface is defined in `docs/project-info.md` §2.2.

## Data Model

Key types (not yet in code, defined in `docs/project-info.md`):

- `Portfolio` — has `id`, `name`, `currency`, `holdings[]`, timestamps
- `Holding` — has `symbol`, `assetType` (`"stock" | "etf" | "crypto"`), `quantity`, `buyPrice`, `currency`, `buyDate`
- `HoldingWithMetrics` / `PortfolioMetrics` — calculated at runtime, never persisted
- `FairValueScore` — Phase 3+, composite score from DCF (40%), Graham (20%), P/E comparison (20%), FCF multiple (20%)

## Phased Development Plan

| Phase | Scope |
|---|---|
| 1 | Portfolio CRUD + Holdings + localStorage |
| 2 | Analytics: charts, allocation, dividends |
| 3 | Fair Value Engine (data sources, scoring) |
| 4 | Fair Value Screener (filters, ranking, watchlist) |
| 5 | Go backend (API, PostgreSQL, Redis, cron jobs) |
| 6 | User accounts (auth, Stripe, GDPR) |

## Route Structure (planned)

```
/dashboard
/portfolios
/portfolios/new
/portfolios/[id]
/portfolios/[id]/edit
/screener          # Phase 4
/screener/[symbol]
```

## Key Rules from Project Spec

- **No real-time prices** — data is day-stale, always show last-update timestamp, label prices as approximate ("ca.")
- **Disclaimer required** on dashboard and screener: "Alle Angaben ohne Gewähr. Dies ist kein Anlageberatungsdienst."
- **Concentration risk warning** when any single holding exceeds 25% portfolio weight
- Phase 1 uses localStorage only; direct external API calls from the browser are acceptable in Phase 1 before the Go backend exists
