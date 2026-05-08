// Blog seed runner — POSTs blog_posts + blog_translations to Supabase REST API.
// Usage: SUPABASE_SERVICE_ROLE_KEY=… node blog-seed/run.mjs
// Or with service role key already in process env via dotenv-style loader.
import { posts } from './posts.mjs';
import { readFileSync } from 'node:fs';

const SUPABASE_URL = 'https://xzydvhzcngpxdbyniliy.supabase.co';
let SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fallback: load from .env.local in the project root if env var is missing
if (!SERVICE_KEY) {
  try {
    const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    const m = env.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m);
    if (m) SERVICE_KEY = m[1].trim();
  } catch {}
}
if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY (env or .env.local).');
  process.exit(1);
}

const WEBSITE = 'katilhospital-24jam.vercel.app';

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function api(path, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${method} ${path} ${res.status}: ${t}`);
  }
  if (method === 'DELETE' || res.status === 204) return null;
  return res.json();
}

async function postExists(slug) {
  const rows = await api(
    `/blog_posts?website=eq.${WEBSITE}&slug=eq.${encodeURIComponent(slug)}&select=id`,
    'GET',
  );
  return rows[0]?.id ?? null;
}

// The page wrapper already renders post.title as <h1> AND auto-generates a TOC
// from H2s in the body. Strip those duplicates from each translation's content.
function cleanContent(html) {
  // Remove leading <h1>...</h1> (the page renders title separately)
  let out = html.replace(/^\s*<h1[\s\S]*?<\/h1>\s*/i, '');
  // Remove the inline <nav>...</nav> TOC block (the page renders TOC separately)
  out = out.replace(/<nav>[\s\S]*?<\/nav>\s*/i, '');
  return out.trim();
}

async function insertPost(p) {
  const existing = await postExists(p.slug);
  if (existing) {
    console.log(`  ↻ exists, replacing: ${p.slug}`);
    await api(`/blog_translations?post_id=eq.${existing}`, 'DELETE');
    await api(`/blog_posts?id=eq.${existing}`, 'DELETE');
  }
  const [post] = await api('/blog_posts', 'POST', {
    website: WEBSITE,
    slug: p.slug,
    status: 'published',
    cover_image_url: p.cover,
    published_at: p.publishedAt,
  });
  const tr = (locale) => ({
    post_id: post.id,
    language: locale,
    ...p[locale],
    content: cleanContent(p[locale].content),
  });
  await api('/blog_translations', 'POST', [tr('ms'), tr('en'), tr('zh')]);
  return post.id;
}

(async () => {
  console.log(`\nInserting ${posts.length} posts for ${WEBSITE}…\n`);
  for (const p of posts) {
    const id = await insertPost(p);
    console.log(`  ✓ ${p.slug} → ${id}`);
  }
  const verify = await api(
    `/blog_posts?website=eq.${WEBSITE}&select=slug,blog_translations(language)`,
    'GET',
  );
  console.log(`\nVerification: ${verify.length} posts inserted.`);
  let total = 0;
  for (const v of verify) {
    const langs = (v.blog_translations || []).map((t) => t.language).sort().join(',');
    total += v.blog_translations?.length || 0;
    console.log(`  ${v.slug} → [${langs}]`);
  }
  console.log(`\nTotal translation rows: ${total}`);
})().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
