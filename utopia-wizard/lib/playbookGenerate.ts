/**
 * Assemble a system-playbook-style structure from a repo's CLAUDE.md plus the
 * files it references and the conventional folders (agents/, docs/, prompts/,
 * workflows/, .claude/). Deterministic — no AI.
 *
 *   - CLAUDE.md headings  → layers + units
 *   - agents/*.md         → an "Agents" layer; each agent is a unit, owner =
 *                           the agent name, purpose = its role line
 *   - docs/prompts/wf     → a "Docs & Workflows" layer; one unit per file
 *   - file paths cited in a section become that unit's doc links
 */

const GH = 'https://api.github.com'

export interface PBDoc { label: string; path: string; url: string }
export interface PBUnit { name: string; owner?: string; purpose: string; docs: PBDoc[]; maturity?: number }
export interface PBLayer { title: string; intro: string; units: PBUnit[]; phase?: string }
export interface PBStructure {
  title: string
  repo: string
  sourcePath: string
  layers: PBLayer[]
  filesRead: string[]
}

const FOLDER_PREFIXES = ['agents/', 'docs/', 'prompts/', 'workflows/', '.claude/']
const TEXT_EXT = /\.(md|mdx|ya?ml|txt)$/i
const MAX_FILES = 40

function ghHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'utopia-wizard' }
}

function blobUrl(repo: string, path: string) {
  return `https://github.com/${repo}/blob/HEAD/${path}`
}

async function getTree(token: string, repo: string): Promise<string[]> {
  try {
    const res = await fetch(`${GH}/repos/${repo}/git/trees/HEAD?recursive=1`, {
      headers: ghHeaders(token), cache: 'no-store', signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return []
    const json = (await res.json()) as { tree?: { path: string; type: string }[] }
    return (json.tree ?? []).filter((t) => t.type === 'blob').map((t) => t.path)
  } catch { return [] }
}

async function getFile(token: string, repo: string, path: string): Promise<string | null> {
  try {
    const res = await fetch(`${GH}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
      headers: ghHeaders(token), cache: 'no-store', signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { content?: string; encoding?: string }
    if (!json.content) return null
    return json.encoding === 'base64' ? Buffer.from(json.content, 'base64').toString('utf-8') : json.content
  } catch { return null }
}

interface Section { level: number; title: string; body: string }
function parseSections(md: string): { title: string | null; sections: Section[] } {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const secs: Section[] = []
  let title: string | null = null
  let cur: Section | null = null
  let fence = false
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) fence = !fence
    const h = !fence ? line.match(/^(#{1,6})\s+(.+?)\s*$/) : null
    if (h) {
      if (title === null && h[1].length === 1 && secs.length === 0) { title = h[2].trim(); continue }
      cur = { level: h[1].length, title: h[2].trim(), body: '' }
      secs.push(cur)
    } else if (cur) cur.body += (cur.body ? '\n' : '') + line
  }
  return { title, sections: secs.map((s) => ({ ...s, body: s.body.trim() })) }
}

/** Repo-relative file paths mentioned in a chunk of markdown. */
function citedPaths(text: string, known: Set<string>): string[] {
  const out = new Set<string>()
  const re = /(?:[`(\s"']|^)([\w][\w./-]*\.(?:md|mdx|ya?ml|ts|tsx|sql|html|json))/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const p = m[1].replace(/^\.\//, '')
    if (known.has(p)) out.add(p)
  }
  return [...out]
}

function firstParagraph(md: string, max = 220): string {
  const { sections } = parseSections(md)
  const body = sections[0]?.body || md
  for (const block of body.split(/\n\s*\n/)) {
    const t = block.replace(/^[#>\-*\s]+/, '').replace(/\n/g, ' ').trim()
    if (t.length > 12) return t.length > max ? t.slice(0, max - 1) + '…' : t
  }
  const t = md.replace(/[#>*`]/g, '').replace(/\n+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1) + '…' : t
}

/** "agents/nana.md" → "Nana"; first H1 wins if present. */
function fileTitle(path: string, content: string): string {
  const { title } = parseSections(content)
  if (title) return title.replace(/^[^\w]+/, '').trim()
  const base = path.split('/').pop()!.replace(TEXT_EXT, '')
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export interface GatheredFile { path: string; content: string }

/**
 * Collect the files that inform the playbook: cited paths in CLAUDE.md +
 * everything under the conventional folders. Shared by the deterministic
 * parser and the AI generator.
 */
export async function gatherFiles(token: string, repo: string, claudePath: string, claudeMd: string): Promise<GatheredFile[]> {
  const tree = await getTree(token, repo)
  const known = new Set(tree)
  const wanted = new Set<string>()
  for (const p of citedPaths(claudeMd, known)) if (TEXT_EXT.test(p)) wanted.add(p)
  for (const p of tree) if (FOLDER_PREFIXES.some((pre) => p.startsWith(pre)) && TEXT_EXT.test(p)) wanted.add(p)
  wanted.delete(claudePath)
  const files = [...wanted].slice(0, MAX_FILES)
  const fetched = await Promise.all(files.map(async (p) => ({ path: p, content: await getFile(token, repo, p) })))
  return fetched.filter((f): f is GatheredFile => !!f.content)
}

export function repoBlobUrl(repo: string, path: string) { return blobUrl(repo, path) }

export async function generatePlaybook(
  token: string,
  repo: string,
  claudePath: string,
  claudeMd: string,
): Promise<PBStructure> {
  const tree = await getTree(token, repo)
  const known = new Set(tree)

  const { title: docTitle, sections } = parseSections(claudeMd)

  // ── Layers/units from CLAUDE.md ──────────────────────────────────────────
  const levels = sections.map((s) => s.level)
  const layerLevel = levels.length ? Math.min(...levels) : 2
  const deeper = levels.filter((l) => l > layerLevel)
  const unitLevel = deeper.length ? Math.min(...deeper) : layerLevel

  const layers: PBLayer[] = []
  const newLayer = (t: string, intro = ''): PBLayer => { const l = { title: t, intro, units: [] as PBUnit[] }; layers.push(l); return l }
  let layer: PBLayer = newLayer('Overview')
  let unit: PBUnit | null = null
  let hasContent = false
  const mkDocs = (body: string): PBDoc[] =>
    citedPaths(body, known).map((p) => ({ label: p, path: p, url: blobUrl(repo, p) }))

  for (const s of sections) {
    if (s.level === layerLevel && unitLevel !== layerLevel) {
      layer = newLayer(s.title, s.body); unit = null; hasContent = true
    } else if (s.level === unitLevel) {
      unit = { name: s.title, purpose: firstParagraph(s.body), docs: mkDocs(s.body) }
      layer.units.push(unit); hasContent = true
    } else {
      const block = `**${s.title}** — ${firstParagraph(s.body, 140)}`
      if (unit) { unit.purpose += `\n${block}`; unit.docs.push(...mkDocs(s.body)) }
      else layer.intro += (layer.intro ? '\n' : '') + block
      hasContent = true
    }
  }
  let clean = layers.filter((l) => l.units.length > 0 || l.intro)
  if (!hasContent) clean = []

  // ── Files to incorporate: cited paths + conventional folders ─────────────
  const wanted = new Set<string>()
  for (const p of citedPaths(claudeMd, known)) if (TEXT_EXT.test(p)) wanted.add(p)
  for (const p of tree) if (FOLDER_PREFIXES.some((pre) => p.startsWith(pre)) && TEXT_EXT.test(p)) wanted.add(p)
  wanted.delete(claudePath)
  const files = [...wanted].slice(0, MAX_FILES)

  const fetched = await Promise.all(
    files.map(async (p) => ({ path: p, content: await getFile(token, repo, p) })),
  )
  const ok = fetched.filter((f): f is { path: string; content: string } => !!f.content)

  // ── Agents layer ─────────────────────────────────────────────────────────
  const agentFiles = ok.filter((f) => f.path.startsWith('agents/'))
  if (agentFiles.length) {
    const aLayer = newLayer('Agents', 'The AI agent team referenced by CLAUDE.md.')
    for (const f of agentFiles) {
      const name = fileTitle(f.path, f.content)
      aLayer.units.push({
        name,
        owner: name.split(/[—-]/)[0].trim().split(/\s+/)[0],
        purpose: firstParagraph(f.content),
        docs: [{ label: f.path, path: f.path, url: blobUrl(repo, f.path) }],
      })
    }
    clean.push(aLayer)
  }

  // ── Docs & Workflows layer ───────────────────────────────────────────────
  const docFiles = ok.filter((f) => !f.path.startsWith('agents/'))
  if (docFiles.length) {
    const dLayer = newLayer('Docs & Workflows', 'Referenced docs, prompts and workflow files.')
    for (const f of docFiles) {
      dLayer.units.push({
        name: fileTitle(f.path, f.content),
        purpose: firstParagraph(f.content),
        docs: [{ label: f.path, path: f.path, url: blobUrl(repo, f.path) }],
      })
    }
    clean.push(dLayer)
  }

  return {
    title: docTitle ?? repo.split('/')[1],
    repo,
    sourcePath: claudePath,
    layers: clean,
    filesRead: [claudePath, ...ok.map((f) => f.path)],
  }
}
