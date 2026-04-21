import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata = {
  metadataBase: new URL('https://electrician-24-hour.vercel.app'),
};
