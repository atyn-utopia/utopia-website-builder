# majlis-aqiqah — SEO Plan

> **Author:** Sora (SEO Strategist)
> **Project:** Majlis Aqiqah — Pakej Aqiqah Murah & Lengkap Malaysia
> **Company:** Kak Kenduri Sdn. Bhd.
> **Domain:** `majlisaqiqah.my` · **Site URL:** `https://majlisaqiqah.my`
> **Created:** 2026-08-03
> **Supersedes:** the previous contents of this file (leftover sewa-excavator plan — fully replaced).

This document is the keyword + structure contract for **Nana** (copy), **Kimmy** (metadata, schema,
hreflang) and **Hanabi** (blog). Every Bahasa Melayu string below is written to be dropped straight
into `messages/ms.json` — do not paraphrase the H1/H2/H3/eyebrow strings without checking that the
keyword survives.

---

## 0. Non-negotiable context

| Field | Value |
|---|---|
| Product | Pakej Aqiqah (`pakej-aqiqah`) |
| Market | Malaysia only. Malay-Muslim majority audience. |
| Locales | `ms` (default, **unprefixed**), `en` (`/en`), `zh` (`/zh`) — `localePrefix: 'as-needed'` |
| Location pages | 165 entries in `config/locations.ts`, 15 regions |
| Tone rule | Aqiqah is a religious sunnah, not an event product. Warm, respectful, reassuring. **"Murah" / "mampu milik" is allowed and is the client's own positioning** — but never pair it with hype language ("gila murah", "jimat besar", "offer terbaik pasaran"). |

### 0.1 Cultural / halal guardrails on keywords

Allowed and expected: `murah`, `mampu milik`, `pakej lengkap`, `patuh syariah`, `halal`, `sembelih`,
`agih`, `asnaf`, `sunnah`.

**Never** use in headings, meta or copy: discount-slasher framing on the animal itself ("kambing
clearance", "korban borong"); any claim of a JAKIM *certification* the client does not hold — say
"mengikut panduan syariah" / "penyembelih bertauliah", which are process claims, not "disahkan
JAKIM"; or comparisons that disparage other providers. Aqiqah is *sunnah muakkad*, not *wajib* —
never write copy implying a parent is sinful for not having done it.

### 0.2 URL shape (locale prefix `as-needed`)

```
https://majlisaqiqah.my/                                  ms homepage
https://majlisaqiqah.my/en                                en homepage
https://majlisaqiqah.my/zh                                zh homepage
https://majlisaqiqah.my/pakej-aqiqah/{location}           ms location
https://majlisaqiqah.my/en/pakej-aqiqah/{location}        en location
https://majlisaqiqah.my/zh/pakej-aqiqah/{location}        zh location
https://majlisaqiqah.my/blog  ·  /en/blog  ·  /zh/blog    blog listing
https://majlisaqiqah.my/blog/{slug}  · /en/blog/{slug} …  blog article
```

The product segment stays `pakej-aqiqah` in **all three locales**. Do not localise the path segment
(`/en/aqiqah-package/...` is forbidden) — one canonical path per location keeps link equity in one
place and keeps `generateStaticParams` trivial.

---

## 1. Keyword strategy

### 1.1 The spelling problem — solve it first

Malaysians spell this word **three ways** and Google does not perfectly conflate them:

| Spelling | Status | How we use it |
|---|---|---|
| `aqiqah` | Dominant — the large majority of MY volume | **Canonical.** Every H1, H2, H3, meta title, slug. |
| `akikah` | DBP-standard Malay spelling. Real, non-trivial volume ("pakej akikah", "akikah murah"). | Support term. Once in the homepage FAQ answer, once in each location-page intro body — never in a heading, never in a slug. |
| `aqeeqah` / `akiqah` | Low volume, mostly EN-typing users | One mention in the EN FAQ body only. |

Nana: the natural sentence that captures the variants at once is
*"Aqiqah — atau akikah dalam ejaan Bahasa Melayu standard — ialah sunnah…"*. Use it **once** on the
homepage FAQ and vary the phrasing per location page (see §7).

### 1.2 Primary money keywords — Bahasa Melayu (owned by the homepage)

| Rank | Keyword | Intent | Owner |
|---|---|---|---|
| 1 | `pakej aqiqah` | Commercial — the head term | Homepage |
| 2 | `pakej aqiqah murah` | Commercial, price-led — client's positioning | Homepage |
| 3 | `aqiqah murah` | Commercial | Homepage |
| 4 | `khidmat aqiqah` | Commercial, service-led | Homepage |
| 5 | `harga aqiqah` / `harga kambing aqiqah` | Price research | Homepage (packages block) |
| 6 | `kambing aqiqah` | Product-led | Homepage (packages block) |
| 7 | `pakej aqiqah lengkap` | Commercial, bundle-led | Homepage |
| 8 | `tempah aqiqah` | Transactional — highest intent | Homepage + every CTA |
| 9 | `aqiqah dan korban` | Comparison / seasonal (Zulhijjah) | Homepage FAQ + Blog #6 |
| 10 | `aqiqah siap masak` | Commercial, convenience-led | Homepage (packages + process) |

### 1.3 Long-tail MS — the phrases Malaysian parents actually type

Code-switched, year-suffixed, question-shaped. Each has one owner so nothing competes.

| Long-tail keyword | Owner |
|---|---|
| `pakej aqiqah murah 2026` | Homepage title + packages H4 intro |
| `harga kambing aqiqah 2026` | Homepage packages block + Blog #1 |
| `aqiqah kambing harga` | Homepage packages block |
| `pakej aqiqah siap masak dan hantar` | Homepage process block |
| `aqiqah anak lelaki berapa ekor kambing` | Homepage FAQ + Blog #2 |
| `aqiqah anak perempuan berapa ekor` | Homepage FAQ + Blog #2 |
| `bila masa terbaik buat aqiqah` / `aqiqah hari ke 7` | Blog #3 |
| `hukum aqiqah wajib atau sunat` | Blog #4 |
| `doa aqiqah dan cukur jambul` | Blog #5 |
| `aqiqah online malaysia` | Homepage USP bar |
| `pakej aqiqah dan cukur jambul` | Homepage packages + Blog #5 |
| `aqiqah agih kepada asnaf` | Homepage "why us" + Blog #7 |
| `sembelih kambing aqiqah ikut syariah` | Homepage process step 2 |
| `pakej aqiqah {location}` | **Location pages only** |
| `kambing aqiqah {location}` | **Location pages only** |
| `khidmat aqiqah berdekatan {location}` | **Location pages only** (nearby block) |
| `harga pakej aqiqah di {location}` | **Location pages only** (FAQ Q1) |

### 1.4 English mirror (owner = the `/en` tree)

`aqiqah package malaysia` · `affordable aqiqah malaysia` · `aqiqah service malaysia` ·
`halal aqiqah slaughter service` · `aqiqah for newborn baby malaysia` · `goat aqiqah price malaysia` ·
`aqiqah package price 2026` · `cooked aqiqah delivery malaysia` · `aqiqah and cukur jambul package` ·
`aqiqah package {location}` (location pages).

EN is real but secondary: urban KL/PJ/JB parents, expatriate Muslim families, English-first Malaysian
Muslims. Write EN as **native English, not translated Malay** — but keep `aqiqah` untranslated. It is
the searched token; "seventh-day sacrifice" has no volume.

### 1.5 Chinese (`/zh`) — be realistic

ZH volume in this niche in Malaysia is **low**. The `/zh` tree exists for accessibility,
mixed-heritage families, Chinese-Muslim / mualaf households, and language-switcher parity — not as a
traffic driver. Do not over-invest; do not machine-translate either.

Keyword set: `马来西亚 aqiqah 配套` · `aqiqah 配套价格` · `清真宰羊服务` · `新生儿感恩宰牲` ·
`回教婴儿 aqiqah 服务` · `aqiqah 配套 {location}`.

**Keep the Latin token `aqiqah` inside ZH titles and H1s** — it is what ZH-reading Malaysian Muslims
actually type. A pure-Hanzi title (`婴儿感恩宰牲配套`) matches nothing.

### 1.6 Keywords we deliberately do NOT chase

- `korban` / `qurban` standalone — different ritual, different season, wrong intent. Touched only via
  `aqiqah dan korban` (comparison intent) in the FAQ and one blog post.
- `kambing golek` — BBQ/catering intent, not aqiqah. It would pull weddings and corporate events.
  One passing mention inside a blog post is the maximum.
- `katering kenduri` — owned by the sister project `katering-auntyrokiah`. **Do not target it here.**
  Cross-brand cannibalisation between two Kak Kenduri sites is the one duplicate risk that would hurt
  both domains. Aqiqah copy stays on the ritual; general catering stays on the other domain.

---

## 2. Page hierarchy & keyword ownership

```
/                                          ← HEAD. "pakej aqiqah", "pakej aqiqah murah",
│                                            "khidmat aqiqah", "aqiqah murah malaysia".
│                                            National intent. Never location-modified in H1.
│
├── /pakej-aqiqah/{location}   × 165       ← LONG-TAIL COMMERCIAL. "pakej aqiqah {Location}".
│     │                                      Never targets the bare head term.
│     └── nearby links → 6 same-state siblings + ↑ homepage
│
├── /blog                                  ← HUB. "panduan aqiqah", "info aqiqah".
│     │                                      Never targets a commercial money term.
│     └── /blog/{slug}   × 12+             ← INFORMATIONAL. One question-keyword each.
│                                            Each links ↑ homepage + → 1 location page + → 1 sibling.
│
└── /redirect-whatsapp-1                   ← noindex. Not in the sitemap.
```

### 2.1 Anti-cannibalisation rules (binding)

1. **The homepage is the only page allowed the bare head term** `pakej aqiqah` / `aqiqah murah` in
   its H1 or meta title without a modifier.
2. **Every location page H1 must carry its location name** — `Pakej Aqiqah Kuala Lumpur`, never
   `Pakej Aqiqah Murah` alone. A location page that drops the city name competes with the homepage
   and both lose.
3. **Location pages must not use "Malaysia" in H1 or meta title.** That modifier belongs to the
   homepage.
4. **Blog posts may not target a transactional keyword.** No blog title contains "murah", "harga
   pakej" or "tempah". They funnel *to* the money pages via internal links. Blog #1
   (`harga kambing aqiqah 2026`) is the single deliberate exception: it is a research query and the
   article's job is to route readers into the homepage packages block.
5. **One location page per real place.** No `/pakej-aqiqah/kl` alongside `/pakej-aqiqah/kuala-lumpur`.

---

## 3. Homepage — exact keyword placement map

Section numbering follows the 15-block homepage. Nana copies these strings verbatim into
`messages/ms.json`; EN/ZH equivalents follow in §3.2 / §3.3.

**House rule enforced below:** every eyebrow, every H3 and every H4 section-intro contains a primary
keyword. Exactly one H1 and one H2 on the page — both in the hero.

### 3.1 Bahasa Melayu (`messages/ms.json`)

| # | Block | Level | String |
|---|---|---|---|
| 1 | FOMO banner | — | `Promo Pakej Aqiqah 2026 — slot bulan ini hampir penuh` |
| 3 | Hero eyebrow | eyebrow | `PAKEJ AQIQAH LENGKAP SELURUH MALAYSIA` |
| 3 | Hero title | **H1** | `Pakej Aqiqah Murah & Lengkap Seluruh Malaysia` |
| 3 | Hero subtitle | **H2** | `Khidmat aqiqah dari pilih kambing, sembelih ikut syariah, masak, sehingga agih — kami melengkapkan majlis aqiqah anda` |
| 3 | Hero CTA primary | button | `Tempah Aqiqah Sekarang` (3 words) |
| 3 | Hero CTA secondary | button | `Lihat Pakej Aqiqah` (3 words) |
| 4 | Trust / brand strip | eyebrow | `PROSES AQIQAH PATUH SYARIAH & HALAL` |
| 5 | USP bar (no heading) | 3 × H4 | `Pakej Aqiqah Mampu Milik` · `Sembelih Aqiqah Bertauliah` · `Tempah Aqiqah Secara Online` |
| 6 | Packages | eyebrow | `PILIHAN PAKEJ AQIQAH 2026` |
| 6 | Packages | **H3** | `Pakej Aqiqah Kambing & Biri-Biri Untuk Setiap Keluarga` |
| 6 | Packages intro | **H4** | `Harga pakej aqiqah yang mampu milik — lengkap dari sembelih hingga hantar` |
| 6 | Package card CTA | button | `Dapatkan Harga Aqiqah` (3 words) |
| 7 | Special section — aqiqah package / gender selector (replaces the sewa-excavator calculator) | eyebrow | `PEMILIH PAKEJ AQIQAH` |
| 7 | | **H3** | `Pilih Pakej Aqiqah Ikut Jantina Bayi Anda` |
| 7 | | **H4** | `Aqiqah anak lelaki 2 ekor, aqiqah anak perempuan 1 ekor — pilih pakej aqiqah anda dalam beberapa saat` |
| 7 | | button | `WhatsApp Kami Sekarang` (3 words) |
| 8 | Process | eyebrow | `PROSES AQIQAH 4 LANGKAH` |
| 8 | | **H3** | `Cara Tempah Pakej Aqiqah Dalam 4 Langkah Mudah` |
| 8 | Step 1 | H4 | `1. Pilih Pakej Aqiqah & Tarikh Majlis` |
| 8 | Step 2 | H4 | `2. Sembelih Aqiqah Mengikut Syariah` |
| 8 | Step 3 | H4 | `3. Masak & Bungkus Hidangan Aqiqah` |
| 8 | Step 4 | H4 | `4. Hantar & Agih Daging Aqiqah` |
| 9 | Why us | eyebrow | `KENAPA PILIH KHIDMAT AQIQAH KAMI` |
| 9 | | **H3** | `Kenapa Ribuan Ibu Bapa Percayakan Pakej Aqiqah Kami` |
| 9 | 4 × cards | H4 | `Kambing Aqiqah Sihat & Cukup Umur` · `Penyembelih Aqiqah Bertauliah` · `Harga Pakej Aqiqah Telus` · `Agihan Aqiqah Kepada Asnaf` |
| 10 | Reviews | eyebrow | `ULASAN PELANGGAN PAKEJ AQIQAH` |
| 10 | | **H3** | `Kisah Keluarga Yang Sempurnakan Aqiqah Bersama Kami` |
| 11 | Gallery | eyebrow | `GALERI MAJLIS AQIQAH` |
| 11 | | **H3** | `Galeri Majlis Aqiqah & Hidangan Aqiqah Pelanggan` |
| 12 | FAQ | eyebrow | `SOALAN LAZIM PAKEJ AQIQAH` |
| 12 | | **H3** | `Soalan Lazim Tentang Aqiqah & Pakej Aqiqah Kami` |
| 13 | Locations | eyebrow | `KAWASAN KHIDMAT AQIQAH` |
| 13 | | **H3** | `Pakej Aqiqah Di Seluruh Negeri Di Malaysia` |
| 13 | | **H4** | `Pilih kawasan anda untuk maklumat pakej aqiqah dan penghantaran setempat` |
| 14 | Final CTA | eyebrow | `TEMPAH PAKEJ AQIQAH HARI INI` |
| 14 | | **H3** | `Sempurnakan Sunnah Aqiqah Anak Anda Hari Ini` |
| 14 | | button | `Tempah Aqiqah Sekarang` (3 words) |
| 15 | Footer tagline | — | `Majlis Aqiqah — pakej aqiqah lengkap, mampu milik, patuh syariah.` |

**Homepage FAQ — 8 questions (MS).** These double as `FAQPage` schema and must each carry a keyword:

1. `Berapa harga pakej aqiqah untuk anak lelaki dan anak perempuan?`
2. `Aqiqah anak lelaki berapa ekor kambing?`
3. `Adakah pakej aqiqah ini termasuk masak dan hantar?`
4. `Bilakah masa terbaik untuk buat aqiqah?`
5. `Apakah beza aqiqah dan korban?`
6. `Bolehkah saya tempah aqiqah secara online dari luar negara?`
7. `Adakah kambing aqiqah disembelih mengikut syariah?`
8. `Bolehkah daging aqiqah diagihkan kepada asnaf bagi pihak saya?`

> The answer to Q4 is where the `akikah` spelling variant is placed once (§1.1).

### 3.2 English (`messages/en.json`)

| Block | Level | String |
|---|---|---|
| Hero eyebrow | eyebrow | `COMPLETE AQIQAH PACKAGES ACROSS MALAYSIA` |
| Hero title | **H1** | `Affordable, Complete Aqiqah Packages in Malaysia` |
| Hero subtitle | **H2** | `A full aqiqah service — livestock selection, syariah slaughter, cooking and distribution, handled end to end for your family` |
| Hero CTA | button | `Book Aqiqah Now` (3) / `View Aqiqah Packages` (3) |
| Trust strip | eyebrow | `SYARIAH-COMPLIANT HALAL AQIQAH PROCESS` |
| USP × 3 | H4 | `Affordable Aqiqah Packages` · `Certified Aqiqah Slaughter` · `Book Aqiqah Online` |
| Packages | eyebrow / H3 / H4 | `AQIQAH PACKAGES 2026` / `Goat & Sheep Aqiqah Packages for Every Family` / `Transparent aqiqah package prices — from slaughter to doorstep delivery` |
| Selector | eyebrow / H3 / H4 | `AQIQAH PACKAGE FINDER` / `Choose Your Aqiqah Package by Your Baby's Gender` / `Two goats for a boy's aqiqah, one for a girl's — find your aqiqah package in seconds` |
| Process | eyebrow / H3 | `THE 4-STEP AQIQAH PROCESS` / `How to Book an Aqiqah Package in 4 Simple Steps` |
| Process steps | H4 | `1. Choose Your Aqiqah Package` · `2. Syariah-Compliant Aqiqah Slaughter` · `3. Aqiqah Meat Cooked & Packed` · `4. Aqiqah Delivery & Distribution` |
| Why us | eyebrow / H3 | `WHY CHOOSE OUR AQIQAH SERVICE` / `Why Families Across Malaysia Trust Our Aqiqah Packages` |
| Reviews | eyebrow / H3 | `AQIQAH PACKAGE REVIEWS` / `Families Who Completed Their Aqiqah With Us` |
| Gallery | eyebrow / H3 | `AQIQAH CEREMONY GALLERY` / `Aqiqah Ceremonies & Aqiqah Meals We Have Prepared` |
| FAQ | eyebrow / H3 | `AQIQAH FAQ` / `Frequently Asked Questions About Aqiqah Packages` |
| Locations | eyebrow / H3 / H4 | `AQIQAH SERVICE COVERAGE` / `Aqiqah Packages Across Every State in Malaysia` / `Pick your area for local aqiqah package and delivery details` |
| Final CTA | eyebrow / H3 | `BOOK YOUR AQIQAH PACKAGE TODAY` / `Complete Your Child's Aqiqah Sunnah Today` |

### 3.3 Chinese (`messages/zh.json`)

| Block | Level | String |
|---|---|---|
| Hero eyebrow | eyebrow | `全马 AQIQAH 配套服务` |
| Hero title | **H1** | `马来西亚 Aqiqah 配套 — 价格实惠、一站式完成` |
| Hero subtitle | **H2** | `从选羊、按伊斯兰教法宰杀、烹煮到派送，我们为您完成整场 Aqiqah 仪式` |
| Hero CTA | button | `立即预订 Aqiqah` / `查看 Aqiqah 配套` |
| Trust strip | eyebrow | `符合教法的清真 AQIQAH 流程` |
| USP × 3 | H4 | `实惠的 Aqiqah 配套` · `持证 Aqiqah 宰杀` · `线上预订 Aqiqah` |
| Packages | eyebrow / H3 / H4 | `2026 AQIQAH 配套选择` / `适合每个家庭的山羊与绵羊 Aqiqah 配套` / `Aqiqah 配套价格透明 — 从宰杀到送达一次搞定` |
| Selector | eyebrow / H3 / H4 | `AQIQAH 配套查询` / `根据宝宝性别选择 Aqiqah 配套` / `男婴 Aqiqah 两只、女婴一只 — 几秒钟找到合适的 Aqiqah 配套` |
| Process | eyebrow / H3 | `AQIQAH 四步流程` / `四个步骤预订 Aqiqah 配套` |
| Process steps | H4 | `1. 选择 Aqiqah 配套` · `2. 依教法进行 Aqiqah 宰杀` · `3. Aqiqah 肉品烹煮与包装` · `4. Aqiqah 派送与分发` |
| Why us | eyebrow / H3 | `为什么选择我们的 AQIQAH 服务` / `全马家庭信赖我们 Aqiqah 配套的原因` |
| Reviews | eyebrow / H3 | `AQIQAH 配套客户评价` / `与我们一起完成 Aqiqah 的家庭` |
| Gallery | eyebrow / H3 | `AQIQAH 仪式相册` / `我们承办过的 Aqiqah 仪式与餐点` |
| FAQ | eyebrow / H3 | `AQIQAH 常见问题` / `关于 Aqiqah 配套的常见问题` |
| Locations | eyebrow / H3 | `AQIQAH 服务范围` / `覆盖马来西亚各州的 Aqiqah 配套` |
| Final CTA | eyebrow / H3 | `今天就预订 AQIQAH 配套` / `今天就为孩子完成 Aqiqah 圣行` |

---

## 4. Location page — exact keyword placement map

165 pages × 3 locales = 495 URLs. `{Location}` = `location.name`, `{State}` = `location.state`.

### 4.1 Heading map (MS)

| Block | Level | Template |
|---|---|---|
| Breadcrumb | — | `Utama › Pakej Aqiqah › {Location}` |
| Hero eyebrow | eyebrow | `PAKEJ AQIQAH {LOCATION} — {STATE}` (upper-cased in CSS, not in the JSON) |
| Hero title | **H1** | `Pakej Aqiqah {Location}` |
| Hero subtitle | **H2** | `Khidmat aqiqah sembelih, masak dan agih untuk keluarga di {Location}, {State}` |
| Intro | **H3** | `Khidmat Aqiqah Untuk Keluarga Di {Location}` |
| Intro lead | **H4** | `Pakej aqiqah lengkap dengan penghantaran ke seluruh kawasan {Location}` |
| Packages | eyebrow / H3 / H4 | `PAKEJ AQIQAH DI {LOCATION}` / `Pilihan Pakej Aqiqah Untuk Penduduk {Location}` / `Harga pakej aqiqah di {Location} setelus seluruh Malaysia` |
| Selector | eyebrow / H3 | `PEMILIH PAKEJ AQIQAH {LOCATION}` / `Pilih Pakej Aqiqah Ikut Jantina Bayi Anda` |
| Process | eyebrow / H3 | `PROSES AQIQAH DI {LOCATION}` / `Cara Tempah Pakej Aqiqah Di {Location}` |
| Why us | eyebrow / H3 | `KENAPA PILIH KHIDMAT AQIQAH DI {LOCATION}` / `Kenapa Keluarga {Location} Pilih Pakej Aqiqah Kami` |
| Reviews | eyebrow / H3 | `ULASAN PELANGGAN AQIQAH {LOCATION}` / `Ulasan Keluarga Yang Buat Aqiqah Di {Location}` |
| Gallery | eyebrow / H3 | `GALERI MAJLIS AQIQAH` / `Galeri Majlis Aqiqah & Hidangan Aqiqah Kami` |
| FAQ | eyebrow / H3 | `SOALAN LAZIM AQIQAH {LOCATION}` / `Soalan Lazim Pakej Aqiqah Di {Location}` |
| Nearby | eyebrow / H3 | `KAWASAN AQIQAH BERDEKATAN` / `Pakej Aqiqah Di Kawasan Berdekatan {Location}` |
| Locations | eyebrow / H3 | `KAWASAN KHIDMAT AQIQAH` / `Pakej Aqiqah Di Seluruh Negeri Di Malaysia` |
| Final CTA | eyebrow / H3 | `TEMPAH PAKEJ AQIQAH DI {LOCATION}` / `Sempurnakan Aqiqah Anak Anda Di {Location}` |

EN: H1 `Aqiqah Package in {Location}` · H2 `Complete aqiqah service — slaughter, cooking and
distribution for families in {Location}, {State}`.
ZH: H1 `{Location} Aqiqah 配套` · H2 `为 {State} {Location} 的家庭提供宰杀、烹煮与派送的完整 Aqiqah 服务`.

### 4.2 Location FAQ — 5 questions (MS), at least 3 answered location-specifically

1. `Berapa harga pakej aqiqah di {Location}?`
2. `Adakah anda menghantar daging aqiqah ke seluruh {Location}?`
3. `Berapa lama proses aqiqah dari tempahan hingga penghantaran di {Location}?`
4. `Bolehkah daging aqiqah diagihkan kepada asnaf di sekitar {Location}?`
5. `Bolehkah saya tempah aqiqah dari luar {State}?`

Q1, Q2 and Q4 answers **must** carry place-specific detail (§7). This is what stops 165 pages from
being one page repeated.

---

## 5. Meta title + description templates

Hard limits: **title ≤ 60 characters, description ≤ 155 characters**, counted on the final rendered
string *including* the location substitution. Kimmy implements these in `generateMetadata()`.

### 5.1 Homepage

| Locale | Title (chars) | Description (chars) |
|---|---|---|
| `ms` | `Pakej Aqiqah Murah & Lengkap Malaysia \| Majlis Aqiqah` (53) | `Pakej aqiqah murah dan lengkap seluruh Malaysia. Kami uruskan kambing, sembelih ikut syariah, masak, bungkus dan agih. WhatsApp untuk harga.` (139) |
| `en` | `Aqiqah Package Malaysia \| Affordable Halal Aqiqah` (49) | `Affordable, complete aqiqah packages across Malaysia. We handle livestock, syariah slaughter, cooking, packing and distribution. WhatsApp us for pricing.` (152) |
| `zh` | `马来西亚 Aqiqah 配套 \| 实惠清真 Aqiqah 服务` | `全马 Aqiqah 配套服务，价格实惠。我们负责选羊、按教法宰杀、烹煮、包装与派送，让您安心完成孩子的 Aqiqah 仪式。欢迎 WhatsApp 询价。` |

### 5.2 Location page

ICU-style templates with `{location}` / `{state}`.

**Length guard rule (binding on Kimmy):** compute the rendered title length; if it exceeds 60
characters, fall back to the SHORT variant. Every one of the 165 names fits the short variant.

```
ms.title.long   = "Pakej Aqiqah {location} | Aqiqah Murah Siap Masak"    # 39 chars + name
ms.title.short  = "Pakej Aqiqah {location} | Aqiqah Murah"               # 28 chars + name
```

Worked examples — `Kuala Lumpur` (12) → long = 51 ✅ · `Cameron Highlands` (17) → long = 56 ✅ ·
`Simpang Empat (Perlis)` (22) → long = 61 ❌ → short = 50 ✅.

| Locale | Title template | Description template |
|---|---|---|
| `ms` | long `Pakej Aqiqah {location} \| Aqiqah Murah Siap Masak` · short `Pakej Aqiqah {location} \| Aqiqah Murah` | `Pakej aqiqah murah di {location}, {state}. Sembelih ikut syariah, masak, bungkus dan hantar ke rumah anda. WhatsApp kami untuk harga aqiqah hari ini.` (124 + names) |
| `en` | long `Aqiqah Package {location} \| Affordable Aqiqah` · short `Aqiqah Package in {location}` | `Affordable aqiqah packages in {location}, {state}. Syariah slaughter, cooking, packing and delivery to your home. WhatsApp us for today's aqiqah price.` (121 + names) |
| `zh` | `{location} Aqiqah 配套 \| 实惠清真宰羊服务` | `{location}（{state}）Aqiqah 配套，价格实惠。按伊斯兰教法宰杀、烹煮、包装并送到您家。欢迎 WhatsApp 查询 Aqiqah 价格。` |

**Descriptions must be truncated, not overflowed.** If `{location}` + `{state}` pushes past 155, drop
the `, {state}` fragment first.

### 5.3 Blog listing

| Locale | Title | Description |
|---|---|---|
| `ms` | `Panduan Aqiqah & Tips Majlis Aqiqah \| Majlis Aqiqah` (51) | `Panduan aqiqah lengkap — hukum aqiqah, bilangan kambing, masa terbaik, doa dan tips menguruskan majlis aqiqah anak anda dengan mudah.` (132) |
| `en` | `Aqiqah Guides & Ceremony Tips \| Majlis Aqiqah` (45) | `Complete aqiqah guides — the ruling, how many goats, the best timing, the doa, and practical tips for planning your child's aqiqah ceremony.` (139) |
| `zh` | `Aqiqah 指南与仪式贴士 \| Majlis Aqiqah` | `完整的 Aqiqah 指南 — 教法规定、羊只数量、最佳时机、祈祷文，以及筹办孩子 Aqiqah 仪式的实用建议。` |

### 5.4 Blog article

`{title} | Majlis Aqiqah` — Hanabi keeps `{title}` ≤ 43 characters so the suffix fits inside 60.
Description = a 130–150 character summary containing the article's target keyword once, verbatim.

---

## 6. Internal linking plan

### 6.1 Link graph

| From | To | Mechanism | Anchor text rule |
|---|---|---|---|
| Homepage | All 165 location pages | Locations block, grouped by state | `Pakej Aqiqah {Location}` — never "klik sini" / "baca lagi" |
| Homepage | Blog listing | Nav + footer | `Panduan Aqiqah` |
| Location page | Homepage | Breadcrumb `Utama` + one in-body backlink + logo | in-body anchor = `Pakej Aqiqah Malaysia` |
| Location page | 6 same-state siblings | Nearby block (`getNearbyLocations()`) | `Pakej Aqiqah {Sibling}` |
| Location page | All 165 | Locations block (same as homepage) | `{Location}` |
| Location page | Blog listing | Footer | `Panduan Aqiqah` |
| Blog article | Homepage | ≥1 in-body anchor | `pakej aqiqah murah` / `khidmat aqiqah kami` |
| Blog article | ≥1 location page | ≥1 in-body anchor, chosen for topical fit | `pakej aqiqah {Location}` |
| Blog article | ≥1 sibling article | "Baca juga" block | the article title |
| Blog listing | Every published article | Card grid | the article title |
| Footer (every page) | Top 10 cities + blog + homepage | `topCitySlugs` | `Aqiqah {Location}` |

### 6.2 Nearby-location logic — one fix required

`config/locations.ts` exposes `getNearbyLocations(slug)` returning up to 6 same-state peers. Two
changes so the link graph is not lopsided:

1. **Current implementation is `peers.slice(0, 6)` — always the first 6 in array order.** Klang
   Valley's first six entries would collect ~25 inbound links each while later entries get none.
   Change to a **deterministic rotating window** keyed off the location's own index within its state
   (`peers[(i + n) % peers.length]` for n = 1..6) so inbound links spread evenly across all 165 pages.
   Deterministic, never random — the graph must be identical between builds.
2. **Labuan has only 4 entries**, so it yields 3 peers. Top up to 6 by appending the two nearest Sabah
   entries (`kota-kinabalu`, `beaufort`).

### 6.3 Orphan check (QA / Layla)

No URL in `sitemap.ts` may have zero inbound internal links. After the §6.2 fix every location page
holds ≥8 inbound links (homepage grid + footer or nearby window + sibling pages).

---

## 7. Duplicate-content strategy for 165 location pages

This is the highest-risk part of the build. 165 near-identical pages is the classic doorway-page
pattern Google demotes. **Six axes must vary per city.** Nana produces this as a per-location data
bundle in `copy-locations.md` (a typed record keyed by slug), not as one template with the name
swapped in.

| # | Axis | What varies | Minimum requirement |
|---|---|---|---|
| 1 | **Intro paragraph** | Written per city — the state, the district, whether it is urban or rural, typical majlis size, the surrounding areas served. | 90–140 words, **≥60% unique tokens vs. every other location page**. Rotate across 8 sentence skeletons so structure varies too, not just nouns. |
| 2 | **Coverage / logistics detail** | Delivery window, surrounding kampung/taman served, travel-time framing from the nearest hub, East- vs West-Malaysia handling. | Sabah/Sarawak/Labuan pages state the different lead time explicitly. Klang Valley pages state same-day-slot availability. Rural pages name the surrounding mukim served. |
| 3 | **FAQ answers** | Q1 (price), Q2 (delivery), Q4 (asnaf distribution) rewritten per city. Q3 and Q5 may share a common answer. | ≥3 of 5 answers unique per page. Name a real local *recipient category* where possible (surau, masjid, rumah anak yatim in that district) — **without inventing a named institution**. Categories, not fabricated proper nouns. |
| 4 | **Nearby block** | Driven by `getNearbyLocations()` — a genuinely different 6 per page once §6.2 lands. | Always 6 links, always same-state (Labuan excepted). |
| 5 | **Review selection** | Deterministically pick 3 of ~12 entries by hashing the slug; label them with the page's own state. | No two adjacent cities show the same 3 reviews. Reviews must be **real testimonials supplied by Kak Kenduri** — do not fabricate named customers. If none arrive before Gate 2, ship generic unattributed quotes and flag it to the user. |
| 6 | **Region framing in eyebrow/H4** | `{State}` appears in the hero eyebrow and the intro H4, so Perlis pages read differently from Sabah pages at heading level. | Automatic via template. |

**Legitimately identical across all 165:** the packages grid (dynamic from Supabase), the process
steps, the gallery, the USP bar, universally-true FAQ items, header and footer. That is expected. The
*unique* portion must lead the page and be substantial.

**Pre-launch check:** run a shingle-similarity pass over the rendered `<main>` text of all 165 MS
pages. Any pair above **80% similarity** fails and must be rewritten. Sample at minimum the Labuan and
Perlis pages (smallest states, highest template pressure) and the 25 Klang Valley pages (highest
competition).

---

## 8. Blog plan — 12 articles for Hanabi

All informational; none targets a transactional keyword (§2.1 rule 4). Each ships in `ms`, `en` and
`zh`. The MS title is canonical; EN/ZH are natural-language equivalents, not literal translations.

| # | MS title | Target keyword | Internal links |
|---|---|---|---|
| 1 | `Harga Kambing Aqiqah 2026: Panduan Kos Penuh Ibu Bapa` | `harga kambing aqiqah 2026` | → homepage packages, → `/pakej-aqiqah/kuala-lumpur`, → #6 |
| 2 | `Aqiqah Anak Lelaki 2 Ekor, Perempuan 1 Ekor — Kenapa?` | `aqiqah anak lelaki berapa ekor` | → homepage, → `/pakej-aqiqah/shah-alam`, → #4 |
| 3 | `Bila Masa Terbaik Buat Aqiqah? Hari Ke-7, 14 atau 21` | `bila masa terbaik buat aqiqah` | → homepage, → `/pakej-aqiqah/petaling-jaya`, → #2 |
| 4 | `Hukum Aqiqah: Wajib atau Sunat? Penjelasan Ringkas` | `hukum aqiqah wajib atau sunat` | → homepage, → `/pakej-aqiqah/kota-bharu`, → #3 |
| 5 | `Doa Aqiqah & Majlis Cukur Jambul: Panduan Lengkap` | `doa aqiqah dan cukur jambul` | → homepage, → `/pakej-aqiqah/johor-bahru`, → #8 |
| 6 | `Beza Aqiqah dan Korban: Jangan Keliru Dua Ibadah Ini` | `beza aqiqah dan korban` | → homepage, → `/pakej-aqiqah/ipoh`, → #1 |
| 7 | `Agihan Daging Aqiqah: Siapa Yang Layak Menerima?` | `agihan daging aqiqah kepada siapa` | → homepage, → `/pakej-aqiqah/george-town`, → #10 |
| 8 | `Checklist Persiapan Majlis Aqiqah Di Rumah` | `persiapan majlis aqiqah` | → homepage, → `/pakej-aqiqah/kajang`, → #5 |
| 9 | `Syarat Kambing Aqiqah: Umur, Kesihatan & Jenis Sah` | `syarat kambing aqiqah` | → homepage, → `/pakej-aqiqah/seremban`, → #1 |
| 10 | `Bolehkah Aqiqah Dibuat Selepas Dewasa?` | `aqiqah selepas dewasa` | → homepage, → `/pakej-aqiqah/kuantan`, → #4 |
| 11 | `Menu Hidangan Aqiqah Popular Di Malaysia` | `menu hidangan aqiqah` | → homepage, → `/pakej-aqiqah/kota-kinabalu`, → #8 |
| 12 | `Aqiqah Untuk Perantau: Uruskan Aqiqah Dari Luar Negara` | `aqiqah dari luar negara` | → homepage, → `/pakej-aqiqah/kuching`, → #3 |

Optional 13th, seasonal — publish during Zulhijjah: `Aqiqah Sekali Dengan Korban: Boleh atau Tidak?`
(target `aqiqah sekali dengan korban`).

**Hanabi's per-article heading rule:** exactly one H1 (title), exactly one H2 (deck/summary line),
then H3 → H4 → p. Every H3 carries the target keyword or a close variant. Every article ships a meta
description ≤155 chars, an excerpt, a cover image with keyword-bearing alt text, and ≥3 internal
links. Religious rulings must be attributed generally ("majoriti ulama berpendapat…") and never
presented as a fatwa from a named authority we have not cited.

---

## 9. Schema markup plan (for Kimmy)

| Schema type | Where | Key fields / cautions |
|---|---|---|
| `Organization` | Site-wide, `app/[locale]/layout.tsx` | `name: "Majlis Aqiqah"`, `legalName: "Kak Kenduri Sdn. Bhd."`, `url`, `logo`, `areaServed: "MY"`, `sameAs: []`. **No `telephone`** — the number must never appear as visible or structured text (house rule). |
| `WebSite` | Homepage only | `name`, `url`, `inLanguage`. No `SearchAction` — there is no on-site search. |
| `Service` | Homepage | `serviceType: "Aqiqah"`, `provider: @Organization`, `areaServed: Country "Malaysia"`, `hasOfferCatalog` listing the dynamic packages. Prefer `Service` over `Product` — this is a religious service, not goods. |
| `Product` + `Offer` | Homepage package cards, one per Supabase product | `name`, `description`, `image` from `product_photos.url`, `offers.price` from `sale_price`, `priceCurrency: "MYR"`. **Omit `Offer` entirely while prices are placeholders** — publishing a fake price is a structured-data violation and risks a manual action. Gate this on real client pricing. |
| `LocalBusiness` | Every location page | `name: "Majlis Aqiqah — {Location}"`, `areaServed: { @type: "City", name: "{Location}" }`, `address.addressRegion: "{State}"`, `addressCountry: "MY"`. **No fake street address, no fake geo coordinates** — use only the real registered address of Kak Kenduri Sdn. Bhd., or omit `address` and keep `areaServed`. Do not invent a branch per city. |
| `FAQPage` | Homepage + every location page + any blog article with an FAQ block | Q&A must match the visible on-page text verbatim. Location FAQ = the 5 questions in §4.2. |
| `BreadcrumbList` | Every location page and blog article | Location: `Utama › Pakej Aqiqah › {Location}`. Blog: `Utama › Blog › {Title}`. |
| `Article` | Every blog article | `headline`, `description`, `image`, `datePublished`, `dateModified`, `author: @Organization`, `inLanguage`. |
| `ItemList` | Blog listing | Ordered list of published articles. |

### 9.1 Hreflang — note the unprefixed default (`localePrefix: 'as-needed'`)

Every page emits four alternates. The `ms` URL carries **no** locale prefix:

```html
<link rel="alternate" hreflang="ms" href="https://majlisaqiqah.my/pakej-aqiqah/kuala-lumpur" />
<link rel="alternate" hreflang="en" href="https://majlisaqiqah.my/en/pakej-aqiqah/kuala-lumpur" />
<link rel="alternate" hreflang="zh" href="https://majlisaqiqah.my/zh/pakej-aqiqah/kuala-lumpur" />
<link rel="alternate" hreflang="x-default" href="https://majlisaqiqah.my/pakej-aqiqah/kuala-lumpur" />
```

Implemented via `alternates.languages` + `alternates.canonical` in `generateMetadata()`. Each page's
canonical points at **itself in its own locale** — never cross-locale.

`/redirect-whatsapp-1` gets `robots: { index: false, follow: false }` and is excluded from
`sitemap.ts`. Sitemap contains: 3 homepages + 495 location URLs + 3 blog listings + (12 × 3) article
URLs = **537 URLs at launch**.

### 9.2 Image alt-text rules

| Image | Alt pattern (MS) |
|---|---|
| Hero | `Majlis aqiqah keluarga Muslim di Malaysia dengan hidangan aqiqah lengkap` |
| Package card | `Pakej aqiqah {nama pakej} — kambing aqiqah siap masak` (name from Supabase `products.name`) |
| Process step | `Proses aqiqah langkah {n} — {tajuk langkah}` |
| Gallery | `Hidangan aqiqah dan majlis aqiqah pelanggan di {kawasan}` — vary per image, never repeat one string across the grid |
| Logo | `Logo Majlis Aqiqah — pakej aqiqah lengkap Malaysia` |

Alt text is descriptive first, keyword second. One keyword per alt string — never stuff.

---

## 10. Handoff checklist

**Nana** — populate `messages/{ms,en,zh}.json` using §3 verbatim for headings/eyebrows/USP/FAQ; write
the per-location bundle per §7 (six varying axes, 90–140-word unique intro per city); every CTA button
label ≤3 words (all labels in §3 already comply).

**Kimmy** — §5 meta templates *with the 60-char fallback guard*; §9 schema respecting the two hard
gates (no `Offer` on placeholder prices, no fabricated `address`/`geo`); §9.1 hreflang with the
unprefixed `ms`; the §6.2 nearby-window fix in `config/locations.ts`; `noindex` on the redirect route.

**Hanabi** — §8: 12 articles × 3 locales, each with ≥3 internal links and its stated target keyword.

**QA / Layla** — §7 shingle-similarity pass before deploy; §6.3 orphan check; verify exactly one H1
and one H2 on all four page types in all three locales.

---

## Market sources consulted (Malaysian aqiqah SERP, Aug 2026)

- [Harga Kambing Aqiqah 2026: Mentah & Siap Masak — hargasekilo.my](https://www.hargasekilo.my/harga-kambing-aqiqah/)
- [Harga Kambing Aqiqah Terkini 2026 — biayaitu.my](https://biayaitu.my/berita/harga-kambing-aqiqah/)
- [Pakej Kambing Aqiqah — kambingbbq.my](https://www.kambingbbq.my/pakej-kambing-golek-aqiqah)
- [Pakej Katering Aqiqah Shah Alam, Selangor & KL — amimykitchen.my](https://amimykitchen.my/pakej-katering-aqiqah/)
- [Mudahnya Aqiqah — kambingseelong.com.my](https://kambingseelong.com.my/)
- [Aqiqah di Osman Goat Farm](https://www.osmangoatfarm.com/aqiqah.php)
- [Pakej Akikah Lengkap Murah — nccandc.com.my](https://nccandc.com.my/pakej-akikah-lengkap-murah/)
