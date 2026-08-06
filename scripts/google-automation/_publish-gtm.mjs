// One-shot script to publish a GTM container's latest workspace.
// Usage: node _publish-gtm.mjs <accountId> <containerId> [workspaceId]

import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const [accountId, containerId] = process.argv.slice(2);
if (!accountId || !containerId) {
  console.error('Usage: node _publish-gtm.mjs <accountId> <containerId>');
  process.exit(1);
}

const auth = getAuth('gtm');
const tm = google.tagmanager({ version: 'v2', auth });

// Get default workspace
const workspaces = await tm.accounts.containers.workspaces.list({
  parent: `accounts/${accountId}/containers/${containerId}`,
});
const ws = workspaces.data.workspace?.[0];
if (!ws) {
  console.error('No workspace found');
  process.exit(1);
}

console.log(`Workspace: ${ws.name} (${ws.workspaceId})`);

// Create version
const version = await tm.accounts.containers.workspaces.create_version({
  path: ws.path,
  requestBody: {
    name: `Auto-publish ${new Date().toISOString().split('T')[0]}`,
    notes: 'Manual publish after gtm-setup.mjs interactive prompt error',
  },
});

const versionId = version.data.containerVersion?.containerVersionId;
console.log(`Created version: ${versionId}`);

// Publish
const versionPath = `accounts/${accountId}/containers/${containerId}/versions/${versionId}`;
await tm.accounts.containers.versions.publish({ path: versionPath });
console.log(`✓ Published`);
