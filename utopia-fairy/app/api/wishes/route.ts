import { NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import path from 'path'
import { findLocalUrl } from '@/lib/detect-local'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const repoRoot = path.resolve(process.cwd(), '..')
    const projectsDir = path.join(repoRoot, 'projects')

    const entries = await readdir(projectsDir)
    const wishes = []

    for (const entry of entries) {
      const inputsPath = path.join(projectsDir, entry, 'inputs.md')
      try {
        const inputsStat = await stat(inputsPath)
        const content = await readFile(inputsPath, 'utf-8')

        // Extract prompt (first line after "## Prompt")
        const promptMatch = content.match(/## Prompt\n([\s\S]*?)(\n##|$)/)
        const prompt = promptMatch ? promptMatch[1].trim().slice(0, 120) : ''

        const projectDir = path.join(projectsDir, entry)

        // Check for deploy URL:
        // 1. Try deploy-url.txt first (explicit)
        // 2. Fall back to checking .vercel/project.json for Vercel project name
        let deployUrl: string | null = null
        try {
          deployUrl = (await readFile(path.join(projectDir, 'deploy-url.txt'), 'utf-8')).trim()
        } catch {
          try {
            const vercelProject = JSON.parse(
              await readFile(path.join(projectDir, '.vercel', 'project.json'), 'utf-8')
            )
            if (vercelProject.projectName) {
              const candidateUrl = `https://${vercelProject.projectName}.vercel.app`
              const res = await fetch(candidateUrl, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(3000) }).catch(() => null)
              if (res && (res.ok || res.status === 307 || res.status === 308)) {
                deployUrl = candidateUrl
              }
            }
          } catch { /* no vercel config */ }
        }

        // Find local URL with port scanning
        const localUrl = await findLocalUrl(projectDir)

        const status = deployUrl ? 'deployed' : localUrl ? 'preview' : 'building'

        wishes.push({
          slug: entry,
          prompt,
          createdAt: inputsStat.mtime.toISOString(),
          status,
          deployUrl,
          localUrl,
        })
      } catch {
        // No inputs.md — skip (e.g. admin folder)
      }
    }

    // Sort newest first
    wishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ wishes })
  } catch {
    return NextResponse.json({ wishes: [] })
  }
}
