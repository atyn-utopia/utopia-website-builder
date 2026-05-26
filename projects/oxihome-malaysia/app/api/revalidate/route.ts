import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TAGS = new Set(['webcore-products', 'webcore-phones', 'webcore-blog']);

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webcore-secret');
  const expected = process.env.WEBCORE_REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: 'WEBCORE_REVALIDATE_SECRET is not configured' },
      { status: 500 },
    );
  }
  if (!secret || secret !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { tags?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];
  const revalidated: string[] = [];
  for (const tag of tags) {
    if (ALLOWED_TAGS.has(tag)) {
      revalidateTag(tag);
      revalidated.push(tag);
    }
  }

  return NextResponse.json({ revalidated });
}
