/**
 * Every WhatsApp CTA on the site routes through /redirect-whatsapp-1 so the
 * server resolves the right phone number from Supabase (leads_mode, per-page
 * and per-location routing) in one place. Never build a wa.me link directly.
 */
export function waRedirect(
  locale: string,
  message?: string,
  locationSlug?: string,
  pageSlug?: string,
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (locationSlug) params.set('loc', locationSlug);
  if (pageSlug) params.set('page', pageSlug);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
