#!/usr/bin/env node
import { google } from 'googleapis';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAuth } from './lib/auth.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GTM_ACCOUNT_ID = '6000211475';
const GTM_OWNER_EMAIL = 'utopiacoliving@gmail.com';
const CONFIGS_DIR = join(__dirname, 'configs');

const rl = readline.createInterface({ input, output });
const ask = async (q) => (await rl.question(q)).trim();
const askYN = async (q) => ['y', 'yes'].includes((await ask(q + ' (y/n): ')).toLowerCase());

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

  console.log('\n🏗️  GTM Container Setup — Utopia Website\n');

  const domain = args.domain || await ask('Domain (e.g. katilhospital.com.my): ');
  const ga4Id = args['ga4-id'] || await ask('GA4 Measurement ID (e.g. G-XXXXXXXXXX): ');

  if (!domain || !ga4Id) {
    console.error('\n❌ Both domain and GA4 Measurement ID are required.');
    process.exit(1);
  }

  if (!/^G-[A-Z0-9]+$/.test(ga4Id)) {
    console.error(`\n❌ Invalid GA4 Measurement ID: ${ga4Id}. Expected format: G-XXXXXXXXXX`);
    process.exit(1);
  }

  // Container name = canonical web origin (www.<domain>) so it lines up with
  // the deployed site URL in GTM dashboard. Override with --container-name.
  const containerName = args['container-name'] || `www.${domain}`;

  const auth = getAuth('gtm');
  const tm = google.tagmanager({ version: 'v2', auth });
  const accountPath = `accounts/${GTM_ACCOUNT_ID}`;

  // 1. Create container
  console.log(`\n📦 Creating container "${containerName}"...`);
  const container = await tm.accounts.containers.create({
    parent: accountPath,
    requestBody: { name: containerName, usageContext: ['web'] },
  }).catch((e) => {
    if (e.message.includes('already exists')) {
      console.error(`❌ Container "${containerName}" already exists. Delete it first or use a different name.`);
      process.exit(1);
    }
    throw e;
  });

  const containerId = container.data.publicId;      // GTM-XXXXXXX
  const containerPath = container.data.path;        // accounts/X/containers/Y
  const internalContainerId = container.data.containerId; // numeric, for user permissions
  console.log(`   ✓ Container ID: ${containerId}`);

  // Grant owner Publish access so they can see/edit it in GTM UI
  await grantContainerAccess(tm, GTM_ACCOUNT_ID, internalContainerId, GTM_OWNER_EMAIL);
  console.log(`   ✓ Granted Publish access to ${GTM_OWNER_EMAIL}`);

  // 2. Get default workspace
  const workspaces = await tm.accounts.containers.workspaces.list({ parent: containerPath });
  const workspace = workspaces.data.workspace[0];
  const workspacePath = workspace.path;
  console.log(`   ✓ Workspace: ${workspace.name}`);

  // 3. Enable Built-In Click variables
  console.log('\n🔧 Enabling Built-In Click variables...');
  const clickVars = ['clickElement', 'clickClasses', 'clickId', 'clickTarget', 'clickUrl', 'clickText'];
  for (const type of clickVars) {
    await tm.accounts.containers.workspaces.built_in_variables.create({
      parent: workspacePath,
      type,
    }).catch((e) => {
      if (!e.message.includes('already exists')) throw e;
    });
  }
  console.log(`   ✓ ${clickVars.length} click vars enabled`);

  // 4. Create Constant variable for Measurement ID
  console.log('\n📝 Creating Constant variable...');
  const constVar = await tm.accounts.containers.workspaces.variables.create({
    parent: workspacePath,
    requestBody: {
      name: 'Constant_Measurement ID',
      type: 'c',
      parameter: [{ type: 'template', key: 'value', value: ga4Id }],
    },
  });
  console.log(`   ✓ Constant_Measurement ID = ${ga4Id}`);

  // 5. Create All Pages trigger (needed for Google Tag + Conversion Linker)
  console.log('\n🎯 Creating All Pages trigger...');
  const allPagesTrigger = await tm.accounts.containers.workspaces.triggers.create({
    parent: workspacePath,
    requestBody: { name: 'All Pages', type: 'pageview' },
  });
  const allPagesTriggerId = allPagesTrigger.data.triggerId;
  console.log(`   ✓ All Pages trigger created`);

  const noConsentNeeded = { consentStatus: 'notNeeded' };

  // 6. Create Google Tag
  console.log('\n🏷️  Creating Google Tag...');
  await tm.accounts.containers.workspaces.tags.create({
    parent: workspacePath,
    requestBody: {
      name: 'Google Tag',
      type: 'googtag',
      parameter: [
        { type: 'template', key: 'tagId', value: '{{Constant_Measurement ID}}' },
      ],
      firingTriggerId: [allPagesTriggerId],
      consentSettings: noConsentNeeded,
    },
  });
  console.log(`   ✓ Google Tag → fires on All Pages (no consent required)`);

  // 7. Create Conversion Linker
  console.log('\n🔗 Creating Conversion Linker...');
  await tm.accounts.containers.workspaces.tags.create({
    parent: workspacePath,
    requestBody: {
      name: 'Conversion Linker',
      type: 'gclidw',
      firingTriggerId: [allPagesTriggerId],
      consentSettings: noConsentNeeded,
    },
  });
  console.log(`   ✓ Conversion Linker → fires on All Pages (no consent required)`);

  // 8. Default whatsapp_click event
  const events = [];
  await createEventPair(tm, workspacePath, {
    redirectPath: '/redirect-whatsapp-1',
    eventName: 'whatsapp_click',
  });
  events.push({ redirectPath: '/redirect-whatsapp-1', eventName: 'whatsapp_click' });

  // 9. Loop for additional events (skippable via --skip-extras OR auto-skipped
  //    when stdin is not a TTY, since interactive prompts would crash).
  if (args['skip-extras'] || !process.stdin.isTTY) {
    const reason = args['skip-extras'] ? '--skip-extras' : 'non-interactive stdin';
    console.log(`\n➕ Skipping additional events (${reason})`);
  } else {
    console.log('\n➕ Additional tracking events (optional)');
    try {
      while (await askYN('   Add another tracking event?')) {
        const redirectPath = await ask('      Redirect path (e.g. /redirect-call-1): ');
        const eventName = await ask('      GA4 event name (e.g. phone_click): ');
        if (!redirectPath || !eventName) {
          console.log('      ⚠️  Skipped — path or event name was empty');
          continue;
        }
        await createEventPair(tm, workspacePath, { redirectPath, eventName });
        events.push({ redirectPath, eventName });
      }
    } catch (e) {
      // Readline closed unexpectedly — don't crash before the publish step
      console.log(`   ⚠️  Interactive prompt failed (${e.message}). Continuing to publish.`);
    }
  }

  // 10. Publish version
  console.log('\n🚀 Publishing GTM container...');
  const versionName = `Auto-setup ${new Date().toISOString().split('T')[0]}`;
  const version = await tm.accounts.containers.workspaces.create_version({
    path: workspacePath,
    requestBody: { name: versionName, notes: `Auto-generated by gtm-setup.mjs` },
  });
  const versionId = version.data.containerVersion.containerVersionId;
  const versionPath = `${containerPath}/versions/${versionId}`;

  await tm.accounts.containers.versions.publish({ path: versionPath });
  console.log(`   ✓ Published: ${versionName}`);

  // 11. Save config + output snippet
  mkdirSync(CONFIGS_DIR, { recursive: true });
  const config = {
    domain,
    containerId,
    gtmAccountId: GTM_ACCOUNT_ID,
    ga4MeasurementId: ga4Id,
    events,
    createdAt: new Date().toISOString(),
  };
  const configPath = join(CONFIGS_DIR, `${domain}.json`);
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log('\n' + '='.repeat(64));
  console.log(`✅ GTM Setup Complete`);
  console.log('='.repeat(64));
  console.log(`\nContainer ID: ${containerId}`);
  console.log(`Config saved: ${configPath}\n`);

  console.log('📋 Next step — inject this snippet into <head> of every HTML:\n');
  console.log(`<!-- Google Tag Manager -->`);
  console.log(`<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`);
  console.log(`new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`);
  console.log(`j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`);
  console.log(`'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`);
  console.log(`})(window,document,'script','dataLayer','${containerId}');</script>`);
  console.log(`<!-- End Google Tag Manager -->\n`);

  console.log('And immediately after <body>:\n');
  console.log(`<!-- Google Tag Manager (noscript) -->`);
  console.log(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"`);
  console.log(`height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
  console.log(`<!-- End Google Tag Manager (noscript) -->\n`);

  console.log(`💡 Or run: node inject-gtm-snippet.mjs --container ${containerId}\n`);

  console.log('─'.repeat(64));
  console.log(`⚠️  MANUAL STEPS REMAINING (GTM API does not expose these):`);
  console.log('─'.repeat(64));
  console.log(`  Open: https://tagmanager.google.com/#/container/accounts/${GTM_ACCOUNT_ID}/containers/${internalContainerId}/admin`);
  console.log(`  (Sign in as ${GTM_OWNER_EMAIL} — already granted publish access)\n`);
  console.log(`  [ ] 1. Container Settings → tick "Enable consent overview (BETA)"`);
  console.log(`         Required for GDPR/PDPA compliance dashboards.`);
  console.log(`         The GTM API v2 does NOT expose this toggle, so it MUST be done`);
  console.log(`         in the UI. Takes ~3 seconds.\n`);
  console.log(`  (Optional) Set up additional consent zones / regional triggers as needed.\n`);

  rl.close();
}

async function grantContainerAccess(tm, accountId, internalContainerId, email) {
  const existing = await tm.accounts.user_permissions.list({
    parent: `accounts/${accountId}`,
  });
  const userPerm = (existing.data.userPermission || []).find(
    (p) => p.emailAddress?.toLowerCase() === email.toLowerCase()
  );

  const newAccess = { containerId: internalContainerId, permission: 'publish' };

  if (!userPerm) {
    await tm.accounts.user_permissions.create({
      parent: `accounts/${accountId}`,
      requestBody: {
        emailAddress: email,
        accountAccess: { permission: 'user' },
        containerAccess: [newAccess],
      },
    });
  } else {
    const currentAccess = userPerm.containerAccess || [];
    const existingForContainer = currentAccess.find((a) => a.containerId === internalContainerId);
    // Already publish → nothing to do. Otherwise REPLACE the existing entry
    // (the GTM org model auto-grants Org admins a 'read' entry on new containers,
    // which left the owner stuck in read-only — append-only kept the read entry).
    if (existingForContainer?.permission === 'publish') return;
    await tm.accounts.user_permissions.update({
      path: userPerm.path,
      requestBody: {
        ...userPerm,
        containerAccess: [
          ...currentAccess.filter((a) => a.containerId !== internalContainerId),
          newAccess,
        ],
      },
    });
  }
}

async function createEventPair(tm, workspacePath, { redirectPath, eventName }) {
  console.log(`\n⚡ Creating event: ${eventName} → ${redirectPath}`);

  // Create Just Links trigger
  const trigger = await tm.accounts.containers.workspaces.triggers.create({
    parent: workspacePath,
    requestBody: {
      name: eventName,
      type: 'linkClick',
      waitForTags: { type: 'boolean', value: 'false' },
      checkValidation: { type: 'boolean', value: 'false' },
      filter: [{
        type: 'contains',
        parameter: [
          { type: 'template', key: 'arg0', value: '{{Click URL}}' },
          { type: 'template', key: 'arg1', value: redirectPath },
        ],
      }],
    },
  });

  // Create GA4 Event tag firing on that trigger
  await tm.accounts.containers.workspaces.tags.create({
    parent: workspacePath,
    requestBody: {
      name: eventName,
      type: 'gaawe',
      parameter: [
        { type: 'template', key: 'measurementIdOverride', value: '{{Constant_Measurement ID}}' },
        { type: 'template', key: 'eventName', value: eventName },
      ],
      firingTriggerId: [trigger.data.triggerId],
      consentSettings: { consentStatus: 'notNeeded' },
    },
  });

  console.log(`   ✓ Trigger + GA4 event tag created`);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  rl.close();
  process.exit(1);
});
