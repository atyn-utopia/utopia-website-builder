'use client'

// Styled-jsx :global(.nav-cta) shim:
// the WhatsApp CTA in SiteHeader uses className="nav-cta". A scoped rule would
// miss the class once it's rendered by a child component, so wrapping it with
// :global() keeps the selector live regardless of which component emits the
// class. (See wizard checklist rule `nav-cta-global-scope`.)
export default function NavCtaGlobalStyle() {
  return (
    <style jsx>{`
      :global(.nav-cta) {
        height: 40px;
        padding: 0 14px;
        font-size: 13px;
        line-height: 1;
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
