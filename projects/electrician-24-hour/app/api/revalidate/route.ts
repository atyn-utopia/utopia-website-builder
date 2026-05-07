import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.WEBCORE_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'WEBCORE_REVALIDATE_SECRET not set' },
      { status: 500 },
    )
  }
  if (req.headers.get('x-webcore-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await req.json().catch(() => null)) as { tags?: string[] } | null
  const tags = Array.isArray(body?.tags) ? body!.tags : []
  if (tags.length === 0) {
    return NextResponse.json({ error: 'No tags provided' }, { status: 400 })
  }
  for (const tag of tags) revalidateTag(tag)
  return NextResponse.json({ revalidated: tags })
}
