// Shared page-level style block used by the homepage and every location page.
// Adds the design-system invariants the checklist enforces — specifically the
// `font-weight: inherit` normaliser so body copy nested inside h4/h5 doesn't
// inherit the browser default heading weight/size.
export default function PageStyles() {
  return (
    <style>{`
      .usp-cell h5,
      .step h5,
      .why-card h5,
      .product-desc,
      .review-body,
      .hero-support { font-weight: inherit; }
      .usp-cell h5:first-of-type,
      .step h5:first-of-type,
      .why-card h5:first-of-type { font-weight: 700; }

      /* Multi-line labeled prices (webcore prices array) — vertical list */
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
        color: #1c3a6a;
        padding: 11px 0;
        border-bottom: 1px solid #E2E8F0;
      }
      .price-line:last-child { border-bottom: none; }
      .price-line:first-child { color: #e63030; }
      .price-note {
        display: block;
        margin-top: 3px;
        font-weight: 400;
        font-size: 11px;
        text-transform: none;
        color: rgba(28,58,106,0.65);
      }
    `}</style>
  );
}
