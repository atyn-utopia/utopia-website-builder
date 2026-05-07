# Technical SEO + i18n Spec — Skylift Malaysia

> **Author:** Kimmy (Technical Implementation Specialist)
> **Project slug:** `skylift-malaysia`
> **Domain:** `skylift-malaysia.vercel.app`
> **Locales:** `en` (default), `ms`, `zh`
> **Product slug:** `skylift`
> **Phone (single mode):** `60139499318`
> **Reference baseline:** `projects/electrician-24-hour/`

This document is a drop-in spec for the orchestrator. Every block below is a complete, copy-ready file. Apply files at the listed paths under `projects/skylift-malaysia/`.

The spec respects every CLAUDE.md hard rule: one H1 + one H2 per page (in hero), no phone numbers / domain text in visible UI, WhatsApp green (`#25D366`) is the only WhatsApp affordance, FOMO + USP bar are mandatory, and tracking script `data-website` matches the deployed domain exactly.

---

## 1. `i18n/routing.ts`

```ts
// projects/skylift-malaysia/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

---

## 2. `i18n/request.ts`

```ts
// projects/skylift-malaysia/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

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

## 3. `middleware.ts`

```ts
// projects/skylift-malaysia/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
```

---

## 4. `messages/en.json`

```json
{
  "metadata": {
    "title": "Skylift Rental Malaysia | Daily Rate from RM500 with Operator | Skylift Malaysia",
    "description": "Skylift rental across Malaysia from RM500/half-day. 9m, 20m, 24m, 32m boom + Spider lift with certified operator. Same-day delivery KL & Selangor. Chat on WhatsApp."
  },
  "nav": {
    "brandName": "Skylift Malaysia",
    "home": "Home",
    "products": "Skylift Units",
    "locations": "Locations",
    "blog": "Blog",
    "ctaButton": "WhatsApp Us"
  },
  "fomoBanner": {
    "label": "Today's promo ends in",
    "pill": "Free same-day delivery KL & Selangor",
    "bookNow": "WhatsApp Tempahan"
  },
  "hero": {
    "h1": "Skylift Rental Malaysia",
    "h2": "Daily-Rate Aerial Lifts with Certified Operators — Same-Day KL & Selangor",
    "supporting": "From 9-metre indoor units up to a 32-metre boom — every booking arrives with a trained operator and full insurance.",
    "ctaPrimary": "WhatsApp Tempahan",
    "ctaSecondary": "See Skylift Units",
    "trustBadge": "CIDB Certified · MOSHA Trained · 5.0★ on Google",
    "imageAlt": "Skylift Rental Malaysia — certified site supervisor"
  },
  "usp": {
    "items": [
      {
        "title": "Daily Rate from RM500",
        "description": "Half-day pricing on 20m and 24m units. No hidden setup or fuel charges."
      },
      {
        "title": "Same-Day Delivery",
        "description": "Booked before 11am, on your KL or Selangor site by afternoon."
      },
      {
        "title": "Trained Operator Included",
        "description": "Every unit comes with a CIDB-trained, MOSHA-aware skylift operator."
      }
    ]
  },
  "products": {
    "heading": "Skylift Units We Rent Out",
    "subheading": "Five rental categories cover every job — from low-ceiling indoor work to billboards and stadium lights. Pick the height, we send the truck and the operator.",
    "cta": "WhatsApp for a Quote",
    "priceFromLabel": "From",
    "halfDayLabel": "half-day",
    "fullDayLabel": "full-day"
  },
  "howItWorks": {
    "heading": "5 Minit Tempahan, Skylift Sampai Hari Sama",
    "subheading": "From WhatsApp message to skylift on site — four steps, no paperwork.",
    "steps": [
      {
        "title": "WhatsApp the Job",
        "description": "Share location, height, work type and a photo of the site."
      },
      {
        "title": "Get a Quote",
        "description": "Clear daily / half-day rate — operator and transport included."
      },
      {
        "title": "Confirm + Deposit",
        "description": "A small booking deposit locks your slot."
      },
      {
        "title": "Skylift Arrives Same Day",
        "description": "Operator briefs the site team and starts work."
      }
    ]
  },
  "risk": {
    "heading": "What Goes Wrong Without the Right Skylift",
    "subheading": "A wrong-height ladder, a non-certified operator or a too-short boom is how injuries, delays and re-do bills happen.",
    "points": [
      {
        "title": "Ladders Fail at Height",
        "description": "DOSH statistics show falls from height are the #1 cause of construction fatalities in Malaysia."
      },
      {
        "title": "Wrong Height = Lost Day",
        "description": "A 20m boom on a 24m job means renting twice and paying transport twice."
      },
      {
        "title": "Untrained Operators Void Insurance",
        "description": "Only CIDB-certified skylift operators keep your project's site insurance valid."
      }
    ]
  },
  "midCta": {
    "heading": "Need a Skylift on Site Today?",
    "subheading": "WhatsApp now — operator dispatched within hours across KL and Selangor.",
    "cta": "WhatsApp Tempahan Sekarang"
  },
  "reviews": {
    "heading": "What Our Site Supervisors Say",
    "subheading": "5.0★ from 80+ Google Reviews",
    "rating": "5.0",
    "googleLabel": "Google Reviews",
    "items": [
      {
        "name": "Faiz",
        "location": "Shah Alam",
        "rating": 5,
        "text": "Booked the 20m on Tuesday morning, on site by 2pm. Operator knew exactly how to position for our shoplot signage. Will call again."
      },
      {
        "name": "Ms Tan",
        "location": "Petaling Jaya",
        "rating": 5,
        "text": "Spider lift was the only way we could service the chandelier in our hotel atrium. Clean tracks, no damage to the marble."
      },
      {
        "name": "Daniel",
        "location": "Cheras",
        "rating": 5,
        "text": "Used the 24m for a billboard install — operator handled the flagman briefing himself. Saved us a separate hire."
      },
      {
        "name": "Encik Razak",
        "location": "Klang",
        "rating": 5,
        "text": "Half-day rate on the 20m for an aircond servicing job. Cheaper than the previous vendor and on time. Done."
      },
      {
        "name": "Mei Ling",
        "location": "Subang Jaya",
        "rating": 5,
        "text": "Indoor 9m lift fit through our warehouse roller door. Smooth operator, finished the high-bay light replacement in 3 hours."
      },
      {
        "name": "Hafiz",
        "location": "Kuala Lumpur",
        "rating": 5,
        "text": "32m for stadium floodlights — they coordinated with our security and finished before the night match. Pro outfit."
      }
    ]
  },
  "whyChoose": {
    "heading": "Why Contractors Across Malaysia Pick Skylift Malaysia",
    "items": [
      { "title": "Largest Klang Valley Fleet", "description": "9m, 20m, 24m, 32m and Spider all under one roof." },
      { "title": "CIDB & MOSHA-Trained Operators", "description": "Every operator holds a valid Malaysian skylift cert." },
      { "title": "Insurance-Covered Jobs", "description": "Public liability cover on every booking, no extra fee." },
      { "title": "Half-Day Rate Available", "description": "Pay for what you actually use — most short jobs are half-day." },
      { "title": "Multi-State Coverage", "description": "KL, Selangor, Putrajaya, Penang, Johor and 9 more states." },
      { "title": "EN / BM / Mandarin Support", "description": "Talk to us in the language your site team speaks." }
    ]
  },
  "gallery": {
    "heading": "Recent Skylift Jobs Across Malaysia",
    "subheading": "Every photo is from an actual rental — nothing stock.",
    "captions": [
      "Billboard install along Federal Highway",
      "Stadium floodlight replacement, Bukit Jalil",
      "Shoplot signage, Petaling Jaya",
      "Warehouse high-bay light service",
      "Glass facade cleaning, KLCC area",
      "Mall atrium chandelier service",
      "Telecom tower antenna check",
      "Industrial chimney inspection",
      "Roof gutter clearance, Cheras",
      "Tree trimming, Damansara residential",
      "Street lighting MBPJ contract",
      "Factory exhaust fan replacement",
      "Hotel exterior re-paint, Mont Kiara",
      "Airport hangar lighting service",
      "Petrol station canopy works",
      "School hall ceiling repaint"
    ]
  },
  "locations": {
    "heading": "We Cover All Major Areas in Malaysia",
    "subheading": "13 states, 160+ towns. Click your state to see covered sub-locations.",
    "viewAll": "View All Cities",
    "stateIntros": {
      "klang-valley": "Same-day delivery zone. KL, PJ, Shah Alam, Subang, Putrajaya, Cyberjaya and the Klang corridor.",
      "selangor": "Sepang, Banting, Kuala Selangor, Hulu Selangor and the western coastline.",
      "negeri-sembilan": "Seremban, Nilai, Port Dickson and the southern industrial belt.",
      "melaka": "Melaka heritage zone plus Alor Gajah and Jasin districts.",
      "johor": "Johor Bahru, Iskandar Puteri, Kulai, Batu Pahat, Muar — Iskandar industrial zone covered.",
      "perak": "Ipoh, Taiping, Sitiawan, Kampar, Teluk Intan, Kuala Kangsar.",
      "penang": "George Town, Butterworth, Bukit Mertajam, Bayan Lepas — both island and mainland.",
      "kedah": "Alor Setar, Sungai Petani, Kulim Hi-Tech and Langkawi services.",
      "perlis": "Kangar, Arau, Padang Besar and northern border towns.",
      "kelantan": "Kota Bharu, Pasir Mas, Kuala Krai, Gua Musang inland coverage.",
      "terengganu": "Kuala Terengganu, Kemaman, Dungun, Paka petrochemical zone.",
      "pahang": "Kuantan, Temerloh, Bentong, Cameron Highlands, Kuala Lipis.",
      "sabah": "Kota Kinabalu, Sandakan, Tawau, Lahad Datu — coordinated barge transport.",
      "sarawak": "Kuching, Miri, Bintulu, Sibu — local depot partnerships."
    }
  },
  "faq": {
    "heading": "Frequently Asked Questions",
    "items": [
      {
        "question": "How is skylift rental priced in Malaysia?",
        "answer": "Most bookings are charged half-day or full-day. Our 20m and 24m boom lifts start at RM500 half-day and RM620–RM650 full-day. Transport, fuel and a certified operator are included — no hidden charges."
      },
      {
        "question": "Can you deliver same day in KL & Selangor?",
        "answer": "Yes — confirm before 11am and we deploy by afternoon to anywhere in the Klang Valley. Outside Selangor, same-day is possible if our nearest depot has the unit you need."
      },
      {
        "question": "Is an operator included in the rental?",
        "answer": "Always. Every skylift hire from us comes with a CIDB-registered, MOSHA-aware operator at no extra fee. We do not rent units to non-certified drivers."
      },
      {
        "question": "What payment methods do you accept?",
        "answer": "Online transfer (DuitNow, FPX, instant transfer), cash on delivery for small bookings, and corporate invoicing for repeat clients. A booking deposit is required to lock your slot."
      },
      {
        "question": "Which states do you cover?",
        "answer": "All 13 Malaysian states plus the Federal Territories. Klang Valley jobs are direct from our KL/Selangor depot; East Malaysia is served via our Sabah and Sarawak partners."
      },
      {
        "question": "Do I need to pay a deposit?",
        "answer": "Yes — a small refundable deposit confirms the booking. The balance is paid on completion. For longer hires we agree milestone payments."
      },
      {
        "question": "Are your jobs insured against accidents?",
        "answer": "Yes — every booking comes with public liability insurance on the unit and operator. Site-specific insurance riders are available on request."
      },
      {
        "question": "What happens if I need to cancel?",
        "answer": "Cancel 24 hours before the slot — full refund of the deposit. Cancel on the day — deposit covers our dispatch cost. We never charge cancellation penalties beyond the deposit."
      }
    ]
  },
  "finalCta": {
    "heading": "Skylift Booked. Operator Dispatched. Job Done by Sundown.",
    "subheading": "WhatsApp us now — half-day pricing, certified operator, same-day delivery across KL & Selangor.",
    "cta": "WhatsApp Tempahan Sekarang"
  },
  "footer": {
    "brandName": "Skylift Malaysia",
    "tagline": "Daily-rate aerial lifts with certified operators, nationwide.",
    "unitsHeading": "Skylift Units",
    "topLocationsHeading": "Top Locations",
    "resourcesHeading": "Resources",
    "blog": "Blog",
    "siteSafety": "Site Safety",
    "operatorCert": "Operator Cert",
    "copyright": "© 2026 Skylift Malaysia. All rights reserved.",
    "ssm": "Scaffolding Malaysia Sdn. Bhd. — SSM Registered"
  },
  "blog": {
    "title": "Skylift Rental Insights & Site Safety Guides",
    "metaTitle": "Skylift Blog — Rental Tips & Aerial Work Safety | Skylift Malaysia",
    "metaDescription": "Skylift rental guides, aerial work safety standards, CIDB and MOSHA compliance, plus use-case tips for billboard, stadium and warehouse jobs in Malaysia.",
    "readMore": "Read More",
    "recentPosts": "Recent Posts",
    "publishedOn": "Published",
    "minRead": "min read",
    "backToBlog": "← Back to Blog",
    "noPosts": "New articles coming soon.",
    "sharePre": "Share this article",
    "breadcrumbHome": "Home",
    "breadcrumbBlog": "Blog"
  },
  "location": {
    "h1Prefix": "Skylift Rental in",
    "h2Prefix": "Same-Day Delivery and Certified Operator in",
    "metaTitleSuffix": "| 9m / 20m / 24m / 32m / Spider Lift | Skylift Malaysia",
    "metaDescPrefix": "Skylift rental in",
    "metaDescSuffix": "— 9m to 32m boom lifts and Spider Lift with certified operator. Daily rate from RM500. Same-day delivery. Chat on WhatsApp now.",
    "breadcrumbHome": "Home",
    "breadcrumbProduct": "Skylift Rental",
    "introHeading": "About Skylift Rental in",
    "whyHeading": "Why Skylift Malaysia in",
    "nearbyTitle": "Nearby Areas We Cover",
    "nearbySubtitle": "We also dispatch same-day to these surrounding areas",
    "ctaHeading": "Need a Skylift in",
    "ctaSuffix": "Today?"
  },
  "shared": {
    "whatsappCta": "WhatsApp Tempahan",
    "whatsappCtaShort": "WhatsApp Us",
    "viewAll": "View All",
    "learnMore": "Learn More",
    "from": "From",
    "halfDay": "half-day",
    "fullDay": "full-day",
    "dailyRate": "Daily Rate",
    "withOperator": "with Operator",
    "sameDay": "Same-Day",
    "klSelangor": "KL & Selangor",
    "cidbCertified": "CIDB Certified",
    "moshaTrained": "MOSHA Trained",
    "perDay": "/ day"
  }
}
```

---

## 5. `messages/ms.json`

```json
{
  "metadata": {
    "title": "Sewa Skylift Malaysia | Harga Murah dari RM500 | Skylift Malaysia",
    "description": "Sewa skylift seluruh Malaysia dari RM500 separuh hari. Unit 9m, 20m, 24m, 32m & Spider Lift dengan operator bertauliah. Hantar hari sama KL & Selangor. Tempah WhatsApp 5 minit."
  },
  "nav": {
    "brandName": "Skylift Malaysia",
    "home": "Laman Utama",
    "products": "Unit Skylift",
    "locations": "Lokasi",
    "blog": "Blog",
    "ctaButton": "WhatsApp Kami"
  },
  "fomoBanner": {
    "label": "Promosi hari ini tamat dalam",
    "pill": "Hantar percuma hari sama KL & Selangor",
    "bookNow": "WhatsApp Tempahan"
  },
  "hero": {
    "h1": "Sewa Skylift Malaysia",
    "h2": "Sewa Skylift Murah Bersama Operator Bertauliah — Hantar Hari Sama KL & Selangor",
    "supporting": "Dari unit indoor 9 meter sehingga boom 32 meter — setiap tempahan datang dengan operator terlatih dan insurans penuh.",
    "ctaPrimary": "WhatsApp Tempahan",
    "ctaSecondary": "Lihat Unit Skylift",
    "trustBadge": "Bertauliah CIDB · Latihan MOSHA · 5.0★ di Google",
    "imageAlt": "Sewa Skylift Malaysia — penyelia tapak bertauliah"
  },
  "usp": {
    "items": [
      {
        "title": "Harga Mula RM500 Sehari",
        "description": "Kadar separuh hari untuk unit 20m dan 24m. Tiada caj tersembunyi."
      },
      {
        "title": "Hantar Hari Sama",
        "description": "Tempah sebelum 11 pagi, sampai di tapak KL/Selangor petang itu juga."
      },
      {
        "title": "Operator Bertauliah Disertakan",
        "description": "Setiap unit datang dengan operator skylift terlatih CIDB."
      }
    ]
  },
  "products": {
    "heading": "Unit Skylift Yang Kami Sewakan",
    "subheading": "Lima kategori sewaan menampung setiap jenis kerja — dari ruang dalaman siling rendah sehingga billboard dan lampu stadium. Pilih ketinggian, kami hantar lori dan operator.",
    "cta": "WhatsApp Untuk Sebut Harga",
    "priceFromLabel": "Mula",
    "halfDayLabel": "separuh hari",
    "fullDayLabel": "sehari penuh"
  },
  "howItWorks": {
    "heading": "5 Minit Tempah, Skylift Sampai Hari Sama",
    "subheading": "Dari mesej WhatsApp ke skylift di tapak — empat langkah, tanpa kertas kerja.",
    "steps": [
      {
        "title": "WhatsApp Kerja Anda",
        "description": "Kongsi lokasi, ketinggian, jenis kerja dan gambar tapak."
      },
      {
        "title": "Dapatkan Sebut Harga",
        "description": "Kadar harian / separuh hari yang jelas — operator dan pengangkutan termasuk."
      },
      {
        "title": "Sahkan + Bayar Deposit",
        "description": "Deposit kecil mengunci slot anda."
      },
      {
        "title": "Skylift Sampai Hari Sama",
        "description": "Operator beri taklimat kepada pasukan tapak dan mula bekerja."
      }
    ]
  },
  "risk": {
    "heading": "Apa Yang Berlaku Tanpa Skylift Yang Betul",
    "subheading": "Tangga yang salah ketinggian, operator tak bertauliah, atau boom yang terlalu pendek — itulah punca kemalangan, kelewatan dan bil ulang kerja.",
    "points": [
      {
        "title": "Tangga Gagal Pada Ketinggian",
        "description": "Statistik DOSH menunjukkan jatuh dari ketinggian adalah penyebab #1 kematian pembinaan di Malaysia."
      },
      {
        "title": "Ketinggian Salah = Hari Hilang",
        "description": "Boom 20m untuk kerja 24m bermakna sewa dua kali dan bayar pengangkutan dua kali."
      },
      {
        "title": "Operator Tak Terlatih Batalkan Insurans",
        "description": "Hanya operator skylift bertauliah CIDB mengekalkan insurans tapak projek anda."
      }
    ]
  },
  "midCta": {
    "heading": "Perlu Skylift Di Tapak Hari Ini?",
    "subheading": "WhatsApp sekarang — operator dihantar dalam beberapa jam ke seluruh KL dan Selangor.",
    "cta": "WhatsApp Tempahan Sekarang"
  },
  "reviews": {
    "heading": "Kata Penyelia Tapak Kami",
    "subheading": "5.0★ daripada 80+ ulasan Google",
    "rating": "5.0",
    "googleLabel": "Ulasan Google",
    "items": [
      {
        "name": "Faiz",
        "location": "Shah Alam",
        "rating": 5,
        "text": "Tempah 20m pagi Selasa, sampai tapak pukul 2 petang. Operator tahu cara letak untuk papan tanda kedai kami. Pasti tempah lagi."
      },
      {
        "name": "Pn Tan",
        "location": "Petaling Jaya",
        "rating": 5,
        "text": "Spider lift saja yang boleh masuk untuk service candelier atrium hotel kami. Track bersih, tiada kerosakan pada marmar."
      },
      {
        "name": "Daniel",
        "location": "Cheras",
        "rating": 5,
        "text": "Guna 24m untuk pasang billboard — operator uruskan taklimat flagman sendiri. Jimat sewa berasingan."
      },
      {
        "name": "Encik Razak",
        "location": "Klang",
        "rating": 5,
        "text": "Kadar separuh hari untuk service aircond. Lebih murah dari vendor lama dan tepat masa."
      },
      {
        "name": "Mei Ling",
        "location": "Subang Jaya",
        "rating": 5,
        "text": "Lift 9m indoor muat ikut roller door gudang. Operator lancar, siap tukar lampu high-bay dalam 3 jam."
      },
      {
        "name": "Hafiz",
        "location": "Kuala Lumpur",
        "rating": 5,
        "text": "32m untuk lampu stadium — koordinasi dengan security kami dan siap sebelum perlawanan malam. Pasukan profesional."
      }
    ]
  },
  "whyChoose": {
    "heading": "Kenapa Kontraktor Seluruh Malaysia Pilih Skylift Malaysia",
    "items": [
      { "title": "Armada Terbesar Lembah Klang", "description": "9m, 20m, 24m, 32m dan Spider semua di bawah satu bumbung." },
      { "title": "Operator Terlatih CIDB & MOSHA", "description": "Setiap operator pegang sijil skylift Malaysia yang sah." },
      { "title": "Kerja Dilindungi Insurans", "description": "Public liability untuk setiap tempahan, tanpa caj tambahan." },
      { "title": "Kadar Separuh Hari Tersedia", "description": "Bayar untuk apa yang anda guna sahaja." },
      { "title": "Liputan Multi-Negeri", "description": "KL, Selangor, Putrajaya, Pulau Pinang, Johor dan 9 negeri lain." },
      { "title": "Sokongan BM / English / Mandarin", "description": "Bercakap dalam bahasa pasukan tapak anda." }
    ]
  },
  "gallery": {
    "heading": "Kerja Skylift Terkini Seluruh Malaysia",
    "subheading": "Setiap gambar adalah dari kerja sebenar — bukan stock.",
    "captions": [
      "Pasang billboard Lebuhraya Persekutuan",
      "Tukar lampu stadium, Bukit Jalil",
      "Papan tanda kedai, Petaling Jaya",
      "Service lampu high-bay gudang",
      "Cuci fasad kaca, kawasan KLCC",
      "Service candelier atrium kompleks",
      "Pemeriksaan antena menara telco",
      "Pemeriksaan cerobong industri",
      "Bersih longkang bumbung, Cheras",
      "Pemangkasan pokok, Damansara",
      "Lampu jalan kontrak MBPJ",
      "Tukar kipas ekzos kilang",
      "Cat semula luar hotel, Mont Kiara",
      "Service lampu hangar lapangan terbang",
      "Kerja kanopi stesen minyak",
      "Cat semula siling dewan sekolah"
    ]
  },
  "locations": {
    "heading": "Kami Liputi Semua Kawasan Utama Malaysia",
    "subheading": "13 negeri, 160+ kawasan. Klik negeri anda untuk melihat sub-lokasi.",
    "viewAll": "Lihat Semua Kawasan",
    "stateIntros": {
      "klang-valley": "Zon hantar hari sama. KL, PJ, Shah Alam, Subang, Putrajaya, Cyberjaya dan koridor Klang.",
      "selangor": "Sepang, Banting, Kuala Selangor, Hulu Selangor dan persisiran barat.",
      "negeri-sembilan": "Seremban, Nilai, Port Dickson dan sektor industri selatan.",
      "melaka": "Zon warisan Melaka, Alor Gajah dan daerah Jasin.",
      "johor": "Johor Bahru, Iskandar Puteri, Kulai, Batu Pahat, Muar — zon industri Iskandar.",
      "perak": "Ipoh, Taiping, Sitiawan, Kampar, Teluk Intan, Kuala Kangsar.",
      "penang": "George Town, Butterworth, Bukit Mertajam, Bayan Lepas — pulau dan tanah besar.",
      "kedah": "Alor Setar, Sungai Petani, Kulim Hi-Tech dan perkhidmatan Langkawi.",
      "perlis": "Kangar, Arau, Padang Besar dan pekan sempadan utara.",
      "kelantan": "Kota Bharu, Pasir Mas, Kuala Krai, Gua Musang liputan pedalaman.",
      "terengganu": "Kuala Terengganu, Kemaman, Dungun, Paka zon petrokimia.",
      "pahang": "Kuantan, Temerloh, Bentong, Cameron Highlands, Kuala Lipis.",
      "sabah": "Kota Kinabalu, Sandakan, Tawau, Lahad Datu — pengangkutan tongkang dikoordinasi.",
      "sarawak": "Kuching, Miri, Bintulu, Sibu — kerjasama depot tempatan."
    }
  },
  "faq": {
    "heading": "Soalan Lazim",
    "items": [
      {
        "question": "Bagaimana harga sewa skylift dikira di Malaysia?",
        "answer": "Kebanyakan tempahan dikenakan kadar separuh hari atau sehari penuh. Boom 20m dan 24m kami bermula RM500 separuh hari dan RM620–RM650 sehari penuh. Pengangkutan, minyak dan operator bertauliah semua termasuk — tiada caj tersembunyi."
      },
      {
        "question": "Boleh hantar hari sama di KL & Selangor?",
        "answer": "Ya — sahkan sebelum 11 pagi dan kami hantar petang itu juga ke mana-mana di Lembah Klang. Di luar Selangor, hari sama boleh dilakukan jika depot terdekat ada unit yang anda perlukan."
      },
      {
        "question": "Adakah operator termasuk dalam sewaan?",
        "answer": "Sentiasa. Setiap sewa skylift datang dengan operator berdaftar CIDB tanpa caj tambahan. Kami tidak menyewakan unit kepada pemandu tak bertauliah."
      },
      {
        "question": "Apakah kaedah pembayaran yang diterima?",
        "answer": "Pemindahan online (DuitNow, FPX, transfer segera), tunai semasa hantar untuk tempahan kecil, dan invois korporat untuk pelanggan tetap. Deposit tempahan diperlukan untuk mengunci slot."
      },
      {
        "question": "Negeri mana yang anda liputi?",
        "answer": "Semua 13 negeri Malaysia berserta Wilayah Persekutuan. Kerja Lembah Klang dari depot KL/Selangor; Sabah & Sarawak dilayan melalui rakan tempatan kami."
      },
      {
        "question": "Adakah saya perlu bayar deposit?",
        "answer": "Ya — deposit kecil yang boleh dipulangkan mengesahkan tempahan. Baki dibayar selepas siap kerja. Untuk sewaan panjang kami atur bayaran berperingkat."
      },
      {
        "question": "Adakah kerja anda dilindungi insurans kemalangan?",
        "answer": "Ya — setiap tempahan datang dengan public liability insurance untuk unit dan operator. Rider insurans khusus tapak boleh diatur atas permintaan."
      },
      {
        "question": "Bagaimana jika saya perlu batal?",
        "answer": "Batal 24 jam sebelum slot — pulangan deposit penuh. Batal pada hari itu — deposit menampung kos hantar. Kami tidak kenakan penalti pembatalan melebihi deposit."
      }
    ]
  },
  "finalCta": {
    "heading": "Skylift Tempah. Operator Dihantar. Kerja Siap Sebelum Senja.",
    "subheading": "WhatsApp kami sekarang — kadar separuh hari, operator bertauliah, hantar hari sama seluruh KL & Selangor.",
    "cta": "WhatsApp Tempahan Sekarang"
  },
  "footer": {
    "brandName": "Skylift Malaysia",
    "tagline": "Sewa skylift kadar harian dengan operator bertauliah, seluruh negara.",
    "unitsHeading": "Unit Skylift",
    "topLocationsHeading": "Lokasi Utama",
    "resourcesHeading": "Sumber",
    "blog": "Blog",
    "siteSafety": "Keselamatan Tapak",
    "operatorCert": "Sijil Operator",
    "copyright": "© 2026 Skylift Malaysia. Hak cipta terpelihara.",
    "ssm": "Scaffolding Malaysia Sdn. Bhd. — Berdaftar SSM"
  },
  "blog": {
    "title": "Panduan Sewa Skylift & Keselamatan Kerja Tinggi",
    "metaTitle": "Blog Skylift — Panduan Sewa & Keselamatan Kerja Tinggi | Skylift Malaysia",
    "metaDescription": "Panduan sewa skylift, keselamatan kerja di tempat tinggi, pematuhan CIDB dan MOSHA, serta tip kes guna untuk billboard, stadium dan gudang di Malaysia.",
    "readMore": "Baca Lagi",
    "recentPosts": "Artikel Terkini",
    "publishedOn": "Diterbitkan",
    "minRead": "minit baca",
    "backToBlog": "← Kembali ke Blog",
    "noPosts": "Artikel baharu akan datang.",
    "sharePre": "Kongsi artikel ini",
    "breadcrumbHome": "Laman Utama",
    "breadcrumbBlog": "Blog"
  },
  "location": {
    "h1Prefix": "Sewa Skylift di",
    "h2Prefix": "Hantar Hari Sama dengan Operator Bertauliah di",
    "metaTitleSuffix": "| 9m, 20m, 24m, 32m & Spider | Skylift Malaysia",
    "metaDescPrefix": "Sewa skylift di",
    "metaDescSuffix": "— unit 9m hingga 32m & Spider Lift dengan operator bertauliah. Harga dari RM500 separuh hari. Hantar hari sama. Tempah WhatsApp.",
    "breadcrumbHome": "Laman Utama",
    "breadcrumbProduct": "Sewa Skylift",
    "introHeading": "Tentang Sewa Skylift di",
    "whyHeading": "Kenapa Skylift Malaysia di",
    "nearbyTitle": "Kawasan Berdekatan Yang Kami Liputi",
    "nearbySubtitle": "Kami juga hantar hari sama ke kawasan sekeliling ini",
    "ctaHeading": "Perlukan Skylift di",
    "ctaSuffix": "Hari Ini?"
  },
  "shared": {
    "whatsappCta": "WhatsApp Tempahan",
    "whatsappCtaShort": "WhatsApp Kami",
    "viewAll": "Lihat Semua",
    "learnMore": "Ketahui Lagi",
    "from": "Mula",
    "halfDay": "separuh hari",
    "fullDay": "sehari penuh",
    "dailyRate": "Kadar Harian",
    "withOperator": "dengan Operator",
    "sameDay": "Hari Sama",
    "klSelangor": "KL & Selangor",
    "cidbCertified": "Bertauliah CIDB",
    "moshaTrained": "Latihan MOSHA",
    "perDay": "/ hari"
  }
}
```

---

## 6. `messages/zh.json`

```json
{
  "metadata": {
    "title": "马来西亚高空车出租 | 半日RM500起，含操作员 | Skylift Malaysia",
    "description": "全马高空作业车租赁，半日RM500起。9米、20米、24米、32米伸缩臂 + 蜘蛛车，配持证操作员，吉隆坡雪兰莪当日送达。WhatsApp预订仅需5分钟。"
  },
  "nav": {
    "brandName": "Skylift Malaysia",
    "home": "首页",
    "products": "高空车型号",
    "locations": "服务地区",
    "blog": "博客",
    "ctaButton": "WhatsApp 联络我们"
  },
  "fomoBanner": {
    "label": "今日促销倒计时",
    "pill": "吉隆坡及雪兰莪当日免费送达",
    "bookNow": "WhatsApp 立即预订"
  },
  "hero": {
    "h1": "马来西亚高空车出租",
    "h2": "配持证操作员，吉隆坡及雪兰莪当日送达",
    "supporting": "从 9 米室内型到 32 米伸缩臂——每次预订都配备受训操作员与全保。",
    "ctaPrimary": "WhatsApp 立即预订",
    "ctaSecondary": "查看高空车型号",
    "trustBadge": "CIDB 持证 · MOSHA 受训 · 谷歌 5.0★",
    "imageAlt": "马来西亚高空车出租 — 持证工地主管"
  },
  "usp": {
    "items": [
      {
        "title": "每日租金 RM500 起",
        "description": "20 米及 24 米设有半日租，无隐藏费。"
      },
      {
        "title": "当日送达",
        "description": "上午 11 点前确认，下午即送至吉隆坡或雪兰莪工地。"
      },
      {
        "title": "持证操作员随车",
        "description": "每辆车均配 CIDB 与 MOSHA 受训操作员。"
      }
    ]
  },
  "products": {
    "heading": "我们出租的高空车型号",
    "subheading": "五种租赁分类涵盖各类作业——从低天花板室内工作到广告牌与体育场灯光。您选高度，我们派车与操作员。",
    "cta": "WhatsApp 询价",
    "priceFromLabel": "起",
    "halfDayLabel": "半日",
    "fullDayLabel": "全日"
  },
  "howItWorks": {
    "heading": "5 分钟预订，高空车当日送达",
    "subheading": "从 WhatsApp 信息到工地高空车——四步搞定，无需文件。",
    "steps": [
      {
        "title": "WhatsApp 发送作业资料",
        "description": "分享地点、高度、作业类型、照片。"
      },
      {
        "title": "获取报价",
        "description": "清楚的日租 / 半日租，含操作员与运输。"
      },
      {
        "title": "确认 + 付订金",
        "description": "小额订金锁定时段。"
      },
      {
        "title": "当日送达",
        "description": "操作员到场简报，立即开工。"
      }
    ]
  },
  "risk": {
    "heading": "没有合适高空车的后果",
    "subheading": "错误高度的梯子、未受训操作员、太短的伸缩臂——这就是工伤、延误与返工账单的来源。",
    "points": [
      {
        "title": "梯子在高处会失效",
        "description": "DOSH 数据显示高处坠落是马来西亚建筑业首位致命原因。"
      },
      {
        "title": "高度错=损失一天",
        "description": "用 20 米去做 24 米的活，等于租两次、付两次运费。"
      },
      {
        "title": "未受训操作员让保险失效",
        "description": "仅 CIDB 持证操作员能保住您工地的保险有效。"
      }
    ]
  },
  "midCta": {
    "heading": "今天就需要高空车？",
    "subheading": "立即 WhatsApp——吉隆坡与雪兰莪数小时内派出操作员。",
    "cta": "WhatsApp 立即预订"
  },
  "reviews": {
    "heading": "工地主管这样说",
    "subheading": "80+ 谷歌评价，5.0/5",
    "rating": "5.0",
    "googleLabel": "谷歌评价",
    "items": [
      {
        "name": "Faiz",
        "location": "莎阿南",
        "rating": 5,
        "text": "周二早上预订 20 米，下午 2 点抵达。操作员清楚如何摆位做店铺招牌。下次还会找。"
      },
      {
        "name": "Tan 女士",
        "location": "八打灵再也",
        "rating": 5,
        "text": "蜘蛛车是唯一能进酒店中庭做吊灯保养的方式。履带干净，没有损伤大理石。"
      },
      {
        "name": "Daniel",
        "location": "蕉赖",
        "rating": 5,
        "text": "用 24 米装广告牌——操作员自己处理交通指挥。省下另请一组人。"
      },
      {
        "name": "Razak 先生",
        "location": "巴生",
        "rating": 5,
        "text": "20 米半日租做冷气保养。比上一家便宜，准时到。"
      },
      {
        "name": "Mei Ling",
        "location": "梳邦再也",
        "rating": 5,
        "text": "9 米室内车通过我们仓库卷帘门。操作流畅，3 小时换完高架灯。"
      },
      {
        "name": "Hafiz",
        "location": "吉隆坡",
        "rating": 5,
        "text": "32 米做体育场泛光灯——他们与我们保安协调，夜场前完成。专业团队。"
      }
    ]
  },
  "whyChoose": {
    "heading": "马来西亚承建商为什么选择 Skylift Malaysia",
    "items": [
      { "title": "巴生谷最大车队", "description": "9 米、20 米、24 米、32 米与蜘蛛车一站搞定。" },
      { "title": "CIDB 与 MOSHA 受训操作员", "description": "持有马来西亚有效高空车证。" },
      { "title": "保险全包", "description": "每次预订含公众责任险，无额外费用。" },
      { "title": "提供半日租", "description": "只为实际使用付费——多数短工只需半日。" },
      { "title": "多州覆盖", "description": "吉隆坡、雪兰莪、布城、槟城、柔佛及另外 9 州。" },
      { "title": "中 / 英 / 马来语客服", "description": "用您工地团队的语言沟通。" }
    ]
  },
  "gallery": {
    "heading": "马来西亚各地最近高空车作业",
    "subheading": "每张照片都来自真实租赁工地——非素材图。",
    "captions": [
      "联邦大道广告牌安装",
      "武吉加里尔体育场灯具更换",
      "八打灵再也店铺招牌",
      "仓库高架灯保养",
      "KLCC 玻璃幕墙清洗",
      "商场中庭吊灯保养",
      "电信塔天线检测",
      "工业烟囱检查",
      "蕉赖屋顶排水沟清理",
      "白沙罗住宅修剪树木",
      "MBPJ 路灯合约",
      "工厂排气扇更换",
      "满家乐酒店外墙重漆",
      "机场机库灯具保养",
      "加油站顶棚作业",
      "学校礼堂天花重漆"
    ]
  },
  "locations": {
    "heading": "覆盖马来西亚所有主要地区",
    "subheading": "13 州，160+ 城镇。点击您的州属查看子地区。",
    "viewAll": "查看所有地区",
    "stateIntros": {
      "klang-valley": "当日送达区，含吉隆坡、八打灵再也、莎阿南、梳邦、布城、赛城及巴生走廊。",
      "selangor": "雪邦、万津、瓜拉雪兰莪、乌鲁雪兰莪及西海岸。",
      "negeri-sembilan": "芙蓉、汝来、波德申及南部工业带。",
      "melaka": "马六甲遗产区、亚罗牙也及野新县。",
      "johor": "新山、依斯干达公主城、古来、峇株巴辖、麻坡——依斯干达工业区全覆盖。",
      "perak": "怡保、太平、实兆远、金宝、安顺、江沙。",
      "penang": "乔治市、北海、大山脚、峇六拜——岛与陆兼顾。",
      "kedah": "亚罗士打、双溪大年、居林高科技、兰卡威。",
      "perlis": "加央、亚娄、巴东勿刹及北部边境。",
      "kelantan": "哥打巴鲁、巴西马、瓜拉吉赖、话望生内陆。",
      "terengganu": "瓜拉登嘉楼、甘马挽、龙运、北加石化区。",
      "pahang": "关丹、淡马鲁、文冬、金马仑高原、瓜拉立卑。",
      "sabah": "亚庇、山打根、斗湖、拿笃——协调驳船运输。",
      "sarawak": "古晋、美里、民都鲁、诗巫——本地车厂合作。"
    }
  },
  "faq": {
    "heading": "常见问题",
    "items": [
      {
        "question": "马来西亚高空车租金怎么算？",
        "answer": "大多数预订按半日或全日计费。我们 20 米与 24 米伸缩臂半日 RM500 起，全日 RM620–RM650。运输、燃油与持证操作员全包——无隐藏费。"
      },
      {
        "question": "吉隆坡与雪兰莪可以当日送达吗？",
        "answer": "可以——上午 11 点前确认，当天下午即送达巴生谷任何地点。雪兰莪以外，若就近车厂有所需车型也可同日送达。"
      },
      {
        "question": "租金含操作员吗？",
        "answer": "始终包含。每次租赁均配 CIDB 注册、MOSHA 受训操作员，无额外费用。我们不会把车交给未受训司机。"
      },
      {
        "question": "接受哪些付款方式？",
        "answer": "网上转账（DuitNow、FPX、即时转账）、小额订单货到付款，回头客可开公司发票。需付订金锁定时段。"
      },
      {
        "question": "覆盖哪些州？",
        "answer": "马来西亚 13 州及联邦直辖区。巴生谷由 KL/雪兰莪车厂直送；东马通过沙巴与砂拉越合作伙伴提供服务。"
      },
      {
        "question": "需要付订金吗？",
        "answer": "是的——小额可退订金确认预订。完成作业后付清余款。长期租赁可分阶段付款。"
      },
      {
        "question": "作业有意外保险吗？",
        "answer": "有——每次预订均含车辆与操作员的公众责任险。可按需追加工地特定保险。"
      },
      {
        "question": "如果需要取消怎么办？",
        "answer": "提前 24 小时取消——全额退还订金。当日取消——订金抵扣派车成本。我们绝不收取超出订金的取消费。"
      }
    ]
  },
  "finalCta": {
    "heading": "预订高空车，操作员出动，傍晚前完工。",
    "subheading": "立即 WhatsApp——半日费率，持证操作员，吉隆坡与雪兰莪当日送达。",
    "cta": "WhatsApp 立即预订"
  },
  "footer": {
    "brandName": "Skylift Malaysia",
    "tagline": "全国日租高空车，配持证操作员。",
    "unitsHeading": "高空车型号",
    "topLocationsHeading": "主要服务地区",
    "resourcesHeading": "资源",
    "blog": "博客",
    "siteSafety": "工地安全",
    "operatorCert": "操作员证书",
    "copyright": "© 2026 Skylift Malaysia. 版权所有。",
    "ssm": "Scaffolding Malaysia Sdn. Bhd. — SSM 注册"
  },
  "blog": {
    "title": "高空车租赁与工地安全指南",
    "metaTitle": "Skylift 博客 — 租赁与高空作业安全 | Skylift Malaysia",
    "metaDescription": "高空车租赁指南、高空作业安全标准、CIDB 与 MOSHA 合规、广告牌、体育场及仓库使用案例。",
    "readMore": "阅读更多",
    "recentPosts": "最新文章",
    "publishedOn": "发布于",
    "minRead": "分钟阅读",
    "backToBlog": "← 返回博客",
    "noPosts": "新文章即将上线。",
    "sharePre": "分享文章",
    "breadcrumbHome": "首页",
    "breadcrumbBlog": "博客"
  },
  "location": {
    "h1Prefix": "",
    "h1Suffix": "高空车出租",
    "h2Prefix": "",
    "h2Suffix": "当日送达，配持证操作员",
    "metaTitleSuffix": "| 9米 / 20米 / 24米 / 32米 / 蜘蛛车 | Skylift Malaysia",
    "metaDescPrefix": "",
    "metaDescSuffix": "高空作业车租赁 — 9米至32米伸缩臂及蜘蛛车，配持证操作员。半日RM500起，当日送达。WhatsApp立即预订。",
    "breadcrumbHome": "首页",
    "breadcrumbProduct": "高空车出租",
    "introHeading": "关于",
    "introSuffix": "高空车出租",
    "whyHeading": "为什么选择 Skylift Malaysia",
    "nearbyTitle": "邻近地区也可服务",
    "nearbySubtitle": "我们也当日送达以下邻近地区",
    "ctaHeading": "今天需要高空车在",
    "ctaSuffix": "?"
  },
  "shared": {
    "whatsappCta": "WhatsApp 立即预订",
    "whatsappCtaShort": "WhatsApp 联络",
    "viewAll": "查看全部",
    "learnMore": "了解更多",
    "from": "起",
    "halfDay": "半日",
    "fullDay": "全日",
    "dailyRate": "日租金",
    "withOperator": "含操作员",
    "sameDay": "当日",
    "klSelangor": "吉隆坡 & 雪兰莪",
    "cidbCertified": "CIDB 持证",
    "moshaTrained": "MOSHA 受训",
    "perDay": "/ 日"
  }
}
```

> **ZH location H1 note:** because the EN/MS pattern is `<prefix> <City>` but ZH renders as `<City><suffix>`, the location page client must concat as `${t('location.h1Prefix')}${cityName}${t('location.h1Suffix')}`. For EN/MS, `h1Suffix` is empty; for ZH, `h1Prefix` is empty. Same applies to `h2Prefix` / `h2Suffix`, `metaDescPrefix` / `metaDescSuffix`, and `introHeading` / `introSuffix`.

---

## 7. `components/LanguageSwitcher.tsx`

```tsx
// projects/skylift-malaysia/components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ms', label: 'MS' },
  { code: 'zh', label: '中' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div
      className="lang-switcher inline-flex items-center gap-1 rounded-full border border-[#1C1F2A]/15 bg-white/90 px-1 py-1 text-xs font-semibold tracking-wide shadow-sm"
      aria-label="Language"
    >
      {locales.map((l) => (
        <a
          key={l.code}
          onClick={(e) => {
            e.preventDefault();
            switchLocale(l.code);
          }}
          href="#"
          className={
            l.code === locale
              ? 'rounded-full bg-[#F5B400] px-3 py-1 text-[#1C1F2A]'
              : 'rounded-full px-3 py-1 text-[#1C1F2A]/70 hover:text-[#1C1F2A]'
          }
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
```

> Brand-tinted: yellow `#F5B400` for the active chip, charcoal `#1C1F2A` for text. Matches the Skylift Malaysia palette. Pure CSS — no `useState`.

---

## 8. Schema components

### 8.1 `components/schema/OrganizationSchema.tsx`

```tsx
// projects/skylift-malaysia/components/schema/OrganizationSchema.tsx
import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/brand/logo.svg`,
    description: siteConfig.tagline,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'MY',
      availableLanguage: ['English', 'Malay', 'Chinese'],
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

> Phone is omitted by design — phone is dynamic from Supabase per CLAUDE.md and `seo-plan.md §7.1`.

### 8.2 `components/schema/LocalBusinessSchema.tsx`

```tsx
// projects/skylift-malaysia/components/schema/LocalBusinessSchema.tsx
import { siteConfig } from '@/config/site';

interface LocalBusinessSchemaProps {
  locale: string;
  locationSlug?: string;
  cityName?: string;
  stateName?: string;
}

export function LocalBusinessSchema({
  locale,
  locationSlug,
  cityName,
  stateName,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: cityName
      ? `${siteConfig.brandName} — ${cityName}`
      : siteConfig.brandName,
    url: locationSlug
      ? `${siteConfig.siteUrl}/${locale}/${siteConfig.productSlug}/${locationSlug}`
      : `${siteConfig.siteUrl}/${locale}`,
    image: `${siteConfig.siteUrl}/brand/hero.png`,
    logo: `${siteConfig.siteUrl}/brand/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      ...(cityName ? { addressLocality: cityName } : {}),
      ...(stateName ? { addressRegion: stateName } : {}),
    },
    areaServed: cityName
      ? { '@type': 'City', name: cityName }
      : { '@type': 'Country', name: 'Malaysia' },
    priceRange: 'RM500 - RM2000',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 8.3 `components/schema/FAQSchema.tsx`

```tsx
// projects/skylift-malaysia/components/schema/FAQSchema.tsx
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

### 8.4 `components/schema/BreadcrumbSchema.tsx`

```tsx
// projects/skylift-malaysia/components/schema/BreadcrumbSchema.tsx
import { siteConfig } from '@/config/site';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.siteUrl}${item.url}`,
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

### 8.5 `components/schema/ProductSchema.tsx`

```tsx
// projects/skylift-malaysia/components/schema/ProductSchema.tsx
import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  rentalPrice?: number | null;
  locale: string;
  slug?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  rentalPrice,
  locale,
  slug,
}: ProductSchemaProps) {
  const productUrl = slug
    ? `${siteConfig.siteUrl}/${locale}#${slug}`
    : `${siteConfig.siteUrl}/${locale}`;

  const offers =
    rentalPrice && rentalPrice > 0
      ? [
          {
            '@type': 'Offer',
            priceCurrency: 'MYR',
            price: String(rentalPrice),
            priceValidUntil: '2027-12-31',
            availability: 'https://schema.org/InStock',
            name: 'Daily Rental',
            url: productUrl,
          },
        ]
      : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    url: productUrl,
    image: image || `${siteConfig.siteUrl}/og-image.jpg`,
    ...(offers.length ? { offers } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '80',
      bestRating: '5',
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

---

## 9. `app/[locale]/layout.tsx`

```tsx
// projects/skylift-malaysia/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = siteConfig.siteUrl;

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(baseUrl),
    icons: { icon: '/icon.svg' },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ms: `${baseUrl}/ms`,
        zh: `${baseUrl}/zh`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale:
        locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_MY' : 'en_MY',
      alternateLocale: ['en_MY', 'ms_MY', 'zh_MY'].filter(
        (l) =>
          l !==
          (locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_MY' : 'en_MY')
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

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
        <script
          defer
          src="https://utopia-webcore.vercel.app/t.js"
          data-website="skylift-malaysia.vercel.app"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

> Layout obeys the **layout-ownership rule**: no header, no footer, no FOMO. Pages own those inline.

---

## 10. `app/sitemap.ts`

```ts
// projects/skylift-malaysia/app/sitemap.ts
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';
import { locales } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: locale === 'en' ? 1.0 : 0.9,
    });
  }

  // Location pages — 160 locations × 3 locales = 480 entries
  for (const locale of locales) {
    for (const loc of locations) {
      entries.push({
        url: `${baseUrl}/${locale}/${siteConfig.productSlug}/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // Blog listing per locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Blog posts (best-effort — fetched at runtime)
  try {
    const { getBlogPosts } = await import('@/lib/getBlogPosts');
    const posts = await getBlogPosts('en');
    for (const locale of locales) {
      for (const post of posts) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.published_at
            ? new Date(post.published_at)
            : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // Blog fetch failed at build time — skip, regenerate at runtime
  }

  return entries;
}
```

> Source of truth for the location list is `seo-plan.md §8` → `config/locations.ts`. 160 entries × 3 locales + 3 homepages + 3 blog listings + N blog posts.

---

## 11. `app/robots.ts`

```ts
// projects/skylift-malaysia/app/robots.ts
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
```

---

## 12. WhatsApp redirect

### 12.1 `app/[locale]/redirect-whatsapp-1/page.tsx`

```tsx
// projects/skylift-malaysia/app/[locale]/redirect-whatsapp-1/page.tsx
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const { loc, message } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const finalText = message && message.trim().length > 0 ? message : whatsappText;
  const url = waLink(phone, finalText);
  return <RedirectClient url={url} />;
}
```

> Accepts both `loc` (location slug → routes to the right phone in `location` / `hybrid` modes later) and `message` (custom WhatsApp pre-fill text). Falls back to the phone row's default `whatsapp_text`.

### 12.2 `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx`

```tsx
// projects/skylift-malaysia/app/[locale]/redirect-whatsapp-1/RedirectClient.tsx
'use client';
import { useEffect } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: '#F8F8F6',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '12px', color: '#1C1F2A' }}>Opening WhatsApp...</p>
        <a
          href={url}
          style={{ color: '#25D366', fontWeight: 600, fontSize: '16px' }}
        >
          Click here if it did not open
        </a>
      </div>
    </div>
  );
}
```

---

## 13. `lib/waRedirect.ts`

```ts
// projects/skylift-malaysia/lib/waRedirect.ts
export function waRedirect(
  locale: string,
  message?: string,
  location?: string
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (location) params.set('loc', location);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
```

> Used everywhere a WhatsApp button needs to go. Never `wa.me/...` directly. The `loc` query is the location slug — the redirect server-side route uses it to select the right phone in `location` / `hybrid` leads modes.

---

## 14. `global.d.ts`

```ts
// projects/skylift-malaysia/global.d.ts
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void;
  }
}
export {};
```

---

## 15. Tracking instrumentation list

Tracking script lives in `app/[locale]/layout.tsx` (§9 above) with `data-website="skylift-malaysia.vercel.app"`. Below is every place a `window.uwc(...)` call must fire on the site. Each call site is **client-side only** (`'use client'`) and guarded with `typeof window !== 'undefined' && window.uwc`.

### 15.1 WhatsApp click — `label: 'whatsapp-{phone}'`

Wherever a WhatsApp CTA is clicked, fire **before** navigation. Implement in a small helper hook used by every button (homepage + location page + blog post + FAB).

```ts
// shared helper used inside every WhatsApp button onClick
function trackWhatsApp(phone: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    window.uwc('click', { label: `whatsapp-${phone}` });
  }
}
```

Call sites (all use the `waRedirect()` link from §13):

| # | Location | Component | Notes |
|---|----------|-----------|-------|
| 1 | FOMO banner CTA | `HomePageClient.tsx` / `LocationPageClient.tsx` | Fire on click |
| 2 | Nav header WhatsApp button | inline in homepage + location page | Fire on click |
| 3 | Hero primary CTA (`WhatsApp Tempahan`) | hero section | Fire on click |
| 4 | Hero floating photo CTA (if present) | hero section | Fire on click |
| 5 | Product card "WhatsApp for Quote" | product grid item | Pass slug-aware message via `waRedirect(locale, t(`products.units.${slug}.message`))` |
| 6 | How It Works step-4 CTA | how-it-works | Fire on click |
| 7 | Mid CTA (image bg) button | mid-cta section | Fire on click |
| 8 | Final CTA (image bg) button | final-cta section | Fire on click |
| 9 | Footer WhatsApp link | footer | Fire on click |
| 10 | Floating sticky FAB (mobile) | inline `<a>` in homepage / location page | Fire on click |
| 11 | Blog article bottom CTA banner | blog post layout | Fire on click |
| 12 | Location page "Need a Skylift in {City}?" CTA | LocationPageClient | Pass `loc` param to redirect, e.g. `waRedirect(locale, undefined, locationSlug)` |

The phone number used in the label is the **fallback phone** from `siteConfig.fallbackPhone` (`60139499318`) — the actual phone is resolved server-side at the redirect page, but the click event labels use the fallback so reports stay grouped under one identifier when in `single` mode.

### 15.2 Product impression — `label: 'product-{slug}'`

In the product card client component, attach an `IntersectionObserver` and disconnect after the first hit:

```ts
useEffect(() => {
  if (!ref.current) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && typeof window !== 'undefined' && window.uwc) {
      window.uwc('impression', { label: `product-${slug}` });
      observer.disconnect();
    }
  });
  observer.observe(ref.current);
  return () => observer.disconnect();
}, [slug]);
```

Slugs: `9m-skylift`, `20m-skylift`, `24m-skylift`, `32m-skylift`, `spider-skylift` (must match `products.slug` in Supabase).

### 15.3 Blog article click — `label: 'blog-{slug}'`

On the blog listing page, every article card click fires:

```ts
function onArticleClick(slug: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    window.uwc('click', { label: `blog-${slug}` });
  }
}
```

Attach to the `<a>` / card wrapper before letting navigation proceed.

### 15.4 Tracking checklist (run before Layla deploys)

- [ ] `<script defer src="https://utopia-webcore.vercel.app/t.js" data-website="skylift-malaysia.vercel.app" />` in `<head>` of `app/[locale]/layout.tsx`
- [ ] `global.d.ts` exports `Window.uwc`
- [ ] Every WhatsApp button (12 call sites above) calls `window.uwc('click', { label: 'whatsapp-...' })`
- [ ] Every product card calls `window.uwc('impression', { label: 'product-{slug}' })` exactly once
- [ ] Every blog listing article calls `window.uwc('click', { label: 'blog-{slug}' })`
- [ ] No `wa.me/` strings anywhere in the codebase (grep `wa.me/`)
- [ ] No hardcoded phone numbers in `.tsx` files (grep `60139499318`)

---

## 16. Image / SVG alt-text rules (Kimmy audit pass)

Run before handoff. Every `<img>` must have `alt` (translated via `t()` on multilingual pages); meaningful `<svg>` icons need `aria-label` or `<title>`; decorative `<svg>` icons get `aria-hidden="true"`.

| Element | Alt / aria treatment |
|---------|-----|
| Hero supervisor photo (homepage) | `alt={t('hero.imageAlt')}` |
| Hero photo (location page) | `alt={t('hero.imageAlt') + ' — ' + cityName}` |
| Logo `<a>` | `aria-label="Skylift Malaysia homepage"` |
| Logo SVG (icon-only, decorative wrapper) | `aria-hidden="true"` |
| Favicon `app/icon.svg` | inherits logo icon (single source) |
| Product card image | `alt={`${productName} — Skylift Malaysia`}` |
| Customer gallery images | `alt={t(`gallery.captions.${index}`)}` |
| Mid CTA / Final CTA bg images | empty `alt=""` (background, decorative) |
| WhatsApp SVG icon inside button | `aria-hidden="true"` (text label provides context) |
| Google star SVG / logo | `aria-hidden="true"` (text says "Google Reviews") |
| Chevron / arrow in language switcher | `aria-hidden="true"` |
| USP icons (decorative pictograms) | `aria-hidden="true"` |
| FOMO countdown clock icon | `aria-hidden="true"` |

---

## 17. `generateMetadata()` for the location page

For reference (the location `page.tsx` is owned by Kagura/Kimmy together — included here so the title/description/canonical/hreflang are consistent with §10/§11):

```ts
// app/[locale]/skylift/[location]/page.tsx (excerpt)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}): Promise<Metadata> {
  const { locale, location } = await params;
  const t = await getTranslations({ locale, namespace: 'location' });
  const loc = locations.find((l) => l.slug === location);
  if (!loc) return {};

  const baseUrl = siteConfig.siteUrl;
  const cityName = loc.name;

  // Locale-aware title — EN/MS use prefix, ZH uses suffix
  const title =
    locale === 'zh'
      ? `${cityName}${t('h1Suffix')} ${t('metaTitleSuffix')}`
      : `${t('h1Prefix')} ${cityName} ${t('metaTitleSuffix')}`;

  const description =
    locale === 'zh'
      ? `${cityName}${t('metaDescSuffix')}`
      : `${t('metaDescPrefix')} ${cityName}, ${loc.state} ${t('metaDescSuffix')}`;

  const path = `/${locale}/${siteConfig.productSlug}/${location}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        en: `${baseUrl}/en/${siteConfig.productSlug}/${location}`,
        ms: `${baseUrl}/ms/${siteConfig.productSlug}/${location}`,
        zh: `${baseUrl}/zh/${siteConfig.productSlug}/${location}`,
        'x-default': `${baseUrl}/en/${siteConfig.productSlug}/${location}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${path}`,
      siteName: siteConfig.brandName,
      locale:
        locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_MY' : 'en_MY',
    },
  };
}
```

---

## 18. Pages that must call `getTranslations` / `useTranslations`

Update these to pull every visible string from `messages/*.json` — zero hardcoded English allowed.

- `app/[locale]/page.tsx` — homepage server component (`getTranslations`)
- `app/[locale]/HomePageClient.tsx` — homepage client interactions (`useTranslations`)
- `app/[locale]/skylift/[location]/page.tsx` — location server (`getTranslations`)
- `app/[locale]/skylift/[location]/LocationPageClient.tsx` — location client (`useTranslations`)
- `app/[locale]/blog/page.tsx` — blog list server (`getTranslations`)
- `app/[locale]/blog/[slug]/page.tsx` — blog post server (`getTranslations`)
- Any `FomoBanner.tsx`-style component spawned by the page → must use `useTranslations` and `useLocale` (do NOT hardcode any English text)

---

## 19. Layout-parity reminder (for Kagura)

Both the homepage and every location page must render this exact section order:

```
FOMO Banner → Nav → [Breadcrumb on location only] → Hero → USP Bar (3-pt)
  → Products → How It Works → Risk → Mid CTA → Reviews → Why Choose
  → Gallery → Locations Accordion → [Nearby on location only] → FAQ
  → Final CTA → Footer
```

Same padding, same backgrounds, same button shapes. Only copy / image changes.

---

## 20. Pre-handoff checklist (Kimmy signs off)

- [ ] `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts` in place
- [ ] `messages/en.json`, `messages/ms.json`, `messages/zh.json` keys identical (BM and ZH are not literal — natural Malaysian phrasing)
- [ ] `LanguageSwitcher` brand-tinted yellow `#F5B400`, charcoal `#1C1F2A`
- [ ] All 5 schema components present in `components/schema/`
- [ ] `app/[locale]/layout.tsx` has tracking script + `OrganizationSchema` + `NextIntlClientProvider` + `generateStaticParams` + `generateMetadata` with hreflang alternates — and **no header/footer**
- [ ] `app/sitemap.ts` emits 480+ location URLs (160 × 3 locales) plus homepages, blog list, blog posts
- [ ] `app/robots.ts` allows all, points at `/sitemap.xml`
- [ ] WhatsApp redirect page accepts both `loc` and `message` query params
- [ ] `lib/waRedirect.ts` is the only place WhatsApp URLs are built
- [ ] `global.d.ts` declares `window.uwc`
- [ ] Tracking calls firing on all 12 WhatsApp call sites + 5 product cards + every blog listing card
- [ ] `data-website="skylift-malaysia.vercel.app"` matches the deployed domain exactly
- [ ] No hardcoded `wa.me/` and no hardcoded `60139499318` in `.tsx` files
- [ ] Heading hierarchy enforced: 1 H1 (`hero.h1`) + 1 H2 (`hero.h2`) per page; sections H3–H6
- [ ] All visible strings localised — switch to `/ms` and `/zh`, no English leakage
