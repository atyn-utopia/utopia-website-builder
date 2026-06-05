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
const sb = createClient(url, key);

// Vercel auto-assigned a different bare-domain because the canonical was taken.
// Mirror the company_websites + phone_numbers rows for the actual deployed host
// so getPhoneNumber resolves them dynamically instead of falling back to the constant.
const DOMAINS = [
  'skylift-malaysia-lake.vercel.app',
  'skylift-rental-malaysia.utopiaai.my',
];
const COMPANY_ID = '7c15d93f-c2f7-488d-b38c-4b85d65a06d1';

for (const domain of DOMAINS) {
  await sb.from('company_websites').delete().eq('domain', domain);
  const { error: cwErr } = await sb.from('company_websites').insert({
    company_id: COMPANY_ID, domain, leads_mode: 'single',
  });
  console.log(domain, 'company_websites:', cwErr?.message || 'OK');

  await sb.from('phone_numbers').delete().eq('website', domain);
  const { error: phErr } = await sb.from('phone_numbers').insert({
    website: domain, location_slug: 'all', phone_number: '60139499318',
    label: 'default', type: 'default', is_active: true,
    whatsapp_text: 'Hi, saya berminat untuk sewa skylift. Boleh bantu?',
    percentage: 100,
  });
  console.log(domain, 'phone_numbers:', phErr?.message || 'OK');
}

const { data: pn } = await sb.from('phone_numbers').select('website,phone_number').in('website', DOMAINS);
console.log('verify:', pn);
