'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

interface Hotel {
  id: string;
  name: string;
  city: string; citySlug: string;
  state: string; stateSlug: string;
  stars: number;
  sellingPrice: number; marketValue: number;
  rooms: number;
  tenure: 'Freehold' | 'Leasehold';
  propertyType: string; unitType?: string;
  grossYield: number;
  landSizeSqft: number; builtUpSqft: number;
  cover: string;
  gallery: string[];
  shortDesc: string;
  description: string;
  descriptionHtml?: string;
  highlights: string[];
  facilities: string[];
  onSale: boolean;
  featured: boolean;
  hotListed?: boolean;
}

const rm = (n: number) => `RM ${Number(n || 0).toLocaleString('en-MY')}`;
const PASS_KEY = 'hfs-mgr-pass';
const HOT_LIMIT = 5;

const BLANK: Hotel = {
  id: '', name: '', city: '', citySlug: '', state: '', stateSlug: '',
  stars: 3, sellingPrice: 0, marketValue: 0, rooms: 0, tenure: 'Freehold',
  propertyType: 'Hotel', unitType: '', grossYield: 0, landSizeSqft: 0, builtUpSqft: 0,
  cover: '', gallery: [], shortDesc: '', description: '', descriptionHtml: '', highlights: [], facilities: [],
  onSale: true, featured: true, hotListed: false,
};

export default function ManagePage() {
  const [pass, setPass] = useState<string | null>(null);
  const [passInput, setPassInput] = useState('');
  const [authErr, setAuthErr] = useState('');

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem(PASS_KEY) : null;
    if (saved) setPass(saved);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/properties', { cache: 'no-store' });
    const data = await res.json();
    setHotels(data.hotels ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (pass) load(); }, [pass, load]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === '8889') {
      sessionStorage.setItem(PASS_KEY, passInput);
      setPass(passInput);
      setAuthErr('');
    } else {
      setAuthErr('Incorrect password.');
    }
  };
  const logout = () => { sessionStorage.removeItem(PASS_KEY); setPass(null); setHotels([]); };

  const hotCount = useMemo(() => hotels.filter((h) => h.hotListed).length, [hotels]);
  const saleCount = useMemo(() => hotels.filter((h) => h.onSale).length, [hotels]);
  const hiddenCount = useMemo(() => hotels.filter((h) => !h.featured).length, [hotels]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hotels;
    return hotels.filter((h) => `${h.id} ${h.name} ${h.city} ${h.state}`.toLowerCase().includes(q));
  }, [hotels, search]);

  const startNew = () => { setEditing({ ...BLANK }); setIsNew(true); setMsg(''); };
  const startEdit = (h: Hotel) => { setEditing({ ...h }); setIsNew(false); setMsg(''); };
  const closeModal = () => setEditing(null);
  const set = (patch: Partial<Hotel>) => setEditing((e) => (e ? { ...e, ...patch } : e));

  const save = async () => {
    if (!editing || !pass) return;
    if (!editing.name.trim()) { setMsg('Name is required.'); return; }
    setSaving(true); setMsg('');
    const res = await fetch('/api/properties', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-pass': pass },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) { setMsg(`${isNew ? 'Added' : 'Updated'} "${data.hotel.name}". Live now.`); setEditing(null); load(); }
    else setMsg(`Error: ${data.error ?? 'save failed'}`);
  };

  const remove = async (h: Hotel) => {
    if (!pass || !confirm(`Delete "${h.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/properties?id=${encodeURIComponent(h.id)}`, { method: 'DELETE', headers: { 'x-admin-pass': pass } });
    const data = await res.json();
    if (data.ok) { setMsg(`Deleted "${h.name}".`); load(); } else setMsg(`Error: ${data.error}`);
  };

  // ── Login screen ──
  if (!pass) {
    return (
      <main className="mgr-login">
        <form onSubmit={login} className="mgr-login-card">
          <div className="mgr-brandmark mgr-brandmark--lg"><HotelGlyph /></div>
          <h1 className="mgr-login-title">HotelForSale Console</h1>
          <p className="mgr-login-sub">Enter the admin password to manage listings.</p>
          <input type="password" autoFocus value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="Password" className="mgr-input mgr-login-input" />
          {authErr && <p className="mgr-login-err">{authErr}</p>}
          <button type="submit" className="mgr-btn mgr-btn--primary mgr-btn--block">Log In</button>
        </form>
        <p className="mgr-login-foot">Restricted area · authorised staff only</p>
        <StyleBlock />
      </main>
    );
  }

  // ── Admin ──
  return (
    <div className="mgr-root">
      <header className="mgr-appbar">
        <div className="mgr-appbar-inner">
          <div className="mgr-brand">
            <div className="mgr-brandmark"><HotelGlyph /></div>
            <div className="mgr-brand-text">
              <span className="mgr-brand-title">Hotel Listings</span>
              <span className="mgr-brand-sub">Admin console</span>
            </div>
          </div>
          <div className="mgr-appbar-actions">
            <button onClick={load} disabled={loading} className="mgr-btn mgr-btn--ghost">
              <IconReload /> <span className="mgr-btn-label">Reload</span>
            </button>
            <button onClick={startNew} className="mgr-btn mgr-btn--primary">
              <IconPlus /> Add Hotel
            </button>
            <button onClick={logout} className="mgr-btn mgr-btn--ghost">
              <IconLogout /> <span className="mgr-btn-label">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mgr-main">
        {/* Stats */}
        <div className="mgr-stats">
          <StatCard label="Total listings" value={hotels.length} accent="#16356B" icon={<IconList />} />
          <StatCard label="Hot List" value={`${hotCount}/${HOT_LIMIT}`} accent="#EF4123" warn={hotCount >= HOT_LIMIT} icon={<IconFlame />} />
          <StatCard label="On sale" value={saleCount} accent="#1FA463" icon={<IconTag />} />
          <StatCard label="Hidden" value={hiddenCount} accent="#94A3B8" icon={<IconEyeOff />} />
        </div>

        {/* Toolbar */}
        <div className="mgr-toolbar">
          <div className="mgr-searchbox">
            <IconSearch />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, or location…" className="mgr-search-input" />
            {search && <button className="mgr-search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
          </div>
          <span className="mgr-toolbar-count">
            {search ? <>{filtered.length} of {hotels.length}</> : <>{hotels.length} listings</>}
          </span>
        </div>

        {msg && <div className={`mgr-toast ${msg.startsWith('Error') ? 'is-err' : 'is-ok'}`}>{msg}</div>}

        {/* Table */}
        <div className="mgr-table-card">
          {loading ? (
            <div className="mgr-empty"><span className="mgr-spinner" /> Loading listings…</div>
          ) : (
            <table className="mgr-table">
              <thead>
                <tr>
                  <th className="mgr-th" style={{ width: '36%' }}>Hotel</th>
                  <th className="mgr-th" style={{ width: '19%' }}>Location</th>
                  <th className="mgr-th mgr-th--c" style={{ width: '8%' }}>Stars</th>
                  <th className="mgr-th mgr-th--r" style={{ width: '16%' }}>Selling price</th>
                  <th className="mgr-th mgr-th--c" style={{ width: '12%' }}>Status</th>
                  <th className="mgr-th mgr-th--r" style={{ width: '9%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id} className="mgr-row">
                    <td className="mgr-td">
                      <div className="mgr-hotelcell">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={h.cover} alt={`${h.name} cover photo`} className="mgr-thumb" />
                        <div className="mgr-hotelcell-text">
                          <span className="mgr-hotel-name">{h.name}</span>
                          <span className="mgr-hotel-meta">{h.id} · {h.rooms || '—'} rooms · {h.tenure}</span>
                        </div>
                      </div>
                    </td>
                    <td className="mgr-td mgr-td--muted">{h.city}, {h.state}</td>
                    <td className="mgr-td mgr-td--c"><span className="mgr-stars">{h.stars}★</span></td>
                    <td className="mgr-td mgr-td--r mgr-price">{rm(h.sellingPrice)}</td>
                    <td className="mgr-td mgr-td--c">
                      <span className="mgr-pills">
                        {h.onSale && <Tag color="#1FA463">Sale</Tag>}
                        {h.hotListed && <Tag color="#EF4123">Hot</Tag>}
                        {!h.featured && <Tag color="#94A3B8">Hidden</Tag>}
                      </span>
                    </td>
                    <td className="mgr-td mgr-td--r">
                      <div className="mgr-actions">
                        <button onClick={() => startEdit(h)} className="mgr-iconbtn" title="Edit"><IconEdit /></button>
                        <button onClick={() => remove(h)} className="mgr-iconbtn mgr-iconbtn--danger" title="Delete"><IconTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="mgr-empty">No hotels match “{search}”.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <p className="mgr-footnote">Changes publish to the live site immediately after saving.</p>
      </main>

      {/* MODAL */}
      {editing && (
        <div role="dialog" aria-modal="true" onClick={closeModal} className="mgr-overlay">
          <div onClick={(e) => e.stopPropagation()} className="mgr-modal">
            <div className="mgr-modal-head">
              <div>
                <h2 className="mgr-modal-title">{isNew ? 'Add new hotel' : editing.name || editing.id}</h2>
                <span className="mgr-modal-sub">{isNew ? 'Create a new listing' : `Editing ${editing.id}`}</span>
              </div>
              <button onClick={closeModal} aria-label="Close" className="mgr-modal-close">×</button>
            </div>
            <div className="mgr-modal-body">
              <div className="mgr-formgrid">
                <Field label="Hotel name *" full><input className="mgr-input" value={editing.name} onChange={(e) => set({ name: e.target.value })} /></Field>
                <Field label="Short description (card line)" full><input className="mgr-input" value={editing.shortDesc} onChange={(e) => set({ shortDesc: e.target.value })} /></Field>
                <Field label="City"><input className="mgr-input" value={editing.city} onChange={(e) => set({ city: e.target.value })} /></Field>
                <Field label="State"><input className="mgr-input" value={editing.state} onChange={(e) => set({ state: e.target.value })} /></Field>
                <Field label="Star rating"><select className="mgr-input" value={editing.stars} onChange={(e) => set({ stars: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} Star</option>)}</select></Field>
                <Field label="Tenure"><select className="mgr-input" value={editing.tenure} onChange={(e) => set({ tenure: e.target.value as Hotel['tenure'] })}><option>Freehold</option><option>Leasehold</option></select></Field>
                <Field label="Property type"><input className="mgr-input" value={editing.propertyType} onChange={(e) => set({ propertyType: e.target.value })} placeholder="Hotel / Resort" /></Field>
                <Field label="Unit type"><input className="mgr-input" value={editing.unitType || ''} onChange={(e) => set({ unitType: e.target.value })} placeholder="Corner lot" /></Field>
                <Field label="Rooms"><input type="number" className="mgr-input" value={editing.rooms} onChange={(e) => set({ rooms: Number(e.target.value) })} /></Field>
                <Field label="Selling price (RM)"><input type="number" className="mgr-input" value={editing.sellingPrice} onChange={(e) => set({ sellingPrice: Number(e.target.value) })} /></Field>
                <Field label="Market value (RM)"><input type="number" className="mgr-input" value={editing.marketValue} onChange={(e) => set({ marketValue: Number(e.target.value) })} /></Field>
                <Field label="Built-up (sq ft)"><input type="number" className="mgr-input" value={editing.builtUpSqft} onChange={(e) => set({ builtUpSqft: Number(e.target.value) })} /></Field>
                <Field label="Cover image URL" full><input className="mgr-input" value={editing.cover} onChange={(e) => set({ cover: e.target.value })} placeholder="https://…" /></Field>
                <Field label="Gallery image URLs (one per line)" full><textarea className="mgr-input mgr-textarea" value={editing.gallery.join('\n')} onChange={(e) => set({ gallery: e.target.value.split('\n') })} rows={2} /></Field>
                <Field label="Full description (HTML allowed: Property Features, Highlights…)" full><textarea className="mgr-input mgr-textarea" value={editing.descriptionHtml || ''} onChange={(e) => set({ descriptionHtml: e.target.value })} rows={6} /></Field>
                <Field label="Investment highlights (one per line)" full><textarea className="mgr-input mgr-textarea" value={editing.highlights.join('\n')} onChange={(e) => set({ highlights: e.target.value.split('\n') })} rows={4} /></Field>
              </div>
              <div className="mgr-toggles">
                <Toggle label="On Sale" checked={editing.onSale} onChange={(v) => set({ onSale: v })} />
                <Toggle label="Show in catalogue" checked={editing.featured} onChange={(v) => set({ featured: v })} />
                <Toggle label={`Hot List (max ${HOT_LIMIT})`} checked={!!editing.hotListed} onChange={(v) => set({ hotListed: v })} />
              </div>
            </div>
            <div className="mgr-modal-foot">
              <button onClick={closeModal} disabled={saving} className="mgr-btn mgr-btn--ghost">Cancel</button>
              <button onClick={save} disabled={saving} className="mgr-btn mgr-btn--primary">{saving ? 'Saving…' : isNew ? 'Add Hotel' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
      <StyleBlock />
    </div>
  );
}

/* ── Small components ── */
function StatCard({ label, value, accent, icon, warn }: { label: string; value: React.ReactNode; accent: string; icon: React.ReactNode; warn?: boolean }) {
  return (
    <div className="mgr-stat">
      <span className="mgr-stat-icon" style={{ color: accent, background: `${accent}14` }}>{icon}</span>
      <div className="mgr-stat-text">
        <span className="mgr-stat-value" style={{ color: warn ? '#C0392B' : 'var(--brand-navy)' }}>{value}</span>
        <span className="mgr-stat-label">{label}</span>
      </div>
    </div>
  );
}
function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`mgr-field ${full ? 'mgr-field--full' : ''}`}>
      <span className="mgr-field-label">{label}</span>
      {children}
    </label>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mgr-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="mgr-toggle-track"><span className="mgr-toggle-thumb" /></span>
      {label}
    </label>
  );
}
function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className="mgr-tag" style={{ color, background: `${color}1A`, borderColor: `${color}33` }}>{children}</span>;
}

/* ── Icons ── */
function HotelGlyph() { return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16M9 8h.01M13 8h.01M9 12h.01M13 12h.01M10 21v-3a2 2 0 0 1 4 0v3" /></svg>; }
function IconReload() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg>; }
function IconPlus() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>; }
function IconLogout() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>; }
function IconSearch() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>; }
function IconEdit() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>; }
function IconTrash() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>; }
function IconList() { return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>; }
function IconFlame() { return <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .3-2 1-3 .2 1 .8 1.6 1.5 1.8C10 7 11 4 12 2Z" /></svg>; }
function IconTag() { return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z" /><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" /></svg>; }
function IconEyeOff() { return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.2A9.7 9.7 0 0 1 12 4c5 0 9 4.5 10 8a13.6 13.6 0 0 1-2.4 3.6M6.1 6.1C3.7 7.6 2 10 1 12c1 3.5 5 8 11 8a9.6 9.6 0 0 0 4-.9M3 3l18 18" /></svg>; }

/* ── Global style block for the console ── */
function StyleBlock() {
  return (
    <style>{`
      .mgr-root { min-height: 100vh; }
      .mgr-btn { display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 16px; border-radius: 9px; font-family: inherit; font-weight: 600; font-size: 13.5px; cursor: pointer; white-space: nowrap; border: 1px solid transparent; transition: background-color .16s ease, border-color .16s ease, box-shadow .16s ease, transform .1s ease; }
      .mgr-btn:active { transform: translateY(1px); }
      .mgr-btn:disabled { opacity: .55; cursor: not-allowed; }
      .mgr-btn--primary { background: var(--brand-navy); color: #fff; box-shadow: 0 6px 16px -8px rgba(22,53,107,.7); }
      .mgr-btn--primary:hover:not(:disabled) { background: var(--brand-navy-deep); box-shadow: 0 10px 22px -10px rgba(22,53,107,.8); }
      .mgr-btn--ghost { background: #fff; color: var(--brand-navy); border-color: var(--line-strong); }
      .mgr-btn--ghost:hover:not(:disabled) { border-color: var(--brand-navy); background: #FAFBFD; }
      .mgr-btn--block { width: 100%; justify-content: center; height: 42px; }
      .mgr-btn svg { flex-shrink: 0; }

      /* App bar */
      .mgr-appbar { position: sticky; top: 0; z-index: 30; background: rgba(255,255,255,.85); backdrop-filter: saturate(1.4) blur(8px); border-bottom: 1px solid var(--line); }
      .mgr-appbar-inner { max-width: 1320px; margin: 0 auto; padding: 13px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
      .mgr-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .mgr-brandmark { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 11px; color: #fff; background: linear-gradient(135deg, #1E4486 0%, #16356B 55%, #0F2A57 100%); box-shadow: 0 8px 18px -8px rgba(22,53,107,.7), inset 0 1px 0 rgba(255,255,255,.18); flex-shrink: 0; }
      .mgr-brandmark--lg { width: 54px; height: 54px; border-radius: 15px; margin: 0 auto 16px; }
      .mgr-brandmark--lg svg { width: 26px; height: 26px; }
      .mgr-brand-text { display: flex; flex-direction: column; line-height: 1.15; min-width: 0; }
      .mgr-brand-title { font-size: 16px; font-weight: 800; color: var(--brand-navy); letter-spacing: -.01em; }
      .mgr-brand-sub { font-size: 11.5px; font-weight: 500; color: var(--ink-faint); letter-spacing: .02em; text-transform: uppercase; }
      .mgr-appbar-actions { display: flex; gap: 9px; }

      .mgr-main { max-width: 1320px; margin: 0 auto; padding: 24px 22px 80px; }

      /* Stats */
      .mgr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
      @media (max-width: 720px) { .mgr-stats { grid-template-columns: repeat(2, 1fr); } }
      .mgr-stat { display: flex; align-items: center; gap: 13px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 15px 17px; box-shadow: 0 1px 2px rgba(16,42,87,.04); }
      .mgr-stat-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0; }
      .mgr-stat-text { display: flex; flex-direction: column; min-width: 0; }
      .mgr-stat-value { font-size: 24px; font-weight: 800; letter-spacing: -.02em; line-height: 1.05; }
      .mgr-stat-label { font-size: 12px; font-weight: 500; color: var(--ink-muted); margin-top: 2px; }

      /* Toolbar */
      .mgr-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
      .mgr-searchbox { position: relative; display: flex; align-items: center; flex: 1; max-width: 420px; }
      .mgr-searchbox > svg { position: absolute; left: 13px; color: var(--ink-faint); pointer-events: none; }
      .mgr-search-input { width: 100%; height: 42px; padding: 0 38px; border: 1px solid var(--line-strong); border-radius: 11px; background: #fff; font-family: inherit; font-size: 14px; color: var(--brand-navy); transition: border-color .16s ease, box-shadow .16s ease; }
      .mgr-search-input::placeholder { color: var(--ink-faint); }
      .mgr-search-input:focus { outline: none; border-color: var(--brand-navy); box-shadow: 0 0 0 3px rgba(22,53,107,.1); }
      .mgr-search-clear { position: absolute; right: 8px; width: 24px; height: 24px; display: grid; place-items: center; border: none; background: var(--section-alt); color: var(--ink-muted); border-radius: 7px; font-size: 17px; line-height: 1; cursor: pointer; }
      .mgr-search-clear:hover { background: #E6EAF1; color: var(--brand-navy); }
      .mgr-toolbar-count { font-size: 13px; font-weight: 600; color: var(--ink-muted); }

      /* Toast */
      .mgr-toast { margin: 0 0 14px; padding: 11px 15px; border-radius: 11px; font-size: 13.5px; font-weight: 600; border: 1px solid transparent; }
      .mgr-toast.is-ok { background: #E8F5EE; color: #0F7A43; border-color: #BCE6CE; }
      .mgr-toast.is-err { background: #FDECEA; color: #C0392B; border-color: #F4C3BD; }

      /* Table */
      .mgr-table-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(16,42,87,.05); }
      .mgr-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      .mgr-th { padding: 13px 16px; text-align: left; font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-muted); font-weight: 700; background: #FAFBFD; border-bottom: 1px solid var(--line); }
      .mgr-th--c { text-align: center; }
      .mgr-th--r { text-align: right; }
      .mgr-row { transition: background-color .12s ease; }
      .mgr-row:not(:last-child) .mgr-td { border-bottom: 1px solid #EEF2F7; }
      .mgr-row:hover { background: #FAFBFD; }
      .mgr-td { padding: 11px 16px; vertical-align: middle; font-size: 13.5px; color: var(--brand-charcoal); overflow: hidden; }
      .mgr-td--muted { color: var(--ink-muted); white-space: nowrap; text-overflow: ellipsis; }
      .mgr-td--c { text-align: center; }
      .mgr-td--r { text-align: right; }
      .mgr-hotelcell { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .mgr-thumb { width: 52px; height: 38px; object-fit: cover; border-radius: 8px; flex-shrink: 0; background: var(--section-alt); box-shadow: inset 0 0 0 1px rgba(16,42,87,.08); }
      .mgr-hotelcell-text { display: flex; flex-direction: column; min-width: 0; }
      .mgr-hotel-name { font-weight: 700; color: var(--brand-navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .mgr-hotel-meta { color: var(--ink-faint); font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
      .mgr-stars { color: #F5A623; font-weight: 700; }
      .mgr-price { font-weight: 700; color: var(--brand-navy); white-space: nowrap; }
      .mgr-pills { display: inline-flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
      .mgr-tag { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; border: 1px solid; white-space: nowrap; }
      .mgr-actions { display: inline-flex; gap: 6px; justify-content: flex-end; }
      .mgr-iconbtn { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line-strong); background: #fff; color: var(--brand-navy); cursor: pointer; transition: background-color .14s ease, border-color .14s ease, color .14s ease; }
      .mgr-iconbtn:hover { background: var(--brand-navy); border-color: var(--brand-navy); color: #fff; }
      .mgr-iconbtn--danger { color: #C0392B; border-color: #F1C7C2; }
      .mgr-iconbtn--danger:hover { background: #C0392B; border-color: #C0392B; color: #fff; }
      .mgr-empty { padding: 48px 20px; text-align: center; color: var(--ink-muted); font-size: 14px; }
      .mgr-spinner { display: inline-block; width: 15px; height: 15px; border: 2px solid var(--line-strong); border-top-color: var(--brand-navy); border-radius: 50%; vertical-align: -2px; margin-right: 7px; animation: mgrspin .7s linear infinite; }
      @keyframes mgrspin { to { transform: rotate(360deg); } }
      .mgr-footnote { margin: 14px 2px 0; font-size: 12px; color: var(--ink-faint); }

      /* Inputs */
      .mgr-input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 9px; font-family: inherit; font-size: 13.5px; color: var(--brand-navy); background: #fff; transition: border-color .16s ease, box-shadow .16s ease; }
      .mgr-input:focus { outline: none; border-color: var(--brand-navy); box-shadow: 0 0 0 3px rgba(22,53,107,.1); }
      .mgr-textarea { height: auto; padding: 9px 12px; line-height: 1.5; resize: vertical; color: var(--ink); }

      /* Modal */
      .mgr-overlay { position: fixed; inset: 0; background: rgba(10,37,64,.5); backdrop-filter: blur(3px); display: grid; place-items: center; padding: 20px; z-index: 100; animation: mgrfade .18s ease; }
      @keyframes mgrfade { from { opacity: 0; } }
      .mgr-modal { width: min(780px, 100%); max-height: 92vh; display: flex; flex-direction: column; background: #fff; border-radius: 18px; box-shadow: 0 40px 90px -30px rgba(0,0,0,.5); overflow: hidden; animation: mgrpop .2s cubic-bezier(.2,.8,.3,1); }
      @keyframes mgrpop { from { opacity: 0; transform: translateY(8px) scale(.99); } }
      .mgr-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 18px 24px; border-bottom: 1px solid var(--line); }
      .mgr-modal-title { font-size: 18px; font-weight: 800; color: var(--brand-navy); margin: 0; letter-spacing: -.01em; }
      .mgr-modal-sub { font-size: 12.5px; color: var(--ink-muted); }
      .mgr-modal-close { background: var(--section-alt); border: none; width: 34px; height: 34px; border-radius: 9px; font-size: 22px; line-height: 1; color: var(--ink-muted); cursor: pointer; flex-shrink: 0; transition: background-color .14s ease, color .14s ease; }
      .mgr-modal-close:hover { background: #E6EAF1; color: var(--brand-navy); }
      .mgr-modal-body { padding: 22px 24px; overflow-y: auto; }
      .mgr-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--line); background: #FAFBFD; }
      .mgr-formgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 18px; }
      .mgr-field { display: flex; flex-direction: column; gap: 5px; }
      .mgr-field--full { grid-column: 1 / -1; }
      .mgr-field-label { font-size: 11px; letter-spacing: .03em; text-transform: uppercase; color: var(--ink-muted); font-weight: 700; }

      /* Toggle switch */
      .mgr-toggles { display: flex; flex-wrap: wrap; gap: 10px 22px; padding: 16px 0 4px; border-top: 1px solid var(--line); }
      .mgr-toggle { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; font-size: 13.5px; font-weight: 600; color: var(--brand-navy); user-select: none; }
      .mgr-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
      .mgr-toggle-track { position: relative; width: 38px; height: 22px; border-radius: 999px; background: #CBD5E1; transition: background-color .18s ease; flex-shrink: 0; }
      .mgr-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: transform .18s ease; }
      .mgr-toggle input:checked + .mgr-toggle-track { background: var(--brand-navy); }
      .mgr-toggle input:checked + .mgr-toggle-track .mgr-toggle-thumb { transform: translateX(16px); }
      .mgr-toggle input:focus-visible + .mgr-toggle-track { box-shadow: 0 0 0 3px rgba(22,53,107,.25); }

      /* Login */
      .mgr-login { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px; }
      .mgr-login-card { width: 360px; max-width: 100%; background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 32px 30px; box-shadow: 0 30px 70px -34px rgba(22,53,107,.5); text-align: center; }
      .mgr-login-title { font-size: 21px; font-weight: 800; color: var(--brand-navy); margin: 0 0 5px; letter-spacing: -.01em; }
      .mgr-login-sub { margin: 0 0 22px; font-size: 13.5px; color: var(--ink-muted); }
      .mgr-login-input { height: 44px; text-align: center; margin-bottom: 14px; font-size: 15px; letter-spacing: .1em; }
      .mgr-login-err { margin: 0 0 14px; color: #C0392B; font-size: 13px; font-weight: 600; }
      .mgr-login-foot { font-size: 12px; color: var(--ink-faint); }

      @media (max-width: 680px) {
        .mgr-btn-label { display: none; }
        .mgr-btn--ghost { padding: 0 12px; }
        .mgr-th, .mgr-td { padding-left: 12px; padding-right: 12px; }
      }
    `}</style>
  );
}
