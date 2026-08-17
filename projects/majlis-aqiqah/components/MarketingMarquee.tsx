import { getTranslations } from 'next-intl/server';

export default async function MarketingMarquee({
  locale,
  variant = 'light',
}: {
  locale: string;
  variant?: 'light' | 'dark';
}) {
  const t = await getTranslations({ locale, namespace: 'marquee' });
  const items = t.raw('items') as string[];
  // The loop animates translateX(-50%) → 0, so ONE half of the track has to be
  // at least as wide as the viewport or a blank gap scrolls through on wide
  // screens. Two copies made each half only one list wide; four copies make each
  // half two lists wide, which covers an ultrawide monitor at this font size.
  const loop = [...items, ...items, ...items, ...items];

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
          background: var(--brand-gold);
          color: #fff;
          overflow: hidden;
          padding: 8px 0;
          border-top: 1px solid var(--brand-gold-deep);
          border-bottom: 1px solid var(--brand-gold-deep);
        }
        .mkt-marquee--dark {
          background: var(--brand-emerald-2);
          color: var(--brand-gold-bright);
          border-top: 1px solid var(--line-on-dark);
          border-bottom: 1px solid var(--line-on-dark);
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
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
        }
        .mkt-marquee-dot {
          display: inline-block;
          font-size: 8px;
          opacity: 0.75;
        }
        @keyframes mkt-marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mkt-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
