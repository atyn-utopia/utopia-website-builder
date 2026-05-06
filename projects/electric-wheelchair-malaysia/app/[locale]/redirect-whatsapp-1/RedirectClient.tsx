'use client';
import { useEffect } from 'react';

/**
 * Extracts the phone number from a wa.me / whatsapp.com URL so analytics can
 * label which line received the click. Returns 'unknown' if it cannot parse.
 */
function extractPhoneFromWaUrl(url: string): string {
  try {
    const u = new URL(url);
    // wa.me/<phone>... or api.whatsapp.com/send?phone=<phone>
    const fromPath = u.pathname.replace(/^\/+/, '').split('/')[0];
    if (/^\d+$/.test(fromPath)) return fromPath;
    const fromQuery = u.searchParams.get('phone');
    if (fromQuery && /^\d+$/.test(fromQuery)) return fromQuery;
  } catch {
    // ignore — fall through
  }
  return 'unknown';
}

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
      const phoneNumber = extractPhoneFromWaUrl(url);
      window.uwc('click', { label: `whatsapp-${phoneNumber}` });
    }
    window.location.href = url;
  }, [url]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '12px' }}>Opening WhatsApp...</p>
        <a href={url} style={{ color: '#25D366', fontWeight: 600, fontSize: '16px' }}>
          Click here if it did not open
        </a>
      </div>
    </div>
  );
}
