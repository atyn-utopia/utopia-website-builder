# Document B — copy-locations.md

# Cold Room Malaysia — Location Page Copy Generator
**Strategy:** deterministic templated copy keyed off a city-hash, producing UNIQUE-feeling pages across all 150–180 sub-locations × 3 locales without hand-writing each one. Every page hits ≥6 mentions of the city naturally, includes 5 FAQs, intro, closing, and nearby links.

---

## 1. Tokens (substitution rules)

| Token | Source | Notes |
|---|---|---|
| `{city}` | `config/locations.ts → name` (e.g. `Petaling Jaya`) | Always render the human-readable display name. In `zh`, render as `{city_zh}` if mapped (e.g. `八打灵再也`); fall back to Latin display name if no map. |
| `{citySlug}` | `config/locations.ts → slug` | Used for hreflang and link building, never visible. |
| `{state}` | `config/locations.ts → state` | Translated per locale (Selangor / Selangor / 雪兰莪). |
| `{stateSlug}` | `config/locations.ts → stateSlug` | Used for breadcrumb links. |
| `{nearbyList}` | `config/locations.ts → nearby[]` rendered as a comma list | Render top 3 neighbouring city display names: e.g. `Subang Jaya, Shah Alam and Puchong`. |
| `{nearbyOne}` | First nearby city | Used in intro / FAQ for variety. |
| `{nearbyTwo}` | Second nearby city | |
| `{cityHash}` | `cityHash = hashCode(citySlug) % 3` | Selects intro / closing / FAQ variant. Same slug always gets same variant — deterministic. |

**Hash function (TypeScript):**
```ts
function cityHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h) % 3;
}
```

**City-keyword density rule:** each location page must mention `{city}` ≥6 times naturally — distributed across H1, H2, intro paragraph (×2), USP captions (×1), product intro (×1), one FAQ Q (×1), one FAQ A (×1), closing paragraph (×1). The templates below are pre-counted to satisfy this.

---

## 2. Heading templates (per locale)

Headings re-use the locked H1/H2 from `seo-plan.md`. Section H3s mirror homepage copy with `{city}` injected.

### EN
- **H1 (hero):** `Cold Room Rental in {city}, Malaysia`
- **H2 (hero subtitle):** `Same-Day Refrigerated Cold Room Delivery to {city} — HALAL, 24/7 Quotes`
- **H3 — Products:** `Four Cold Room Tiers Delivered to {city}`
- **H3 — How It Works:** `How {city} Customers Get a Cold Room in 3 Steps`
- **H3 — Risk:** `What Goes Wrong When {city} Businesses Skip Cold-Chain Rental`
- **H3 — MidCta:** `Need a Cold Room in {city} Today?`
- **H3 — Reviews:** `What {state} Businesses Say on Google`
- **H3 — WhyChoose:** `Why {city} Businesses Pick Cold Room Malaysia`
- **H3 — Gallery:** `Recent Cold Room Deliveries Near {city}`
- **H3 — LocationsAccordion:** `Cold Room Rental Across Peninsular Malaysia`
- **H3 — NearbyLocations:** `Nearby Areas We Also Serve from {city}`
- **H3 — FAQ:** `Cold Room Rental in {city} — FAQ`
- **H3 — FinalCta:** `Lock In Your {city} Cold Room — Today`

### MS
- **H1:** `Sewa Cold Room di {city}, Malaysia`
- **H2:** `Penghantaran Cold Room Berpenyaman ke {city} — HALAL, Sebut Harga 24/7`
- **H3 — Products:** `Empat Tahap Suhu Cold Room Dihantar ke {city}`
- **H3 — How It Works:** `Bagaimana Pelanggan {city} Dapatkan Cold Room dalam 3 Langkah`
- **H3 — Risk:** `Apa Yang Boleh Salah Tanpa Sewaan Rantaian Sejuk di {city}`
- **H3 — MidCta:** `Perlukan Cold Room di {city} Hari Ini?`
- **H3 — Reviews:** `Apa Kata Perniagaan {state} di Google`
- **H3 — WhyChoose:** `Mengapa Perniagaan {city} Pilih Cold Room Malaysia`
- **H3 — Gallery:** `Penghantaran Cold Room Terkini Berhampiran {city}`
- **H3 — LocationsAccordion:** `Sewa Cold Room di Seluruh Semenanjung Malaysia`
- **H3 — NearbyLocations:** `Kawasan Berdekatan dari {city}`
- **H3 — FAQ:** `Sewa Cold Room di {city} — Soalan Lazim`
- **H3 — FinalCta:** `Kunci Cold Room {city} Anda — Hari Ini`

### ZH
- **H1:** `{city}冷库出租`
- **H2:** `冷藏冷库当天送达{city} — 清真认证,24/7 报价`
- **H3 — Products:** `送达{city}的四种温区冷库`
- **H3 — How It Works:** `{city}客户 3 步搞定冷库`
- **H3 — Risk:** `{city}企业不用冷库租赁,常见的代价`
- **H3 — MidCta:** `今天就要在{city}用上冷库吗？`
- **H3 — Reviews:** `{state}客户在 Google 上的评价`
- **H3 — WhyChoose:** `{city}企业为何选择马来西亚冷库出租`
- **H3 — Gallery:** `{city}附近的最近冷库送达案例`
- **H3 — LocationsAccordion:** `冷库租赁覆盖整个西马`
- **H3 — NearbyLocations:** `从{city}出发,我们也服务这些邻近地区`
- **H3 — FAQ:** `{city}冷库租赁 — 常见问题`
- **H3 — FinalCta:** `今天就锁定您在{city}的冷库`

---

## 3. Meta-title / meta-description templates (restated from seo-plan)

| Locale | Template title (≤60 chars) | Template description (140–155 chars) |
|---|---|---|
| EN | `Cold Room Rental in {city}, Malaysia | Same-Day` | `Rent HALAL cold rooms in {city} — frozen, freezer, chiller, cool storage. Same-day delivery, 5-min WhatsApp quote, trusted by {city} businesses.` |
| MS | `Sewa Cold Room di {city}, Malaysia | Hari Ini` | `Sewa cold room HALAL di {city} — beku, freezer, chiller, stor sejuk. Penghantaran hari yang sama, sebut harga WhatsApp 5 minit di {city}.` |
| ZH | `{city}冷库出租 | 清真,当天送达` | `{city}冷库出租 — 冷冻库、冷冻室、冷藏库、冷藏室一应俱全。清真认证,当天送达{city},WhatsApp 5 分钟报价。` |

(Implementation note for Kimmy: if Latin `{city}` is too long for ≤60 chars in titles like `Cold Room Rental in Iskandar Puteri, Malaysia | Same-Day` — drop `, Malaysia` first, then drop `| Same-Day`. ZH titles are typically safe.)

---

## 4. Intro paragraph variants (3 per locale, rotated by `cityHash`)

Each variant mentions `{city}` ≥2 times by itself. Combined with H1 + H2 (each 1×) + later sections (≥3×), every page exceeds the 6× density floor.

### EN

**Variant 0 (cityHash === 0):**
> When a {city} business calls us about cold room rental, the timeline is almost always urgent — peak orders, festive season, or a fridge that just gave up. We deliver HALAL-compliant cold rooms across {city} the same day in most cases, set them up on-site, and verify the temperature before we leave. From -18°C deep freeze for seafood to 2°C chillers for dairy, every tier is rentable by the day, week, or month — no long contracts, no surprises. Quote in 5 minutes on WhatsApp.

**Variant 1 (cityHash === 1):**
> {city} sits in {state}, and our cold-truck fleet covers it daily — which means cold room delivery to {city} is one of the fastest legs of our network. We rent four temperature tiers (frozen, freezer, chiller, cool storage), all HALAL-segregated, all with downloadable temperature logs for audits. Whether you're a kenduri caterer, a supermarket needing overflow stock, or an F&B chain expanding into {city}, we have a cold room sized to fit, priced from RM5 per pallet per day. WhatsApp us with your goods type and we will quote within 5 minutes.

**Variant 2 (cityHash === 2):**
> Cold storage in {city} doesn't have to mean buying a fridge or signing a year-long lease. Cold Room Malaysia rents -18°C frozen, -5°C to -10°C freezer, 2°C to 4°C chiller, and 7°C to 10°C cool storage cold rooms — all delivered to {city} on the same day in most cases, all HALAL-compliant, and all backed by 99% on-time delivery. Pricing is per-pallet, per-box, or per-room — flexible enough for a one-day event or a 12-month seasonal project. Lock in your {city} delivery slot via WhatsApp.

### MS

**Variant 0:**
> Apabila perniagaan {city} hubungi kami untuk sewa cold room, tarikhnya hampir selalu mendesak — pesanan puncak, musim perayaan, atau peti sejuk yang baru rosak. Kami hantar cold room patuh HALAL ke seluruh {city} pada hari yang sama dalam kebanyakan kes, pasang di tapak, dan sahkan suhu sebelum kami beredar. Dari beku dalam -18°C untuk hasil laut hingga chiller 2°C untuk tenusu, setiap tahap boleh disewa ikut hari, minggu atau bulan — tiada kontrak panjang, tiada kejutan. Sebut harga dalam 5 minit di WhatsApp.

**Variant 1:**
> {city} terletak di {state}, dan armada trak sejuk kami melaluinya setiap hari — bermakna penghantaran cold room ke {city} antara laluan paling pantas dalam rangkaian kami. Kami sewa empat tahap suhu (beku, freezer, chiller, stor sejuk), semuanya diasingkan HALAL, semuanya dengan log suhu boleh muat turun untuk audit. Sama ada anda penyedia kenduri, pasaraya yang perlukan stok limpahan, atau rangkaian F&B yang berkembang ke {city}, kami ada cold room bersaiz padan, dari RM5 sepalet sehari. WhatsApp kami dengan jenis barang dan kami akan sebut harga dalam 5 minit.

**Variant 2:**
> Cold storage di {city} tidak semestinya membeli peti sejuk atau tandatangan pajakan setahun. Cold Room Malaysia sewakan cold room beku -18°C, freezer -5°C hingga -10°C, chiller 2°C hingga 4°C, dan stor sejuk 7°C hingga 10°C — semuanya dihantar ke {city} pada hari yang sama dalam kebanyakan kes, semuanya patuh HALAL, dan semuanya disokong penghantaran 99% tepat masa. Harga ikut palet, kotak atau bilik — cukup fleksibel untuk acara satu hari atau projek bermusim 12 bulan. Kunci slot penghantaran {city} anda melalui WhatsApp.

### ZH

**Variant 0:**
> 每当{city}的客户来电询问冷库租赁时,他们的时间线几乎总是紧迫的 — 旺季订单、节庆备货,或是冰柜刚刚故障。我们的清真冷库可在大多数情况下当天送达{city},现场安装并验证温度后才离场。无论是 -18°C 的海鲜深冷,还是 2°C 的乳制品冷藏库,均可按天、按周或按月租赁,没有长期合约,没有隐藏成本。WhatsApp 5 分钟即可获得报价。

**Variant 1:**
> {city}位于{state},我们的冷藏车队每天往返该区 — 这意味着送达{city}是我们网络中最快的航段之一。我们出租四种温区(冷冻、冷冻室、冷藏库、冷藏室),全部清真分隔储存,全部提供可下载的温度日志,适合稽核。无论您是宴会承办商、需要补给的超市,还是计划进军{city}的 F&B 连锁,我们都有合适尺寸的冷库,每板每天 RM5 起。WhatsApp 告诉我们货品类型,5 分钟内即出报价。

**Variant 2:**
> {city}的冷藏储存,不必非得购买冰柜或签下一整年的租赁合约。马来西亚冷库出租提供 -18°C 冷冻库、-5°C 至 -10°C 冷冻室、2°C 至 4°C 冷藏库与 7°C 至 10°C 冷藏室 — 大多数情况下当天送达{city},全程清真合规,99% 准时送达率。计价方式按板、按箱或整间冷库,既适合一天的活动,也适合长达 12 个月的季节性项目。WhatsApp 立即锁定您的{city}送达档期。

---

## 5. Closing paragraph variants (3 per locale)

### EN

**Variant 0:**
> Cold Room Malaysia is the cold-chain partner {city} businesses come back to — because we treat every delivery like it's our own stock at stake. WhatsApp us your pallet count, target temperature, and {city} address. We will reply within 5 minutes with a firm quote, lock in your same-day slot, and have a HALAL-compliant cold room running before the next loading window.

**Variant 1:**
> The next cold room delivery van rolling out to {city} could be carrying yours. We have already served customers in {nearbyOne} and {nearbyTwo} this week, so the route is hot. Send a quick message on WhatsApp — pallet count, goods type, {city} drop-off — and we will quote in 5 minutes. No fridges to buy, no contracts to sign, no cold-chain risk to carry alone.

**Variant 2:**
> Whether your {city} site needs a single chiller for one wedding kenduri or a bank of frozen cold rooms for a 6-month seafood contract, we are 5 minutes away on WhatsApp. HALAL-handled, 99% on-time, audit-ready logs included — Cold Room Malaysia keeps the cold chain unbroken from our depot to your {city} loading bay.

### MS

**Variant 0:**
> Cold Room Malaysia ialah rakan rantaian sejuk yang perniagaan {city} kembali kepada — kerana kami layan setiap penghantaran seperti stok kami sendiri yang dipertaruhkan. WhatsApp kami bilangan palet, suhu sasaran, dan alamat {city} anda. Kami akan balas dalam 5 minit dengan sebut harga muktamad, kunci slot hari yang sama, dan jalankan cold room patuh HALAL sebelum tetingkap muatan seterusnya.

**Variant 1:**
> Van penghantaran cold room seterusnya yang menuju {city} boleh jadi membawa milik anda. Kami sudah berkhidmat di {nearbyOne} dan {nearbyTwo} minggu ini, jadi laluan masih panas. Hantar mesej ringkas di WhatsApp — bilangan palet, jenis barang, lokasi penurunan {city} — dan kami akan sebut harga dalam 5 minit. Tiada peti sejuk perlu dibeli, tiada kontrak perlu ditandatangan, tiada risiko rantaian sejuk perlu dipikul seorang.

**Variant 2:**
> Sama ada tapak {city} anda perlukan satu chiller untuk kenduri kahwin atau bank cold room beku untuk kontrak hasil laut 6 bulan, kami 5 minit jauh di WhatsApp. Dikendalikan HALAL, 99% tepat masa, log sedia diaudit termasuk — Cold Room Malaysia memastikan rantaian sejuk tidak terputus dari depoh kami ke kawasan muatan {city} anda.

### ZH

**Variant 0:**
> 马来西亚冷库出租是{city}企业反复合作的冷链伙伴 — 因为我们把每一次送达,都当作自家的库存来对待。WhatsApp 告诉我们板位数量、目标温度,以及您在{city}的送达地址。5 分钟内,我们就会发送正式报价、锁定您的当天档期,并在下一个装卸时段开始前,把一座清真合规的冷库送达运行。

**Variant 1:**
> 下一辆开往{city}的冷库送货车,可能就是您的。本周我们已在{nearbyOne}与{nearbyTwo}完成派送,路线状态正热。在 WhatsApp 上简短发送 — 板位数量、货品类型、{city}卸货地点 — 我们将于 5 分钟内报价。不必购入冰柜、不必签署合同,也不必独自承担冷链风险。

**Variant 2:**
> 无论您在{city}的工地只需要一台冷藏库来撑一场婚宴,还是要一整批冷冻库来支援 6 个月的海鲜合约,我们都在 WhatsApp 上 5 分钟可达。全程清真处理、99% 准时送达、合规可审核温度日志一应俱全 — 马来西亚冷库出租为您从总部仓库到{city}的装卸区,守住每一段冷链。

---

## 6. FAQ Q-set variants (3 per locale, each with ≥5 Q&A)

Each variant has 5 questions naming {city} (Q1, Q2, Q3, Q4, Q5). Hash chooses one of the three variant sets. Each answer mentions {city} naturally.

### 6.1 EN — FAQ Variant A (cityHash === 0)
1. **Q:** How quickly can you deliver a cold room in {city}?
   **A:** We aim for same-day delivery in {city} when you WhatsApp us before 2pm. Our cold-truck fleet covers {state} daily, so the route to {city} is one of the most-served in our network — most {city} customers receive their cold room within hours of confirming the slot.
2. **Q:** Do your {city} cold room rentals come with HALAL certification?
   **A:** Yes. Every cold room and cold truck deployed to {city} is operated under strict HALAL handling — segregated from non-HALAL goods, with downloadable temperature logs that satisfy JAKIM audit requirements. This is critical for {city} businesses serving Muslim customers.
3. **Q:** What sizes are available for cold room rental in {city}?
   **A:** {city} customers can rent by the pallet (from RM5/pallet/day), by the box (from RM0.50/box/day), or by full-room dimensions (cubic-metre or container-style rooms). We size the rental to your goods volume so you only pay for the space you actually need in {city}.
4. **Q:** Can you handle pharmaceutical or temperature-sensitive cargo in {city}?
   **A:** Absolutely. Our 7°C to 10°C cool-storage tier is built for pharmaceuticals, vaccines, and temperature-sensitive shelf goods — and we provide audit-ready temperature logs for every {city} pharma rental. The setup is identical to what hospital and clinic supply chains in Klang Valley already run.
5. **Q:** Is there a deposit or long-term contract for {city} rentals?
   **A:** No long-term lock-in. Most {city} customers pay 50% to confirm the slot and the balance on delivery, with rental terms ranging from one day (events, kenduri) up to multiple months (festive overflow, construction-site catering). Verified accounts often get more flexible terms.

### 6.2 EN — FAQ Variant B (cityHash === 1)
1. **Q:** Where in {city} can you deliver cold rooms to?
   **A:** Anywhere in {city} — F&B kitchens, event venues, supermarkets, warehouses, factories, hospitals, and event sites. Our trucks navigate the full {city} road network and we coordinate with site supervisors to drop the cold room exactly where the loading bay is.
2. **Q:** Can I rent a cold room in {city} for just one day or one weekend?
   **A:** Yes. Single-day and weekend rentals are common in {city} — popular for kenduri kahwin, corporate events, festive markets, and pop-up F&B activations. Pricing scales by day so a one-day rental is just one day's worth of pallet/box/room rate.
3. **Q:** What if my {city} site doesn't have 3-phase power?
   **A:** No problem. While most rental cold rooms in {city} use 3-phase 415V power, we also stock single-phase units and generator-backed options for off-grid sites or temporary venues. WhatsApp us a photo of your power point and we will match the right machine.
4. **Q:** Do you also offer cold trucks in {city} for last-mile delivery?
   **A:** Yes. Our parent company Cold Truck Malaysia runs a refrigerated truck fleet across {city} from RM600 — many customers pair a static cold room rental with one or two cold trucks to handle last-mile distribution from the {city} hub.
5. **Q:** How do I get a cold room rental quote for {city}?
   **A:** WhatsApp us four things: goods type, pallet/box count, target temperature, and your {city} delivery address. Our team replies within 5 minutes with a firm rental quote — including delivery, setup, temperature verification, and pickup at the end of the rental.

### 6.3 EN — FAQ Variant C (cityHash === 2)
1. **Q:** Why rent a cold room in {city} instead of buying one?
   **A:** Renting in {city} avoids capex, avoids long lead times, and avoids being stuck with the wrong size. Cold Room Malaysia delivers a calibrated, HALAL-compliant cold room to {city} the same day — you only pay for the rental period and the rental matches your exact goods volume.
2. **Q:** Can the cold room hold a stable temperature in {city}'s tropical climate?
   **A:** Yes. Every cold room rented to {city} is rated for Malaysian tropical conditions — the units run continuously through 35°C ambient highs without losing setpoint. We verify the holding temperature on-site at handover so you start the rental with a documented, stable cold room.
3. **Q:** What goods are most commonly stored in {city} cold room rentals?
   **A:** In {city} we see frozen seafood, frozen meat and chicken, ice cream, dairy and milk, bakery dough, fresh flowers, pharmaceuticals, beverages, and supermarket overflow stock during festive seasons. Each goes into a different temperature tier — we will recommend the right one for {city}.
4. **Q:** What happens if the cold room has an issue during my rental in {city}?
   **A:** Our 24-hour standby team responds to {city} calls within 1 hour, and we keep backup units in {state} ready to swap if needed. The HALAL chain stays unbroken, your goods stay on temperature, and you carry zero risk during the {city} rental.
5. **Q:** Do you provide cold room rental for events and kenduri in {city}?
   **A:** Yes — event-grade cold room rental in {city} is one of our highest-volume use cases. Wedding kenduri, corporate functions, festive bazaars, and outdoor F&B activations all use our chiller and freezer tiers. Same-day delivery, HALAL-handled, picked up after the event.

### 6.4 MS — FAQ Variant A
1. **Q:** Berapa cepat anda boleh hantar cold room di {city}?
   **A:** Kami sasarkan penghantaran hari yang sama di {city} apabila anda WhatsApp kami sebelum 2 petang. Armada trak sejuk kami melalui {state} setiap hari, jadi laluan ke {city} antara yang paling kerap kami layan — kebanyakan pelanggan {city} terima cold room dalam beberapa jam selepas slot disahkan.
2. **Q:** Adakah sewaan cold room {city} anda termasuk pematuhan HALAL?
   **A:** Ya. Setiap cold room dan trak sejuk yang dihantar ke {city} dikendalikan secara HALAL ketat — diasingkan dari barang bukan HALAL, dengan log suhu boleh muat turun yang memenuhi keperluan audit JAKIM. Ini kritikal untuk perniagaan {city} yang melayan pelanggan Muslim.
3. **Q:** Saiz apa tersedia untuk sewaan cold room di {city}?
   **A:** Pelanggan {city} boleh sewa ikut palet (dari RM5/palet/hari), ikut kotak (dari RM0.50/kotak/hari), atau ikut dimensi bilik penuh. Kami padankan saiz sewaan dengan volum barang anda, jadi anda hanya bayar ruang yang sebenar diperlukan di {city}.
4. **Q:** Boleh tak anda kendalikan kargo farmaseutikal atau sensitif suhu di {city}?
   **A:** Boleh. Tahap stor sejuk 7°C hingga 10°C kami direka untuk farmaseutikal, vaksin dan barang rak sensitif — dan kami sediakan log suhu sedia diaudit untuk setiap sewaan farma {city}. Susunan ini sama dengan yang sudah berjalan dalam rantaian bekalan hospital dan klinik di Lembah Klang.
5. **Q:** Adakah deposit atau kontrak panjang untuk sewaan {city}?
   **A:** Tiada ikatan jangka panjang. Kebanyakan pelanggan {city} bayar 50% untuk sahkan slot dan baki ketika penghantaran, dengan tempoh sewaan dari satu hari (acara, kenduri) hingga beberapa bulan (limpahan perayaan, katering tapak). Akaun yang disahkan biasanya dapat terma lebih fleksibel.

### 6.5 MS — FAQ Variant B
1. **Q:** Di mana di {city} anda boleh hantar cold room?
   **A:** Di mana-mana sahaja di {city} — dapur F&B, tempat acara, pasaraya, gudang, kilang, hospital, dan tapak majlis. Trak kami navigasi seluruh rangkaian jalan {city} dan kami selaras dengan penyelia tapak untuk letak cold room tepat di kawasan muatan.
2. **Q:** Boleh saya sewa cold room di {city} untuk satu hari atau hujung minggu sahaja?
   **A:** Boleh. Sewaan satu hari dan hujung minggu biasa di {city} — popular untuk kenduri kahwin, acara korporat, pasar perayaan dan aktivasi F&B pop-up. Harga ikut hari, jadi sewaan satu hari hanya satu hari kadar palet/kotak/bilik.
3. **Q:** Bagaimana jika tapak {city} saya tiada kuasa 3-fasa?
   **A:** Tiada masalah. Walaupun kebanyakan cold room sewaan di {city} guna kuasa 3-fasa 415V, kami juga ada unit fasa tunggal dan pilihan dengan janakuasa untuk tapak tanpa grid. WhatsApp kami gambar titik kuasa anda dan kami akan padankan mesin yang betul.
4. **Q:** Anda juga sewa trak sejuk di {city} untuk penghantaran last-mile?
   **A:** Ya. Syarikat induk kami Cold Truck Malaysia kendalikan armada trak sejuk di {city} dari RM600 — ramai pelanggan gabungkan sewaan cold room statik dengan satu atau dua trak sejuk untuk pengedaran last-mile dari hab {city}.
5. **Q:** Bagaimana saya dapatkan sebut harga sewa cold room untuk {city}?
   **A:** WhatsApp kami empat perkara: jenis barang, bilangan palet/kotak, suhu sasaran, dan alamat penghantaran {city} anda. Pasukan kami balas dalam 5 minit dengan sebut harga sewa muktamad — termasuk penghantaran, pemasangan, sahkan suhu dan kutipan semula pada akhir sewaan.

### 6.6 MS — FAQ Variant C
1. **Q:** Mengapa sewa cold room di {city} bukannya beli?
   **A:** Sewa di {city} elak modal besar, elak masa menunggu lama, dan elak tersangkut dengan saiz salah. Cold Room Malaysia hantar cold room dikalibrasi dan patuh HALAL ke {city} pada hari yang sama — anda bayar hanya tempoh sewaan dan saiz padan dengan volum barang anda.
2. **Q:** Boleh cold room kekalkan suhu stabil dalam iklim tropika {city}?
   **A:** Boleh. Setiap cold room yang disewa ke {city} dirated untuk keadaan tropika Malaysia — unit beroperasi berterusan sehingga suhu ambien 35°C tanpa hilang setpoint. Kami sahkan suhu kekal di tapak ketika serahan, jadi anda mula sewaan dengan cold room stabil dan terdokumen.
3. **Q:** Barang apa yang biasa disimpan dalam sewaan cold room {city}?
   **A:** Di {city} kami nampak hasil laut beku, daging dan ayam beku, ais krim, tenusu dan susu, doh bakeri, bunga segar, farmaseutikal, minuman, dan stok limpahan pasaraya semasa musim perayaan. Setiap satu masuk tahap suhu berbeza — kami akan cadangkan yang betul untuk {city}.
4. **Q:** Apa jadi jika cold room ada masalah semasa sewaan saya di {city}?
   **A:** Pasukan siaga 24-jam kami balas panggilan {city} dalam 1 jam, dan kami simpan unit ganti di {state} sedia ditukar jika perlu. Rantaian HALAL kekal tidak putus, barang anda kekal pada suhu, dan anda tidak tanggung sebarang risiko semasa sewaan {city}.
5. **Q:** Anda sediakan sewa cold room untuk acara dan kenduri di {city}?
   **A:** Ya — sewaan cold room gred acara di {city} antara penggunaan paling kerap kami. Kenduri kahwin, fungsi korporat, bazar perayaan, dan aktivasi F&B luar ruang semuanya guna chiller dan freezer kami. Penghantaran hari yang sama, dikendalikan HALAL, dikutip selepas acara.

### 6.7 ZH — FAQ Variant A
1. **Q:** {city}的冷库可以多快送达？
   **A:** 您在下午 2 点前 WhatsApp 我们,我们目标当天送达{city}。我们的冷藏车队每天往返{state},因此送往{city}的路线是网络中最常服务的之一 — 大多数{city}客户在确认档期后数小时内就能收到冷库。
2. **Q:** 你们在{city}出租的冷库符合清真标准吗？
   **A:** 符合。每一座送达{city}的冷库与冷藏车都按严格清真标准操作 — 与非清真货品分隔储存,温度日志可下载并满足 JAKIM 稽核要求。这对面向穆斯林顾客的{city}企业至关重要。
3. **Q:** {city}冷库租赁有哪些尺寸可选？
   **A:** {city}客户可按板租赁(每板每天 RM5 起)、按箱租赁(每箱每天 RM0.50 起),或按整间冷库尺寸(立方米或货柜式)。我们按您的货量配置租赁,确保您只为在{city}实际所需的空间付费。
4. **Q:** {city}的药品或温度敏感货物可以处理吗？
   **A:** 当然可以。我们的 7°C 至 10°C 冷藏室专为药品、疫苗和温度敏感的常温商品设计 — 每一份在{city}的药品租赁都会附上合规可审核的温度日志,与巴生谷地区医院和诊所的供应链运作完全一致。
5. **Q:** {city}租赁需要押金或长期合同吗？
   **A:** 无长期锁定。大多数{city}客户预付 50% 锁定档期、余款于送达时结清,租赁期可短至一天(活动、宴会),长至数月(节庆补给、工地餐饮)。信用良好的账户可申请更灵活的条款。

### 6.8 ZH — FAQ Variant B
1. **Q:** {city}哪些地方可以送达冷库？
   **A:** {city}的任何地点 — F&B 厨房、活动场地、超市、仓库、工厂、医院与活动现场。我们的冷藏车熟悉整个{city}的道路网络,会与现场主管协调,把冷库准确停放到装卸区。
2. **Q:** 可以在{city}只租一天或一个周末吗？
   **A:** 可以。一日租赁与周末租赁在{city}很常见 — 婚宴、企业活动、节庆市集与快闪 F&B 活动都常用。计价按天叠加,所以一日租赁就是一日的板/箱/整间冷库费用。
3. **Q:** 如果{city}的工地没有 3 相电怎么办？
   **A:** 没问题。虽然{city}大多数租赁冷库使用 3 相 415V 供电,我们也提供单相机型与备发电机方案,适用于离网工地或临时场地。WhatsApp 给我们一张电源接口照片,我们就能匹配合适的机组。
4. **Q:** {city}也能租冷藏车做最后一公里配送吗？
   **A:** 可以。母公司 Cold Truck Malaysia 在{city}运营冷藏车队,每辆 RM600 起 — 许多客户会把静态冷库租赁与一两辆冷藏车搭配,从{city}枢纽完成最后一公里配送。
5. **Q:** 如何获取{city}冷库租赁报价？
   **A:** WhatsApp 提供四项信息:货品类型、板/箱数量、目标温度、{city}送达地址。我们的团队 5 分钟内回复正式租赁报价 — 包含送达、安装、温度验证与租期结束后的回收。

### 6.9 ZH — FAQ Variant C
1. **Q:** 在{city}为何选择租冷库而不是买冷库？
   **A:** 在{city}租赁可避免大额资本支出、避免漫长的交付周期,也避免买错尺寸。马来西亚冷库出租可在当天将一座经过校准、清真合规的冷库送达{city} — 您只需按租赁时长付费,租赁规模又能精准匹配您的货量。
2. **Q:** {city}的热带气候下,冷库能保持稳定温度吗？
   **A:** 可以。每一座送达{city}的冷库均按马来西亚热带条件评级 — 即便环境温度高达 35°C,机组也能持续运行不掉点。我们在交接时现场验证维持温度,让您从租赁开始就拥有一座有据可查的稳定冷库。
3. **Q:** {city}的冷库租赁通常用来储存什么？
   **A:** 在{city}最常见的是冷冻海鲜、冷冻肉类与鸡肉、冰淇淋、乳制品与牛奶、烘焙面团、鲜花、药品、饮料,以及节庆季节的超市补给库存。每一类对应不同温区 — 我们会为{city}的客户推荐合适的温度档。
4. **Q:** 在{city}租赁期间冷库出问题怎么办？
   **A:** 我们的 24 小时待命团队会在 1 小时内响应{city}来电,并在{state}储备替换机组随时可换。清真链不中断、货品温度不变、整个{city}租赁期间您不承担任何风险。
5. **Q:** 你们提供{city}活动与宴会的冷库租赁吗？
   **A:** 当然 — 活动级冷库租赁是我们在{city}最高频的用途之一。婚宴、企业活动、节庆市集与户外 F&B 活动都使用我们的冷藏库与冷冻室温区。当天送达,全程清真处理,活动结束后直接回收。

---

## 7. Nearby links rendering rule

- Pull `nearby[]` from `config/locations.ts` (Sora's spec mandates 5–6 nearby per location).
- Render the first 5–6 as `NearbyLocations` cards under H3 `Nearby Areas We Also Serve from {city}` (or locale-equivalent).
- The closing-paragraph variant 1 fills `{nearbyOne}` and `{nearbyTwo}` from `nearby[0]` and `nearby[1]`.
- Reciprocity: if A lists B as nearby, B must list A. Validate during build.

---

## 8. Section reuse rule (everything else)

For every other homepage section (FomoBanner, Nav, UspBar, Stats, Products, HowItWorks, Risk, MidCta, GoogleReviews, WhyChoose, Gallery, LocationsAccordion, FinalCta, Footer, StickyWhatsAppFab) — the location page reuses the SAME translation keys from `messages/{locale}.json`. Only the H3 captions for Products / HowItWorks / Risk / MidCta / Reviews / WhyChoose / Gallery / NearbyLocations / FAQ / FinalCta get the `{city}` injection from Section 2 above.

This guarantees:
- No duplicate-content penalty (intro + closing + FAQ + H3s differ per city).
- Architecture parity with homepage (Rule 2 of architecture.md).
- Build cost stays low — no per-city authoring needed.

---

## 9. Build-time city-mention audit (for Kimmy)

Before merging, run a unit test that:
1. Renders each location page (English) to plaintext.
2. Counts case-insensitive occurrences of `{city}` display name.
3. Asserts `count >= 6`.

If it fails (rare for short city names like `Yan` or `Pekan`), the test should suggest swapping in the longer `{city}, {state}` form to bump count.

---

## 10. ZH city-name display map (recommended)

The slug stays Latin per architecture.md, but the ZH UI should display the Chinese city name. Provide this map in `config/locations.ts` as an optional `nameZh` field. Highlights below — Kimmy / Cyclops to fill the rest:

| slug | nameZh |
|---|---|
| kuala-lumpur | 吉隆坡 |
| petaling-jaya | 八打灵再也 |
| shah-alam | 莎阿南 |
| klang | 巴生 |
| port-klang | 巴生港 |
| subang-jaya | 梳邦再也 |
| puchong | 蒲种 |
| cyberjaya | 赛城 |
| kajang | 加影 |
| johor-bahru | 新山 |
| pasir-gudang | 巴西古当 |
| iskandar-puteri | 依斯干达公主城 |
| george-town | 乔治市 |
| bayan-lepas | 峇六拜 |
| butterworth | 北海 |
| ipoh | 怡保 |
| taiping | 太平 |
| seremban | 芙蓉 |
| nilai | 汝来 |
| port-dickson | 波德申 |
| melaka-city | 马六甲 |
| alor-setar | 亚罗士打 |
| sungai-petani | 双溪大年 |
| kulim | 居林 |
| langkawi | 浮罗交怡 |
| kota-bharu | 哥打巴鲁 |
| kuala-terengganu | 瓜拉登嘉楼 |
| kuantan | 关丹 |
| temerloh | 淡马鲁 |
| kangar | 加央 |
| putrajaya | 布城 |

For any slug without a `nameZh` mapping, fall back to the Latin display name in ZH UI. Token `{city}` resolves to `nameZh ?? name` at render time.
```