import { LOCATIONS, type LocationEntry, findLocation } from '@/config/locations'
import type { Locale } from '@/config/site'

export interface LocationCopy {
  intro: string
  whyPoints: string[]
  faqs: Array<{ q: string; a: string }>
  closing: string
}

// Template-based location copy generator. Each city gets a unique intro
// because the city name and nearby neighbours are interpolated, plus a
// unique FAQ set rotated from a 10-item pool (seeded by slug hash).
//
// This produces materially different copy per (locale, slug) while
// scaling to all 114 combinations without hand-authoring every block.

function hash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h
}

function rotate<T>(arr: T[], n: number): T[] {
  const k = n % arr.length
  return arr.slice(k).concat(arr.slice(0, k))
}

function joinNearby(loc: LocationEntry, locale: Locale): string {
  return loc.nearby
    .map((s) => findLocation(s)?.display[locale] ?? s)
    .slice(0, 4)
    .join(', ')
}

const FAQ_POOL_EN = (city: string): Array<{ q: string; a: string }> => [
  {
    q: `Which suburbs in ${city} do you deliver to?`,
    a: `We deliver same-day to every part of ${city} and its immediate surrounds. Our crew knows the main kenduri roads, community halls and kampung alleys — tell us the address and we'll confirm coverage in minutes on WhatsApp.`,
  },
  {
    q: `What is the same-day cutoff time for ${city} orders?`,
    a: `For same-day delivery in ${city}, please WhatsApp us before 1 pm. Orders confirmed later usually still go out the same afternoon, but we cannot guarantee the time window without checking lorry availability.`,
  },
  {
    q: `Is there a minimum order for ${city}?`,
    a: `For outstation ${city} deliveries our minimum is 50 chairs or one full canopy package. Within Klang Valley we're more flexible — WhatsApp your numbers and we'll let you know what works.`,
  },
  {
    q: `Is the deposit refundable if my ${city} kenduri is cancelled?`,
    a: `Yes. Cancellations made at least 72 hours before the event are fully refunded minus a small admin fee. We send a written quote first so there are no surprises.`,
  },
  {
    q: `Do you set up chairs and tables on-site in ${city}?`,
    a: `Yes — our ${city} crew unloads and arranges every chair and table exactly where you want them, stacks covers, lines up rows, and returns after your majlis to collect. You don't lift a single chair.`,
  },
  {
    q: `Are chiavari chairs available for ${city} weddings?`,
    a: `Both solid and transparent chiavari chairs are stocked and can be delivered to ${city}. We often pair the transparent chiavari with a gold pelamin backdrop — WhatsApp us for a styling suggestion.`,
  },
  {
    q: `Can I combine canopy, chairs and tables into one ${city} package?`,
    a: `Absolutely — most ${city} backyard kenduri clients book a combined canopy + chairs + tables + fans package. We quote one flat price and send one lorry, keeping your setup day simple.`,
  },
  {
    q: `Do you deliver to apartment or condo halls in ${city}?`,
    a: `Yes, we deliver to condo function rooms and apartment community halls in ${city}. Let us know the block, floor and loading bay details so the crew can plan the fastest route in.`,
  },
  {
    q: `Is PA system rental available in ${city}?`,
    a: `Yes — full PA system with microphone and speakers is available for ${city} events, perfect for MC, nasyid and akad nikah. Bundle it with chairs and tables for one clean delivery.`,
  },
  {
    q: `How far in advance should I book for weekend events in ${city}?`,
    a: `Weekend slots in ${city} fill up fast during wedding season. Book 2–3 weeks ahead for peak months and 3–5 days ahead off-peak. Last-minute WhatsApp us — we often still have stock.`,
  },
]

const FAQ_POOL_MS = (city: string): Array<{ q: string; a: string }> => [
  {
    q: `Kawasan mana di ${city} yang anda hantar?`,
    a: `Kami hantar sama hari ke setiap kawasan ${city} dan kawasan sekitarnya. Kru kami kenal jalan utama kenduri, dewan komuniti dan lorong kampung — beri alamat, kami sahkan dalam beberapa minit di WhatsApp.`,
  },
  {
    q: `Apakah waktu cutoff sama hari untuk tempahan ${city}?`,
    a: `Untuk penghantaran sama hari di ${city}, sila WhatsApp sebelum jam 1 petang. Tempahan selepas itu biasanya masih boleh keluar petang yang sama, tetapi slot masa tidak dapat dijamin.`,
  },
  {
    q: `Ada tempahan minimum untuk ${city}?`,
    a: `Untuk penghantaran luar kawasan ${city} minimum 50 kerusi atau satu pakej khemah penuh. Dalam Lembah Klang kami lebih fleksibel — WhatsApp jumlah tetamu anda.`,
  },
  {
    q: `Deposit boleh dikembalikan jika kenduri ${city} dibatalkan?`,
    a: `Boleh. Pembatalan 72 jam sebelum majlis dibayar balik sepenuhnya tolak caj admin kecil. Kami hantar sebutharga bertulis supaya tiada kejutan.`,
  },
  {
    q: `Adakah anda pasang kerusi dan meja di venue ${city}?`,
    a: `Ya — kru ${city} akan punggah dan susun setiap kerusi dan meja di mana sahaja anda mahu, susun sarung, atur baris, dan datang semula selepas majlis untuk kutip. Anda tak angkat apa-apa.`,
  },
  {
    q: `Adakah kerusi chiavari tersedia untuk majlis ${city}?`,
    a: `Kerusi chiavari solid dan transparent ada dan boleh dihantar ke ${city}. Kami selalu cadangkan chiavari transparent dengan backdrop pelamin emas — WhatsApp untuk idea styling.`,
  },
  {
    q: `Boleh gabungkan khemah, kerusi dan meja dalam satu pakej ${city}?`,
    a: `Boleh — kebanyakan pelanggan kenduri belakang rumah di ${city} tempah pakej gabungan khemah, kerusi, meja dan kipas. Satu harga flat, satu lori, hari setup anda mudah.`,
  },
  {
    q: `Hantar ke dewan apartment atau kondo di ${city}?`,
    a: `Ya, kami hantar ke bilik function kondo dan dewan komuniti apartment di ${city}. Beritahu blok, tingkat dan loading bay supaya kru plan laluan terpantas.`,
  },
  {
    q: `Ada sewa PA system di ${city}?`,
    a: `Ya — PA system lengkap dengan mikrofon dan speaker tersedia untuk majlis ${city}, sesuai untuk MC, nasyid dan akad nikah. Gabungkan dengan kerusi dan meja untuk satu penghantaran bersih.`,
  },
  {
    q: `Berapa awal patut tempah untuk majlis hujung minggu di ${city}?`,
    a: `Slot hujung minggu di ${city} cepat penuh masa musim kahwin. Tempah 2–3 minggu awal masa peak, 3–5 hari awal masa off-peak. Saat akhir pun WhatsApp — selalu ada stok.`,
  },
]

const FAQ_POOL_ZH = (city: string): Array<{ q: string; a: string }> => [
  {
    q: `${city}哪些区域可以送货？`,
    a: `我们当天送达${city}所有区域及周边地带。团队熟悉主要宴会路线、社区礼堂和乡村巷弄——告诉我们地址，几分钟内即可在 WhatsApp 上确认。`,
  },
  {
    q: `${city}订单的当天送达截止时间是什么时候？`,
    a: `${city}当天送达请在下午 1 点前 WhatsApp 我们。之后确认的订单通常仍可当天下午送出，但无法保证具体时段，需视卡车情况而定。`,
  },
  {
    q: `${city}有最低订量吗？`,
    a: `${city}外州送货最低 50 张椅子或一个完整帐篷套餐。巴生谷内更灵活 — WhatsApp 告诉我们宾客人数即可。`,
  },
  {
    q: `${city}宴会取消时押金可退吗？`,
    a: `可以。活动前至少 72 小时取消可全额退款，扣除小额行政费。我们付款前先发书面报价，绝无隐藏费用。`,
  },
  {
    q: `你们会在${city}活动现场布置桌椅吗？`,
    a: `会的 — ${city}团队会在您指定的位置卸货、摆放每一张桌椅、堆叠椅套、排列座位，宴会结束后再回来回收。您无需动手。`,
  },
  {
    q: `${city}婚礼可以租 Chiavari 椅吗？`,
    a: `实心与透明 Chiavari 椅均有库存，可送达${city}。常推荐透明 Chiavari 椅搭配金色舞台背景 — WhatsApp 我们获取造型建议。`,
  },
  {
    q: `可以把帐篷、椅子、桌子合并成一个${city}套餐吗？`,
    a: `可以 — 大多数${city}后院宴会客户都会预订帐篷、椅子、桌子和风扇的组合套餐。一个统一价格、一辆卡车，让您的布置日轻松无忧。`,
  },
  {
    q: `${city}的公寓或共管楼宇礼堂可以送货吗？`,
    a: `可以，我们为${city}的共管楼宇活动室和公寓社区礼堂提供送货。请告诉我们区块、楼层和装卸区信息，以便团队规划最快路线。`,
  },
  {
    q: `${city}可以租音响系统吗？`,
    a: `可以 — ${city}活动提供完整音响系统（含麦克风与音箱），适合 MC、诵经与婚礼仪式。搭配桌椅一次送达更省心。`,
  },
  {
    q: `${city}周末活动应该提前多久预订？`,
    a: `${city}周末档期在婚宴季节很快满位。旺季提前 2–3 周，淡季提前 3–5 天。临时情况也欢迎 WhatsApp — 通常仍有库存。`,
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
    const city0 = city
    return {
      intro: `${city0} adalah antara kawasan utama yang Kak Kenduri layani setiap minggu — dari kenduri belakang rumah, majlis perkahwinan di dewan komuniti, sehingga dinner korporat. Kru kami kenal jalan, dewan dan kampung sekitar ${city0}, dan lori kami sampai tepat pada masa. Sama ada anda perlu 50 kerusi banquet atau satu pakej khemah penuh dengan meja bulat dan kipas industri, kami boleh susun dan hantar ke alamat ${city0} anda pada hari yang sama anda WhatsApp kami. Kawasan berdekatan seperti ${nearbyList} juga kami layani dari pangkalan operasi yang sama — sewa meja dan kerusi di ${city0} tak perlu rumit.`,
      whyPoints: [
        `Hantar sama hari ke seluruh ${city0} sebelum 6 petang`,
        `15,000+ kerusi dalam stok termasuk banquet, chiavari dan standard`,
        `Kru pasang dan kutip balik — anda tak angkat satu kerusi pun`,
        `Tempahan WhatsApp, sebutharga bertulis, deposit boleh dikembalikan`,
        `Gabung pakej khemah + meja + kerusi + kipas untuk ${city0}`,
      ],
      faqs: pickFaqs(FAQ_POOL_MS(city0), seed),
      closing: `Mari aturkan majlis ${city0} anda dengan betul. WhatsApp Kak Kenduri sekarang untuk sewa kerusi dan meja sama hari di seluruh ${city0}.`,
    }
  }

  if (locale === 'zh') {
    return {
      intro: `${city}是 Kak Kenduri 每周都在服务的重要地区 — 从后院宴会、社区礼堂婚礼到企业晚宴。我们的团队熟悉${city}周边的道路、礼堂与乡村，卡车准时送达。无论您需要 50 张宴会椅还是一个包含圆桌和工业风扇的完整帐篷套餐，我们都能在您 WhatsApp 下单后当天送达您的${city}地址。${nearbyList}等邻近地区同样从同一营运基地覆盖 — 在${city}租赁桌椅其实并不复杂。`,
      whyPoints: [
        `当天送达${city}全区，晚上 6 点前抵达`,
        `15,000+ 张椅子库存，包括宴会椅、Chiavari 椅与标准椅`,
        `团队负责布置与回收 — 您无需搬动一张椅子`,
        `WhatsApp 下单、书面报价、可退还订金`,
        `${city}可组合帐篷 + 桌 + 椅 + 风扇套餐`,
      ],
      faqs: pickFaqs(FAQ_POOL_ZH(city), seed),
      closing: `让我们为您的${city}宴会妥善安排座位。立即 WhatsApp Kak Kenduri，在${city}全区享受当天桌椅租赁送达。`,
    }
  }

  // en default
  return {
    intro: `${city} is one of the areas Kak Kenduri serves every single week — from backyard kenduri and community hall weddings to corporate dinners. Our crew knows the streets, halls and kampung around ${city}, and our lorries arrive exactly when we say they will. Whether you need 50 banquet chairs or a full canopy package with round tables and industrial fans, we can set it up and deliver to your ${city} address the same day you WhatsApp us. We also cover nearby areas like ${nearbyList} from the same operations base — table and chair rental in ${city} really doesn't need to be complicated.`,
    whyPoints: [
      `Same-day delivery across ${city} before 6 pm`,
      `15,000+ chairs in stock — banquet, chiavari and standard`,
      `Crew sets up and packs down — you never lift a chair`,
      `WhatsApp booking, written quote, refundable deposit`,
      `Combined canopy + table + chair + fan package available for ${city}`,
    ],
    faqs: pickFaqs(FAQ_POOL_EN(city), seed),
    closing: `Let's get your ${city} majlis seated properly. WhatsApp Kak Kenduri now for same-day chair and table rental anywhere in ${city}.`,
  }
}

export { LOCATIONS }
