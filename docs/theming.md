# Theming: colour, fonts, logo

A theme is one JSON file in [`themes/`](../themes). Three ship with the builder:

- **`academic-defence`** — light, serif display, restrained blue accent. Projector- and print-safe. Built for a timed defence.
- **`minimal`** — neutral light, single sans-serif. Safe default for any topic.
- **`dark`** — cool dark ground, cyan accent, for screen-first talks and demos.

Pick one in frontmatter (`theme: dark`) or on the CLI (`--theme dark`). Point `--theme` at any `.json` path to use a custom file.

## Theme file shape

```jsonc
{
  "name": "academic-defence",
  "colors": {
    "bg": "#ffffff",           // slide background
    "surface": "#f5f6f8",      // card / table-header fill
    "surfaceHover": "#eef0f3",
    "border": "rgba(20,24,40,0.12)",
    "borderStrong": "rgba(20,24,40,0.22)",
    "text": "#141828",         // primary text
    "muted": "...",            // body copy
    "dim": "...",              // captions, metadata
    "accent": "#0B5FFF",       // the one highlight colour
    "accentSoft": "...",       // tinted fills
    "accentBorder": "...",
    "warn": "#B45309", "warnSoft": "...",
    "danger": "#B91C1C", "dangerSoft": "..."
  },
  "fonts": {
    "display": "'Source Serif 4', Georgia, serif",   // headings
    "body": "'Inter', system-ui, sans-serif",        // everything else
    "mono": "'JetBrains Mono', monospace",           // labels, metadata
    "googleFonts": "family=Source+Serif+4:...&family=Inter:...&display=swap"
  },
  "logo": { "text": "", "src": "", "showMark": true },
  "options": { "slideNumbers": true, "progress": true, "transitionDuration": "0.22s" }
}
```

Every colour becomes a CSS variable (`--bg`, `--accent`, …). Components and layouts read those variables, so changing one value re-colours the whole deck.

## The logo (top-left mark)

- `logo.text` — a short wordmark (e.g. `"ACME"` or `"SMT · Defence"`).
- `logo.src` — path to an SVG/PNG/JPG. **Local files are inlined as a data-URI**, so the output stays a single portable file.
- `logo.showMark` — draws the small accent dot when there's no image.

## Quick overrides without editing a theme file

Nudge a theme per-deck straight from frontmatter — handy for "make the accent match this brand":

```markdown
---
theme: minimal
accent: "#7C3AED"        # override the accent colour
bg: "#0a0a0a"            # override background
text: "#f5f5f5"          # override text
displayFont: "'Fraunces', serif"
bodyFont: "'Work Sans', sans-serif"
googleFonts: "family=Fraunces:wght@400;600&family=Work+Sans:wght@300;400;600&display=swap"
logo: "ACME"             # wordmark
logoSrc: "assets/logo.svg"
---
```

## Fonts note

Fonts load from Google Fonts via CDN (needs internet on first open, then cached). To make a deck fully offline, replace the `<link>` in the output with an embedded `@font-face` block, or set `body`/`display` to system fonts (e.g. `Georgia`, `system-ui`) and drop `googleFonts`.

## Making a new theme

Copy `themes/minimal.json`, rename it, edit the values, then `--theme themes/your-theme.json`. Keep the accent to **one** colour and keep `warn`/`danger` for status only — that restraint is what makes the decks read as one system.
