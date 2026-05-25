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
  rates: { daily: number; monthly: number },
  days: number,
  period: 'daily' | 'weekly' | 'monthly',
): number {
  const d = Math.max(1, Math.floor(days));
  const daily = rates.daily;
  const monthly = rates.monthly;
  if (period === 'daily') return daily * d;
  if (period === 'weekly') return daily * (Math.floor(d / 7) * 6 + (d % 7));
  const fullMonths = Math.floor(d / 30);
  const remainder = d % 30;
  return fullMonths * monthly + Math.min(remainder * daily, monthly);
}
