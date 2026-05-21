import { readFile } from 'fs/promises'
import path from 'path'

export interface ProjectInfo {
  slug: string
  projectDir: string
  domain: string | null
  productSlug: string | null
  fallbackPhone: string | null
  deployUrl: string | null
  domainCandidates: string[]
}

function extractStringField(content: string, field: string): string | null {
  const re = new RegExp(`\\b${field}\\b[^'"\\n]*['"]([A-Za-z0-9.\\-_/]+)['"]`)
  const m = content.match(re)
  return m ? m[1] : null
}

function extractDataWebsite(content: string): string | null {
  const m = content.match(/data-website=["']([^"']+)["']/)
  return m ? m[1] : null
}

function hostOf(url: string | null): string | null {
  if (!url) return null
  try { return new URL(url).host } catch { return null }
}

export async function getProjectInfo(slug: string, projectsDir: string): Promise<ProjectInfo> {
  const projectDir = path.join(projectsDir, slug)
  let domain: string | null = null
  let productSlug: string | null = null
  let dataWebsite: string | null = null
  let fallbackPhone: string | null = null

  try {
    const site = await readFile(path.join(projectDir, 'config', 'site.ts'), 'utf-8')
    domain = extractStringField(site, 'domain')
    productSlug = extractStringField(site, 'productSlug')
    fallbackPhone = extractStringField(site, 'fallbackPhone')
  } catch { /* no site.ts yet */ }

  try {
    const layout = await readFile(path.join(projectDir, 'app', '[locale]', 'layout.tsx'), 'utf-8')
    dataWebsite = extractDataWebsite(layout)
  } catch { /* no layout */ }

  let deployUrl: string | null = null
  try {
    deployUrl = (await readFile(path.join(projectDir, 'deploy-url.txt'), 'utf-8')).trim()
  } catch {
    try {
      const vp = JSON.parse(
        await readFile(path.join(projectDir, '.vercel', 'project.json'), 'utf-8'),
      )
      if (vp.projectName) deployUrl = `https://${vp.projectName}.vercel.app`
    } catch { /* no vercel config */ }
  }

  // Collect every plausible domain alias so DB checks can match registrations
  // under custom domains (.com.my) or `.utopiaai.my` aliases.
  const candidates = new Set<string>()
  if (domain) {
    candidates.add(domain)
    candidates.add(domain.replace(/\.vercel\.app$/, '.utopiaai.my'))
  }
  if (dataWebsite) candidates.add(dataWebsite)
  const deployHost = hostOf(deployUrl)
  if (deployHost) candidates.add(deployHost)
  // Common fallback: <slug>.vercel.app
  candidates.add(`${slug}.vercel.app`)

  return {
    slug,
    projectDir,
    domain,
    productSlug,
    fallbackPhone,
    deployUrl,
    domainCandidates: Array.from(candidates).filter(Boolean),
  }
}
