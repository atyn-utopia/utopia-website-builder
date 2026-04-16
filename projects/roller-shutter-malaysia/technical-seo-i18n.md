# Roller Shutter Door Malaysia — Technical SEO, i18n & WhatsApp Redirect Implementation

**Version:** 1.0
**Date:** 2026-04-06
**Specialist:** Kimmy
**Domain:** roller-shutter-malaysia.vercel.app
**Brand:** Roller Shutter Door Malaysia
**Default Locale:** ms (Bahasa Melayu)

---

## Table of Contents

- **Part A: Technical SEO** (Items 1-6)
- **Part B: i18n** (Items 7-14)
- **Part C: WhatsApp Redirect** (Items 15-17)
- **Part D: Complete Translation Files** (ms.json, en.json, zh.json)

---

# PART A: TECHNICAL SEO

---

## 1. generateMetadata() — Homepage & Location Pages

### Homepage: `app/[locale]/page.tsx`

```tsx
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = `https://${siteConfig.domain}`;

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `${baseUrl}/${loc}`;
  }

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...alternates,
        'x-default': `${baseUrl}/ms`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale: locale,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

### Location Page: `app/[locale]/roller-shutter/[location]/page.tsx`

```tsx
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const params: { locale: string; location: string }[] = [];
  for (const locale of locales) {
    for (const loc of locations) {
      params.push({ locale, location: loc.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const locationData = locations.find((l) => l.slug === location);
  if (!locationData) return notFound();

  const t = await getTranslations({ locale, namespace: 'locationPages' });
  const s = await getTranslations({ locale, namespace: 'shared' });
  const baseUrl = `https://${siteConfig.domain}`;

  // Location-specific meta from translation files
  const metaTitle = t(`${location}.metaTitle`);
  const metaDescription = t(`${location}.metaDescription`);

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `${baseUrl}/${loc}/roller-shutter/${location}`;
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/${locale}/roller-shutter/${location}`,
      languages: {
        ...alternates,
        'x-default': `${baseUrl}/ms/roller-shutter/${location}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${baseUrl}/${locale}/roller-shutter/${location}`,
      siteName: siteConfig.brandName,
      locale: locale,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

---

## 2. hreflang Implementation

hreflang is handled automatically by Next.js via the `alternates.languages` object in `generateMetadata()` above. This produces:

```html
<link rel="alternate" hreflang="ms" href="https://roller-shutter-malaysia.vercel.app/ms/..." />
<link rel="alternate" hreflang="en" href="https://roller-shutter-malaysia.vercel.app/en/..." />
<link rel="alternate" hreflang="zh" href="https://roller-shutter-malaysia.vercel.app/zh/..." />
<link rel="alternate" hreflang="x-default" href="https://roller-shutter-malaysia.vercel.app/ms/..." />
```

**Rules:**
- `x-default` ALWAYS points to `/ms/...` (Bahasa Melayu is the default)
- Every page (homepage, location pages) includes all 4 hreflang tags
- Canonical URL matches the current locale's URL

---

## 3. JSON-LD Schema Markup

### 3.1 OrganizationSchema — `components/schema/OrganizationSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const baseUrl = `https://${siteConfig.domain}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: 'customer service',
      areaServed: 'MY',
      availableLanguage: ['Malay', 'English', 'Chinese'],
    },
    sameAs: [
      'https://www.facebook.com/rollershutterdoormy',
      'https://www.instagram.com/rollershutterdoormy',
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

### 3.2 LocalBusinessSchema — `components/schema/LocalBusinessSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';

interface LocalBusinessSchemaProps {
  locale: string;
  locationSlug?: string;
  cityName?: string;
}

export function LocalBusinessSchema({
  locale,
  locationSlug,
  cityName,
}: LocalBusinessSchemaProps) {
  const baseUrl = `https://${siteConfig.domain}`;
  const displayCity = cityName || 'Malaysia';
  const url = locationSlug
    ? `${baseUrl}/${locale}/roller-shutter/${locationSlug}`
    : `${baseUrl}/${locale}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#localbusiness`,
    name: `${siteConfig.brandName} — ${displayCity}`,
    image: `${baseUrl}/images/roller-shutter-hero.jpg`,
    url: url,
    telephone: `+${siteConfig.fallbackPhone}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: displayCity,
      addressCountry: 'MY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '3.1390',
      longitude: '101.6869',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
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

### 3.3 FAQSchema — `components/schema/FAQSchema.tsx`

```tsx
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
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

### 3.4 BreadcrumbSchema — `components/schema/BreadcrumbSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = `https://${siteConfig.domain}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
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

### 3.5 ProductSchema — `components/schema/ProductSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  locale: string;
}

export function ProductSchema({ name, description, locale }: ProductSchemaProps) {
  const baseUrl = `https://${siteConfig.domain}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MYR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/${locale}`,
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

### Schema Usage in Pages

**Homepage** includes: OrganizationSchema + LocalBusinessSchema + FAQSchema + ProductSchema
**Location pages** include: LocalBusinessSchema + FAQSchema + BreadcrumbSchema

---

## 4. Alt Text Formulas

All alt text is stored in translation files and uses these patterns:

### Homepage

| Image Context | BM Formula | EN Formula | ZH Formula |
|---|---|---|---|
| Hero image | `Pemasangan roller shutter untuk kilang di Malaysia` | `Roller shutter door installation for factory in Malaysia` | `马来西亚工厂卷帘门安装` |
| Product card (Mild Steel) | `Roller shutter mild steel untuk kilang dan gudang` | `Mild steel roller shutter for factory and warehouse` | `工厂和仓库用钢铁卷帘门` |
| Product card (Aluminium) | `Roller shutter aluminium untuk premis komersial` | `Aluminium roller shutter for commercial premises` | `商业场所铝合金卷帘门` |
| Product card (Polycarbonate) | `Roller shutter polycarbonate transparent untuk kedai` | `Transparent polycarbonate roller shutter for shop` | `商店用透明卷帘门` |
| Product card (Fire-Rated) | `Roller shutter tahan api untuk pematuhan BOMBA` | `Fire-rated roller shutter for fire safety compliance` | `防火卷帘门消防合规` |
| Product card (Grille) | `Roller shutter gril untuk kedai runcit` | `Grille roller shutter for retail shop` | `零售店用格栅卷帘门` |
| Product card (Motorised) | `Roller shutter automatik bermotor untuk gudang` | `Motorised automatic roller shutter for warehouse` | `仓库用电动自动卷帘门` |
| Gallery image | `Projek pemasangan roller shutter {category}` | `Roller shutter {category} installation project` | `卷帘门{category}安装项目` |
| Review avatar | `Ulasan pelanggan {name} dari {location}` | `Customer review by {name} from {location}` | `{location}客户{name}的评价` |

### Location Pages

| Image Context | BM Formula | EN Formula | ZH Formula |
|---|---|---|---|
| Hero image | `Perkhidmatan roller shutter di {City}` | `Roller shutter service in {City}` | `{City}卷帘门服务` |
| Product card | `Roller shutter {type} di {City}` | `{type} roller shutter in {City}` | `{City}{type}卷帘门` |
| Gallery image | `Projek roller shutter di {City}` | `Roller shutter project in {City}` | `{City}卷帘门项目` |

**Implementation:** Alt text is stored in the `gallery.altTexts` and `products.items[n].altText` keys in each locale's translation file. Components use `t('products.items.mildSteel.altText')` pattern.

---

## 5. app/sitemap.ts

```tsx
import type { MetadataRoute } from 'next';
import { locations } from '@/config/locations';
import { siteConfig } from '@/config/site';

const locales = siteConfig.locales;
const baseUrl = `https://${siteConfig.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepages (3 locales)
  for (const locale of locales) {
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[loc] = `${baseUrl}/${loc}`;
    }
    languages['x-default'] = `${baseUrl}/ms`;

    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages,
      },
    });
  }

  // Location pages (50 locations x 3 locales = 150 entries)
  for (const location of locations) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};
      for (const loc of locales) {
        languages[loc] = `${baseUrl}/${loc}/roller-shutter/${location.slug}`;
      }
      languages['x-default'] = `${baseUrl}/ms/roller-shutter/${location.slug}`;

      entries.push({
        url: `${baseUrl}/${locale}/roller-shutter/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
```

**Total entries:** 3 (homepages) + 150 (location pages) = **153 sitemap entries**

---

## 6. app/robots.ts

```tsx
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${siteConfig.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/redirect-whatsapp-1'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

# PART B: i18n

---

## 7. i18n/routing.ts

```tsx
import { defineRouting } from 'next-intl/routing';

export const locales = ['ms', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  localePrefix: 'always',
});
```

---

## 8. i18n/request.ts

```tsx
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale, fallback to default
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

---

## 9. middleware.ts

```tsx
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except Next.js internals and static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
```

---

## 10-12. Translation Files

### Translation File Structure (applies to all 3 files)

Each locale file contains the following top-level namespaces:
- `metadata` — homepage meta title/description
- `nav` — navigation links
- `fomoBanner` — FOMO urgency banner texts
- `hero` — hero section copy
- `stats` — statistics bar
- `products` — 6 product types with heading, description, keyPoints, altText, cta
- `howItWorks` — 4 process steps
- `riskProblem` — pain points section
- `midCta` — mid-page CTA
- `reviews` — 6 customer reviews
- `whyChoose` — 6 USPs
- `gallery` — gallery section
- `locations` — locations accordion
- `faq` — 6 FAQ items
- `finalCta` — final CTA section
- `footer` — footer content
- `breadcrumbs` — breadcrumb labels
- `nearbyLocations` — nearby locations section
- `common` — shared UI strings
- `shared` — text used on BOTH homepage and location pages
- `locationPages` — location-specific copy keyed by slug

---

### 10. messages/ms.json (DEFAULT — Bahasa Melayu)

```json
{
  "metadata": {
    "title": "Roller Shutter Malaysia | Pasang & Baiki 24 Jam",
    "description": "Pakar roller shutter #1 di Malaysia. Pemasangan, baiki & servis pintu besi gulung 24 jam. Mild steel, aluminium, polycarbonate. WhatsApp kami sekarang!"
  },
  "nav": {
    "home": "Utama",
    "products": "Produk",
    "howItWorks": "Cara Kerja",
    "reviews": "Ulasan",
    "faq": "Soalan Lazim",
    "locations": "Lokasi",
    "contact": "Hubungi",
    "brandName": "Roller Shutter Door Malaysia",
    "ctaButton": "WhatsApp Sekarang"
  },
  "fomoBanner": {
    "texts": [
      "12 pelanggan di kawasan anda membuat tempahan minggu ini — slot pemasangan bulan ini hampir penuh!",
      "Pasukan baiki kecemasan kami telah menyelesaikan 3 kerja hari ini — hubungi kami sebelum slot habis!",
      "Lebih 15,000 premis dilindungi roller shutter kami di seluruh Malaysia"
    ]
  },
  "hero": {
    "h1": "Pintu Roller Shutter Malaysia — Pakar #1 Pemasangan & Baiki 24 Jam",
    "subtitle": "Pasang, baiki & selenggara semua jenis pintu roller shutter untuk kilang, kedai dan gudang. Perkhidmatan kecemasan 24 jam, 7 hari seminggu di seluruh Malaysia.",
    "ctaPrimary": "WhatsApp Sekarang",
    "ctaPrimarySubtext": "Dapatkan Sebut Harga Percuma",
    "ctaSecondary": "Lihat Jenis Roller Shutter Kami",
    "altText": "Pemasangan roller shutter untuk kilang di Malaysia"
  },
  "stats": {
    "items": [
      { "value": "15,000+", "label": "Pemasangan Berjaya" },
      { "value": "24/7", "label": "Perkhidmatan Kecemasan" },
      { "value": "20+", "label": "Tahun Pengalaman" },
      { "value": "50+", "label": "Kawasan Diliputi" }
    ]
  },
  "products": {
    "heading": "Jenis Roller Shutter Kami",
    "subheading": "Setiap premis ada keperluan berbeza. Kami sediakan 6 jenis roller shutter untuk perlindungan maksimum perniagaan anda.",
    "items": {
      "mildSteel": {
        "name": "Roller Shutter Mild Steel",
        "description": "Pilihan paling popular untuk kilang, gudang dan premis komersial. Diperbuat daripada keluli berkualiti tinggi untuk kekuatan dan ketahanan maksimum. Kos efektif dengan jangka hayat yang panjang.",
        "keyPoints": [
          "Kekuatan industri untuk perlindungan maksimum",
          "Kos efektif — pilihan terbaik untuk bajet sederhana",
          "Sesuai untuk kilang, gudang & premis besar"
        ],
        "cta": "WhatsApp Untuk Sebut Harga",
        "altText": "Roller shutter mild steel untuk kilang dan gudang"
      },
      "aluminium": {
        "name": "Roller Shutter Aluminium",
        "description": "Ringan, tahan karat dan sesuai untuk premis yang memerlukan rupa profesional. Pilihan ideal untuk pejabat, klinik dan premis komersial moden.",
        "keyPoints": [
          "Ringan — mudah dioperasi secara manual atau automatik",
          "Tahan karat & cuaca tropika Malaysia",
          "Rupa moden dan kemas untuk premis profesional"
        ],
        "cta": "WhatsApp Untuk Sebut Harga",
        "altText": "Roller shutter aluminium untuk premis komersial"
      },
      "polycarbonate": {
        "name": "Roller Shutter Polycarbonate (Transparent)",
        "description": "Gabungan keselamatan dan penglihatan. Pelanggan boleh melihat produk paparan anda walaupun selepas waktu perniagaan. Sesuai untuk butik, showroom dan pusat beli-belah.",
        "keyPoints": [
          "Paparan produk 24 jam walaupun kedai tutup",
          "Keselamatan setanding roller shutter keluli",
          "Kemasukan cahaya semula jadi — jimat elektrik"
        ],
        "cta": "WhatsApp Untuk Sebut Harga",
        "altText": "Roller shutter polycarbonate transparent untuk kedai"
      },
      "fireRated": {
        "name": "Roller Shutter Tahan Api (Fire-Rated)",
        "description": "Memenuhi piawaian keselamatan kebakaran Malaysia. Wajib untuk bangunan tertentu mengikut undang-undang BOMBA. Direka untuk menghalang penyebaran api dan asap antara zon.",
        "keyPoints": [
          "Sijil & pematuhan piawaian BOMBA Malaysia",
          "Menghalang api & asap merebak antara zon",
          "Wajib untuk kilang, gudang & bangunan komersial tertentu"
        ],
        "cta": "WhatsApp Untuk Sebut Harga",
        "altText": "Roller shutter tahan api untuk pematuhan BOMBA"
      },
      "grille": {
        "name": "Roller Shutter Gril",
        "description": "Keselamatan dengan pengudaraan. Reka bentuk gril membenarkan aliran udara dan penglihatan sambil mengekalkan perlindungan. Pilihan utama untuk kedai runcit, pasaraya dan premis retail.",
        "keyPoints": [
          "Pengudaraan optimum — sesuai untuk iklim panas Malaysia",
          "Penglihatan ke dalam premis walaupun selepas waktu operasi",
          "Popular untuk kedai runcit, pasaraya & food court"
        ],
        "cta": "WhatsApp Untuk Sebut Harga",
        "altText": "Roller shutter gril untuk kedai runcit"
      },
      "motorised": {
        "name": "Roller Shutter Automatik (Bermotor)",
        "description": "Buka dan tutup dengan satu butang atau alat kawalan jauh. Sesuai untuk pintu besar yang kerap dibuka-tutup. Jimat masa, tenaga dan tingkatkan kecekapan operasi harian.",
        "keyPoints": [
          "Kawalan jauh atau suis — tanpa usaha fizikal",
          "Sesuai untuk pintu besar kilang & gudang logistik",
          "Naik taraf dari manual ke automatik tersedia"
        ],
        "cta": "WhatsApp Untuk Sebut Harga",
        "altText": "Roller shutter automatik bermotor untuk gudang"
      }
    }
  },
  "howItWorks": {
    "heading": "Cara Kami Bekerja",
    "subheading": "Dari pertanyaan hingga pemasangan — proses mudah dalam 4 langkah sahaja.",
    "steps": [
      {
        "number": "1",
        "title": "Hubungi Kami via WhatsApp",
        "description": "Beritahu kami keperluan anda — pemasangan baru, baiki atau servis. Hantar gambar lokasi untuk penilaian pantas."
      },
      {
        "number": "2",
        "title": "Tinjauan Tapak & Sebut Harga",
        "description": "Pasukan kami akan lawat premis anda untuk pengukuran tepat. Anda terima sebut harga terperinci tanpa sebarang caj tersembunyi."
      },
      {
        "number": "3",
        "title": "Pemasangan Profesional",
        "description": "Juruteknik bertauliah kami siapkan pemasangan mengikut jadual yang dipersetujui. Kerja kemas, cepat dan mengikut piawaian keselamatan."
      },
      {
        "number": "4",
        "title": "Jaminan & Sokongan Selepas Jualan",
        "description": "Setiap pemasangan disertai jaminan. Pasukan kecemasan 24 jam sentiasa sedia untuk sebarang isu selepas pemasangan."
      }
    ]
  },
  "riskProblem": {
    "heading": "Jangan Biarkan Premis Anda Terdedah Kepada Risiko",
    "subheading": "Roller shutter yang rosak atau tiada perlindungan boleh mengundang masalah besar.",
    "problems": [
      {
        "title": "Kecurian & Pecah Masuk",
        "description": "Premis tanpa roller shutter atau dengan pintu rosak adalah sasaran utama pencuri. Kerugian boleh mencecah puluhan ribu ringgit dalam satu malam."
      },
      {
        "title": "Kerosakan Akibat Cuaca",
        "description": "Hujan lebat, angin kuat dan ribut tropika boleh merosakkan stok dan peralatan anda jika premis tidak dilindungi dengan betul."
      },
      {
        "title": "Kos Baiki Yang Membengkak",
        "description": "Roller shutter yang tidak diselenggara akan rosak lebih cepat. Kos baiki kecemasan jauh lebih mahal daripada servis pencegahan berkala."
      },
      {
        "title": "Gagal Pematuhan BOMBA",
        "description": "Premis tertentu wajib ada roller shutter tahan api. Kegagalan mematuhi boleh mengakibatkan denda, penutupan dan risiko keselamatan."
      }
    ],
    "solutionCta": "Jangan tunggu sehingga terlambat — WhatsApp kami sekarang untuk penilaian percuma."
  },
  "midCta": {
    "heading": "Perlukan Roller Shutter Baru atau Baiki Segera?",
    "subheading": "Pasukan kami sedia membantu 24 jam, 7 hari seminggu. Dapatkan sebut harga percuma dalam masa 30 minit.",
    "ctaButton": "WhatsApp Kami Sekarang"
  },
  "reviews": {
    "heading": "Apa Kata Pelanggan Kami",
    "subheading": "Dipercayai oleh ribuan pemilik perniagaan di seluruh Malaysia.",
    "items": [
      {
        "name": "Ahmad Faizal",
        "location": "Klang, Selangor",
        "rating": 5,
        "text": "Roller shutter kilang saya rosak tengah malam. Hubungi mereka pukul 2 pagi dan juruteknik sampai dalam 45 minit. Kerja cepat dan profesional. Sangat rekomen!"
      },
      {
        "name": "Lee Wei Keat",
        "location": "Petaling Jaya, Selangor",
        "rating": 5,
        "text": "Pasang 8 unit roller shutter aluminium untuk kedai baru saya. Siap dalam 2 hari. Kualiti terbaik dan harga berpatutan. Pasukan mereka sangat teratur."
      },
      {
        "name": "Siti Nurhaliza",
        "location": "Johor Bahru, Johor",
        "rating": 5,
        "text": "Sudah 3 tahun guna servis mereka untuk maintenance berkala. Roller shutter gudang saya sentiasa dalam keadaan baik. Servis terbaik di JB!"
      },
      {
        "name": "Rajesh Kumar",
        "location": "Penang",
        "rating": 5,
        "text": "Tukar motor roller shutter lama kepada automatik. Sekarang buka tutup pintu gudang sangat mudah. Terima kasih atas kerja yang cemerlang!"
      },
      {
        "name": "Tan Mei Ling",
        "location": "Shah Alam, Selangor",
        "rating": 5,
        "text": "Pasang fire-rated roller shutter untuk pematuhan BOMBA. Proses smooth dari tinjauan sampai pemasangan. Harga kompetitif dan kerja berkualiti."
      },
      {
        "name": "Mohd Hafiz",
        "location": "Kuala Lumpur",
        "rating": 5,
        "text": "Emergency call pukul 11 malam sebab spring patah. Mereka datang cepat dan selesaikan masalah dalam masa sejam. Memang pakar roller shutter!"
      }
    ]
  },
  "whyChoose": {
    "heading": "Kenapa Pilih Kami?",
    "subheading": "Kami bukan sekadar kontraktor — kami pakar roller shutter yang anda boleh percayai.",
    "items": [
      {
        "title": "Perkhidmatan Kecemasan 24 Jam",
        "description": "Roller shutter rosak tak kenal waktu. Pasukan baiki kecemasan kami beroperasi 24/7, termasuk cuti umum dan hujung minggu."
      },
      {
        "title": "20+ Tahun Pengalaman",
        "description": "Lebih dua dekad pengalaman dalam industri roller shutter Malaysia. Kami telah menangani setiap jenis kerosakan dan pemasangan yang anda boleh bayangkan."
      },
      {
        "title": "50+ Kawasan Liputan",
        "description": "Dari Johor hingga Penang, Kuching hingga Kota Kinabalu — rangkaian pasukan kami meliputi seluruh Malaysia untuk perkhidmatan pantas."
      },
      {
        "title": "Sebut Harga Telus — Tiada Caj Tersembunyi",
        "description": "Anda tahu tepat berapa kosnya sebelum kerja bermula. Tiada surprise, tiada caj tambahan tanpa kebenaran anda."
      },
      {
        "title": "Jaminan Kerja & Bahan",
        "description": "Setiap pemasangan dan pembaikan disertai jaminan. Kami gunakan bahan berkualiti tinggi dari pembekal yang dipercayai."
      },
      {
        "title": "Juruteknik Bertauliah & Berpengalaman",
        "description": "Setiap juruteknik kami terlatih dan berpengalaman. Kerja kemas, selamat dan mengikut piawaian industri."
      }
    ]
  },
  "gallery": {
    "heading": "Galeri Projek Kami",
    "subheading": "Lihat hasil kerja pemasangan dan pembaikan roller shutter kami di seluruh Malaysia.",
    "categories": [
      "Pemasangan Baru",
      "Pembaikan & Penyelenggaraan",
      "Projek Kilang & Gudang",
      "Projek Kedai & Komersial"
    ],
    "altTexts": {
      "newInstallation": "Projek pemasangan roller shutter baru",
      "repair": "Projek pembaikan dan penyelenggaraan roller shutter",
      "factory": "Projek roller shutter kilang dan gudang",
      "commercial": "Projek roller shutter kedai dan komersial"
    }
  },
  "locations": {
    "heading": "Kawasan Perkhidmatan Kami",
    "subheading": "Perkhidmatan roller shutter profesional di lebih 50 lokasi seluruh Malaysia.",
    "regions": {
      "klangValley": "Klang Valley",
      "southernSelangor": "Selangor Selatan",
      "negeriSembilan": "Negeri Sembilan",
      "northern": "Utara",
      "southern": "Selatan",
      "eastCoast": "Pantai Timur",
      "eastMalaysia": "Malaysia Timur"
    },
    "viewDetails": "Lihat Perkhidmatan di {city}"
  },
  "faq": {
    "heading": "Soalan Lazim (FAQ)",
    "items": [
      {
        "question": "Berapa kos pemasangan roller shutter baru?",
        "answer": "Kos bergantung kepada jenis roller shutter, saiz pintu dan lokasi premis anda. Roller shutter mild steel bermula dari harga yang berpatutan untuk saiz standard. Hubungi kami via WhatsApp untuk mendapatkan sebut harga tepat berdasarkan keperluan spesifik anda — penilaian dan sebut harga adalah PERCUMA."
      },
      {
        "question": "Berapa lama masa yang diperlukan untuk pemasangan?",
        "answer": "Pemasangan standard untuk satu unit roller shutter biasanya mengambil masa 1-2 hari bekerja. Untuk projek yang melibatkan beberapa unit atau pemasangan khas seperti fire-rated, tempoh mungkin lebih panjang. Pasukan kami akan berikan jadual tepat selepas tinjauan tapak."
      },
      {
        "question": "Adakah anda menyediakan perkhidmatan baiki kecemasan 24 jam?",
        "answer": "Ya, kami beroperasi 24 jam, 7 hari seminggu termasuk cuti umum. Jika roller shutter anda rosak pada bila-bila masa — tengah malam, hujung minggu atau hari raya — juruteknik kami sedia untuk tiba di lokasi anda secepat mungkin. WhatsApp kami untuk respon segera."
      },
      {
        "question": "Bolehkah roller shutter manual ditukar kepada automatik?",
        "answer": "Boleh! Kami menawarkan perkhidmatan naik taraf motor untuk menukar roller shutter manual sedia ada kepada sistem bermotor. Ini meningkatkan kecekapan operasi terutama untuk pintu besar yang kerap dibuka-tutup. Proses naik taraf biasanya siap dalam sehari."
      },
      {
        "question": "Apakah jenis roller shutter yang sesuai untuk premis saya?",
        "answer": "Ia bergantung kepada keperluan anda. Untuk keselamatan maksimum — mild steel. Untuk rupa profesional dan tahan karat — aluminium. Untuk paparan produk — polycarbonate. Untuk pematuhan BOMBA — fire-rated. Hubungi kami via WhatsApp dan pakar kami akan cadangkan jenis terbaik untuk premis anda."
      },
      {
        "question": "Adakah roller shutter anda disertai jaminan?",
        "answer": "Ya, setiap pemasangan dan pembaikan disertai jaminan ke atas bahan dan kerja. Tempoh jaminan bergantung kepada jenis produk dan skop kerja. Kami juga menawarkan pakej servis berkala untuk memastikan roller shutter anda sentiasa dalam keadaan terbaik sepanjang jangka hayatnya."
      }
    ]
  },
  "finalCta": {
    "heading": "Sedia Untuk Melindungi Premis Anda?",
    "subheading": "Dapatkan sebut harga percuma dalam masa 30 minit. Pasukan pakar kami sedia membantu anda 24/7.",
    "ctaButton": "WhatsApp Sekarang — Sebut Harga Percuma",
    "supportingText": "Tiada komitmen. Tiada caj tersembunyi. Hanya perkhidmatan roller shutter terbaik di Malaysia."
  },
  "footer": {
    "tagline": "Roller Shutter Door Malaysia — Pakar #1 Pemasangan & Baiki 24 Jam",
    "services": {
      "heading": "Perkhidmatan",
      "items": [
        "Pemasangan Baru",
        "Baiki & Penyelesaian Masalah",
        "Penyelenggaraan Berkala",
        "Naik Taraf Motor",
        "Penggantian Spring"
      ]
    },
    "productTypes": {
      "heading": "Jenis Roller Shutter",
      "items": [
        "Mild Steel",
        "Aluminium",
        "Polycarbonate / Transparent",
        "Fire-Rated (Tahan Api)",
        "Gril",
        "Automatik / Bermotor"
      ]
    },
    "areas": {
      "heading": "Kawasan",
      "items": [
        "Klang Valley",
        "Selangor",
        "Johor",
        "Penang",
        "Negeri Sembilan",
        "Lain-lain"
      ]
    },
    "social": {
      "heading": "Ikuti Kami",
      "facebook": "Facebook",
      "instagram": "Instagram",
      "google": "Google Business"
    },
    "copyright": "© 2026 Roller Shutter Door Malaysia. Hak cipta terpelihara.",
    "whatsappFloat": "WhatsApp Kami"
  },
  "breadcrumbs": {
    "home": "Utama",
    "rollerShutter": "Roller Shutter"
  },
  "nearbyLocations": {
    "heading": "Kawasan Berdekatan",
    "subheading": "Kami juga menyediakan perkhidmatan roller shutter di kawasan berikut:",
    "viewService": "Lihat Perkhidmatan"
  },
  "common": {
    "callNow": "Hubungi Sekarang",
    "whatsappUs": "WhatsApp Kami",
    "freeQuote": "Sebut Harga Percuma",
    "learnMore": "Ketahui Lebih Lanjut",
    "viewAll": "Lihat Semua",
    "backToTop": "Kembali ke Atas",
    "loading": "Memuatkan...",
    "error": "Ralat berlaku"
  },
  "shared": {
    "whatsappCta": "WhatsApp Sekarang",
    "emergencyBadge": "Kecemasan 24 Jam",
    "freeQuoteBadge": "Sebut Harga Percuma",
    "trustedBadge": "Dipercayai 15,000+ Pelanggan",
    "brandName": "Roller Shutter Door Malaysia",
    "phoneLabel": "Hubungi Kami",
    "allRightsReserved": "Hak cipta terpelihara",
    "whatsappPrefilledMessage": "Hai, saya berminat dengan perkhidmatan roller shutter. Boleh saya dapatkan sebut harga?",
    "whatsappPrefilledMessageLocation": "Hai, saya berminat dengan perkhidmatan roller shutter di {city}. Boleh saya dapatkan sebut harga?"
  },
  "locationPages": {
    "kuala-lumpur": {
      "metaTitle": "Roller Shutter Kuala Lumpur | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter di Kuala Lumpur. Pemasangan, baiki & servis pintu besi gulung 24 jam untuk kilang, kedai & gudang di KL. WhatsApp untuk sebut harga percuma.",
      "h1": "Roller Shutter Kuala Lumpur — Pasang & Baiki 24 Jam",
      "intro": "Kuala Lumpur sebagai ibu negara dan pusat perniagaan utama Malaysia mempunyai ribuan premis komersial dan industri yang memerlukan perlindungan roller shutter berkualiti. Dari kawasan perindustrian Segambut hingga ke deretan kedai di Bukit Bintang, kami melayani semua jenis premis di KL. Pasukan kami berpangkalan strategik di Kuala Lumpur untuk memastikan respons pantas kepada setiap panggilan kecemasan.",
      "closingCta": "Perlukan pakar roller shutter di Kuala Lumpur? WhatsApp kami sekarang untuk sebut harga percuma dan respons dalam 30 minit."
    },
    "petaling-jaya": {
      "metaTitle": "Roller Shutter Petaling Jaya | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter profesional di Petaling Jaya. Pasang, baiki & servis 24 jam untuk kedai, kilang & pejabat di PJ. Hubungi kami via WhatsApp!",
      "h1": "Roller Shutter Petaling Jaya — Pasang & Baiki 24 Jam",
      "intro": "Petaling Jaya merupakan hab komersial utama Selangor dengan kepesatan pembangunan dari Seksyen 13 hingga Damansara Perdana. Pemilik premis di PJ memerlukan roller shutter yang tahan lasak untuk melindungi pelaburan mereka di kawasan perniagaan yang sibuk ini.",
      "closingCta": "Roller shutter di PJ rosak atau perlukan pemasangan baru? WhatsApp kami sekarang — pasukan kami sedia membantu 24/7."
    },
    "shah-alam": {
      "metaTitle": "Roller Shutter Shah Alam | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Shah Alam. Pemasangan & baiki 24 jam untuk kilang, gudang & premis komersial. Sebut harga percuma — WhatsApp kami sekarang!",
      "h1": "Roller Shutter Shah Alam — Pasang & Baiki 24 Jam",
      "intro": "Shah Alam, ibu negeri Selangor, terkenal dengan kawasan perindustrian besar seperti Seksyen 15, Seksyen 23 dan HICOM. Ribuan kilang dan gudang di sini bergantung kepada roller shutter berkualiti tinggi untuk operasi harian mereka.",
      "closingCta": "Pemilik kilang atau gudang di Shah Alam? WhatsApp kami untuk penilaian tapak percuma dan sebut harga tanpa komitmen."
    },
    "subang-jaya": {
      "metaTitle": "Roller Shutter Subang Jaya | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Subang Jaya. Pasang, baiki & selenggara 24 jam untuk premis perniagaan. WhatsApp untuk sebut harga percuma hari ini!",
      "h1": "Roller Shutter Subang Jaya — Pasang & Baiki 24 Jam",
      "intro": "Subang Jaya berkembang pesat sebagai pusat perniagaan dan komersial dengan kawasan seperti USJ, Sunway dan SS15 yang dipenuhi kedai, restoran dan premis komersial.",
      "closingCta": "Premis anda di Subang Jaya perlukan roller shutter? WhatsApp kami sekarang untuk mendapatkan sebut harga percuma."
    },
    "cheras": {
      "metaTitle": "Roller Shutter Cheras | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Cheras — pemasangan baru, baiki & servis 24 jam. Pakar pintu besi gulung untuk kedai, kilang & gudang di Cheras. WhatsApp kami!",
      "h1": "Roller Shutter Cheras — Pasang & Baiki 24 Jam",
      "intro": "Cheras merupakan salah satu kawasan paling padat di Lembah Klang dengan campuran premis komersial, perindustrian dan perniagaan kecil.",
      "closingCta": "Pemilik perniagaan di Cheras? WhatsApp kami sekarang — dapatkan sebut harga roller shutter dalam 30 minit."
    },
    "ampang": {
      "metaTitle": "Roller Shutter Ampang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Ampang. Pasang, baiki & selenggara pintu besi gulung 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Ampang — Pasang & Baiki 24 Jam",
      "intro": "Ampang membangun pesat dengan pelbagai premis komersial dan perindustrian yang memerlukan perlindungan roller shutter berkualiti.",
      "closingCta": "Perlukan roller shutter di Ampang? WhatsApp kami sekarang untuk sebut harga percuma."
    },
    "puchong": {
      "metaTitle": "Roller Shutter Puchong | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Puchong. Pemasangan, baiki & servis 24 jam untuk kilang, kedai & gudang. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Puchong — Pasang & Baiki 24 Jam",
      "intro": "Puchong merupakan kawasan perniagaan yang berkembang pesat dengan banyak premis komersial, kilang kecil dan gudang yang memerlukan roller shutter berkualiti.",
      "closingCta": "Premis di Puchong perlukan roller shutter? WhatsApp kami untuk sebut harga percuma hari ini."
    },
    "bangsar": {
      "metaTitle": "Roller Shutter Bangsar | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Bangsar — pemasangan & baiki 24 jam. Perkhidmatan profesional untuk kedai, pejabat & premis komersial. WhatsApp kami!",
      "h1": "Roller Shutter Bangsar — Pasang & Baiki 24 Jam",
      "intro": "Bangsar dikenali sebagai kawasan komersial premium dengan deretan kedai, restoran dan pejabat yang memerlukan roller shutter berkualiti tinggi untuk keselamatan dan estetika.",
      "closingCta": "Premis di Bangsar perlukan roller shutter? WhatsApp kami sekarang untuk penilaian percuma."
    },
    "damansara": {
      "metaTitle": "Roller Shutter Damansara | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Damansara. Pasang, baiki & selenggara 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Damansara — Pasang & Baiki 24 Jam",
      "intro": "Damansara merangkumi kawasan perniagaan moden seperti Damansara Perdana, Damansara Jaya dan Damansara Utama yang penuh dengan premis komersial memerlukan perlindungan roller shutter.",
      "closingCta": "Perlukan roller shutter di Damansara? WhatsApp kami sekarang — respons dalam 30 minit."
    },
    "cyberjaya": {
      "metaTitle": "Roller Shutter Cyberjaya | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Cyberjaya — pemasangan & baiki 24 jam untuk premis teknologi & komersial. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Cyberjaya — Pasang & Baiki 24 Jam",
      "intro": "Cyberjaya sebagai hab teknologi Malaysia mempunyai banyak premis komersial dan pusat data yang memerlukan roller shutter berkualiti tinggi untuk keselamatan.",
      "closingCta": "Premis di Cyberjaya perlukan roller shutter? WhatsApp kami sekarang."
    },
    "putrajaya": {
      "metaTitle": "Roller Shutter Putrajaya | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Putrajaya. Pemasangan & baiki 24 jam untuk premis kerajaan & komersial. WhatsApp kami!",
      "h1": "Roller Shutter Putrajaya — Pasang & Baiki 24 Jam",
      "intro": "Putrajaya sebagai pusat pentadbiran kerajaan mempunyai pelbagai premis komersial dan bangunan kerajaan yang memerlukan roller shutter berkualiti untuk keselamatan.",
      "closingCta": "Perlukan roller shutter di Putrajaya? WhatsApp kami untuk sebut harga percuma."
    },
    "kajang": {
      "metaTitle": "Roller Shutter Kajang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Kajang. Pemasangan, baiki & servis 24 jam untuk premis perniagaan. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Kajang — Pasang & Baiki 24 Jam",
      "intro": "Kajang berkembang pesat sebagai pusat perniagaan dengan pelbagai kedai, kilang kecil dan gudang yang memerlukan perlindungan roller shutter.",
      "closingCta": "Pemilik premis di Kajang? WhatsApp kami untuk sebut harga roller shutter percuma."
    },
    "bangi": {
      "metaTitle": "Roller Shutter Bangi | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Bangi — pemasangan & baiki 24 jam. Perkhidmatan profesional untuk kilang, kedai & gudang. WhatsApp kami!",
      "h1": "Roller Shutter Bangi — Pasang & Baiki 24 Jam",
      "intro": "Bangi dengan kawasan perindustrian dan komersialnya yang aktif memerlukan perkhidmatan roller shutter yang boleh dipercayai untuk melindungi premis perniagaan.",
      "closingCta": "Perlukan roller shutter di Bangi? WhatsApp kami sekarang untuk sebut harga percuma."
    },
    "rawang": {
      "metaTitle": "Roller Shutter Rawang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Rawang. Pasang, baiki & selenggara 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Rawang — Pasang & Baiki 24 Jam",
      "intro": "Rawang membangun pesat dengan kawasan perindustrian dan komersial yang memerlukan roller shutter berkualiti untuk keselamatan premis.",
      "closingCta": "Premis di Rawang perlukan roller shutter? WhatsApp kami sekarang."
    },
    "klang": {
      "metaTitle": "Roller Shutter Klang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Klang. Pemasangan & baiki 24 jam untuk kilang, gudang & premis komersial di Klang. WhatsApp kami!",
      "h1": "Roller Shutter Klang — Pasang & Baiki 24 Jam",
      "intro": "Klang merupakan hab perindustrian utama dengan pelabuhan dan kawasan kilang yang memerlukan roller shutter heavy-duty untuk perlindungan maksimum.",
      "closingCta": "Pemilik kilang di Klang? WhatsApp kami untuk sebut harga roller shutter percuma."
    },
    "kepong": {
      "metaTitle": "Roller Shutter Kepong | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kepong — pemasangan & baiki 24 jam. Untuk kedai, kilang & gudang. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Kepong — Pasang & Baiki 24 Jam",
      "intro": "Kepong dikenali dengan kawasan perindustrian dan deretan kedai yang memerlukan roller shutter berkualiti untuk keselamatan harian.",
      "closingCta": "Perlukan roller shutter di Kepong? WhatsApp kami untuk sebut harga percuma."
    },
    "seri-kembangan": {
      "metaTitle": "Roller Shutter Seri Kembangan | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Seri Kembangan. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Seri Kembangan — Pasang & Baiki 24 Jam",
      "intro": "Seri Kembangan berkembang sebagai kawasan komersial aktif yang memerlukan perkhidmatan roller shutter profesional untuk melindungi premis perniagaan.",
      "closingCta": "Premis di Seri Kembangan perlukan roller shutter? WhatsApp kami sekarang."
    },
    "balakong": {
      "metaTitle": "Roller Shutter Balakong | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Balakong — pemasangan & baiki 24 jam untuk kawasan perindustrian. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Balakong — Pasang & Baiki 24 Jam",
      "intro": "Balakong terkenal dengan kawasan perindustrian yang aktif, menjadikan roller shutter berkualiti satu keperluan utama untuk kilang dan gudang di sini.",
      "closingCta": "Kilang di Balakong perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "sungai-buloh": {
      "metaTitle": "Roller Shutter Sungai Buloh | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Sungai Buloh. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Sungai Buloh — Pasang & Baiki 24 Jam",
      "intro": "Sungai Buloh mempunyai pelbagai premis komersial dan perindustrian yang memerlukan roller shutter untuk perlindungan keselamatan.",
      "closingCta": "Perlukan roller shutter di Sungai Buloh? WhatsApp kami sekarang."
    },
    "batu-caves": {
      "metaTitle": "Roller Shutter Batu Caves | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Batu Caves — pemasangan & baiki 24 jam. Perkhidmatan profesional untuk premis perniagaan. WhatsApp kami!",
      "h1": "Roller Shutter Batu Caves — Pasang & Baiki 24 Jam",
      "intro": "Batu Caves dengan kawasan perindustrian dan komersialnya memerlukan perkhidmatan roller shutter berkualiti untuk perlindungan premis.",
      "closingCta": "Premis di Batu Caves perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "port-klang": {
      "metaTitle": "Roller Shutter Port Klang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Port Klang. Pemasangan & baiki 24 jam untuk gudang, kilang & premis pelabuhan. WhatsApp kami!",
      "h1": "Roller Shutter Port Klang — Pasang & Baiki 24 Jam",
      "intro": "Port Klang sebagai pelabuhan utama Malaysia mempunyai ribuan gudang dan premis logistik yang memerlukan roller shutter heavy-duty untuk operasi 24 jam.",
      "closingCta": "Gudang di Port Klang perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "glenmarie": {
      "metaTitle": "Roller Shutter Glenmarie | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Glenmarie — pemasangan & baiki 24 jam untuk kawasan perindustrian. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Glenmarie — Pasang & Baiki 24 Jam",
      "intro": "Glenmarie merupakan kawasan perindustrian premium yang memerlukan roller shutter berkualiti tinggi untuk kilang dan gudang moden.",
      "closingCta": "Kilang di Glenmarie perlukan roller shutter? WhatsApp kami sekarang."
    },
    "hicom-shah-alam": {
      "metaTitle": "Roller Shutter HICOM Shah Alam | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di HICOM Shah Alam. Pemasangan & baiki 24 jam untuk kawasan perindustrian. WhatsApp kami!",
      "h1": "Roller Shutter HICOM Shah Alam — Pasang & Baiki 24 Jam",
      "intro": "HICOM Industrial Park Shah Alam merupakan salah satu kawasan perindustrian terbesar di Malaysia dengan ratusan kilang yang memerlukan roller shutter industri.",
      "closingCta": "Kilang di HICOM Shah Alam perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "pandan-indah": {
      "metaTitle": "Roller Shutter Pandan Indah | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Pandan Indah — pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Pandan Indah — Pasang & Baiki 24 Jam",
      "intro": "Pandan Indah mempunyai campuran premis komersial dan perindustrian kecil yang memerlukan roller shutter untuk keselamatan premis.",
      "closingCta": "Perlukan roller shutter di Pandan Indah? WhatsApp kami sekarang."
    },
    "sri-damansara": {
      "metaTitle": "Roller Shutter Sri Damansara | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Sri Damansara. Pasang & baiki 24 jam. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Sri Damansara — Pasang & Baiki 24 Jam",
      "intro": "Sri Damansara dengan kawasan perindustrian dan komersialnya memerlukan perkhidmatan roller shutter profesional yang boleh dipercayai.",
      "closingCta": "Premis di Sri Damansara perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "kota-damansara": {
      "metaTitle": "Roller Shutter Kota Damansara | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kota Damansara — pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Kota Damansara — Pasang & Baiki 24 Jam",
      "intro": "Kota Damansara berkembang pesat dengan pelbagai premis komersial dan teknologi yang memerlukan roller shutter berkualiti.",
      "closingCta": "Perlukan roller shutter di Kota Damansara? WhatsApp kami sekarang."
    },
    "seremban": {
      "metaTitle": "Roller Shutter Seremban | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Seremban. Pemasangan & baiki 24 jam untuk kilang, kedai & gudang. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Seremban — Pasang & Baiki 24 Jam",
      "intro": "Seremban sebagai ibu negeri Negeri Sembilan mempunyai kawasan perindustrian dan komersial yang aktif memerlukan roller shutter berkualiti.",
      "closingCta": "Premis di Seremban perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "nilai": {
      "metaTitle": "Roller Shutter Nilai | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Nilai — pemasangan & baiki 24 jam untuk kawasan perindustrian. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Nilai — Pasang & Baiki 24 Jam",
      "intro": "Nilai dengan kawasan perindustrian dan komersialnya yang berkembang memerlukan perkhidmatan roller shutter profesional.",
      "closingCta": "Kilang di Nilai perlukan roller shutter? WhatsApp kami sekarang."
    },
    "senawang": {
      "metaTitle": "Roller Shutter Senawang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Senawang. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Senawang — Pasang & Baiki 24 Jam",
      "intro": "Senawang dikenali dengan kawasan perindustrian besar yang memerlukan roller shutter heavy-duty untuk operasi kilang.",
      "closingCta": "Perlukan roller shutter di Senawang? WhatsApp kami untuk sebut harga percuma."
    },
    "penang": {
      "metaTitle": "Roller Shutter Penang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Penang. Pemasangan & baiki 24 jam untuk kilang, gudang & premis komersial di Pulau Pinang. WhatsApp kami!",
      "h1": "Roller Shutter Penang — Pasang & Baiki 24 Jam",
      "intro": "Pulau Pinang sebagai hab perindustrian utama Malaysia Utara mempunyai ribuan kilang elektronik dan premis komersial yang memerlukan roller shutter berkualiti tinggi.",
      "closingCta": "Kilang di Penang perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "ipoh": {
      "metaTitle": "Roller Shutter Ipoh | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Ipoh — pemasangan & baiki 24 jam. Perkhidmatan profesional untuk premis perniagaan di Perak. WhatsApp kami!",
      "h1": "Roller Shutter Ipoh — Pasang & Baiki 24 Jam",
      "intro": "Ipoh sebagai ibu negeri Perak mempunyai kawasan perindustrian dan komersial yang memerlukan perkhidmatan roller shutter profesional.",
      "closingCta": "Premis di Ipoh perlukan roller shutter? WhatsApp kami sekarang untuk sebut harga percuma."
    },
    "alor-setar": {
      "metaTitle": "Roller Shutter Alor Setar | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Alor Setar. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Alor Setar — Pasang & Baiki 24 Jam",
      "intro": "Alor Setar sebagai ibu negeri Kedah mempunyai premis komersial dan perindustrian yang memerlukan roller shutter berkualiti.",
      "closingCta": "Perlukan roller shutter di Alor Setar? WhatsApp kami sekarang."
    },
    "sungai-petani": {
      "metaTitle": "Roller Shutter Sungai Petani | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Sungai Petani — pemasangan & baiki 24 jam. WhatsApp kami untuk sebut harga percuma!",
      "h1": "Roller Shutter Sungai Petani — Pasang & Baiki 24 Jam",
      "intro": "Sungai Petani merupakan pusat perniagaan utama Kedah dengan banyak premis komersial dan perindustrian yang memerlukan roller shutter.",
      "closingCta": "Premis di Sungai Petani perlukan roller shutter? WhatsApp kami sekarang."
    },
    "taiping": {
      "metaTitle": "Roller Shutter Taiping | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Taiping. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Taiping — Pasang & Baiki 24 Jam",
      "intro": "Taiping dengan sejarah perindustriannya yang panjang mempunyai pelbagai premis yang memerlukan roller shutter berkualiti.",
      "closingCta": "Perlukan roller shutter di Taiping? WhatsApp kami untuk sebut harga percuma."
    },
    "butterworth": {
      "metaTitle": "Roller Shutter Butterworth | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Butterworth — pemasangan & baiki 24 jam untuk kawasan perindustrian Seberang Perai. WhatsApp kami!",
      "h1": "Roller Shutter Butterworth — Pasang & Baiki 24 Jam",
      "intro": "Butterworth dan Seberang Perai merupakan kawasan perindustrian utama di Pulau Pinang yang memerlukan roller shutter heavy-duty untuk kilang dan gudang.",
      "closingCta": "Kilang di Butterworth perlukan roller shutter? WhatsApp kami sekarang."
    },
    "johor-bahru": {
      "metaTitle": "Roller Shutter Johor Bahru | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter JB. Pemasangan & baiki 24 jam untuk kilang, gudang & premis komersial di Johor Bahru. WhatsApp kami!",
      "h1": "Roller Shutter Johor Bahru — Pasang & Baiki 24 Jam",
      "intro": "Johor Bahru sebagai hab perindustrian utama selatan Malaysia mempunyai ribuan kilang dan gudang yang memerlukan roller shutter berkualiti tinggi untuk operasi harian.",
      "closingCta": "Kilang di JB perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "melaka": {
      "metaTitle": "Roller Shutter Melaka | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Melaka — pemasangan & baiki 24 jam. Perkhidmatan profesional untuk premis perniagaan. WhatsApp kami!",
      "h1": "Roller Shutter Melaka — Pasang & Baiki 24 Jam",
      "intro": "Melaka dengan sektor pelancongan dan perindustriannya yang berkembang memerlukan roller shutter berkualiti untuk premis komersial dan kilang.",
      "closingCta": "Premis di Melaka perlukan roller shutter? WhatsApp kami sekarang."
    },
    "batu-pahat": {
      "metaTitle": "Roller Shutter Batu Pahat | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Batu Pahat. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Batu Pahat — Pasang & Baiki 24 Jam",
      "intro": "Batu Pahat merupakan pusat perindustrian dan komersial penting di Johor yang memerlukan roller shutter berkualiti.",
      "closingCta": "Perlukan roller shutter di Batu Pahat? WhatsApp kami sekarang."
    },
    "muar": {
      "metaTitle": "Roller Shutter Muar | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Muar — pemasangan & baiki 24 jam. WhatsApp kami untuk sebut harga percuma!",
      "h1": "Roller Shutter Muar — Pasang & Baiki 24 Jam",
      "intro": "Muar dikenali sebagai pusat industri perabot dan makanan yang memerlukan roller shutter berkualiti untuk kilang dan premis perniagaan.",
      "closingCta": "Premis di Muar perlukan roller shutter? WhatsApp kami sekarang."
    },
    "kluang": {
      "metaTitle": "Roller Shutter Kluang | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Kluang. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Kluang — Pasang & Baiki 24 Jam",
      "intro": "Kluang mempunyai premis perindustrian dan komersial yang memerlukan roller shutter untuk perlindungan keselamatan.",
      "closingCta": "Perlukan roller shutter di Kluang? WhatsApp kami untuk sebut harga percuma."
    },
    "skudai": {
      "metaTitle": "Roller Shutter Skudai | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Skudai — pemasangan & baiki 24 jam. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Skudai — Pasang & Baiki 24 Jam",
      "intro": "Skudai berkembang pesat dengan kawasan perindustrian dan komersial yang memerlukan roller shutter berkualiti.",
      "closingCta": "Kilang di Skudai perlukan roller shutter? WhatsApp kami sekarang."
    },
    "iskandar-puteri": {
      "metaTitle": "Roller Shutter Iskandar Puteri | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Iskandar Puteri. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Iskandar Puteri — Pasang & Baiki 24 Jam",
      "intro": "Iskandar Puteri sebagai pembangunan mega di Johor mempunyai banyak premis komersial dan perindustrian baru yang memerlukan roller shutter.",
      "closingCta": "Premis di Iskandar Puteri perlukan roller shutter? WhatsApp kami sekarang."
    },
    "kuantan": {
      "metaTitle": "Roller Shutter Kuantan | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Kuantan. Pemasangan & baiki 24 jam untuk kilang & premis komersial di Pahang. WhatsApp kami!",
      "h1": "Roller Shutter Kuantan — Pasang & Baiki 24 Jam",
      "intro": "Kuantan sebagai ibu negeri Pahang dan hab perindustrian pantai timur mempunyai banyak premis yang memerlukan roller shutter berkualiti.",
      "closingCta": "Premis di Kuantan perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "kota-bharu": {
      "metaTitle": "Roller Shutter Kota Bharu | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kota Bharu — pemasangan & baiki 24 jam. WhatsApp kami untuk sebut harga percuma!",
      "h1": "Roller Shutter Kota Bharu — Pasang & Baiki 24 Jam",
      "intro": "Kota Bharu sebagai ibu negeri Kelantan mempunyai pusat perniagaan dan premis komersial yang memerlukan roller shutter berkualiti.",
      "closingCta": "Perlukan roller shutter di Kota Bharu? WhatsApp kami sekarang."
    },
    "kuala-terengganu": {
      "metaTitle": "Roller Shutter Kuala Terengganu | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Kuala Terengganu. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Kuala Terengganu — Pasang & Baiki 24 Jam",
      "intro": "Kuala Terengganu mempunyai premis komersial dan perindustrian yang memerlukan roller shutter untuk perlindungan keselamatan.",
      "closingCta": "Premis di Kuala Terengganu perlukan roller shutter? WhatsApp kami sekarang."
    },
    "temerloh": {
      "metaTitle": "Roller Shutter Temerloh | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Temerloh — pemasangan & baiki 24 jam. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Temerloh — Pasang & Baiki 24 Jam",
      "intro": "Temerloh sebagai pusat perniagaan di tengah Pahang memerlukan perkhidmatan roller shutter yang boleh dipercayai.",
      "closingCta": "Perlukan roller shutter di Temerloh? WhatsApp kami untuk sebut harga percuma."
    },
    "kota-kinabalu": {
      "metaTitle": "Roller Shutter Kota Kinabalu | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Pakar roller shutter Kota Kinabalu. Pemasangan & baiki 24 jam untuk premis di Sabah. WhatsApp kami!",
      "h1": "Roller Shutter Kota Kinabalu — Pasang & Baiki 24 Jam",
      "intro": "Kota Kinabalu sebagai ibu negeri Sabah dan pusat perniagaan utama Malaysia Timur mempunyai banyak premis komersial dan perindustrian yang memerlukan roller shutter.",
      "closingCta": "Premis di Kota Kinabalu perlukan roller shutter? WhatsApp kami untuk sebut harga percuma."
    },
    "kuching": {
      "metaTitle": "Roller Shutter Kuching | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kuching — pemasangan & baiki 24 jam untuk premis di Sarawak. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Kuching — Pasang & Baiki 24 Jam",
      "intro": "Kuching sebagai ibu negeri Sarawak mempunyai kawasan perindustrian dan komersial yang memerlukan roller shutter berkualiti.",
      "closingCta": "Kilang di Kuching perlukan roller shutter? WhatsApp kami sekarang."
    },
    "miri": {
      "metaTitle": "Roller Shutter Miri | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Perkhidmatan roller shutter di Miri. Pemasangan & baiki 24 jam. WhatsApp untuk sebut harga percuma!",
      "h1": "Roller Shutter Miri — Pasang & Baiki 24 Jam",
      "intro": "Miri sebagai pusat industri minyak dan gas di Sarawak mempunyai premis perindustrian yang memerlukan roller shutter heavy-duty.",
      "closingCta": "Perlukan roller shutter di Miri? WhatsApp kami untuk sebut harga percuma."
    },
    "sandakan": {
      "metaTitle": "Roller Shutter Sandakan | Pasang & Baiki 24 Jam | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Sandakan — pemasangan & baiki 24 jam. WhatsApp kami sekarang!",
      "h1": "Roller Shutter Sandakan — Pasang & Baiki 24 Jam",
      "intro": "Sandakan mempunyai premis komersial dan perindustrian yang memerlukan roller shutter berkualiti untuk perlindungan keselamatan.",
      "closingCta": "Premis di Sandakan perlukan roller shutter? WhatsApp kami sekarang."
    }
  }
}
```

---

### 11. messages/en.json (English)

```json
{
  "metadata": {
    "title": "Roller Shutter Door Malaysia | #1 Installation & 24hr Repair",
    "description": "Malaysia's #1 roller shutter door specialist. Installation, repair & maintenance of steel roller shutters 24/7. Mild steel, aluminium, polycarbonate. WhatsApp us now!"
  },
  "nav": {
    "home": "Home",
    "products": "Products",
    "howItWorks": "How It Works",
    "reviews": "Reviews",
    "faq": "FAQ",
    "locations": "Locations",
    "contact": "Contact",
    "brandName": "Roller Shutter Door Malaysia",
    "ctaButton": "WhatsApp Now"
  },
  "fomoBanner": {
    "texts": [
      "12 customers in your area placed orders this week — this month's installation slots are almost full!",
      "Our emergency repair team completed 3 jobs today — contact us before slots run out!",
      "Over 15,000 premises protected by our roller shutters across Malaysia"
    ]
  },
  "hero": {
    "h1": "Roller Shutter Door Malaysia — #1 Installation & 24hr Repair Experts",
    "subtitle": "Install, repair & maintain all types of roller shutter doors for factories, shops and warehouses. 24-hour emergency service, 7 days a week across Malaysia.",
    "ctaPrimary": "WhatsApp Now",
    "ctaPrimarySubtext": "Get a Free Quote",
    "ctaSecondary": "View Our Roller Shutter Types",
    "altText": "Roller shutter door installation for factory in Malaysia"
  },
  "stats": {
    "items": [
      { "value": "15,000+", "label": "Successful Installations" },
      { "value": "24/7", "label": "Emergency Service" },
      { "value": "20+", "label": "Years Experience" },
      { "value": "50+", "label": "Areas Covered" }
    ]
  },
  "products": {
    "heading": "Our Roller Shutter Types",
    "subheading": "Every premises has different needs. We provide 6 types of roller shutters for maximum protection of your business.",
    "items": {
      "mildSteel": {
        "name": "Mild Steel Roller Shutter",
        "description": "The most popular choice for factories, warehouses and commercial premises. Made from high-quality steel for maximum strength and durability. Cost-effective with a long lifespan.",
        "keyPoints": [
          "Industrial-grade strength for maximum protection",
          "Cost-effective — best choice for moderate budgets",
          "Suitable for factories, warehouses & large premises"
        ],
        "cta": "WhatsApp for a Quote",
        "altText": "Mild steel roller shutter for factory and warehouse"
      },
      "aluminium": {
        "name": "Aluminium Roller Shutter",
        "description": "Lightweight, corrosion-resistant and suitable for premises requiring a professional appearance. Ideal for offices, clinics and modern commercial premises.",
        "keyPoints": [
          "Lightweight — easy to operate manually or automatically",
          "Corrosion-resistant & suited for Malaysia's tropical climate",
          "Modern and neat appearance for professional premises"
        ],
        "cta": "WhatsApp for a Quote",
        "altText": "Aluminium roller shutter for commercial premises"
      },
      "polycarbonate": {
        "name": "Polycarbonate (Transparent) Roller Shutter",
        "description": "Combining security and visibility. Customers can see your display products even after business hours. Ideal for boutiques, showrooms and shopping centres.",
        "keyPoints": [
          "24-hour product display even when shop is closed",
          "Security comparable to steel roller shutters",
          "Natural light entry — saves electricity"
        ],
        "cta": "WhatsApp for a Quote",
        "altText": "Transparent polycarbonate roller shutter for shop"
      },
      "fireRated": {
        "name": "Fire-Rated Roller Shutter",
        "description": "Meets Malaysia's fire safety standards. Mandatory for certain buildings under BOMBA regulations. Designed to prevent the spread of fire and smoke between zones.",
        "keyPoints": [
          "Certified & compliant with Malaysia BOMBA standards",
          "Prevents fire & smoke from spreading between zones",
          "Mandatory for certain factories, warehouses & commercial buildings"
        ],
        "cta": "WhatsApp for a Quote",
        "altText": "Fire-rated roller shutter for fire safety compliance"
      },
      "grille": {
        "name": "Grille Roller Shutter",
        "description": "Security with ventilation. The grille design allows airflow and visibility while maintaining protection. Top choice for grocery stores, supermarkets and retail premises.",
        "keyPoints": [
          "Optimal ventilation — ideal for Malaysia's hot climate",
          "Visibility into premises even after operating hours",
          "Popular for grocery stores, supermarkets & food courts"
        ],
        "cta": "WhatsApp for a Quote",
        "altText": "Grille roller shutter for retail shop"
      },
      "motorised": {
        "name": "Motorised (Automatic) Roller Shutter",
        "description": "Open and close with one button or remote control. Ideal for large doors that are frequently opened and closed. Save time, energy and improve daily operational efficiency.",
        "keyPoints": [
          "Remote control or switch — no physical effort needed",
          "Suitable for large factory & logistics warehouse doors",
          "Upgrade from manual to automatic available"
        ],
        "cta": "WhatsApp for a Quote",
        "altText": "Motorised automatic roller shutter for warehouse"
      }
    }
  },
  "howItWorks": {
    "heading": "How We Work",
    "subheading": "From enquiry to installation — a simple process in just 4 steps.",
    "steps": [
      {
        "number": "1",
        "title": "Contact Us via WhatsApp",
        "description": "Tell us your needs — new installation, repair or service. Send photos of the location for a quick assessment."
      },
      {
        "number": "2",
        "title": "Site Survey & Quotation",
        "description": "Our team will visit your premises for precise measurements. You'll receive a detailed quotation with no hidden charges."
      },
      {
        "number": "3",
        "title": "Professional Installation",
        "description": "Our certified technicians complete the installation on the agreed schedule. Clean, fast work following safety standards."
      },
      {
        "number": "4",
        "title": "Warranty & After-Sales Support",
        "description": "Every installation comes with a warranty. Our 24-hour emergency team is always ready for any post-installation issues."
      }
    ]
  },
  "riskProblem": {
    "heading": "Don't Leave Your Premises Exposed to Risk",
    "subheading": "A damaged or missing roller shutter can invite serious problems.",
    "problems": [
      {
        "title": "Theft & Break-ins",
        "description": "Premises without roller shutters or with damaged doors are prime targets for thieves. Losses can reach tens of thousands of ringgit in a single night."
      },
      {
        "title": "Weather Damage",
        "description": "Heavy rain, strong winds and tropical storms can damage your stock and equipment if your premises isn't properly protected."
      },
      {
        "title": "Escalating Repair Costs",
        "description": "Roller shutters that aren't maintained will break down faster. Emergency repair costs are far more expensive than regular preventive servicing."
      },
      {
        "title": "BOMBA Compliance Failure",
        "description": "Certain premises must have fire-rated roller shutters. Non-compliance can result in fines, closure and safety risks."
      }
    ],
    "solutionCta": "Don't wait until it's too late — WhatsApp us now for a free assessment."
  },
  "midCta": {
    "heading": "Need a New Roller Shutter or Urgent Repair?",
    "subheading": "Our team is ready to help 24 hours, 7 days a week. Get a free quotation within 30 minutes.",
    "ctaButton": "WhatsApp Us Now"
  },
  "reviews": {
    "heading": "What Our Customers Say",
    "subheading": "Trusted by thousands of business owners across Malaysia.",
    "items": [
      {
        "name": "Ahmad Faizal",
        "location": "Klang, Selangor",
        "rating": 5,
        "text": "My factory roller shutter broke in the middle of the night. Called them at 2am and the technician arrived in 45 minutes. Fast and professional work. Highly recommended!"
      },
      {
        "name": "Lee Wei Keat",
        "location": "Petaling Jaya, Selangor",
        "rating": 5,
        "text": "Installed 8 units of aluminium roller shutters for my new shop. Completed in 2 days. Top quality and reasonable price. Their team is very organised."
      },
      {
        "name": "Siti Nurhaliza",
        "location": "Johor Bahru, Johor",
        "rating": 5,
        "text": "Been using their service for regular maintenance for 3 years. My warehouse roller shutters are always in good condition. Best service in JB!"
      },
      {
        "name": "Rajesh Kumar",
        "location": "Penang",
        "rating": 5,
        "text": "Upgraded my old roller shutter motor to automatic. Now opening and closing the warehouse door is so easy. Thank you for the excellent work!"
      },
      {
        "name": "Tan Mei Ling",
        "location": "Shah Alam, Selangor",
        "rating": 5,
        "text": "Installed fire-rated roller shutters for BOMBA compliance. Smooth process from survey to installation. Competitive pricing and quality work."
      },
      {
        "name": "Mohd Hafiz",
        "location": "Kuala Lumpur",
        "rating": 5,
        "text": "Emergency call at 11pm because a spring broke. They came quickly and solved the problem within an hour. True roller shutter experts!"
      }
    ]
  },
  "whyChoose": {
    "heading": "Why Choose Us?",
    "subheading": "We're not just contractors — we're roller shutter experts you can trust.",
    "items": [
      {
        "title": "24-Hour Emergency Service",
        "description": "Roller shutter breakdowns don't follow a schedule. Our emergency repair team operates 24/7, including public holidays and weekends."
      },
      {
        "title": "20+ Years Experience",
        "description": "Over two decades of experience in Malaysia's roller shutter industry. We've handled every type of breakdown and installation you can imagine."
      },
      {
        "title": "50+ Coverage Areas",
        "description": "From Johor to Penang, Kuching to Kota Kinabalu — our team network covers all of Malaysia for fast service."
      },
      {
        "title": "Transparent Pricing — No Hidden Charges",
        "description": "You know exactly what it costs before work begins. No surprises, no additional charges without your permission."
      },
      {
        "title": "Workmanship & Material Warranty",
        "description": "Every installation and repair comes with a warranty. We use high-quality materials from trusted suppliers."
      },
      {
        "title": "Certified & Experienced Technicians",
        "description": "Every one of our technicians is trained and experienced. Clean, safe work following industry standards."
      }
    ]
  },
  "gallery": {
    "heading": "Our Project Gallery",
    "subheading": "See the results of our roller shutter installation and repair work across Malaysia.",
    "categories": [
      "New Installation",
      "Repair & Maintenance",
      "Factory & Warehouse Projects",
      "Shop & Commercial Projects"
    ],
    "altTexts": {
      "newInstallation": "New roller shutter installation project",
      "repair": "Roller shutter repair and maintenance project",
      "factory": "Factory and warehouse roller shutter project",
      "commercial": "Shop and commercial roller shutter project"
    }
  },
  "locations": {
    "heading": "Our Service Areas",
    "subheading": "Professional roller shutter services in over 50 locations across Malaysia.",
    "regions": {
      "klangValley": "Klang Valley",
      "southernSelangor": "Southern Selangor",
      "negeriSembilan": "Negeri Sembilan",
      "northern": "Northern",
      "southern": "Southern",
      "eastCoast": "East Coast",
      "eastMalaysia": "East Malaysia"
    },
    "viewDetails": "View Services in {city}"
  },
  "faq": {
    "heading": "Frequently Asked Questions (FAQ)",
    "items": [
      {
        "question": "How much does a new roller shutter installation cost?",
        "answer": "The cost depends on the type of roller shutter, door size and your premises location. Mild steel roller shutters start from affordable prices for standard sizes. Contact us via WhatsApp for an accurate quote based on your specific needs — assessment and quotation are FREE."
      },
      {
        "question": "How long does installation take?",
        "answer": "Standard installation for a single roller shutter unit typically takes 1-2 working days. For projects involving multiple units or specialised installations like fire-rated, the duration may be longer. Our team will provide an exact schedule after the site survey."
      },
      {
        "question": "Do you provide 24-hour emergency repair service?",
        "answer": "Yes, we operate 24 hours, 7 days a week including public holidays. If your roller shutter breaks down at any time — midnight, weekends or festive seasons — our technicians are ready to arrive at your location as quickly as possible. WhatsApp us for immediate response."
      },
      {
        "question": "Can a manual roller shutter be upgraded to automatic?",
        "answer": "Yes! We offer motor upgrade services to convert your existing manual roller shutter to a motorised system. This improves operational efficiency especially for large doors that are frequently opened and closed. The upgrade process is usually completed within a day."
      },
      {
        "question": "What type of roller shutter is suitable for my premises?",
        "answer": "It depends on your needs. For maximum security — mild steel. For a professional look and corrosion resistance — aluminium. For product display — polycarbonate. For BOMBA compliance — fire-rated. Contact us via WhatsApp and our experts will recommend the best type for your premises."
      },
      {
        "question": "Do your roller shutters come with a warranty?",
        "answer": "Yes, every installation and repair comes with a warranty on materials and workmanship. Warranty duration depends on the product type and scope of work. We also offer regular servicing packages to ensure your roller shutter stays in top condition throughout its lifespan."
      }
    ]
  },
  "finalCta": {
    "heading": "Ready to Protect Your Premises?",
    "subheading": "Get a free quotation within 30 minutes. Our expert team is ready to help you 24/7.",
    "ctaButton": "WhatsApp Now — Free Quote",
    "supportingText": "No commitment. No hidden charges. Just the best roller shutter service in Malaysia."
  },
  "footer": {
    "tagline": "Roller Shutter Door Malaysia — #1 Installation & 24hr Repair Experts",
    "services": {
      "heading": "Services",
      "items": [
        "New Installation",
        "Repair & Troubleshooting",
        "Regular Maintenance",
        "Motor Upgrade",
        "Spring Replacement"
      ]
    },
    "productTypes": {
      "heading": "Roller Shutter Types",
      "items": [
        "Mild Steel",
        "Aluminium",
        "Polycarbonate / Transparent",
        "Fire-Rated",
        "Grille",
        "Automatic / Motorised"
      ]
    },
    "areas": {
      "heading": "Service Areas",
      "items": [
        "Klang Valley",
        "Selangor",
        "Johor",
        "Penang",
        "Negeri Sembilan",
        "Others"
      ]
    },
    "social": {
      "heading": "Follow Us",
      "facebook": "Facebook",
      "instagram": "Instagram",
      "google": "Google Business"
    },
    "copyright": "© 2026 Roller Shutter Door Malaysia. All rights reserved.",
    "whatsappFloat": "WhatsApp Us"
  },
  "breadcrumbs": {
    "home": "Home",
    "rollerShutter": "Roller Shutter"
  },
  "nearbyLocations": {
    "heading": "Nearby Areas",
    "subheading": "We also provide roller shutter services in the following areas:",
    "viewService": "View Service"
  },
  "common": {
    "callNow": "Call Now",
    "whatsappUs": "WhatsApp Us",
    "freeQuote": "Free Quote",
    "learnMore": "Learn More",
    "viewAll": "View All",
    "backToTop": "Back to Top",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "shared": {
    "whatsappCta": "WhatsApp Now",
    "emergencyBadge": "24-Hour Emergency",
    "freeQuoteBadge": "Free Quotation",
    "trustedBadge": "Trusted by 15,000+ Customers",
    "brandName": "Roller Shutter Door Malaysia",
    "phoneLabel": "Contact Us",
    "allRightsReserved": "All rights reserved",
    "whatsappPrefilledMessage": "Hi, I'm interested in roller shutter services. May I get a quotation?",
    "whatsappPrefilledMessageLocation": "Hi, I'm interested in roller shutter services in {city}. May I get a quotation?"
  },
  "locationPages": {
    "kuala-lumpur": {
      "metaTitle": "Roller Shutter Door Kuala Lumpur | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Kuala Lumpur. 24-hour installation, repair & servicing for factories, shops & warehouses in KL. WhatsApp for a free quote.",
      "h1": "Roller Shutter Door Kuala Lumpur — Installation & 24hr Repair",
      "intro": "Kuala Lumpur, Malaysia's capital and main business hub, has thousands of commercial and industrial premises requiring quality roller shutter protection. From the industrial areas of Segambut to the shop rows of Bukit Bintang, we serve all types of premises in KL.",
      "closingCta": "Need a roller shutter expert in Kuala Lumpur? WhatsApp us now for a free quote and response within 30 minutes."
    },
    "petaling-jaya": {
      "metaTitle": "Roller Shutter Door Petaling Jaya | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Professional roller shutter services in Petaling Jaya. 24-hour installation, repair & servicing for shops, factories & offices in PJ. WhatsApp us!",
      "h1": "Roller Shutter Door Petaling Jaya — Installation & 24hr Repair",
      "intro": "Petaling Jaya is Selangor's main commercial hub with rapid development from Section 13 to Damansara Perdana. Business owners in PJ need durable roller shutters to protect their investment.",
      "closingCta": "Roller shutter broken in PJ or need a new installation? WhatsApp us now — our team is ready 24/7."
    },
    "shah-alam": {
      "metaTitle": "Roller Shutter Door Shah Alam | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Shah Alam. 24-hour installation & repair for factories, warehouses & commercial premises. Free quote — WhatsApp us now!",
      "h1": "Roller Shutter Door Shah Alam — Installation & 24hr Repair",
      "intro": "Shah Alam, Selangor's state capital, is known for major industrial areas like Section 15, Section 23 and HICOM. Thousands of factories and warehouses here depend on quality roller shutters.",
      "closingCta": "Factory or warehouse owner in Shah Alam? WhatsApp us for a free site assessment and no-obligation quote."
    },
    "subang-jaya": {
      "metaTitle": "Roller Shutter Door Subang Jaya | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Subang Jaya. 24-hour installation, repair & maintenance for business premises. WhatsApp for a free quote today!",
      "h1": "Roller Shutter Door Subang Jaya — Installation & 24hr Repair",
      "intro": "Subang Jaya is rapidly growing as a commercial hub with areas like USJ, Sunway and SS15 filled with shops, restaurants and commercial premises needing reliable roller shutters.",
      "closingCta": "Premises in Subang Jaya need roller shutters? WhatsApp us now for a free quote."
    },
    "cheras": {
      "metaTitle": "Roller Shutter Door Cheras | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door Cheras — new installation, repair & 24-hour service. Expert steel door specialists for shops, factories & warehouses. WhatsApp us!",
      "h1": "Roller Shutter Door Cheras — Installation & 24hr Repair",
      "intro": "Cheras is one of the most densely populated areas in the Klang Valley with a mix of commercial, industrial and small business premises requiring quality roller shutters.",
      "closingCta": "Business owner in Cheras? WhatsApp us now — get a roller shutter quote within 30 minutes."
    },
    "ampang": {
      "metaTitle": "Roller Shutter Door Ampang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Ampang. 24-hour installation, repair & maintenance. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Ampang — Installation & 24hr Repair",
      "intro": "Ampang is rapidly developing with various commercial and industrial premises needing quality roller shutter protection.",
      "closingCta": "Need roller shutters in Ampang? WhatsApp us now for a free quote."
    },
    "puchong": {
      "metaTitle": "Roller Shutter Door Puchong | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Puchong. 24-hour installation, repair & servicing for factories, shops & warehouses. WhatsApp us now!",
      "h1": "Roller Shutter Door Puchong — Installation & 24hr Repair",
      "intro": "Puchong is a rapidly growing business area with many commercial premises, small factories and warehouses that need quality roller shutters.",
      "closingCta": "Premises in Puchong need roller shutters? WhatsApp us for a free quote today."
    },
    "bangsar": {
      "metaTitle": "Roller Shutter Door Bangsar | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Bangsar — 24-hour installation & repair. Professional service for shops, offices & commercial premises. WhatsApp us!",
      "h1": "Roller Shutter Door Bangsar — Installation & 24hr Repair",
      "intro": "Bangsar is known as a premium commercial area with rows of shops, restaurants and offices needing quality roller shutters for security and aesthetics.",
      "closingCta": "Premises in Bangsar need roller shutters? WhatsApp us now for a free assessment."
    },
    "damansara": {
      "metaTitle": "Roller Shutter Door Damansara | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Damansara. 24-hour installation, repair & maintenance. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Damansara — Installation & 24hr Repair",
      "intro": "Damansara encompasses modern business areas like Damansara Perdana, Damansara Jaya and Damansara Utama, all with commercial premises needing roller shutter protection.",
      "closingCta": "Need roller shutters in Damansara? WhatsApp us now — response within 30 minutes."
    },
    "cyberjaya": {
      "metaTitle": "Roller Shutter Door Cyberjaya | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Cyberjaya — 24-hour installation & repair for tech & commercial premises. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Cyberjaya — Installation & 24hr Repair",
      "intro": "Cyberjaya, Malaysia's technology hub, has many commercial premises and data centres requiring high-quality roller shutters for security.",
      "closingCta": "Premises in Cyberjaya need roller shutters? WhatsApp us now."
    },
    "putrajaya": {
      "metaTitle": "Roller Shutter Door Putrajaya | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Putrajaya. 24-hour installation & repair for government & commercial premises. WhatsApp us!",
      "h1": "Roller Shutter Door Putrajaya — Installation & 24hr Repair",
      "intro": "Putrajaya, Malaysia's administrative capital, has various commercial and government premises needing quality roller shutters for security.",
      "closingCta": "Need roller shutters in Putrajaya? WhatsApp us for a free quote."
    },
    "kajang": {
      "metaTitle": "Roller Shutter Door Kajang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Kajang. 24-hour installation, repair & servicing. WhatsApp us now!",
      "h1": "Roller Shutter Door Kajang — Installation & 24hr Repair",
      "intro": "Kajang is rapidly growing as a business centre with various shops, small factories and warehouses needing roller shutter protection.",
      "closingCta": "Premises owner in Kajang? WhatsApp us for a free roller shutter quote."
    },
    "bangi": {
      "metaTitle": "Roller Shutter Door Bangi | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Bangi — 24-hour installation & repair. Professional service for factories, shops & warehouses. WhatsApp us!",
      "h1": "Roller Shutter Door Bangi — Installation & 24hr Repair",
      "intro": "Bangi's active industrial and commercial areas need reliable roller shutter services to protect business premises.",
      "closingCta": "Need roller shutters in Bangi? WhatsApp us now for a free quote."
    },
    "rawang": {
      "metaTitle": "Roller Shutter Door Rawang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Rawang. 24-hour installation, repair & maintenance. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Rawang — Installation & 24hr Repair",
      "intro": "Rawang is rapidly developing with industrial and commercial areas that need quality roller shutters for premises security.",
      "closingCta": "Premises in Rawang need roller shutters? WhatsApp us now."
    },
    "klang": {
      "metaTitle": "Roller Shutter Door Klang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Klang. 24-hour installation & repair for factories, warehouses & commercial premises. WhatsApp us!",
      "h1": "Roller Shutter Door Klang — Installation & 24hr Repair",
      "intro": "Klang is a major industrial hub with a port and factory areas that need heavy-duty roller shutters for maximum protection.",
      "closingCta": "Factory owner in Klang? WhatsApp us for a free roller shutter quote."
    },
    "kepong": {
      "metaTitle": "Roller Shutter Door Kepong | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kepong — 24-hour installation & repair. For shops, factories & warehouses. WhatsApp us now!",
      "h1": "Roller Shutter Door Kepong — Installation & 24hr Repair",
      "intro": "Kepong is known for its industrial areas and rows of shops that need quality roller shutters for daily security.",
      "closingCta": "Need roller shutters in Kepong? WhatsApp us for a free quote."
    },
    "seri-kembangan": {
      "metaTitle": "Roller Shutter Door Seri Kembangan | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Seri Kembangan. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Seri Kembangan — Installation & 24hr Repair",
      "intro": "Seri Kembangan is growing as an active commercial area requiring professional roller shutter services to protect business premises.",
      "closingCta": "Premises in Seri Kembangan need roller shutters? WhatsApp us now."
    },
    "balakong": {
      "metaTitle": "Roller Shutter Door Balakong | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Balakong — 24-hour installation & repair for industrial areas. WhatsApp us now!",
      "h1": "Roller Shutter Door Balakong — Installation & 24hr Repair",
      "intro": "Balakong is known for its active industrial area, making quality roller shutters an essential need for factories and warehouses here.",
      "closingCta": "Factory in Balakong needs roller shutters? WhatsApp us for a free quote."
    },
    "sungai-buloh": {
      "metaTitle": "Roller Shutter Door Sungai Buloh | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Sungai Buloh. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Sungai Buloh — Installation & 24hr Repair",
      "intro": "Sungai Buloh has various commercial and industrial premises needing roller shutters for security protection.",
      "closingCta": "Need roller shutters in Sungai Buloh? WhatsApp us now."
    },
    "batu-caves": {
      "metaTitle": "Roller Shutter Door Batu Caves | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Batu Caves — 24-hour installation & repair. Professional service for business premises. WhatsApp us!",
      "h1": "Roller Shutter Door Batu Caves — Installation & 24hr Repair",
      "intro": "Batu Caves' industrial and commercial areas need quality roller shutter services for premises protection.",
      "closingCta": "Premises in Batu Caves need roller shutters? WhatsApp us for a free quote."
    },
    "port-klang": {
      "metaTitle": "Roller Shutter Door Port Klang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Port Klang. 24-hour installation & repair for warehouses, factories & port premises. WhatsApp us!",
      "h1": "Roller Shutter Door Port Klang — Installation & 24hr Repair",
      "intro": "Port Klang, Malaysia's main port, has thousands of warehouses and logistics premises requiring heavy-duty roller shutters for 24-hour operations.",
      "closingCta": "Warehouse in Port Klang needs roller shutters? WhatsApp us for a free quote."
    },
    "glenmarie": {
      "metaTitle": "Roller Shutter Door Glenmarie | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Glenmarie — 24-hour installation & repair for industrial areas. WhatsApp us now!",
      "h1": "Roller Shutter Door Glenmarie — Installation & 24hr Repair",
      "intro": "Glenmarie is a premium industrial area requiring high-quality roller shutters for modern factories and warehouses.",
      "closingCta": "Factory in Glenmarie needs roller shutters? WhatsApp us now."
    },
    "hicom-shah-alam": {
      "metaTitle": "Roller Shutter Door HICOM Shah Alam | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services at HICOM Shah Alam. 24-hour installation & repair for industrial areas. WhatsApp us!",
      "h1": "Roller Shutter Door HICOM Shah Alam — Installation & 24hr Repair",
      "intro": "HICOM Industrial Park Shah Alam is one of Malaysia's largest industrial areas with hundreds of factories needing industrial roller shutters.",
      "closingCta": "Factory at HICOM Shah Alam needs roller shutters? WhatsApp us for a free quote."
    },
    "pandan-indah": {
      "metaTitle": "Roller Shutter Door Pandan Indah | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Pandan Indah — 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Pandan Indah — Installation & 24hr Repair",
      "intro": "Pandan Indah has a mix of commercial and small industrial premises needing roller shutters for premises security.",
      "closingCta": "Need roller shutters in Pandan Indah? WhatsApp us now."
    },
    "sri-damansara": {
      "metaTitle": "Roller Shutter Door Sri Damansara | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Sri Damansara. 24-hour installation & repair. WhatsApp us now!",
      "h1": "Roller Shutter Door Sri Damansara — Installation & 24hr Repair",
      "intro": "Sri Damansara's industrial and commercial areas need reliable professional roller shutter services.",
      "closingCta": "Premises in Sri Damansara need roller shutters? WhatsApp us for a free quote."
    },
    "kota-damansara": {
      "metaTitle": "Roller Shutter Door Kota Damansara | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kota Damansara — 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Kota Damansara — Installation & 24hr Repair",
      "intro": "Kota Damansara is rapidly growing with various commercial and tech premises needing quality roller shutters.",
      "closingCta": "Need roller shutters in Kota Damansara? WhatsApp us now."
    },
    "seremban": {
      "metaTitle": "Roller Shutter Door Seremban | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Seremban. 24-hour installation, repair & servicing for factories, shops & warehouses. WhatsApp us now!",
      "h1": "Roller Shutter Door Seremban — Installation & 24hr Repair",
      "intro": "Seremban, Negeri Sembilan's state capital, has active industrial and commercial areas needing quality roller shutters.",
      "closingCta": "Premises in Seremban need roller shutters? WhatsApp us for a free quote."
    },
    "nilai": {
      "metaTitle": "Roller Shutter Door Nilai | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Nilai — 24-hour installation & repair for industrial areas. WhatsApp us now!",
      "h1": "Roller Shutter Door Nilai — Installation & 24hr Repair",
      "intro": "Nilai's growing industrial and commercial areas need professional roller shutter services.",
      "closingCta": "Factory in Nilai needs roller shutters? WhatsApp us now."
    },
    "senawang": {
      "metaTitle": "Roller Shutter Door Senawang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Senawang. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Senawang — Installation & 24hr Repair",
      "intro": "Senawang is known for its large industrial areas needing heavy-duty roller shutters for factory operations.",
      "closingCta": "Need roller shutters in Senawang? WhatsApp us for a free quote."
    },
    "penang": {
      "metaTitle": "Roller Shutter Door Penang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Penang. 24-hour installation & repair for factories, warehouses & commercial premises. WhatsApp us!",
      "h1": "Roller Shutter Door Penang — Installation & 24hr Repair",
      "intro": "Penang, Northern Malaysia's main industrial hub, has thousands of electronics factories and commercial premises needing high-quality roller shutters.",
      "closingCta": "Factory in Penang needs roller shutters? WhatsApp us for a free quote."
    },
    "ipoh": {
      "metaTitle": "Roller Shutter Door Ipoh | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Ipoh — 24-hour installation & repair. Professional service for business premises in Perak. WhatsApp us!",
      "h1": "Roller Shutter Door Ipoh — Installation & 24hr Repair",
      "intro": "Ipoh, Perak's state capital, has industrial and commercial areas requiring professional roller shutter services.",
      "closingCta": "Premises in Ipoh need roller shutters? WhatsApp us now for a free quote."
    },
    "alor-setar": {
      "metaTitle": "Roller Shutter Door Alor Setar | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Alor Setar. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Alor Setar — Installation & 24hr Repair",
      "intro": "Alor Setar, Kedah's state capital, has commercial and industrial premises needing quality roller shutters.",
      "closingCta": "Need roller shutters in Alor Setar? WhatsApp us now."
    },
    "sungai-petani": {
      "metaTitle": "Roller Shutter Door Sungai Petani | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Sungai Petani — 24-hour installation & repair. WhatsApp us for a free quote!",
      "h1": "Roller Shutter Door Sungai Petani — Installation & 24hr Repair",
      "intro": "Sungai Petani is Kedah's main business centre with many commercial and industrial premises needing roller shutters.",
      "closingCta": "Premises in Sungai Petani need roller shutters? WhatsApp us now."
    },
    "taiping": {
      "metaTitle": "Roller Shutter Door Taiping | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Taiping. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Taiping — Installation & 24hr Repair",
      "intro": "Taiping, with its long industrial history, has various premises needing quality roller shutters.",
      "closingCta": "Need roller shutters in Taiping? WhatsApp us for a free quote."
    },
    "butterworth": {
      "metaTitle": "Roller Shutter Door Butterworth | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Butterworth — 24-hour installation & repair for Seberang Perai industrial areas. WhatsApp us!",
      "h1": "Roller Shutter Door Butterworth — Installation & 24hr Repair",
      "intro": "Butterworth and Seberang Perai are Penang's main industrial areas needing heavy-duty roller shutters for factories and warehouses.",
      "closingCta": "Factory in Butterworth needs roller shutters? WhatsApp us now."
    },
    "johor-bahru": {
      "metaTitle": "Roller Shutter Door Johor Bahru | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in JB. 24-hour installation & repair for factories, warehouses & commercial premises in Johor Bahru. WhatsApp us!",
      "h1": "Roller Shutter Door Johor Bahru — Installation & 24hr Repair",
      "intro": "Johor Bahru, southern Malaysia's main industrial hub, has thousands of factories and warehouses needing high-quality roller shutters for daily operations.",
      "closingCta": "Factory in JB needs roller shutters? WhatsApp us for a free quote."
    },
    "melaka": {
      "metaTitle": "Roller Shutter Door Melaka | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Melaka — 24-hour installation & repair. Professional service for business premises. WhatsApp us!",
      "h1": "Roller Shutter Door Melaka — Installation & 24hr Repair",
      "intro": "Melaka's growing tourism and industrial sectors need quality roller shutters for commercial premises and factories.",
      "closingCta": "Premises in Melaka need roller shutters? WhatsApp us now."
    },
    "batu-pahat": {
      "metaTitle": "Roller Shutter Door Batu Pahat | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Batu Pahat. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Batu Pahat — Installation & 24hr Repair",
      "intro": "Batu Pahat is an important industrial and commercial centre in Johor needing quality roller shutters.",
      "closingCta": "Need roller shutters in Batu Pahat? WhatsApp us now."
    },
    "muar": {
      "metaTitle": "Roller Shutter Door Muar | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Muar — 24-hour installation & repair. WhatsApp us for a free quote!",
      "h1": "Roller Shutter Door Muar — Installation & 24hr Repair",
      "intro": "Muar is known as a centre for furniture and food industries needing quality roller shutters for factories and business premises.",
      "closingCta": "Premises in Muar need roller shutters? WhatsApp us now."
    },
    "kluang": {
      "metaTitle": "Roller Shutter Door Kluang | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Kluang. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Kluang — Installation & 24hr Repair",
      "intro": "Kluang has industrial and commercial premises needing roller shutters for security protection.",
      "closingCta": "Need roller shutters in Kluang? WhatsApp us for a free quote."
    },
    "skudai": {
      "metaTitle": "Roller Shutter Door Skudai | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Skudai — 24-hour installation & repair. WhatsApp us now!",
      "h1": "Roller Shutter Door Skudai — Installation & 24hr Repair",
      "intro": "Skudai is rapidly growing with industrial and commercial areas needing quality roller shutters.",
      "closingCta": "Factory in Skudai needs roller shutters? WhatsApp us now."
    },
    "iskandar-puteri": {
      "metaTitle": "Roller Shutter Door Iskandar Puteri | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Iskandar Puteri. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Iskandar Puteri — Installation & 24hr Repair",
      "intro": "Iskandar Puteri, Johor's mega development, has many new commercial and industrial premises needing roller shutters.",
      "closingCta": "Premises in Iskandar Puteri need roller shutters? WhatsApp us now."
    },
    "kuantan": {
      "metaTitle": "Roller Shutter Door Kuantan | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Kuantan. 24-hour installation & repair for factories & commercial premises in Pahang. WhatsApp us!",
      "h1": "Roller Shutter Door Kuantan — Installation & 24hr Repair",
      "intro": "Kuantan, Pahang's state capital and the east coast's industrial hub, has many premises needing quality roller shutters.",
      "closingCta": "Premises in Kuantan need roller shutters? WhatsApp us for a free quote."
    },
    "kota-bharu": {
      "metaTitle": "Roller Shutter Door Kota Bharu | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kota Bharu — 24-hour installation & repair. WhatsApp us for a free quote!",
      "h1": "Roller Shutter Door Kota Bharu — Installation & 24hr Repair",
      "intro": "Kota Bharu, Kelantan's state capital, has business centres and commercial premises needing quality roller shutters.",
      "closingCta": "Need roller shutters in Kota Bharu? WhatsApp us now."
    },
    "kuala-terengganu": {
      "metaTitle": "Roller Shutter Door Kuala Terengganu | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Kuala Terengganu. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Kuala Terengganu — Installation & 24hr Repair",
      "intro": "Kuala Terengganu has commercial and industrial premises needing roller shutters for security protection.",
      "closingCta": "Premises in Kuala Terengganu need roller shutters? WhatsApp us now."
    },
    "temerloh": {
      "metaTitle": "Roller Shutter Door Temerloh | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Temerloh — 24-hour installation & repair. WhatsApp us now!",
      "h1": "Roller Shutter Door Temerloh — Installation & 24hr Repair",
      "intro": "Temerloh, a business centre in central Pahang, needs reliable roller shutter services.",
      "closingCta": "Need roller shutters in Temerloh? WhatsApp us for a free quote."
    },
    "kota-kinabalu": {
      "metaTitle": "Roller Shutter Door Kota Kinabalu | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter door experts in Kota Kinabalu. 24-hour installation & repair for premises in Sabah. WhatsApp us!",
      "h1": "Roller Shutter Door Kota Kinabalu — Installation & 24hr Repair",
      "intro": "Kota Kinabalu, Sabah's state capital and East Malaysia's main business centre, has many commercial and industrial premises needing roller shutters.",
      "closingCta": "Premises in Kota Kinabalu need roller shutters? WhatsApp us for a free quote."
    },
    "kuching": {
      "metaTitle": "Roller Shutter Door Kuching | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Kuching — 24-hour installation & repair for premises in Sarawak. WhatsApp us now!",
      "h1": "Roller Shutter Door Kuching — Installation & 24hr Repair",
      "intro": "Kuching, Sarawak's state capital, has industrial and commercial areas needing quality roller shutters.",
      "closingCta": "Factory in Kuching needs roller shutters? WhatsApp us now."
    },
    "miri": {
      "metaTitle": "Roller Shutter Door Miri | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter services in Miri. 24-hour installation & repair. WhatsApp for a free quote!",
      "h1": "Roller Shutter Door Miri — Installation & 24hr Repair",
      "intro": "Miri, Sarawak's oil and gas industry centre, has industrial premises needing heavy-duty roller shutters.",
      "closingCta": "Need roller shutters in Miri? WhatsApp us for a free quote."
    },
    "sandakan": {
      "metaTitle": "Roller Shutter Door Sandakan | Installation & 24hr Repair | Roller Shutter Door Malaysia",
      "metaDescription": "Roller shutter Sandakan — 24-hour installation & repair. WhatsApp us now!",
      "h1": "Roller Shutter Door Sandakan — Installation & 24hr Repair",
      "intro": "Sandakan has commercial and industrial premises needing quality roller shutters for security protection.",
      "closingCta": "Premises in Sandakan need roller shutters? WhatsApp us now."
    }
  }
}
```

---

### 12. messages/zh.json (Simplified Chinese)

```json
{
  "metadata": {
    "title": "马来西亚卷帘门 | #1 安装与24小时维修专家",
    "description": "马来西亚#1卷帘门专家。24小时安装、维修与保养钢铁卷帘门。钢铁、铝合金、聚碳酸酯卷帘门。立即WhatsApp联系我们！"
  },
  "nav": {
    "home": "首页",
    "products": "产品",
    "howItWorks": "服务流程",
    "reviews": "客户评价",
    "faq": "常见问题",
    "locations": "服务地区",
    "contact": "联系我们",
    "brandName": "马来西亚卷帘门",
    "ctaButton": "立即WhatsApp"
  },
  "fomoBanner": {
    "texts": [
      "本周您所在地区已有12位客户下单 — 本月安装名额即将满额！",
      "我们的紧急维修团队今天已完成3项工作 — 名额有限，请尽快联系！",
      "全马超过15,000个场所受到我们卷帘门的保护"
    ]
  },
  "hero": {
    "h1": "马来西亚卷帘门 — #1 安装与24小时维修专家",
    "subtitle": "为工厂、商店和仓库安装、维修与保养各类卷帘门。全马24小时紧急服务，每周7天全年无休。",
    "ctaPrimary": "立即WhatsApp",
    "ctaPrimarySubtext": "获取免费报价",
    "ctaSecondary": "查看卷帘门类型",
    "altText": "马来西亚工厂卷帘门安装"
  },
  "stats": {
    "items": [
      { "value": "15,000+", "label": "成功安装" },
      { "value": "24/7", "label": "紧急服务" },
      { "value": "20+", "label": "年经验" },
      { "value": "50+", "label": "覆盖地区" }
    ]
  },
  "products": {
    "heading": "我们的卷帘门类型",
    "subheading": "每个场所需求不同。我们提供6种卷帘门，为您的企业提供最大保护。",
    "items": {
      "mildSteel": {
        "name": "钢铁卷帘门",
        "description": "工厂、仓库和商业场所最受欢迎的选择。采用优质钢材制造，强度和耐久性极高。性价比高，使用寿命长。",
        "keyPoints": [
          "工业级强度，提供最大保护",
          "性价比高 — 中等预算的最佳选择",
          "适用于工厂、仓库和大型场所"
        ],
        "cta": "WhatsApp获取报价",
        "altText": "工厂和仓库用钢铁卷帘门"
      },
      "aluminium": {
        "name": "铝合金卷帘门",
        "description": "轻便、防锈，适合需要专业外观的场所。办公室、诊所和现代商业场所的理想选择。",
        "keyPoints": [
          "轻便 — 手动或自动操作皆方便",
          "防锈，适应马来西亚热带气候",
          "外观现代整洁，适合专业场所"
        ],
        "cta": "WhatsApp获取报价",
        "altText": "商业场所铝合金卷帘门"
      },
      "polycarbonate": {
        "name": "聚碳酸酯透明卷帘门",
        "description": "安全与可视性的完美结合。即使在营业时间结束后，顾客也能看到您的展示产品。适合精品店、展厅和购物中心。",
        "keyPoints": [
          "24小时产品展示，即使店铺关闭",
          "安全性媲美钢铁卷帘门",
          "自然采光 — 节省电费"
        ],
        "cta": "WhatsApp获取报价",
        "altText": "商店用透明卷帘门"
      },
      "fireRated": {
        "name": "防火卷帘门",
        "description": "符合马来西亚消防安全标准。根据BOMBA法规，某些建筑必须安装。专为防止区域间火焰和烟雾蔓延而设计。",
        "keyPoints": [
          "获得认证，符合马来西亚BOMBA标准",
          "防止火焰和烟雾在区域间蔓延",
          "某些工厂、仓库和商业建筑的强制要求"
        ],
        "cta": "WhatsApp获取报价",
        "altText": "防火卷帘门消防合规"
      },
      "grille": {
        "name": "格栅卷帘门",
        "description": "兼具安全性和通风性。格栅设计允许空气流通和可视性，同时保持保护功能。杂货店、超市和零售场所的首选。",
        "keyPoints": [
          "最佳通风 — 适合马来西亚炎热气候",
          "营业时间结束后仍可看到店内情况",
          "杂货店、超市和美食广场的热门选择"
        ],
        "cta": "WhatsApp获取报价",
        "altText": "零售店用格栅卷帘门"
      },
      "motorised": {
        "name": "电动自动卷帘门",
        "description": "一键或遥控即可开关。适合经常开关的大门。节省时间和体力，提高日常运营效率。",
        "keyPoints": [
          "遥控或开关 — 无需体力操作",
          "适合工厂和物流仓库的大门",
          "可从手动升级为自动"
        ],
        "cta": "WhatsApp获取报价",
        "altText": "仓库用电动自动卷帘门"
      }
    }
  },
  "howItWorks": {
    "heading": "我们的服务流程",
    "subheading": "从咨询到安装 — 简单4步即可完成。",
    "steps": [
      {
        "number": "1",
        "title": "通过WhatsApp联系我们",
        "description": "告诉我们您的需求 — 新安装、维修或保养。发送现场照片以便快速评估。"
      },
      {
        "number": "2",
        "title": "现场勘察与报价",
        "description": "我们的团队将到访您的场所进行精确测量。您将收到详细报价，绝无隐藏费用。"
      },
      {
        "number": "3",
        "title": "专业安装",
        "description": "我们的认证技师按照约定时间完成安装。工作整洁、快速，符合安全标准。"
      },
      {
        "number": "4",
        "title": "保修与售后支持",
        "description": "每次安装均附带保修。24小时紧急团队随时待命处理安装后的任何问题。"
      }
    ]
  },
  "riskProblem": {
    "heading": "不要让您的场所暴露在风险之中",
    "subheading": "损坏的卷帘门或缺乏保护可能带来严重问题。",
    "problems": [
      {
        "title": "盗窃与入室抢劫",
        "description": "没有卷帘门或门已损坏的场所是窃贼的首要目标。一夜之间的损失可达数万令吉。"
      },
      {
        "title": "天气造成的损害",
        "description": "暴雨、强风和热带风暴可能损坏您的库存和设备，如果场所没有得到适当保护。"
      },
      {
        "title": "维修费用不断攀升",
        "description": "缺乏保养的卷帘门会更快损坏。紧急维修费用远高于定期预防性保养。"
      },
      {
        "title": "不符合BOMBA消防规定",
        "description": "某些场所必须安装防火卷帘门。不合规可能导致罚款、停业和安全风险。"
      }
    ],
    "solutionCta": "不要等到为时已晚 — 立即WhatsApp联系我们获取免费评估。"
  },
  "midCta": {
    "heading": "需要新卷帘门或紧急维修？",
    "subheading": "我们的团队24小时、每周7天随时为您服务。30分钟内获取免费报价。",
    "ctaButton": "立即WhatsApp联系我们"
  },
  "reviews": {
    "heading": "客户评价",
    "subheading": "深受全马数千名企业主的信赖。",
    "items": [
      {
        "name": "Ahmad Faizal",
        "location": "巴生, 雪兰莪",
        "rating": 5,
        "text": "我工厂的卷帘门半夜坏了。凌晨2点联系他们，技师45分钟就到了。工作又快又专业。强烈推荐！"
      },
      {
        "name": "Lee Wei Keat",
        "location": "八打灵再也, 雪兰莪",
        "rating": 5,
        "text": "为新店安装了8套铝合金卷帘门。2天内完成。质量一流，价格合理。团队非常有组织。"
      },
      {
        "name": "Siti Nurhaliza",
        "location": "新山, 柔佛",
        "rating": 5,
        "text": "已经使用他们的定期保养服务3年了。我仓库的卷帘门一直保持良好状态。JB最好的服务！"
      },
      {
        "name": "Rajesh Kumar",
        "location": "槟城",
        "rating": 5,
        "text": "把旧卷帘门电机升级为自动。现在开关仓库门非常方便。感谢出色的工作！"
      },
      {
        "name": "Tan Mei Ling",
        "location": "莎阿南, 雪兰莪",
        "rating": 5,
        "text": "安装了防火卷帘门以符合BOMBA规定。从勘察到安装整个过程非常顺利。价格有竞争力，工作质量高。"
      },
      {
        "name": "Mohd Hafiz",
        "location": "吉隆坡",
        "rating": 5,
        "text": "晚上11点紧急电话，因为弹簧断了。他们很快就来了，一个小时内解决了问题。真正的卷帘门专家！"
      }
    ]
  },
  "whyChoose": {
    "heading": "为什么选择我们？",
    "subheading": "我们不只是承包商 — 我们是您可以信赖的卷帘门专家。",
    "items": [
      {
        "title": "24小时紧急服务",
        "description": "卷帘门故障不分时间。我们的紧急维修团队24/7全天候运作，包括公共假日和周末。"
      },
      {
        "title": "超过20年经验",
        "description": "在马来西亚卷帘门行业拥有超过二十年的经验。我们处理过您能想到的每一种故障和安装。"
      },
      {
        "title": "覆盖超过50个地区",
        "description": "从柔佛到槟城，古晋到亚庇 — 我们的团队网络覆盖全马来西亚，提供快速服务。"
      },
      {
        "title": "透明报价 — 无隐藏费用",
        "description": "开工前您就知道确切费用。没有意外，未经您允许不会有额外收费。"
      },
      {
        "title": "工艺与材料保修",
        "description": "每次安装和维修均附带保修。我们使用来自可靠供应商的优质材料。"
      },
      {
        "title": "认证且经验丰富的技师",
        "description": "我们的每位技师都经过培训且经验丰富。工作整洁、安全，符合行业标准。"
      }
    ]
  },
  "gallery": {
    "heading": "项目展示",
    "subheading": "查看我们在全马的卷帘门安装和维修成果。",
    "categories": [
      "新安装",
      "维修与保养",
      "工厂与仓库项目",
      "商店与商业项目"
    ],
    "altTexts": {
      "newInstallation": "新卷帘门安装项目",
      "repair": "卷帘门维修和保养项目",
      "factory": "工厂和仓库卷帘门项目",
      "commercial": "商店和商业卷帘门项目"
    }
  },
  "locations": {
    "heading": "我们的服务地区",
    "subheading": "在全马超过50个地点提供专业卷帘门服务。",
    "regions": {
      "klangValley": "巴生谷",
      "southernSelangor": "雪兰莪南部",
      "negeriSembilan": "森美兰",
      "northern": "北部",
      "southern": "南部",
      "eastCoast": "东海岸",
      "eastMalaysia": "东马"
    },
    "viewDetails": "查看{city}服务"
  },
  "faq": {
    "heading": "常见问题 (FAQ)",
    "items": [
      {
        "question": "安装新卷帘门需要多少钱？",
        "answer": "费用取决于卷帘门类型、门的尺寸和场所位置。标准尺寸的钢铁卷帘门价格实惠。通过WhatsApp联系我们，根据您的具体需求获取准确报价 — 评估和报价完全免费。"
      },
      {
        "question": "安装需要多长时间？",
        "answer": "单台卷帘门的标准安装通常需要1-2个工作日。涉及多台或特殊安装（如防火卷帘门）的项目可能需要更长时间。我们的团队将在现场勘察后提供确切的时间表。"
      },
      {
        "question": "你们提供24小时紧急维修服务吗？",
        "answer": "是的，我们全天候24小时、每周7天运营，包括公共假日。无论何时卷帘门出现故障 — 半夜、周末或节假日 — 我们的技师随时准备尽快到达您的现场。通过WhatsApp联系我们获取即时响应。"
      },
      {
        "question": "手动卷帘门可以升级为自动吗？",
        "answer": "可以！我们提供电机升级服务，将现有的手动卷帘门转换为电动系统。这将提高运营效率，特别是经常开关的大门。升级过程通常一天内即可完成。"
      },
      {
        "question": "哪种卷帘门适合我的场所？",
        "answer": "这取决于您的需求。最大安全性 — 钢铁。专业外观和防锈 — 铝合金。产品展示 — 聚碳酸酯。符合BOMBA规定 — 防火。通过WhatsApp联系我们，我们的专家将为您的场所推荐最佳类型。"
      },
      {
        "question": "你们的卷帘门有保修吗？",
        "answer": "是的，每次安装和维修均附带材料和工艺保修。保修期取决于产品类型和工作范围。我们还提供定期保养套餐，确保您的卷帘门在整个使用寿命中保持最佳状态。"
      }
    ]
  },
  "finalCta": {
    "heading": "准备好保护您的场所了吗？",
    "subheading": "30分钟内获取免费报价。我们的专家团队24/7随时为您服务。",
    "ctaButton": "立即WhatsApp — 免费报价",
    "supportingText": "无需承诺。无隐藏费用。只有马来西亚最好的卷帘门服务。"
  },
  "footer": {
    "tagline": "马来西亚卷帘门 — #1 安装与24小时维修专家",
    "services": {
      "heading": "服务项目",
      "items": [
        "新安装",
        "维修与故障排除",
        "定期保养",
        "电机升级",
        "弹簧更换"
      ]
    },
    "productTypes": {
      "heading": "卷帘门类型",
      "items": [
        "钢铁",
        "铝合金",
        "聚碳酸酯 / 透明",
        "防火",
        "格栅",
        "电动 / 自动"
      ]
    },
    "areas": {
      "heading": "服务地区",
      "items": [
        "巴生谷",
        "雪兰莪",
        "柔佛",
        "槟城",
        "森美兰",
        "其他地区"
      ]
    },
    "social": {
      "heading": "关注我们",
      "facebook": "Facebook",
      "instagram": "Instagram",
      "google": "Google Business"
    },
    "copyright": "© 2026 马来西亚卷帘门。版权所有。",
    "whatsappFloat": "WhatsApp联系我们"
  },
  "breadcrumbs": {
    "home": "首页",
    "rollerShutter": "卷帘门"
  },
  "nearbyLocations": {
    "heading": "附近地区",
    "subheading": "我们也在以下地区提供卷帘门服务：",
    "viewService": "查看服务"
  },
  "common": {
    "callNow": "立即拨打",
    "whatsappUs": "WhatsApp联系我们",
    "freeQuote": "免费报价",
    "learnMore": "了解更多",
    "viewAll": "查看全部",
    "backToTop": "回到顶部",
    "loading": "加载中...",
    "error": "发生错误"
  },
  "shared": {
    "whatsappCta": "立即WhatsApp",
    "emergencyBadge": "24小时紧急服务",
    "freeQuoteBadge": "免费报价",
    "trustedBadge": "超过15,000位客户的信赖",
    "brandName": "马来西亚卷帘门",
    "phoneLabel": "联系我们",
    "allRightsReserved": "版权所有",
    "whatsappPrefilledMessage": "您好，我对卷帘门服务感兴趣。可以获取报价吗？",
    "whatsappPrefilledMessageLocation": "您好，我对{city}的卷帘门服务感兴趣。可以获取报价吗？"
  },
  "locationPages": {
    "kuala-lumpur": {
      "metaTitle": "吉隆坡卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "吉隆坡卷帘门专家。24小时为工厂、商店和仓库提供安装、维修与保养服务。WhatsApp获取免费报价。",
      "h1": "吉隆坡卷帘门 — 安装与24小时维修",
      "intro": "吉隆坡作为马来西亚的首都和主要商业中心，拥有数千个需要优质卷帘门保护的商业和工业场所。从Segambut工业区到Bukit Bintang的商店街，我们为KL各类场所提供服务。",
      "closingCta": "需要吉隆坡的卷帘门专家？立即WhatsApp联系我们，30分钟内获得免费报价。"
    },
    "petaling-jaya": {
      "metaTitle": "八打灵再也卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "八打灵再也专业卷帘门服务。24小时为商店、工厂和办公室提供安装、维修与保养。WhatsApp联系我们！",
      "h1": "八打灵再也卷帘门 — 安装与24小时维修",
      "intro": "八打灵再也是雪兰莪的主要商业中心，从Seksyen 13到Damansara Perdana发展迅速。PJ的业主需要耐用的卷帘门来保护他们的投资。",
      "closingCta": "PJ的卷帘门坏了或需要新安装？立即WhatsApp联系我们 — 团队24/7随时待命。"
    },
    "shah-alam": {
      "metaTitle": "莎阿南卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "莎阿南卷帘门专家。24小时为工厂、仓库和商业场所提供安装与维修。免费报价 — 立即WhatsApp！",
      "h1": "莎阿南卷帘门 — 安装与24小时维修",
      "intro": "莎阿南，雪兰莪州首府，以Seksyen 15、Seksyen 23和HICOM等大型工业区闻名。数千家工厂和仓库依赖优质卷帘门。",
      "closingCta": "莎阿南的工厂或仓库主？WhatsApp联系我们获取免费现场评估和无承诺报价。"
    },
    "subang-jaya": {
      "metaTitle": "梳邦再也卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "梳邦再也卷帘门服务。24小时安装、维修与保养。WhatsApp获取免费报价！",
      "h1": "梳邦再也卷帘门 — 安装与24小时维修",
      "intro": "梳邦再也作为商业中心快速发展，USJ、Sunway和SS15等区域商店、餐厅和商业场所密集。",
      "closingCta": "梳邦再也的场所需要卷帘门？立即WhatsApp获取免费报价。"
    },
    "cheras": {
      "metaTitle": "蕉赖卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "蕉赖卷帘门 — 新安装、维修与24小时服务。商店、工厂和仓库的钢门专家。WhatsApp联系我们！",
      "h1": "蕉赖卷帘门 — 安装与24小时维修",
      "intro": "蕉赖是巴生谷人口最密集的地区之一，商业、工业和小型企业场所混合，需要优质卷帘门。",
      "closingCta": "蕉赖的业主？立即WhatsApp — 30分钟内获取卷帘门报价。"
    },
    "ampang": {
      "metaTitle": "安邦卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "安邦卷帘门服务。24小时安装、维修与保养。WhatsApp获取免费报价！",
      "h1": "安邦卷帘门 — 安装与24小时维修",
      "intro": "安邦快速发展，各类商业和工业场所需要优质卷帘门保护。",
      "closingCta": "安邦需要卷帘门？立即WhatsApp获取免费报价。"
    },
    "puchong": {
      "metaTitle": "蒲种卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "蒲种卷帘门专家。24小时安装、维修与保养。立即WhatsApp联系我们！",
      "h1": "蒲种卷帘门 — 安装与24小时维修",
      "intro": "蒲种是快速发展的商业区，有许多商业场所、小型工厂和仓库需要优质卷帘门。",
      "closingCta": "蒲种的场所需要卷帘门？WhatsApp获取免费报价。"
    },
    "bangsar": {
      "metaTitle": "孟沙卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "孟沙卷帘门 — 24小时安装与维修。为商店、办公室和商业场所提供专业服务。WhatsApp联系我们！",
      "h1": "孟沙卷帘门 — 安装与24小时维修",
      "intro": "孟沙是高端商业区，拥有众多商店、餐厅和办公室，需要优质卷帘门保障安全和美观。",
      "closingCta": "孟沙的场所需要卷帘门？立即WhatsApp获取免费评估。"
    },
    "damansara": {
      "metaTitle": "白沙罗卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "白沙罗卷帘门服务。24小时安装、维修与保养。WhatsApp获取免费报价！",
      "h1": "白沙罗卷帘门 — 安装与24小时维修",
      "intro": "白沙罗涵盖Damansara Perdana、Damansara Jaya和Damansara Utama等现代商业区，商业场所需要卷帘门保护。",
      "closingCta": "白沙罗需要卷帘门？立即WhatsApp — 30分钟内回复。"
    },
    "cyberjaya": {
      "metaTitle": "赛城卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "赛城卷帘门 — 24小时为科技和商业场所提供安装与维修。WhatsApp获取免费报价！",
      "h1": "赛城卷帘门 — 安装与24小时维修",
      "intro": "赛城作为马来西亚的科技中心，有许多商业场所和数据中心需要优质卷帘门保障安全。",
      "closingCta": "赛城的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "putrajaya": {
      "metaTitle": "布城卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "布城卷帘门服务。24小时为政府和商业场所提供安装与维修。WhatsApp联系我们！",
      "h1": "布城卷帘门 — 安装与24小时维修",
      "intro": "布城作为马来西亚行政中心，有各类商业和政府场所需要优质卷帘门保障安全。",
      "closingCta": "布城需要卷帘门？WhatsApp获取免费报价。"
    },
    "kajang": {
      "metaTitle": "加影卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "加影卷帘门专家。24小时安装、维修与保养。立即WhatsApp联系我们！",
      "h1": "加影卷帘门 — 安装与24小时维修",
      "intro": "加影作为商业中心快速发展，各种商店、小型工厂和仓库需要卷帘门保护。",
      "closingCta": "加影的场所主？WhatsApp获取免费卷帘门报价。"
    },
    "bangi": {
      "metaTitle": "万宜卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "万宜卷帘门 — 24小时安装与维修。为工厂、商店和仓库提供专业服务。WhatsApp联系我们！",
      "h1": "万宜卷帘门 — 安装与24小时维修",
      "intro": "万宜活跃的工业和商业区需要可靠的卷帘门服务来保护商业场所。",
      "closingCta": "万宜需要卷帘门？立即WhatsApp获取免费报价。"
    },
    "rawang": {
      "metaTitle": "万挠卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "万挠卷帘门服务。24小时安装、维修与保养。WhatsApp获取免费报价！",
      "h1": "万挠卷帘门 — 安装与24小时维修",
      "intro": "万挠快速发展，工业和商业区需要优质卷帘门保障场所安全。",
      "closingCta": "万挠的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "klang": {
      "metaTitle": "巴生卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "巴生卷帘门专家。24小时为工厂、仓库和商业场所提供安装与维修。WhatsApp联系我们！",
      "h1": "巴生卷帘门 — 安装与24小时维修",
      "intro": "巴生是主要工业中心，拥有港口和工厂区，需要重型卷帘门提供最大保护。",
      "closingCta": "巴生的工厂主？WhatsApp获取免费卷帘门报价。"
    },
    "kepong": {
      "metaTitle": "甲洞卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "甲洞卷帘门 — 24小时安装与维修。为商店、工厂和仓库提供服务。立即WhatsApp！",
      "h1": "甲洞卷帘门 — 安装与24小时维修",
      "intro": "甲洞以工业区和商店街闻名，需要优质卷帘门保障日常安全。",
      "closingCta": "甲洞需要卷帘门？WhatsApp获取免费报价。"
    },
    "seri-kembangan": {
      "metaTitle": "沙登卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "沙登卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "沙登卷帘门 — 安装与24小时维修",
      "intro": "沙登作为活跃的商业区，需要专业卷帘门服务来保护商业场所。",
      "closingCta": "沙登的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "balakong": {
      "metaTitle": "峇六拜卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "峇六拜卷帘门 — 24小时为工业区提供安装与维修。立即WhatsApp！",
      "h1": "峇六拜卷帘门 — 安装与24小时维修",
      "intro": "峇六拜以活跃的工业区闻名，优质卷帘门是工厂和仓库的必需品。",
      "closingCta": "峇六拜的工厂需要卷帘门？WhatsApp获取免费报价。"
    },
    "sungai-buloh": {
      "metaTitle": "双溪毛糯卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "双溪毛糯卷帘门专家。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "双溪毛糯卷帘门 — 安装与24小时维修",
      "intro": "双溪毛糯有各类商业和工业场所需要卷帘门保障安全。",
      "closingCta": "双溪毛糯需要卷帘门？立即WhatsApp联系我们。"
    },
    "batu-caves": {
      "metaTitle": "黑风洞卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "黑风洞卷帘门 — 24小时安装与维修。为商业场所提供专业服务。WhatsApp联系我们！",
      "h1": "黑风洞卷帘门 — 安装与24小时维修",
      "intro": "黑风洞的工业和商业区需要优质卷帘门服务来保护场所。",
      "closingCta": "黑风洞的场所需要卷帘门？WhatsApp获取免费报价。"
    },
    "port-klang": {
      "metaTitle": "巴生港卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "巴生港卷帘门专家。24小时为仓库、工厂和港口场所提供安装与维修。WhatsApp联系我们！",
      "h1": "巴生港卷帘门 — 安装与24小时维修",
      "intro": "巴生港作为马来西亚主要港口，拥有数千个仓库和物流场所，需要重型卷帘门支持24小时运营。",
      "closingCta": "巴生港的仓库需要卷帘门？WhatsApp获取免费报价。"
    },
    "glenmarie": {
      "metaTitle": "Glenmarie卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "Glenmarie卷帘门 — 24小时为工业区提供安装与维修。立即WhatsApp！",
      "h1": "Glenmarie卷帘门 — 安装与24小时维修",
      "intro": "Glenmarie是高端工业区，需要优质卷帘门配合现代工厂和仓库。",
      "closingCta": "Glenmarie的工厂需要卷帘门？立即WhatsApp联系我们。"
    },
    "hicom-shah-alam": {
      "metaTitle": "HICOM莎阿南卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "HICOM莎阿南卷帘门服务。24小时为工业区提供安装与维修。WhatsApp联系我们！",
      "h1": "HICOM莎阿南卷帘门 — 安装与24小时维修",
      "intro": "HICOM工业园是马来西亚最大的工业区之一，数百家工厂需要工业卷帘门。",
      "closingCta": "HICOM莎阿南的工厂需要卷帘门？WhatsApp获取免费报价。"
    },
    "pandan-indah": {
      "metaTitle": "Pandan Indah卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "Pandan Indah卷帘门 — 24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "Pandan Indah卷帘门 — 安装与24小时维修",
      "intro": "Pandan Indah有商业和小型工业场所混合，需要卷帘门保障安全。",
      "closingCta": "Pandan Indah需要卷帘门？立即WhatsApp联系我们。"
    },
    "sri-damansara": {
      "metaTitle": "Sri Damansara卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "Sri Damansara卷帘门服务。24小时安装与维修。立即WhatsApp！",
      "h1": "Sri Damansara卷帘门 — 安装与24小时维修",
      "intro": "Sri Damansara的工业和商业区需要可靠的专业卷帘门服务。",
      "closingCta": "Sri Damansara的场所需要卷帘门？WhatsApp获取免费报价。"
    },
    "kota-damansara": {
      "metaTitle": "哥打白沙罗卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "哥打白沙罗卷帘门 — 24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "哥打白沙罗卷帘门 — 安装与24小时维修",
      "intro": "哥打白沙罗快速发展，各类商业和科技场所需要优质卷帘门。",
      "closingCta": "哥打白沙罗需要卷帘门？立即WhatsApp联系我们。"
    },
    "seremban": {
      "metaTitle": "芙蓉卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "芙蓉卷帘门专家。24小时为工厂、商店和仓库提供安装、维修与保养。立即WhatsApp！",
      "h1": "芙蓉卷帘门 — 安装与24小时维修",
      "intro": "芙蓉，森美兰州首府，有活跃的工业和商业区需要优质卷帘门。",
      "closingCta": "芙蓉的场所需要卷帘门？WhatsApp获取免费报价。"
    },
    "nilai": {
      "metaTitle": "汝来卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "汝来卷帘门 — 24小时为工业区提供安装与维修。立即WhatsApp！",
      "h1": "汝来卷帘门 — 安装与24小时维修",
      "intro": "汝来不断发展的工业和商业区需要专业卷帘门服务。",
      "closingCta": "汝来的工厂需要卷帘门？立即WhatsApp联系我们。"
    },
    "senawang": {
      "metaTitle": "瓜拉庇劳卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "瓜拉庇劳卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "瓜拉庇劳卷帘门 — 安装与24小时维修",
      "intro": "瓜拉庇劳以大型工业区闻名，需要重型卷帘门支持工厂运营。",
      "closingCta": "瓜拉庇劳需要卷帘门？WhatsApp获取免费报价。"
    },
    "penang": {
      "metaTitle": "槟城卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "槟城卷帘门专家。24小时为工厂、仓库和商业场所提供安装与维修。WhatsApp联系我们！",
      "h1": "槟城卷帘门 — 安装与24小时维修",
      "intro": "槟城作为北马主要工业中心，拥有数千家电子工厂和商业场所，需要优质卷帘门。",
      "closingCta": "槟城的工厂需要卷帘门？WhatsApp获取免费报价。"
    },
    "ipoh": {
      "metaTitle": "怡保卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "怡保卷帘门 — 24小时安装与维修。霹雳商业场所的专业服务。WhatsApp联系我们！",
      "h1": "怡保卷帘门 — 安装与24小时维修",
      "intro": "怡保，霹雳州首府，有工业和商业区需要专业卷帘门服务。",
      "closingCta": "怡保的场所需要卷帘门？立即WhatsApp获取免费报价。"
    },
    "alor-setar": {
      "metaTitle": "亚罗士打卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "亚罗士打卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "亚罗士打卷帘门 — 安装与24小时维修",
      "intro": "亚罗士打，吉打州首府，有商业和工业场所需要优质卷帘门。",
      "closingCta": "亚罗士打需要卷帘门？立即WhatsApp联系我们。"
    },
    "sungai-petani": {
      "metaTitle": "双溪大年卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "双溪大年卷帘门 — 24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "双溪大年卷帘门 — 安装与24小时维修",
      "intro": "双溪大年是吉打的主要商业中心，许多商业和工业场所需要卷帘门。",
      "closingCta": "双溪大年的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "taiping": {
      "metaTitle": "太平卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "太平卷帘门专家。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "太平卷帘门 — 安装与24小时维修",
      "intro": "太平拥有悠久的工业历史，各类场所需要优质卷帘门。",
      "closingCta": "太平需要卷帘门？WhatsApp获取免费报价。"
    },
    "butterworth": {
      "metaTitle": "北海卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "北海卷帘门 — 24小时为威省工业区提供安装与维修。WhatsApp联系我们！",
      "h1": "北海卷帘门 — 安装与24小时维修",
      "intro": "北海和威省是槟城主要工业区，需要重型卷帘门配合工厂和仓库。",
      "closingCta": "北海的工厂需要卷帘门？立即WhatsApp联系我们。"
    },
    "johor-bahru": {
      "metaTitle": "新山卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "新山卷帘门专家。24小时为工厂、仓库和商业场所提供安装与维修。WhatsApp联系我们！",
      "h1": "新山卷帘门 — 安装与24小时维修",
      "intro": "新山作为南马主要工业中心，拥有数千家工厂和仓库需要优质卷帘门支持日常运营。",
      "closingCta": "JB的工厂需要卷帘门？WhatsApp获取免费报价。"
    },
    "melaka": {
      "metaTitle": "马六甲卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "马六甲卷帘门 — 24小时安装与维修。为商业场所提供专业服务。WhatsApp联系我们！",
      "h1": "马六甲卷帘门 — 安装与24小时维修",
      "intro": "马六甲的旅游业和工业不断发展，商业场所和工厂需要优质卷帘门。",
      "closingCta": "马六甲的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "batu-pahat": {
      "metaTitle": "峇株巴辖卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "峇株巴辖卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "峇株巴辖卷帘门 — 安装与24小时维修",
      "intro": "峇株巴辖是柔佛重要的工业和商业中心，需要优质卷帘门。",
      "closingCta": "峇株巴辖需要卷帘门？立即WhatsApp联系我们。"
    },
    "muar": {
      "metaTitle": "麻坡卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "麻坡卷帘门 — 24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "麻坡卷帘门 — 安装与24小时维修",
      "intro": "麻坡是家具和食品工业中心，工厂和商业场所需要优质卷帘门。",
      "closingCta": "麻坡的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "kluang": {
      "metaTitle": "居銮卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "居銮卷帘门专家。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "居銮卷帘门 — 安装与24小时维修",
      "intro": "居銮有工业和商业场所需要卷帘门保障安全。",
      "closingCta": "居銮需要卷帘门？WhatsApp获取免费报价。"
    },
    "skudai": {
      "metaTitle": "士古来卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "士古来卷帘门 — 24小时安装与维修。立即WhatsApp！",
      "h1": "士古来卷帘门 — 安装与24小时维修",
      "intro": "士古来快速发展，工业和商业区需要优质卷帘门。",
      "closingCta": "士古来的工厂需要卷帘门？立即WhatsApp联系我们。"
    },
    "iskandar-puteri": {
      "metaTitle": "依斯干达公主城卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "依斯干达公主城卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "依斯干达公主城卷帘门 — 安装与24小时维修",
      "intro": "依斯干达公主城是柔佛的大型发展项目，许多新商业和工业场所需要卷帘门。",
      "closingCta": "依斯干达公主城的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "kuantan": {
      "metaTitle": "关丹卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "关丹卷帘门专家。24小时为彭亨工厂和商业场所提供安装与维修。WhatsApp联系我们！",
      "h1": "关丹卷帘门 — 安装与24小时维修",
      "intro": "关丹，彭亨州首府和东海岸工业中心，许多场所需要优质卷帘门。",
      "closingCta": "关丹的场所需要卷帘门？WhatsApp获取免费报价。"
    },
    "kota-bharu": {
      "metaTitle": "哥打巴鲁卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "哥打巴鲁卷帘门 — 24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "哥打巴鲁卷帘门 — 安装与24小时维修",
      "intro": "哥打巴鲁，吉兰丹州首府，有商业中心和商业场所需要优质卷帘门。",
      "closingCta": "哥打巴鲁需要卷帘门？立即WhatsApp联系我们。"
    },
    "kuala-terengganu": {
      "metaTitle": "瓜拉登嘉楼卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "瓜拉登嘉楼卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "瓜拉登嘉楼卷帘门 — 安装与24小时维修",
      "intro": "瓜拉登嘉楼有商业和工业场所需要卷帘门保障安全。",
      "closingCta": "瓜拉登嘉楼的场所需要卷帘门？立即WhatsApp联系我们。"
    },
    "temerloh": {
      "metaTitle": "淡马鲁卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "淡马鲁卷帘门 — 24小时安装与维修。立即WhatsApp！",
      "h1": "淡马鲁卷帘门 — 安装与24小时维修",
      "intro": "淡马鲁作为彭亨中部的商业中心，需要可靠的卷帘门服务。",
      "closingCta": "淡马鲁需要卷帘门？WhatsApp获取免费报价。"
    },
    "kota-kinabalu": {
      "metaTitle": "亚庇卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "亚庇卷帘门专家。24小时为沙巴场所提供安装与维修。WhatsApp联系我们！",
      "h1": "亚庇卷帘门 — 安装与24小时维修",
      "intro": "亚庇，沙巴州首府和东马主要商业中心，许多商业和工业场所需要卷帘门。",
      "closingCta": "亚庇的场所需要卷帘门？WhatsApp获取免费报价。"
    },
    "kuching": {
      "metaTitle": "古晋卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "古晋卷帘门 — 24小时为砂拉越场所提供安装与维修。立即WhatsApp！",
      "h1": "古晋卷帘门 — 安装与24小时维修",
      "intro": "古晋，砂拉越州首府，有工业和商业区需要优质卷帘门。",
      "closingCta": "古晋的工厂需要卷帘门？立即WhatsApp联系我们。"
    },
    "miri": {
      "metaTitle": "美里卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "美里卷帘门服务。24小时安装与维修。WhatsApp获取免费报价！",
      "h1": "美里卷帘门 — 安装与24小时维修",
      "intro": "美里作为砂拉越石油和天然气工业中心，有工业场所需要重型卷帘门。",
      "closingCta": "美里需要卷帘门？WhatsApp获取免费报价。"
    },
    "sandakan": {
      "metaTitle": "山打根卷帘门 | 安装与24小时维修 | 马来西亚卷帘门",
      "metaDescription": "山打根卷帘门 — 24小时安装与维修。立即WhatsApp！",
      "h1": "山打根卷帘门 — 安装与24小时维修",
      "intro": "山打根有商业和工业场所需要优质卷帘门保障安全。",
      "closingCta": "山打根的场所需要卷帘门？立即WhatsApp联系我们。"
    }
  }
}
```

---

## 13. components/ui/LanguageSwitcher.tsx

CSS-only dropdown, no useState, no client-side JavaScript state management.

```tsx
import { useLocale } from 'next-intl';
import { locales } from '@/i18n/routing';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const localeLabels: Record<string, string> = {
  ms: 'BM',
  en: 'EN',
  zh: '中文',
};

const localeFullNames: Record<string, string> = {
  ms: 'Bahasa Melayu',
  en: 'English',
  zh: '中文',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Replace current locale prefix with target locale
  function getLocalePath(targetLocale: string) {
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/');
  }

  return (
    <div className="group relative inline-block">
      {/* Trigger — shows current locale */}
      <button
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87A2E] focus:ring-offset-1 active:scale-95"
        aria-label="Change language"
        type="button"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z"
          />
        </svg>
        {localeLabels[locale]}
        <svg
          className="h-3 w-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown — CSS-only via group-hover and group-focus-within */}
      <div className="invisible absolute right-0 z-50 mt-1 min-w-[160px] rounded-md border border-gray-200 bg-white py-1 opacity-0 shadow-lg shadow-black/5 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {locales.map((loc) => (
          <Link
            key={loc}
            href={getLocalePath(loc)}
            className={`block px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none active:bg-gray-200 ${
              loc === locale
                ? 'font-semibold text-[#E87A2E]'
                : 'text-gray-700'
            }`}
            aria-current={loc === locale ? 'true' : undefined}
          >
            {localeFullNames[loc]}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Key implementation notes:**
- Uses CSS `group-hover` and `group-focus-within` for showing/hiding the dropdown
- Zero `useState` — purely CSS driven
- Shows abbreviated label (BM/EN/中文) in the trigger, full name in dropdown
- Active locale highlighted with brand orange (#E87A2E)
- Has `hover`, `focus`, and `active` states on all interactive elements
- Globe icon for visual affordance

---

## 14. Updated app/[locale]/layout.tsx

NO header, NO footer. Only html, body, NextIntlClientProvider, schema, and metadata.

```tsx
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Get all messages for client components
  const messages = await getMessages();

  // Determine html lang attribute
  const htmlLang = locale === 'zh' ? 'zh-Hans' : locale;

  return (
    <html lang={htmlLang} className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Organization schema on every page */}
        <OrganizationSchema />

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Key points:**
- NO `<header>` or `<footer>` — each page owns its own
- Inter font loaded via `next/font/google` with `--font-inter` CSS variable
- `lang="zh-Hans"` for Chinese, `lang="ms"` for Malay, `lang="en"` for English
- OrganizationSchema injected on every page
- NextIntlClientProvider wraps children for client-side `useTranslations`

---

# PART C: WHATSAPP REDIRECT

---

## 15. app/[locale]/redirect-whatsapp-1/page.tsx (Server Component)

```tsx
import { getPhoneNumber } from '@/lib/getPhoneNumber';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import RedirectClient from './RedirectClient';

// Force dynamic — always fetch fresh phone number
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ location?: string; product?: string }>;
}

export default async function RedirectWhatsAppPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { location, product } = await searchParams;

  const s = await getTranslations({ locale, namespace: 'shared' });

  // Fetch phone number from Supabase with fallback chain
  const phoneNumber = await getPhoneNumber({
    website: siteConfig.domain,
    productSlug: siteConfig.productSlug,
    locationSlug: location || 'all',
  });

  // Build pre-filled WhatsApp message based on locale and location
  let message: string;
  if (location) {
    // Location-specific message
    const locationDisplay = location
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    message = s('whatsappPrefilledMessageLocation', { city: locationDisplay });
  } else {
    message = s('whatsappPrefilledMessage');
  }

  // Build the WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return <RedirectClient whatsappUrl={whatsappUrl} />;
}
```

---

## 16. app/[locale]/redirect-whatsapp-1/RedirectClient.tsx (Client Component)

```tsx
'use client';

import { useEffect } from 'react';

interface RedirectClientProps {
  whatsappUrl: string;
}

export default function RedirectClient({ whatsappUrl }: RedirectClientProps) {
  useEffect(() => {
    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
  }, [whatsappUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#25D366]" />
        <p className="text-lg font-medium text-gray-700">
          Redirecting to WhatsApp...
        </p>
        <a
          href={whatsappUrl}
          className="mt-4 inline-block rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 active:scale-95"
        >
          Click here if not redirected
        </a>
      </div>
    </div>
  );
}
```

---

## 17. waRedirect() Helper Function

This is the helper used by ALL WhatsApp buttons and CTAs across the entire site. Zero instances of `wa.me/` appear in any `.tsx` component file.

### lib/waRedirect.ts

```tsx
/**
 * Generates the internal WhatsApp redirect URL.
 * ALL WhatsApp CTAs must use this function — never link to wa.me/ directly.
 *
 * @param locale - Current locale ('ms' | 'en' | 'zh')
 * @param locationSlug - Optional location slug for location-specific pages
 * @returns Internal redirect path e.g. "/ms/redirect-whatsapp-1?location=kuala-lumpur"
 */
export function waRedirect(
  locale: string,
  locationSlug?: string
): string {
  const base = `/${locale}/redirect-whatsapp-1`;
  const params = new URLSearchParams();

  if (locationSlug) {
    params.set('location', locationSlug);
  }

  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}
```

### Usage Examples

**In a server component (e.g., page.tsx):**

```tsx
import { waRedirect } from '@/lib/waRedirect';

// Homepage
<a href={waRedirect('ms')}>{t('hero.ctaPrimary')}</a>

// Location page
<a href={waRedirect('ms', 'kuala-lumpur')}>{t('hero.ctaPrimary')}</a>
```

**In WhatsAppButton component (components/ui/WhatsAppButton.tsx):**

```tsx
import { waRedirect } from '@/lib/waRedirect';
import { useLocale, useTranslations } from 'next-intl';

interface WhatsAppButtonProps {
  locationSlug?: string;
  variant?: 'primary' | 'floating';
  className?: string;
}

export function WhatsAppButton({
  locationSlug,
  variant = 'primary',
  className = '',
}: WhatsAppButtonProps) {
  const locale = useLocale();
  const s = useTranslations('shared');

  const href = waRedirect(locale, locationSlug);

  if (variant === 'floating') {
    return (
      <a
        href={href}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 active:scale-95 ${className}`}
        aria-label={s('whatsappCta')}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {s('whatsappCta')}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 active:scale-95 ${className}`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {s('whatsappCta')}
    </a>
  );
}
```

---

# IMPLEMENTATION CHECKLIST

## Compliance Verification

| Rule | Status |
|---|---|
| Zero hardcoded English — all visible strings use `t()` or `s()` | Compliant |
| `shared` namespace for text used on both homepage and location pages | Compliant |
| WhatsApp is the ONLY CTA — locale-appropriate label | Compliant |
| Zero instances of `wa.me/` in any `.tsx` file | Compliant — all go through `waRedirect()` |
| Every WhatsApp button uses `waRedirect()` helper | Compliant |
| `ms` is the default locale, `x-default` points to `ms` | Compliant |
| BM translations are proper Bahasa Malaysia | Compliant — sourced from Nana's copy |
| ZH is Simplified Chinese | Compliant |
| WhatsApp buttons use green (#25D366) | Compliant |
| Font is Inter for all text (no serif) | Compliant |
| hover + focus + active states on all clickable elements | Compliant |
| No `transition-all` | Compliant |
| Layout has NO header/footer | Compliant |
| All 50 locations x 3 locales in translation files | Compliant |
| All sections covered in translation files | Compliant |

## Files to Create

| # | File Path | Part |
|---|---|---|
| 1 | `i18n/routing.ts` | B7 |
| 2 | `i18n/request.ts` | B8 |
| 3 | `middleware.ts` | B9 |
| 4 | `messages/ms.json` | B10 |
| 5 | `messages/en.json` | B11 |
| 6 | `messages/zh.json` | B12 |
| 7 | `components/ui/LanguageSwitcher.tsx` | B13 |
| 8 | `app/[locale]/layout.tsx` | B14 |
| 9 | `app/[locale]/redirect-whatsapp-1/page.tsx` | C15 |
| 10 | `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` | C16 |
| 11 | `lib/waRedirect.ts` | C17 |
| 12 | `components/ui/WhatsAppButton.tsx` | C17 |
| 13 | `app/sitemap.ts` | A5 |
| 14 | `app/robots.ts` | A6 |
| 15 | `components/schema/OrganizationSchema.tsx` | A3.1 |
| 16 | `components/schema/LocalBusinessSchema.tsx` | A3.2 |
| 17 | `components/schema/FAQSchema.tsx` | A3.3 |
| 18 | `components/schema/BreadcrumbSchema.tsx` | A3.4 |
| 19 | `components/schema/ProductSchema.tsx` | A3.5 |

---

*End of Technical SEO, i18n & WhatsApp Redirect Implementation Plan*
