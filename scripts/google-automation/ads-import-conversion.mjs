// Automate Google Ads conversion import for a Utopia site.
//
// Actual v23 flow (per 2026-05-25 testing on katil-hospital):
//   1. Create a GoogleAdsLink between the GA4 property and the Ads
//      customer via the Analytics Admin API. Once this link exists,
//      Google AUTO-IMPORTS the GA4 Key Events as conversion actions
//      on the Ads side within seconds — you do NOT need to create
//      the conversion_action explicitly. (The script still queries
//      to confirm the auto-imported action exists.)
//   2. The dev token + OAuth user determine WHICH Ads customer we
//      can touch. With `--no-mcc`, we call the customer directly
//      (login_customer_id = target customer itself) rather than via
//      a manager. This works when the OAuth user is a direct admin
//      on the target — true for utopiacoliving@gmail.com on
//      193-375-7591 (Utopia central account).
//
// Usage:
//   node ads-import-conversion.mjs --no-mcc \
//     --customer-id 1933757591 \
//     --domain katilhospital.com.my \
//     --ga4-property-id 538738787 \
//     --event whatsapp_click
//
//   # `--no-mcc` is the recommended path (direct admin access works).
//   # Without `--no-mcc`, the script defaults to login via MCC 511-251-8935,
//   # which only works if that MCC officially manages the target customer.
//
// Prerequisites:
//   1. Google Ads API enabled in GCP project utopia-automation (one-time)
//   2. Approved developer token at ~/.google-credentials/utopia-ads-token.txt
//      (currently: CAHfap-... — Basic Access on MCC 511-251-8935 Manager Utopia)
//   3. User OAuth with adwords + analytics.edit scopes at
//      ~/.google-credentials/utopia-user-oauth.json (run oauth-login.mjs)
//   4. OAuth user must be admin on BOTH the GA4 property AND the Ads customer
//   5. The GA4 event has fired at least once (Google needs to see the event
//      before the conversion will report any data)

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, arg, i, all) => {
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = all[i + 1]?.startsWith('--') ? true : all[i + 1];
      acc.push([key, value]);
    }
    return acc;
  }, []),
);

const customerIdArg = args['customer-id'];
const domain = args.domain;
const ga4PropertyId = args['ga4-property-id'];
const eventName = args.event ?? 'whatsapp_click';

if (!domain || !ga4PropertyId) {
  console.error('Usage: node ads-import-conversion.mjs --customer-id NNN --domain X --ga4-property-id NNN [--event whatsapp_click]');
  console.error('');
  console.error('  --customer-id        regular Ads sub-account ID (omit to list available)');
  console.error('  --domain             site domain (e.g. stickerlori.com.my)');
  console.error('  --ga4-property-id    GA4 numeric property ID (find in configs/<domain>.json)');
  console.error('  --event              GA4 event name to import (default: whatsapp_click)');
  process.exit(1);
}

// ─── Load credentials ─────────────────────────────────────────────
const TOKEN_FILE = join(homedir(), '.google-credentials', 'utopia-ads-token.txt');
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  ?? (existsSync(TOKEN_FILE) ? readFileSync(TOKEN_FILE, 'utf8').trim() : null);

if (!developerToken) {
  console.error('❌ No Google Ads developer token found.');
  console.error('   Save it to ~/.google-credentials/utopia-ads-token.txt');
  process.exit(1);
}

const OAUTH_PATH = join(homedir(), '.google-credentials', 'utopia-user-oauth.json');
if (!existsSync(OAUTH_PATH)) {
  console.error('❌ No user OAuth token found at', OAUTH_PATH);
  console.error('   Run `node oauth-login.mjs` first (with adwords scope).');
  process.exit(1);
}
const oauth = JSON.parse(readFileSync(OAUTH_PATH, 'utf8'));

let GoogleAdsApi, enums;
try {
  ({ GoogleAdsApi, enums } = await import('google-ads-api'));
} catch {
  console.error('❌ google-ads-api package not installed.');
  console.error('   Run: cd google-automation && npm install google-ads-api');
  process.exit(1);
}

// ─── Set up client ────────────────────────────────────────────────
const MCC_ID = '5112518935'; // 511-251-8935 (Manager Utopia)

const client = new GoogleAdsApi({
  client_id: oauth.client_id,
  client_secret: oauth.client_secret,
  developer_token: developerToken,
});

// ─── List sub-accounts if no customer-id given ────────────────────
if (!customerIdArg) {
  console.log(`\n🔎 No --customer-id provided. Listing Ads accounts under MCC ${MCC_ID}...\n`);
  const mccCustomer = client.Customer({
    customer_id: MCC_ID,
    refresh_token: oauth.refresh_token,
  });
  const rows = await mccCustomer.query(`
    SELECT
      customer_client.id,
      customer_client.descriptive_name,
      customer_client.manager,
      customer_client.level,
      customer_client.status
    FROM customer_client
    WHERE customer_client.level <= 1
  `);
  const subAccounts = rows.filter((r) => !r.customer_client.manager);
  if (subAccounts.length === 0) {
    console.error('❌ No regular Ads sub-accounts found under this MCC.');
    console.error('');
    console.error('   Create one first in the Ads UI:');
    console.error('   1. Sign in to https://ads.google.com as utopiacoliving@gmail.com');
    console.error('   2. Switch to Manager Utopia (511-251-8935)');
    console.error('   3. Tools → Account management → + (new account) → Create new account');
    console.error('   4. Name it after the site, e.g. "stickerlori.com.my"');
    console.error('   5. Re-run this script with --customer-id <new account ID>');
    process.exit(1);
  }
  console.log('Available sub-accounts:');
  for (const r of subAccounts) {
    const c = r.customer_client;
    console.log(`  ${c.id.toString().padStart(11)} — ${c.descriptive_name} [${c.status}]`);
  }
  console.log('\nRe-run with --customer-id <id>');
  process.exit(0);
}

const customerId = String(customerIdArg).replace(/-/g, '');

// If --no-mcc flag, operate directly as the customer (when it's a standalone
// account the OAuth user owns, not a child of the MCC).
const customer = args['no-mcc']
  ? client.Customer({
      customer_id: customerId,
      refresh_token: oauth.refresh_token,
    })
  : client.Customer({
      customer_id: customerId,
      login_customer_id: MCC_ID,
      refresh_token: oauth.refresh_token,
    });

// ─── Ensure GA4↔Ads link exists (Google auto-imports conversions once linked) ─
console.log(`\n🔗 Ensuring GA4 property ${ga4PropertyId} is linked to Ads customer ${customerId}...`);
const { google } = await import('googleapis');
const { getUserAuth } = await import('./lib/auth.mjs');
const ga4Auth = getUserAuth();
const ga4Admin = google.analyticsadmin({ version: 'v1beta', auth: ga4Auth });

const existingLinks = await ga4Admin.properties.googleAdsLinks.list({
  parent: `properties/${ga4PropertyId}`,
});
const alreadyLinked = (existingLinks.data.googleAdsLinks || []).some(
  (l) => l.customerId === customerId
);

if (alreadyLinked) {
  console.log(`   ✓ Link already exists`);
} else {
  await ga4Admin.properties.googleAdsLinks.create({
    parent: `properties/${ga4PropertyId}`,
    requestBody: {
      customerId: customerId,
      adsPersonalizationEnabled: true,
    },
  });
  console.log(`   ✓ Created GA4→Ads link (Google will auto-import Key Events within seconds)`);
  // Brief wait for Google to auto-create the conversion action
  await new Promise((r) => setTimeout(r, 5000));
}

// ─── Create or confirm the conversion action ──────────────────────
console.log(`\n🎯 Confirming conversion action on customer ${customerId} for event "${eventName}"...`);

const existing = await customer.query(`
  SELECT
    conversion_action.id,
    conversion_action.name,
    conversion_action.type,
    conversion_action.google_analytics_4_settings.event_name,
    conversion_action.google_analytics_4_settings.property_id
  FROM conversion_action
  WHERE
    conversion_action.type = 'GOOGLE_ANALYTICS_4_CUSTOM'
    AND conversion_action.google_analytics_4_settings.event_name = '${eventName}'
    AND conversion_action.google_analytics_4_settings.property_id = ${ga4PropertyId}
`);

async function activateAutoImportedAction(conversionAction) {
  // Google auto-imports with status=HIDDEN, category=DEFAULT, primary_for_goal=false,
  // counting_type=EVERY, lookback=30d. Update to match the canonical Utopia
  // pattern (verified against backhoe.my and other working sites):
  //   status=ENABLED, category=CONTACT, primary_for_goal=true, lookback=90d
  //
  // counting_type is IMMUTABLE on auto-imported GOOGLE_ANALYTICS_4_CUSTOM actions.
  // It stays EVERY. To change to ONE_PER_CLICK the user must do it manually in
  // Ads UI (Edit conversion → Count → "One").
  await customer.conversionActions.update([{
    resource_name: conversionAction.resource_name,
    status: enums.ConversionActionStatus.ENABLED,
    category: enums.ConversionActionCategory.CONTACT,
    primary_for_goal: true,
    click_through_lookback_window_days: 90,
  }]);
  console.log(`   ✓ Activated: ENABLED + CONTACT + primary + 90d lookback`);
  console.log(`   ℹ️  counting_type stays EVERY (immutable via API).`);
  console.log(`      To change to ONE_PER_CLICK: Ads UI → Edit conversion → Count → "One"`);
}

if (existing.length > 0) {
  console.log(`   ✓ Auto-imported by Google: ${existing[0].conversion_action.name} (id ${existing[0].conversion_action.id})`);
  await activateAutoImportedAction(existing[0].conversion_action);
} else {
  // Google normally auto-imports within ~5s of GA4 link creation.
  // If we get here, either propagation is slower than expected OR the
  // GA4 event hasn't been marked as a Key Event yet. Wait + retry once.
  console.log(`   ⏳ Conversion action not yet auto-imported. Waiting 15s for propagation...`);
  await new Promise((r) => setTimeout(r, 15000));
  const retry = await customer.query(`
    SELECT conversion_action.id, conversion_action.name
    FROM conversion_action
    WHERE conversion_action.type = 'GOOGLE_ANALYTICS_4_CUSTOM'
      AND conversion_action.google_analytics_4_settings.event_name = '${eventName}'
      AND conversion_action.google_analytics_4_settings.property_id = ${ga4PropertyId}
  `);
  if (retry.length > 0) {
    console.log(`   ✓ Found on retry: ${retry[0].conversion_action.name} (id ${retry[0].conversion_action.id})`);
    await activateAutoImportedAction(retry[0].conversion_action);
  } else {
    console.log(`   ⚠️  Conversion action not auto-imported yet.`);
    console.log(`     Check that ${eventName} is marked as a Key Event in GA4 (Admin → Events).`);
    console.log(`     If yes, wait a few more minutes then re-run this script — it's idempotent.`);
  }
}

console.log('\n✅ Conversion import complete.');
console.log('\n' + '─'.repeat(64));
console.log('⚠️  MANUAL STEPS REMAINING (Ads UI — these are NOT exposed in any API):');
console.log('─'.repeat(64));
console.log('  1. Toggle ON "Import app and web metrics"');
console.log('     Open: https://ads.google.com → switch to customer ' + customerId);
console.log('           → Tools → Linked accounts → Google Analytics 4');
console.log('           → click the linked property (' + domain + ')');
console.log('           → toggle ON "Import app and web metrics"');
console.log('     (Audiences toggle is already ON — script set during link creation.)');
console.log('');
console.log('  2. REQUIRED — Change counting to ONE_PER_CLICK');
console.log('     Goals → Conversions → click "' + domain + ' (web) ' + eventName + '"');
console.log('           → Edit settings → Count → change "Every" to "One" → save');
console.log('     (Auto-imported conversions have counting_type=EVERY which is');
console.log('      IMMUTABLE via API. UI is the only way to flip to ONE_PER_CLICK.');
console.log('      This is the canonical Utopia setting (ONE_PER_CLICK = cleaner Smart');
console.log('      Bidding signal) — NOT optional, do it for every site.)\n');
console.log('💡 Visibility:');
console.log('   - Conversion appears in Google Ads → Goals → Conversions → Summary');
console.log('   - First reported data shows once the event fires AND a user converts via an ad');
console.log('   - For non-Ads tracking, the GA4 dashboard remains the source of truth');
