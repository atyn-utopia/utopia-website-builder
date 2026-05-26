import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

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
        ms: `${siteConfig.baseUrl}/ms`,
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

  if (!routing.locales.includes(locale as "en" | "ms" | "zh")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="sewa-motor-malaysia.utopiaai.my"
        />
      </head>
      <body style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
