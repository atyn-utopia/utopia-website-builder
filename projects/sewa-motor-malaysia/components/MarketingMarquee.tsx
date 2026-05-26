/**
 * Scrolling marquee strip between major sections — replaces the old
 * decorative dashed dividers. Renders the same brand phrases in a CSS-only
 * loop (no JS animation framework dependency).
 */
const PHRASES = [
  'Same-Day Delivery',
  'From RM30/day',
  'Honda · Yamaha · Modenas',
  '128 Cities Nationwide',
  'Safety-Checked Fleet',
  '7-Day WhatsApp Support',
];

export default function MarketingMarquee({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  // Duplicate the phrase list so the keyframe can translate -50% for a seamless loop.
  const loop = [...PHRASES, ...PHRASES];
  return (
    <div className={`marquee marquee--${variant}`} aria-hidden="true">
      <div className="marquee-track">
        {loop.map((phrase, i) => (
          <span className="marquee-item" key={i}>
            <span>{phrase}</span>
            <span className="marquee-dot">●</span>
          </span>
        ))}
      </div>
      <style>{`
        .marquee {
          overflow: hidden;
          padding: 14px 0;
          border-block: 1px solid rgba(0, 0, 0, 0.06);
        }
        .marquee--light { background: #FFF4EE; color: #16213E; }
        .marquee--dark { background: #16213E; color: #fff; border-color: rgba(255,255,255,0.08); }
        .marquee-track {
          display: inline-flex;
          gap: 36px;
          padding-left: 36px;
          animation: marquee-scroll 32s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        .marquee-item { display: inline-flex; align-items: center; gap: 36px; font-weight: 700; font-size: 14px; letter-spacing: 0.04em; text-transform: uppercase; }
        .marquee-dot { opacity: 0.5; }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
