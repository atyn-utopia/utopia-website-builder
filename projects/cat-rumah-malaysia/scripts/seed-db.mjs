// One-off seed script. Reads env from repo-root .env.local symlink.
// Uses anon key by default — writes will succeed only if the shared Supabase
// instance has a policy allowing anon INSERT. Otherwise the script prints the
// required SQL so Layla can run it manually.
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envFile = join(__dirname, '..', '.env.local')
try {
  const raw = readFileSync(envFile, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '')
  }
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const WEBSITE = 'cat-rumah-malaysia.vercel.app'

if (!url || !key) {
  console.error('Missing env. Need NEXT_PUBLIC_SUPABASE_URL + anon/service key.')
  process.exit(1)
}

const supabase = createClient(url, key)

async function main() {
  console.log('Seeding phone_numbers row…')
  // Check if row already exists first (avoid duplicates since no unique constraint exists)
  const { data: existing } = await supabase
    .from('phone_numbers')
    .select('id')
    .eq('website', WEBSITE)
    .eq('location_slug', 'all')
    .limit(1)

  let pErr = null
  if (!existing || existing.length === 0) {
    const { error } = await supabase.from('phone_numbers').insert({
      website: WEBSITE,
      location_slug: 'all',
      phone_number: '60174287801',
      whatsapp_text: 'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?',
      percentage: 100,
      label: 'default',
      type: 'default',
      is_active: true,
    })
    pErr = error
  } else {
    console.log('phone_numbers row already exists, skipping insert.')
  }
  if (pErr) console.error('phone_numbers insert error:', pErr.message)
  else console.log('phone_numbers row OK.')

  console.log('Upserting company_websites row…')
  const { error: cErr } = await supabase
    .from('company_websites')
    .upsert({ domain: WEBSITE, leads_mode: 'single' }, { onConflict: 'domain' })
  if (cErr) console.error('company_websites upsert error:', cErr.message)
  else console.log('company_websites row OK.')

  // Verify
  const { data } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('website', WEBSITE)
  console.log('Verify: rows for', WEBSITE, '→', data?.length ?? 0)
  if (pErr || cErr) {
    console.log('\nMANUAL SQL FALLBACK (run in Supabase SQL editor):')
    console.log(`INSERT INTO company_websites (domain, leads_mode) VALUES ('${WEBSITE}', 'single') ON CONFLICT (domain) DO UPDATE SET leads_mode = EXCLUDED.leads_mode;`)
    console.log(`INSERT INTO phone_numbers (website, location_slug, phone_number, whatsapp_text, percentage, label, type, is_active) VALUES ('${WEBSITE}', 'all', '60174287801', 'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?', 100, 'default', 'default', true) ON CONFLICT DO NOTHING;`)
    process.exit(2)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
