// Show which users have access to a GTM container.
// Usage: node _check-gtm-permissions.mjs <accountId>

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [accountId] = process.argv.slice(2);
if (!accountId) {
  console.error('Usage: node _check-gtm-permissions.mjs <accountId>');
  process.exit(1);
}

const auth = getAuth('gtm');
const tm = google.tagmanager({ version: 'v2', auth });

const res = await tm.accounts.user_permissions.list({
  parent: `accounts/${accountId}`,
});

for (const p of res.data.userPermission ?? []) {
  console.log(`\n${p.emailAddress}`);
  console.log(`  account: ${p.accountAccess?.permission ?? 'none'}`);
  for (const c of p.containerAccess ?? []) {
    console.log(`  container ${c.containerId}: ${c.permission}`);
  }
}
