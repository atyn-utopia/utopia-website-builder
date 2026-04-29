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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '12px' }}>Opening WhatsApp...</p>
        <a href={url} style={{ color: '#25D366', fontWeight: 600, fontSize: '16px' }}>
          Click here if it did not open
        </a>
      </div>
    </div>
  );
}
