# Agent Monitor

A live page showing every Claude Code session on this machine: which agent is
working, on which website, and what it is doing right now.

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

Character art in `public/agents/` is copied from the office-screen page
(`website-workflow/agents/`); keep the two in step if an agent is added.
