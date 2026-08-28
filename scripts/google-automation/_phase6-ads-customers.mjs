import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { GoogleAdsApi } from 'google-ads-api';
const o = JSON.parse(readFileSync(join(homedir(), '.google-credentials', 'utopia-user-oauth.json'), 'utf8'));
const api = new GoogleAdsApi({ client_id: o.client_id, client_secret: o.client_secret, developer_token: readFileSync(join(homedir(), '.google-credentials', 'utopia-ads-token.txt'), 'utf8').trim() });
const res = await api.listAccessibleCustomers(o.refresh_token);
console.log('Accessible customers:', res.resource_names.map((r) => r.split('/')[1]).join(', '));
