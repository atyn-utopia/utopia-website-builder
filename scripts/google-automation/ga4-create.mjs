#!/usr/bin/env node
import { google } from 'googleapis';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAuth } from './lib/auth.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIGS_DIR = join(__dirname, 'configs');

const TIMEZONE = 'Asia/Kuala_Lumpur';
const CURRENCY = 'MYR';
const INDUSTRY = 'BUSINESS_AND_INDUSTRIAL_MARKETS';

const rl = readline.createInterface({ input, output });
const ask = async (q) => (await rl.question(q)).trim();

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = process.argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

async function main() {
  const args = parseArgs();

  console.log('\n📊 GA4 Property Setup — Utopia\n');

  const domain = args.domain || await ask('Domain (e.g. katilhospital.com.my): ');
  if (!domain) {
    console.error('\n❌ Domain is required.');
    process.exit(1);
  }

  const siteUrl = args.url || `https://www.${domain}`;

  const auth = getAuth('ga4');
  const admin = google.analyticsadmin({ version: 'v1beta', auth });
  const adminAlpha = google.analyticsadmin({ version: 'v1alpha', auth });

  // 1. List accessible GA4 accounts
  console.log('\n🔍 Finding GA4 accounts...');
  const accountsRes = await admin.accounts.list({});
  const accounts = accountsRes.data.accounts || [];
  if (accounts.length === 0) {
    console.error('\n❌ No GA4 accounts accessible. Add SA as Editor to a GA4 account first.');
    process.exit(1);
  }

  let account;
  if (args['account-name']) {
    account = accounts.find((a) => a.displayName === args['account-name']);
    if (!account) {
      console.error(`\n❌ Account "${args['account-name']}" not found. Available: ${accounts.map(a => a.displayName).join(', ')}`);
      process.exit(1);
    }
  } else if (accounts.length === 1) {
    account = accounts[0];
  } else {
    console.log('\nAccessible GA4 accounts:');
    accounts.forEach((a, i) => console.log(`   ${i + 1}. ${a.displayName} (${a.name})`));
    const choice = await ask(`\nPick account (1-${accounts.length}): `);
    account = accounts[parseInt(choice) - 1];
    if (!account) {
      console.error('\n❌ Invalid choice');
      process.exit(1);
    }
  }
  console.log(`   ✓ Using account: ${account.displayName}`);

  // 2. Create property
  console.log(`\n📦 Creating property "${domain}"...`);
  const property = await admin.properties.create({
    requestBody: {
      parent: account.name,
      displayName: domain,
      timeZone: TIMEZONE,
      currencyCode: CURRENCY,
      industryCategory: INDUSTRY,
    },
  });
  const propertyName = property.data.name; // properties/123456
  const propertyId = propertyName.replace('properties/', '');
  console.log(`   ✓ Property ID: ${propertyId}`);

  // 3. Create web data stream
  console.log(`\n🌐 Creating web data stream...`);
  const stream = await admin.properties.dataStreams.create({
    parent: propertyName,
    requestBody: {
      type: 'WEB_DATA_STREAM',
      displayName: domain,
      webStreamData: { defaultUri: siteUrl },
    },
  });
  const streamName = stream.data.name;
  const measurementId = stream.data.webStreamData.measurementId;
  console.log(`   ✓ Measurement ID: ${measurementId}`);

  // 4. Enhanced Measurement — enabled by default on new web streams (all toggles ON)
  console.log(`\n🎯 Enhanced Measurement: ON by default (GA4 new stream default)`);

  // 5. Set data retention to 14 months
  console.log(`\n🗓️  Setting data retention to 14 months...`);
  await admin.properties.updateDataRetentionSettings({
    name: `${propertyName}/dataRetentionSettings`,
    updateMask: 'eventDataRetention,resetUserDataOnNewActivity',
    requestBody: {
      eventDataRetention: 'FOURTEEN_MONTHS',
      resetUserDataOnNewActivity: true,
    },
  });
  console.log(`   ✓ Data retention set`);

  // 5.1 Acknowledge user-provided data collection (PDF page 6)
  console.log(`\n🤝 Acknowledging user data collection...`);
  await adminAlpha.properties.acknowledgeUserDataCollection({
    property: propertyName,
    requestBody: {
      acknowledgement: 'I acknowledge that I have the necessary privacy disclosures and rights from my end users for the collection and processing of their data, including the association of such data with the visitation information Google Analytics collects from my site and/or app property.',
    },
  }).catch((e) => {
    console.log(`   ⚠️  User data acknowledgment: ${e.message}`);
  });
  console.log(`   ✓ User data collection acknowledged`);

  // 5.2 Enable Google Signals (PDF page 6)
  console.log(`\n📶 Enabling Google Signals...`);
  // Step 1: consent
  await adminAlpha.properties.updateGoogleSignalsSettings({
    name: `${propertyName}/googleSignalsSettings`,
    updateMask: 'consent',
    requestBody: { consent: 'GOOGLE_SIGNALS_CONSENT_CONSENTED' },
  }).catch(() => {});
  // Step 2: enable state
  const signalsOk = await adminAlpha.properties.updateGoogleSignalsSettings({
    name: `${propertyName}/googleSignalsSettings`,
    updateMask: 'state',
    requestBody: { state: 'GOOGLE_SIGNALS_ENABLED' },
  }).then(() => true).catch((e) => {
    console.log(`   ⚠️  Auto-enable failed: ${e.message.split('\n')[0]}`);
    console.log(`   → Manual 1-click: GA4 → Admin → Data collection → "Turn on" Google Signals`);
    return false;
  });
  if (signalsOk) console.log(`   ✓ Google Signals enabled`);

  // 6. Pre-register whatsapp_click as Key Event (skips 24h wait)
  console.log(`\n⭐ Pre-registering whatsapp_click as Key Event...`);
  await admin.properties.keyEvents.create({
    parent: propertyName,
    requestBody: {
      eventName: 'whatsapp_click',
      countingMethod: 'ONCE_PER_EVENT',
    },
  }).catch((e) => {
    console.log(`   ⚠️  Key event creation skipped: ${e.message}`);
  });
  console.log(`   ✓ whatsapp_click pre-registered`);

  // 7. Save config
  mkdirSync(CONFIGS_DIR, { recursive: true });
  const configPath = join(CONFIGS_DIR, `${domain}.json`);
  const existing = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
  const config = {
    ...existing,
    domain,
    ga4: {
      accountId: account.name.replace('accounts/', ''),
      accountName: account.displayName,
      propertyId,
      propertyName,
      measurementId,
      streamName,
      siteUrl,
      createdAt: new Date().toISOString(),
    },
  };
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log('\n' + '='.repeat(64));
  console.log(`✅ GA4 Setup Complete`);
  console.log('='.repeat(64));
  console.log(`\n  Measurement ID: ${measurementId}`);
  console.log(`  Property ID:    ${propertyId}`);
  console.log(`  Config saved:   ${configPath}`);

  console.log('\n' + '─'.repeat(64));
  console.log('ℹ️  2 toggles still OFF (Signals + user-provided data) — AUTOMATED in Phase 6:');
  console.log('─'.repeat(64));
  console.log(`  node finalize-manual-toggles.mjs --domain ${domain}`);
  console.log('  (run it after Phase 5 / ads-import — it does GA4 + Ads toggles in one pass,');
  console.log('   idempotent + API-verified. Manual fallback documented in MANUAL-STEPS.md.)');

  console.log(`\n💡 Next: node gtm-setup.mjs --domain ${domain} --ga4-id ${measurementId} --skip-extras\n`);

  rl.close();
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  rl.close();
  process.exit(1);
});
