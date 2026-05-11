// projects/skylift-malaysia/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = siteConfig.siteUrl;

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(baseUrl),
    icons: { icon: '/icon.svg' },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ms: `${baseUrl}/ms`,
        zh: `${baseUrl}/zh`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale:
        locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_MY' : 'en_MY',
      alternateLocale: ['en_MY', 'ms_MY', 'zh_MY'].filter(
        (l) =>
          l !==
          (locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_MY' : 'en_MY')
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
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

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="skylift-malaysia.utopiaai.my"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
