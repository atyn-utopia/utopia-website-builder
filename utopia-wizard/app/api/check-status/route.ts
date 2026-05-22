import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { findLocalUrl } from '@/lib/detect-local'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ deployUrl: null, localUrl: null })
  }

  const repoRoot = path.resolve(process.cwd(), '..')
  const projectDir = path.join(repoRoot, 'projects', slug)

  // Check for Vercel deploy URL:
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

  return NextResponse.json({ deployUrl, localUrl })
}
