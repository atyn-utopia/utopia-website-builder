import { getPhoneNumber, waLink } from '@/lib/webcore';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const { loc, message } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const url = waLink(phone, message || whatsappText);
  return <RedirectClient url={url} phone={phone} loc={loc} />;
}
