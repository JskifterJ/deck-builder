# Theming: colour, fonts, logo

The look lives entirely in [`theme/`](../theme). It's a normal Slidev theme, so you change a few values and the whole deck follows.

## Colour

All colours are CSS variables at the top of [`theme/styles/layout.css`](../theme/styles/layout.css):

```css
:root {
  --paper: #ffffff;   /* slide background        */
  --ink:   #14161c;   /* primary text + math     */
  --muted: #474d5a;   /* secondary text          */
  --faint: #8b909d;   /* captions, footer         */
  --rule:  rgba(20,22,28,0.14);   /* hairlines    */
  --accent:#1b45c4;   /* the one highlight (links, bullets, citations, rules) */
  --accent-soft: rgba(27,69,196,0.08);
}
```

Change `--accent` to rebrand in one line. A `.dark` block a few lines down defines the dark variant (enable with `class: dark` in a slide's frontmatter, or set it deck-wide). Keep to **one** accent — the restraint is what makes it read like a well-set paper.

## Fonts

Defined in [`theme/styles/fonts.css`](../theme/styles/fonts.css):

- **Computer Modern Serif** — the LaTeX typeface, loaded as a web font. Used for all text and (via KaTeX) math, so slides match the thesis.
- **JetBrains Mono** — the "techy" hint: kickers, labels, table headers, the footer, slide numbers.

To swap fonts, change the `@import` URLs and the `--cm` / `--mono` variables. For a stricter LaTeX look, keep Computer Modern; for a more modern-technical feel, point `--cm` at a grotesk (Inter, IBM Plex Sans) and keep the mono.

> Fonts load from CDNs (jsDelivr for Computer Modern, Google Fonts for JetBrains Mono) and cache after first load. For a fully offline deck, vendor the font files into `theme/` and rewrite the `@import`s to local `@font-face`.

## Logo / wordmark

There's no fixed logo — the top-left mark is whatever you put in `<Kicker>` on a slide, and the running footer shows the deck `title`. To add an image logo, drop it in `theme/` and reference it from a layout or a `global-top.vue`. To change the footer, edit [`theme/global-bottom.vue`](../theme/global-bottom.vue).

## Layouts and components

- Layouts are Vue files in [`theme/layouts/`](../theme/layouts) — each is a thin wrapper with a root class; the CSS in `layout.css` does the styling. Add a layout by adding a `.vue` file and a matching `.deck-<name>` CSS block.
- Components are in [`theme/components/`](../theme/components) and auto-import globally.

## Aspect ratio / size

Set in [`theme/package.json`](../theme/package.json) under `slidev.defaults` (`aspectRatio`, `canvasWidth`). Default is 16:9 at 980px.
