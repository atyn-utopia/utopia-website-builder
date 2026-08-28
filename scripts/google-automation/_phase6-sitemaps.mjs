// Read-only: sitemap submission status on each site's sc-domain property.
import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';
const sc = google.searchconsole({ version: 'v1', auth: getUserAuth() });
for (const d of process.argv.slice(2)) {
  const siteUrl = `sc-domain:${d}`;
  const r = await sc.sitemaps.list({ siteUrl }).catch((e) => ({ error: e.message }));
  if (r.error) { console.log(`${d.padEnd(36)} ERROR ${r.error.split('\n')[0].slice(0, 60)}`); continue; }
  const sm = r.data.sitemap || [];
  if (!sm.length) { console.log(`${d.padEnd(36)} NO SITEMAP SUBMITTED`); continue; }
  console.log(`${d.padEnd(36)} ${sm.map((s) => `${s.path.replace(/^https?:\/\/[^/]+/, '')}(${s.contents?.[0]?.submitted ?? '?'} urls${s.errors > 0 ? `, ${s.errors} err` : ''})`).join(' ')}`);
}
