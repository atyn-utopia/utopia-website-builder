// projects/skylift-malaysia/app/[locale]/redirect-whatsapp-1/page.tsx
import { getPhoneNumber, waLink } from '@/lib/webcore';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const { loc, message } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const finalText = message && message.trim().length > 0 ? message : whatsappText;
  const url = waLink(phone, finalText);
  return <RedirectClient url={url} />;
}
