import { localePath } from './localeHref';

export function waRedirect(
  locale: string,
  message?: string,
  locationSlug?: string,
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (locationSlug) params.set('loc', locationSlug);
  const qs = params.toString();
  // localePath, not `/${locale}/…` — with localePrefix 'as-needed' the default
  // locale is served un-prefixed, so /ms/redirect-whatsapp-1 costs a 307 hop
  // on the conversion path for every Malay visitor.
  return `${localePath(locale, '/redirect-whatsapp-1')}${qs ? `?${qs}` : ''}`;
}
