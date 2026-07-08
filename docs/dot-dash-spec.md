# The dot-dash format

You write a deck as one Markdown file (`*.deck.md`). The build script turns it into a single self-contained HTML file. "Dot-dash" just means: **your nested bullet outline is the content** — you draft the talk as an outline and the builder renders it.

## Anatomy

```markdown
---
title: My Talk
theme: academic-defence
---

<!-- layout: title -->
# Talk Title
## Subtitle
- Presenter name
- Date

---

# A content slide
- top-level point
  - a sub-point (indent two spaces)
  - another sub-point
- second point

<!-- note: What I say out loud on this slide. Only I see this. -->
```

## Rules

- **Frontmatter** — the block between the first pair of `---` lines. Sets deck-wide options (see below).
- **Slide breaks** — a line containing only `---` starts a new slide.
- **Content** — normal Markdown: headings, bullets (`-`), numbered lists (`1.`), **bold**, *italic* (renders as accent colour), `code`, tables, `![images](path)`, links, block­quotes (`>`).
- **Nesting** — indent bullets by two spaces to nest them. Nested items render smaller with a hollow marker.

## Per-slide directives (HTML comments)

| Directive | Effect |
|---|---|
| `<!-- layout: NAME -->` | Pick a layout (default `content`). See list below. |
| `<!-- note: ... -->` | Speaker notes — shown only in presenter view (`P`). Can span multiple lines and use Markdown. |
| `<!-- col -->` | Inside `layout: two-col`, splits the slide into left / right columns. |

## Layouts

| Layout | Use for |
|---|---|
| `title` | Opening slide — big centered title, subtitle, meta list |
| `section` | Divider between parts — large heading on a tinted panel |
| `content` | Default — heading on top, body below |
| `two-col` | Two columns, split on `<!-- col -->` |
| `figure` | A centered image with caption / source text |
| `table` | A slide built around one large table |
| `quote` | A big centered pull-quote (epigraph, key finding) |
| `references` | Small mono-styled, scrollable citation list |
| `thanks` | Closing / questions slide |

## Incremental reveals

Give any inline-HTML element the class `step` to hide it until you press → :

```markdown
<p class="step">This line appears on the next click.</p>
```

## Optional components

Any slide can include inline HTML that uses the component classes (`card`, `grid-3`,
`callout`, `stat-bar`, `chip`, `tag`, …). They recolour automatically per theme.
See [`components.css`](../src/components.css) for the full list.

## Build

```bash
node bin/build.mjs my-talk.deck.md               # → dist/my-talk.html
node bin/build.mjs my-talk.deck.md --theme dark  # override theme
node bin/build.mjs my-talk.deck.md -o out.html   # choose output path
```
