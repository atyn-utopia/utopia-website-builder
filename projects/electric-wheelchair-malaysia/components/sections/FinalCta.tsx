import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { waRedirect } from '@/lib/waRedirect';
import { WhatsAppIcon } from './Icons';

/**
 * The closing band: dusk photo full-bleed under a navy overlay, white copy.
 * `heading` lets a location page put the city in the line; `location` passes
 * its slug through to the redirect.
 */
export default async function FinalCta({
  locale,
  location,
  heading,
}: {
  locale: string;
  location?: string;
  heading?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'finalCta' });

  return (
    <section className="ew-sec ew-fcta">
      <div className="ew-fcta__bg">
        <Image src="/brand/final-cta.webp" alt={t('bgAlt')} fill sizes="100vw" />
      </div>
      <div className="ew-wrap ew-fcta__body ew-reveal">
        <span className="ew-eyebrow ew-eyebrow--on-dark">{t('eyebrow')}</span>
        <h3>{heading ?? t('heading')}</h3>
        <p>{t('subheading')}</p>
        <a href={waRedirect(locale, undefined, location)} target="_blank" rel="noopener noreferrer" className="wa-btn">
          <WhatsAppIcon size={18} />
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
