#!/usr/bin/env node
import { google } from 'googleapis';
import { getAuth, getServiceAccountEmail } from './lib/auth.mjs';

const GTM_ACCOUNT_ID = '6000211475';

console.log('\n🔐 Testing GTM authentication...\n');
console.log(`   Service account: ${getServiceAccountEmail()}`);

const auth = getAuth('gtm');
const tm = google.tagmanager({ version: 'v2', auth });

try {
  const res = await tm.accounts.containers.list({
    parent: `accounts/${GTM_ACCOUNT_ID}`,
  });
  const containers = res.data.container || [];
  console.log(`   ✅ Auth works — found ${containers.length} existing containers\n`);
  console.log('   First 5 containers:');
  containers.slice(0, 5).forEach((c) => {
    console.log(`     • ${c.name} (${c.publicId})`);
  });
  console.log('\n✓ Ready to run gtm-setup.mjs\n');
} catch (err) {
  console.error('\n❌ Auth failed:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
}
