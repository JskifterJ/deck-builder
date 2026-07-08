# Authoring format (the dot-dash)

You write the deck as one Slidev Markdown file, `slides.md`. "Dot-dash" means the talk starts life as a nested bullet outline — you draft the argument as bullets, then promote layouts and add citations. Slidev renders it; this theme styles it.

## Anatomy

```markdown
---
theme: ./theme          # this repo's academic theme
title: My Talk          # shown in the running footer
transition: fade
mdc: true
layout: cover           # layout for the FIRST slide
---

# Talk Title
## Subtitle
- Presenter · Date

---
layout: default
---

# A content slide
- top-level point [@somekey]
  - a sub-point
- second point

<!-- Speaker notes live in the last HTML comment. Only you see them. -->
```

- The first `---` block is the deck **headmatter** (deck-wide config).
- Each subsequent slide is separated by `---`, and may start with its own frontmatter block setting `layout:` (and any Slidev options).
- Content is ordinary Markdown: headings, bullets (`-`), numbered lists, **bold**, *italic*, `code`, tables, `![images]()`, blockquotes.
- Nest bullets by indenting two spaces.

## Layouts

Set `layout:` in a slide's frontmatter.

| Layout | Use for |
|---|---|
| `cover` | Opening slide — big title, subtitle, mono meta list |
| `section` | Divider — put a `<Kicker>Part N</Kicker>` above the heading |
| `default` | Standard content — heading with a hairline rule, then body |
| `two-cols` | Two columns; put right-column content after a `::right::` line |
| `figure` | Centered image with caption / source (use the `<Figure>` component) |
| `statement` | One big centered line — an epigraph or key finding |
| `references` | The bibliography (drop in `<References />`) |
| `end` | Closing / questions slide |

## Citations (Zotero `.bib`)

Write markers inline; the preparser turns them into citation components before rendering.

| You write | Renders |
|---|---|
| `[@jeon2019analysis]` | (Jeon et al., 2019) — linked to the source URL |
| `[@key, p.12]` | (Author, 2024, p.12) |
| `[CITE: key]` | same as `[@key]` (matches the thesis prose convention) |

Then, on your references slide:

```markdown
---
layout: references
---
# Selected references
<References />
```

- `<References />` lists **only the keys cited in the deck**, alphabetically, APA-style with hanging indents.
- `<References all />` lists every entry in the `.bib`.
- `<References :keys="['jacobides2018ecosystems','jeon2019analysis']" />` lists a fixed set.

Unknown keys render as a red `[?key]` so you catch typos. Keys are identical to your thesis LaTeX `\cite` keys, so the deck and the thesis stay consistent. See [`citations.md`](citations.md).

## Math

Standard LaTeX via KaTeX — inline `$x$` and display `$$ ... $$`. It renders in Computer Modern, matching the thesis.

## Reveals

Wrap content to reveal it on click:

```markdown
<v-click>

This appears on the next arrow press.

</v-click>
```

Or reveal list items one at a time with `<v-clicks>`. Slidev docs: <https://sli.dev/guide/animations>.

## Components

Auto-imported, usable on any slide:

- `<Kicker>ROUTING · PART TWO</Kicker>` — a mono eyebrow above a title.
- `<Figure src="chart.svg" caption="…" source="…" />` — image with caption/source.
- `<Stat v="14" l="Interviews" />` inside `<div class="stat-row">…</div>` — a stat band.
- CSS helpers for inline HTML: `.card` / `.card.accent`, `.callout`, `.deck-grid.cols-3`, `.src`.

## Build

```bash
npm run dev      # live preview
npm run export   # PDF
npm run build    # static site
```
