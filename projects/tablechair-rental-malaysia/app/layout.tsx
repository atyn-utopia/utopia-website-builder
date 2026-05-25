import './globals.css'

// The actual <html>/<body>/<head> structure lives in app/[locale]/layout.tsx
// so the monitor checklist can verify the tracking script + font + data-website
// attributes per-locale. This root layout is a pass-through.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
