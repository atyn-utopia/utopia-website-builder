// Shared page-level style block used by the homepage and every location page.
// Tailwind handles 99% of the layout; this block just adds the design-system
// invariants the checklist enforces — specifically the `font-weight: inherit`
// normaliser that keeps body copy from inheriting the browser default heading
// weight when the keyword-driven heading rule wraps it in <h4>/<h5>.
export default function PageStyles() {
  return (
    <style>{`
      /* Heading-tag normaliser: body copy nested inside semantic headings
         (per the keyword-driven heading rule) inherits weight from the
         parent so it does not blow up to the browser's default bold-size. */
      .usp-cell h5,
      .step h5,
      .why-card h5,
      .product-desc,
      .review-body,
      .hero-support { font-weight: inherit; }
      .usp-cell h5:first-of-type,
      .step h5:first-of-type,
      .why-card h5:first-of-type { font-weight: 700; }

      /* CSS-bg layer for the hero (sits behind .container — see role="img" usage in page.tsx) */
      .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    `}</style>
  )
}
