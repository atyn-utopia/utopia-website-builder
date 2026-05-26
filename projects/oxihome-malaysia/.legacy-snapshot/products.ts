export interface Product {
  id: string
  nameKey: string
  descKey: string
  rentPrice: string
  buyPrice?: string
  installment?: string
  marketPrice?: string
  savings?: string
  badge?: string
  highlight?: boolean
}

export const products: Product[] = [
  {
    id: 'mesin-5l',
    nameKey: 'products.mesin5l.name',
    descKey: 'products.mesin5l.desc',
    rentPrice: 'RM250/mo',
    buyPrice: 'RM2,599',
    installment: 'RM279 × 10 mo',
    marketPrice: 'RM3,200',
    savings: 'Save RM601',
    badge: 'Most Popular',
    highlight: true,
  },
  {
    id: 'tangki-kecemasan',
    nameKey: 'products.tangki.name',
    descKey: 'products.tangki.desc',
    rentPrice: 'RM90/mo',
    marketPrice: 'RM150',
    savings: 'Save RM60',
  },
  {
    id: 'pakej-combo',
    nameKey: 'products.combo.name',
    descKey: 'products.combo.desc',
    rentPrice: 'RM320/mo',
    badge: 'Best Value',
  },
  {
    id: 'oximeter',
    nameKey: 'products.oximeter.name',
    descKey: 'products.oximeter.desc',
    rentPrice: '',
    buyPrice: 'RM40',
    marketPrice: 'RM60',
    savings: 'Save RM20',
  },
]
