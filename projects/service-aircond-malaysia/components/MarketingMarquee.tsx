// Slim marquee strip that replaces decorative dividers between hero → USP
// and elsewhere. Items roll right-to-left in an infinite CSS animation.
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'

const FALLBACK_ITEMS = [
  '⚡ Same-Day Aircond Service',
  '★ 4.9 on Google',
  '✓ ST-Registered Technicians',
  '🛠 38 Cities Across Malaysia',
  '🧊 Chemical Wash + Repair',
]

export default async function MarketingMarquee({
  locale,
  variant = 'light',
}: {
  locale: Locale
  variant?: 'light' | 'dark'
}) {
  let items: string[] = FALLBACK_ITEMS
  try {
    const t = await getTranslations({ locale, namespace: 'marquee' })
    const fromI18n = t.raw('items') as string[] | undefined
    if (Array.isArray(fromI18n) && fromI18n.length > 0) items = fromI18n
  } catch {
    /* keep fallback */
  }
  const loop = [...items, ...items]

  return (
    <div className={`mkt-marquee ${variant === 'dark' ? 'mkt-marquee--dark' : ''}`} aria-hidden="true">
      <div className="mkt-marquee-track">
        {loop.map((text, i) => (
          <span key={i} className="mkt-marquee-item">
            <span>{text}</span>
            <span className="mkt-marquee-dot" aria-hidden="true">★</span>
          </span>
        ))}
      </div>

      <style>{`
        .mkt-marquee {
          background: #FACC15;
          color: #1B3A5C;
          overflow: hidden;
          padding: 8px 0;
          border-top: 1px solid rgba(27,58,92,0.12);
          border-bottom: 1px solid rgba(27,58,92,0.12);
        }
        .mkt-marquee--dark {
          background: #1B3A5C;
          color: #FACC15;
        }
        .mkt-marquee-track {
          display: inline-flex;
          align-items: center;
          gap: 0;
          white-space: nowrap;
          animation: mkt-marquee 45s linear infinite;
          will-change: transform;
        }
        .mkt-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 0 14px;
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
        }
        .mkt-marquee-dot { display: inline-block; font-size: 8px; opacity: 0.75; }
        @keyframes mkt-marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mkt-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
