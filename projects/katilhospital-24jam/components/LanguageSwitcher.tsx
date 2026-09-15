'use client';

import { useId } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/routing';

const labels: Record<string, string> = { ms: 'MS', en: 'EN', zh: 'ZH' };

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

// Round flag — copied from templates/site-chrome/LanguageSwitcher.tsx. useId()
// keeps each clipPath id unique: the switcher renders twice (header + mobile
// drawer), and a shared id would clip one copy with the other's path.
function CircleFlag({ locale }: { locale: string }) {
  const uid = useId().replace(/:/g, '');
  const id = `clip-${locale}-${uid}`;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="lsw-flag">
      <defs>
        <clipPath id={id}>
          <circle cx="12" cy="12" r="11.5" />
        </clipPath>
      </defs>
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
            {[
              { x: 12, y: 3 },
              { x: 14, y: 5.5 },
              { x: 14, y: 9 },
              { x: 12, y: 11 },
            ].map((s, i) => {
              const angle = Math.atan2(7 - s.y, 7 - s.x);
              return <polygon key={i} points={starPoints(s.x, s.y, 1.2, angle)} fill="#FFFF00" />;
            })}
          </>
        )}
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(15,15,15,0.18)" strokeWidth="1" />
    </svg>
  );
}

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
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px 5px 5px',
              borderRadius: 999,
              border: active ? activeBorder : inactiveBorder,
              background: active ? activeBg : 'transparent',
              color: active ? activeColor : inactiveColor,
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            <CircleFlag locale={l} />
            {labels[l]}
          </button>
        );
      })}
    </div>
  );
}
