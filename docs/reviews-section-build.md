# The reviews section

Six Google-style review cards on a pale gradient band, with an aggregate pill above
them. Sits between the process section and the gallery, on the homepage *and* every
location page.

| | |
|---|---|
| **Source** | `projects/water-tank-malaysia` (inline, not a shared component) |
| **Companions** | `docs/site-header-build.md` · `docs/site-footer-build.md` |
| **Verified** | 13 Aug 2026 |

**This one is not in `templates/site-chrome/`.** Unlike the header and footer, the
reviews section has never been extracted into a template — it lives inline in each
project's `page.tsx`, with its CSS in `PageStyles.tsx` and its copy in
`messages/*.json`. 18 of the 20 projects that have it use the same six-card shape, so
that shape is the de-facto standard and is what's below.

---

## Before you paste: the reviews have to be real

The block below renders the **Google G logo**, a star row, and a line like
*"4.9 / 5 from 213 Google reviews"*. That is a factual claim about a Google Business
Profile. If the numbers and the quotes aren't real:

- it misrepresents the client to their customers;
- it exposes the client, not you, if a competitor or a customer reports it;
- and the moment anyone adds `AggregateRating` structured data on top of invented
  numbers, it becomes a Google structured-data policy violation with a manual-action
  risk that can take the whole site out of search.

The reference project currently ships six placeholder personas and an invented
aggregate. Treat those as **layout lorem, not shippable copy** — replace them with
real reviews pulled from the client's Google Business Profile before launch, and set
the aggregate to whatever their profile actually says. If the client has no reviews
yet, drop the Google G and the aggregate pill and label the section plainly
("What our customers say"), or leave the section out until they do.

No project in the fleet currently emits `AggregateRating` schema. Keep it that way
unless the rating is real and matches what's on the page.

---

## What you're building

```
                    WATER TANK CUSTOMER REVIEWS          <- eyebrow
              4.9 / 5 on Google Water Tank Reviews       <- the section's only h3
              ( G  4.9 / 5 from 213 Google reviews )     <- aggregate pill

  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │              "  │  │              "  │  │              "  │  <- ghost quote mark
  │ ★★★★★           │  │ ★★★★★           │  │ ★★★★★           │
  │ Body copy of    │  │ Body copy of    │  │ Body copy of    │
  │ the review …    │  │ the review …    │  │ the review …    │
  │                 │  │                 │  │                 │
  │ (F) Faizal R.  G│  │ (T) Tan M.L.   G│  │ (S) Suresh K.  G│
  │     Kajang      │  │     Bukit M.    │  │     Seremban    │
  └─────────────────┘  └─────────────────┘  └─────────────────┘
   avatar = initial            suburb            Google G

  3 columns >= 980px  ·  2 columns >= 640px  ·  1 column below
```

The band is a top-to-bottom gradient (`#F7FBFF` -> `#EAF4FD`), the cards are white
with a 22px radius and a soft blue-tinted shadow, and the avatar is the reviewer's
first initial on a brand gradient.

---

## 1 · Paste the section

Goes between the process/steps section and the gallery. Indentation is as it sits in
`page.tsx`.

```tsx
      {/* REVIEWS */}
      <section className="section reviews-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tReviews('eyebrow')}</span>
            <h3>{tReviews('h3')}</h3>
            <h5 className="reviews-aggregate"><GoogleG size={18} /> {tReviews('aggregate')}</h5>
          </div>
          <div className="reviews-grid">
            {reviewItems.map((r, i) => (
              <article key={i} className="review-card">
                <span className="review-quote" aria-hidden="true">&ldquo;</span>
                <StarRow count={r.stars} />
                <h5 className="review-body">{r.body}</h5>
                <div className="review-foot">
                  <span className="review-avatar" aria-hidden="true">{r.name.charAt(0)}</span>
                  <div className="review-meta">
                    <h6 className="review-author">{r.name}</h6>
                    <h6 className="review-suburb">{r.suburb}</h6>
                  </div>
                  <span className="review-g"><GoogleG size={22} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
```

### The two icon components

Both live at module scope in `page.tsx`, above the default export. `GoogleG` is
Google's four-colour mark; `StarRow` renders `count` stars in Google amber
(`#FBBC04`) and carries the accessible label.

```tsx
function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a6 6 0 0 1-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.4 14a6 6 0 0 1 0-3.8V7.6H3.1a10 10 0 0 0 0 8.8L6.4 14Z" fill="#FBBC04" />
      <path d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 12 2 10 10 0 0 0 3.1 7.6L6.4 10A6 6 0 0 1 12 5.9Z" fill="#EA4335" />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
          <path d="M12 2l3.1 6.3 7 1-5.1 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9L2 9.3l7-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}
```

### The data wiring

```tsx
// with the other getTranslations calls, near the top of the page component
const tReviews = await getTranslations({ locale, namespace: 'reviews' });

// with the other derived data
const reviewItems = tReviews.raw('items') as {
  name: string; suburb: string; stars: number; body: string;
}[];
```

---

## 2 · Paste the CSS

Into the project's `components/PageStyles.tsx`, inside its `<style>` block.

```css
.reviews-section { background: linear-gradient(180deg, #F7FBFF 0%, #EAF4FD 100%); }
.reviews-section .section-head h3 { color: var(--brand-charcoal); }
.reviews-aggregate {
  display: inline-flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 14px;
  color: var(--brand-charcoal);
  background: #fff;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid #E1EEFA;
  box-shadow: 0 6px 16px -8px rgba(14,123,214,0.30);
}
.reviews-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 640px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 980px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }
.review-card {
  position: relative;
  background: #fff;
  border: 1px solid #E1EEFA;
  border-radius: 22px;
  padding: 26px 24px 22px;
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 18px 40px -26px rgba(14,123,214,0.28);
  overflow: hidden;
}
.review-quote {
  position: absolute; top: 2px; right: 20px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 96px; line-height: 1; font-weight: 700;
  color: rgba(14,123,214,0.10);
  pointer-events: none;
}
.stars { display: inline-flex; gap: 2px; position: relative; z-index: 1; }
.review-body { font-size: 14.5px; line-height: 1.65; color: var(--ink); margin: 0; position: relative; z-index: 1; flex: 1; }
.review-foot { display: flex; align-items: center; gap: 12px; margin-top: 2px; }
.review-avatar {
  width: 44px; height: 44px; flex: none; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
  color: #fff; font-weight: 800; font-size: 18px;
  box-shadow: 0 8px 18px -8px rgba(14,123,214,0.6);
}
.review-meta { flex: 1; min-width: 0; text-align: left; }
.review-author { font-size: 14.5px; font-weight: 700; color: var(--brand-charcoal); margin: 0; }
.review-suburb { font-size: 12.5px; color: var(--ink-muted); margin: 2px 0 0; font-weight: 500; }
.review-g { flex: none; display: inline-flex; }
```

---

## 3 · Paste the copy

Into `messages/ms.json`, `messages/en.json` and `messages/zh.json`. Real reviews —
see the note at the top.

```jsonc
"reviews": {
  "eyebrow": "WATER TANK CUSTOMER REVIEWS",
  "h3": "4.9 / 5 on Google Water Tank Reviews",
  "aggregate": "4.9 / 5 from 213 Google reviews",
  "postedOn": "Posted on Google",
  "items": [
    {
      "name": "Faizal Rahman",
      "suburb": "Kajang, Selangor",
      "stars": 5,
      "body": "Installed the King Kong 1000L combo with a Hitachi 250W pump. Water pressure jumped, the upstairs shower is strong now. Neat install, done in a day."
    }
    // ... 5 more, six in total — see "Six or twelve, never five" below
  ]
}
```

---

## The rules this section has to follow

**Six or twelve, never five, seven, nine or ten.**
The grid is 3 columns at ≥980px and 2 at ≥640px, so a clean last row needs a count
divisible by both — 6 or 12. Six is the fleet norm (18 of 20 projects). Counts in the
wild that leave a ragged last row: `panasonic-aircond` and `toshiba-aircond` at 9,
`katil-hospital` and `samsung-aircond` at 10, `hisense-aircond` at 20. This is the
same rule as the customer gallery: no blank slots at any breakpoint.

**One `h3`, then `h5`/`h6` — no bare `<p>`.**
The page already spends its single `h1` and `h2` on the hero, so the section title is
an `h3`. Everything below it is body copy in a heading tag: the aggregate line and
review body are `h5`, the author and suburb are `h6`. That's the repo-wide "no bare
`<p>`" rule, and `PageStyles` line 12 resets `font-weight: inherit` on
`.review-body` and `.review-suburb` so they still *read* as body copy.

**Location pages get their own reviews.**
Right now the location page renders the identical `reviews.items` array as the
homepage — same six people, same suburbs — on all 150-180 location pages. That is
duplicate content on the one page type that CLAUDE.md requires to be unique. If you
can, filter or swap the items so a Kuching page shows Kuching-area reviewers.

**The Google G is a claim, not a decoration.** Only render it for reviews that are
actually on Google.

---

## What breaks it

**Placeholder personas shipped to production** · *visible, and the serious one*
Six invented names next to Google's logo and a made-up review count. Replace with real
reviews before launch, or strip the Google branding and the aggregate.

**`AggregateRating` schema over invented numbers** · *silent, then catastrophic*
Structured data turns a soft claim into a machine-readable one Google enforces. Don't
add it unless the rating is real and matches the visible page. Nothing in the fleet
emits it today.

**Every location page showing the same six reviews** · *silent*
Duplicate content across 150-180 URLs. The section is copy-pasted verbatim from the
homepage into the location template, `reviews.items` and all.

**A ragged last row** · *visible*
Any item count not divisible by 6 strands cards in the final row at one breakpoint or
another.

**Bare `<p>` for the review body** · *silent*
Passes the eye test, fails the repo's heading-tag rule. Use `h5` / `h6` and let the
`font-weight: inherit` reset handle the look.

---

## Verify

- [ ] Review count is 6 or 12 — full rows at 1 / 2 / 3 columns
- [ ] Every quote and the aggregate figure trace back to a real Google Business Profile
- [ ] Section has exactly one `h3`; body copy is `h5` / `h6`, no bare `<p>`
- [ ] Stars carry the `aria-label`; decorative marks are `aria-hidden`
- [ ] Location pages don't repeat the homepage's reviewers verbatim
- [ ] No `AggregateRating` structured data unless the rating is real
- [ ] All three locales load with no raw keys visible

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`. Rules:
CLAUDE.md → Frontend Design Rules. Full pipeline: `docs/full-website-setup.md`.
