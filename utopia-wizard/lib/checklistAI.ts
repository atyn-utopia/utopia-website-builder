/**
 * Derive a per-user checklist from a repo's CLAUDE.md (+ referenced files)
 * using OpenAI. Produces structured, verifiable check items that become the
 * user's own checklist (Phase 2 evaluates repos against them).
 */

import { gatherFiles } from './playbookGenerate'

export function openaiConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

const MODEL = process.env.OPENAI_CHECKLIST_MODEL ?? 'gpt-4o'
const PER_FILE_CAP = 6000
const TOTAL_CAP = 90_000

export type Severity = 'blocking' | 'warning' | 'info'
export interface CheckItem {
  id: string
  group: string
  name: string
  description: string
  severity: Severity
}

const SCHEMA_HINT = `Return JSON: { "items": [ {
  "id": string,            // short kebab-case, unique (e.g. "single-h1")
  "group": string,         // category (e.g. "SEO", "Layout", "Content", "Deployment")
  "name": string,          // imperative check title (e.g. "Exactly one H1 per page")
  "description": string,   // what passing means + how to verify, 1-2 sentences
  "severity": "blocking" | "warning" | "info"
} ] }`

interface AIResult { items?: Partial<CheckItem>[] }

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48)

export async function generateChecklistAI(
  token: string,
  repo: string,
  claudePath: string,
  claudeMd: string,
): Promise<CheckItem[]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY not set')

  const files = await gatherFiles(token, repo, claudePath, claudeMd)
  let budget = TOTAL_CAP
  const clip = (s: string) => (s.length > PER_FILE_CAP ? s.slice(0, PER_FILE_CAP) + '\n…[truncated]' : s)
  const parts: string[] = [`### ${claudePath}\n${clip(claudeMd)}`]
  budget -= parts[0].length
  for (const f of files) {
    const block = `### ${f.path}\n${clip(f.content)}`
    if (block.length > budget) continue
    parts.push(block); budget -= block.length
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You extract a concrete, verifiable website QA checklist from a build spec. Each item must be objectively checkable against a website codebase (headings, copy length, colors, files, config, SEO, i18n, deployment, etc.). Prefer specific, rule-like checks over vague ones. Output 20-60 items. ' +
            SCHEMA_HINT,
        },
        { role: 'user', content: `Repo: ${repo}\n\nBuild spec + related files:\n\n${parts.join('\n\n')}` },
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

  const seen = new Set<string>()
  const items: CheckItem[] = []
  for (const it of parsed.items ?? []) {
    const name = (it.name ?? '').trim()
    if (!name) continue
    let id = slugify(it.id || name)
    if (!id) continue
    while (seen.has(id)) id = `${id}-x`
    seen.add(id)
    const sev: Severity = it.severity === 'blocking' || it.severity === 'info' ? it.severity : 'warning'
    items.push({
      id,
      group: (it.group ?? 'General').trim() || 'General',
      name,
      description: (it.description ?? '').trim(),
      severity: sev,
    })
  }
  if (items.length === 0) throw new Error('No checklist items were produced')
  return items
}
