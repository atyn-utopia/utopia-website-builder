'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { WhatsAppButton } from './WhatsAppButton';

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
        {/* WhatsAppButton, not a bare Link — it carries target/rel AND fires
            the uwc('click', 'whatsapp-…') event this banner was missing. */}
        <WhatsAppButton href={waRedirect(locale)} label="fomo" className="fomo-link">
          {t('ctaLabel')} →
        </WhatsAppButton>
      </div>
    </div>
  );
}
