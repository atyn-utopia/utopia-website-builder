import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { getPhoneNumber } from '@/lib/webcore'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { ProductSchema } from '@/components/schema/ProductSchema'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import HomePageClient from './HomePageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  const url = `${siteConfig.siteUrl}/${locale}`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.siteUrl}/en`,
        ms: `${siteConfig.siteUrl}/ms`,
        zh: `${siteConfig.siteUrl}/zh`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  const { phone } = await getPhoneNumber()

  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema
        name={t('title')}
        description={t('description')}
        locale={locale}
      />
      <HomePageClient phoneNumber={phone} />
    </>
  )
}
