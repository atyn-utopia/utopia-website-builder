// Server component (no 'use client') — composes all homepage sections in order.
// Marked as a "Client" file name only to mirror the project convention; it is
// actually rendered server-side and emits sections that may individually be
// client components (FomoBanner, SpecialGuestCalc, Faq).

import { getTranslations } from 'next-intl/server'
import type { Product } from '@/lib/webcore'
import type { Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'

import FomoBanner from '@/components/sections/FomoBanner'
import SiteNav from '@/components/sections/SiteNav'
import Hero from '@/components/sections/Hero'
import BrandStrip from '@/components/sections/BrandStrip'
import FoodTrayStrip from '@/components/sections/FoodTrayStrip'
import PakejGrid from '@/components/sections/PakejGrid'
import SpecialGuestCalc from '@/components/sections/SpecialGuestCalc'
import ProcessSteps from '@/components/sections/ProcessSteps'
import ReviewsGrid from '@/components/sections/ReviewsGrid'
import CustomerGallery from '@/components/sections/CustomerGallery'
import Faq from '@/components/sections/Faq'
import LocationsByState from '@/components/sections/LocationsByState'
import FinalCta from '@/components/sections/FinalCta'
import SiteFooter from '@/components/sections/SiteFooter'

interface Props {
  locale: Locale
  coreProducts: Product[]
  additionalProducts: Product[]
  defaultWaHref: string
  phone: string
}

export default async function HomePageClient({
  locale,
  coreProducts,
  additionalProducts,
  defaultWaHref,
  phone,
}: Props) {
  const t = await getTranslations({ locale })

  const fomoLabels = {
    eyebrow: t('fomo.eyebrow'),
    line: t('fomo.line'),
    countdownLabel: t('fomo.countdownLabel'),
    ctaMini: t('fomo.ctaMini'),
  }

  const navLabels = {
    logoAria: t('nav.logoAria'),
    pakej: t('nav.pakej'),
    locations: t('nav.locations'),
    blog: t('nav.blog'),
    contact: t('nav.contact'),
    whatsapp: t('nav.whatsapp'),
  }

  const brandLabels = [
    t('brandStrip.logo1'),
    t('brandStrip.logo2'),
    t('brandStrip.logo3'),
    t('brandStrip.logo4'),
    t('brandStrip.logo5'),
    t('brandStrip.logo6'),
  ]

  const processSteps = [
    { title: t('process.step1Title'), body: t('process.step1Body') },
    { title: t('process.step2Title'), body: t('process.step2Body') },
    { title: t('process.step3Title'), body: t('process.step3Body') },
    { title: t('process.step4Title'), body: t('process.step4Body') },
  ]

  const reviews = [1, 2, 3, 4, 5, 6].map((n) => ({
    name: t(`reviews.r${n}Name` as 'reviews.r1Name'),
    city: t(`reviews.r${n}City` as 'reviews.r1City'),
    body: t(`reviews.r${n}Body` as 'reviews.r1Body'),
  }))

  const galleryAlts = Array.from({ length: 12 }).map((_, i) =>
    t(`gallery.alt${i + 1}` as 'gallery.alt1'),
  )

  const faqItems = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    q: t(`faq.q${n}` as 'faq.q1'),
    a: t(`faq.a${n}` as 'faq.a1'),
  }))

  const stateIntro: Record<string, string> = {
    'Kuala Lumpur': t('locations.stateIntro.Kuala Lumpur'),
    Selangor: t('locations.stateIntro.Selangor'),
    Johor: t('locations.stateIntro.Johor'),
    Penang: t('locations.stateIntro.Penang'),
    Perak: t('locations.stateIntro.Perak'),
    Kedah: t('locations.stateIntro.Kedah'),
    'Negeri Sembilan': t('locations.stateIntro.Negeri Sembilan'),
    Melaka: t('locations.stateIntro.Melaka'),
    Pahang: t('locations.stateIntro.Pahang'),
    Terengganu: t('locations.stateIntro.Terengganu'),
    Kelantan: t('locations.stateIntro.Kelantan'),
    Perlis: t('locations.stateIntro.Perlis'),
    Sabah: t('locations.stateIntro.Sabah'),
    Sarawak: t('locations.stateIntro.Sarawak'),
    Putrajaya: t('locations.stateIntro.Putrajaya'),
    Labuan: t('locations.stateIntro.Labuan'),
  }

  const footerLabels = {
    tagline: t('footer.tagline'),
    legal: t('footer.legal'),
    col1Eyebrow: t('footer.col1Eyebrow'),
    col1Heading: t('footer.col1Heading'),
    col1Link1: t('footer.col1Link1'),
    col1Link2: t('footer.col1Link2'),
    col1Link3: t('footer.col1Link3'),
    col1Link4: t('footer.col1Link4'),
    col2Eyebrow: t('footer.col2Eyebrow'),
    col2Heading: t('footer.col2Heading'),
    col3Eyebrow: t('footer.col3Eyebrow'),
    col3Heading: t('footer.col3Heading'),
    col3Link: t('footer.col3Link'),
    col4Eyebrow: t('footer.col4Eyebrow'),
    col4Heading: t('footer.col4Heading'),
    col4Cta: t('footer.col4Cta'),
  }

  // Tier prices match the product table: Jimat RM15, Standard RM21, Premium RM25,
  // Premium + Air Balang ≈ RM25/pax + barrel surcharge folded into a flat RM28 estimate.
  const tierPricesPerPax = [15, 21, 25, 28]
  // Lower bound of each tier's guest count
  const tierGuestEstimates = [50, 100, 200, 350]
  const tiers = [1, 2, 3, 4].map((n) => ({
    label: t(`special.tier${n}Label` as 'special.tier1Label'),
    title: t(`special.tier${n}Title` as 'special.tier1Title'),
    pakej: t(`special.tier${n}Pakej` as 'special.tier1Pakej'),
    rationale: t(`special.tier${n}Rationale` as 'special.tier1Rationale'),
    cta: t(`special.tier${n}Cta` as 'special.tier1Cta'),
  }))

  return (
    <>
      <FomoBanner
        eyebrow={fomoLabels.eyebrow}
        line={fomoLabels.line}
        countdownLabel={fomoLabels.countdownLabel}
        ctaLabel={fomoLabels.ctaMini}
        waHref={defaultWaHref}
        phone={phone}
      />
      <SiteNav locale={locale} labels={navLabels} waHref={defaultWaHref} phone={phone} />
      <Hero
        eyebrow={t('hero.eyebrow')}
        h1={t('hero.h1')}
        h2={t('hero.h2')}
        lede={t('hero.lede')}
        primaryCta={t('hero.primaryCta')}
        secondaryCta={t('hero.secondaryCta')}
        waHref={defaultWaHref}
        phone={phone}
      />
      <BrandStrip eyebrow={t('brandStrip.eyebrow')} labels={brandLabels} />
      <PakejGrid
        labels={{
          eyebrow: t('pakej.eyebrow'),
          heading: t('pakej.heading'),
          intro: t('pakej.intro'),
          cardCta: t('pakej.cardCta'),
          bestSellerBadge: t('pakej.bestSellerBadge'),
          addonEyebrow: t('pakej.addonEyebrow'),
          addonHeading: t('pakej.addonHeading'),
          fallbackJimat: t('pakej.fallbackJimat'),
          fallbackStandard: t('pakej.fallbackStandard'),
          fallbackPremium: t('pakej.fallbackPremium'),
          fallbackAirBalang: t('pakej.fallbackAirBalang'),
          priceSuffix: t('pakej.priceSuffix'),
        }}
        core={coreProducts}
        additional={additionalProducts}
        locale={locale}
        phone={phone}
      />
      <LocationsByState
        locale={locale}
        eyebrow={t('locations.eyebrow')}
        heading={t('locations.heading')}
        intro={t('locations.intro')}
        stateIntro={stateIntro}
        viewAllLabel={t('locations.viewAll')}
      />
      <FoodTrayStrip />
      <ProcessSteps
        eyebrow={t('process.eyebrow')}
        heading={t('process.heading')}
        steps={processSteps}
      />
      <ReviewsGrid
        eyebrow={t('reviews.eyebrow')}
        heading={t('reviews.heading')}
        aggregateBadge={t('reviews.aggregateBadge')}
        aggregateSub={t('reviews.aggregateSub')}
        postedOnGoogleLabel={t('reviews.postedOnGoogle')}
        reviews={reviews}
      />
      <SpecialGuestCalc
        eyebrow={t('special.eyebrow')}
        heading={t('special.heading')}
        intro={t('special.intro')}
        estimateLabel={t('special.estimateLabel')}
        tiers={tiers}
        tierPricesPerPax={tierPricesPerPax}
        tierGuestEstimates={tierGuestEstimates}
        locale={locale}
        phone={phone}
      />
      <CustomerGallery
        eyebrow={t('gallery.eyebrow')}
        heading={t('gallery.heading')}
        alts={galleryAlts}
      />
      <Faq eyebrow={t('faq.eyebrow')} heading={t('faq.heading')} items={faqItems} />
      <FinalCta
        eyebrow={t('finalCta.eyebrow')}
        heading={t('finalCta.heading')}
        body={t('finalCta.body')}
        buttonLabel={t('finalCta.button')}
        waHref={defaultWaHref}
        phone={phone}
      />
      <SiteFooter locale={locale} labels={footerLabels} waHref={defaultWaHref} phone={phone} />
    </>
  )
}
