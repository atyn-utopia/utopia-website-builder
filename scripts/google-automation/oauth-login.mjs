// One-time OAuth login for user-authorized Google API calls.
//
// After running this once, ~/.google-credentials/utopia-user-oauth.json
// holds a refresh token that scripts can use to call Google APIs AS
// the logged-in user (not as the service account).
//
// Use case: GSC sites.add() needs to add a property to the user's
// dashboard. The SA can verify ownership + add as owner via API, but
// the per-user sidebar registration requires user-context API calls.
//
// Usage: node oauth-login.mjs
//
// Prerequisites:
//   1. OAuth 2.0 Client ID (Desktop app) created in Google Cloud Console
//   2. Client JSON saved to ~/.google-credentials/utopia-oauth-client.json
//   3. User's email added as test user on the OAuth consent screen

import { google } from 'googleapis';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import http from 'node:http';
import { exec } from 'node:child_process';

const CRED_DIR = join(homedir(), '.google-credentials');
const CLIENT_PATH = join(CRED_DIR, 'utopia-oauth-client.json');
const TOKEN_PATH = join(CRED_DIR, 'utopia-user-oauth.json');

if (!existsSync(CLIENT_PATH)) {
  console.error(`✗ OAuth client JSON not found at ${CLIENT_PATH}`);
  console.error('  Download from Google Cloud Console → APIs → Credentials → your Desktop OAuth client');
  process.exit(1);
}

const clientRaw = JSON.parse(readFileSync(CLIENT_PATH, 'utf8'));
const cfg = clientRaw.installed ?? clientRaw.web ?? clientRaw;
const { client_id, client_secret } = cfg;
if (!client_id || !client_secret) {
  console.error('✗ Could not parse client_id / client_secret from OAuth JSON');
  process.exit(1);
}

// Use a local loopback redirect (Google's recommended flow for desktop apps)
const REDIRECT_PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}`;

const oauth2 = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

// Scopes we'll need across all Google APIs (mirror lib/auth.mjs scopes)
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/siteverification',
  'https://www.googleapis.com/auth/analytics.edit',
  'https://www.googleapis.com/auth/analytics.manage.users',
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  'https://www.googleapis.com/auth/tagmanager.manage.users',
  'https://www.googleapis.com/auth/tagmanager.publish',
  'https://www.googleapis.com/auth/adwords',  // Google Ads API — for automated conversion import (ads-import-conversion.mjs)
];

const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',    // we want a refresh token
  prompt: 'consent',         // force consent screen so refresh_token is returned
  scope: SCOPES,
});

console.log('\n🔐 OAuth login flow');
console.log('\n1. Opening this URL in your browser:');
console.log(`   ${authUrl}\n`);
console.log('2. Sign in as utopiacoliving@gmail.com');
console.log('3. You\'ll see "This app isn\'t verified" — click Advanced → Go to Utopia Automation (unsafe). This is normal for unpublished OAuth apps and only allows your own test user.');
console.log('4. Tick all the requested scopes → Continue');
console.log(`5. Browser will redirect to ${REDIRECT_URI} — this page won\'t exist, but the URL in your address bar contains the auth code. The local server below will catch it automatically.\n`);

// Spin up a tiny local server to catch the redirect
const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, REDIRECT_URI);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    if (error) {
      res.end(`OAuth error: ${error}. Close this window and re-run.`);
      server.close();
      reject(new Error(error));
      return;
    }
    if (code) {
      res.end('✓ Auth code received. You can close this tab and return to the terminal.');
      server.close();
      resolve(code);
    }
  });
  server.listen(REDIRECT_PORT, () => {
    console.log(`(local catch-redirect server listening on port ${REDIRECT_PORT})`);
    // Open URL in default browser (macOS)
    exec(`open "${authUrl}"`);
  });
});

console.log('\nExchanging auth code for tokens...');
const { tokens } = await oauth2.getToken(code);

if (!tokens.refresh_token) {
  console.error('\n✗ No refresh_token returned. This usually means you previously authorized this app — revoke it at https://myaccount.google.com/permissions and re-run.');
  process.exit(1);
}

mkdirSync(CRED_DIR, { recursive: true });
writeFileSync(TOKEN_PATH, JSON.stringify({
  client_id,
  client_secret,
  refresh_token: tokens.refresh_token,
  saved_at: new Date().toISOString(),
}, null, 2));

console.log(`\n✓ Refresh token saved to ${TOKEN_PATH}`);
console.log('\nFrom now on, scripts using lib/auth.mjs getUserAuth() can act AS this user.');
