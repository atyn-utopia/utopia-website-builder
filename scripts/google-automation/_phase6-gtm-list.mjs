import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';
const tm = google.tagmanager({ version: 'v2', auth: getAuth('gtm') });
const acct = 'accounts/6000211475';
const r = await tm.accounts.containers.list({ parent: acct });
const cs = r.data.container || [];
console.log(`${cs.length} containers on ${acct}`);
for (const d of process.argv.slice(2)) {
  const hit = cs.filter((c) => (c.name || '').includes(d) || (c.domainName || []).some((x) => x.includes(d)));
  console.log(`  ${d.padEnd(30)} ${hit.length ? hit.map((h) => `${h.publicId} "${h.name}"`).join(' | ') : '— NO CONTAINER —'}`);
}
