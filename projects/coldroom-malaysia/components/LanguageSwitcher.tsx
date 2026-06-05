'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const localeLabels: Record<string, string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  zh: '中文',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="group" style={{ position: 'relative' }}>
      <button
        aria-label="Switch language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(27, 45, 91, 0.15)',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--navy)',
          transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Globe icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {locale.toUpperCase()}
      </button>

      {/* Dropdown */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: '160px',
          zIndex: 100,
          overflow: 'hidden',
          opacity: 0,
          transform: 'translateY(-4px)',
          pointerEvents: 'none',
          transition: 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="lang-dropdown"
      >
        {Object.entries(localeLabels).map(([code, label]) => (
          <button
            key={code}
            onClick={() => switchLocale(code)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 16px',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: code === locale ? 600 : 400,
              color: code === locale ? 'var(--white)' : 'var(--text)',
              background: code === locale ? 'var(--orange)' : 'transparent',
              transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              if (code !== locale) {
                (e.target as HTMLElement).style.background = 'var(--surface)';
              }
            }}
            onMouseLeave={(e) => {
              if (code !== locale) {
                (e.target as HTMLElement).style.background = 'transparent';
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <style>{`
        .group:hover .lang-dropdown,
        .group:focus-within .lang-dropdown {
          opacity: 1 !important;
          transform: translateY(0) !important;
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
}
