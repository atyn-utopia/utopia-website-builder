export interface CoreProduct {
  id: string
  key: 'standardChair' | 'banquetChair' | 'chiavariChair' | 'longTable' | 'roundTable' | 'cocktailTable'
  image: string
  plain: string
  withCover: string
  low: string
  high: string
}

export const CORE_PRODUCTS: CoreProduct[] = [
  {
    id: 'standard-chair',
    key: 'standardChair',
    image: 'https://static.wixstatic.com/media/d3104b_a2a91123ace047c6bcfb6d3602195067~mv2.png',
    plain: 'RM3.60',
    withCover: 'RM9.60',
    low: '3.60',
    high: '9.60',
  },
  {
    id: 'banquet-chair',
    key: 'banquetChair',
    image: 'https://static.wixstatic.com/media/d3104b_ae3e10adbc5b49edb7650f4cbe761985~mv2.png',
    plain: 'RM14.40',
    withCover: 'RM21.60',
    low: '14.40',
    high: '21.60',
  },
  {
    id: 'chiavari-chair',
    key: 'chiavariChair',
    image: 'https://static.wixstatic.com/media/d3104b_f29a61374ad74d549dead5cb87793a6c~mv2.png',
    plain: 'RM21.60',
    withCover: 'RM28.80',
    low: '21.60',
    high: '28.80',
  },
  {
    id: 'long-table',
    key: 'longTable',
    image: 'https://static.wixstatic.com/media/d3104b_66659a5c65fd4048b52d1d80510fca48~mv2.png',
    plain: 'RM72.00',
    withCover: 'RM86.40',
    low: '72.00',
    high: '86.40',
  },
  {
    id: 'round-table',
    key: 'roundTable',
    image: 'https://static.wixstatic.com/media/d3104b_a864865d1cce4480b5e56abb9bd2b816~mv2.png',
    plain: 'RM72.00',
    withCover: 'RM86.40',
    low: '72.00',
    high: '86.40',
  },
  {
    id: 'cocktail-table',
    key: 'cocktailTable',
    image: 'https://static.wixstatic.com/media/d3104b_512f73a02a8f423393ba710c6181aebc~mv2.png',
    plain: '—',
    withCover: 'RM86.40',
    low: '86.40',
    high: '86.40',
  },
]

export interface AdditionalProduct {
  id: string
  key:
    | 'couch'
    | 'tent'
    | 'transparentCanopy'
    | 'airCooler'
    | 'fan'
    | 'pa'
    | 'catering'
    | 'popcorn'
    | 'cottonCandy'
  image: string
  altKey: string
}

export const ADDITIONAL_PRODUCTS: AdditionalProduct[] = [
  {
    id: 'couch-chair',
    key: 'couch',
    image: 'https://static.wixstatic.com/media/d3104b_30279a435487477ba9cae455bfa5c992~mv2.png',
    altKey: 'couchChair',
  },
  {
    id: 'tent-canopy',
    key: 'tent',
    image: 'https://static.wixstatic.com/media/d3104b_027bb82b4a9f4933b76dfc507adc0bdc~mv2.png',
    altKey: 'tentCanopy',
  },
  {
    id: 'transparent-canopy',
    key: 'transparentCanopy',
    image: 'https://static.wixstatic.com/media/d3104b_2c33f86e41a64d34868ec1dcada00ee4~mv2.png',
    altKey: 'transparentCanopy',
  },
  {
    id: 'air-cooler',
    key: 'airCooler',
    image: 'https://static.wixstatic.com/media/d3104b_c8922ee16e6f451aa75fed88eb082ab5~mv2.png',
    altKey: 'airCooler',
  },
  {
    id: 'commercial-fan',
    key: 'fan',
    image: 'https://static.wixstatic.com/media/d3104b_214c188916ad4646a7470c3f2dec8672~mv2.png',
    altKey: 'commercialFan',
  },
  {
    id: 'pa-system',
    key: 'pa',
    image: 'https://static.wixstatic.com/media/d3104b_5c986af286154980b51c871e988de5d0~mv2.png',
    altKey: 'paSystem',
  },
  {
    id: 'catering-equipment',
    key: 'catering',
    image: 'https://static.wixstatic.com/media/d3104b_d751bde4530f4904a3ebead34c6626ac~mv2.png',
    altKey: 'cateringEquipment',
  },
  {
    id: 'popcorn-machine',
    key: 'popcorn',
    image: 'https://static.wixstatic.com/media/d3104b_2614d5fa4504464eae5e44c357f68980~mv2.png',
    altKey: 'popcornMachine',
  },
  {
    id: 'cotton-candy',
    key: 'cottonCandy',
    image: 'https://static.wixstatic.com/media/d3104b_026c580ff0624910b802429449680cb2~mv2.png',
    altKey: 'cottonCandy',
  },
]

export const HERO_IMAGE =
  'https://static.wixstatic.com/media/d3104b_dcd312bd5e4d4214bbb3410cd43505ed~mv2.png'

export const GALLERY_HASHES = [
  'd3104b_053726e144234c62ba5dcff8cb1041a7',
  'd3104b_6534d32621bb4a94a93d1370c23d146a',
  'd3104b_299d80bf87f14a0e90a0c94848e8ffb3',
  'd3104b_b4cd51ef1940448ca399bf2b153b6ee9',
  'd3104b_d16705342bc549438ff7792397f3f62c',
  'd3104b_7c85eb82fb734769bef7d0307b10f78e',
  'd3104b_8de363c4749a4d29ae8565662bddd8a6',
  'd3104b_37735d72053941d1be7fefce669ccb2c',
  'd3104b_475eea6601814ca69a712b7f99019b07',
  'd3104b_870aa6e8b831475794b6b63d59bde8cb',
  'd3104b_421b1a8ab5cd4c03b55463d81750f2b7',
  'd3104b_0ab793255a0042d3bf1eeab9e67d49bc',
  'd3104b_88b9ec1ce0e4499d8f3393d7fda7f09c',
  'd3104b_b83c893558fc454298611914541f32bd',
  'd3104b_99dc3234ab00434a8c9b570cec5bebd9',
  'd3104b_99aa3d07096a43c3b800e074ce138e62',
  'd3104b_bd8ce19a318c455ea07fc8af3926f529',
  'd3104b_1c00f7fe44a845f29481232edd56c6a8',
  'd3104b_4bfaef80510c4e218cd232fe5c8f5732',
  'd3104b_660750d9feeb4895a7ad0fb2af5f2c6a',
  'd3104b_4bbe9e2f0289401c8b19b91fbd65be18',
  'd3104b_b3bb32cc790b4573b360710aaa8ea64c',
  'd3104b_2006c86532a34e0d9af60431248f99a7',
  'd3104b_e0c90b69a46843ecb7060ae64ea23e20',
]

export const GALLERY_IMAGES = GALLERY_HASHES.map(
  (h) => `https://static.wixstatic.com/media/${h}~mv2.png`,
)
