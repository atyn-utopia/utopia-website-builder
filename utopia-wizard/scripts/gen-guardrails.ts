/**
 * gen-guardrails.ts — Generate docs/guardrails.html from the canonical registry.
 *
 *   npx tsx scripts/gen-guardrails.ts
 *
 * Reads lib/checkMeta.ts (the single source of truth) and emits a standalone,
 * self-contained, searchable HTML page listing every guardrail rule enforced
 * during website generation — grouped, severity-colour-coded, with doc links.
 *
 * Open the result directly: docs/guardrails.html (file:// is fine — no server).
 */
import { writeFile } from 'fs/promises'
import path from 'path'
import { CHECK_META, type CheckMeta } from '../lib/checkMeta'

const OUT = path.resolve(process.cwd(), '..', 'docs', 'guardrails.html')

const total = CHECK_META.length
const blocking = CHECK_META.filter((m) => m.severity === 'blocking').length
const advisory = total - blocking

// Stable group order for display.
const GROUP_ORDER = [
  'Structure', 'SEO', 'i18n', 'Webcore data layer', 'Tracking',
  'Layout & Design', 'Blog', 'Database', 'Deployment', 'Quality',
]
const groups = [...new Set(CHECK_META.map((m) => m.group))].sort(
  (a, b) => GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b),
)

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function row(m: CheckMeta): string {
  const sevClass = m.severity === 'blocking' ? 'sev-block' : 'sev-adv'
  const sevLabel = m.severity === 'blocking' ? 'BLOCKING' : 'advisory'
  return `      <tr class="rule" data-sev="${m.severity}" data-text="${esc((m.name + ' ' + m.id).toLowerCase())}">
        <td><span class="badge ${sevClass}">${sevLabel}</span></td>
        <td class="rule-name">${esc(m.name)}</td>
        <td><code>${esc(m.id)}</code></td>
        <td><a href="${esc(m.doc)}" target="_blank" rel="noopener">docs ↗</a></td>
      </tr>`
}

function groupBlock(g: string): string {
  const items = CHECK_META.filter((m) => m.group === g)
  const b = items.filter((m) => m.severity === 'blocking').length
  return `    <section class="group" data-group="${esc(g)}">
      <h2>${esc(g)} <span class="gcount">${items.length} rules · ${b} blocking</span></h2>
      <table>
        <thead><tr><th>Severity</th><th>Rule</th><th>Check id</th><th>Doc</th></tr></thead>
        <tbody>
${items.map(row).join('\n')}
        </tbody>
      </table>
    </section>`
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Utopia Website-Generation Guardrails</title>
<style>
  :root {
    --ink:#0f1115; --muted:#6b7280; --line:#e5e7eb; --bg:#f7f8fa; --card:#fff;
    --block:#c0392b; --block-bg:#fdecea; --adv:#b8860b; --adv-bg:#fdf6e3;
    --accent:#2563eb;
  }
  * { box-sizing:border-box; }
  body { margin:0; font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
         color:var(--ink); background:var(--bg); line-height:1.4; }
  header { background:linear-gradient(135deg,#11131a,#1f2430); color:#fff; padding:36px 24px 28px; }
  header h1 { margin:0 0 6px; font-size:26px; letter-spacing:-0.02em; }
  header p { margin:0; color:#aeb6c2; font-size:14px; max-width:760px; }
  .wrap { max-width:1040px; margin:0 auto; padding:0 24px 64px; }
  .stats { display:flex; gap:12px; flex-wrap:wrap; margin:-22px 0 22px; }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:14px 18px; box-shadow:0 6px 18px rgba(15,17,21,.06); flex:1; min-width:150px; }
  .stat .n { font-size:28px; font-weight:800; letter-spacing:-0.02em; }
  .stat .l { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
  .stat.block .n { color:var(--block); } .stat.adv .n { color:var(--adv); }
  .controls { position:sticky; top:0; z-index:5; background:var(--bg); padding:14px 0;
              display:flex; gap:10px; flex-wrap:wrap; align-items:center; border-bottom:1px solid var(--line); }
  #q { flex:1; min-width:220px; padding:10px 14px; border:1px solid var(--line); border-radius:10px; font-size:14px; }
  .filters { display:flex; gap:6px; }
  .chip { border:1px solid var(--line); background:#fff; border-radius:999px; padding:7px 14px;
          font-size:13px; cursor:pointer; user-select:none; }
  .chip.active { background:var(--ink); color:#fff; border-color:var(--ink); }
  section.group { background:var(--card); border:1px solid var(--line); border-radius:14px;
                  margin:18px 0; padding:8px 18px 16px; box-shadow:0 4px 14px rgba(15,17,21,.04); }
  section.group h2 { font-size:17px; margin:14px 4px 8px; display:flex; align-items:baseline; gap:10px; }
  .gcount { font-size:12px; color:var(--muted); font-weight:500; }
  table { width:100%; border-collapse:collapse; }
  th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.05em;
       color:var(--muted); padding:8px 8px; border-bottom:1px solid var(--line); }
  td { padding:9px 8px; border-bottom:1px solid #f1f2f4; font-size:14px; vertical-align:top; }
  tr.rule:last-child td { border-bottom:none; }
  .rule-name { font-weight:500; }
  code { background:#f3f4f6; border-radius:6px; padding:2px 6px; font-size:12.5px;
         font-family:ui-monospace,SFMono-Regular,Menlo,monospace; color:#374151; }
  .badge { font-size:10.5px; font-weight:700; letter-spacing:.04em; padding:3px 8px; border-radius:999px; white-space:nowrap; }
  .sev-block { background:var(--block-bg); color:var(--block); }
  .sev-adv { background:var(--adv-bg); color:var(--adv); }
  a { color:var(--accent); text-decoration:none; font-size:13px; }
  a:hover { text-decoration:underline; }
  .empty { display:none; color:var(--muted); padding:30px; text-align:center; }
  footer { color:var(--muted); font-size:12.5px; text-align:center; padding:24px; }
</style>
</head>
<body>
<header>
  <h1>🛡️ Utopia Website-Generation Guardrails</h1>
  <p>Every deterministic rule enforced when an agent builds a site. Verified by the Utopia Wizard
     (<code>npm run scan</code>). <strong>Blocking</strong> rules must stop the pipeline; <strong>advisory</strong>
     rules are warnings that count against the 0–100 score. Generated from
     <code>utopia-wizard/lib/checkMeta.ts</code> — the single source of truth.</p>
</header>
<div class="wrap">
  <div class="stats">
    <div class="stat"><div class="n">${total}</div><div class="l">Total rules</div></div>
    <div class="stat block"><div class="n">${blocking}</div><div class="l">Blocking</div></div>
    <div class="stat adv"><div class="n">${advisory}</div><div class="l">Advisory</div></div>
    <div class="stat"><div class="n">${groups.length}</div><div class="l">Categories</div></div>
  </div>

  <div class="controls">
    <input id="q" type="search" placeholder="Search rules by name or check id…" autocomplete="off">
    <div class="filters">
      <span class="chip active" data-f="all">All</span>
      <span class="chip" data-f="blocking">Blocking</span>
      <span class="chip" data-f="advisory">Advisory</span>
    </div>
  </div>

${groups.map(groupBlock).join('\n')}
  <p class="empty" id="empty">No rules match your search.</p>
</div>
<footer>Generated by <code>scripts/gen-guardrails.ts</code> · re-run after editing <code>checkMeta.ts</code> to refresh.</footer>

<script>
  const q = document.getElementById('q');
  const chips = [...document.querySelectorAll('.chip')];
  const rows = [...document.querySelectorAll('tr.rule')];
  const empty = document.getElementById('empty');
  let filter = 'all';

  function apply() {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach(r => {
      const okSev = filter === 'all' || r.dataset.sev === filter;
      const okTerm = !term || r.dataset.text.includes(term);
      const vis = okSev && okTerm;
      r.style.display = vis ? '' : 'none';
      if (vis) shown++;
    });
    document.querySelectorAll('section.group').forEach(sec => {
      const any = [...sec.querySelectorAll('tr.rule')].some(r => r.style.display !== 'none');
      sec.style.display = any ? '' : 'none';
    });
    empty.style.display = shown ? 'none' : 'block';
  }
  q.addEventListener('input', apply);
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    filter = c.dataset.f;
    apply();
  }));
</script>
</body>
</html>`

async function main() {
  await writeFile(OUT, html, 'utf-8')
  console.log(`guardrails: wrote ${OUT} · ${total} rules (${blocking} blocking, ${advisory} advisory)`)
}

main()
