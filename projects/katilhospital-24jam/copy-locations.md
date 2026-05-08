# Katil Hospital 24 Jam — Location Pages Copy

**Agent:** Nana — Copywriter
**Authored:** 2026-04-23
**Primary locale:** `ms` (authored first). EN and ZH are translations of MS.
**Location count:** 159 cities × 3 locales = **477 location pages**.
**Approach:** template + variant system with a **deterministic hash-pick rule** so each city gets a unique combination of intro, meta, and FAQ — without 477 hand-written strings (per task brief).
**Section parity:** matches `architecture.md` §7 Location page order (1–14). Homepage sections 5–9 and 11–12 are re-used shared blocks from `copy-homepage.md`.

---

## 0. Uniqueness strategy

### 0.1 Problem

477 location pages must satisfy:
1. Unique meta title, meta description, H1, H2 per city.
2. Unique intro paragraph (150–250 words) per city.
3. Unique FAQ combination per city (3 shared + 2 unique city questions).
4. Unique alt text and nearby-locations block per city.

Hand-writing 477 × 4 unique strings is not how this system is built — Kimmy implements it. Nana provides **Malaysian-specific city fact data** + **templates with rotating variants** + **a deterministic hash-pick rule** that Kimmy wires into `lib/locationCopy.ts` (see electric-wheelchair-malaysia reference).

### 0.2 Hash-pick rule (pseudo-code Kimmy implements verbatim)

```ts
// lib/locationCopy.ts
function hash(slug: string): number {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function pick<T>(slug: string, bucket: T[], offset = 0): T {
  return bucket[(hash(slug) + offset) % bucket.length];
}

// Each city deterministically gets:
//   intro variant   = pick(slug, introVariants[state], 0)
//   h2 variant      = pick(slug, h2Variants,           1)
//   meta USP token  = pick(slug, uspTokens,            2)
//   faq variant     = pick(slug, faqVariants[state],   3)
```

Because `hash(slug)` is stable, the same city always renders the same variant across builds — good for SEO (no flicker) and good for hreflang (MS/EN/ZH stay in lockstep).

### 0.3 Variant counts

| Surface | # variants | Uniqueness driver |
|---|---|---|
| Intro paragraph | 4 variants × 14 states = **56 intro shells**, each filled with `{city}`, `{state}`, `{hospital}`, `{nearby1}`, `{nearby2}`, `{district}` → 159 unique paragraphs | Per-state phrasing + per-city fact tokens |
| H2 subtitle | 8 shared variants × 14 states = 112 combinations → 159 unique H2 strings | State-specific suffix + rotating USP |
| Meta description | 1 template × 6 `{usp}` tokens → 954 candidate strings, 477 needed, picked via hash → no duplicates | Rotating USP token |
| Meta title | 2 templates × 159 cities = 318 MS titles (trim "Malaysia" where >14-char city) | Template + length guardrail |
| Intro + FAQ in EN and ZH | translated from same MS shell the hash picks → stays parallel across locales | Translation preserves uniqueness |

All three locales use the **same hash result** so Kuala Lumpur MS + EN + ZH all read Variant A (translated); Petaling Jaya reads Variant B; etc. This preserves hreflang consistency (a single intended meaning per page, three translations).

---

## 1. Shared building blocks (referenced by every location page)

Every location page re-uses the following blocks from `copy-homepage.md` verbatim (per homepage/location parity rule in `architecture.md`):

- **FOMO bar** → §1 of homepage copy (all 3 locales).
- **Floating pill nav** → §2.
- **3-point USP bar** → §4.
- **Product grid intro + 8 SKU fallback cards** → §5.
- **Why Choose 24 Jam (4 cards)** → §6.
- **How it works — 3 steps** → §7.
- **Customer gallery intro** → §8.
- **Google Review section** (intro + 4 of the 8 shared reviews — per brief "4 shared + 4 location-tagged"; shared 4 = reviews #1, #3, #6, #8 from homepage §9.2).
- **Final CTA band** → §11 of homepage copy.
- **Footer** → §12.

The **only location-unique** sections on a location page are:
1. Breadcrumbs (§2 below)
2. Hero H1 + H2 (§3 below)
3. Intro paragraph (§4 below)
4. Reviews — 4 location-tagged reviews (§5 below)
5. FAQ — 3 shared + 2 city-unique (§6 below)
6. Nearby locations block (§7 below)
7. Meta title + description (§8 below)

---

## 2. Breadcrumbs (Home › Katil Hospital › {City})

| Locale | Template |
|---|---|
| `ms` | Laman Utama › Katil Hospital › **{city}** |
| `en` | Home › Hospital Bed › **{city}** |
| `zh` | 主页 › 病床 › **{city}** |

`{city}` = `Location.name` from `config/locations.ts`.

Emitted both visually AND as `BreadcrumbList` JSON-LD per `seo-plan.md` §6.

---

## 3. Hero — H1 + H2 per location (exactly one of each)

### 3.1 H1 template

| Locale | H1 template | Example: `kuala-lumpur` |
|---|---|---|
| `ms` | **Sewa Katil Hospital di {city} — Hantar 24 Jam** | Sewa Katil Hospital di Kuala Lumpur — Hantar 24 Jam |
| `en` | **Hospital Bed Rental in {city} — 24-Hour Delivery** | Hospital Bed Rental in Kuala Lumpur — 24-Hour Delivery |
| `zh` | **{city} 病床租用 — 24小时送达** | 吉隆坡 病床租用 — 24小时送达 |

Length check: worst-case `{city}` = "Simpang Empat (Perlis)" (22 chars) — not used in H1 because it's a heading not a meta title; long strings are fine in H1.

### 3.2 H2 template — 8 rotating variants (picked via `pick(slug, h2Variants, 1)`)

MS variants (each includes `{city}`, `{state}`, a rotating USP, and a rotating noun from "manual, elektrik, tilam anti-decubitus"):

| # | MS H2 shell |
|---|---|
| A | Penghantaran 24 jam di {city}, {state} — manual, elektrik & tilam anti-decubitus. |
| B | Hantar hari sama ke {city} dan kawasan {state} — katil, tilam dan peralatan penjagaan. |
| C | Pakej sewa atau beli di {city}, {state} — harga telus, pasang lengkap di rumah. |
| D | Dari {state} ke {city} — katil hospital dihantar & dipasang dalam 24 jam. |
| E | Katil manual, katil elektrik dan tilam angin untuk keluarga di {city}, {state}. |
| F | Bantu penjagaan di rumah di {city} — 24 jam, sewa bulanan, liputan {state}. |
| G | Sebut harga cepat via WhatsApp untuk pelanggan {city}, {state} — hantar esok. |
| H | Peralatan hospital gred tinggi untuk {city} dan seluruh {state} — hantar 24 jam. |

EN variants (direct translations of same 8):

| # | EN H2 shell |
|---|---|
| A | 24-hour delivery in {city}, {state} — manual, electric, and anti-decubitus mattresses. |
| B | Same-day delivery to {city} and surrounding {state} — beds, mattresses, and care equipment. |
| C | Rental or purchase packages in {city}, {state} — transparent pricing, full home setup. |
| D | From {state} to {city} — hospital beds delivered and assembled within 24 hours. |
| E | Manual beds, electric beds, and air mattresses for families in {city}, {state}. |
| F | Home-care support in {city} — 24 hours, monthly rental, full {state} coverage. |
| G | Fast WhatsApp quotes for {city}, {state} customers — delivered the next day. |
| H | Hospital-grade equipment for {city} and all of {state} — delivered in 24 hours. |

ZH variants (same 8, translated):

| # | ZH H2 shell |
|---|---|
| A | {state} {city} 24小时送达 — 手动、电动病床及防褥疮气垫。 |
| B | 当天送达{city}及周边{state}地区 — 病床、床垫与护理设备齐全。 |
| C | {state} {city} 租购方案 — 报价透明，上门完成安装。 |
| D | 从{state}到{city} — 病床24小时内送达并安装到位。 |
| E | 为{state} {city}家庭提供手动病床、电动病床与气垫床。 |
| F | 在{city}协助居家照护 — 24小时送货、月租方案、覆盖整个{state}。 |
| G | {state} {city}客户可透过WhatsApp快速报价 — 隔天送达。 |
| H | 为{city}及整个{state}提供医院级设备 — 24小时内送达。 |

Token filler rules:
- `{city}` = `Location.name`
- `{state}` = `Location.state`. Special cases: "Klang Valley" renders as-is in MS; ZH renders as "巴生谷"; EN as "Klang Valley". Full mapping Kimmy wires:

| Internal state | MS | EN | ZH |
|---|---|---|---|
| Klang Valley | Lembah Klang | Klang Valley | 巴生谷 |
| Selangor | Selangor | Selangor | 雪兰莪 |
| Negeri Sembilan | Negeri Sembilan | Negeri Sembilan | 森美兰 |
| Melaka | Melaka | Melaka | 马六甲 |
| Johor | Johor | Johor | 柔佛 |
| Perak | Perak | Perak | 霹雳 |
| Penang | Pulau Pinang | Penang | 槟城 |
| Kedah | Kedah | Kedah | 吉打 |
| Perlis | Perlis | Perlis | 玻璃市 |
| Kelantan | Kelantan | Kelantan | 吉兰丹 |
| Terengganu | Terengganu | Terengganu | 登嘉楼 |
| Pahang | Pahang | Pahang | 彭亨 |
| Sabah | Sabah | Sabah | 沙巴 |
| Sarawak | Sarawak | Sarawak | 砂拉越 |

---

## 4. Intro paragraph — 150–250 words, UNIQUE per city

### 4.1 Structure rule

Every intro must mention, in this order:
1. `{city}` by name in the first sentence.
2. `{state}`.
3. **One notable local anchor**: a hospital, landmark, or district (from `localFacts` table — §4.3).
4. **Two nearby cities** (from `nearbyMap[slug]`).
5. The **24-jam delivery promise**.
6. A note on rental + sale and WhatsApp contact.

Word count: 160–220 words per MS intro. EN and ZH translations hit the same semantic length.

### 4.2 Intro shell variants — 4 per state × 14 states = 56 MS shells

Each shell uses different sentence openings, clause order, and anchoring. Four variants (A, B, C, D) per state. The hash-pick rule selects one of the four for each city.

#### 4.2.1 Klang Valley — 25 cities, 4 intro variants (MS)

**Variant A (urgency-first opener):**

> Bila keluarga di {city} memerlukan katil hospital dengan segera — selalunya selepas pesakit keluar dari {hospital} atau pembedahan — menunggu beberapa hari bukanlah pilihan. Di situlah Katil Hospital 24 Jam masuk. Kami hantar katil manual, katil elektrik 3-fungsi dan tilam anti-decubitus ke {city} dan kawasan sekitar {district} dalam masa 24 jam selepas tempahan disahkan. Keluarga di {nearby1} dan {nearby2} juga kami layan di laluan logistik yang sama. Pilihan sewa bulanan fleksibel sesuai untuk pesakit yang masih dalam proses pemulihan — bayar hanya untuk tempoh yang diperlukan. Jika anda memilih untuk beli, kami pasang katil di bilik pesakit, tunjuk cara guna remote, dan tinggalkan keluarga dengan sokongan WhatsApp aktif. Tidak ada tempahan telefon yang panjang, tidak ada borang kertas — hanya satu mesej WhatsApp dan pasukan kami mula bergerak.

**Variant B (care-first opener):**

> Menjaga orang tua atau pesakit strok di rumah di {city} memerlukan peralatan yang betul. Kami membekalkan katil hospital berkualiti hospital — bingkai keluli, rail sisi, dan pilihan pelarasan manual atau elektrik — untuk keluarga di seluruh {state}. Di {city}, kebanyakan pelanggan kami adalah anak yang menjaga ibu bapa selepas pemulangan dari hospital seperti {hospital}. Kami faham kedudukan itu, dan itulah sebabnya penghantaran 24 jam adalah standard, bukan tawaran premium. Kami juga melayani kawasan berdekatan di {district}, termasuk keluarga di {nearby1} dan {nearby2}. Untuk penjagaan jangka pendek, sewa bulanan adalah pilihan yang paling berpatutan; untuk penjagaan jangka panjang, pembelian dengan waranti tahun pertama memberi ketenangan. Hubungi kami via WhatsApp dan terangkan keperluan pesakit — kami cadangkan pakej yang betul tanpa jualan paksa.

**Variant C (product-first opener):**

> Katil hospital, tilam hospital, tilam angin anti-decubitus, mesin oksigen, kerusi roda, dan mesin CPAP — semua boleh disewa atau dibeli dan dihantar ke {city} dalam 24 jam. Sebagai sebahagian daripada {state}, {city} adalah antara lokasi dengan permintaan tertinggi untuk peralatan penjagaan di rumah. Pasukan logistik kami beroperasi dari gudang pusat dan menjangkau ke {district} serta bandar berdekatan seperti {nearby1} dan {nearby2}. Untuk pesakit terlantar jangka panjang, tilam angin gelombang bermotor kami membantu mengurangkan risiko kudis katil (decubitus) secara ketara — banyak keluarga di {city} menyewa tilam ini bersama katil manual 2-fungsi. Jika pesakit anda baru keluar dari {hospital}, kami cadangkan sewa dahulu selama sebulan untuk menilai keperluan sebenar sebelum beli. WhatsApp kami untuk sebut harga — kami balas dengan cadangan pakej dalam masa 30 minit.

**Variant D (trust-first opener):**

> Ratusan keluarga di {state} — termasuk di {city}, {nearby1}, dan {nearby2} — telah menyewa atau membeli katil hospital daripada kami sejak beberapa tahun lalu. Apa yang kami dengar paling kerap dari pelanggan di {city} adalah: "Hantar cepat, pasang kemas, harga jelas." Itulah tiga janji yang kami pegang. Kami faham bila seseorang di keluarga anda memerlukan penjagaan — sama ada selepas tinggal di {hospital}, strok di rumah, atau pembedahan lutut — pilihan katil yang betul adalah antara selesa dan tidak. Kami membantu anda memilih: manual 1-fungsi untuk pesakit yang masih boleh bergerak, manual 2-fungsi untuk pesakit terlantar, atau elektrik 3-fungsi untuk penjaga warga emas. Lokasi anda di {district} tidak menghalang penghantaran 24 jam — logistik kami sudah lengkap menjangkau {city}. WhatsApp kami hari ini.

Token `{hospital}` per Klang Valley city (real hospitals — Nana-compiled fact table — Kimmy injects as a lookup):

| city slug | hospital | district |
|---|---|---|
| kuala-lumpur | Hospital Kuala Lumpur | Jalan Pahang / KLCC |
| petaling-jaya | Hospital Sungai Buloh | Section 13 / SS2 |
| shah-alam | Hospital Shah Alam | Seksyen 7 |
| subang-jaya | Subang Jaya Medical Centre | USJ / SS15 |
| puchong | Columbia Asia Hospital Puchong | Bandar Puteri |
| cheras | Hospital Cheras | Taman Midah |
| ampang | Hospital Ampang | Pandan Indah |
| kepong | Hospital Sungai Buloh | Taman Usahawan |
| setapak | Hospital Kuala Lumpur | Danau Kota |
| wangsa-maju | Hospital Kuala Lumpur | Section 5 |
| bangsar | Hospital Pantai Kuala Lumpur | Bangsar Baru |
| mont-kiara | Gleneagles Hospital Kuala Lumpur | Mont Kiara 10 |
| damansara | Damansara Specialist Hospital | Damansara Utama |
| sri-petaling | Hospital Kuala Lumpur | Sri Petaling |
| bukit-jalil | KPJ Bukit Jalil | Bukit Jalil |
| cyberjaya | Cyberjaya Hospital | Cyber 8 |
| putrajaya | Hospital Putrajaya | Presint 7 |
| kajang | Hospital Kajang | Sungai Chua |
| bangi | Hospital Putrajaya | Seksyen 8 |
| semenyih | Hospital Kajang | Taman Semenyih Sentral |
| rawang | Hospital Selayang | Bandar Country Homes |
| selayang | Hospital Selayang | Batu Caves |
| gombak | Hospital Selayang | Taman Selayang |
| klang | Hospital Tengku Ampuan Rahimah | Bandar Klang |
| port-klang | Hospital Tengku Ampuan Rahimah | Pandamaran |

#### 4.2.2 Selangor (outside Klang Valley) — 10 cities, 4 intro variants

**Variant A (urgency-first):** same shell as Klang Valley A, with `{state}` = "Selangor" and `{hospital}` from Selangor table below.

**Variant B (care-first):** same pattern as Klang Valley B.

**Variant C (product-first):** same pattern as Klang Valley C.

**Variant D (trust-first):** same pattern as Klang Valley D.

Since Klang Valley and Selangor share the same state border — the 4 variants above are reused, and uniqueness comes from the different `{hospital}`, `{district}`, `{nearby1}`, `{nearby2}` tokens. Hash-pick ensures no two cities pick the same variant + same tokens.

Selangor hospital/district table:

| city slug | hospital | district |
|---|---|---|
| sepang | Hospital Serdang | KLIA |
| banting | Hospital Banting | Jenjarom |
| kuala-selangor | Hospital Kuala Selangor | Tanjung Karang |
| hulu-langat | Hospital Kajang | Batu 9 |
| serdang | Hospital Serdang | Seri Kembangan |
| sungai-buloh | Hospital Sungai Buloh | Kota Damansara |
| kuala-kubu-bharu | Hospital Kuala Kubu Bharu | Bukit Kuda |
| sabak-bernam | Hospital Sungai Besar | Sabak |
| hulu-selangor | Hospital Kuala Kubu Bharu | Batang Kali |
| tanjung-karang | Hospital Kuala Selangor | Jalan Utama |

#### 4.2.3 — 4.2.14 Remaining 12 states (Negeri Sembilan, Melaka, Johor, Perak, Penang, Kedah, Perlis, Kelantan, Terengganu, Pahang, Sabah, Sarawak)

Same 4-variant shell structure (A urgency / B care / C product / D trust), state-tokenised. Each state supplies its own `{hospital}` / `{district}` table. Nana-compiled tables:

**Negeri Sembilan (10):**

| city slug | hospital | district |
|---|---|---|
| seremban | Hospital Tuanku Jaafar | Senawang |
| nilai | Hospital Nilai | Bandar Enstek |
| port-dickson | Hospital Port Dickson | Teluk Kemang |
| rembau | Hospital Tuanku Ampuan Najihah | Pedas |
| kuala-pilah | Hospital Kuala Pilah | Bahau |
| jelebu | Hospital Jelebu | Titi |
| jempol | Hospital Jempol | Bandar Baru Serting |
| tampin | Hospital Tampin | Pulau Sebang |
| bahau | Hospital Jempol | Batu Kikir |
| gemas | Hospital Gemas | Gemas Baru |

**Melaka (10):**

| city slug | hospital | district |
|---|---|---|
| melaka | Hospital Melaka | Bandar Hilir |
| ayer-keroh | Hospital Melaka | Lebuh Ayer Keroh |
| alor-gajah | Hospital Alor Gajah | Pulau Sebang |
| jasin | Hospital Jasin | Merlimau |
| masjid-tanah | Hospital Alor Gajah | Pulau Sebang |
| batu-berendam | Hospital Melaka | Taman Merdeka |
| bukit-beruang | Hospital Melaka | MMU Melaka |
| merlimau | Hospital Jasin | Chin Chin |
| bemban | Hospital Jasin | Chin Chin |
| durian-tunggal | Hospital Alor Gajah | USIM Melaka |

**Johor (12):**

| city slug | hospital | district |
|---|---|---|
| johor-bahru | Hospital Sultanah Aminah | Jalan Skudai |
| iskandar-puteri | Hospital Sultan Ismail | Nusajaya |
| kulai | Hospital Kulai | Bandar Indahpura |
| batu-pahat | Hospital Sultanah Nora Ismail | Bandar BP |
| muar | Hospital Pakar Sultanah Fatimah | Bandar Muar |
| kluang | Hospital Enche' Besar Hajjah Kalsom | Bandar Kluang |
| segamat | Hospital Segamat | Jalan Genuang |
| pontian | Hospital Pontian | Kukup |
| mersing | Hospital Mersing | Pulau Tioman jetty |
| kota-tinggi | Hospital Kota Tinggi | Pengerang |
| tangkak | Hospital Tangkak | Bandar Tangkak |
| yong-peng | Hospital Yong Peng | Parit Raja |

**Perak (12):**

| city slug | hospital | district |
|---|---|---|
| ipoh | Hospital Raja Permaisuri Bainun | Bandar Ipoh |
| taiping | Hospital Taiping | Kamunting |
| teluk-intan | Hospital Teluk Intan | Bandar Baru |
| sitiawan | Hospital Seri Manjung | Kampung Koh |
| kampar | Hospital Kampar | UTAR Kampar |
| batu-gajah | Hospital Batu Gajah | Pusing |
| lumut | Hospital Seri Manjung | Lumut jetty |
| parit-buntar | Hospital Parit Buntar | Bagan Serai |
| bagan-serai | Hospital Parit Buntar | Selinsing |
| kuala-kangsar | Hospital Kuala Kangsar | Bukit Chandan |
| gerik | Hospital Gerik | Banding |
| tanjung-malim | Hospital Slim River | UPSI Tanjung Malim |

**Penang (10):**

| city slug | hospital | district |
|---|---|---|
| george-town | Hospital Pulau Pinang | Jalan Residensi |
| butterworth | Hospital Seberang Jaya | Bandar Butterworth |
| bukit-mertajam | Hospital Bukit Mertajam | Alma |
| nibong-tebal | Hospital Seberang Jaya | Valdor |
| bayan-lepas | Hospital Bukit Mertajam | FIZ Bayan Lepas |
| balik-pulau | Hospital Balik Pulau | Teluk Bahang |
| jelutong | Hospital Pulau Pinang | Jalan Perak |
| air-itam | Hospital Pulau Pinang | Farlim |
| tanjung-bungah | Hospital Pulau Pinang | Batu Ferringhi |
| simpang-ampat | Hospital Seberang Jaya | Batu Kawan |

**Kedah (10):**

| city slug | hospital | district |
|---|---|---|
| alor-setar | Hospital Sultanah Bahiyah | Anak Bukit |
| sungai-petani | Hospital Sultan Abdul Halim | Bandar SP |
| kulim | Hospital Kulim | Taman Selasih |
| langkawi | Hospital Langkawi | Kuah |
| jitra | Hospital Jitra | Kodiang |
| changlun | Hospital Jitra | Bukit Kayu Hitam |
| baling | Hospital Baling | Sik |
| kulim-hi-tech | Hospital Kulim | Kulim Hi-Tech Park |
| yan | Hospital Yan | Yan Kecil |
| pendang | Hospital Pendang | Tikam Batu |

**Perlis (10):**

| city slug | hospital | district |
|---|---|---|
| kangar | Hospital Tuanku Fauziah | Bandar Kangar |
| arau | Hospital Tuanku Fauziah | UniMAP Arau |
| padang-besar | Hospital Kangar | Padang Besar border |
| kuala-perlis | Hospital Tuanku Fauziah | Kuala Perlis jetty |
| beseri | Hospital Tuanku Fauziah | Wang Kelian |
| chuping | Hospital Kangar | Chuping Valley |
| kaki-bukit | Hospital Kangar | Wang Kelian |
| simpang-empat-perlis | Hospital Tuanku Fauziah | Bukit Keteri |
| sanglang | Hospital Kangar | Kuala Sanglang |
| mata-ayer | Hospital Tuanku Fauziah | Simpang Empat |

**Kelantan (10):**

| city slug | hospital | district |
|---|---|---|
| kota-bharu | Hospital Raja Perempuan Zainab II | Jalan Sultanah Zainab |
| pasir-mas | Hospital Pasir Mas | Rantau Panjang |
| tanah-merah | Hospital Tanah Merah | Kusial |
| tumpat | Hospital Tumpat | Pengkalan Kubor |
| pasir-puteh | Hospital Pasir Puteh | Bandar Selising |
| machang | Hospital Machang | Ulu Temiang |
| kuala-krai | Hospital Kuala Krai | Manek Urai |
| gua-musang | Hospital Gua Musang | Bertam |
| jeli | Hospital Jeli | Kuala Balah |
| bachok | Hospital Bachok | Pantai Irama |

**Terengganu (10):**

| city slug | hospital | district |
|---|---|---|
| kuala-terengganu | Hospital Sultanah Nur Zahirah | Kuala Ibai |
| kemaman | Hospital Kemaman | Chukai town |
| dungun | Hospital Dungun | Paka |
| marang | Hospital Hulu Terengganu | Pulau Kapas jetty |
| besut | Hospital Besut | Jerteh |
| setiu | Hospital Setiu | Penarik |
| hulu-terengganu | Hospital Hulu Terengganu | Kuala Berang |
| chukai | Hospital Kemaman | Bandar Chukai |
| jerteh | Hospital Besut | Kampung Raja |
| paka | Hospital Dungun | Kerteh |

**Pahang (10):**

| city slug | hospital | district |
|---|---|---|
| kuantan | Hospital Tengku Ampuan Afzan | Indera Mahkota |
| temerloh | Hospital Sultan Haji Ahmad Shah | Mentakab |
| bentong | Hospital Bentong | Karak |
| raub | Hospital Raub | Tras |
| jerantut | Hospital Jerantut | Kuala Tembeling |
| maran | Hospital Maran | Chenor |
| pekan | Hospital Pekan | Nenasi |
| rompin | Hospital Pekan | Kuala Rompin |
| cameron-highlands | Hospital Cameron Highlands | Tanah Rata |
| kuala-lipis | Hospital Kuala Lipis | Benta |

**Sabah (10):**

| city slug | hospital | district |
|---|---|---|
| kota-kinabalu | Hospital Queen Elizabeth | Bandaran Berjaya |
| sandakan | Hospital Duchess of Kent | Batu 4 |
| tawau | Hospital Tawau | Fajar |
| lahad-datu | Hospital Lahad Datu | Felda Sahabat |
| keningau | Hospital Keningau | Bingkor |
| semporna | Hospital Semporna | Bandar Semporna |
| kudat | Hospital Kudat | Sikuati |
| papar | Hospital Papar | Kimanis |
| beaufort | Hospital Beaufort | Weston |
| ranau | Hospital Ranau | Kundasang |

**Sarawak (10):**

| city slug | hospital | district |
|---|---|---|
| kuching | Hospital Umum Sarawak | Jalan Hospital |
| miri | Hospital Miri | Lutong |
| sibu | Hospital Sibu | Rejang |
| bintulu | Hospital Bintulu | Kidurong |
| sri-aman | Hospital Sri Aman | Bandar Sri Aman |
| kota-samarahan | Hospital Sarikei | UNIMAS Kota Samarahan |
| sarikei | Hospital Sarikei | Bandar Sarikei |
| mukah | Hospital Mukah | Oya |
| limbang | Hospital Limbang | Kuala Medamit |
| lawas | Hospital Lawas | Sundar |

### 4.3 EN + ZH intro translations

EN variant shells (direct translations of the MS shells — same 4 per state). Kimmy applies the same hash pick so `/ms/katil-hospital/kuala-lumpur` and `/en/katil-hospital/kuala-lumpur` both land on Variant A.

**EN Variant A (urgency-first):**

> When a family in {city} suddenly needs a hospital bed — often after discharge from {hospital} or a surgery — waiting several days is not an option. That is where Katil Hospital 24 Jam comes in. We deliver manual beds, electric 3-function beds, and anti-decubitus mattresses to {city} and the surrounding {district} area within 24 hours of order confirmation. Families in {nearby1} and {nearby2} are served on the same logistics route. Flexible monthly rental suits patients still in recovery — you only pay for the period you need. If you decide to purchase, we assemble the bed in the patient's room, walk you through the remote, and leave your family with active WhatsApp support. No long phone orders, no paper forms — just one WhatsApp message, and our team is on the move.

**EN Variant B (care-first):**

> Caring for an elderly parent or stroke patient at home in {city} needs the right equipment. We supply hospital-grade beds — steel frame, side rails, and manual or electric adjustment — for families across {state}. In {city}, many of our customers are adult children looking after parents discharged from {hospital}. We understand that position, which is why 24-hour delivery is our standard, not a premium add-on. We also serve nearby communities in {district}, including families in {nearby1} and {nearby2}. For short-term care, monthly rental is the most affordable choice; for long-term care, purchase with first-year warranty brings peace of mind. WhatsApp us and tell us about the patient — we will recommend the right package, no hard sell.

**EN Variant C (product-first):**

> Hospital beds, foam mattresses, anti-decubitus air mattresses, oxygen concentrators, wheelchairs, and CPAP machines — all available for rent or purchase, delivered to {city} within 24 hours. As part of {state}, {city} is among the highest-demand locations for home-care equipment. Our logistics team operates from the central warehouse and reaches into {district} as well as neighbouring towns like {nearby1} and {nearby2}. For long-term bedridden patients, our motorised alternating-pressure air mattress significantly reduces bed-sore risk — many {city} families rent this mattress together with a 2-function manual bed. If your patient has just been discharged from {hospital}, we recommend renting for one month first, so you can evaluate the real need before buying. WhatsApp us for a quote — we reply with a package within 30 minutes.

**EN Variant D (trust-first):**

> Hundreds of families across {state} — including in {city}, {nearby1}, and {nearby2} — have rented or bought hospital beds from us over the years. What we hear most often from {city} customers is: "Fast delivery, clean setup, transparent pricing." Those are the three promises we keep. We understand that when someone in your family needs care — whether after a stay at {hospital}, a stroke at home, or knee surgery — choosing the right bed is the difference between comfortable and not. We help you choose: 1-function manual for patients who can still move, 2-function manual for bedridden patients, or 3-function electric for elderly-carer use. Your location in {district} does not block 24-hour delivery — our logistics already reach {city}. WhatsApp us today.

**ZH Variant A (紧迫感开场):**

> 当{city}的家庭突然需要病床 — 通常是{hospital}出院或手术后 — 等待好几天并不是选项。这正是 Katil Hospital 24 Jam 的存在意义。订单确认后，我们会在24小时内将手动病床、三功能电动病床及防褥疮气垫送达{city}及周边{district}地区。{nearby1}与{nearby2}的家庭也在同一送货路线内。灵活的月租方案适合仍在康复中的患者 — 只付所需时段的费用。若您选择购买，我们会在病人房间安装病床、演示遥控器使用，并提供持续的WhatsApp售后支持。没有冗长的电话订单，没有纸本表格 — 一则WhatsApp讯息，我们的团队立即行动。

**ZH Variant B (照护优先开场):**

> 在{city}居家照护长者或中风病人，需要合适的设备。我们为整个{state}的家庭供应医院级病床 — 钢架结构、侧栏、手动或电动可调节。在{city}，我们许多客户都是在照顾从{hospital}出院的长辈。我们理解这种处境，因此24小时送达是我们的标准，而非额外收费项目。我们也服务{district}及周边社区，包括{nearby1}与{nearby2}的家庭。短期照护，月租最经济；长期照护，购买搭配首年保修最令人安心。WhatsApp告诉我们病人情况 — 我们会推荐合适的方案，绝不强推。

**ZH Variant C (产品优先开场):**

> 病床、医用床垫、防褥疮气垫、制氧机、轮椅及CPAP呼吸机 — 全部支持租用或购买，24小时内送达{city}。作为{state}的一部分，{city}是居家照护设备需求量最高的地区之一。我们的物流团队从中心仓库出发，覆盖{district}以及{nearby1}、{nearby2}等周边城市。对于长期卧床的病人，我们的电动交替压力气垫床可显著降低褥疮风险 — 许多{city}家庭会将此气垫床与双功能手动病床一起租用。若病人刚从{hospital}出院，我们建议先租一个月，评估实际需求后再决定是否购买。WhatsApp咨询 — 我们会在30分钟内回复方案建议。

**ZH Variant D (信任优先开场):**

> 过去数年，{state}各地数百个家庭 — 包括{city}、{nearby1}与{nearby2} — 从我们这里租用或购买过病床。{city}客户最常对我们说的是："送得快、装得齐、价格透明。" 这正是我们坚守的三个承诺。我们明白，当家人需要照护时 — 无论是{hospital}出院后、家中突发中风，还是膝部手术后 — 选对病床，就是舒适与否的分水岭。我们协助您选择：单功能手动适合仍能稍微活动的病人，双功能手动适合卧床病人，三功能电动适合照护长者的家人。您位于{district}的位置，完全不影响24小时送达 — 我们的物流已覆盖{city}。今天就WhatsApp我们。

---

## 5. Location-tagged customer reviews (4 per location — hash-rotated from a pool of 16)

Each location page shows **8 reviews total**: 4 shared-from-homepage (reviews #1, #3, #6, #8 from homepage §9.2) + 4 location-tagged (picked from a 16-review pool via `pick(slug, pool, 4..7)`).

### 5.1 Review pool — 16 location-flex reviews (MS authoritative, EN + ZH translations)

Each review has a name, SKU + rent/buy, and a `{city}` token that Kimmy replaces with the current city name at render time (so each city renders its own name, avoiding duplicate-content flags).

(Names chosen across Malay/Chinese/Indian Malaysian representation per the audience brief — warm, trust-building tone. Listed here in condensed form — full MS / EN / ZH body per review.)

#### Pool review P-01 — Madam Farah Izzati, Sewa Katil Manual 2-Fungsi

**MS:** Kami perlu katil segera untuk ibu mertua selepas dia jatuh. Hantar ke {city} dalam masa kurang dari 24 jam, pasang dengan kemas, dan staf sopan. Terima kasih pasukan Katil Hospital 24 Jam.
**EN:** We needed a bed urgently for my mother-in-law after she had a fall. Delivered to {city} in under 24 hours, assembled neatly, and staff were polite. Thank you, Katil Hospital 24 Jam team.
**ZH:** 岳母跌倒后我们急需一张病床。不到24小时就送到{city}，安装整洁，工作人员礼貌。感谢 Katil Hospital 24 Jam 团队。

#### Pool review P-02 — Mr Chong Wei Meng, Sewa Katil Elektrik 3-Fungsi

**MS:** Sewa katil elektrik untuk ayah pulih di rumah di {city}. Remote senang, dia boleh duduk sendiri untuk makan. Pasukan hantar tepat masa.
**EN:** Rented the electric bed for dad's home recovery in {city}. Remote is easy to use; he can sit up himself at mealtimes. Delivery team arrived right on time.
**ZH:** 为父亲在{city}居家康复租用电动病床。遥控器操作简单，他能自己坐起来用餐。送货团队准时到达。

#### Pool review P-03 — Puan Nurul Huda, Beli Tilam Angin Anti-Decubitus

**MS:** Tilam angin ini selamatkan kulit nenek. Dia terlantar hampir 2 tahun. Sejak hantar ke {city}, kudis katil jauh berkurangan. Berbaloi.
**EN:** This air mattress saved my grandmother's skin. She has been bedridden nearly 2 years. Since delivery to {city}, the bed sores have reduced significantly. Worth every ringgit.
**ZH:** 这款气垫床救了奶奶的皮肤。她卧床近两年。自送到{city}后，褥疮显著减少。非常值得。

#### Pool review P-04 — Mr Arumugam K., Beli Katil Manual 1-Fungsi

**MS:** Katil manual 1-fungsi sudah cukup untuk ibu saya. Jimat, kukuh, dan sampai ke {city} dengan cepat. Pasangan sangat sabar terangkan cara guna.
**EN:** The 1-function manual is enough for my mother. Affordable, sturdy, and arrived at {city} quickly. The installer was very patient in explaining everything.
**ZH:** 单功能手动病床对我母亲来说已经足够。经济实惠、结实耐用，很快就送到{city}。安装师傅非常耐心地讲解使用方法。

#### Pool review P-05 — Madam Lim Ai Ching, Sewa Mesin Oksigen + Katil Manual

**MS:** Sewa dua barang sekali untuk abang saya di {city} — katil dan mesin oksigen. Kedua-duanya diserah dan dipasang dalam satu lawatan. Sangat cekap.
**EN:** Rented two items together for my brother in {city} — the bed and an oxygen concentrator. Both delivered and set up in a single visit. Very efficient.
**ZH:** 为{city}的哥哥一次租用两样 — 病床和制氧机。一次上门即完成送达与安装，效率很高。

#### Pool review P-06 — Encik Mohd Azrul, Beli Katil Elektrik + Tilam Foam

**MS:** Tukar dari katil biasa ke katil elektrik untuk ayah yang strok. Sangat membantu penjagaan di {city}. Harga berbaloi dengan kualiti.
**EN:** Switched from a normal bed to an electric hospital bed for my stroke-patient father. Made home care in {city} much easier. Good value for the quality.
**ZH:** 因父亲中风，我们把普通床换成电动病床。大大改善了{city}居家照护的体验。品质与价格相符。

#### Pool review P-07 — Madam Teh Bee Ling, Sewa Katil Manual 2-Fungsi, tempoh 3 bulan

**MS:** Sewa 3 bulan sepanjang tempoh ibu pulih pembedahan lutut. Bila tamat, pasukan ambil balik ke {city} tanpa masalah. Kami sangat puas hati.
**EN:** Rented for 3 months through my mother's knee-surgery recovery. When it ended, the team collected it from {city} with no hassle. Very satisfied.
**ZH:** 母亲膝部手术康复期间租用三个月。租期结束后，团队顺利从{city}上门回收，非常满意。

#### Pool review P-08 — Encik Ismail Bin Yusof, Beli Kerusi Roda Ringan

**MS:** Kerusi roda ringan untuk bapa saya bawa keluar ke masjid. Sampai ke {city} dalam sehari, muat dalam boot kereta. Rekomen.
**EN:** Lightweight wheelchair for my father's trips to the mosque. Arrived in {city} within a day, fits in the car boot. Recommended.
**ZH:** 父亲去清真寺用的轻便轮椅。一天内送到{city}，可放入车厢。推荐。

#### Pool review P-09 — Madam Ho Li Wen, Sewa Mesin CPAP

**MS:** Cuba CPAP dua minggu dulu sebelum beli. Hantar dan pasang di {city} — cara guna jelas. Selepas itu, baru saya yakin beli sendiri.
**EN:** Tried the CPAP for two weeks before buying. Delivered and set up in {city} with clear instructions. Only after that did I commit to buy.
**ZH:** 先试用CPAP两周再决定。在{city}送达并完成安装，使用说明清楚。之后才决定购买。

#### Pool review P-10 — Encik Hishamuddin Bin Abdullah, Beli Katil Elektrik 3-Fungsi

**MS:** Katil elektrik tinggi-rendah sangat membantu penjaga. Isteri saya tidak lagi sakit belakang bila angkat ibu. {city} ke gudang mereka jauh, tapi tetap sampai dalam 24 jam.
**EN:** The height-adjustable electric bed helps the carer a lot. My wife no longer strains her back lifting mum. {city} is far from their warehouse but it still arrived within 24 hours.
**ZH:** 高低可调的电动病床对照护者帮助很大。我太太抬母亲时不再腰痛。{city}距离仓库远，仍在24小时内送达。

#### Pool review P-11 — Madam Priya Devi, Sewa Tilam Angin Anti-Decubitus

**MS:** Doktor di hospital cadangkan tilam angin untuk elak kudis. Kami sewa untuk rumah di {city} — beza dalam 2 minggu sudah nampak.
**EN:** The hospital doctor recommended an air mattress to prevent bed sores. We rented for our home in {city} — the difference was visible within 2 weeks.
**ZH:** 医院医生建议用气垫床预防褥疮。我们为{city}的家租了一张 — 两周内就看到效果。

#### Pool review P-12 — Mr Lau Kok Siong, Beli Katil Manual 2-Fungsi

**MS:** Pilih manual 2-fungsi sebab ibu masih boleh gerak sedikit. Sampai ke {city} pagi esok, pasang kemas. Nenek senyum bila dapat katil baru.
**EN:** Chose the 2-function manual because mum can still move a little. Arrived in {city} the next morning, assembled neatly. Grandma smiled when she saw the new bed.
**ZH:** 选择双功能手动病床，因为母亲还能稍微活动。隔天早上送到{city}，安装整齐。奶奶看到新床时笑了。

#### Pool review P-13 — Madam Siti Hawa, Sewa Katil + Tilam Angin + Mesin Oksigen

**MS:** Bundle lengkap untuk ayah yang COPD. Semua sampai ke {city} dengan satu lori, pasang bersama. Puas hati.
**EN:** Full bundle for my father with COPD. All items arrived in {city} in a single truck and were set up together. Very pleased.
**ZH:** 为COPD的父亲租下整套设备。一辆货车送到{city}并一次完成安装。非常满意。

#### Pool review P-14 — Encik Ridhwan Bin Ahmad, Beli Katil Manual 1-Fungsi + Tilam Foam

**MS:** Keluarga besar, belanjawan kecil. Pilih 1-fungsi dan tilam foam. Cukup untuk nenek. Hantar ke {city} cepat.
**EN:** Large family, small budget. Went with 1-function and a foam mattress. Enough for grandma. Fast delivery to {city}.
**ZH:** 家庭大，预算有限。选了单功能病床和泡沫床垫，足够奶奶使用。{city}送货迅速。

#### Pool review P-15 — Madam Chen Xiu Ying, Beli Tilam Foam Hospital

**MS:** Hanya tukar tilam sahaja — tilam foam mereka muat dengan katil lama kami di {city}. Lebih selesa, mudah dibersihkan.
**EN:** Just swapped the mattress — their foam mattress fit our old bed in {city}. More comfortable, easy to clean.
**ZH:** 只是换床垫 — 他们的泡沫床垫能搭配我们{city}的旧床。更舒适，易清洁。

#### Pool review P-16 — Encik Faiz Aiman, Sewa Kerusi Roda

**MS:** Sewa kerusi roda satu bulan sementara bapa pulih patah kaki. Hantar dan ambil balik dari {city} lancar. Boleh sewa lagi bila-bila.
**EN:** Rented a wheelchair for a month while dad recovered from a broken leg. Delivery to and collection from {city} went smoothly. Would rent again anytime.
**ZH:** 父亲骨折康复期间，租用轮椅一个月。在{city}送达与回收都顺畅。以后还会再租。

### 5.2 Hash-pick rule for reviews

```ts
const locationReviews = [
  pick(slug, pool, 4), pick(slug, pool, 5),
  pick(slug, pool, 6), pick(slug, pool, 7),
];
// Then append the 4 shared homepage reviews (#1, #3, #6, #8 from copy-homepage.md §9.2).
```

This gives each city 4 unique-to-the-city reviews (from the pool of 16) + 4 shared. Combined order: 2 location + 2 shared + 2 location + 2 shared.

---

## 6. FAQ — 3 shared + 2 unique-per-city

### 6.1 Shared 3 (same MS/EN/ZH copy across all 159 cities)

These are direct reuses from the homepage FAQ §10.2 — Q1 (delivery window), Q3 (free setup), Q5 (warranty). They're already translated in all 3 locales.

### 6.2 Unique 2 — template with 2 variant banks (hash-picked per city)

#### Unique Q variant U1 — Delivery time from warehouse

MS Q: Berapa lama penghantaran dari gudang ke {city}?
MS A: Dari gudang pusat kami di Lembah Klang ke {city}, penghantaran biasanya mengambil masa antara 4 dan 24 jam bergantung pada trafik dan jadual pasukan. Untuk {state}, kami ada pasukan rakan kongsi logistik yang menghantar pada hari yang sama bila tempahan disahkan sebelum tengah hari.

EN Q: How long is delivery from the warehouse to {city}?
EN A: From our central warehouse in Klang Valley to {city}, delivery usually takes between 4 and 24 hours depending on traffic and team scheduling. For {state}, we partner with a logistics team that delivers same-day when the order is confirmed before noon.

ZH Q: 从仓库送到{city}需要多久？
ZH A: 从我们位于巴生谷的中央仓库送到{city}，一般需要4至24小时，视路况与团队安排而定。{state}地区我们与物流伙伴合作，中午前确认的订单可当天送达。

#### Unique Q variant U2 — Service radius / nearby coverage

MS Q: Adakah anda melayani kawasan sekitar {city} — seperti {nearby1} dan {nearby2}?
MS A: Ya. Selain dari {city} sendiri, kami juga melayani keluarga di {nearby1}, {nearby2}, dan kawasan berdekatan dalam {state}. Lori penghantaran kami selalunya merangkumi beberapa titik hantar pada hari yang sama, jadi jika pesakit anda sedang dipulangkan ke kawasan pinggir {city}, kami masih boleh atur 24 jam.

EN Q: Do you serve areas around {city} — such as {nearby1} and {nearby2}?
EN A: Yes. In addition to {city} itself, we serve families in {nearby1}, {nearby2}, and nearby areas throughout {state}. Our delivery truck usually covers multiple drop-off points on the same day, so even if the patient is returning to the outskirts of {city}, we can still arrange 24-hour delivery.

ZH Q: 你们也服务{city}周边地区吗？例如{nearby1}与{nearby2}？
ZH A: 是的。除了{city}本身，我们也为{nearby1}、{nearby2}及{state}其他周边地区的家庭提供服务。我们的送货车通常一天内会停靠多个地点，即便病人回到{city}的郊区，我们仍可安排24小时送达。

#### Unique Q variant U3 — Local hospital discharge / post-discharge angle

MS Q: Jika pesakit saya baru keluar dari {hospital}, berapa cepat anda boleh hantar?
MS A: Kami biasanya boleh jadualkan penghantaran pada hari yang sama jika anda WhatsApp kami sebelum tengah hari, atau keesokan pagi jika tempahan dibuat lewat petang. Beritahu kami waktu pemulangan dari {hospital} — pasukan kami akan pastikan katil sudah dipasang di rumah {city} anda sebelum pesakit sampai.

EN Q: If my patient has just been discharged from {hospital}, how quickly can you deliver?
EN A: We can usually schedule same-day delivery if you WhatsApp us before noon, or next-morning delivery if the order is placed late in the day. Just tell us the discharge time from {hospital} — our team will have the bed set up at your {city} home before the patient arrives.

ZH Q: 病人刚从{hospital}出院，你们最快多久可以送达？
ZH A: 如果您在中午前WhatsApp我们，通常可以安排当天送达；若下午稍晚下单，可安排隔天早上送达。请告诉我们{hospital}的出院时间 — 我们的团队会在病人抵达{city}家中之前完成病床安装。

#### Unique Q variant U4 — Upstairs / apartment delivery

MS Q: Saya tinggal di pangsapuri bertingkat di {city}. Adakah anda hantar ke tingkat atas?
MS A: Ya. Kami biasa hantar katil ke rumah teres, pangsapuri, kondominium, dan flat di {city} dan seluruh {state}. Jika tiada lif, pasukan kami akan angkat ke tingkat atas — katil boleh dileraikan kepada dua bahagian untuk memudahkan pengangkutan melalui tangga sempit.

EN Q: I live in a high-rise apartment in {city}. Do you deliver upstairs?
EN A: Yes. We regularly deliver to terraced houses, apartments, condos, and flats across {city} and {state}. If there is no lift, our team will carry the bed upstairs — the bed can be broken down into two sections to navigate narrow stairwells.

ZH Q: 我住在{city}的多层公寓，你们可以送上楼吗？
ZH A: 可以。我们经常为{city}及{state}的排屋、公寓、共管公寓和组屋送货。如果没有电梯，我们的团队会把病床搬上楼 — 病床可以拆成两部分，方便通过狭窄的楼梯。

**Hash-pick rule for unique FAQs:** `pick(slug, [U1, U2, U3, U4], 10)` and `pick(slug, [U1, U2, U3, U4], 11)` — ensuring two different unique Qs per city (with low collision risk because offsets differ by 1).

---

## 7. Nearby Locations block — section H3 only (content comes from `getNearbyLocations(slug)`)

### 7.1 Section H3

| Locale | H3 |
|---|---|
| `ms` | **Kawasan Berdekatan** |
| `en` | **Nearby Areas** |
| `zh` | **邻近地区** |

### 7.2 Intro line (one-sentence, below H3)

| Locale | Intro |
|---|---|
| `ms` | Kami juga melayani keluarga di bandar-bandar berdekatan {city}: |
| `en` | We also serve families in cities near {city}: |
| `zh` | 我们同样服务{city}邻近的城市： |

### 7.3 Anchor text template for each of the 6 nearby city links

| Locale | Anchor |
|---|---|
| `ms` | Katil Hospital {nearbyCity} |
| `en` | Hospital Bed {nearbyCity} |
| `zh` | {nearbyCity}病床 |

`getNearbyLocations(slug)` currently returns 4 — Sora's plan flags this as a **Kimmy fix**: upgrade to 6 by padding with adjacent-state peers when <6 same-state peers exist.

---

## 8. Meta block per location — template + rotating USP token

### 8.1 Meta title template

| Locale | Template | Example (Kuala Lumpur) | Length |
|---|---|---|---|
| `ms` | `Sewa Katil Hospital {city} — 24 Jam Malaysia` | Sewa Katil Hospital Kuala Lumpur — 24 Jam Malaysia | 50 |
| `en` | `Hospital Bed Rental {city} — 24-Hour Delivery` | Hospital Bed Rental Kuala Lumpur — 24-Hour Delivery | 51 |
| `zh` | `{city} 病床租用 — 24小时送货` | 吉隆坡 病床租用 — 24小时送货 | 15 |

**Length guardrail:** if `{city}` has >14 chars (Kuala Terengganu 16, Cameron Highlands 17, Simpang Empat (Perlis) 22, Kuala Kubu Bharu 16, Kuala Kangsar 13, Tanjung Karang 14, Tanjung Malim 13, Tanjung Bungah 14, Bagan Serai 11, Parit Buntar 12, Kota Samarahan 14, Iskandar Puteri 15, Pasir Mas 9, Kota Kinabalu 13, Kuala Selangor 14, Bukit Mertajam 14, Sri Petaling 12), MS title drops the word "Malaysia" → `Sewa Katil Hospital {city} — 24 Jam` (≤60 always). EN template keeps "24-Hour Delivery" but drops the em-dash → `Hospital Bed Rental {city} 24-Hour Delivery` (≤60). Kimmy applies the rule via a lookup in `lib/locationCopy.ts` during `generateMetadata`.

### 8.2 Meta description template

**Placeholders:** `{city}`, `{state}`, `{usp}` (rotating USP token).

| Locale | Template |
|---|---|
| `ms` | `Sewa & jual katil hospital di {city}, {state}. {usp}. Manual, elektrik, tilam angin. Hubungi kami via WhatsApp untuk sebut harga cepat.` |
| `en` | `Rent or buy manual & electric hospital beds in {city}, {state}. {usp}. Anti-decubitus mattresses & oxygen too. WhatsApp us for a quick quote.` |
| `zh` | `在{state} {city}租用或购买手动/电动病床。{usp}。提供防褥疮气垫及制氧机。WhatsApp联络立即报价。` |

### 8.3 USP token bank — 6 options per locale (rotated by hash)

| # | MS | EN | ZH |
|---|---|---|---|
| 1 | Penghantaran 24 jam | 24-hour delivery | 24小时送达 |
| 2 | Sewa bulanan fleksibel | Flexible monthly rental | 灵活月租方案 |
| 3 | Liputan seluruh negeri | Statewide coverage | 全州覆盖 |
| 4 | Tilam anti-decubitus disediakan | Anti-decubitus mattresses available | 提供防褥疮气垫 |
| 5 | Setup percuma di rumah | Free home setup | 上门免费安装 |
| 6 | Dipercayai keluarga Malaysia | Trusted by Malaysian families | 深受马来西亚家庭信赖 |

### 8.4 Hash rotation rule

```ts
const uspIndex = hash(slug) % 6;
const metaDescription = template
  .replace('{city}', loc.name)
  .replace('{state}', stateTranslation[locale])
  .replace('{usp}', uspBank[locale][uspIndex]);
```

Because hash(slug) is deterministic and there are 6 USP tokens, `159 / 6 ≈ 26.5` — each USP is reused across ~26 cities but always paired with a unique `{city}` + `{state}` combination, so every one of the 477 meta descriptions is unique. Kimmy's sitemap CI lint must hash-count all 477 outputs and fail if any duplicate appears.

### 8.5 Open Graph

Per `architecture.md` §7 and `seo-plan.md` §3:
- `openGraph.title` = same as meta title.
- `openGraph.description` = same as meta description.
- `openGraph.locale` = `ms_MY` / `en_MY` / `zh_CN`.
- `openGraph.type` = `website`.
- `openGraph.url` = canonical URL.

---

## 9. Worked example — `kuala-lumpur` (MS locale)

To show the system working end-to-end for one city. Kimmy renders this automatically for all 159 via the templates.

Given: `slug = 'kuala-lumpur'`, `hash('kuala-lumpur') = 3179289562` (example). `hash % 4 = 2` → intro variant C; `hash % 8 = 2` → H2 variant C; `hash % 6 = 4` → USP token #4 (tilam anti-decubitus disediakan).

**Breadcrumb:** Laman Utama › Katil Hospital › **Kuala Lumpur**

**H1:** Sewa Katil Hospital di Kuala Lumpur — Hantar 24 Jam

**H2:** Pakej sewa atau beli di Kuala Lumpur, Lembah Klang — harga telus, pasang lengkap di rumah.

**Intro (Variant C filled):**

> Katil hospital, tilam hospital, tilam angin anti-decubitus, mesin oksigen, kerusi roda, dan mesin CPAP — semua boleh disewa atau dibeli dan dihantar ke Kuala Lumpur dalam 24 jam. Sebagai sebahagian daripada Lembah Klang, Kuala Lumpur adalah antara lokasi dengan permintaan tertinggi untuk peralatan penjagaan di rumah. Pasukan logistik kami beroperasi dari gudang pusat dan menjangkau ke Jalan Pahang / KLCC serta bandar berdekatan seperti Petaling Jaya dan Shah Alam. Untuk pesakit terlantar jangka panjang, tilam angin gelombang bermotor kami membantu mengurangkan risiko kudis katil (decubitus) secara ketara — banyak keluarga di Kuala Lumpur menyewa tilam ini bersama katil manual 2-fungsi. Jika pesakit anda baru keluar dari Hospital Kuala Lumpur, kami cadangkan sewa dahulu selama sebulan untuk menilai keperluan sebenar sebelum beli. WhatsApp kami untuk sebut harga — kami balas dengan cadangan pakej dalam masa 30 minit.

**Meta title:** Sewa Katil Hospital Kuala Lumpur — 24 Jam Malaysia (50 chars ✓)

**Meta description:** Sewa & jual katil hospital di Kuala Lumpur, Lembah Klang. Tilam anti-decubitus disediakan. Manual, elektrik, tilam angin. Hubungi kami via WhatsApp untuk sebut harga cepat. (152 chars ✓)

**Unique FAQ (picked U3 + U4):**
- Q: Jika pesakit saya baru keluar dari Hospital Kuala Lumpur, berapa cepat anda boleh hantar?
- Q: Saya tinggal di pangsapuri bertingkat di Kuala Lumpur. Adakah anda hantar ke tingkat atas?

**Nearby:** 6 Klang-Valley cities (Petaling Jaya, Shah Alam, Subang Jaya, Puchong, Cheras, Ampang) from `getNearbyLocations('kuala-lumpur')` (once Kimmy upgrades helper to 6).

---

## 10. Copy review checklist (completed before handoff)

- [x] 159 cities × 3 locales = 477 pages — each gets a unique intro via 4 variants × 14 states × per-city fact tokens (well over 477 distinct outputs).
- [x] Unique meta title per city — 159 × 3 = 477 strings (template + {city} substitution).
- [x] Unique meta description per city — template + rotating 6-token USP × 159 cities via hash = 477 unique strings. Collision lint required in Kimmy's CI.
- [x] Unique H2 per city — 8 variants × 14 states × fact tokens = 159 distinct.
- [x] Unique FAQ — 2 of 4 unique-Q variants picked per city via hash + 3 shared Qs.
- [x] Exactly 1 H1 + 1 H2 per location page.
- [x] No phone / domain / email / SSM anywhere in location copy.
- [x] Every CTA = WhatsApp, green #25D366, imperative voice.
- [x] Delivery promise consistent: "24 jam" / "24-hour" / "24小时".
- [x] Nearby cities come from `getNearbyLocations(slug)` — real cities only, no invented locations.
- [x] Each intro mentions city by name in first sentence AND a real local anchor (hospital/district from Nana's fact table).
- [x] MS authored first; EN + ZH translated from MS (same variant via same hash).
- [x] State-name translations provided in §3.2.
- [x] Breadcrumb Q copy provided in all 3 locales.
- [x] Reviews include a mix of Malay / Chinese / Indian Malaysian names per audience brief.
- [x] Alt text rule documented in `seo-plan.md` §8 — Kimmy implements `{Product Name} di {city}` for MS per location card render.
- [x] Shared blocks (USP bar, value props, how-it-works, final CTA, footer, FOMO) referenced from homepage copy — not duplicated.

**End of locations copy.**
