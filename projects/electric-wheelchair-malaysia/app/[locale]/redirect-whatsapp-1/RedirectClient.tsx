'use client';
import { useEffect } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
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
