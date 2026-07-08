# deck-builder

A [Slidev](https://sli.dev) setup for **LaTeX-consistent, lightly-techy academic talks** — you write a dot-dash Markdown outline, cite from your Zotero `.bib`, and get a presentable deck with real LaTeX math, a presenter view, and PDF/PPTX export.

It is **not** a fork of Slidev. It is a local Slidev **theme** (`slidev-theme-academic`) plus a **Zotero citation addon**, so you keep the whole Slidev engine (KaTeX math, Shiki code highlighting, presenter mode, export) and only own the parts that make it yours.

- **Type** — Computer Modern (the LaTeX typeface) for text and math, JetBrains Mono for labels, rules, and furniture. One restrained blue accent.
- **Citations** — write `[@key]`; it renders `(Author, Year)` and auto-builds a references slide from your `.bib`, using the **same keys as your thesis**.
- **Layouts** — cover, section, default, two-cols, figure, statement, references, end.

## Quick start

```bash
npm install
npm run dev          # opens the deck with live reload; edit slides.md
```

Point it at your real bibliography (keeps the public repo free of API keys — it reads a local file, never the Zotero API):

```bash
# one-off:
DECK_BIB=../smt-thesis/02_lit_review/references.bib npm run dev
# or copy/symlink it once:
cp ../smt-thesis/02_lit_review/references.bib ./references.bib   # references.bib is git-ignored
```

If neither is present it falls back to `references.sample.bib` so the example always builds.

## Write a slide

````markdown
---
layout: default
---

# Utilisation is the wrong metric

- Clusters report high utilisation yet leave value on the table [@jeon2019analysis]
- Margin follows latency tolerance, not raw usage [@deschapell2024divergence, p.4]

$$ \tau = 1 - \frac{c_{\text{rent}} + c_{\text{ops}}}{p_{\text{sell}}} $$

<!-- Speaker notes go in the last HTML comment. Only you see them in presenter view. -->
````

- `[@key]` → `(Author, Year)`; `[@key, p.4]` adds a locator; `[CITE: key]` also works (matches the thesis prose convention).
- `<References />` on a slide renders the bibliography for **only the keys you cited**, APA-style. `<References all />` lists everything; `<References :keys="['a','b']" />` lists a fixed set.
- Full authoring reference: [`docs/dot-dash-spec.md`](docs/dot-dash-spec.md).

## Present & export

```bash
npm run dev        # then open the presenter view from the toolbar (notes + timer + next slide)
npm run export     # → dist/deck.pdf  (needs playwright-chromium; npm i -D playwright-chromium)
npm run build      # → dist/  static site you can host
```

`slidev export --format pptx` produces a PowerPoint / Google-Slides import.

## Make it yours (colour / font / logo)

Everything visual is in [`theme/`](theme). Colours are CSS variables in [`theme/styles/layout.css`](theme/styles/layout.css) (`--accent`, `--ink`, `--paper`, …); fonts are in [`theme/styles/fonts.css`](theme/styles/fonts.css); the top-left wordmark is `<Kicker>`. See [`docs/theming.md`](docs/theming.md). There's also a `.dark` variant.

## Layout of the repo

```
slides.md                 the deck you edit (example: a thesis defence)
setup/preparser.ts         rewrites [@key] → <Cite/> before Markdown parsing
scripts/build-bib.mjs      .bib → theme/generated/{bib,cited}.json  (runs on predev/prebuild)
references.sample.bib      fallback bibliography
theme/                     slidev-theme-academic
  layouts/*.vue            cover · section · default · two-cols · figure · statement · references · end
  components/*.vue         Cite · References · Kicker · Figure · Stat
  styles/*                 fonts + layout (Computer Modern + mono, theme variables)
  global-bottom.vue        running footer (title · page)
docs/                      authoring spec · theming · academic-defence guide
```

## Provenance

The "slide master" logic was generalised from an internal single-file HTML deck system (the `icn-deck` / `icn-deck-colorful` Claude skills). All organisation branding, the mono-dark house theme, and the fixed house layouts were removed; the reusable engine was rebuilt on Slidev with a LaTeX-consistent academic theme and a Zotero citation addon.

## License

MIT
