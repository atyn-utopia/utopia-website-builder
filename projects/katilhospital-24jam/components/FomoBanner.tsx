'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Live countdown to end-of-day — ticking hours:minutes:seconds (CLAUDE.md
// mandates a live countdown in the FOMO banner). This is the canonical
// implementation; FomoBar re-exports it for backwards-compatible imports.
function computeRemaining(): { h: string; m: string; s: string } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  let diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return { h: pad(hours), m: pad(minutes), s: pad(seconds) };
}

export default function FomoBanner() {
  const t = useTranslations('fomo');
  const [time, setTime] = useState<{ h: string; m: string; s: string } | null>(null);

  // Countdown timer: re-compute the remaining seconds every 1000ms so the
  // banner visibly ticks down.
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
        // Sticky so the urgency banner stays pinned to the top of the viewport
        // as the visitor scrolls (CLAUDE.md: FOMO banner sticky at the top).
        position: 'sticky',
        top: 0,
        zIndex: 60,
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13, letterSpacing: 0.1 }}>
          <span aria-hidden="true" className="fomo-live-dot" />
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
        .fomo-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #ff4d4d;
          box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.6);
          animation: fomoLivePulse 1.6s ease-out infinite;
        }
        @keyframes fomoLivePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.55);
          }
          70% {
            box-shadow: 0 0 0 7px rgba(255, 77, 77, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
          }
        }
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
