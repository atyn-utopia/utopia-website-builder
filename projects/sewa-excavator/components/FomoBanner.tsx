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
  const [parts, setParts] = useState({ days: 5, hours: 12, minutes: 0, seconds: 0 });

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
    <div
      style={{
        background: 'var(--alert-red)',
        color: '#fff',
        fontFamily: 'var(--font-display)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '10px var(--gut)',
          fontSize: '13px',
          lineHeight: 1.4,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono-stack)',
            fontWeight: 700,
            fontSize: '10.5px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.18)',
            padding: '4px 8px',
            borderRadius: '999px',
          }}
        >
          {t('eyebrow')}
        </span>
        <span style={{ fontWeight: 500 }}>{t('body')}</span>
        <span
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-mono-stack)',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '0.04em',
            display: 'inline-flex',
            gap: 6,
            alignItems: 'center',
          }}
        >
          <span>{pad(parts.days)}</span>
          <span style={{ opacity: 0.6 }}>:</span>
          <span>{pad(parts.hours)}</span>
          <span style={{ opacity: 0.6 }}>:</span>
          <span>{pad(parts.minutes)}</span>
          <span style={{ opacity: 0.6 }}>:</span>
          <span>{pad(parts.seconds)}</span>
        </span>
        <Link
          href={waRedirect(locale)}
          style={{
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontSize: '13px',
          }}
        >
          {t('ctaLabel')} →
        </Link>
        {target && <noscript style={{ display: 'none' }}>{target.toISOString()}</noscript>}
      </div>
    </div>
  );
}
