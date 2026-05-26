// Shared page-level style block for the homepage and every location page.
// Keeps the hero highlight, hero subheading, and per-page layout overrides
// in one place so both pages render identically.
export default function PageStyles() {
  return (
    <style>{`
      /* Heading-tag normaliser — body text wrapped in headings (per the keyword-driven
         heading rule) inherits weight from its parent, so h5/h6 used for non-heading
         copy don't pick up the browser's huge default size/weight. */
      .usp-cell h5,
      .step h5,
      .why-card h5,
      .faq-item h4,
      .product-desc,
      .review-body,
      .hero-support { font-weight: inherit; }
      .usp-cell h5:first-of-type,
      .step h5:first-of-type,
      .why-card h5:first-of-type { font-weight: 700; }

      /* CSS-bg layer for the hero (sits behind .container) */
      .hero { position: relative; overflow: hidden; isolation: isolate; }
      .hero > .container { position: relative; z-index: 2; }
      .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

      /* Hero accent + subheading */
      .hero .hl { color: var(--gold); }
      .hero h1 { color: var(--white); }
      .hero-sub {
        font-size: clamp(1rem, 1.8vw, 1.25rem);
        font-weight: 500;
        line-height: 1.55;
        color: rgba(255,255,255,0.85);
        margin: 14px 0 22px;
        max-width: 60ch;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(249, 180, 25, 0.15);
        color: var(--gold);
        border: 1px solid rgba(249, 180, 25, 0.35);
        border-radius: 999px;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      /* Section heading rhythm shared between home + location pages */
      .section-head { text-align: center; max-width: 780px; margin: 0 auto 40px; }
      .section-head .eyebrow {
        display: inline-block;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--blue);
        margin-bottom: 12px;
      }
      .section-head h3 {
        font-size: clamp(26px, 3.2vw, 38px);
        margin-bottom: 10px;
      }
      .section-head p {
        color: var(--ink-muted);
        font-size: 16px;
        line-height: 1.65;
      }

      /* Final CTA + dark band shared */
      .cta-band {
        background: var(--grad-blue-dark);
        color: var(--white);
        padding: 80px 0;
        text-align: center;
      }
      .cta-band h3 { color: var(--white); font-size: clamp(26px, 3.2vw, 38px); margin-bottom: 12px; }
      .cta-band p { color: rgba(255,255,255,0.8); max-width: 640px; margin: 0 auto 24px; }
    `}</style>
  );
}
