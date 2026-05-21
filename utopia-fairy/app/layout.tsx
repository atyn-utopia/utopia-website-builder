import type { Metadata, Viewport } from 'next'
import { Fira_Sans, JetBrains_Mono } from 'next/font/google'
import ThemeToggle from '@/components/ThemeToggle'
import LogoutButton from '@/components/LogoutButton'
import RegisterSW from '@/components/RegisterSW'
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
        <ThemeToggle />
        <LogoutButton />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          padding: '48px 20px',
        }}>
          {children}
        </div>
        <RegisterSW />
      </body>
    </html>
  )
}
