/**
 * Lightweight wrapper for the Utopia Webcore tracking script (window.uwc).
 * Safe to call from client components — no-ops on the server or if the script
 * hasn't loaded yet.
 */

export function trackClick(label: string) {
  if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
    window.uwc('click', { label });
  }
}

export function trackImpression(label: string) {
  if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
    window.uwc('impression', { label });
  }
}

export function trackWhatsApp(phone: string, locationSlug?: string) {
  const label = locationSlug ? `whatsapp-${phone}-${locationSlug}` : `whatsapp-${phone}`;
  trackClick(label);
}
