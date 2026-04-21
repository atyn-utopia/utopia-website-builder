-- Electrician 24 Hours — phone_numbers + company_websites seed
-- Run in Supabase SQL editor. Safe to re-run (cleans first).

BEGIN;

-- 1. Register website under Encik Beku Aircond Sdn. Bhd.
DELETE FROM company_websites WHERE domain = 'electrician-24-hour.vercel.app';
INSERT INTO company_websites (company_id, domain, leads_mode)
VALUES ('16e62068-365d-4907-b7f0-763a173d8afa',
        'electrician-24-hour.vercel.app',
        'single');

-- 2. Seed default phone number
DELETE FROM phone_numbers WHERE website = 'electrician-24-hour.vercel.app';
INSERT INTO phone_numbers
  (website, location_slug, phone_number, label, type, is_active, whatsapp_text, percentage)
VALUES
  ('electrician-24-hour.vercel.app', 'all', '60174287801', 'default', 'default',
   true,
   'Hi, saya perlukan juruelektrik 24 jam di Malaysia. Boleh bantu saya sekarang?',
   100);

COMMIT;

-- Verify
SELECT cw.domain, cw.leads_mode, c.name AS company, pn.phone_number, pn.whatsapp_text, pn.percentage
FROM company_websites cw
JOIN companies c ON c.id = cw.company_id
JOIN phone_numbers pn ON pn.website = cw.domain
WHERE cw.domain = 'electrician-24-hour.vercel.app';
