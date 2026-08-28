// Read-only: every GA4-imported conversion action on the Ads customer, with counting type.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { GoogleAdsApi } from 'google-ads-api';
const o = JSON.parse(readFileSync(join(homedir(), '.google-credentials', 'utopia-user-oauth.json'), 'utf8'));
const api = new GoogleAdsApi({ client_id: o.client_id, client_secret: o.client_secret, developer_token: readFileSync(join(homedir(), '.google-credentials', 'utopia-ads-token.txt'), 'utf8').trim() });
const c = api.Customer({ customer_id: (process.argv[2] || '1933757591'), refresh_token: o.refresh_token });
const rows = await c.query(`
  SELECT conversion_action.id, conversion_action.name, conversion_action.status,
         conversion_action.counting_type, conversion_action.primary_for_goal,
         conversion_action.google_analytics_4_settings.property_id
  FROM conversion_action
  WHERE conversion_action.type = 'GOOGLE_ANALYTICS_4_CUSTOM'
`);
console.log(`${rows.length} GA4-imported conversion actions:\n`);
for (const r of rows.sort((a,b)=>a.conversion_action.name.localeCompare(b.conversion_action.name))) {
  const a = r.conversion_action;
  const cnt = a.counting_type === 2 ? 'ONE' : a.counting_type === 3 ? 'EVERY' : a.counting_type;
  const st = a.status === 2 ? 'ENABLED' : a.status === 3 ? 'REMOVED' : a.status === 4 ? 'HIDDEN' : a.status;
  console.log(`${String(a.id).padEnd(12)} ${String(cnt).padEnd(6)} ${String(st).padEnd(8)} prop:${String(a.google_analytics_4_settings?.property_id||'-').padEnd(11)} ${a.name}`);
}
