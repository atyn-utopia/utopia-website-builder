import { cityDisplay } from '@/config/locations'

export interface LocationCopy {
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  whyPoints: string[]
  faqs: Array<{ q: string; a: string }>
  closingCta: string
}

type L = 'ms' | 'en' | 'zh'

/**
 * Templated location copy. Every city gets its display name injected in every
 * visible string, so SEO uniqueness is driven by the city token appearing in
 * headings, FAQs, and intro paragraphs. The templates differ meaningfully per
 * locale (tone + phrasing) rather than duplicating English copy.
 *
 * For launch this is enough to populate 48 location pages; hand-tuned blocks
 * from copy-locations.md can be slotted in later as overrides.
 */

const templates: Record<L, (city: string) => LocationCopy> = {
  ms: (city) => ({
    h1: `Cat Rumah ${city} — Dari RM3.50/sqft`,
    metaTitle: `Cat Rumah ${city} | Dari RM3.50/sqft`,
    metaDescription: `Servis cat rumah ${city} dari RM3.50/sqft. Cat dinding, luar, siling & epoxy. Nippon, Jotun, Dulux. Quote percuma — WhatsApp sekarang!`,
    intro: `Pasukan Cat Rumah Malaysia sudah cat ratusan rumah di sekitar ${city}. Kami faham keperluan pemilik rumah di ${city} — dari rumah teres lama hingga banglo gated moden. Kami gunakan cat premium Nippon Paint, Jotun dan Dulux, dengan harga tetap yang jelas selepas lawatan tapak percuma. Tiada caj tersembunyi, tiada jual tekan.`,
    whyPoints: [
      `Pasukan pengalaman kerja di ${city} — tahu jenis rumah dan cuaca tempatan.`,
      `Guna Nippon Weatherbond / Jotun Jotashield tahan cuaca ${city}.`,
      `Siap cepat — sepantas 5 jam untuk kerja kecil di ${city}.`,
      `Quote tetap selepas lawatan tapak — tiada kos tambahan.`,
    ],
    faqs: [
      { q: `Berapa harga cat rumah di ${city}?`, a: `Kami mula dari RM3.50/sqft di ${city} untuk cat dinding dalaman Nippon Paint. Harga termasuk tenaga kerja, tutup lantai dan pembersihan selepas siap.` },
      { q: `Berapa lama kerja cat rumah ambil masa di ${city}?`, a: `Untuk bilik tunggal di ${city}, kerja boleh siap dalam sepantas 5 jam. Rumah teres dua tingkat biasanya ambil 2–3 hari.` },
      { q: `Jenama cat apa paling sesuai untuk rumah di ${city}?`, a: `Kami syorkan Nippon Weatherbond untuk luar dan Nippon Odour-less untuk dalam di ${city}. Jotun dan Dulux juga tersedia jika anda mahu siri premium.` },
      { q: `Adakah anda liputi seluruh kawasan ${city}?`, a: `Ya, kami liputi semua zon di ${city} tanpa caj tambahan. Cuma WhatsApp kami alamat anda untuk pengesahan.` },
      { q: `Macam mana nak dapatkan quote percuma di ${city}?`, a: `Hantar gambar ruang anda ke WhatsApp kami dan nyatakan alamat ${city}. Kami balas anggaran awal dalam 1 jam dan atur lawatan tapak percuma.` },
      { q: `Adakah quote betul-betul percuma?`, a: `Ya. Tiada caj lawatan, tiada ikatan. Kalau harga tidak sesuai, anda boleh tolak — tiada tekanan jualan.` },
    ],
    closingCta: `Sedia ubah rumah anda di ${city} jadi nampak baru? WhatsApp kami untuk quote percuma dalam 1 jam.`,
  }),
  en: (city) => ({
    h1: `House Painting ${city} — From RM3.50/sqft`,
    metaTitle: `House Painter ${city} | From RM3.50/sqft`,
    metaDescription: `Trusted house painter ${city} from RM3.50/sqft. Interior, exterior, ceiling & epoxy floor. Nippon, Jotun, Dulux. Free quote — WhatsApp now!`,
    intro: `Our Cat Rumah Malaysia crew has repainted hundreds of homes across ${city}. From older terrace houses to modern gated bungalows, we know what ${city} owners want — a clean finish, honest pricing, and paint brands you can trust. Every job starts with a free on-site visit and a fixed price.`,
    whyPoints: [
      `Experienced crews working daily across ${city}.`,
      `Nippon Weatherbond / Jotun Jotashield built for ${city} weather.`,
      `Finished in as fast as 5 hours for small rooms in ${city}.`,
      `Fixed quote after the site visit — no hidden add-ons.`,
    ],
    faqs: [
      { q: `How much does house painting cost in ${city}?`, a: `We start from RM3.50/sqft in ${city} for interior Nippon Paint walls. That covers labour, floor covering and cleanup.` },
      { q: `How fast can you paint a house in ${city}?`, a: `A one-bedroom space in ${city} can finish same-day in as fast as 5 hours. A double-storey terrace usually takes 2–3 days.` },
      { q: `Which paint brand suits ${city} homes best?`, a: `For ${city} we recommend Nippon Weatherbond outside and Nippon Odour-less inside. Jotun and Dulux premium lines are also available.` },
      { q: `Which parts of ${city} do you cover?`, a: `We cover every zone in ${city} with no distance surcharge. WhatsApp us your address to confirm.` },
      { q: `How do I get a free quote in ${city}?`, a: `Send photos of your space and your ${city} address to our WhatsApp. You'll get an early estimate within 1 hour and a free same-day site visit.` },
      { q: `Is the quotation really free?`, a: `Yes. Zero site-visit fee, zero commitment. If the price doesn't suit you, walk away — no hard sell.` },
    ],
    closingCta: `Ready to refresh your ${city} home? WhatsApp us for a free quote in 1 hour.`,
  }),
  zh: (city) => ({
    h1: `${city}房屋油漆服务 — RM3.50/平方尺起`,
    metaTitle: `${city}房屋油漆 | RM3.50/平方尺起`,
    metaDescription: `${city}专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪。立邦、Jotun、多乐士。免费报价 — 立即 WhatsApp！`,
    intro: `Cat Rumah Malaysia 团队已在${city}完成数百项房屋油漆工程。从老排屋到现代有门卫洋楼，我们熟悉${city}业主的需求：干净的收边、诚实的价格、信赖的漆料品牌。每项工程都从免费上门勘察与固定报价开始。`,
    whyPoints: [
      `经验丰富的施工团队驻扎${city}。`,
      `立邦 Weatherbond / Jotun Jotashield 抵御${city}气候。`,
      `${city}小型工作最快5小时内完工。`,
      `勘察后固定报价 — 无任何附加费用。`,
    ],
    faqs: [
      { q: `${city}房屋油漆多少钱？`, a: `${city}起价 RM3.50/平方尺，采用立邦室内漆，含工钱、地面保护与清理。` },
      { q: `${city}的油漆工程要多久？`, a: `${city}单间公寓最快5小时内当天完工。双层排屋通常2–3天。` },
      { q: `${city}最适合什么品牌？`, a: `${city}我们建议外墙立邦 Weatherbond、室内立邦无味漆。也提供 Jotun 与多乐士高端系列。` },
      { q: `你们服务${city}的哪些区域？`, a: `全${city}皆可服务，距离不加收费用。WhatsApp 告诉我们您的地址即可确认。` },
      { q: `如何在${city}获取免费报价？`, a: `WhatsApp 发送${city}地址与照片，1小时内收到初步估价，当天即可安排免费上门勘察。` },
      { q: `报价真的免费吗？`, a: `是的。零勘察费，零约束。如果价格不合适，您可以直接拒绝，绝不强推。` },
    ],
    closingCta: `想让您的${city}家焕然一新？WhatsApp 我们，1小时内获取免费报价。`,
  }),
}

export function getLocationCopy(slug: string, locale: string): LocationCopy {
  const l = (['ms', 'en', 'zh'].includes(locale) ? locale : 'ms') as L
  const city = cityDisplay(slug, l)
  return templates[l](city)
}
