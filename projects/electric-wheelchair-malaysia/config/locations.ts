export interface Location {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
}

export const regionOrder = [
  'Klang Valley',
  'Selangor',
  'Negeri Sembilan',
  'Melaka',
  'Johor',
  'Perak',
  'Penang',
  'Kedah',
  'Perlis',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Sabah',
  'Sarawak',
] as const;

export const regionKeys: Record<string, string> = {
  'Klang Valley': 'klangValley',
  'Selangor': 'selangor',
  'Negeri Sembilan': 'negeriSembilan',
  'Melaka': 'melaka',
  'Johor': 'johor',
  'Perak': 'perak',
  'Penang': 'penang',
  'Kedah': 'kedah',
  'Perlis': 'perlis',
  'Kelantan': 'kelantan',
  'Terengganu': 'terengganu',
  'Pahang': 'pahang',
  'Sabah': 'sabah',
  'Sarawak': 'sarawak',
};

export const locations: Location[] = [
  // Klang Valley
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'petaling-jaya', name: 'Petaling Jaya', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'shah-alam', name: 'Shah Alam', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'subang-jaya', name: 'Subang Jaya', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'puchong', name: 'Puchong', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'cheras', name: 'Cheras', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'ampang', name: 'Ampang', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'kepong', name: 'Kepong', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'setapak', name: 'Setapak', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'wangsa-maju', name: 'Wangsa Maju', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'bangsar', name: 'Bangsar', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'mont-kiara', name: 'Mont Kiara', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'damansara', name: 'Damansara', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'sri-petaling', name: 'Sri Petaling', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'bukit-jalil', name: 'Bukit Jalil', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'cyberjaya', name: 'Cyberjaya', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'putrajaya', name: 'Putrajaya', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'kajang', name: 'Kajang', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'bangi', name: 'Bangi', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'semenyih', name: 'Semenyih', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'rawang', name: 'Rawang', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'selayang', name: 'Selayang', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'gombak', name: 'Gombak', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'klang', name: 'Klang', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'port-klang', name: 'Port Klang', state: 'Klang Valley', stateSlug: 'klang-valley' },

  // Selangor
  { slug: 'sepang', name: 'Sepang', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'banting', name: 'Banting', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'kuala-selangor', name: 'Kuala Selangor', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'hulu-langat', name: 'Hulu Langat', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'serdang', name: 'Serdang', state: 'Selangor', stateSlug: 'selangor' },

  // Negeri Sembilan
  { slug: 'seremban', name: 'Seremban', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'nilai', name: 'Nilai', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'port-dickson', name: 'Port Dickson', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },

  // Melaka
  { slug: 'melaka', name: 'Melaka', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'ayer-keroh', name: 'Ayer Keroh', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'alor-gajah', name: 'Alor Gajah', state: 'Melaka', stateSlug: 'melaka' },

  // Johor
  { slug: 'johor-bahru', name: 'Johor Bahru', state: 'Johor', stateSlug: 'johor' },
  { slug: 'iskandar-puteri', name: 'Iskandar Puteri', state: 'Johor', stateSlug: 'johor' },
  { slug: 'kulai', name: 'Kulai', state: 'Johor', stateSlug: 'johor' },
  { slug: 'batu-pahat', name: 'Batu Pahat', state: 'Johor', stateSlug: 'johor' },
  { slug: 'muar', name: 'Muar', state: 'Johor', stateSlug: 'johor' },
  { slug: 'kluang', name: 'Kluang', state: 'Johor', stateSlug: 'johor' },
  { slug: 'segamat', name: 'Segamat', state: 'Johor', stateSlug: 'johor' },
  { slug: 'pontian', name: 'Pontian', state: 'Johor', stateSlug: 'johor' },
  { slug: 'mersing', name: 'Mersing', state: 'Johor', stateSlug: 'johor' },
  { slug: 'kota-tinggi', name: 'Kota Tinggi', state: 'Johor', stateSlug: 'johor' },

  // Perak
  { slug: 'ipoh', name: 'Ipoh', state: 'Perak', stateSlug: 'perak' },
  { slug: 'taiping', name: 'Taiping', state: 'Perak', stateSlug: 'perak' },
  { slug: 'teluk-intan', name: 'Teluk Intan', state: 'Perak', stateSlug: 'perak' },
  { slug: 'sitiawan', name: 'Sitiawan', state: 'Perak', stateSlug: 'perak' },
  { slug: 'kampar', name: 'Kampar', state: 'Perak', stateSlug: 'perak' },
  { slug: 'batu-gajah', name: 'Batu Gajah', state: 'Perak', stateSlug: 'perak' },
  { slug: 'lumut', name: 'Lumut', state: 'Perak', stateSlug: 'perak' },

  // Penang
  { slug: 'george-town', name: 'George Town', state: 'Penang', stateSlug: 'penang' },
  { slug: 'butterworth', name: 'Butterworth', state: 'Penang', stateSlug: 'penang' },
  { slug: 'bukit-mertajam', name: 'Bukit Mertajam', state: 'Penang', stateSlug: 'penang' },
  { slug: 'nibong-tebal', name: 'Nibong Tebal', state: 'Penang', stateSlug: 'penang' },
  { slug: 'bayan-lepas', name: 'Bayan Lepas', state: 'Penang', stateSlug: 'penang' },
  { slug: 'balik-pulau', name: 'Balik Pulau', state: 'Penang', stateSlug: 'penang' },

  // Kedah
  { slug: 'alor-setar', name: 'Alor Setar', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'sungai-petani', name: 'Sungai Petani', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'kulim', name: 'Kulim', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'langkawi', name: 'Langkawi', state: 'Kedah', stateSlug: 'kedah' },

  // Perlis
  { slug: 'kangar', name: 'Kangar', state: 'Perlis', stateSlug: 'perlis' },

  // Kelantan
  { slug: 'kota-bharu', name: 'Kota Bharu', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'pasir-mas', name: 'Pasir Mas', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'tanah-merah', name: 'Tanah Merah', state: 'Kelantan', stateSlug: 'kelantan' },

  // Terengganu
  { slug: 'kuala-terengganu', name: 'Kuala Terengganu', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'kemaman', name: 'Kemaman', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'dungun', name: 'Dungun', state: 'Terengganu', stateSlug: 'terengganu' },

  // Pahang
  { slug: 'kuantan', name: 'Kuantan', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'temerloh', name: 'Temerloh', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'bentong', name: 'Bentong', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'raub', name: 'Raub', state: 'Pahang', stateSlug: 'pahang' },

  // Sabah
  { slug: 'kota-kinabalu', name: 'Kota Kinabalu', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'sandakan', name: 'Sandakan', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'tawau', name: 'Tawau', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'lahad-datu', name: 'Lahad Datu', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'keningau', name: 'Keningau', state: 'Sabah', stateSlug: 'sabah' },

  // Sarawak
  { slug: 'kuching', name: 'Kuching', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'miri', name: 'Miri', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'sibu', name: 'Sibu', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'bintulu', name: 'Bintulu', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'sri-aman', name: 'Sri Aman', state: 'Sarawak', stateSlug: 'sarawak' },
];

export const nearbyMap: Record<string, string[]> = {
  // Klang Valley
  'kuala-lumpur': ['petaling-jaya', 'cheras', 'ampang', 'kepong'],
  'petaling-jaya': ['kuala-lumpur', 'subang-jaya', 'shah-alam', 'damansara'],
  'shah-alam': ['petaling-jaya', 'klang', 'subang-jaya', 'damansara'],
  'subang-jaya': ['petaling-jaya', 'shah-alam', 'puchong', 'damansara'],
  'puchong': ['subang-jaya', 'petaling-jaya', 'sri-petaling', 'cyberjaya'],
  'cheras': ['kuala-lumpur', 'kajang', 'ampang', 'sri-petaling'],
  'ampang': ['kuala-lumpur', 'cheras', 'wangsa-maju', 'setapak'],
  'kepong': ['kuala-lumpur', 'selayang', 'mont-kiara', 'damansara'],
  'setapak': ['kuala-lumpur', 'wangsa-maju', 'ampang', 'gombak'],
  'wangsa-maju': ['setapak', 'ampang', 'kuala-lumpur', 'gombak'],
  'bangsar': ['kuala-lumpur', 'petaling-jaya', 'mont-kiara', 'sri-petaling'],
  'mont-kiara': ['bangsar', 'kepong', 'damansara', 'kuala-lumpur'],
  'damansara': ['petaling-jaya', 'mont-kiara', 'subang-jaya', 'shah-alam'],
  'sri-petaling': ['bukit-jalil', 'puchong', 'cheras', 'kuala-lumpur'],
  'bukit-jalil': ['sri-petaling', 'puchong', 'cheras', 'kuala-lumpur'],
  'cyberjaya': ['putrajaya', 'puchong', 'serdang', 'sepang'],
  'putrajaya': ['cyberjaya', 'bangi', 'kajang', 'serdang'],
  'kajang': ['bangi', 'cheras', 'semenyih', 'putrajaya'],
  'bangi': ['kajang', 'putrajaya', 'semenyih', 'nilai'],
  'semenyih': ['kajang', 'bangi', 'hulu-langat', 'cheras'],
  'rawang': ['selayang', 'gombak', 'kuala-selangor', 'kepong'],
  'selayang': ['rawang', 'kepong', 'gombak', 'kuala-lumpur'],
  'gombak': ['selayang', 'rawang', 'setapak', 'wangsa-maju'],
  'klang': ['port-klang', 'shah-alam', 'petaling-jaya', 'subang-jaya'],
  'port-klang': ['klang', 'shah-alam', 'banting', 'subang-jaya'],

  // Selangor
  'sepang': ['cyberjaya', 'putrajaya', 'banting', 'nilai'],
  'banting': ['port-klang', 'sepang', 'klang', 'kuala-selangor'],
  'kuala-selangor': ['rawang', 'klang', 'banting', 'shah-alam'],
  'hulu-langat': ['semenyih', 'kajang', 'cheras', 'ampang'],
  'serdang': ['putrajaya', 'cyberjaya', 'sri-petaling', 'puchong'],

  // Negeri Sembilan
  'seremban': ['nilai', 'port-dickson', 'bangi', 'melaka'],
  'nilai': ['seremban', 'bangi', 'sepang', 'putrajaya'],
  'port-dickson': ['seremban', 'nilai', 'melaka', 'ayer-keroh'],

  // Melaka
  'melaka': ['ayer-keroh', 'alor-gajah', 'muar', 'port-dickson'],
  'ayer-keroh': ['melaka', 'alor-gajah', 'port-dickson', 'muar'],
  'alor-gajah': ['melaka', 'ayer-keroh', 'muar', 'port-dickson'],

  // Johor
  'johor-bahru': ['iskandar-puteri', 'kulai', 'kota-tinggi', 'pontian'],
  'iskandar-puteri': ['johor-bahru', 'kulai', 'pontian', 'kota-tinggi'],
  'kulai': ['johor-bahru', 'iskandar-puteri', 'kluang', 'batu-pahat'],
  'batu-pahat': ['muar', 'kluang', 'pontian', 'kulai'],
  'muar': ['batu-pahat', 'melaka', 'segamat', 'kluang'],
  'kluang': ['kulai', 'batu-pahat', 'mersing', 'segamat'],
  'segamat': ['muar', 'kluang', 'batu-pahat', 'temerloh'],
  'pontian': ['johor-bahru', 'iskandar-puteri', 'batu-pahat', 'kulai'],
  'mersing': ['kota-tinggi', 'kluang', 'johor-bahru', 'kuantan'],
  'kota-tinggi': ['johor-bahru', 'mersing', 'iskandar-puteri', 'kulai'],

  // Perak
  'ipoh': ['batu-gajah', 'kampar', 'taiping', 'sitiawan'],
  'taiping': ['ipoh', 'butterworth', 'bukit-mertajam', 'kampar'],
  'teluk-intan': ['sitiawan', 'kampar', 'batu-gajah', 'ipoh'],
  'sitiawan': ['lumut', 'ipoh', 'teluk-intan', 'batu-gajah'],
  'kampar': ['ipoh', 'batu-gajah', 'teluk-intan', 'taiping'],
  'batu-gajah': ['ipoh', 'kampar', 'sitiawan', 'teluk-intan'],
  'lumut': ['sitiawan', 'ipoh', 'batu-gajah', 'teluk-intan'],

  // Penang
  'george-town': ['bayan-lepas', 'balik-pulau', 'butterworth', 'bukit-mertajam'],
  'butterworth': ['george-town', 'bukit-mertajam', 'nibong-tebal', 'taiping'],
  'bukit-mertajam': ['butterworth', 'nibong-tebal', 'george-town', 'kulim'],
  'nibong-tebal': ['bukit-mertajam', 'butterworth', 'bayan-lepas', 'kulim'],
  'bayan-lepas': ['george-town', 'balik-pulau', 'nibong-tebal', 'butterworth'],
  'balik-pulau': ['george-town', 'bayan-lepas', 'butterworth', 'nibong-tebal'],

  // Kedah
  'alor-setar': ['sungai-petani', 'kangar', 'kulim', 'langkawi'],
  'sungai-petani': ['alor-setar', 'kulim', 'butterworth', 'bukit-mertajam'],
  'kulim': ['sungai-petani', 'bukit-mertajam', 'alor-setar', 'butterworth'],
  'langkawi': ['alor-setar', 'kangar', 'sungai-petani', 'kulim'],

  // Perlis
  'kangar': ['alor-setar', 'langkawi', 'sungai-petani', 'kulim'],

  // Kelantan
  'kota-bharu': ['pasir-mas', 'tanah-merah', 'kuala-terengganu'],
  'pasir-mas': ['kota-bharu', 'tanah-merah', 'kuala-terengganu'],
  'tanah-merah': ['kota-bharu', 'pasir-mas', 'kuala-terengganu'],

  // Terengganu
  'kuala-terengganu': ['dungun', 'kemaman', 'kota-bharu'],
  'kemaman': ['dungun', 'kuala-terengganu', 'kuantan'],
  'dungun': ['kuala-terengganu', 'kemaman', 'kuantan'],

  // Pahang
  'kuantan': ['kemaman', 'temerloh', 'bentong', 'mersing'],
  'temerloh': ['kuantan', 'bentong', 'raub', 'segamat'],
  'bentong': ['raub', 'temerloh', 'kuantan', 'gombak'],
  'raub': ['bentong', 'temerloh', 'kuantan', 'gombak'],

  // Sabah
  'kota-kinabalu': ['sandakan', 'keningau', 'tawau', 'lahad-datu'],
  'sandakan': ['kota-kinabalu', 'lahad-datu', 'tawau', 'keningau'],
  'tawau': ['lahad-datu', 'sandakan', 'kota-kinabalu', 'keningau'],
  'lahad-datu': ['tawau', 'sandakan', 'kota-kinabalu', 'keningau'],
  'keningau': ['kota-kinabalu', 'sandakan', 'tawau', 'lahad-datu'],

  // Sarawak
  'kuching': ['sri-aman', 'sibu', 'bintulu', 'miri'],
  'miri': ['bintulu', 'sibu', 'kuching', 'sri-aman'],
  'sibu': ['bintulu', 'kuching', 'miri', 'sri-aman'],
  'bintulu': ['sibu', 'miri', 'kuching', 'sri-aman'],
  'sri-aman': ['kuching', 'sibu', 'bintulu', 'miri'],
};

export function getLocationsByRegion(): Record<string, Location[]> {
  const grouped: Record<string, Location[]> = {};
  for (const region of regionOrder) {
    grouped[region] = locations.filter((loc) => loc.state === region);
  }
  return grouped;
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((loc) => loc.slug === slug);
}

export function getNearbyLocations(slug: string): Location[] {
  const slugs = nearbyMap[slug] ?? [];
  return slugs
    .map((s) => locations.find((loc) => loc.slug === s))
    .filter(Boolean) as Location[];
}
