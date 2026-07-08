# deck-builder

Turn a **dot-dash outline** + a **theme** (colours, fonts, logo) into a **single self-contained HTML presentation**. No framework at runtime, no build step to view — one file you can open, present, email, or export to PDF/PPTX.

It borrows the good ideas from [Slidev](https://sli.dev) — you author in Markdown, notes and theming live in config, there's a presenter view with a timer — but emits a portable dependency-free HTML file instead of requiring a Node/Vite server to run.

General-purpose by design; ships an **`academic-defence`** theme and a [defence presentation guide](docs/academic-defence-guide.md) as the first worked use case.

## Quick start

```bash
npm install
node bin/build.mjs examples/thesis-defense.deck.md
# → dist/thesis-defense.html   (open it in any browser)
```

## Write a deck

````markdown
---
title: My Talk
theme: academic-defence     # academic-defence | minimal | dark
logo: ACME
---

<!-- layout: title -->
# My Talk Title
## A subtitle
- Presenter · Date

---

# A content slide
- a point
  - a sub-point
- another point

<!-- note: What I say here. Only I see it, in presenter view. -->
````

Full authoring reference: [`docs/dot-dash-spec.md`](docs/dot-dash-spec.md).

## While presenting

| Key | Action |
|---|---|
| `←` / `→` (or space) | Previous / next (advances reveals first) |
| `P` | Presenter view — notes, timer, next slide |
| `F` | Fullscreen |
| `Home` / `End` | First / last slide |

Toolbar buttons export **PDF** (browser print, one slide per page) and **PPTX** (for Google Slides / PowerPoint import). For pixel-perfect PDF, use [`decktape`](https://github.com/astefanutti/decktape).

## Themes

Three ship in [`themes/`](themes); make your own by copying one. Colour, font, and logo are all config — see [`docs/theming.md`](docs/theming.md). You can also nudge a theme per-deck from frontmatter (`accent:`, `bg:`, `logoSrc:`, …).

## How it fits together

```
bin/build.mjs      CLI: parse .deck.md → assemble one HTML file
src/template.html  the HTML shell (placeholders)
src/core.css       layout · nav · presenter · print (theme-variable driven)
src/components.css  cards · stat bars · callouts · tables · chips
src/core.js        navigation · auto-scale · presenter+timer · reveals · export
src/layouts.mjs    layout → slide-section wrappers
themes/*.json      colour / font / logo presets
docs/              authoring spec · theming · defence guide
examples/          worked thesis-defence deck
```

The output HTML has **zero runtime dependencies**. Fonts load from Google Fonts (cached after first open); the PPTX library loads on demand only if you click Export.

## Provenance

De-branded and generalised from an internal single-file HTML deck system. All organisation-specific branding, the mono-dark house theme, and the fixed house layouts were removed; what remains is the reusable "slide master" engine — layouts, component library, navigation, presenter mode, and export.

## License

MIT
