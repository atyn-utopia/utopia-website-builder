import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.WEBCORE_REVALIDATE_SECRET ?? ''

const ALLOWED_TAGS = new Set(['webcore-products', 'webcore-phones', 'webcore-blog'])

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { error: 'WEBCORE_REVALIDATE_SECRET not set on this deployment' },
      { status: 500 },
    )
  }

  const provided = request.headers.get('x-webcore-secret') ?? ''
  if (provided !== SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { tags?: string[] } | null
  if (!body || !Array.isArray(body.tags) || body.tags.length === 0) {
    return NextResponse.json({ error: 'missing tags[]' }, { status: 400 })
  }

  const revalidated: string[] = []
  const skipped: string[] = []
  for (const tag of body.tags) {
    if (typeof tag === 'string' && ALLOWED_TAGS.has(tag)) {
      revalidateTag(tag)
      revalidated.push(tag)
    } else {
      skipped.push(tag)
    }
  }

  return NextResponse.json({ revalidated, skipped })
}
