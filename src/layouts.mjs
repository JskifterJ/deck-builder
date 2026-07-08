/* ============================================================
   deck-builder · layouts.mjs
   A layout is just a function that wraps rendered-markdown HTML
   into a <section class="slide">. Add a new one by adding a key.
   `render(md)` is the Markdown→HTML function passed in from the
   build script so two-col can render each column separately.
   ============================================================ */

const known = ["title", "section", "content", "two-col", "figure", "table", "quote", "references", "thanks"];

export function isLayout(name) {
  return known.includes(name);
}

export function renderLayout(layout, { rawBody, render, noteHtml, index, total }) {
  const active = index === 0 ? " active" : "";
  let inner;

  if (layout === "two-col") {
    const parts = rawBody.split(/<!--\s*col\s*-->/);
    const cols = parts.map((p) => `<div class="col">${render(p.trim())}</div>`).join("");
    // A leading heading before the first <!-- col --> stays full-width above the grid.
    inner = `<div class="two-col-grid">${cols}</div>`;
    // If author put a title line before the first col marker, promote it.
    if (parts.length > 1 && /^#\s/m.test(parts[0])) {
      const [head, ...rest] = parts;
      const headLines = head.trim().split("\n");
      const titleLine = headLines.shift();
      const colsBody = [headLines.join("\n"), ...rest.slice(0)].join("<!-- col -->");
      const colParts = colsBody.split(/<!--\s*col\s*-->/);
      const grid = colParts.map((p) => `<div class="col">${render(p.trim())}</div>`).join("");
      inner = `${render(titleLine)}<div class="two-col-grid">${grid}</div>`;
    }
  } else {
    inner = render(rawBody.trim());
  }

  const note = noteHtml ? `\n        <template class="note">${noteHtml}</template>` : "";
  return `      <section class="slide${active}" data-layout="${layout}">
        <div class="slide-inner">${inner}</div>${note}
      </section>`;
}
