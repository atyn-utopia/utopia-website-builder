import { NextRequest, NextResponse } from 'next/server';
import { getPhoneNumber } from '@/lib/webcore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('loc') || searchParams.get('location') || undefined;

  try {
    const result = await getPhoneNumber(location);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[phones API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone number' },
      { status: 500 }
    );
  }
}
