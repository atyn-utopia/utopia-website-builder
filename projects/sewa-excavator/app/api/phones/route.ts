import { NextRequest, NextResponse } from 'next/server';
import { getPhoneNumber, waLink } from '@/lib/webcore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const loc = req.nextUrl.searchParams.get('loc') ?? undefined;
  const result = await getPhoneNumber(loc);
  return NextResponse.json({
    mode: result.mode,
    source: result.source,
    waUrl: waLink(result.phone, result.whatsappText),
  });
}
