import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sewa-excavator.utopiaai.my'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}
