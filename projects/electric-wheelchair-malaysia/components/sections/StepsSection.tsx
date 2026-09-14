import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { WhatsAppIcon } from './Icons';

/**
 * The 1-2-3 delivery section on the brand orange, closing with the mandatory
 * WhatsApp CTA (CLAUDE.md: step one is "WhatsApp us", so this is the
 * highest-intent moment on the page).
 */
export default async function StepsSection({ locale, waHref }: { locale: string; waHref: string }) {
  const t = await getTranslations({ locale, namespace: 'howItWorks' });
  const tProducts = await getTranslations({ locale, namespace: 'products' });

  const steps = [0, 1, 2].map((i) => ({
    title: t(`steps.${i}.title`),
    description: t(`steps.${i}.description`),
    when: t(`steps.${i}.when`),
    imageAlt: t(`steps.${i}.imageAlt`),
    src: `/brand/step-${i + 1}.webp`,
  }));

  return (
    <section className="ew-sec ew-steps" id="how-it-works">
      {/* The delivery photo under a heavy orange tint — texture, not a subject. */}
      <div className="ew-steps__bg" aria-hidden="true">
        <Image src="/brand/step-3.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="ew-wrap">
        <div className="ew-head ew-reveal">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('heading')}</h3>
          <p>{t('subheading')}</p>
        </div>

        <ol className="ew-steps__list">
          {steps.map((step) => (
            <li className="ew-step ew-reveal" key={step.src}>
              <figure className="ew-step__figure">
                <Image src={step.src} alt={step.imageAlt} width={1100} height={825} sizes="(min-width: 900px) 370px, 92vw" />
                <figcaption className="ew-step__when ew-mono">{step.when}</figcaption>
              </figure>
              <div className="ew-step__body">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="ew-steps__cta">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
            <WhatsAppIcon size={18} />
            {tProducts('cta')}
          </a>
          <p>{t('ctaNote')}</p>
        </div>
      </div>
    </section>
  );
}
