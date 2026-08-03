import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { siteConfig } from '@/config/site';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
        <meta
          name="google-site-verification"
          content="ZSx5ytFyv-IzijpwtqdVD1r0-HCtRjR1qSTZcaVJal8"
        />
        {/* Google Tag Manager */}
        <script
          id="gtm-base"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5DGDX4J3');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script defer src="https://webcore.utopiaai.my/t.js" data-website={siteConfig.domain}></script>
      </head>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5DGDX4J3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
