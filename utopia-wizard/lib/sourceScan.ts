import { readFile, readdir } from 'fs/promises'
import path from 'path'

export interface HardcodedPhone {
  file: string
  line: number
  match: string
  excerpt: string
}

const SKIP_DIRS = new Set(['node_modules', '.next', '.vercel', '.git', 'temporary screenshots', 'brand_assets', 'dist', 'build'])
const SCAN_EXTS = ['.tsx', '.ts', '.jsx', '.js']

// Match Malaysian phone numbers in raw or formatted forms.
export const PHONE_PATTERNS = [
  /\+60\d{8,11}/g,                        // +60123456789
  /\b60[1-9]\d{7,10}\b/g,                 // 60123456789
  /\b01[0-9]\s?-?\s?\d{3,4}\s?-?\s?\d{4}\b/g, // 0123 456 7890, 012-345-6789, etc.
]

/**
 * Scan an arbitrary text blob for phone numbers. Returns one hit per unique
 * starting offset (so `+60174287801` doesn't show up twice from the `+60`
 * and `60…` patterns both matching the same span).
 */
export function scanTextForPhones(text: string): { match: string; index: number; excerpt: string }[] {
  const byOffset = new Map<number, { match: string; index: number; excerpt: string }>()
  for (const re of PHONE_PATTERNS) {
    re.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      const start = Math.max(0, m.index - 50)
      const end = Math.min(text.length, m.index + m[0].length + 50)
      const excerpt = text.slice(start, end).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
      const prev = byOffset.get(m.index)
      if (!prev || m[0].length > prev.match.length) {
        byOffset.set(m.index, { match: m[0], index: m.index, excerpt })
      }
    }
  }
  return Array.from(byOffset.values()).sort((a, b) => a.index - b.index)
}

async function walk(dir: string, repoRoot: string, hits: HardcodedPhone[]): Promise<void> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      await walk(p, repoRoot, hits)
    } else if (SCAN_EXTS.some((x) => e.name.endsWith(x))) {
      try {
        const content = await readFile(p, 'utf-8')
        const lines = content.split('\n')
        for (let i = 0; i < lines.length; i++) {
          for (const h of scanTextForPhones(lines[i])) {
            hits.push({
              file: path.relative(repoRoot, p),
              line: i + 1,
              match: h.match,
              excerpt: lines[i].trim().slice(0, 160),
            })
          }
        }
      } catch { /* skip unreadable */ }
    }
  }
}

/**
 * Scan a project for hardcoded phone numbers in user-facing source code.
 * Only inspects app/ and components/ — config/site.ts (fallbackPhone) and
 * lib/webcore.ts (FALLBACK_PHONE constant) are the legitimate places for
 * the literal number, so we skip them.
 */
export interface BlogHardcodedPhone {
  post_slug: string
  language: string
  field: 'title' | 'content' | 'excerpt' | 'meta_title' | 'meta_description'
  match: string
  excerpt: string
}

interface BlogContentInput {
  slug: string
  blog_translations: {
    language: string
    title: string | null
    content: string | null
    excerpt: string | null
    meta_title: string | null
    meta_description: string | null
  }[]
}

const BLOG_FIELDS: BlogHardcodedPhone['field'][] = ['title', 'content', 'excerpt', 'meta_title', 'meta_description']

export function findBlogHardcodedPhones(rows: BlogContentInput[] | null): BlogHardcodedPhone[] {
  if (!rows) return []
  const hits: BlogHardcodedPhone[] = []
  for (const post of rows) {
    for (const t of post.blog_translations ?? []) {
      for (const field of BLOG_FIELDS) {
        const text = t[field]
        if (!text) continue
        for (const h of scanTextForPhones(text)) {
          hits.push({
            post_slug: post.slug,
            language: t.language,
            field,
            match: h.match,
            excerpt: h.excerpt,
          })
        }
      }
    }
  }
  return hits
}

export async function findHardcodedPhones(projectDir: string): Promise<HardcodedPhone[]> {
  const raw: HardcodedPhone[] = []
  await walk(path.join(projectDir, 'app'), projectDir, raw)
  await walk(path.join(projectDir, 'components'), projectDir, raw)

  // Multiple patterns can match the same number on the same line (e.g.
  // `+60174287801` matches both the `+60…` and `60…` patterns). Keep only
  // the longest match per file:line so each occurrence shows once.
  const byKey = new Map<string, HardcodedPhone>()
  for (const h of raw) {
    const key = `${h.file}:${h.line}`
    const prev = byKey.get(key)
    if (!prev || h.match.length > prev.match.length) byKey.set(key, h)
  }
  return Array.from(byKey.values())
}
