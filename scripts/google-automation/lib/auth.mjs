import { google } from 'googleapis';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const KEY_PATH = join(homedir(), '.google-credentials', 'utopia-sa.json');
const USER_OAUTH_PATH = join(homedir(), '.google-credentials', 'utopia-user-oauth.json');

const SCOPES = {
  gtm: [
    'https://www.googleapis.com/auth/tagmanager.edit.containers',
    'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
    'https://www.googleapis.com/auth/tagmanager.publish',
    'https://www.googleapis.com/auth/tagmanager.manage.accounts',
    'https://www.googleapis.com/auth/tagmanager.manage.users',
    'https://www.googleapis.com/auth/tagmanager.delete.containers',
  ],
  ga4: [
    'https://www.googleapis.com/auth/analytics.edit',
    'https://www.googleapis.com/auth/analytics.manage.users',
  ],
  gsc: [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/indexing',
    'https://www.googleapis.com/auth/siteverification',
  ],
};

export function getAuth(service) {
  const scopes = SCOPES[service];
  if (!scopes) throw new Error(`Unknown service: ${service}. Use gtm | ga4 | gsc`);

  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  return new google.auth.JWT(key.client_email, null, key.private_key, scopes);
}

export function getServiceAccountEmail() {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  return key.client_email;
}

/**
 * OAuth user auth — acts AS utopiacoliving@gmail.com (or whoever ran
 * oauth-login.mjs). Use this for API calls that need to write to a Gmail
 * user's account (e.g. GSC sites.add for their dashboard sidebar).
 *
 * Falls back gracefully — throws a friendly error if oauth-login.mjs
 * hasn't been run yet.
 */
export function getUserAuth() {
  if (!existsSync(USER_OAUTH_PATH)) {
    throw new Error(
      `User OAuth token not found at ${USER_OAUTH_PATH}.\n` +
      `Run \`node oauth-login.mjs\` first to authorize and save a refresh token.`,
    );
  }
  const t = JSON.parse(readFileSync(USER_OAUTH_PATH, 'utf8'));
  const oauth2 = new google.auth.OAuth2(t.client_id, t.client_secret);
  oauth2.setCredentials({ refresh_token: t.refresh_token });
  return oauth2;
}
