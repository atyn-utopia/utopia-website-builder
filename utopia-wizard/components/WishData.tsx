'use client'

import { useEffect, useState } from 'react'

interface PhoneRow {
  phone_number: string
  label: string | null
  location_slug: string | null
  whatsapp_text: string | null
  percentage: number | null
  type: string | null
  is_active: boolean
}

interface ProductRow {
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number | null
  is_active: boolean
  product_photos: { url: string }[]
}

interface BlogRow {
  slug: string
  status: string
  cover_image_url: string | null
  blog_translations: { language: string; title: string | null }[]
}

interface RegisteredDomain {
  domain: string
  leads_mode: string | null
  company_id: string | null
}

interface HardcodedHit {
  file: string
  line: number
  match: string
  excerpt: string
}

interface BlogHardcodedHit {
  post_slug: string
  language: string
  field: string
  match: string
  excerpt: string
}

interface LiveStatus {
  status: 'connected' | 'fallback' | 'unexpected' | 'no-target' | 'no-response'
  targetUrl: string | null
  livePhone: string | null
  dbPhones: string[]
  fallbackPhone: string | null
  detail: string
}

interface WishDataPayload {
  slug: string
  domain: string | null
  fallbackPhone: string | null
  domainCandidates: string[]
  registered: RegisteredDomain[] | null
  phones: PhoneRow[] | null
  products: ProductRow[] | null
  blogs: BlogRow[] | null
  hardcoded: HardcodedHit[]
  blogHardcoded: BlogHardcodedHit[]
  liveStatus: LiveStatus
}

export default function WishData({ slug }: { slug: string }) {
  const [data, setData] = useState<WishDataPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(`/api/wish-data/${slug}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: WishDataPayload = await res.json()
        if (mounted) { setData(json); setError(null) }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 60_000)
    return () => { mounted = false; clearInterval(t) }
  }, [slug])

  if (loading && !data) {
    return <Stub>✦ Loading registered data…</Stub>
  }
  if (error || !data) {
    return <ErrorBox>Could not load: {error ?? 'unknown error'}</ErrorBox>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <LiveStatusBanner s={data.liveStatus} />
      <RegisteredSection data={data} />
      <PhonesSection rows={data.phones} />
      <ProductsSection rows={data.products} />
      <BlogsSection rows={data.blogs} />
      <HardcodedSection hits={data.hardcoded} />
      <BlogHardcodedSection hits={data.blogHardcoded} />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Live DB connectivity banner — is the deployed site reading from Supabase?
// ────────────────────────────────────────────────────────────────────────────

function LiveStatusBanner({ s }: { s: LiveStatus }) {
  const palette = {
    connected:    { bg: 'var(--status-pass-bg)', border: 'var(--status-pass-border)', fg: 'var(--status-pass)', label: 'Live · DB connected', glow: true },
    fallback:     { bg: 'var(--status-warn-bg)', border: 'var(--status-warn-border)', fg: 'var(--status-warn)', label: 'Live · using fallback', glow: false },
    unexpected:   { bg: 'var(--status-fail-bg)', border: 'var(--status-fail-border)', fg: 'var(--status-fail)', label: 'Live · phone mismatch', glow: false },
    'no-response':{ bg: 'var(--status-fail-bg)', border: 'var(--status-fail-border)', fg: 'var(--status-fail)', label: 'Live · no response', glow: false },
    'no-target':  { bg: 'var(--status-skip-bg)', border: 'var(--status-skip-border)', fg: 'var(--status-skip)', label: 'Live · not deployed', glow: false },
  }[s.status]

  return (
    <section className="uf-card" style={{
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      background: palette.bg,
      boxShadow: `0 0 0 1px ${palette.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: palette.fg,
            boxShadow: palette.glow ? `0 0 12px ${palette.fg}` : 'none',
          }} />
          <span className="uf-eyebrow" style={{ color: palette.fg, fontSize: 11 }}>
            {palette.label}
          </span>
        </div>
        {s.targetUrl && (
          <a
            href={s.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            probed: {s.targetUrl.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 14,
      }}>
        <Stat label="Live phone" value={s.livePhone ?? '—'} accent={palette.fg} />
        <Stat label="DB phone(s)" value={s.dbPhones.length === 0 ? '—' : s.dbPhones.join(', ')} />
        <Stat label="Fallback (config/site.ts)" value={s.fallbackPhone ?? '—'} />
      </div>

      <p style={{
        color: 'var(--text-primary)',
        fontSize: 12.5,
        lineHeight: 1.6,
        fontFamily: 'var(--font-sans)',
        margin: 0,
      }}>
        {s.detail}
      </p>

      {s.status === 'fallback' && (
        <p style={{
          color: palette.fg,
          fontSize: 11.5,
          lineHeight: 1.55,
          fontFamily: 'var(--font-sans)',
          margin: 0,
          paddingTop: 6,
          borderTop: `1px solid ${palette.border}`,
        }}>
          Fix: confirm <code style={{ background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_URL</code> + <code style={{ background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set on this Vercel project, then redeploy. If env was already set, fire the webcore revalidate webhook to flush stale cache.
        </p>
      )}
    </section>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 10, letterSpacing: '0.6px', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </span>
      <code style={{
        color: accent ?? 'var(--text-primary)',
        fontSize: 13,
        fontFamily: 'monospace',
        wordBreak: 'break-word',
        fontWeight: accent ? 700 : 400,
      }}>
        {value}
      </code>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Registered domains (catches sites that have moved to a new domain)
// ────────────────────────────────────────────────────────────────────────────

function RegisteredSection({ data }: { data: WishDataPayload }) {
  const reg = data.registered ?? []
  const expected = data.domain
  const newDomains = reg.filter((r) => r.domain !== expected)

  return (
    <Card title="Registered Domains" subtitle="company_websites rows matched to this project" count={reg.length}>
      {reg.length === 0 ? (
        <Empty>No row in company_websites for any candidate domain. The site may not be registered yet, or it lives under a custom domain that we couldn't auto-discover.</Empty>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Domain</Th>
              <Th>Leads mode</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {reg.map((r) => {
              const moved = expected && r.domain !== expected
              return (
                <tr key={r.domain} style={rowStyle}>
                  <Td>
                    <code style={{ color: 'var(--text-primary)', fontSize: 12 }}>{r.domain}</code>
                  </Td>
                  <Td>
                    <Pill>{r.leads_mode ?? '—'}</Pill>
                  </Td>
                  <Td>
                    {moved
                      ? <Pill tone="warn">moved from {expected}</Pill>
                      : <Pill tone="good">matches config/site.ts</Pill>}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {newDomains.length > 0 && (
        <p style={{ color: '#F9A96A', fontSize: 12, marginTop: 8, fontFamily: 'var(--font-sans)' }}>
          Heads up — this project is registered under {newDomains.length === 1 ? 'a domain' : `${newDomains.length} domains`} that don't match config/site.ts (
          {newDomains.map((d) => d.domain).join(', ')}
          ). Update config/site.ts.domain if it has officially moved.
        </p>
      )}
      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 6, opacity: 0.6 }}>
        Looked up by: {data.domainCandidates.join(' · ')}
      </p>
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Phone numbers (with WhatsApp text)
// ────────────────────────────────────────────────────────────────────────────

function PhonesSection({ rows }: { rows: PhoneRow[] | null }) {
  if (rows == null) return <Card title="Phone Numbers" count={0}><Empty>Supabase query failed.</Empty></Card>
  return (
    <Card title="Phone Numbers" subtitle="phone_numbers rows for this site" count={rows.length}>
      {rows.length === 0 ? (
        <Empty>No phone numbers seeded for this site yet.</Empty>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Number</Th>
              <Th>Label</Th>
              <Th>Location</Th>
              <Th>%</Th>
              <Th>Active</Th>
              <Th>WhatsApp text</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={rowStyle}>
                <Td>
                  <code style={{ color: 'var(--text-primary)', fontSize: 12 }}>{r.phone_number}</code>
                  {r.type && <span style={{ color: 'var(--text-muted)', fontSize: 10, marginLeft: 6 }}>({r.type})</span>}
                </Td>
                <Td><span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{r.label ?? '—'}</span></Td>
                <Td><code style={{ color: 'var(--text-muted)', fontSize: 11 }}>{r.location_slug ?? '—'}</code></Td>
                <Td><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.percentage ?? '—'}</span></Td>
                <Td>{r.is_active ? <Pill tone="good">on</Pill> : <Pill tone="warn">off</Pill>}</Td>
                <Td>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontSize: 11,
                    lineHeight: 1.4,
                    maxWidth: 360,
                    fontFamily: 'var(--font-sans)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {r.whatsapp_text ?? <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>—</span>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Products
// ────────────────────────────────────────────────────────────────────────────

function ProductsSection({ rows }: { rows: ProductRow[] | null }) {
  if (rows == null) return <Card title="Products" count={0}><Empty>Supabase query failed.</Empty></Card>
  const active = rows.filter((r) => r.is_active).length
  return (
    <Card
      title="Products"
      subtitle={`${active} active · ${rows.length} total`}
      count={rows.length}
    >
      {rows.length === 0 ? (
        <Empty>No products in Supabase for this site yet.</Empty>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Photo</Th>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Sale</Th>
              <Th>Rental</Th>
              <Th>Order</Th>
              <Th>Active</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const photo = r.product_photos?.[0]?.url
              return (
                <tr key={r.slug} style={rowStyle}>
                  <Td>
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={r.name} style={{
                        width: 40, height: 40, objectFit: 'cover', borderRadius: 6,
                        border: '1px solid var(--input-border)',
                      }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 6, background: 'rgba(96, 112, 128, 0.15)' }} />
                    )}
                  </Td>
                  <Td><span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{r.name}</span></Td>
                  <Td><code style={{ color: 'var(--text-primary)', fontSize: 11 }}>{r.slug}</code></Td>
                  <Td><Price v={r.sale_price} /></Td>
                  <Td><Price v={r.rental_price} /></Td>
                  <Td><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.sort_order ?? '—'}</span></Td>
                  <Td>{r.is_active ? <Pill tone="good">on</Pill> : <Pill tone="warn">off</Pill>}</Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </Card>
  )
}

function Price({ v }: { v: number | null }) {
  if (v == null) return <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>—</span>
  return <span style={{ color: 'var(--text-primary)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>RM {v.toLocaleString('en-MY')}</span>
}

// ────────────────────────────────────────────────────────────────────────────
// Blog articles
// ────────────────────────────────────────────────────────────────────────────

function BlogsSection({ rows }: { rows: BlogRow[] | null }) {
  if (rows == null) return <Card title="Blog Articles" count={0}><Empty>Supabase query failed.</Empty></Card>
  const published = rows.filter((r) => r.status === 'published').length
  return (
    <Card
      title="Blog Articles"
      subtitle={`${published} published · ${rows.length} total`}
      count={rows.length}
    >
      {rows.length === 0 ? (
        <Empty>No blog posts in Supabase for this site yet.</Empty>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Cover</Th>
              <Th>Title (en)</Th>
              <Th>Slug</Th>
              <Th>Locales</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const en = r.blog_translations?.find((t) => t.language === 'en')
              const title = en?.title ?? r.blog_translations?.[0]?.title ?? r.slug
              const locales = (r.blog_translations ?? []).map((t) => t.language).sort().join(' · ')
              return (
                <tr key={r.slug} style={rowStyle}>
                  <Td>
                    {r.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.cover_image_url} alt={title} style={{
                        width: 56, height: 36, objectFit: 'cover', borderRadius: 4,
                        border: '1px solid var(--input-border)',
                      }} />
                    ) : (
                      <div style={{ width: 56, height: 36, borderRadius: 4, background: 'rgba(96, 112, 128, 0.15)' }} />
                    )}
                  </Td>
                  <Td>
                    <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 500, lineHeight: 1.4, maxWidth: 320, display: 'inline-block' }}>{title}</span>
                  </Td>
                  <Td><code style={{ color: 'var(--text-primary)', fontSize: 11 }}>{r.slug}</code></Td>
                  <Td><span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace' }}>{locales || '—'}</span></Td>
                  <Td>
                    {r.status === 'published'
                      ? <Pill tone="good">published</Pill>
                      : <Pill tone="warn">{r.status}</Pill>}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Hardcoded phones (source scan)
// ────────────────────────────────────────────────────────────────────────────

function HardcodedSection({ hits }: { hits: HardcodedHit[] }) {
  return (
    <Card
      title="Hardcoded Phone Numbers"
      subtitle="grep across app/ and components/"
      count={hits.length}
      tone={hits.length === 0 ? 'good' : 'warn'}
    >
      {hits.length === 0 ? (
        <Empty tone="good">Clean — no phone numbers found in any user-facing source file.</Empty>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Location</Th>
              <Th>Number</Th>
              <Th>Line</Th>
            </tr>
          </thead>
          <tbody>
            {hits.map((h, i) => (
              <tr key={i} style={rowStyle}>
                <Td>
                  <code style={{ color: 'var(--text-primary)', fontSize: 11 }}>{h.file}:{h.line}</code>
                </Td>
                <Td>
                  <code style={{ color: '#f87171', fontSize: 12, fontWeight: 600 }}>{h.match}</code>
                </Td>
                <Td>
                  <code style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace', display: 'block', maxWidth: 460, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {h.excerpt}
                  </code>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Hardcoded phones in blog content (Supabase blog_translations)
// ────────────────────────────────────────────────────────────────────────────

function BlogHardcodedSection({ hits }: { hits: BlogHardcodedHit[] }) {
  return (
    <Card
      title="Hardcoded Phones in Blog Articles"
      subtitle="scan across blog_translations title / content / excerpt / meta"
      count={hits.length}
      tone={hits.length === 0 ? 'good' : 'warn'}
    >
      {hits.length === 0 ? (
        <Empty tone="good">Clean — no phone numbers found inside any blog post.</Empty>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Post · lang</Th>
              <Th>Field</Th>
              <Th>Number</Th>
              <Th>Context</Th>
            </tr>
          </thead>
          <tbody>
            {hits.map((h, i) => (
              <tr key={i} style={rowStyle}>
                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <code style={{ color: 'var(--text-primary)', fontSize: 11 }}>{h.post_slug}</code>
                    <Pill>{h.language}</Pill>
                  </div>
                </Td>
                <Td>
                  <code style={{ color: 'var(--text-muted)', fontSize: 11 }}>{h.field}</code>
                </Td>
                <Td>
                  <code style={{ color: '#f87171', fontSize: 12, fontWeight: 600 }}>{h.match}</code>
                </Td>
                <Td>
                  <code style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace', display: 'block', maxWidth: 460, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {h.excerpt}
                  </code>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Reusable bits
// ────────────────────────────────────────────────────────────────────────────

function Card({ title, subtitle, count, tone, children }: {
  title: string
  subtitle?: string
  count: number
  tone?: 'good' | 'warn'
  children: React.ReactNode
}) {
  const accent = tone === 'good' ? 'var(--status-pass)'
    : tone === 'warn' ? 'var(--status-warn)'
    : 'var(--text-secondary)'
  return (
    <section className="uf-card" style={{ padding: '16px 18px' }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span className="uf-eyebrow" style={{ color: accent }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ color: 'var(--text-muted)', fontSize: 11.5, fontFamily: 'var(--font-sans)' }}>
              {subtitle}
            </span>
          )}
        </div>
        <span style={{
          color: 'var(--text-secondary)',
          fontSize: 12,
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          padding: '2px 10px',
          background: 'rgba(79, 195, 247, 0.08)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-pill)',
        }}>
          {count}
        </span>
      </header>
      <div style={{ overflowX: 'auto' }}>
        {children}
      </div>
    </section>
  )
}

function Empty({ children, tone }: { children: React.ReactNode; tone?: 'good' }) {
  return (
    <p style={{
      color: tone === 'good' ? 'var(--status-pass)' : 'var(--text-muted)',
      fontSize: 12.5,
      fontFamily: 'var(--font-sans)',
      margin: '4px 0 0',
      lineHeight: 1.5,
    }}>
      {children}
    </p>
  )
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: 'good' | 'warn' }) {
  const fg = tone === 'good' ? 'var(--status-pass)' : tone === 'warn' ? 'var(--status-warn)' : 'var(--text-muted)'
  const bg = tone === 'good' ? 'var(--status-pass-bg)' : tone === 'warn' ? 'var(--status-warn-bg)' : 'rgba(96, 112, 128, 0.12)'
  return (
    <span style={{
      color: fg,
      background: bg,
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.3px',
      fontFamily: 'var(--font-sans)',
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {children}
    </span>
  )
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
}

const rowStyle: React.CSSProperties = {
  borderTop: '1px solid var(--input-border)',
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      textAlign: 'left',
      padding: '10px 12px',
      color: 'var(--text-secondary)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      borderBottom: '1px solid var(--border-soft)',
    }}>
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{
      padding: '10px 12px',
      verticalAlign: 'top',
    }}>
      {children}
    </td>
  )
}

function Stub({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
      {children}
    </div>
  )
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="uf-card" style={{
      padding: '12px 16px',
      background: 'var(--status-fail-bg)',
      color: 'var(--status-fail)',
      fontSize: 13,
      boxShadow: `0 8px 28px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px var(--status-fail-border)`,
    }}>
      {children}
    </div>
  )
}
