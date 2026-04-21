import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
const envText = readFileSync('/Users/intern/Documents/GitHub/utopia-website-system/.env.local', 'utf8');
for (const line of envText.split(/\n/)) { const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2]; }
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data: prods, error } = await sb.from('products').select('website, name').limit(20);
console.log('total visible products:', prods?.length || 0, 'error:', error?.message);
const websites = new Set((prods || []).map(p => p.website));
console.log('websites:', [...websites]);
// Try inserting a phone_numbers row (might have different RLS)
const { error: phoneErr } = await sb.from('phone_numbers').insert({ website:'xxx.test', location_slug:'all', phone_number:'60000000000', label:'default', type:'default', is_active:false, whatsapp_text:'test', percentage:1 });
console.log('phone insert:', phoneErr?.message);
