'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';

// Countdown target = last moment of the current month, so the "{month} promo"
// copy stays aligned with the clock. When the month flips, a page reload picks
// up the new month name + a fresh ~30-day clock.
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
  const { month, monthUpper } = useMemo(() => {
    const intlLocale = INTL_LOCALE[locale] ?? locale;
    const m = new Intl.DateTimeFormat(intlLocale, { month: 'long' }).format(new Date());
    return { month: m, monthUpper: m.toUpperCase() };
  }, [locale]);

  useEffect(() => {
    const tick = () => setParts(diffParts(endOfMonth(new Date())));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fomo-bar">
      <div className="fomo-inner">
        <span className="fomo-tag">{t('eyebrow', { month, monthUpper })}</span>
        <span className="fomo-body">{t('body', { month, monthUpper })}</span>
        {/* The clock only exists after hydration (Date.now() can't be rendered
            on the server). The placeholder therefore mirrors the real markup
            exactly — four boxed segments and three separators — so it reserves
            the same width. A single collapsed placeholder span used to reserve
            ~26px against the real ~180px, and the centred banner visibly
            reflowed on every page load. */}
        <span aria-live="polite" className={`fomo-clock ${parts ? 'is-ready' : ''}`}>
          <span>{parts ? pad(parts.days) : '00'}</span>
          <span className="fomo-sep">:</span>
          <span>{parts ? pad(parts.hours) : '00'}</span>
          <span className="fomo-sep">:</span>
          <span>{parts ? pad(parts.minutes) : '00'}</span>
          <span className="fomo-sep">:</span>
          <span>{parts ? pad(parts.seconds) : '00'}</span>
        </span>
        <Link href={waRedirect(locale)} className="fomo-link" target="_blank" rel="noopener noreferrer">
          {t('ctaLabel')} →
        </Link>
      </div>
    </div>
  );
}
