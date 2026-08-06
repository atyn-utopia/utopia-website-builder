// Rename a GTM container.
// Usage: node _rename-gtm.mjs <accountId> <containerId> "<new name>"

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [accountId, containerId, newName] = process.argv.slice(2);
if (!accountId || !containerId || !newName) {
  console.error('Usage: node _rename-gtm.mjs <accountId> <containerId> "<new name>"');
  process.exit(1);
}

const auth = getAuth('gtm');
const tm = google.tagmanager({ version: 'v2', auth });

const path = `accounts/${accountId}/containers/${containerId}`;
const before = await tm.accounts.containers.get({ path });
console.log(`Before: name="${before.data.name}", publicId="${before.data.publicId}"`);

const after = await tm.accounts.containers.update({
  path,
  requestBody: {
    name: newName,
    usageContext: before.data.usageContext,
    fingerprint: before.data.fingerprint,
  },
});
console.log(`After:  name="${after.data.name}", publicId="${after.data.publicId}"`);
