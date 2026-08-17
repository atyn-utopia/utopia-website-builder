# CTA and the WhatsApp conversion block

Every green button on the site: what it looks like, where it has to appear, where the
click goes, and how it gets counted.

| | |
|---|---|
| **Component** | `templates/site-chrome/WhatsAppButton.tsx` |
| **Routing** | `lib/waRedirect.ts` &rarr; `/redirect-whatsapp-1` |
| **Reference** | `light-tower-rental` (complete) &middot; `water-tank-malaysia` (missing the steps CTA) |
| **Wizard checks** | `whatsapp-click-track` &middot; `cta-button-word-limit` &middot; `homepage-product-ctas` |
| **Verified** | 17 Aug 2026 |

---

## Four rules, no exceptions

**1 &middot; Official WhatsApp green only.** `#25D366`, hover `#1EBE57`, icon white.
Never the brand colour, never black, never a tint. The green is a recognised
affordance — theming it costs conversions. Applies to the nav CTA, hero, inline CTAs,
product cards, the steps CTA, any sticky/floating button, the final CTA, and the blog
article banner.

**2 &middot; Three words maximum, counting &ldquo;WhatsApp&rdquo;.** The button already
carries the icon, so dropping the word entirely is fine. `WhatsApp for a Quote` is four
— use `WhatsApp for Quote` or `Get a Quote`. Enforced for `en` and `ms`; `zh` is exempt
(not space-delimited) but keep it equally compact. Button-label keys only — headings,
subtext, badges and sentence-style closing CTAs keep their full copy.

**3 &middot; Every CTA routes through `waRedirect()`.** Never a raw `wa.me` link — that
freezes one number for every page, ignores `leads_mode`, and skips tracking. See
`docs/whatsapp-routing-build.md`.

**4 &middot; Every CTA is counted.** `WhatsAppButton` fires
`window.uwc('click', { label })` before navigating. Use a distinct `label` per site so
the analytics tell you *which* button converted, not just that one did.

---

## Where the CTAs have to be

```
  nav (desktop only — see the mobile gap below)
  hero                                 <- waRedirect(locale)
  ─ USP bar
  product cards                        <- prefill carries model + price
  ─ process / steps  1-2-3
      └── CTA  ★ MANDATORY             <- step 1 is "WhatsApp us"; without a
                                          button the section tells the reader to
                                          act and gives them nothing to click
  ─ why us
  ─ reviews
  ─ gallery / FAQ
  final CTA                            <- waRedirect(locale)
```

The homepage needs **at least three** WhatsApp CTAs (`homepage-product-ctas`). Location
pages carry the same set, each passing `loc.slug` as the third argument so the lead is
attributed to that town.

---

## 1 &middot; The button component

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

## 2 &middot; The tokens and the shape

One rounded shape for every button on the site; only the colour changes between
variants.

```css
/* globals.css — the WhatsApp CTA is never themed */
--wa-green: #25D366;
--wa-green-hover: #1EBE57;
--shadow-wa: 0 12px 28px rgba(37,211,102,0.32), 0 4px 10px rgba(37,211,102,0.18);
--radius-btn: 12px;   /* one shape for every button on the site */
```

```css
/* Buttons — single shape, only colour varies */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 52px;
  padding: 0 28px;
  border-radius: var(--radius-btn);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.005em;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform var(--dur) var(--ease-out),
              box-shadow var(--dur) var(--ease-out),
              background-color var(--dur) var(--ease-out),
              border-color var(--dur) var(--ease-out);
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:focus-visible {
  outline: 2px solid var(--brand-orange);
  outline-offset: 3px;
}
.btn-wa { background: var(--wa-green); color: #fff; box-shadow: var(--shadow-wa); }
.btn-wa:hover { background: var(--wa-green-hover); }
.btn-primary { background: var(--gradient-orange); color: #fff; box-shadow: var(--shadow-orange); }
.btn-primary:hover { background: var(--brand-orange-deep); }
.btn-ghost { background: transparent; color: var(--brand-charcoal); border: 1.5px solid var(--line-strong); }
.btn-ghost:hover { border-color: var(--brand-charcoal); }
```

## 3 &middot; The mandatory steps CTA

Straight from `light-tower-rental`, which has it. Centre it at every breakpoint — it is
one action for the whole section, not a per-card control.

```tsx
          {/* Step 1 IS "WhatsApp us", so the section has to be actionable —
              otherwise the reader is told what to do with no way to do it. */}
          <div className="process-cta">
            <h5 className="process-cta-sub">{tProcess('ctaSub')}</h5>
            <WhatsAppButton href={waRedirect(locale)} label="process" className="btn btn-wa">
              <WaIcon size={16} />
              {tProcess('cta')}
            </WhatsAppButton>
          </div>
        </div>
```

```css
.process-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 38px;
  text-align: center;
}
.process-cta-sub {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-muted);
  max-width: 48ch;
}
```

Location-page variant passes the town through:
`waRedirect(locale, undefined, loc.slug)`.

## 4 &middot; The call sites

```tsx
// hero — no message, no location
<WhatsAppButton href={waRedirect(locale)} label="hero" className="btn btn-wa">

// product card — prefill carries the model and price
<WhatsAppButton
  href={waRedirect(locale, `${featured.name} — ${tProducts('priceFrom', { price })}`)}
  label={`product-${featured.slug}`} className="btn btn-wa product-cta">

// final CTA
<WhatsAppButton href={waRedirect(locale)} label="final-cta" className="btn btn-wa">

// LOCATION PAGE — third arg attributes the lead to the town
<WhatsAppButton href={waRedirect(locale, undefined, loc.slug)}
  label={`hero-${loc.slug}`} className="btn btn-wa">

<WhatsAppButton href={waRedirect(locale, `${featured.name} di ${loc.name}`, loc.slug)}
  label={`product-${featured.slug}-${loc.slug}`} className="btn btn-wa product-cta">
```

---

## What breaks it

**A steps section that doesn't close with a CTA** · *visible, and live right now*
Step 1 is almost always &ldquo;WhatsApp us your details&rdquo;. A section that tells the
reader to act and then gives them nothing to tap wastes the highest-intent moment on the
page. **`water-tank-malaysia` — the canonical layout reference — is missing it**; its
`.process-section` ends after `.steps-flow`. `light-tower-rental` and `daikin-aircond`
have it. Copy the block above.

**No WhatsApp CTA in the mobile header** · *silent*
Two CSS rules collide in `SiteHeader`: the drawer only renders below 880px, and
`.site-mobile-actions .btn-wa { display: none }` applies at 879px and under. Net
effect — at every mobile width the header has **no** WhatsApp button at all, on the
primary viewport. Measured at 1280 / 900 / 879 / 390px. Deleting that one line restores
a full-width green button inside the drawer.

**A themed WhatsApp button** · *visible*
Brand-coloured or black WhatsApp buttons stop reading as WhatsApp. Green only.

**A four-word label** · *visible*
Wraps on mobile and looks cluttered. `cta-button-word-limit` catches `en` and `ms`.

**A raw `wa.me` link** · *silent*
One frozen number for every page, no `leads_mode`, no tracking.

**A CTA that isn't a `WhatsAppButton`** · *silent*
A plain `<Link>` to the redirect page routes correctly but fires no `uwc('click')`, so
the conversion never appears in analytics. The button exists to carry that call.

---

## Verify

- [ ] Every WhatsApp CTA is `#25D366` with a white icon — none themed
- [ ] Every CTA label is ≤3 words in `en` and `ms`
- [ ] The steps section closes with a centred CTA — homepage **and** every location page
- [ ] Homepage carries ≥3 WhatsApp CTAs
- [ ] Location CTAs pass `loc.slug` so leads attribute to the town
- [ ] Every CTA is a `WhatsAppButton` with a distinct `label`
- [ ] No raw `wa.me` anywhere outside the redirect page
- [ ] A WhatsApp button is reachable on mobile, not just desktop

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/whatsapp-routing-build.md` (where the click goes),
`docs/site-header-build.md`, `docs/site-footer-build.md`,
`docs/product-pricing-build.md`, `docs/reviews-section-build.md`.
Rules: CLAUDE.md &rarr; Frontend Design Rules.
