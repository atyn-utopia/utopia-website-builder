import { getTranslations } from 'next-intl/server';
import { Icon } from './Icons';

const USP_ICONS = ['shield', 'award', 'truck'] as const;

/** The mandatory 3-point USP bar directly under the hero. */
export default async function UspBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'usp' });
  const items = [0, 1, 2].map((i) => ({
    eyebrow: t(`items.${i}.eyebrow`),
    label: t(`items.${i}.label`),
    icon: USP_ICONS[i],
  }));

  return (
    <div className="ew-usp">
      <div className="ew-wrap ew-usp__grid">
        {items.map((item) => (
          <div className="ew-usp__item ew-reveal" key={item.label}>
            <span className="ew-usp__icon"><Icon name={item.icon} /></span>
            <span className="ew-mono">{item.eyebrow}</span>
            <b>{item.label}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
