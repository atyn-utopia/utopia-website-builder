import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hollywood Night — Admin",
  description: "Hollywood Night admin console",
  manifest: "/manifest.json",
  applicationName: "HN Admin",
  appleWebApp: {
    capable: true,
    title: "HN Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
