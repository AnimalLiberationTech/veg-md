## Quick checklist for AI agents

- Read this file, then the referenced files before editing code.
- Verify runtime context: Next.js App Router (server & client components) + Node server APIs + local SQLite DB.
- Use the commands in "Developer workflows" to run and test changes locally.

## Big-picture architecture (what to know fast)

- Framework: Next.js 16 (App Router) with React 19 and Tailwind CSS. Entrypoints: `src/app/layout.tsx` and `src/app/[locale]/layout.tsx`.
- i18n: `next-intl` is used. Routing and middleware proxy are implemented in `src/i18n/routing.ts` and `src/i18n/proxy.ts`. The middleware can be disabled in prod by environment variables (see `shouldUseIntlProxy` in `src/i18n/proxy.ts`).
- Server vs client boundaries:
  - Server-only code (Node APIs like sqlite) runs in server components / API routes. Example: `src/components/Resources/resourcesData.tsx` opens `data/resources.sqlite3` with `sqlite3` and `sqlite` and is invoked from server components and routes.
  - Client code uses the `"use client"` directive (see `src/hooks/use-wp-articles.tsx`). Avoid importing server-only modules into client components.
- Data flows:
  - Translations: CSV <-> per-locale JSON managed by `scripts/translations_csv_sync.py` and stored in `src/translations/*.json` (export CSV at `src/translations/export.csv`).
  - Resources data: read from local SQLite at `data/resources.sqlite3` (migrations in `data/migrations/`).
  - WordPress articles: client-side cached in localStorage under key `wpArticles` with a map driven by `src/pages.ts` and helpers in `src/utils/wp-article-cache.ts` and `src/hooks/use-wp-articles.tsx`.

## Critical developer workflows (commands)

- Install deps:
  - npm install
- Local dev server (hot reload):
  - npm run dev
- Build / export / start (production-ish):
  - npm run build
  - npm run export   # project uses "export" as a build shortcut
  - npm run start
- Linting:
  - npm run lint
- Translations sync (spreadsheet CSV ↔ JSON):
  - python3 scripts/translations_csv_sync.py to-csv
  - python3 scripts/translations_csv_sync.py from-csv
- Inspect or query the local SQLite DB (quick debug):
  - sqlite3 data/resources.sqlite3
  - OR a Node REPL that imports `sqlite` / `sqlite3` as used in `resourcesData.tsx`.

## Project-specific conventions & patterns (concrete examples)

- Locale prefixing: routes live under `src/app/[locale]/...`. `src/i18n/routing.ts` sets `localePrefix: 'always'` and `localeDetection: false` — the app expects explicit locale segments.
- Intl middleware proxy: `src/proxy.ts` defers to `src/i18n/proxy.ts`. The proxy decides whether to run middleware using env vars: `NODE_ENV`, `GITHUB_ACTIONS`, `ENABLE_I18N_PROXY`.
- Translations shape: the CSV script flattens nested keys up to 3 levels. See `scripts/translations_csv_sync.py::_flatten_locale_dict` and `_normalize_header` for exact CSV schema (first 3 columns are keys L1/L2/L3).
- WP articles: `src/pages.ts` maps human page keys to WP post IDs per-locale; helpers `src/utils/wp-api-url.ts` and `src/utils/wp-article-cache.ts` build URLs and map cache entries. The client listens for `wpArticlesUpdated` and `storage` events to refresh caches.
- Server-data queries: `src/components/Resources/resourcesData.tsx` shows the pattern for server-side DB access (open DB, run queries, close DB, return plain JSON serializable objects).

## Integration points & external dependencies

- WordPress REST API: utilities assume an external WP site (example base in constants `uvmSite` — `src/utils/wp-api-url.ts`). Use `buildWpApiPostsUrl(baseUrl, includeIds, fields)` to compose calls.
- Appwrite / internal endpoints: constants reference Appwrite-hosted endpoints (`bugReportUrl`, `gCalUrl`, `gSheetUrl`) in `src/constants.ts` — treat as opaque external services.
- SQLite file: `data/resources.sqlite3` (schema in `data/migrations/000_initial_schema.sql`). Server code uses `sqlite3` + `sqlite` packages installed in this repo.

## Safe edit checklist for agents

- Before changing any server/client boundary, find the component’s runtime (server vs client). Server-only imports (fs, sqlite3, node-only libs) must not be moved into client bundles.
- If adding i18n changes, update both `src/i18n/routing.ts` and `src/i18n/request.ts` and test with `ENABLE_I18N_PROXY=true` in dev if needed.
- For translations: update `src/translations/*.json` and run `python3 scripts/translations_csv_sync.py to-csv` to surface changes for spreadsheet consumers.
- When touching DB/SQL: update `data/migrations/000_initial_schema.sql` and provide a migration step or instructions to regenerate `data/resources.sqlite3` (no automatic migration runner in repo).

## Useful files to open first (examples)

- `package.json` — scripts and dependencies.
- `src/app/[locale]/layout.tsx` — where request locale is established and messages are wired.
- `src/i18n/proxy.ts` and `src/proxy.ts` — how middleware is enabled/disabled.
- `src/components/Resources/resourcesData.tsx` — canonical example of server-side DB access.
- `src/utils/wp-article-cache.ts` and `src/hooks/use-wp-articles.tsx` — client-side caching pattern for WP articles.
- `scripts/translations_csv_sync.py` — CSV ↔ JSON translation format and constraints.
- `src/pages.ts` — canonical mapping of internal page keys → WP IDs per-locale.

If anything in this file is unclear, open the files listed above and run the dev server with `npm run dev` to exercise server+client boundaries while you iterate.

