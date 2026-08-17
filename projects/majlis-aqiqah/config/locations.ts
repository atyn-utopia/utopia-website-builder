export interface Location {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
}

export const locations: Location[] = [
  // Klang Valley — 25
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

  // Selangor outer — 10
  { slug: 'sepang', name: 'Sepang', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'banting', name: 'Banting', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'kuala-selangor', name: 'Kuala Selangor', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'hulu-langat', name: 'Hulu Langat', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'serdang', name: 'Serdang', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'sungai-buloh', name: 'Sungai Buloh', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'kuala-kubu-bharu', name: 'Kuala Kubu Bharu', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'sabak-bernam', name: 'Sabak Bernam', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'hulu-selangor', name: 'Hulu Selangor', state: 'Selangor', stateSlug: 'selangor' },
  { slug: 'tanjung-karang', name: 'Tanjung Karang', state: 'Selangor', stateSlug: 'selangor' },

  // Negeri Sembilan — 10
  { slug: 'seremban', name: 'Seremban', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'nilai', name: 'Nilai', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'port-dickson', name: 'Port Dickson', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'rembau', name: 'Rembau', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'kuala-pilah', name: 'Kuala Pilah', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'jelebu', name: 'Jelebu', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'jempol', name: 'Jempol', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'tampin', name: 'Tampin', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'bahau', name: 'Bahau', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
  { slug: 'gemas', name: 'Gemas', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },

  // Melaka — 10
  { slug: 'melaka', name: 'Melaka', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'ayer-keroh', name: 'Ayer Keroh', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'alor-gajah', name: 'Alor Gajah', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'jasin', name: 'Jasin', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'masjid-tanah', name: 'Masjid Tanah', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'batu-berendam', name: 'Batu Berendam', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'bukit-beruang', name: 'Bukit Beruang', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'merlimau', name: 'Merlimau', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'bemban', name: 'Bemban', state: 'Melaka', stateSlug: 'melaka' },
  { slug: 'durian-tunggal', name: 'Durian Tunggal', state: 'Melaka', stateSlug: 'melaka' },

  // Johor — 12
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
  { slug: 'tangkak', name: 'Tangkak', state: 'Johor', stateSlug: 'johor' },
  { slug: 'yong-peng', name: 'Yong Peng', state: 'Johor', stateSlug: 'johor' },

  // Perak — 12
  { slug: 'ipoh', name: 'Ipoh', state: 'Perak', stateSlug: 'perak' },
  { slug: 'taiping', name: 'Taiping', state: 'Perak', stateSlug: 'perak' },
  { slug: 'teluk-intan', name: 'Teluk Intan', state: 'Perak', stateSlug: 'perak' },
  { slug: 'sitiawan', name: 'Sitiawan', state: 'Perak', stateSlug: 'perak' },
  { slug: 'kampar', name: 'Kampar', state: 'Perak', stateSlug: 'perak' },
  { slug: 'batu-gajah', name: 'Batu Gajah', state: 'Perak', stateSlug: 'perak' },
  { slug: 'lumut', name: 'Lumut', state: 'Perak', stateSlug: 'perak' },
  { slug: 'parit-buntar', name: 'Parit Buntar', state: 'Perak', stateSlug: 'perak' },
  { slug: 'bagan-serai', name: 'Bagan Serai', state: 'Perak', stateSlug: 'perak' },
  { slug: 'kuala-kangsar', name: 'Kuala Kangsar', state: 'Perak', stateSlug: 'perak' },
  { slug: 'gerik', name: 'Gerik', state: 'Perak', stateSlug: 'perak' },
  { slug: 'tanjung-malim', name: 'Tanjung Malim', state: 'Perak', stateSlug: 'perak' },

  // Penang — 10
  { slug: 'george-town', name: 'George Town', state: 'Penang', stateSlug: 'penang' },
  { slug: 'butterworth', name: 'Butterworth', state: 'Penang', stateSlug: 'penang' },
  { slug: 'bukit-mertajam', name: 'Bukit Mertajam', state: 'Penang', stateSlug: 'penang' },
  { slug: 'nibong-tebal', name: 'Nibong Tebal', state: 'Penang', stateSlug: 'penang' },
  { slug: 'bayan-lepas', name: 'Bayan Lepas', state: 'Penang', stateSlug: 'penang' },
  { slug: 'balik-pulau', name: 'Balik Pulau', state: 'Penang', stateSlug: 'penang' },
  { slug: 'jelutong', name: 'Jelutong', state: 'Penang', stateSlug: 'penang' },
  { slug: 'air-itam', name: 'Air Itam', state: 'Penang', stateSlug: 'penang' },
  { slug: 'tanjung-bungah', name: 'Tanjung Bungah', state: 'Penang', stateSlug: 'penang' },
  { slug: 'simpang-ampat', name: 'Simpang Ampat', state: 'Penang', stateSlug: 'penang' },

  // Kedah — 10
  { slug: 'alor-setar', name: 'Alor Setar', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'sungai-petani', name: 'Sungai Petani', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'kulim', name: 'Kulim', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'langkawi', name: 'Langkawi', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'jitra', name: 'Jitra', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'changlun', name: 'Changlun', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'baling', name: 'Baling', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'kulim-hi-tech', name: 'Kulim Hi-Tech', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'yan', name: 'Yan', state: 'Kedah', stateSlug: 'kedah' },
  { slug: 'pendang', name: 'Pendang', state: 'Kedah', stateSlug: 'kedah' },

  // Perlis — 10
  { slug: 'kangar', name: 'Kangar', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'arau', name: 'Arau', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'padang-besar', name: 'Padang Besar', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'kuala-perlis', name: 'Kuala Perlis', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'beseri', name: 'Beseri', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'chuping', name: 'Chuping', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'kaki-bukit', name: 'Kaki Bukit', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'simpang-empat-perlis', name: 'Simpang Empat (Perlis)', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'sanglang', name: 'Sanglang', state: 'Perlis', stateSlug: 'perlis' },
  { slug: 'mata-ayer', name: 'Mata Ayer', state: 'Perlis', stateSlug: 'perlis' },

  // Kelantan — 10
  { slug: 'kota-bharu', name: 'Kota Bharu', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'pasir-mas', name: 'Pasir Mas', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'tanah-merah', name: 'Tanah Merah', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'tumpat', name: 'Tumpat', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'pasir-puteh', name: 'Pasir Puteh', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'machang', name: 'Machang', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'kuala-krai', name: 'Kuala Krai', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'gua-musang', name: 'Gua Musang', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'jeli', name: 'Jeli', state: 'Kelantan', stateSlug: 'kelantan' },
  { slug: 'bachok', name: 'Bachok', state: 'Kelantan', stateSlug: 'kelantan' },

  // Terengganu — 10
  { slug: 'kuala-terengganu', name: 'Kuala Terengganu', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'kemaman', name: 'Kemaman', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'dungun', name: 'Dungun', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'marang', name: 'Marang', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'besut', name: 'Besut', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'setiu', name: 'Setiu', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'hulu-terengganu', name: 'Hulu Terengganu', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'chukai', name: 'Chukai', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'jerteh', name: 'Jerteh', state: 'Terengganu', stateSlug: 'terengganu' },
  { slug: 'paka', name: 'Paka', state: 'Terengganu', stateSlug: 'terengganu' },

  // Pahang — 10
  { slug: 'kuantan', name: 'Kuantan', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'temerloh', name: 'Temerloh', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'bentong', name: 'Bentong', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'raub', name: 'Raub', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'jerantut', name: 'Jerantut', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'maran', name: 'Maran', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'pekan', name: 'Pekan', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'rompin', name: 'Rompin', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'cameron-highlands', name: 'Cameron Highlands', state: 'Pahang', stateSlug: 'pahang' },
  { slug: 'kuala-lipis', name: 'Kuala Lipis', state: 'Pahang', stateSlug: 'pahang' },

  // Sabah — 10
  { slug: 'kota-kinabalu', name: 'Kota Kinabalu', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'sandakan', name: 'Sandakan', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'tawau', name: 'Tawau', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'lahad-datu', name: 'Lahad Datu', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'keningau', name: 'Keningau', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'semporna', name: 'Semporna', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'kudat', name: 'Kudat', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'papar', name: 'Papar', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'beaufort', name: 'Beaufort', state: 'Sabah', stateSlug: 'sabah' },
  { slug: 'ranau', name: 'Ranau', state: 'Sabah', stateSlug: 'sabah' },

  // Sarawak — 10
  { slug: 'kuching', name: 'Kuching', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'miri', name: 'Miri', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'sibu', name: 'Sibu', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'bintulu', name: 'Bintulu', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'sri-aman', name: 'Sri Aman', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'kota-samarahan', name: 'Kota Samarahan', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'sarikei', name: 'Sarikei', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'mukah', name: 'Mukah', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'limbang', name: 'Limbang', state: 'Sarawak', stateSlug: 'sarawak' },
  { slug: 'lawas', name: 'Lawas', state: 'Sarawak', stateSlug: 'sarawak' },

  // Labuan — 10
  { slug: 'victoria-labuan', name: 'Victoria', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'bandar-labuan', name: 'Bandar Labuan', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'rancha-rancha', name: 'Rancha-Rancha', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'layang-layangan', name: 'Layang-Layangan', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'batu-manikar', name: 'Batu Manikar', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'kiamsam', name: 'Kiamsam', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'patau-patau', name: 'Patau-Patau', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'sungai-lada', name: 'Sungai Lada', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'durian-tunjung', name: 'Durian Tunjung', state: 'Labuan', stateSlug: 'labuan' },
  { slug: 'ganggarak', name: 'Ganggarak', state: 'Labuan', stateSlug: 'labuan' },
];

export const regionOrder = [
  'Klang Valley', 'Selangor', 'Negeri Sembilan', 'Melaka', 'Johor', 'Perak',
  'Penang', 'Kedah', 'Perlis', 'Kelantan', 'Terengganu', 'Pahang', 'Sabah',
  'Sarawak', 'Labuan',
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
  'Labuan': 'labuan',
};

export function getNearbyLocations(slug: string): Location[] {
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) return [];
  const peers = locations.filter((l) => l.state === loc.state && l.slug !== slug);
  return peers.slice(0, 6);
}

export function getLocationsByState(): Record<string, Location[]> {
  const grouped: Record<string, Location[]> = {};
  for (const loc of locations) {
    (grouped[loc.state] ||= []).push(loc);
  }
  return grouped;
}

export const topCitySlugs = [
  'kuala-lumpur', 'petaling-jaya', 'shah-alam', 'johor-bahru', 'ipoh',
  'george-town', 'kuantan', 'kota-kinabalu', 'kuching', 'melaka',
];
