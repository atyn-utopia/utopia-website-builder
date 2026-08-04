import type { Metadata } from 'next';
import { Inter, Noto_Serif_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { localeAbs } from '@/lib/localeHref';
import { ogImage } from '@/lib/ogImage';
import { siteConfig } from '@/config/site';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { WebSiteSchema } from '@/components/schema/WebSiteSchema';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

const serif = Noto_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-serif-face',
});

const OG_LOCALE: Record<string, string> = {
  ms: 'ms_MY',
  en: 'en_MY',
  zh: 'zh_CN',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${localeAbs(l)}`]),
  );
  languages['x-default'] = `${localeAbs(routing.defaultLocale)}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${localeAbs(locale)}`,
      languages,
    },
    openGraph: {
      type: 'website',
      url: `${localeAbs(locale)}`,
      siteName: siteConfig.brandName,
      title: t('title'),
      description: t('description'),
      locale: OG_LOCALE[locale] || 'ms_MY',
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [ogImage(t('title'))],
    },
    // Inherited by every page; title/description fall through from each page's
    // own metadata, so only the card type + image need declaring here.
    twitter: { card: 'summary_large_image', images: [siteConfig.ogImage] },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${serif.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="majlisaqiqah.my"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <OrganizationSchema />
          <WebSiteSchema locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
