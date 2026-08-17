import { routing } from '@/i18n/routing';
import { localePath } from './localeHref';

const LOCALE_PREFIXED = new RegExp(`^/(${routing.locales.join('|')})(/|$)`);

/**
 * Normalises the raw article HTML stored in `blog_translations.content`.
 *
 * Blog bodies are authored with root-relative links (`/blog/…`,
 * `/pakej-aqiqah/ipoh`, `/redirect-whatsapp-1`). Served verbatim, those links
 * drop an EN or ZH reader onto the Malay version of the page. This rewrites
 * them for the locale being rendered, and hardens the in-article WhatsApp CTA
 * with target/rel, which hand-authored HTML consistently omits.
 *
 * Left untouched: absolute URLs, mailto:/tel:, and in-page `#anchor` links.
 */
export function localizeArticleHtml(html: string, locale: string): string {
  return html
    .replace(/href="(\/[^"]*)"/g, (full, href: string) => {
      if (LOCALE_PREFIXED.test(href)) return full;
      return `href="${localePath(locale, href === '/' ? '' : href)}"`;
    })
    .replace(/<a\b([^>]*redirect-whatsapp-1[^>]*)>/g, (_full, attrs: string) => {
      let out = attrs;
      if (!/\starget=/.test(out)) out += ' target="_blank"';
      if (!/\srel=/.test(out)) out += ' rel="noopener noreferrer"';
      return `<a${out}>`;
    });
}
