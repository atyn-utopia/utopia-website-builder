# Google Integration — INTERNAL Utopia bundle (all-in-one)

Wired to Utopia's shared automation account. **Credentials are included** in `credentials/` —
no Google Cloud setup needed. If you're external, use the public kit at
https://websitebuilder.utopiaai.my/google instead.

## Quick start

```bash
# 1. place the bundled credentials
mkdir -p ~/.google-credentials && cp credentials/* ~/.google-credentials/

# 2. install
npm install

# 3. run the 5-phase sequence — full detail in SKILL.md / MANUAL-STEPS.md
```

> 🔒 The files in `credentials/` are **live keys** to Utopia's Google (GA4 + GTM + GSC + Ads).
> Keep them on your machine only — never commit them to a repo, paste them anywhere, or forward
> them. If a key is ever exposed, tell the owner so it can be rotated.

## Using it with Claude

Drop this whole folder into your Claude Code `.claude/skills/` — `SKILL.md` lets your Claude
recognize it and drive the 5 phases + walk you through the ~3–4 min of manual Google toggles.

## Prerequisites (per site)
- Paid domain live on Vercel + DNS pointed there.
- Every WhatsApp CTA routes through `/redirect-whatsapp-1/` (the conversion fires there).

## Docs
- `SKILL.md` — the guided flow (place creds → run phases → manual clicks)
- `MANUAL-STEPS.md` — canonical per-site runbook
- `REFERENCE-manual-flow.md`, `ADS-API-DESIGN-DOC.md` — deep detail
