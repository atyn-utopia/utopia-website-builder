'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function diffParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');
const INTL_LOCALE: Record<string, string> = { en: 'en-US', ms: 'ms-MY', zh: 'zh-CN' };

type Parts = ReturnType<typeof diffParts>;

export default function FomoBanner() {
  const t = useTranslations('fomo');
  const locale = useLocale();
  const [parts, setParts] = useState<Parts | null>(null);

  const month = useMemo(() => {
    const intlLocale = INTL_LOCALE[locale] ?? locale;
    return new Intl.DateTimeFormat(intlLocale, { month: 'long' }).format(new Date());
  }, [locale]);

  useEffect(() => {
    // The clock runs to midnight on the last day of the current month so the
    // "{month} promo" copy and the countdown always agree.
    const tick = () => setParts(diffParts(endOfMonth(new Date())));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fomo-bar">
      <div className="fomo-inner max-w-7xl mx-auto">
        <span className="fomo-tag">{t('eyebrow')}</span>
        <span className="fomo-body">{t('body', { month })}</span>
        <span aria-live="polite" className="fomo-clock">
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
        <Link href={waRedirect(locale)} className="fomo-link" target="_blank" rel="noopener noreferrer">
          {t('ctaLabel')} →
        </Link>
      </div>
    </div>
  );
}
