'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { routing } from '@/i18n/routing';
import { localePath } from '@/lib/localeHref';

const LABELS: Record<string, string> = { ms: 'MS', en: 'EN', zh: '中' };

function starPoints(cx: number, cy: number, outer: number, rot = -Math.PI / 2): string {
  const inner = outer * 0.382;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = rot + (Math.PI / 5) * i;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function CircleFlag({ locale }: { locale: string }) {
  const uid = useId().replace(/:/g, '');
  const id = `clip-${locale}-${uid}`;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="lsw-flag">
      <defs><clipPath id={id}><circle cx="12" cy="12" r="11.5" /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        {locale === 'ms' && (
          <>
            <rect width="24" height="24" fill="#fff" />
            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((y, i) => (
              <rect key={y} y={y - 4} width="24" height="2" fill={i % 2 === 0 ? '#CC0001' : '#FFFFFF'} />
            ))}
            <rect width="13" height="13" fill="#010066" />
            <circle cx="5.5" cy="6.5" r="3" fill="#FFCC00" />
            <circle cx="6.6" cy="6" r="2.6" fill="#010066" />
            <polygon points={starPoints(9.5, 6.5, 1.8)} fill="#FFCC00" />
          </>
        )}
        {locale === 'en' && (
          <>
            <rect width="24" height="24" fill="#012169" />
            <path d="M0,0 L24,24 M24,0 L0,24" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M0,0 L24,24" stroke="#C8102E" strokeWidth="2" />
            <path d="M24,0 L0,24" stroke="#C8102E" strokeWidth="2" />
            <path d="M12,0 V24 M0,12 H24" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M12,0 V24 M0,12 H24" stroke="#C8102E" strokeWidth="4" />
          </>
        )}
        {locale === 'zh' && (
          <>
            <rect width="24" height="24" fill="#EE1C25" />
            <polygon points={starPoints(7, 7, 3.2)} fill="#FFFF00" />
            {[{ x: 12, y: 3 }, { x: 14, y: 5.5 }, { x: 14, y: 9 }, { x: 12, y: 11 }].map((s, i) => {
              const angle = Math.atan2(7 - s.y, 7 - s.x);
              return <polygon key={i} points={starPoints(s.x, s.y, 1.2, angle)} fill="#FFFF00" />;
            })}
          </>
        )}
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(7,58,44,0.18)" strokeWidth="1" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname() || '/';
  const search = useSearchParams();
  const qs = search?.toString();
  const suffix = qs ? `?${qs}` : '';
  const rest = (() => {
    for (const l of routing.locales) {
      if (pathname === `/${l}`) return '';
      if (pathname.startsWith(`/${l}/`)) return pathname.slice(`/${l}`.length);
    }
    return pathname === '/' ? '' : pathname;
  })();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lsw" ref={rootRef}>
      <div className="lsw-toggle" role="group" aria-label="Change language">
        {routing.locales.map((l) => {
          const active = l === currentLocale;
          return (
            <Link
              key={l}
              href={`${localePath(l, rest)}${suffix}`}
              hrefLang={l}
              lang={l}
              className={`lsw-item ${active ? 'is-active' : ''}`}
              aria-current={active ? 'true' : undefined}
            >
              <CircleFlag locale={l} />
              <span className="lsw-label">{LABELS[l] ?? l.toUpperCase()}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="lsw-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
      >
        <CircleFlag locale={currentLocale} />
        <span className="lsw-trigger-label">{LABELS[currentLocale] ?? currentLocale.toUpperCase()}</span>
        <svg className="lsw-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="lsw-menu" role="menu">
          {routing.locales.map((l) => {
            const active = l === currentLocale;
            return (
              <Link
                key={l}
                href={`${localePath(l, rest)}${suffix}`}
                hrefLang={l}
                lang={l}
                role="menuitem"
                className={`lsw-menu-item ${active ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <CircleFlag locale={l} />
                <span>{LABELS[l] ?? l.toUpperCase()}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
