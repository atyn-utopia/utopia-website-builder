# Website Factory

A live production line of the website builder: the ten robot agents at their
stations, each website moving down the line as the robots work on it (orange),
and the websites that are done in the shipped bay with their live link (green).

```bash
node scripts/agent-monitor/server.mjs     # → http://localhost:4545
```

No install, no dependencies. Options: `PORT=4600`, `HOURS=48` (how far back to
look, default 24).

**Watch from another computer:** start it with `LAN=1` and it also listens on
the local network; the startup line prints the address (e.g.
`http://192.168.110.134:4545`). Anyone on the same network can then open the
page, so use it on a trusted network only. Other computers get a **view-only**
page: creating websites, drafts and GitHub sign-in answer only to this Mac.

## Where the data comes from

Claude Code already writes every session to `~/.claude/projects/<folder>/<session>.jsonl`
and every subagent to `<session>/subagents/agent-*.jsonl` (+ `.meta.json`).
`server.mjs` tails those files once a second and pushes a snapshot to the page
over Server-Sent Events. It binds to `127.0.0.1` only, so nothing leaves the
machine. `/api/state` returns the same snapshot as JSON.

## How it reads the line

Only work on a site under `projects/` (or a session titled `FIX`/`NEW <site>`)
counts — sessions in other workspace repos are left off.

- **Robot** — a run named after an agent uses that robot. Anything else
  (`g2-aircond-mesra`, forks, the main session working on its own) is matched to
  a robot by what it is doing: blog → Hanabi, logo/favicon → Lylia, keywords →
  Sora, deploy/Vercel → Layla, products/webcore → Cyclops, schema/i18n → Kimmy,
  copy → Nana, design/CSS → Kagura, GA4/GTM/GSC → Gloo (`JOBS` in `server.mjs`).
  This is a best guess from the last few actions, not a label.
- **Station** — the line only runs one way. A website sits at the furthest
  station any run on it has clearly reached (its own agent, the job its task
  names, or a job seen in at least two of its actions) and never moves back.
  When a robot earlier in the line works on it again, that robot lights up and
  the card says "fix by …"; the website stays where it is. A site that hasn't
  reached any station waits at the **IN** gate (click it to start a new
  website); the **OUT** gate counts what shipped today.
- **Done** — nothing is running on the site and its domain actually answers
  (HTTP below 400, or 401/403). The domain is the one webcore displays for the
  site (`/api/public/companies`, read server-side with `WEBCORE_API_KEY` from
  `.env.local`; the key never reaches the page). Sites not in webcore fall back
  to a host some builder session announced as live. Hosts are re-checked every
  10 minutes; a message saying "live" is never enough on its own.
- **Paused** — nothing running, not waiting on you, and never announced live:
  the site stays on the line in grey instead of disappearing.

## How it names things

- **Agent** — a subagent counts as Alpha, Lylia, Sora, … when its prompt starts
  `You are **<Name>`, or its description / name starts with the name
  (`Hanabi: write 10 blog posts`, `gloo-waterproofmalaysia`). Anything else shows
  under its own name (`g2-aircond-mesra`, `Helper` for forks). Work the main
  session does itself, without spawning an agent, shows under the session.
- **Website** — the session title first (`FIX revmove.my`, `NEW abang-tembikai`),
  then the last `projects/<site>/` path a tool touched, then the working
  directory or the other workspace repo.
- **Status** — *Working* (moved in the last 90 s, or a tool is still running),
  *Your turn* (main session finished its reply), *Finished* (subagent handed
  back), *Idle*.

## Look

Built on the Utopia Brand CI v2.0.1 (utopiagroup.com.my/brand-ci): Source Sans 3
throughout (as on the office-screen page; the logo keeps its outlined Plus Jakarta Sans), CI neutrals, 8px buttons / 12px cards, and
the CI status colours — warning amber for websites still building, live green for
shipped ones. The logo (`public/brand/logo-*.svg`, made by `logo/build.py`) follows the
Utopia product logos' two weights: a small Light "website" set flush right
above a large ExtraBold "factory", whose o is a Utopia Blue gear with a Utopia
Red triangle in its counter; the footer carries the locked `utopia▲ AI Team`
mark (supplied SVGs, not redrawn).

On a screen at least 900×620 the page fits without scrolling: the card and
shipped lists paginate to whatever fits and flip pages every 8 seconds (paused
while you hover or use the arrows). Phones scroll as normal.

The robots are line icons drawn in code (`public/robots.js`, `RobotKit`): one
shared robot base, each agent told apart by one prop or hat from its original
character art (`website-workflow/agents/`) and its accent colour. They draw in
the page's ink, so they follow light and dark. Idle robots blink and breathe;
a robot at work moves its prop (CSS transform/opacity only, off under reduced
motion). To add an agent, add it to `ROBOTS` in `robots.js` and to `AGENTS` in
`server.mjs`.

## Install as an app

The page is a PWA. With `server.mjs` running, open http://localhost:4545 in
Chrome and choose **Install Website Factory** (the install icon at the right of
the address bar, or ⋮ → Cast, save and share → Install page as app). It then
opens in its own window and sits in the Dock. It is still local: the app only
has live data while `server.mjs` is running on this machine. The service worker
(`public/sw.js`) caches the page shell so the window still opens during a server
restart; it never caches `/events` or `/api`.

App icons: `logo/build.py` writes `public/brand/logo-app.svg`, and
`logo/icons.sh` rasterises it to `app-512.png`, `app-192.png` and `app-180.png`
(macOS Quick Look + sips).

## New website (one, bulk, drafts)

**New website** in the header does what the Utopia Wizard's `/new` and
`/new/bulk` do, from this machine (`create.mjs`):

1. creates `utopiagrowth/site-<slug>` (private by default), one commit with
   `inputs.md` (name, brief, owner, brand files) and the builder's `CLAUDE.md`,
   plus brand files in `brand_assets/`;
2. registers it in the wizard (`webcore.user_repos`, `webcore.project_owners`)
   and dispatches `monitor-scan.yml` for the new slugs;
3. if asked, clones it into `utopia-website-builder/projects/` and opens a new
   window in the app picked under **Open in** (iTerm or Terminal) running Claude with the wizard's kickoff prompt —
   one window per site, or one orchestrator session for a batch.

**One website** can also use an **existing repo** instead of a new one: pick
from the org's `site-*` repos (empty ones first) or paste `owner/name`. The
seed files go in one commit each through the Contents API and never overwrite a
file the repo already has, as in the wizard; the slug comes from the repo name.

Bulk takes the wizard's paste format: blocks split by a `---` line, first line
the name, the rest the brief, up to 20. Drafts are the wizard's own
`webcore.project_drafts` rows for your GitHub login, so they show in both apps;
a wizard draft's brand files are copied into the repo when you create it.

The header shows which GitHub account the Factory acts as, with Sign out and
a switch to any other account `gh` is logged in to on this machine. The choice
is the Factory's own (`~/.config/website-factory/session.json`, token fetched
with `gh auth token --user <login>`), so it never changes gh's active account
for other terminals, and signing out leaves gh logged in.

Credentials never reach the page: GitHub through the local `gh` login, the database through `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`. The
action routes refuse any request without the page's `x-factory` header or from
another origin, so other websites can't trigger them.
