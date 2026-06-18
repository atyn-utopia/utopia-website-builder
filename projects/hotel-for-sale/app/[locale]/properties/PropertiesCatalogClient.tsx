'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HotelListing, PRICE_BANDS, discountPct } from '@/config/properties';
import HotelCard from '@/components/HotelCard';

// Condensed page list: 1 … current-1 current current+1 … last
function pageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('…');
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push('…');
  out.push(total);
  return out;
}

export default function PropertiesCatalogClient({
  hotels,
  states,
  pageSize = 12,
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
  const [showFilters, setShowFilters] = useState(false);
  const activeCount = [star, price, stateSlug, value].filter((v) => v !== 'all').length;

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
      <div className="catalog-bar">
        <button type="button" className="filter-toggle" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 5h18M6 12h12M10 19h4" /></svg>
          {t('filtersToggle')}
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        </button>
        <h6 className="catalog-count">{t('resultsCount', { count: filtered.length })}</h6>
      </div>

      {showFilters && (
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
      )}

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
              {pageItems(safePage, totalPages).map((it, i) =>
                it === '…' ? (
                  <span key={`g${i}`} className="pager-gap" aria-hidden="true">…</span>
                ) : (
                  <button
                    key={it}
                    type="button"
                    className={`pager-btn ${safePage === it ? 'is-active' : ''}`}
                    onClick={() => setPage(it as number)}
                    aria-current={safePage === it ? 'page' : undefined}
                  >
                    {it}
                  </button>
                ),
              )}
              <button type="button" className="pager-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">›</button>
            </nav>
          )}
        </>
      ) : (
        <h5 className="catalog-empty">{t('noResults')}</h5>
      )}

      <style jsx>{`
        .catalog-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .filter-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          height: 40px; padding: 0 16px; border-radius: 9px;
          background: #fff; border: 1px solid var(--line-strong); color: var(--brand-navy);
          font-family: var(--font-display); font-weight: 600; font-size: 13.5px; cursor: pointer;
          transition: border-color var(--dur) var(--ease-out);
        }
        .filter-toggle:hover { border-color: var(--brand-navy); }
        .filter-toggle[aria-expanded="true"] { background: var(--brand-navy); color: #fff; border-color: var(--brand-navy); }
        .filter-count { display: inline-grid; place-items: center; min-width: 19px; height: 19px; padding: 0 5px; border-radius: 999px; background: var(--brand-orange); color: #fff; font-size: 11px; font-weight: 700; }

        /* Compact, subtle filter bar */
        .catalog-filters {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          align-items: end;
          background: var(--brand-paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 18px;
        }
        @media (min-width: 720px) { .catalog-filters { grid-template-columns: repeat(4, 1fr) auto; gap: 10px; } }
        .catalog-field { display: flex; flex-direction: column; gap: 4px; }
        .catalog-field-label {
          font-weight: 600; font-size: 10px;
          letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-faint);
        }
        .catalog-field select {
          height: 38px; padding: 0 12px; border-radius: 8px;
          border: 1px solid var(--line-strong); background: #fff;
          font-family: var(--font-display); font-size: 13px; font-weight: 500; color: var(--brand-charcoal);
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>");
          background-repeat: no-repeat; background-position: right 11px center;
        }
        .catalog-field select:focus-visible { outline: 2px solid var(--brand-orange); outline-offset: 2px; border-color: var(--brand-orange); }
        .catalog-reset {
          height: 38px; padding: 0 18px; border-radius: 8px;
          background: #fff; color: var(--brand-navy); border: 1px solid var(--line-strong); cursor: pointer;
          font-family: var(--font-display); font-weight: 600; font-size: 13px;
          transition: border-color var(--dur) var(--ease-out), color var(--dur) var(--ease-out);
        }
        .catalog-reset:hover { border-color: var(--brand-navy); color: var(--brand-navy-deep); }
        .catalog-count {
          font-weight: 600; font-size: 12.5px;
          letter-spacing: 0.02em; color: var(--ink-muted);
          margin: 0;
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
        .pager-gap { display: inline-flex; align-items: flex-end; padding: 0 4px; color: var(--ink-faint); font-weight: 700; }
      `}</style>
    </>
  );
}
