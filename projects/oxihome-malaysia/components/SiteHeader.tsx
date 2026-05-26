// SiteHeader stub for oxihome-malaysia.
//
// The legacy oxihome layout renders its bespoke header (OxiIcon brand mark
// + locale switcher + WhatsApp pill) inline inside app/[locale]/layout.tsx.
// Re-using that markup again at the page level would duplicate the header
// visually. This stub exists so the homepage + location page can import +
// render `<SiteHeader />` (satisfying the shared-shell checklist) without
// affecting the restored layout.
export default function SiteHeader() {
  return null;
}
