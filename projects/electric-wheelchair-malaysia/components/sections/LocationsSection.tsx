import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { regionOrder, getLocationsByRegion } from '@/config/locations';
import LocationFinder, { type FinderTown } from '@/components/LocationFinder';

/** Find your town: search + state filters over every location page link. */
export default async function LocationsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'locations' });
  const byRegion = getLocationsByRegion();

  const states = regionOrder.filter((region) => (byRegion[region] ?? []).length > 0);
  const towns: FinderTown[] = states.flatMap((region) =>
    (byRegion[region] ?? []).map((loc) => ({
      slug: loc.slug,
      name: loc.name,
      state: region,
      href: `/${locale}/${siteConfig.productSlug}/${loc.slug}`,
    })),
  );

  return (
    <section className="ew-sec ew-sec--paper" id="locations">
      <div className="ew-wrap">
        <div className="ew-head ew-reveal">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('finderHeading')}</h3>
          <p>{t('finderSubheading', { n: towns.length })}</p>
        </div>
        <LocationFinder
          towns={towns}
          states={states}
          labels={{
            placeholder: t('finderPlaceholder'),
            all: t('finderAll'),
            count: t('finderCount'),
            more: t('finderMore'),
            showAll: t('finderShowAll'),
            empty: t('finderEmpty'),
          }}
        />
      </div>
    </section>
  );
}
