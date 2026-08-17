#!/usr/bin/env node
import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const GTM_ACCOUNT_ID = '6000211475';
const containerId = process.argv[2];

if (!containerId) {
  console.error('Usage: node inspect-container.mjs GTM-XXXXXXX');
  process.exit(1);
}

const auth = getAuth('gtm');
const tm = google.tagmanager({ version: 'v2', auth });

const list = await tm.accounts.containers.list({ parent: `accounts/${GTM_ACCOUNT_ID}` });
const target = (list.data.container || []).find((c) => c.publicId === containerId);
if (!target) {
  console.error(`❌ Container ${containerId} not found`);
  process.exit(1);
}

console.log('\n=== FULL CONTAINER OBJECT ===');
console.log(JSON.stringify(target, null, 2));
