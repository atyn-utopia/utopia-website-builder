// projects/skylift-malaysia/app/[locale]/redirect-whatsapp-1/RedirectClient.tsx
'use client';
import { useEffect } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: '#F8F8F6',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '12px', color: '#1C1F2A' }}>Opening WhatsApp...</p>
        <a
          href={url}
          style={{ color: '#25D366', fontWeight: 600, fontSize: '16px' }}
        >
          Click here if it did not open
        </a>
      </div>
    </div>
  );
}
