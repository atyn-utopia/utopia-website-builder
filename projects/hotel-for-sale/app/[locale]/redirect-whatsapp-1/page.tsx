import { getPhoneNumber, waLink } from '@/lib/webcore';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Pin to Singapore so the function sits near Supabase's Cloudflare-KUL edge.
// Default iad1 (US East) round-trip is ~250ms each way and pushes the page's
// cold-start past the wizard's 7s liveness probe.
export const preferredRegion = 'sin1';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const { loc, message } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const url = waLink(phone, message || whatsappText);
  return <RedirectClient url={url} />;
}
