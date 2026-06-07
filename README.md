# Vegan Moldova

The official website of the vegan community in Moldova.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) (via `sqlite3` and `sqlite`)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📈 Telemetry

This project includes privacy-first telemetry backed by Appwrite.

- Automatic client-side tracking is initialized in `src/app/[locale]/client-layout.tsx` via `src/components/TelemetryLoader.tsx`.
- Core event helpers live in `src/utils/telemetry.ts`.
- Tracked events include page views, scroll depth, time on the page, search/filter activity, outbound clicks, file downloads, social shares, 404s, and JS errors.

See [TELEMETRY.md](TELEMETRY.md) for the exact payload shape and component integration examples.

## 🌐 Translations

Our translations are managed via a Google Sheet to allow collaborative editing:
[Translations Google Sheet](https://docs.google.com/spreadsheets/d/1GMJeNL7GRIcV07gdNJviWYwjak0QZfDa4Oa-U5J-BoQ/edit)

To sync translations between the spreadsheet and the project:
1. Export the Google Sheet as a CSV file.
2. Save it to `src/translations/export.csv`.
3. Use the provided Python script to convert between CSV and JSON:

```bash
# Convert CSV to JSON files (after downloading from Google Sheets)
python3 scripts/translations_csv_sync.py from-csv

# Convert JSON files to CSV (if you made manual changes to JSON)
python3 scripts/translations_csv_sync.py to-csv
```

## 💾 Local Caching

WordPress articles are cached in the browser to reduce repeat fetches and keep page loads fast.

### How the cache is used in practice

- On app mount, `WpArticlesCacheLoader` checks the cache age and whether it contains all IDs from `wpArticleIdsMap`.
- If the cache is stale or incomplete, it fetches the latest WP posts and writes them to `localStorage`.
- Any component that needs cached WP content can import `useWpArticles()` and call `getArticle(pageKey, locale)`.
- When the loader writes fresh cache data, it dispatches `wpArticlesUpdated`, and the hook refreshes its in-memory state.
- If another tab updates `localStorage`, the `storage` event also triggers a refresh.

### Debugging the cache in the browser console

Parse and inspect the cache:

```bash
JSON.parse(localStorage.getItem("wpArticles") || "{}")
```

Force a refresh by dispatching the update event:

```bash
window.dispatchEvent(new Event("wpArticlesUpdated"))
```

## 🛠 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License & Attribution

This project is based on the [Startup Next.js Template](https://github.com/NextJSTemplates/startup-nextjs).

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. **Fork the Repository**: Create your own copy of the project.
2. **Create a Branch**: Use a descriptive name for your branch (e.g., `feat/add-new-recipe`).
3. **Open an Issue**: For major changes, please open an issue first to discuss what you would like to change.
4. **Follow Code Style**: Ensure your code follows the existing patterns and passes linting (`npm run lint`).
5. **Submit a Pull Request**: Provide a clear description of your changes and link any related issues.

### Good Practices
- Keep PRs small and focused on a single task.
- Write descriptive commit messages.
- Update documentation if you add new features or change existing ones.
- Respect the community guidelines and be inclusive.

