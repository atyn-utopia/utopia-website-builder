import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

function readEnv(p) {
  return Object.fromEntries(readFileSync(p,'utf8').split(/\n/).map(l=>l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map(m=>[m[1],m[2]]));
}

const root = readEnv('/Users/intern/Documents/GitHub/utopia-website-builder/.env.local');
const hn = readEnv('/Users/intern/Documents/GitHub/utopia-website-builder/projects/hollywood-night/.env.local');

console.log('--- TEST 1: hollywood-night URL + hn service-role key ---');
{
  const sb = createClient(hn.NEXT_PUBLIC_SUPABASE_URL || hn.SUPABASE_URL, hn.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await sb.from('products').select('website,name').limit(20);
  console.log('result:', error?.message || `${data?.length} rows`);
  if (data) console.log('websites sample:', [...new Set(data.map(r=>r.website))].slice(0,10));
}

console.log('\n--- TEST 2: root URL + root anon key ---');
{
  const sb = createClient(root.NEXT_PUBLIC_SUPABASE_URL, root.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await sb.from('products').select('website,name').limit(20);
  console.log('result:', error?.message || `${data?.length} rows`);
  if (data) console.log('websites sample:', [...new Set(data.map(r=>r.website))].slice(0,10));
}

console.log('\n--- TEST 3: hollywood-night URL + root anon ---');
{
  const sb = createClient(hn.NEXT_PUBLIC_SUPABASE_URL || hn.SUPABASE_URL, root.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await sb.from('products').select('website,name').limit(5);
  console.log('result:', error?.message || `${data?.length} rows`);
}
