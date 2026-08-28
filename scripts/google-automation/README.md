# Google Integration — INTERNAL Utopia bundle (all-in-one)

Wired to Utopia's shared automation account. **Credentials already live in
`~/.google-credentials/`** on the build machine — no Google Cloud setup needed. If you're
external, use the public kit at https://websitebuilder.utopiaai.my/google instead
(`SETUP.md` here is that kit's setup guide, kept for reference).

## Quick start

```bash
# 1. install (googleapis + google-ads-api + playwright)
npm install
npx playwright install chromium

# 2. one-time Google sign-in for Phase 6 (human types password + 2FA)
node finalize-manual-toggles.mjs --login

# 3. run the 6-phase sequence — full detail in SKILL.md / MANUAL-STEPS.md
```

> 🔒 The files in `~/.google-credentials/` are **live keys** to Utopia's Google (GA4 + GTM +
> GSC + Ads), and `pw-google-profile/` there is a live signed-in browser session. Keep them on
> your machine only — never commit them to a repo, paste them anywhere, or forward them. If a
> key is ever exposed, tell the owner so it can be rotated.

## Using it with Claude

Drop this whole folder into your Claude Code `.claude/skills/` — `SKILL.md` lets your Claude
recognize it and drive the 6 phases. Phase 6 (`finalize-manual-toggles.mjs`) replaces what
used to be ~3–4 min of manual Google toggles per site with an automated browser pass.

## Prerequisites (per site)
- Paid domain live on Vercel + DNS pointed there.
- Every WhatsApp CTA routes through `/redirect-whatsapp-1/` (the conversion fires there).

## Docs
- `SKILL.md` — the guided flow (run phases 1–6)
- `SETUP.md` — external / bring-your-own-Google setup, incl. the placeholder swap-list
- `MANUAL-STEPS.md` — canonical per-site runbook + the manual fallback for Phase 6
- `REFERENCE-manual-flow.md`, `ADS-API-DESIGN-DOC.md` — deep detail
