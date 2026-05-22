import { LOCATIONS, type LocationEntry, findLocation } from '@/config/locations'
import type { Locale } from '@/config/site'

export interface LocationCopy {
  intro: string
  whyPoints: string[]
  faqs: Array<{ q: string; a: string }>
  closing: string
}

// Hash-based deterministic copy variant picker. Each city receives one of 4
// prose variants per section, seeded by the slug — so neighbours don't
// duplicate. Plus a 10-item FAQ pool rotated by hash, picking 5 per page.

function hash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h
}

function rotate<T>(arr: T[], n: number): T[] {
  const k = n % arr.length
  return arr.slice(k).concat(arr.slice(0, k))
}

function pickVariant<T>(slug: string, salt: number, variants: T[]): T {
  return variants[(hash(slug) + salt) % variants.length]
}

function joinNearby(loc: LocationEntry, locale: Locale): string {
  return loc.nearby
    .map((s) => findLocation(s)?.display[locale] ?? s)
    .slice(0, 4)
    .join(', ')
}

/* ----------- EN intro variants ----------- */
const INTRO_EN = (city: string, nearby: string): string[] => [
  `${city} is one of the strongest demand pockets we install in every week — from cosy living-room TV feature walls to office reception lobbies and home studios. Our installers know the buildings, the lift lobbies and the parking around ${city}, so the crew arrives on time and finishes without drama. Whether you want a warm Wood Wall Panel behind your sofa, a Fluted Wall Panel framing the bed, a humidity-proof PVC Wall Panel in the kitchen yard, an Acoustic Wall Panel for your work-from-home studio, or a luxe Marble Wall Panel behind the reception desk — from RM25/sqft with free installation. We also install panels in nearby areas like ${nearby} from the same operations base, so coverage across ${city} and its surrounds is seamless.`,
  `If you're looking to transform a wall in ${city} without the headache of a full renovation, this is the simplest brief on the table. We bring real panel samples to your address, take exact measurements under your actual lighting, send a clean PDF quote with the promo price locked in, and install with hidden-clip mounting in 3 to 7 days. Standard finishes (Wood, Fluted, PVC, Acoustic) start from RM25/sqft. Marble finishes (Gold, Silver, Black) start from RM38/sqft. Free installation is included — no "labour from RM" surprises at the end. We also serve ${nearby} from the same Klang-Valley-based crew.`,
  `${city} homeowners and office owners increasingly want the magazine-finish wall without the mess of carpentry and paint. That's exactly what we deliver. Our 12mm pre-finished wall panels mount on hidden clips so there are no visible screws, install in a single visit for most rooms, and come with a written workmanship warranty. Five styles cover every brief: Wood for warmth, Fluted for rhythm, PVC for humid spaces, Acoustic for studios and meeting rooms, Marble for luxury feature walls. Installations across ${city} and surrounding areas like ${nearby} are quoted at the same promo price.`,
  `Wall Panel Malaysia installs across ${city} on a same-week schedule — we'll WhatsApp confirm a measurement slot within the day, arrive with real samples, and leave you with a written quote that already includes installation. The promo runs at RM25/sqft for Wood, Fluted, PVC and Acoustic, and RM38/sqft for Gold, Silver and Black Marble. Each installation is done by our own full-time crew — never subcontracted — so the same hands that measure your ${city} wall are the hands that finish it. Nearby areas like ${nearby} are covered under the same crew rotation.`,
]

const WHY_EN = (city: string): string[] => [
  `Free installation included in every ${city} quote — no surprise labour fees`,
  `12mm pre-finished panels with hidden-clip mounting — no visible screws on your ${city} wall`,
  `Own full-time installers — never subcontracted to a face you won't see again`,
  `Real samples brought to your ${city} address before you commit`,
  `Written workmanship warranty — if a panel lifts in ${city}, we come back and fix it`,
]

const CLOSING_EN = (city: string): string[] => [
  `Ready to upgrade a wall in ${city}? WhatsApp Wall Panel Malaysia — free measurement, free quote, free installation, locked at promo pricing.`,
  `Let's lock in your ${city} feature wall at promo pricing. One WhatsApp message, one team, one premium result.`,
  `Your ${city} feature wall is one WhatsApp message away. Free measurement, free quote, free installation.`,
  `Get your ${city} wall panel installed at promo pricing — WhatsApp us a photo of the wall and we'll do the rest.`,
]

const FAQ_POOL_EN = (city: string): Array<{ q: string; a: string }> => [
  {
    q: `How much does wall panel installation cost in ${city}?`,
    a: `In ${city}, Standard Wall Panel finishes (Wood, Fluted, PVC, Acoustic) start from RM25/sqft. Marble Wall Panel finishes (Gold, Silver, Black) start from RM38/sqft. Both include free installation, hidden-clip mounting and clean-up. WhatsApp us your ${city} wall photo for an exact per-sqft estimate the same day.`,
  },
  {
    q: `How quickly can you start installation in ${city}?`,
    a: `For most ${city} addresses we can run a free measurement within 1–3 working days of your WhatsApp. Once the quote is signed, installation starts in 3–7 days. Larger boardrooms or reception jobs in ${city} take a bit longer because we coordinate around your operating hours.`,
  },
  {
    q: `Do you bring real panel samples to ${city} addresses?`,
    a: `Yes — every free measurement visit in ${city} comes with real panel samples for Wood, Fluted, PVC, Acoustic and the Marble range. We hold the samples against your actual wall under your actual lighting so the finish you sign off matches the wall you wake up to.`,
  },
  {
    q: `Is free installation actually free in ${city}, or are there hidden charges?`,
    a: `Free installation is fully included in your per-sqft price in ${city}. No "labour from RM", no surprise transport, no after-hours surcharge. The only extras you might be quoted are major surface repair if the wall needs prep — and we always show those as a separate line so you can decide.`,
  },
  {
    q: `Which wall panel style is most popular in ${city}?`,
    a: `In ${city}, the Wood and Fluted styles are the most-booked finishes for living rooms and bedrooms. PVC sees strong demand in apartments with humid yards. Acoustic is popular among ${city}-based home offices and small studios. Marble Black and Gold lead office reception and boardroom installs.`,
  },
  {
    q: `Do you install wall panels in condos and high-rises in ${city}?`,
    a: `Yes — we install in ${city} condominiums and high-rise apartments regularly. Send us the building name and unit number on WhatsApp. We handle the lift booking, loading-bay coordination, and floor protection so the install day runs cleanly even in strata properties.`,
  },
  {
    q: `Can you mix multiple wall panel styles in one ${city} project?`,
    a: `Absolutely. Many ${city} clients book Wood for the living room, Fluted for the bedroom, and Marble for the entrance feature wall in the same project. We quote each room separately at the promo per-sqft price and roll them into one written quote.`,
  },
  {
    q: `Do you cover wall panel installation in offices around ${city}?`,
    a: `Yes — office installations are a big part of what we do in ${city}. Boardrooms, reception lobbies, meeting rooms and cabins all install on the same per-sqft promo. We work around your business hours so trading days aren't disrupted, and clean up before leaving.`,
  },
  {
    q: `How long does a wall panel last after installation in ${city}?`,
    a: `With normal indoor use in ${city}, expect 8–10 years on Wood and Marble panels, and longer on PVC and Acoustic. All our panels are 12mm pre-finished and mounted on hidden clips, so they outlast glued installs. A written workmanship warranty covers ${city} installations.`,
  },
  {
    q: `How do I book a free measurement in ${city}?`,
    a: `Just WhatsApp us a photo of the ${city} wall, the rough dimensions and the style you're leaning toward. We confirm a free measurement slot the same day, arrive with real samples, and follow up with a written quote with the promo price locked in.`,
  },
]

/* ----------- MS intro variants ----------- */
const INTRO_MS = (city: string, nearby: string): string[] => [
  `${city} adalah antara kawasan utama yang kami pasang setiap minggu — dari feature wall ruang tamu, dinding TV hangat, sehingga lobi reception pejabat dan studio home office. Installer kami kenal bangunan, lobi lif dan parking di sekitar ${city}, jadi kru sampai tepat masa dan kemas tanpa drama. Sama ada anda mahu Panel Dinding Kayu di belakang sofa, Panel Dinding Fluted di belakang katil, Panel Dinding PVC di laundry yard, Panel Dinding Akustik untuk studio kerja dari rumah, atau Panel Dinding Marmar mewah di reception — dari RM25/sqft termasuk pemasangan percuma. Kawasan berdekatan seperti ${nearby} kami layani dari pangkalan operasi yang sama.`,
  `Jika anda mahu ubah dinding di ${city} tanpa pening renovasi penuh, ini brief paling mudah. Kami bawa sampel sebenar ke alamat anda, ambil ukuran tepat di bawah pencahayaan anda sendiri, hantar PDF sebut harga kemas dengan harga promo terkunci, dan pasang dengan klip tersembunyi dalam 3 hingga 7 hari. Gaya Standard (Kayu, Fluted, PVC, Akustik) dari RM25/sqft. Gaya Marmar (Emas, Perak, Hitam) dari RM38/sqft. Pemasangan percuma termasuk — tiada kejutan "upah dari RM" di hujung. Kami juga layani ${nearby} dari kru yang sama.`,
  `Pemilik rumah dan pejabat di ${city} semakin mahu dinding kemasan macam dalam majalah tanpa kerja tukang kayu dan cat yang berselerak. Itulah yang kami sampaikan. Panel dinding 12mm pra-kemas kami dipasang pada klip tersembunyi jadi tiada skru kelihatan, siap dalam satu lawatan untuk kebanyakan ruang, dan disertai waranti kerja tangan bertulis. Lima gaya tutup setiap brief: Kayu untuk kehangatan, Fluted untuk irama, PVC untuk ruang lembap, Akustik untuk studio, Marmar untuk feature wall mewah. Pemasangan di ${city} dan kawasan sekitar seperti ${nearby} dikenakan harga promo yang sama.`,
  `Wall Panel Malaysia pasang di ${city} ikut jadual mingguan — kami sahkan slot ukuran melalui WhatsApp pada hari yang sama, sampai dengan sampel sebenar, dan tinggalkan sebut harga bertulis yang sudah termasuk pemasangan. Promo berjalan pada RM25/sqft untuk Kayu, Fluted, PVC dan Akustik, dan RM38/sqft untuk Marmar Emas, Perak dan Hitam. Setiap pemasangan dilakukan oleh kru tetap kami sendiri — tidak pernah sub-kontrak — jadi tangan yang ukur dinding ${city} anda adalah tangan yang siapkannya. Kawasan berdekatan seperti ${nearby} ada dalam rotasi kru yang sama.`,
]

const WHY_MS = (city: string): string[] => [
  `Pemasangan percuma termasuk dalam setiap sebut harga ${city} — tiada caj upah kejutan`,
  `Panel 12mm pra-kemas dengan klip tersembunyi — tiada skru kelihatan di dinding ${city} anda`,
  `Installer pekerja tetap sendiri — tidak pernah sub-kontrak`,
  `Sampel sebenar dibawa ke alamat ${city} sebelum anda commit`,
  `Waranti kerja tangan bertulis — jika panel terangkat di ${city}, kami datang dan baiki`,
]

const CLOSING_MS = (city: string): string[] => [
  `Sedia naik taraf dinding di ${city}? WhatsApp Wall Panel Malaysia — ukuran percuma, sebut harga percuma, pemasangan percuma.`,
  `Mari kunci feature wall ${city} anda pada harga promo. Satu mesej WhatsApp, satu pasukan, satu hasil premium.`,
  `Feature wall ${city} anda hanya satu mesej WhatsApp sahaja. Ukuran percuma, sebut harga percuma, pemasangan percuma.`,
  `Pasang panel dinding ${city} anda pada harga promo — WhatsApp kami gambar dinding, kami uruskan selebihnya.`,
]

const FAQ_POOL_MS = (city: string): Array<{ q: string; a: string }> => [
  {
    q: `Berapa harga pemasangan panel dinding di ${city}?`,
    a: `Di ${city}, kemasan Panel Dinding Standard (Kayu, Fluted, PVC, Akustik) bermula RM25/sqft. Kemasan Marmar (Emas, Perak, Hitam) bermula RM38/sqft. Kedua-dua termasuk pemasangan percuma, klip tersembunyi dan kemas. WhatsApp gambar dinding ${city} anda untuk anggaran tepat pada hari yang sama.`,
  },
  {
    q: `Berapa cepat anda boleh mula pemasangan di ${city}?`,
    a: `Untuk kebanyakan alamat ${city}, kami boleh buat ukuran percuma dalam 1–3 hari bekerja selepas WhatsApp anda. Selepas sebut harga ditandatangan, pemasangan mula dalam 3–7 hari. Bilik mesyuarat besar atau reception di ${city} mengambil masa lebih sedikit kerana kami selaras dengan waktu operasi anda.`,
  },
  {
    q: `Adakah anda bawa sampel sebenar ke alamat ${city}?`,
    a: `Ya — setiap lawatan ukuran percuma di ${city} disertakan dengan sampel sebenar untuk Kayu, Fluted, PVC, Akustik dan rangkaian Marmar. Kami pegang sampel pada dinding sebenar di bawah pencahayaan sebenar supaya finishing yang anda pilih sepadan dengan dinding yang anda dapat.`,
  },
  {
    q: `Adakah pemasangan percuma benar-benar percuma di ${city}?`,
    a: `Pemasangan percuma sepenuhnya termasuk dalam harga sekaki persegi anda di ${city}. Tiada "upah dari RM", tiada transport kejutan, tiada surcaj waktu malam. Hanya tambahan yang mungkin disebut harga adalah pembaikan permukaan jika dinding perlu disiapkan dulu — sentiasa ditunjukkan sebagai line berasingan.`,
  },
  {
    q: `Gaya panel dinding mana paling popular di ${city}?`,
    a: `Di ${city}, gaya Kayu dan Fluted adalah pilihan paling popular untuk ruang tamu dan bilik tidur. PVC menerima permintaan kuat dalam apartment dengan laundry yard lembap. Akustik popular di kalangan home office ${city}. Marmar Hitam dan Emas mendahului pemasangan reception dan bilik mesyuarat pejabat.`,
  },
  {
    q: `Adakah anda pasang panel dinding di kondo dan bangunan tinggi di ${city}?`,
    a: `Ya — kami pasang di kondominium dan apartment ${city} secara berkala. Hantar nama bangunan dan nombor unit anda dalam WhatsApp. Kami uruskan tempahan lif, koordinasi loading bay dan perlindungan lantai supaya hari pemasangan berjalan lancar.`,
  },
  {
    q: `Boleh gabungkan beberapa gaya panel dalam satu projek ${city}?`,
    a: `Sudah tentu. Ramai pelanggan ${city} tempah Kayu untuk ruang tamu, Fluted untuk bilik tidur, dan Marmar untuk feature wall pintu masuk dalam projek yang sama. Setiap ruang disebut harga secara berasingan pada harga promo per sqft.`,
  },
  {
    q: `Adakah anda layani pemasangan panel dinding di pejabat ${city}?`,
    a: `Ya — pemasangan pejabat adalah sebahagian besar kerja kami di ${city}. Bilik mesyuarat, lobi reception, bilik perbincangan dan cabin semua dipasang pada promo per sqft yang sama. Kami selaras dengan waktu operasi anda supaya hari berniaga tidak terganggu.`,
  },
  {
    q: `Berapa lama panel dinding tahan di ${city}?`,
    a: `Dengan penggunaan dalam rumah biasa di ${city}, jangka 8–10 tahun untuk panel Kayu dan Marmar, lebih lama untuk PVC dan Akustik. Semua panel kami 12mm pra-kemas dan dipasang pada klip tersembunyi. Waranti kerja tangan bertulis meliputi pemasangan ${city}.`,
  },
  {
    q: `Macam mana saya tempah ukuran percuma di ${city}?`,
    a: `WhatsApp kami gambar dinding ${city}, ukuran kasar dan gaya yang anda minat. Kami sahkan slot ukuran percuma pada hari yang sama, sampai dengan sampel sebenar, dan susul dengan sebut harga bertulis dengan harga promo terkunci.`,
  },
]

/* ----------- ZH intro variants ----------- */
const INTRO_ZH = (city: string, nearby: string): string[] => [
  `${city}是我们每周都在安装的重点区域 — 从舒适的客厅电视主墙、办公室前台大堂到居家工作室。我们的安装团队熟悉${city}的楼宇、电梯口与停车位,因此团队准时到达、干净利落地完工。无论您想要沙发后方的温暖木纹墙板、床头的凹槽墙板、厨房旁的防潮 PVC 墙板、居家办公室的隔音墙板,还是前台后方的奢华大理石墙板 — RM25/sqft 起,含免费安装。${nearby}等邻近地区同样从同一基地覆盖。`,
  `如果您想在${city}改造一面墙却不想经历整套装修的麻烦,这就是最简单的方案。我们带真实样品到您的地址,在您实际照明下精确量度,发送清晰的 PDF 报价(促销价锁定),并以隐藏卡扣方式在 3 至 7 天内完成安装。标准饰面(木纹、凹槽、PVC、隔音)RM25/sqft 起。大理石饰面(金、银、黑)RM38/sqft 起。免费安装包含 — 项目结尾绝无"工费起价"的意外。我们同样从同一团队服务${nearby}。`,
  `${city}的家居与办公室客户越来越希望拥有杂志级的墙面,却不想经历木工与油漆的混乱。这正是我们提供的体验。12mm 预饰面墙板通过隐藏卡扣固定,表面无可见螺丝,多数房间一次性完工,并附书面施工保修。五大风格覆盖每一种需求:木纹用于温暖、凹槽用于节奏感、PVC 用于潮湿空间、隔音用于工作室与会议室、大理石用于豪华主墙。${city}及${nearby}等周边地区均以同一促销价计算。`,
  `Wall Panel Malaysia 按周计划服务${city} — 我们当天通过 WhatsApp 确认量度档期,带真实样品上门,并留下已包含安装费的书面报价。促销价格为木纹、凹槽、PVC 与隔音 RM25/sqft 起,金色、银色与黑色大理石 RM38/sqft 起。每一次安装均由我们的自家全职团队完成 — 绝不外包 — 因此为您${city}墙面量度的双手,也是完工的双手。${nearby}等邻近地区在同一团队轮班内覆盖。`,
]

const WHY_ZH = (city: string): string[] => [
  `${city}每份报价均含免费安装 — 无意外工费`,
  `12mm 预饰面墙板配隐藏卡扣 — ${city}墙面无可见螺丝`,
  `自家全职安装团队 — 绝不外包`,
  `承诺前先将真实样品送达${city}地址`,
  `书面施工保修 — ${city}墙板翘起,我们上门修复`,
]

const CLOSING_ZH = (city: string): string[] => [
  `准备升级${city}的墙面?WhatsApp Wall Panel Malaysia — 免费量度、免费报价、免费安装。`,
  `让我们以促销价锁定您的${city}主墙。一条 WhatsApp 信息、一支团队、一个高端成果。`,
  `您的${city}主墙距离一条 WhatsApp 仅一步之遥。免费量度、免费报价、免费安装。`,
  `以促销价完成${city}的墙板安装 — WhatsApp 发送墙面照片,其余交给我们。`,
]

const FAQ_POOL_ZH = (city: string): Array<{ q: string; a: string }> => [
  {
    q: `${city}墙板安装价格多少?`,
    a: `${city}标准墙板饰面(木纹、凹槽、PVC、隔音)RM25/sqft 起。大理石饰面(金、银、黑)RM38/sqft 起。均含免费安装、隐藏卡扣安装与现场清理。WhatsApp 发送您的${city}墙面照片,当天获取精确每平方尺估价。`,
  },
  {
    q: `多快可以开始${city}的安装?`,
    a: `${city}多数地址在 WhatsApp 联系后 1–3 个工作日内可完成免费量度。报价签署后,3–7 天内开始安装。${city}大型会议室或前台项目需更长时间以配合您的营业时间。`,
  },
  {
    q: `${city}地址是否提供真实样品?`,
    a: `是的 — ${city}每次免费量度均携带木纹、凹槽、PVC、隔音与大理石系列的真实样品。我们将样品贴在您实际墙面、实际照明下,以确保签署的饰面与最终墙面一致。`,
  },
  {
    q: `${city}的免费安装是真免费吗?`,
    a: `免费安装已完全包含在${city}每平方尺价格中。没有"工费起价",没有意外运输费,没有加班附加费。唯一可能额外报价的是墙面修复(若现有墙面需先处理) — 这些始终作为单独项目列出。`,
  },
  {
    q: `${city}最受欢迎的墙板风格?`,
    a: `${city}木纹与凹槽风格是客厅与卧室最常预订的饰面。PVC 在带潮湿洗衣区的公寓中需求强劲。隔音在${city}的居家办公室中很受欢迎。黑色与金色大理石主导办公室前台与会议室安装。`,
  },
  {
    q: `${city}的公寓与高层楼宇也能安装吗?`,
    a: `可以 — 我们定期在${city}的公寓与高层楼宇内安装。WhatsApp 告知楼宇名称与单位号。我们处理电梯预订、装卸区协调与楼层保护,确保安装日顺畅。`,
  },
  {
    q: `一个${city}项目可以混合多种墙板风格吗?`,
    a: `当然可以。许多${city}客户在同一项目中,在客厅安装木纹、卧室凹槽、入口主墙大理石。每个房间以促销每平方尺价单独报价,并整合为一份书面报价。`,
  },
  {
    q: `你们覆盖${city}办公室墙板安装吗?`,
    a: `是的 — 办公室安装是我们在${city}很大的一部分业务。会议室、前台大堂、会议厅与卡座均以同一促销每平方尺价安装。我们配合您的营业时间,避免影响经营。`,
  },
  {
    q: `${city}的墙板能用多久?`,
    a: `在${city}正常室内使用下,木纹与大理石墙板预期寿命 8–10 年,PVC 与隔音墙板更久。所有墙板均为 12mm 预饰面、隐藏卡扣安装。书面施工保修覆盖${city}的安装。`,
  },
  {
    q: `如何预约${city}的免费量度?`,
    a: `只需 WhatsApp 发送${city}墙面照片、大致尺寸与您倾向的风格。我们当天确认免费量度档期,带真实样品上门,并附上锁定促销价的书面报价。`,
  },
]

function pickFaqs(
  pool: Array<{ q: string; a: string }>,
  seed: number,
): Array<{ q: string; a: string }> {
  return rotate(pool, seed).slice(0, 5)
}

export function getLocationCopy(locale: Locale, slug: string): LocationCopy {
  const loc = findLocation(slug)
  if (!loc) {
    return { intro: '', whyPoints: [], faqs: [], closing: '' }
  }
  const city = loc.display[locale]
  const nearbyList = joinNearby(loc, locale)
  const seed = hash(slug)

  if (locale === 'ms') {
    return {
      intro: pickVariant(slug, 0, INTRO_MS(city, nearbyList)),
      whyPoints: WHY_MS(city),
      faqs: pickFaqs(FAQ_POOL_MS(city), seed),
      closing: pickVariant(slug, 7, CLOSING_MS(city)),
    }
  }

  if (locale === 'zh') {
    return {
      intro: pickVariant(slug, 0, INTRO_ZH(city, nearbyList)),
      whyPoints: WHY_ZH(city),
      faqs: pickFaqs(FAQ_POOL_ZH(city), seed),
      closing: pickVariant(slug, 7, CLOSING_ZH(city)),
    }
  }

  // en default
  return {
    intro: pickVariant(slug, 0, INTRO_EN(city, nearbyList)),
    whyPoints: WHY_EN(city),
    faqs: pickFaqs(FAQ_POOL_EN(city), seed),
    closing: pickVariant(slug, 7, CLOSING_EN(city)),
  }
}

export { LOCATIONS }
