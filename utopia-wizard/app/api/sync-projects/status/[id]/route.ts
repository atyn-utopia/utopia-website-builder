import { NextResponse } from 'next/server'

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

interface SyncRequestRow {
  id: string
  status: 'pending' | 'running' | 'done' | 'error'
  mode: 'pr' | 'main'
  message: string | null
  result: unknown
  requested_at: string
  started_at: string | null
  finished_at: string | null
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id || !/^[a-f0-9-]{36}$/i.test(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
  }
  if (!SUPA_URL || !SUPA_ANON) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 })
  }

  const res = await fetch(`${SUPA_URL}/rest/v1/sync_requests?id=eq.${id}&select=*&limit=1`, {
    headers: {
      apikey: SUPA_ANON,
      Authorization: `Bearer ${SUPA_ANON}`,
      'Accept-Profile': process.env.SUPABASE_DB_SCHEMA ?? 'webcore',
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `Supabase ${res.status}` }, { status: 500 })
  }
  const rows = (await res.json()) as SyncRequestRow[]
  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'Request not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, request: rows[0] })
}
