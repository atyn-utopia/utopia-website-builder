import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, access } from 'fs/promises'
import path from 'path'

export const maxDuration = 60

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

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 })
    }

    const repoRoot = path.resolve(process.cwd(), '..')

    // The filesystem is the source of truth for whether we should write — not
    // the dataMode flag. Running locally with UTOPIA_FAIRY_USE_SNAPSHOTS=1
    // still gives access to projects/, so brand-asset uploads should land on
    // disk. Only fall back to the "snapshot" reply when the directory genuinely
    // isn't reachable (Vercel deployment).
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

    // Resolve project path relative to the repo root (utopia-fairy lives at repo root)
    const projectDir = path.join(repoRoot, 'projects', slug)
    const brandAssetsDir = path.join(projectDir, 'brand_assets')

    // Create directories
    await mkdir(brandAssetsDir, { recursive: true })

    // Build inputs.md content
    const timestamp = new Date().toISOString()
    const fileNames = files.filter(f => f.size > 0).map(f => f.name)
    const assetsSection = fileNames.length > 0
      ? fileNames.map(name => `- ${name}`).join('\n')
      : '- (none attached)'

    const inputsMd = `# ${slug} — Project Inputs

**Created:** ${timestamp}
**Slug:** ${slug}

## Prompt
${prompt}

## Brand Assets
${assetsSection}
`

    // Write inputs.md
    await writeFile(path.join(projectDir, 'inputs.md'), inputsMd, 'utf-8')

    // Save uploaded files to brand_assets/
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
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
