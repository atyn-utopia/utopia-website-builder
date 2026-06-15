// Shared page styles — mirrors hotelforsale.my's light corporate look.
// Used by the homepage and the location pages (same section system, localised copy).
export default function PageStyles() {
  return (
    <style>{`
      /* Heading-tag normaliser: body copy wrapped in headings inherits weight. */
      .lp-head p, .lp-hero-sub, .usp3-card h5, .step-card h5, .seller2-body,
      .hotel-card-loc, .hotel-card-desc, .lp-hero h5 { font-weight: inherit; }

      .lp-section { padding: clamp(48px, 7vw, 80px) 0; background: #fff; }
      .lp-section.alt { background: var(--section-alt); }
      .lp-head { text-align: center; max-width: 1040px; margin: 0 auto clamp(32px, 4vw, 48px); display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .lp-head h2, .lp-head h3 { font-size: clamp(1.8rem, 3.6vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; color: var(--brand-navy); margin: 0; text-wrap: balance; }
      .lp-head h5 { font-weight: inherit; }
      .lp-head p, .lp-head .lp-sub { font-size: clamp(1rem, 1.25vw, 1.15rem); line-height: 1.6; color: var(--ink-muted); margin: 0; max-width: 760px; }
      .accent { color: var(--brand-orange); }

      /* HERO — light background blended with a hotel photo on the right.
         To swap the photo, change the url() in --hero-photo below. */
      .lp-hero {
        --hero-photo: url('/brand/hero.jpg');
        position: relative;
        background:
          linear-gradient(90deg, rgba(244,247,251,0.97) 0%, rgba(244,247,251,0.93) 42%, rgba(244,247,251,0.84) 72%, rgba(244,247,251,0.74) 100%),
          linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(244,247,251,0.18) 50%, rgba(244,247,251,0.55) 100%),
          var(--hero-photo);
        background-size: cover, cover, cover;
        background-position: center, center, center right;
        background-repeat: no-repeat;
        border-bottom: 1px solid var(--line);
        padding: clamp(40px, 6vw, 72px) 0 clamp(40px, 6vw, 64px);
      }
      @media (max-width: 760px) {
        .lp-hero {
          background:
            linear-gradient(180deg, rgba(244,247,251,0.95) 0%, rgba(244,247,251,0.90) 55%, rgba(244,247,251,0.96) 100%),
            var(--hero-photo);
          background-size: cover, cover;
          background-position: center, center;
        }
      }
      .lp-hero-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; max-width: 1120px; }
      @media (min-width: 900px) { .lp-hero-inner { align-items: flex-start; text-align: left; } }
      .lp-hero-crumb { font-size: 13px; color: var(--ink-muted); }
      .lp-hero-crumb a:hover { color: var(--brand-orange-deep); }
      .lp-hero h1 { font-size: clamp(2.1rem, 5.2vw, 4rem); font-weight: 700; letter-spacing: -0.035em; line-height: 1.04; color: var(--brand-navy); margin: 0; }
      .lp-hero h2 { font-size: clamp(2.1rem, 5.2vw, 4rem); font-weight: 700; letter-spacing: -0.035em; line-height: 1.04; color: var(--brand-orange); margin: -6px 0 0; }
      .lp-hero h5 { font-size: clamp(1rem, 1.4vw, 1.18rem); line-height: 1.6; color: var(--ink-muted); margin: 6px 0 0; max-width: 60ch; }
      .lp-hero h5 .accent { font-weight: 700; }
      /* Rotating hero word: Hotel → Motel → Resort */
      .rotating-word { display: inline-flex; flex-direction: column; align-items: center; height: 1.02em; overflow: hidden; vertical-align: bottom; color: var(--brand-orange); }
      .rotating-word-list { display: flex; flex-direction: column; }
      .rotating-word-list > span { display: block; height: 1.02em; line-height: 1.02em; white-space: nowrap; }
      @media (prefers-reduced-motion: no-preference) {
        .rotating-word-list { animation: rotate-words 7.5s cubic-bezier(0.7, 0, 0.2, 1) infinite; }
      }
      @keyframes rotate-words {
        0%, 24%   { transform: translateY(0); }
        33%, 57%  { transform: translateY(-1.02em); }
        66%, 90%  { transform: translateY(-2.04em); }
        100%      { transform: translateY(-3.06em); }
      }
      .lp-hero-cta { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; margin-top: 8px; }
      @media (min-width: 900px) { .lp-hero-cta { justify-content: flex-start; } }
      .lp-hero-stats { display: inline-flex; flex-wrap: wrap; gap: 22px; margin-top: 14px; justify-content: center; }
      @media (min-width: 900px) { .lp-hero-stats { justify-content: flex-start; } }
      .lp-hero-stat { display: flex; flex-direction: column; }
      .lp-hero-statnum { font-size: 26px; font-weight: 700; color: var(--brand-navy); line-height: 1; }
      .lp-hero-statlabel { font-size: 12px; font-weight: 500; color: var(--ink-muted); margin-top: 4px; }
      /* PARTNERS */
      .partners { background: #fff; border-bottom: 1px solid var(--line); padding: 26px 0 30px; }
      .partners-title { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); margin: 0 0 16px; }
      .partners-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px 34px; }
      .partner-logo { font-size: 17px; font-weight: 700; letter-spacing: 0.02em; color: #98A2B3; opacity: 0.85; transition: color var(--dur) var(--ease-out); }
      .partner-logo:hover { color: var(--brand-navy); }

      /* USP 3-up */
      .usp3 { display: grid; grid-template-columns: 1fr; gap: 28px; }
      @media (min-width: 760px) { .usp3 { grid-template-columns: repeat(3, 1fr); gap: 24px; } }
      .usp3-card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; padding: 8px 16px; }
      .usp3-icon { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; background: #fff; border: 2px solid var(--brand-navy); color: var(--brand-navy); }
      .usp3-icon svg { width: 34px; height: 34px; }
      .usp3-card h3, .usp3-card h4 { font-size: 19px; font-weight: 700; color: var(--brand-navy); margin: 4px 0 0; }
      .usp3-card h5 { font-size: 14.5px; line-height: 1.6; color: var(--ink-muted); margin: 0; max-width: 34ch; }

      /* Hot list grid — up to 5 across on desktop */
      .hotlist-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      @media (min-width: 560px) { .hotlist-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
      @media (min-width: 1080px) { .hotlist-grid { grid-template-columns: repeat(5, 1fr); } }
      /* Mobile: swipeable carousel showing one card at a time */
      @media (max-width: 559px) {
        .hotlist-grid {
          display: flex;
          grid-template-columns: none;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 12px;
          margin-inline: calc(var(--gut) * -1);
          padding: 4px var(--gut) 12px;
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-padding-inline: var(--gut);
        }
        .hotlist-grid::-webkit-scrollbar { display: none; }
        .hotlist-grid > .hotel-card { flex: 0 0 88%; scroll-snap-align: center; }
      }
      .lp-more { display: flex; justify-content: center; margin-top: 40px; }

      /* CTA band (light) */
      .ctaband {
        position: relative; text-align: center;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.92)),
          url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=70');
        background-size: cover; background-position: center;
        padding: clamp(44px, 6vw, 72px) 0;
      }
      .ctaband-inner { display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 920px; margin: 0 auto; }
      .ctaband h2, .ctaband h3 { font-size: clamp(1.6rem, 3.2vw, 2.4rem); font-weight: 700; color: var(--brand-navy); margin: 0; line-height: 1.15; text-wrap: balance; }
      .ctaband h5 { font-weight: inherit; font-size: 16px; color: var(--ink-muted); margin: 0; }

      /* Agency band (dark navy) */
      .agencyband {
        position: relative; text-align: center; color: #fff; overflow: hidden;
        background: var(--brand-navy-deep);
        padding: clamp(48px, 6vw, 72px) 0;
      }
      .agencyband::before { content: ''; position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=60') center/cover; opacity: 0.12; }
      .agencyband-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .agencyband-logo { font-size: 26px; font-weight: 700; letter-spacing: 0.04em; color: #fff; }
      .agencyband-logo span { color: #34D17E; }
      .agencyband h3 { font-size: clamp(1.4rem, 2.6vw, 2rem); font-weight: 700; color: #fff; margin: 0; }
      .agencyband h5 { font-weight: inherit; font-size: 13px; letter-spacing: 0.04em; color: rgba(255,255,255,0.72); margin: 0; }
      .agencyband-badges { display: inline-flex; gap: 18px; margin-top: 6px; }
      .agencyband-badge { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.25); display: grid; place-items: center; color: #F5A623; }

      /* STEPS (process) */
      .steps { display: grid; grid-template-columns: 1fr; gap: 18px; max-width: 1000px; margin: 0 auto; }
      @media (min-width: 760px) { .steps { grid-template-columns: repeat(3, 1fr); } }
      .step-card { display: flex; gap: 16px; align-items: center; background: #fff; border: 1px solid #E3E8EF; border-radius: 14px; padding: 24px 22px; box-shadow: 0 6px 18px -14px rgba(22,53,107,0.3); }
      .step-num {
        flex-shrink: 0; width: 50px; height: 50px; border-radius: 50%;
        display: grid; place-items: center;
        font-size: 20px; font-weight: 800; color: #fff;
        background: var(--brand-orange);
        box-shadow: 0 10px 20px -6px rgba(239,65,35,0.5), 0 0 0 6px rgba(239,65,35,0.12);
      }
      .step-card h5.step-title { font-size: 16px; font-weight: 700; color: var(--brand-navy); margin: 0 0 5px; }
      .step-card h5.step-body { font-size: 14px; line-height: 1.55; color: var(--ink-muted); margin: 0; }

      /* SELLER (dark navy + photo) */
      .seller2 { background: var(--brand-navy-deep); color: #fff; overflow: hidden; }
      .seller2 .container { padding-top: 0; padding-bottom: 0; }
      .seller2-grid { display: grid; grid-template-columns: 1fr; align-items: center; }
      @media (min-width: 880px) { .seller2-grid { grid-template-columns: 1.1fr 0.9fr; } }
      .seller2-text { padding: clamp(40px, 6vw, 72px) 0; display: flex; flex-direction: column; gap: 14px; align-items: center; text-align: center; }
      @media (min-width: 880px) { .seller2-text { align-items: flex-start; text-align: left; padding-right: 48px; } }
      .seller2-text h3 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700; color: #fff; margin: 0; line-height: 1.12; }
      .seller2-body { font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.78); margin: 0; }
      .seller2-photo { position: relative; min-height: 280px; align-self: stretch; }
      .seller2-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

      /* COVERAGE gallery */
      .coverage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
      @media (min-width: 600px) { .coverage-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 900px) { .coverage-grid { grid-template-columns: repeat(5, 1fr); gap: 10px; } }
      .coverage-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: var(--brand-grey-soft); }
      .coverage-item img { width: 100%; height: 100%; object-fit: cover; }

      /* LOCATIONS */
      .lp-cities { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 36px; }
      .lp-city { padding: 8px 16px; background: #fff; border: 1px solid #DDE3EC; border-radius: 999px; font-weight: 500; font-size: 13.5px; color: var(--brand-navy); transition: background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out); }
      .lp-city:hover, .lp-city.is-current { background: var(--brand-navy); border-color: var(--brand-navy); color: #fff; }
      .lp-states { display: grid; grid-template-columns: 1fr; gap: 26px; }
      @media (min-width: 640px) { .lp-states { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 980px) { .lp-states { grid-template-columns: repeat(3, 1fr); } }
      .lp-state h4 { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--brand-orange-deep); margin: 0 0 12px; padding-bottom: 9px; border-bottom: 1px solid #E3E8EF; }
      .lp-state ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
      .lp-state a { color: var(--ink-muted); font-size: 14px; }
      .lp-state a:hover { color: var(--brand-orange-deep); }

      /* FAQ (light) */
      .faq-wrap { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
      .faq-item { background: #fff; border: 1px solid #E3E8EF; border-radius: 10px; overflow: hidden; }
      .faq-item summary { list-style: none; cursor: pointer; padding: 16px 20px; font-size: 15.5px; font-weight: 700; color: var(--brand-navy); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .faq-item summary::-webkit-details-marker { display: none; }
      .faq-item summary::after { content: '+'; color: var(--brand-orange); font-size: 22px; font-weight: 700; }
      .faq-item[open] summary::after { content: '−'; }
      .faq-item h4 { font-weight: inherit; padding: 0 20px 18px; font-size: 14.5px; line-height: 1.65; color: var(--ink-muted); margin: 0; }

      /* URGENCY final CTA (light) */
      .urgency {
        position: relative; text-align: center;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.92)),
          url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=70');
        background-size: cover; background-position: center;
        padding: clamp(48px, 6vw, 80px) 0;
      }
      .urgency-inner { display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 920px; margin: 0 auto; }
      .urgency h3 { font-size: clamp(1.6rem, 3.2vw, 2.4rem); font-weight: 700; color: var(--brand-navy); margin: 0; line-height: 1.15; text-wrap: balance; }
      .urgency h5 { font-weight: inherit; font-size: 16px; color: var(--ink-muted); margin: 0; }

      /* CONSISTENT section heading + subheading sizing (hero is exempt).
         Single source of truth so every section title matches in size. */
      .lp-head h2, .lp-head h3,
      .ctaband h2, .ctaband h3,
      .urgency h3,
      .agencyband h3,
      .seller2-text h3 {
        font-size: clamp(1.6rem, 3vw, 2.25rem);
        line-height: 1.15;
      }
      .lp-head p, .lp-head .lp-sub,
      .ctaband h5,
      .urgency h5,
      .seller2-body,
      .agencyband-sub {
        font-size: 18px;
        line-height: 1.6;
      }

      /* Mobile typography — smaller headings (hero 24px, sections 20px) + 12px subheadings */
      @media (max-width: 559px) {
        .lp-hero h1, .lp-hero h2 { font-size: 24px; }
        .lp-hero h5 { font-size: 12px; }
        .lp-head h2, .lp-head h3,
        .ctaband h2, .ctaband h3,
        .urgency h3, .agencyband h3, .seller2-text h3 { font-size: 20px; }
        .lp-head p, .lp-head .lp-sub,
        .ctaband h5, .urgency h5, .seller2-body, .agencyband-sub { font-size: 12px; }
        .step-card h5.step-title { font-size: 14px; }
        .step-card h5.step-body { font-size: 12px; }
      }

      @media (max-width: 640px) {
        .btn { width: auto; min-width: 200px; }
      }
    `}</style>
  );
}
