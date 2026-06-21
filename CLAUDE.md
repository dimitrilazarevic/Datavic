# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Datavic is a desktop data-visualization app for L'Oréal, built with **SvelteKit + Electron**. It manages bottles and materials with their associated analysis data (mechanical tests, thickness measurements). The UI is in French.

## Commands

```bash
npm run dev              # SvelteKit dev server (browser only, no Electron)
npm run dev:electron     # Build electron code then launch Electron in dev mode (connects to Vite at localhost:5173 — run `npm run dev` first in another terminal)
npm run build            # Build both SvelteKit and Electron for production
npm run build:electron   # Build only the Electron main/preload bundles
npm run check            # Svelte type checking
npm run lint             # Prettier + ESLint
npm run format           # Auto-format with Prettier

# Database (Drizzle)
npm run db:generate      # Generate migration from schema changes
npm run db:push          # Push schema directly to DB (dev only)
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Release
npm run release          # Build + electron-builder publish
```

CI runs on GitHub Actions (`release.yml`) — triggered by `v*` tags, builds on Windows, publishes `.exe` to GitHub Releases.

## Architecture

### Two-process Electron app

- **Main process** (`electron/`): Node.js + better-sqlite3. Bundled to CJS via `vite.config.electron.ts` → `electron/dist/{main,preload}.cjs`.
- **Renderer** (`src/`): SvelteKit with `adapter-static` (`ssr=false`, `prerender=true`). In production, served via a custom `app://` protocol; in dev, loaded from the Vite dev server.

### IPC bridge

All renderer ↔ main communication goes through `contextBridge` (preload) and `ipcMain.handle`:

1. **Preload** (`electron/preload.ts`) exposes `window.electronAPI` with typed CRUD methods.
2. **Type contract** (`src/app.d.ts`) declares the `ElectronAPI` interface using `SimpleCrud<T, TInsert>` and `EntityCrud<TSummary, T, TInsert>` generics.
3. **IPC handlers** (`electron/ipc/`) register handlers on app startup via `registerIpcHandlers()`.

When adding a new entity or IPC method, all three layers must stay in sync: schema → types → IPC handler → preload → `app.d.ts`.

### Database layer

- **Schema**: `electron/lib/db/schema.ts` (Drizzle ORM, SQLite)
- **Types**: `electron/lib/types/index.ts` — derived from schema via `InferSelectModel`/`InferInsertModel`, plus `*Summary` types with joined fields
- **Migrations**: `electron/lib/db/migrations/` — bundled as `extraResources` in production
- **DB location**: `~/.config/datavic/datavic.db` by default, configurable via settings UI. Config stored in `config.json` in Electron's `userData` directory.

### Lookup tables vs. main entities

- **Lookup tables** (bottleType, brand, overbrand, zone, materialFamily, supplier): simple name+id, use `createSimpleQueries()` factory in `electron/ipc/queries/simple/simpleQueries.ts` for generic CRUD.
- **Main entities** (bottle, material): have dedicated query files in `electron/ipc/queries/`, custom forms, data tables, and associated analysis records (bottleAnalysis, materialAnalysis).

### Shared code

`shared/` contains code used by both Electron and SvelteKit:

- `shared/enums.ts` — domain enums (bottle status, analysis test types/directions, analysis keys)
- `shared/schemas/` — Zod validation schemas
- `shared/utils/` — parsing/formatting utilities

Aliased as `$shared` in SvelteKit imports.

### File storage

Entity images and analysis files are stored on disk alongside the database (in `bottles/` and `materials/` subdirs relative to the DB path). `electron/lib/fileutil.ts` manages these directories.

### Frontend routing

- `/main/bottle/{explore,create,view,compare}` — bottle pages
- `/main/material/{explore,create,view,compare}` — material pages
- `/settings/` — admin pages (DB config, lookup table CRUD for bottle-types, brands, overbrands, zones, material-families, suppliers)

Layout uses a top nav (Bottle/Material/Settings) + a vertical side nav for sub-pages.

## Key Conventions

- Svelte 5 runes mode is forced project-wide (see `vite.config.ts` compilerOptions)
- Icons from `@lucide/svelte`
- No test framework is configured
- To delete/reset the local DB: `rm ~/.config/datavic/datavic.db`
- If Electron native modules break after a Node version change: `npx @electron/rebuild -m . -o better-sqlite3`
