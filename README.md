# Georgia Vrana · Portfolio

A responsive portfolio using semantic HTML, modern CSS, and JavaScript modules. No framework, runtime dependencies, analytics, external scripts, or third-party font requests.

## Review

Changes live on `redesign/portfolio-2026`; production remains on `main`. Draft PR #1 includes the private deployed review URL. Merge only after review.

Recent experience leads the page, with equally prominent DND and Quantropi cards. Selected technical employment follows in reverse chronological order. Earlier projects occupy compact archive rows with accessible image dialogs and direct image fallbacks.

The curiosity lab maps Web Crypto bytes into a sixteen-note pentatonic melody and an interactive constellation or wave. Visitors can adjust scatter and tempo, select notes, generate patterns, and start or stop playback. Audio starts only after a user action. This is a creative browser demo, separate from QPP-RNG; it does not evaluate entropy.

## Development

Node.js 22+ builds the site without installing packages. Checks also require Python 3.10+.

```sh
npm run check
npm run build
```

The allowlisted Node build writes `dist/`. GitHub Pages can also serve the root. `vercel.json` declares the static output and Node build explicitly. CI runs four Node tests for pattern generation and geometry plus eight Python checks for document structure, assets, metadata, and verified chronology.

## Source layout

- `index.html`: content, dialogs, capability panels, metadata.
- `styles.css`: tokens, responsive layout, focus and reduced-motion styles.
- `app.js`: gallery, keyboard tabs, contact copying, Canvas and Web Audio interactions.
- `instrument.js`: pure pattern and layout functions.
- `scripts/build.mjs`: allowlisted static build.
- `tests/`: deterministic instrument and document checks.
- `media/`: optimized imagery, self-hosted fonts, and licenses.

Original `Assets/` remain for compatibility. The outdated resume is not linked.

## Content verification

Georgia’s LinkedIn profile was checked on November 22, 2026: https://www.linkedin.com/in/georgiavrana/ . DND Cryptanalyst: May–August 2026; Quantropi Cryptographic Analyst: February–September 2025; Frontend Simplified: January 2023–May 2024; Project: Empower: March–December 2023. The DND entry has no public responsibility description, so only its title, dates, internship type and workplace metadata are used. No confidential work details are included.

Research source: https://doi.org/10.1038/s41598-025-13135-8 . Earlier project descriptions and images come from the existing portfolio. Assistive technology remains described as an exploratory prototype, without clinical efficacy claims. Unsubstantiated historical traffic and percentage claims are omitted.

## Accessibility

Skip navigation, semantic landmarks, visible focus, keyboard-operable tabs, native dialog focus handling, image links without JavaScript, labelled tuning inputs, playback feedback, reduced-motion support, and readable clipboard failure fallbacks. Text content remains available without JavaScript. Canvas has a textual description and equivalent individual note controls.

Manrope and Instrument Serif use the SIL Open Font License, included in `media/fonts/`.
