'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function computeRemaining(): { h: string; m: string; s: string } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  let diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const s = diff - m * 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s) };
}

export default function FomoBar() {
  const t = useTranslations('fomo');
  const [time, setTime] = useState<{ h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    setTime(computeRemaining());
    const id = setInterval(() => setTime(computeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const labelHrs = t('labels.hrs');
  const labelMin = t('labels.min');
  const labelSec = t('labels.sec');

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        background: '#0A0A0A',
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 10,
          minHeight: 36,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: 0.1 }}>
          {t('primary')}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <span className="fomo-chip">
            {time ? time.h : '00'}
            <span className="fomo-chip-label">{labelHrs}</span>
          </span>
          <span>:</span>
          <span className="fomo-chip">
            {time ? time.m : '00'}
            <span className="fomo-chip-label">{labelMin}</span>
          </span>
          <span>:</span>
          <span className="fomo-chip">
            {time ? time.s : '00'}
            <span className="fomo-chip-label">{labelSec}</span>
          </span>
        </span>
      </div>
      <style jsx>{`
        .fomo-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.16);
        }
        .fomo-chip-label {
          font-size: 10px;
          font-weight: 500;
          opacity: 0.85;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
