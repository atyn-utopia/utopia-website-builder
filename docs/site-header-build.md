# The site header

Sticky, logo-less, and the same on every page. Nav + language switcher + contact
number + one WhatsApp button. Every file below is complete — copy, paste, change the
nav labels.

| | |
|---|---|
| **Source** | `templates/site-chrome/` |
| **Reference project** | `projects/water-tank-malaysia` |
| **Companion** | `docs/site-footer-build.md` |
| **Verified** | 13 Aug 2026 |

`npm run scaffold` already does all of this for a new site. Do it by hand only when
retrofitting an existing one.

---

## What you're building

```
DESKTOP  (>= 880px)
┌──────────────────────────────────────────────────────────────────────┐
│ Home  Products  Locations  Blog        24/7      [MS][EN][中]  [WA]  │
│                                        011-...                       │
└──────────────────────────────────────────────────────────────────────┘
  no logo                            contact    switcher     green CTA

MOBILE  (<= 879px)
┌──────────────────────────────┐   drawer open:
│ [=]              [MS v]      │   ┌────────────────────────────┐
└──────────────────────────────┘   │ Home                       │
  burger        switcher trigger   │ Products                   │
                                   │ Locations                  │
                                   │ Blog                       │
                                   │ ──────────────────────     │
                                   │ [MS v]         24/7        │
                                   │              011-...       │
                                   └────────────────────────────┘
```

**There is no logo in the header.** Nav links, switcher, contact number and the
WhatsApp CTA only — the brand is carried by the hero underneath it. This is
deliberate; don't "fix" it by adding a wordmark.

The bar is `position: sticky; top: 0; z-index: 40` with a translucent white
background and a backdrop blur, so it sits under the `FomoBanner` and over the page.

---

## 1 · Paste the files

Complete and verbatim. `SiteHeader` is a client component; the number it displays is
resolved on the *server* and passed in as a prop — that indirection is the whole
reason the file looks the way it does.

### `components/SiteHeader.tsx` — new file

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

/**
 * `contact` is a ReactNode, not a phone string, because the number is resolved
 * server-side (DB-backed) and this is a client component. Passing the already
 * rendered element in as a prop keeps the fetch on the server.
 *
 * Every page renders it as `<SiteHeader contact={<ContactNumber locale={locale}
 * page="/…" />} />` — the page path matters, `is_display` is keyed per page.
 */
export default function SiteHeader({ contact }: { contact?: React.ReactNode }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}#products`}>{t('products')}</Link>
          <Link href={`/${locale}#packages`}>{t('packages')}</Link>
          <Link href={`/${locale}#locations`}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`}>{t('blog')}</Link>
        </nav>

        <button
          type="button"
          className="site-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="site-actions">
          {contact}
          <div className="site-actions__lang"><LanguageSwitcher /></div>
          <WhatsAppButton href={waRedirect(locale)} label="nav" className="btn btn-wa nav-cta">
            <WaIcon size={16} />
            <span className="nav-cta-label">{t('whatsappCta')}</span>
          </WhatsAppButton>
        </div>
      </div>

      <div id="site-nav-mobile" className={`site-mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="site-mobile-nav" aria-label="Mobile primary">
          <Link href={`/${locale}`} onClick={close}>{t('home')}</Link>
          <Link href={`/${locale}#products`} onClick={close}>{t('products')}</Link>
          <Link href={`/${locale}#packages`} onClick={close}>{t('packages')}</Link>
          <Link href={`/${locale}#locations`} onClick={close}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`} onClick={close}>{t('blog')}</Link>
        </nav>
        <div className="site-mobile-actions">
          {/* Switcher and number share one row — switcher left, number hard
              right. Wrapped rather than laid out on .site-mobile-actions
              directly so the WhatsApp button below stays its own full-width
              block instead of being pulled into the row. */}
          <div className="site-mobile-row">
            <LanguageSwitcher />
            {contact}
          </div>
          <WhatsAppButton href={waRedirect(locale)} label="nav-mobile" className="btn btn-wa">
            <WaIcon size={16} />
            {t('whatsappCta')}
          </WhatsAppButton>
        </div>
      </div>

      {/* Plain <style>, NOT <style jsx>: styled-jsx in a client component ships
          its CSS inside the JS bundle, which flashes the header unstyled before
          hydration. It also cannot reach `contact` — that element is rendered on
          the server and passed in as a prop. */}
      <style>{`
        .site-header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(255,255,255,0.92);
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .site-header-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          padding: 12px var(--gut);
          min-height: 60px;
        }
        .site-nav { display: inline-flex; gap: 24px; flex-wrap: nowrap; }
        .site-nav a { color: var(--ink); font-weight: 600; font-size: 14px; letter-spacing: -0.005em; transition: color var(--dur) var(--ease-out); white-space: nowrap; }
        .site-nav a:hover { color: var(--brand-orange-deep); }
        .site-nav--desktop { display: none; }
        .site-actions { display: inline-flex; align-items: center; gap: 10px; }
        .nav-cta { height: 40px; padding: 0 14px; font-size: 13px; }
        .nav-cta-label { display: inline; }
        .site-burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 4px; width: 38px; height: 38px; padding: 0 8px; background: transparent; border: 1px solid var(--line-strong); border-radius: 10px; cursor: pointer; }
        .site-burger span { display: block; height: 2px; width: 100%; background: var(--brand-charcoal); border-radius: 2px; transition: transform 0.18s ease, opacity 0.18s ease; }
        .site-burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .site-burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
        .site-burger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .site-mobile-drawer { display: none; background: #fff; border-top: 1px solid var(--line); padding: 14px var(--gut) 18px; }
        .site-mobile-drawer.is-open { display: block; }
        .site-mobile-nav { display: flex; flex-direction: column; }
        .site-mobile-nav a { padding: 13px 4px; font-weight: 700; font-size: 15px; color: var(--brand-charcoal); border-bottom: 1px solid var(--line); }
        .site-mobile-nav a:last-child { border-bottom: none; }
        .site-mobile-actions { display: flex; flex-direction: column; gap: 12px; padding-top: 16px; margin-top: 12px; border-top: 1px solid var(--line); }
        .site-mobile-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
        .site-mobile-actions .lsw-toggle { justify-content: center; }
        .site-mobile-actions .btn { width: 100%; }
        @media (min-width: 880px) { .site-nav--desktop { display: inline-flex; } .site-burger { display: none; } .site-mobile-drawer { display: none !important; } }
        @media (max-width: 879px) {
          .nav-cta { display: none !important; }
          .site-actions__lang { display: inline-flex; }
          .site-mobile-actions .btn-wa { display: none; }
        }
      `}</style>
    </header>
  );
}
```

### `components/WhatsAppButton.tsx` — new file

```tsx
'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function WhatsAppButton({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = () => {
    if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
      const phone = siteConfig.fallbackPhone;
      window.uwc('click', {
        label: `whatsapp-${phone}${label ? `-${label}` : ''}`,
      });
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={className}
      prefetch={false}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}

export function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}
```

### `components/LanguageSwitcher.tsx` — new file

```tsx
'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = { ms: 'MS', en: 'EN', zh: '中' };

function starPoints(cx: number, cy: number, outer: number, rot = -Math.PI / 2): string {
  const inner = outer * 0.382;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = rot + (Math.PI / 5) * i;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function CircleFlag({ locale }: { locale: string }) {
  const uid = useId().replace(/:/g, '');
  const id = `clip-${locale}-${uid}`;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="lsw-flag">
      <defs><clipPath id={id}><circle cx="12" cy="12" r="11.5" /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        {locale === 'ms' && (
          <>
            <rect width="24" height="24" fill="#fff" />
            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((y, i) => (
              <rect key={y} y={y - 4} width="24" height="2" fill={i % 2 === 0 ? '#CC0001' : '#FFFFFF'} />
            ))}
            <rect width="13" height="13" fill="#010066" />
            <circle cx="5.5" cy="6.5" r="3" fill="#FFCC00" />
            <circle cx="6.6" cy="6" r="2.6" fill="#010066" />
            <polygon points={starPoints(9.5, 6.5, 1.8)} fill="#FFCC00" />
          </>
        )}
        {locale === 'en' && (
          <>
            <rect width="24" height="24" fill="#012169" />
            <path d="M0,0 L24,24 M24,0 L0,24" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M0,0 L24,24" stroke="#C8102E" strokeWidth="2" />
            <path d="M24,0 L0,24" stroke="#C8102E" strokeWidth="2" />
            <path d="M12,0 V24 M0,12 H24" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M12,0 V24 M0,12 H24" stroke="#C8102E" strokeWidth="4" />
          </>
        )}
        {locale === 'zh' && (
          <>
            <rect width="24" height="24" fill="#EE1C25" />
            <polygon points={starPoints(7, 7, 3.2)} fill="#FFFF00" />
            {[{ x: 12, y: 3 }, { x: 14, y: 5.5 }, { x: 14, y: 9 }, { x: 12, y: 11 }].map((s, i) => {
              const angle = Math.atan2(7 - s.y, 7 - s.x);
              return <polygon key={i} points={starPoints(s.x, s.y, 1.2, angle)} fill="#FFFF00" />;
            })}
          </>
        )}
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(15,15,15,0.18)" strokeWidth="1" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname() || '/';
  const search = useSearchParams();
  const qs = search?.toString();
  const suffix = qs ? `?${qs}` : '';
  const rest = (() => {
    for (const l of routing.locales) {
      if (pathname === `/${l}`) return '';
      if (pathname.startsWith(`/${l}/`)) return pathname.slice(`/${l}`.length);
    }
    return pathname === '/' ? '' : pathname;
  })();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lsw" ref={rootRef}>
      <div className="lsw-toggle" role="group" aria-label="Change language">
        {routing.locales.map((l) => {
          const active = l === currentLocale;
          return (
            <Link
              key={l}
              href={`/${l}${rest}${suffix}`}
              hrefLang={l}
              lang={l}
              className={`lsw-item ${active ? 'is-active' : ''}`}
              aria-current={active ? 'true' : undefined}
            >
              <CircleFlag locale={l} />
              <span className="lsw-label">{LABELS[l] ?? l.toUpperCase()}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="lsw-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
      >
        <CircleFlag locale={currentLocale} />
        <span className="lsw-trigger-label">{LABELS[currentLocale] ?? currentLocale.toUpperCase()}</span>
        <svg className="lsw-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="lsw-menu" role="menu">
          {routing.locales.map((l) => {
            const active = l === currentLocale;
            return (
              <Link
                key={l}
                href={`/${l}${rest}${suffix}`}
                hrefLang={l}
                lang={l}
                role="menuitem"
                className={`lsw-menu-item ${active ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <CircleFlag locale={l} />
                <span>{LABELS[l] ?? l.toUpperCase()}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### `lib/waRedirect.ts` — new file

Every WhatsApp CTA on the site routes through this, never a raw `wa.me` link.

```ts
export function waRedirect(
  locale: string,
  message?: string,
  locationSlug?: string,
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (locationSlug) params.set('loc', locationSlug);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
```

### `app/globals.css` — append

The switcher ships its markup but **not** its styles; they live in globals so layout
rules always win. Copy `ContactNumber.tsx` and its CSS from the footer guide too — the
header renders the same component.

```css
/* Language switcher — kept in globals so layout rules always win */
.lsw-toggle {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center;
  gap: 6px;
}
.lsw-item {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px 0 8px;
  border-radius: 999px;
  background: #FFFFFF;
  border: 1.5px solid var(--line-strong);
  color: var(--brand-charcoal);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color var(--dur) var(--ease-out),
              background-color var(--dur) var(--ease-out),
              color var(--dur) var(--ease-out),
              box-shadow var(--dur) var(--ease-out);
}
.lsw-flag {
  display: inline-block !important;
  flex-shrink: 0;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.lsw-label { display: inline-block; flex-shrink: 0; line-height: 1; white-space: nowrap; }
.lsw-item:hover { border-color: rgba(15, 15, 15, 0.35); background: var(--brand-grey-soft); }
.lsw-item.is-active {
  background: var(--brand-charcoal);
  border-color: var(--brand-charcoal);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(15, 15, 15, 0.18);
}
.lsw-item.is-active:hover { background: var(--brand-charcoal-2); border-color: var(--brand-charcoal-2); color: #FFFFFF; }

/* Dropdown wrapper + trigger (mobile only) */
.lsw { position: relative; display: inline-flex; }
.lsw-trigger {
  display: none;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px 0 8px;
  background: #FFFFFF;
  border: 1.5px solid var(--line-strong);
  border-radius: 999px;
  color: var(--brand-charcoal);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  line-height: 1;
  cursor: pointer;
}
.lsw-trigger-label { display: inline-block; line-height: 1; }
.lsw-caret { opacity: 0.6; transition: transform var(--dur) var(--ease-out); }
.lsw-trigger[aria-expanded="true"] .lsw-caret { transform: rotate(180deg); }
.lsw-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 18px 40px -12px rgba(15,15,15,0.25);
  padding: 6px;
  display: flex;
  flex-direction: column;
  z-index: 60;
}
.lsw-menu-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--brand-charcoal);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
}
.lsw-menu-item:hover { background: var(--brand-grey-soft); }
.lsw-menu-item.is-active { background: var(--brand-charcoal); color: #fff; }

@media (max-width: 879px) {
  .lsw-toggle { display: none !important; }
  .lsw-trigger { display: inline-flex; }
}
```

---

## 2 · Paste the wiring

### Render it — every page passes its own path

```tsx
// app/[locale]/page.tsx
<SiteHeader contact={<ContactNumber locale={locale} page="/" />} />

// app/[locale]/blog/page.tsx
<SiteHeader contact={<ContactNumber locale={locale} page="/blog" />} />

// app/[locale]/blog/[slug]/page.tsx
<SiteHeader contact={<ContactNumber locale={locale} page={`/blog/${slug}`} />} />

// app/[locale]/<productSlug>/[location]/page.tsx
<SiteHeader contact={<ContactNumber locale={locale} page={`/${siteConfig.productSlug}/${loc.slug}`} />} />
```

`contact` is a ReactNode, not a phone string, because `SiteHeader` is a client
component and `getDisplayPhone()` runs on the server. Passing the already-rendered
element keeps the fetch server-side.

### Nav labels — change these to fit the site

The five links are `home`, `products`, `packages`, `locations`, `blog`. Rename or drop
`packages` for a site that has no packages section, and keep the header and footer nav
in step.

### Translation keys — every locale

```jsonc
// messages/{ms,en,zh}.json
"nav": {
  "home": "…", "products": "…", "packages": "…", "locations": "…", "blog": "…",
  "whatsappCta": "…",          // max 3 words, "WhatsApp" counts
  "logoAlt": "…"               // used by the footer logo
},
"contact": { "availability": "Tersedia 24/7" }
```

A missing key renders as the literal key — a live header reading `nav.home`.

---

## 3 · Confirm the tokens and classes exist

| Token / class | Used for |
|---|---|
| `--line` · `--line-strong` | header bottom border, burger outline, drawer rules |
| `--gut` | header inner padding |
| `--ink` · `--brand-charcoal` | nav links, burger bars, drawer links |
| `--brand-orange-deep` | nav link hover |
| `--dur` · `--ease-out` | link colour transitions |
| `--wa-green` `#25D366` · `--wa-green-hover` `#1EBE57` | the WhatsApp button |
| `.container` | width + side padding |
| `.btn` · `.btn-wa` | button shape and WhatsApp colour |

**The WhatsApp button is never themed.** Official green only — not the brand colour,
not black. It is a recognised affordance, and the icon inside stays white.

**The CTA label is three words maximum**, counting "WhatsApp". The button already
carries the icon, so dropping the word entirely is fine. Enforced by the wizard check
`cta-button-word-limit` for `en` and `ms`.

---

## What breaks it

**`<style jsx>` instead of plain `<style>`** · *silent*
`SiteHeader` is a client component. styled-jsx ships its CSS inside the JS bundle, so
the header flashes unstyled before hydration — and its scoped styles can never reach
`contact`, which is rendered on the server and handed in as a prop. The file uses a
plain `<style>` tag for both reasons. Don't convert it back.

**Copying `LanguageSwitcher.tsx` without its CSS** · *silent*
The component ships markup only. Without the `.lsw-*` block in `globals.css` you get
unstyled stacked links where the pills should be. The `!important` flags in that block
are load-bearing.

**The drawer's WhatsApp button never shows** · *silent, and currently true*
Two rules collide: the drawer only renders below 880px, and
`.site-mobile-actions .btn-wa { display: none }` applies at 879px and under. Net
effect — **mobile has no WhatsApp CTA in the header at all**. Verified across 1280 /
900 / 879 / 390px on the reference build. The desktop CTA hiding on mobile is
intentional; this second rule looks like it isn't. Deleting the
`.site-mobile-actions .btn-wa` line restores a full-width green button inside the
drawer.

**Adding a logo to the header** · *visible*
The header is deliberately logo-less. A wordmark here duplicates the hero and squeezes
the nav at the 880px breakpoint.

**A per-page nav variant** · *visible*
`BlogNav` and friends are forbidden — every public page renders this same
`SiteHeader`. The wizard fails the build on it (`no-blognav-usage`).

---

## Verify

Run from the repo-root `utopia-wizard/`. **Not** `projects/utopia-wizard/` — that's a
stale nested clone.

```bash
cd utopia-wizard
npx tsx scripts/chrome-check.ts --only=<slug>
npx tsx scripts/gate.ts --source-only --only=<slug>
```

- [ ] Header renders on all four page types, each passing its own `page` path
- [ ] At ≥880px: nav, contact number, switcher pills and green CTA all visible
- [ ] At ≤879px: burger opens the drawer; nav, switcher and contact number inside it
- [ ] WhatsApp button is `#25D366`, icon white, label ≤3 words
- [ ] No logo, no per-page nav variant
- [ ] All three locales load with no raw keys visible
- [ ] Header stays stuck to the top when scrolling, under the FOMO banner

---

Canonical source: `templates/site-chrome/`. Rules: CLAUDE.md → Default Layout
Template. Full pipeline: `docs/full-website-setup.md`. Check definitions:
`docs/guardrails.html`.
