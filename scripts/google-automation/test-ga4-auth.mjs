#!/usr/bin/env node
import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

console.log('\n🔐 Testing GA4 authentication...\n');

const auth = getAuth('ga4');
const admin = google.analyticsadmin({ version: 'v1beta', auth });

try {
  const res = await admin.accounts.list({});
  const accounts = res.data.accounts || [];
  if (accounts.length === 0) {
    console.log('   ⚠️  No GA4 accounts accessible yet.');
    console.log('   → Add utopia-sa@utopia-automation.iam.gserviceaccount.com to your GA4 account as Editor.');
    console.log('   → Go to: analytics.google.com → Admin → Account access management → "+" → Add users');
    process.exit(1);
  }
  console.log(`   ✅ Auth works — found ${accounts.length} GA4 account(s):\n`);
  accounts.forEach((a) => {
    console.log(`     • ${a.displayName} (${a.name})`);
  });
  console.log('\n✓ Ready to run ga4-create.mjs\n');
} catch (err) {
  console.error('\n❌ Auth failed:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
}
