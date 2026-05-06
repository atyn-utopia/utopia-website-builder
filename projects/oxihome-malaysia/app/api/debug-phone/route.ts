import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const host = (await headers()).get('host') ?? 'unknown'

  const SUPABASE_URL =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const SUPABASE_KEY =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({
      host,
      records: null,
      error: 'Supabase not configured',
      supabase_url: SUPABASE_URL || 'NOT SET',
    })
  }

  try {
    const path =
      `phone_numbers?select=*&website=eq.${encodeURIComponent(host)}`
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
      next: { tags: ['webcore-phones'] },
    })

    if (!res.ok) {
      return NextResponse.json({
        host,
        records: null,
        error: `${res.status} ${res.statusText}`,
        supabase_url: SUPABASE_URL,
      })
    }

    const data = await res.json()
    return NextResponse.json({
      host,
      records: data,
      error: null,
      supabase_url: SUPABASE_URL,
    })
  } catch (err) {
    return NextResponse.json({
      host,
      records: null,
      error: err instanceof Error ? err.message : String(err),
      supabase_url: SUPABASE_URL,
    })
  }
}
