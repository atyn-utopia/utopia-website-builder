'use client'

// Styled-jsx :global(.nav-cta) shim:
// the WhatsApp CTA in SiteHeader uses className="nav-cta". Because future
// variants (WhatsAppButton, header islands) may render that class from child
// components, plain scoped rules would silently miss them — `:global(.nav-cta)`
// inside <style jsx> keeps the selector live regardless of which component
// emits the class. (See checklist rule `nav-cta-global-scope`.)
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
