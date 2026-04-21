#!/usr/bin/env node
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

for (const p of [
  '/Users/intern/Documents/GitHub/utopia-website-system/.env.local',
  '/Users/intern/Documents/GitHub/utopia-website-system/projects/hollywood-night/.env.local',
]) {
  try {
    for (const line of readFileSync(p, 'utf8').split(/\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1); }

const sb = createClient(url, key);
const DOMAIN = 'electrician-24-hour.vercel.app';
const COMPANY_ID = '16e62068-365d-4907-b7f0-763a173d8afa'; // Encik Beku Aircond

// 1. company_websites
await sb.from('company_websites').delete().eq('domain', DOMAIN);
const { error: cwErr } = await sb.from('company_websites').insert({
  company_id: COMPANY_ID,
  domain: DOMAIN,
  leads_mode: 'single',
});
if (cwErr) { console.error('company_websites:', cwErr.message); process.exit(1); }
console.log('+ company_websites row inserted');

// 2. phone_numbers
await sb.from('phone_numbers').delete().eq('website', DOMAIN);
const { error: phErr } = await sb.from('phone_numbers').insert({
  website: DOMAIN,
  location_slug: 'all',
  phone_number: '60174287801',
  label: 'default',
  type: 'default',
  is_active: true,
  whatsapp_text: 'Hi, saya perlukan juruelektrik 24 jam di Malaysia. Boleh bantu saya sekarang?',
  percentage: 100,
});
if (phErr) { console.error('phone_numbers:', phErr.message); process.exit(1); }
console.log('+ phone_numbers row inserted');

// Verify
const { data: cw } = await sb.from('company_websites').select('*, companies(name)').eq('domain', DOMAIN).single();
const { data: pn } = await sb.from('phone_numbers').select('*').eq('website', DOMAIN).single();
console.log('✅ verified:');
console.log('  domain:', cw?.domain, '| leads_mode:', cw?.leads_mode, '| company:', cw?.companies?.name);
console.log('  phone:', pn?.phone_number, '| is_active:', pn?.is_active);
