-- Electrician 24 Hours — product (service) seed
-- Run in Supabase SQL editor. Safe to re-run (cleans first).

BEGIN;

DELETE FROM product_photos
  WHERE product_id IN (SELECT id FROM products WHERE website = 'electrician-24-hour.vercel.app');
DELETE FROM products WHERE website = 'electrician-24-hour.vercel.app';

WITH ins AS (
  INSERT INTO products (website, name, slug, description, sale_price, rental_price, sort_order, is_active)
  VALUES
    ('electrician-24-hour.vercel.app', 'Plug Point Add & Repair', 'plug-point',
     'Add new plug points, replace burnt sockets, fix loose connections and tripped breakers. ST-registered wiremen — fixed RM80 per-job pricing includes diagnosis, parts (standard 13A socket) and testing. Same-day across Klang Valley.',
     80, NULL, 1, true),
    ('electrician-24-hour.vercel.app', 'Ceiling Fan & Exhaust Fan Installation', 'ceiling-fan-installation',
     'New ceiling fan install or old-fan replacement with proper down-rod mounting, wiring to wall regulator and capacitor check. From RM150 per fan — includes balancing and a 30-day workmanship warranty.',
     150, NULL, 2, true),
    ('electrician-24-hour.vercel.app', 'Air-Cond Electrical Service', 'aircond-electrical',
     'Dedicated aircond point wiring, isolator switch installation, MCB upgrade for inverter units. We handle the electrical side — your aircond technician handles refrigerant. From RM130.',
     130, NULL, 3, true),
    ('electrician-24-hour.vercel.app', 'Downlight & Ceiling Light Installation', 'downlight-installation',
     'New downlight cut-out, LED strip mounting, chandelier hanging and dimmer switch wiring. From RM60 per point — bundle pricing available when installing 6 or more points in one visit.',
     60, NULL, 4, true),
    ('electrician-24-hour.vercel.app', 'Water Heater Installation', 'water-heater',
     'Instant and storage water heater wiring with dedicated MCB + RCCB, waterproof isolator and safety earth. From RM150 — critical for bathroom safety. Includes post-install leak / insulation check.',
     150, NULL, 5, true),
    ('electrician-24-hour.vercel.app', 'Full House Rewiring', 'full-house-rewiring',
     'Complete removal of old aluminium / decayed PVC cabling, replaced with new copper + modern DB board, RCCB, MCBs and ELCB. Suitable for homes over 20 years old. Quoted on-site with a written scope and per-phase schedule.',
     2500, NULL, 6, true),
    ('electrician-24-hour.vercel.app', 'DB Box Repair & Upgrade', 'db-box-upgrade',
     'Buzzing main switch, tripping MCB, burnt neutral, overloaded DB — we rebuild it. Upgraded to current SIRIM-approved RCCBs/MCBs with full phase labelling and circuit testing.',
     450, NULL, 7, true),
    ('electrician-24-hour.vercel.app', '24-Hour Emergency Call-Out', 'emergency-callout',
     'Power out at 2 AM. Plug sparking. Smoke from DB. We dispatch 24/7 across Malaysia — 4-hour arrival for Klang Valley, under 8 hours for outer cities. Flat call-out fee, fix price quoted before any work starts.',
     180, NULL, 8, true)
  RETURNING id, slug
)
INSERT INTO product_photos (product_id, url)
SELECT ins.id, photo.url
FROM ins
JOIN (VALUES
  ('plug-point', 'https://electrician-24-hour.vercel.app/gallery/gallery-1.png'),
  ('plug-point', 'https://electrician-24-hour.vercel.app/gallery/gallery-2.png'),
  ('ceiling-fan-installation', 'https://electrician-24-hour.vercel.app/gallery/gallery-3.png'),
  ('ceiling-fan-installation', 'https://electrician-24-hour.vercel.app/gallery/gallery-4.png'),
  ('aircond-electrical', 'https://electrician-24-hour.vercel.app/gallery/gallery-5.png'),
  ('aircond-electrical', 'https://electrician-24-hour.vercel.app/gallery/gallery-6.png'),
  ('downlight-installation', 'https://electrician-24-hour.vercel.app/gallery/gallery-7.png'),
  ('downlight-installation', 'https://electrician-24-hour.vercel.app/gallery/gallery-8.png'),
  ('water-heater', 'https://electrician-24-hour.vercel.app/gallery/gallery-9.png'),
  ('water-heater', 'https://electrician-24-hour.vercel.app/gallery/gallery-11.png'),
  ('full-house-rewiring', 'https://electrician-24-hour.vercel.app/gallery/gallery-12.png'),
  ('full-house-rewiring', 'https://electrician-24-hour.vercel.app/gallery/gallery-2.png'),
  ('db-box-upgrade', 'https://electrician-24-hour.vercel.app/gallery/gallery-1.png'),
  ('db-box-upgrade', 'https://electrician-24-hour.vercel.app/gallery/gallery-3.png'),
  ('emergency-callout', 'https://electrician-24-hour.vercel.app/gallery/gallery-4.png'),
  ('emergency-callout', 'https://electrician-24-hour.vercel.app/gallery/gallery-6.png')
) AS photo(slug, url) ON photo.slug = ins.slug;

COMMIT;

-- Verify
SELECT p.slug, p.name, p.sale_price, count(ph.id) AS photos
FROM products p
LEFT JOIN product_photos ph ON ph.product_id = p.id
WHERE p.website = 'electrician-24-hour.vercel.app' AND p.is_active = true
GROUP BY p.id, p.slug, p.name, p.sale_price, p.sort_order
ORDER BY p.sort_order;
