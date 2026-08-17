// Submit a sitemap to Google Search Console.
// Usage: node _submit-sitemap.mjs <siteUrl> <sitemapUrl>

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [siteUrl, sitemapUrl] = process.argv.slice(2);
if (!siteUrl || !sitemapUrl) {
  console.error('Usage: node _submit-sitemap.mjs <siteUrl> <sitemapUrl>');
  process.exit(1);
}

const auth = getAuth('gsc');
const sc = google.searchconsole({ version: 'v1', auth });

await sc.sitemaps.submit({ siteUrl, feedpath: sitemapUrl });
console.log(`✓ Submitted ${sitemapUrl} to ${siteUrl}`);

// Verify
const res = await sc.sitemaps.list({ siteUrl });
console.log('\nCurrent sitemaps:');
for (const s of res.data.sitemap ?? []) {
  console.log(`  - ${s.path}  warnings=${s.warnings ?? 0}  errors=${s.errors ?? 0}`);
}
