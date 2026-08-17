#!/usr/bin/env node
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';

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

function buildSnippets(containerId) {
  const head = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');</script>
<!-- End Google Tag Manager -->`;

  const body = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

  return { head, body };
}

function injectInto(html, containerId) {
  // Idempotent: skip if this container already injected
  if (html.includes(containerId)) {
    return { html, changed: false, reason: 'already-injected' };
  }

  const { head, body } = buildSnippets(containerId);

  // Inject into <head> — right after opening tag
  const headRegex = /(<head[^>]*>)/i;
  if (!headRegex.test(html)) {
    return { html, changed: false, reason: 'no-head-tag' };
  }
  html = html.replace(headRegex, `$1\n${head}`);

  // Inject noscript right after <body ...>
  const bodyRegex = /(<body[^>]*>)/i;
  if (!bodyRegex.test(html)) {
    return { html, changed: false, reason: 'no-body-tag' };
  }
  html = html.replace(bodyRegex, `$1\n${body}`);

  return { html, changed: true };
}

async function main() {
  const args = parseArgs();

  console.log('\n💉 GTM Snippet Injection\n');

  const container = args.container || await ask('GTM Container ID (e.g. GTM-XXXXXXX): ');
  const siteDir = args.site || await ask('Site folder path (e.g. projects/katilhospital or absolute path): ');

  if (!container || !siteDir) {
    console.error('\n❌ Both --container and --site are required.');
    process.exit(1);
  }

  if (!/^GTM-[A-Z0-9]+$/.test(container)) {
    console.error(`\n❌ Invalid container ID: ${container}. Expected GTM-XXXXXXX`);
    process.exit(1);
  }

  const absDir = resolve(siteDir);
  console.log(`\n📂 Scanning: ${absDir}`);

  const files = await findHtmlFiles(absDir);
  console.log(`   Found ${files.length} HTML file(s)`);

  if (files.length === 0) {
    console.log('\n⚠️  No HTML files found. Check the site path.');
    rl.close();
    return;
  }

  let injected = 0;
  let skipped = 0;
  let errors = 0;

  console.log('\n🔧 Injecting...');
  for (const file of files) {
    const rel = relative(absDir, file);
    try {
      const html = readFileSync(file, 'utf8');
      const result = injectInto(html, container);
      if (result.changed) {
        writeFileSync(file, result.html);
        console.log(`   ✓ ${rel}`);
        injected++;
      } else {
        console.log(`   ⏭  ${rel} (${result.reason})`);
        skipped++;
      }
    } catch (err) {
      console.log(`   ❌ ${rel} — ${err.message}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(64));
  console.log(`✅ Done — injected: ${injected}, skipped: ${skipped}, errors: ${errors}`);
  console.log('='.repeat(64));

  if (args.verify !== false) {
    console.log(`\n💡 Verify by grep:`);
    console.log(`   grep -l "${container}" ${absDir}/**/*.html | head -5\n`);
  }

  rl.close();
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  rl.close();
  process.exit(1);
});
