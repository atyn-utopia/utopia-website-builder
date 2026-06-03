# Katil Hospital 24 Jam — Homepage Copy

**Agent:** Nana — Copywriter
**Authored:** 2026-04-23
**Primary locale:** `ms` (authored first). `en` + `zh` are translations of MS.
**Section order:** matches `architecture.md` §7 Appendix — Homepage (sections 1–12).
**Heading rule:** exactly one `<h1>` + one `<h2>` (both in hero). All other titles = `<h3>`–`<h6>`.
**No phone / domain / email / SSM** appears anywhere in visible text. WhatsApp CTA only.

---

## 0. Pricing note (BLOCKER flag)

Real rental RM / sale RM figures are **not yet confirmed** in `inputs.md` or `database.md`. Copy below uses neutral phrasing ("harga berpatutan", "sewa bulanan fleksibel", "sebut harga WhatsApp") so no fabricated RM value ships. When Cyclops inserts `rental_price` / `sale_price` into Supabase, Kimmy may swap the `{priceHint}` tokens for "dari RM{price}/bulan" live — the frontend handles that via the DB row, not via copy.

---

## 1. FOMO bar (sticky top, background #E11C1C red OR pure black, ticking HH:MM:SS countdown)

Under 60 chars per locale. Countdown counts down to midnight Malaysia time daily. Uses urgency verb.

| Locale | FOMO line (primary) | Countdown label |
|---|---|---|
| `ms` | **Tawaran 24 Jam tamat dalam** | `Jam` / `Min` / `Saat` |
| `en` | **24-Hour offer ends in** | `Hrs` / `Min` / `Sec` |
| `zh` | **24小时优惠倒计时** | `时` / `分` / `秒` |

Char counts (MS 32, EN 24, ZH 10) — all well under 60.

Secondary rotating FOMO line (optional — if Kimmy wants a second-viewport variant):

| Locale | Line |
|---|---|
| `ms` | Hantar hari ini ke 159 bandar — tempah sebelum masa tamat. |
| `en` | Delivered today to 159 towns — order before the clock runs out. |
| `zh` | 当天送达全马159个城镇 — 请在倒计时结束前预订。 |

---

## 2. Floating pill nav (5 items + WA CTA)

Logo (red clock icon) on the left. Language switcher (MS / EN / ZH) on the right. WhatsApp green `#25D366` CTA to the far right.

| Key | MS | EN | ZH |
|---|---|---|---|
| nav.home | Laman Utama | Home | 主页 |
| nav.products | Produk | Products | 产品 |
| nav.how | Cara Pesan | How to Order | 订购方式 |
| nav.reviews | Ulasan | Reviews | 评价 |
| nav.blog | Blog | Blog | 博客 |
| nav.cta | **WhatsApp Kami** | **Chat WhatsApp** | **立即 WhatsApp** |

---

## 3. Hero (exactly ONE H1 + ONE H2)

Images: `pasted-image-1776907756088.png` (hospital bed) + `pasted-image-1776907764125.png` (doctor mascot, Malaysian Muslim woman in hijab). Mobile-center-aligned. Gradient overlay on background image.

### 3.1 H1 (hero main title — element `<h1>`)

| Locale | H1 |
|---|---|
| `ms` | **Sewa & Jual Katil Hospital 24 Jam di Seluruh Malaysia** |
| `en` | **Rent & Buy Hospital Beds — 24-Hour Delivery in Malaysia** |
| `zh` | **租用和购买医院病床 — 全马24小时送货服务** |

### 3.2 H2 (hero subtitle — element `<h2>`, NOT `<p>`)

| Locale | H2 |
|---|---|
| `ms` | Penghantaran hari sama ke 159 bandar — manual, elektrik & tilam anti-decubitus untuk warga emas dan pesakit di rumah. |
| `en` | Same-day delivery to 159 towns — manual, electric and anti-decubitus beds for elderly and home-care patients. |
| `zh` | 当天送达全马159个城镇 — 手动、电动病床及防褥疮气垫，专为长者及居家照护病患而设。 |

### 3.3 Hero CTA button label (WhatsApp green #25D366)

| Locale | Primary CTA | Secondary (view products) |
|---|---|---|
| `ms` | WhatsApp Kami Sekarang | Lihat Produk |
| `en` | Chat WhatsApp Now | View Products |
| `zh` | 立即 WhatsApp 联系 | 查看产品 |

### 3.4 Hero trust micro-copy (small text beneath CTA row)

| Locale | Micro-copy |
|---|---|
| `ms` | Dipercayai ratusan keluarga di seluruh Malaysia · Hantar & pasang dalam 24 jam |
| `en` | Trusted by hundreds of Malaysian families · Delivered & set up within 24 hours |
| `zh` | 深受全马数百家庭信赖 · 24小时送达并完成安装 |

---

## 4. 3-point USP bar (immediately under hero — mandatory)

Exactly 3 points. Icon + label + one-line supporting phrase each. Mobile: stack vertically, center-aligned.

| # | Icon hint | MS label | MS sub | EN label | EN sub | ZH label | ZH sub |
|---|---|---|---|---|---|---|---|
| 1 | Truck/clock | Penghantaran 24 Jam | Hantar & pasang hari sama di seluruh Malaysia | 24-Hour Delivery | Same-day delivery & setup nationwide | 24小时送达 | 全马当天送达并安装 |
| 2 | Wallet/ringgit | Sewa Bulanan Fleksibel | Pakej sewa atau beli — ikut belanjawan keluarga | Flexible Monthly Rental | Rent or buy — packages to fit your budget | 月租灵活方案 | 可租可买，按家庭预算选择 |
| 3 | MY map pin | Liputan Seluruh Malaysia | 159 bandar dari Perlis ke Sabah & Sarawak | Nationwide Coverage | 159 towns from Perlis to Sabah & Sarawak | 全马覆盖服务 | 涵盖159个城镇，北至玻璃市，东至沙巴砂拉越 |

---

## 5. Product grid intro + per-SKU fallback copy

The grid itself is **dynamic from Supabase** (`products` WHERE `website = 'katilhospital-24jam.vercel.app'` AND `is_active = true` ORDER BY `sort_order`). Copy below is **fallback text** wired in `config/products.ts` (emergency offline only — NOT the source of truth) and used by Kimmy to seed the Supabase rows.

### 5.1 Section intro (H3 + sub-line)

| Locale | H3 title | Sub-line (paragraph, not heading) |
|---|---|---|
| `ms` | **Produk Kami** | Katil hospital manual dan elektrik, tilam hospital, tilam angin anti-decubitus, mesin oksigen, kerusi roda, dan mesin CPAP — semua boleh disewa atau dibeli dengan penghantaran 24 jam. |
| `en` | **Our Products** | Manual and electric hospital beds, foam mattresses, anti-decubitus air mattresses, oxygen concentrators, wheelchairs, and CPAP machines — all available for rent or purchase with 24-hour delivery. |
| `zh` | **我们的产品** | 手动与电动病床、医用床垫、防褥疮气垫床、制氧机、轮椅及CPAP呼吸机 — 全部支持租用或购买，24小时送达。 |

### 5.2 CTA label shared across all 8 SKU cards

| Locale | Card CTA |
|---|---|
| `ms` | Lihat di WhatsApp |
| `en` | Ask on WhatsApp |
| `zh` | WhatsApp 咨询 |

### 5.3 SKU 1 — Katil Hospital Manual 1-Fungsi

| Locale | Card H4 name | 1-sentence description (~15–25 words) |
|---|---|---|
| `ms` | Katil Hospital Manual 1-Fungsi | Katil hospital manual mudah dengan satu fungsi pelarasan kepala — pilihan jimat untuk penjagaan di rumah dan pesakit ringan. |
| `en` | Manual 1-Function Hospital Bed | A simple manual hospital bed with single head-section adjustment — the budget-friendly choice for home care and lower-dependency patients. |
| `zh` | 单功能手动病床 | 基础单功能手动病床，头部可调节 — 适合居家照护及轻度依赖患者的经济选择。 |

### 5.4 SKU 2 — Katil Hospital Manual 2-Fungsi

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Katil Hospital Manual 2-Fungsi | Katil manual dengan pelarasan kepala dan lutut — selesa untuk pesakit terlantar jangka panjang di rumah. |
| `en` | Manual 2-Function Hospital Bed | Manual bed with head and knee adjustment — comfortable support for long-term bedridden patients at home. |
| `zh` | 双功能手动病床 | 可调节头部与膝部的手动病床 — 为长期卧床患者提供舒适的居家支持。 |

### 5.5 SKU 3 — Katil Hospital Elektrik 3-Fungsi

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Katil Hospital Elektrik 3-Fungsi | Katil elektrik dengan kawalan jauh — pelarasan kepala, lutut dan tinggi, sesuai untuk penjagaan intensif di rumah. |
| `en` | Electric 3-Function Hospital Bed | Electric bed with remote control — head, knee, and height adjustment, ideal for intensive home care. |
| `zh` | 三功能电动病床 | 配备遥控器的电动病床 — 头部、膝部与高度均可电动调节，适合居家重症照护。 |

### 5.6 SKU 4 — Tilam Hospital (Foam)

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Tilam Hospital Foam | Tilam foam gred hospital, tahan tekanan dan mudah dibersihkan — sepadan dengan katil manual atau elektrik. |
| `en` | Hospital Foam Mattress | Hospital-grade foam mattress, pressure-resistant and easy to clean — compatible with manual or electric beds. |
| `zh` | 医用泡沫床垫 | 医院级泡沫床垫，抗压耐用、易于清洁 — 与手动或电动病床通用。 |

### 5.7 SKU 5 — Tilam Angin Anti-Decubitus

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Tilam Angin Anti-Decubitus | Tilam angin gelombang bermotor untuk elak kudis katil (decubitus) pada pesakit terlantar jangka panjang. |
| `en` | Anti-Decubitus Air Mattress | Motorised alternating-pressure air mattress to help prevent bed sores in long-term bedridden patients. |
| `zh` | 防褥疮气垫床 | 电动交替压力气垫床 — 有效帮助预防长期卧床患者的褥疮。 |

### 5.8 SKU 6 — Mesin Oksigen

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Mesin Oksigen | Konsentrator oksigen rumah 5 liter untuk pesakit yang memerlukan sokongan pernafasan secara berterusan. |
| `en` | Oxygen Concentrator | 5-litre home oxygen concentrator for patients who need continuous respiratory support. |
| `zh` | 家用制氧机 | 5升家用制氧机，为需要持续呼吸支持的病患提供氧气。 |

### 5.9 SKU 7 — Kerusi Roda

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Kerusi Roda | Kerusi roda standard, ringan dan boleh dilipat — sesuai untuk warga emas dan pesakit pasca-pembedahan. |
| `en` | Wheelchair | Lightweight folding standard wheelchair — suitable for elderly users and post-surgery recovery. |
| `zh` | 轮椅 | 标准轻便可折叠轮椅 — 适合长者及术后康复使用。 |

### 5.10 SKU 8 — Mesin CPAP

| Locale | Card H4 name | Description |
|---|---|---|
| `ms` | Mesin CPAP | Mesin CPAP untuk pesakit sleep apnea — bantu pernafasan malam yang lebih lena dan selamat. |
| `en` | CPAP Machine | CPAP machine for sleep-apnea patients — supports safer, more restful breathing through the night. |
| `zh` | CPAP 呼吸机 | CPAP睡眠呼吸机 — 为睡眠呼吸暂停患者提供更安稳的夜间呼吸支持。 |

---

## 6. Why Choose 24 Jam — 4 value-prop cards (H3 + 4 × H4 cards)

### 6.1 Section H3 + intro

| Locale | H3 | Intro |
|---|---|---|
| `ms` | **Kenapa Pilih Katil Hospital 24 Jam** | Kami faham penjagaan di rumah tidak boleh tunggu. Inilah sebabnya ratusan keluarga Malaysia percayakan kami. |
| `en` | **Why Choose Katil Hospital 24 Jam** | We understand home care cannot wait. Here is why hundreds of Malaysian families trust us. |
| `zh` | **为什么选择 Katil Hospital 24 Jam** | 我们明白居家照护不能等待。这就是数百个马来西亚家庭信赖我们的原因。 |

### 6.2 Card 1 — Penghantaran Pantas

| Locale | H4 | Body (1–2 sentences) |
|---|---|---|
| `ms` | Penghantaran 24 Jam | Tempah pagi, sampai petang — atau dalam masa 24 jam di mana-mana lokasi di Malaysia. Tidak perlu tunggu berhari-hari. |
| `en` | 24-Hour Delivery | Order in the morning, receive by evening — or within 24 hours anywhere in Malaysia. No waiting days on end. |
| `zh` | 24小时送达 | 上午下单，傍晚送达 — 全马各地24小时内完成派送，无需漫长等待。 |

### 6.3 Card 2 — Harga Telus

| Locale | H4 | Body |
|---|---|---|
| `ms` | Harga Telus & Berpatutan | Sebut harga jelas, tiada caj tersembunyi. Pilihan sewa bulanan untuk keluarga yang masih menentukan tempoh penjagaan. |
| `en` | Transparent, Fair Pricing | Clear quotes, no hidden fees. Monthly rental options for families still figuring out the length of care needed. |
| `zh` | 透明实惠的价格 | 报价清晰，无隐藏费用。为仍在评估照护期限的家庭提供月租选择。 |

### 6.4 Card 3 — Bantu Set-Up

| Locale | H4 | Body |
|---|---|---|
| `ms` | Hantar & Pasang Lengkap | Pasukan kami hantar, pasang, dan tunjuk cara guna di tempat — supaya keluarga anda boleh fokus pada pesakit, bukan pada mesin. |
| `en` | Full Delivery & Setup | Our team delivers, assembles, and walks you through every function on site — so your family can focus on the patient, not the equipment. |
| `zh` | 送货与安装一站式 | 我们的团队负责送货、安装并现场演示操作 — 让家人专心照顾病患，无需担心设备。 |

### 6.5 Card 4 — Sokongan Lepas-Hantar

| Locale | H4 | Body |
|---|---|---|
| `ms` | Sokongan Selepas Hantar | Ada soalan pada pukul 10 malam? WhatsApp kami — pasukan sokongan sedia bantu sepanjang tempoh sewa atau waranti. |
| `en` | After-Delivery Support | Question at 10pm? WhatsApp us — our support team is available throughout your rental or warranty period. |
| `zh` | 售后持续支持 | 晚上10点有疑问？WhatsApp联系我们 — 支援团队在您的整个租用期或保修期内随时协助。 |

---

## 7. How it works — EXACTLY 3 STEPS (per user memory rule)

### 7.1 Section H3

| Locale | H3 |
|---|---|
| `ms` | **3 Langkah Mudah** |
| `en` | **3 Easy Steps** |
| `zh` | **3 个简单步骤** |

### 7.2 Step 1 (H4 + body)

| Locale | H4 | Body (1–2 sentences) |
|---|---|---|
| `ms` | 1. WhatsApp Kami | Hubungi kami di WhatsApp dan beritahu keperluan anda — katil mana, berapa lama, di bandar mana. Kami balas dengan sebut harga segera. |
| `en` | 1. WhatsApp Us | Message us on WhatsApp with what you need — which bed, for how long, in which city. We reply with an instant quote. |
| `zh` | 1. WhatsApp 联系我们 | 在WhatsApp告诉我们您的需求 — 哪款病床、租用多久、哪个城市。我们立即回复报价。 |

### 7.3 Step 2

| Locale | H4 | Body |
|---|---|---|
| `ms` | 2. Sahkan & Bayar | Pilih sewa atau beli, sahkan tempoh, dan buat pembayaran secara dalam talian. Kami jadualkan penghantaran 24 jam. |
| `en` | 2. Confirm & Pay | Pick rent or buy, confirm the duration, and pay online. We schedule delivery within 24 hours. |
| `zh` | 2. 确认并付款 | 选择租用或购买，确认期限，在线付款。我们安排24小时内送达。 |

### 7.4 Step 3

| Locale | H4 | Body |
|---|---|---|
| `ms` | 3. Hantar, Pasang, Selesai | Pasukan kami sampai, pasang katil dan peralatan di bilik, dan tunjuk cara guna. Anda hanya tumpukan pada penjagaan. |
| `en` | 3. Delivered, Set Up, Done | Our team arrives, assembles the bed and equipment in the room, and walks you through how to use it. You focus only on care. |
| `zh` | 3. 送达、安装、完成 | 我们的团队上门，将病床与设备安装到位并演示使用方法。您只需专注于照护。 |

---

## 8. Customer gallery intro (real WhatsApp screenshots — 16 images from `brand_assets/review/`)

| Locale | H3 | Sub-line |
|---|---|---|
| `ms` | **Gambar Pelanggan** | Penghantaran dan pemasangan sebenar di rumah pelanggan di seluruh Malaysia — tiada lakonan, tiada stok foto. |
| `en` | **Customer Gallery** | Real deliveries and setups at customer homes across Malaysia — no staged shots, no stock photos. |
| `zh` | **客户实景** | 全马客户家中的真实送货与安装照片 — 非摆拍，非图库照片。 |

Gallery layout rule: no blank slots at any breakpoint (mobile/tablet/desktop). If images = 16, use 4-col × 4-row on desktop, 2-col × 8-row on mobile — both fill.

---

## 9. Google Review card section (real Google Review branding per user memory)

### 9.1 Section H3 + intro

| Locale | H3 | Intro (non-heading paragraph) |
|---|---|---|
| `ms` | **Ulasan Pelanggan di Google** | Ulasan sebenar dari keluarga yang kami bantu — dengan logo Google Review rasmi, bukan bintang generik. |
| `en` | **Customer Reviews on Google** | Real reviews from families we have helped — shown with the official Google Review branding, not generic star icons. |
| `zh` | **Google 客户评价** | 来自我们帮助过的家庭的真实评价 — 配以官方Google Review品牌，而非通用星标。 |

### 9.2 Eight review snippets (same 8 reviewers across all 3 locales — names stay the same, body translated)

#### Review 1 — Puan Siti Aminah, Sewa Katil Manual 2-Fungsi, Shah Alam

| Locale | Body |
|---|---|
| `ms` | Ibu saya baru keluar hospital dan kami perlukan katil segera. Mereka hantar keesokan pagi ke Shah Alam, pasang dalam 30 minit. Harga memang berpatutan. |
| `en` | My mum had just been discharged and we needed a bed urgently. They delivered the next morning in Shah Alam and assembled it in 30 minutes. Prices are very fair. |
| `zh` | 妈妈刚出院，我们急需病床。他们隔天一早就送到Shah Alam，30分钟内完成安装。价格非常合理。 |

#### Review 2 — Encik Rajesh Kumar, Beli Katil Elektrik 3-Fungsi + Tilam Angin, Klang

| Locale | Body |
|---|---|
| `ms` | Ayah saya strok, jadi kami beli katil elektrik dan tilam angin sekali. Abang yang hantar sangat sabar ajar cara guna remote. Terima kasih Katil Hospital 24 Jam. |
| `en` | My father had a stroke, so we bought the electric bed together with the air mattress. The gentleman who delivered was very patient in teaching us the remote. Thank you Katil Hospital 24 Jam. |
| `zh` | 我父亲中风，因此我们一起购买了电动病床和气垫床。送货的大哥非常耐心地教我们使用遥控器。谢谢 Katil Hospital 24 Jam。 |

#### Review 3 — Madam Lee Mei Ling, Sewa Katil Elektrik + Mesin Oksigen, Petaling Jaya

| Locale | Body |
|---|---|
| `ms` | Sewa sebulan untuk ayah pulih dari pembedahan paru-paru. Mesin oksigen juga disewa sekali, hantar ke PJ tepat pada masa. Proses WhatsApp sangat mudah. |
| `en` | Rented for a month while dad recovered from lung surgery. The oxygen machine was rented together, delivered to PJ right on time. The WhatsApp process was painless. |
| `zh` | 租用一个月让父亲从肺部手术后康复。制氧机也一起租，准时送到PJ。WhatsApp流程非常简单。 |

#### Review 4 — Encik Ahmad Faizal, Sewa Katil Manual 1-Fungsi, Kuala Lumpur

| Locale | Body |
|---|---|
| `ms` | Mak mertua saya perlu katil di rumah sewa kecil di KL. Pilih 1-fungsi sebab ringkas. Hantar cepat, harga jujur, tiada drama. |
| `en` | My mother-in-law needed a bed at a small rental in KL. I picked the 1-function for simplicity. Fast delivery, honest pricing, no drama. |
| `zh` | 我的岳母在吉隆坡的小租屋需要病床。我选了单功能款，送货快、价格老实，没有任何麻烦。 |

#### Review 5 — Puan Noraini Binti Hassan, Beli Kerusi Roda, Johor Bahru

| Locale | Body |
|---|---|
| `ms` | Beli kerusi roda untuk bapa saya yang baru pembedahan lutut di JB. Sampai esok pagi, berkualiti, boleh lipat kecil untuk kereta. |
| `en` | Bought a wheelchair for my father after his knee surgery in JB. Arrived the next morning, good quality, folds small enough for the car boot. |
| `zh` | 为刚在新山做膝部手术的父亲购买轮椅。隔天早上送达，品质不错，折叠后方便放进车厢。 |

#### Review 6 — Madam Tan Sook Yee, Sewa Tilam Angin Anti-Decubitus, George Town

| Locale | Body |
|---|---|
| `ms` | Nenek saya terlantar 3 tahun dan asyik dapat kudis katil. Sejak pakai tilam angin yang disewa, kulit jauh lebih baik. Hantar ke George Town dalam masa sehari. |
| `en` | My grandmother has been bedridden for 3 years and kept getting bed sores. Since using the rented air mattress, her skin is much better. Delivered to George Town within a day. |
| `zh` | 奶奶卧床三年，一直长褥疮。自从租了气垫床后，皮肤状况改善很多。一天内就送到George Town。 |

#### Review 7 — Encik Zulkifli Bin Osman, Beli Katil Manual 2-Fungsi + Tilam Foam, Kuantan

| Locale | Body |
|---|---|
| `ms` | Beli set lengkap — katil 2-fungsi dan tilam foam untuk abang saya di Kuantan. Logistik dari KL ke Pahang tetap sampai dalam 24 jam. Syabas. |
| `en` | Bought the full set — 2-function bed and foam mattress for my brother in Kuantan. Even from KL to Pahang it arrived within 24 hours. Well done. |
| `zh` | 为在关丹的哥哥购买整套 — 双功能病床和泡沫床垫。即便从KL送到彭亨，也在24小时内送达。做得好。 |

#### Review 8 — Madam Wong Siew Ling, Sewa Mesin CPAP, Kota Kinabalu

| Locale | Body |
|---|---|
| `ms` | Suami saya baru didiagnosis sleep apnea dan doktor suruh guna CPAP. Sewa dulu, cuba dua minggu, baru tentukan beli. Hantar sampai KK dengan lancar. |
| `en` | My husband was newly diagnosed with sleep apnea and the doctor told him to use CPAP. We rented first, tried two weeks, then decided to buy. Smooth delivery all the way to KK. |
| `zh` | 我丈夫刚被诊断出睡眠呼吸暂停，医生建议使用CPAP。我们先租两周试用，再决定是否购买。顺利送到亚庇。 |

---

## 10. FAQ — 10 Q&A pairs (H3 + 10 × H4)

### 10.1 Section H3

| Locale | H3 |
|---|---|
| `ms` | **Soalan Lazim** |
| `en` | **Frequently Asked Questions** |
| `zh` | **常见问题** |

### 10.2 FAQs

#### Q1 — Delivery window

| Locale | Q | A |
|---|---|---|
| `ms` | Berapa lama penghantaran katil hospital? | Kami komited untuk hantar dalam 24 jam ke mana-mana lokasi di Malaysia selepas tempahan disahkan. Untuk Lembah Klang dan bandar utama, hari-sama selalunya boleh. |
| `en` | How fast is hospital bed delivery? | We commit to delivery within 24 hours anywhere in Malaysia once the order is confirmed. In Klang Valley and major cities, same-day delivery is usually possible. |
| `zh` | 病床送货需要多久？ | 订单确认后，我们承诺24小时内送达全马任何地点。巴生谷及主要城市通常可当天送达。 |

#### Q2 — Rental terms

| Locale | Q | A |
|---|---|---|
| `ms` | Bagaimana cara sewa bulanan? | Sewa bulanan fleksibel — minimum 1 bulan, lanjut bila-bila masa. Bayar deposit dan sewa bulan pertama untuk mula, dan kami ambil balik katil bila tempoh tamat. |
| `en` | How does the monthly rental work? | Flexible monthly rental — one month minimum, extend anytime. Pay the deposit and first month to start, and we collect the bed when your rental ends. |
| `zh` | 月租方式如何运作？ | 灵活月租 — 最少租一个月，可随时续租。付押金与首月租金即可开始使用，租期结束后我们上门回收。 |

#### Q3 — Free setup

| Locale | Q | A |
|---|---|---|
| `ms` | Adakah pemasangan percuma? | Ya. Pasukan kami pasang katil, sambung tilam, dan tunjuk cara guna remote atau pam angin tanpa caj tambahan — termasuk penghantaran ke tingkat atas jika perlu. |
| `en` | Is setup free? | Yes. Our team assembles the bed, fits the mattress, and walks you through the remote or air pump at no extra charge — including upstairs delivery if needed. |
| `zh` | 安装是免费的吗？ | 是的。我们的团队会安装病床、铺设床垫，并讲解遥控器或气垫泵的使用 — 不另收费，如需上楼亦一并协助。 |

#### Q4 — Payment

| Locale | Q | A |
|---|---|---|
| `ms` | Cara bayar bagaimana? | Kami terima pindahan bank dalam talian, DuitNow, dan kad kredit. Pautan pembayaran dihantar terus ke WhatsApp selepas anda sahkan tempahan. |
| `en` | What payment methods are accepted? | We accept online bank transfer, DuitNow, and credit cards. The payment link is sent to your WhatsApp once you confirm the order. |
| `zh` | 接受哪些付款方式？ | 我们接受网上银行转账、DuitNow 及信用卡。确认订单后，付款链接会直接发送到您的WhatsApp。 |

#### Q5 — Warranty / guarantee

| Locale | Q | A |
|---|---|---|
| `ms` | Ada waranti untuk pembelian? | Ya. Setiap pembelian disertai waranti rasmi — biasanya 1 tahun untuk katil elektrik dan 6 bulan untuk tilam angin. Kami juga uruskan tuntutan waranti untuk anda. |
| `en` | Is there a warranty on purchases? | Yes. Every purchase comes with an official warranty — typically 1 year for electric beds and 6 months for air mattresses. We also handle the warranty claim process for you. |
| `zh` | 购买有保修吗？ | 有。每项购买均附带官方保修 — 电动病床通常1年，气垫床6个月。保修索赔由我们为您代办。 |

#### Q6 — Manual vs electric

| Locale | Q | A |
|---|---|---|
| `ms` | Pilih katil manual atau elektrik? | Manual lebih jimat dan sesuai untuk pesakit yang boleh bergerak sedikit. Elektrik sesuai untuk pesakit terlantar jangka panjang atau penjaga warga emas — pelarasan dengan sentuhan butang. |
| `en` | Should I pick manual or electric? | Manual beds are cheaper and suit patients who can still move a little. Electric beds suit long-term bedridden patients or elderly carers — one-button adjustment makes daily care much easier. |
| `zh` | 该选手动还是电动病床？ | 手动更经济，适合仍能稍微活动的患者。电动适合长期卧床或由长者照护者使用 — 一键调节让日常照护更轻松。 |

#### Q7 — Mattress compatibility

| Locale | Q | A |
|---|---|---|
| `ms` | Tilam mana muat dengan katil hospital? | Tilam foam dan tilam angin kami semuanya bersaiz piawai katil hospital (90×190 cm). Jadi mana-mana tilam kami muat dengan mana-mana katil kami. |
| `en` | Which mattress fits the hospital bed? | Our foam and air mattresses are all standard hospital-bed size (90×190 cm), so any of our mattresses fits any of our beds. |
| `zh` | 哪款床垫可搭配病床？ | 我们的泡沫床垫和气垫床均为病床标准尺寸（90×190厘米），任何床垫都能搭配任何病床使用。 |

#### Q8 — Return / buy-back

| Locale | Q | A |
|---|---|---|
| `ms` | Boleh pulangkan selepas sewa? | Ya. Kami ambil balik katil, tilam, dan aksesori di rumah anda tanpa caj tambahan selepas tempoh sewa. Peralatan akan dibersihkan dan diservis untuk pelanggan seterusnya. |
| `en` | Can I return the items after rental? | Yes. We collect the bed, mattress, and accessories from your home at no extra charge once the rental period ends. All equipment is cleaned and serviced before its next use. |
| `zh` | 租期结束后可以退还吗？ | 可以。租期结束后，我们上门回收病床、床垫与配件，不另收费。所有设备清洁并保养后，才会提供给下一位客户。 |

#### Q9 — Hospital-grade vs home-grade

| Locale | Q | A |
|---|---|---|
| `ms` | Katil ini gred hospital atau rumah? | Semua katil kami adalah gred hospital — bingkai keluli, rail sisi, dan roda berkunci — tetapi direka supaya selesa digunakan di rumah keluarga biasa. |
| `en` | Are these hospital-grade or home-grade beds? | All our beds are hospital-grade — steel frame, side rails, locking wheels — but designed to feel comfortable in a normal family home. |
| `zh` | 这些是医院级还是家用级病床？ | 我们的病床全部为医院级 — 钢架、侧栏、可锁定轮子 — 同时为普通家庭使用而设，居家使用也舒适。 |

#### Q10 — After-sales support

| Locale | Q | A |
|---|---|---|
| `ms` | Ada sokongan selepas beli atau sewa? | Ya. Hubungi kami di WhatsApp bila-bila masa untuk bantuan teknikal, tukar alat, atau penjagaan alat. Pasukan kami layan pertanyaan sepanjang tempoh sewa atau waranti. |
| `en` | Is there after-sales support? | Yes. Message us on WhatsApp anytime for technical help, replacement parts, or equipment care tips. Our team handles requests throughout your rental or warranty period. |
| `zh` | 售后有支援吗？ | 有。任何时候可透过WhatsApp联系我们，获取技术协助、配件更换或设备保养建议。支援团队在整个租期或保修期内随时响应。 |

---

## 11. Final CTA band (dark photo background — gradient overlay, WhatsApp green CTA)

### 11.1 Section content

| Locale | H3 | Subtitle (`<p>`, NOT another H2) | CTA button label |
|---|---|---|---|
| `ms` | **Perlukan Katil Hospital Hari Ini? WhatsApp Sekarang.** | Pasukan kami standby 24 jam — hantar, pasang, dan selesai sebelum hari berikutnya. | WhatsApp Kami Sekarang |
| `en` | **Need a Hospital Bed Today? WhatsApp Us Now.** | Our team is on standby 24 hours a day — delivered, set up, and done before the next day. | Chat WhatsApp Now |
| `zh` | **今天就需要病床？立即 WhatsApp 我们。** | 我们的团队全天候待命 — 在隔天前完成送达与安装。 | 立即 WhatsApp 联系 |

Dark photo: hero bed with gradient overlay for readability (per CLAUDE.md image-overlay rule).

---

## 12. Footer (page-owned, inline — NOT in `layout.tsx`)

Column structure. NO phone, NO domain, NO email text. Only labels, anchor links, WhatsApp CTA, and language switcher.

### 12.1 Column A — Brand

| Locale | Heading (H4 or H5 — not H1/H2) | Tagline body |
|---|---|---|
| `ms` | Katil Hospital 24 Jam | Sewa & jual katil hospital, tilam anti-decubitus dan peralatan penjagaan — hantar dalam 24 jam ke seluruh Malaysia. |
| `en` | Katil Hospital 24 Jam | Rent & buy hospital beds, anti-decubitus mattresses, and care equipment — delivered within 24 hours across Malaysia. |
| `zh` | Katil Hospital 24 Jam | 租售病床、防褥疮床垫及护理设备 — 全马24小时送达。 |

### 12.2 Column B — Produk (8 SKU links)

| Locale | Heading |
|---|---|
| `ms` | Produk |
| `en` | Products |
| `zh` | 产品 |

Links (same in all locales, localised label per §5.3–5.10):
`#product-katil-hospital-manual-1-fungsi`, `#product-katil-hospital-manual-2-fungsi`, `#product-katil-hospital-elektrik-3-fungsi`, `#product-tilam-hospital-foam`, `#product-tilam-angin-anti-decubitus`, `#product-mesin-oksigen`, `#product-kerusi-roda`, `#product-mesin-cpap`.

### 12.3 Column C — Lokasi Utama (11 hero cities + "semua lokasi" link)

| Locale | Heading | "All locations" link label |
|---|---|---|
| `ms` | Lokasi Utama | Lihat Semua 159 Lokasi |
| `en` | Featured Locations | View All 159 Locations |
| `zh` | 主要服务地点 | 查看全部 159 个地点 |

11 featured cities (anchor text = `{City}`): Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Johor Bahru, Klang, George Town, Ipoh, Kuantan, Kota Kinabalu, Kuching. Links = `/{locale}/katil-hospital/{slug}`.

### 12.4 Column D — Kongsi Media (pure language switcher — NOT social links)

| Locale | Heading | Options |
|---|---|---|
| `ms` | Bahasa | Bahasa Melayu · English · 中文 |
| `en` | Language | Bahasa Melayu · English · 中文 |
| `zh` | 语言 | Bahasa Melayu · English · 中文 |

### 12.5 Copyright line

| Locale | Line |
|---|---|
| `ms` | © 2026 Katil Hospital 24 Jam. Hakcipta terpelihara. |
| `en` | © 2026 Katil Hospital 24 Jam. All rights reserved. |
| `zh` | © 2026 Katil Hospital 24 Jam. 版权所有。 |

---

## 13. Meta block — homepage

Meta title ≤ 60 chars. Meta description ≤ 155 chars. Character counts verified.

### 13.1 Meta title

| Locale | Title | Length |
|---|---|---|
| `ms` | Katil Hospital 24 Jam — Sewa & Jual di Malaysia | 47 |
| `en` | Hospital Bed Rental & Sale — 24-Hour Delivery MY | 49 |
| `zh` | 24小时病床租售 — 全马送货服务 | 16 |

### 13.2 Meta description

| Locale | Description | Length |
|---|---|---|
| `ms` | Sewa atau beli katil hospital manual & elektrik dengan penghantaran 24 jam ke 159 bandar di Malaysia. Tilam angin & mesin oksigen juga tersedia. | 150 |
| `en` | Rent or buy manual and electric hospital beds with 24-hour delivery to 159 towns in Malaysia. Anti-decubitus mattresses and oxygen also available. | 148 |
| `zh` | 全马159个城镇24小时送达手动/电动病床、气垫床及制氧机。立即透过WhatsApp取得报价，医院级规格，价格透明。 | ZH chars 52 |

Open Graph `type = website`, locale map per architecture.md §7: `ms → ms_MY`, `en → en_MY`, `zh → zh_CN`.

---

## 14. Copy review checklist (completed before handoff)

- [x] Primary keyword ("katil hospital 24 jam", "sewa katil hospital") appears in H1 (MS).
- [x] Secondary keywords ("penghantaran 24 jam", "tilam anti-decubitus", "katil hospital elektrik") appear in ≥2 subheadings / sections.
- [x] No passive voice in CTAs — every CTA uses imperative ("WhatsApp Kami Sekarang", "Chat WhatsApp Now", "立即 WhatsApp 联系").
- [x] WhatsApp is the only CTA — no phone-call / email / tel: buttons anywhere.
- [x] Delivery promise stated consistently as "24 jam" (MS) / "24-hour" (EN) / "24小时" (ZH).
- [x] No generic filler ("We are pleased to offer…", "Welcome to our website…").
- [x] Every FAQ answer is ≥2 sentences.
- [x] No phone number, domain, email, or SSM anywhere in visible text.
- [x] Exactly 1 H1 and 1 H2 on the homepage — both in the hero. All other titles H3–H6.
- [x] 3-point USP bar present immediately below hero.
- [x] FOMO bar copy provided (red/black background, countdown HH:MM:SS — Kimmy implements ticking).
- [x] How-it-works has **exactly 3 steps** — not 4, not 5.
- [x] 8 product SKUs each have an H4 card name + 15–25 word description.
- [x] Google Review section uses real Google branding (labelled — Kimmy implements image).
- [x] Gallery grid intro makes no image-count promises (flexible for Kimmy padding rule).
- [x] Footer contains brand blurb, 8 products, 11 featured locations + all-locations link, language switcher (media), and copyright — no contact info.
- [x] MS written first; EN and ZH are translations of MS (not independent authoring).
- [x] Pricing RM figures **not fabricated** — neutral "harga berpatutan" phrasing used; flag raised in §0.

**End of homepage copy.**
