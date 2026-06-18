// Shared page styles — mirrors hotelforsale.my's light corporate look.
// Used by the homepage and the location pages (same section system, localised copy).
export default function PageStyles() {
  return (
    <style>{`
      /* Heading-tag normaliser: body copy wrapped in headings inherits weight. */
      .lp-head p, .lp-hero-sub, .usp-text h5, .step-card h5, .seller2-body,
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
          linear-gradient(95deg, #FFFFFF 0%, #FFFFFF 46%, rgba(255,255,255,0.88) 64%, rgba(255,255,255,0.5) 84%, rgba(255,255,255,0.15) 100%),
          linear-gradient(180deg, rgba(255,255,255,0) 46%, rgba(255,255,255,0.6) 74%, #FFFFFF 88%, #FFFFFF 100%),
          var(--hero-photo);
        background-size: cover, cover, cover;
        background-position: center left, center bottom, center right;
        background-repeat: no-repeat, no-repeat, no-repeat;
        padding: clamp(36px, 5vw, 64px) 0 clamp(24px, 3.5vw, 40px);
      }
      @media (max-width: 760px) {
        .lp-hero {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.84) 55%, rgba(255,255,255,0.93) 100%),
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
      .rotating-word { display: inline-flex; flex-direction: column; align-items: center; height: 1.02em; overflow: hidden; vertical-align: bottom; color: var(--brand-navy); }
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
      .partners { position: relative; z-index: 1; margin-top: -1px; background: #fff; border-bottom: 1px solid var(--line); padding: 24px 0 26px; }
      .partners-title { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); margin: 0 0 18px; }
      .partners-marquee {
        overflow: hidden; padding: 4px 0;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
      }
      .partners-marquee .marquee-track { display: inline-flex; align-items: center; gap: 64px; padding-left: 64px; white-space: nowrap; }
      .partner-img {
        height: 30px; width: auto; object-fit: contain; flex-shrink: 0;
        opacity: 0.62; filter: grayscale(1);
        transition: opacity var(--dur) var(--ease-out), filter var(--dur) var(--ease-out);
      }
      .partner-img:hover { opacity: 1; filter: grayscale(0); }

      /* USP 3-up */
      /* Compact USP strip inside the hero */
      /* Decorative hero background layer for screen readers (role=img + aria-label) */
      .lp-hero-bg { position: absolute; inset: 0; pointer-events: none; }

      /* USP BAR — compact light strip directly below hero (canonical .usp-panel/.usp-cell tokens) */
      .usp-bar { background: #fff; padding: clamp(22px, 3.5vw, 34px) 0; }
      .usp-panel { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 14px; padding-top: clamp(20px, 3vw, 26px); border-top: 1px solid var(--line); }
      @media (min-width: 760px) { .usp-panel { grid-template-columns: repeat(3, 1fr); gap: 24px; } }
      .usp-cell { display: flex; align-items: center; gap: 13px; text-align: left; }
      @media (max-width: 759px) { .usp-cell { justify-content: center; } }
      .usp-icon { flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--brand-navy); color: var(--brand-navy); display: grid; place-items: center; }
      .usp-icon svg { width: 23px; height: 23px; }
      .usp-text h3 { font-size: 15px; font-weight: 700; color: var(--brand-navy); margin: 0; }
      .usp-text h5 { font-size: 12.5px; line-height: 1.45; color: var(--ink-muted); margin: 3px 0 0; max-width: 30ch; }

      /* Hot list — warm "hot" section tint */
      .hotlist-section { background: radial-gradient(70% 60% at 50% 0%, #FFE7DE 0%, transparent 62%), #FFF8F5; }
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
      .agencyband::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,28,55,0.74), rgba(10,28,55,0.84)), url('/brand/agency-bg.avif') center/cover; opacity: 1; }
      .agencyband-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; }
      .agencyband-logo-img { height: 150px; width: auto; }
      @media (max-width: 559px) { .agencyband-logo-img { height: 104px; } }
      .agencyband h3 { font-size: clamp(1.6rem, 3.2vw, 2.6rem); font-weight: 800; color: var(--viva-green); margin: 2px 0 0; letter-spacing: -0.01em; }
      .agencyband-tagline { font-weight: inherit; font-size: 14px; letter-spacing: 0.01em; color: var(--viva-green); margin: 0; opacity: 0.92; }
      .agencyband-awards { display: flex; flex-wrap: nowrap; align-items: center; justify-content: center; gap: clamp(10px, 3vw, 32px); margin-top: 18px; }
      .agencyband-awards img { height: auto; width: auto; max-height: 160px; max-width: 31%; flex: 0 1 auto; object-fit: contain; }
      @media (max-width: 559px) { .agencyband-awards img { max-height: 100px; } }

      /* STEPS (process) */
      .steps { display: grid; grid-template-columns: 1fr; gap: 30px; max-width: 1040px; margin: 0 auto; }
      @media (min-width: 760px) { .steps { grid-template-columns: repeat(3, 1fr); gap: 10px; } }
      .step-card { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; padding: 0 18px; }
      .step-num {
        position: relative; z-index: 1;
        width: 66px; height: 66px; border-radius: 50%;
        display: grid; place-items: center;
        font-size: 26px; font-weight: 800; color: #fff;
        background: var(--gradient-orange); border: 5px solid #fff;
        box-shadow: 0 14px 30px -8px rgba(239,65,35,0.55);
        margin-bottom: 14px;
      }
      /* dashed connector between steps on desktop */
      @media (min-width: 760px) {
        .step-card:not(:last-child)::after {
          content: ''; position: absolute; top: 33px; left: calc(50% + 42px); width: calc(100% - 84px); height: 3px;
          background: repeating-linear-gradient(90deg, var(--brand-orange-ring) 0 7px, transparent 7px 15px);
          z-index: 0;
        }
      }
      .step-card h5.step-title { font-size: 16.5px; font-weight: 700; color: var(--brand-navy); margin: 0; }
      .step-card h5.step-body { font-size: 13.5px; line-height: 1.5; color: var(--ink-muted); margin: 4px 0 0; max-width: 30ch; }

      /* SELLER (dark navy + photo) */
      .seller2 {
        position: relative; color: #fff; overflow: hidden;
        background:
          linear-gradient(105deg, var(--brand-navy-deep) 0%, var(--brand-navy-deep) 38%, rgba(15,42,87,0.86) 62%, rgba(15,42,87,0.55) 100%),
          url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=70');
        background-size: cover, cover;
        background-position: center, center right;
        background-repeat: no-repeat;
      }
      .seller2 .container { padding-top: 0; padding-bottom: 0; }
      .seller2-grid { display: grid; grid-template-columns: 1fr; align-items: center; }
      @media (min-width: 880px) { .seller2-grid { grid-template-columns: 1.1fr 0.9fr; } }
      .seller2-text { padding: clamp(40px, 6vw, 72px) 0; display: flex; flex-direction: column; gap: 14px; align-items: center; text-align: center; }
      @media (min-width: 880px) { .seller2-text { align-items: flex-start; text-align: left; padding-right: 48px; } }
      .seller2-text h3 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700; color: #fff; margin: 0; line-height: 1.12; }
      .seller2-body { font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.78); margin: 0; }
      .seller2-photo { position: relative; min-height: 300px; align-self: stretch; overflow: hidden; }
      .seller2-photo::before { content: ''; position: absolute; inset: auto 0 0 0; height: 80%; background: radial-gradient(60% 70% at 50% 100%, rgba(239,65,35,0.22) 0%, transparent 70%); }
      .seller2-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: bottom center; }

      /* COVERAGE gallery */
      .coverage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
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
      .faq-item h4 { font-weight: 400 !important; padding: 0 20px 18px; font-size: 14.5px; line-height: 1.65; color: var(--ink-muted); margin: 0; }

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
