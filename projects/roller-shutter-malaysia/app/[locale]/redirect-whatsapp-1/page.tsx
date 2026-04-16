import { getWhatsAppLink } from '@/lib/getPhoneNumber';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';

export default async function WhatsAppRedirect({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const params = await searchParams;
  const location = params.loc ?? 'all';
  const message = params.message ?? 'Hai, saya berminat dengan perkhidmatan roller shutter. Boleh saya dapatkan sebut harga?';
  const url = await getWhatsAppLink(location, message);

  return <RedirectClient url={url} />;
}
