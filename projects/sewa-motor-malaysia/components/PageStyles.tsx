/**
 * Shared CSS for homepage + location pages. Lives in a real component (not in
 * globals.css) so we can drop it onto specific pages and keep route-level CSS
 * cohesive. Add new rules here when a class is reused across the homepage
 * hero / USP / location pages.
 */
export default function PageStyles() {
  return (
    <style>{`
      /* Normalisers ─────────────────────────────────────────────────── */
      /* Without this, swapping an <h3> for an <h5> picks up the browser-default
         huge heading sizes — every heading in these pages inherits weight from
         its container so visual hierarchy is driven by classes, not by tag. */
      h1, h2, h3, h4, h5, h6 { font-weight: inherit; }

      /* Hero ─────────────────────────────────────────────────────────── */
      .home-hero {
        position: relative;
        padding: 80px 24px 64px;
        background: linear-gradient(135deg, #16213E 0%, #1A2744 60%, #0F172A 100%);
        color: #fff;
        overflow: hidden;
      }
      .home-hero-inner {
        max-width: 1100px; margin: 0 auto; position: relative; z-index: 1;
        display: grid; grid-template-columns: 1fr; gap: 32px; align-items: center;
        text-align: center;
      }
      .home-hero-bg {
        position: absolute; inset: 0;
        background-image: linear-gradient(135deg, rgba(22,33,62,0.85), rgba(15,23,42,0.95)), url('/og-image.jpg');
        background-size: cover;
        background-position: center;
        opacity: 0.6;
      }
      .home-hero h1 {
        font-size: clamp(30px, 4.6vw, 52px);
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .home-hero h2 {
        font-size: clamp(15px, 2vw, 18px);
        font-weight: 500;
        margin: 18px auto 26px;
        max-width: 680px;
        color: rgba(255,255,255,0.85);
        line-height: 1.55;
      }
      .home-hero-cta {
        display: inline-block;
        background: #25D366; color: #fff;
        font-weight: 700; font-size: 16px;
        padding: 14px 30px;
        border-radius: 999px;
        text-decoration: none;
      }
      .home-hero-media {
        position: relative;
        display: flex; align-items: center; justify-content: center;
      }
      .home-hero-photo {
        display: block;
        width: 100%; max-width: 420px; height: auto;
        filter: drop-shadow(0 12px 32px rgba(0,0,0,0.35));
      }
      .home-hero-stamp {
        position: absolute; top: 12px; right: 4px;
        background: #FF6B35;
        padding: 10px 16px;
        transform: skewX(-6deg);
        box-shadow: 0 6px 20px rgba(255,107,53,0.4);
        display: flex; flex-direction: column; align-items: center;
        line-height: 1;
      }
      .home-hero-stamp > span { transform: skewX(6deg); color: #fff; }
      .home-hero-stamp-from { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      .home-hero-stamp-price { font-size: 24px; font-weight: 800; margin: 2px 0; }
      .home-hero-stamp-per { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
      @media (min-width: 880px) {
        .home-hero { padding: 96px 24px 80px; }
        .home-hero-inner { grid-template-columns: 1.05fr 0.95fr; gap: 48px; text-align: left; }
        .home-hero h2 { margin-left: 0; margin-right: 0; }
        .home-hero-media { justify-content: flex-end; }
      }

      /* Stats strip (sits between hero and USP) ───────────────────────── */
      .home-stats {
        background: #16213E;
        padding: 56px 24px 72px;
        color: #fff;
      }
      .home-stats-grid {
        max-width: 1100px; margin: 0 auto;
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px;
        text-align: center;
      }
      .home-stat-value {
        font-size: clamp(24px, 3.4vw, 34px); font-weight: 800;
        letter-spacing: -0.03em; color: #FF6B35; margin-bottom: 6px;
      }
      .home-stat-label {
        font-size: 12px; font-weight: 400; line-height: 1.5;
        color: rgba(255,255,255,0.6);
      }
      @media (min-width: 720px) {
        .home-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 36px; }
      }

      /* USP panel ────────────────────────────────────────────────────── */
      .usp-panel {
        max-width: 1100px;
        margin: -32px auto 56px;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.06);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        overflow: hidden;
        position: relative;
        z-index: 5;
      }
      .usp-cell {
        padding: 28px 22px;
        display: flex; flex-direction: column; gap: 8px; align-items: center; text-align: center;
        border-right: 1px solid #F1F5F9;
      }
      .usp-cell:last-child { border-right: none; }
      .usp-cell h3 {
        font-size: 15px; font-weight: 700; margin: 0; color: #16213E; letter-spacing: -0.01em;
      }
      .usp-cell p {
        font-size: 13px; color: #475569; line-height: 1.5; margin: 0;
      }
      @media (max-width: 720px) {
        .usp-cell { border-right: none; border-bottom: 1px solid #F1F5F9; }
        .usp-cell:last-child { border-bottom: none; }
      }
    `}</style>
  );
}
