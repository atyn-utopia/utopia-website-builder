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

  return (
    <div
      className="lang-switcher inline-flex items-center gap-1 rounded-full border border-[#1C1F2A]/15 bg-white/90 px-1 py-1 text-xs font-semibold tracking-wide shadow-sm"
      aria-label="Language"
    >
      {locales.map((l) => (
        <a
          key={l.code}
          onClick={(e) => {
            e.preventDefault();
            switchLocale(l.code);
          }}
          href="#"
          className={
            l.code === locale
              ? 'rounded-full bg-[#F5B400] px-3 py-1 text-[#1C1F2A]'
              : 'rounded-full px-3 py-1 text-[#1C1F2A]/70 hover:text-[#1C1F2A]'
          }
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
