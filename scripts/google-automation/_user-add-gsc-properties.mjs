// Add GSC properties to the OAuth user's dashboard sidebar (acts AS the user).
//
// Usage: node _user-add-gsc-properties.mjs <siteUrl1> [<siteUrl2> ...]
// Example: node _user-add-gsc-properties.mjs \
//            https://www.stickerlori.com.my/ \
//            https://www.stickerlori.com.my/en/ \
//            https://www.stickerlori.com.my/zh/
//
// Prerequisites:
//   - oauth-login.mjs has been run (refresh token saved)
//   - User is already a verified owner of each URL (run gsc-submit.mjs --finalize
//     with --add-owner <user-email> first to set that up)

import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error('Usage: node _user-add-gsc-properties.mjs <siteUrl1> [<siteUrl2> ...]');
  process.exit(1);
}

const auth = getUserAuth();
const sc = google.searchconsole({ version: 'v1', auth });

for (const siteUrl of urls) {
  try {
    await sc.sites.add({ siteUrl });
    console.log(`✓ Added ${siteUrl} to user's GSC dashboard`);
  } catch (e) {
    console.log(`✗ ${siteUrl}: ${e.message.split('\n')[0]}`);
  }
}

console.log('\nFinal sites list in user\'s GSC:');
const list = await sc.sites.list();
for (const s of list.data.siteEntry ?? []) {
  console.log(`  - ${s.siteUrl} (${s.permissionLevel})`);
}
