// Blog seed runner — POSTs blog_posts + blog_translations to Supabase REST API.
// Usage: node blog-seed/run.mjs
import { posts } from './posts.mjs';

const SUPABASE_URL = 'https://xzydvhzcngpxdbyniliy.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var.');
  process.exit(1);
}
const WEBSITE = 'coldroom-malaysia.vercel.app';

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
  return res.json();
}

async function postExists(slug) {
  const rows = await api(`/blog_posts?website=eq.${WEBSITE}&slug=eq.${encodeURIComponent(slug)}&select=id`, 'GET');
  return rows[0]?.id ?? null;
}

async function insertPost(p) {
  const existing = await postExists(p.slug);
  if (existing) {
    console.log(`  ↻ exists, deleting: ${p.slug}`);
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
  await api('/blog_translations', 'POST', [
    { post_id: post.id, language: 'en', ...p.en },
    { post_id: post.id, language: 'ms', ...p.ms },
    { post_id: post.id, language: 'zh', ...p.zh },
  ]);
  return post.id;
}

(async () => {
  console.log(`Inserting ${posts.length} posts for ${WEBSITE}…`);
  for (const p of posts) {
    const id = await insertPost(p);
    console.log(`  ✓ ${p.slug} → ${id}`);
  }
  const verify = await api(
    `/blog_posts?website=eq.${WEBSITE}&select=slug,blog_translations(language)`,
    'GET'
  );
  console.log(`\nVerification: ${verify.length} posts.`);
  for (const v of verify) {
    const langs = (v.blog_translations || []).map((t) => t.language).sort().join(',');
    console.log(`  ${v.slug} → [${langs}]`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
