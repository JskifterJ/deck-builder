import { definePreparserSetup } from '@slidev/types'

/**
 * Rewrites citation markers into <Cite/> components before Markdown parsing.
 *   [@key]            → <Cite id="key" />
 *   [@key, p.12]      → <Cite id="key" loc="p.12" />
 *   [CITE: key]       → <Cite id="key" />   (matches the thesis prose convention)
 */
const RE = /\[(?:@|CITE:\s*)([\w:.-]+)(?:,\s*([^\]]+))?\]/g

export default definePreparserSetup(() => [
  {
    name: 'zotero-cite',
    transformRawLines(lines) {
      let inFence = false
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*```/.test(lines[i])) { inFence = !inFence; continue }
        if (inFence) continue
        if (lines[i].includes('[@') || lines[i].includes('[CITE')) {
          lines[i] = lines[i].replace(RE, (_, id, loc) =>
            `<Cite id="${id}"${loc ? ` loc="${loc.trim()}"` : ''} />`)
        }
      }
    },
  },
])
