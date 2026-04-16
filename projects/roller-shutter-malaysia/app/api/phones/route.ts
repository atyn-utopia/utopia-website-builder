import { NextRequest, NextResponse } from 'next/server';
import { getPhoneNumber } from '@/lib/getPhoneNumber';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'all';

  const result = await getPhoneNumber(location);

  return NextResponse.json(result);
}
