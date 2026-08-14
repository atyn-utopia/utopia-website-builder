import './globals.css';
import { siteConfig } from '@/config/site';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata = {
  // Derived from siteConfig, never hardcoded: this used to be the
  // *.vercel.app host, so every relative metadata URL — the og:image most
  // visibly — resolved against the preview domain instead of the paid one.
  // Shares showed the vercel.app URL and depended on that host staying alive.
  metadataBase: new URL(siteConfig.siteUrl),
};
