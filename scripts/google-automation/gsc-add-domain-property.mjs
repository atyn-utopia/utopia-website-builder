// Automate adding a GSC Domain property (DNS TXT verification) for a
// Utopia site whose DNS is hosted on Vercel.
//
// Flow:
//   1. Fetch the google-site-verification TXT token via Site Verification API
//      (acting AS utopiacoliving@gmail.com so the property appears in their
//      GSC dashboard sidebar with no extra "Add property" click)
//   2. Add the TXT record to Vercel DNS via `vercel dns add`
//   3. Poll DNS until the TXT is visible (Vercel DNS propagates in seconds)
//   4. Call Site Verification API to confirm ownership
//   5. Submit the canonical sitemap to the new Domain property
//
// Usage:
//   node gsc-add-domain-property.mjs --domain stickerlori.com.my \
//     --sitemap https://www.stickerlori.com.my/sitemap.xml \
//     [--vercel-scope chokchunynh-4497s-projects]
//
// Prerequisites:
//   - DNS for <domain> is managed by Vercel (nameservers point to Vercel)
//   - Vercel CLI authenticated (`vercel whoami`) with access to the scope
//   - oauth-login.mjs run, refresh token at ~/.google-credentials/utopia-user-oauth.json
//     has siteverification + webmasters scopes

import { google } from 'googleapis';
import { execSync, spawnSync } from 'node:child_process';
import { promises as dns } from 'node:dns';
import { getUserAuth } from './lib/auth.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, arg, i, all) => {
    if (arg.startsWith('--')) {
      const k = arg.slice(2);
      const v = all[i + 1]?.startsWith('--') ? true : all[i + 1];
      acc.push([k, v]);
    }
    return acc;
  }, []),
);

const domain = args.domain;
const sitemapUrl = args.sitemap;
const vercelScope = args['vercel-scope'] ?? 'chokchunynh-4497s-projects';

if (!domain || !sitemapUrl) {
  console.error('Usage: node gsc-add-domain-property.mjs --domain X --sitemap URL [--vercel-scope NAME]');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── 1. Fetch verification token ──────────────────────────────────
console.log(`\n🔑 Step 1: Fetch DNS TXT verification token for ${domain}`);
const auth = getUserAuth();
const sv = google.siteVerification({ version: 'v1', auth });
const sc = google.searchconsole({ version: 'v1', auth });

const tokenRes = await sv.webResource.getToken({
  requestBody: {
    site: { type: 'INET_DOMAIN', identifier: domain },
    verificationMethod: 'DNS_TXT',
  },
});
const token = tokenRes.data.token;
console.log(`   ✓ Token: ${token.slice(0, 32)}...`);

// ─── 2. Add TXT record to Vercel DNS ──────────────────────────────
// Vercel CLI: `vercel dns add <domain> @ TXT "<value>" --scope <scope>`
console.log(`\n🌐 Step 2: Add TXT record to Vercel DNS`);

// Check existing TXT records to avoid duplicates on re-runs
let existing = [];
try {
  existing = await dns.resolveTxt(domain);
} catch {
  // No TXT records exist yet — that's fine
}
const flatExisting = existing.flat();
const alreadySet = flatExisting.includes(token);
if (alreadySet) {
  console.log(`   ✓ TXT already present in DNS — skipping add`);
} else {
  const result = spawnSync(
    'vercel',
    ['dns', 'add', domain, '@', 'TXT', token, '--scope', vercelScope, '--non-interactive'],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    console.error(`   ✗ vercel dns add failed:`);
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
  console.log(`   ✓ TXT record added to Vercel DNS`);
}

// ─── 3. Poll DNS until TXT is visible ─────────────────────────────
console.log(`\n⏳ Step 3: Wait for DNS propagation`);
const MAX_WAIT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 5000;
const startedAt = Date.now();
let propagated = false;

while (Date.now() - startedAt < MAX_WAIT_MS) {
  try {
    const txtRecords = (await dns.resolveTxt(domain)).flat();
    if (txtRecords.includes(token)) {
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      console.log(`   ✓ TXT visible in DNS after ${elapsed}s`);
      propagated = true;
      break;
    }
  } catch {
    // DNS query failed — domain may not have any TXT yet
  }
  process.stdout.write('.');
  await sleep(POLL_INTERVAL_MS);
}

if (!propagated) {
  console.error(`\n   ✗ TXT did not propagate within ${MAX_WAIT_MS / 1000}s`);
  console.error(`     Check manually: dig +short TXT ${domain}`);
  process.exit(1);
}

// ─── 4. Trigger verification ──────────────────────────────────────
console.log(`\n✔️  Step 4: Verify ownership with Google`);
let verified = false;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await sv.webResource.insert({
      verificationMethod: 'DNS_TXT',
      requestBody: { site: { type: 'INET_DOMAIN', identifier: domain } },
    });
    console.log(`   ✓ Verified (attempt ${attempt})`);
    verified = true;
    break;
  } catch (err) {
    const msg = err.errors?.[0]?.message ?? err.message ?? String(err);
    console.log(`   Attempt ${attempt}/3 failed: ${msg.split('\n')[0]}`);
    if (attempt < 3) {
      console.log(`   Retrying in 15s...`);
      await sleep(15000);
    }
  }
}
if (!verified) {
  console.error(`\n   ✗ Verification failed after 3 attempts. Check that DNS is fully propagated.`);
  process.exit(1);
}

// ─── 5. Add to user's Search Console dashboard ────────────────────
// Verification at the Site Verification API level doesn't auto-propagate
// to the Search Console API — we have to add the property explicitly so
// the user's webmasters API permissions catch up. Domain properties use
// the sc-domain: URL scheme.
const scDomainSiteUrl = `sc-domain:${domain}`;
console.log(`\n📋 Step 5: Add Domain property to Search Console`);
try {
  await sc.sites.add({ siteUrl: scDomainSiteUrl });
  console.log(`   ✓ Added ${scDomainSiteUrl} to GSC`);
} catch (err) {
  const msg = err.errors?.[0]?.message ?? err.message ?? String(err);
  if (msg.includes('already') || err.code === 409) {
    console.log(`   ✓ Already in GSC`);
  } else {
    console.log(`   ⚠ sites.add: ${msg.split('\n')[0]}`);
  }
}

// ─── 6. Submit sitemap to the Domain property ─────────────────────
console.log(`\n🗺️  Step 6: Submit sitemap to Domain property`);
console.log(`     siteUrl: ${scDomainSiteUrl}`);
console.log(`     sitemap: ${sitemapUrl}`);

let sitemapSubmitted = false;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await sc.sitemaps.submit({ siteUrl: scDomainSiteUrl, feedpath: sitemapUrl });
    console.log(`   ✓ Sitemap submitted (attempt ${attempt})`);
    sitemapSubmitted = true;
    break;
  } catch (err) {
    const msg = err.errors?.[0]?.message ?? err.message ?? String(err);
    console.log(`   Attempt ${attempt}/3: ${msg.split('\n')[0]}`);
    if (attempt < 3) {
      console.log(`   Waiting 10s for permission propagation...`);
      await sleep(10000);
    }
  }
}
if (!sitemapSubmitted) {
  console.log(`   ⚠ Sitemap auto-submit failed after retries.`);
  console.log(`     Property is still verified — submit the sitemap manually:`);
  console.log(`     GSC → ${domain} (Domain property) → Sitemaps → ${sitemapUrl}`);
}

console.log('\n✅ Done. Domain property is live.');
console.log(`\n💡 Verify in GSC:`);
console.log(`   1. Open https://search.google.com/search-console signed in as utopiacoliving@gmail.com`);
console.log(`   2. Property switcher (top-left) should now list "${domain}" alongside the URL-prefix ones`);
console.log(`   3. Data starts populating within 24–48h\n`);
