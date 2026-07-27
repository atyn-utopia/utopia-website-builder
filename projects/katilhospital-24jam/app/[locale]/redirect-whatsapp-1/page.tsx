import { headers } from 'next/headers';
import { getPhoneNumber, waLink } from '@/lib/webcore';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

const LOCALE_PREFIXES = new Set(['en', 'ms', 'zh']);

async function resolvePageSlug(explicit?: string): Promise<string | undefined> {
  if (explicit?.trim()) return explicit.trim();
  try {
    const ref = (await headers()).get('referer');
    if (!ref) return undefined;
    const segments = new URL(ref).pathname.split('/').filter(Boolean);
    if (segments.length && LOCALE_PREFIXES.has(segments[0])) segments.shift();
    return segments[0] || undefined;
  } catch {
    return undefined;
  }
}

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string; page?: string }>;
}) {
  const { loc, message, page } = await searchParams;
  const pageSlug = await resolvePageSlug(page);
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined, pageSlug);
  const url = waLink(phone, message || whatsappText);
  return <RedirectClient url={url} phone={phone} loc={loc} />;
}
