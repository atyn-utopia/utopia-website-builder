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
        .nav-cta { display: none !important; }
      }
      @media (max-width: 768px) {
        [class*="section-container"] h1, [class*="section-container"] h2, [class*="section-container"] h3 { text-align: center; }
        .hero-copy { text-align: center; }
        .hero-copy .eyebrow { display: inline-block; }
        .usp-panel { grid-template-columns: 1fr !important; }
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
