import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
  const t = await getTranslations({ locale, namespace: "home.meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.brandName}`,
    },
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.baseUrl}/${locale}`,
      languages: {
        en: `${siteConfig.baseUrl}/en`,
        zh: `${siteConfig.baseUrl}/zh`,
        "x-default": `${siteConfig.baseUrl}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale: locale === "zh" ? "zh_CN" : "en_MY",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <script defer src="https://utopia-webcore.vercel.app/t.js" data-website="sewa-motor-malaysia.vercel.app"></script>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
