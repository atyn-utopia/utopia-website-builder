/**
 * AI-generated playbook via the OpenAI API. Sends CLAUDE.md + the gathered
 * agent/doc/workflow files and asks for a structured playbook (layers, units,
 * owners, maturity, doc links) matching the system playbook's shape.
 */

import { gatherFiles, repoBlobUrl, type PBStructure } from './playbookGenerate'

export function openaiConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

const MODEL = process.env.OPENAI_PLAYBOOK_MODEL ?? 'gpt-4o'
const PER_FILE_CAP = 6000
const TOTAL_CAP = 90_000

const SCHEMA_HINT = `Return JSON of shape:
{
  "title": string,
  "layers": [
    {
      "title": string,                // a major capability/phase
      "phase": string|null,           // e.g. BUILD | DATA | SHIP, or null
      "intro": string,                // 1 sentence
      "units": [
        {
          "name": string,             // a concrete capability/step
          "owner": string|null,       // the agent/role responsible, if any
          "maturity": number,         // 0-100 how complete & production-ready this is, judged from the docs
          "purpose": string,          // 1-2 sentences
          "docs": [ { "label": string, "path": string } ]  // repo-relative source files for this unit
        }
      ]
    }
  ]
}`

interface AIDoc { label: string; path: string }
interface AIUnit { name: string; owner?: string | null; maturity?: number; purpose: string; docs?: AIDoc[] }
interface AILayer { title: string; phase?: string | null; intro?: string; units: AIUnit[] }
interface AIResult { title?: string; layers?: AILayer[] }

export async function generatePlaybookAI(
  token: string,
  repo: string,
  claudePath: string,
  claudeMd: string,
): Promise<PBStructure> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY not set')

  const files = await gatherFiles(token, repo, claudePath, claudeMd)

  // Build the corpus within budget.
  let budget = TOTAL_CAP
  const clip = (s: string) => (s.length > PER_FILE_CAP ? s.slice(0, PER_FILE_CAP) + '\n…[truncated]' : s)
  const parts: string[] = [`### ${claudePath}\n${clip(claudeMd)}`]
  budget -= parts[0].length
  const used: string[] = [claudePath]
  for (const f of files) {
    const block = `### ${f.path}\n${clip(f.content)}`
    if (block.length > budget) continue
    parts.push(block); budget -= block.length; used.push(f.path)
  }
  const corpus = parts.join('\n\n')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You decompose a website-builder repository into a "build playbook": ordered layers, each with concrete units, an owning agent/role, a maturity score (0-100, judged from how complete & production-ready the documentation/implementation looks), a short purpose, and links to the source files. Map agent files (agents/*.md) to unit owners. Be specific and faithful to the docs. ' +
            SCHEMA_HINT,
        },
        { role: 'user', content: `Repo: ${repo}\n\nFiles:\n\n${corpus}` },
      ],
    }),
    signal: AbortSignal.timeout(55_000),
  })

  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`OpenAI ${res.status}: ${t.slice(0, 180)}`)
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const raw = json.choices?.[0]?.message?.content
  if (!raw) throw new Error('OpenAI returned no content')

  let parsed: AIResult
  try { parsed = JSON.parse(raw) as AIResult } catch { throw new Error('OpenAI returned invalid JSON') }

  const layers = (parsed.layers ?? []).map((l) => ({
    title: l.title || 'Layer',
    phase: l.phase ?? undefined,
    intro: l.intro ?? '',
    units: (l.units ?? []).map((u) => ({
      name: u.name || 'Unit',
      owner: u.owner ?? undefined,
      maturity: typeof u.maturity === 'number' ? Math.max(0, Math.min(100, Math.round(u.maturity))) : undefined,
      purpose: u.purpose ?? '',
      docs: (u.docs ?? []).map((d) => ({ label: d.label || d.path, path: d.path, url: repoBlobUrl(repo, d.path) })),
    })),
  }))

  return {
    title: parsed.title || repo.split('/')[1],
    repo,
    sourcePath: claudePath,
    layers,
    filesRead: used,
  }
}
