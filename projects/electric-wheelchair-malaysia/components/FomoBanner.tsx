// Sticky urgency banner with live ticking countdown. Mirrors the
// sewa-excavator chrome 1:1 (same layout, same animation, same urgency colour),
// adapted to read this project's existing fomoBanner.{texts[],bookNow} schema.
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';

function diffParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => String(n).padStart(2, '0');

// page.tsx passes a locale prop. We accept it but rely on useLocale() so this
// can stay a client component (needed for the countdown).
export default function FomoBanner(_props?: { locale?: Locale }) {
  const t = useTranslations('fomoBanner');
  const locale = useLocale();
  const texts = t.raw('texts') as string[];
  const body = Array.isArray(texts) && texts.length > 0 ? texts[0] : '';
  const cta = t('bookNow');

  const [parts, setParts] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ewc-promo-end') : null;
    let end: Date;
    if (stored && !Number.isNaN(Date.parse(stored)) && new Date(stored).getTime() > Date.now()) {
      end = new Date(stored);
    } else {
      end = new Date(Date.now() + 7 * 86_400_000);
      try { localStorage.setItem('ewc-promo-end', end.toISOString()); } catch { /* noop */ }
    }
    setParts(diffParts(end));
    const id = setInterval(() => setParts(diffParts(end)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ewc-fomo">
      <div className="ewc-fomo__inner">
        <span className="ewc-fomo__tag">PROMO</span>
        <span className="ewc-fomo__body">{body}</span>
        <span aria-live="polite" className={`ewc-fomo__clock ${parts ? 'is-ready' : ''}`}>
          {parts ? (
            <>
              <span>{pad(parts.days)}d</span>
              <span className="ewc-fomo__sep">:</span>
              <span>{pad(parts.hours)}h</span>
              <span className="ewc-fomo__sep">:</span>
              <span>{pad(parts.minutes)}m</span>
              <span className="ewc-fomo__sep">:</span>
              <span>{pad(parts.seconds)}s</span>
            </>
          ) : (
            <span style={{ visibility: 'hidden' }}>00d : 00h : 00m : 00s</span>
          )}
        </span>
        <Link
          href={`/${locale}/redirect-whatsapp-1`}
          className="ewc-fomo__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {cta} →
        </Link>
      </div>

      <style jsx>{`
        .ewc-fomo {
          background: #DC2626;
          color: #fff;
          position: relative;
          z-index: 50;
        }
        .ewc-fomo__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 13.5px;
          line-height: 1.35;
        }
        .ewc-fomo__tag {
          background: rgba(255,255,255,0.18);
          padding: 3px 9px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 10.5px;
          letter-spacing: 0.14em;
        }
        .ewc-fomo__body { font-weight: 600; }
        .ewc-fomo__clock {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-variant-numeric: tabular-nums;
          font-weight: 800;
          letter-spacing: 0.02em;
          background: rgba(0,0,0,0.25);
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12.5px;
        }
        .ewc-fomo__sep { opacity: 0.55; }
        .ewc-fomo__cta {
          background: #fff;
          color: #DC2626;
          padding: 5px 14px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12.5px;
          text-decoration: none;
          transition: transform 0.18s ease;
        }
        .ewc-fomo__cta:hover { transform: translateY(-1px); }
        @media (max-width: 640px) {
          .ewc-fomo__inner { padding: 9px 12px; gap: 8px; font-size: 12.5px; }
          .ewc-fomo__tag { display: none; }
        }
      `}</style>
    </div>
  );
}
