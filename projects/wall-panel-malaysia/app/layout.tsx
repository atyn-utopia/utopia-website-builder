import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wall-panel-malaysia.vercel.app'),
  title: 'Wall Panel Malaysia — Premium Wall Panel Installation',
  description:
    'Install wood, fluted, PVC, acoustic or marble wall panels in your home or office. From RM25/sqft with free installation across Malaysia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="wall-panel-malaysia.vercel.app"
        />
      </head>
      <body className="bg-white text-[#0E172E] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
