import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tablechair-rental-malaysia.vercel.app'),
  title: 'Kak Kenduri — Table & Chair Rental Malaysia',
  description: 'Same-day table and chair rental across Malaysia.',
  verification: {
    google: 'tm0matiWoFe5vrz_jjCFkYpuL_iokve1Je2zV1ObdXc',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script defer src="https://utopia-webcore.vercel.app/t.js" data-website="tablechair-rental-malaysia.vercel.app"></script>
      </head>
      <body className="bg-[#FFFEF8] text-[#111111] antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
