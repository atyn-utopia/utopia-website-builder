'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HotelListing, PRICE_BANDS, discountPct } from '@/config/properties';
import HotelCard from '@/components/HotelCard';

export default function PropertiesCatalogClient({
  hotels,
  states,
  pageSize = 6,
}: {
  hotels: HotelListing[];
  states: { slug: string; name: string }[];
  pageSize?: number;
}) {
  const t = useTranslations('properties');
  const [star, setStar] = useState('all');
  const [price, setPrice] = useState('all');
  const [stateSlug, setStateSlug] = useState('all');
  const [value, setValue] = useState('all');
  const [page, setPage] = useState(1);

  const starOptions = useMemo(
    () => Array.from(new Set(hotels.map((h) => h.stars))).sort((a, b) => a - b),
    [hotels],
  );

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (star !== 'all' && String(h.stars) !== star) return false;
      if (stateSlug !== 'all' && h.stateSlug !== stateSlug) return false;
      if (price !== 'all') {
        const band = PRICE_BANDS[Number(price)];
        if (band && (h.sellingPrice < band.min || h.sellingPrice >= band.max)) return false;
      }
      if (value === 'below' && discountPct(h) <= 0) return false;
      if (value === 'yield' && h.grossYield < 10) return false;
      return true;
    });
  }, [hotels, star, price, stateSlug, value]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset to page 1 whenever the filters change.
  useEffect(() => { setPage(1); }, [star, price, stateSlug, value]);

  const reset = () => {
    setStar('all');
    setPrice('all');
    setStateSlug('all');
    setValue('all');
  };

  return (
    <>
      <div className="catalog-filters" role="search">
        <label className="catalog-field">
          <span className="catalog-field-label">{t('filterStarLabel')}</span>
          <select value={star} onChange={(e) => setStar(e.target.value)}>
            <option value="all">{t('allStar')}</option>
            {starOptions.map((s) => (
              <option key={s} value={s}>{t('starOption', { count: s })}</option>
            ))}
          </select>
        </label>

        <label className="catalog-field">
          <span className="catalog-field-label">{t('filterPriceLabel')}</span>
          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="all">{t('allPrice')}</option>
            {PRICE_BANDS.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>
        </label>

        <label className="catalog-field">
          <span className="catalog-field-label">{t('filterStateLabel')}</span>
          <select value={stateSlug} onChange={(e) => setStateSlug(e.target.value)}>
            <option value="all">{t('allState')}</option>
            {states.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </label>

        <label className="catalog-field">
          <span className="catalog-field-label">{t('filterValueLabel')}</span>
          <select value={value} onChange={(e) => setValue(e.target.value)}>
            <option value="all">{t('allValue')}</option>
            <option value="below">{t('valueUndervalue')}</option>
            <option value="yield">{t('valueHighYield')}</option>
          </select>
        </label>

        <button type="button" className="catalog-reset" onClick={reset}>{t('reset')}</button>
      </div>

      <h6 className="catalog-count">{t('resultsCount', { count: filtered.length })}</h6>

      {filtered.length > 0 ? (
        <>
          <div className="hotel-grid">
            {paged.map((h) => (
              <HotelCard key={h.id} h={h} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="catalog-pager" aria-label="Pagination">
              <button type="button" className="pager-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page">‹</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pager-btn ${safePage === i + 1 ? 'is-active' : ''}`}
                  onClick={() => setPage(i + 1)}
                  aria-current={safePage === i + 1 ? 'page' : undefined}
                >
                  {i + 1}
                </button>
              ))}
              <button type="button" className="pager-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">›</button>
            </nav>
          )}
        </>
      ) : (
        <h5 className="catalog-empty">{t('noResults')}</h5>
      )}

      <style jsx>{`
        .catalog-filters {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          align-items: end;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 18px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 22px;
        }
        @media (min-width: 720px) { .catalog-filters { grid-template-columns: repeat(4, 1fr) auto; gap: 14px; } }
        .catalog-field { display: flex; flex-direction: column; gap: 6px; }
        .catalog-field-label {
          font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px;
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint);
        }
        .catalog-field select {
          height: 46px; padding: 0 14px; border-radius: var(--radius-btn);
          border: 1.5px solid var(--line-strong); background: var(--brand-paper);
          font-family: var(--font-display); font-size: 14px; font-weight: 500; color: var(--brand-charcoal);
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%230A2540' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>");
          background-repeat: no-repeat; background-position: right 12px center;
        }
        .catalog-field select:focus-visible { outline: 2px solid var(--brand-orange); outline-offset: 2px; border-color: var(--brand-orange); }
        .catalog-reset {
          height: 46px; padding: 0 22px; border-radius: var(--radius-btn);
          background: var(--brand-charcoal); color: #fff; border: none; cursor: pointer;
          font-family: var(--font-display); font-weight: 700; font-size: 14px;
          transition: background var(--dur) var(--ease-out), transform var(--dur) var(--ease-out);
        }
        .catalog-reset:hover { background: var(--brand-charcoal-2); transform: translateY(-1px); }
        .catalog-count {
          font-family: var(--font-mono-stack); font-weight: 700; font-size: 12px;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted);
          margin: 0 0 20px;
        }
        .catalog-empty {
          text-align: center; color: var(--ink-muted); font-size: 16px; line-height: 1.7;
          padding: 48px 20px; background: var(--brand-paper); border: 1px dashed var(--line-strong);
          border-radius: var(--radius-card);
        }
        .catalog-pager { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
        .pager-btn {
          min-width: 42px; height: 42px; padding: 0 12px;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1.5px solid var(--line-strong); background: #fff; color: var(--brand-navy);
          border-radius: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14.5px;
          cursor: pointer; transition: background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
        }
        .pager-btn:hover:not(:disabled) { border-color: var(--brand-navy); }
        .pager-btn.is-active { background: var(--brand-navy); border-color: var(--brand-navy); color: #fff; }
        .pager-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </>
  );
}
