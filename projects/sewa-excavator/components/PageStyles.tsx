// Shared page-level styles for the homepage and location pages.
// Inlines a single <style> block so every public-facing page renders with the
// exact same hero, USP, product card, calculator, marquee, reviews, gallery,
// FAQ, locations grid, and final CTA styling.
export default function PageStyles() {
  return (
    <style>{`
        /* Headings used as inline body / label text — reset to avoid huge defaults */
        .usp-cell h5, .process-card h5, .why-card h5, .faq-item h4, .product-desc, .review-body, .review-author, .review-suburb, .hero-support, .reviews-aggregate, .process-num, h4.process-num, h5.process-num, h6.process-num { font-weight: inherit; }
        /* HERO */
        .hero {
          position: relative;
          color: #fff;
          padding: 80px 0 96px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-charcoal);
          background-image:
            linear-gradient(180deg, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.78) 70%, rgba(15,15,15,0.92) 100%),
            linear-gradient(90deg, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.35) 55%, rgba(15,15,15,0.15) 100%),
            url('/brand/bg-hero.jpg');
          background-size: cover, cover, cover;
          background-position: center, center, center right;
          background-repeat: no-repeat, no-repeat, no-repeat;
          z-index: 0;
        }
        .hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(60% 80% at 20% 30%, rgba(242,108,31,0.18) 0%, transparent 60%),
            radial-gradient(50% 70% at 90% 80%, rgba(242,108,31,0.10) 0%, transparent 70%);
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
          font-size: clamp(2.25rem, 5.5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: #fff;
          margin: 0;
        }
        .hero-h1-accent { color: var(--brand-orange); }
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
          filter: drop-shadow(0 36px 70px rgba(242, 108, 31, 0.28));
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

        /* USP */
        .usp-bar { padding: 72px 0; background: var(--brand-paper); border-bottom: 1px solid var(--line); }
        .usp-panel {
          max-width: 1080px;
          margin: 0 auto;
          background: var(--brand-charcoal);
          border: 1px solid var(--brand-charcoal);
          border-radius: var(--radius-card);
          box-shadow: 0 30px 80px -20px rgba(15,15,15,0.35), 0 12px 30px -10px rgba(242,108,31,0.18);
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
          position: relative;
        }
        .usp-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(60% 100% at 50% 0%, rgba(242,108,31,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (min-width: 768px) { .usp-panel { grid-template-columns: repeat(3, 1fr); } }
        .usp-cell {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 44px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative; z-index: 1;
        }
        .usp-cell:last-child { border-bottom: none; }
        @media (min-width: 768px) {
          .usp-cell { border-bottom: none; border-right: 1px solid rgba(255,255,255,0.08); padding: 52px 28px; }
          .usp-cell:last-child { border-right: none; }
        }
        .usp-icon {
          width: 72px; height: 72px; display: grid; place-items: center;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-deep) 100%);
          box-shadow: 0 12px 30px -10px rgba(242,108,31,0.6), inset 0 0 0 1px rgba(255,255,255,0.18);
          color: #fff;
          margin-bottom: 20px;
        }
        .usp-cell h4 {
          font-size: 18px; font-weight: 700;
          color: #fff;
          letter-spacing: -0.015em;
          margin: 0;
        }
        .usp-cell p, .usp-cell h5 {
          font-size: 14.5px; line-height: 1.6;
          color: rgba(255,255,255,0.7);
          margin: 8px 0 0;
          max-width: 32ch;
        }

        /* PRODUCTS */
        .products-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .products-grid { grid-template-columns: 1fr 1fr; } }
        .product-card {
          background: #fff;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 1px solid var(--line);
          box-shadow: 0 24px 60px -24px rgba(15,15,15,0.25), 0 4px 12px -4px rgba(15,15,15,0.08);
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
          display: flex; flex-direction: column;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 32px 80px -24px rgba(242,108,31,0.32), 0 8px 18px -6px rgba(15,15,15,0.12); }
        .product-media {
          position: relative;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(80% 60% at 50% 100%, rgba(242,108,31,0.12) 0%, transparent 70%),
            linear-gradient(180deg, #FFFFFF 0%, #FFF6EE 100%);
          padding: 22px;
          display: grid; place-items: center;
          border-bottom: 1px solid var(--line);
        }
        .product-media img { width: 100%; height: 100%; object-fit: contain; }
        .product-tag {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: var(--brand-charcoal);
          color: #fff;
          padding: 6px 10px;
          border-radius: 999px;
        }
        .product-body { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .product-title {
          font-size: 22px; font-weight: 700;
          color: var(--brand-charcoal); letter-spacing: -0.02em;
          margin: 0;
        }
        .product-desc {
          font-size: 15px; line-height: 1.55;
          color: var(--ink-muted);
          margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-prices {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: stretch;
          gap: 0;
          margin: 10px 0 6px;
          padding: 0;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--brand-paper);
          overflow: hidden;
        }
        .price-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 10px; text-align: center; }
        .price-divider { width: 1px; background: var(--line); }
        .price-label {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .price-value {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 17px;
          color: var(--brand-charcoal);
          letter-spacing: -0.01em;
        }
        .price-cell:first-child .price-value { color: var(--brand-orange); }
        .product-cta { margin-top: auto; }

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
          background-image: url('/bg/bg-3.webp');
          background-size: cover;
          background-position: center;
          color: #fff;
        }
        .section-bg-reviews {
          background-image: url('/bg/bg-4.png');
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
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 28px;
          color: var(--brand-orange);
          line-height: 1;
        }
        .process-card h4 { font-size: 17px; font-weight: 700; margin: 4px 0 0; color: var(--brand-charcoal); }
        .process-card p, .process-card h5 { font-size: 14.5px; color: var(--ink-muted); line-height: 1.6; margin: 0; }

        /* WHY US */
        .why-section { position: relative; background: var(--brand-paper); overflow: hidden; isolation: isolate; }
        .why-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            radial-gradient(40% 60% at 0% 0%, rgba(242,108,31,0.08) 0%, transparent 60%),
            radial-gradient(50% 70% at 100% 100%, rgba(242,108,31,0.06) 0%, transparent 60%);
        }
        .why-section > .container { position: relative; z-index: 1; }
        .why-section .section-head h3 { color: var(--brand-charcoal); }
        .why-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .why-grid { grid-template-columns: 1fr 1fr; } }
        .why-card {
          background: #fff;
          border: 1px solid var(--line);
          border-left: 3px solid var(--brand-orange);
          border-radius: var(--radius-md);
          padding: 26px 24px;
          box-shadow: 0 4px 14px -6px rgba(15,15,15,0.06);
        }
        .why-card h4 { font-size: 17px; font-weight: 700; color: var(--brand-charcoal); margin: 0 0 8px; letter-spacing: -0.015em; }
        .why-card p, .why-card h5 { font-size: 14.5px; line-height: 1.65; color: var(--ink-muted); margin: 0; }

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
        .reviews-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }
        .review-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 24px 22px;
          display: flex; flex-direction: column; gap: 12px;
          box-shadow: var(--shadow-sm);
        }
        .review-g { position: absolute; top: 18px; right: 18px; display: inline-flex; }
        .review-source {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .stars { display: inline-flex; gap: 2px; }
        .review-body { font-size: 14.5px; line-height: 1.65; color: var(--ink); margin: 0; }
        .review-author { font-size: 14px; font-weight: 700; color: var(--brand-charcoal); margin: 0; }
        .review-suburb { font-size: 12.5px; color: var(--ink-muted); margin: 2px 0 0; }

        /* GALLERY */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }
        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #f3f4f6;
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

        /* LOCATIONS */
        .top-cities {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
          margin-bottom: 40px;
        }
        .city-chip {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 999px;
          font-weight: 600;
          font-size: 13.5px;
          color: var(--brand-charcoal);
          transition: background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
        }
        .city-chip:hover { background: var(--brand-orange-pale); border-color: var(--brand-orange-ring); color: var(--brand-orange-deep); }
        .states-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 640px) { .states-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .states-grid { grid-template-columns: repeat(3, 1fr); } }
        .state-block h4 {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--brand-orange-deep);
          margin: 0 0 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--brand-orange-ring);
        }
        .state-block ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
        .state-block a { color: var(--ink-muted); font-size: 14px; transition: color var(--dur) var(--ease-out); }
        .state-block a:hover { color: var(--brand-orange-deep); }

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
