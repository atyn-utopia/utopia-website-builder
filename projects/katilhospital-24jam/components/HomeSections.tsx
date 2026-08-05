'use client';

import { Fragment, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

const PRODUCT_IMAGE_FALLBACK: Record<string, string> = {
  'katil-hospital-manual-1-fungsi': '/brand/products/katil-hospital-manual-1-fungsi.png',
  'katil-hospital-manual-2-fungsi': '/brand/products/katil-hospital-manual-2-fungsi.png',
  'katil-hospital-elektrik-3-fungsi': '/brand/products/katil-hospital-manual-2-fungsi.png',
  'tilam-hospital-foam': '/brand/products/tilam-hospital-foam.png',
  'tilam-angin-anti-decubitus': '/brand/products/tilam-angin-anti-decubitus.png',
  'mesin-oksigen': '/brand/products/mesin-oksigen.png',
  'kerusi-roda': '/brand/products/kerusi-roda.png',
  'mesin-cpap': '/brand/products/mesin-cpap.png',
};

const FALLBACK_PRODUCTS: { slug: string; key: string }[] = [
  { slug: 'katil-hospital-manual-1-fungsi', key: '1-fungsi' },
  { slug: 'katil-hospital-manual-2-fungsi', key: '2-fungsi' },
  { slug: 'katil-hospital-elektrik-3-fungsi', key: 'elektrik' },
  { slug: 'tilam-hospital-foam', key: 'foam' },
  { slug: 'tilam-angin-anti-decubitus', key: 'anti-decubitus' },
  { slug: 'mesin-oksigen', key: 'oksigen' },
  { slug: 'kerusi-roda', key: 'kerusi' },
  { slug: 'mesin-cpap', key: 'cpap' },
];

const FALLBACK_PRODUCT_NAMES: Record<string, Record<string, string>> = {
  ms: {
    'katil-hospital-manual-1-fungsi': 'Katil Hospital Manual 1-Fungsi',
    'katil-hospital-manual-2-fungsi': 'Katil Hospital Manual 2-Fungsi',
    'katil-hospital-elektrik-3-fungsi': 'Katil Hospital Elektrik 3-Fungsi',
    'tilam-hospital-foam': 'Tilam Hospital Foam',
    'tilam-angin-anti-decubitus': 'Tilam Angin Anti-Decubitus',
    'mesin-oksigen': 'Mesin Oksigen',
    'kerusi-roda': 'Kerusi Roda',
    'mesin-cpap': 'Mesin CPAP',
  },
  en: {
    'katil-hospital-manual-1-fungsi': 'Manual 1-Function Hospital Bed',
    'katil-hospital-manual-2-fungsi': 'Manual 2-Function Hospital Bed',
    'katil-hospital-elektrik-3-fungsi': 'Electric 3-Function Hospital Bed',
    'tilam-hospital-foam': 'Hospital Foam Mattress',
    'tilam-angin-anti-decubitus': 'Anti-Decubitus Air Mattress',
    'mesin-oksigen': 'Oxygen Concentrator',
    'kerusi-roda': 'Wheelchair',
    'mesin-cpap': 'CPAP Machine',
  },
  zh: {
    'katil-hospital-manual-1-fungsi': '单功能手动病床',
    'katil-hospital-manual-2-fungsi': '双功能手动病床',
    'katil-hospital-elektrik-3-fungsi': '三功能电动病床',
    'tilam-hospital-foam': '医用泡沫床垫',
    'tilam-angin-anti-decubitus': '防褥疮气垫床',
    'mesin-oksigen': '家用制氧机',
    'kerusi-roda': '轮椅',
    'mesin-cpap': 'CPAP 呼吸机',
  },
};

const FALLBACK_DESCRIPTIONS: Record<string, Record<string, string>> = {
  ms: {
    'katil-hospital-manual-1-fungsi':
      'Katil hospital manual mudah dengan pelarasan kepala — pilihan jimat untuk penjagaan di rumah.',
    'katil-hospital-manual-2-fungsi':
      'Katil manual dengan pelarasan kepala dan lutut — selesa untuk pesakit terlantar jangka panjang.',
    'katil-hospital-elektrik-3-fungsi':
      'Katil elektrik dengan kawalan jauh — pelarasan kepala, lutut dan tinggi, sesuai untuk penjagaan intensif.',
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
    'katil-hospital-manual-1-fungsi':
      'A simple manual hospital bed with single head adjustment — the budget-friendly choice for home care.',
    'katil-hospital-manual-2-fungsi':
      'Manual bed with head and knee adjustment — comfortable support for long-term bedridden patients.',
    'katil-hospital-elektrik-3-fungsi':
      'Electric bed with remote — head, knee, and height adjustment, ideal for intensive home care.',
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
    'katil-hospital-manual-1-fungsi':
      '基础单功能手动病床，头部可调节 — 适合居家照护的经济选择。',
    'katil-hospital-manual-2-fungsi':
      '可调节头部与膝部的手动病床 — 为长期卧床患者提供舒适支持。',
    'katil-hospital-elektrik-3-fungsi':
      '配备遥控器的电动病床 — 头部、膝部与高度均可调节，适合重症居家照护。',
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
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const RED_STRIPE = (
  <div
    aria-hidden="true"
    style={{ height: 1, width: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(28,58,106,0.10) 50%, transparent 100%)' }}
  />
);

// Why-choose value props — each paired with a tasteful trust icon.
// c1 = 24h delivery, c2 = transparent/fair pricing, c3 = deliver + install,
// c4 = after-delivery support. Keys map to the `values` translation namespace.
const VALUE_CARDS: { k: string; icon: React.ReactNode }[] = [
  {
    k: 'c1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 6h10v9H3z" />
        <path d="M13 9h4l4 4v2h-8" />
        <circle cx="7" cy="18" r="1.8" />
        <circle cx="17.5" cy="18" r="1.8" />
      </svg>
    ),
  },
  {
    k: 'c2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.6 12.5 12.5 20.6a1.6 1.6 0 0 1-2.3 0L3.4 13.8a1.6 1.6 0 0 1-.4-1V4.6A1.6 1.6 0 0 1 4.6 3h8.2c.37 0 .74.14 1 .4l6.8 6.8a1.6 1.6 0 0 1 0 2.3z" />
        <circle cx="8" cy="8" r="1.4" />
      </svg>
    ),
  },
  {
    k: 'c3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a3.6 3.6 0 0 0-4.9 4.9L3 18l3 3 6.8-6.8a3.6 3.6 0 0 0 4.9-4.9l-2.5 2.5-2.1-2.1z" />
      </svg>
    ),
  },
  {
    k: 'c4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a7.5 7.5 0 0 1-10.8 6.7L4 20l1.3-4.1A7.5 7.5 0 1 1 21 11.5z" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
      </svg>
    ),
  },
];

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
 * This component is the homepage/location parity body.
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

  // Columns by product count (desktop).
  const count = renderProducts.length;
  const desktopCols = count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : 4;
  const gridTemplate = `repeat(var(--cols), minmax(0, 1fr))`;

  // FAQ accordion state
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* SECTION 4 — USP bar */}
      {RED_STRIPE}
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(143,184,224,0.14), rgba(143,184,224,0.06))',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div className="kh-usp-grid usp-panel">
          {[
            {
              k: 'p1',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 7h11v9H3z" />
                  <path d="M14 10h4l3 3v3h-7" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
              ),
            },
            {
              k: 'p2',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M7 15h4" />
                </svg>
              ),
            },
            {
              k: 'p3',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              ),
            },
          ].map((u) => (
            <div key={u.k} className="kh-usp-card usp-cell">
              <div aria-hidden="true" className="kh-usp-icon">
                {u.icon}
              </div>
              <div className="kh-usp-text">
                <h5 className="kh-usp-label">{uspT(`${u.k}.label`)}</h5>
                <h6 className="kh-usp-sub">{uspT(`${u.k}.sub`)}</h6>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          .kh-usp-grid {
            max-width: 1240px;
            margin: 0 auto;
            padding: 24px 16px;
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr;
          }
          .kh-usp-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 10px;
            padding: 4px 8px;
          }
          .kh-usp-icon {
            width: 52px;
            height: 52px;
            border-radius: 9999px;
            background: #ffffff;
            border: 1px solid #1c3a6a;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e63030;
            flex: 0 0 52px;
            box-shadow: 0 2px 8px rgba(15, 31, 80, 0.08);
          }
          .kh-usp-icon svg {
            width: 24px;
            height: 24px;
          }
          .kh-usp-text {
            min-width: 0;
          }
          .kh-usp-label {
            font-size: 15px;
            font-weight: 700;
            color: #1c3a6a;
            line-height: 1.3;
          }
          .kh-usp-sub {
            font-size: 13px;
            color: rgba(28, 58, 106, 0.65);
            line-height: 1.5;
            margin-top: 2px;
          }
          @media (min-width: 720px) {
            .kh-usp-grid {
              padding: 28px 16px;
              gap: 20px;
              grid-template-columns: repeat(3, 1fr);
            }
            .kh-usp-card {
              flex-direction: row;
              align-items: center;
              text-align: left;
              gap: 14px;
            }
            .kh-usp-icon {
              width: 56px;
              height: 56px;
              flex: 0 0 56px;
              font-size: 24px;
            }
          }
        `}</style>
      </section>

      {/* SECTION 5 — Product grid */}
      {RED_STRIPE}
      <section
        id="products"
        style={{
          background: '#FFFFFF',
          padding: '72px 16px',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SectionEyebrow>{productsT('eyebrow')}</SectionEyebrow>
            <H3 centered>{productsT('h3')}</H3>
            <p
              style={{
                marginTop: 12,
                color: 'rgba(28,58,106,0.65)',
                fontSize: 15,
                lineHeight: 1.65,
                maxWidth: 720,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {productsT('intro')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 20,
              gridTemplateColumns: gridTemplate,
            }}
            className="kh-product-grid"
            data-cols-desktop={desktopCols}
          >
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
          <style>{`
            .kh-product-grid {
              --cols: 1;
            }
            @media (min-width: 640px) {
              .kh-product-grid {
                --cols: 2;
              }
            }
            @media (min-width: 1024px) {
              .kh-product-grid {
                --cols: ${desktopCols};
              }
            }
          `}</style>
        </div>
      </section>

      {/* SECTION 6 — Why Choose 24 Jam */}
      {RED_STRIPE}
      <section
        id="why"
        style={{
          background: '#F0F4FA',
          padding: '72px 16px',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* Centered header — eyebrow pill + H3 + intro (mascot image removed) */}
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <SectionEyebrow>{valuesT('eyebrow')}</SectionEyebrow>
            <H3 centered>{valuesT('h3')}</H3>
            <p
              style={{
                marginTop: 12,
                color: 'rgba(28,58,106,0.65)',
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              {valuesT('intro')}
            </p>
          </div>

          {/* Full-width trust-card grid — tasteful icons, equal-height, centered */}
          <div className="kh-why-grid">
            {VALUE_CARDS.map((card) => (
              <div key={card.k} className="kh-why-card hover-lift">
                <div aria-hidden="true" className="kh-why-icon">
                  {card.icon}
                </div>
                <h4
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#1c3a6a',
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {valuesT(`${card.k}.title`)}
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(28,58,106,0.65)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {valuesT(`${card.k}.body`)}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            .kh-why-grid {
              display: grid;
              gap: 18px;
              grid-template-columns: 1fr;
            }
            @media (min-width: 560px) {
              .kh-why-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }
            @media (min-width: 960px) {
              .kh-why-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr));
              }
            }
            .kh-why-card {
              background: #ffffff;
              border: 1px solid #e6edf6;
              border-radius: 16px;
              padding: 26px 22px;
              box-shadow: 0 4px 10px rgba(15, 31, 80, 0.06),
                0 18px 40px rgba(15, 31, 80, 0.05);
              /* Equal height across each row of the grid. */
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 12px;
            }
            .kh-why-icon {
              width: 52px;
              height: 52px;
              border-radius: 14px;
              background: linear-gradient(135deg, #fdecec 0%, #fbdada 100%);
              border: 1px solid rgba(230, 48, 48, 0.18);
              color: #e63030;
              display: flex;
              align-items: center;
              justify-content: center;
              flex: 0 0 52px;
              box-shadow: 0 2px 8px rgba(230, 48, 48, 0.12);
            }
            .kh-why-icon svg {
              width: 26px;
              height: 26px;
            }
          `}</style>
        </div>
      </section>

      {/* Location intro after Why Choose */}
      {location && (
        <section
          style={{
            background: '#FFFFFF',
            padding: '48px 16px',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <SectionEyebrow>{location.city}</SectionEyebrow>
            <h3
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 700,
                color: '#1c3a6a',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                margin: '8px 0 14px',
              }}
            >
              {location.city}
            </h3>
            <p
              style={{
                fontSize: 16,
                color: '#334155',
                lineHeight: 1.75,
                textAlign: 'left',
              }}
            >
              {location.intro}
            </p>
          </div>
        </section>
      )}

      {/* SECTION 7 — How it works (3 steps) */}
      {RED_STRIPE}
      <section
        id="how"
        style={{
          background: '#FFFFFF',
          padding: '72px 16px',
        }}
      >
        <div style={{ maxWidth: 1040, margin: '0 auto', textAlign: 'center' }}>
          <SectionEyebrow>{howT('eyebrow')}</SectionEyebrow>
          <H3 centered>{howT('h3')}</H3>
          {/* Connected step flow — cards linked by arrows: → left-to-right on
              desktop, ↓ stacked on mobile (arrow rotates, never overflows). */}
          <div className="kh-flow">
            {['s1', 's2', 's3'].map((s, i) => (
              <Fragment key={s}>
                <div className="kh-flow-card">
                  <div aria-hidden="true" className="kh-flow-num">
                    {i + 1}
                  </div>
                  <h4
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#1c3a6a',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {/* Strip any leading "1." / "1、" / "1)" prefix — the red
                        number circle is the single source of the step number. */}
                    {howT(`${s}.title`).replace(/^\s*\d+\s*[.、:)-]\s*/, '')}
                  </h4>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(28,58,106,0.65)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {howT(`${s}.body`)}
                  </p>
                </div>
                {i < 2 && (
                  <div className="kh-flow-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <polyline points="14 6 20 12 14 18" />
                    </svg>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <style>{`
            .kh-flow {
              margin-top: 40px;
              display: flex;
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }
            .kh-flow-card {
              flex: 1 1 0;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 28px 22px;
              box-shadow: 0 4px 10px rgba(15, 31, 80, 0.06),
                0 18px 40px rgba(15, 31, 80, 0.05);
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
            }
            .kh-flow-num {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              background: #e63030;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 24px;
              box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.35),
                0 6px 16px rgba(230, 48, 48, 0.28);
            }
            .kh-flow-arrow {
              display: flex;
              align-items: center;
              justify-content: center;
              color: #e63030;
              flex: 0 0 auto;
            }
            .kh-flow-arrow svg {
              width: 26px;
              height: 26px;
              transform: rotate(90deg); /* mobile: points down between stacked cards */
            }
            @media (min-width: 820px) {
              .kh-flow {
                flex-direction: row;
                align-items: stretch;
                gap: 8px;
              }
              .kh-flow-arrow {
                padding: 0 4px;
              }
              .kh-flow-arrow svg {
                width: 30px;
                height: 30px;
                transform: rotate(0deg); /* desktop: points right between cards */
              }
            }
          `}</style>
        </div>
      </section>

      {/* SECTION 8 — Customer gallery */}
      {RED_STRIPE}
      <section
        id="reviews"
        style={{
          padding: '72px 16px',
          background:
            'linear-gradient(180deg, rgba(143,184,224,0.08), #FFFFFF)',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto', textAlign: 'center' }}>
          <SectionEyebrow>{galleryT('eyebrow')}</SectionEyebrow>
          <H3 centered>{galleryT('h3')}</H3>
          <p
            style={{
              marginTop: 10,
              color: 'rgba(28,58,106,0.65)',
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: 680,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {galleryT('intro')}
          </p>
          <div
            style={{
              marginTop: 32,
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
            className="kh-gallery"
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  border: '1px solid #E2E8F0',
                  background: '#F0F4FA',
                  boxShadow: '0 2px 6px rgba(15,31,80,0.05)',
                }}
              >
                <img
                  src={`/brand/reviews/review-${n}.jpg`}
                  alt={`Ulasan pelanggan Katil Hospital Murah ${n}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <style>{`
            @media (min-width: 700px) {
              .kh-gallery {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* SECTION 9 — Google Reviews */}
      {RED_STRIPE}
      <section
        style={{
          background: '#FFFFFF',
          padding: '72px 16px',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <SectionEyebrow>{grT('eyebrow')}</SectionEyebrow>
            <H3 centered>{grT('h3')}</H3>
            <p
              style={{
                marginTop: 10,
                color: 'rgba(28,58,106,0.65)',
                fontSize: 15,
                maxWidth: 680,
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.65,
              }}
            >
              {grT('intro')}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gap: 18,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {reviews.map((r) => (
              <div
                key={r.name}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow:
                    '0 2px 4px rgba(15,31,80,0.04), 0 8px 20px rgba(15,31,80,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {GOOGLE_G_SVG}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'rgba(28,58,106,0.65)',
                    }}
                  >
                    {locale === 'en' ? 'Google Review' : locale === 'zh' ? 'Google 评价' : 'Ulasan Google'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 2 }} aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBC04">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: '#1c3a6a',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {r.body}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: 4,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1c3a6a' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(28,58,106,0.65)' }}>{r.city}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(28,58,106,0.65)' }}>{r.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FAQ */}
      {RED_STRIPE}
      <section
        style={{
          background: '#F0F4FA',
          padding: '72px 16px',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <SectionEyebrow>{faqT('eyebrow')}</SectionEyebrow>
            <H3 centered>{faqT('h3')}</H3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqList.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setOpen(open === idx ? null : idx)}
                style={{
                  textAlign: 'left',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderLeft:
                    open === idx ? '4px solid #e63030' : '1px solid #E2E8F0',
                  borderRadius: 12,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow:
                    '0 2px 6px rgba(15,31,80,0.04)',
                  transition:
                    'box-shadow 150ms cubic-bezier(0.16,1,0.3,1), border-color 150ms cubic-bezier(0.16,1,0.3,1)',
                }}
                aria-expanded={open === idx}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#1c3a6a',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      transform: open === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1)',
                      color: '#1c3a6a',
                      fontSize: 18,
                      flex: '0 0 auto',
                    }}
                  >
                    ▾
                  </span>
                </div>
                {open === idx && (
                  <p
                    style={{
                      margin: '12px 0 0',
                      fontSize: 14.5,
                      color: 'rgba(28,58,106,0.65)',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.a}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10b — Lokasi accordion (location listing) */}
      {RED_STRIPE}
      <LokasiSection locale={locale} />

      {/* SECTION 11 — Final CTA band */}
      {RED_STRIPE}
      <section
        style={{
          position: 'relative',
          padding: '96px 16px',
          color: '#FFFFFF',
          backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.78) 0%, rgba(28,58,106,0.82) 100%), url('/brand/gallery/cta-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.70)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              margin: '0 0 14px',
            }}
          >
            Jangan Tunggu Lagi
          </p>
          <h3
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: '0 0 14px',
            }}
          >
            {finalT('h3')}
          </h3>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.65,
              margin: '0 0 24px',
            }}
          >
            {finalT('subtitle')}
          </p>
          <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <WhatsAppButton
              href={waHref}
              label={finalT('cta')}
              variant="pill"
              locationSlug={location?.slug}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function H3({ children, centered }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <h3
      style={{
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 700,
        color: '#1c3a6a',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
        margin: '6px 0 0',
        textAlign: centered ? 'center' : 'left',
      }}
    >
      {children}
    </h3>
  );
}

// Single source of truth for the section eyebrow — a tinted red pill with a
// red dot + uppercase red label. Used by every section (and the hero aligns to
// the same tokens) so all eyebrows read as one consistent component.
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: 9999,
        background: 'rgba(230,48,48,0.10)',
        fontSize: 12,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: '#e63030',
        fontWeight: 700,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 7, height: 7, background: '#e63030', borderRadius: '50%', flex: '0 0 auto' }}
      />
      <span>{typeof children === 'string' ? children : ''}</span>
    </span>
  );
}

import { regionOrder, locations as ALL_LOCATIONS } from '@/config/locations';

function LokasiSection({ locale }: { locale: string }) {
  const t = useTranslations('lokasi');
  const productPath = 'katil-hospital';
  const [openState, setOpenState] = useState<string | null>(regionOrder[0]);

  const grouped = regionOrder.map((state) => ({
    state,
    items: ALL_LOCATIONS.filter((l) => l.state === state),
  }));

  return (
    <section
      id="lokasi"
      style={{
        padding: '80px 16px',
        background: 'linear-gradient(180deg, #F0F4FA 0%, #ffffff 100%)',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
          <H3 centered>{t('h3')}</H3>
          <p style={{ fontSize: 16, color: 'rgba(28,58,106,0.65)', lineHeight: 1.6, margin: '14px auto 0', maxWidth: 600 }}>
            {t('intro')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {grouped.map(({ state, items }) => {
            const isOpen = openState === state;
            return (
              <div
                key={state}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(28,58,106,0.10)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                  boxShadow: isOpen ? '0 8px 24px -8px rgba(28,58,106,0.16)' : 'none',
                  borderColor: isOpen ? 'rgba(24,119,183,0.30)' : 'rgba(28,58,106,0.10)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenState(isOpen ? null : state)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                    <span
                      aria-hidden="true"
                      style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(24,119,183,0.10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1877b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <span>
                      <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: '#1c3a6a' }}>{state}</span>
                      <span style={{ display: 'block', fontSize: 12, color: 'rgba(28,58,106,0.55)', marginTop: 2 }}>
                        {items.length} kawasan
                      </span>
                    </span>
                  </span>
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(28,58,106,0.55)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'transform 280ms cubic-bezier(.34,1.56,.64,1)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(28,58,106,0.08)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 16 }}>
                      {items.map((loc) => (
                        <a
                          key={loc.slug}
                          href={`/${locale}/${productPath}/${loc.slug}`}
                          className="city-pill"
                        >
                          {loc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(28,58,106,0.55)', marginTop: 28 }}>
          {t('empty')}{' '}
          <a
            href={waRedirect(locale)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1877b7', fontWeight: 600 }}
          >
            {t('emptyCta')}
          </a>
        </p>
      </div>
    </section>
  );
}
