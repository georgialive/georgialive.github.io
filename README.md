# Georgia Vrana · Portfolio

A responsive portfolio built with semantic HTML, modern CSS, and progressively enhanced JavaScript. No framework, runtime dependencies, analytics, external scripts, or third-party font requests.

## Review the redesign

The redesign lives on `redesign/portfolio-2026`. Production uses `main`. The pull request contains a private, deployed review URL; merging remains a separate decision.

The site works without JavaScript. JavaScript adds project filters, optional email copying, and a live 128-bit visualization using the browser's Web Crypto API. The demo is not a QPP-RNG implementation or an entropy evaluation.

## Develop and check

Requires Python 3.10+ and Node.js 18+ for the JavaScript syntax check. No package installation is needed.

```sh
npm run check
npm run build
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. GitHub Pages can still serve the repository root. The allowlisted build excludes tests, old PDFs, unrelated assets, and development files.

## Maintain

- `index.html`: content, project details, and metadata.
- `styles.css`: design tokens, layouts, responsive breakpoints, and reduced-motion support.
- `app.js`: optional interactions and permission-failure fallbacks.
- `media/`: optimized imagery, self-hosted WOFF2 fonts, and their licenses.
- `tests/test_site.py`: navigation, asset, accessibility, and content privacy checks.

Original assets remain in `Assets/` for compatibility; this version uses `media/`. The old résumé is not linked because its education and employment details are outdated. Contact links provide a way to request current information.

## Content sources and boundaries

Research: https://doi.org/10.1038/s41598-025-13135-8. Project information and imagery come from the existing portfolio; updated skills and experience come from Georgia's supplied background.

The government role is limited to “Government Cryptanalyst Internship.” Assistive technology is described as a research prototype, without clinical efficacy claims. Historic traffic and percentage claims are omitted because they were not independently substantiated during this redesign.

## Accessibility and performance

One primary heading, a skip link, visible focus styles, labelled filters and live result counts, native expandable details, specified image dimensions, lazy loading, and reduced-motion support. Content does not depend on hover or JavaScript. Clipboard errors have a readable fallback. The page makes no analytics requests.

Manrope and Instrument Serif are distributed under the SIL Open Font License; license texts are included in `media/fonts/`.
