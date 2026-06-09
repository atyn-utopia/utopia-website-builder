// projects/skylift-malaysia/components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ms', label: 'MS' },
  { code: 'zh', label: '中' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  // Classes are .lsw-* and styled in globals.css with !important so element
  // resets can't clobber them (wizard check: lsw-globals-css).
  return (
    <div className="lsw-switch" aria-label="Language">
      {locales.map((l) => (
        <a
          key={l.code}
          onClick={(e) => {
            e.preventDefault();
            switchLocale(l.code);
          }}
          href="#"
          className={l.code === locale ? 'lsw-option lsw-option--active' : 'lsw-option'}
          aria-current={l.code === locale ? 'true' : undefined}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
