#!/usr/bin/env node
/* ============================================================
   deck-builder · bin/build.mjs
   Usage:
     node bin/build.mjs <input.deck.md> [--theme <name|path>] [-o out.html]
   Turns a dot-dash Markdown outline + a theme into ONE
   self-contained HTML presentation.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { isLayout, renderLayout } from "../src/layouts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

marked.setOptions({ gfm: true, breaks: false });
const render = (md) => marked.parse(md || "");

/* ── args ── */
const argv = process.argv.slice(2);
if (!argv.length || argv.includes("-h") || argv.includes("--help")) {
  console.log(`deck-builder — dot-dash Markdown → self-contained HTML deck

  node bin/build.mjs <input.deck.md> [--theme <name|path>] [-o <output.html>]

  --theme   theme name in themes/ (academic-defence | minimal | dark) or a path to a .json
  -o|--out  output file (default: dist/<input>.html)
`);
  process.exit(argv.length ? 0 : 1);
}
const input = argv.find((a) => !a.startsWith("-"));
const themeArg = flag("--theme");
let out = flag("-o") || flag("--out");
function flag(name) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : null;
}

if (!input || !fs.existsSync(input)) {
  console.error(`✗ input file not found: ${input || "(none)"}`);
  process.exit(1);
}

/* ── read + split frontmatter ── */
const raw = fs.readFileSync(input, "utf8").replace(/\r\n/g, "\n");
let fm = {};
let body = raw;
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
if (fmMatch) {
  fm = parseFrontmatter(fmMatch[1]);
  body = raw.slice(fmMatch[0].length);
}

/* ── theme ── */
const themeName = themeArg || fm.theme || "minimal";
const themePath = themeName.endsWith(".json")
  ? path.resolve(themeName)
  : path.join(ROOT, "themes", `${themeName}.json`);
if (!fs.existsSync(themePath)) {
  console.error(`✗ theme not found: ${themePath}`);
  process.exit(1);
}
const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));

// Frontmatter quick overrides (so a deck can nudge colour/font/logo without a theme file)
if (fm.accent) theme.colors.accent = fm.accent;
if (fm.bg) theme.colors.bg = fm.bg;
if (fm.text) theme.colors.text = fm.text;
if (fm.displayFont) theme.fonts.display = fm.displayFont;
if (fm.bodyFont) theme.fonts.body = fm.bodyFont;
if (fm.googleFonts) theme.fonts.googleFonts = fm.googleFonts;
if (fm.logo) theme.logo.text = fm.logo;
if (fm.logoSrc) theme.logo.src = fm.logoSrc;

/* ── slides ── */
const chunks = body.split(/^---[ \t]*$/m).map((s) => s.trim()).filter(Boolean);
const slidesHtml = chunks.map((chunk, i) => {
  let layout = "content";
  const layoutMatch = chunk.match(/<!--\s*layout:\s*([\w-]+)\s*-->/i);
  if (layoutMatch) {
    layout = layoutMatch[1].toLowerCase();
    if (!isLayout(layout)) {
      console.warn(`  ! slide ${i + 1}: unknown layout "${layout}", using "content"`);
      layout = "content";
    }
  }
  let noteHtml = "";
  const noteMatch = chunk.match(/<!--\s*note:\s*([\s\S]*?)-->/i);
  if (noteMatch) noteHtml = render(noteMatch[1].trim());

  const rawBody = chunk
    .replace(/<!--\s*layout:[\s\S]*?-->/i, "")
    .replace(/<!--\s*note:[\s\S]*?-->/i, "")
    .trim();

  return renderLayout(layout, { rawBody, render, noteHtml, index: i, total: chunks.length });
}).join("\n");

/* ── theme CSS vars ── */
const varLines = [];
for (const [k, v] of Object.entries(theme.colors)) varLines.push(`  --${k}: ${v};`);
varLines.push(`  --display: ${theme.fonts.display};`);
varLines.push(`  --body: ${theme.fonts.body};`);
varLines.push(`  --mono: ${theme.fonts.mono};`);
varLines.push(`  --dur: ${(theme.options && theme.options.transitionDuration) || "0.2s"};`);
const themeVars = varLines.join("\n");

/* ── chrome (logo) ── */
let chrome = "";
const parts = [];
if (theme.logo.showMark && !theme.logo.src) parts.push(`<span class="mark-dot"></span>`);
if (theme.logo.src) parts.push(`<img src="${inlineAsset(theme.logo.src)}" alt="logo">`);
else if (theme.logo.text) parts.push(theme.logo.text);
else if (theme.logo.showMark) parts.push(fm.title ? esc(shortTitle(fm.title)) : "");
if (parts.length) chrome = `<div class="chrome-mark">${parts.join(" ")}</div>`;

/* ── assemble ── */
const title = fm.title || firstHeading(chunks[0]) || "Presentation";
let tpl = fs.readFileSync(path.join(ROOT, "src", "template.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "src", "core.css"), "utf8") + "\n" +
            fs.readFileSync(path.join(ROOT, "src", "components.css"), "utf8");
const js = fs.readFileSync(path.join(ROOT, "src", "core.js"), "utf8");

tpl = tpl
  .replaceAll("{{TITLE}}", esc(title))
  .replaceAll("{{GOOGLE_FONTS}}", theme.fonts.googleFonts || "")
  .replace("{{THEME_VARS}}", themeVars)
  .replace("{{CORE_CSS}}", css)
  .replace("{{CHROME}}", chrome)
  .replace("{{SLIDES}}", slidesHtml)
  .replaceAll("{{TOTAL}}", String(chunks.length))
  .replace("{{CORE_JS}}", js);

/* ── write ── */
out = out || path.join("dist", path.basename(input).replace(/\.deck\.md$|\.md$/, "") + ".html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, tpl, "utf8");
console.log(`✓ ${chunks.length} slides · theme "${theme.name}" → ${out}`);

/* ── helpers ── */
function parseFrontmatter(text) {
  const o = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    o[m[1]] = v;
  }
  return o;
}
function firstHeading(chunk) {
  const m = (chunk || "").match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}
function shortTitle(t) { return t.length > 24 ? t.slice(0, 22) + "…" : t; }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function inlineAsset(src) {
  if (/^(https?:|data:)/.test(src)) return src;
  const p = path.resolve(path.dirname(input), src);
  if (!fs.existsSync(p)) { console.warn(`  ! logo not found: ${src}`); return src; }
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(p).toString("base64")}`;
}
