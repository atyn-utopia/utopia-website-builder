import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const host = (await headers()).get('host') ?? 'unknown'

  if (!supabase) {
    return NextResponse.json({
      host,
      records: null,
      error: 'Supabase not configured',
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NOT SET',
    })
  }

  const { data, error } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('website', host)

  return NextResponse.json({
    host,
    records: data,
    error: error?.message ?? null,
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NOT SET',
  })
}
