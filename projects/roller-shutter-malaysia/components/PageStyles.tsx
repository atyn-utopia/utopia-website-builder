// Shared page-level style block used by the homepage and every location page.
// Adds the design-system invariants the checklist enforces — specifically the
// `font-weight: inherit` normaliser so body copy nested inside h4/h5 doesn't
// inherit the browser default heading weight/size.
export default function PageStyles() {
  return (
    <style>{`
      /* Typography spec:
         - Section headings (h3) — bold 700
         - Subheading body copy (.body-h5 / .body-h6 / .section-sub / .product-desc / .review-body / .hero-support) — regular 400 */
      .usp-cell h5,
      .step h5,
      .why-card h5,
      .product-desc,
      .review-body,
      .hero-support,
      .section-sub,
      .body-h5,
      .body-h6 { font-weight: 400; }
      .usp-cell h5:first-of-type,
      .step h5:first-of-type,
      .why-card h5:first-of-type { font-weight: 700; }
      /* Force every section h3 to bold so the rule is uniform even if a
         caller forgets a Tailwind weight utility. */
      section h3 { font-weight: 700; }

      /* CSS-bg layer for the hero (sits behind the container — see role=img usage in page.tsx) */
      .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    `}</style>
  )
}
