#!/usr/bin/env node
import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

console.log('\n🔐 Testing GSC-related APIs...\n');

const auth = getAuth('gsc');
const sv = google.siteVerification({ version: 'v1', auth });
const sc = google.searchconsole({ version: 'v1', auth });
const indexing = google.indexing({ version: 'v3', auth });

// 1. Test Site Verification API
try {
  await sv.webResource.list({});
  console.log('   ✅ Site Verification API — reachable');
} catch (err) {
  console.log(`   ❌ Site Verification API — ${err.message.split('\n')[0]}`);
  if (err.message.includes('has not been used') || err.message.includes('disabled')) {
    console.log('      → Enable at: https://console.cloud.google.com/apis/library/siteverification.googleapis.com');
  }
}

// 2. Test Search Console API
try {
  const sites = await sc.sites.list({});
  console.log(`   ✅ Search Console API — reachable (${(sites.data.siteEntry || []).length} verified sites)`);
} catch (err) {
  console.log(`   ❌ Search Console API — ${err.message.split('\n')[0]}`);
}

// 3. Test Indexing API (just check scope + token)
try {
  // Indexing API doesn't have a "list" method — we just verify auth works by getting a token
  await auth.authorize();
  console.log('   ✅ Indexing API — auth ready');
} catch (err) {
  console.log(`   ❌ Indexing API — ${err.message.split('\n')[0]}`);
}

console.log('');
