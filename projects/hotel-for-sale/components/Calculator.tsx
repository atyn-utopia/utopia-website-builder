'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { calcQuote, waRedirect } from '@/lib/waRedirect';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';

type Period = 'daily' | 'weekly' | 'monthly';
type Model = 'ec200' | 'ec400';
type ModelRates = { daily: number; monthly: number };

export default function Calculator({
  rates,
}: {
  rates: { ec200: ModelRates; ec400: ModelRates };
}) {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const [model, setModel] = useState<Model>('ec200');
  const [period, setPeriod] = useState<Period>('daily');
  const [days, setDays] = useState(7);

  const quote = useMemo(() => {
    const rate = model === 'ec200' ? rates.ec200 : rates.ec400;
    return calcQuote(rate, days, period);
  }, [model, period, days, rates]);

  const formatted = quote.toLocaleString('en-MY');
  const waMessage = `${t('models.' + model)} · ${t('periods.' + period)} · ${days} ${t('daysLabel')} · ${t('quotePrefix')} ${formatted}`;
  const waHref = waRedirect(locale, waMessage);

  return (
    <div className="calc-panel">
      <div className="calc-glow" aria-hidden="true" />

      <div className="calc-grid">
        <div className="calc-cell">
          <label className="calc-label">{t('modelLabel')}</label>
          <div className="calc-segmented">
            {(['ec200', 'ec400'] as Model[]).map((m) => (
              <button key={m} type="button" className={`calc-chip ${model === m ? 'is-active' : ''}`} onClick={() => setModel(m)}>
                {t(`models.${m}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-cell">
          <label className="calc-label">{t('periodLabel')}</label>
          <div className="calc-segmented">
            {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
              <button key={p} type="button" className={`calc-chip ${period === p ? 'is-active' : ''}`} onClick={() => setPeriod(p)}>
                {t(`periods.${p}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-cell">
          <label className="calc-label" htmlFor="calc-days">{t('daysLabel')}</label>
          <div className="calc-stepper">
            <button type="button" aria-label="−" onClick={() => setDays((d) => Math.max(1, d - 1))}>−</button>
            <input
              id="calc-days"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))}
              inputMode="numeric"
            />
            <button type="button" aria-label="+" onClick={() => setDays((d) => Math.min(365, d + 1))}>+</button>
          </div>
        </div>
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
        .calc-panel {
          position: relative;
          background: var(--brand-charcoal);
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 56px 56px, 56px 56px;
          border: 1px solid var(--line-on-dark);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-xl);
          padding: 48px 40px;
          max-width: 980px;
          margin: 0 auto;
          overflow: hidden;
          color: #fff;
        }
        .calc-glow { position: absolute; inset: 0; background: radial-gradient(40% 60% at 20% 20%, rgba(239, 65, 35,0.20) 0%, rgba(239, 65, 35,0) 70%); pointer-events: none; }
        .calc-grid { display: grid; gap: 24px; position: relative; grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 760px) { .calc-grid { grid-template-columns: 1fr; } }
        .calc-cell { display: flex; flex-direction: column; gap: 10px; }
        .calc-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
        .calc-segmented { display: inline-flex; flex-wrap: wrap; gap: 8px; }
        .calc-chip { flex: 1; min-width: 0; padding: 12px 14px; border-radius: 12px; background: transparent; border: 1.5px solid var(--line-on-dark-strong); color: rgba(255,255,255,0.85); font-weight: 500; font-size: 14px; cursor: pointer; transition: background-color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), color var(--dur) var(--ease-out); }
        .calc-chip:hover { border-color: rgba(255,255,255,0.4); }
        .calc-chip.is-active { background: var(--brand-orange); border-color: var(--brand-orange); color: #fff; box-shadow: var(--shadow-orange); }
        .calc-stepper { display: inline-flex; align-items: center; background: var(--brand-steel); border-radius: 14px; padding: 6px; border: 1px solid var(--line-on-dark); }
        .calc-stepper button { width: 36px; height: 36px; border-radius: 10px; background: transparent; color: #fff; font-size: 18px; font-weight: 700; border: none; cursor: pointer; }
        .calc-stepper button:hover { background: rgba(255,255,255,0.08); }
        .calc-stepper input { flex: 1; min-width: 0; width: 80px; background: transparent; border: none; color: #fff; font-family: var(--font-mono-stack); font-weight: 700; font-size: 18px; text-align: center; outline: none; -moz-appearance: textfield; }
        .calc-stepper input::-webkit-outer-spin-button, .calc-stepper input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .calc-quote { position: relative; margin-top: 32px; padding-top: 28px; border-top: 1px solid var(--line-on-dark); text-align: center; }
        .calc-quote-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
        .calc-quote-amount { display: inline-flex; align-items: baseline; gap: 8px; margin-top: 8px; }
        .calc-from { font-family: var(--font-display); font-weight: 500; font-size: clamp(0.95rem, 1.4vw, 1.125rem); letter-spacing: 0.02em; color: rgba(255,255,255,0.55); text-transform: uppercase; align-self: center; margin-right: 2px; }
        .calc-rm { font-family: var(--font-mono-stack); font-weight: 500; font-size: clamp(1.5rem, 3vw, 2rem); color: rgba(255,255,255,0.6); }
        .calc-num { font-family: var(--font-mono-stack); font-weight: 700; font-size: clamp(2.5rem, 7vw, 5rem); line-height: 1; color: #fff; letter-spacing: -0.01em; }
        .calc-suffix { margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.6); }
        .calc-shimmer { margin: 28px 0 20px; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--brand-orange) 50%, transparent 100%); opacity: 0.55; }
        .calc-cta { display: flex; justify-content: center; }
        .calc-cta :global(.btn) { width: 100%; max-width: 380px; }
        .calc-disclaimer { margin: 18px 0 0; text-align: center; font-size: 12px; color: rgba(255,255,255,0.45); }
      `}</style>
    </div>
  );
}
