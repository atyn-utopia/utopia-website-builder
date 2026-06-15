'use client';

import { useEffect, useState, useCallback } from 'react';

interface Hotel {
  id: string;
  name: string;
  city: string; citySlug: string;
  state: string; stateSlug: string;
  stars: number;
  sellingPrice: number; marketValue: number;
  rooms: number;
  tenure: 'Freehold' | 'Leasehold';
  propertyType: string;
  grossYield: number;
  landSizeSqft: number; builtUpSqft: number;
  cover: string;
  gallery: string[];
  shortDesc: string;
  description: string;
  highlights: string[];
  facilities: string[];
  onSale: boolean;
  featured: boolean;
  hotListed?: boolean;
}

const rm = (n: number) => `RM ${Number(n || 0).toLocaleString('en-MY')}`;

const BLANK: Hotel = {
  id: '', name: '', city: '', citySlug: '', state: '', stateSlug: '',
  stars: 3, sellingPrice: 0, marketValue: 0, rooms: 0, tenure: 'Freehold',
  propertyType: 'Hotel', grossYield: 0, landSizeSqft: 0, builtUpSqft: 0,
  cover: '', gallery: [], shortDesc: '', description: '', highlights: [], facilities: [],
  onSale: true, featured: true, hotListed: false,
};

export default function ManagePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/properties', { cache: 'no-store' });
    const data = await res.json();
    setHotels(data.hotels ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startNew = () => { setEditing({ ...BLANK }); setIsNew(true); setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startEdit = (h: Hotel) => { setEditing({ ...h }); setIsNew(false); setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancel = () => setEditing(null);

  const set = (patch: Partial<Hotel>) => setEditing((e) => (e ? { ...e, ...patch } : e));

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { setMsg('Name is required.'); return; }
    setSaving(true); setMsg('');
    const res = await fetch('/api/properties', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) { setMsg(`${isNew ? 'Added' : 'Updated'} "${data.hotel.name}". Live on the site now.`); setEditing(null); load(); }
    else setMsg(`Error: ${data.error ?? 'save failed'}`);
  };

  const remove = async (h: Hotel) => {
    if (!confirm(`Delete "${h.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/properties?id=${encodeURIComponent(h.id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.ok) { setMsg(`Deleted "${h.name}".`); load(); } else setMsg(`Error: ${data.error}`);
  };

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px 80px' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--brand-navy)', margin: 0 }}>Manage Hotel Listings</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--ink-muted)', fontSize: 14 }}>Add, edit or delete hotels. Changes go live on the site immediately.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} disabled={loading || saving} style={btnGhost}>Reload</button>
          <button onClick={startNew} style={btnPrimary}>+ Add Hotel</button>
        </div>
      </header>

      {msg && <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: 10, background: msg.startsWith('Error') ? '#FDECEA' : '#E8F5EE', color: msg.startsWith('Error') ? '#C0392B' : '#0F7A43', fontSize: 14, fontWeight: 600 }}>{msg}</div>}

      {editing && (
        <section style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 14, padding: 24, marginTop: 16, boxShadow: '0 18px 44px -26px rgba(22,53,107,0.3)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-navy)', margin: '0 0 16px' }}>{isNew ? 'Add New Hotel' : `Edit ${editing.id}`}</h2>
          <div style={grid}>
            <Field label="Hotel Name *" full><input style={inp} value={editing.name} onChange={(e) => set({ name: e.target.value })} /></Field>
            <Field label="Short description (card line)" full><input style={inp} value={editing.shortDesc} onChange={(e) => set({ shortDesc: e.target.value })} /></Field>
            <Field label="City"><input style={inp} value={editing.city} onChange={(e) => set({ city: e.target.value })} /></Field>
            <Field label="City slug"><input style={inp} value={editing.citySlug} onChange={(e) => set({ citySlug: e.target.value })} placeholder="auto from city" /></Field>
            <Field label="State"><input style={inp} value={editing.state} onChange={(e) => set({ state: e.target.value })} /></Field>
            <Field label="State slug"><input style={inp} value={editing.stateSlug} onChange={(e) => set({ stateSlug: e.target.value })} placeholder="auto from state" /></Field>
            <Field label="Star rating"><select style={inp} value={editing.stars} onChange={(e) => set({ stars: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} Star</option>)}</select></Field>
            <Field label="Tenure"><select style={inp} value={editing.tenure} onChange={(e) => set({ tenure: e.target.value as Hotel['tenure'] })}><option>Freehold</option><option>Leasehold</option></select></Field>
            <Field label="Property type"><input style={inp} value={editing.propertyType} onChange={(e) => set({ propertyType: e.target.value })} placeholder="Hotel / Resort" /></Field>
            <Field label="Rooms"><input type="number" style={inp} value={editing.rooms} onChange={(e) => set({ rooms: Number(e.target.value) })} /></Field>
            <Field label="Selling price (RM)"><input type="number" style={inp} value={editing.sellingPrice} onChange={(e) => set({ sellingPrice: Number(e.target.value) })} /></Field>
            <Field label="Market value (RM)"><input type="number" style={inp} value={editing.marketValue} onChange={(e) => set({ marketValue: Number(e.target.value) })} /></Field>
            <Field label="Gross yield (%)"><input type="number" style={inp} value={editing.grossYield} onChange={(e) => set({ grossYield: Number(e.target.value) })} /></Field>
            <Field label="Land size (sq ft)"><input type="number" style={inp} value={editing.landSizeSqft} onChange={(e) => set({ landSizeSqft: Number(e.target.value) })} /></Field>
            <Field label="Built-up (sq ft)"><input type="number" style={inp} value={editing.builtUpSqft} onChange={(e) => set({ builtUpSqft: Number(e.target.value) })} /></Field>
            <Field label="Cover image URL" full><input style={inp} value={editing.cover} onChange={(e) => set({ cover: e.target.value })} placeholder="https://…" /></Field>
            <Field label="Gallery image URLs (one per line)" full><textarea style={ta} value={editing.gallery.join('\n')} onChange={(e) => set({ gallery: e.target.value.split('\n') })} rows={3} /></Field>
            <Field label="Description (detail page intro)" full><textarea style={ta} value={editing.description} onChange={(e) => set({ description: e.target.value })} rows={4} /></Field>
            <Field label="Investment highlights (one per line)" full><textarea style={ta} value={editing.highlights.join('\n')} onChange={(e) => set({ highlights: e.target.value.split('\n') })} rows={5} /></Field>
            <Field label="Facilities (one per line)" full><textarea style={ta} value={editing.facilities.join('\n')} onChange={(e) => set({ facilities: e.target.value.split('\n') })} rows={3} /></Field>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, margin: '8px 0 18px' }}>
            <Toggle label="On Sale" checked={editing.onSale} onChange={(v) => set({ onSale: v })} />
            <Toggle label="Show in catalogue" checked={editing.featured} onChange={(v) => set({ featured: v })} />
            <Toggle label="Hot List (featured 5)" checked={!!editing.hotListed} onChange={(v) => set({ hotListed: v })} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : isNew ? 'Add Hotel' : 'Save Changes'}</button>
            <button onClick={cancel} disabled={saving} style={btnGhost}>Cancel</button>
          </div>
        </section>
      )}

      <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 14, overflow: 'hidden', marginTop: 16 }}>
        {loading ? <p style={{ padding: 40, textAlign: 'center', color: 'var(--ink-muted)' }}>Loading…</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--section-alt)', textAlign: 'left' }}>
                <th style={th}>Hotel</th><th style={th}>Location</th><th style={{ ...th, textAlign: 'right' }}>Selling Price</th><th style={{ ...th, textAlign: 'center' }}>Flags</th><th style={{ ...th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h) => (
                <tr key={h.id} style={{ borderTop: '1px solid #EEF2F7' }}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={h.cover} alt="" width={48} height={36} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <div><div style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{h.name}</div><div style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{h.id} · {h.stars}★ · {h.rooms} rooms</div></div>
                    </div>
                  </td>
                  <td style={{ ...td, color: 'var(--ink-muted)' }}>{h.city}, {h.state}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: 'var(--brand-navy)' }}>{rm(h.sellingPrice)}</td>
                  <td style={{ ...td, textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {h.onSale && <Tag color="#1FA463">On Sale</Tag>}
                      {h.hotListed && <Tag color="#EF4123">Hot List</Tag>}
                      {!h.featured && <Tag color="#94A3B8">Hidden</Tag>}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => startEdit(h)} style={btnSmall}>Edit</button>
                    <button onClick={() => remove(h)} style={btnDanger}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--ink-faint)', lineHeight: 1.6 }}>
        Edits persist to <code>config/hotels.json</code> (seeded from the placeholder dataset). When your real hotel dataset is loaded into
        the database, this panel will read and write those records directly.
      </p>
    </main>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: full ? '1 / -1' : 'auto' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>{label}</span>
      {children}
    </label>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--brand-navy)' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18 }} />{label}
    </label>
  );
}
function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', background: color, padding: '3px 8px', borderRadius: 999 }}>{children}</span>;
}

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 };
const th: React.CSSProperties = { padding: '12px 14px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 };
const td: React.CSSProperties = { padding: '12px 14px', verticalAlign: 'middle' };
const inp: React.CSSProperties = { height: 40, padding: '0 12px', border: '1.5px solid var(--line-strong)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--brand-navy)', background: '#fff', width: '100%' };
const ta: React.CSSProperties = { padding: '10px 12px', border: '1.5px solid var(--line-strong)', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', color: 'var(--ink)', background: '#fff', width: '100%', resize: 'vertical', lineHeight: 1.5 };
const btnPrimary: React.CSSProperties = { height: 40, padding: '0 20px', background: 'var(--brand-navy)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' };
const btnGhost: React.CSSProperties = { height: 40, padding: '0 18px', background: '#fff', color: 'var(--brand-navy)', border: '1.5px solid var(--line-strong)', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' };
const btnSmall: React.CSSProperties = { height: 32, padding: '0 14px', background: '#fff', color: 'var(--brand-navy)', border: '1.5px solid var(--line-strong)', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginRight: 6 };
const btnDanger: React.CSSProperties = { height: 32, padding: '0 14px', background: '#fff', color: '#C0392B', border: '1.5px solid #F1C7C2', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' };
