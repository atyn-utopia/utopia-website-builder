'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const pad = (n: number) => String(n).padStart(2, '0');

function slotsForHour(hour: number) {
  if (hour < 10) return 5;
  if (hour < 14) return 3;
  if (hour < 18) return 2;
  return 1;
}

export default function FomoBanner() {
  const t = useTranslations('fomo');
  const locale = useLocale();
  const [parts, setParts] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [slots, setSlots] = useState(3);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const ms = Math.max(0, end.getTime() - now.getTime());
      setParts({
        hours: Math.floor(ms / 3_600_000),
        minutes: Math.floor((ms % 3_600_000) / 60_000),
        seconds: Math.floor((ms % 60_000) / 1000),
      });
      setSlots(slotsForHour(now.getHours()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fomo-bar" role="region" aria-label="Promotional offer">
      <div className="fomo-inner">
        <span className="fomo-dot" aria-hidden="true" />
        <span className="fomo-body">{t('message', { slots })}</span>
        <span aria-live="polite" className="fomo-clock">
          {parts ? `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}` : (
            <span style={{ visibility: 'hidden' }}>00:00:00</span>
          )}
        </span>
        <Link href={`/${locale}/redirect-whatsapp-1`} className="fomo-link" target="_blank" rel="noopener noreferrer">
          {t('bookNow')} →
        </Link>
      </div>
      <style jsx>{`
        .fomo-bar { background: #B91C1C; color: #fff; font-size: 13px; padding: 8px 16px; }
        .fomo-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .fomo-dot {
          width: 8px; height: 8px; border-radius: 999px; background: #fff;
          flex-shrink: 0;
          animation: fomo-pulse 1.4s ease-in-out infinite;
        }
        @keyframes fomo-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(255,255,255,0); }
        }
        .fomo-body { font-weight: 500; }
        .fomo-clock {
          font-variant-numeric: tabular-nums; font-weight: 700;
          background: rgba(0,0,0,0.28); padding: 2px 8px; border-radius: 6px;
          letter-spacing: 0.02em;
        }
        .fomo-link { font-weight: 700; text-decoration: underline; }
        .fomo-link:hover { text-decoration: none; }
      `}</style>
    </div>
  );
}
