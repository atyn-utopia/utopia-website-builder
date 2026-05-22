# katering-auntyrokiah — Project Inputs

**Created:** 2026-05-21
**Slug:** katering-auntyrokiah
**Status:** confirmed — ready to enter agent pipeline

---

## Original User Prompt

> i want to create a website for business AuntyRokiah Katering. i want to display a catering package and some food that suitable for kenduri kahwin, minum petang, kenduri aqiqah and others. i also attached package for you to refer and use in the website. use the logo i attached too. also use color palette that match with the logo for the whole landing page.

## Brand Assets (supplied by user)
- `brand_assets/pasted-image-1779348873206.png` — official logo (ornate kenduri pot crest, "AuntyRokiah KATERING — SINCE 1998 — TRADISI RASA, SENTUHAN ISTIMEWA")
- `brand_assets/Screenshot 2026-05-21 at 10.22.07 AM.png` — Pakej Katering Jimat reference card
- `brand_assets/Screenshot 2026-05-21 at 10.22.27 AM.png` — Pakej Katering Standard reference card
- `brand_assets/Screenshot 2026-05-21 at 10.22.43 AM.png` — Pakej Katering Premium + Air Balang add-on card

---

## Confirmed Inputs

| Field | Value |
|-------|-------|
| Company owner | Kak Kenduri Sdn. Bhd. |
| Company UUID  | `ce95071b-e575-4983-bdd4-66910f45fe34` |
| Brand name    | AuntyRokiah Katering |
| Tagline       | Tradisi Rasa, Sentuhan Istimewa |
| Heritage line | Since 1998 |
| Project slug  | `katering-auntyrokiah` |
| Product name  | Pakej Katering |
| Product slug  | `pakej-katering` |
| Domain        | `auntyrokiah-katering.utopiaai.my` |
| Target country | Malaysia |
| Languages     | Bahasa Melayu (`ms`, default), English (`en`), Simplified Chinese (`zh`) |
| Default locale | `ms` |
| WhatsApp phone | `60174287801` |
| Leads mode    | `single` |
| Tracking domain (data-website) | `auntyrokiah-katering.utopiaai.my` |
| Webcore revalidate route | `/api/revalidate` (POST, `x-webcore-secret`) |
| Brand assets  | Provided (see above) — logo + 3 package screenshots |
| Competitor URLs | none |

---

## Product / Package Catalogue (source of truth for Supabase seeding)

All four rows go into `products` with `website = 'auntyrokiah-katering.utopiaai.my'`, `is_active = true`.

### 1. Pakej Katering Jimat — RM15/pax  *(Best Seller)*
- Includes: Nasi Minyak, Ayam Merah, Acar Timun, Papadom
- Badge: Best Seller
- `sort_order`: 1

### 2. Pakej Katering Standard — RM21/pax
- Includes: Nasi Minyak, Ayam Merah, Acar Timun, Papadom, Daging Hitam
- `sort_order`: 2

### 3. Pakej Katering Premium — RM25/pax
- Includes: Nasi Minyak, Ayam Merah, Acar Timun, Papadom, Daging Hitam, Buah, Kuih
- `sort_order`: 3

### 4. Add-on — Air Balang — RM80 / 1 balang per 50 pax
- Flavours: Oren, Sirap, Anggur
- `sort_order`: 4
- Stored as a separate product with `parent_id` referencing nothing (standalone add-on row)

---

## Target Use Cases (drive copy + meta)
- Kenduri kahwin
- Kenduri aqiqah
- Majlis doa selamat
- Majlis rumah terbuka
- Minum petang / high tea
- Corporate / office makan-makan
- Family gatherings & reunions
- Tahlil & majlis berkat

---

## Brand Direction
- Warm Malaysian kenduri feel + clean modern SEO layout.
- Palette anchored to the logo: cream/ivory base on the logo, warm spicy orange/turmeric accents from the crest, deep charcoal for typography, sambal red reserved for FOMO/urgency, official WhatsApp green for CTAs only.
- Site background base is **white** (CLAUDE.md anti-generic rule) — warm tones used as accents, not flooded fills.
- Typography: **Plus Jakarta Sans** (display + UI) + **Inter** (body) — both sans, no serif.
- Logo icon (kenduri pot crest) must be isolated and reused as `app/icon.svg` favicon.
- WhatsApp CTAs: official `#25D366` only.
- No phone number or domain visible as plain text anywhere.

---

## Location Coverage (16 state groupings × 10 sub-locations = 160 locations)

> Slugs are URL-safe; names are display strings. Every state grouping AuntyRokiah Katering serves has ≥10 real populated sub-locations (per CLAUDE.md Location Coverage Requirements).

### Kuala Lumpur
kuala-lumpur — Kuala Lumpur
wangsa-maju — Wangsa Maju
setapak — Setapak
cheras-kl — Cheras KL
kepong — Kepong
sentul — Sentul
bangsar — Bangsar
mont-kiara — Mont Kiara
sri-petaling — Sri Petaling
taman-melawati — Taman Melawati

### Selangor
shah-alam — Shah Alam
petaling-jaya — Petaling Jaya
subang-jaya — Subang Jaya
puchong — Puchong
klang — Klang
kajang — Kajang
ampang — Ampang
rawang — Rawang
sepang — Sepang
cyberjaya — Cyberjaya

### Johor
johor-bahru — Johor Bahru
iskandar-puteri — Iskandar Puteri
pasir-gudang — Pasir Gudang
skudai — Skudai
batu-pahat — Batu Pahat
muar — Muar
kluang — Kluang
pontian — Pontian
kota-tinggi — Kota Tinggi
segamat — Segamat

### Penang
george-town — George Town
bayan-lepas — Bayan Lepas
gelugor — Gelugor
tanjung-bungah — Tanjung Bungah
air-itam — Air Itam
butterworth — Butterworth
bukit-mertajam — Bukit Mertajam
perai — Perai
nibong-tebal — Nibong Tebal
kepala-batas — Kepala Batas

### Perak
ipoh — Ipoh
taiping — Taiping
teluk-intan — Teluk Intan
seri-iskandar — Seri Iskandar
manjung — Manjung
lumut — Lumut
sitiawan — Sitiawan
kuala-kangsar — Kuala Kangsar
tapah — Tapah
kampar — Kampar

### Kedah
alor-setar — Alor Setar
sungai-petani — Sungai Petani
kulim — Kulim
langkawi — Langkawi
jitra — Jitra
pendang — Pendang
gurun — Gurun
baling — Baling
yan — Yan
kubang-pasu — Kubang Pasu

### Negeri Sembilan
seremban — Seremban
nilai — Nilai
port-dickson — Port Dickson
senawang — Senawang
bahau — Bahau
tampin — Tampin
rembau — Rembau
kuala-pilah — Kuala Pilah
mantin — Mantin
lukut — Lukut

### Melaka
melaka — Melaka
ayer-keroh — Ayer Keroh
batu-berendam — Batu Berendam
bukit-baru — Bukit Baru
klebang — Klebang
masjid-tanah — Masjid Tanah
alor-gajah — Alor Gajah
jasin — Jasin
merlimau — Merlimau
durian-tunggal — Durian Tunggal

### Pahang
kuantan — Kuantan
temerloh — Temerloh
bentong — Bentong
mentakab — Mentakab
raub — Raub
jerantut — Jerantut
pekan — Pekan
cameron-highlands — Cameron Highlands
maran — Maran
rompin — Rompin

### Terengganu
kuala-terengganu — Kuala Terengganu
kuala-nerus — Kuala Nerus
dungun — Dungun
kemaman — Kemaman
chukai — Chukai
paka — Paka
marang — Marang
besut — Besut
jerteh — Jerteh
setiu — Setiu

### Kelantan
kota-bharu — Kota Bharu
kubang-kerian — Kubang Kerian
pengkalan-chepa — Pengkalan Chepa
pasir-mas — Pasir Mas
tumpat — Tumpat
bachok — Bachok
tanah-merah — Tanah Merah
machang — Machang
kuala-krai — Kuala Krai
gua-musang — Gua Musang

### Perlis
kangar — Kangar
arau — Arau
kuala-perlis — Kuala Perlis
padang-besar — Padang Besar
simpang-empat-perlis — Simpang Empat Perlis
beseri — Beseri
pauh — Pauh
changlun-perlis — Changlun Perlis
mata-ayer — Mata Ayer
santan — Santan

### Sabah
kota-kinabalu — Kota Kinabalu
putatan — Putatan
penampang — Penampang
tuaran — Tuaran
sandakan — Sandakan
tawau — Tawau
lahad-datu — Lahad Datu
keningau — Keningau
beaufort — Beaufort
ranau — Ranau

### Sarawak
kuching — Kuching
kota-samarahan — Kota Samarahan
miri — Miri
sibu — Sibu
bintulu — Bintulu
sri-aman — Sri Aman
sarikei — Sarikei
limbang — Limbang
kapit — Kapit
mukah — Mukah

### Putrajaya
putrajaya — Putrajaya
presint-5 — Presint 5
presint-8 — Presint 8
presint-9 — Presint 9
presint-11 — Presint 11
presint-14 — Presint 14
presint-15 — Presint 15
presint-16 — Presint 16
presint-18 — Presint 18
presint-diplomatik — Presint Diplomatik

### Labuan
labuan — Labuan
victoria-labuan — Victoria Labuan
rancha-rancha — Rancha-Rancha
kampung-sungai-lada — Kampung Sungai Lada
kampung-bebuloh — Kampung Bebuloh
kampung-layang-layangan — Kampung Layang-Layangan
kampung-patau-patau — Kampung Patau-Patau
kampung-tanjung-aru-labuan — Kampung Tanjung Aru Labuan
kampung-lubok-temiang — Kampung Lubok Temiang
kampung-batu-arang-labuan — Kampung Batu Arang Labuan

**Total: 160 locations across 16 groupings.**

---

## Approval Gates
- **Gate 1** — user confirms website design (after dev server + screenshots) before any product/blog/database/deploy work continues.
- **Gate 2** — user confirms final products, blog posts, and copy in all 3 locales before phone seeding + Vercel deploy.
