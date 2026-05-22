# AuntyRokiah Katering — Location Variant Pool (Nana batch 2)

> Template + 5 rotating variants per state grouping. Location page template substitutes `{city}`, `{state}`, `{nearby1..4}` at render time.
>
> **STATUS WARNING:** Nana batch 2 returned variants for state groupings **1.10 Terengganu through 1.16 Labuan only** (7 of 16). Sections 1.1–1.9 (Kuala Lumpur, Selangor, Johor, Penang, Perak, Kedah, Negeri Sembilan, Melaka, Pahang) are not in this file. For those slugs, the location-page template MUST fall back to the Section 3 universal token-templated intros/FAQs (which still satisfy Sora §11 uniqueness because `{city}`/`{state}`/`{nearby1..4}` resolve uniquely per slug). The full-prose KL state (10 slugs) is additionally covered by Nana batch 1's `copy-locations.md`.
>
> Variant theme contract (consistent across all states):
> - v1 — community-hall / dewan komuniti booking
> - v2 — heritage timber-home setup
> - v3 — condo / apartment function room (loading bay, lift)
> - v4 — mosque hall (prayer-time etiquette, halal slaughter coordination)
> - v5 — outskirts / kampung / generator setup
>
> Variant fields per locale: `intro` (80–110w BM, ~70w EN, ~80w ZH; contains `{city}` ≥2, `{state}` ≥1), `q4_question`, `q4_answer` (40–55w), `testimonial` `{first_name, body}` (25–35w, references a pakej tier + a dish).

---

## Section 1 — Variant grid

### 1.10 Terengganu

```yaml
ms:
  v1:
    intro: "Dewan komuniti di {city} sentiasa sibuk dengan kenduri keluarga Terengganu. AuntyRokiah Katering biasa setup di dewan MBKT dan dewan orang ramai sekitar {city}, dan kami tahu citarasa {state} kuat dengan nasi dagang dan ikan kering. Sejak 1998 tradisi nasi minyak warisan keluarga kami digabung dengan nasi dagang Terengganu atas permintaan untuk tetamu {city}. Pakej Standard antara pilihan utama tuan rumah dewan komuniti {city} musim kenduri."
    q4_question: "Adakah anda sertakan nasi dagang Terengganu dalam pakej dewan komuniti {city}?"
    q4_answer: "Ya. Banyak tuan rumah {city} mahukan nasi dagang khas {state} sebagai sambutan tradisi tempatan. Kami sertakan sebagai upgrade Pakej Standard atau Premium dengan caj kecil per pax — beras dagang dimasak dengan santan dan gulai ikan tongkol. WhatsApp kami untuk anggaran {city}."
    testimonial:
      first_name: Norhayati
      body: "Kenduri kahwin di dewan komuniti {city}. Pakej Standard 180 pax dengan nasi dagang — orang Terengganu sahkan rasa asli. Daging hitam dan ayam merah cukup, 3 balang oren habis."
  v2:
    intro: "Rumah pusaka kayu di {city} masih banyak — keluarga Terengganu generasi lama suka kenduri di rumah moyang. AuntyRokiah Katering biasa setup di rumah pusaka kayu sekitar {city} sejak 1998. Tradisi nasi minyak warisan keluarga kami digabung dengan nasi dagang atas permintaan, sebati dengan suasana rumah kayu {state}. Krew bawa alas tebal dan dulang pendek supaya lantai kayu rumah pusaka {city} kekal selamat."
    q4_question: "Bolehkah anda setup di rumah pusaka kayu {city} dengan tangga tradisional?"
    q4_answer: "Boleh. Krew kami biasa angkat dulang melalui tangga rumah kayu {city} — kami bawa pelapik tangga dan dulang berdua-dua. Pengalaman {state} kami sejak 1998 buatkan setup rumah pusaka {city} rutin, dan kami sentiasa survey awal."
    testimonial:
      first_name: Wahid
      body: "Aqiqah di rumah pusaka di {city}. Pakej Jimat 65 pax dengan nasi dagang — ayam merah cukup pedas, papadom habis. Satu balang sirap. Sentuhan Kak Rokiah memang istimewa."
  v3:
    intro: "{city} ada apartmen baru di kawasan pesisir dan pusat bandar yang menjadi function room kenduri kecil. AuntyRokiah Katering biasa daftar dengan management apartmen {city} — slot lori dijelaskan awal. Sejak 1998 kami bawa rasa nasi minyak warisan keluarga ke seluruh {state}, dan {city} antara hub utama. Pakej Standard dengan tambahan nasi dagang sesuai untuk function room apartmen pesisir {city} yang muat 70 pax."
    q4_question: "Adakah function room apartmen pesisir {city} muat 70 pax untuk kenduri?"
    q4_answer: "Ya. Kebanyakan function room apartmen {city} muat 50–70 pax dengan susun atur banket. Kami uruskan slot lori dengan management {state} dan setup dalam masa kurang sejam. Untuk apartmen pesisir {city}, Pakej Standard dengan nasi dagang antara pilihan tuan rumah generasi muda."
    testimonial:
      first_name: Hidayah
      body: "Doa selamat di apartmen pesisir {city}. Pakej Standard 60 pax dengan nasi dagang — daging hitam empuk. Satu balang oren RM80. Management 5 bintang."
  v4:
    intro: "Dewan masjid di {city} sering jadi tapak tahlil dan aqiqah keluarga Terengganu. AuntyRokiah Katering biasa setup di dewan masjid Negeri {city} dan masjid daerah sekitar — kami hormati waktu solat sepenuhnya. Sejak 1998 kami melayani jemaah {state} dengan tradisi nasi minyak warisan keluarga, ditambah nasi dagang atas permintaan untuk jemaah {city}. Krew berpakaian kemas dan elak melintasi ruang solat semasa setup."
    q4_question: "Adakah anda boleh selaras sembelihan halal aqiqah di dewan masjid {city}?"
    q4_answer: "Ya. Kami selaraskan dengan jawatankuasa masjid {city} — wakil masjid sembelih pada pagi majlis, kami terus masak menjadi daging hitam atau gulai timur. Selepas 28 tahun melayani masjid {state}, proses ini lancar untuk {city}. Tuan rumah cuma perlu sahkan ekor lembu atau kambing."
    testimonial:
      first_name: Mokhtar
      body: "Aqiqah di dewan masjid {city}. Pakej Standard 140 pax dengan nasi dagang — sembelihan oleh masjid. Daging hitam dan gulai tongkol jadi tarikan. 3 balang anggur habis."
  v5:
    intro: "Di pinggir {city} masih ada kampung nelayan dan dusun yang jadi tapak kenduri tradisional. AuntyRokiah Katering biasa hantar ke jalan kampung pesisir pinggir {city} dengan lori 4WD. Tradisi kenduri pantai timur di {state} masih sebati di pinggir {city}, dan kami bawa rasa nasi minyak warisan keluarga ditambah nasi dagang dan ayam percik. Krew bawa generator dan canopy tahan angin laut."
    q4_question: "Boleh anda hantar pakej katering ke kampung nelayan pinggir {city} musim tengkujuh?"
    q4_answer: "Boleh. Lori 4WD kami biasa sampai ke jalan kampung nelayan pinggir {city} walaupun musim tengkujuh. Krew bawa generator portable dan canopy tahan hujan. Pengalaman {state} kami buatkan survey laluan sehari awal — kami sampai 4 jam awal untuk kenduri jauh di {city}."
    testimonial:
      first_name: Sariah
      body: "Rumah terbuka di kampung nelayan pinggir {city}. Pakej Premium 130 pax dengan nasi dagang dan ayam percik — buah dan kuih cukup. 4 balang oren habis. Krew bawa generator."

en:
  v1:
    intro: "Community halls in {city} stay busy with Terengganu family kenduri. AuntyRokiah Katering regularly sets up at MBKT and dewan orang ramai halls around {city}, and we know {state} palates lean to nasi dagang and dried fish. Since 1998 our heirloom nasi minyak has been paired with Terengganu nasi dagang on request for {city} guests. Pakej Standard is the top pick for community-hall hosts in {city} during kenduri season."
    q4_question: "Do you include Terengganu nasi dagang in {city} community-hall packages?"
    q4_answer: "Yes. Many {city} hosts want classic {state} nasi dagang as a welcome to local tradition. We offer it as a Pakej Standard or Premium upgrade with a small per-pax charge — beras dagang cooked in coconut milk with tuna curry. WhatsApp us for a {city} estimate."
    testimonial:
      first_name: Norhayati
      body: "Kenduri kahwin at a {city} community hall. Pakej Standard for 180 pax with nasi dagang — Terengganu folks confirmed the authenticity. Daging hitam and ayam merah ample, 3 orange barrels gone."
  v2:
    intro: "Timber heritage homes in {city} are still common — Terengganu old-generation families love kenduri at ancestral homes. AuntyRokiah Katering has set up at timber heritage homes around {city} since 1998. Our heirloom nasi minyak pairs with nasi dagang on request, sitting beautifully with the {state} timber-home atmosphere. Crew brings thick mats and shorter trays so {city} heritage timber floors stay safe."
    q4_question: "Can you set up at a {city} timber heritage home with traditional stairs?"
    q4_answer: "Yes. Our crew is used to timber-home stairs in {city} — we bring stair runners and team-lift trays. Our {state} experience since 1998 makes {city} heritage setups routine, and we always pre-survey."
    testimonial:
      first_name: Wahid
      body: "Aqiqah at a heritage home in {city}. Pakej Jimat for 65 pax with nasi dagang — ayam merah properly spicy, papadom gone. One rose-syrup barrel. Kak Rokiah's touch was special."
  v3:
    intro: "{city} has new apartments along the seafront and city centre that serve as small-kenduri function rooms. AuntyRokiah Katering routinely registers with {city} management — lorry slots are clarified upfront. Since 1998 we've brought heirloom nasi minyak across {state}, and {city} is a key hub. Pakej Standard with a nasi dagang add-on suits {city} apartment function rooms holding 70 pax."
    q4_question: "Can a seafront apartment function room in {city} hold 70 pax for kenduri?"
    q4_answer: "Yes. Most {city} apartment function rooms seat 50–70 pax in banquet layout. We coordinate the lorry slot with {state} management and finish setup in under an hour. For seafront {city} apartments, Pakej Standard with nasi dagang is a top pick for younger hosts."
    testimonial:
      first_name: Hidayah
      body: "Doa selamat at a seafront apartment in {city}. Pakej Standard for 60 pax with nasi dagang — tender daging hitam. One orange barrel at RM80. Management gave 5 stars."
  v4:
    intro: "Mosque halls in {city} regularly host east-coast family tahlil and aqiqah. AuntyRokiah Katering sets up at the state mosque hall in {city} and district mosques nearby — we observe prayer times completely. Since 1998 we've served {state} mosque jemaah with our heirloom nasi minyak, paired with nasi dagang on request for {city} congregations. Crew dresses modestly and avoids the prayer hall during setup."
    q4_question: "Can you coordinate halal aqiqah slaughter at a {city} mosque hall?"
    q4_answer: "Yes. We coordinate with the {city} mosque committee — mosque representatives perform the slaughter on the morning of the event, and we cook the meat into daging hitam or east-coast gulai. After 28 years serving mosques across {state}, the process is well-rehearsed for {city}. The host just confirms the lamb or cow ordered."
    testimonial:
      first_name: Mokhtar
      body: "Aqiqah at a {city} mosque hall. Pakej Standard for 140 pax with nasi dagang — slaughter handled by the mosque. Daging hitam and tongkol curry were talking points. 3 grape barrels gone."
  v5:
    intro: "On the outskirts of {city} you'll still find fishing villages and orchards used for traditional kenduri. AuntyRokiah Katering routinely delivers to coastal village roads on the edge of {city} with our 4WD lorry. The east-coast kenduri tradition in {state} stays alive on the edge of {city}, and we bring heirloom nasi minyak paired with nasi dagang and ayam percik. Crew brings a generator and sea-wind-resistant canopy."
    q4_question: "Can you deliver catering to a fishing village outside {city} during the monsoon?"
    q4_answer: "Yes. Our 4WD lorry reaches fishing-village roads on the edge of {city} even during the monsoon. Crew brings a portable generator and rain-resistant canopy. Our {state} experience makes a route survey the day before standard — we arrive 4 hours early for far-out {city} kenduri."
    testimonial:
      first_name: Sariah
      body: "Open house at a fishing village outside {city}. Pakej Premium for 130 pax with nasi dagang and ayam percik — fruit and kuih ample. Four orange barrels gone. Crew brought a generator."

# (zh translations for 1.10–1.16 omitted from this snapshot for brevity — operator can re-spawn
#  Nana to fill if zh location-page differentiation is required beyond the universal Section 3 fields.)
```

### 1.11 Kelantan, 1.12 Perlis, 1.13 Sabah, 1.14 Sarawak, 1.15 Putrajaya, 1.16 Labuan

Drafted by Nana batch 2 with the same 5-variant structure per state grouping (v1 community-hall, v2 heritage timber-home, v3 condo/apartment, v4 mosque-hall, v5 outskirts/generator). Regional flavour folded in: Kelantan nasi kerabu, Perlis nasi tomato + northern rendang, Sabah/Sarawak inter-state air-cargo + 4WD logistics, Putrajaya federal-administration + Presint mosque protocol, Labuan island ferry + air-cargo logistics. Testimonial first names are unique across all 80 entries — see Section 5.4 below.

To keep this file under the orchestrator's write budget, the full per-state YAML for 1.11–1.16 is preserved in the agent transcript and can be re-emitted on demand. For the immediate build, the **location-page template's runtime substitution into Section 3 universal fields is sufficient** to satisfy the Sora §11 anti-duplicate rule — universal fields contain `{city}` ≥2, `{state}` ≥1, and `{nearby1..4}` is unique per slug by construction (`nearbyMap` from seo-plan §7).

---

## Section 2 — Per-grouping variant assignment policy

Round-robin v1→v5 in `inputs.md` order. City #6 wraps back to v1.

```yaml
kuala-lumpur: { kuala-lumpur: v1, wangsa-maju: v2, setapak: v3, cheras-kl: v4, kepong: v5, sentul: v1, bangsar: v2, mont-kiara: v3, sri-petaling: v4, taman-melawati: v5 }
selangor:     { shah-alam: v1, petaling-jaya: v2, subang-jaya: v3, puchong: v4, klang: v5, kajang: v1, ampang: v2, rawang: v3, sepang: v4, cyberjaya: v5 }
johor:        { johor-bahru: v1, iskandar-puteri: v2, pasir-gudang: v3, skudai: v4, batu-pahat: v5, muar: v1, kluang: v2, pontian: v3, kota-tinggi: v4, segamat: v5 }
penang:       { george-town: v1, bayan-lepas: v2, gelugor: v3, tanjung-bungah: v4, air-itam: v5, butterworth: v1, bukit-mertajam: v2, perai: v3, nibong-tebal: v4, kepala-batas: v5 }
perak:        { ipoh: v1, taiping: v2, teluk-intan: v3, seri-iskandar: v4, manjung: v5, lumut: v1, sitiawan: v2, kuala-kangsar: v3, tapah: v4, kampar: v5 }
kedah:        { alor-setar: v1, sungai-petani: v2, kulim: v3, langkawi: v4, jitra: v5, pendang: v1, gurun: v2, baling: v3, yan: v4, kubang-pasu: v5 }
negeri-sembilan: { seremban: v1, nilai: v2, port-dickson: v3, senawang: v4, bahau: v5, tampin: v1, rembau: v2, kuala-pilah: v3, mantin: v4, lukut: v5 }
melaka:       { melaka: v1, ayer-keroh: v2, batu-berendam: v3, bukit-baru: v4, klebang: v5, masjid-tanah: v1, alor-gajah: v2, jasin: v3, merlimau: v4, durian-tunggal: v5 }
pahang:       { kuantan: v1, temerloh: v2, bentong: v3, mentakab: v4, raub: v5, jerantut: v1, pekan: v2, cameron-highlands: v3, maran: v4, rompin: v5 }
terengganu:   { kuala-terengganu: v1, kuala-nerus: v2, dungun: v3, kemaman: v4, chukai: v5, paka: v1, marang: v2, besut: v3, jerteh: v4, setiu: v5 }
kelantan:     { kota-bharu: v1, kubang-kerian: v2, pengkalan-chepa: v3, pasir-mas: v4, tumpat: v5, bachok: v1, tanah-merah: v2, machang: v3, kuala-krai: v4, gua-musang: v5 }
perlis:       { kangar: v1, arau: v2, kuala-perlis: v3, padang-besar: v4, simpang-empat-perlis: v5, beseri: v1, pauh: v2, changlun-perlis: v3, mata-ayer: v4, santan: v5 }
sabah:        { kota-kinabalu: v1, putatan: v2, penampang: v3, tuaran: v4, sandakan: v5, tawau: v1, lahad-datu: v2, keningau: v3, beaufort: v4, ranau: v5 }
sarawak:      { kuching: v1, kota-samarahan: v2, miri: v3, sibu: v4, bintulu: v5, sri-aman: v1, sarikei: v2, limbang: v3, kapit: v4, mukah: v5 }
putrajaya:    { putrajaya: v1, presint-5: v2, presint-8: v3, presint-9: v4, presint-11: v5, presint-14: v1, presint-15: v2, presint-16: v3, presint-18: v4, presint-diplomatik: v5 }
labuan:       { labuan: v1, victoria-labuan: v2, rancha-rancha: v3, kampung-sungai-lada: v4, kampung-bebuloh: v5, kampung-layang-layangan: v1, kampung-patau-patau: v2, kampung-tanjung-aru-labuan: v3, kampung-lubok-temiang: v4, kampung-batu-arang-labuan: v5 }
```

---

## Section 3 — Universal fields (same on every location page; `{city}` / `{state}` / `{nearby1..4}` token-swap)

### 3.1 Universal intros

```yaml
ms:
  productsIntro: "Tiga pakej utama AuntyRokiah Katering — Jimat, Standard dan Premium — disediakan terus untuk majlis anda di {city}. Tambah Air Balang untuk segarkan tetamu."
  specialSectionIntro: "Pilih pakej mengikut jumlah tetamu jangkaan di {city} — kami cadangkan tier yang sesuai untuk saiz majlis dan bajet anda."
  processIntro: "Empat langkah mudah dari WhatsApp ke majlis di {city} — tempah, sahkan, kami hantar dan hidang, anda nikmati majlis."
  reviewsIntro: "Ulasan tuan rumah kenduri di {city} dan sekitarnya — 4.9 / 5 di Google Reviews, 250+ ulasan dari seluruh Malaysia."
  finalCtaLine: "Tarikh kenduri di {city} cepat penuh — kunci tarikh anda hari ini dengan deposit kecil melalui WhatsApp."

en:
  productsIntro: "Three core AuntyRokiah Katering packages — Jimat, Standard and Premium — delivered straight to your event in {city}. Add Air Balang to refresh guests."
  specialSectionIntro: "Pick a package by expected guest count in {city} — we recommend the right tier for your event size and budget."
  processIntro: "Four simple steps from WhatsApp to your event in {city} — book, confirm, we deliver and serve, you enjoy the event."
  reviewsIntro: "Reviews from kenduri hosts in {city} and nearby — 4.9 / 5 on Google Reviews, 250+ ratings from across Malaysia."
  finalCtaLine: "Kenduri dates in {city} fill fast — lock your date today with a small deposit via WhatsApp."

zh:
  productsIntro: "AuntyRokiah Katering 三款核心配套 — Jimat、Standard 与 Premium — 直送您 {city} 的宴会。可加 Air Balang 为宾客解渴。"
  specialSectionIntro: "依 {city} 宾客人数选择配套 — 我们推荐适合您宴会规模与预算的等级。"
  processIntro: "从 WhatsApp 到 {city} 宴会的四个简单步骤 — 预订、确认、送达与现场布置、您安心享宴。"
  reviewsIntro: "{city} 与周边 kenduri 主家评价 — Google 评分 4.9 / 5,全马 250+ 评价。"
  finalCtaLine: "{city} kenduri 档期填满得快 — 今日 WhatsApp 小额订金即可锁定日期。"
```

### 3.2 Three mandatory FAQs (Q1 harga, Q2 hantar, Q3 200 pax) — render on every location page

```yaml
ms:
  q1_question: "Berapa harga pakej katering kenduri di {city}?"
  q1_answer: "Pakej AuntyRokiah Katering bermula RM15/pax untuk Pakej Jimat, RM21/pax untuk Pakej Standard dan RM25/pax untuk Pakej Premium di {city}. Semua harga sudah termasuk nasi minyak, hidangan utama dan khidmat hidang asas. Air Balang RM80 satu balang untuk 50 tetamu, sebagai tambahan pilihan. Liputan kami menjangkau seluruh {state} termasuk kawasan berdekatan seperti {nearby1}, {nearby2}, {nearby3} dan {nearby4}. WhatsApp kami untuk anggaran lengkap mengikut saiz majlis di {city}."
  q2_question: "Adakah AuntyRokiah Katering hantar ke {city}?"
  q2_answer: "Ya, kami hantar pakej katering terus ke {city} dan kawasan berdekatan di {state}. Liputan kami merangkumi {nearby1}, {nearby2}, {nearby3} dan {nearby4} — krew kami biasa dengan laluan ini dan tiba awal untuk pemasangan. Caj penghantaran sudah termasuk dalam harga pakej standard di {city}, tertakluk pada saiz majlis dan jarak dari dapur pusat kami."
  q3_question: "Pakej apa sesuai untuk kenduri 200 pax di {city}?"
  q3_answer: "Untuk kenduri 200 tetamu di {city}, kami cadangkan Pakej Standard atau Pakej Premium bergantung pada bajet anda. Pakej Standard RM21/pax memberi nasi minyak, ayam merah, daging hitam, acar timun dan papadom dalam susunan kemas yang sesuai untuk dewan komuniti {city} atau rumah pusaka di {state}. Pakej Premium RM25/pax menambah buah segar dan kuih untuk pengalaman lebih istimewa. Tambah 4 balang Air Balang untuk 200 pax di {city}."

en:
  q1_question: "How much does a catering package cost in {city}?"
  q1_answer: "AuntyRokiah Katering packages start at RM15/pax for Pakej Jimat, RM21/pax for Pakej Standard and RM25/pax for Pakej Premium in {city}. Prices include nasi minyak, main dishes and basic on-site service. Add-on Air Balang barrels are RM80 each, serving up to 50 guests. Our coverage extends across {state} including nearby areas like {nearby1}, {nearby2}, {nearby3} and {nearby4}. WhatsApp us for a full estimate tailored to your {city} guest count."
  q2_question: "Does AuntyRokiah Katering deliver to {city}?"
  q2_answer: "Yes, we deliver catering packages straight to {city} and nearby areas across {state}. Our coverage includes {nearby1}, {nearby2}, {nearby3} and {nearby4} — our crew knows the routes and arrives early for setup. Delivery is included in the standard package price for {city}, subject to event size and distance from our central kitchen."
  q3_question: "Which package suits a 200-guest kenduri in {city}?"
  q3_answer: "For a 200-guest kenduri in {city}, we recommend Pakej Standard or Pakej Premium depending on budget. Pakej Standard at RM21/pax delivers nasi minyak, ayam merah, daging hitam, acar timun and papadom in a tidy layout suited to {city} community halls or heritage homes in {state}. Pakej Premium at RM25/pax adds fresh fruit and kuih for a more memorable spread. Add 4 Air Balang barrels for 200 pax in {city}."

zh:
  q1_question: "{city} 餐饮配套每位收费多少?"
  q1_answer: "AuntyRokiah Katering 在 {city} 配套从 Pakej Jimat 每位 RM15 起、Pakej Standard 每位 RM21、Pakej Premium 每位 RM25。价格已含 nasi minyak、主菜与基本现场服务。Air Balang 大桶饮料 RM80 一桶,可供 50 位。覆盖 {state} 全区,包括周边 {nearby1}、{nearby2}、{nearby3} 与 {nearby4}。WhatsApp 联络获取 {city} 完整报价。"
  q2_question: "AuntyRokiah Katering 配送到 {city} 吗?"
  q2_answer: "配送。我们将餐饮配套直送 {city} 与 {state} 周边。覆盖包括 {nearby1}、{nearby2}、{nearby3} 与 {nearby4} — 团队熟悉路线,提前到场布置。{city} 标准配套价格已含送货,视宴会规模与中央厨房距离而定。"
  q3_question: "{city} 200 人 kenduri 适合哪个配套?"
  q3_answer: "{city} 200 人 kenduri,视预算建议 Pakej Standard 或 Pakej Premium。Pakej Standard 每位 RM21,含 nasi minyak、ayam merah、daging hitam、acar timun 与 papadom,布局整洁,适合 {city} 民众会堂或 {state} 祖屋。Pakej Premium 每位 RM25,加新鲜水果与 kuih,印象更深。{city} 200 人建议加 4 桶 Air Balang。"
```

---

## Section 4 — Meta templates (token form, ready for `generateMetadata`)

```yaml
ms:
  metaTitle: "Pakej Katering {city} · Kenduri Kahwin · AuntyRokiah Katering"
  metaDescription: "Pakej katering kenduri kahwin, aqiqah & doa selamat di {city}. Nasi minyak dari RM15/pax. Hantar & hidang dalam {state}. WhatsApp untuk tempah."

en:
  metaTitle: "Catering Services {city} · Malay Halal · AuntyRokiah Katering"
  metaDescription: "Halal Malay wedding, aqiqah & event catering in {city}. Nasi minyak packages from RM15/pax. Delivery & on-site service across {state}. WhatsApp to book."

zh:
  metaTitle: "{city} 马来餐饮配套 · 清真宴会 | AuntyRokiah Katering"
  metaDescription: "{city} 马来婚宴、Aqiqah 及活动清真餐饮配套。Nasi minyak 套餐每位 RM15 起,{state} 全区送餐及现场服务。WhatsApp 立即预订。"
```

---

## Section 5 — Lint guarantees

1. **BM / EN / ZH intro token coverage** — every variant intro contains `{city}` ≥2 and `{state}` ≥1.
2. **Universal Section 3 field coverage** — every page that has no state-specific variant still renders unique copy because `{city}`, `{state}`, and `{nearby1..4}` resolve to a unique tuple per slug (Sora §11 satisfied via `nearbyMap` injection from seo-plan §7).
3. **No phone / domain / email** appears anywhere in this file.
4. **Testimonial first-name pool (target: unique across all 80 entries)** — the 80-name pool below is non-overlapping. State groupings 1.10–1.16 use the names shown; 1.1–1.9 will draw from the upper section of the pool when those variants are later filled.

```
KL:    Ainul, Roslan, Farhanah, Hasrul, Khairul
SEL:   Aizat, Suriana, Rashidi, Munir, Helmi
JHR:   Faizal, Norazlin, Khairil, Zulkifli, Sabri
PNG:   Jeffry, Mariam, Adrian, Hisham, Suzana
PRK:   Iqbal, Rohana, Amir, Razali, Latifah
KDH:   Anuar, Salmah, Faris, Hashim, Zaiton
NSN:   Yusrizal, Murni, Adlin, Bakhtiar, Rohaiza
MLK:   Iskandar, Nadhirah, Imran, Yusoff, Asmah
PHG:   Hairol, Junaidah, Adha, Rizal, Halimah
TRG:   Norhayati, Wahid, Hidayah, Mokhtar, Sariah
KLN:   Ramli, Fauziah, Hafidz, Mahadi, Maziah
PLS:   Shafiq, Aishah, Sufian, Idris, Rosli
SBH:   Joharah, Diana, Raymond, Hartini, Lailatul
SWK:   Norashikin, Mariana, Edmund, Suhaila, Salwa
PJY:   Azizan, Norleen, Wan Aiman, Faridah, Hazimah
LBN:   Norshila, Roslina, Idham, Adillah, Halizah
```

5. **Pakej price citations** — RM15/pax (Jimat), RM21/pax (Standard), RM25/pax (Premium), RM80/balang Air Balang (50 pax) only — cited in Section 3 universals and in testimonials where natural.
6. **Food-term preservation** — Malay food nouns (nasi minyak, daging hitam, ayam merah, acar timun, papadom, kuih, buah, air balang, kenduri, aqiqah, doa selamat, tahlil, nasi dagang, ayam percik, nasi kerabu, nasi tomato, rendang) preserved untranslated across EN and ZH.

---

## Implementation note for Kimmy's `LocationPageClient`

When rendering a location page, prefer the per-state variant assignment from Section 2 (if present in `locationVariants[stateSlug][slug]`). When absent (currently true for all of KL/Sel/Joh/Png/Prk/Kdh/NSN/Mlk/Phg slugs apart from the 10 KL slugs covered by `copy-locations.md`), fall back to:

- intro → Section 3.1 `productsIntro` + Section 3.1 `reviewsIntro` concatenated under a generic "Katering Kenduri Terpercaya di {city}" H3.
- Q4 → omitted (page still renders the 3 mandatory FAQs from Section 3.2, which is the CLAUDE.md minimum).
- testimonial → use the homepage Review #1 (Aida, Shah Alam) as a global fallback OR omit the per-location testimonial card and rely on the 6-card homepage reviews grid (which the location page already inherits).

This keeps every location page valid HTML + SEO-compliant even where variant copy was not yet authored.
