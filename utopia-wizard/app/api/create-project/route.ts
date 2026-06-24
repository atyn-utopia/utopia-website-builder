import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, access } from 'fs/promises'
import path from 'path'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { setProjectOwner } from '@/lib/wizardUsers'

export const maxDuration = 60
export const runtime = 'nodejs'

/**
 * Record the creating user as the project's owner (drives the per-user
 * checklist filter). No-op for passcode/open sessions, which have no real
 * GitHub identity to attribute — those projects stay unowned until claimed.
 */
async function stampOwner(slug: string): Promise<void> {
  try {
    const user = await currentUser()
    if (!user || user.login === PASSCODE_LOGIN) return
    await setProjectOwner(slug, user.login, user.login)
  } catch { /* ownership is best-effort; never block project creation */ }
}

function buildClaudeCommand(slug: string): string {
  return `claude "Using @CLAUDE.md files, generate the ${slug} website. Read projects/${slug}/inputs.md for the project brief."`
}

async function projectsDirIsWritable(repoRoot: string): Promise<boolean> {
  try {
    await access(path.join(repoRoot, 'projects'))
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const slug = formData.get('slug') as string
    const files = formData.getAll('files') as File[]

    if (!prompt || !slug) {
      return NextResponse.json({ success: false, error: 'Prompt and slug are required' }, { status: 400 })
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 })
    }

    const repoRoot = path.resolve(process.cwd(), '..')

    // Attribute the project to its creator before doing any filesystem work,
    // so ownership is recorded even in snapshot (deployed) mode.
    await stampOwner(slug)

    if (!(await projectsDirIsWritable(repoRoot))) {
      return NextResponse.json({
        success: true,
        mode: 'snapshot',
        slug,
        projectPath: `projects/${slug}/`,
        command: buildClaudeCommand(slug),
        prompt,
      })
    }

    const projectDir = path.join(repoRoot, 'projects', slug)
    const brandAssetsDir = path.join(projectDir, 'brand_assets')
    await mkdir(brandAssetsDir, { recursive: true })

    const timestamp = new Date().toISOString()
    const fileNames = files.filter((f) => f.size > 0).map((f) => f.name)
    const assetsSection = fileNames.length > 0
      ? fileNames.map((n) => `- ${n}`).join('\n')
      : '- (none attached)'

    const inputsMd = `# ${slug} — Project Inputs

**Created:** ${timestamp}
**Slug:** ${slug}

## Prompt
${prompt}

## Brand Assets
${assetsSection}
`

    await writeFile(path.join(projectDir, 'inputs.md'), inputsMd, 'utf-8')

    for (const file of files) {
      if (file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(brandAssetsDir, file.name), buffer)
    }

    return NextResponse.json({
      success: true,
      mode: 'live',
      slug,
      projectPath: `projects/${slug}/`,
      filesCount: fileNames.length,
      command: buildClaudeCommand(slug),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    // Friendlier surfaces for the two common failure modes
    let userMessage = message
    if (message.includes('Failed to parse body') || message.includes('Unexpected end of form')) {
      userMessage = 'Upload exceeded the 9 MB request cap. Compress your files (try squoosh.app) and try again.'
    }
    return NextResponse.json({ success: false, error: userMessage }, { status: 500 })
  }
}
