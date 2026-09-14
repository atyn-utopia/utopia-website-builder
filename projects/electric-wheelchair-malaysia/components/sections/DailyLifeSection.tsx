import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/**
 * Ten generated images of the chair in everyday Malaysian settings — never
 * captioned as customer photos, no logo on any of them (see image-prompts.md,
 * slots 9–18). If a real-photo delivery gallery returns to the page, this
 * stays separate from it — these are not testimonial/proof images.
 */
export default async function DailyLifeSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'dailyLife' });
  const items = Array.from({ length: 10 }, (_, i) => ({
    src: `/brand/life-${i + 1}.webp`,
    alt: t(`alts.${i}`),
    caption: t(`captions.${i}`),
  }));

  return (
    <section className="ew-sec ew-sec--paper">
      <div className="ew-wrap">
        <div className="ew-head">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('heading')}</h3>
          <p>{t('subheading')}</p>
        </div>
        <div className="ew-life">
          {items.map((item) => (
            <figure key={item.src}>
              <Image src={item.src} alt={item.alt} width={800} height={600} sizes="(min-width: 900px) 20vw, 45vw" />
              <figcaption className="ew-mono">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
