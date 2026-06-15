import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { getProperties } from '@/lib/getProperties';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import PropertiesCatalogClient from './PropertiesCatalogClient';

export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.properties' });
  const path = '/properties';
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${localeHref(l)}${path}`]),
  );
  languages['x-default'] = `${localeHref(routing.defaultLocale)}${path}`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `${localeHref(locale)}${path}`, languages },
    openGraph: { title: t('title'), description: t('description'), url: `${localeHref(locale)}${path}`, type: 'website' },
  };
}

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'properties' });

  const hotels = await getProperties();
  const states = Array.from(
    new Map(hotels.map((h) => [h.stateSlug, { slug: h.stateSlug, name: h.state }])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <FomoBanner />
      <SiteHeader />

      <BreadcrumbSchema
        items={[
          { name: t('breadcrumbHome'), url: `${localeHref(locale)}` },
          { name: t('breadcrumb'), url: `${localeHref(locale)}/properties` },
        ]}
      />

      {/* HEADER */}
      <section className="catalog-hero">
        <div className="container">
          <nav className="catalog-crumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
            {' › '}
            <span aria-current="page">{t('breadcrumb')}</span>
          </nav>
          <h1>{t('h1')}</h1>
          <h2>{t('h2')}</h2>
          <h5 className="catalog-hero-intro">{t('intro')}</h5>
        </div>
      </section>

      {/* CATALOGUE */}
      <section className="lp-section">
        <div className="container">
          <PropertiesCatalogClient hotels={hotels} states={states} />
        </div>
      </section>

      <SiteFooter locale={locale} />

      <PageStyles />
      <style>{`
        .catalog-hero {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.93)),
            url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=70');
          background-size: cover; background-position: center;
          border-bottom: 1px solid var(--line);
          padding: clamp(36px, 5vw, 56px) 0;
        }
        .catalog-hero .container { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; }
        @media (min-width: 880px) { .catalog-hero .container { align-items: flex-start; text-align: left; } }
        .catalog-crumb { font-size: 13px; color: var(--ink-muted); }
        .catalog-crumb a:hover { color: var(--brand-orange-deep); }
        .catalog-hero h1 { font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--brand-navy); margin: 0; }
        .catalog-hero h2 { font-size: clamp(1.1rem, 2vw, 1.5rem); font-weight: 700; color: var(--brand-orange); margin: 0; }
        .catalog-hero-intro { font-weight: 400; font-size: 15px; line-height: 1.6; color: var(--ink-muted); margin: 0; max-width: 62ch; }
        @media (max-width: 559px) {
          .catalog-hero h1 { font-size: 24px; }
          .catalog-hero h2 { font-size: 18px; }
          .catalog-hero-intro { font-size: 12px; }
          .catalog-crumb { font-size: 11px; }
        }
      `}</style>
    </>
  );
}
