'use client';

// Canonical FOMO bar — sticky urgency banner with a LIVE countdown timer
// (hours:minutes:seconds, ticks every second) on a dark/urgent background.
// Rendered at the very top of every public page.
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';
import { trackWhatsApp } from '@/lib/track';

export default function FomoBanner() {
  const locale = useLocale();
  const t = useTranslations('fomoBanner');
  const waHref = waRedirect(locale);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, [now?.getDate()]);
  const diff = now ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

  return (
    <div className="fomo-bar">
      <div
        className="section-container fomo-inner"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '5px 20px', minHeight: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 12.5, justifyContent: 'center' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--cold-amber)', boxShadow: '0 0 0 3px rgba(240,138,28,0.22)', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{t('headline')}</span>
          <span aria-live="polite" className="fomo-countdown" style={{ color: 'var(--cold-amber-glow)', marginLeft: 4 }}>
            {hh}:{mm}:{ss}
          </span>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp(siteConfig.fallbackPhone)}
          style={{ color: 'var(--cold-amber-glow)', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3, flexShrink: 0 }}
        >
          {t('bookNow')}
        </a>
      </div>
    </div>
  );
}
