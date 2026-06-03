// All Malaysian states + WPs, 10+ cities each, 165+ total to satisfy the
// CLAUDE.md coverage rule (10 per state, 150-180 grand total).

export type LocationRegion =
  | 'klangValley'
  | 'southern'
  | 'northern'
  | 'eastCoast'
  | 'eastMalaysia'

export interface Location {
  name: string
  slug: string
  state: string
  stateSlug: string
  region: LocationRegion
  nearby: string[]
}

export const locations: Location[] = [
  // ── WP Kuala Lumpur ────────────────────────────────────────────────
  { name: 'Kuala Lumpur', slug: 'kuala-lumpur', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['petaling-jaya', 'cheras', 'ampang'] },
  { name: 'Bangsar', slug: 'bangsar', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['kuala-lumpur', 'mid-valley', 'petaling-jaya'] },
  { name: 'Mont Kiara', slug: 'mont-kiara', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['kuala-lumpur', 'desa-park-city', 'sri-hartamas'] },
  { name: 'Sri Hartamas', slug: 'sri-hartamas', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['mont-kiara', 'kuala-lumpur', 'segambut'] },
  { name: 'Desa Park City', slug: 'desa-park-city', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['mont-kiara', 'kepong', 'sri-hartamas'] },
  { name: 'Kepong', slug: 'kepong', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['selayang', 'desa-park-city', 'segambut'] },
  { name: 'Segambut', slug: 'segambut', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['kepong', 'mont-kiara', 'kuala-lumpur'] },
  { name: 'Setapak', slug: 'setapak', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['gombak', 'kuala-lumpur', 'wangsa-maju'] },
  { name: 'Wangsa Maju', slug: 'wangsa-maju', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['setapak', 'ampang', 'kuala-lumpur'] },
  { name: 'Mid Valley', slug: 'mid-valley', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['bangsar', 'kuala-lumpur', 'petaling-jaya'] },
  { name: 'Bukit Jalil', slug: 'bukit-jalil', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['sri-petaling', 'puchong', 'kuala-lumpur'] },
  { name: 'Sri Petaling', slug: 'sri-petaling', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', region: 'klangValley', nearby: ['bukit-jalil', 'puchong', 'kuala-lumpur'] },

  // ── Selangor ───────────────────────────────────────────────────────
  { name: 'Petaling Jaya', slug: 'petaling-jaya', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kuala-lumpur', 'subang-jaya', 'shah-alam'] },
  { name: 'Shah Alam', slug: 'shah-alam', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['petaling-jaya', 'subang-jaya', 'klang'] },
  { name: 'Subang Jaya', slug: 'subang-jaya', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['petaling-jaya', 'puchong', 'shah-alam'] },
  { name: 'Puchong', slug: 'puchong', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['subang-jaya', 'cyberjaya', 'cheras'] },
  { name: 'Cheras', slug: 'cheras', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kuala-lumpur', 'ampang', 'kajang'] },
  { name: 'Ampang', slug: 'ampang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kuala-lumpur', 'cheras', 'kajang'] },
  { name: 'Klang', slug: 'klang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['shah-alam', 'subang-jaya', 'petaling-jaya'] },
  { name: 'Kajang', slug: 'kajang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['cheras', 'ampang', 'putrajaya'] },
  { name: 'Cyberjaya', slug: 'cyberjaya', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['putrajaya', 'puchong', 'kajang'] },
  { name: 'Sungai Buloh', slug: 'sungai-buloh', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kepong', 'shah-alam', 'rawang'] },
  { name: 'Rawang', slug: 'rawang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['sungai-buloh', 'selayang', 'kuala-lumpur'] },
  { name: 'Selayang', slug: 'selayang', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kepong', 'rawang', 'gombak'] },
  { name: 'Gombak', slug: 'gombak', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['selayang', 'setapak', 'ampang'] },
  { name: 'Semenyih', slug: 'semenyih', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kajang', 'bangi', 'cheras'] },
  { name: 'Bangi', slug: 'bangi', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['kajang', 'semenyih', 'putrajaya'] },
  { name: 'Banting', slug: 'banting', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['klang', 'kuala-langat', 'putrajaya'] },
  { name: 'Kuala Selangor', slug: 'kuala-selangor', state: 'Selangor', stateSlug: 'selangor', region: 'klangValley', nearby: ['sungai-buloh', 'rawang', 'klang'] },

  // ── WP Putrajaya ───────────────────────────────────────────────────
  { name: 'Putrajaya', slug: 'putrajaya', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['cyberjaya', 'kajang', 'kuala-lumpur'] },
  { name: 'Putrajaya Presint 8', slug: 'putrajaya-presint-8', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Presint 9', slug: 'putrajaya-presint-9', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Presint 11', slug: 'putrajaya-presint-11', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Presint 14', slug: 'putrajaya-presint-14', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Presint 16', slug: 'putrajaya-presint-16', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Presint 18', slug: 'putrajaya-presint-18', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Presint 19', slug: 'putrajaya-presint-19', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Putrajaya Sentral', slug: 'putrajaya-sentral', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },
  { name: 'Diplomatic Enclave', slug: 'putrajaya-diplomatic-enclave', state: 'WP Putrajaya', stateSlug: 'wp-putrajaya', region: 'klangValley', nearby: ['putrajaya', 'cyberjaya', 'kajang'] },

  // ── Negeri Sembilan ────────────────────────────────────────────────
  { name: 'Seremban', slug: 'seremban', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['nilai', 'port-dickson', 'kajang'] },
  { name: 'Nilai', slug: 'nilai', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['seremban', 'kajang', 'bangi'] },
  { name: 'Port Dickson', slug: 'port-dickson', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['seremban', 'rembau', 'melaka'] },
  { name: 'Rembau', slug: 'rembau', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['port-dickson', 'seremban', 'tampin'] },
  { name: 'Tampin', slug: 'tampin', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['rembau', 'melaka', 'gemas'] },
  { name: 'Gemas', slug: 'gemas', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['tampin', 'kuala-pilah', 'segamat'] },
  { name: 'Kuala Pilah', slug: 'kuala-pilah', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['seremban', 'gemas', 'rembau'] },
  { name: 'Bahau', slug: 'bahau', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['kuala-pilah', 'gemas', 'jelebu'] },
  { name: 'Jelebu', slug: 'jelebu', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['bahau', 'seremban', 'kuala-pilah'] },
  { name: 'Senawang', slug: 'senawang', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', region: 'southern', nearby: ['seremban', 'nilai', 'rembau'] },

  // ── Melaka ─────────────────────────────────────────────────────────
  { name: 'Melaka', slug: 'melaka', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['ayer-keroh', 'alor-gajah', 'masjid-tanah'] },
  { name: 'Ayer Keroh', slug: 'ayer-keroh', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['melaka', 'alor-gajah', 'tampin'] },
  { name: 'Alor Gajah', slug: 'alor-gajah', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['melaka', 'masjid-tanah', 'ayer-keroh'] },
  { name: 'Masjid Tanah', slug: 'masjid-tanah', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['alor-gajah', 'melaka', 'tanjung-bidara'] },
  { name: 'Jasin', slug: 'jasin', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['melaka', 'tangga-batu', 'merlimau'] },
  { name: 'Merlimau', slug: 'merlimau', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['jasin', 'melaka', 'muar'] },
  { name: 'Tangga Batu', slug: 'tangga-batu', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['melaka', 'klebang', 'masjid-tanah'] },
  { name: 'Klebang', slug: 'klebang', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['melaka', 'tangga-batu', 'tanjung-kling'] },
  { name: 'Tanjung Kling', slug: 'tanjung-kling', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['klebang', 'melaka', 'masjid-tanah'] },
  { name: 'Cheng', slug: 'cheng', state: 'Melaka', stateSlug: 'melaka', region: 'southern', nearby: ['melaka', 'ayer-keroh', 'klebang'] },

  // ── Johor ──────────────────────────────────────────────────────────
  { name: 'Johor Bahru', slug: 'johor-bahru', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['skudai', 'pasir-gudang', 'iskandar-puteri'] },
  { name: 'Skudai', slug: 'skudai', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['johor-bahru', 'iskandar-puteri', 'kulai'] },
  { name: 'Iskandar Puteri', slug: 'iskandar-puteri', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['johor-bahru', 'skudai', 'gelang-patah'] },
  { name: 'Pasir Gudang', slug: 'pasir-gudang', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['johor-bahru', 'masai', 'ulu-tiram'] },
  { name: 'Kulai', slug: 'kulai', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['skudai', 'senai', 'kluang'] },
  { name: 'Senai', slug: 'senai', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['kulai', 'skudai', 'johor-bahru'] },
  { name: 'Batu Pahat', slug: 'batu-pahat', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['kluang', 'muar', 'parit-raja'] },
  { name: 'Muar', slug: 'muar', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['batu-pahat', 'segamat', 'tangkak'] },
  { name: 'Kluang', slug: 'kluang', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['batu-pahat', 'kulai', 'mersing'] },
  { name: 'Segamat', slug: 'segamat', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['muar', 'gemas', 'labis'] },
  { name: 'Mersing', slug: 'mersing', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['kluang', 'rompin', 'kota-tinggi'] },
  { name: 'Kota Tinggi', slug: 'kota-tinggi', state: 'Johor', stateSlug: 'johor', region: 'southern', nearby: ['johor-bahru', 'mersing', 'pasir-gudang'] },

  // ── Pulau Pinang ───────────────────────────────────────────────────
  { name: 'George Town', slug: 'george-town', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['gelugor', 'tanjung-bungah', 'bayan-lepas'] },
  { name: 'Gelugor', slug: 'gelugor', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['george-town', 'jelutong', 'bayan-lepas'] },
  { name: 'Bayan Lepas', slug: 'bayan-lepas', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['gelugor', 'sungai-ara', 'batu-maung'] },
  { name: 'Tanjung Bungah', slug: 'tanjung-bungah', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['george-town', 'batu-ferringhi', 'tanjung-tokong'] },
  { name: 'Batu Ferringhi', slug: 'batu-ferringhi', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['tanjung-bungah', 'teluk-bahang', 'george-town'] },
  { name: 'Butterworth', slug: 'butterworth', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['seberang-jaya', 'bukit-mertajam', 'penanti'] },
  { name: 'Bukit Mertajam', slug: 'bukit-mertajam', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['butterworth', 'seberang-jaya', 'sungai-jawi'] },
  { name: 'Seberang Jaya', slug: 'seberang-jaya', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['butterworth', 'bukit-mertajam', 'perai'] },
  { name: 'Perai', slug: 'perai', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['butterworth', 'seberang-jaya', 'penanti'] },
  { name: 'Balik Pulau', slug: 'balik-pulau', state: 'Pulau Pinang', stateSlug: 'pulau-pinang', region: 'northern', nearby: ['bayan-lepas', 'teluk-bahang', 'sungai-pinang'] },

  // ── Perak ──────────────────────────────────────────────────────────
  { name: 'Ipoh', slug: 'ipoh', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['batu-gajah', 'kampar', 'meru-raya'] },
  { name: 'Batu Gajah', slug: 'batu-gajah', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['ipoh', 'kampar', 'simpang-pulai'] },
  { name: 'Kampar', slug: 'kampar', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['batu-gajah', 'tapah', 'gopeng'] },
  { name: 'Taiping', slug: 'taiping', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['kamunting', 'kuala-kangsar', 'parit-buntar'] },
  { name: 'Kamunting', slug: 'kamunting', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['taiping', 'parit-buntar', 'simpang'] },
  { name: 'Sitiawan', slug: 'sitiawan', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['lumut', 'manjung', 'pantai-remis'] },
  { name: 'Lumut', slug: 'lumut', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['sitiawan', 'manjung', 'pangkor'] },
  { name: 'Teluk Intan', slug: 'teluk-intan', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['hutan-melintang', 'bagan-datoh', 'tapah'] },
  { name: 'Tapah', slug: 'tapah', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['kampar', 'bidor', 'teluk-intan'] },
  { name: 'Bidor', slug: 'bidor', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['tapah', 'tanjung-malim', 'sungkai'] },
  { name: 'Kuala Kangsar', slug: 'kuala-kangsar', state: 'Perak', stateSlug: 'perak', region: 'northern', nearby: ['taiping', 'sungai-siput', 'lenggong'] },

  // ── Kedah ──────────────────────────────────────────────────────────
  { name: 'Alor Setar', slug: 'alor-setar', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['jitra', 'sungai-petani', 'pokok-sena'] },
  { name: 'Sungai Petani', slug: 'sungai-petani', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['alor-setar', 'kulim', 'bedong'] },
  { name: 'Kulim', slug: 'kulim', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['sungai-petani', 'bukit-mertajam', 'serdang'] },
  { name: 'Jitra', slug: 'jitra', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['alor-setar', 'changlun', 'pokok-sena'] },
  { name: 'Changlun', slug: 'changlun', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['jitra', 'alor-setar', 'kangar'] },
  { name: 'Pokok Sena', slug: 'pokok-sena', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['alor-setar', 'jitra', 'pendang'] },
  { name: 'Pendang', slug: 'pendang', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['pokok-sena', 'sungai-petani', 'baling'] },
  { name: 'Baling', slug: 'baling', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['pendang', 'kupang', 'sik'] },
  { name: 'Yan', slug: 'yan', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['alor-setar', 'sungai-petani', 'kuala-muda'] },
  { name: 'Langkawi', slug: 'langkawi', state: 'Kedah', stateSlug: 'kedah', region: 'northern', nearby: ['kuah', 'alor-setar', 'pantai-cenang'] },

  // ── Perlis ─────────────────────────────────────────────────────────
  { name: 'Kangar', slug: 'kangar', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['arau', 'kuala-perlis', 'padang-besar'] },
  { name: 'Arau', slug: 'arau', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['kangar', 'kuala-perlis', 'simpang-empat'] },
  { name: 'Kuala Perlis', slug: 'kuala-perlis', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['kangar', 'arau', 'simpang-empat'] },
  { name: 'Padang Besar', slug: 'padang-besar', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['kangar', 'arau', 'changlun'] },
  { name: 'Simpang Empat', slug: 'simpang-empat-perlis', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['kangar', 'kuala-perlis', 'arau'] },
  { name: 'Kuala Sanglang', slug: 'kuala-sanglang', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['kuala-perlis', 'kangar', 'arau'] },
  { name: 'Beseri', slug: 'beseri', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['arau', 'kangar', 'mata-ayer'] },
  { name: 'Mata Ayer', slug: 'mata-ayer', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['beseri', 'arau', 'kangar'] },
  { name: 'Wang Kelian', slug: 'wang-kelian', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['kangar', 'padang-besar', 'arau'] },
  { name: 'Sungai Batu Pahat', slug: 'sungai-batu-pahat', state: 'Perlis', stateSlug: 'perlis', region: 'northern', nearby: ['arau', 'kangar', 'kuala-perlis'] },

  // ── Pahang ─────────────────────────────────────────────────────────
  { name: 'Kuantan', slug: 'kuantan', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['gambang', 'pekan', 'kuala-rompin'] },
  { name: 'Gambang', slug: 'gambang', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['kuantan', 'maran', 'pekan'] },
  { name: 'Bentong', slug: 'bentong', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['raub', 'karak', 'genting-highlands'] },
  { name: 'Raub', slug: 'raub', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['bentong', 'kuala-lipis', 'tras'] },
  { name: 'Karak', slug: 'karak', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['bentong', 'maran', 'temerloh'] },
  { name: 'Temerloh', slug: 'temerloh', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['mentakab', 'jerantut', 'maran'] },
  { name: 'Mentakab', slug: 'mentakab', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['temerloh', 'jerantut', 'lanchang'] },
  { name: 'Jerantut', slug: 'jerantut', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['temerloh', 'kuala-lipis', 'maran'] },
  { name: 'Pekan', slug: 'pekan', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['kuantan', 'gambang', 'kuala-rompin'] },
  { name: 'Kuala Lipis', slug: 'kuala-lipis', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['raub', 'jerantut', 'merapoh'] },
  { name: 'Cameron Highlands', slug: 'cameron-highlands', state: 'Pahang', stateSlug: 'pahang', region: 'eastCoast', nearby: ['ringlet', 'tanah-rata', 'brinchang'] },

  // ── Terengganu ─────────────────────────────────────────────────────
  { name: 'Kuala Terengganu', slug: 'kuala-terengganu', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['kuala-nerus', 'marang', 'gong-badak'] },
  { name: 'Kuala Nerus', slug: 'kuala-nerus', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['kuala-terengganu', 'gong-badak', 'kuala-besut'] },
  { name: 'Dungun', slug: 'dungun', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['paka', 'kemaman', 'marang'] },
  { name: 'Kemaman', slug: 'kemaman', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['chukai', 'kerteh', 'paka'] },
  { name: 'Chukai', slug: 'chukai', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['kemaman', 'kerteh', 'kuantan'] },
  { name: 'Kerteh', slug: 'kerteh', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['kemaman', 'chukai', 'paka'] },
  { name: 'Marang', slug: 'marang', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['kuala-terengganu', 'dungun', 'rusila'] },
  { name: 'Besut', slug: 'besut', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['jertih', 'kuala-besut', 'pasir-puteh'] },
  { name: 'Jertih', slug: 'jertih', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['besut', 'kuala-besut', 'kuala-terengganu'] },
  { name: 'Setiu', slug: 'setiu', state: 'Terengganu', stateSlug: 'terengganu', region: 'eastCoast', nearby: ['kuala-nerus', 'besut', 'penarik'] },

  // ── Kelantan ───────────────────────────────────────────────────────
  { name: 'Kota Bharu', slug: 'kota-bharu', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['ketereh', 'wakaf-bharu', 'pasir-mas'] },
  { name: 'Wakaf Bharu', slug: 'wakaf-bharu', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['kota-bharu', 'tumpat', 'pasir-mas'] },
  { name: 'Tumpat', slug: 'tumpat', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['wakaf-bharu', 'kota-bharu', 'pengkalan-kubor'] },
  { name: 'Pasir Mas', slug: 'pasir-mas', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['wakaf-bharu', 'tanah-merah', 'rantau-panjang'] },
  { name: 'Tanah Merah', slug: 'tanah-merah', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['pasir-mas', 'machang', 'kuala-krai'] },
  { name: 'Machang', slug: 'machang', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['tanah-merah', 'ketereh', 'kuala-krai'] },
  { name: 'Kuala Krai', slug: 'kuala-krai', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['tanah-merah', 'gua-musang', 'machang'] },
  { name: 'Gua Musang', slug: 'gua-musang', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['kuala-krai', 'jeli', 'merapoh'] },
  { name: 'Jeli', slug: 'jeli', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['tanah-merah', 'gua-musang', 'pasir-mas'] },
  { name: 'Bachok', slug: 'bachok', state: 'Kelantan', stateSlug: 'kelantan', region: 'eastCoast', nearby: ['kota-bharu', 'ketereh', 'pantai-irama'] },

  // ── Sarawak ────────────────────────────────────────────────────────
  { name: 'Kuching', slug: 'kuching', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['samarahan', 'serian', 'bau'] },
  { name: 'Samarahan', slug: 'samarahan', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['kuching', 'serian', 'asajaya'] },
  { name: 'Serian', slug: 'serian', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['samarahan', 'kuching', 'sri-aman'] },
  { name: 'Sri Aman', slug: 'sri-aman', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['serian', 'betong', 'lubok-antu'] },
  { name: 'Sibu', slug: 'sibu', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['mukah', 'kapit', 'sarikei'] },
  { name: 'Bintulu', slug: 'bintulu', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['sibu', 'miri', 'mukah'] },
  { name: 'Miri', slug: 'miri', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['bintulu', 'marudi', 'limbang'] },
  { name: 'Limbang', slug: 'limbang', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['miri', 'lawas', 'brunei'] },
  { name: 'Lawas', slug: 'lawas', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['limbang', 'sipitang', 'merarap'] },
  { name: 'Mukah', slug: 'mukah', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['sibu', 'bintulu', 'matu'] },
  { name: 'Bau', slug: 'bau', state: 'Sarawak', stateSlug: 'sarawak', region: 'eastMalaysia', nearby: ['kuching', 'lundu', 'serian'] },

  // ── Sabah ──────────────────────────────────────────────────────────
  { name: 'Kota Kinabalu', slug: 'kota-kinabalu', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['penampang', 'putatan', 'tuaran'] },
  { name: 'Penampang', slug: 'penampang', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['kota-kinabalu', 'putatan', 'donggongon'] },
  { name: 'Putatan', slug: 'putatan', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['kota-kinabalu', 'penampang', 'papar'] },
  { name: 'Tuaran', slug: 'tuaran', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['kota-kinabalu', 'kota-belud', 'tamparuli'] },
  { name: 'Papar', slug: 'papar', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['putatan', 'beaufort', 'kota-kinabalu'] },
  { name: 'Sandakan', slug: 'sandakan', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['lahad-datu', 'kinabatangan', 'beluran'] },
  { name: 'Tawau', slug: 'tawau', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['semporna', 'kunak', 'lahad-datu'] },
  { name: 'Lahad Datu', slug: 'lahad-datu', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['sandakan', 'kunak', 'tawau'] },
  { name: 'Keningau', slug: 'keningau', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['tambunan', 'tenom', 'sook'] },
  { name: 'Beaufort', slug: 'beaufort', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['papar', 'sipitang', 'membakut'] },
  { name: 'Semporna', slug: 'semporna', state: 'Sabah', stateSlug: 'sabah', region: 'eastMalaysia', nearby: ['tawau', 'kunak', 'lahad-datu'] },

  // ── WP Labuan ──────────────────────────────────────────────────────
  { name: 'Labuan', slug: 'labuan', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['layang-layangan', 'rancha-rancha', 'kiamsam'] },
  { name: 'Layang-Layangan', slug: 'layang-layangan', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'rancha-rancha', 'sungai-lada'] },
  { name: 'Rancha-Rancha', slug: 'rancha-rancha', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'layang-layangan', 'tanjung-aru'] },
  { name: 'Kiamsam', slug: 'kiamsam', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'layang-layangan', 'sungai-bedaun'] },
  { name: 'Sungai Lada', slug: 'sungai-lada', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'layang-layangan', 'patau-patau'] },
  { name: 'Patau-Patau', slug: 'patau-patau', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'sungai-lada', 'tanjung-aru'] },
  { name: 'Tanjung Aru', slug: 'tanjung-aru-labuan', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'rancha-rancha', 'patau-patau'] },
  { name: 'Sungai Bedaun', slug: 'sungai-bedaun', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'kiamsam', 'pohon-batu'] },
  { name: 'Pohon Batu', slug: 'pohon-batu', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['sungai-bedaun', 'kiamsam', 'labuan'] },
  { name: 'Bukit Kuda', slug: 'bukit-kuda', state: 'WP Labuan', stateSlug: 'wp-labuan', region: 'eastMalaysia', nearby: ['labuan', 'patau-patau', 'sungai-lada'] },
]

export const locationBySlug = (slug: string) =>
  locations.find((l) => l.slug === slug)

// Localised city name map — generated from the canonical list. Chinese
// translations are added where the city is well-known; other rows fall back
// to the Malay name (which is the same as English for Malaysian place names).
export const cityNames: Record<string, { ms: string; en: string; zh: string }> = Object.fromEntries(
  locations.map((l) => [l.slug, { ms: l.name, en: l.name, zh: l.name }])
)

// Override the well-known cities with hand-written Chinese names.
const ZH_OVERRIDES: Record<string, string> = {
  'kuala-lumpur': '吉隆坡',
  'petaling-jaya': '八打灵再也',
  'shah-alam': '莎阿南',
  'subang-jaya': '梳邦再也',
  'puchong': '蒲种',
  'cheras': '蕉赖',
  'ampang': '安邦',
  'klang': '巴生',
  'kajang': '加影',
  'cyberjaya': '赛城',
  'putrajaya': '布城',
  'seremban': '芙蓉',
  'melaka': '马六甲',
  'johor-bahru': '新山',
  'ipoh': '怡保',
  'george-town': '乔治市',
  'kuching': '古晋',
  'kota-kinabalu': '亚庇',
  'labuan': '纳闽',
  'kota-bharu': '哥打巴鲁',
  'kuantan': '关丹',
  'alor-setar': '亚罗士打',
  'kuala-terengganu': '瓜拉丁加奴',
  'kangar': '加央',
  'sibu': '诗巫',
  'miri': '美里',
  'bintulu': '民都鲁',
  'sandakan': '山打根',
  'tawau': '斗湖',
  'langkawi': '浮罗交怡',
}
for (const slug of Object.keys(ZH_OVERRIDES)) {
  if (cityNames[slug]) cityNames[slug].zh = ZH_OVERRIDES[slug]
}

export const cityDisplay = (slug: string, locale: string) => {
  const m = cityNames[slug]
  if (!m) return slug
  return m[locale as 'ms' | 'en' | 'zh'] ?? m.ms
}
