# The site footer

One flat panel, shipped identically on every page of every site. Every file below is
complete — copy, paste, change the logo path.

| | |
|---|---|
| **Source** | `templates/site-chrome/` |
| **Reference project** | `projects/water-tank-malaysia` |
| **Verified** | 13 Aug 2026 |

`npm run scaffold` already does all of this for a new site. Do it by hand only when
retrofitting an existing one.

---

## What you're building

Two rows separated by a hairline. Logo, nav and contact number up top; copyright and
the Utopia credit below. No card wrapper, no columns, no social buttons.

```
┌──────────────────────────────────────────────────────────────────────┐
│  panel + border tinted from THIS site's accent (color-mix)            │
│                                                                      │
│  [1] LOGO      [2] Home  Products  Locations  Blog  FAQ   [3] 24/7   │
│                                                             011-...  │
│  ──────────────────────────── [4] ─────────────────────────────────  │
│  [5] © 2026 Brand. All rights reserved.        Built by Utopia ▲ AI  │
└──────────────────────────────────────────────────────────────────────┘
```

1. **Logo** — `/brand/<brand>-dark.png` at 152px wide. The `-dark` suffix names the
   *ink*, not the background.
2. **Nav** — one horizontal row, same labels as the header plus FAQ. Wraps and
   centres on mobile.
3. **Contact number** — `<ContactNumber />`, digits from the database. The same
   component the header uses.
4. **Divider** — 1px, tinted from the accent, 24px clear above and below.
5. **Credit** — "Built by Utopia AI" with the triangle mark. Mandatory brand CI;
   never remove it.

---

## 1 · Paste the four files

Complete and verbatim — these are the shipping files, not excerpts. Two are new
files; two append to code you already have. Nothing here is per-project except the
logo path in `SiteFooter.tsx`.

### `components/SiteFooter.tsx` — new file

```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ContactNumber from './ContactNumber';

export default async function SiteFooter({
  locale,
  page,
}: {
  locale: string;
  /** Locale-stripped path, forwarded to ContactNumber — see that component. */
  page?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-dark.png" alt={navT('logoAlt')} className="footer-logo" />
          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{navT('home')}</Link>
            <Link href={`/${locale}#products`}>{navT('products')}</Link>
            <Link href={`/${locale}#packages`}>{navT('packages')}</Link>
            <Link href={`/${locale}#locations`}>{navT('locations')}</Link>
            <Link href={`/${locale}/blog`}>{navT('blog')}</Link>
            <Link href={`/${locale}#faq`}>{t('faqLabel')}</Link>
          </nav>
          <ContactNumber locale={locale} page={page} className="contact-number--footer" />
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <p className="footer-copy">{t('copyright')}</p>
          <a
            className="utopia-credit"
            href="https://utopiagroup.com.my"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Built by</span>
            <span className="utopia-credit__word">Utopia</span>
            <svg className="utopia-credit__mark" width="14" height="12" viewBox="0 0 64 56" aria-hidden="true">
              <defs>
                <linearGradient id="utopiaCreditGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0054A6" />
                  <stop offset="50%" stopColor="#2774AE" />
                  <stop offset="100%" stopColor="#4A9DD0" />
                </linearGradient>
              </defs>
              <polygon points="32,4 60,52 4,52" fill="url(#utopiaCreditGrad)" />
            </svg>
            <span className="utopia-credit__word">AI</span>
          </a>
        </div>
      </div>

      <style>{`
        /* Colour comes from the SITE's palette, never from this file.
           --brand-orange is the fleet's primary-accent token name (kept even on
           sites whose accent is blue or green), so the color-mix defaults tint
           the panel with whatever that site's accent actually is — a project
           that defines nothing still gets a footer in its own colours.
           Override any --footer-* token in globals.css to depart from that; a
           dark footer needs --footer-bg plus the two ink tokens. */
        .site-footer {
          --_tint: var(--footer-tint, var(--brand-orange, #5B6B7F));
          background: var(--footer-bg, color-mix(in srgb, var(--_tint) 8%, #FFFFFF));
          border-top: 1px solid var(--footer-border, color-mix(in srgb, var(--_tint) 14%, #FFFFFF));
          padding: 44px 0 32px;
        }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-logo { width: 152px; height: auto; object-fit: contain; }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: var(--footer-ink, var(--brand-charcoal)); font-weight: 600; font-size: 14.5px;
          transition: color var(--dur) var(--ease-out);
        }
        .footer-nav a:hover { color: var(--footer-link-hover, var(--brand-orange)); }
        .footer-line { height: 1px; background: var(--footer-rule, color-mix(in srgb, var(--_tint) 18%, #FFFFFF)); margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy { margin: 0; font-size: 12.5px; color: var(--footer-ink-muted, var(--ink-muted)); }
        .utopia-credit { color: var(--footer-ink, var(--brand-charcoal)); }
        @media (max-width: 767px) {
          .site-footer { padding: 32px 0 24px; }
          .footer-top { flex-direction: column; text-align: center; gap: 18px; }
          .footer-nav { justify-content: center; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
```

### `components/ContactNumber.tsx` — new file

```tsx
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
```

### `app/globals.css` — append

```css
/* ── Contact number (header + footer) ──────────────────────────────────────
   Paste this block into the project's app/globals.css.

   It does NOT live in a styled-jsx block inside ContactNumber: the element is
   passed into the client SiteHeader as a `contact` prop, so that component's
   scoped styles never reach it.

   Type is deliberately token-driven, not fixed. `--font-heading` /
   `--font-display` are the two names in use across the fleet; whichever the
   site defines wins, and a site that defines neither inherits its own body
   font. Never hardcode a family here — the font is the site's, not the
   chrome's. Colours work the same way: the fallbacks are only there so the
   block is never invisible on a project that hasn't defined a token yet. */

.contact-number {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  line-height: 1.15;
  text-decoration: none;
  transition: opacity var(--dur-hover, 220ms) var(--ease, ease);
}
.contact-number:hover { opacity: 0.78; }
.contact-number:focus-visible {
  outline: 2px solid var(--brand-orange, currentColor);
  outline-offset: 3px;
  border-radius: 4px;
}
.contact-number-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--ink-muted, #4B5563);
  white-space: nowrap;
}
.contact-number-value {
  font-family: var(--font-heading, var(--font-display, inherit));
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--brand-charcoal, var(--ink, #111));
  white-space: nowrap;
}

/* Header: the desktop instance hides on mobile — the drawer carries its own
   copy, so showing both would duplicate the number on small screens. */
/* Extra separation from the language pills — the .site-actions gap alone left
   the number reading as part of the switcher group. */
.site-actions .contact-number { margin-right: 14px; }
@media (max-width: 879px) {
  .site-actions .contact-number { display: none; }
}
/* Right-aligned, sitting beside the language switcher on one row. Set here
   rather than in SiteHeader's styled-jsx: the element is passed into that
   client component as a prop, so its scoped styles never reach it. */
.site-mobile-actions .contact-number { align-items: flex-end; text-align: right; }
@media (min-width: 880px) {
  .site-mobile-actions .contact-number { display: none; }
}

/* Footer instance takes the FOOTER's ink tokens, not the header's, so a project
   that sets --footer-bg to something dark can set --footer-ink to match and the
   number follows without touching this file. Falls through to the same defaults
   as the header when a project defines neither. */
.contact-number--footer .contact-number-value {
  font-size: 19px;
  color: var(--footer-ink, var(--brand-charcoal, var(--ink, #111)));
}
.contact-number--footer .contact-number-label {
  color: var(--footer-ink-muted, var(--ink-muted, #4B5563));
}
@media (max-width: 879px) {
  .contact-number--footer { align-items: center; }
}
```

### `lib/webcore.ts` — append, before the Blog section

```ts
/* Display phone — the number the chrome PRINTS (header + footer)
 *
 * Deliberately separate from getPhoneNumber(). Two different questions:
 *
 *   who RECEIVES this lead   -> getPhoneNumber() / the redirect page (rotates)
 *   what this page SHOWS     -> getDisplayPhone() (deterministic)
 *
 * Printing a rotating number would change the digits between page loads.
 */

/**
 * Which number this PAGE prints, via webcore's dedicated /display endpoint.
 *
 * /display is deterministic — page display number -> site-wide display number
 * -> admin default. `is_display` is unique per (website, page_slug), NOT per
 * site, so the page has to be part of the question. No page = site-wide tier.
 */
async function fetchDisplayPhone(page?: string): Promise<string | null> {
  const url =
    `${WEBCORE_PUBLIC_BASE}/api/public/phone-numbers/display` +
    `?website=${encodeURIComponent(siteConfig.domain)}` +
    (page ? `&page=${encodeURIComponent(page)}` : '');

  // Same discipline as webcoreFetch: cacheable + tagged so a webcore-phones
  // purge refreshes it, and raced against a timeout rather than an AbortSignal
  // (a signal opts the response out of the Data Cache and breaks tag purging).
  const request = fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'force-cache',
    next: { tags: ['webcore-phones'] },
  }).catch(() => null);

  const res = await Promise.race([
    request,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), WEBCORE_FETCH_TIMEOUT_MS)),
  ]);
  if (!res || !res.ok) return null;

  const data = (await res.json().catch(() => null)) as { phone_number?: string } | null;
  return data?.phone_number || null;
}

export async function getDisplayPhone(page?: string): Promise<string> {
  const viaApi = await fetchDisplayPhone(page);
  if (viaApi) return viaApi;

  // Fallback if the public API is unreachable: read the rows directly and
  // reproduce its precedence. Page-scoped display row -> site-wide display row
  // -> the 'default' label -> any site-wide row.
  try {
    const rows = await getPhoneRows(siteConfig.domain);
    if (rows.length === 0) return FALLBACK_PHONE;
    const pageSlug = page ? page.replace(/^\/+|\/+$/g, '') : '';
    const row =
      (pageSlug
        ? rows.find((r) => r.is_display === true && (r.page_slug ?? 'all') === pageSlug)
        : undefined) ??
      rows.find((r) => r.is_display === true && (r.page_slug ?? 'all') === 'all') ??
      findDefaultRow(rows) ??
      rows.find((r) => (r.location_slug ?? 'all') === 'all') ??
      rows[0];
    return row.phone_number || FALLBACK_PHONE;
  } catch {
    return FALLBACK_PHONE;
  }
}

/**
 * `60109633551` -> `010-963 3551`. Malaysian mobile display convention: drop the
 * 60 country code, restore the leading 0, then 3-4 split on the subscriber part.
 * Anything that does not match falls back to the raw digits rather than
 * mangling an unexpected format.
 */
export function formatPhoneDisplay(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  const local = digits.startsWith('60') ? '0' + digits.slice(2) : digits;
  const m = local.match(/^(01\d)(\d{3})(\d{4})$/); // 10-digit mobile
  if (m) return `${m[1]}-${m[2]} ${m[3]}`;
  const m11 = local.match(/^(01\d)(\d{4})(\d{4})$/); // 11-digit mobile
  if (m11) return `${m11[1]}-${m11[2]} ${m11[3]}`;
  const fixed = local.match(/^(0\d)(\d{4})(\d{4})$/); // fixed line
  if (fixed) return `${fixed[1]}-${fixed[2]} ${fixed[3]}`;
  return local || raw;
}
```

---

## 2 · Paste the wiring

Where the four files plug into the site. The `page` path is not optional decoration —
`is_display` is unique per `(website, page_slug)`, so it is how the right number gets
picked.

### Render it — every page, its own path

```tsx
// app/[locale]/page.tsx
<SiteFooter locale={locale} page="/" />

// app/[locale]/blog/page.tsx
<SiteFooter locale={locale} page="/blog" />

// app/[locale]/blog/[slug]/page.tsx
<SiteFooter locale={locale} page={`/blog/${slug}`} />

// app/[locale]/<productSlug>/[location]/page.tsx
<SiteFooter locale={locale} page={`/${siteConfig.productSlug}/${loc.slug}`} />
```

No per-page variants. A `BlogFooter` or `BlogNav` is forbidden — the wizard fails the
build on it.

### One line to change — the logo path

```tsx
<img src="/brand/<brand>-dark.png" alt={navT('logoAlt')} className="footer-logo" />
```

### `lib/webcore.ts` — three edits to the existing phone code

```ts
// 1. add is_display to the PhoneRow interface
interface PhoneRow {
  phone_number: string;
  whatsapp_text: string | null;
  percentage: number | null;
  label: string | null;
  location_slug: string | null;
  page_slug: string | null;
  is_display: boolean | null;   // <- add
}

// 2. add it to the select in getPhoneRows()
`phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug,page_slug,is_display`

// 3. and near the top of the file
const WEBCORE_PUBLIC_BASE = 'https://webcore.utopiaai.my';
```

### Translation keys — every locale

A missing key renders as the literal key on the live site.

```jsonc
// messages/ms.json
"contact": { "availability": "Tersedia 24/7" },
"footer":  { "faqLabel": "Soalan Lazim",
             "copyright": "© 2026 <Brand>. Hak cipta terpelihara. Dikuasakan oleh Utopia Group of Companies" }

// messages/en.json
"contact": { "availability": "Available 24/7" },
"footer":  { "faqLabel": "FAQ",
             "copyright": "© 2026 <Brand>. All rights reserved. Powered by Utopia Group of Companies" }

// messages/zh.json
"contact": { "availability": "24/7 全天候" },
"footer":  { "faqLabel": "常见问题",
             "copyright": "© 2026 <Brand>. 版权所有。由 Utopia Group of Companies 提供" }
```

`nav.logoAlt`, `nav.home`, `nav.products`, `nav.packages`, `nav.locations` and
`nav.blog` are shared with the header and should already exist.

---

## 3 · Confirm the tokens exist

The footer styles itself from the project's own `globals.css`. A token that isn't
defined resolves to nothing — silently.

| Token | Used for |
|---|---|
| `--brand-orange` | the accent the panel is tinted from (fleet token name for the primary, whatever its hue) |
| `--footer-bg` · `--footer-border` · `--footer-rule` | override the derived panel, border and divider |
| `--footer-ink` · `--footer-ink-muted` | override the footer's text colours — the two a dark footer needs |
| `--footer-tint` · `--footer-link-hover` | tint from something other than the accent; nav hover colour |
| `--brand-charcoal` | nav links, contact number (default ink) |
| `--brand-orange` | nav hover, focus ring |
| `--ink-muted` | copyright, availability label |
| `--dur` · `--ease-out` | nav hover transition |
| `--dur-hover` · `--ease` · `--r-button` | Utopia credit |
| `--max-w` · `--gut` | `.container` width and side padding |
| `--font-heading` *or* `--font-display` | the contact number's type |

**The colour is the site's, not the footer's.** `SiteFooter` hardcodes no hex value —
it tints the panel from the site's own accent with `color-mix`, so a project that
defines nothing still gets a footer in its own colours. Measured across palettes:
water-tank's blue gives `#ECF4FC`, forest green `#EDF2F0`, terracotta `#F9F1EE`,
purple `#F1EEF5`. A dark footer needs exactly three tokens — `--footer-bg`,
`--footer-ink`, `--footer-ink-muted` — and the contact number follows the same two
ink tokens. Never paste another project's footer hex values in.

**The font is the site's, not the footer's.** The CSS resolves
`var(--font-heading, var(--font-display, inherit))` — whichever token the project
defines wins, and a project defining neither inherits its body font. Never hardcode a
family there.

---

## 4 · Seed the display number

Before design review the site needs a `phone_numbers` row with `is_display: true`.
Without one the footer falls back to `siteConfig.fallbackPhone` — which must already
be the client's own number, never a shared operator line.

```bash
curl -s "https://webcore.utopiaai.my/api/public/phone-numbers/display?website=<domain>&page=/"

# {"phone_number":"6011...","source":"all"}          -> good
# {"error":"No display phone number configured..."}  -> seed a row first
```

---

## What breaks it

Every one of these has shipped to a live site. The first three fail silently — the
build passes and the checklist still scores green.

**The white logo variant** · *silent*
The default panel is a pale wash of the site's accent. A white-wordmark logo renders
perfectly and is invisible. Use the dark/colour variant — `tankpro-dark.png`, not
`-light`; the `-dark` suffix names the ink, not the background. If the site wants a
dark footer, set `--footer-bg` + both ink tokens, then use the white wordmark.

**Contact styles in a styled-jsx block** · *silent*
`ContactNumber` is server-rendered and handed to the client `SiteHeader` as a prop, so
scoped styles never reach it; in the footer it renders unstyled instead. Its CSS lives
in `globals.css`. Use plain `<style>` in the components too — `<style jsx>` in a
client component ships CSS inside the JS bundle and flashes unstyled before hydration.

**A hardcoded number** · *silent*
`is_display` is unique per `(website, page_slug)`, so the digits are a per-page
question. A baked `tel:` can't follow a number change, a `leads_mode` switch, or a
client swapping their line — and it quietly disagrees with what the redirect actually
routes to. Digits come from `getDisplayPhone(page)`, always. Wizard check:
`display-phone-db-backed`.

**Printing a rotating number** · *visible*
`/resolve` and `/whatsapp-redirect` answer *who receives this lead* and rotate per
click. Print one and the digits change between page loads. Printed digits use
`/display` only; lead routing is a separate question and stays on the redirect.

**A missing translation key** · *visible*
next-intl renders the raw key, so the live footer reads `footer.copyright`. Usually
caught in one locale and shipped in the other two. Add all keys to `ms`, `en` and `zh`
together, then load every locale before review.

---

## Verify

Run from the repo-root `utopia-wizard/`. **Not** `projects/utopia-wizard/` — that's a
stale nested clone, and its scripts either fail outright or quietly grade against
fewer rules.

```bash
cd utopia-wizard
npx tsx scripts/chrome-check.ts --only=<slug>       # structural drift vs the template
npx tsx scripts/gate.ts --source-only --only=<slug>
```

- [ ] Footer renders on all four page types, each passing its own `page` path
- [ ] Contact number appears in header *and* footer, and the digits match `/display`
      for that domain
- [ ] Panel is tinted from this site's accent — no hex borrowed from another project
- [ ] Logo wordmark is legible on whatever panel the site ended up with
- [ ] Mobile: rows stack and centre; nothing left-hangs
- [ ] All three locales load with no raw keys visible
- [ ] "Built by Utopia AI" credit present, linking to utopiagroup.com.my
- [ ] `chrome-check` reports the project clean

---

Canonical source: `templates/site-chrome/`. Rules: CLAUDE.md → Default Layout
Template. Full pipeline: `docs/full-website-setup.md`. Check definitions:
`docs/guardrails.html`.
