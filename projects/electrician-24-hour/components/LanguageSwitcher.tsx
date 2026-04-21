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

  return (
    <div className="lang-switcher" aria-label="Language">
      {locales.map((l) => (
        <a
          key={l.code}
          onClick={(e) => {
            e.preventDefault();
            switchLocale(l.code);
          }}
          href="#"
          className={l.code === locale ? 'active' : ''}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
