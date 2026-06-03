'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/routing';

const labels: Record<string, string> = { ms: 'MS', en: 'EN', zh: 'ZH' };

interface Props {
  variant?: 'on-light' | 'on-dark';
}

export function LanguageSwitcher({ variant = 'on-light' }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(target: string) {
    const rest = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${target}${rest || ''}`);
  }

  const onDark = variant === 'on-dark';

  return (
    <div
      role="tablist"
      aria-label="Language"
      style={{ display: 'inline-flex', gap: 4 }}
    >
      {locales.map((l) => {
        const active = locale === l;
        const inactiveBorder = onDark
          ? '1px solid rgba(255,255,255,0.25)'
          : '1px solid rgba(15,23,42,0.12)';
        const inactiveColor = onDark ? 'rgba(255,255,255,0.85)' : '#1c3a6a';
        const activeBg = onDark ? '#FFFFFF' : '#1c3a6a';
        const activeColor = onDark ? '#1c3a6a' : '#FFFFFF';
        const activeBorder = onDark
          ? '1px solid #FFFFFF'
          : '1px solid #1c3a6a';

        return (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => switchTo(l)}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: active ? activeBorder : inactiveBorder,
              background: active ? activeBg : 'transparent',
              color: active ? activeColor : inactiveColor,
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {labels[l]}
          </button>
        );
      })}
    </div>
  );
}
