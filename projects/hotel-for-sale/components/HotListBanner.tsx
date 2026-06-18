'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function endOfDay(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}
const pad = (n: number) => String(n).padStart(2, '0');

export default function HotListBanner() {
  const t = useTranslations('hotlist');
  const [parts, setParts] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, endOfDay().getTime() - Date.now());
      setParts({ h: Math.floor(ms / 3.6e6), m: Math.floor((ms % 3.6e6) / 6e4), s: Math.floor((ms % 6e4) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hotlist-banner">
      <span className="hotlist-flame" aria-hidden="true">🔥</span>
      <span className="hotlist-banner-text">{t('bannerText')}</span>
      <span className="hotlist-clock" aria-live="polite">
        {parts ? (
          <>
            <b>{pad(parts.h)}</b><i>:</i><b>{pad(parts.m)}</b><i>:</i><b>{pad(parts.s)}</b>
          </>
        ) : (
          <span style={{ visibility: 'hidden' }}><b>00</b><i>:</i><b>00</b><i>:</i><b>00</b></span>
        )}
      </span>

      <style jsx>{`
        .hotlist-banner {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px 16px;
          max-width: 760px; margin: 0 auto 32px;
          padding: 14px 22px; border-radius: 999px;
          background: linear-gradient(100deg, #0A2540 0%, #C9300F 60%, #EF4123 100%);
          box-shadow: 0 14px 34px -14px rgba(239,65,35,0.5);
          color: #fff; text-align: center;
        }
        .hotlist-flame { font-size: 20px; line-height: 1; animation: flame 1.4s ease-in-out infinite; }
        @keyframes flame { 0%,100% { transform: scale(1) rotate(-4deg); } 50% { transform: scale(1.18) rotate(4deg); } }
        @media (prefers-reduced-motion: reduce) { .hotlist-flame { animation: none; } }
        .hotlist-banner-text { font-weight: 700; font-size: 14.5px; letter-spacing: -0.005em; }
        .hotlist-clock {
          display: inline-flex; align-items: center; gap: 3px;
          font-family: var(--font-mono-stack); font-weight: 700; font-size: 17px; letter-spacing: 0.02em;
          background: rgba(0,0,0,0.22); padding: 5px 12px; border-radius: 999px;
        }
        .hotlist-clock b { display: inline-block; min-width: 1.4em; text-align: center; }
        .hotlist-clock i { opacity: 0.6; font-style: normal; }
        @media (max-width: 559px) {
          .hotlist-banner { padding: 8px 12px; gap: 4px 7px; border-radius: 12px; margin-bottom: 22px; }
          .hotlist-flame { font-size: 14px; }
          .hotlist-banner-text { font-size: 11px; line-height: 1.3; }
          .hotlist-clock { font-size: 12.5px; padding: 3px 8px; gap: 2px; }
        }
      `}</style>
    </div>
  );
}
