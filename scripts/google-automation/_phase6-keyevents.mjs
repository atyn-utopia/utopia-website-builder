import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';
const admin = google.analyticsadmin({ version: 'v1beta', auth: getUserAuth() });
for (const pid of process.argv.slice(2)) {
  const ke = await admin.properties.keyEvents.list({ parent: `properties/${pid}` }).catch((e) => ({ error: e.message }));
  if (ke.error) { console.log(`${pid}: ERROR ${ke.error.split('\n')[0]}`); continue; }
  console.log(`${pid}: ${(ke.data.keyEvents || []).map((k) => k.eventName).join(', ') || '(none)'}`);
  const l = await admin.properties.googleAdsLinks.list({ parent: `properties/${pid}` }).catch(() => ({ data: {} }));
  console.log(`   adsLinks: ${(l.data.googleAdsLinks || []).map((x) => x.customerId).join(', ') || 'NONE'}`);
}
