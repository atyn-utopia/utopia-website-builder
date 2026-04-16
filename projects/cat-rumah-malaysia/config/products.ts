const W = (id: string) =>
  `https://static.wixstatic.com/media/${id}/v1/fill/w_800,h_600,al_c,q_85,enc_avif,quality_auto/${id.split('~')[0]}.png`

export interface ProductImage {
  url: string
  alt: Record<string, string>
}

export interface PricingTier {
  labelKey: string
  priceKey: string
}

export interface Product {
  key: string
  slug: string
  type: 'main' | 'sub'
  parentKey?: string
  mainImage: ProductImage
  gallery: ProductImage[]
  pricing: PricingTier[]
}

// ─── Main categories ───
export const products: Product[] = [
  // ──── CAT DINDING RUMAH (Interior) ────
  {
    key: 'interior',
    slug: 'cat-dinding-rumah',
    type: 'main',
    mainImage: {
      url: W('d3104b_ce500b1b695b487d9a3ff3b4a151e140~mv2.png'),
      alt: { ms: 'Cat dinding rumah dalaman', en: 'Interior wall painting', zh: '室内墙壁油漆' },
    },
    gallery: [
      { url: W('d3104b_8608aa2d682349a2a436bb813b032ec2~mv2.png'), alt: { ms: 'Contoh cat dinding 1', en: 'Wall paint example 1', zh: '墙漆示例 1' } },
      { url: W('d3104b_9c4b63ab7d7e494b86acc4ed53b11794~mv2.png'), alt: { ms: 'Contoh cat dinding 2', en: 'Wall paint example 2', zh: '墙漆示例 2' } },
      { url: W('d3104b_cee8abb743e248e09d41ca90e09ffe36~mv2.png'), alt: { ms: 'Contoh cat dinding 3', en: 'Wall paint example 3', zh: '墙漆示例 3' } },
    ],
    pricing: [],
  },
  // Texture Painting (sub of interior)
  {
    key: 'texture',
    slug: 'texture-painting',
    type: 'sub',
    parentKey: 'interior',
    mainImage: {
      url: W('d3104b_7ae8cf5752094994abb1b5fbc95ae6c5~mv2.png'),
      alt: { ms: 'Texture painting', en: 'Texture painting', zh: '纹理油漆' },
    },
    gallery: [
      { url: W('d3104b_029c732742364e2882941eec7ed0dd21~mv2.png'), alt: { ms: 'Texture contoh 1', en: 'Texture example 1', zh: '纹理示例 1' } },
      { url: W('d3104b_5c0bd82a7e024d19ac89e63ebc3655c6~mv2.png'), alt: { ms: 'Texture contoh 2', en: 'Texture example 2', zh: '纹理示例 2' } },
    ],
    pricing: [
      { labelKey: 'laborOnly', priceKey: 'laborOnlyPrice' },
      { labelKey: 'laborAndPaint', priceKey: 'laborAndPaintPrice' },
    ],
  },
  // Marble Painting (sub of interior)
  {
    key: 'marble',
    slug: 'marble-painting',
    type: 'sub',
    parentKey: 'interior',
    mainImage: {
      url: W('d3104b_dd13cd594b4e474ab9ffa02d8d84e04d~mv2.png'),
      alt: { ms: 'Marble painting', en: 'Marble painting', zh: '大理石油漆' },
    },
    gallery: [],
    pricing: [
      { labelKey: 'laborOnly', priceKey: 'laborOnlyPrice' },
      { labelKey: 'laborAndPaint', priceKey: 'laborAndPaintPrice' },
    ],
  },

  // ──── CAT LUAR RUMAH (Exterior) ────
  {
    key: 'exterior',
    slug: 'cat-luar-rumah',
    type: 'main',
    mainImage: {
      url: W('d3104b_ee5e1611dc524fb68e579cc0b89fd778~mv2.png'),
      alt: { ms: 'Cat luar rumah', en: 'Exterior wall painting', zh: '外墙油漆' },
    },
    gallery: [
      { url: W('d3104b_9f0f0f98a46f4de18bdc134c045cdc62~mv2.png'), alt: { ms: 'Cat luar contoh 1', en: 'Exterior example 1', zh: '外墙示例 1' } },
      { url: W('d3104b_f593b0d5314248a5954ce74841072868~mv2.png'), alt: { ms: 'Cat luar contoh 2', en: 'Exterior example 2', zh: '外墙示例 2' } },
    ],
    pricing: [],
  },
  // Weathershield (sub of exterior)
  {
    key: 'weathershield',
    slug: 'weathershield-paint',
    type: 'sub',
    parentKey: 'exterior',
    mainImage: {
      url: W('d3104b_1cce0431f1804f489ae75c8ab969bff1~mv2.png'),
      alt: { ms: 'Cat weathershield', en: 'Weathershield paint', zh: '防风雨漆' },
    },
    gallery: [
      { url: W('d3104b_de2324471cd34394b1df5344c0e15547~mv2.png'), alt: { ms: 'Weathershield contoh 1', en: 'Weathershield example 1', zh: '防风雨漆示例 1' } },
      { url: W('d3104b_fae01e4b4dcb41a8993238937d5006f0~mv2.png'), alt: { ms: 'Weathershield contoh 2', en: 'Weathershield example 2', zh: '防风雨漆示例 2' } },
    ],
    pricing: [],
  },
  // Outdoor Metal Paint (sub of exterior)
  {
    key: 'metal',
    slug: 'outdoor-metal-paint',
    type: 'sub',
    parentKey: 'exterior',
    mainImage: {
      url: W('d3104b_dd13cd594b4e474ab9ffa02d8d84e04d~mv2.png'),
      alt: { ms: 'Cat besi luar', en: 'Outdoor metal paint', zh: '户外金属漆' },
    },
    gallery: [],
    pricing: [
      { labelKey: 'laborOnly', priceKey: 'laborOnlyPrice' },
      { labelKey: 'laborAndPaint', priceKey: 'laborAndPaintPrice' },
    ],
  },

  // ──── SECONDARY SERVICES (standalone) ────
  {
    key: 'ceiling',
    slug: 'cat-siling',
    type: 'main',
    mainImage: {
      url: W('d3104b_c84a541538634bd687d4e893aecc4813~mv2.png'),
      alt: { ms: 'Cat siling rumah', en: 'Ceiling painting', zh: '天花板油漆' },
    },
    gallery: [],
    pricing: [],
  },
  {
    key: 'epoxy',
    slug: 'cat-epoxy-lantai',
    type: 'main',
    mainImage: {
      url: W('d3104b_472023712aa84fa6a2a9d6ed444544db~mv2.png'),
      alt: { ms: 'Cat epoxy lantai', en: 'Epoxy floor coating', zh: '环氧地坪漆' },
    },
    gallery: [],
    pricing: [],
  },
  {
    key: 'fence',
    slug: 'cat-pagar-rumah',
    type: 'main',
    mainImage: {
      url: W('d3104b_e7cc1f1397ac4b9982f6b4df525e0f20~mv2.png'),
      alt: { ms: 'Cat pagar rumah', en: 'Fence painting', zh: '围栏油漆' },
    },
    gallery: [],
    pricing: [],
  },
]

export const swatchChips = [
  '#17A890',
  '#EC6A4A',
  '#F1EAD9',
  '#1E2430',
  '#FBF7F0',
]
