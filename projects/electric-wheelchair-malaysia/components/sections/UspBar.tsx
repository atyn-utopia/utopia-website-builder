import { getTranslations } from 'next-intl/server';

const USP_ICONS = ['shield', 'award', 'truck'] as const;

/**
 * Solid-fill glyphs distinct from the shared stroke-only Icon set in
 * Icons.tsx (that one is reused by the spec list too, so a solid variant
 * couldn't live there without changing the spec list's icons as a
 * side-effect) — kept local to this component, only three names needed.
 */
function SolidIcon({ name, size = 30 }: { name: (typeof USP_ICONS)[number]; size?: number }) {
  if (name === 'shield') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2L4 5.5V11c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5.5L12 2z" fill="currentColor" />
        <path d="M8.5 12.2l2.4 2.4 4.6-4.6" stroke="#003040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (name === 'award') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="8" r="6" />
        <path d="M8.6 13.2L6 22l6-3 6 3-2.6-8.8" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 6h11a1 1 0 0 1 1 1v9H2V6z" />
      <path d="M14 10h4.5a1 1 0 0 1 .8.4l2.2 2.9a1 1 0 0 1 .2.6V16h-7.7v-6z" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
    </svg>
  );
}

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
      <div className="ew-wrap">
        <div className="ew-usp__grid">
          {items.map((item) => (
            <div className="ew-usp__item ew-reveal" key={item.label}>
              <span className="ew-usp__icon"><SolidIcon name={item.icon} /></span>
              <b>{item.label}</b>
              <span className="ew-usp__desc">{item.eyebrow}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
