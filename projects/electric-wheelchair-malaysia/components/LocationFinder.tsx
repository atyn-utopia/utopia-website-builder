'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

export interface FinderTown {
  slug: string;
  name: string;
  state: string;
  href: string;
}

const INITIAL = 12;

/**
 * Type-to-find over the town list. Every town link is rendered on the server
 * and stays in the DOM — filtering only toggles `hidden` — so crawlers see all
 * 84 internal links while a phone user sees twelve until they type or pick a
 * state.
 *
 * Labels come from the `locations.finder*` messages with ICU substitution —
 * the count, "Showing {shown} of {n}", "Show all {n}" and the empty-state
 * "{q}" are filled by next-intl, never by string `.replace()`.
 */
export default function LocationFinder({
  towns,
  states,
}: {
  towns: FinderTown[];
  states: string[];
}) {
  const t = useTranslations('locations');
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [expanded, setExpanded] = useState(false);

  const q = query.trim().toLowerCase();
  const filtering = q.length > 0 || state.length > 0;

  const matches = useMemo(
    () => towns.filter((t) => (!state || t.state === state) && (!q || t.name.toLowerCase().includes(q))),
    [towns, state, q],
  );
  const visible = new Set((filtering || expanded ? matches : matches.slice(0, INITIAL)).map((t) => t.slug));
  const n = matches.length;

  return (
    <div className="ew-find">
      <label className="ew-find__search">
        <input
          id="location-finder"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('finderPlaceholder')}
          autoComplete="off"
          aria-label={t('finderPlaceholder')}
        />
        <span aria-live="polite">{t('finderCount', { n })}</span>
      </label>

      <div className="ew-find__filters" role="group">
        <button type="button" aria-pressed={state === ''} onClick={() => setState('')}>
          {t('finderAll')}
        </button>
        {states.map((s) => (
          <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(state === s ? '' : s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="ew-find__list">
        {towns.map((t) => (
          <a key={t.slug} href={t.href} hidden={!visible.has(t.slug)}>
            <b>{t.name}</b>
            <small>{t.state}</small>
          </a>
        ))}
      </div>

      {matches.length === 0 && <p className="ew-find__empty">{t('finderEmpty', { q: query.trim() })}</p>}

      {!filtering && !expanded && matches.length > INITIAL && (
        <p className="ew-find__more">
          {t('finderMore', { shown: INITIAL, n })}{' '}
          <button type="button" onClick={() => setExpanded(true)}>
            {t('finderShowAll', { n })}
          </button>
        </p>
      )}
    </div>
  );
}
