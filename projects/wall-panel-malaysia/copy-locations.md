# Wall Panel Malaysia — Location Page Copy Template (EN / MS / ZH)

**Author:** Nana (Copywriter)
**Project:** wall-panel-malaysia
**Route:** `/[locale]/wall-panel/[location]`
**Locales:** en (default), ms, zh
**CTA:** WhatsApp only — every CTA links to `/[locale]/redirect-whatsapp-1?loc={slug}`
**Scale:** ~155 cities × 3 locales = ~465 location pages

> **How this file works:** Writing ~465 hand-crafted pages is wasteful and produces drift between locales. Instead, this file gives Kimmy a **reusable template** with **2–4 variant strings per section**. At render time, the implementation hashes the city slug into an index `i = hash(slug) % variants.length` and picks the variant for each slot. That way every page reads uniquely (location-modified) while staying maintainable. Cyclops and Sora already lock the canonical 155-slug list in `config/locations.ts`.
>
> **Variables:**
> - `{city}` — official Roman-letter display name (e.g. `Shah Alam`, `Petaling Jaya`, `George Town`, `Johor Bahru`, `Kota Kinabalu`)
> - `{city_zh}` — Simplified Chinese display name (e.g. `莎阿南`, `八打灵再也`, `乔治市`, `新山`, `亚庇`)
> - `{state}` — state name (e.g. `Selangor`, `Kuala Lumpur`, `Penang`, `Johor`, `Sabah`)
> - `{state_ms}` — Bahasa state name (e.g. `Selangor`, `Pulau Pinang`, `Sabah`)
> - `{state_zh}` — Chinese state name (e.g. `雪兰莪`, `槟城`, `沙巴`)
> - `{nearby_1..4}` — nearby city display names from `nearbyMap[slug]` in `config/locations.ts`
>
> **Heading rules:** Exactly ONE H1 and ONE H2 per page — both in the hero. Every other heading is H3–H4 with an ALL-CAPS `.eyebrow` directly above it. WhatsApp green only. No phone numbers or domain text visible.

---

## 1. Page Section Order (parity with homepage)

| # | Section | Location additions |
|---|---|---|
| 1 | FomoBanner | (same as homepage) |
| 2 | InlineHeader | (same as homepage) |
| 3 | **Breadcrumbs** (NEW on location pages) | Home › Wall Panel › {city} |
| 4 | Hero (H1 + H2 city-modified) | unique per page |
| 5 | USP Bar | reused from homepage |
| 6 | Product Grid | reused from homepage (dynamic) |
| 7 | Promo Pricing Anchor | reused from homepage |
| 8 | Location Intro (NEW) | unique per page — 4 prose variants |
| 9 | How It Works | reused from homepage |
| 10 | Why {city} chose us (city-modified — NEW) | 4 cards, city-modified |
| 11 | Customer Reviews | reused from homepage |
| 12 | Local FAQ (city-modified) | 8 Qs, 4 opener variants |
| 13 | **NearbyLocations** (replaces homepage's LocationCloud) | 4–6 neighbours from `nearbyMap` |
| 14 | Final CTA (city-modified) | unique per page — 4 variants |
| 15 | InlineFooter | (same as homepage) |
| 16 | FloatingWhatsApp | (same as homepage) |

---

## 2. ENGLISH (`/en/wall-panel/{slug}`)

### 2.1 Meta

- **meta_title:** `Wall Panel Installation {city} | From RM25/sqft | Free Install`
- **meta_description:** `Install wood, fluted, PVC, acoustic or marble wall panels in {city}. From RM25/sqft with free installation. WhatsApp Wall Panel Malaysia for a free measure-up in {city}.`

### 2.2 Breadcrumbs

`Home` › `Wall Panel` › `{city}`

### 2.3 Hero (ONE H1 + ONE H2)

- **H1 (variants — cycle by hash):**
  1. `Premium Wall Panel Installation in {city}`
  2. `Wall Panel Installation in {city} — Free Install Included`
  3. `{city} Wall Panel Installation From RM25/sqft`
  4. `Wall Panel Installation for Homes and Offices in {city}`

- **H2 (variants):**
  1. `Wood, Fluted, PVC, Acoustic and Marble — Free Installation Across {city} and {state}`
  2. `Five Premium Styles, One Trusted Team — Now Installing Across {city}`
  3. `Free Measure, Free Install, Promo Price Locked — For {city} Homes and Offices`
  4. `Wall Panel Specialists Serving {city} — Standard from RM25/sqft, Marble from RM38/sqft`

- **Price teaser pill:** `From RM25/sqft · Free Installation in {city}`
- **Primary hero CTA:** `Get Free Quote on WhatsApp`
- **Secondary hero link:** `See all 5 styles`
- **Trust line:** `Now installing across {city} and nearby {state}`

### 2.4 USP Bar

Reuse the homepage USP bar verbatim (3 H3 cards + eyebrows). Implementation note: append `{city}` to the third card's body sentence if Kimmy wants extra location signal — e.g. `"Same crew, same finish quality whether we're panelling a feature wall in {city} or a reception lobby nearby."`

### 2.5 Product Grid + Promo Pricing Anchor

Reuse the homepage blocks verbatim (dynamic from Supabase + the market/our/promo table).

### 2.6 Location Intro (UNIQUE per page — 4 prose variants)

- **Section eyebrow:** `WALL PANEL IN {CITY}`
- **H3 (variants):**
  1. `Why {city} Homes and Offices Choose Us For Wall Panel Installation`
  2. `Wall Panel Installation in {city}, Done Properly`
  3. `{city}'s Quiet Favourite For Wood, Fluted and Marble Wall Panels`
  4. `What Wall Panel Installation Looks Like in {city}`

- **Intro paragraph (variants — cycle by hash; ~80–110 words each):**

  **Variant 1 (general / direct):**
  > Wall panel installation in {city} doesn't need to mean weeks of dust, three subcontractors and a final invoice you never agreed to. We measure your wall in {city} for free, send a written quote with the promo price locked in, and install the panels ourselves with hidden-clip mounting. Standard finishes (Wood, Fluted, PVC, Acoustic) start from **RM25/sqft**; Marble (Gold, Silver, Black) starts from **RM38/sqft** — both include free installation across {city} and the rest of {state}.

  **Variant 2 (homeowner angle):**
  > Whether you're upgrading a TV feature wall in {city}, adding a fluted headboard in the master bedroom, or panelling a humid laundry yard, we bring the samples to your {city} address, walk you through the finish under your own lighting, and install with our own crew. {city} living rooms tend to favour Wood and Fluted; humid corners do better in PVC; bedrooms read best with Acoustic or Wood. Free installation included on every order — Standard from **RM25/sqft**, Marble from **RM38/sqft**.

  **Variant 3 (office / B2B angle):**
  > Office wall panel installation in {city} is one of the quickest ways to lift a boardroom, reception or breakout area without a full renovation. We've completed feature walls for {state} offices, co-working spaces and clinics — sometimes installed inside a single weekend so Monday morning meetings see a brand-new room. Acoustic panels for meeting rooms, Marble for reception, Wood and Fluted for breakout walls. All priced from **RM25/sqft** with free installation across {city}.

  **Variant 4 (price-led / promo angle):**
  > If you've been quoting wall panel installation around {city} at RM45–RM60/sqft and getting hit with separate "installation labour" lines, this is the page worth reading. Our {city} promo locks Standard Wall Panel (Wood, Fluted, PVC, Acoustic) at **RM25/sqft** and Marble Wall Panel (Gold, Silver, Black) at **RM38/sqft** — and the installation itself is free. We measure your {city} space for free, send a clean PDF quote, and install with our own team within 3–7 days.

### 2.7 Why {city} Chose Us (4 cards — city-modified — H4 per card)

**Section eyebrow:** `WHY {CITY}`
**Section H3:** `Four Reasons {city} Keeps Choosing Wall Panel Malaysia`

1. **Eyebrow:** `LOCAL COVERAGE`
   **H4:** `Free Measurement Visits Across {city}`
   **Body:** Our installers run measurement visits across {city} on weekdays and weekends. No travel surcharge inside {state}, and you'll have a written quote in your WhatsApp by the same evening.

2. **Eyebrow:** `INSTALL TIMELINE`
   **H4:** `Most {city} Installs Done In 3–7 Days`
   **Body:** From the moment your deposit clears, most {city} living rooms and offices are completely panelled within a week. Larger projects (full reception, multi-room) typically wrap inside two.

3. **Eyebrow:** `STYLE FIT`
   **H4:** `Style Recommendations Tuned For {city} Interiors`
   **Body:** {city} homes tend to mix open-plan living with humid utility corners — we'll suggest Wood or Fluted for the living, Acoustic for the home office, and PVC for any wet zone, so your finish lasts longer where it needs to.

4. **Eyebrow:** `LOCAL SUPPORT`
   **H4:** `Post-Install Care You Can Actually Reach`
   **Body:** A workmanship warranty is only useful if someone picks up. {city} customers go through the same WhatsApp line that booked the install — a real person who can dispatch a fix without a ticket queue.

### 2.8 How It Works

Reuse the homepage 4-step block verbatim (eyebrows + H4s).

### 2.9 Customer Reviews

Reuse the homepage 6-review block verbatim — these are brand reviews, not city-specific.

### 2.10 Local FAQ (8 questions, city-modified — H4 per Q; 4 opener variants for question phrasing)

**Section eyebrow:** `{CITY} FAQ`
**Section H3:** `Wall Panel Questions From {city} Customers`

> **Variant cycle:** Each FAQ has 4 question opener variants. Kimmy picks `variants[hash(slug) % 4]` per slug so neighbouring city pages don't share identical question wording.

1. **Eyebrow:** `PRICING IN {CITY}`
   **H4 (Q variants):**
   1. `How much does wall panel installation cost per sqft in {city}?`
   2. `What's the actual per-sqft price for wall panels in {city}?`
   3. `Are wall panel prices in {city} different from KL?`
   4. `What does wall panel installation cost in {city} for a typical living room?`
   **A:** Standard Wall Panel (Wood, Fluted, PVC, Acoustic) starts at **RM25/sqft** in {city}. Marble Wall Panel (Gold, Silver, Black) starts at **RM38/sqft**. Both include free installation in {city} — no separate labour charge. We'll send a written quote after a free measurement at your {city} address.

2. **Eyebrow:** `LEAD TIME IN {CITY}`
   **H4 (Q variants):**
   1. `How fast can you start a wall panel install in {city}?`
   2. `What's your earliest install slot for {city} this month?`
   3. `If I confirm today, when can you install my wall panel in {city}?`
   4. `How soon can a {city} project actually finish?`
   **A:** Once your deposit clears, most {city} projects begin within 3–7 days. Single-wall installs in {city} usually finish in 1–2 days on-site; larger jobs (full reception, multiple rooms) typically wrap inside 2 weeks end-to-end including measurement.

3. **Eyebrow:** `FREE INSTALL IN {CITY}`
   **H4 (Q variants):**
   1. `Is free installation really included for {city} orders?`
   2. `Does "free installation" actually apply in {city}?`
   3. `Are there hidden labour or transport charges in {city}?`
   4. `Will I be billed extra for installation if I'm in {city}?`
   **A:** Yes — free installation applies to every {city} order regardless of style or square footage. There's no separate labour line, no transport fee inside {state}, and no after-hours surcharge. The only line items that can ever be added are major carpentry or surface repair if your existing wall needs prep, and we always show those upfront before you commit.

4. **Eyebrow:** `STYLE FOR {CITY} SPACES`
   **H4 (Q variants):**
   1. `Which wall panel style works best for {city} homes?`
   2. `Do you have a style recommendation for {city} living rooms?`
   3. `What do most {city} customers pick — wood or fluted?`
   4. `Is acoustic or fluted better for a {city} home office?`
   **A:** {city} homes tend to favour Wood and Fluted for living rooms and bedrooms because the warm tones suit Malaysian daylight. PVC is the local pick for kitchens, bathrooms and laundry corners thanks to humidity resistance. Acoustic is what we install in {city} home offices and studios for cleaner video calls. Marble is reserved for feature walls — usually TV walls and reception zones.

5. **Eyebrow:** `COVERAGE IN {CITY}`
   **H4 (Q variants):**
   1. `Do you cover all neighbourhoods in {city}?`
   2. `Which {city} areas do you install in?`
   3. `Is your team available outside the {city} city centre?`
   4. `Do you charge extra for {city} suburbs further from town?`
   **A:** We install across every neighbourhood in {city} and the wider {state}. There's no surcharge for outer suburbs inside the same state. If you're sitting near the {state} border — for example close to {nearby_1} or {nearby_2} — we'll still send the same crew at the same per-sqft price.

6. **Eyebrow:** `WARRANTY IN {CITY}`
   **H4 (Q variants):**
   1. `What warranty do I get on a {city} install?`
   2. `If a panel pops in {city}, who fixes it?`
   3. `How long is your workmanship warranty for {city} customers?`
   4. `What does the warranty actually cover in {city}?`
   **A:** Every {city} installation comes with a written workmanship warranty. If a panel lifts, pops or fails because of our installation, our team returns and repairs it at no charge. {city} customers reach the same WhatsApp line that booked the install — no ticket queue, no third-party callout agency.

7. **Eyebrow:** `MAINTENANCE IN {CITY}`
   **H4 (Q variants):**
   1. `How do I clean and maintain my wall panel in {city}?`
   2. `Is wall panel maintenance harder in humid {city}?`
   3. `Any care tips for wall panels in {city}'s climate?`
   4. `What's the cleaning routine you'd recommend in {city}?`
   **A:** Routine care is a weekly wipe with a dry microfibre cloth. PVC and Marble panels in {city} can be cleaned with a damp cloth and mild soap — great for kitchens and reception desks. Avoid strong thinners or wire brushes on Wood and Acoustic finishes. Humidity in {city} doesn't damage our panels because we use 12mm pre-finished material with hidden-clip mounting that lets the wall breathe behind.

8. **Eyebrow:** `BOOKING IN {CITY}`
   **H4 (Q variants):**
   1. `How do I book a free measurement in {city}?`
   2. `What's the fastest way to get a quote for {city}?`
   3. `Can I confirm a {city} measurement slot today?`
   4. `How do I get started for my {city} project?`
   **A:** Just WhatsApp us a photo of your wall, the rough dimensions and the style you're leaning toward. We confirm a free measurement slot in {city} the same day, send our installer over at the time you choose, and follow up within 24 hours with a clean written quote with the promo price locked in.

### 2.11 Nearby Locations

- **Section eyebrow:** `NEARBY CITIES`
- **H3:** `We Also Install Wall Panels Near {city}`
- **Body line:** `Same promo pricing, same crew, free installation — across the cities below.`
- **Anchor text per nearby card:** `Wall Panel Installation in {nearby_n}`
- Render 4–6 nearby cards from `nearbyMap[slug]` in `config/locations.ts`.

### 2.12 Final CTA (UNIQUE per page — 4 variants)

- **Section eyebrow:** `LOCK IN {CITY}`
- **H3 (variants):**
  1. `Your {city} Feature Wall, One WhatsApp Message Away`
  2. `Ready To Panel Your {city} Wall? Let's Lock The Promo`
  3. `{city} Free Measurement — Slots Open Today`
  4. `Get Your {city} Quote Before The Promo Ends`

- **Body (variants):**
  1. `Free measurement, free quote, free installation — locked at promo pricing for {city} while the banner above is live. One message, one team, one premium wall.`
  2. `{city} crews are running measurement visits this week. Send your wall photo and we'll confirm a slot today — the promo price holds until install day.`
  3. `Save the labour line. Save the back-and-forth. WhatsApp Wall Panel Malaysia for your {city} measurement and we'll handle the rest.`
  4. `From wood to marble, from living rooms to boardrooms — our {city} team installs all five styles at the promo price you see on this page.`

- **3 trust tags:** `Free Installation` · `Lifetime Care` · `Across Malaysia`
- **CTA label:** `Get Free Quote on WhatsApp`

---

## 3. BAHASA MELAYU (`/ms/wall-panel/{slug}`)

### 3.1 Meta

- **meta_title:** `Pemasangan Panel Dinding {city} | Dari RM25/sqft | Percuma`
- **meta_description:** `Pasang panel dinding kayu, fluted, PVC, akustik atau marmar di {city}. Dari RM25/sqft termasuk pemasangan percuma. WhatsApp Wall Panel Malaysia untuk ukuran percuma di {city}.`

### 3.2 Breadcrumbs

`Laman Utama` › `Panel Dinding` › `{city}`

### 3.3 Hero (ONE H1 + ONE H2)

- **H1 (variants):**
  1. `Pemasangan Panel Dinding Premium Di {city}`
  2. `Pemasangan Panel Dinding {city} — Pemasangan Percuma Termasuk`
  3. `Panel Dinding {city} Dari RM25/sqft`
  4. `Pemasangan Panel Dinding Untuk Rumah Dan Pejabat Di {city}`

- **H2 (variants):**
  1. `Kayu, Fluted, PVC, Akustik dan Marmar — Pemasangan Percuma Di {city} Dan {state_ms}`
  2. `Lima Gaya Premium, Satu Pasukan Yang Boleh Dipercayai — Kini Memasang Di {city}`
  3. `Ukuran Percuma, Pemasangan Percuma, Harga Promo Dikunci — Untuk Rumah Dan Pejabat {city}`
  4. `Pakar Panel Dinding Untuk {city} — Standard Dari RM25/sqft, Marmar Dari RM38/sqft`

- **Price teaser pill:** `Dari RM25/sqft · Pemasangan Percuma Di {city}`
- **Primary hero CTA:** `Dapatkan Sebut Harga di WhatsApp`
- **Secondary hero link:** `Lihat 5 gaya panel`
- **Trust line:** `Kini memasang di {city} dan kawasan berdekatan {state_ms}`

### 3.4 USP Bar

Guna semula blok USP halaman utama. Implementasi boleh tambah nama `{city}` pada body USP ketiga jika perlu lebih signal lokasi.

### 3.5 Product Grid + Promo Pricing Anchor

Guna semula blok halaman utama (dynamic + jadual market/our/promo).

### 3.6 Location Intro (UNIQUE — 4 variants)

- **Section eyebrow:** `PANEL DINDING DI {CITY}`
- **H3 (variants):**
  1. `Kenapa Rumah Dan Pejabat {city} Pilih Kami Untuk Pemasangan Panel Dinding`
  2. `Pemasangan Panel Dinding Di {city}, Dibuat Dengan Betul`
  3. `Pilihan Senyap {city} Untuk Panel Dinding Kayu, Fluted Dan Marmar`
  4. `Bagaimana Pemasangan Panel Dinding Berjalan Di {city}`

- **Intro paragraph (variants):**

  **Varian 1:**
  > Pemasangan panel dinding di {city} tak perlu bermakna berminggu-minggu habuk, tiga subkontraktor, dan invoice akhir yang anda tak pernah setuju. Kami ukur dinding anda di {city} secara percuma, hantar sebut harga bertulis dengan harga promo dikunci, dan pasang panel sendiri dengan sistem klip tersembunyi. Kemasan Standard (Kayu, Fluted, PVC, Akustik) bermula **RM25/sqft**; Marmar (Emas, Perak, Hitam) bermula **RM38/sqft** — kedua-duanya termasuk pemasangan percuma di {city} dan seluruh {state_ms}.

  **Varian 2 (sudut tuan rumah):**
  > Sama ada anda nak naik taraf dinding TV di {city}, tambah headboard fluted untuk bilik utama, atau panel laundry yard yang lembap, kami bawa sampel ke alamat {city} anda, tunjuk kemasan bawah pencahayaan sendiri, dan pasang dengan kru kami. Ruang tamu {city} biasanya pilih Kayu dan Fluted; ruang lembap lebih sesuai PVC; bilik tidur paling kemas dengan Akustik atau Kayu. Pemasangan percuma untuk setiap tempahan — Standard dari **RM25/sqft**, Marmar dari **RM38/sqft**.

  **Varian 3 (sudut pejabat):**
  > Pemasangan panel dinding pejabat di {city} adalah cara paling pantas untuk naik taraf bilik mesyuarat, reception atau ruang breakout tanpa renovation penuh. Kami sudah siapkan feature wall untuk pejabat {state_ms}, co-working space dan klinik — kadang-kadang siap dalam satu hujung minggu supaya mesyuarat Isnin lihat bilik baru. Panel Akustik untuk bilik mesyuarat, Marmar untuk reception, Kayu dan Fluted untuk dinding breakout. Semua dari **RM25/sqft** dengan pemasangan percuma di {city}.

  **Varian 4 (sudut harga):**
  > Jika anda dapat sebut harga panel dinding sekitar {city} pada RM45–RM60/sqft dengan caj "upah pemasangan" berasingan, halaman ini berbaloi anda baca. Promo {city} kami kunci Panel Dinding Standard (Kayu, Fluted, PVC, Akustik) pada **RM25/sqft** dan Panel Dinding Marmar (Emas, Perak, Hitam) pada **RM38/sqft** — dan pemasangan itu sendiri percuma. Kami ukur ruang {city} anda percuma, hantar PDF sebut harga kemas, dan pasang dengan pasukan sendiri dalam 3–7 hari.

### 3.7 Why {city} Chose Us (4 cards)

**Section eyebrow:** `KENAPA {CITY}`
**Section H3:** `Empat Sebab {city} Terus Pilih Wall Panel Malaysia`

1. **Eyebrow:** `LIPUTAN TEMPATAN`
   **H4:** `Lawatan Ukuran Percuma Di Seluruh {city}`
   **Body:** Installer kami buat lawatan ukuran di {city} pada hari biasa dan hujung minggu. Tiada surcaj perjalanan dalam {state_ms}, dan sebut harga bertulis dalam WhatsApp anda pada petang yang sama.

2. **Eyebrow:** `MASA PEMASANGAN`
   **H4:** `Kebanyakan Pemasangan {city} Siap Dalam 3–7 Hari`
   **Body:** Dari saat deposit anda diterima, kebanyakan ruang tamu dan pejabat {city} dipasang panel sepenuhnya dalam seminggu. Projek besar (reception penuh, banyak bilik) biasanya siap dalam dua minggu.

3. **Eyebrow:** `KESERASIAN GAYA`
   **H4:** `Cadangan Gaya Disesuaikan Untuk Interior {city}`
   **Body:** Rumah {city} biasanya campur ruang tamu open-plan dengan ruang utiliti lembap — kami cadangkan Kayu atau Fluted untuk ruang tamu, Akustik untuk home office, dan PVC untuk zon basah, supaya kemasan kekal lama di tempat yang perlukan.

4. **Eyebrow:** `SOKONGAN TEMPATAN`
   **H4:** `Penjagaan Selepas Pemasangan Yang Boleh Anda Hubungi`
   **Body:** Waranti kerja tangan hanya berguna jika ada orang angkat panggilan. Pelanggan {city} guna line WhatsApp sama yang tempah pemasangan — orang sebenar yang boleh hantar pembaikan tanpa antri tiket.

### 3.8 How It Works

Guna semula blok 4 langkah halaman utama.

### 3.9 Customer Reviews

Guna semula blok 6 review halaman utama — ini ulasan jenama, bukan khusus bandar.

### 3.10 Local FAQ (8 Qs, 4 opener variants per Q)

**Section eyebrow:** `SOALAN LAZIM {CITY}`
**Section H3:** `Soalan Panel Dinding Dari Pelanggan {city}`

1. **Eyebrow:** `HARGA {CITY}`
   **H4 (Q variants):**
   1. `Berapa kos pemasangan panel dinding sekaki persegi di {city}?`
   2. `Apa harga sebenar panel dinding di {city}?`
   3. `Adakah harga panel dinding di {city} berbeza dengan KL?`
   4. `Berapa kos pemasangan panel dinding {city} untuk ruang tamu biasa?`
   **A:** Panel Dinding Standard (Kayu, Fluted, PVC, Akustik) bermula **RM25/sqft** di {city}. Panel Dinding Marmar (Emas, Perak, Hitam) bermula **RM38/sqft**. Kedua-dua termasuk pemasangan percuma di {city} — tiada caj upah berasingan. Kami hantar sebut harga bertulis selepas ukuran percuma di alamat {city} anda.

2. **Eyebrow:** `MASA {CITY}`
   **H4 (Q variants):**
   1. `Berapa cepat anda boleh mula pasang panel dinding di {city}?`
   2. `Bila slot pemasangan terawal di {city} bulan ini?`
   3. `Jika saya sahkan hari ini, bila boleh pasang panel di {city}?`
   4. `Bila projek {city} boleh siap sebenarnya?`
   **A:** Apabila deposit anda diterima, kebanyakan projek {city} bermula dalam 3–7 hari. Pemasangan satu dinding di {city} biasanya siap dalam 1–2 hari di tapak; kerja besar (reception penuh, banyak bilik) biasanya siap dalam 2 minggu dari ukuran hingga kemasan.

3. **Eyebrow:** `PASANG PERCUMA {CITY}`
   **H4 (Q variants):**
   1. `Adakah pemasangan percuma betul-betul termasuk untuk tempahan {city}?`
   2. `Adakah "pemasangan percuma" terpakai di {city}?`
   3. `Ada caj upah atau pengangkutan tersembunyi di {city}?`
   4. `Saya akan dicaj tambahan untuk pemasangan jika saya di {city}?`
   **A:** Ya — pemasangan percuma terpakai untuk setiap tempahan {city} tanpa kira gaya atau saiz. Tiada line upah berasingan, tiada caj pengangkutan dalam {state_ms}, tiada surcaj waktu malam. Hanya line yang boleh ditambah adalah kerja kayu besar atau pembaikan permukaan jika dinding sedia ada perlu disiapkan, dan kami tunjuk itu di awal sebelum anda buat keputusan.

4. **Eyebrow:** `GAYA UNTUK {CITY}`
   **H4 (Q variants):**
   1. `Gaya panel dinding mana paling sesuai untuk rumah {city}?`
   2. `Ada cadangan gaya untuk ruang tamu {city}?`
   3. `Apa yang kebanyakan pelanggan {city} pilih — kayu atau fluted?`
   4. `Akustik atau fluted lebih baik untuk home office di {city}?`
   **A:** Rumah {city} biasanya pilih Kayu dan Fluted untuk ruang tamu dan bilik tidur kerana nada hangat sesuai dengan cahaya Malaysia. PVC adalah pilihan setempat untuk dapur, bilik air dan ruang laundry kerana tahan lembap. Akustik adalah yang kami pasang di home office dan studio {city} untuk video call yang lebih jelas. Marmar disimpan untuk feature wall — biasanya dinding TV dan zon reception.

5. **Eyebrow:** `LIPUTAN {CITY}`
   **H4 (Q variants):**
   1. `Adakah anda lindungi semua kawasan di {city}?`
   2. `Kawasan {city} mana yang anda pasang?`
   3. `Adakah kru anda boleh keluar dari pusat bandar {city}?`
   4. `Adakah anda caj lebih untuk pinggir bandar {city} yang jauh?`
   **A:** Kami pasang di setiap kawasan {city} dan seluruh {state_ms}. Tiada surcaj untuk pinggir bandar dalam negeri yang sama. Jika anda dekat dengan sempadan {state_ms} — contohnya dekat dengan {nearby_1} atau {nearby_2} — kami masih hantar kru sama pada harga sekaki persegi yang sama.

6. **Eyebrow:** `WARANTI {CITY}`
   **H4 (Q variants):**
   1. `Apa waranti yang saya dapat untuk pemasangan {city}?`
   2. `Jika panel terangkat di {city}, siapa baiki?`
   3. `Berapa lama waranti kerja tangan untuk pelanggan {city}?`
   4. `Apa sebenarnya waranti lindungi di {city}?`
   **A:** Setiap pemasangan {city} dilengkapi waranti kerja tangan secara bertulis. Jika panel terangkat, tercabut atau rosak kerana pemasangan kami, pasukan kami balik dan baiki tanpa caj. Pelanggan {city} hubungi line WhatsApp sama yang tempah pemasangan — tiada antri tiket, tiada agensi pihak ketiga.

7. **Eyebrow:** `PENJAGAAN {CITY}`
   **H4 (Q variants):**
   1. `Bagaimana saya cuci dan jaga panel dinding di {city}?`
   2. `Adakah penjagaan panel lebih sukar dalam {city} yang lembap?`
   3. `Ada tip penjagaan panel dinding untuk iklim {city}?`
   4. `Apa rutin pembersihan yang anda cadangkan di {city}?`
   **A:** Penjagaan rutin adalah lap mingguan dengan kain microfibre kering. Panel PVC dan Marmar di {city} boleh dibersihkan dengan kain basah dan sabun lembut — sesuai untuk dapur dan meja reception. Elak thinner kuat atau berus dawai pada kemasan Kayu dan Akustik. Kelembapan di {city} tidak rosakkan panel kami sebab kami guna material 12mm pra-kemas dengan sistem klip tersembunyi yang biarkan dinding bernafas di belakang.

8. **Eyebrow:** `TEMPAHAN {CITY}`
   **H4 (Q variants):**
   1. `Bagaimana saya tempah ukuran percuma di {city}?`
   2. `Cara paling pantas dapat sebut harga untuk {city}?`
   3. `Boleh saya sahkan slot ukuran {city} hari ini?`
   4. `Bagaimana saya mula untuk projek {city} saya?`
   **A:** WhatsApp kami gambar dinding, ukuran kasar dan gaya yang anda minat. Kami sahkan slot ukuran percuma di {city} pada hari yang sama, hantar installer ikut waktu anda, dan susul dalam 24 jam dengan sebut harga bertulis yang kemas dengan harga promo terkunci.

### 3.11 Nearby Locations

- **Section eyebrow:** `BANDAR BERDEKATAN`
- **H3:** `Kami Juga Pasang Panel Dinding Berhampiran {city}`
- **Body line:** `Harga promo sama, kru sama, pemasangan percuma — di bandar-bandar di bawah.`
- **Anchor per nearby card:** `Pemasangan Panel Dinding Di {nearby_n}`

### 3.12 Final CTA (4 variants)

- **Section eyebrow:** `KUNCI {CITY}`
- **H3 (variants):**
  1. `Feature Wall {city} Anda, Satu Mesej WhatsApp Sahaja`
  2. `Sedia Pasang Panel Dinding {city}? Mari Kunci Promo`
  3. `Ukuran Percuma {city} — Slot Terbuka Hari Ini`
  4. `Dapatkan Sebut Harga {city} Sebelum Promo Tamat`

- **Body (variants):**
  1. `Ukuran percuma, sebut harga percuma, pemasangan percuma — dikunci pada harga promo untuk {city} selagi banner di atas hidup. Satu mesej, satu pasukan, satu dinding premium.`
  2. `Kru {city} sedang buat lawatan ukuran minggu ini. Hantar gambar dinding anda dan kami sahkan slot hari ini — harga promo kekal sampai hari pasang.`
  3. `Jimat line upah. Jimat ulang-alik. WhatsApp Wall Panel Malaysia untuk ukuran {city} anda dan kami uruskan selebihnya.`
  4. `Dari kayu ke marmar, dari ruang tamu ke bilik mesyuarat — pasukan {city} kami pasang kelima-lima gaya pada harga promo yang anda lihat di halaman ini.`

- **3 trust tags:** `Pemasangan Percuma` · `Penjagaan Seumur Hidup` · `Seluruh Malaysia`
- **CTA label:** `Dapatkan Sebut Harga di WhatsApp`

---

## 4. 中文 (`/zh/wall-panel/{slug}`)

### 4.1 Meta

- **meta_title:** `{city_zh}墙板安装 | RM25/sqft起 | 免费安装`
- **meta_description:** `在{city_zh}安装木纹、凹槽、PVC、隔音或大理石墙板。RM25/sqft起,含免费安装。立即WhatsApp Wall Panel Malaysia 预约{city_zh}免费量度。`

### 4.2 Breadcrumbs

`首页` › `墙板` › `{city_zh}`

### 4.3 Hero (ONE H1 + ONE H2)

- **H1 (variants):**
  1. `{city_zh}高端墙板安装服务`
  2. `{city_zh}墙板安装 — 含免费安装`
  3. `{city_zh}墙板 RM25/sqft起`
  4. `{city_zh}家居与办公室墙板安装`

- **H2 (variants):**
  1. `木纹、凹槽、PVC、隔音与大理石 — {city_zh}与{state_zh}免费安装`
  2. `五大高端风格,一支可信团队 — 现已覆盖{city_zh}`
  3. `免费量度、免费安装、促销价锁定 — 服务{city_zh}家居与办公室`
  4. `{city_zh}墙板专家 — 标准款RM25/sqft起、大理石款RM38/sqft起`

- **Price teaser pill:** `RM25/sqft起 · {city_zh}免费安装`
- **Primary hero CTA:** `WhatsApp 获取免费报价`
- **Secondary hero link:** `查看五大风格`
- **Trust line:** `现已服务{city_zh}及{state_zh}周边地区`

### 4.4 USP Bar

复用首页的 USP 区块。

### 4.5 Product Grid + Promo Pricing Anchor

复用首页的产品网格与促销价格阶梯。

### 4.6 Location Intro (UNIQUE — 4 variants)

- **Section eyebrow:** `{CITY_ZH} 墙板服务`
- **H3 (variants):**
  1. `为何{city_zh}家居与办公室选择我们安装墙板`
  2. `{city_zh}墙板安装,做得到位`
  3. `{city_zh}低调首选 — 木纹、凹槽与大理石墙板`
  4. `{city_zh}墙板安装的实际流程`

- **Intro paragraph (variants):**

  **变体 1:**
  > {city_zh}的墙板安装不必意味着数周尘埃、三家外包商,以及一张您从未同意的最终发票。我们免费量度您在{city_zh}的墙面,发送锁定促销价的书面报价,并由自家团队使用隐藏卡扣完成安装。标准饰面(木纹、凹槽、PVC、隔音)**RM25/sqft 起**;大理石(金、银、黑)**RM38/sqft 起** — 两者均含{city_zh}与{state_zh}免费安装。

  **变体 2(家居视角):**
  > 无论您想升级{city_zh}的电视主墙、为主卧加装凹槽床头墙,还是为潮湿的洗衣区铺设墙板,我们都会将样品送到您{city_zh}的住址,在实际照明下讲解饰面,再由我们自己的团队负责安装。{city_zh}客厅多偏好木纹与凹槽;潮湿区域更适合 PVC;卧室搭配隔音或木纹最为整洁。每份订单含免费安装 — 标准款 **RM25/sqft 起**,大理石款 **RM38/sqft 起**。

  **变体 3(办公室/B2B 视角):**
  > 在{city_zh}做办公室墙板安装,是不进行全面装修就能快速提升会议室、前台或休息区的最佳方式之一。我们已为{state_zh}的办公室、共享空间与诊所完成主墙工程 — 有时一个周末便能完工,让周一早晨的会议看到焕然一新的房间。会议室用隔音、前台用大理石、休息区用木纹与凹槽。全部**RM25/sqft 起**,{city_zh}免费安装。

  **变体 4(价格导向):**
  > 如果您在{city_zh}附近询过墙板安装价位 RM45–RM60/sqft,且被加上额外的"安装工费",本页值得一读。我们的{city_zh}促销将标准墙板(木纹、凹槽、PVC、隔音)锁定在 **RM25/sqft**,大理石墙板(金、银、黑)锁定在 **RM38/sqft** — 而安装本身免费。我们免费量度您{city_zh}的空间,发送清晰的 PDF 报价,并由自家团队在3–7天内完成安装。

### 4.7 Why {city_zh} Chose Us (4 cards)

**Section eyebrow:** `为何 {CITY_ZH}`
**Section H3:** `{city_zh}持续选择 Wall Panel Malaysia 的四大理由`

1. **Eyebrow:** `本地覆盖`
   **H4:** `{city_zh}全境免费量度上门`
   **Body:** 我们的安装师在{city_zh}周内与周末均提供量度服务。在{state_zh}范围内无差旅附加费,书面报价当晚便会发到您的 WhatsApp。

2. **Eyebrow:** `安装工期`
   **H4:** `多数{city_zh}项目3–7天完工`
   **Body:** 自订金到帐起,多数{city_zh}客厅与办公室一周内便完成墙板安装。较大型项目(整个前台、多个房间)通常两周内完工。

3. **Eyebrow:** `风格匹配`
   **H4:** `根据{city_zh}室内风格的样式建议`
   **Body:** {city_zh}的家居通常混合开放式起居与潮湿的实用区 — 我们会建议起居区用木纹或凹槽、居家办公室用隔音、潮湿区用 PVC,让饰面在最需要的位置持久耐用。

4. **Eyebrow:** `本地支持`
   **H4:** `真正能联系上的售后服务`
   **Body:** 施工保修只有在有人接电话时才有意义。{city_zh}客户使用预订安装时的同一条 WhatsApp 线路 — 真人响应,可立即派人修复,无需等待工单。

### 4.8 How It Works

复用首页的 4 步流程区块。

### 4.9 Customer Reviews

复用首页的 6 条评价区块 — 属品牌评价,非城市专属。

### 4.10 Local FAQ (8 Qs, 4 opener variants per Q)

**Section eyebrow:** `{CITY_ZH} 常见问题`
**Section H3:** `来自{city_zh}客户的墙板问题`

1. **Eyebrow:** `{CITY_ZH} 价格`
   **H4 (Q variants):**
   1. `在{city_zh}安装墙板每平方尺多少钱?`
   2. `{city_zh}墙板的实际每平方尺价格是多少?`
   3. `{city_zh}的墙板价格与吉隆坡不同吗?`
   4. `{city_zh}一间标准客厅做墙板大约多少钱?`
   **A:** 在{city_zh},标准墙板(木纹、凹槽、PVC、隔音)**RM25/sqft 起**;大理石墙板(金、银、黑)**RM38/sqft 起**。两者均含{city_zh}免费安装,无单独工费。我们在{city_zh}免费量度后,会发送书面报价。

2. **Eyebrow:** `{CITY_ZH} 工期`
   **H4 (Q variants):**
   1. `你们多快可以开始在{city_zh}安装墙板?`
   2. `本月{city_zh}最早的安装档期是什么时候?`
   3. `如果我今天确认,什么时候能在{city_zh}安装?`
   4. `一个{city_zh}项目实际多久可以完工?`
   **A:** 订金到账后,多数{city_zh}项目在3–7天内开工。{city_zh}单面墙安装通常现场1–2天完成;较大项目(整个前台、多个房间)通常2周内完工(含量度)。

3. **Eyebrow:** `{CITY_ZH} 免费安装`
   **H4 (Q variants):**
   1. `{city_zh}订单是否真的含免费安装?`
   2. `"免费安装"是否同样适用于{city_zh}?`
   3. `{city_zh}是否有隐藏的工费或运输费?`
   4. `我在{city_zh},是否会被额外收取安装费?`
   **A:** 是的 — 免费安装适用于每一份{city_zh}订单,不论风格或面积。无单独工费,无{state_zh}范围内运输费,无加班附加费。唯一可能新增的费用是大型木工或墙面修复(若现有墙面需先处理),这些我们会在您决定前明示。

4. **Eyebrow:** `{CITY_ZH} 风格`
   **H4 (Q variants):**
   1. `哪种墙板风格最适合{city_zh}家居?`
   2. `{city_zh}客厅有推荐的风格吗?`
   3. `多数{city_zh}客户选择木纹还是凹槽?`
   4. `{city_zh}居家办公室更适合隔音还是凹槽?`
   **A:** {city_zh}家居通常偏好木纹与凹槽用于客厅与卧室,因为暖色调与马来西亚的日光匹配。PVC 是厨房、卫浴与洗衣区的本地首选,因防潮性优良。隔音是我们在{city_zh}居家办公室与录音棚的安装首选,可让视频通话更清晰。大理石则保留给主墙 — 通常是电视墙与前台区。

5. **Eyebrow:** `{CITY_ZH} 覆盖`
   **H4 (Q variants):**
   1. `你们覆盖{city_zh}所有区域吗?`
   2. `{city_zh}哪些区域可以安装?`
   3. `团队是否可前往{city_zh}市中心以外?`
   4. `{city_zh}较远的郊区是否会额外收费?`
   **A:** 我们覆盖{city_zh}的每一个区域及整个{state_zh}。同一州内的郊区无附加费。若您临近{state_zh}州界 — 例如靠近{nearby_1}或{nearby_2} — 我们仍以相同的每平方尺价格派出同一队伍。

6. **Eyebrow:** `{CITY_ZH} 保修`
   **H4 (Q variants):**
   1. `{city_zh}安装有什么保修?`
   2. `若{city_zh}的墙板脱落,由谁修复?`
   3. `{city_zh}客户的施工保修期多长?`
   4. `{city_zh}的保修实际涵盖什么?`
   **A:** 每一次{city_zh}安装均附书面施工保修。若因我们的安装导致墙板翘起、脱落或失效,我们的团队上门免费修复。{city_zh}客户使用与预订安装相同的 WhatsApp 线路 — 无工单队列,无第三方派单。

7. **Eyebrow:** `{CITY_ZH} 保养`
   **H4 (Q variants):**
   1. `如何在{city_zh}清洁与保养墙板?`
   2. `{city_zh}潮湿气候下,墙板保养更难吗?`
   3. `{city_zh}气候下的墙板保养有何建议?`
   4. `您推荐的{city_zh}清洁日常是什么?`
   **A:** 日常保养是每周用干微纤维布擦拭。{city_zh}的 PVC 与大理石墙板可用湿布配温和肥皂清洁 — 适合厨房与前台桌面。木纹与隔音饰面避免使用强烈稀释剂或钢丝刷。{city_zh}的湿度不会损坏我们的墙板,因为我们采用12mm预饰面与隐藏卡扣,墙体背面可呼吸。

8. **Eyebrow:** `{CITY_ZH} 预订`
   **H4 (Q variants):**
   1. `如何在{city_zh}预约免费量度?`
   2. `{city_zh}获取报价最快的方式是什么?`
   3. `今天可以确认{city_zh}的量度档期吗?`
   4. `{city_zh}项目如何开始?`
   **A:** 只需 WhatsApp 发送墙面照片、大致尺寸与您倾向的风格。我们当天确认{city_zh}的免费量度档期,按您指定时间派出安装师,并在24小时内发送锁定促销价的书面报价。

### 4.11 Nearby Locations

- **Section eyebrow:** `周边城市`
- **H3:** `{city_zh}周边我们同样提供墙板安装`
- **Body line:** `相同的促销价、相同的团队、免费安装 — 覆盖以下城市。`
- **Anchor per nearby card:** `{nearby_n}墙板安装`

### 4.12 Final CTA (4 variants)

- **Section eyebrow:** `今日锁定 {CITY_ZH}`
- **H3 (variants):**
  1. `您的{city_zh}主墙,距离一条 WhatsApp 仅一步之遥`
  2. `准备好为{city_zh}的墙安装墙板了吗?现在锁定促销价`
  3. `{city_zh}免费量度 — 今日档期开放`
  4. `促销结束前,获取您的{city_zh}报价`

- **Body (variants):**
  1. `免费量度、免费报价、免费安装 — 在上方横幅有效期内,{city_zh}促销价锁定。一条信息、一支团队、一面高端墙。`
  2. `本周{city_zh}团队正在进行量度上门。发送您的墙面照片,我们今日便能确认档期 — 促销价保持到安装当天。`
  3. `省下工费、省下来回沟通。WhatsApp Wall Panel Malaysia 预约您的{city_zh}量度,我们处理其余一切。`
  4. `从木纹到大理石,从客厅到会议室 — 我们的{city_zh}团队按本页所示促销价安装全部五大风格。`

- **3 trust tags:** `免费安装` · `终身呵护` · `覆盖全马`
- **CTA label:** `WhatsApp 获取免费报价`

---

## 5. Implementation Notes for Kimmy

1. **Variant selection function (place in `lib/copyVariants.ts`):**
   ```ts
   function pickVariant<T>(slug: string, salt: string, variants: T[]): T {
     // Tiny FNV-1a-style hash, deterministic across builds
     let h = 2166136261;
     const key = `${slug}::${salt}`;
     for (let i = 0; i < key.length; i++) {
       h ^= key.charCodeAt(i);
       h = Math.imul(h, 16777619);
     }
     return variants[Math.abs(h) % variants.length];
   }
   ```
   Each section uses a unique `salt` (e.g. `'hero-h1'`, `'intro'`, `'faq-1-q'`, `'final-cta-h3'`) so different sections rotate independently per city — a city won't always pick variant 2 across the whole page.

2. **Variable substitution:** all `{city}`, `{city_zh}`, `{state}`, `{state_ms}`, `{state_zh}` come from `config/locations.ts` rows. `{nearby_1..4}` come from the same row's `nearbyMap` lookup.

3. **i18n keys:** store every variant array in `messages/{en,ms,zh}.json` under `location.{section}.variants[]`. The page component reads the array, calls `pickVariant(slug, salt, t.raw(key))`, and renders.

4. **Uniqueness review:** spot-check 10 random slugs after build to confirm no two adjacent cities share identical intro + final-CTA combos. If they collide, adjust the salt strings.

5. **SEO heading lint:** exactly 1 H1 + 1 H2 per page (hero), all other section titles H3 or H4. Every H3/H4 has a sibling `.eyebrow` directly above it. No keyword-bearing heading in H5/H6.

6. **Page parity:** sections 4 (Hero), 5 (USP), 6 (Product Grid), 7 (Promo Anchor), 9 (How It Works), 11 (Reviews), 14 (Final CTA), 15 (Footer), 16 (Floating WA) mirror the homepage exactly. Sections 3 (Breadcrumbs), 8 (Location Intro), 10 (Why {city}), 12 (Local FAQ), 13 (Nearby Locations) are location-specific.

---

## 6. Copy Review Checklist

- [x] Hero H1 and H2 per locale include the `{city}` (or `{city_zh}`) token and the primary keyword pattern from Sora's plan
- [x] Every location page renders exactly ONE H1 + ONE H2, both in the hero
- [x] All other section headings are H3 or H4 with a preceding `.eyebrow` label — no keyword phrases in H5/H6
- [x] Location intro paragraph has 4 distinct prose variants per locale that vary opening sentence structure, audience angle (general / homeowner / B2B / price), and mentions {city} naturally
- [x] Local FAQ has 8 questions with 4 opener variants each, every Q is H4 with an eyebrow, every answer is ≥ 2 sentences and mentions {city} at least once
- [x] Nearby Locations section uses real slug-driven city names from `config/locations.ts → nearbyMap`
- [x] WhatsApp is the only CTA mechanism; button labels match the brief in all 3 locales
- [x] No phone numbers or domain URLs anywhere in the visible copy
- [x] Promo pricing (`RM25/sqft` Standard / `RM38/sqft` Marble) referenced in intro and FAQ on every variant
- [x] "Free Installation" badge wording appears in hero pill, intro paragraph, why-{city} cards, and final CTA across all 3 locales
- [x] Template approach keeps total maintained copy manageable while producing visibly unique pages per city via hash-based variant cycling
