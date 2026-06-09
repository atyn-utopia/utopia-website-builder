'use client'

// Styled-jsx :global(.nav-cta) shim: the header WhatsApp CTA uses
// className="nav-cta". A scoped styled-jsx rule would miss the class once it's
// emitted by a child component, so :global() keeps the selector live. The
// mobile media query also hides the header CTA so it never overlaps the
// language dropdown. (Wizard checks: nav-cta-global-scope + header-mobile-wa-hidden.)
export default function NavCtaGlobalStyle() {
  return (
    <style jsx>{`
      :global(.nav-cta) {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
      }
      @media (max-width: 879px) {
        :global(.nav-cta) { display: none !important; }
      }
    `}</style>
  )
}
