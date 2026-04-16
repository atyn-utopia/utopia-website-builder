export type LocationRegion = 'klangValley' | 'southern' | 'northern'

export interface Location {
  name: string
  slug: string
  state: string
  stateSlug: string
  region: LocationRegion
  nearby: string[]
}

export const locations: Location[] = [
  { name: 'Kuala Lumpur', slug: 'kuala-lumpur', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['petaling-jaya', 'cheras', 'ampang'] },
  { name: 'Petaling Jaya', slug: 'petaling-jaya', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kuala-lumpur', 'subang-jaya', 'shah-alam'] },
  { name: 'Shah Alam', slug: 'shah-alam', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['petaling-jaya', 'subang-jaya', 'klang'] },
  { name: 'Subang Jaya', slug: 'subang-jaya', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['petaling-jaya', 'puchong', 'shah-alam'] },
  { name: 'Puchong', slug: 'puchong', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['subang-jaya', 'cyberjaya', 'cheras'] },
  { name: 'Cheras', slug: 'cheras', state: 'Selangor / KL', stateSlug: 'selangor', region: 'klangValley', nearby: ['kuala-lumpur', 'ampang', 'kajang'] },
  { name: 'Ampang', slug: 'ampang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kuala-lumpur', 'cheras', 'kajang'] },
  { name: 'Klang', slug: 'klang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['shah-alam', 'subang-jaya', 'petaling-jaya'] },
  { name: 'Kajang', slug: 'kajang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['cheras', 'ampang', 'putrajaya'] },
  { name: 'Cyberjaya', slug: 'cyberjaya', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['putrajaya', 'puchong', 'kajang'] },
  { name: 'Putrajaya', slug: 'putrajaya', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['cyberjaya', 'kajang', 'kuala-lumpur'] },
  { name: 'Seremban', slug: 'seremban', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['kajang', 'putrajaya', 'melaka'] },
  { name: 'Melaka', slug: 'melaka', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['seremban', 'johor-bahru', 'kuala-lumpur'] },
  { name: 'Johor Bahru', slug: 'johor-bahru', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['melaka', 'seremban', 'kuala-lumpur'] },
  { name: 'Ipoh', slug: 'ipoh', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['george-town', 'kuala-lumpur', 'shah-alam'] },
  { name: 'George Town', slug: 'george-town', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['ipoh', 'kuala-lumpur', 'shah-alam'] },
]

export const locationBySlug = (slug: string) =>
  locations.find((l) => l.slug === slug)

// Localised city name map (used by metadata + schema)
export const cityNames: Record<string, { ms: string; en: string; zh: string }> = {
  'kuala-lumpur':   { ms: 'Kuala Lumpur', en: 'Kuala Lumpur', zh: '吉隆坡' },
  'petaling-jaya':  { ms: 'Petaling Jaya', en: 'Petaling Jaya', zh: '八打灵再也' },
  'shah-alam':      { ms: 'Shah Alam', en: 'Shah Alam', zh: '莎阿南' },
  'subang-jaya':    { ms: 'Subang Jaya', en: 'Subang Jaya', zh: '梳邦再也' },
  'puchong':        { ms: 'Puchong', en: 'Puchong', zh: '蒲种' },
  'cheras':         { ms: 'Cheras', en: 'Cheras', zh: '蕉赖' },
  'ampang':         { ms: 'Ampang', en: 'Ampang', zh: '安邦' },
  'klang':          { ms: 'Klang', en: 'Klang', zh: '巴生' },
  'kajang':         { ms: 'Kajang', en: 'Kajang', zh: '加影' },
  'cyberjaya':      { ms: 'Cyberjaya', en: 'Cyberjaya', zh: '赛城' },
  'putrajaya':      { ms: 'Putrajaya', en: 'Putrajaya', zh: '布城' },
  'seremban':       { ms: 'Seremban', en: 'Seremban', zh: '芙蓉' },
  'melaka':         { ms: 'Melaka', en: 'Malacca', zh: '马六甲' },
  'johor-bahru':    { ms: 'Johor Bahru', en: 'Johor Bahru', zh: '新山' },
  'ipoh':           { ms: 'Ipoh', en: 'Ipoh', zh: '怡保' },
  'george-town':    { ms: 'George Town', en: 'George Town', zh: '乔治市' },
}

export const cityDisplay = (slug: string, locale: string) => {
  const m = cityNames[slug]
  if (!m) return slug
  return m[locale as 'ms' | 'en' | 'zh'] ?? m.ms
}
