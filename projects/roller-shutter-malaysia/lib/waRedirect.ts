/**
 * Build a WhatsApp redirect URL that routes through our tracking page.
 * All WhatsApp CTAs go through here — never link directly to WhatsApp.
 */
export function waRedirect(
  locale: string,
  message?: string,
  location?: string
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (location) params.set('loc', location);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
