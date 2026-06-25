import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getUserToken, connectUserRepo, setProjectOwner } from '@/lib/wizardUsers'
import { createProjectRepo, fetchRepoFileText, type SeedFile } from '@/lib/createGithubProject'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Where the canonical build rules (CLAUDE.md) come from.
const BUILDER_REPO = process.env.BUILDER_TEMPLATE_REPO ?? 'atyn-utopia/utopia-website-builder'

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }
  const token = await getUserToken(user.login)
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'No stored GitHub token — re-add your account with a token that can create repos.' },
      { status: 400 },
    )
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ ok: false, error: 'Invalid form.' }, { status: 400 })

  const name = (form.get('name') as string | null)?.trim() ?? ''
  const brief = (form.get('brief') as string | null)?.trim() ?? ''
  const slug = toSlug((form.get('slug') as string | null)?.trim() || name)
  const isPrivate = (form.get('visibility') as string | null) !== 'public'
  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)

  if (!slug) return NextResponse.json({ ok: false, error: 'A project name (or slug) is required.' }, { status: 400 })
  if (!brief) return NextResponse.json({ ok: false, error: 'A project brief is required.' }, { status: 400 })

  // ── Assemble the seed files ──────────────────────────────────────────────
  const assetNames = files.map((f) => f.name)
  const inputsMd = `# ${name || slug} — Project Inputs

**Created:** ${new Date().toISOString()}
**Slug:** ${slug}
**Owner:** @${user.login}

## Brief
${brief}

## Brand Assets
${assetNames.length ? assetNames.map((n) => `- brand_assets/${n}`).join('\n') : '- (none attached)'}
`

  const seed: SeedFile[] = [{ path: 'inputs.md', text: inputsMd }]

  // CLAUDE.md (build rules) fetched from the builder repo.
  const claudeMd = await fetchRepoFileText(token, BUILDER_REPO, 'CLAUDE.md')
  if (claudeMd) seed.push({ path: 'CLAUDE.md', text: claudeMd })

  // Brand assets (binary → base64).
  for (const f of files) {
    const buf = Buffer.from(await f.arrayBuffer())
    seed.push({ path: `brand_assets/${f.name}`, base64: buf.toString('base64') })
  }

  // ── Create the repo + commit everything ──────────────────────────────────
  let created
  try {
    created = await createProjectRepo(token, { slug, description: name || slug, private: isPrivate, files: seed })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const friendly = /name already exists/i.test(msg)
      ? `A repo named "${slug}" already exists on your account — pick another name.`
      : `Could not create the repo: ${msg}`
    return NextResponse.json({ ok: false, error: friendly }, { status: 400 })
  }

  // ── Auto-connect to the dashboard ────────────────────────────────────────
  await connectUserRepo({
    githubLogin: user.login,
    repoFullName: created.repoFullName,
    defaultBranch: created.defaultBranch,
    projectSlug: slug,
    htmlUrl: created.htmlUrl,
  }).catch(() => {})
  await setProjectOwner(slug, user.login, user.login).catch(() => {})

  // ── The prompt to paste into Claude ──────────────────────────────────────
  const prompt = `git clone ${created.cloneUrl}
cd ${slug}
claude "Using @CLAUDE.md, read inputs.md and everything in brand_assets/, then generate this website end-to-end following the Utopia build system (agents, SEO, i18n, Supabase, deploy)."`

  return NextResponse.json({
    ok: true,
    slug,
    repoFullName: created.repoFullName,
    htmlUrl: created.htmlUrl,
    cloneUrl: created.cloneUrl,
    seededClaude: !!claudeMd,
    assets: assetNames.length,
    prompt,
  })
}
