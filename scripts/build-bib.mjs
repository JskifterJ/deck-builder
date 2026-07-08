#!/usr/bin/env node
/* ============================================================
   build-bib.mjs — turn a BibTeX file into citation data the
   Slidev theme can import, and collect which keys the deck cites.

   Source .bib resolution order:
     1. $DECK_BIB (absolute or relative path)
     2. ./references.bib   (e.g. a symlink/copy of the thesis bib)
     3. ./references.sample.bib   (shipped fallback)

   Emits:
     theme/generated/bib.json    { key: {id, inline, full, url, year, sortkey} }
     theme/generated/cited.json  ["key1", "key2", ...] in first-appearance order
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "theme", "generated");
const SLIDES = path.join(ROOT, "slides.md");

const bibPath = resolveBib();
const bibText = fs.existsSync(bibPath) ? fs.readFileSync(bibPath, "utf8") : "";
const entries = parseBib(bibText);

const bib = {};
for (const e of entries) bib[e.key] = formatEntry(e);

const cited = collectCited(fs.existsSync(SLIDES) ? fs.readFileSync(SLIDES, "utf8") : "");
const missing = cited.filter((k) => !bib[k]);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "bib.json"), JSON.stringify(bib, null, 0));
fs.writeFileSync(path.join(OUT, "cited.json"), JSON.stringify(cited, null, 0));

console.log(`✓ bib: ${Object.keys(bib).length} entries from ${path.relative(ROOT, bibPath)} · ${cited.length} cited in deck`);
if (missing.length) console.warn(`  ! ${missing.length} cited key(s) not in bib: ${missing.join(", ")}`);

/* ── resolution ── */
function resolveBib() {
  if (process.env.DECK_BIB) return path.resolve(process.env.DECK_BIB);
  const local = path.join(ROOT, "references.bib");
  if (fs.existsSync(local)) return local;
  return path.join(ROOT, "references.sample.bib");
}

/* ── BibTeX parser (tolerant, brace-balanced) ── */
function parseBib(text) {
  const out = [];
  let i = 0;
  while ((i = text.indexOf("@", i)) !== -1) {
    const braceStart = text.indexOf("{", i);
    if (braceStart === -1) break;
    const type = text.slice(i + 1, braceStart).trim().toLowerCase();
    if (["comment", "string", "preamble"].includes(type)) { i = braceStart + 1; continue; }
    let depth = 0, j = braceStart, end = -1;
    for (; j < text.length; j++) {
      const c = text[j];
      if (c === "{") depth++;
      else if (c === "}") { depth--; if (depth === 0) { end = j; break; } }
    }
    if (end === -1) break;
    const body = text.slice(braceStart + 1, end);
    const comma = body.indexOf(",");
    const key = body.slice(0, comma).trim();
    out.push({ key, type, fields: parseFields(body.slice(comma + 1)) });
    i = end + 1;
  }
  return out;
}

function parseFields(s) {
  const fields = {};
  let i = 0;
  const n = s.length;
  while (i < n) {
    while (i < n && /[\s,]/.test(s[i])) i++;
    let eq = s.indexOf("=", i);
    if (eq === -1) break;
    const name = s.slice(i, eq).trim().toLowerCase();
    i = eq + 1;
    while (i < n && /\s/.test(s[i])) i++;
    let val = "";
    if (s[i] === "{") {
      let depth = 0, j = i;
      for (; j < n; j++) { if (s[j] === "{") depth++; else if (s[j] === "}") { depth--; if (depth === 0) break; } }
      val = s.slice(i + 1, j); i = j + 1;
    } else if (s[i] === '"') {
      let j = i + 1; while (j < n && s[j] !== '"') j++;
      val = s.slice(i + 1, j); i = j + 1;
    } else {
      let j = i; while (j < n && s[j] !== ",") j++;
      val = s.slice(i, j).trim(); i = j;
    }
    if (name) fields[name] = val;
  }
  return fields;
}

/* ── LaTeX cleanup + formatting ── */
function cleanLatex(s) {
  return String(s || "")
    .replace(/\{\\textbackslash\}/g, "\\")
    .replace(/\{\\textasciitilde\}/g, "~")
    .replace(/\{\\textemdash\}/g, "—").replace(/\{\\textendash\}/g, "–")
    .replace(/\\&/g, "&").replace(/\\%/g, "%").replace(/\\\$/g, "$").replace(/\\_/g, "_").replace(/\\#/g, "#")
    .replace(/``|''/g, '"').replace(/---/g, "—").replace(/--/g, "–")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ").trim();
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function splitAuthors(raw) {
  if (!raw) return [];
  return raw.split(/\s+and\s+/).map((tok) => {
    const corporate = /^\s*\{.*\}\s*$/.test(tok);
    const name = cleanLatex(tok);
    if (corporate) return { display: name, sort: name };
    if (name.includes(",")) { const last = name.split(",")[0].trim(); return { display: last, sort: last }; }
    const parts = name.split(/\s+/);
    const last = parts.length > 1 ? parts[parts.length - 1] : name;
    return { display: last, sort: last };
  });
}
function yearOf(f) {
  if (f.year) { const m = String(f.year).match(/\d{4}/); if (m) return m[0]; }
  for (const k of ["date", "urldate"]) if (f[k]) { const m = String(f[k]).match(/\d{4}/); if (m) return m[0]; }
  return "n.d.";
}
function inlineLabel(authors, year) {
  let who;
  if (authors.length === 0) who = "Anon.";
  else if (authors.length === 1) who = authors[0].display;
  else if (authors.length === 2) who = `${authors[0].display} & ${authors[1].display}`;
  else who = `${authors[0].display} et al.`;
  return `${who}, ${year}`;
}
function formatEntry(e) {
  const f = e.fields;
  const authors = splitAuthors(f.author);
  const year = yearOf(f);
  const title = cleanLatex(f.title);
  const url = (f.url || "").trim();
  const venue = cleanLatex(f.journal || f.booktitle || f.publisher || f.howpublished || "");
  const accessed = f.urldate ? ` (accessed ${f.urldate})` : "";
  const who = authors.length ? authors.map((a) => a.display).join(authors.length === 2 ? " & " : ", ") : "Anon.";
  let full = `${esc(who)} (${esc(year)}). <em>${esc(title)}</em>.`;
  if (venue) full += ` ${esc(venue)}.`;
  if (url) full += ` <a href="${esc(url)}">${esc(url)}</a>${esc(accessed)}`;
  const sortkey = ((authors[0] && authors[0].sort) || "zzz").toLowerCase() + " " + year;
  return { id: e.key, inline: inlineLabel(authors, year), full, url, year, sortkey };
}

/* ── which keys does the deck cite? ── */
function collectCited(md) {
  const re = /\[(?:@|CITE:\s*)([\w:.-]+)(?:,[^\]]*)?\]/g;
  const seen = new Set(); const order = [];
  let m;
  while ((m = re.exec(md))) { if (!seen.has(m[1])) { seen.add(m[1]); order.push(m[1]); } }
  return order;
}
