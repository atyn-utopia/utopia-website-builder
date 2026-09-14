import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { GoogleMark, Stars } from './Icons';

/** Google rating, one lead quote, two short ones, on the textured band. */
export default async function ReviewsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'reviews' });
  const starLabel = `${t('rating')} / 5`;

  return (
    <section className="ew-sec ew-rev" id="reviews">
      <div className="ew-rev__bg">
        <Image src="/brand/reviews-bg.webp" alt={t('bgAlt')} fill sizes="100vw" />
      </div>
      <div className="ew-wrap">
        <figure className="ew-rev__quote ew-reveal">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <div className="ew-rating">
            <span className="ew-rating__g">
              <GoogleMark />
            </span>
            <b>{t('rating')}</b>
            <Stars label={starLabel} />
            <span>{t('ratingSuffix')}</span>
          </div>
          <blockquote>&ldquo;{t('items.0.text')}&rdquo;</blockquote>
          <figcaption>
            {t('items.0.name')}, {t('items.0.location')}
          </figcaption>
        </figure>

        <div className="ew-rev__more">
          {[1, 2].map((i) => (
            <div key={i}>
              <p>&ldquo;{t(`items.${i}.text`)}&rdquo;</p>
              <span>
                {t(`items.${i}.name`)}, {t(`items.${i}.location`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
