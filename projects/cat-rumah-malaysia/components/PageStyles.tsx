// Shared page-level style block used by the homepage and every location page.
// Adds the design-system invariants the checklist enforces — specifically the
// `font-weight: inherit` normaliser so body copy nested inside h4/h5 doesn't
// inherit the browser default heading weight/size, plus the absolute-bg
// helper used by the hero role=img layer.
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

      .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    `}</style>
  )
}
