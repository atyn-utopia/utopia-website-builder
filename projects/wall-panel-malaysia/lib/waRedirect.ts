export function waRedirect(
  locale: string,
  message?: string,
  location?: string,
): string {
  const params = new URLSearchParams()
  if (location && location !== 'all') params.set('loc', location)
  if (message) params.set('message', message)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}
