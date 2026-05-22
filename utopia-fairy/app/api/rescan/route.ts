import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const REPO = 'atyn-utopia/utopia-website-builder'
const WORKFLOW = 'monitor-scan.yml'

interface GhRun {
  id: number
  status: 'queued' | 'in_progress' | 'completed'
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null
  created_at: string
  updated_at: string
  html_url: string
  event: string
  display_title: string
}

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN env not set')
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

/**
 * POST → trigger the monitor-scan workflow on main.
 * Returns the run that just kicked off (best-effort — GitHub doesn't return
 * a run id from the dispatch endpoint, so we list the latest workflow runs
 * filtered to workflow_dispatch and pick the newest one).
 */
export async function POST() {
  try {
    const dispatch = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: 'POST',
        headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: 'main' }),
      },
    )
    if (!dispatch.ok) {
      const text = await dispatch.text()
      return NextResponse.json(
        { ok: false, error: `GitHub dispatch failed (${dispatch.status}): ${text.slice(0, 200)}` },
        { status: 502 },
      )
    }

    // GitHub takes a moment to register the run — poll briefly for the freshly
    // queued workflow_dispatch run so we have its id to return.
    let run: GhRun | null = null
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 700))
      const list = await fetch(
        `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?event=workflow_dispatch&per_page=5`,
        { headers: ghHeaders(), cache: 'no-store' },
      )
      if (!list.ok) continue
      const body = (await list.json()) as { workflow_runs: GhRun[] }
      const fresh = body.workflow_runs.find(
        (r) => Date.now() - new Date(r.created_at).getTime() < 30_000,
      )
      if (fresh) { run = fresh; break }
    }

    return NextResponse.json({
      ok: true,
      run: run
        ? { id: run.id, status: run.status, conclusion: run.conclusion, url: run.html_url, createdAt: run.created_at }
        : null,
    })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}

/**
 * GET → status of the most recent monitor-scan run (any trigger).
 * Used by the client to poll without spamming GitHub on every render.
 */
export async function GET() {
  try {
    const list = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=1`,
      { headers: ghHeaders(), cache: 'no-store' },
    )
    if (!list.ok) {
      const text = await list.text()
      return NextResponse.json(
        { ok: false, error: `GitHub list failed (${list.status}): ${text.slice(0, 200)}` },
        { status: 502 },
      )
    }
    const body = (await list.json()) as { workflow_runs: GhRun[] }
    const latest = body.workflow_runs[0]
    if (!latest) return NextResponse.json({ ok: true, run: null })
    return NextResponse.json({
      ok: true,
      run: {
        id: latest.id,
        status: latest.status,
        conclusion: latest.conclusion,
        url: latest.html_url,
        createdAt: latest.created_at,
        updatedAt: latest.updated_at,
        event: latest.event,
        title: latest.display_title,
      },
    })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}
