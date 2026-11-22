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

The allowlisted Node build writes `dist/`. GitHub Pages can also serve the root. `vercel.json` declares the static output and Node build explicitly. CI runs eight Node tests for pattern generation, geometry, contact data, and course progress plus eight Python checks for document structure, assets, metadata, and verified chronology.

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

## Personal, academic, and contact additions

The course map uses Carleton’s 202530 Software Engineering progression map. Georgia confirmed first year completed and Fall 2026 second-year courses in progress on November 22, 2026. CCDP 2100 is shown in her actual Fall term. Future electives are requirement placeholders, and non-credit requirements are labelled. No grades, student ID, or private audit data are published. `course-data.js` owns the status and summaries; `scripts/render-course-map.mjs` generates static markup. If the data changes, regenerate the map in `index.html` before building; the source and built HTML both work with GitHub Pages.

The Lissajous playground is a second interactive element: frequency and phase controls, presets, a trace slider, and optional playback. `math.js` contains independently tested geometry. Running, weightlifting, music, and math appear in the personal section without invented performance claims. The uploaded portrait is preserved without facial retouching; a WebP photograph is embedded inside a self-contained SVG for text-based repository transfer.

The archive includes all six LinkedIn project entries plus the two older practice projects. New LinkedIn-derived entries cover the entropy dashboard, Copilot talk, phishing-awareness talk, and Empower landing page. Credentials include historical expiry labels, scholarship and service recognition. No public LinkedIn editing URLs, credential identifiers, private recommendations, or account analytics are embedded.

The contact dialog submits directly through FormSubmit’s AJAX endpoint to Georgia’s public email. First-time activation requires the owner to confirm FormSubmit’s email. Until activation, visitors get an explicit pending-confirmation message with a direct email fallback; failed requests preserve typed content. Native validation, a honeypot, field limits, a submission lock, and a timeout are included. CSP permits only the necessary FormSubmit connection and form destination. No keys are exposed or required. FormSubmit receives the submitted name, email, and message; this is disclosed beside the form.

Source checks now include eight Node tests and eight Python document checks. Source: https://carleton.ca/engineering-design/wp-content/uploads/sites/63/2025/07/SOFT-202530.pdf . Form service documentation: https://formsubmit.co/ajax-documentation .
