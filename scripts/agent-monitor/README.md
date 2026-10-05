# Website Factory

A live production line of the website builder: the ten robot agents at their
stations, each website moving down the line as the robots work on it (orange),
and the websites that are done in the shipped bay with their live link (green).

```bash
node scripts/agent-monitor/server.mjs     # → http://localhost:4545
```

No install, no dependencies. Options: `PORT=4600`, `HOURS=48` (how far back to
look, default 24).

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
- **Station** — a website sits at the furthest-along robot working on it now,
  else at the last robot that touched it; *Intake* if none matched.
- **Done** — nothing is running on the site any more and Claude reported a live
  link (`… dah live: https://…`), or the session title is the domain.

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

The factory icon (`public/icon.png`) was generated with `scripts/codex-image.sh`
from the agent art as reference. Character art in `public/agents/` is copied from the office-screen page
(`website-workflow/agents/`); keep the two in step if an agent is added.
