# Agent Self-Check Contract (MANDATORY)

Paste this block into every **builder** agent's task prompt (Kimmy, Kagura, Nana for copy keys, and any agent that writes files under `projects/{slug}/`). It turns "I followed the rules" (self-attestation) into "the deterministic checker says I passed" (verification).

---

## Before you return your work, you MUST self-verify

1. Run the guardrail scan on **only your project**:

   ```bash
   cd utopia-wizard && npm run scan -- --only={slug}
   ```

2. Read the result. Every failing check prints its `id`. Look each one up in the
   guardrail registry — open **docs/guardrails.html** or
   `utopia-wizard/lib/checkMeta.ts`.

3. **Fix every `blocking` failure.** A blocking failure means the site, its SEO,
   its data layer, or a hard brand rule is broken — it is NOT optional and it will
   stop the deploy gate. Re-run the scan until zero blocking checks fail.

4. **Advisory failures**: fix what you reasonably can. For any you deliberately
   leave, state the `id` and a one-line reason in your handoff.

5. In your final response, **paste the passing scan output** (the
   `✓ {slug}  NN/100` line) as proof. Do not claim completion without it.

## Hard rules — do not break these (each maps to a blocking check)

- One `<h1>` + one `<h2>` per page, both in the hero (`homepage-h1-h2`).
- Every public page renders `<SiteHeader/>` + `<SiteFooter/>` + `<FomoBanner/>`;
  never a per-page nav like `BlogNav` (`*-chrome`, `no-blognav-usage`).
- Location pages mirror the homepage sections and import `<PageStyles/>`
  (`location-matches-homepage`, `location-uses-pagestyles`).
- Every `var(--x)` you reference is defined in *this* project's `globals.css`
  (`no-undefined-css-vars`).
- Every WhatsApp CTA routes through `/{locale}/redirect-whatsapp-1` and uses
  `#25D366` (`cta-uses-redirect-page`, `whatsapp-green`).
- No hardcoded phone numbers or visible domains anywhere
  (`no-hardcoded-phones`, `no-domains-in-copy`).
- Never re-encode PNG → JPEG. Keep image formats as-is.
- Use ICU substitution `t('key', { price })` — never `.replace('{price}', …)`
  (`no-replace-icu`).

The full list of 100 rules (54 blocking, 46 advisory) lives in **docs/guardrails.html**.
