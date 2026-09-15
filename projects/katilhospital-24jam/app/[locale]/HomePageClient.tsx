'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HomeSections from '@/components/HomeSections';
import HeroArc from '@/components/HeroArc';
import { waRedirect } from '@/lib/waRedirect';
import type { ProductCardData } from '@/components/ProductCard';

interface Props {
  locale: string;
  products: ProductCardData[];
  /** When true, skip internal Navbar/Footer — the server page renders the
   *  canonical SiteHeader/SiteFooter/FomoBanner instead. The single FOMO banner
   *  is always the server-rendered <FomoBanner />; this client never renders one. */
  chromeProvided?: boolean;
}

export default function HomePageClient({ locale, products, chromeProvided = false }: Props) {
  const heroT = useTranslations('hero');
  const waHref = waRedirect(locale);

  return (
    <>
      {!chromeProvided && <Navbar />}

      {/* SECTION 3 — HERO */}
      <HeroArc
        title={<h1 className="kh-hero-title">{heroT('h1')}</h1>}
        subtitle={<h2 className="kh-hero-sub">{heroT('h2')}</h2>}
        badge={heroT('badge')}
        products={products}
        waHref={waHref}
      />

      <HomeSections locale={locale} products={products} />

      {!chromeProvided && <Footer />}

      {/* Floating WhatsApp FAB */}
      <WhatsAppButton href={waHref} label="WhatsApp" variant="floating" ariaLabel="WhatsApp" />
    </>
  );
}
