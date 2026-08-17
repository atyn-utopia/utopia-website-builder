/**
 * og-shot.mjs — generate the social share cards (public/og-{locale}.png).
 *
 *   npm run build && npm run start        # one shell
 *   node scripts/og-shot.mjs              # another
 *
 * The card is a screenshot of the HERO SECTION ONLY, framed to the 1200x630
 * Open Graph box, one per locale so the card is in the reader's language.
 * Wired into metadata by lib/ogImage.ts.
 *
 * RERUN THIS whenever hero copy, hero images, or the palette change. It is a
 * screenshot — nothing will tell you it has gone stale, the site will look
 * correct and only the shared link will be wrong.
 *
 * ── Per-project setup ────────────────────────────────────────────────────
 * 1. LOCALES must match i18n/routing.ts. With `localePrefix: 'as-needed'` the
 *    default locale has NO prefix (''); with 'always' every locale has one.
 * 2. PORT must match the `start` script in package.json.
 * 3. HIDE: add any hero-foot element that a 630 crop would slice mid-text
 *    (stat rows, scrolling tickers). Leaving one in produces a card that looks
 *    like a rendering bug.
 *
 * ── Why it is built this way (all three cost real debugging) ─────────────
 * · Two passes: hide chrome, measure the hero, THEN fit it. A blind 1200x630
 *   clip lets whatever sits below the hero leak into the bottom of the card.
 * · Padding must be injected as a stylesheet with !important — an inline style
 *   loses to the earlier `padding-top: 0 !important`.
 * · Heroes both shorter AND taller than 630 exist, so both are handled: pad
 *   symmetrically when short, clip from the TOP when tall. Top-anchored
 *   because the logo, H1, H2 and CTA all sit in the upper two-thirds — a
 *   centred crop decapitates the logo.
 *
 * ── Two traps when running it ────────────────────────────────────────────
 * · `next start` snapshots public/ at boot, so PNGs written while it is
 *   running 404 until you restart it.
 * · `pkill -f "next start"` does NOT match — the process is named next-server.
 *   Use `lsof -ti:<PORT> | xargs kill -9`.
 */
import puppeteer from 'puppeteer';

// ── Configure per project ────────────────────────────────────────────────
const LOCALES = [
  ['ms', ''],      // default locale — no prefix under localePrefix:'as-needed'
  ['en', '/en'],
  ['zh', '/zh'],
];
const PORT = 3025;
const HIDE = [
  '.fomo-bar', '.site-header', 'header',   // canonical chrome
  '.hero-stats', '.ops-ticker',            // hero-foot elements a crop would slice
  // This hero runs logo → h1 → h2 → .hero-support → CTA row → stats, which is
  // ~706px: taller than the 630 box. Dropping the third line of prose keeps the
  // logo, H1, H2 and the CTA — the parts that sell the click — inside the card.
  '.hero-support', '.hero-float-tag',
];
// ─────────────────────────────────────────────────────────────────────────

const W = 1200;
const H = 630;
const ORIGIN = process.env.OG_ORIGIN ?? `http://localhost:${PORT}`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const [code, prefix] of LOCALES) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${ORIGIN}${prefix}`, { waitUntil: 'networkidle0' });

  await page.addStyleTag({
    content: `
      ${HIDE.join(', ')} { display: none !important; }
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
console.log('\nNow LOOK at the PNGs. Correct dimensions do not mean a good card —');
console.log('check nothing is sliced mid-text and the logo/H1/CTA are all intact.');
