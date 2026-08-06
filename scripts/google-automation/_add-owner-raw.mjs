// Try direct REST call (bypassing googleapis client) — sometimes the lib
// serializes bodies in a way the API rejects.

import { getAuth } from './lib/auth.mjs';

const [siteUrl, email] = process.argv.slice(2);
if (!siteUrl || !email) {
  console.error('Usage: node _add-owner-raw.mjs <siteUrl> <email>');
  process.exit(1);
}

const auth = getAuth('gsc');
const tokens = await auth.authorize();
const accessToken = tokens.access_token;

// 1. Get current resource
const id = encodeURIComponent(siteUrl);
const getRes = await fetch(`https://www.googleapis.com/siteVerification/v1/webResource/${id}`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
if (!getRes.ok) {
  console.error('GET failed:', getRes.status, await getRes.text());
  process.exit(1);
}
const resource = await getRes.json();
console.log('Before:', JSON.stringify(resource, null, 2));

// 2. PUT updated resource with new owner
const newOwners = [...(resource.owners ?? []), email];
const updateBody = {
  id: resource.id,
  site: resource.site,
  owners: newOwners,
};
console.log('\nPUT body:', JSON.stringify(updateBody, null, 2));

const putRes = await fetch(`https://www.googleapis.com/siteVerification/v1/webResource/${id}`, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updateBody),
});
const putBody = await putRes.text();
console.log(`\nResponse ${putRes.status}:`, putBody);
