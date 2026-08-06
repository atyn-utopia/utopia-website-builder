import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Rubik } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { siteConfig } from '@/config/site';
import { ogImages } from '@/lib/ogImage';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { WebSiteSchema } from '@/components/schema/WebSiteSchema';

// Same pairing as the original static page: Rubik for display, Plus Jakarta
// Sans for body copy.
const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const heading = Rubik({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-rubik',
});

const GTM_ID = 'GTM-P323MPG9';

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
    routing.locales.map((l) => [l, localeHref(l)]),
  );
  languages['x-default'] = localeHref(routing.defaultLocale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: t('title'),
    description: t('description'),
    alternates: { canonical: localeHref(locale), languages },
    openGraph: {
      type: 'website',
      url: localeHref(locale),
      siteName: siteConfig.brandName,
      title: t('title'),
      description: t('description'),
      images: ogImages(locale),
      locale: OG_LOCALE[locale] || 'ms_MY',
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
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
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${body.variable} ${heading.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        {/* Search Console URL-prefix property verification (Gloo phase 4). */}
        <meta
          name="google-site-verification"
          content="ow94y87IUiNAn2e9qZm8_RxwRbONjCnjstlNWNEWhvY"
        />
        {/* Google Tag Manager */}
        <script
          id="gtm-base"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Utopia Webcore analytics. Bound to siteConfig.domain so a domain
            change can never leave events pointing at a dead bucket. */}
        <script defer src="https://webcore.utopiaai.my/t.js" data-website={siteConfig.domain} />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <OrganizationSchema />
          <WebSiteSchema locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
