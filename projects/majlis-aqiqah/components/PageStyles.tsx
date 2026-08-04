// Shared page-level styles for the homepage and location pages.
// Inlines a single <style> block so every public-facing page renders with the
// exact same hero, USP, product card, calculator, marquee, reviews, gallery,
// FAQ, locations grid, and final CTA styling.
export default function PageStyles() {
  return (
    <style>{`
        /* Heading-tag normaliser:
           Body text wrapped in headings (per the keyword-driven heading rule) inherits weight from its
           parent so it doesn't render as the browser's default bold.
           Card TITLES (first h5 inside a card container) keep bold via the :first-of-type override below. */
        .usp-cell h5, .process-card h5, .why-card h5, .faq-item h4, .product-desc, .review-body, .review-suburb, .hero-support { font-weight: inherit; }
        .usp-cell h5:first-of-type, .process-card h5:first-of-type, .why-card h5:first-of-type { font-weight: 700; }
        /* HERO */
        .hero {
          position: relative;
          color: #fff;
          padding: 96px 0 112px;
          overflow: hidden;
        }
        /* Mobile: the logo is the first thing under the header, so the desktop
           96px lead-in just pushes it below the fold. Start the hero close to
           the header and keep the breathing room at the bottom instead. */
        @media (max-width: 879px) {
          .hero { padding: 18px 0 64px; }
          .hero-grid { gap: 28px; }
          /* Step the display type down on phones — the clamp minimums were tuned
             for desktop and left the H1 running to three tall lines. */
          .hero-text h1 { font-size: clamp(1.5rem, 7.1vw, 2rem); }
          .hero-text h2 { font-size: clamp(0.9rem, 3.7vw, 1rem); }
          .hero-support { font-size: 0.85rem; }
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-emerald);
          background-image:
            linear-gradient(180deg, rgba(7,58,44,0.72) 0%, rgba(7,58,44,0.86) 70%, rgba(7,58,44,0.95) 100%),
            linear-gradient(90deg, rgba(7,58,44,0.94) 0%, rgba(7,58,44,0.72) 55%, rgba(7,58,44,0.45) 100%),
            url('/bg/hero.jpg');
          background-size: cover, cover, cover;
          background-position: center, center, center right;
          background-repeat: no-repeat, no-repeat, no-repeat;
          z-index: 0;
        }
        .hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(60% 80% at 20% 30%, rgba(199, 154, 75,0.18) 0%, transparent 60%),
            radial-gradient(50% 70% at 90% 80%, rgba(199, 154, 75,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 880px) { .hero-grid { grid-template-columns: minmax(0,1fr) minmax(0,1.1fr); gap: 64px; } }
        .hero-text { display: flex; flex-direction: column; gap: 20px; text-align: center; }
        @media (min-width: 880px) { .hero-text { text-align: left; align-items: flex-start; } }
        /* The wordmark file is 1400×374. The scaffold declared 600/441 (a portrait
           box), so object-fit:contain letterboxed it and left a tall empty band
           under the logo. Correct ratio + no bottom margin closes that gap. */
        .hero-logo {
          display: block;
          width: clamp(200px, 23vw, 330px);
          height: auto;
          aspect-ratio: 1400 / 374;
          margin: 0 auto;
          object-fit: contain;
        }
        @media (min-width: 880px) { .hero-logo { margin: 0; } }
        /* Headings keep their natural casing from the source strings (proper Title Case with lowercase conjunctions). */
        .hero-text h1 {
          font-size: clamp(2.25rem, 5.5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.02;
          /* The display serif's Didone contrast breaks up below −0.02em — this is the floor. */
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0;
        }
        .hero-h1-accent { color: var(--brand-gold); }
        .hero-text h2 {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: rgba(255,255,255,0.82);
          margin: 0;
        }
        .hero-support {
          font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.66);
          margin: 0;
          max-width: 56ch;
        }
        .hero-cta-row {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        @media (min-width: 640px) { .hero-cta-row { flex-direction: row; align-items: center; } }
        @media (min-width: 880px) { .hero-cta-row { justify-content: flex-start; } }
        .hero-secondary {
          color: var(--brand-gold-bright);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.005em;
        }
        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (min-width: 880px) { .hero-stats { justify-content: flex-start; } }
        .hero-stats > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        @media (min-width: 880px) { .hero-stats > div { align-items: flex-start; } }
        .hero-stat-num {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 32px;
          color: var(--brand-gold-bright);
          line-height: 1;
        }
        .hero-stat-label {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 10.5px;
          letter-spacing: var(--label-tracking);
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .hero-stat-div { width: 1px; height: 40px; background: var(--brand-gold); opacity: 0.55; }
        /* Mobile: keep all three stats on ONE row. The container stops wrapping
           and the type steps down so 3,000+ / 14 / 100% and their labels fit
           across a 360px screen without a stat dropping to a second line. */
        @media (max-width: 879px) {
          .hero-stats { flex-wrap: nowrap; gap: 9px; width: 100%; justify-content: center; }
          .hero-stats > div { flex: 1 1 0; min-width: 0; }
          .hero-stat-num { font-size: 21px; }
          .hero-stat-label { font-size: 8px; letter-spacing: 0.08em; text-align: center; line-height: 1.25; }
          .hero-stat-div { height: 32px; flex: none; }
        }
        /* The hero subject is a photograph, masked into a mihrab arch — the
           round-topped niche is the site's signature shape and crops the
           subject at the head, which is where this image wants to be cropped.
           The double gold ring reads as a gilded frame. */
        .hero-image { position: relative; display: flex; justify-content: center; }
        /* The 9px ring is drawn by box-shadow spread, i.e. outside the box —
           this padding keeps it clear of the hero's overflow clip on mobile. */
        @media (max-width: 879px) { .hero-image { padding: 10px 10px 28px; } }
        /* The arch, the gold rings and the clipping now live on the frame, so the
           photo inside can be scaled up (zoomed) without dragging the frame or
           the floating tag with it. */
        .hero-image-frame {
          display: block;
          position: relative;
          width: 100%;
          max-width: 440px;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: var(--arch);
          box-shadow:
            0 0 0 1px var(--brand-gold),
            0 0 0 9px rgba(199, 154, 75, 0.10),
            0 40px 80px -24px rgba(7, 58, 44, 0.55);
        }
        .hero-image-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 80%;
          transform: scale(1.18);
          transform-origin: center 72%;
          border: none;
          border-radius: 0;
        }
        /* Floating trust tag, sitting on top of the arch frame — a cream plaque
           overlapping the photo's lower-left edge so it reads as pinned to the
           frame rather than printed inside the picture. */
        .hero-float-tag {
          position: absolute;
          left: -6px;
          bottom: 34px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          padding: 11px 16px 11px 12px;
          background: var(--brand-paper);
          border: 1px solid var(--brand-gold);
          border-radius: var(--r-card);
          box-shadow: 0 18px 40px -14px rgba(7,58,44,0.55);
          max-width: min(78%, 300px);
        }
        .hero-float-tag__mark {
          flex: none;
          display: grid; place-items: center;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--brand-emerald);
          color: var(--brand-gold-bright);
        }
        .hero-float-tag__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .hero-float-tag__title {
          font-family: var(--font-serif);
          font-size: 15px; font-weight: 700;
          color: var(--brand-emerald);
          margin: 0; letter-spacing: -0.01em;
        }
        .hero-float-tag__sub {
          font-family: var(--font-display);
          font-size: 11.5px; font-weight: 500;
          line-height: 1.35;
          color: var(--ink-muted);
          margin: 0;
        }
        @media (max-width: 879px) {
          /* Was shrink-to-fit and collapsed to ~175px, wrapping the title over
             two lines and the subline over four. Take the natural content width
             (capped to the column) and keep the title on one line, so the plaque
             reads the same as it does on desktop. */
          .hero-float-tag {
            left: 50%; transform: translateX(-50%); bottom: -16px;
            width: max-content; max-width: min(96%, 340px);
            padding: 10px 16px 10px 11px; gap: 10px;
          }
          .hero-float-tag__title { white-space: nowrap; font-size: 14.5px; }
          .hero-float-tag__sub { font-size: 11px; }
          .hero-float-tag__mark { width: 32px; height: 32px; }
        }
        @media (min-width: 880px) {
          .hero-image { justify-content: flex-end; }
          .hero-image-frame { max-width: 520px; }
        }

        /* USP — the arcade.
           The scaffold floated one rounded dark slab on the page ground. This is
           a full-bleed emerald colonnade instead: three mihrab niches standing
           under one roof, the band closed top and bottom by a double gold rule
           the way a kenduri invitation is framed. No card, no corner radius, no
           drop shadow — the section itself is the object. */
        .usp-bar {
          position: relative;
          padding: 0;
          background: linear-gradient(180deg, #FFFFFF 0%, var(--brand-paper) 100%);
          border-top: 1px solid var(--brand-gold);
          border-bottom: 1px solid var(--brand-gold);
          /* Second, inset hairline — the invitation's double rule. */
          box-shadow: inset 0 4px 0 -3px rgba(199,154,75,0.45),
                      inset 0 -4px 0 -3px rgba(199,154,75,0.45);
          overflow: hidden;
        }
        .usp-bar::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image: var(--girih-deep);
          background-size: 80px 80px;
          background-position: center;
          opacity: 0.07;
          pointer-events: none;
        }
        .usp-bar::after {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(70% 90% at 50% 0%, rgba(199,154,75,0.13) 0%, transparent 70%);
          pointer-events: none;
        }
        .usp-bar > .container { position: relative; z-index: 1; }
        .usp-panel {
          max-width: 1180px;
          margin: 0 auto;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          display: grid;
          grid-template-columns: 1fr;
          counter-reset: usp;
          overflow: visible;
          position: relative;
        }
        @media (min-width: 768px) { .usp-panel { grid-template-columns: repeat(3, 1fr); } }
        .usp-cell {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 46px 24px;
          border: none;
          counter-increment: usp;
          position: relative; z-index: 1;
        }
        /* Column separators are tapered gold hairlines, not flat grey borders —
           they fade out at both ends so the band reads as arcade bays. */
        .usp-cell::after {
          content: '';
          position: absolute;
          left: 12%; right: 12%; bottom: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(199,154,75,0.5), transparent);
        }
        .usp-cell:last-child::after { display: none; }
        /* Three stacked bays are a long scroll on a phone — the niche and its
           padding come down so the band stays roughly one-and-a-half screens. */
        @media (max-width: 767px) {
          .usp-cell { padding: 34px 22px; }
          .usp-icon { width: 68px; height: 82px; margin-bottom: 18px; }
          /* Section titles are 18px on mobile, so the USP promise line can't
             stay at 20px — that would make a card's body type louder than the
             section heading above it. */
          .usp-cell h5:first-of-type { font-size: 16.5px; }
          .usp-cell h4 { font-size: 16px; }
        }
        @media (min-width: 768px) {
          .usp-cell { padding: 56px 26px 58px; }
          .usp-cell::after {
            left: auto; right: 0; top: 14%; bottom: 14%; width: 1px; height: auto;
            background: linear-gradient(180deg, transparent, rgba(199,154,75,0.5), transparent);
          }
        }
        /* Bay index — the numeral that labels each niche. */
        .usp-cell::before {
          content: counter(usp, decimal-leading-zero);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: var(--label-tracking);
          color: var(--brand-gold-deep);
          margin-bottom: 16px;
        }
        /* The niche itself: an arch cut into the wall, gold hairline on the
           outside, a second hairline set in from it, lit from within. */
        .usp-icon {
          position: relative;
          width: 78px; height: 94px;
          display: grid; place-items: center;
          border-radius: var(--arch-sm);
          background: linear-gradient(180deg, var(--brand-gold-pale) 0%, #FFFFFF 100%);
          border: 1px solid var(--brand-gold);
          box-shadow: inset 0 0 26px rgba(199,154,75,0.16), 0 16px 30px -22px rgba(7,58,44,0.45);
          color: var(--brand-gold-deep);
          margin-bottom: 22px;
        }
        .usp-icon::after {
          content: '';
          position: absolute; inset: 5px;
          border-radius: var(--arch-sm);
          border: 1px solid rgba(199,154,75,0.32);
          pointer-events: none;
        }
        .usp-cell h4 {
          font-size: 18px; font-weight: 700;
          color: var(--brand-emerald);
          letter-spacing: -0.015em;
          margin: 0;
        }
        .usp-cell p, .usp-cell h5 {
          font-size: 14.5px; line-height: 1.6;
          color: var(--ink-muted);
          margin: 8px 0 0;
          max-width: 30ch;
        }
        /* The promise itself is the display line — it was set at body size in the
           scaffold, which flattened the whole bay into one grey block. */
        .usp-cell h5:first-of-type {
          font-family: var(--font-serif);
          font-size: 20px;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--brand-emerald);
          margin: 0;
          max-width: 18ch;
        }

        /* Shared package facts (weight, portions, video/doa/photo proof) and the
           add-on line — set below the section intro, narrower than the intro so
           they read as a footnote to the offer rather than another headline. */
        .products-note, .products-addons {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: 14px;
          line-height: 1.55;
          color: var(--ink-muted);
          max-width: 74ch;
          margin: 0 auto;
          text-align: center;
        }
        .products-note {
          padding: 12px 18px;
          background: var(--brand-gold-pale);
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--r-card);
        }
        .products-addons { font-size: 13px; color: var(--brand-gold-deep); font-weight: 600; }

        /* PRODUCTS */
        .products-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .products-grid { grid-template-columns: 1fr 1fr; } }
        /* PACKAGE CARDS — the kad kenduri.
           Was a white box with an inset photo and a bordered two-cell price
           panel bolted underneath. It is now a cream invitation plaque: the
           photograph runs full-bleed off the top edge and dissolves into the
           paper, the tier reads as a gold-foil tag stamped on the image, and the
           price ledger loses its box entirely — two ruled columns split by a
           gold hairline with a diamond at its waist. */
        .product-card {
          background: var(--brand-paper);
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 1px solid var(--brand-gold-ring);
          box-shadow: 0 22px 52px -30px rgba(7,58,44,0.40);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
          display: flex; flex-direction: column;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 34px 76px -30px rgba(199, 154, 75,0.45), 0 8px 18px -6px rgba(7,58,44,0.12); }
        .product-media {
          position: relative;
          aspect-ratio: 16 / 10;
          margin: 0;
          padding: 0;
          background: var(--brand-paper);
          border: none;
          border-radius: 0;
          overflow: hidden;
        }
        .product-media img { width: 100%; height: 100%; object-fit: cover; }
        /* Top scrim keeps the foil tag legible on any photograph; the bottom
           half of the gradient is the paper itself, so the image has no hard
           edge against the card body. */
        .product-media::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(7,58,44,0.44) 0%,
            rgba(7,58,44,0) 34%,
            rgba(251,247,239,0) 58%,
            rgba(251,247,239,0.86) 88%,
            var(--brand-paper) 100%);
          pointer-events: none;
        }
        .product-tag {
          position: absolute; top: 16px; left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          white-space: nowrap;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: var(--label-tracking);
          text-transform: uppercase;
          background: var(--gradient-gold);
          border: none;
          color: #16241E;
          padding: 7px 14px;
          border-radius: 999px;
          box-shadow: 0 10px 22px -10px rgba(199,154,75,0.85), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .product-body {
          padding: 6px 24px 24px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          gap: 8px; flex: 1;
        }
        .product-title {
          font-family: var(--font-serif);
          font-size: 24px; font-weight: 700;
          color: var(--brand-emerald); letter-spacing: -0.015em;
          margin: 0;
        }
        /* Arabesque flourish under the package name, as on a printed card. */
        .product-title::after {
          content: '';
          display: block;
          width: 84px; height: 10px;
          margin: 12px auto 0;
          background-image: var(--flourish);
          background-repeat: no-repeat;
          background-position: center;
        }
        /* No line clamp: the package descriptions carry the actual offer detail
           (Pilihan 1 vs 2, the katering Set A menu). Clipping them at three lines
           hid what the customer is buying. Cards sit on a stretch grid so the
           uneven heights even out per row. */
        .product-desc {
          font-size: 14.5px; line-height: 1.55;
          color: var(--ink-muted);
          margin: 0;
          max-width: 50ch;
        }
        /* Inclusions live in their own ruled container, as short lines rather
           than a prose paragraph — a customer scanning four packages compares
           lists far faster than sentences. */
        .product-includes {
          background: #FFFFFF;
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--r-card);
          padding: 14px 16px 15px;
          text-align: left;
          width: 100%;
        }
        .product-includes__label {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: var(--label-tracking);
          text-transform: uppercase;
          color: var(--brand-gold-deep);
          margin: 0 0 9px;
        }
        .product-includes__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
        .product-includes__list li {
          position: relative;
          padding-left: 20px;
          font-size: 13.5px;
          line-height: 1.45;
          color: var(--ink);
        }
        /* Gold check, drawn in CSS so no icon font or SVG per row. */
        .product-includes__list li::before {
          content: '';
          position: absolute;
          left: 3px; top: 5px;
          width: 5px; height: 9px;
          border: solid var(--brand-gold-deep);
          border-width: 0 1.8px 1.8px 0;
          transform: rotate(45deg);
        }

        .product-prices {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: stretch;
          width: 100%;
          gap: 0;
          margin: auto 0 16px;
          padding: 14px 0 0;
          border: none;
          border-top: 1px solid var(--brand-gold-ring);
          border-radius: 0;
          background: transparent;
          overflow: visible;
        }
        /* Values are pushed to a shared baseline so a label that wraps to two
           lines (it does at 390px) cannot stagger the two figures. */
        .price-cell { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 7px; padding: 2px 10px; text-align: center; }
        .price-cell .price-value { margin-top: auto; }
        .price-divider {
          position: relative;
          width: 1px;
          align-self: stretch;
          background: linear-gradient(180deg, transparent, var(--brand-gold-ring) 24%, var(--brand-gold-ring) 76%, transparent);
        }
        .price-divider::after {
          content: '';
          position: absolute; top: 50%; left: 50%;
          width: 7px; height: 7px;
          transform: translate(-50%, -50%) rotate(45deg);
          background: var(--brand-gold);
        }
        .price-label {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: var(--label-tracking);
          text-transform: uppercase;
          color: var(--brand-gold-deep);
        }
        .price-value {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 22px;
          color: var(--brand-emerald);
          letter-spacing: -0.01em;
          /* The servings figure is a phrase in en ("±80 distributed portions")
             and must break evenly rather than orphan its last word. */
          text-wrap: balance;
        }
        .price-cell:first-child .price-value { color: var(--brand-gold-deep); }
        /* Supabase can return an itemised price list instead of the two-cell
           ledger; it stacks rather than inheriting the two-column ruling. */
        .product-prices.price-list { display: flex; flex-direction: column; gap: 6px; }
        .price-line { font-size: 14.5px; color: var(--ink-muted); }
        .price-note { display: block; font-size: 12px; color: var(--ink-faint); }
        .product-cta { width: 100%; }

        /* CALC SECTION */
        .calc-section { color: #fff; }

        /* The page ground is cream, so this utility now supplies the *elevated*
           white surface that separates a section from the paper around it. */
        .bg-paper { background: #FFFFFF; }

        /* Image-backed sections */
        .section-bg-image { position: relative; overflow: hidden; isolation: isolate; }
        .section-bg-image > .container { position: relative; z-index: 2; }
        .section-bg-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(180deg, rgba(7,58,44,0.78) 0%, rgba(7,58,44,0.72) 100%);
        }
        .section-bg-process {
          background-image: url('/bg/process.jpg');
          background-size: cover;
          background-position: center;
          color: #fff;
        }
        .section-bg-reviews {
          background-image: url('/bg/reviews.jpg');
          background-size: cover;
          background-position: center;
          color: #fff;
        }
        .reviews-aggregate-light {
          color: #fff !important;
          background: rgba(255,255,255,0.12) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          backdrop-filter: blur(6px);
        }

        /* PROCESS */
        .process-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .process-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 980px) { .process-grid { grid-template-columns: repeat(4, 1fr); } }
        .process-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 28px 22px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .process-num {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 30px;
          color: var(--brand-gold);
          line-height: 1;
        }
        .process-card h4 { font-size: 17px; font-weight: 700; margin: 4px 0 0; color: var(--brand-emerald); }
        .process-card p, .process-card h5 { font-size: 14.5px; color: var(--ink-muted); line-height: 1.6; margin: 0; }

        /* WHY US — one ruled sheet, not four floating cards.
           The scaffold's 2×2 of white cards with a left accent bar is the most
           reused device in the repo. These four reasons are one document: a
           single white leaf on the cream ground, quartered by gold hairlines,
           each entry opened by a numbered arch well. */
        .why-section { position: relative; background: var(--brand-paper); overflow: hidden; isolation: isolate; }
        .why-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            radial-gradient(40% 60% at 0% 0%, rgba(199, 154, 75,0.10) 0%, transparent 60%),
            radial-gradient(50% 70% at 100% 100%, rgba(199, 154, 75,0.08) 0%, transparent 60%);
        }
        .why-section > .container { position: relative; z-index: 1; }
        .why-section .section-head h3 { color: var(--brand-emerald); }
        .why-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          counter-reset: why;
          max-width: 1080px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--radius-card);
          box-shadow: 0 28px 64px -38px rgba(7,58,44,0.45);
          overflow: hidden;
        }
        .why-card {
          counter-increment: why;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          padding: 34px 28px 32px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
        }
        .why-card + .why-card { border-top: 1px solid var(--brand-gold-ring); }
        @media (min-width: 640px) {
          .why-grid { grid-template-columns: 1fr 1fr; }
          .why-card + .why-card { border-top: none; }
          .why-card:nth-child(2n) { border-left: 1px solid var(--brand-gold-ring); }
          .why-card:nth-child(n + 3) { border-top: 1px solid var(--brand-gold-ring); }
        }
        /* Numbered arch well — the same niche as the USP bay, shrunk to a
           marginal ornament and inverted to pale gold on white. */
        .why-card::before {
          content: counter(why, decimal-leading-zero);
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 18px;
          color: var(--brand-gold-deep);
          width: 46px; height: 56px;
          display: grid; place-items: center;
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--arch-sm);
          background: var(--brand-gold-pale);
          margin-bottom: 18px;
        }
        .why-card h4 { font-size: 17px; font-weight: 700; color: var(--brand-emerald); margin: 0 0 8px; letter-spacing: -0.015em; }
        .why-card p, .why-card h5 { font-size: 14.5px; line-height: 1.65; color: var(--ink-muted); margin: 0; max-width: 40ch; }
        .why-card h5:first-of-type {
          font-family: var(--font-serif);
          font-size: 19px;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--brand-emerald);
          margin: 0 0 10px;
          max-width: 22ch;
        }

        /* REVIEWS */
        .reviews-aggregate {
          display: inline-flex; align-items: center; gap: 8px;
          font-weight: 600; font-size: 14px;
          color: var(--ink-muted);
          background: #fff;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }
        /* REVIEWS — glazed emerald testimoni plaques.
           Opaque white cards sat on the photograph like stickers. These are cut
           from the same dark glass as the background instead: a gold-hairline
           plaque, the quote centred under a serif quotation watermark, and the
           family signing off at the foot behind a gold rule with a struck
           initial disc. */
        .reviews-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 640px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }
        .review-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(7,58,44,0.58) 0%, rgba(7,58,44,0.80) 100%);
          backdrop-filter: blur(10px) saturate(130%);
          -webkit-backdrop-filter: blur(10px) saturate(130%);
          border: 1px solid rgba(199,154,75,0.40);
          border-radius: var(--radius-card);
          padding: 30px 24px 26px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          gap: 12px;
          box-shadow: 0 30px 64px -34px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        /* Watermark sits in the top-left corner, clear of the centred stack. */
        .review-card::before {
          content: '”';
          position: absolute; top: 0; left: 14px;
          font-family: var(--font-serif);
          font-size: 78px; line-height: 1;
          color: var(--brand-gold);
          opacity: 0.20;
          pointer-events: none;
        }
        .review-g { position: relative; display: inline-flex; margin-top: 6px; }
        .review-source {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 10px;
          letter-spacing: var(--label-tracking);
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .stars { display: inline-flex; gap: 3px; }
        .review-body { font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,0.90); margin: 0; }
        /* Signature block — ruled off, with the family's initial struck in gold. */
        .review-meta {
          margin-top: auto;
          padding-top: 18px;
          width: 100%;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          border-top: 1px solid rgba(199,154,75,0.28);
        }
        .review-avatar {
          width: 42px; height: 42px;
          display: grid; place-items: center;
          margin-bottom: 10px;
          border-radius: var(--r-pill);
          background: rgba(199,154,75,0.16);
          border: 1px solid var(--brand-gold);
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 18px;
          line-height: 1;
          color: var(--brand-gold-bright);
        }
        .review-author { font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: #fff; margin: 0; }
        .review-suburb { font-size: 12.5px; color: rgba(255,255,255,0.58); margin: 3px 0 0; }

        /* GALLERY */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }
        /* Each photo is matted and framed like a kenduri keepsake print: a cream
           mat, a gold hairline rule inset from it, and the wordmark watermarked
           in the corner over a soft scrim so a shared screenshot carries the
           brand. Decorative only — the <img> keeps its own descriptive alt. */
        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--brand-paper);
          padding: 6px;
          border: 1px solid var(--brand-gold-ring);
          box-shadow: 0 10px 24px -16px rgba(7,58,44,0.45);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
        }
        .gallery-item:hover {
          transform: translateY(-2px);
          border-color: var(--brand-gold);
          box-shadow: 0 18px 34px -18px rgba(7,58,44,0.55);
        }
        .gallery-item img {
          border-radius: calc(var(--radius-md) - 5px);
        }
        /* Inset gold rule — sits just inside the mat, above the photo. */
        .gallery-item::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(199,154,75,0.55);
          border-radius: calc(var(--radius-md) - 5px);
          pointer-events: none;
          z-index: 2;
        }
        /* Wordmark watermark, bottom-right, over a scrim that keeps it legible
           on both the bright food shots and the darker interiors. */
        .gallery-item::after {
          content: '';
          position: absolute;
          right: 6px; bottom: 6px; left: 6px;
          height: 48%;
          border-radius: 0 0 calc(var(--radius-md) - 5px) calc(var(--radius-md) - 5px);
          background:
            url('/brand/majlis-aqiqah-dark.png') no-repeat center bottom 13px / auto 42px,
            linear-gradient(180deg, rgba(7,58,44,0) 0%, rgba(7,58,44,0.45) 100%);
          opacity: 0.9;
          pointer-events: none;
          z-index: 2;
        }
        @media (max-width: 767px) {
          .gallery-item { padding: 4px; }
          .gallery-item::before { inset: 4px; }
          .gallery-item::after { right: 4px; bottom: 4px; left: 4px; background-size: auto 30px, auto; background-position: center bottom 9px, center; }
        }

        /* FAQ */
        .faq-container { max-width: 860px; }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .faq-item summary {
          padding: 18px 22px;
          font-weight: 600;
          font-size: 15.5px;
          color: var(--brand-emerald);
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after { content: '+'; font-weight: 700; color: var(--brand-gold); font-size: 22px; }
        .faq-item[open] summary::after { content: '−'; }
        .faq-item p, .faq-item h4 { padding: 0 22px 20px; font-size: 14.5px; line-height: 1.7; color: var(--ink-muted); margin: 0; font-weight: inherit; }

        /* LOCATIONS — the gazetteer.
           This is a different layout, not a restyle. The scaffold stacked a pill
           row over a three-column masonry of per-state link lists, which read as
           three unrelated columns of grey text. All 169 towns now sit inside one
           bound index: a headline band of the cities we are asked for most, then
           one ruled row per state — label in the margin, towns running as a
           single justified line of links separated by gold points. Every link is
           a plain crawlable <a>; nothing is behind a toggle. */
        .locations-index {
          max-width: 1180px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--radius-card);
          box-shadow: 0 30px 70px -40px rgba(7,58,44,0.45);
          overflow: hidden;
        }
        .top-cities {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
          margin: 0;
          padding: 24px 20px;
          background:
            linear-gradient(180deg, var(--brand-gold-pale) 0%, #FFFFFF 100%);
          border-bottom: 1px solid var(--brand-gold-ring);
        }
        .city-chip {
          padding: 9px 16px;
          background: #fff;
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--radius-pill);
          font-weight: 600;
          font-size: 13.5px;
          color: var(--brand-emerald);
          transition: background-color var(--dur) var(--ease-out),
                      border-color var(--dur) var(--ease-out),
                      color var(--dur) var(--ease-out),
                      transform var(--dur) var(--ease-out);
        }
        .city-chip:hover { background: var(--brand-emerald); border-color: var(--brand-emerald); color: #fff; }
        .city-chip:focus-visible { outline: 2px solid var(--brand-gold); outline-offset: 2px; }
        .city-chip:active { transform: translateY(1px); }
        .city-chip.is-current { background: var(--brand-emerald); border-color: var(--brand-emerald); color: #fff; }
        /* One row per state — the grid is gone. */
        .states-grid { display: block; }
        .state-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          padding: 18px 20px;
          text-align: center;
          border-top: 1px solid var(--line);
        }
        .state-block:first-child { border-top: none; }
        .state-block:nth-child(even) { background: rgba(251,247,239,0.7); }
        @media (min-width: 760px) {
          .state-block {
            grid-template-columns: 186px minmax(0, 1fr);
            gap: 0 26px;
            align-items: baseline;
            text-align: left;
            padding: 16px 28px;
          }
        }
        .state-block h4 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 11.5px;
          letter-spacing: var(--label-tracking);
          text-transform: uppercase;
          color: var(--brand-gold-deep);
          margin: 0;
          padding: 0;
          border-bottom: none;
        }
        .state-block ul {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-wrap: wrap; justify-content: center;
        }
        @media (min-width: 760px) { .state-block ul { justify-content: flex-start; } }
        .state-block li { display: inline-flex; align-items: center; }
        /* Separator trails its town rather than leading the next one, so a line
           that wraps never opens with an orphaned point. */
        .state-block li:not(:last-child)::after {
          content: '';
          width: 3px; height: 3px;
          margin: 0 11px;
          border-radius: 50%;
          background: var(--brand-gold);
          opacity: 0.75;
          flex: none;
        }
        .state-block a {
          display: inline-block;
          padding: 6px 0;
          color: var(--ink-muted);
          font-size: 14px;
          transition: color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out);
        }
        .state-block a:hover { color: var(--brand-gold-deep); }
        .state-block a:focus-visible { outline: 2px solid var(--brand-gold); outline-offset: 2px; border-radius: 4px; }
        .state-block a:active { transform: translateY(1px); }

        /* FINAL CTA */
        .final-cta {
          position: relative;
          color: #fff;
          overflow: hidden;
          padding: 96px 0;
        }
        .final-cta-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .final-cta-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(7,58,44,0.78), rgba(7,58,44,0.92));
        }
        .final-cta-inner {
          position: relative; z-index: 1;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 18px;
          max-width: 760px;
          margin: 0 auto;
        }
        .final-cta-inner h3 {
          font-size: clamp(1.75rem, 3.4vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0;
        }
        .final-cta-inner p {
          font-size: clamp(1rem, 1.25vw, 1.125rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.78);
          margin: 0;
        }
    `}</style>
  );
}
