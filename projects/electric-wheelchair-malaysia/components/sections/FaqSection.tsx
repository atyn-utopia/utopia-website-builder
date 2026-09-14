import { getTranslations } from 'next-intl/server';

export interface Faq {
  question: string;
  answer: string;
}

/** Plain <details> accordion — no JS, first item open. */
export default async function FaqSection({ locale, faqs }: { locale: string; faqs: Faq[] }) {
  const t = await getTranslations({ locale, namespace: 'faq' });

  return (
    <section className="ew-sec" id="faq">
      <div className="ew-wrap">
        <div className="ew-head ew-reveal">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('heading')}</h3>
        </div>
        <div className="ew-faq">
          {faqs.map((faq, i) => (
            <details key={faq.question} open={i === 0}>
              <summary>
                <h4>{faq.question}</h4>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
