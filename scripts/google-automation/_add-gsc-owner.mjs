// Add an additional verified owner to a GSC property.
// Usage: node _add-gsc-owner.mjs <siteUrl> <email>
//
// Why this script exists: the googleapis npm client serializes the
// webResource.update body in a way the Site Verification API rejects
// ("The site ... of type SITE is invalid"). A direct REST PUT works fine.
//
// Prerequisites:
// - SA must already be a verified owner (run gsc-submit.mjs --finalize first)
// - The verification meta tag must be live on the site
//
// After running, the email will see the property in their GSC dashboard.

import { getAuth } from './lib/auth.mjs';

const [siteUrl, email] = process.argv.slice(2);
if (!siteUrl || !email) {
  console.error('Usage: node _add-gsc-owner.mjs <siteUrl> <email>');
  console.error('Example: node _add-gsc-owner.mjs https://www.example.com/ user@gmail.com');
  process.exit(1);
}

const auth = getAuth('gsc');
const tokens = await auth.authorize();
const accessToken = tokens.access_token;

const id = encodeURIComponent(siteUrl);
const baseUrl = `https://www.googleapis.com/siteVerification/v1/webResource/${id}`;

// 1. Fetch current resource (need the existing owners)
const getRes = await fetch(baseUrl, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
if (!getRes.ok) {
  console.error(`✗ Could not fetch resource: ${getRes.status} ${await getRes.text()}`);
  process.exit(1);
}
const resource = await getRes.json();

if (resource.owners?.includes(email)) {
  console.log(`✓ ${email} is already a verified owner of ${siteUrl}`);
  process.exit(0);
}

// 2. PUT with appended owner. The npm googleapis client mis-serializes this;
//    direct fetch is reliable.
const putRes = await fetch(baseUrl, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: resource.id,
    site: resource.site,
    owners: [...(resource.owners ?? []), email],
  }),
});

if (!putRes.ok) {
  console.error(`✗ PUT failed: ${putRes.status}\n${await putRes.text()}`);
  process.exit(1);
}

const updated = await putRes.json();
console.log(`✓ ${email} added as verified owner of ${siteUrl}`);
console.log(`  Total owners: ${updated.owners.length}`);
console.log(`\n→ ${email} should now see ${siteUrl} in their GSC dashboard at`);
console.log('  https://search.google.com/search-console');
