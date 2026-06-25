/**
 * Create a new GitHub repo for a project and seed it in ONE commit (Git Data
 * API): inputs.md (the brief), a CLAUDE.md (build rules), and brand_assets/*.
 * Used by the GitHub-only "New Project" flow — nothing touches local disk.
 */

const GH = 'https://api.github.com'

export interface SeedFile {
  path: string
  /** utf-8 text content. */
  text?: string
  /** base64 content (for binary, e.g. brand assets). */
  base64?: string
}

export interface CreatedRepo {
  repoFullName: string
  htmlUrl: string
  cloneUrl: string
  defaultBranch: string
}

function headers(token: string, extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'utopia-wizard',
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function gh<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${GH}${path}`, {
    method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${t.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

/** Fetch a file's text from a (public or accessible) repo. Null if missing. */
export async function fetchRepoFileText(token: string, repoFullName: string, path: string): Promise<string | null> {
  try {
    const res = await fetch(`${GH}/repos/${repoFullName}/contents/${encodeURIComponent(path)}`, {
      headers: headers(token), cache: 'no-store', signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { content?: string; encoding?: string }
    if (!json.content) return null
    return json.encoding === 'base64' ? Buffer.from(json.content, 'base64').toString('utf-8') : json.content
  } catch { return null }
}

export async function createProjectRepo(
  token: string,
  params: { slug: string; description?: string; private?: boolean; files: SeedFile[] },
): Promise<CreatedRepo> {
  // 1. Create the repo WITH an initial commit. (auto_init: false leaves the git
  //    backend empty, and the Git Data API then rejects blob creation with
  //    "Git Repository is empty" — so we seed an initial commit and build on it.)
  const repo = await gh<{ full_name: string; html_url: string; clone_url: string; default_branch: string }>(
    token, 'POST', '/user/repos',
    { name: params.slug, description: params.description ?? '', private: params.private ?? true, auto_init: true },
  )
  const full = repo.full_name
  const branch = repo.default_branch || 'main'

  // 2. Wait for the initial commit ref to be available (usually instant).
  let parentSha = ''
  for (let i = 0; i < 6; i++) {
    try {
      const ref = await gh<{ object: { sha: string } }>(token, 'GET', `/repos/${full}/git/ref/heads/${branch}`)
      parentSha = ref.object.sha
      break
    } catch {
      await new Promise((r) => setTimeout(r, 800))
    }
  }
  if (!parentSha) throw new Error('repo created but initial commit not ready')

  // 3. Blob per file.
  const tree = await Promise.all(params.files.map(async (f) => {
    const blob = await gh<{ sha: string }>(token, 'POST', `/repos/${full}/git/blobs`,
      f.base64 != null
        ? { content: f.base64, encoding: 'base64' }
        : { content: f.text ?? '', encoding: 'utf-8' })
    return { path: f.path, mode: '100644' as const, type: 'blob' as const, sha: blob.sha }
  }))

  // 4. Fresh tree (no base_tree → drops the auto-generated README) → 5. commit
  //    on top of the initial commit → 6. fast-forward the branch (force).
  const treeRes = await gh<{ sha: string }>(token, 'POST', `/repos/${full}/git/trees`, { tree })
  const commit = await gh<{ sha: string }>(token, 'POST', `/repos/${full}/git/commits`, {
    message: 'chore: scaffold project (Utopia Wizard)',
    tree: treeRes.sha,
    parents: [parentSha],
  })
  await gh(token, 'PATCH', `/repos/${full}/git/refs/heads/${branch}`, { sha: commit.sha, force: true })

  return { repoFullName: full, htmlUrl: repo.html_url, cloneUrl: repo.clone_url, defaultBranch: branch }
}
