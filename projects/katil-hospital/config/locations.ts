export interface Location {
  slug: string
  displayName: string
  region: string
  names: { en: string; ms: string; zh: string }
}

export const locations: Location[] = [
  // Klang Valley
  { slug: 'kuala-lumpur', displayName: 'Kuala Lumpur', region: 'Klang Valley', names: { en: 'Kuala Lumpur', ms: 'Kuala Lumpur', zh: '吉隆坡' } },
  { slug: 'petaling-jaya', displayName: 'Petaling Jaya', region: 'Klang Valley', names: { en: 'Petaling Jaya', ms: 'Petaling Jaya', zh: '八打灵再也' } },
  { slug: 'shah-alam', displayName: 'Shah Alam', region: 'Klang Valley', names: { en: 'Shah Alam', ms: 'Shah Alam', zh: '莎阿南' } },
  { slug: 'subang-jaya', displayName: 'Subang Jaya', region: 'Klang Valley', names: { en: 'Subang Jaya', ms: 'Subang Jaya', zh: '梳邦再也' } },
  { slug: 'cheras', displayName: 'Cheras', region: 'Klang Valley', names: { en: 'Cheras', ms: 'Cheras', zh: '切拉斯' } },
  { slug: 'ampang', displayName: 'Ampang', region: 'Klang Valley', names: { en: 'Ampang', ms: 'Ampang', zh: '安邦' } },
  { slug: 'puchong', displayName: 'Puchong', region: 'Klang Valley', names: { en: 'Puchong', ms: 'Puchong', zh: '蒲种' } },
  { slug: 'bangsar', displayName: 'Bangsar', region: 'Klang Valley', names: { en: 'Bangsar', ms: 'Bangsar', zh: '孟沙' } },
  { slug: 'damansara', displayName: 'Damansara', region: 'Klang Valley', names: { en: 'Damansara', ms: 'Damansara', zh: '白沙罗' } },
  { slug: 'cyberjaya', displayName: 'Cyberjaya', region: 'Klang Valley', names: { en: 'Cyberjaya', ms: 'Cyberjaya', zh: '赛博再也' } },
  { slug: 'putrajaya', displayName: 'Putrajaya', region: 'Klang Valley', names: { en: 'Putrajaya', ms: 'Putrajaya', zh: '布城' } },
  { slug: 'kajang', displayName: 'Kajang', region: 'Klang Valley', names: { en: 'Kajang', ms: 'Kajang', zh: '加影' } },
  { slug: 'bangi', displayName: 'Bangi', region: 'Klang Valley', names: { en: 'Bangi', ms: 'Bangi', zh: '万宜' } },
  { slug: 'rawang', displayName: 'Rawang', region: 'Klang Valley', names: { en: 'Rawang', ms: 'Rawang', zh: '双文丹' } },
  { slug: 'klang', displayName: 'Klang', region: 'Klang Valley', names: { en: 'Klang', ms: 'Klang', zh: '巴生' } },
  { slug: 'setia-alam', displayName: 'Setia Alam', region: 'Klang Valley', names: { en: 'Setia Alam', ms: 'Setia Alam', zh: '实达阿兰' } },
  { slug: 'kepong', displayName: 'Kepong', region: 'Klang Valley', names: { en: 'Kepong', ms: 'Kepong', zh: '甲洞' } },
  // Northern
  { slug: 'penang', displayName: 'Penang', region: 'Northern', names: { en: 'Penang', ms: 'Pulau Pinang', zh: '槟城' } },
  { slug: 'ipoh', displayName: 'Ipoh', region: 'Northern', names: { en: 'Ipoh', ms: 'Ipoh', zh: '怡保' } },
  { slug: 'alor-setar', displayName: 'Alor Setar', region: 'Northern', names: { en: 'Alor Setar', ms: 'Alor Setar', zh: '亚罗士打' } },
  { slug: 'sungai-petani', displayName: 'Sungai Petani', region: 'Northern', names: { en: 'Sungai Petani', ms: 'Sungai Petani', zh: '双溪大年' } },
  { slug: 'taiping', displayName: 'Taiping', region: 'Northern', names: { en: 'Taiping', ms: 'Taiping', zh: '太平' } },
  // Southern
  { slug: 'johor-bahru', displayName: 'Johor Bahru', region: 'Southern', names: { en: 'Johor Bahru', ms: 'Johor Bahru', zh: '新山' } },
  { slug: 'melaka', displayName: 'Melaka', region: 'Southern', names: { en: 'Melaka', ms: 'Melaka', zh: '马六甲' } },
  { slug: 'batu-pahat', displayName: 'Batu Pahat', region: 'Southern', names: { en: 'Batu Pahat', ms: 'Batu Pahat', zh: '峇株巴辖' } },
  { slug: 'muar', displayName: 'Muar', region: 'Southern', names: { en: 'Muar', ms: 'Muar', zh: '麻坡' } },
  { slug: 'kluang', displayName: 'Kluang', region: 'Southern', names: { en: 'Kluang', ms: 'Kluang', zh: '居銮' } },
  { slug: 'skudai', displayName: 'Skudai', region: 'Southern', names: { en: 'Skudai', ms: 'Skudai', zh: '士古来' } },
  { slug: 'iskandar-puteri', displayName: 'Iskandar Puteri', region: 'Southern', names: { en: 'Iskandar Puteri', ms: 'Iskandar Puteri', zh: '依斯干达公主城' } },
  // East Coast
  { slug: 'kuantan', displayName: 'Kuantan', region: 'East Coast', names: { en: 'Kuantan', ms: 'Kuantan', zh: '关丹' } },
  { slug: 'kota-bharu', displayName: 'Kota Bharu', region: 'East Coast', names: { en: 'Kota Bharu', ms: 'Kota Bharu', zh: '哥打峇鲁' } },
  { slug: 'kuala-terengganu', displayName: 'Kuala Terengganu', region: 'East Coast', names: { en: 'Kuala Terengganu', ms: 'Kuala Terengganu', zh: '瓜拉丁加奴' } },
  { slug: 'temerloh', displayName: 'Temerloh', region: 'East Coast', names: { en: 'Temerloh', ms: 'Temerloh', zh: '淡马鲁' } },
  // East Malaysia
  { slug: 'kota-kinabalu', displayName: 'Kota Kinabalu', region: 'East Malaysia', names: { en: 'Kota Kinabalu', ms: 'Kota Kinabalu', zh: '亚庇' } },
  { slug: 'kuching', displayName: 'Kuching', region: 'East Malaysia', names: { en: 'Kuching', ms: 'Kuching', zh: '古晋' } },
  { slug: 'miri', displayName: 'Miri', region: 'East Malaysia', names: { en: 'Miri', ms: 'Miri', zh: '美里' } },
  { slug: 'sandakan', displayName: 'Sandakan', region: 'East Malaysia', names: { en: 'Sandakan', ms: 'Sandakan', zh: '山打根' } },
  { slug: 'sibu', displayName: 'Sibu', region: 'East Malaysia', names: { en: 'Sibu', ms: 'Sibu', zh: '诗巫' } },
]

export const nearbyLocations: Record<string, string[]> = {
  'kuala-lumpur': ['bangsar', 'cheras', 'ampang', 'kepong', 'damansara'],
  'petaling-jaya': ['shah-alam', 'subang-jaya', 'damansara', 'puchong', 'setia-alam'],
  'shah-alam': ['petaling-jaya', 'klang', 'subang-jaya', 'setia-alam'],
  'subang-jaya': ['petaling-jaya', 'puchong', 'shah-alam', 'cyberjaya'],
  'cheras': ['kuala-lumpur', 'kajang', 'bangi', 'ampang'],
  'ampang': ['kuala-lumpur', 'cheras', 'bangsar'],
  'puchong': ['petaling-jaya', 'subang-jaya', 'cyberjaya', 'putrajaya'],
  'bangsar': ['kuala-lumpur', 'petaling-jaya', 'damansara'],
  'damansara': ['petaling-jaya', 'bangsar', 'kepong', 'kuala-lumpur'],
  'cyberjaya': ['putrajaya', 'puchong', 'subang-jaya', 'kajang'],
  'putrajaya': ['cyberjaya', 'kajang', 'bangi'],
  'kajang': ['bangi', 'cheras', 'cyberjaya', 'putrajaya'],
  'bangi': ['kajang', 'cyberjaya', 'putrajaya', 'cheras'],
  'rawang': ['kepong', 'kuala-lumpur', 'damansara'],
  'klang': ['shah-alam', 'setia-alam', 'subang-jaya', 'puchong'],
  'setia-alam': ['shah-alam', 'klang', 'petaling-jaya'],
  'kepong': ['kuala-lumpur', 'damansara', 'rawang'],
  'penang': ['ipoh', 'sungai-petani', 'alor-setar', 'taiping'],
  'ipoh': ['taiping', 'penang', 'sungai-petani'],
  'alor-setar': ['sungai-petani', 'penang', 'ipoh'],
  'sungai-petani': ['alor-setar', 'penang', 'ipoh'],
  'taiping': ['ipoh', 'penang', 'sungai-petani'],
  'johor-bahru': ['skudai', 'iskandar-puteri', 'batu-pahat', 'muar'],
  'melaka': ['muar', 'batu-pahat', 'johor-bahru'],
  'batu-pahat': ['muar', 'kluang', 'johor-bahru'],
  'muar': ['batu-pahat', 'melaka', 'johor-bahru'],
  'kluang': ['batu-pahat', 'johor-bahru', 'muar'],
  'skudai': ['johor-bahru', 'iskandar-puteri'],
  'iskandar-puteri': ['johor-bahru', 'skudai'],
  'kuantan': ['temerloh', 'kota-bharu', 'kuala-terengganu'],
  'kota-bharu': ['kuala-terengganu', 'kuantan'],
  'kuala-terengganu': ['kota-bharu', 'kuantan'],
  'temerloh': ['kuantan', 'kajang'],
  'kota-kinabalu': ['sandakan', 'miri'],
  'kuching': ['miri', 'sibu', 'sandakan'],
  'miri': ['kuching', 'kota-kinabalu', 'sibu'],
  'sandakan': ['kota-kinabalu', 'kuching'],
  'sibu': ['kuching', 'miri'],
}

export const regions = [
  { name: 'Klang Valley', nameMs: 'Lembah Klang', nameZh: '巴生谷' },
  { name: 'Northern', nameMs: 'Utara', nameZh: '北部' },
  { name: 'Southern', nameMs: 'Selatan', nameZh: '南部' },
  { name: 'East Coast', nameMs: 'Pantai Timur', nameZh: '东海岸' },
  { name: 'East Malaysia', nameMs: 'Malaysia Timur', nameZh: '东马' },
]

export function getLocationsByRegion(regionName: string): Location[] {
  return locations.filter(l => l.region === regionName)
}

export function getNearbyLocations(slug: string): Location[] {
  const nearbySlugs = nearbyLocations[slug] ?? []
  return nearbySlugs
    .map(s => locations.find(l => l.slug === s))
    .filter((l): l is Location => l !== undefined)
    .slice(0, 5)
}

export function getCityName(slug: string, locale: string): string {
  const loc = locations.find(l => l.slug === slug)
  if (!loc) return slug
  return loc.names[locale as keyof typeof loc.names] ?? loc.displayName
}
