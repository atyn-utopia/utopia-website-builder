'use client';

import { useTranslations } from 'next-intl';
import FomoBar from '@/components/FomoBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HomeSections from '@/components/HomeSections';
import HeroArc, { markPhrase } from '@/components/HeroArc';
import Eyebrow from '@/components/Eyebrow';
import { waRedirect } from '@/lib/waRedirect';
import type { ProductCardData } from '@/components/ProductCard';
import type { Location } from '@/config/locations';

interface Props {
  locale: string;
  products: ProductCardData[];
  location: Location;
  h1: string;
  h2: string;
  intro: string;
  uniqueFaqs: { q: string; a: string }[];
  nearby: Location[];
  chromeProvided?: boolean;
}

export default function LocationPageClient({
  locale,
  products,
  location,
  h1,
  h2,
  intro,
  uniqueFaqs,
  nearby,
  chromeProvided = false,
}: Props) {
  const locT = useTranslations('location');
  const waHref = waRedirect(locale, undefined, location.slug);

  return (
    <>
      {!chromeProvided && <FomoBar />}
      {!chromeProvided && <Navbar />}

      {/* SECTION 1 — Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="kh-crumbs">
        <div className="kh-crumbs-in">
          <a href={`/${locale}`}>{locT('breadcrumb.home')}</a>
          <span aria-hidden="true">›</span>
          <a href={`/${locale}#products`}>{locT('breadcrumb.product')}</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{location.name}</span>
        </div>
      </nav>

      {/* SECTION 3 — HERO */}
      <HeroArc
        title={<h1 className="kh-hero-title">{markPhrase(h1, locT('h1Highlight'))}</h1>}
        subtitle={<h2 className="kh-hero-sub">{h2}</h2>}
        badge={locT('badge', { city: location.name })}
        products={products}
        waHref={waHref}
        locationSlug={location.slug}
      />

      <HomeSections
        locale={locale}
        products={products}
        location={{
          city: location.name,
          slug: location.slug,
          intro,
          uniqueFaqs,
        }}
      />

      {/* SECTION 13 — Nearby Locations */}
      {nearby.length > 0 && (
        <section className="kh-section kh-section--white">
          <div className="kh-head kh-reveal">
            <Eyebrow>{locT('nearby.eyebrow')}</Eyebrow>
            <h3 className="kh-h3">{locT('nearby.h3')}</h3>
            <p className="kh-lead">{locT('nearby.intro')}</p>
          </div>
          <div className="kh-nearby-grid kh-reveal">
            {nearby.map((n) => (
              <a key={n.slug} href={`/${locale}/katil-hospital/${n.slug}`} className="kh-nearby-link">
                {locT('nearby.anchor', { city: n.name })}
              </a>
            ))}
          </div>
        </section>
      )}

      {!chromeProvided && <Footer />}

      <WhatsAppButton
        href={waHref}
        label="WhatsApp"
        variant="floating"
        locationSlug={location.slug}
        ariaLabel="WhatsApp"
      />
    </>
  );
}
