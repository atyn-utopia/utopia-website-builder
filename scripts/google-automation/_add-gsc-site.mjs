// Add a site to the SA's GSC list (after verification).
// Usage: node _add-gsc-site.mjs <siteUrl>

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [siteUrl] = process.argv.slice(2);
if (!siteUrl) {
  console.error('Usage: node _add-gsc-site.mjs <siteUrl>');
  process.exit(1);
}

const auth = getAuth('gsc');
const sc = google.searchconsole({ version: 'v1', auth });

await sc.sites.add({ siteUrl });
console.log(`✓ Added ${siteUrl} to the SA's GSC site list`);

// Verify
const res = await sc.sites.list();
console.log('\nNow visible to SA:');
for (const s of res.data.siteEntry ?? []) {
  console.log(`  - ${s.siteUrl}  permission=${s.permissionLevel}`);
}
