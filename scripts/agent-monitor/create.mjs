// New websites from the Website Factory — the same thing the Utopia Wizard's
// /new and /new/bulk do (utopia-wizard: app/api/projects/create/route.ts,
// lib/createGithubProject.ts, lib/newProject.ts, lib/drafts.ts), run locally:
//
//   repo utopiagrowth/site-<slug>, seeded with inputs.md + the builder's CLAUDE.md
//   → brand files into brand_assets/ → registered in the wizard (user_repos,
//   project_owners) → monitor-scan dispatched → build started in a new terminal.
//
// Drafts live in the wizard's own table (webcore.project_drafts), so a draft
// started in either app shows in both.
//
// Credentials stay in this process: GitHub through the local `gh` login, the
// database through SUPABASE_SERVICE_ROLE_KEY from the repo's .env.local.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const run = promisify(execFile);

const ORG = 'utopiagrowth';
const BUILDER_REPO = 'atyn-utopia/utopia-website-builder';
const SCAN_WORKFLOW = 'monitor-scan.yml';
const DRAFT_BUCKET = 'wizard-draft-assets';
const MAX_SITES = 20;
const MAX_ASSET_BYTES = 30 * 1024 * 1024;
// Where new repos are cloned for their build: next to the other fleet sites.
export const CLONE_DIR = path.join(os.homedir(), 'Documents', 'GitHub', 'atyn-workspace', 'utopia-website-builder', 'projects');

// ---------------------------------------------------------------- naming (lib/newProject.ts)

export const toSlug = (s) => String(s).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const siteRepoName = (slug) => (slug.startsWith('site-') ? slug : `site-${slug}`);
const safeAssetName = (name) => String(name).replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'asset';

const BUILD_INSTRUCTION =
  'Using @CLAUDE.md, read inputs.md and everything in brand_assets/, then generate this website end-to-end following the Utopia build system (agents, SEO, i18n, Supabase, deploy).';

function orchestratorPrompt(dirs) {
  const n = dirs.length;
  return [
    `This folder holds ${n} new site repo${n === 1 ? '' : 's'} to build: ${dirs.join(', ')}. Other folders here are existing sites; leave them alone.`,
    '',
    'You are the orchestrator. Build each site in its own subagent (Agent tool), at most 3-4 running at once.',
    "Each subagent works ONLY inside its own repo folder (use absolute paths), reads that repo's CLAUDE.md and inputs.md first,",
    'and generates that website end-to-end following the Utopia build system its CLAUDE.md describes (agents, SEO, i18n, Supabase).',
    'Give each subagent its own dev-server port so screenshots never collide.',
    '',
    'Batch the gates: every subagent stops at Gate 1 (design). Show me one table with a summary and screenshots of every site.',
    'Once I approve, continue each one (SendMessage to the same subagent) up to Gate 2 (content) and batch it the same way.',
    'Do not deploy any site until I give you its phone number.',
    '',
    'Several of these sites may share a niche and region. Each must differ in visual direction, palette, headlines, copy',
    'and location-page wording. Cross-check the sites against each other before Gate 1 and again before Gate 2.',
  ].join(' ');
}

/** Paste-many format: blocks split by a `---` line; first line the name, the rest the brief. */
export function parseBulk(text) {
  return String(text)
    .split(/^\s*-{3,}\s*$/m)
    .map((block) => {
      const lines = block.split('\n');
      const at = lines.findIndex((l) => l.trim());
      if (at < 0) return null;
      return { name: lines[at].trim(), brief: lines.slice(at + 1).join('\n').trim() };
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------- credentials

function readEnvFile(keys, files) {
  const out = {};
  for (const k of keys) if (process.env[k]) out[k] = process.env[k];
  for (const f of files) {
    try {
      for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m && keys.includes(m[1]) && !out[m[1]]) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    } catch {}
  }
  return out;
}

let envFiles = [];
export function useEnvFiles(files) { envFiles = files; }

function supabase() {
  const env = readEnvFile(['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'], envFiles);
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY / SUPABASE_URL not found in .env.local, so drafts and wizard registration are unavailable.');
  const h = (extra = {}) => ({ apikey: key, Authorization: `Bearer ${key}`, 'Accept-Profile': 'webcore', 'Content-Profile': 'webcore', 'Content-Type': 'application/json', ...extra });
  return { rest: `${url}/rest/v1`, storage: `${url}/storage/v1`, h };
}

// ---------------------------------------------------------------- GitHub account
// The Factory signs in as one of the GitHub accounts the local `gh` CLI holds,
// fetched per account (`gh auth token -u <login>`), so choosing one here never
// switches gh's active account for other terminals. Signing out only makes the
// Factory forget its choice; gh stays logged in.
const SESSION_FILE = path.join(os.homedir(), '.config', 'website-factory', 'session.json');

function readSession() {
  try { return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8')); } catch { return null; }
}
function writeSession(login) {
  fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
  fs.writeFileSync(SESSION_FILE, JSON.stringify({ login, at: new Date().toISOString() }), { mode: 0o600 });
  gh = null;
}

/** Accounts gh is logged in to on this machine. */
export async function ghAccounts() {
  try {
    const { stdout } = await run('gh', ['auth', 'status', '--json', 'hosts']);
    const list = JSON.parse(stdout).hosts?.['github.com'] || [];
    return list.filter((a) => a.state === 'success').map((a) => ({ login: a.login, active: !!a.active }));
  } catch { return []; }
}

/** Who the Factory acts as: the saved choice, or gh's active account the first time. */
export async function currentLogin() {
  const saved = readSession();
  const accounts = await ghAccounts();
  if (saved) return accounts.some((a) => a.login === saved.login) ? saved.login : null;
  return accounts.find((a) => a.active)?.login ?? null;
}

export async function signIn(login) {
  const accounts = await ghAccounts();
  if (!accounts.some((a) => a.login === login)) throw new Error(`gh isn't logged in as @${login} on this machine. Run "gh auth login" in a terminal first.`);
  writeSession(login);
  return login;
}
export function signOut() { writeSession(null); }

let gh = null; // { token, login }
async function github() {
  if (gh) return gh;
  const login = await currentLogin();
  if (!login) throw new Error('Sign in with GitHub first (top right of the page).');
  try {
    const { stdout: token } = await run('gh', ['auth', 'token', '--hostname', 'github.com', '--user', login]);
    gh = { token: token.trim(), login };
    return gh;
  } catch (e) {
    throw new Error(`Couldn't get a GitHub token for @${login}: ${e.message}`);
  }
}
const ghHeaders = (token) => ({ Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' });

async function ghApi(method, p, body) {
  const { token } = await github();
  const res = await fetch(`https://api.github.com${p}`, {
    method,
    headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${p} → ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

// ---------------------------------------------------------------- drafts (lib/drafts.ts)

export async function listDrafts() {
  const { login } = await github();
  const db = supabase();
  const res = await fetch(`${db.rest}/project_drafts?created_by=eq.${encodeURIComponent(login)}&order=updated_at.desc&select=*`, { headers: db.h(), signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Could not read drafts (${res.status}).`);
  return res.json();
}

export async function saveDraft({ id, name = '', brief = '', visibility = 'private' }) {
  const { login } = await github();
  const db = supabase();
  const row = { name: String(name).slice(0, 200), brief: String(brief), visibility: visibility === 'public' ? 'public' : 'private', updated_at: new Date().toISOString() };
  const res = id
    ? await fetch(`${db.rest}/project_drafts?id=eq.${encodeURIComponent(id)}&created_by=eq.${encodeURIComponent(login)}`, { method: 'PATCH', headers: db.h({ Prefer: 'return=representation' }), body: JSON.stringify(row) })
    : await fetch(`${db.rest}/project_drafts`, { method: 'POST', headers: db.h({ Prefer: 'return=representation' }), body: JSON.stringify({ ...row, created_by: login, mode: 'new', existing_repo: '', assets: [] }) });
  if (!res.ok) throw new Error(`Could not save the draft (${res.status}): ${(await res.text()).slice(0, 160)}`);
  return (await res.json())[0];
}

export async function deleteDraft(id) {
  const { login } = await github();
  const db = supabase();
  const rows = await (await fetch(`${db.rest}/project_drafts?id=eq.${encodeURIComponent(id)}&created_by=eq.${encodeURIComponent(login)}&select=assets`, { headers: db.h() })).json();
  const paths = (rows[0]?.assets || []).map((a) => a.path).filter((p) => typeof p === 'string' && p.startsWith(`${id}/`));
  if (paths.length) await fetch(`${db.storage}/object/${DRAFT_BUCKET}`, { method: 'DELETE', headers: db.h(), body: JSON.stringify({ prefixes: paths }) }).catch(() => {});
  const res = await fetch(`${db.rest}/project_drafts?id=eq.${encodeURIComponent(id)}&created_by=eq.${encodeURIComponent(login)}`, { method: 'DELETE', headers: db.h({ Prefer: 'return=minimal' }) });
  if (!res.ok) throw new Error(`Could not delete the draft (${res.status}).`);
}

/** A wizard draft's brand files, downloaded so they can go into the new repo. */
async function draftAssets(id) {
  const { login } = await github();
  const db = supabase();
  const rows = await (await fetch(`${db.rest}/project_drafts?id=eq.${encodeURIComponent(id)}&created_by=eq.${encodeURIComponent(login)}&select=assets`, { headers: db.h() })).json();
  const out = [];
  for (const a of rows[0]?.assets || []) {
    if (typeof a.path !== 'string' || !a.path.startsWith(`${id}/`)) continue;
    const res = await fetch(`${db.storage}/object/${DRAFT_BUCKET}/${a.path.split('/').map(encodeURIComponent).join('/')}`, { headers: db.h() });
    if (res.ok) out.push({ name: a.name || a.path.slice(id.length + 1), base64: Buffer.from(await res.arrayBuffer()).toString('base64') });
  }
  return out;
}

// ---------------------------------------------------------------- create (route.ts + createGithubProject.ts)

async function createOne(site, login, claudeMd) {
  const name = String(site.name || '').trim();
  const brief = String(site.brief || '').trim();
  const slug = toSlug(site.slug || name);
  if (!slug) throw new Error('A name is required.');
  if (!brief) throw new Error('A brief is required.');
  const assets = [...(site.assets || [])];
  if (site.draftId) assets.push(...(await draftAssets(site.draftId)));
  for (const a of assets) if (Buffer.byteLength(a.base64 || '', 'base64') > MAX_ASSET_BYTES) throw new Error(`${a.name} is over 30 MB.`);

  const inputsMd = `# ${name || slug} — Project Inputs

**Created:** ${new Date().toISOString()}
**Slug:** ${slug}
**Owner:** @${login}

## Brief
${brief}

## Brand Assets
${assets.length ? assets.map((a) => `- brand_assets/${safeAssetName(a.name)}`).join('\n') : '- (none attached)'}

${assets.length ? '`@brand_assets/…` in the brief points at one of these files.' : ''}
`;
  const files = [{ path: 'inputs.md', content: inputsMd, encoding: 'utf-8' }];
  if (claudeMd) files.push({ path: 'CLAUDE.md', content: claudeMd, encoding: 'utf-8' });
  for (const a of assets) files.push({ path: `brand_assets/${safeAssetName(a.name)}`, content: a.base64, encoding: 'base64' });

  // 1. repo with an initial commit (the Git Data API refuses an empty repo)
  const repoName = siteRepoName(slug);
  let repo;
  try {
    repo = await ghApi('POST', `/orgs/${ORG}/repos`, { name: repoName, description: name || slug, private: site.visibility !== 'public', auto_init: true });
  } catch (e) {
    if (/name already exists/i.test(e.message)) throw new Error(`A repo named ${repoName} already exists in ${ORG}. Pick another name.`);
    throw e;
  }
  const full = repo.full_name;
  const branch = repo.default_branch || 'main';
  let parent = '';
  for (let i = 0; i < 8 && !parent; i++) {
    try { parent = (await ghApi('GET', `/repos/${full}/git/ref/heads/${branch}`)).object.sha; } catch { await new Promise((r) => setTimeout(r, 800)); }
  }
  if (!parent) throw new Error(`${full} was created but its first commit never appeared.`);
  // 2. one commit with every seed file, on a fresh tree (drops the auto README)
  const tree = [];
  for (const f of files) {
    const blob = await ghApi('POST', `/repos/${full}/git/blobs`, { content: f.content, encoding: f.encoding });
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const t = await ghApi('POST', `/repos/${full}/git/trees`, { tree });
  const c = await ghApi('POST', `/repos/${full}/git/commits`, { message: 'chore: scaffold project (Website Factory)', tree: t.sha, parents: [parent] });
  await ghApi('PATCH', `/repos/${full}/git/refs/heads/${branch}`, { sha: c.sha, force: true });

  // 3. show it in the wizard (best effort, like the wizard itself)
  let registered = false;
  try {
    const db = supabase();
    const a = await fetch(`${db.rest}/user_repos?on_conflict=github_login,repo_full_name`, {
      method: 'POST', headers: db.h({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ github_login: login, repo_full_name: full, repo_id: repo.id ?? null, default_branch: branch, project_slug: slug, html_url: repo.html_url, is_active: true }),
    });
    const b = await fetch(`${db.rest}/project_owners?on_conflict=slug`, {
      method: 'POST', headers: db.h({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ slug, github_login: login, assigned_by: login, updated_at: new Date().toISOString() }),
    });
    registered = a.ok && b.ok;
  } catch {}

  if (site.draftId) await deleteDraft(site.draftId).catch(() => {});
  return { slug, repoFullName: full, htmlUrl: repo.html_url, cloneUrl: repo.clone_url, assets: assets.length, registered };
}

async function dispatchScan(slugs) {
  const ok = slugs.filter((s) => /^[a-z0-9][a-z0-9-]{0,59}$/.test(s));
  try {
    await ghApi('POST', `/repos/${BUILDER_REPO}/actions/workflows/${SCAN_WORKFLOW}/dispatches`, { ref: 'main', inputs: { only: ok.join(',') } });
    return 'only';
  } catch (e) {
    if (!/→ 422/.test(e.message)) throw e;
    await ghApi('POST', `/repos/${BUILDER_REPO}/actions/workflows/${SCAN_WORKFLOW}/dispatches`, { ref: 'main' });
    return 'all';
  }
}

// ---------------------------------------------------------------- start the build

const shq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

/**
 * Open a new terminal window running `command` (iTerm when installed, else
 * Terminal). The command goes into a small script file so no quoting has to
 * survive AppleScript; the window stays open in a shell afterwards.
 */
async function openTerminal(command) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'factory-'));
  const file = path.join(dir, 'start.zsh');
  fs.writeFileSync(file, `${command}\nexec zsh -l\n`, { mode: 0o700 });
  const launch = `/bin/zsh -l ${file}`;
  const script = fs.existsSync('/Applications/iTerm.app')
    ? `tell application "iTerm"\nactivate\ncreate window with default profile command "${launch}"\nend tell`
    : `tell application "Terminal"\nactivate\ndo script "${launch}"\nend tell`;
  await run('osascript', ['-e', script]);
}

async function startBuilds(created, mode) {
  fs.mkdirSync(CLONE_DIR, { recursive: true });
  const dirs = created.map((c) => c.repoFullName.split('/')[1]);
  const clone = created.map((c, i) => `(test -d ${shq(dirs[i])} || gh repo clone ${shq(c.repoFullName)})`).join(' && ');
  if (mode === 'orchestrator' && created.length > 1) {
    await openTerminal(`cd ${shq(CLONE_DIR)} && ${clone} && claude ${shq(orchestratorPrompt(dirs))}`);
    return 1;
  }
  for (let i = 0; i < created.length; i++) {
    await openTerminal(`cd ${shq(CLONE_DIR)} && (test -d ${shq(dirs[i])} || gh repo clone ${shq(created[i].repoFullName)}) && cd ${shq(dirs[i])} && claude ${shq(BUILD_INSTRUCTION)}`);
  }
  return created.length;
}

/**
 * sites: [{ name, brief, visibility, draftId?, assets?: [{ name, base64 }] }]
 * start: 'per-site' | 'orchestrator' | 'none'
 */
export async function createSites(sites, start = 'per-site') {
  if (!Array.isArray(sites) || !sites.length) throw new Error('Nothing to create.');
  if (sites.length > MAX_SITES) throw new Error(`At most ${MAX_SITES} websites at once.`);
  const slugs = sites.map((s) => toSlug(s.slug || s.name || ''));
  const dupe = slugs.find((s, i) => s && slugs.indexOf(s) !== i);
  if (dupe) throw new Error(`Two websites would both be site-${dupe}. Rename one.`);

  const { login } = await github();
  let claudeMd = null;
  try {
    const f = await ghApi('GET', `/repos/${BUILDER_REPO}/contents/CLAUDE.md`);
    claudeMd = Buffer.from(f.content, 'base64').toString('utf8');
  } catch {}

  const results = [];
  for (const site of sites) {
    try { results.push({ ok: true, name: site.name, ...(await createOne(site, login, claudeMd)) }); }
    catch (e) { results.push({ ok: false, name: site.name, error: e.message }); }
  }
  const created = results.filter((r) => r.ok);
  let scan = null, terminals = 0, startError = null;
  if (created.length) {
    try { scan = await dispatchScan(created.map((c) => c.slug)); } catch (e) { scan = `failed: ${e.message.slice(0, 120)}`; }
    if (start !== 'none') {
      try { terminals = await startBuilds(created, start); } catch (e) { startError = e.message.slice(0, 200); }
    }
  }
  return { results, scan, terminals, startError, seededClaude: !!claudeMd };
}

export async function whoAmI() {
  return { login: await currentLogin(), accounts: await ghAccounts() };
}
