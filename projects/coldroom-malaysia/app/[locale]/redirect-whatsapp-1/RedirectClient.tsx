'use client';
import { useEffect } from 'react';

export default function RedirectClient({ url, phone }: { url: string; phone: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.uwc) {
      try { window.uwc('click', { label: `whatsapp-${phone}` }); } catch {}
    }
    const t = setTimeout(() => { window.location.href = url; }, 60);
    return () => clearTimeout(t);
  }, [url, phone]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        background: '#FFFFFF',
        color: '#0F0F0F',
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <p style={{ marginBottom: '16px', fontSize: '15px' }}>Opening WhatsApp…</p>
        <a
          href={url}
          style={{
            color: '#FFFFFF',
            background: '#25D366',
            padding: '12px 22px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Tap to open WhatsApp
        </a>
      </div>
    </div>
  );
}
