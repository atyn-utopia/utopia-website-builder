# Sora — SEO Plan: Cold Room Malaysia (`coldroom-malaysia.vercel.app`)

> Author: Sora (SEO Strategist). Status: Complete. Project: Cold Room Rental, 13 Peninsular Malaysia states, 150–180 sub-locations, 3 locales (en / ms / zh), `localePrefix: 'always'`. Reference: https://www.coldroommalaysia.com.my/

## 1. Primary Keyword Strategy (per locale)

### 1.1 English — money keywords (homepage)
1. cold room rental Malaysia
2. cold storage rental Malaysia
3. refrigerated cold room rental
4. cold chain logistics Malaysia
5. halal cold room rental
- Variants: cold room for rent Malaysia, mobile cold room rental, cold room delivery Malaysia.
- Use-case long-tail: frozen meat cold room rental, seafood frozen storage Malaysia, ice cream cold storage rental, bread freezer rental, pizza dough cold storage, pastry freezer rental Malaysia, dairy chiller rental Malaysia, cheese chiller rental, florist cold room rental, pharmaceutical cold storage Malaysia, vaccine cold storage rental, beverage cold storage rental, event cold room rental, wedding cold room rental, restaurant cold storage rental, supermarket overflow cold storage, kenduri cold room rental.
- Location long-tail pattern: `cold room rental {City}` / `cold storage rental {City}` / `chiller rental {City}` (e.g. cold room rental Kuala Lumpur, cold storage rental Petaling Jaya, chiller rental Shah Alam, cold room rental Johor Bahru, cold room for rent Penang).

### 1.2 Bahasa Melayu — money keywords (homepage)
1. sewa cold room
2. sewa cold room Malaysia
3. sewa bilik sejuk
4. cold room halal
5. sewa freezer komersial
- Variants: cold room untuk disewa, sewa stor sejuk, sewa chiller, penghantaran cold room, logistik rantaian sejuk.
- Use-case long-tail: sewa cold room ais krim, sewa cold room daging beku, sewa cold room ayam, sewa freezer roti / doh pizza, sewa chiller produk tenusu, sewa cold room farmaseutikal, sewa cold room kenduri / majlis, sewa cold room restoran, sewa cold room pasaraya.
- Location pattern: `sewa cold room {Bandar}` / `sewa bilik sejuk {Bandar}`.

### 1.3 Mandarin (Malaysian-Chinese) — money keywords (homepage)
1. 冷库出租马来西亚
2. 冷藏库租赁
3. 冷冻库出租
4. 清真冷库
5. 冷链物流马来西亚
- Variants: 冷库租赁马来西亚, 移动冷库出租, 冷藏室出租.
- Use-case long-tail: 肉类冷冻库出租, 海鲜冷冻库出租, 冰淇淋冷库出租, 烘焙冷冻库出租, 乳制品冷藏库出租, 药品冷藏库出租, 餐厅冷库出租, 超市冷库出租.
- Location pattern: `{城市}冷库出租`.
- Use Malaysian-Chinese terms only: 冷库 / 冷藏库 / 冷冻库 / 出租 / 清真 / 冷链物流. Avoid mainland-only 冰柜.

## 2. Page Hierarchy & URL Structure

```
/                         → 308 → /en
/en, /ms, /zh             → homepage per locale (national money KW)
/en/cold-room/[location]  → location page × 3 locales × 150–180 cities
/en/blog                  → blog listing
/en/blog/[slug]           → blog post
/sitemap.xml, /robots.txt
```

- Product slug fixed at `cold-room` for every locale.
- Location slugs are Latin (`kuala-lumpur`) for every locale; only display names get translated.
- Temperature tiers are Supabase rows surfaced as cards on homepage and every location page, with anchor IDs `#frozen-storage-minus-18`, `#freezer-minus-5-to-minus-10`, `#chiller-2-to-4`, `#cool-storage-7-to-10`. Each tier emits its own `Product` schema.

## 3. Heading Hierarchy Targets per Page

Sitewide (CLAUDE-locked): exactly one `<h1>` (hero title) and exactly one `<h2>` (hero subtitle, real `<h2>` not `<p>`). All other section titles are `<h3>`–`<h6>`.

### Homepage `/[locale]`
- H1: "Cold Room Rental Malaysia"
- H2: "Refrigerated Cold Room Delivery & Rental — Same-Day, HALAL, 13 States"
- H3 sections: UspBar, Stats, Products, HowItWorks, RiskProblem, GoogleReviews, WhyChoose, Gallery, LocationsAccordion, FAQ, FinalCta.
- H4: each product card title; each WhyChoose tile; each state group inside LocationsAccordion.

### Location page `/[locale]/cold-room/[location]`
- H1: "Cold Room Rental in {City}, Malaysia"
- H2: "Same-Day Refrigerated Cold Room Delivery to {City} — HALAL, 24/7 Quotes"
- H3 sections: UspBar, Stats, Products, HowItWorks, RiskProblem, MidCta, GoogleReviews, WhyChoose, Gallery, LocationsAccordion, NearbyLocations, FAQ, FinalCta.
- H4: product card titles; each NearbyLocations tile.
- City name must appear ≥6 times naturally per location page.

### Blog listing
- H1: "Cold Room & Cold Chain Insights"
- H2: "Practical Guides for Renting Cold Storage in Malaysia"

### Blog post
- H1 article title (template). H2 article hook (template). Body starts at H3.

## 4. Meta Titles & Meta Descriptions (templates)

Hard limits: title ≤60 chars, description 140–155 chars.

### Homepage
- EN title: `Cold Room Rental Malaysia | HALAL, Same-Day Delivery`
- EN desc: `Rent -18°C frozen, freezer, chiller & cool-storage cold rooms in Malaysia. HALAL, same-day delivery, 13 states. Get a free WhatsApp quote.`
- MS title: `Sewa Cold Room Malaysia | HALAL, Penghantaran Hari Ini`
- MS desc: `Sewa cold room beku -18°C, freezer, chiller & stor sejuk di Malaysia. HALAL, penghantaran hari yang sama, 13 negeri. Sebut harga WhatsApp.`
- ZH title: `马来西亚冷库出租 | 清真，当天送达`
- ZH desc: `租赁 -18°C 冷冻库、冷冻室、冷藏库与冷藏室，覆盖马来西亚 13 州。清真认证，当天送达。WhatsApp 免费报价。`

### Location page (templated)
- EN title: `Cold Room Rental in {City}, Malaysia | Same-Day`
- EN desc: `Rent HALAL cold rooms in {City} — frozen, freezer, chiller, cool storage. Same-day delivery, 5-min WhatsApp quote, trusted by {City} businesses.`
- MS title: `Sewa Cold Room di {City}, Malaysia | Hari Ini`
- MS desc: `Sewa cold room HALAL di {City} — beku, freezer, chiller, stor sejuk. Penghantaran hari yang sama, sebut harga WhatsApp 5 minit.`
- ZH title: `{City}冷库出租 | 清真，当天送达`
- ZH desc: `{City}冷库出租 — 冷冻库、冷冻室、冷藏库、冷藏室一应俱全。清真认证，当天送达，WhatsApp 5 分钟报价。`

### Blog listing
- EN title: `Cold Room & Cold-Chain Blog | Cold Room Malaysia`
- MS title: `Blog Cold Room & Rantaian Sejuk | Cold Room Malaysia`
- ZH title: `冷库与冷链博客 | 马来西亚冷库出租`

### Blog post template
- EN: `{Article Title} | Cold Room Malaysia` + `{Hook}. {Key takeaway}. Free WhatsApp quote.`
- MS: `{Tajuk Artikel} | Cold Room Malaysia` + `{Ayat hook}. {Iktibar utama}. Sebut harga WhatsApp percuma.`
- ZH: `{文章标题} | 马来西亚冷库出租` + `{开头句}。{关键要点}。WhatsApp 免费报价。`

## 5. Internal Linking Pattern

```
              Home  Location  BlogList  BlogPost  TierCard  WhatsApp
Home          —     ALL       1         0         4         many
Location      1     5–6 near  1         0         4         many
BlogList      1     0         —         ALL       0         1
BlogPost      1     1–2       1         3 recent  1–2       1 (banner)
```

- Homepage → Locations: `LocationsAccordion` grouped by 13 states with all 150–180 sub-locations linked. Footer links 8 priority cities.
- Location → Locations: 5–6 nearby cities from `config/locations.ts:nearby[]`.
- Reciprocity rule: A→B implies B→A.
- Cross-locale: `<LanguageSwitcher>` preserves path; same source feeds hreflang.
- Orphan-page check: every location must be linked from ≥2 other locations.

## 6. Schema Markup Plan

- Homepage: Organization + WebSite + Product × 4 + FAQPage + BreadcrumbList.
- Location page: LocalBusiness + Product × 4 + FAQPage + BreadcrumbList.
- Blog listing: Blog + BreadcrumbList.
- Blog post: BlogPosting + BreadcrumbList + (FAQPage if applicable).

## 7. Hreflang Strategy

```html
<link rel="alternate" hreflang="en"        href="https://coldroom-malaysia.vercel.app/en/{path}"/>
<link rel="alternate" hreflang="ms"        href="https://coldroom-malaysia.vercel.app/ms/{path}"/>
<link rel="alternate" hreflang="zh"        href="https://coldroom-malaysia.vercel.app/zh/{path}"/>
<link rel="alternate" hreflang="x-default" href="https://coldroom-malaysia.vercel.app/en/{path}"/>
<link rel="canonical"                      href="https://coldroom-malaysia.vercel.app/{currentLocale}/{path}"/>
```

Canonical: self-referencing per locale. `x-default` covers locale-undeclared traffic with `en`.

## 8. Top 30 Blog Topics for Hanabi

| # | Title | Target keyword (en) | Cluster |
|:-:|---|---|---|
| 1 | The Complete Guide to Cold Room Rental in Malaysia | cold room rental Malaysia | Pillar |
| 2 | Frozen vs Freezer vs Chiller vs Cool Storage: Which Cold Room Do You Need? | cold room temperature tiers | Pillar |
| 3 | How Much Does It Cost to Rent a Cold Room in Malaysia? | cold room rental price Malaysia | Money |
| 4 | Same-Day Cold Room Delivery in Malaysia: How It Works | same-day cold room delivery Malaysia | Money |
| 5 | HALAL Cold Storage: Compliance Checklist for Malaysian Businesses | halal cold storage Malaysia | Trust |
| 6 | -18°C Frozen Cold Room Rental: Everything You Need to Know | frozen cold room rental | Tier 1 |
| 7 | Bakery Freezer Rental: Storing Bread, Pizza Dough & Pastry Right | bakery freezer rental Malaysia | Tier 2 |
| 8 | Dairy Chiller Rental for Cafes & Restaurants | dairy chiller rental Malaysia | Tier 3 |
| 9 | Pharmaceutical Cold Storage Rental: Vaccine & Drug Compliance | pharmaceutical cold storage Malaysia | Tier 4 |
| 10 | Ice Cream Storage: Frozen Cold Room Setup Guide | ice cream cold storage rental | Tier 1 |
| 11 | Cold Chain Logistics 101: From Warehouse to Last Mile | cold chain logistics Malaysia | Cross-sell |
| 12 | Mobile / Pop-Up Cold Room Rental for Events & Weddings | event cold room rental Malaysia | Use case |
| 13 | Sewa Cold Room untuk Kenduri & Majlis di Malaysia | sewa cold room kenduri | MS-priority |
| 14 | Restaurant Cold Storage Rental: Sizing Guide for F&B | restaurant cold storage rental | B2B |
| 15 | Supermarket Overflow Cold Storage During Peak Seasons | supermarket cold storage rental | B2B |
| 16 | Florist Cold Room Rental: Keep Fresh Flowers at 2°C | florist cold room rental | Tier 3 niche |
| 17 | Seafood Cold Storage: Best Practices for -18°C Rental | seafood frozen storage Malaysia | Tier 1 |
| 18 | Frozen Meat Storage: How to Avoid Freezer Burn in a Rental | frozen meat cold room rental | Tier 1 |
| 19 | Cold Room Rental in Kuala Lumpur: A Local's Guide | cold room rental Kuala Lumpur | Location pillar |
| 20 | Cold Room Rental in Johor Bahru & Iskandar Region | cold room rental Johor Bahru | Location pillar |
| 21 | Cold Room Rental in Penang: George Town & Mainland Coverage | cold room rental Penang | Location pillar |
| 22 | Setting Up a Cold Room: Power, Floor & Drainage Requirements | cold room installation requirements | Informational |
| 23 | Cold Room Sizes Explained: Pallets, Boxes & Cubic Meters | cold room size guide | Informational |
| 24 | Reducing Energy Costs in a Rented Cold Room | cold room energy saving | Informational |
| 25 | Hygiene & Sanitation Standards for Rented Cold Rooms | cold room hygiene Malaysia | Trust |
| 26 | Cold Truck + Cold Room Combo: End-to-End Cold Chain Rental | cold truck cold room rental | Cross-sell |
| 27 | When to Choose a Mobile Cold Room Over a Fixed One | mobile cold room rental | Money variant |
| 28 | Cold Room Rental Contracts: What to Look For | cold room rental contract | Informational |
| 29 | Cold Room Emergency Breakdown: 24-Hour Backup Options | emergency cold storage rental | Trust |
| 30 | Year-End & Festive Season Cold Storage Demand: How to Plan Ahead | seasonal cold storage rental Malaysia | Seasonal |

First 10 mandatory before deploy.

## 9. Blog Post Heading Hierarchy

Rules: exactly one H1 + one H2 per page. Body starts at H3; subsections H4. Auto-generated TOC from H3s.

In-body links per article: 1 homepage, 1–2 priority-city pages, 1–2 tier anchors, 1 mid-article + 1 bottom WhatsApp CTA. Word counts: pillars 1,200–1,500; tier/use-case 900–1,200; informational 800–1,000.
