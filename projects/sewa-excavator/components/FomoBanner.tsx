'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';

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
  const [target, setTarget] = useState<Date | null>(null);
  const [parts, setParts] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // Promo ends 7 days from first visit, persisted in localStorage so it doesn't reset.
    const stored = typeof window !== 'undefined' ? localStorage.getItem('abang-promo-end') : null;
    let end: Date;
    if (stored && !Number.isNaN(Date.parse(stored)) && new Date(stored).getTime() > Date.now()) {
      end = new Date(stored);
    } else {
      end = new Date(Date.now() + 7 * 86_400_000);
      try { localStorage.setItem('abang-promo-end', end.toISOString()); } catch { /* noop */ }
    }
    setTarget(end);
    setParts(diffParts(end));
    const id = setInterval(() => setParts(diffParts(end)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fomo-bar">
      <div className="container fomo-inner">
        <span className="fomo-tag">{t('eyebrow')}</span>
        <span className="fomo-body">{t('body')}</span>
        <span aria-live="polite" className={`fomo-clock ${parts ? 'is-ready' : ''}`}>
          {parts ? (
            <>
              <span>{pad(parts.days)}</span>
              <span className="fomo-sep">:</span>
              <span>{pad(parts.hours)}</span>
              <span className="fomo-sep">:</span>
              <span>{pad(parts.minutes)}</span>
              <span className="fomo-sep">:</span>
              <span>{pad(parts.seconds)}</span>
            </>
          ) : (
            <span style={{ visibility: 'hidden' }}>00 : 00 : 00 : 00</span>
          )}
        </span>
        <Link href={waRedirect(locale)} className="fomo-link">{t('ctaLabel')} →</Link>
        {target && <noscript style={{ display: 'none' }}>{target.toISOString()}</noscript>}
      </div>
    </div>
  );
}
