// Add additional language-variant GSC properties for an already-verified site.
// Useful for multi-language Utopia sites where each lang gets its own
// URL-prefix property (per Aliah's established convention).
//
// Usage:
//   node _setup-gsc-multilang.mjs <baseUrl> <ownerEmail> <lang1> [<lang2> ...]
// Example:
//   node _setup-gsc-multilang.mjs https://www.stickerlori.com.my/ utopiacoliving@gmail.com en zh
//
// For each language, adds: <baseUrl><lang>/ as a URL-prefix property.
// Assumes the GSC verification meta tag is already on every page (it is —
// served via NEXT_PUBLIC_GSC_VERIFICATION env var and the WebcoreTracker).

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [baseUrl, ownerEmail, ...langs] = process.argv.slice(2);
if (!baseUrl || !ownerEmail || langs.length === 0) {
  console.error('Usage: node _setup-gsc-multilang.mjs <baseUrl> <ownerEmail> <lang1> [<lang2> ...]');
  process.exit(1);
}
if (!baseUrl.endsWith('/')) {
  console.error('baseUrl must end with /');
  process.exit(1);
}

const auth = getAuth('gsc');
const sv = google.siteVerification({ version: 'v1', auth });
const sc = google.searchconsole({ version: 'v1', auth });
const tokens = await auth.authorize();

for (const lang of langs) {
  const langUrl = `${baseUrl}${lang}/`;
  console.log(`\n═══ ${langUrl} ═══`);

  // 1. Verify ownership via Site Verification API
  console.log('1. Verifying ownership...');
  try {
    await sv.webResource.insert({
      verificationMethod: 'META',
      requestBody: { site: { identifier: langUrl, type: 'SITE' } },
    });
    console.log('   ✓ Verified');
  } catch (e) {
    if (e.message.includes('already')) {
      console.log('   ✓ Already verified');
    } else {
      console.log(`   ✗ ${e.message.split('\n')[0]}`);
      continue;
    }
  }

  // 2. Add to SA's GSC sites list (so SA can submit sitemap etc.)
  console.log('2. Adding to SA\'s GSC list...');
  try {
    await sc.sites.add({ siteUrl: langUrl });
    console.log('   ✓ Added');
  } catch (e) {
    console.log(`   (sites.add: ${e.message.split('\n')[0]})`);
  }

  // 3. Add user as verified owner (raw fetch — googleapis client mis-serializes)
  console.log(`3. Adding ${ownerEmail} as verified owner...`);
  const id = encodeURIComponent(langUrl);
  const baseApiUrl = `https://www.googleapis.com/siteVerification/v1/webResource/${id}`;
  const cur = await fetch(baseApiUrl, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  }).then(r => r.json());
  if (cur.owners?.includes(ownerEmail)) {
    console.log(`   ✓ ${ownerEmail} is already an owner`);
  } else {
    const put = await fetch(baseApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: cur.id,
        site: cur.site,
        owners: [...(cur.owners ?? []), ownerEmail],
      }),
    });
    if (put.ok) console.log(`   ✓ ${ownerEmail} added`);
    else console.log(`   ✗ ${put.status} ${await put.text()}`);
  }

  // 4. Submit sitemap (use the canonical sitemap.xml — it covers all langs)
  console.log('4. Submitting sitemap...');
  try {
    const sitemapUrl = `${baseUrl}sitemap.xml`;
    await sc.sitemaps.submit({ siteUrl: langUrl, feedpath: sitemapUrl });
    console.log(`   ✓ Submitted ${sitemapUrl}`);
  } catch (e) {
    console.log(`   (sitemap submit: ${e.message.split('\n')[0]})`);
  }
}

console.log('\n═══════════════════════════════════');
console.log('Done. Final GSC site list for SA:');
const list = await sc.sites.list();
for (const s of list.data.siteEntry ?? []) {
  console.log(`  - ${s.siteUrl} (${s.permissionLevel})`);
}
console.log(`\n→ ${ownerEmail} now needs to click "Add property" once per URL in their own GSC at`);
console.log('  https://search.google.com/search-console — verification will pass instantly');
console.log('  for all of them since they\'re already a verified owner via API.');
