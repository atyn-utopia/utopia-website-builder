export interface Location {
  slug: string;
  name: string;
  region: string;
}

export const locations: Location[] = [
  // Klang Valley (20)
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', region: 'Klang Valley' },
  { slug: 'petaling-jaya', name: 'Petaling Jaya', region: 'Klang Valley' },
  { slug: 'shah-alam', name: 'Shah Alam', region: 'Klang Valley' },
  { slug: 'subang-jaya', name: 'Subang Jaya', region: 'Klang Valley' },
  { slug: 'cheras', name: 'Cheras', region: 'Klang Valley' },
  { slug: 'ampang', name: 'Ampang', region: 'Klang Valley' },
  { slug: 'puchong', name: 'Puchong', region: 'Klang Valley' },
  { slug: 'bangsar', name: 'Bangsar', region: 'Klang Valley' },
  { slug: 'damansara', name: 'Damansara', region: 'Klang Valley' },
  { slug: 'cyberjaya', name: 'Cyberjaya', region: 'Klang Valley' },
  { slug: 'putrajaya', name: 'Putrajaya', region: 'Klang Valley' },
  { slug: 'kajang', name: 'Kajang', region: 'Klang Valley' },
  { slug: 'bangi', name: 'Bangi', region: 'Klang Valley' },
  { slug: 'rawang', name: 'Rawang', region: 'Klang Valley' },
  { slug: 'klang', name: 'Klang', region: 'Klang Valley' },
  { slug: 'kepong', name: 'Kepong', region: 'Klang Valley' },
  { slug: 'seri-kembangan', name: 'Seri Kembangan', region: 'Klang Valley' },
  { slug: 'balakong', name: 'Balakong', region: 'Klang Valley' },
  { slug: 'sungai-buloh', name: 'Sungai Buloh', region: 'Klang Valley' },
  { slug: 'batu-caves', name: 'Batu Caves', region: 'Klang Valley' },
  // Southern Selangor & Industrial (6)
  { slug: 'port-klang', name: 'Port Klang', region: 'Selangor Selatan' },
  { slug: 'glenmarie', name: 'Glenmarie', region: 'Selangor Selatan' },
  { slug: 'hicom-shah-alam', name: 'HICOM Shah Alam', region: 'Selangor Selatan' },
  { slug: 'pandan-indah', name: 'Pandan Indah', region: 'Selangor Selatan' },
  { slug: 'sri-damansara', name: 'Sri Damansara', region: 'Selangor Selatan' },
  { slug: 'kota-damansara', name: 'Kota Damansara', region: 'Selangor Selatan' },
  // Negeri Sembilan (3)
  { slug: 'seremban', name: 'Seremban', region: 'Negeri Sembilan' },
  { slug: 'nilai', name: 'Nilai', region: 'Negeri Sembilan' },
  { slug: 'senawang', name: 'Senawang', region: 'Negeri Sembilan' },
  // Northern (6)
  { slug: 'penang', name: 'Penang', region: 'Utara' },
  { slug: 'ipoh', name: 'Ipoh', region: 'Utara' },
  { slug: 'alor-setar', name: 'Alor Setar', region: 'Utara' },
  { slug: 'sungai-petani', name: 'Sungai Petani', region: 'Utara' },
  { slug: 'taiping', name: 'Taiping', region: 'Utara' },
  { slug: 'butterworth', name: 'Butterworth', region: 'Utara' },
  // Southern (7)
  { slug: 'johor-bahru', name: 'Johor Bahru', region: 'Selatan' },
  { slug: 'melaka', name: 'Melaka', region: 'Selatan' },
  { slug: 'batu-pahat', name: 'Batu Pahat', region: 'Selatan' },
  { slug: 'muar', name: 'Muar', region: 'Selatan' },
  { slug: 'kluang', name: 'Kluang', region: 'Selatan' },
  { slug: 'skudai', name: 'Skudai', region: 'Selatan' },
  { slug: 'iskandar-puteri', name: 'Iskandar Puteri', region: 'Selatan' },
  // East Coast (4)
  { slug: 'kuantan', name: 'Kuantan', region: 'Pantai Timur' },
  { slug: 'kota-bharu', name: 'Kota Bharu', region: 'Pantai Timur' },
  { slug: 'kuala-terengganu', name: 'Kuala Terengganu', region: 'Pantai Timur' },
  { slug: 'temerloh', name: 'Temerloh', region: 'Pantai Timur' },
  // East Malaysia (4)
  { slug: 'kota-kinabalu', name: 'Kota Kinabalu', region: 'Malaysia Timur' },
  { slug: 'kuching', name: 'Kuching', region: 'Malaysia Timur' },
  { slug: 'miri', name: 'Miri', region: 'Malaysia Timur' },
  { slug: 'sandakan', name: 'Sandakan', region: 'Malaysia Timur' },
];

export const regionOrder = [
  'Klang Valley',
  'Selangor Selatan',
  'Negeri Sembilan',
  'Utara',
  'Selatan',
  'Pantai Timur',
  'Malaysia Timur',
];

export const regionKeys: Record<string, string> = {
  'Klang Valley': 'klangValley',
  'Selangor Selatan': 'southernSelangor',
  'Negeri Sembilan': 'negeriSembilan',
  'Utara': 'northern',
  'Selatan': 'southern',
  'Pantai Timur': 'eastCoast',
  'Malaysia Timur': 'eastMalaysia',
};

export function getLocationsByRegion(region: string): Location[] {
  return locations.filter((l) => l.region === region);
}

export const nearbyMap: Record<string, string[]> = {
  'kuala-lumpur': ['petaling-jaya', 'cheras', 'ampang', 'bangsar', 'kepong'],
  'petaling-jaya': ['kuala-lumpur', 'shah-alam', 'subang-jaya', 'damansara', 'puchong'],
  'shah-alam': ['klang', 'subang-jaya', 'glenmarie', 'hicom-shah-alam', 'petaling-jaya'],
  'subang-jaya': ['shah-alam', 'petaling-jaya', 'puchong', 'glenmarie', 'cyberjaya'],
  'cheras': ['kuala-lumpur', 'ampang', 'balakong', 'seri-kembangan', 'kajang'],
  'ampang': ['kuala-lumpur', 'cheras', 'pandan-indah', 'bangsar'],
  'puchong': ['subang-jaya', 'petaling-jaya', 'cyberjaya', 'seri-kembangan', 'kajang'],
  'bangsar': ['kuala-lumpur', 'petaling-jaya', 'damansara', 'ampang'],
  'damansara': ['petaling-jaya', 'bangsar', 'sri-damansara', 'kota-damansara', 'sungai-buloh'],
  'cyberjaya': ['putrajaya', 'puchong', 'subang-jaya', 'seri-kembangan'],
  'putrajaya': ['cyberjaya', 'kajang', 'bangi', 'seri-kembangan'],
  'kajang': ['bangi', 'cheras', 'seri-kembangan', 'putrajaya', 'balakong'],
  'bangi': ['kajang', 'putrajaya', 'nilai', 'seri-kembangan'],
  'rawang': ['sungai-buloh', 'batu-caves', 'kuala-lumpur', 'kepong'],
  'klang': ['port-klang', 'shah-alam', 'glenmarie', 'hicom-shah-alam'],
  'kepong': ['kuala-lumpur', 'batu-caves', 'sungai-buloh', 'damansara', 'rawang'],
  'seri-kembangan': ['cheras', 'puchong', 'kajang', 'cyberjaya', 'balakong'],
  'balakong': ['cheras', 'seri-kembangan', 'kajang', 'ampang'],
  'sungai-buloh': ['rawang', 'kepong', 'damansara', 'sri-damansara', 'kota-damansara'],
  'batu-caves': ['rawang', 'kepong', 'kuala-lumpur', 'sungai-buloh'],
  'port-klang': ['klang', 'shah-alam', 'glenmarie'],
  'glenmarie': ['shah-alam', 'subang-jaya', 'klang', 'port-klang'],
  'hicom-shah-alam': ['shah-alam', 'klang', 'glenmarie'],
  'pandan-indah': ['ampang', 'cheras', 'kuala-lumpur'],
  'sri-damansara': ['damansara', 'kepong', 'sungai-buloh', 'kota-damansara'],
  'kota-damansara': ['damansara', 'sri-damansara', 'sungai-buloh', 'petaling-jaya'],
  'seremban': ['nilai', 'senawang', 'bangi'],
  'nilai': ['seremban', 'senawang', 'bangi'],
  'senawang': ['seremban', 'nilai'],
  'penang': ['butterworth', 'sungai-petani'],
  'ipoh': ['taiping', 'sungai-petani'],
  'alor-setar': ['sungai-petani', 'butterworth', 'penang'],
  'sungai-petani': ['alor-setar', 'butterworth', 'penang', 'ipoh'],
  'taiping': ['ipoh', 'butterworth'],
  'butterworth': ['penang', 'sungai-petani', 'taiping'],
  'johor-bahru': ['skudai', 'iskandar-puteri', 'kluang', 'melaka'],
  'melaka': ['johor-bahru', 'muar', 'batu-pahat'],
  'batu-pahat': ['muar', 'kluang', 'melaka', 'johor-bahru'],
  'muar': ['melaka', 'batu-pahat', 'kluang'],
  'kluang': ['johor-bahru', 'batu-pahat', 'muar'],
  'skudai': ['johor-bahru', 'iskandar-puteri'],
  'iskandar-puteri': ['johor-bahru', 'skudai'],
  'kuantan': ['temerloh', 'kuala-terengganu'],
  'kota-bharu': ['kuala-terengganu'],
  'kuala-terengganu': ['kota-bharu', 'kuantan'],
  'temerloh': ['kuantan'],
  'kota-kinabalu': ['sandakan'],
  'kuching': ['miri'],
  'miri': ['kuching', 'kota-kinabalu'],
  'sandakan': ['kota-kinabalu'],
};
