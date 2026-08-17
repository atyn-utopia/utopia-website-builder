// One-off: resume bulk indexing from an offset (first N already submitted).
import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const SITEMAP = 'https://24hourelectrician.my/sitemap.xml';
const OFFSET = 201; // already submitted in the 2026-07-23 finalize run
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractUrlsFromSitemap(xml) {
  const urls = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
  return urls;
}

const auth = getAuth('gsc');
const indexing = google.indexing({ version: 'v3', auth });

const xml = await (await fetch(SITEMAP)).text();
const all = extractUrlsFromSitemap(xml);
console.log(`sitemap URLs total: ${all.length}`);
const remainder = all.slice(OFFSET);
console.log(`skipping first ${OFFSET}, attempting ${remainder.length} remaining`);

let ok = 0, fail = 0, quota = false;
for (const url of remainder) {
  try {
    await indexing.urlNotifications.publish({ requestBody: { url, type: 'URL_UPDATED' } });
    ok++;
  } catch (err) {
    fail++;
    const msg = err.message.split('\n')[0];
    if (msg.includes('quota') || msg.includes('RATE_LIMIT') || msg.includes('Quota')) {
      console.log(`quota hit after ${ok} submitted this run — stopping. (${msg})`);
      quota = true;
      break;
    }
    console.log(`  fail ${url.replace('https://24hourelectrician.my', '')}: ${msg}`);
  }
  await sleep(200);
}

const submittedTotal = OFFSET + ok;
const remaining = all.length - submittedTotal;
console.log(`\n=== RESULT ===`);
console.log(`submitted this run: ${ok} (failed ${fail}${quota ? ', quota-stopped' : ''})`);
console.log(`cumulative submitted: ${submittedTotal}/${all.length}`);
console.log(`remaining for another day: ${remaining < 0 ? 0 : remaining}`);
