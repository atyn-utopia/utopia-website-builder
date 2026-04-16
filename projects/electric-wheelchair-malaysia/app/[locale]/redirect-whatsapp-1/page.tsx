import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string }>;
}) {
  const { loc } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const url = waLink(phone, whatsappText);
  return <RedirectClient url={url} />;
}
