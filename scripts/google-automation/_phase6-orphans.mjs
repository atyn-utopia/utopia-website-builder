// Read-only: find GA4 properties by live site URL for repos with no configs/<domain>.json.
import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';
const auth = getUserAuth();
const admin = google.analyticsadmin({ version: 'v1beta', auth });
const GA4 = 'https://analyticsadmin.googleapis.com/v1alpha';
const TARGETS = process.argv.slice(2);

const sums = await admin.accountSummaries.list({ pageSize: 200 });
const props = (sums.data.accountSummaries || []).flatMap((a) => (a.propertySummaries || []).map((p) => ({ id: p.property.replace('properties/',''), name: p.displayName })));
const byUri = {};
await Promise.all(props.map(async (p) => {
  const s = await admin.properties.dataStreams.list({ parent: `properties/${p.id}` }).catch(() => ({ data: {} }));
  for (const st of s.data.dataStreams || []) {
    const uri = st.webStreamData?.defaultUri;
    if (uri) byUri[uri.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')] = { pid: p.id, name: p.name, mid: st.webStreamData.measurementId };
  }
}));
for (const d of TARGETS) {
  const hit = byUri[d];
  if (!hit) { console.log(`${d.padEnd(36)} NO GA4 PROPERTY FOUND`); continue; }
  const g = await auth.request({ url: `${GA4}/properties/${hit.pid}/googleSignalsSettings` }).then(r=>r.data).catch(()=>({}));
  const u = await auth.request({ url: `${GA4}/properties/${hit.pid}/userProvidedDataSettings` }).then(r=>r.data).catch(()=>({}));
  const sig = g.state === 'GOOGLE_SIGNALS_ENABLED' ? 'ON' : 'off';
  const ud = u.userProvidedDataCollectionEnabled ? (u.automaticallyDetectedDataCollectionEnabled ? 'ON' : 'part') : 'off';
  console.log(`${d.padEnd(36)} prop:${hit.pid.padEnd(11)} ${hit.mid.padEnd(14)} signals:${sig.padEnd(5)} userdata:${ud}`);
}
