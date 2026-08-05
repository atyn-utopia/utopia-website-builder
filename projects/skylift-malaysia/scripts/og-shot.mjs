/**
 * og-shot.mjs — regenerate the social share cards.
 *
 *   npm run build && npm run start        # in one shell (serves :3012)
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
 * and padded symmetrically to exactly 630 before the element is captured.
 * Capturing a manual 1200x630 clip instead lets the yellow USP bar below the
 * hero leak into the bottom of the card, and the padding has to be injected via
 * a stylesheet with !important — an inline style loses to the earlier
 * `padding-top: 0 !important` rule.
 */
import puppeteer from 'puppeteer';

const LOCALES = [
  ['en', ''],
  ['ms', '/ms'],
  ['zh', '/zh'],
];
const W = 1200;
const H = 630;
const ORIGIN = process.env.OG_ORIGIN ?? 'http://localhost:3012';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const [code, prefix] of LOCALES) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${ORIGIN}${prefix}`, { waitUntil: 'networkidle0' });

  await page.addStyleTag({
    content: `
      .fomo-bar, header, .fab-wa { display: none !important; }
      .hero { padding-top: 0 !important; padding-bottom: 0 !important; }
    `,
  });
  await new Promise((r) => setTimeout(r, 300));

  const bare = await page.evaluate(() =>
    Math.round(document.querySelector('section.hero').getBoundingClientRect().height),
  );
  const padTop = Math.max(0, (H - bare) / 2);
  await page.addStyleTag({
    content: `.hero { padding-top: ${padTop}px !important; padding-bottom: ${H - bare - padTop}px !important; }`,
  });
  await new Promise((r) => setTimeout(r, 400));

  const hero = await page.$('section.hero');
  const box = await hero.boundingBox();
  await hero.screenshot({ path: `public/og-${code}.png` });
  console.log(
    `og-${code}.png  hero ${bare}px + ${padTop.toFixed(1)}px pad -> ${Math.round(box.width)}x${Math.round(box.height)}`,
  );
  await page.close();
}

await browser.close();
