'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function diffParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => String(n).padStart(2, '0');

const INTL_LOCALE: Record<string, string> = { en: 'en-US', ms: 'ms-MY', zh: 'zh-CN' };

export default function FomoBanner() {
  const t = useTranslations('fomo');
  const locale = useLocale();
  const [parts, setParts] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Render-time month name so the banner copy matches the countdown month.
  // Computed once per render to avoid hydration drift; rolls over naturally
  // because the page is re-rendered on each new navigation.
  const { month, monthUpper } = useMemo(() => {
    const intlLocale = INTL_LOCALE[locale] ?? locale;
    const m = new Intl.DateTimeFormat(intlLocale, { month: 'long' }).format(new Date());
    return { month: m, monthUpper: m.toUpperCase() };
  }, [locale]);

  useEffect(() => {
    // Countdown ends at midnight on the last day of the current month so the
    // "{month} promo" copy and the clock stay aligned. When the month flips,
    // a page reload picks up the new month name + a fresh ~30-day clock.
    const tick = () => {
      const target = endOfMonth(new Date());
      setParts(diffParts(target));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fomo-bar">
      <div className="container fomo-inner">
        <span className="fomo-tag">{t('eyebrow', { month, monthUpper })}</span>
        <span className="fomo-body">{t('body', { month, monthUpper })}</span>
        {/* The clock only exists after hydration (Date.now() can't be rendered
            on the server). The placeholder therefore mirrors the real markup
            exactly — four segments and three separators — so it reserves the
            same width. A single collapsed placeholder span reserved far less,
            and when the real clock landed the flex row rewrapped and the whole
            banner grew a line, shoving the header down (CLS ≈ 0.25). */}
        <span aria-live="polite" className={`fomo-clock ${parts ? 'is-ready' : ''}`}>
          <span>{parts ? pad(parts.days) : '00'}</span>
          <span className="fomo-sep">:</span>
          <span>{parts ? pad(parts.hours) : '00'}</span>
          <span className="fomo-sep">:</span>
          <span>{parts ? pad(parts.minutes) : '00'}</span>
          <span className="fomo-sep">:</span>
          <span>{parts ? pad(parts.seconds) : '00'}</span>
        </span>
        <Link href={waRedirect(locale)} className="fomo-link" target="_blank" rel="noopener noreferrer">{t('ctaLabel')} →</Link>
      </div>
    </div>
  );
}
