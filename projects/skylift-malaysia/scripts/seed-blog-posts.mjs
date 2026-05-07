#!/usr/bin/env node
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

try {
  for (const line of readFileSync('/Users/intern/Documents/GitHub/utopia-website-system/.env.local', 'utf8').split(/\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1); }

const sb = createClient(url, key);
const WEBSITE = 'skylift-malaysia.vercel.app';

const jsonPath = new URL('./seed-blog-posts.json', import.meta.url);
const { posts } = JSON.parse(readFileSync(jsonPath, 'utf8'));
console.log(`Loaded ${posts.length} posts from JSON`);

console.log('Cleaning existing rows...');
const { data: existing } = await sb.from('blog_posts').select('id').eq('website', WEBSITE);
if (existing?.length) {
  for (const r of existing) {
    await sb.from('blog_translations').delete().eq('post_id', r.id);
  }
  await sb.from('blog_posts').delete().eq('website', WEBSITE);
  console.log(`  removed ${existing.length} existing posts + their translations`);
}

let postCount = 0, trCount = 0, errors = 0;
for (const post of posts) {
  const { data, error } = await sb
    .from('blog_posts')
    .insert({
      slug: post.slug,
      website: WEBSITE,
      status: 'published',
      cover_image_url: post.cover_image_url,
    })
    .select('id')
    .single();
  if (error) { console.error('post fail:', post.slug, error.message); errors++; continue; }
  postCount++;
  for (const tr of post.translations) {
    const { error: tErr } = await sb.from('blog_translations').insert({
      post_id: data.id,
      language: tr.language,
      title: tr.title,
      content: tr.content,
      excerpt: tr.excerpt,
      meta_title: tr.meta_title,
      meta_description: tr.meta_description,
    });
    if (tErr) { console.error('  tr fail:', post.slug, tr.language, tErr.message); errors++; }
    else trCount++;
  }
  console.log(`+ ${post.slug} (${post.translations.length} translations)`);
}

console.log(`\nInserted ${postCount} posts + ${trCount} translations. Errors: ${errors}`);

const { data: verify } = await sb
  .from('blog_posts')
  .select('slug, status, blog_translations(language)')
  .eq('website', WEBSITE);
console.log(`✅ ${verify?.length} posts now in DB for ${WEBSITE}`);
const langs = new Set();
for (const p of verify || []) {
  for (const t of p.blog_translations) langs.add(t.language);
}
console.log('  languages present:', [...langs].sort());
