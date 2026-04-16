'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

const localeLabels: Record<string, string> = {
  ms: 'BM',
  en: 'EN',
  zh: 'ZH',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
        style={{
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)',
          background: 'transparent',
        }}
        aria-label="Switch language"
        aria-haspopup="true"
      >
        {localeLabels[locale] || locale.toUpperCase()}
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className="absolute right-0 top-full mt-1 py-1 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible"
        style={{
          background: 'var(--brand-gunmetal)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: '64px',
          transition: 'opacity 200ms ease, visibility 200ms ease',
          zIndex: 60,
        }}
        role="menu"
      >
        {Object.entries(localeLabels).map(([loc, label]) => (
          <a
            key={loc}
            href={switchLocale(loc)}
            className="block px-3 py-1.5 text-xs font-medium"
            style={{
              color: loc === locale ? 'var(--brand-yellow)' : 'rgba(255,255,255,0.7)',
            }}
            role="menuitem"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
