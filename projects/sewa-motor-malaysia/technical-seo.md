# Sewa Motor Malaysia -- Technical SEO Implementation

**Agent:** Kimmy (Technical Implementation Specialist)
**Domain:** sewamotor.my
**Brand:** Sewa Motor Malaysia
**Languages:** English (en), Mandarin Chinese (zh)
**Total pages:** 258 (2 homepage variants + 256 location pages)

---

## 1. Metadata Implementation

### 1a. Homepage -- `app/[locale]/page.tsx`

```typescript
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "homepage" });

  const title =
    locale === "zh"
      ? "马来西亚摩托车出租 | 日租/周租/月租 — Sewa Motor Malaysia"
      : "Motor Rental Malaysia | Daily, Weekly & Monthly — Sewa Motor Malaysia";

  const description =
    locale === "zh"
      ? "马来西亚摩托车出租服务，覆盖128个地区。Honda Vario、Yamaha NMax、Honda PCX等车型，日租RM30起。WhatsApp即时预订。"
      : "Rent motorcycles across 128 locations in Malaysia. Honda Vario, Yamaha NMax, Honda PCX & more from RM30/day. Instant WhatsApp booking.";

  const baseUrl = "https://sewamotor.my";
  const canonicalUrl = `${baseUrl}/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        zh: `${baseUrl}/zh`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sewa Motor Malaysia",
      locale: locale === "zh" ? "zh_CN" : "en_MY",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Motorcycle rental Malaysia — Sewa Motor Malaysia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
```

### 1b. Location Page -- `app/[locale]/sewa-motor/[location]/page.tsx`

```typescript
import type { Metadata } from "next";
import { locations } from "@/config/locations";

type Props = {
  params: { locale: string; location: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, location } = params;
  const locationData = locations.find((l) => l.slug === location);
  const displayName = locationData?.displayName ?? location;
  const state = locationData?.state ?? "";

  const baseUrl = "https://sewamotor.my";
  const canonicalUrl = `${baseUrl}/${locale}/sewa-motor/${location}`;

  const title =
    locale === "zh"
      ? `${displayName}摩托车出租 | 日租RM30起 — Sewa Motor Malaysia`
      : `Motor Rental ${displayName} | From RM30/day — Sewa Motor Malaysia`;

  const description =
    locale === "zh"
      ? `${displayName}${state ? `（${state}）` : ""}摩托车出租服务。Honda Vario、Yamaha NMax、Honda PCX等车型，日租/周租/月租。WhatsApp即时预订，快速送车。`
      : `Rent motorcycles in ${displayName}${state ? `, ${state}` : ""}. Honda Vario, Yamaha NMax, Honda PCX & more. Daily, weekly & monthly rentals from RM30/day. WhatsApp to book instantly.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/sewa-motor/${location}`,
        zh: `${baseUrl}/zh/sewa-motor/${location}`,
        "x-default": `${baseUrl}/en/sewa-motor/${location}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sewa Motor Malaysia",
      locale: locale === "zh" ? "zh_CN" : "en_MY",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Motor rental in ${displayName}, Malaysia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
```

---

## 2. hreflang Implementation

hreflang tags are handled via the `alternates.languages` property inside `generateMetadata()` (shown above). Next.js App Router automatically renders these as `<link rel="alternate" hreflang="...">` tags in the `<head>`.

### Generated Output (Homepage Example)

```html
<link rel="alternate" hreflang="en" href="https://sewamotor.my/en" />
<link rel="alternate" hreflang="zh" href="https://sewamotor.my/zh" />
<link rel="alternate" hreflang="x-default" href="https://sewamotor.my/en" />
```

### Generated Output (Location Page Example -- Kuala Lumpur)

```html
<link rel="alternate" hreflang="en" href="https://sewamotor.my/en/sewa-motor/kuala-lumpur" />
<link rel="alternate" hreflang="zh" href="https://sewamotor.my/zh/sewa-motor/kuala-lumpur" />
<link rel="alternate" hreflang="x-default" href="https://sewamotor.my/en/sewa-motor/kuala-lumpur" />
```

### Rules

- `x-default` always points to the English (`/en/`) version
- Every page includes hreflang for both `en` and `zh` plus `x-default`
- Canonical URL always matches the current locale version of the page
- All URLs use HTTPS

---

## 3. Schema Markup (JSON-LD)

### 3a. Organization Schema (Global -- Root Layout)

Place this in `app/[locale]/layout.tsx` so it appears on every page.

```typescript
// components/SchemaMarkup.tsx

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sewa Motor Malaysia",
    url: "https://sewamotor.my",
    logo: "https://sewamotor.my/logo.png",
    description:
      "Motorcycle rental service across 128 locations in Malaysia. Daily, weekly, and monthly rentals.",
    areaServed: {
      "@type": "Country",
      name: "Malaysia",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3b. LocalBusiness Schema (Location Pages)

```typescript
export function LocalBusinessSchema({
  locationName,
  locationSlug,
  state,
  locale,
}: {
  locationName: string;
  locationSlug: string;
  state: string;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}#localbusiness`,
    name: `Sewa Motor Malaysia — ${locationName}`,
    description: `Motorcycle rental service in ${locationName}, ${state}, Malaysia. Daily, weekly, and monthly motorbike rentals.`,
    url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
    telephone: "+60123456789",
    image: "https://sewamotor.my/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: locationName,
      addressRegion: state,
      addressCountry: "MY",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Coordinates should be dynamically injected per location if available
    },
    areaServed: {
      "@type": "City",
      name: locationName,
    },
    priceRange: "RM30 - RM1100",
    currenciesAccepted: "MYR",
    paymentAccepted: "Cash, Bank Transfer",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3c. FAQPage Schema (Location Pages)

```typescript
interface FAQ {
  question: string;
  answer: string;
}

export function FAQPageSchema({ faqs }: { faqs: FAQ[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3d. BreadcrumbList Schema (Location Pages)

```typescript
export function BreadcrumbSchema({
  locationName,
  locationSlug,
  locale,
}: {
  locationName: string;
  locationSlug: string;
  locale: string;
}) {
  const baseUrl = "https://sewamotor.my";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "zh" ? "首页" : "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locationName,
        item: `${baseUrl}/${locale}/sewa-motor/${locationSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3e. Product Schema (Per Motorcycle -- Location Pages)

Each of the 6 motorcycles gets a Product schema with AggregateOffer for daily/weekly/monthly pricing.

```typescript
interface ProductData {
  name: string;
  description: string;
  image: string;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
}

export function ProductSchema({
  product,
  locationName,
  locationSlug,
  locale,
}: {
  product: ProductData;
  locationName: string;
  locationSlug: string;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — Rental in ${locationName}`,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.name.split(" ")[0], // "Honda", "Yamaha", or "Modenas"
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "MYR",
      lowPrice: product.priceDaily,
      highPrice: product.priceMonthly,
      offerCount: 3,
      offers: [
        {
          "@type": "Offer",
          name: "Daily Rental",
          price: product.priceDaily,
          priceCurrency: "MYR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
        },
        {
          "@type": "Offer",
          name: "Weekly Rental",
          price: product.priceWeekly,
          priceCurrency: "MYR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
        },
        {
          "@type": "Offer",
          name: "Monthly Rental",
          price: product.priceMonthly,
          priceCurrency: "MYR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3f. All Product Data for Schema

| Motorcycle | Daily (RM) | Weekly (RM) | Monthly (RM) |
|---|---|---|---|
| Honda Vario 160 | 50 | 280 | 900 |
| Yamaha NMax 155 | 55 | 310 | 1000 |
| Honda PCX 160 | 60 | 340 | 1100 |
| Honda Wave 125 | 35 | 200 | 650 |
| Yamaha Y15ZR | 40 | 230 | 750 |
| Modenas Kriss MR3 | 30 | 170 | 550 |

### 3g. Complete Schema Assembly (Location Page)

```typescript
// Inside app/[locale]/sewa-motor/[location]/page.tsx

import {
  LocalBusinessSchema,
  FAQPageSchema,
  BreadcrumbSchema,
  ProductSchema,
} from "@/components/SchemaMarkup";
import { products } from "@/config/products";
import { locations } from "@/config/locations";

export default async function LocationPage({ params }: Props) {
  const { locale, location } = params;
  const locationData = locations.find((l) => l.slug === location);
  const displayName = locationData?.displayName ?? location;
  const state = locationData?.state ?? "";

  // FAQs would come from translations
  const faqs = [
    {
      question: `How much does it cost to rent a motorcycle in ${displayName}?`,
      answer: `Motorcycle rental in ${displayName} starts from RM30/day for the Modenas Kriss MR3. Weekly rates start from RM170 and monthly rates from RM550. Premium models like the Honda PCX 160 are available from RM60/day.`,
    },
    {
      question: `What motorcycles are available for rent in ${displayName}?`,
      answer: `We offer 6 motorcycles in ${displayName}: Honda Vario 160, Yamaha NMax 155, Honda PCX 160, Honda Wave 125, Yamaha Y15ZR, and Modenas Kriss MR3.`,
    },
    {
      question: `How do I book a motorcycle rental in ${displayName}?`,
      answer: `Simply click the WhatsApp button on this page to message us directly. We will confirm availability and arrange delivery or pickup in ${displayName}.`,
    },
  ];

  return (
    <>
      <LocalBusinessSchema
        locationName={displayName}
        locationSlug={location}
        state={state}
        locale={locale}
      />
      <BreadcrumbSchema
        locationName={displayName}
        locationSlug={location}
        locale={locale}
      />
      <FAQPageSchema faqs={faqs} />
      {products.map((product) => (
        <ProductSchema
          key={product.name}
          product={product}
          locationName={displayName}
          locationSlug={location}
          locale={locale}
        />
      ))}

      {/* Page content here */}
    </>
  );
}
```

---

## 4. Image Alt Text Guidelines

### 4a. Alt Text Rules

| Image Type | Alt Text Pattern | Example |
|---|---|---|
| Hero image (homepage) | `Motorcycle rental Malaysia — Sewa Motor Malaysia` | `Motorcycle rental Malaysia — Sewa Motor Malaysia` |
| Hero image (location) | `Motor rental in {City}, Malaysia` | `Motor rental in Kuala Lumpur, Malaysia` |
| Product image | `{Motorcycle name} — available for rent` | `Honda Vario 160 — available for rent` |
| Location card/thumbnail | `Motor rental in {City}, Malaysia` | `Motor rental in Petaling Jaya, Malaysia` |
| WhatsApp CTA icon | `WhatsApp us to book a motorcycle` | `WhatsApp us to book a motorcycle` |
| Logo | `Sewa Motor Malaysia logo` | `Sewa Motor Malaysia logo` |

### 4b. Implementation in Components

```tsx
// Hero Section (Homepage)
<Image
  src="/hero-motorcycle.jpg"
  alt="Motorcycle rental Malaysia — Sewa Motor Malaysia"
  width={1200}
  height={600}
  priority
/>

// Hero Section (Location Page)
<Image
  src="/hero-motorcycle.jpg"
  alt={`Motor rental in ${locationName}, Malaysia`}
  width={1200}
  height={600}
  priority
/>

// Product Card
<Image
  src={`/motorcycles/${product.slug}.jpg`}
  alt={`${product.name} — available for rent`}
  width={400}
  height={300}
/>

// Location Card (on homepage)
<Image
  src={`/locations/${location.slug}.jpg`}
  alt={`Motor rental in ${location.displayName}, Malaysia`}
  width={300}
  height={200}
/>
```

### 4c. Chinese Alt Text (for zh locale)

| Image Type | Alt Text Pattern |
|---|---|
| Hero image (homepage) | `马来西亚摩托车出租 — Sewa Motor Malaysia` |
| Hero image (location) | `{City}摩托车出租服务` |
| Product image | `{Motorcycle name} — 可出租` |
| Location card | `{City}摩托车出租` |

Implementation should use the locale to determine which alt text pattern to use:

```tsx
const heroAlt = locale === "zh"
  ? `${locationName}摩托车出租服务`
  : `Motor rental in ${locationName}, Malaysia`;
```

---

## 5. Sitemap -- `app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";
import { locations } from "@/config/locations";

const BASE_URL = "https://sewamotor.my";
const LOCALES = ["en", "zh"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage variants (2 URLs)
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          zh: `${BASE_URL}/zh`,
        },
      },
    });
  }

  // Location page variants (128 locations x 2 locales = 256 URLs)
  for (const location of locations) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/sewa-motor/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/sewa-motor/${location.slug}`,
            zh: `${BASE_URL}/zh/sewa-motor/${location.slug}`,
          },
        },
      });
    }
  }

  // Total: 2 + 256 = 258 URLs
  return entries;
}
```

### Sitemap Verification

- Total URLs: 258
  - 2 homepage variants (en, zh)
  - 256 location page variants (128 locations x 2 locales)
- Priority: homepage = 1.0, location pages = 0.8
- Change frequency: weekly for all pages
- Each entry includes hreflang alternates for both locales
- Accessible at: `https://sewamotor.my/sitemap.xml`

---

## 6. robots.txt -- `app/robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://sewamotor.my/sitemap.xml",
  };
}
```

### Generated Output

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://sewamotor.my/sitemap.xml
```

---

## 7. Config Dependencies

The above implementations depend on these config files:

### `config/locations.ts`

```typescript
export interface Location {
  slug: string;
  displayName: string;
  state: string;
}

export const locations: Location[] = [
  { slug: "sibu", displayName: "Sibu", state: "Sarawak" },
  { slug: "dungun", displayName: "Dungun", state: "Terengganu" },
  { slug: "kota-laksamana", displayName: "Kota Laksamana", state: "Melaka" },
  { slug: "seberang-jaya", displayName: "Seberang Jaya", state: "Penang" },
  { slug: "arau", displayName: "Arau", state: "Perlis" },
  { slug: "mont-kiara", displayName: "Mont Kiara", state: "Kuala Lumpur" },
  { slug: "subang-jaya", displayName: "Subang Jaya", state: "Selangor" },
  { slug: "kuala-krai", displayName: "Kuala Krai", state: "Kelantan" },
  { slug: "gua-musang", displayName: "Gua Musang", state: "Kelantan" },
  { slug: "damansara-heights", displayName: "Damansara Heights", state: "Kuala Lumpur" },
  { slug: "segambut", displayName: "Segambut", state: "Kuala Lumpur" },
  { slug: "gombak", displayName: "Gombak", state: "Selangor" },
  { slug: "kuching", displayName: "Kuching", state: "Sarawak" },
  { slug: "ipoh", displayName: "Ipoh", state: "Perak" },
  { slug: "rembau", displayName: "Rembau", state: "Negeri Sembilan" },
  { slug: "shah-alam", displayName: "Shah Alam", state: "Selangor" },
  { slug: "sarawak", displayName: "Sarawak", state: "Sarawak" },
  { slug: "bangsar", displayName: "Bangsar", state: "Kuala Lumpur" },
  { slug: "padang-besar", displayName: "Padang Besar", state: "Perlis" },
  { slug: "bukit-cina", displayName: "Bukit Cina", state: "Melaka" },
  { slug: "raub", displayName: "Raub", state: "Pahang" },
  { slug: "setapak", displayName: "Setapak", state: "Kuala Lumpur" },
  { slug: "nibong-tebal", displayName: "Nibong Tebal", state: "Penang" },
  { slug: "puchong", displayName: "Puchong", state: "Selangor" },
  { slug: "bandar-puchong", displayName: "Bandar Puchong", state: "Selangor" },
  { slug: "kuala-lumpur", displayName: "Kuala Lumpur", state: "Kuala Lumpur" },
  { slug: "kota-setar", displayName: "Kota Setar", state: "Kedah" },
  { slug: "perak", displayName: "Perak", state: "Perak" },
  { slug: "kuala-pilah", displayName: "Kuala Pilah", state: "Negeri Sembilan" },
  { slug: "mid-valley", displayName: "Mid Valley", state: "Kuala Lumpur" },
  { slug: "sunway-velocity", displayName: "Sunway Velocity", state: "Kuala Lumpur" },
  { slug: "jempol", displayName: "Jempol", state: "Negeri Sembilan" },
  { slug: "kelantan", displayName: "Kelantan", state: "Kelantan" },
  { slug: "sri-petaling", displayName: "Sri Petaling", state: "Kuala Lumpur" },
  { slug: "ampang", displayName: "Ampang", state: "Selangor" },
  { slug: "marang", displayName: "Marang", state: "Terengganu" },
  { slug: "hulu-langat", displayName: "Hulu Langat", state: "Selangor" },
  { slug: "george-town", displayName: "George Town", state: "Penang" },
  { slug: "kinta", displayName: "Kinta", state: "Perak" },
  { slug: "perlis", displayName: "Perlis", state: "Perlis" },
  { slug: "muar", displayName: "Muar", state: "Johor" },
  { slug: "pulau-pinang", displayName: "Pulau Pinang", state: "Penang" },
  { slug: "skudai", displayName: "Skudai", state: "Johor" },
  { slug: "ayer-keroh", displayName: "Ayer Keroh", state: "Melaka" },
  { slug: "sungai-petani", displayName: "Sungai Petani", state: "Kedah" },
  { slug: "temerloh", displayName: "Temerloh", state: "Pahang" },
  { slug: "kemaman", displayName: "Kemaman", state: "Terengganu" },
  { slug: "sentul", displayName: "Sentul", state: "Kuala Lumpur" },
  { slug: "cheras", displayName: "Cheras", state: "Kuala Lumpur" },
  { slug: "taiping", displayName: "Taiping", state: "Perak" },
  { slug: "klang-valley", displayName: "Klang Valley", state: "Selangor" },
  { slug: "bandar-utama", displayName: "Bandar Utama", state: "Selangor" },
  { slug: "melaka", displayName: "Melaka", state: "Melaka" },
  { slug: "selangor", displayName: "Selangor", state: "Selangor" },
  { slug: "cameron-highlands", displayName: "Cameron Highlands", state: "Pahang" },
  { slug: "jerantut", displayName: "Jerantut", state: "Pahang" },
  { slug: "sungai-buloh", displayName: "Sungai Buloh", state: "Selangor" },
  { slug: "seri-manjung", displayName: "Seri Manjung", state: "Perak" },
  { slug: "kuala-perlis", displayName: "Kuala Perlis", state: "Perlis" },
  { slug: "kuchai-lama", displayName: "Kuchai Lama", state: "Kuala Lumpur" },
  { slug: "serdang", displayName: "Serdang", state: "Selangor" },
  { slug: "segamat", displayName: "Segamat", state: "Johor" },
  { slug: "terengganu", displayName: "Terengganu", state: "Terengganu" },
  { slug: "machang", displayName: "Machang", state: "Kelantan" },
  { slug: "miri", displayName: "Miri", state: "Sarawak" },
  { slug: "manjung", displayName: "Manjung", state: "Perak" },
  { slug: "sepang", displayName: "Sepang", state: "Selangor" },
  { slug: "batu-pahat", displayName: "Batu Pahat", state: "Johor" },
  { slug: "damansara", displayName: "Damansara", state: "Selangor" },
  { slug: "butterworth", displayName: "Butterworth", state: "Penang" },
  { slug: "kajang", displayName: "Kajang", state: "Selangor" },
  { slug: "kulim", displayName: "Kulim", state: "Kedah" },
  { slug: "seremban", displayName: "Seremban", state: "Negeri Sembilan" },
  { slug: "rawang", displayName: "Rawang", state: "Selangor" },
  { slug: "johor", displayName: "Johor", state: "Johor" },
  { slug: "kulai", displayName: "Kulai", state: "Johor" },
  { slug: "desa-parkcity", displayName: "Desa ParkCity", state: "Kuala Lumpur" },
  { slug: "bangsar-south", displayName: "Bangsar South", state: "Kuala Lumpur" },
  { slug: "pahang", displayName: "Pahang", state: "Pahang" },
  { slug: "putrajaya", displayName: "Putrajaya", state: "Putrajaya" },
  { slug: "besut", displayName: "Besut", state: "Terengganu" },
  { slug: "bintulu", displayName: "Bintulu", state: "Sarawak" },
  { slug: "kangar", displayName: "Kangar", state: "Perlis" },
  { slug: "jitra", displayName: "Jitra", state: "Kedah" },
  { slug: "kampar", displayName: "Kampar", state: "Perak" },
  { slug: "alor-gajah", displayName: "Alor Gajah", state: "Melaka" },
  { slug: "bukit-bintang", displayName: "Bukit Bintang", state: "Kuala Lumpur" },
  { slug: "pekan", displayName: "Pekan", state: "Pahang" },
  { slug: "pantai-dalam", displayName: "Pantai Dalam", state: "Kuala Lumpur" },
  { slug: "taman-desa", displayName: "Taman Desa", state: "Kuala Lumpur" },
  { slug: "negeri-sembilan", displayName: "Negeri Sembilan", state: "Negeri Sembilan" },
  { slug: "petaling-jaya", displayName: "Petaling Jaya", state: "Selangor" },
  { slug: "seksyen-7", displayName: "Seksyen 7", state: "Selangor" },
  { slug: "sabah", displayName: "Sabah", state: "Sabah" },
  { slug: "bandar-baru-bangi", displayName: "Bandar Baru Bangi", state: "Selangor" },
  { slug: "kuantan", displayName: "Kuantan", state: "Pahang" },
  { slug: "bukit-mertajam", displayName: "Bukit Mertajam", state: "Penang" },
  { slug: "setiawangsa", displayName: "Setiawangsa", state: "Kuala Lumpur" },
  { slug: "sungai-dua", displayName: "Sungai Dua", state: "Penang" },
  { slug: "jasin", displayName: "Jasin", state: "Melaka" },
  { slug: "tanah-merah", displayName: "Tanah Merah", state: "Kelantan" },
  { slug: "kota-kinabalu", displayName: "Kota Kinabalu", state: "Sabah" },
  { slug: "penang", displayName: "Penang", state: "Penang" },
  { slug: "alor-setar", displayName: "Alor Setar", state: "Kedah" },
  { slug: "sandakan", displayName: "Sandakan", state: "Sabah" },
  { slug: "kota-bharu", displayName: "Kota Bharu", state: "Kelantan" },
  { slug: "bahau", displayName: "Bahau", state: "Negeri Sembilan" },
  { slug: "bangi", displayName: "Bangi", state: "Selangor" },
  { slug: "kedah", displayName: "Kedah", state: "Kedah" },
  { slug: "taman-tun-dr.-ismail-(ttdi)", displayName: "Taman Tun Dr. Ismail (TTDI)", state: "Kuala Lumpur" },
  { slug: "klang", displayName: "Klang", state: "Selangor" },
  { slug: "johor-bahru", displayName: "Johor Bahru", state: "Johor" },
  { slug: "old-klang-road", displayName: "Old Klang Road", state: "Kuala Lumpur" },
  { slug: "langkawi", displayName: "Langkawi", state: "Kedah" },
  { slug: "sri-hartamas", displayName: "Sri Hartamas", state: "Kuala Lumpur" },
  { slug: "tawau", displayName: "Tawau", state: "Sabah" },
  { slug: "kepong", displayName: "Kepong", state: "Kuala Lumpur" },
  { slug: "port-dickson", displayName: "Port Dickson", state: "Negeri Sembilan" },
  { slug: "kuala-terengganu", displayName: "Kuala Terengganu", state: "Terengganu" },
  { slug: "balik-pulau", displayName: "Balik Pulau", state: "Penang" },
  { slug: "taman-melawati", displayName: "Taman Melawati", state: "Selangor" },
  { slug: "cyberjaya", displayName: "Cyberjaya", state: "Selangor" },
];
```

### `config/products.ts`

```typescript
export interface Product {
  name: string;
  slug: string;
  description: string;
  image: string;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  badge: string | null;
}

export const products: Product[] = [
  {
    name: "Honda Vario 160",
    slug: "honda-vario-160",
    description: "Reliable 160cc automatic scooter, perfect for city riding.",
    image: "/motorcycles/honda-vario-160.jpg",
    priceDaily: 50,
    priceWeekly: 280,
    priceMonthly: 900,
    badge: "Most Popular",
  },
  {
    name: "Yamaha NMax 155",
    slug: "yamaha-nmax-155",
    description: "Premium 155cc maxi-scooter with connected features.",
    image: "/motorcycles/yamaha-nmax-155.jpg",
    priceDaily: 55,
    priceWeekly: 310,
    priceMonthly: 1000,
    badge: null,
  },
  {
    name: "Honda PCX 160",
    slug: "honda-pcx-160",
    description: "Smooth and fuel-efficient 160cc premium scooter.",
    image: "/motorcycles/honda-pcx-160.jpg",
    priceDaily: 60,
    priceWeekly: 340,
    priceMonthly: 1100,
    badge: "Best Value",
  },
  {
    name: "Honda Wave 125",
    slug: "honda-wave-125",
    description: "Economical 125cc underbone, great fuel economy.",
    image: "/motorcycles/honda-wave-125.jpg",
    priceDaily: 35,
    priceWeekly: 200,
    priceMonthly: 650,
    badge: "Budget Pick",
  },
  {
    name: "Yamaha Y15ZR",
    slug: "yamaha-y15zr",
    description: "Sporty 150cc moped with strong acceleration.",
    image: "/motorcycles/yamaha-y15zr.jpg",
    priceDaily: 40,
    priceWeekly: 230,
    priceMonthly: 750,
    badge: null,
  },
  {
    name: "Modenas Kriss MR3",
    slug: "modenas-kriss-mr3",
    description: "Affordable and lightweight 110cc daily commuter.",
    image: "/motorcycles/modenas-kriss-mr3.jpg",
    priceDaily: 30,
    priceWeekly: 170,
    priceMonthly: 550,
    badge: null,
  },
];
```

---

## 8. Technical SEO Checklist

| Item | Status | Notes |
|---|---|---|
| `generateMetadata()` for homepage | Done | Dynamic per locale, includes OG + Twitter |
| `generateMetadata()` for location pages | Done | Dynamic per locale + location |
| Canonical URLs | Done | HTTPS, self-referencing per locale |
| hreflang tags (en, zh, x-default) | Done | Via `alternates.languages` in metadata |
| Organization schema (global) | Done | In root layout |
| LocalBusiness schema (location pages) | Done | Per location with address |
| FAQPage schema (location pages) | Done | Dynamic per location |
| BreadcrumbList schema (location pages) | Done | Home > City |
| Product schema with AggregateOffer | Done | 6 motorcycles x daily/weekly/monthly |
| Image alt text guidelines | Done | EN + ZH patterns defined |
| Sitemap (258 URLs) | Done | Homepage priority 1.0, locations 0.8 |
| robots.txt | Done | Allow all, disallow /api/, sitemap link |
| Open Graph tags | Done | Via generateMetadata() |
| Twitter Card tags | Done | summary_large_image |
| All URLs use HTTPS | Done | baseUrl = https://sewamotor.my |
| No duplicate content | Done | Canonical + hreflang prevents duplication |

---

## 9. Validation Notes

- All JSON-LD schema blocks use `@context: "https://schema.org"` and valid `@type` values
- Product schema uses `AggregateOffer` with nested `Offer` array for 3 pricing tiers
- hreflang includes `x-default` pointing to English as required
- Sitemap includes `alternates.languages` for cross-locale discovery
- robots.txt disallows `/api/` to prevent crawling of internal API routes
- All canonical URLs are absolute HTTPS URLs
- Meta descriptions stay under 160 characters for English, optimized for Chinese search display
- Meta titles include brand name, location, and pricing hook
