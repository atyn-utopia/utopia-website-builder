import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getProducts } from '@/lib/webcore';
import ProductShowcase, { type ShowcasePhoto } from '@/components/ProductShowcase';
import { Icon, WhatsAppIcon } from './Icons';

/**
 * Product photos live in `product_photos` (CLAUDE.md, Dynamic Product Data), so
 * the DB is read first. These two files are the fallback for a webcore outage —
 * the same role `config/products.ts` is allowed to play. Never the source of
 * truth.
 */
const PHOTO_FALLBACK = ['/products/electric-wheelchair.png', '/products/electric-wheelchair-folded.png'];

/**
 * A DB photo URL on our own domain is served from `public/`, so hand
 * next/image the path rather than the absolute URL: a local src is optimised
 * without `images.remotePatterns`. A foreign URL is left for the fallback.
 */
function toLocalSrc(url: string): string | null {
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    return parsed.origin === siteConfig.siteUrl ? parsed.pathname : null;
  } catch {
    return null;
  }
}

function formatRM(amount: number): string {
  return `RM${amount.toLocaleString('en-MY')}`;
}

const SPEC_ICONS = ['fold', 'recline', 'joystick', 'award', 'wrench'] as const;

/** The chair: webcore name, blurb and prices, two photos, spec list, CTA. */
export default async function ProductSection({ locale, waHref }: { locale: string; waHref: string }) {
  const t = await getTranslations({ locale, namespace: 'products' });
  const products = await getProducts();
  const product = products[0] ?? null;

  const rentPrice = product?.rental_price ?? 400;
  const buyPrice = product?.sale_price ?? 2400;
  const productName = product?.name ?? t('name');
  const productBlurb = product?.description ?? t('description');

  const dbPhotos: ShowcasePhoto[] = (product?.photos ?? [])
    .map((photo, i) => {
      const src = toLocalSrc(photo.url);
      if (!src) return null;
      return {
        src,
        alt: photo.alt_text ?? (i === 0 ? t('photoAltUnfolded') : t('photoAltFolded')),
        label: i === 0 ? t('thumbUnfolded') : t('thumbFolded'),
      };
    })
    .filter((p): p is ShowcasePhoto => p !== null);

  const photos: ShowcasePhoto[] =
    dbPhotos.length > 0
      ? dbPhotos
      : [
          { src: PHOTO_FALLBACK[0], alt: t('photoAltUnfolded'), label: t('thumbUnfolded') },
          { src: PHOTO_FALLBACK[1], alt: t('photoAltFolded'), label: t('thumbFolded') },
        ];

  return (
    <section className="ew-sec" id="products">
      <div className="ew-wrap">
        <div className="ew-head ew-reveal">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('sectionHeading')}</h3>
          <p>{t('sectionSubheading')}</p>
        </div>

        <div className="ew-prod__grid">
          <ProductShowcase photos={photos} />

          <div className="ew-prod__info">
            <h4>{productName}</h4>
            <p className="ew-prod__blurb">{productBlurb}</p>

            <div className="ew-rates">
              <div className="ew-rate">
                <span className="ew-mono">{t('rentLabel')}</span>
                <b>{formatRM(rentPrice)}</b>
                <small>{t('perMonth')}</small>
              </div>
              <div className="ew-rate">
                <span className="ew-mono">{t('buyLabel')}</span>
                <b>{formatRM(buyPrice)}</b>
                <small>
                  {t('wasPrefix')} {t('rrp')}
                </small>
              </div>
            </div>

            <dl className="ew-specs">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <dt>
                    <span className="ew-specs__icon"><Icon name={SPEC_ICONS[i]} size={18} /></span>
                    <span className="ew-mono">{t(`specs.${i}.label`)}</span>
                  </dt>
                  <dd>{t(`specs.${i}.value`)}</dd>
                </div>
              ))}
            </dl>

            <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
              <WhatsAppIcon size={18} />
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The first product photo, for pages that show the chair outside this section. */
export async function getHeroPhoto(locale: string): Promise<ShowcasePhoto> {
  const t = await getTranslations({ locale, namespace: 'products' });
  const products = await getProducts();
  const first = products[0]?.photos?.[0];
  const src = first ? toLocalSrc(first.url) : null;
  return {
    src: src ?? PHOTO_FALLBACK[0],
    alt: first?.alt_text ?? t('photoAltUnfolded'),
    label: t('thumbUnfolded'),
  };
}
