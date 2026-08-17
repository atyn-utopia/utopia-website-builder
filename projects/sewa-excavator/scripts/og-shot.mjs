/**
 * og-shot.mjs — regenerate the social share cards.
 *
 *   npm run build && npm run start        # in one shell (serves :3025)
 *   node scripts/og-shot.mjs              # in another
 *
 * The card is a screenshot of the HERO SECTION ONLY, framed to the 1200x630
 * Open Graph box, one per locale -> public/og-{locale}.png. Wired into metadata
 * by lib/ogImage.ts.
 *
 * RERUN THIS whenever hero copy, the hero images, or the palette change —
 * otherwise the share card silently keeps showing the old hero. (It is a
 * screenshot, so nothing else will tell you it has gone stale.)
 *
 * Two passes on purpose: the chrome is hidden first, then the hero is measured
 * and fitted to exactly 630 before the ELEMENT is captured. The padding has to
 * be injected via a stylesheet with !important — an inline style loses to the
 * earlier `padding-top: 0 !important` rule.
 *
 * This hero is TALLER than the 630 box in ms/en (671px / 738px), unlike the
 * skylift hero this script came from, so both directions are handled:
 *   · shorter than 630 -> pad symmetrically, screenshot the element
 *   · taller than 630  -> clip 630 from the TOP of the hero
 * Top-anchored, not centred: the logo, H1, H2 and CTA all sit in the upper
 * two-thirds, and a centred crop decapitates the logo. The clip is bounded by
 * the hero's own box, so nothing below the hero can leak in.
 *
 * Two hero elements are hidden for the card:
 *   `.ops-ticker`  the scrolling location strip at the hero's foot
 *   `.hero-stats`  the 2 / 14 / 24 figures row
 * Both sit at the very bottom and get sliced mid-text by a 630 crop, which
 * reads as a rendering bug. With them hidden every locale fits under 630
 * (561 / 628 / 503), so all three pad cleanly instead of one being clipped —
 * a share-card set should look like a set. Keeping the stats would cost EN a
 * 72px cut through the CTA row, which is the worse trade.
 *
 * Locale prefixes follow `localePrefix: 'as-needed'` with defaultLocale `ms`,
 * so Malay is served from the bare root and only en/zh carry a prefix.
 */
import puppeteer from 'puppeteer';

const LOCALES = [
  ['ms', ''],
  ['en', '/en'],
  ['zh', '/zh'],
];
const W = 1200;
const H = 630;
const ORIGIN = process.env.OG_ORIGIN ?? 'http://localhost:3025';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const [code, prefix] of LOCALES) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${ORIGIN}${prefix}`, { waitUntil: 'networkidle0' });

  await page.addStyleTag({
    content: `
      .fomo-bar, .site-header, header, .ops-ticker, .hero-stats { display: none !important; }
      .hero { padding-top: 0 !important; padding-bottom: 0 !important; }
    `,
  });
  await new Promise((r) => setTimeout(r, 300));

  const bare = await page.evaluate(() =>
    Math.round(document.querySelector('section.hero').getBoundingClientRect().height),
  );

  let note;
  if (bare <= H) {
    const padTop = Math.max(0, (H - bare) / 2);
    await page.addStyleTag({
      content: `.hero { padding-top: ${padTop}px !important; padding-bottom: ${H - bare - padTop}px !important; }`,
    });
    await new Promise((r) => setTimeout(r, 400));
    const hero = await page.$('section.hero');
    await hero.screenshot({ path: `public/og-${code}.png` });
    note = `+${padTop.toFixed(1)}px pad`;
  } else {
    // Taller than the box: clip 630 from the top of the hero's own rect.
    const hero = await page.$('section.hero');
    const box = await hero.boundingBox();
    await page.screenshot({
      path: `public/og-${code}.png`,
      clip: { x: box.x, y: box.y, width: W, height: H },
    });
    note = `clipped -${bare - H}px from foot`;
  }
  console.log(`og-${code}.png  hero ${bare}px ${note} -> ${W}x${H}`);
  await page.close();
}

await browser.close();
