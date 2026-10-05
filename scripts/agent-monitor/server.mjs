#!/usr/bin/env node
// Agent Monitor — live view of every Claude Code session and subagent on this
// machine: which agent, which website, what it is doing right now.
//
// Reads the transcripts Claude Code already writes to ~/.claude/projects/**.jsonl,
// tails them once a second and pushes a snapshot to the page over SSE.
// Binds to 127.0.0.1 only; nothing leaves the machine. No dependencies.
//
//   node scripts/agent-monitor/server.mjs            → http://localhost:4545
//   PORT=4600 HOURS=48 node scripts/agent-monitor/server.mjs

import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT || 4545);
const HOURS = Number(process.env.HOURS || 24);
const ROOT = process.env.CLAUDE_PROJECTS_DIR || path.join(os.homedir(), '.claude', 'projects');
const WORKSPACE = path.join(os.homedir(), 'Documents', 'GitHub', 'atyn-workspace');
const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');

// Initial read of a long main-session transcript starts this far from the end;
// everything the page needs (title, cwd, last actions) repeats near the tail.
const INITIAL_TAIL_BYTES = 4 * 1024 * 1024;
const RECENT_ACTIONS = 8;

// The agent team, as on the office-screen page (website-workflow/index.html).
const AGENTS = {
  alpha:   { name: 'Alpha',   role: 'System architect',      color: '#2774AE' },
  lylia:   { name: 'Lylia',   role: 'Brand & logo designer', color: '#6E4FC9' },
  sora:    { name: 'Sora',    role: 'SEO strategist',        color: '#0E6E5C' },
  nana:    { name: 'Nana',    role: 'Copywriter',            color: '#C2410C' },
  kagura:  { name: 'Kagura',  role: 'UI designer',           color: '#1B5687' },
  kimmy:   { name: 'Kimmy',   role: 'Technical SEO',         color: '#1D6FA0' },
  cyclops: { name: 'Cyclops', role: 'Database engineer',     color: '#003B5C' },
  hanabi:  { name: 'Hanabi',  role: 'Blog writer',           color: '#8A5A00' },
  layla:   { name: 'Layla',   role: 'QA & deploy',           color: '#4F5257' },
  gloo:    { name: 'Gloo',    role: 'Google & ads setup',    color: '#157A45' },
};
const AGENT_NAMES = Object.values(AGENTS).map((a) => a.name).join('|');

// ---------------------------------------------------------------- detection

// Which robot a run is doing the work of, when it isn't named after one
// ("g2-aircond-mesra", a fork, or the main session working on its own).
// First match wins, so the narrow, unambiguous jobs come first.
const JOBS = [
  ['gloo',    /\b(ga4|gtm|tag manager|search console|gsc|google ads|ads-readiness|google-automation|google-integration)\b/i],
  ['lylia',   /\b(logos?|favicon|icons?|brand ?kit|branding)\b/i],
  ['hanabi',  /\b(blog|articles?|artikel)\b|\/posts\//i],
  ['sora',    /\b(keywords?|seo-plan|seo plan|search volume)\b/i],
  ['layla',   /\b(deploy\w*|vercel|integration test|smoke test|go live)\b/i],
  ['cyclops', /\b(products?|supabase|webcore|phone numbers?|database|migration)\b/i],
  ['kimmy',   /\b(schema|metadata|hreflang|i18n|translations?|sitemap|redirect-whatsapp|alt text)\b/i],
  ['nana',    /\b(copy|copywrit\w*|messages\/\w+\.json)\b/i],
  ['kagura',  /\b(design|layout|header|hero|css|palette|fonts?|SiteHeader|SiteFooter)\b/i],
  ['alpha',   /\b(architecture|scaffold\w*|build-site|new site|site plan)\b/i],
];
function inferAgent(...texts) {
  for (const t of texts) {
    if (!t) continue;
    for (const [key, re] of JOBS) if (re.test(t)) return key;
  }
  return null;
}

// A link Claude reported as the live site. Dashboards, repos and previews don't count.
const NOT_LIVE = /(^|\.)(github\.com|vercel\.com|claude\.ai|anthropic\.com|google\.com|googleapis\.com|localhost|supabase\.co|utopiagroup\.com\.my|wizard\.utopiaai\.my|websitebuilder\.utopiaai\.my|wa\.me|placehold\.co)$/i;
function liveUrlIn(text = '') {
  let found = null;
  for (const m of text.matchAll(/https:\/\/([a-z0-9.-]+\.[a-z]{2,})(?=[\/\s)*`\]>,]|$)/gi)) {
    const host = m[1].toLowerCase().replace(/\.$/, '');
    if (NOT_LIVE.test(host) || /-[a-z0-9]{9}-[a-z0-9-]+\.vercel\.app$/.test(host)) continue; // per-deploy preview URLs
    found = host;
  }
  return found;
}

// Site keys from titles ("auto-gate.my") and folders ("site-auto-gate-my") must meet.
const siteKey = (s) => s.toLowerCase().replace(/^site-/, '').replace(/\./g, '-');

function detectAgent(description = '', brief = '', name = '') {
  // "You are **Hanabi — Blog Writer**" is how agents/*.md get passed in.
  const youAre = brief.match(new RegExp(`You are \\**(${AGENT_NAMES})\\b`, 'i'));
  if (youAre) return youAre[1].toLowerCase();
  // "Hanabi: write 10 blog posts", "Gloo waterproofmalaysia" — the name leads.
  const lead = description.match(new RegExp(`^(${AGENT_NAMES})\\b`, 'i'))
    || name.match(new RegExp(`^(${AGENT_NAMES})(?![a-z])`, 'i'));
  if (lead) return lead[1].toLowerCase();
  // Capitalised name anywhere ("Run Sora on …"); case-sensitive so "alpha check" stays out.
  const named = description.match(new RegExp(`\\b(${AGENT_NAMES})\\b`));
  return named ? named[1].toLowerCase() : null;
}

// Session titles follow "FIX revmove.my" / "NEW abang-tembikai".
function siteFromTitle(title = '') {
  const m = title.match(/^(?:FIX|NEW|UPDATE|BUILD|REVAMP|DEPLOY)\s+(\S+)/i);
  return m ? m[1] : null;
}

// A real path segment, not the dash-encoded transcript folder ("-atyn-workspace/<session>").
const WORKSPACE_REPO = /\/GitHub\/atyn-workspace\/([A-Za-z0-9._-]+)/;
// Only a site folder inside this repo (or a worktree of it) counts — not any "projects/".
const SITE_PATH = /(?:utopia-website-builder|\/wt-[A-Za-z0-9._-]+)\/projects\/([A-Za-z0-9][A-Za-z0-9._-]*)/;

function siteFromText(text = '') {
  const p = text.match(SITE_PATH);
  if (p && p[1] !== 'admin') return p[1];
  const r = text.match(WORKSPACE_REPO);
  if (r && r[1] !== 'utopia-website-builder') return r[1];
  return null;
}

function short(p = '') {
  const s = String(p);
  const m = s.match(/\/projects\/[^/]+\/(.+)$/) || s.match(/\/(?:wt-[^/]+|atyn-workspace\/[^/]+)\/(.+)$/);
  const rel = m ? m[1] : s.replace(os.homedir(), '~');
  return rel.length > 60 ? '…' + rel.slice(-59) : rel;
}

function clip(s = '', n = 90) {
  const t = String(s).replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}

// "cd /long/path && set -a; . ./.env.local; set +a; FOO=bar node x.mjs" → "node x.mjs"
function bareCommand(cmd = '') {
  const parts = String(cmd).split('\n')[0].split(/\s*(?:&&|;)\s*/);
  const setup = /^(cd|export|set|source|\.)(\s|$)|^[A-Z_][A-Z0-9_]*=\S*$/;
  const real = parts.filter((p) => p && !setup.test(p));
  return (real.join(' && ') || parts.join('; ')).replace(/^(?:[A-Z_][A-Z0-9_]*=\S*\s+)+/, '');
}

// A tool call in plain words, plus a coarse kind the page uses for its icon.
function describeTool(name, input = {}) {
  switch (name) {
    case 'Edit': case 'MultiEdit': case 'NotebookEdit':
      return { kind: 'edit', text: `Editing ${short(input.file_path || input.notebook_path)}` };
    case 'Write':
      return { kind: 'edit', text: `Writing ${short(input.file_path)}` };
    case 'Read':
      return { kind: 'read', text: `Reading ${short(input.file_path)}` };
    case 'Grep': case 'Glob':
      return { kind: 'read', text: `Searching for ${clip(input.pattern, 50)}` };
    case 'Bash':
      return { kind: 'run', text: input.description ? clip(input.description) : `Running ${clip(bareCommand(input.command), 70)}` };
    case 'Agent': case 'Task':
      return { kind: 'agent', text: `Sent an agent: ${clip(input.description || input.subagent_type, 70)}` };
    case 'WebFetch':
      try { return { kind: 'web', text: `Opening ${new URL(input.url).host}` }; } catch { return { kind: 'web', text: 'Opening a web page' }; }
    case 'WebSearch':
      return { kind: 'web', text: `Searching the web: ${clip(input.query, 60)}` };
    case 'Skill':
      return { kind: 'run', text: `Using the ${input.skill} skill` };
    case 'Artifact':
      return { kind: 'web', text: input.action && input.action !== 'publish' ? `Artifact: ${input.action}` : 'Publishing a preview page' };
    case 'ToolSearch':
      return { kind: 'think', text: 'Loading tools' };
    case 'TodoWrite': case 'TaskCreate': case 'TaskUpdate':
      return { kind: 'think', text: 'Updating its to-do list' };
    case 'AskUserQuestion':
      return { kind: 'ask', text: 'Asking you a question' };
    case 'SubagentHandback':
      return { kind: 'done', text: 'Handed results back' };
    default:
      if (name.startsWith('mcp__claude-in-chrome__')) return { kind: 'web', text: `Using Chrome: ${name.slice(23).replace(/_/g, ' ')}` };
      if (name.startsWith('mcp__')) return { kind: 'run', text: `Using ${name.split('__').slice(1).join(' ').replace(/_/g, ' ')}` };
      return { kind: 'run', text: `Using ${name}` };
  }
}

// ---------------------------------------------------------------- state

/** file path → actor */
const actors = new Map();

function newActor(file, kind) {
  return {
    id: file, kind, file,
    sessionId: null, parentId: null,
    agentKey: null, agentType: null, name: '', description: '',
    builder: file.includes('utopia-website-builder'), liveUrl: null,
    brief: '', title: '', customTitle: '', lastPrompt: '',
    cwd: '', branch: '', site: null, pathSite: null,
    startedAt: null, lastAt: null,
    current: null, recent: [], toolCount: 0,
    pending: new Map(), turnEnded: false, handedBack: false,
    offset: 0, partial: '',
  };
}

function pushAction(a, ts, action) {
  a.current = { ...action, at: ts };
  a.recent.unshift(a.current);
  if (a.recent.length > RECENT_ACTIONS) a.recent.length = RECENT_ACTIONS;
}

function applyLine(a, line) {
  let e;
  try { e = JSON.parse(line); } catch { return; }

  if (e.type === 'custom-title' && e.customTitle) a.customTitle = e.customTitle;
  if (e.type === 'agent-name' && e.agentName) a.customTitle = e.agentName;
  if (e.type === 'ai-title' && e.aiTitle) a.title = e.aiTitle;
  if (e.type === 'last-prompt' && e.lastPrompt && !fromAgent(e.lastPrompt)) a.lastPrompt = e.lastPrompt;
  if (e.sessionId) a.sessionId = e.sessionId;
  if (e.cwd) a.cwd = e.cwd;
  if (e.gitBranch) a.branch = e.gitBranch;

  const ts = e.timestamp ? Date.parse(e.timestamp) : null;
  const content = e.message?.content;

  if (e.type === 'assistant' && Array.isArray(content)) {
    a.lastAt = ts ?? a.lastAt;
    a.turnEnded = false;
    for (const c of content) {
      if (c.type === 'tool_use') {
        const d = describeTool(c.name, c.input);
        a.pending.set(c.id, ts);
        a.toolCount++;
        if (c.name === 'SubagentHandback') a.handedBack = true;
        const hit = siteFromText(JSON.stringify(c.input ?? {}));
        if (hit) a.pathSite = hit;
        pushAction(a, ts, d);
      } else if (c.type === 'text' && c.text?.trim()) {
        pushAction(a, ts, { kind: 'say', text: clip(c.text, 110) });
        if (/\blive\b|dah live|deployed|production/i.test(c.text)) a.liveUrl = liveUrlIn(c.text) || a.liveUrl;
      } else if (c.type === 'thinking') {
        a.current = { kind: 'think', text: 'Thinking…', at: ts };
      }
    }
  } else if (e.type === 'user' && e.message) {
    a.lastAt = ts ?? a.lastAt;
    if (!a.startedAt) a.startedAt = ts;
    if (Array.isArray(content)) {
      for (const c of content) {
        if (c.type === 'tool_result') a.pending.delete(c.tool_use_id);
        else if (c.type === 'text' && !e.isMeta) onPrompt(a, c.text, ts);
      }
    } else if (typeof content === 'string' && !e.isMeta) {
      onPrompt(a, content, ts);
    }
  } else if (e.type === 'system' && e.subtype === 'stop_hook_summary') {
    a.turnEnded = true;
    a.lastAt = ts ?? a.lastAt;
  }
}

// Teammate pings arrive as user turns but weren't typed by anyone.
const fromAgent = (text) => /^Another Claude session sent a message|<teammate-message/.test(text);

function onPrompt(a, text, ts) {
  if (!text || text.startsWith('<')) return; // command wrappers, reminders
  if (fromAgent(text)) return;
  if (!a.brief) a.brief = text.slice(0, 4000);
  if (a.kind === 'main') {
    a.lastPrompt = text;
    a.turnEnded = false;
    pushAction(a, ts, { kind: 'you', text: `You: ${clip(text, 100)}` });
  }
}

// Status is derived at snapshot time so "working" fades on its own.
function statusOf(a, now) {
  const age = now - (a.lastAt || 0);
  const oldestPending = Math.min(...a.pending.values(), Infinity);
  if (a.kind === 'sub' && a.handedBack) return 'done';
  if (a.current?.kind === 'ask' && a.pending.size) return 'waiting';
  if (a.pending.size && now - oldestPending < 30 * 60e3) return 'working'; // long Bash/deploys
  if (a.kind === 'main' && a.turnEnded) return age < 6 * 3600e3 ? 'waiting' : 'idle';
  if (age < 90e3) return 'working';
  if (a.kind === 'sub' && !a.pending.size) return 'done';
  // No Stop hook configured: a reply with nothing pending also means it's your turn.
  if (a.kind === 'main' && a.current?.kind === 'say' && !a.pending.size) return age < 6 * 3600e3 ? 'waiting' : 'idle';
  return 'idle';
}

function view(a, now) {
  const parent = a.parentId ? actors.get(a.parentId) : null;
  const titleSite = siteFromTitle(a.customTitle);
  const site = titleSite || a.pathSite || siteFromText(a.cwd + '/') || siteFromText(a.brief)
    || (parent && (siteFromTitle(parent.customTitle) || parent.pathSite)) || null;
  const repo = (a.cwd.match(WORKSPACE_REPO) || [])[1] || path.basename(a.cwd || '') || null;
  const agent = a.agentKey ? { key: a.agentKey, ...AGENTS[a.agentKey] } : null;
  const doing = a.agentKey || inferAgent(a.kind === 'sub' ? a.description : '', ...a.recent.slice(0, 3).map((r) => r.text));
  return {
    id: a.id, kind: a.kind, sessionId: a.sessionId, parentId: a.parentId,
    agent, agentType: a.agentType, doing, builder: a.builder,
    siteKey: site ? siteKey(site) : null, liveUrl: a.liveUrl,
    label: agent ? agent.name : a.kind === 'main' ? (a.customTitle || a.title || 'Claude session') : (a.name || a.agentType || 'Subagent'),
    task: a.kind === 'sub' ? a.description : (a.customTitle ? a.title : ''),
    lastPrompt: a.kind === 'main' ? clip(a.lastPrompt, 160) : '',
    site, repo, branch: a.branch,
    status: statusOf(a, now),
    lastAt: a.lastAt, startedAt: a.startedAt,
    current: a.current, recent: a.recent, toolCount: a.toolCount,
  };
}

function snapshot() {
  const now = Date.now();
  const list = [...actors.values()].filter((a) => a.lastAt).map((a) => view(a, now));
  list.sort((x, y) => (y.lastAt || 0) - (x.lastAt || 0));
  return { now, hours: HOURS, agents: AGENTS, actors: list, sites: sites(list, now) };
}

// One row per website the builder touched in the window: still being built,
// or done (nothing running on it any more and a live link was reported).
const ACTIVE_MS = 3 * 3600e3;
function sites(list, now) {
  const by = new Map();
  for (const a of list) {
    // Workspace repos (website-workflow, creative-dashboard…) aren't factory websites.
    if (!a.builder || !a.siteKey || fs.existsSync(path.join(WORKSPACE, a.site))) continue;
    if (!by.has(a.siteKey)) by.set(a.siteKey, []);
    by.get(a.siteKey).push(a);
  }
  const out = [];
  for (const [key, runs] of by) {
    const working = runs.filter((r) => r.status === 'working');
    const waiting = runs.filter((r) => r.kind === 'main' && r.status === 'waiting' && now - r.lastAt < ACTIVE_MS);
    const named = runs.map((r) => r.site).find((n) => n.includes('.'));
    const liveUrl = runs.map((r) => r.liveUrl).find((u) => u && siteKey(u).includes(key.replace(/-(my|com-my|com)$/, ''))) || null;
    const domain = liveUrl || named || null;
    const lastAt = Math.max(...runs.map((r) => r.lastAt || 0));
    const top = working[0] || runs[0];
    // The station the site sits at on the line: the furthest robot working on it
    // now, else the last robot that touched it.
    const order = Object.keys(AGENTS);
    const busy = working.map((r) => r.doing).filter(Boolean);
    const station = busy.length
      ? busy.sort((x, y) => order.indexOf(y) - order.indexOf(x))[0]
      : (runs.find((r) => r.doing)?.doing ?? null);
    let state;
    if (working.length) state = 'building';
    else if (domain) state = 'done';
    else if (waiting.length) state = 'building';
    else continue; // went quiet without going live — not on the floor any more
    out.push({
      key, name: named || runs[0].site, domain, state,
      waitingOnYou: !working.length && waiting.length > 0,
      robots: [...new Set(busy)], station,
      working: working.length, lastAt,
      now: state === 'building' ? (top.current?.text || top.task || '') : '',
    });
  }
  const rank = { building: 0, done: 1 };
  return out.sort((x, y) => rank[x.state] - rank[y.state] || y.lastAt - x.lastAt);
}

// ---------------------------------------------------------------- files

function readSlice(file, start, end) {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(end - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    return buf.toString('utf8');
  } finally { fs.closeSync(fd); }
}

function track(file, kind, parentFile) {
  if (actors.has(file)) return;
  const a = newActor(file, kind);
  if (kind === 'sub') {
    a.parentId = parentFile;
    try {
      const meta = JSON.parse(fs.readFileSync(file.replace(/\.jsonl$/, '.meta.json'), 'utf8'));
      a.description = meta.description || '';
      a.agentType = meta.agentType || null;
      a.name = meta.name || '';
    } catch {}
  }
  const size = fs.statSync(file).size;
  if (size > INITIAL_TAIL_BYTES) {
    // Start mid-file: keep the first line (brief) for detection, then skip ahead.
    const head = readSlice(file, 0, Math.min(size, 256 * 1024)).split('\n')[0];
    applyLine(a, head);
    a.offset = size - INITIAL_TAIL_BYTES;
    a.partial = null; // drop the first (cut) line of the tail
  }
  actors.set(file, a);
  ingest(a);
  if (kind === 'sub') a.agentKey = detectAgent(a.description, a.brief, a.name);
}

function ingest(a) {
  let size;
  try { size = fs.statSync(a.file).size; } catch { actors.delete(a.file); return true; }
  if (size < a.offset) { a.offset = 0; a.partial = ''; } // rewritten
  if (size === a.offset) return false;
  const chunk = readSlice(a.file, a.offset, size);
  a.offset = size;
  const lines = ((a.partial ?? '') + chunk).split('\n');
  const dropFirst = a.partial === null;
  a.partial = lines.pop();
  for (const [i, line] of lines.entries()) {
    if (dropFirst && i === 0) continue;
    if (line) applyLine(a, line);
  }
  return true;
}

function discover() {
  const cutoff = Date.now() - HOURS * 3600e3;
  let dirs = [];
  try { dirs = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()); } catch { return; }
  for (const d of dirs) {
    const dir = path.join(ROOT, d.name);
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.jsonl')) {
        const file = path.join(dir, e.name);
        if (!actors.has(file) && fs.statSync(file).mtimeMs > cutoff) track(file, 'main');
      }
      if (e.isDirectory()) {
        const subDir = path.join(dir, e.name, 'subagents');
        let subs = [];
        try { subs = fs.readdirSync(subDir).filter((n) => n.endsWith('.jsonl')); } catch { continue; }
        const parentFile = path.join(dir, `${e.name}.jsonl`);
        for (const n of subs) {
          const file = path.join(subDir, n);
          if (!actors.has(file) && fs.statSync(file).mtimeMs > cutoff) track(file, 'sub', parentFile);
        }
      }
    }
  }
  // Forget what has aged out of the window.
  for (const [file, a] of actors) if ((a.lastAt || 0) < cutoff && a.pending.size === 0) actors.delete(file);
}

// ---------------------------------------------------------------- server

const clients = new Set();
let lastSent = '';

function broadcast(force = false) {
  const body = JSON.stringify(snapshot());
  if (!force && body === lastSent) return;
  lastSent = body;
  for (const res of clients) res.write(`data: ${body}\n\n`);
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(`data: ${JSON.stringify(snapshot())}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (url.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(snapshot(), null, 2));
    return;
  }
  const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const file = path.join(PUBLIC, rel);
  if (!file.startsWith(PUBLIC + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

discover();
setInterval(() => {
  let changed = false;
  for (const a of actors.values()) changed = ingest(a) || changed;
  if (changed) broadcast();
}, 1000);
setInterval(() => { discover(); broadcast(); }, 5000);
// Keeps proxies from closing the stream and lets statuses age (working → idle).
setInterval(() => broadcast(true), 15000);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Agent Monitor → http://localhost:${PORT}  (watching ${ROOT}, last ${HOURS}h, ${actors.size} transcripts)`);
});
