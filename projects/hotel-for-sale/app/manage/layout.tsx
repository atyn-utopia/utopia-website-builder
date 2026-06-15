import type { Metadata } from 'next';
import '../globals.css';
import { Inter } from 'next/font/google';

const sans = Inter({ subsets: ['latin'], display: 'swap', weight: ['400', '500', '700', '800'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Manage Listings — HotelForSale',
  robots: { index: false, follow: false },
};

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body style={{ fontFamily: 'var(--font-sans), Inter, sans-serif', background: 'var(--section-alt)' }}>
        {children}
      </body>
    </html>
  );
}
