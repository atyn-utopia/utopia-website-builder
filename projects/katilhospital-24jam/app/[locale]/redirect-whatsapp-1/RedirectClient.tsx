'use client';
import { useEffect } from 'react';

export default function RedirectClient({
  url,
  phone,
  loc,
}: {
  url: string;
  phone: string;
  loc?: string;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
      const label = loc ? `whatsapp-${phone}-${loc}` : `whatsapp-${phone}`;
      window.uwc('click', { label });
    }
    window.location.href = url;
  }, [url, phone, loc]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 12, color: '#1c3a6a' }}>Membuka WhatsApp…</p>
        <a
          href={url}
          style={{ color: '#25D366', fontWeight: 600, fontSize: 16 }}
        >
          Klik di sini jika tidak terbuka
        </a>
      </div>
    </div>
  );
}
