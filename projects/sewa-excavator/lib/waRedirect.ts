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

export function calcQuote(
  dailyRate: number,
  days: number,
  period: 'daily' | 'weekly' | 'monthly',
): number {
  const d = Math.max(1, Math.floor(days));
  if (period === 'daily') return dailyRate * d;
  if (period === 'weekly') return dailyRate * (Math.floor(d / 7) * 6 + (d % 7));
  return dailyRate * (Math.floor(d / 30) * 22 + Math.min(d % 30, 22));
}
