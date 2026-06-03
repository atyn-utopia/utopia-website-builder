export function waRedirect(
  locale: string,
  message?: string,
  locationSlug?: string,
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (locationSlug) params.set('loc', locationSlug);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
