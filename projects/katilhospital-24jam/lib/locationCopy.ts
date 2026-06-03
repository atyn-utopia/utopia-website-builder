import { locations, Location } from '@/config/locations';
import { getNearbyLocations } from './getNearbyLocations';

export type Locale = 'ms' | 'en' | 'zh';

/** Simple deterministic string hash. Stable across builds. */
export function hash(slug: string): number {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function pick<T>(slug: string, bucket: T[], offset = 0): T {
  return bucket[(hash(slug) + offset) % bucket.length];
}

/** State-name translations. */
const STATE_NAMES: Record<string, Record<Locale, string>> = {
  'Klang Valley': { ms: 'Lembah Klang', en: 'Klang Valley', zh: '巴生谷' },
  'Selangor': { ms: 'Selangor', en: 'Selangor', zh: '雪兰莪' },
  'Negeri Sembilan': { ms: 'Negeri Sembilan', en: 'Negeri Sembilan', zh: '森美兰' },
  'Melaka': { ms: 'Melaka', en: 'Melaka', zh: '马六甲' },
  'Johor': { ms: 'Johor', en: 'Johor', zh: '柔佛' },
  'Perak': { ms: 'Perak', en: 'Perak', zh: '霹雳' },
  'Penang': { ms: 'Pulau Pinang', en: 'Penang', zh: '槟城' },
  'Kedah': { ms: 'Kedah', en: 'Kedah', zh: '吉打' },
  'Perlis': { ms: 'Perlis', en: 'Perlis', zh: '玻璃市' },
  'Kelantan': { ms: 'Kelantan', en: 'Kelantan', zh: '吉兰丹' },
  'Terengganu': { ms: 'Terengganu', en: 'Terengganu', zh: '登嘉楼' },
  'Pahang': { ms: 'Pahang', en: 'Pahang', zh: '彭亨' },
  'Sabah': { ms: 'Sabah', en: 'Sabah', zh: '沙巴' },
  'Sarawak': { ms: 'Sarawak', en: 'Sarawak', zh: '砂拉越' },
};

export function stateName(stateKey: string, locale: Locale | string): string {
  return STATE_NAMES[stateKey]?.[locale as Locale] ?? stateKey;
}

/** Rotating USP tokens for meta description (6 variants, hash % 6). */
const USP_TOKENS: Record<Locale, string[]> = {
  ms: [
    'penghantaran 24 jam',
    'sewa bulanan fleksibel',
    'pemasangan percuma',
    'tilam anti-decubitus tersedia',
    'katil manual & elektrik',
    'sokongan WhatsApp 24/7',
  ],
  en: [
    '24-hour delivery',
    'flexible monthly rental',
    'free setup included',
    'anti-decubitus mattresses available',
    'manual & electric beds',
    '24/7 WhatsApp support',
  ],
  zh: [
    '24小时送达',
    '灵活月租方案',
    '免费上门安装',
    '防褥疮气垫可选',
    '手动与电动病床',
    '全天候WhatsApp支持',
  ],
};

export function getMetaUSP(slug: string, locale: Locale | string): string {
  const bank = USP_TOKENS[locale as Locale] ?? USP_TOKENS.ms;
  return bank[hash(slug) % bank.length];
}

/** Lightweight local fact fallbacks — deterministic defaults per city. */
export interface LocalFact {
  hospital: string;
  district: string;
}

function defaultFacts(loc: Location): LocalFact {
  return {
    hospital: `hospital di kawasan ${loc.state}`,
    district: `pusat bandar ${loc.name}`,
  };
}

/** A small set of overrides for major cities. Default otherwise. */
const LOCAL_FACT_OVERRIDES: Record<string, LocalFact> = {
  'kuala-lumpur': { hospital: 'Hospital Kuala Lumpur', district: 'pusat bandar KL' },
  'petaling-jaya': { hospital: 'Hospital Sungai Buloh', district: 'SS2 & Seksyen 13' },
  'shah-alam': { hospital: 'Hospital Shah Alam', district: 'Seksyen 7 & 13' },
  'subang-jaya': { hospital: 'Sunway Medical Centre', district: 'USJ & SS15' },
  'johor-bahru': { hospital: 'Hospital Sultanah Aminah', district: 'Taman Pelangi & JB Sentral' },
  'klang': { hospital: 'Hospital Tengku Ampuan Rahimah', district: 'Bandar Klang' },
  'george-town': { hospital: 'Penang General Hospital', district: 'Pulau Tikus & Jelutong' },
  'ipoh': { hospital: 'Hospital Raja Permaisuri Bainun', district: 'Ipoh Garden & Greentown' },
  'kuantan': { hospital: 'Hospital Tengku Ampuan Afzan', district: 'Indera Mahkota' },
  'kota-kinabalu': { hospital: 'Hospital Queen Elizabeth', district: 'Likas & Luyang' },
  'kuching': { hospital: 'Sarawak General Hospital', district: 'Kota Sentosa & Petra Jaya' },
};

export function getLocalFact(slug: string): LocalFact {
  const override = LOCAL_FACT_OVERRIDES[slug];
  if (override) return override;
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) return { hospital: 'hospital tempatan', district: 'pusat bandar' };
  return defaultFacts(loc);
}

/** H2 subtitle variants for location pages (8 shared shells, picked per locale). */
const H2_SHELLS: Record<Locale, string[]> = {
  ms: [
    'Penghantaran 24 jam di {city}, {state} — manual, elektrik & tilam anti-decubitus.',
    'Hantar hari sama ke {city} dan kawasan {state} — katil, tilam dan peralatan penjagaan.',
    'Katil hospital untuk keluarga di {city} — pasang, tunjuk cara, selesai dalam sehari.',
    'Sewa atau beli katil hospital di {city}, {state} — dengan pemasangan percuma di rumah anda.',
    'Solusi penjagaan pesakit di {city} — katil, tilam angin dan mesin oksigen hantar terus ke rumah.',
    'Liputan penuh {state} — khidmat katil hospital 24 jam bermula dari {city}.',
    'Tempah melalui WhatsApp dan dapat katil hospital di {city} dalam masa 24 jam.',
    'Katil hospital bergred hospital untuk penjagaan di rumah di {city}, {state}.',
  ],
  en: [
    '24-hour delivery in {city}, {state} — manual, electric and anti-decubitus mattresses.',
    'Same-day delivery to {city} and surrounding {state} — beds, mattresses and care equipment.',
    'Hospital beds for families in {city} — delivered, set up and explained in a single day.',
    'Rent or buy a hospital bed in {city}, {state} — with free setup at your home.',
    'Patient-care solutions in {city} — beds, air mattresses and oxygen machines delivered to your door.',
    'Full {state} coverage — 24-hour hospital bed service starting from {city}.',
    'Order via WhatsApp and get a hospital bed in {city} within 24 hours.',
    'Hospital-grade beds for home care in {city}, {state}.',
  ],
  zh: [
    '{city}（{state}）24小时送达 — 手动、电动病床及防褥疮气垫床。',
    '当天送达 {city} 及 {state} 周边 — 病床、床垫与护理设备。',
    '为 {city} 家庭提供病床 — 一天内完成送货、安装与讲解。',
    '在 {city}（{state}）租用或购买病床 — 附免费上门安装。',
    '{city} 病患照护方案 — 病床、气垫床与制氧机直接送抵家门。',
    '{state} 全境覆盖 — 从 {city} 起步的24小时病床服务。',
    '透过 WhatsApp 下单，24小时内即可在 {city} 收到病床。',
    '{city}（{state}）居家照护医院级病床。',
  ],
};

export function getLocationH2(
  slug: string,
  stateKey: string,
  locale: Locale | string
): string {
  const bank = H2_SHELLS[locale as Locale] ?? H2_SHELLS.ms;
  const tpl = pick(slug, bank, 1);
  const loc = locations.find((l) => l.slug === slug);
  const city = loc?.name ?? slug;
  return tpl
    .replace(/\{city\}/g, city)
    .replace(/\{state\}/g, stateName(stateKey, locale));
}

/** Intro paragraph variants — 4 shared shells, filled with per-city tokens. */
const INTRO_SHELLS: Record<Locale, string[]> = {
  ms: [
    'Penjagaan pesakit di {city} tidak perlu menunggu. Katil Hospital 24 Jam menghantar katil hospital manual, elektrik dan tilam anti-decubitus terus ke rumah anda di kawasan {district}, biasanya dalam masa 24 jam selepas tempahan disahkan di WhatsApp. Kami faham keluarga di sekitar {hospital} dan {nearby1} selalunya perlu katil selepas pesakit keluar wad — itulah sebabnya kami menyediakan pemasangan percuma, pilihan sewa bulanan atau beli, serta sokongan selepas hantar untuk sebarang soalan teknikal. Sama ada untuk warga emas di {city} atau pesakit pasca-pembedahan di {nearby2}, pasukan kami bersedia 24 jam sehari.',
    'Di {city}, keluarga yang menjaga pesakit di rumah sering mencari katil hospital yang boleh dihantar cepat tanpa birokrasi. Katil Hospital 24 Jam memenuhi keperluan ini — katil manual 1 dan 2 fungsi, katil elektrik 3 fungsi, tilam foam gred hospital dan tilam angin anti-decubitus, kesemuanya dihantar, dipasang dan diterangkan dalam satu lawatan. Dari {district} hingga kawasan berhampiran {nearby1}, kami menutup permintaan sewa bulanan dan pembelian secara konsisten. Hubungi kami di WhatsApp — sebut harga, jadual penghantaran dan pautan bayaran semuanya dihantar dalam satu perbualan.',
    'Bila pesakit pulang dari {hospital} ke {city}, keluarga biasanya mempunyai kurang 24 jam untuk menyediakan ruang bilik dan peralatan. Katil Hospital 24 Jam selesaikan bahagian peralatan — kami hantar katil dan tilam terus ke rumah anda di {district}, pasang roda berkunci dan rail sisi, dan tunjuk cara guna remote atau pam angin. Keluarga di {nearby1} dan {nearby2} sudah menggunakan perkhidmatan kami sejak tahun lepas. Sewa bulanan dan pembelian langsung kedua-duanya tersedia — WhatsApp kami untuk sebut harga dalam beberapa minit.',
    'Untuk penduduk {city} yang memerlukan katil hospital di rumah, Katil Hospital 24 Jam menawarkan pilihan lengkap dengan penghantaran 24 jam ke seluruh kawasan {state}. Kami melayani keluarga dari {district} hingga {nearby1}, termasuk kes pasca-pembedahan, penjagaan warga emas jangka panjang, dan pesakit terlantar yang memerlukan tilam anti-decubitus. Setiap penghantaran termasuk pemasangan di rumah, latihan penggunaan dan sokongan susulan melalui WhatsApp. Tempoh sewa bulanan fleksibel — teruskan selama diperlukan, dan kami ambil balik katil bila tempoh tamat.',
  ],
  en: [
    'Home care in {city} cannot wait. Katil Hospital 24 Jam delivers manual, electric, and anti-decubitus hospital beds directly to your home around {district}, usually within 24 hours of a confirmed WhatsApp order. Families near {hospital} and {nearby1} often need a bed right after discharge — which is why we include free setup, flexible monthly rental or outright purchase, and after-delivery support for any technical questions. Whether it is for an elderly parent in {city} or a post-surgery recovery in {nearby2}, our team is on standby 24 hours a day.',
    'In {city}, families caring for patients at home often need a hospital bed that can be delivered quickly, without red tape. Katil Hospital 24 Jam fills that gap — manual 1- and 2-function beds, electric 3-function beds, hospital-grade foam mattresses, and anti-decubitus air mattresses, all delivered, assembled, and explained in a single visit. From {district} through to the {nearby1} area, we consistently cover monthly rentals and direct purchases. Message us on WhatsApp — quotation, delivery window, and payment link all come through in one conversation.',
    'When a patient is discharged from {hospital} back home to {city}, families usually have less than 24 hours to prepare the room and equipment. Katil Hospital 24 Jam handles the equipment side — we deliver the bed and mattress to your home in {district}, fit locking wheels and side rails, and walk you through the remote or air pump. Families in {nearby1} and {nearby2} have already been using our service since last year. Monthly rental and outright purchase are both available — WhatsApp us and have a quote in minutes.',
    'For residents of {city} who need a hospital bed at home, Katil Hospital 24 Jam offers a complete range with 24-hour delivery across {state}. We serve families from {district} out to {nearby1}, including post-surgery cases, long-term elderly care, and bedridden patients who need an anti-decubitus mattress. Every delivery includes on-site setup, usage training, and WhatsApp follow-up support. Monthly rental terms are flexible — extend as long as needed, and we collect the bed once the rental ends.',
  ],
  zh: [
    '{city} 的居家照护无法等待。Katil Hospital 24 Jam 将手动病床、电动病床及防褥疮气垫床直接送到您在 {district} 的家中，通常在 WhatsApp 确认订单后24小时内完成。{hospital} 与 {nearby1} 附近的家庭在病患出院后往往急需病床 — 因此我们免费上门安装，提供灵活的月租或直接购买方案，并在送达后继续提供技术咨询。无论是 {city} 的长者照护，还是 {nearby2} 的术后恢复，我们的团队全天候随时待命。',
    '{city} 的照护家庭常常需要一张能快速送达、流程简单的病床。Katil Hospital 24 Jam 正好填补这一需求 — 手动单功能和双功能病床、三功能电动病床、医院级泡沫床垫以及防褥疮气垫床，一次上门全部送到、安装好并详细讲解。从 {district} 到 {nearby1} 一带，我们稳定提供月租及直购服务。WhatsApp 联系我们 — 报价、送货时段与付款链接都在一次对话中完成。',
    '当病患从 {hospital} 出院回到 {city} 家中时，家人通常只有不到24小时的时间准备病房与设备。Katil Hospital 24 Jam 负责设备部分 — 我们将病床和床垫送到您在 {district} 的家，装上可锁定的轮子与侧栏，并演示遥控器或气垫泵的使用。{nearby1} 与 {nearby2} 的家庭去年起便已在使用我们的服务。可选择月租或直接购买 — 透过 WhatsApp 联系，几分钟内即可取得报价。',
    '为 {city} 需要居家病床的住户，Katil Hospital 24 Jam 提供完整方案，并覆盖整个 {state} 的24小时送货服务。服务范围由 {district} 延伸至 {nearby1}，包括术后照护、长期长者看护以及需要防褥疮床垫的卧床病患。每次送货都包含现场安装、使用培训及后续 WhatsApp 支持。月租期限灵活 — 可按需延长，租期结束时我们上门回收。',
  ],
};

export function getLocationIntro(
  slug: string,
  stateKey: string,
  locale: Locale | string
): string {
  const bank = INTRO_SHELLS[locale as Locale] ?? INTRO_SHELLS.ms;
  const tpl = pick(slug, bank, 0);
  const loc = locations.find((l) => l.slug === slug);
  const city = loc?.name ?? slug;
  const fact = getLocalFact(slug);
  const nearby = getNearbyLocations(slug, 2);
  const nearby1 = nearby[0]?.name ?? city;
  const nearby2 = nearby[1]?.name ?? city;
  return tpl
    .replace(/\{city\}/g, city)
    .replace(/\{state\}/g, stateName(stateKey, locale))
    .replace(/\{hospital\}/g, fact.hospital)
    .replace(/\{district\}/g, fact.district)
    .replace(/\{nearby1\}/g, nearby1)
    .replace(/\{nearby2\}/g, nearby2);
}

/** Location-unique FAQ variants (pool of 4; picked 2 per city via hash offset). */
const UNIQUE_FAQS: Record<Locale, { q: string; a: string }[]> = {
  ms: [
    {
      q: 'Adakah kawasan {city} dilindungi oleh penghantaran 24 jam?',
      a: 'Ya. {city} adalah salah satu daripada 159 bandar yang dilindungi oleh perkhidmatan penghantaran 24 jam kami. Tempahan yang disahkan sebelum tengah hari selalunya sampai pada hari yang sama di kawasan {district}.',
    },
    {
      q: 'Bolehkah kami sewa katil hospital untuk pesakit di {city} hanya untuk 1 bulan?',
      a: 'Boleh. Minimum sewa adalah 1 bulan dan anda boleh lanjut bila-bila masa. Ramai keluarga di {city} mula dengan sebulan untuk menilai keperluan penjagaan sebelum memanjangkan sewa atau membeli.',
    },
    {
      q: 'Adakah pasukan anda masuk ke rumah tingkat atas di {city}?',
      a: 'Ya, kami hantar dan pasang katil di tingkat atas rumah anda di {city} tanpa caj tambahan. Beritahu kami di WhatsApp jika rumah anda mempunyai tangga sempit atau lif supaya kami boleh bawa alat yang sesuai.',
    },
    {
      q: 'Apakah pilihan terbaik untuk pesakit terlantar di {city}?',
      a: 'Untuk pesakit terlantar jangka panjang di {city}, kami cadangkan pakej katil elektrik 3-fungsi dengan tilam angin anti-decubitus. Gabungan ini mengurangkan risiko kudis katil dan memudahkan penjagaan harian di rumah.',
    },
  ],
  en: [
    {
      q: 'Is {city} covered by your 24-hour delivery?',
      a: 'Yes. {city} is one of 159 towns covered by our 24-hour delivery service. Orders confirmed before midday are often delivered the same day around the {district} area.',
    },
    {
      q: 'Can we rent a hospital bed for a patient in {city} for only 1 month?',
      a: 'Yes. The minimum rental period is 1 month and you can extend anytime. Many families in {city} start with a single month to assess the care needs before extending the rental or buying outright.',
    },
    {
      q: 'Does your team deliver to upstairs rooms in {city}?',
      a: 'Yes, we deliver and set up the bed on upper floors of your home in {city} at no extra charge. Let us know on WhatsApp if your house has narrow stairs or a lift so we bring the right gear.',
    },
    {
      q: 'What is the best option for bedridden patients in {city}?',
      a: 'For long-term bedridden patients in {city}, we recommend the 3-function electric bed together with an anti-decubitus air mattress. The combination reduces the risk of bed sores and makes daily home care much easier.',
    },
  ],
  zh: [
    {
      q: '{city} 在24小时送货范围内吗？',
      a: '是的。{city} 是我们24小时送货服务覆盖的159个城镇之一。中午前确认的订单，通常当天就能送达 {district} 一带。',
    },
    {
      q: '可以在 {city} 为病患只租用病床1个月吗？',
      a: '可以。最短租期为1个月，随时可续租。{city} 的许多家庭都是先租一个月，评估照护需求后再决定继续租用或直接购买。',
    },
    {
      q: '你们的团队会送到 {city} 楼上房间吗？',
      a: '会的。我们免费为 {city} 的住户将病床送到楼上并安装。如果您家中楼梯较窄或有电梯，请在 WhatsApp 告知我们，以便准备合适的搬运工具。',
    },
    {
      q: '{city} 的长期卧床患者最适合哪一款？',
      a: '对于 {city} 长期卧床的患者，我们推荐三功能电动病床搭配防褥疮气垫床。这种组合可降低褥疮风险，也让日常居家照护更加轻松。',
    },
  ],
};

/** Pick 2 unique FAQs for a given city (deterministic). */
export function getLocationFAQ(
  slug: string,
  _stateKey: string,
  locale: Locale | string
): { q: string; a: string }[] {
  const bank = UNIQUE_FAQS[locale as Locale] ?? UNIQUE_FAQS.ms;
  const loc = locations.find((l) => l.slug === slug);
  const city = loc?.name ?? slug;
  const fact = getLocalFact(slug);
  const one = pick(slug, bank, 10);
  let two = pick(slug, bank, 11);
  if (two === one) {
    two = bank[(bank.indexOf(one) + 1) % bank.length];
  }
  return [one, two].map((f) => ({
    q: f.q.replace(/\{city\}/g, city),
    a: f.a
      .replace(/\{city\}/g, city)
      .replace(/\{district\}/g, fact.district)
      .replace(/\{hospital\}/g, fact.hospital),
  }));
}

/** Meta title (≤60 chars target). Short form for long city names. */
export function getLocationMetaTitle(
  slug: string,
  _city: string,
  locale: Locale | string
): string {
  const loc = locations.find((l) => l.slug === slug);
  const city = loc?.name ?? slug;
  const long = city.length > 14;
  if (locale === 'en') {
    return long
      ? `Hospital Bed Rental ${city} — 24h`
      : `Hospital Bed Rental in ${city} — 24-Hour Delivery`;
  }
  if (locale === 'zh') {
    return `${city} 病床租用 — 24小时送达`;
  }
  return long
    ? `Sewa Katil Hospital ${city} — 24 Jam`
    : `Sewa Katil Hospital ${city} — 24 Jam Malaysia`;
}

/** Meta description — applies rotating USP token and state/city. */
export function getLocationMetaDescription(
  slug: string,
  _city: string,
  locale: Locale | string
): string {
  const loc = locations.find((l) => l.slug === slug);
  const city = loc?.name ?? slug;
  const state = stateName(loc?.state ?? '', locale);
  const usp = getMetaUSP(slug, locale);
  if (locale === 'en') {
    return `Rent or buy a hospital bed in ${city}, ${state} with ${usp}. Manual, electric, and anti-decubitus options — order via WhatsApp.`;
  }
  if (locale === 'zh') {
    return `在${city}（${state}）租用或购买医院病床，${usp}。手动、电动及防褥疮选项 — 透过 WhatsApp 下单。`;
  }
  return `Sewa atau beli katil hospital di ${city}, ${state} dengan ${usp}. Pilihan manual, elektrik dan tilam anti-decubitus — tempah melalui WhatsApp.`;
}
