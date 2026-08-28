// Read-only: does each GA4 property have a GoogleAdsLink, and to which customer?
import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';
const admin = google.analyticsadmin({ version: 'v1beta', auth: getUserAuth() });
for (const arg of process.argv.slice(2)) {
  const [dom, pid] = arg.split('=');
  const r = await admin.properties.googleAdsLinks.list({ parent: `properties/${pid}` }).catch((e) => ({ error: e.message }));
  if (r.error) { console.log(`${dom.padEnd(36)} ERROR ${r.error.split('\n')[0]}`); continue; }
  const links = r.data.googleAdsLinks || [];
  if (!links.length) { console.log(`${dom.padEnd(36)} NO GOOGLE ADS LINK`); continue; }
  for (const l of links) console.log(`${dom.padEnd(36)} customer ${l.customerId}  adsPersonalization=${l.adsPersonalizationEnabled}  canManage=${l.canManageClients ?? '-'}`);
}
