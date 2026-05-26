'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

function diffParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function FomoBanner() {
  const t = useTranslations('fomo');
  const locale = useLocale();
  const [parts, setParts] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sewamotor-promo-end') : null;
    let end: Date;
    if (stored && !Number.isNaN(Date.parse(stored)) && new Date(stored).getTime() > Date.now()) {
      end = new Date(stored);
    } else {
      end = new Date(Date.now() + 7 * 86_400_000);
      try { localStorage.setItem('sewamotor-promo-end', end.toISOString()); } catch { /* noop */ }
    }
    setParts(diffParts(end));
    const id = setInterval(() => setParts(diffParts(end)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fomo-bar" role="region" aria-label="Promotional offer">
      <div className="fomo-inner">
        <span className="fomo-tag">{t('eyebrow') || 'PROMO'}</span>
        <span className="fomo-body">{t('body') || t('message') || ''}</span>
        <span aria-live="polite" className="fomo-clock">
          {parts ? (
            <>
              <span>{pad(parts.days)}</span>
              <span>:</span>
              <span>{pad(parts.hours)}</span>
              <span>:</span>
              <span>{pad(parts.minutes)}</span>
              <span>:</span>
              <span>{pad(parts.seconds)}</span>
            </>
          ) : (
            <span style={{ visibility: 'hidden' }}>00 : 00 : 00 : 00</span>
          )}
        </span>
        <Link href={`/${locale}/redirect-whatsapp-1`} className="fomo-link" target="_blank" rel="noopener noreferrer">
          {t('bookNow') || t('ctaLabel') || 'Book Now'} →
        </Link>
      </div>
      <style jsx>{`
        .fomo-bar { background: #B91C1C; color: #fff; font-size: 13px; padding: 8px 16px; }
        .fomo-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .fomo-tag { font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.9; }
        .fomo-body { font-weight: 500; }
        .fomo-clock { font-variant-numeric: tabular-nums; font-weight: 600; }
        .fomo-link { font-weight: 700; text-decoration: underline; }
      `}</style>
    </div>
  );
}
