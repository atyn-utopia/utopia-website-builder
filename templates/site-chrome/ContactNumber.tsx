import { getTranslations } from 'next-intl/server';
import { getDisplayPhone, formatPhoneDisplay } from '@/lib/webcore';

/**
 * Availability label + tappable phone number for the header and footer.
 *
 * The number is DB-sourced (`getDisplayPhone`), never a literal, so it cannot
 * drift from what is seeded in `phone_numbers` and a CMS change reaches the
 * chrome on a `webcore-phones` tag purge without a rebuild.
 *
 * Lead ROUTING is untouched: every WhatsApp CTA still goes through
 * /redirect-whatsapp-1, which resolves per request and honours leads_mode. Only
 * this display element bypasses attribution — a tap-to-call is not tracked,
 * which is the cost of showing the number at all.
 *
 * Styling lives in globals.css (see contact-number.css in this folder), not a
 * styled-jsx block: this element is passed into the client SiteHeader as a
 * prop, so styled-jsx scoping in that component would not reach it.
 */
export default async function ContactNumber({
  locale,
  className = '',
  page,
}: {
  locale: string;
  className?: string;
  /**
   * Locale-stripped path of the page this renders on, e.g. `/`, `/blog`,
   * `/water-tank/kuching`. Required for correctness, not decoration:
   * `is_display` is unique per (website, page_slug), so a site with per-page
   * display numbers needs the page to pick the right one. Omitted = site-wide.
   */
  page?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  const phone = await getDisplayPhone(page);

  return (
    <a className={`contact-number ${className}`.trim()} href={`tel:+${phone}`}>
      <span className="contact-number-label">{t('availability')}</span>
      <span className="contact-number-value">{formatPhoneDisplay(phone)}</span>
    </a>
  );
}
