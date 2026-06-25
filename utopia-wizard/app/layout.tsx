import type { Metadata, Viewport } from 'next'
import { Fira_Sans, JetBrains_Mono } from 'next/font/google'
import RegisterSW from '@/components/RegisterSW'
import TopBar from '@/components/TopBar'
import './globals.css'

const fira = Fira_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Utopia Wizard',
  description: 'Website Builder & Monitor for every site under Utopia.',
  applicationName: 'Utopia Wizard',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Utopia Wizard',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/utopia-wizard-logo.png', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fira.variable} ${mono.variable}`}>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '100vh',
          // Top padding + iOS safe-area inset so the topbar sits below the
          // status bar / notch on installed PWAs.
          paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
          paddingRight: 'calc(20px + env(safe-area-inset-right, 0px))',
          paddingBottom: 'calc(48px + env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'calc(20px + env(safe-area-inset-left, 0px))',
        }}>
          <TopBar />
          {children}
        </div>
        <RegisterSW />
      </body>
    </html>
  )
}
