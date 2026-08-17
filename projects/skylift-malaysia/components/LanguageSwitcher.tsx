// projects/skylift-malaysia/components/LanguageSwitcher.tsx
'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ms', label: 'MS' },
  { code: 'zh', label: '中' },
];

const isLocale = (s: string): boolean =>
  (routing.locales as readonly string[]).includes(s);

/**
 * Build the equivalent URL for `target` from the current pathname.
 *
 * `localePrefix: 'as-needed'` means the default locale is served with NO prefix,
 * so the current path may or may not start with a locale segment. Strip it when
 * present, then re-prefix only for non-default locales. The previous version
 * assigned `segments[1] = newLocale`, which OVERWROTE the first real segment on
 * unprefixed (English) pages: `/skylift/kuala-lumpur` became `/ms/kuala-lumpur`
 * (404 live) and `/blog` became `/ms` (the homepage, not the blog).
 */
export function localeSwitchHref(pathname: string, target: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length && isLocale(segments[0])) segments.shift();
  const rest = segments.length ? `/${segments.join('/')}` : '';
  const prefix = target === routing.defaultLocale ? '' : `/${target}`;
  return `${prefix}${rest}` || '/';
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Classes are .lsw-* and styled in globals.css with !important so element
  // resets can't clobber them (wizard check: lsw-globals-css).
  return (
    <div className="lsw-switch" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l.code}
          href={localeSwitchHref(pathname, l.code)}
          hrefLang={l.code}
          className={l.code === locale ? 'lsw-option lsw-option--active' : 'lsw-option'}
          aria-current={l.code === locale ? 'true' : undefined}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
