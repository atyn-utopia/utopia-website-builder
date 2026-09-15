import { getTranslations } from 'next-intl/server';

/** The mandatory 3-point USP bar directly under the hero. */
export default async function UspBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'usp' });
  const items = [0, 1, 2].map((i) => ({
    eyebrow: t(`items.${i}.eyebrow`),
    label: t(`items.${i}.label`),
  }));

  return (
    <div className="ew-usp">
      <div className="ew-wrap ew-usp__grid">
        {items.map((item, i) => (
          <div className="ew-usp__item ew-reveal" key={item.label}>
            <span className="ew-usp__num">{String(i + 1).padStart(2, '0')}</span>
            <b>{item.label}</b>
            <span className="ew-usp__desc">{item.eyebrow}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
