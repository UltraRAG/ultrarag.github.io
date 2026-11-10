# UltraRAG website

The bilingual UltraRAG promotional website, built with Docusaurus and deployed to GitHub Pages.

Use Node.js 22.19+ (CI uses Node.js 24). Lighthouse 13 requires this minimum version.

```sh
npm ci
npm run check
npm run preview
```

`check` runs the regression tests, creates the production build, and checks local links and media across the generated pages. `preview` serves `build/` at <http://127.0.0.1:4174> with HTTP compression. The normal Docusaurus `npm start` and `npm run serve` commands are also available; their development/preview results are not comparable to a compressed production Lighthouse run.

Run Chrome-based mobile and desktop audits against the preview or any public route:

```sh
npm run audit:lighthouse -- http://127.0.0.1:4174/ artifacts/home
npm run audit:lighthouse -- http://127.0.0.1:4174/demo artifacts/demo
```

Install Chrome or set `CHROME_PATH`. Reports include HTML, full JSON, and a compact summary. Missing metrics remain `null` and audit errors fail the command. Scores are lab measurements and vary with the host and third-party network availability. The PR workflow uploads homepage reports for review; it does not enforce a flaky performance-score threshold.

To regenerate responsive WebP assets while retaining the original artwork:

```sh
npm run images:optimize
```

See [the website audit](docs/audit/2026-11-10.md) for findings, validation, and measurement conditions. Pushes to `main` deploy the website; PR branches run quality checks without deployment.

The lockfile also carries targeted overrides for Docusaurus's worker pool, JavaScript serialization, and SockJS UUID generation. These select patched dependencies while keeping the framework version fixed. CI exercises static generation with two workers, and the SockJS UUID API was smoke-tested. Keep the compatibility checks when changing these constraints; dependency audit details are recorded in the audit notes.
