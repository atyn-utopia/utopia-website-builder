// Grant a user publish access to a GTM container.
// Usage: node _grant-gtm-access.mjs <accountId> <containerId> <email>

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [accountId, containerId, email] = process.argv.slice(2);
if (!accountId || !containerId || !email) {
  console.error('Usage: node _grant-gtm-access.mjs <accountId> <containerId> <email>');
  process.exit(1);
}

const auth = getAuth('gtm');
const tm = google.tagmanager({ version: 'v2', auth });

// Check existing
const existing = await tm.accounts.user_permissions.list({
  parent: `accounts/${accountId}`,
});
const userPerm = existing.data.userPermission?.find(p => p.emailAddress === email);

const containerAccess = { containerId, permission: 'publish' };

if (userPerm) {
  // Update existing
  const newContainerAccess = [
    ...(userPerm.containerAccess?.filter(c => c.containerId !== containerId) ?? []),
    containerAccess,
  ];
  await tm.accounts.user_permissions.update({
    path: userPerm.path,
    requestBody: {
      ...userPerm,
      containerAccess: newContainerAccess,
    },
  });
  console.log(`✓ Updated ${email} → publish on container ${containerId}`);
} else {
  // Create new
  await tm.accounts.user_permissions.create({
    parent: `accounts/${accountId}`,
    requestBody: {
      emailAddress: email,
      accountAccess: { permission: 'user' },
      containerAccess: [containerAccess],
    },
  });
  console.log(`✓ Created ${email} → publish on container ${containerId}`);
}
