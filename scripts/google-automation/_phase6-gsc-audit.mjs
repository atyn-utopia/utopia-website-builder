// Read-only: which GSC properties exist (as the user OAuth), and do they have sitemaps?
import { google } from 'googleapis';
import { getUserAuth, getAuth } from './lib/auth.mjs';
const domains = process.argv.slice(2);
for (const [label, auth] of [['USER', getUserAuth()], ['SA', getAuth('gsc')]]) {
  const sc = google.searchconsole({ version: 'v1', auth });
  const r = await sc.sites.list().catch((e) => ({ error: e.message }));
  if (r.error) { console.log(`${label}: ERROR ${r.error.split('\n')[0]}`); continue; }
  const urls = (r.data.siteEntry || []).map((s) => s.siteUrl);
  console.log(`\n${label} account sees ${urls.length} GSC properties.`);
  for (const d of domains) {
    const hits = urls.filter((u) => u === `sc-domain:${d}` || u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '') === d);
    console.log(`  ${d.padEnd(36)} ${hits.length ? hits.join('  ') : '— none —'}`);
  }
}
