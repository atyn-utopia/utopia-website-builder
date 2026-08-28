// Read-only Phase 6 audit across every site config. Does the expensive
// measurementId -> propertyId scan ONCE, instead of once per site.
import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CONFIGS = join(process.cwd(), 'configs');
const GA4 = 'https://analyticsadmin.googleapis.com/v1alpha';
const auth = getUserAuth();
const admin = google.analyticsadmin({ version: 'v1beta', auth });

const sites = readdirSync(CONFIGS).filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, domain: f.slice(0, -5), cfg: JSON.parse(readFileSync(join(CONFIGS, f), 'utf8')) }));

console.log(`Scanning GA4 account properties once...`);
const sums = await admin.accountSummaries.list({ pageSize: 200 });
const props = (sums.data.accountSummaries || []).flatMap((a) => (a.propertySummaries || []).map((p) => p.property));
console.log(`  ${props.length} properties visible. Mapping measurement ids...`);
const midToProp = {};
await Promise.all(props.map(async (prop) => {
  const s = await admin.properties.dataStreams.list({ parent: prop }).catch(() => ({ data: {} }));
  for (const st of s.data.dataStreams || []) {
    const mid = st.webStreamData?.measurementId;
    if (mid) midToProp[mid] = prop.replace('properties/', '');
  }
}));
console.log(`  ${Object.keys(midToProp).length} measurement ids mapped.\n`);

async function ga4Get(pid, res) {
  const r = await auth.request({ url: `${GA4}/properties/${pid}/${res}` }).catch((e) => ({ error: e.message }));
  return r.error ? { _err: r.error.split('\n')[0] } : r.data;
}

// Ads counting, for configs that carry an ads block.
const TOKEN = join(homedir(), '.google-credentials', 'utopia-ads-token.txt');
const OAUTH = join(homedir(), '.google-credentials', 'utopia-user-oauth.json');
let adsClient = null;
if (existsSync(TOKEN) && existsSync(OAUTH)) {
  const { GoogleAdsApi } = await import('google-ads-api');
  const o = JSON.parse(readFileSync(OAUTH, 'utf8'));
  adsClient = { api: new GoogleAdsApi({ client_id: o.client_id, client_secret: o.client_secret, developer_token: readFileSync(TOKEN, 'utf8').trim() }), refresh: o.refresh_token };
}
async function adsCounting(customerId, actionId) {
  if (!adsClient) return '?';
  try {
    const c = adsClient.api.Customer({ customer_id: String(customerId).replace(/-/g, ''), refresh_token: adsClient.refresh });
    const rows = await c.query(`SELECT conversion_action.counting_type FROM conversion_action WHERE conversion_action.id = ${actionId}`);
    const t = rows[0]?.conversion_action?.counting_type;
    return t === 2 ? 'ONE' : t === 3 ? 'EVERY' : String(t ?? '?');
  } catch (e) { return 'err'; }
}

const out = [];
for (const { domain, cfg } of sites) {
  const mid = cfg.ga4?.measurementId || cfg.ga4MeasurementId;
  const pid = cfg.ga4?.propertyId || cfg.ads?.ga4PropertyId || (mid ? midToProp[mid] : null);
  const row = { domain, gtm: cfg.containerId || null, mid: mid || null, pid: pid || null, signals: '-', userdata: '-', counting: '-' };
  if (pid) {
    const sig = await ga4Get(pid, 'googleSignalsSettings');
    row.signals = sig._err ? 'err' : (sig.state === 'GOOGLE_SIGNALS_ENABLED' ? 'ON' : 'off');
    const ud = await ga4Get(pid, 'userProvidedDataSettings').catch(() => ({}));
    row.userdata = ud._err ? 'err' : (ud.userProvidedDataCollectionEnabled ? (ud.automaticallyDetectedDataCollectionEnabled ? 'ON' : 'part') : 'off');
  } else if (mid) row.signals = row.userdata = 'no-prop';
  else row.signals = row.userdata = 'no-ga4';
  if (cfg.ads?.customerId && cfg.ads?.conversionActionId) row.counting = await adsCounting(cfg.ads.customerId, cfg.ads.conversionActionId);
  else row.counting = 'no-ads';
  out.push(row);
  console.log(`${domain.padEnd(34)} gtm:${(row.gtm||'-').padEnd(15)} prop:${String(row.pid||'-').padEnd(11)} signals:${row.signals.padEnd(8)} userdata:${row.userdata.padEnd(8)} counting:${row.counting}`);
}
writeFileSync('/private/tmp/claude-503/-Users-intern-Documents-GitHub-utopia-website-builder/6e366ba6-c389-4dae-bc02-c668ee593383/scratchpad/phase6-audit.json', JSON.stringify(out, null, 2));
console.log('\nAUDIT DONE');
