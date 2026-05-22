'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = { ms: 'MS', en: 'EN', zh: '中文' };

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

  return (
    <div className="lang-switcher group" data-current={currentLocale}>
      <button
        type="button"
        className="lang-switcher-trigger"
        aria-haspopup="listbox"
        aria-label="Change language"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span>{LABELS[currentLocale] ?? currentLocale.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className="lang-switcher-menu" role="listbox">
        {routing.locales.map((l) => {
          const active = l === currentLocale;
          return (
            <li key={l} role="option" aria-selected={active}>
              <Link
                href={`/${l}${rest}${suffix}`}
                className={`lang-switcher-option ${active ? 'is-active' : ''}`}
                hrefLang={l}
                lang={l}
              >
                {LABELS[l] ?? l.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .lang-switcher { position: relative; display: inline-flex; }
        .lang-switcher-trigger {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 12px; border-radius: 999px;
          background: #FFFFFF; border: 1px solid #E5E7EB;
          color: #0F0F0F; font-weight: 600; font-size: 13px;
          letter-spacing: 0.02em; cursor: pointer;
          transition: border-color 120ms ease;
        }
        .lang-switcher-trigger:hover { border-color: #F26C1F; }
        .lang-switcher-menu {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 14px;
          list-style: none; padding: 6px; margin: 0; min-width: 130px;
          box-shadow: 0 12px 28px -10px rgba(15,15,15,0.18), 0 4px 10px -4px rgba(15,15,15,0.1);
          display: none; z-index: 50;
        }
        .lang-switcher:hover .lang-switcher-menu,
        .lang-switcher:focus-within .lang-switcher-menu { display: block; }
        .lang-switcher-option {
          display: block; padding: 8px 12px; border-radius: 10px;
          color: #0F0F0F; font-size: 13px; font-weight: 600;
        }
        .lang-switcher-option:hover { background: #FFF1E6; color: #D8550E; }
        .lang-switcher-option.is-active { background: #F26C1F; color: #FFFFFF; }
      `}</style>
    </div>
  );
}
