// Shared style block so the homepage and every location page stay in visual
// sync. Rendered once near the top of each page. Server component (no hooks).
export default function PageStyles() {
  return (
    <style>{`
      /* Body text wrapped in h5/h6 (house rule: no bare <p>) must NOT inherit
         the huge/bold default heading sizing — normalise it back to body copy. */
      .body-text, h5.body-text, h6.body-text, .usp-cell h5, .usp-cell h6 {
        font-weight: inherit;
        font-size: inherit;
        line-height: 1.55;
        margin: 0;
        color: inherit;
      }

      /* Multi-line labeled prices (webcore prices array) — vertical list.
         Rendered on the dark frost gradient card, so colours are tuned for
         white-on-dark: light divider, amber accent line, muted white note. */
      .product-prices.price-list {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 4px 16px;
        text-align: left;
      }
      .price-line {
        font-weight: 700;
        font-size: 15px;
        padding: 11px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      }
      .price-line:last-child { border-bottom: none; }
      .price-line:first-child { color: var(--cold-amber-glow); }
      .price-note {
        display: block;
        margin-top: 3px;
        font-weight: 400;
        font-size: 11px;
        text-transform: none;
        color: rgba(255, 255, 255, 0.72);
      }

      .nav-links-desktop { display: flex; }
      .lang-desktop { display: block; }
      .mobile-menu-btn { display: none; }

      @media (max-width: 900px) {
        /* sewa-excavator mobile header order: burger (left) · logo (centre) · language (right) */
        .nav-links-desktop { display: none !important; }
        .mobile-menu-btn { display: inline-flex !important; order: -1; }
        .nav-logo { flex: 1 1 auto !important; justify-content: center !important; }
        .hero-photo { display: none !important; }
        .hero-cta-row { justify-content: center; }
        /* Centre the hero chip row + micro-stats on mobile so they match the
           centred hero copy (sewa-excavator centres all hero elements). */
        .hero-chips { justify-content: center !important; }
        .hero-microstats { justify-content: center !important; }
        .hero-rule { margin-left: auto !important; margin-right: auto !important; }
        .nav-cta { display: none !important; }
      }
      @media (max-width: 768px) {
        [class*="section-container"] h1, [class*="section-container"] h2, [class*="section-container"] h3 { text-align: center; }
        .hero-copy { text-align: center; }
        .hero-copy .eyebrow { display: inline-block; }
        .usp-panel { grid-template-columns: 1fr !important; }
        /* Centre each USP item (icon + text) on mobile instead of left-aligning,
           and drop the desktop column-separator border/padding that would shift
           the 2nd/3rd cells out of alignment when stacked. */
        .usp-cell { justify-content: center !important; }
        .usp-panel .usp-cell + .usp-cell { border-left: 0 !important; padding-left: 0 !important; }
        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 28px !important; }
        .stats-strip { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        .stats-strip > :first-child { grid-column: 1 / -1; border-right: 0 !important; padding-right: 0 !important; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.18); text-align: center; }
        .risk-bullets { grid-template-columns: 1fr !important; }
        .risk-cta { grid-template-columns: 1fr 1fr !important; }
        .risk-cta > :nth-child(3) { grid-column: 1 / -1; border-top: 1px solid rgba(255,255,255,0.10); }
        .risk-cta > :nth-child(2) { border-right: 0 !important; }
        .steps-grid { grid-template-columns: 1fr !important; }
        .reviews-scroll { grid-template-columns: 1fr !important; }
        .bento-grid { grid-template-columns: 1fr 1fr !important; grid-auto-rows: auto !important; }
        .bento-grid > div:first-child { grid-column: span 2 !important; grid-row: span 1 !important; }
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
        .states-grid { grid-template-columns: 1fr !important; }
        /* Product card: stack the price/visual side above the temp-options side
           so the 2-col split doesn't overflow the viewport on phones. */
        .service-split-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 640px) {
        .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `}</style>
  );
}
