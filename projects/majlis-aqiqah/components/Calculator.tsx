'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';

type Gender = 'lelaki' | 'perempuan';
type Tier = 'a' | 'b' | 'c' | 'd';

/** Aqiqah is 2 head of livestock for a boy, 1 for a girl. */
const HEAD_PER_CHILD: Record<Gender, number> = { lelaki: 2, perempuan: 1 };

export default function Calculator({
  rates,
}: {
  rates: Record<Tier, number>;
}) {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const [gender, setGender] = useState<Gender>('lelaki');
  const [tier, setTier] = useState<Tier>('a');
  const [children, setChildren] = useState(1);

  const heads = HEAD_PER_CHILD[gender] * children;
  const quote = useMemo(() => rates[tier] * heads, [rates, tier, heads]);

  const formatted = quote.toLocaleString('en-MY');
  const waMessage = `${t(`genders.${gender}`)} · ${t(`tiers.${tier}`)} · ${t('headCount', { count: heads })} · ${t('quotePrefix')} ${formatted}`;
  const waHref = waRedirect(locale, waMessage);

  return (
    <div className="calc-panel">
      <div className="calc-glow" aria-hidden="true" />

      <div className="calc-grid">
        <div className="calc-cell">
          <label className="calc-label">{t('genderLabel')}</label>
          <div className="calc-segmented">
            {(['lelaki', 'perempuan'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                className={`calc-chip ${gender === g ? 'is-active' : ''}`}
                onClick={() => setGender(g)}
                aria-pressed={gender === g}
              >
                {t(`genders.${g}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-cell">
          <label className="calc-label">{t('tierLabel')}</label>
          <div className="calc-segmented">
            {(['a', 'b', 'c', 'd'] as Tier[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`calc-chip ${tier === p ? 'is-active' : ''}`}
                onClick={() => setTier(p)}
                aria-pressed={tier === p}
              >
                {t(`tiers.${p}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-cell">
          <label className="calc-label" htmlFor="calc-children">{t('childrenLabel')}</label>
          <div className="calc-stepper">
            <button type="button" aria-label={t('decreaseLabel')} onClick={() => setChildren((c) => Math.max(1, c - 1))}>−</button>
            <input
              id="calc-children"
              type="number"
              min={1}
              max={20}
              value={children}
              onChange={(e) => setChildren(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              inputMode="numeric"
            />
            <button type="button" aria-label={t('increaseLabel')} onClick={() => setChildren((c) => Math.min(20, c + 1))}>+</button>
          </div>
        </div>
      </div>

      <div className="calc-heads" aria-live="polite">
        <span className="calc-heads-pill">{t('headCount', { count: heads })}</span>
      </div>

      <div className="calc-quote">
        <span className="calc-quote-label">{t('quoteLabel')}</span>
        <div className="calc-quote-amount" aria-live="polite">
          <span className="calc-from">{t('quoteFromLabel')}</span>
          <span className="calc-rm">{t('quotePrefix')}</span>
          <span className="calc-num">{formatted}</span>
        </div>
        <p className="calc-suffix">{t('quoteSuffix')}</p>
      </div>

      <div className="calc-shimmer" aria-hidden="true" />

      <div className="calc-cta">
        <WhatsAppButton href={waHref} label="calculator" className="btn btn-wa">
          <WaIcon />
          {t('ctaLabel')}
        </WhatsAppButton>
      </div>

      <p className="calc-disclaimer">{t('disclaimer')}</p>

      <style jsx>{`
        /* Borang tempahan — the booking slip.
           The panel used to be a second dark emerald slab sitting on the dark
           emerald section, which made the selector feel like a machine console
           bolted to the page. It is inverted here: a sheet of the same cream
           paper the packages are printed on, laid on the girih ground, double-
           ruled like a kenduri form, with the summary detaching at a perforated
           edge as a tear-off slip. */
        .calc-panel {
          position: relative;
          background: var(--brand-paper);
          border: 1px solid var(--brand-gold);
          border-radius: var(--radius-card);
          box-shadow: 0 44px 96px -44px rgba(0,0,0,0.62), 0 10px 26px -14px rgba(0,0,0,0.35);
          padding: 46px 40px 40px;
          max-width: 980px;
          margin: 0 auto;
          overflow: hidden;
          color: var(--ink);
        }
        .calc-panel::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image: var(--girih-deep);
          background-size: 80px 80px;
          background-position: center;
          opacity: 0.07;
          pointer-events: none;
        }
        @media (max-width: 760px) { .calc-panel { padding: 30px 18px 32px; } }
        /* Repurposed: the inset hairline that makes the sheet a ruled form. */
        .calc-glow {
          position: absolute; inset: 9px; z-index: 0;
          border: 1px solid var(--brand-gold-ring);
          border-radius: calc(var(--radius-card) - 5px);
          pointer-events: none;
        }
        @media (max-width: 760px) { .calc-glow { inset: 6px; } }
        .calc-grid { display: grid; gap: 24px; position: relative; z-index: 1; grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 760px) { .calc-grid { grid-template-columns: 1fr; } }
        .calc-cell { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        @media (min-width: 761px) { .calc-cell { align-items: stretch; } }
        .calc-label { font-family: var(--font-display); font-weight: 700; font-size: 10.5px; letter-spacing: var(--label-tracking); text-transform: uppercase; color: var(--brand-gold-deep); }
        .calc-segmented { display: flex; flex-wrap: wrap; gap: 8px; width: 100%; }
        .calc-chip { flex: 1; min-width: 0; padding: 12px 14px; border-radius: 12px; background: #FFFFFF; border: 1.5px solid var(--line-strong); color: var(--brand-emerald); font-weight: 600; font-size: 14px; cursor: pointer; transition: background-color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out); }
        .calc-chip:hover { border-color: var(--brand-emerald); }
        .calc-chip:focus-visible { outline: 2px solid var(--brand-gold); outline-offset: 2px; }
        .calc-chip:active { transform: translateY(1px); }
        .calc-chip.is-active { background: var(--brand-emerald); border-color: var(--brand-gold); color: #FFFFFF; box-shadow: 0 12px 26px -14px rgba(7,58,44,0.75); }
        .calc-stepper { display: inline-flex; align-items: center; background: #FFFFFF; border-radius: 14px; padding: 6px; border: 1.5px solid var(--line-strong); }
        .calc-stepper button { width: 36px; height: 36px; border-radius: 10px; background: transparent; color: var(--brand-emerald); font-size: 18px; font-weight: 700; border: none; cursor: pointer; transition: background-color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out); }
        .calc-stepper button:hover { background: var(--brand-gold-pale); }
        .calc-stepper button:focus-visible { outline: 2px solid var(--brand-gold); outline-offset: 2px; }
        .calc-stepper button:active { transform: translateY(1px); }
        .calc-stepper input { flex: 1; min-width: 0; width: 80px; background: transparent; border: none; color: var(--brand-emerald); font-family: var(--font-display); font-variant-numeric: tabular-nums; font-weight: 700; font-size: 18px; text-align: center; outline: none; -moz-appearance: textfield; }
        .calc-stepper input:focus-visible { outline: 2px solid var(--brand-gold); outline-offset: 2px; border-radius: 8px; }
        .calc-stepper input::-webkit-outer-spin-button, .calc-stepper input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        /* The head count is the syariah fact, so it is the ruled banner across
           the form — not a footnote beside the money. */
        .calc-heads {
          position: relative; z-index: 1;
          display: flex; justify-content: center;
          /* Runs edge to edge between the inset rules, so the banner reads as
             part of the form's ruling rather than a floating box. */
          margin: 30px -30px 0;
          padding: 15px 20px;
          background: var(--brand-gold-pale);
          border-top: 1px solid var(--brand-gold-ring);
          border-bottom: 1px solid var(--brand-gold-ring);
        }
        @media (max-width: 760px) { .calc-heads { margin: 26px -11px 0; } }
        .calc-heads-pill { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-serif); font-weight: 700; font-size: 19px; line-height: 1.2; color: var(--brand-emerald); letter-spacing: -0.01em; text-align: center; }
        /* The tear-off slip: a white leaf detaching at a perforated gold edge. */
        .calc-quote {
          position: relative; z-index: 1;
          margin-top: 26px;
          padding: 24px 18px 20px;
          background: #FFFFFF;
          border: 1px solid var(--brand-gold-ring);
          border-radius: var(--radius-md);
          text-align: center;
        }
        .calc-quote::before {
          content: '';
          position: absolute; top: -1px; left: 16px; right: 16px; height: 2px;
          background-image: repeating-linear-gradient(90deg, var(--brand-gold) 0 6px, transparent 6px 13px);
          opacity: 0.7;
        }
        .calc-quote-label { display: block; font-family: var(--font-display); font-weight: 700; font-size: 10.5px; letter-spacing: var(--label-tracking); text-transform: uppercase; color: var(--brand-gold-deep); }
        .calc-quote-amount { display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: baseline; gap: 8px; margin-top: 10px; }
        .calc-from { font-family: var(--font-display); font-weight: 600; font-size: clamp(0.95rem, 1.4vw, 1.125rem); letter-spacing: 0.02em; color: var(--ink-muted); text-transform: uppercase; align-self: center; margin-right: 2px; }
        .calc-rm { font-family: var(--font-display); font-weight: 600; font-size: clamp(1.25rem, 2.4vw, 1.625rem); color: var(--brand-gold-deep); }
        .calc-num { font-family: var(--font-serif); font-weight: 700; font-size: clamp(2.25rem, 6vw, 4rem); line-height: 1; color: var(--brand-emerald); letter-spacing: -0.01em; }
        .calc-suffix { margin: 10px 0 0; font-size: 13px; color: var(--ink-muted); }
        .calc-shimmer { position: relative; z-index: 1; margin: 26px 0 20px; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--brand-gold) 50%, transparent 100%); opacity: 0.6; }
        .calc-cta { position: relative; z-index: 1; display: flex; justify-content: center; }
        .calc-cta :global(.btn) { width: 100%; max-width: 380px; }
        .calc-disclaimer { position: relative; z-index: 1; margin: 18px 0 0; text-align: center; font-size: 12px; color: var(--ink-faint); }
      `}</style>
    </div>
  );
}
