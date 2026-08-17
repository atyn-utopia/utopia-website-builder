/**
 * Shared style block for the homepage and the location pages, so the two can
 * never drift apart. Plain <style> (not styled-jsx): a styled-jsx block inside
 * a client component ships its CSS in the JS bundle, which produces a flash of
 * unstyled content on first paint.
 */
export default function PageStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
/* Wrapped in @layer base: Tailwind v4 emits utilities in @layer utilities,
   and an UNLAYERED rule beats any layered rule regardless of specificity.
   Unwrapped, every rule below would defeat text-white / text-xs / text-3xl
   utilities used alongside these classes. */
@layer base {

  /* Body copy on this site is written as h5/h6 (house SEO rule: every visible
     string sits in a heading tag). Without this normaliser those elements would
     pick up default heading size/weight and blow the layout apart. */
  .body-text,
  h5.body-text,
  h6.body-text {
    font-family: var(--font-body);
    font-weight: inherit;
    font-size: inherit;
    line-height: 1.4;
    margin: 0;
  }

  /* Eyebrow pill above each section title */
  .sec-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: var(--r-pill);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
  }

  /* Section titles. The static page rendered these at Rubik weight 400 —
     reproduced deliberately, see app/globals.css. */
  .sec-title {
    font-family: var(--font-heading);
    font-weight: inherit;
    font-size: 24px;
    line-height: 32px;
  }
  @media (min-width: 768px) {
    .sec-title {
      font-size: 36px;
      line-height: 40px;
    }
  }

  .card-title {
    font-family: var(--font-heading);
    font-weight: inherit;
    font-size: 14px;
    line-height: 20px;
  }

  .card-title-lg {
    font-family: var(--font-heading);
    font-weight: inherit;
    font-size: 16px;
    line-height: 24px;
  }
  @media (min-width: 768px) {
    .card-title-lg {
      font-size: 18px;
      line-height: 28px;
    }
  }

  /* Default heading colours carry ZERO specificity via :where(), so a Tailwind
     colour utility (text-white on the dark teal sections) still wins. Setting
     the colour directly on .sec-title silently rendered the buyback and
     final-CTA headings dark-teal-on-dark-teal. */
  :where(.sec-title) {
    color: #134e4a;
  }
  :where(.card-title, .card-title-lg) {
    color: #115e59;
  }

  /* Hero title — mobile 30/37.5, md 48/48, lg 60/60 (matches the static page's
     computed styles exactly). */
  .hero-title {
    font-family: var(--font-heading);
    font-weight: inherit;
    font-size: 30px;
    line-height: 37.5px;
  }
  :where(.hero-title) {
    color: #134e4a;
  }
  @media (min-width: 768px) {
    .hero-title {
      font-size: 48px;
      line-height: 48px;
    }
  }
  @media (min-width: 1024px) {
    .hero-title {
      font-size: 60px;
      line-height: 60px;
    }
  }

  /* Hero subtitle (the one h2 on the page) */
  .hero-sub {
    font-family: var(--font-body);
    font-weight: inherit;
    font-size: 18px;
    line-height: 1.4;
  }
  :where(.hero-sub) {
    color: #4b5563;
  }
  @media (min-width: 768px) {
    .hero-sub {
      font-size: 20px;
    }
  }

  /* Stat counters in the hero image overlay */
  .stat-num {
    font-family: var(--font-heading);
    font-weight: inherit;
    font-size: 24px;
    line-height: 32px;
  }
}
`,
      }}
    />
  );
}
