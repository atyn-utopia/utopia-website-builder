import type { Locale } from './site'

export type LocationDisplay = Record<Locale, string>

export interface LocationEntry {
  slug: string
  state: string
  stateSlug: string
  display: LocationDisplay
  nearby: string[]
}

export const STATES_ORDER = [
  'Kuala Lumpur',
  'Selangor',
  'Johor',
  'Penang',
  'Perak',
  'Kedah',
  'Negeri Sembilan',
  'Melaka',
  'Pahang',
  'Terengganu',
  'Kelantan',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Putrajaya',
  'Labuan',
] as const

export const STATES_DISPLAY: Record<string, LocationDisplay> = {
  'Kuala Lumpur': { ms: 'Kuala Lumpur', en: 'Kuala Lumpur', zh: '吉隆坡' },
  Selangor: { ms: 'Selangor', en: 'Selangor', zh: '雪兰莪' },
  Johor: { ms: 'Johor', en: 'Johor', zh: '柔佛' },
  Penang: { ms: 'Pulau Pinang', en: 'Penang', zh: '槟城' },
  Perak: { ms: 'Perak', en: 'Perak', zh: '霹雳' },
  Kedah: { ms: 'Kedah', en: 'Kedah', zh: '吉打' },
  'Negeri Sembilan': { ms: 'Negeri Sembilan', en: 'Negeri Sembilan', zh: '森美兰' },
  Melaka: { ms: 'Melaka', en: 'Melaka', zh: '马六甲' },
  Pahang: { ms: 'Pahang', en: 'Pahang', zh: '彭亨' },
  Terengganu: { ms: 'Terengganu', en: 'Terengganu', zh: '登嘉楼' },
  Kelantan: { ms: 'Kelantan', en: 'Kelantan', zh: '吉兰丹' },
  Perlis: { ms: 'Perlis', en: 'Perlis', zh: '玻璃市' },
  Sabah: { ms: 'Sabah', en: 'Sabah', zh: '沙巴' },
  Sarawak: { ms: 'Sarawak', en: 'Sarawak', zh: '砂拉越' },
  Putrajaya: { ms: 'Putrajaya', en: 'Putrajaya', zh: '布城' },
  Labuan: { ms: 'Labuan', en: 'Labuan', zh: '纳闽' },
}

export const STATE_SLUGS: Record<string, string> = {
  'Kuala Lumpur': 'kuala-lumpur',
  Selangor: 'selangor',
  Johor: 'johor',
  Penang: 'penang',
  Perak: 'perak',
  Kedah: 'kedah',
  'Negeri Sembilan': 'negeri-sembilan',
  Melaka: 'melaka',
  Pahang: 'pahang',
  Terengganu: 'terengganu',
  Kelantan: 'kelantan',
  Perlis: 'perlis',
  Sabah: 'sabah',
  Sarawak: 'sarawak',
  Putrajaya: 'putrajaya',
  Labuan: 'labuan',
}

// nearbyMap from Sora seo-plan §7 — 160 entries × 4 nearby each
export const nearbyMap: Record<string, string[]> = {
  // --- Kuala Lumpur ---
  'kuala-lumpur': ['wangsa-maju', 'setapak', 'cheras-kl', 'petaling-jaya'],
  'wangsa-maju': ['setapak', 'kuala-lumpur', 'taman-melawati', 'ampang'],
  setapak: ['wangsa-maju', 'kuala-lumpur', 'sentul', 'taman-melawati'],
  'cheras-kl': ['kuala-lumpur', 'kajang', 'ampang', 'sri-petaling'],
  kepong: ['sentul', 'kuala-lumpur', 'rawang', 'petaling-jaya'],
  sentul: ['setapak', 'kepong', 'kuala-lumpur', 'wangsa-maju'],
  bangsar: ['kuala-lumpur', 'mont-kiara', 'petaling-jaya', 'sri-petaling'],
  'mont-kiara': ['bangsar', 'kuala-lumpur', 'kepong', 'petaling-jaya'],
  'sri-petaling': ['cheras-kl', 'bangsar', 'puchong', 'kuala-lumpur'],
  'taman-melawati': ['wangsa-maju', 'setapak', 'ampang', 'kuala-lumpur'],

  // --- Selangor ---
  'shah-alam': ['petaling-jaya', 'subang-jaya', 'klang', 'kuala-lumpur'],
  'petaling-jaya': ['shah-alam', 'subang-jaya', 'kuala-lumpur', 'puchong'],
  'subang-jaya': ['petaling-jaya', 'shah-alam', 'puchong', 'kuala-lumpur'],
  puchong: ['subang-jaya', 'cyberjaya', 'sri-petaling', 'petaling-jaya'],
  klang: ['shah-alam', 'petaling-jaya', 'subang-jaya', 'sepang'],
  kajang: ['cheras-kl', 'ampang', 'cyberjaya', 'sepang'],
  ampang: ['kuala-lumpur', 'wangsa-maju', 'taman-melawati', 'kajang'],
  rawang: ['kepong', 'shah-alam', 'kuala-lumpur', 'sentul'],
  sepang: ['cyberjaya', 'kajang', 'klang', 'puchong'],
  cyberjaya: ['puchong', 'sepang', 'kajang', 'subang-jaya'],

  // --- Johor ---
  'johor-bahru': ['iskandar-puteri', 'pasir-gudang', 'skudai', 'kota-tinggi'],
  'iskandar-puteri': ['johor-bahru', 'skudai', 'pasir-gudang', 'pontian'],
  'pasir-gudang': ['johor-bahru', 'kota-tinggi', 'iskandar-puteri', 'skudai'],
  skudai: ['johor-bahru', 'iskandar-puteri', 'pontian', 'pasir-gudang'],
  'batu-pahat': ['muar', 'kluang', 'segamat', 'pontian'],
  muar: ['batu-pahat', 'segamat', 'tampin', 'kluang'],
  kluang: ['batu-pahat', 'segamat', 'kota-tinggi', 'muar'],
  pontian: ['skudai', 'iskandar-puteri', 'batu-pahat', 'johor-bahru'],
  'kota-tinggi': ['johor-bahru', 'pasir-gudang', 'kluang', 'segamat'],
  segamat: ['muar', 'kluang', 'batu-pahat', 'bahau'],

  // --- Penang ---
  'george-town': ['gelugor', 'air-itam', 'tanjung-bungah', 'bayan-lepas'],
  'bayan-lepas': ['gelugor', 'george-town', 'air-itam', 'butterworth'],
  gelugor: ['george-town', 'bayan-lepas', 'air-itam', 'tanjung-bungah'],
  'tanjung-bungah': ['george-town', 'air-itam', 'gelugor', 'butterworth'],
  'air-itam': ['george-town', 'gelugor', 'tanjung-bungah', 'bayan-lepas'],
  butterworth: ['bukit-mertajam', 'perai', 'kepala-batas', 'george-town'],
  'bukit-mertajam': ['perai', 'butterworth', 'nibong-tebal', 'kepala-batas'],
  perai: ['butterworth', 'bukit-mertajam', 'nibong-tebal', 'kepala-batas'],
  'nibong-tebal': ['bukit-mertajam', 'perai', 'kepala-batas', 'sungai-petani'],
  'kepala-batas': ['butterworth', 'perai', 'sungai-petani', 'bukit-mertajam'],

  // --- Perak ---
  ipoh: ['kampar', 'kuala-kangsar', 'tapah', 'taiping'],
  taiping: ['kuala-kangsar', 'ipoh', 'manjung', 'lumut'],
  'teluk-intan': ['tapah', 'manjung', 'kampar', 'sitiawan'],
  'seri-iskandar': ['ipoh', 'kampar', 'manjung', 'sitiawan'],
  manjung: ['lumut', 'sitiawan', 'taiping', 'teluk-intan'],
  lumut: ['manjung', 'sitiawan', 'taiping', 'teluk-intan'],
  sitiawan: ['manjung', 'lumut', 'teluk-intan', 'taiping'],
  'kuala-kangsar': ['ipoh', 'taiping', 'tapah', 'kampar'],
  tapah: ['kampar', 'ipoh', 'teluk-intan', 'seri-iskandar'],
  kampar: ['ipoh', 'tapah', 'seri-iskandar', 'teluk-intan'],

  // --- Kedah ---
  'alor-setar': ['jitra', 'pendang', 'gurun', 'kubang-pasu'],
  'sungai-petani': ['kulim', 'gurun', 'kepala-batas', 'pendang'],
  kulim: ['sungai-petani', 'baling', 'bukit-mertajam', 'gurun'],
  langkawi: ['kuala-perlis', 'kangar', 'jitra', 'alor-setar'],
  jitra: ['alor-setar', 'kubang-pasu', 'pendang', 'kangar'],
  pendang: ['alor-setar', 'gurun', 'jitra', 'sungai-petani'],
  gurun: ['sungai-petani', 'pendang', 'alor-setar', 'kulim'],
  baling: ['kulim', 'sungai-petani', 'gurun', 'yan'],
  yan: ['gurun', 'pendang', 'sungai-petani', 'alor-setar'],
  'kubang-pasu': ['jitra', 'alor-setar', 'kangar', 'pendang'],

  // --- Negeri Sembilan ---
  seremban: ['nilai', 'senawang', 'mantin', 'rembau'],
  nilai: ['seremban', 'mantin', 'kajang', 'senawang'],
  'port-dickson': ['seremban', 'lukut', 'senawang', 'rembau'],
  senawang: ['seremban', 'mantin', 'nilai', 'rembau'],
  bahau: ['kuala-pilah', 'tampin', 'segamat', 'rembau'],
  tampin: ['rembau', 'bahau', 'kuala-pilah', 'muar'],
  rembau: ['seremban', 'tampin', 'port-dickson', 'kuala-pilah'],
  'kuala-pilah': ['bahau', 'tampin', 'rembau', 'seremban'],
  mantin: ['nilai', 'seremban', 'senawang', 'kajang'],
  lukut: ['port-dickson', 'seremban', 'senawang', 'rembau'],

  // --- Melaka ---
  melaka: ['ayer-keroh', 'bukit-baru', 'batu-berendam', 'klebang'],
  'ayer-keroh': ['melaka', 'durian-tunggal', 'alor-gajah', 'bukit-baru'],
  'batu-berendam': ['melaka', 'klebang', 'bukit-baru', 'alor-gajah'],
  'bukit-baru': ['melaka', 'batu-berendam', 'ayer-keroh', 'klebang'],
  klebang: ['melaka', 'batu-berendam', 'bukit-baru', 'masjid-tanah'],
  'masjid-tanah': ['alor-gajah', 'klebang', 'durian-tunggal', 'batu-berendam'],
  'alor-gajah': ['ayer-keroh', 'durian-tunggal', 'masjid-tanah', 'melaka'],
  jasin: ['merlimau', 'melaka', 'durian-tunggal', 'ayer-keroh'],
  merlimau: ['jasin', 'melaka', 'durian-tunggal', 'muar'],
  'durian-tunggal': ['ayer-keroh', 'alor-gajah', 'masjid-tanah', 'jasin'],

  // --- Pahang ---
  kuantan: ['pekan', 'maran', 'temerloh', 'kemaman'],
  temerloh: ['mentakab', 'maran', 'bentong', 'jerantut'],
  bentong: ['raub', 'mentakab', 'temerloh', 'rawang'],
  mentakab: ['temerloh', 'bentong', 'maran', 'jerantut'],
  raub: ['bentong', 'jerantut', 'mentakab', 'cameron-highlands'],
  jerantut: ['temerloh', 'maran', 'mentakab', 'raub'],
  pekan: ['kuantan', 'rompin', 'maran', 'temerloh'],
  'cameron-highlands': ['raub', 'bentong', 'tapah', 'ipoh'],
  maran: ['temerloh', 'jerantut', 'kuantan', 'mentakab'],
  rompin: ['pekan', 'kuantan', 'segamat', 'maran'],

  // --- Terengganu ---
  'kuala-terengganu': ['kuala-nerus', 'marang', 'setiu', 'dungun'],
  'kuala-nerus': ['kuala-terengganu', 'setiu', 'marang', 'besut'],
  dungun: ['kemaman', 'paka', 'marang', 'kuala-terengganu'],
  kemaman: ['chukai', 'paka', 'dungun', 'kuantan'],
  chukai: ['kemaman', 'paka', 'dungun', 'kuantan'],
  paka: ['dungun', 'kemaman', 'chukai', 'kuala-terengganu'],
  marang: ['kuala-terengganu', 'dungun', 'setiu', 'kuala-nerus'],
  besut: ['jerteh', 'setiu', 'kuala-nerus', 'tumpat'],
  jerteh: ['besut', 'setiu', 'kuala-nerus', 'tumpat'],
  setiu: ['kuala-nerus', 'besut', 'jerteh', 'marang'],

  // --- Kelantan ---
  'kota-bharu': ['kubang-kerian', 'pengkalan-chepa', 'bachok', 'tumpat'],
  'kubang-kerian': ['kota-bharu', 'pengkalan-chepa', 'bachok', 'tanah-merah'],
  'pengkalan-chepa': ['kota-bharu', 'kubang-kerian', 'tumpat', 'bachok'],
  'pasir-mas': ['tumpat', 'tanah-merah', 'machang', 'kota-bharu'],
  tumpat: ['kota-bharu', 'pasir-mas', 'pengkalan-chepa', 'jerteh'],
  bachok: ['kota-bharu', 'kubang-kerian', 'machang', 'pengkalan-chepa'],
  'tanah-merah': ['pasir-mas', 'machang', 'kuala-krai', 'kubang-kerian'],
  machang: ['tanah-merah', 'kuala-krai', 'bachok', 'pasir-mas'],
  'kuala-krai': ['machang', 'tanah-merah', 'gua-musang', 'jerantut'],
  'gua-musang': ['kuala-krai', 'machang', 'jerantut', 'cameron-highlands'],

  // --- Perlis ---
  kangar: ['arau', 'kuala-perlis', 'padang-besar', 'kubang-pasu'],
  arau: ['kangar', 'pauh', 'simpang-empat-perlis', 'kubang-pasu'],
  'kuala-perlis': ['kangar', 'arau', 'padang-besar', 'langkawi'],
  'padang-besar': ['kangar', 'changlun-perlis', 'mata-ayer', 'kubang-pasu'],
  'simpang-empat-perlis': ['arau', 'beseri', 'pauh', 'kangar'],
  beseri: ['simpang-empat-perlis', 'mata-ayer', 'pauh', 'santan'],
  pauh: ['arau', 'simpang-empat-perlis', 'kangar', 'beseri'],
  'changlun-perlis': ['padang-besar', 'mata-ayer', 'kubang-pasu', 'jitra'],
  'mata-ayer': ['padang-besar', 'changlun-perlis', 'beseri', 'kangar'],
  santan: ['beseri', 'simpang-empat-perlis', 'mata-ayer', 'arau'],

  // --- Sabah ---
  'kota-kinabalu': ['putatan', 'penampang', 'tuaran', 'ranau'],
  putatan: ['kota-kinabalu', 'penampang', 'tuaran', 'beaufort'],
  penampang: ['kota-kinabalu', 'putatan', 'tuaran', 'ranau'],
  tuaran: ['kota-kinabalu', 'putatan', 'penampang', 'ranau'],
  sandakan: ['lahad-datu', 'tawau', 'ranau', 'keningau'],
  tawau: ['lahad-datu', 'sandakan', 'keningau', 'beaufort'],
  'lahad-datu': ['sandakan', 'tawau', 'keningau', 'ranau'],
  keningau: ['beaufort', 'tawau', 'ranau', 'lahad-datu'],
  beaufort: ['putatan', 'keningau', 'kota-kinabalu', 'tawau'],
  ranau: ['kota-kinabalu', 'tuaran', 'sandakan', 'keningau'],

  // --- Sarawak ---
  kuching: ['kota-samarahan', 'sri-aman', 'sarikei', 'sibu'],
  'kota-samarahan': ['kuching', 'sri-aman', 'sarikei', 'sibu'],
  miri: ['bintulu', 'limbang', 'sibu', 'mukah'],
  sibu: ['mukah', 'sarikei', 'bintulu', 'kapit'],
  bintulu: ['miri', 'sibu', 'mukah', 'kapit'],
  'sri-aman': ['kuching', 'kota-samarahan', 'sarikei', 'sibu'],
  sarikei: ['sibu', 'sri-aman', 'kota-samarahan', 'mukah'],
  limbang: ['miri', 'bintulu', 'mukah', 'sibu'],
  kapit: ['sibu', 'bintulu', 'mukah', 'sarikei'],
  mukah: ['sibu', 'bintulu', 'sarikei', 'miri'],

  // --- Putrajaya ---
  putrajaya: ['cyberjaya', 'presint-5', 'presint-8', 'presint-9'],
  'presint-5': ['putrajaya', 'presint-8', 'presint-9', 'presint-11'],
  'presint-8': ['putrajaya', 'presint-5', 'presint-9', 'presint-11'],
  'presint-9': ['putrajaya', 'presint-8', 'presint-11', 'presint-14'],
  'presint-11': ['putrajaya', 'presint-9', 'presint-14', 'presint-8'],
  'presint-14': ['putrajaya', 'presint-11', 'presint-15', 'presint-16'],
  'presint-15': ['putrajaya', 'presint-14', 'presint-16', 'presint-18'],
  'presint-16': ['putrajaya', 'presint-15', 'presint-14', 'presint-18'],
  'presint-18': ['putrajaya', 'presint-15', 'presint-16', 'presint-diplomatik'],
  'presint-diplomatik': ['putrajaya', 'presint-18', 'presint-16', 'presint-15'],

  // --- Labuan ---
  labuan: ['victoria-labuan', 'rancha-rancha', 'kampung-patau-patau', 'kampung-sungai-lada'],
  'victoria-labuan': ['labuan', 'rancha-rancha', 'kampung-patau-patau', 'kampung-bebuloh'],
  'rancha-rancha': ['labuan', 'victoria-labuan', 'kampung-bebuloh', 'kampung-layang-layangan'],
  'kampung-sungai-lada': ['labuan', 'kampung-bebuloh', 'kampung-patau-patau', 'rancha-rancha'],
  'kampung-bebuloh': ['labuan', 'rancha-rancha', 'kampung-lubok-temiang', 'kampung-tanjung-aru-labuan'],
  'kampung-layang-layangan': ['labuan', 'rancha-rancha', 'kampung-batu-arang-labuan', 'kampung-lubok-temiang'],
  'kampung-patau-patau': ['labuan', 'victoria-labuan', 'kampung-sungai-lada', 'kampung-tanjung-aru-labuan'],
  'kampung-tanjung-aru-labuan': ['labuan', 'kampung-patau-patau', 'kampung-bebuloh', 'kampung-lubok-temiang'],
  'kampung-lubok-temiang': ['labuan', 'kampung-bebuloh', 'kampung-layang-layangan', 'kampung-tanjung-aru-labuan'],
  'kampung-batu-arang-labuan': ['labuan', 'kampung-layang-layangan', 'rancha-rancha', 'kampung-lubok-temiang'],
}

// Helper to build a LocationEntry with shared display (en === ms) and the nearby map
function mk(
  slug: string,
  state: (typeof STATES_ORDER)[number],
  display: string,
  zh: string,
  msOverride?: string,
  enOverride?: string,
): LocationEntry {
  return {
    slug,
    state,
    stateSlug: STATE_SLUGS[state],
    display: {
      ms: msOverride ?? display,
      en: enOverride ?? display,
      zh,
    },
    nearby: nearbyMap[slug] ?? [],
  }
}

export const LOCATIONS: LocationEntry[] = [
  // === Kuala Lumpur (10) ===
  mk('kuala-lumpur', 'Kuala Lumpur', 'Kuala Lumpur', '吉隆坡'),
  mk('wangsa-maju', 'Kuala Lumpur', 'Wangsa Maju', '旺沙玛珠'),
  mk('setapak', 'Kuala Lumpur', 'Setapak', '士拉央'),
  mk('cheras-kl', 'Kuala Lumpur', 'Cheras KL', '吉隆坡蕉赖'),
  mk('kepong', 'Kuala Lumpur', 'Kepong', '甲洞'),
  mk('sentul', 'Kuala Lumpur', 'Sentul', '增江'),
  mk('bangsar', 'Kuala Lumpur', 'Bangsar', '孟沙'),
  mk('mont-kiara', 'Kuala Lumpur', 'Mont Kiara', '满家乐'),
  mk('sri-petaling', 'Kuala Lumpur', 'Sri Petaling', '斯里八打灵'),
  mk('taman-melawati', 'Kuala Lumpur', 'Taman Melawati', '美拉华蒂'),

  // === Selangor (10) ===
  mk('shah-alam', 'Selangor', 'Shah Alam', '莎阿南'),
  mk('petaling-jaya', 'Selangor', 'Petaling Jaya', '八打灵再也'),
  mk('subang-jaya', 'Selangor', 'Subang Jaya', '梳邦再也'),
  mk('puchong', 'Selangor', 'Puchong', '蒲种'),
  mk('klang', 'Selangor', 'Klang', '巴生'),
  mk('kajang', 'Selangor', 'Kajang', '加影'),
  mk('ampang', 'Selangor', 'Ampang', '安邦'),
  mk('rawang', 'Selangor', 'Rawang', '万挠'),
  mk('sepang', 'Selangor', 'Sepang', '雪邦'),
  mk('cyberjaya', 'Selangor', 'Cyberjaya', '赛城'),

  // === Johor (10) ===
  mk('johor-bahru', 'Johor', 'Johor Bahru', '新山'),
  mk('iskandar-puteri', 'Johor', 'Iskandar Puteri', '依斯干达公主城'),
  mk('pasir-gudang', 'Johor', 'Pasir Gudang', '巴西古当'),
  mk('skudai', 'Johor', 'Skudai', '士古来'),
  mk('batu-pahat', 'Johor', 'Batu Pahat', '峇株巴辖'),
  mk('muar', 'Johor', 'Muar', '麻坡'),
  mk('kluang', 'Johor', 'Kluang', '居銮'),
  mk('pontian', 'Johor', 'Pontian', '笨珍'),
  mk('kota-tinggi', 'Johor', 'Kota Tinggi', '哥打丁宜'),
  mk('segamat', 'Johor', 'Segamat', '昔加末'),

  // === Penang (10) ===
  mk('george-town', 'Penang', 'George Town', '乔治市'),
  mk('bayan-lepas', 'Penang', 'Bayan Lepas', '峇央峇鲁'),
  mk('gelugor', 'Penang', 'Gelugor', '峇都眼东'),
  mk('tanjung-bungah', 'Penang', 'Tanjung Bungah', '丹绒武雅'),
  mk('air-itam', 'Penang', 'Air Itam', '亚依淡'),
  mk('butterworth', 'Penang', 'Butterworth', '北海'),
  mk('bukit-mertajam', 'Penang', 'Bukit Mertajam', '大山脚'),
  mk('perai', 'Penang', 'Perai', '北赖'),
  mk('nibong-tebal', 'Penang', 'Nibong Tebal', '高渊'),
  mk('kepala-batas', 'Penang', 'Kepala Batas', '甲抛峇底'),

  // === Perak (10) ===
  mk('ipoh', 'Perak', 'Ipoh', '怡保'),
  mk('taiping', 'Perak', 'Taiping', '太平'),
  mk('teluk-intan', 'Perak', 'Teluk Intan', '安顺'),
  mk('seri-iskandar', 'Perak', 'Seri Iskandar', '斯里依斯干达'),
  mk('manjung', 'Perak', 'Manjung', '曼绒'),
  mk('lumut', 'Perak', 'Lumut', '红土坎'),
  mk('sitiawan', 'Perak', 'Sitiawan', '实兆远'),
  mk('kuala-kangsar', 'Perak', 'Kuala Kangsar', '江沙'),
  mk('tapah', 'Perak', 'Tapah', '打巴'),
  mk('kampar', 'Perak', 'Kampar', '金宝'),

  // === Kedah (10) ===
  mk('alor-setar', 'Kedah', 'Alor Setar', '亚罗士打'),
  mk('sungai-petani', 'Kedah', 'Sungai Petani', '双溪大年'),
  mk('kulim', 'Kedah', 'Kulim', '居林'),
  mk('langkawi', 'Kedah', 'Langkawi', '浮罗交怡'),
  mk('jitra', 'Kedah', 'Jitra', '日得拉'),
  mk('pendang', 'Kedah', 'Pendang', '本同'),
  mk('gurun', 'Kedah', 'Gurun', '莪仑'),
  mk('baling', 'Kedah', 'Baling', '华玲'),
  mk('yan', 'Kedah', 'Yan', '燕'),
  mk('kubang-pasu', 'Kedah', 'Kubang Pasu', '哥邦巴素'),

  // === Negeri Sembilan (10) ===
  mk('seremban', 'Negeri Sembilan', 'Seremban', '芙蓉'),
  mk('nilai', 'Negeri Sembilan', 'Nilai', '汝来'),
  mk('port-dickson', 'Negeri Sembilan', 'Port Dickson', '波德申'),
  mk('senawang', 'Negeri Sembilan', 'Senawang', '新南旺'),
  mk('bahau', 'Negeri Sembilan', 'Bahau', '马口'),
  mk('tampin', 'Negeri Sembilan', 'Tampin', '淡边'),
  mk('rembau', 'Negeri Sembilan', 'Rembau', '林茂'),
  mk('kuala-pilah', 'Negeri Sembilan', 'Kuala Pilah', '瓜拉庇劳'),
  mk('mantin', 'Negeri Sembilan', 'Mantin', '文丁'),
  mk('lukut', 'Negeri Sembilan', 'Lukut', '芦骨'),

  // === Melaka (10) ===
  mk('melaka', 'Melaka', 'Melaka', '马六甲'),
  mk('ayer-keroh', 'Melaka', 'Ayer Keroh', '爱极乐'),
  mk('batu-berendam', 'Melaka', 'Batu Berendam', '峇株安南'),
  mk('bukit-baru', 'Melaka', 'Bukit Baru', '新邦'),
  mk('klebang', 'Melaka', 'Klebang', '克力邦'),
  mk('masjid-tanah', 'Melaka', 'Masjid Tanah', '马接'),
  mk('alor-gajah', 'Melaka', 'Alor Gajah', '亚罗牙也'),
  mk('jasin', 'Melaka', 'Jasin', '野新'),
  mk('merlimau', 'Melaka', 'Merlimau', '米郎马油'),
  mk('durian-tunggal', 'Melaka', 'Durian Tunggal', '榴梿洞葛'),

  // === Pahang (10) ===
  mk('kuantan', 'Pahang', 'Kuantan', '关丹'),
  mk('temerloh', 'Pahang', 'Temerloh', '淡马鲁'),
  mk('bentong', 'Pahang', 'Bentong', '文冬'),
  mk('mentakab', 'Pahang', 'Mentakab', '文德甲'),
  mk('raub', 'Pahang', 'Raub', '劳勿'),
  mk('jerantut', 'Pahang', 'Jerantut', '而连突'),
  mk('pekan', 'Pahang', 'Pekan', '北根'),
  mk('cameron-highlands', 'Pahang', 'Cameron Highlands', '金马仑高原'),
  mk('maran', 'Pahang', 'Maran', '马兰'),
  mk('rompin', 'Pahang', 'Rompin', '云冰'),

  // === Terengganu (10) ===
  mk('kuala-terengganu', 'Terengganu', 'Kuala Terengganu', '瓜拉登嘉楼'),
  mk('kuala-nerus', 'Terengganu', 'Kuala Nerus', '瓜拉尼鲁'),
  mk('dungun', 'Terengganu', 'Dungun', '龙运'),
  mk('kemaman', 'Terengganu', 'Kemaman', '甘马挽'),
  mk('chukai', 'Terengganu', 'Chukai', '朱盖'),
  mk('paka', 'Terengganu', 'Paka', '柏卡'),
  mk('marang', 'Terengganu', 'Marang', '马江'),
  mk('besut', 'Terengganu', 'Besut', '勿述'),
  mk('jerteh', 'Terengganu', 'Jerteh', '日底'),
  mk('setiu', 'Terengganu', 'Setiu', '实兆'),

  // === Kelantan (10) ===
  mk('kota-bharu', 'Kelantan', 'Kota Bharu', '哥打巴鲁'),
  mk('kubang-kerian', 'Kelantan', 'Kubang Kerian', '哥邦克里安'),
  mk('pengkalan-chepa', 'Kelantan', 'Pengkalan Chepa', '彭加兰之巴'),
  mk('pasir-mas', 'Kelantan', 'Pasir Mas', '巴西马'),
  mk('tumpat', 'Kelantan', 'Tumpat', '丹波'),
  mk('bachok', 'Kelantan', 'Bachok', '巴乔'),
  mk('tanah-merah', 'Kelantan', 'Tanah Merah', '丹那美拉'),
  mk('machang', 'Kelantan', 'Machang', '马樟'),
  mk('kuala-krai', 'Kelantan', 'Kuala Krai', '瓜拉吉赖'),
  mk('gua-musang', 'Kelantan', 'Gua Musang', '话望生'),

  // === Perlis (10) ===
  mk('kangar', 'Perlis', 'Kangar', '加央'),
  mk('arau', 'Perlis', 'Arau', '亚娄'),
  mk('kuala-perlis', 'Perlis', 'Kuala Perlis', '瓜拉玻璃市'),
  mk('padang-besar', 'Perlis', 'Padang Besar', '巴东勿刹'),
  mk('simpang-empat-perlis', 'Perlis', 'Simpang Empat Perlis', '玻璃市新邦'),
  mk('beseri', 'Perlis', 'Beseri', '勿色拉'),
  mk('pauh', 'Perlis', 'Pauh', '巴乌'),
  mk('changlun-perlis', 'Perlis', 'Changlun Perlis', '玻璃市章伦'),
  mk('mata-ayer', 'Perlis', 'Mata Ayer', '马打耶'),
  mk('santan', 'Perlis', 'Santan', '山旦'),

  // === Sabah (10) ===
  mk('kota-kinabalu', 'Sabah', 'Kota Kinabalu', '亚庇'),
  mk('putatan', 'Sabah', 'Putatan', '布达旦'),
  mk('penampang', 'Sabah', 'Penampang', '兵南邦'),
  mk('tuaran', 'Sabah', 'Tuaran', '斗亚兰'),
  mk('sandakan', 'Sabah', 'Sandakan', '山打根'),
  mk('tawau', 'Sabah', 'Tawau', '斗湖'),
  mk('lahad-datu', 'Sabah', 'Lahad Datu', '拿笃'),
  mk('keningau', 'Sabah', 'Keningau', '根地咬'),
  mk('beaufort', 'Sabah', 'Beaufort', '保佛'),
  mk('ranau', 'Sabah', 'Ranau', '兰瑙'),

  // === Sarawak (10) ===
  mk('kuching', 'Sarawak', 'Kuching', '古晋'),
  mk('kota-samarahan', 'Sarawak', 'Kota Samarahan', '哥打三马拉汉'),
  mk('miri', 'Sarawak', 'Miri', '美里'),
  mk('sibu', 'Sarawak', 'Sibu', '诗巫'),
  mk('bintulu', 'Sarawak', 'Bintulu', '民都鲁'),
  mk('sri-aman', 'Sarawak', 'Sri Aman', '斯里阿曼'),
  mk('sarikei', 'Sarawak', 'Sarikei', '泗里街'),
  mk('limbang', 'Sarawak', 'Limbang', '林梦'),
  mk('kapit', 'Sarawak', 'Kapit', '加帛'),
  mk('mukah', 'Sarawak', 'Mukah', '木胶'),

  // === Putrajaya (10) ===
  mk('putrajaya', 'Putrajaya', 'Putrajaya', '布城'),
  mk('presint-5', 'Putrajaya', 'Presint 5', '第五区'),
  mk('presint-8', 'Putrajaya', 'Presint 8', '第八区'),
  mk('presint-9', 'Putrajaya', 'Presint 9', '第九区'),
  mk('presint-11', 'Putrajaya', 'Presint 11', '第十一区'),
  mk('presint-14', 'Putrajaya', 'Presint 14', '第十四区'),
  mk('presint-15', 'Putrajaya', 'Presint 15', '第十五区'),
  mk('presint-16', 'Putrajaya', 'Presint 16', '第十六区'),
  mk('presint-18', 'Putrajaya', 'Presint 18', '第十八区'),
  mk('presint-diplomatik', 'Putrajaya', 'Presint Diplomatik', '外交区'),

  // === Labuan (10) ===
  mk('labuan', 'Labuan', 'Labuan', '纳闽'),
  mk('victoria-labuan', 'Labuan', 'Victoria Labuan', '维多利亚纳闽'),
  mk('rancha-rancha', 'Labuan', 'Rancha-Rancha', '兰查兰查'),
  mk('kampung-sungai-lada', 'Labuan', 'Kampung Sungai Lada', '双溪拉达村'),
  mk('kampung-bebuloh', 'Labuan', 'Kampung Bebuloh', '勿浮罗村'),
  mk('kampung-layang-layangan', 'Labuan', 'Kampung Layang-Layangan', '燕村'),
  mk('kampung-patau-patau', 'Labuan', 'Kampung Patau-Patau', '巴道巴道村'),
  mk('kampung-tanjung-aru-labuan', 'Labuan', 'Kampung Tanjung Aru Labuan', '丹绒阿鲁村'),
  mk('kampung-lubok-temiang', 'Labuan', 'Kampung Lubok Temiang', '罗谷地米央村'),
  mk('kampung-batu-arang-labuan', 'Labuan', 'Kampung Batu Arang Labuan', '峇都阿郎村'),
]

// Top 12 marquee cities for footer / homepage prominence (per seo-plan §6.1)
export const TOP_FOOTER_LOCATIONS = [
  'kuala-lumpur',
  'petaling-jaya',
  'shah-alam',
  'subang-jaya',
  'johor-bahru',
  'george-town',
  'ipoh',
  'seremban',
  'melaka',
  'kuantan',
  'kuching',
  'kota-kinabalu',
] as const

export const locations = LOCATIONS

export function findLocation(slug: string): LocationEntry | undefined {
  return LOCATIONS.find((l) => l.slug === slug)
}
export const getLocation = findLocation

export function getNearbyLocations(slug: string): LocationEntry[] {
  const target = findLocation(slug)
  if (!target) return []
  return target.nearby
    .map((s) => findLocation(s))
    .filter((l): l is LocationEntry => !!l)
}

export function getLocationsByStateSlug(stateSlug: string): LocationEntry[] {
  return LOCATIONS.filter((l) => l.stateSlug === stateSlug)
}

export function getLocationsByState(state: string): LocationEntry[] {
  return LOCATIONS.filter((l) => l.state === state)
}

// Dev-time enforcement: every state must have ≥10 locations
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const counts: Record<string, number> = {}
  for (const l of LOCATIONS) counts[l.state] = (counts[l.state] ?? 0) + 1
  for (const s of STATES_ORDER) {
    if ((counts[s] ?? 0) < 10) {
      // eslint-disable-next-line no-console
      console.warn(`[locations] state "${s}" has ${counts[s] ?? 0} entries (expected ≥10)`)
    }
  }
}
