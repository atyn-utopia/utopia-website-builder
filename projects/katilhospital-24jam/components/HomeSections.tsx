'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';
import { regionOrder, locations as ALL_LOCATIONS } from '@/config/locations';

const PRODUCT_IMAGE_FALLBACK: Record<string, string> = {
  'katil-hospital-manual-2-fungsi': '/brand/products/katil-hospital-manual-2-fungsi.png',
  'katil-hospital-elektrik-3-fungsi': '/brand/products/katil-hospital-manual-2-fungsi.png',
  'katil-hospital-auto-3-fungsi': '/brand/products/katil-hospital-auto-3-fungsi.png',
  'tilam-hospital-foam': '/brand/products/tilam-hospital-foam.png',
  'tilam-angin-anti-decubitus': '/brand/products/tilam-angin-anti-decubitus.png',
  'mesin-oksigen': '/brand/products/mesin-oksigen.png',
  'kerusi-roda': '/brand/products/kerusi-roda.png',
  'mesin-cpap': '/brand/products/mesin-cpap.png',
};

const FALLBACK_PRODUCTS: { slug: string; key: string }[] = [
  { slug: 'katil-hospital-manual-2-fungsi', key: '2-fungsi' },
  { slug: 'katil-hospital-elektrik-3-fungsi', key: 'flexi-ii' },
  { slug: 'katil-hospital-auto-3-fungsi', key: 'auto' },
  { slug: 'tilam-hospital-foam', key: 'foam' },
  { slug: 'tilam-angin-anti-decubitus', key: 'anti-decubitus' },
  { slug: 'mesin-oksigen', key: 'oksigen' },
  { slug: 'kerusi-roda', key: 'kerusi' },
  { slug: 'mesin-cpap', key: 'cpap' },
];

const FALLBACK_PRODUCT_NAMES: Record<string, Record<string, string>> = {
  ms: {
    'katil-hospital-manual-2-fungsi': 'Katil Hospital Manual 2-Fungsi',
    'katil-hospital-elektrik-3-fungsi': 'Katil Hospital Flexi II - 3 Fungsi',
    'katil-hospital-auto-3-fungsi': 'Katil Hospital Auto - 3 Fungsi',
    'tilam-hospital-foam': 'Tilam Hospital Foam',
    'tilam-angin-anti-decubitus': 'Tilam Angin Anti-Decubitus',
    'mesin-oksigen': 'Mesin Oksigen',
    'kerusi-roda': 'Kerusi Roda',
    'mesin-cpap': 'Mesin CPAP',
  },
  en: {
    'katil-hospital-manual-2-fungsi': 'Manual 2-Function Hospital Bed',
    'katil-hospital-elektrik-3-fungsi': 'Flexi II 3-Function Hospital Bed',
    'katil-hospital-auto-3-fungsi': 'Auto 3-Function Hospital Bed',
    'tilam-hospital-foam': 'Hospital Foam Mattress',
    'tilam-angin-anti-decubitus': 'Anti-Decubitus Air Mattress',
    'mesin-oksigen': 'Oxygen Concentrator',
    'kerusi-roda': 'Wheelchair',
    'mesin-cpap': 'CPAP Machine',
  },
  zh: {
    'katil-hospital-manual-2-fungsi': '双功能手动病床',
    'katil-hospital-elektrik-3-fungsi': 'Flexi II 三功能病床',
    'katil-hospital-auto-3-fungsi': 'Auto 三功能电动病床',
    'tilam-hospital-foam': '医用泡沫床垫',
    'tilam-angin-anti-decubitus': '防褥疮气垫床',
    'mesin-oksigen': '家用制氧机',
    'kerusi-roda': '轮椅',
    'mesin-cpap': 'CPAP 呼吸机',
  },
};

const FALLBACK_DESCRIPTIONS: Record<string, Record<string, string>> = {
  ms: {
    'katil-hospital-manual-2-fungsi':
      'Katil manual dengan pelarasan kepala dan lutut — selesa untuk pesakit terlantar jangka panjang.',
    'katil-hospital-elektrik-3-fungsi':
      'Katil elektrik dengan kawalan jauh — pelarasan kepala, lutut dan tinggi, sesuai untuk penjagaan intensif.',
    'katil-hospital-auto-3-fungsi':
      'Katil bermotor dengan alat kawalan — laraskan kepala, lutut dan tinggi dengan sekali tekan.',
    'tilam-hospital-foam':
      'Tilam foam gred hospital, tahan tekanan dan mudah dibersihkan — sepadan dengan katil manual atau elektrik.',
    'tilam-angin-anti-decubitus':
      'Tilam angin gelombang bermotor untuk elak kudis katil pada pesakit terlantar jangka panjang.',
    'mesin-oksigen':
      'Konsentrator oksigen rumah 5 liter untuk pesakit yang memerlukan sokongan pernafasan.',
    'kerusi-roda':
      'Kerusi roda standard, ringan dan boleh dilipat — sesuai untuk warga emas dan pesakit pasca-pembedahan.',
    'mesin-cpap':
      'Mesin CPAP untuk pesakit sleep apnea — bantu pernafasan malam yang lebih lena dan selamat.',
  },
  en: {
    'katil-hospital-manual-2-fungsi':
      'Manual bed with head and knee adjustment — comfortable support for long-term bedridden patients.',
    'katil-hospital-elektrik-3-fungsi':
      'Electric bed with remote — head, knee, and height adjustment, ideal for intensive home care.',
    'katil-hospital-auto-3-fungsi':
      'Motorised bed with a handset — adjust head, knee and height at the push of a button.',
    'tilam-hospital-foam':
      'Hospital-grade foam mattress, pressure-resistant and easy to clean — compatible with manual or electric beds.',
    'tilam-angin-anti-decubitus':
      'Motorised alternating-pressure air mattress to help prevent bed sores in long-term patients.',
    'mesin-oksigen':
      '5-litre home oxygen concentrator for patients who need continuous respiratory support.',
    'kerusi-roda':
      'Lightweight folding standard wheelchair — suitable for elderly users and post-surgery recovery.',
    'mesin-cpap':
      'CPAP machine for sleep-apnea patients — supports safer, more restful breathing through the night.',
  },
  zh: {
    'katil-hospital-manual-2-fungsi':
      '可调节头部与膝部的手动病床 — 为长期卧床患者提供舒适支持。',
    'katil-hospital-elektrik-3-fungsi':
      '配备遥控器的电动病床 — 头部、膝部与高度均可调节，适合重症居家照护。',
    'katil-hospital-auto-3-fungsi':
      '配备手控器的电动病床 — 一键调节头部、膝部与高度。',
    'tilam-hospital-foam':
      '医院级泡沫床垫，抗压耐用、易于清洁 — 可搭配手动或电动病床。',
    'tilam-angin-anti-decubitus':
      '电动交替压力气垫床 — 有效帮助预防长期卧床患者的褥疮。',
    'mesin-oksigen': '5升家用制氧机，为需要持续呼吸支持的患者提供氧气。',
    'kerusi-roda': '标准轻便可折叠轮椅 — 适合长者及术后康复使用。',
    'mesin-cpap': 'CPAP睡眠呼吸机 — 为睡眠呼吸暂停患者提供更安稳的夜间呼吸支持。',
  },
};

/** Review pool for Google Reviews (same 8 across pages). */
interface GReview {
  name: string;
  city: string;
  body: string;
  date: string;
}

const G_REVIEWS: Record<string, GReview[]> = {
  ms: [
    { name: 'Puan Siti Aminah', city: 'Shah Alam', date: '3 minggu lalu', body: 'Ibu saya baru keluar hospital dan kami perlukan katil segera. Mereka hantar keesokan pagi ke Shah Alam, pasang dalam 30 minit. Harga memang berpatutan.' },
    { name: 'Encik Rajesh Kumar', city: 'Klang', date: '1 bulan lalu', body: 'Ayah saya strok, jadi kami beli katil elektrik dan tilam angin sekali. Abang yang hantar sangat sabar ajar cara guna remote.' },
    { name: 'Madam Lee Mei Ling', city: 'Petaling Jaya', date: '2 bulan lalu', body: 'Sewa sebulan untuk ayah pulih dari pembedahan paru-paru. Mesin oksigen juga disewa sekali, hantar ke PJ tepat pada masa.' },
    { name: 'Encik Ahmad Faizal', city: 'Kuala Lumpur', date: '3 minggu lalu', body: 'Mak mertua saya perlu katil di rumah sewa kecil di KL. Pilih 1-fungsi sebab ringkas. Hantar cepat, harga jujur, tiada drama.' },
    { name: 'Puan Noraini Hassan', city: 'Johor Bahru', date: '5 minggu lalu', body: 'Beli kerusi roda untuk bapa saya yang baru pembedahan lutut di JB. Sampai esok pagi, berkualiti, boleh lipat kecil untuk kereta.' },
    { name: 'Madam Tan Sook Yee', city: 'George Town', date: '2 bulan lalu', body: 'Nenek saya terlantar 3 tahun dan asyik dapat kudis katil. Sejak pakai tilam angin yang disewa, kulit jauh lebih baik.' },
    { name: 'Encik Zulkifli Osman', city: 'Kuantan', date: '6 minggu lalu', body: 'Beli set lengkap — katil 2-fungsi dan tilam foam untuk abang saya di Kuantan. Logistik dari KL ke Pahang tetap sampai dalam 24 jam.' },
    { name: 'Madam Wong Siew Ling', city: 'Kota Kinabalu', date: '3 bulan lalu', body: 'Suami saya baru didiagnosis sleep apnea dan doktor suruh guna CPAP. Sewa dulu, cuba dua minggu, baru tentukan beli.' },
  ],
  en: [
    { name: 'Mdm Siti Aminah', city: 'Shah Alam', date: '3 weeks ago', body: 'My mum had just been discharged and we needed a bed urgently. They delivered the next morning in Shah Alam and assembled it in 30 minutes. Prices are very fair.' },
    { name: 'Mr Rajesh Kumar', city: 'Klang', date: '1 month ago', body: 'My father had a stroke, so we bought the electric bed together with the air mattress. The gentleman who delivered was very patient in teaching us the remote.' },
    { name: 'Mdm Lee Mei Ling', city: 'Petaling Jaya', date: '2 months ago', body: 'Rented for a month while dad recovered from lung surgery. The oxygen machine was rented together, delivered to PJ right on time.' },
    { name: 'Mr Ahmad Faizal', city: 'Kuala Lumpur', date: '3 weeks ago', body: 'My mother-in-law needed a bed at a small rental in KL. I picked the 1-function for simplicity. Fast delivery, honest pricing, no drama.' },
    { name: 'Mdm Noraini Hassan', city: 'Johor Bahru', date: '5 weeks ago', body: 'Bought a wheelchair for my father after his knee surgery in JB. Arrived the next morning, good quality, folds small for the car boot.' },
    { name: 'Mdm Tan Sook Yee', city: 'George Town', date: '2 months ago', body: 'My grandmother has been bedridden for 3 years and kept getting bed sores. Since using the rented air mattress, her skin is much better.' },
    { name: 'Mr Zulkifli Osman', city: 'Kuantan', date: '6 weeks ago', body: 'Bought the full set — 2-function bed and foam mattress for my brother in Kuantan. Even KL to Pahang, arrived within 24 hours.' },
    { name: 'Mdm Wong Siew Ling', city: 'Kota Kinabalu', date: '3 months ago', body: 'Husband newly diagnosed with sleep apnea, doctor told him to use CPAP. We rented first, tried two weeks, then decided to buy.' },
  ],
  zh: [
    { name: '西蒂·阿米娜女士', city: '莎阿南', date: '3周前', body: '妈妈刚出院，我们急需病床。他们隔天一早就送到莎阿南，30分钟内完成安装。价格非常合理。' },
    { name: '拉吉什·库马尔先生', city: '巴生', date: '1个月前', body: '我父亲中风，因此我们一起购买了电动病床和气垫床。送货的大哥非常耐心地教我们使用遥控器。' },
    { name: '李美玲女士', city: '八打灵再也', date: '2个月前', body: '租用一个月让父亲从肺部手术后康复。制氧机也一起租，准时送到PJ。' },
    { name: '艾哈迈德·法伊扎先生', city: '吉隆坡', date: '3周前', body: '我的岳母在吉隆坡的小租屋需要病床。我选了单功能款，送货快、价格老实，没有任何麻烦。' },
    { name: '诺莱尼·哈山女士', city: '新山', date: '5周前', body: '为刚在新山做膝部手术的父亲购买轮椅。隔天早上送达，品质不错，折叠后方便放进车厢。' },
    { name: '陈淑仪女士', city: '乔治市', date: '2个月前', body: '奶奶卧床三年，一直长褥疮。自从租了气垫床后，皮肤状况改善很多。' },
    { name: '祖基菲里·奥斯曼先生', city: '关丹', date: '6周前', body: '为在关丹的哥哥购买整套 — 双功能病床和泡沫床垫。从KL送到彭亨，也在24小时内送达。' },
    { name: '黄秀玲女士', city: '亚庇', date: '3个月前', body: '丈夫刚被诊断出睡眠呼吸暂停，医生建议使用CPAP。我们先租两周试用，再决定是否购买。' },
  ],
};

const GOOGLE_G_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

function Icon({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// p1 = 24h delivery, p2 = monthly rental term, p3 = coverage.
const USP_ITEMS: { k: string; icon: React.ReactNode }[] = [
  {
    k: 'p1',
    icon: (
      <>
        <path d="M3 6h11v10H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
  },
  {
    k: 'p2',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    k: 'p3',
    icon: (
      <>
        <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
];

// c1 = 24h delivery, c2 = transparent/fair pricing, c3 = deliver + install,
// c4 = after-delivery support. Keys map to the `values` translation namespace.
const VALUE_CARDS: { k: string; icon: React.ReactNode }[] = [
  {
    k: 'c1',
    icon: (
      <>
        <path d="M3 6h10v9H3z" />
        <path d="M13 9h4l4 4v2h-8" />
        <circle cx="7" cy="18" r="1.8" />
        <circle cx="17.5" cy="18" r="1.8" />
      </>
    ),
  },
  {
    k: 'c2',
    icon: (
      <>
        <path d="M20.6 12.5 12.5 20.6a1.6 1.6 0 0 1-2.3 0L3.4 13.8a1.6 1.6 0 0 1-.4-1V4.6A1.6 1.6 0 0 1 4.6 3h8.2c.37 0 .74.14 1 .4l6.8 6.8a1.6 1.6 0 0 1 0 2.3z" />
        <circle cx="8" cy="8" r="1.4" />
      </>
    ),
  },
  {
    k: 'c3',
    icon: <path d="M14.7 6.3a3.6 3.6 0 0 0-4.9 4.9L3 18l3 3 6.8-6.8a3.6 3.6 0 0 0 4.9-4.9l-2.5 2.5-2.1-2.1z" />,
  },
  {
    k: 'c4',
    icon: (
      <>
        <path d="M21 11.5a7.5 7.5 0 0 1-10.8 6.7L4 20l1.3-4.1A7.5 7.5 0 1 1 21 11.5z" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
      </>
    ),
  },
];

const CHEVRON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface Props {
  locale: string;
  products: ProductCardData[];
  /** Optional location context. When present, we merge unique+shared FAQ & add intro above. */
  location?: {
    city: string;
    slug: string;
    intro: string;
    uniqueFaqs: { q: string; a: string }[];
  };
}

/**
 * Renders sections 4–12 of the canonical section order.
 * (Sections 1=Fomo and 2=Nav are rendered by the page wrapper; section 3=Hero is specific per page.)
 * This component is the homepage/location parity body. Styles live in
 * globals.css under "DIRECTION A".
 */
export default function HomeSections({ locale, products, location }: Props) {
  const uspT = useTranslations('usp');
  const productsT = useTranslations('products');
  const valuesT = useTranslations('values');
  const howT = useTranslations('howItWorks');
  const galleryT = useTranslations('gallery');
  const grT = useTranslations('googleReview');
  const faqT = useTranslations('faq');
  const finalT = useTranslations('finalCta');

  const waHref = waRedirect(locale, undefined, location?.slug);
  const reviews = G_REVIEWS[locale] || G_REVIEWS.ms;

  // FAQ — 10 homepage Qs OR (2 unique + 3 shared) for location.
  const faqList = location
    ? [
        ...location.uniqueFaqs,
        { q: faqT('q1.q'), a: faqT('q1.a') },
        { q: faqT('q3.q'), a: faqT('q3.a') },
        { q: faqT('q5.q'), a: faqT('q5.a') },
      ]
    : ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
        q: faqT(`q${i}.q`),
        a: faqT(`q${i}.a`),
      })) as { q: string; a: string }[]);

  // Ensure product grid shows 8 skeletons when empty.
  const renderProducts: ProductCardData[] =
    products.length > 0
      ? products.map((p) => ({
          ...p,
          image: p.image || PRODUCT_IMAGE_FALLBACK[p.slug] || undefined,
        }))
      : FALLBACK_PRODUCTS.map((fp) => ({
          slug: fp.slug,
          name: FALLBACK_PRODUCT_NAMES[locale]?.[fp.slug] || FALLBACK_PRODUCT_NAMES.ms[fp.slug],
          description: FALLBACK_DESCRIPTIONS[locale]?.[fp.slug] || FALLBACK_DESCRIPTIONS.ms[fp.slug],
          image: PRODUCT_IMAGE_FALLBACK[fp.slug],
          rental_price: null,
          sale_price: null,
        }));

  const priceFallback =
    locale === 'en'
      ? 'Ask on WhatsApp'
      : locale === 'zh'
      ? 'WhatsApp 询问报价'
      : 'Sebut harga di WhatsApp';

  // Columns by product count (desktop) — never strand a half-empty last row.
  const count = renderProducts.length;
  const desktopCols = count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : 4;

  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* SECTION 4 — USP bar (navy band continuing the hero wave) */}
      <section className="kh-usp">
        <ul className="usp-panel kh-usp-grid">
          {USP_ITEMS.map((u) => (
            <li key={u.k} className="usp-cell kh-usp-item">
              <span className="kh-usp-icon">
                <Icon>{u.icon}</Icon>
              </span>
              <div>
                <h5 className="kh-usp-label">{uspT(`${u.k}.label`)}</h5>
                <h6 className="kh-usp-sub">{uspT(`${u.k}.sub`)}</h6>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 5 — Product grid */}
      <section id="products" className="kh-section kh-section--mist">
        <div className="kh-wrap">
          <div className="kh-head">
            <h3 className="kh-h3">{productsT('h3')}</h3>
            <p className="kh-lead">{productsT('intro')}</p>
          </div>
          <div className="kh-product-grid" style={{ '--cols': desktopCols } as React.CSSProperties}>
            {renderProducts.map((p) => (
              <ProductImpressionTracker key={p.slug} slug={p.slug} style={{ height: '100%' }}>
                <ProductCard
                  product={p}
                  ctaLabel={productsT('cardCta')}
                  waHref={waHref}
                  locale={locale}
                  priceHintFallback={priceFallback}
                />
              </ProductImpressionTracker>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Why choose */}
      <section id="why" className="kh-section kh-section--white">
        <div className="kh-wrap">
          <div className="kh-head">
            <h3 className="kh-h3">{valuesT('h3')}</h3>
            <p className="kh-lead">{valuesT('intro')}</p>
          </div>
          <div className="kh-why-grid">
            {VALUE_CARDS.map((card) => (
              <div key={card.k} className="kh-why-card">
                <span className="kh-why-icon">
                  <Icon size={24}>{card.icon}</Icon>
                </span>
                <h4 className="kh-why-title">{valuesT(`${card.k}.title`)}</h4>
                <p className="kh-why-body">{valuesT(`${card.k}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location intro after Why Choose */}
      {location && (
        <section className="kh-loc-intro">
          <div className="kh-loc-intro-in">
            <h3 className="kh-h3">{location.city}</h3>
            <p>{location.intro}</p>
          </div>
        </section>
      )}

      {/* SECTION 7 — How it works (3 steps, closing WhatsApp CTA) */}
      <section id="how" className="kh-section kh-section--mist">
        <div className="kh-wrap">
          <div className="kh-head">
            <h3 className="kh-h3">{howT('h3')}</h3>
          </div>
          <ol className="kh-steps">
            {['s1', 's2', 's3'].map((s, i) => (
              <li key={s} className="kh-step">
                <span className="kh-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  {/* Strip any leading "1." / "1、" prefix — the number circle
                      is the single source of the step number. */}
                  <h4 className="kh-step-title">{howT(`${s}.title`).replace(/^\s*\d+\s*[.、:)-]\s*/, '')}</h4>
                  <p className="kh-step-body">{howT(`${s}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="kh-steps-close">
            <p>{howT('closing')}</p>
            <WhatsAppButton href={waHref} label={howT('cta')} variant="pill" locationSlug={location?.slug} />
          </div>
        </div>
      </section>

      {/* SECTION 8 — Customer gallery */}
      <section id="reviews" className="kh-section kh-section--white">
        <div className="kh-wrap">
          <div className="kh-head">
            <h3 className="kh-h3">{galleryT('h3')}</h3>
            <p className="kh-lead">{galleryT('intro')}</p>
          </div>
          <div className="gallery-grid kh-gallery">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <div key={n} className="kh-gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/reviews/review-${n}.jpg`}
                  alt={`Ulasan pelanggan Katil Hospital Murah ${n}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — Google Reviews */}
      <section className="kh-section kh-section--mist">
        <div className="kh-wrap">
          <div className="kh-head">
            <h3 className="kh-h3">{grT('h3')}</h3>
            <p className="kh-lead">{grT('intro')}</p>
          </div>
          <div className="kh-review-grid">
            {reviews.map((r) => (
              <article key={r.name} className="kh-review">
                <div className="kh-review-top">
                  <span className="kh-review-source">
                    {GOOGLE_G_SVG}
                    {locale === 'en' ? 'Google Review' : locale === 'zh' ? 'Google 评价' : 'Ulasan Google'}
                  </span>
                  <span className="kh-review-stars" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FBBC04">
                        <path d={STAR_PATH} />
                      </svg>
                    ))}
                  </span>
                </div>
                <p className="kh-review-body">{r.body}</p>
                <div className="kh-review-meta">
                  <div>
                    <div className="kh-review-name">{r.name}</div>
                    <div className="kh-review-city">{r.city}</div>
                  </div>
                  <div className="kh-review-date">{r.date}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FAQ */}
      <section className="kh-section kh-section--white">
        <div className="kh-wrap">
          <div className="kh-head">
            <h3 className="kh-h3">{faqT('h3')}</h3>
          </div>
          <div className="kh-faq">
            {faqList.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="kh-faq-item"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
              >
                <span className="kh-faq-q">
                  <span>{item.q}</span>
                  <span className="kh-faq-chev">{CHEVRON}</span>
                </span>
                {open === idx && <span className="kh-faq-a">{item.a}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10b — Lokasi accordion (location listing) */}
      <LokasiSection locale={locale} />

      {/* SECTION 11 — Final CTA band */}
      <section className="kh-final">
        <h3>{finalT('h3')}</h3>
        <p>{finalT('subtitle')}</p>
        <WhatsAppButton href={waHref} label={finalT('cta')} variant="pill" locationSlug={location?.slug} />
      </section>
    </>
  );
}

function LokasiSection({ locale }: { locale: string }) {
  const t = useTranslations('lokasi');
  const productPath = 'katil-hospital';
  const [openState, setOpenState] = useState<string | null>(regionOrder[0]);

  const grouped = regionOrder.map((state) => ({
    state,
    items: ALL_LOCATIONS.filter((l) => l.state === state),
  }));

  return (
    <section id="lokasi" className="kh-section kh-section--mist">
      <div className="kh-lokasi">
        <div className="kh-head">
          <h3 className="kh-h3">{t('h3')}</h3>
          <p className="kh-lead">{t('intro')}</p>
        </div>

        <div className="kh-lokasi-list">
          {grouped.map(({ state, items }) => {
            const isOpen = openState === state;
            return (
              <div key={state} className={`kh-lokasi-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="kh-lokasi-btn"
                  onClick={() => setOpenState(isOpen ? null : state)}
                  aria-expanded={isOpen}
                >
                  <span className="kh-lokasi-state">
                    <span className="kh-lokasi-pin" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <span>
                      <span className="kh-lokasi-name">{state}</span>
                      <span className="kh-lokasi-count">{t('count', { count: items.length })}</span>
                    </span>
                  </span>
                  <span className="kh-lokasi-chev">{CHEVRON}</span>
                </button>
                {isOpen && (
                  <div className="kh-lokasi-panel">
                    {items.map((loc) => (
                      <a key={loc.slug} href={`/${locale}/${productPath}/${loc.slug}`} className="city-pill">
                        {loc.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="kh-lokasi-empty">
          {t('empty')}{' '}
          <a href={waRedirect(locale)} target="_blank" rel="noopener noreferrer">
            {t('emptyCta')}
          </a>
        </p>
      </div>
    </section>
  );
}
