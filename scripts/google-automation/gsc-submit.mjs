#!/usr/bin/env node
import { google } from 'googleapis';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAuth } from './lib/auth.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
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

async function findHtmlFiles(dir) {
  const out = [];
  const skipDirs = new Set(['node_modules', '.git', 'brand_assets', 'temporary screenshots']);
  async function walk(d) {
    const entries = await readdir(d, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        if (skipDirs.has(e.name)) continue;
        await walk(join(d, e.name));
      } else if (e.isFile() && e.name.endsWith('.html')) {
        out.push(join(d, e.name));
      }
    }
  }
  await walk(dir);
  return out;
}

function extractUrlsFromSitemap(sitemapXml) {
  const urls = [];
  const regex = /<loc>\s*([^<]+?)\s*<\/loc>/g;
  let m;
  while ((m = regex.exec(sitemapXml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

function injectVerificationMeta(html, token) {
  // Google's Site Verification API returns the FULL meta tag as the token value
  // (e.g. `<meta name="google-site-verification" content="XYZ" />`)
  // Inject as-is; do not wrap.
  if (html.includes(token)) {
    return { html, changed: false, reason: 'already-present' };
  }
  const headRegex = /(<head[^>]*>)/i;
  if (!headRegex.test(html)) {
    return { html, changed: false, reason: 'no-head-tag' };
  }
  return { html: html.replace(headRegex, `$1\n${token}`), changed: true };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = parseArgs();

  // Phase mode: "init" = inject meta tag only; "finalize" = verify + submit + index
  // If neither, run full interactive flow (with wait prompt in the middle).
  const phase = args.init ? 'init' : args.finalize ? 'finalize' : 'interactive';
  console.log(`\n🔍 GSC Setup + Bulk URL Indexing (phase: ${phase})\n`);

  const domain = args.domain || await ask('Domain (e.g. katilhospital.com.my): ');
  const siteUrl = args.url || await ask('Live site URL with https and trailing slash (e.g. https://www.katilhospital.com.my/): ');
  const siteDir = args.site || await ask('Site folder path (e.g. ../projects/katil-hospital): ');
  const sitemapArg = args.sitemap;

  if (!domain || !siteUrl || !siteDir) {
    console.error('\n❌ domain, url, site are all required.');
    process.exit(1);
  }

  if (!siteUrl.startsWith('https://') || !siteUrl.endsWith('/')) {
    console.error('\n❌ url must start with https:// and end with /');
    process.exit(1);
  }

  const absDir = resolve(siteDir);
  const sitemapPath = sitemapArg ? resolve(sitemapArg) : join(absDir, 'sitemap.xml');

  const auth = getAuth('gsc');
  const sv = google.siteVerification({ version: 'v1', auth });
  const sc = google.searchconsole({ version: 'v1', auth });
  const indexing = google.indexing({ version: 'v3', auth });

  const configPath = join(CONFIGS_DIR, `${domain}.json`);
  const existingConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};

  let token;

  if (phase === 'init' || phase === 'interactive') {
    // 1. Get verification token via Site Verification API
    console.log(`\n🔑 Requesting verification token from Google...`);
    const tokenRes = await sv.webResource.getToken({
      requestBody: {
        site: { identifier: siteUrl, type: 'SITE' },
        verificationMethod: 'META',
      },
    });
    token = tokenRes.data.token;
    console.log(`   ✓ Token received`);

    // 2. Inject meta tag into all HTML
    console.log(`\n💉 Injecting meta tag into HTML files at ${absDir}...`);
    const files = await findHtmlFiles(absDir);
    console.log(`   Found ${files.length} HTML file(s)`);

    let injected = 0, skipped = 0;
    for (const file of files) {
      const html = readFileSync(file, 'utf8');
      const result = injectVerificationMeta(html, token);
      if (result.changed) {
        writeFileSync(file, result.html);
        injected++;
      } else {
        skipped++;
      }
    }
    console.log(`   ✓ Injected: ${injected}, skipped: ${skipped}`);

    // Save state so finalize phase can pick up
    const config = { ...existingConfig, domain, gsc: { ...existingConfig.gsc, siteUrl, token, initAt: new Date().toISOString() } };
    writeFileSync(configPath, JSON.stringify(config, null, 2));

    if (phase === 'init') {
      console.log('\n' + '='.repeat(64));
      console.log('✅ Phase 1 (init) complete');
      console.log('='.repeat(64));
      console.log(`\n  Config saved: ${configPath}`);
      console.log(`\n🚀 NEXT: Deploy the site, then run:`);
      console.log(`   node gsc-submit.mjs --domain ${domain} --url ${siteUrl} --site ${siteDir} --finalize\n`);
      rl.close();
      return;
    }

    // 3. Wait for deploy (interactive mode only)
    console.log(`\n🚀 Now deploy your site so ${siteUrl} serves the meta tag.`);
    console.log(`   Commit + push to Vercel, or whatever your deploy process is.`);
    await ask(`   Press Enter when the meta tag is live at ${siteUrl}...`);
  } else {
    // finalize: read token from config
    token = existingConfig.gsc?.token;
    if (!token) {
      console.error(`\n❌ No token found in ${configPath}. Run --init first.`);
      rl.close();
      process.exit(1);
    }
    console.log(`\n📖 Resuming from saved state (token from ${configPath})`);
  }

  // 4. Verify ownership
  console.log(`\n✔️  Verifying ownership with Google...`);
  let verified = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await sv.webResource.insert({
        verificationMethod: 'META',
        requestBody: {
          site: { identifier: siteUrl, type: 'SITE' },
        },
      });
      verified = true;
      break;
    } catch (err) {
      console.log(`   Attempt ${attempt}/3 failed: ${err.message.split('\n')[0]}`);
      if (attempt < 3) {
        console.log(`   Retrying in 10s...`);
        await sleep(10000);
      }
    }
  }
  if (!verified) {
    console.log(`   ⚠️  Could not auto-verify. Check meta tag is live + service account email has access. Exiting — re-run after fixing.`);
    rl.close();
    process.exit(1);
  }
  console.log(`   ✓ Ownership verified for ${siteUrl}`);

  // 4a-bis. Register the property in the SERVICE ACCOUNT's own GSC site list.
  // Verifying ownership is NOT the same as the site appearing in the SA's list,
  // and the sitemaps.submit call further down authenticates as the SA. Without
  // this, submit fails with "User does not have sufficient permission for site".
  // Must stay OUTSIDE the --add-owner block below: that block is optional, but
  // this is required on every run. sites.add is idempotent.
  try {
    await sc.sites.add({ siteUrl });
    console.log(`   ✓ Registered ${siteUrl} in the service account's GSC site list`);
  } catch (e) {
    console.log(`   ⚠️  Could not register site for the service account: ${e.message.split('\n')[0]}`);
    console.log(`      Sitemap submit will likely fail — run \`node _add-gsc-site.mjs ${siteUrl}\` then retry.`);
  }

  // 4b. (Optional) Add a human-owner email so they see the property in their
  //     GSC dashboard. The npm googleapis client mis-serializes this body;
  //     direct REST works.
  const ownerEmail = args['add-owner'];
  if (ownerEmail) {
    console.log(`\n👤 Adding ${ownerEmail} as verified owner...`);
    try {
      const tokens = await auth.authorize();
      const id = encodeURIComponent(siteUrl);
      const baseUrl = `https://www.googleapis.com/siteVerification/v1/webResource/${id}`;
      const cur = await fetch(baseUrl, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }).then(r => r.json());
      if (cur.owners?.includes(ownerEmail)) {
        console.log(`   ✓ ${ownerEmail} is already a verified owner`);
      } else {
        const put = await fetch(baseUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: cur.id,
            site: cur.site,
            owners: [...(cur.owners ?? []), ownerEmail],
          }),
        });
        if (!put.ok) {
          console.log(`   ⚠️  Add-owner failed: ${put.status} ${await put.text()}`);
        } else {
          console.log(`   ✓ ${ownerEmail} added as verified owner`);
        }
      }
    } catch (e) {
      console.log(`   ⚠️  Add-owner error: ${e.message.split('\n')[0]}`);
    }

    // 4c. Also add to the user's GSC dashboard sidebar via OAuth (if token exists).
    //     Without this, the property is owned but doesn't appear in their dropdown.
    try {
      const { getUserAuth } = await import('./lib/auth.mjs');
      const userAuth = getUserAuth(); // throws friendly error if oauth-login.mjs not run
      const userSc = google.searchconsole({ version: 'v1', auth: userAuth });
      await userSc.sites.add({ siteUrl });
      console.log(`   ✓ Added to ${ownerEmail}'s GSC dashboard sidebar (via OAuth)`);
    } catch (e) {
      console.log(`   (skipping user-dashboard add: ${e.message.split('\n')[0]})`);
      console.log(`   Tip: run \`node oauth-login.mjs\` once to enable this, or run`);
      console.log(`        \`node _user-add-gsc-properties.mjs ${siteUrl}\` manually.`);
    }
  }

  // 5. Submit sitemap
  // Next.js sites generate sitemap.xml at runtime — file may not exist on disk.
  // Try local file first; if missing, fetch the live URL so we can still
  // submit + bulk-index.
  const sitemapUrl = new URL('sitemap.xml', siteUrl).toString();
  let sitemapXml = null;
  if (existsSync(sitemapPath)) {
    sitemapXml = readFileSync(sitemapPath, 'utf8');
  } else {
    console.log(`\n🗺️  Local sitemap not found at ${sitemapPath} — fetching from ${sitemapUrl}...`);
    try {
      const r = await fetch(sitemapUrl);
      if (r.ok) {
        sitemapXml = await r.text();
        console.log(`   ✓ Got live sitemap (${sitemapXml.length} bytes)`);
      } else {
        console.log(`   ⚠️  Live sitemap returned ${r.status} — skipping submit + index`);
      }
    } catch (e) {
      console.log(`   ⚠️  Could not fetch live sitemap: ${e.message}`);
    }
  }

  if (sitemapXml) {
    console.log(`\n🗺️  Submitting sitemap: ${sitemapUrl}`);
    try {
      await sc.sitemaps.submit({ siteUrl, feedpath: sitemapUrl });
      console.log(`   ✓ Sitemap submitted`);
    } catch (err) {
      console.log(`   ⚠️  Sitemap submit failed: ${err.message.split('\n')[0]}`);
    }

    // 6. Bulk-submit URLs via Indexing API
    const urls = extractUrlsFromSitemap(sitemapXml);
    console.log(`\n🔔 Requesting indexing for ${urls.length} URLs from sitemap...`);
    console.log(`   (Indexing API is best-effort for general URLs; daily quota ~200 requests)`);

    let ok = 0, fail = 0;
    for (const url of urls) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: { url, type: 'URL_UPDATED' },
        });
        ok++;
        process.stdout.write(`   ✓ ${url.replace(siteUrl, '/')}\n`);
      } catch (err) {
        fail++;
        const msg = err.message.split('\n')[0];
        process.stdout.write(`   ❌ ${url.replace(siteUrl, '/')} — ${msg}\n`);
        if (msg.includes('quota') || msg.includes('RATE_LIMIT')) {
          console.log(`\n⚠️  Rate limit / quota hit. Stopping bulk submit. ${ok} succeeded before limit.`);
          break;
        }
      }
      await sleep(200); // gentle rate limit
    }
    console.log(`\n   Indexing summary: ${ok} requested, ${fail} failed`);
  } else {
    console.log(`\n⚠️  Sitemap not found at ${sitemapPath}. Skipping sitemap submission + bulk indexing.`);
  }

  // 7. Save config — update existing
  const finalExisting = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
  const config = {
    ...finalExisting,
    domain,
    gsc: {
      ...(finalExisting.gsc || {}),
      siteUrl,
      verified: true,
      verificationMethod: 'META',
      verifiedAt: new Date().toISOString(),
    },
  };
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log('\n' + '='.repeat(64));
  console.log(`✅ GSC Setup Complete`);
  console.log('='.repeat(64));
  console.log(`\n  Site:        ${siteUrl}`);
  console.log(`  Config:      ${configPath}\n`);
  console.log(`📋 GSC dashboard: https://search.google.com/search-console?resource_id=${encodeURIComponent(siteUrl)}\n`);

  rl.close();
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  rl.close();
  process.exit(1);
});
