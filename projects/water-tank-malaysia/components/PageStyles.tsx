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
          padding: 44px 0 52px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-charcoal);
          /* Mobile: darker on the left/top where the text sits, easing right */
          background-image:
            linear-gradient(115deg, rgba(10,37,64,0.93) 0%, rgba(10,37,64,0.85) 42%, rgba(10,37,64,0.66) 72%, rgba(10,37,64,0.52) 100%),
            url('/brand/bg-hero.png');
          background-size: cover, cover;
          background-position: center, center right;
          background-repeat: no-repeat, no-repeat;
          z-index: 0;
        }
        @media (min-width: 880px) {
          /* Desktop: solid navy on the left, fading to near-clear on the right so
             the rooftop King Kong tanks read clearly behind the left-aligned text. */
          .hero-bg {
            background-image:
              linear-gradient(90deg, rgba(10,37,64,0.95) 0%, rgba(10,37,64,0.9) 30%, rgba(10,37,64,0.66) 45%, rgba(10,37,64,0.2) 60%, rgba(10,37,64,0) 72%),
              url('/brand/bg-hero.png');
            background-size: cover, cover;
            background-position: center, center right;
          }
        }
        .hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(52% 70% at 12% 38%, rgba(53,180,240,0.14) 0%, transparent 60%);
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
        .hero-text { display: flex; flex-direction: column; gap: 14px; text-align: center; }
        @media (min-width: 880px) { .hero-text { text-align: left; align-items: flex-start; } }
        .hero-logo {
          display: block;
          width: clamp(120px, 13vw, 192px);
          height: auto;
          aspect-ratio: 600 / 441;
          margin: 4px auto 12px;
          object-fit: contain;
        }
        @media (min-width: 880px) { .hero-logo { margin: 4px 0 12px; } }
        /* Headings keep their natural casing from the source strings (proper Title Case with lowercase conjunctions). */
        .hero-text h1 {
          font-size: clamp(2rem, 4.6vw, 3.5rem);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0;
        }
        .hero-h1-accent { color: #56C1F5; }
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
          color: var(--brand-orange-bright);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.005em;
        }
        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          margin-top: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (min-width: 880px) { .hero-stats { justify-content: flex-start; } }
        .hero-stats > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        @media (min-width: 880px) { .hero-stats > div { align-items: flex-start; } }
        .hero-stat-num {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 28px;
          color: #fff;
          line-height: 1;
        }
        .hero-stat-label {
          font-family: var(--font-mono-stack);
          font-weight: 500;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .hero-stat-div { width: 1px; height: 32px; background: var(--brand-orange); opacity: 0.4; }
        .hero-image { position: relative; display: flex; justify-content: center; }
        .hero-image-img {
          width: 110%;
          max-width: 800px;
          height: auto;
          aspect-ratio: 1600 / 1137;
          filter: drop-shadow(0 36px 70px rgba(14, 123, 214, 0.28));
          border-radius: var(--radius-card);
        }
        @media (min-width: 880px) {
          .hero-image { justify-content: flex-end; }
          .hero-image-img { margin-right: calc(var(--gut) * -1); }
        }

        /* BRAND STRIP */
        .brand-strip { background: var(--brand-paper); padding: 32px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .brand-strip-eyebrow {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin: 0 0 16px;
          text-align: center;
        }
        .brand-strip-track {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .marquee-track { display: inline-flex; gap: 40px; padding: 6px 0; white-space: nowrap; will-change: transform; }
        .brand-chip {
          color: var(--ink-muted);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.01em;
          padding: 8px 18px;
          border: 1px solid var(--line);
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* USP — floating residential cards on a soft water-blue wash */
        .usp-bar { padding: 76px 0; background: linear-gradient(180deg, #EAF4FD 0%, #FFFFFF 100%); border-bottom: 1px solid var(--line); }
        .usp-panel {
          max-width: 1120px;
          margin: 0 auto;
          background: transparent; border: none; box-shadow: none; overflow: visible;
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
        }
        @media (min-width: 768px) { .usp-panel { grid-template-columns: repeat(3, 1fr); } }
        .usp-cell {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 42px 28px 34px;
          background: #fff;
          border: 1px solid #E1EEFA;
          border-radius: 24px;
          box-shadow: 0 22px 48px -24px rgba(14,123,214,0.34), 0 4px 12px -6px rgba(10,37,64,0.06);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
        }
        .usp-cell:hover { transform: translateY(-5px); box-shadow: 0 32px 64px -26px rgba(14,123,214,0.44); }
        .usp-icon {
          width: 74px; height: 74px; display: grid; place-items: center;
          border-radius: 50%;
          background: linear-gradient(140deg, var(--brand-orange-bright) 0%, var(--brand-orange) 52%, var(--brand-orange-deep) 100%);
          box-shadow: 0 16px 32px -10px rgba(14,123,214,0.6), inset 0 0 0 1px rgba(255,255,255,0.28);
          color: #fff;
          margin-bottom: 22px;
        }
        .usp-cell h5:first-of-type {
          font-size: 19px; font-weight: 800;
          color: var(--brand-charcoal);
          letter-spacing: -0.02em;
          margin: 0;
        }
        .usp-cell h5:last-of-type {
          font-size: 14.5px; line-height: 1.6;
          color: var(--ink-muted);
          margin: 10px 0 0;
          max-width: 32ch;
          font-weight: 500;
        }

        /* PRODUCTS — clean residential catalogue cards */
        .products-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 560px) { .products-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
        .product-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #E1EEFA;
          box-shadow: 0 20px 48px -26px rgba(14,123,214,0.28), 0 3px 10px -4px rgba(10,37,64,0.06);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
          display: flex; flex-direction: column;
        }
        .product-card:hover { transform: translateY(-6px); box-shadow: 0 36px 72px -28px rgba(14,123,214,0.44); }
        .product-media {
          position: relative;
          aspect-ratio: 16 / 10;
          background: linear-gradient(160deg, #EAF4FD 0%, #F7FBFF 100%);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          padding: 20px;
        }
        .product-media img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
        .product-tag {
          position: absolute; top: 14px; left: 14px;
          font-weight: 700; font-size: 11px;
          letter-spacing: 0.03em;
          background: linear-gradient(135deg, var(--brand-orange-bright), var(--brand-orange));
          color: #fff;
          padding: 7px 13px;
          border-radius: 999px;
          box-shadow: 0 6px 16px -6px rgba(14,123,214,0.6);
        }
        .product-body { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .product-title {
          font-size: 20px; font-weight: 800;
          color: var(--brand-charcoal); letter-spacing: -0.02em;
          margin: 0;
        }
        .product-desc {
          font-size: 14.5px; line-height: 1.55;
          color: var(--ink-muted);
          margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Clean price block — FROM label, big black price, struck 'was' inline */
        .product-prices, .product-prices-single {
          display: block;
          border: none; background: transparent; border-radius: 0; overflow: visible;
          margin: 8px 0 2px; padding: 14px 0 0;
          border-top: 1px solid #EAF2FA;
        }
        .price-cell { display: block; padding: 0; text-align: left; }
        .price-from-label {
          display: block;
          font-family: var(--font-mono-stack);
          font-weight: 700; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 3px;
        }
        .price-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
        .price-value {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 30px;
          color: var(--brand-orange);
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .price-was {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          color: var(--ink-faint);
          text-decoration: line-through;
          text-decoration-color: rgba(120,132,146,0.75);
          line-height: 1;
        }
        .product-prices.price-list { display: flex; flex-direction: column; align-items: stretch; padding: 4px 16px; text-align: left; }
        .price-line { font-family: var(--font-mono-stack); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color: var(--brand-charcoal); padding: 11px 0; border-bottom: 1px solid var(--line); }
        .price-line:last-child { border-bottom: none; }
        .price-line:first-child { color: var(--brand-orange); }
        .price-note { display: block; margin-top: 3px; font-weight: 400; font-size: 11px; letter-spacing: 0.02em; text-transform: none; color: var(--ink-muted); }
        .product-cta { margin-top: 14px; width: 100%; }

        /* Featured product (Water Tank) — large split card above the pump row */
        .product-feature {
          display: grid; grid-template-columns: 1fr;
          background: #fff;
          border: 1px solid #E1EEFA;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 26px 58px -28px rgba(14,123,214,0.36), 0 4px 12px -6px rgba(10,37,64,0.06);
          margin-bottom: 26px;
        }
        @media (min-width: 768px) { .product-feature { grid-template-columns: 1.05fr 1fr; } }
        .product-feature-media { position: relative; min-height: 400px; background: linear-gradient(160deg, #EAF4FD 0%, #F7FBFF 100%); overflow: hidden; padding: 14px; }
        .product-feature-media img { position: absolute; inset: 14px; width: auto; height: auto; max-width: calc(100% - 28px); max-height: calc(100% - 28px); margin: auto; object-fit: contain; }
        .product-feature-media .product-tag { top: 18px; left: 18px; font-size: 12px; padding: 8px 15px; }
        .product-feature-body { padding: 36px 34px; display: flex; flex-direction: column; gap: 14px; justify-content: center; }
        .product-feature-body .product-title { font-size: 30px; }
        .product-feature-body .product-desc { -webkit-line-clamp: 3; font-size: 15.5px; line-height: 1.6; }
        .product-feature-body .price-value { font-size: 30px; }
        .product-feature-body .price-was { font-size: 15px; }
        .product-feature-body .product-cta { max-width: 320px; }
        @media (max-width: 767px) {
          .product-feature-media { min-height: 220px; }
          .product-feature-body { padding: 26px 22px 28px; text-align: center; align-items: center; }
          .product-feature-body .price-cell { align-items: center; }
          .product-feature-body .product-cta { max-width: none; width: 100%; }
        }

        /* Pump cards — 2 across (one per brand), each listing its HP prices */
        .pump-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
        @media (min-width: 640px) { .pump-grid { grid-template-columns: 1fr 1fr; } }
        .pump-prices { display: flex; flex-direction: column; margin: 8px 0 2px; border-top: 1px solid #EAF2FA; }
        .pump-price-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid #F0F5FA;
        }
        .pump-price-row:last-child { border-bottom: none; }
        .pump-hp {
          display: inline-flex; align-items: center; gap: 8px;
          font-weight: 700; font-size: 14px; color: var(--brand-charcoal);
        }
        .pump-hp::before {
          content: ''; width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
        }
        .pump-price {
          font-family: var(--font-display); font-weight: 800; font-size: 21px;
          color: var(--brand-orange); letter-spacing: -0.02em;
        }
        .pump-from {
          font-family: var(--font-mono-stack); font-weight: 700; font-size: 9.5px;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint);
          margin-right: 3px;
        }

        /* Branded tile for photoless products */
        .product-tile {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
          width: 100%; height: 100%; border-radius: 12px;
          background: var(--gradient-charcoal);
        }
        .product-tile svg { width: 56px; height: 56px; }
        .product-tile span {
          font-family: var(--font-mono-stack); font-weight: 700; font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.85);
        }

        /* Solo hero — the .container stays centred (so its left edge lines up with the
           header nav); the text column is constrained + left-aligned INSIDE it. */
        .hero-grid-solo { grid-template-columns: 1fr; }
        @media (min-width: 880px) {
          .hero-solo .hero-text { text-align: left !important; align-items: flex-start !important; max-width: 600px; }
          .hero-solo .hero-support { margin-left: 0; margin-right: auto; }
        }

        /* COMBO PACKAGES — premium white package cards on a water-blue gradient */
        .combo-section { position: relative; overflow: hidden; isolation: isolate; color: #fff; }
        .combo-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            linear-gradient(150deg, rgba(14,123,214,0.88) 0%, rgba(10,90,168,0.85) 55%, rgba(10,37,64,0.92) 100%),
            url('/brand/combo-bg.png');
          background-size: cover, cover;
          background-position: center, center;
        }
        .combo-bg::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(50% 60% at 85% 12%, rgba(53,180,240,0.38) 0%, transparent 60%),
            radial-gradient(45% 55% at 8% 92%, rgba(53,180,240,0.22) 0%, transparent 60%);
        }
        .combo-section > .container { position: relative; z-index: 1; }
        .combo-intro { color: rgba(255,255,255,0.86); max-width: 60ch; margin: 0 auto; }
        .combo-grid { display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 16px; align-items: stretch; }
        /* Wider gap on desktop so the scaled-up "Paling Popular" card doesn't crowd its neighbour */
        @media (min-width: 880px) { .combo-grid { grid-template-columns: repeat(3, 1fr); align-items: center; gap: 44px; } }
        .combo-card {
          position: relative; display: flex; flex-direction: column; gap: 12px;
          background: #fff;
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 24px;
          padding: 30px 26px 28px;
          box-shadow: 0 30px 60px -30px rgba(3,20,40,0.6);
        }
        .combo-card-feature {
          border: 3px solid var(--brand-orange-bright);
          box-shadow: 0 56px 104px -28px rgba(3,20,40,0.82), 0 0 0 6px rgba(53,180,240,0.16);
        }
        @media (min-width: 880px) { .combo-card-feature { transform: scale(1.09) translateY(-8px); z-index: 3; } }
        .combo-cardtag {
          align-self: flex-start;
          font-weight: 800; font-size: 10.5px;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: linear-gradient(135deg, var(--brand-orange-bright), var(--brand-orange));
          color: #fff; padding: 6px 12px; border-radius: 999px;
          box-shadow: 0 6px 14px -6px rgba(14,123,214,0.6);
        }
        .combo-name { font-size: 21px; font-weight: 800; color: var(--brand-charcoal); margin: 0; letter-spacing: -0.02em; }
        .combo-spec { font-size: 14px; line-height: 1.6; color: var(--ink-muted); margin: 0; flex: 1; padding-bottom: 12px; border-bottom: 1px dashed #D6E6F5; }
        .combo-price { font-family: var(--font-display); font-weight: 800; font-size: 30px; color: var(--brand-orange); letter-spacing: -0.02em; }
        .combo-cta { width: 100%; }
        .combo-note { text-align: center; margin-top: 26px; color: rgba(255,255,255,0.85); font-family: var(--font-display); font-weight: 600; font-size: 13px; letter-spacing: 0.01em; text-transform: none; }

        /* CALC SECTION */
        .calc-section { color: #fff; }

        .bg-paper { background: var(--brand-paper); }

        /* Image-backed sections */
        .section-bg-image { position: relative; overflow: hidden; isolation: isolate; }
        .section-bg-image > .container { position: relative; z-index: 2; }
        .section-bg-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(180deg, rgba(15,15,15,0.78) 0%, rgba(15,15,15,0.72) 100%);
        }
        .section-bg-process {
          background-image: url('/brand/combo-bg.png');
          background-size: cover;
          background-position: center;
          color: #fff;
        }
        .section-bg-reviews {
          background-image: url('/brand/final-cta.png');
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

        /* PROCESS — connected numbered step flow on a soft wash */
        .process-section { background: linear-gradient(180deg, #FFFFFF 0%, #EFF7FE 100%); }
        .steps-flow { display: grid; grid-template-columns: 1fr; gap: 30px; margin-top: 8px; }
        @media (min-width: 880px) { .steps-flow { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
        .step-item { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
        .step-badge {
          width: 66px; height: 66px; border-radius: 50%;
          display: grid; place-items: center;
          background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
          color: #fff; font-family: var(--font-display); font-weight: 800; font-size: 27px;
          box-shadow: 0 16px 30px -10px rgba(14,123,214,0.6), inset 0 0 0 1px rgba(255,255,255,0.25);
          position: relative; z-index: 1;
        }
        @media (min-width: 880px) {
          .step-item:not(:last-child)::after {
            content: ''; position: absolute; top: 32px; left: 50%; width: 100%;
            transform: translateX(42px);
            height: 2px;
            background: repeating-linear-gradient(90deg, var(--brand-orange-ring) 0 8px, transparent 8px 16px);
            z-index: 0;
          }
        }
        .step-title { font-size: 17.5px; font-weight: 800; color: var(--brand-charcoal); margin: 6px 0 0; letter-spacing: -0.01em; }
        .step-body { font-size: 14px; line-height: 1.55; color: var(--ink-muted); margin: 0; max-width: 26ch; }

        /* WHY US */
        .why-section { position: relative; background: var(--brand-paper); overflow: hidden; isolation: isolate; }
        .why-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            radial-gradient(40% 60% at 0% 0%, rgba(14, 123, 214,0.08) 0%, transparent 60%),
            radial-gradient(50% 70% at 100% 100%, rgba(14, 123, 214,0.06) 0%, transparent 60%);
        }
        .why-section > .container { position: relative; z-index: 1; }
        .why-section .section-head h3 { color: var(--brand-charcoal); }
        .why-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 720px) { .why-grid { grid-template-columns: 1fr 1fr; } }
        .why-card {
          display: flex; gap: 16px; align-items: flex-start;
          background: #fff;
          border: 1px solid #E1EEFA;
          border-radius: 20px;
          padding: 24px 24px;
          box-shadow: 0 16px 38px -26px rgba(14,123,214,0.26);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
        }
        .why-card:hover { transform: translateY(-4px); box-shadow: 0 28px 56px -28px rgba(14,123,214,0.42); }
        .why-icon {
          flex: none; width: 54px; height: 54px; border-radius: 15px;
          display: grid; place-items: center;
          background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
          color: #fff;
          box-shadow: 0 12px 24px -10px rgba(14,123,214,0.55);
        }
        .why-icon svg { width: 26px; height: 26px; }
        .why-title { font-size: 17px; font-weight: 800; color: var(--brand-charcoal); margin: 2px 0 0; letter-spacing: -0.015em; }
        .why-body { font-size: 14px; line-height: 1.6; color: var(--ink-muted); margin: 7px 0 0; }
        @media (max-width: 719px) { .why-card { text-align: left; } }

        /* REVIEWS — light testimonial cards with reviewer avatars */
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

        /* GALLERY — gradient-border cards, branded with the logo on a dark bottom strip */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        .gallery-item {
          border-radius: 20px;
          padding: 9px;
          background: linear-gradient(140deg, #56C1F5 0%, #0E7BD6 45%, #0A2540 100%);
          box-shadow: 0 14px 30px -18px rgba(14,123,214,0.42);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
        }
        .gallery-item:hover { transform: translateY(-4px); box-shadow: 0 24px 44px -20px rgba(14,123,214,0.55); }
        .gallery-inner {
          position: relative;
          aspect-ratio: 1;
          border-radius: 15px;
          overflow: hidden;
          background: #eef2f6;
        }
        .gallery-photo { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-out); }
        .gallery-item:hover .gallery-photo { transform: scale(1.06); }
        .gallery-logo {
          position: absolute; left: 0; right: 0; bottom: 0;
          display: flex; justify-content: center; align-items: flex-end;
          padding: 44px 12px 14px;
          background: linear-gradient(180deg, rgba(10,37,64,0) 0%, rgba(10,37,64,0.42) 100%);
          pointer-events: none;
        }
        .gallery-logo img { width: clamp(64px, 30%, 92px); height: auto; opacity: 0.97; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.6)); }
        /* Thinner gradient border on mobile */
        @media (max-width: 767px) {
          .gallery-item { padding: 4px; border-radius: 15px; }
          .gallery-inner { border-radius: 12px; }
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
          color: var(--brand-charcoal);
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after { content: '+'; font-weight: 700; color: var(--brand-orange); font-size: 22px; }
        .faq-item[open] summary::after { content: '−'; }
        .faq-item p, .faq-item h4 { padding: 0 22px 20px; font-size: 14.5px; line-height: 1.7; color: var(--ink-muted); margin: 0; font-weight: inherit; }

        /* LOCATIONS — top-city chips + tidy state cards */
        .top-cities {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 9px;
          margin-bottom: 40px;
        }
        .city-chip {
          padding: 9px 18px;
          background: #fff;
          border: 1px solid #DBEBFA;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13.5px;
          color: var(--brand-charcoal);
          box-shadow: 0 6px 16px -10px rgba(14,123,214,0.3);
          transition: transform var(--dur) var(--ease-out), background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
        }
        .city-chip:hover { transform: translateY(-2px); background: var(--brand-orange); border-color: var(--brand-orange); color: #fff; }
        .states-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 640px) { .states-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .states-grid { grid-template-columns: repeat(3, 1fr); } }
        .state-block {
          background: #fff; border: 1px solid #E1EEFA; border-radius: 18px;
          padding: 22px 22px 20px;
          box-shadow: 0 16px 36px -28px rgba(14,123,214,0.28);
        }
        .state-block h4 {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display);
          font-weight: 800; font-size: 15px; letter-spacing: -0.01em; text-transform: none;
          color: var(--brand-charcoal);
          margin: 0 0 14px; padding-bottom: 12px;
          border-bottom: 1px solid #EAF2FA;
        }
        .state-block h4::before {
          content: ''; flex: none; width: 9px; height: 9px; border-radius: 50%;
          background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
          box-shadow: 0 0 0 4px rgba(14,123,214,0.12);
        }
        .state-block ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
        .state-block a { color: var(--ink-muted); font-size: 13.5px; font-weight: 500; transition: color var(--dur) var(--ease-out), padding-left var(--dur) var(--ease-out); }
        .state-block a:hover { color: var(--brand-orange-deep); padding-left: 3px; }

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
          background: linear-gradient(135deg, rgba(15,15,15,0.78), rgba(15,15,15,0.92));
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
