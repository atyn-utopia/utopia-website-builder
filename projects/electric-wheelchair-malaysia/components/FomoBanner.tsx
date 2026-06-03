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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
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
