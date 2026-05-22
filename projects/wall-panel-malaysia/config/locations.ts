export type LocationDisplay = { en: string; ms: string; zh: string }

export interface LocationEntry {
  slug: string
  state: string
  display: LocationDisplay
  nearby: string[]
}

// Rule: every state in STATES_ORDER must have at least 10 entries below.
export const LOCATIONS: LocationEntry[] = [
  // ================== Selangor (15) ==================
  { slug: 'shah-alam', state: 'Selangor', display: { en: 'Shah Alam', ms: 'Shah Alam', zh: '莎阿南' }, nearby: ['petaling-jaya', 'subang-jaya', 'klang', 'puchong', 'kuala-lumpur', 'rawang'] },
  { slug: 'petaling-jaya', state: 'Selangor', display: { en: 'Petaling Jaya', ms: 'Petaling Jaya', zh: '八打灵再也' }, nearby: ['shah-alam', 'subang-jaya', 'kuala-lumpur', 'puchong', 'kepong', 'cheras'] },
  { slug: 'subang-jaya', state: 'Selangor', display: { en: 'Subang Jaya', ms: 'Subang Jaya', zh: '梳邦再也' }, nearby: ['petaling-jaya', 'puchong', 'shah-alam', 'kuala-lumpur', 'kajang', 'klang'] },
  { slug: 'klang', state: 'Selangor', display: { en: 'Klang', ms: 'Klang', zh: '巴生' }, nearby: ['shah-alam', 'petaling-jaya', 'subang-jaya', 'puchong', 'port-klang'] },
  { slug: 'port-klang', state: 'Selangor', display: { en: 'Port Klang', ms: 'Pelabuhan Klang', zh: '巴生港' }, nearby: ['klang', 'shah-alam', 'petaling-jaya', 'subang-jaya', 'banting'] },
  { slug: 'kajang', state: 'Selangor', display: { en: 'Kajang', ms: 'Kajang', zh: '加影' }, nearby: ['bangi', 'cheras', 'ampang', 'puchong', 'kuala-lumpur', 'subang-jaya'] },
  { slug: 'ampang', state: 'Selangor', display: { en: 'Ampang', ms: 'Ampang', zh: '安邦' }, nearby: ['cheras', 'kuala-lumpur', 'wangsa-maju', 'setapak', 'kajang'] },
  { slug: 'puchong', state: 'Selangor', display: { en: 'Puchong', ms: 'Puchong', zh: '蒲种' }, nearby: ['subang-jaya', 'petaling-jaya', 'shah-alam', 'kajang', 'bangi'] },
  { slug: 'cheras', state: 'Selangor', display: { en: 'Cheras', ms: 'Cheras', zh: '蕉赖' }, nearby: ['ampang', 'kajang', 'kuala-lumpur', 'bangi', 'cheras-kl'] },
  { slug: 'bangi', state: 'Selangor', display: { en: 'Bangi', ms: 'Bangi', zh: '万宜' }, nearby: ['kajang', 'nilai', 'seremban', 'puchong', 'cheras'] },
  { slug: 'rawang', state: 'Selangor', display: { en: 'Rawang', ms: 'Rawang', zh: '万挠' }, nearby: ['shah-alam', 'kepong', 'petaling-jaya', 'klang', 'selayang'] },
  { slug: 'selayang', state: 'Selangor', display: { en: 'Selayang', ms: 'Selayang', zh: '士拉央' }, nearby: ['rawang', 'gombak', 'kepong', 'wangsa-maju', 'kuala-lumpur'] },
  { slug: 'gombak', state: 'Selangor', display: { en: 'Gombak', ms: 'Gombak', zh: '鹅唛' }, nearby: ['selayang', 'wangsa-maju', 'setapak', 'ampang', 'kuala-lumpur'] },
  { slug: 'sepang', state: 'Selangor', display: { en: 'Sepang', ms: 'Sepang', zh: '雪邦' }, nearby: ['bangi', 'nilai', 'cyberjaya', 'putrajaya', 'kajang'] },
  { slug: 'banting', state: 'Selangor', display: { en: 'Banting', ms: 'Banting', zh: '万津' }, nearby: ['port-klang', 'klang', 'shah-alam', 'jenjarom', 'sepang'] },
  { slug: 'jenjarom', state: 'Selangor', display: { en: 'Jenjarom', ms: 'Jenjarom', zh: '仁嘉隆' }, nearby: ['banting', 'klang', 'port-klang', 'shah-alam', 'sepang'] },
  { slug: 'kuala-selangor', state: 'Selangor', display: { en: 'Kuala Selangor', ms: 'Kuala Selangor', zh: '瓜拉雪兰莪' }, nearby: ['shah-alam', 'klang', 'rawang', 'sabak-bernam', 'banting'] },
  { slug: 'sabak-bernam', state: 'Selangor', display: { en: 'Sabak Bernam', ms: 'Sabak Bernam', zh: '沙白安南' }, nearby: ['kuala-selangor', 'rawang', 'tanjung-malim', 'banting', 'klang'] },

  // ================== Kuala Lumpur (12) ==================
  { slug: 'kuala-lumpur', state: 'Kuala Lumpur', display: { en: 'Kuala Lumpur', ms: 'Kuala Lumpur', zh: '吉隆坡' }, nearby: ['petaling-jaya', 'cheras-kl', 'kepong', 'setapak', 'wangsa-maju', 'ampang'] },
  { slug: 'cheras-kl', state: 'Kuala Lumpur', display: { en: 'Cheras KL', ms: 'Cheras KL', zh: '吉隆坡蕉赖' }, nearby: ['cheras', 'kuala-lumpur', 'ampang', 'kajang', 'setapak'] },
  { slug: 'kepong', state: 'Kuala Lumpur', display: { en: 'Kepong', ms: 'Kepong', zh: '甲洞' }, nearby: ['kuala-lumpur', 'wangsa-maju', 'setapak', 'rawang', 'petaling-jaya'] },
  { slug: 'setapak', state: 'Kuala Lumpur', display: { en: 'Setapak', ms: 'Setapak', zh: '士拉央' }, nearby: ['wangsa-maju', 'kepong', 'kuala-lumpur', 'ampang', 'cheras-kl'] },
  { slug: 'wangsa-maju', state: 'Kuala Lumpur', display: { en: 'Wangsa Maju', ms: 'Wangsa Maju', zh: '旺沙玛珠' }, nearby: ['setapak', 'kepong', 'ampang', 'kuala-lumpur', 'cheras-kl'] },
  { slug: 'bangsar', state: 'Kuala Lumpur', display: { en: 'Bangsar', ms: 'Bangsar', zh: '孟沙' }, nearby: ['kuala-lumpur', 'petaling-jaya', 'mont-kiara', 'sentul', 'bukit-bintang'] },
  { slug: 'mont-kiara', state: 'Kuala Lumpur', display: { en: 'Mont Kiara', ms: 'Mont Kiara', zh: '满家乐' }, nearby: ['bangsar', 'kepong', 'kuala-lumpur', 'sentul', 'petaling-jaya'] },
  { slug: 'bukit-bintang', state: 'Kuala Lumpur', display: { en: 'Bukit Bintang', ms: 'Bukit Bintang', zh: '武吉免登' }, nearby: ['kuala-lumpur', 'bangsar', 'ampang', 'cheras-kl', 'sentul'] },
  { slug: 'sentul', state: 'Kuala Lumpur', display: { en: 'Sentul', ms: 'Sentul', zh: '增江' }, nearby: ['kuala-lumpur', 'wangsa-maju', 'kepong', 'setapak', 'bangsar'] },
  { slug: 'sri-petaling', state: 'Kuala Lumpur', display: { en: 'Sri Petaling', ms: 'Sri Petaling', zh: '斯里八打灵' }, nearby: ['kuala-lumpur', 'cheras-kl', 'puchong', 'petaling-jaya', 'bukit-jalil'] },
  { slug: 'bukit-jalil', state: 'Kuala Lumpur', display: { en: 'Bukit Jalil', ms: 'Bukit Jalil', zh: '武吉加里' }, nearby: ['sri-petaling', 'puchong', 'cheras-kl', 'kuala-lumpur', 'kajang'] },
  { slug: 'damansara', state: 'Kuala Lumpur', display: { en: 'Damansara', ms: 'Damansara', zh: '白沙罗' }, nearby: ['petaling-jaya', 'mont-kiara', 'bangsar', 'kuala-lumpur', 'kepong'] },

  // ================== Putrajaya & Cyberjaya (2) — counted under Selangor metro for FT grouping, but listed separately as their own logical city ==================
  { slug: 'putrajaya', state: 'Selangor', display: { en: 'Putrajaya', ms: 'Putrajaya', zh: '布城' }, nearby: ['cyberjaya', 'sepang', 'kajang', 'bangi', 'kuala-lumpur'] },
  { slug: 'cyberjaya', state: 'Selangor', display: { en: 'Cyberjaya', ms: 'Cyberjaya', zh: '赛城' }, nearby: ['putrajaya', 'sepang', 'kajang', 'bangi', 'puchong'] },

  // ================== Negeri Sembilan (10) ==================
  { slug: 'seremban', state: 'Negeri Sembilan', display: { en: 'Seremban', ms: 'Seremban', zh: '芙蓉' }, nearby: ['nilai', 'port-dickson', 'bangi', 'kajang', 'senawang'] },
  { slug: 'nilai', state: 'Negeri Sembilan', display: { en: 'Nilai', ms: 'Nilai', zh: '汝来' }, nearby: ['seremban', 'bangi', 'kajang', 'port-dickson', 'labu'] },
  { slug: 'port-dickson', state: 'Negeri Sembilan', display: { en: 'Port Dickson', ms: 'Port Dickson', zh: '波德申' }, nearby: ['seremban', 'nilai', 'melaka-city', 'alor-gajah', 'rembau'] },
  { slug: 'bahau', state: 'Negeri Sembilan', display: { en: 'Bahau', ms: 'Bahau', zh: '马口' }, nearby: ['kuala-pilah', 'seremban', 'segamat', 'tampin', 'rembau'] },
  { slug: 'kuala-pilah', state: 'Negeri Sembilan', display: { en: 'Kuala Pilah', ms: 'Kuala Pilah', zh: '瓜拉庇劳' }, nearby: ['bahau', 'seremban', 'rembau', 'tampin', 'nilai'] },
  { slug: 'rembau', state: 'Negeri Sembilan', display: { en: 'Rembau', ms: 'Rembau', zh: '林茂' }, nearby: ['seremban', 'tampin', 'kuala-pilah', 'port-dickson', 'bahau'] },
  { slug: 'senawang', state: 'Negeri Sembilan', display: { en: 'Senawang', ms: 'Senawang', zh: '新南旺' }, nearby: ['seremban', 'nilai', 'labu', 'mantin', 'rembau'] },
  { slug: 'tampin', state: 'Negeri Sembilan', display: { en: 'Tampin', ms: 'Tampin', zh: '淡边' }, nearby: ['rembau', 'alor-gajah', 'kuala-pilah', 'bahau', 'melaka-city'] },
  { slug: 'mantin', state: 'Negeri Sembilan', display: { en: 'Mantin', ms: 'Mantin', zh: '文丁' }, nearby: ['seremban', 'nilai', 'labu', 'senawang', 'kajang'] },
  { slug: 'labu', state: 'Negeri Sembilan', display: { en: 'Labu', ms: 'Labu', zh: '拉务' }, nearby: ['nilai', 'seremban', 'senawang', 'mantin', 'bangi'] },

  // ================== Melaka (10) ==================
  { slug: 'melaka-city', state: 'Melaka', display: { en: 'Melaka', ms: 'Melaka', zh: '马六甲市' }, nearby: ['alor-gajah', 'ayer-keroh', 'bukit-beruang', 'klebang', 'jasin'] },
  { slug: 'alor-gajah', state: 'Melaka', display: { en: 'Alor Gajah', ms: 'Alor Gajah', zh: '亚罗牙也' }, nearby: ['melaka-city', 'masjid-tanah', 'tampin', 'durian-tunggal', 'ayer-keroh'] },
  { slug: 'jasin', state: 'Melaka', display: { en: 'Jasin', ms: 'Jasin', zh: '野新' }, nearby: ['melaka-city', 'merlimau', 'tampin', 'ayer-keroh', 'bukit-beruang'] },
  { slug: 'ayer-keroh', state: 'Melaka', display: { en: 'Ayer Keroh', ms: 'Ayer Keroh', zh: '爱极乐' }, nearby: ['melaka-city', 'bukit-beruang', 'alor-gajah', 'durian-tunggal', 'klebang'] },
  { slug: 'bukit-beruang', state: 'Melaka', display: { en: 'Bukit Beruang', ms: 'Bukit Beruang', zh: '武吉勿鲁安' }, nearby: ['melaka-city', 'ayer-keroh', 'klebang', 'durian-tunggal', 'jasin'] },
  { slug: 'klebang', state: 'Melaka', display: { en: 'Klebang', ms: 'Klebang', zh: '克力邦' }, nearby: ['melaka-city', 'sungai-udang', 'bukit-beruang', 'ayer-keroh', 'alor-gajah'] },
  { slug: 'durian-tunggal', state: 'Melaka', display: { en: 'Durian Tunggal', ms: 'Durian Tunggal', zh: '榴梿洞葛' }, nearby: ['alor-gajah', 'ayer-keroh', 'melaka-city', 'bukit-beruang', 'masjid-tanah'] },
  { slug: 'masjid-tanah', state: 'Melaka', display: { en: 'Masjid Tanah', ms: 'Masjid Tanah', zh: '马接' }, nearby: ['alor-gajah', 'sungai-udang', 'durian-tunggal', 'melaka-city', 'tampin'] },
  { slug: 'merlimau', state: 'Melaka', display: { en: 'Merlimau', ms: 'Merlimau', zh: '米郎马油' }, nearby: ['jasin', 'melaka-city', 'tampin', 'ayer-keroh', 'muar'] },
  { slug: 'sungai-udang', state: 'Melaka', display: { en: 'Sungai Udang', ms: 'Sungai Udang', zh: '双溪乌浪' }, nearby: ['klebang', 'masjid-tanah', 'alor-gajah', 'melaka-city', 'durian-tunggal'] },

  // ================== Johor (10) ==================
  { slug: 'johor-bahru', state: 'Johor', display: { en: 'Johor Bahru', ms: 'Johor Bahru', zh: '新山' }, nearby: ['skudai', 'iskandar-puteri', 'pasir-gudang', 'kulai', 'pontian'] },
  { slug: 'skudai', state: 'Johor', display: { en: 'Skudai', ms: 'Skudai', zh: '士古来' }, nearby: ['johor-bahru', 'iskandar-puteri', 'kulai', 'pasir-gudang'] },
  { slug: 'iskandar-puteri', state: 'Johor', display: { en: 'Iskandar Puteri', ms: 'Iskandar Puteri', zh: '依斯干达公主城' }, nearby: ['johor-bahru', 'skudai', 'kulai', 'pasir-gudang', 'pontian'] },
  { slug: 'pasir-gudang', state: 'Johor', display: { en: 'Pasir Gudang', ms: 'Pasir Gudang', zh: '巴西古当' }, nearby: ['johor-bahru', 'skudai', 'kulai', 'iskandar-puteri'] },
  { slug: 'kulai', state: 'Johor', display: { en: 'Kulai', ms: 'Kulai', zh: '古来' }, nearby: ['johor-bahru', 'skudai', 'iskandar-puteri', 'pasir-gudang', 'kluang'] },
  { slug: 'muar', state: 'Johor', display: { en: 'Muar', ms: 'Muar', zh: '麻坡' }, nearby: ['batu-pahat', 'segamat', 'melaka-city', 'kluang', 'johor-bahru'] },
  { slug: 'batu-pahat', state: 'Johor', display: { en: 'Batu Pahat', ms: 'Batu Pahat', zh: '峇株巴辖' }, nearby: ['muar', 'kluang', 'pontian', 'johor-bahru', 'segamat'] },
  { slug: 'kluang', state: 'Johor', display: { en: 'Kluang', ms: 'Kluang', zh: '居銮' }, nearby: ['batu-pahat', 'johor-bahru', 'segamat', 'kulai', 'muar'] },
  { slug: 'segamat', state: 'Johor', display: { en: 'Segamat', ms: 'Segamat', zh: '昔加末' }, nearby: ['muar', 'kluang', 'batu-pahat', 'melaka-city', 'bahau'] },
  { slug: 'pontian', state: 'Johor', display: { en: 'Pontian', ms: 'Pontian', zh: '笨珍' }, nearby: ['johor-bahru', 'iskandar-puteri', 'kulai', 'batu-pahat', 'muar'] },
  { slug: 'kota-tinggi', state: 'Johor', display: { en: 'Kota Tinggi', ms: 'Kota Tinggi', zh: '哥打丁宜' }, nearby: ['johor-bahru', 'pasir-gudang', 'mersing', 'kluang', 'pontian'] },
  { slug: 'mersing', state: 'Johor', display: { en: 'Mersing', ms: 'Mersing', zh: '丰盛港' }, nearby: ['kota-tinggi', 'kluang', 'segamat', 'rompin', 'johor-bahru'] },

  // ================== Perak (10) ==================
  { slug: 'ipoh', state: 'Perak', display: { en: 'Ipoh', ms: 'Ipoh', zh: '怡保' }, nearby: ['taiping', 'sitiawan', 'kuala-kangsar', 'batu-gajah', 'kampar'] },
  { slug: 'taiping', state: 'Perak', display: { en: 'Taiping', ms: 'Taiping', zh: '太平' }, nearby: ['ipoh', 'kuala-kangsar', 'parit-buntar', 'butterworth', 'sungai-petani'] },
  { slug: 'sitiawan', state: 'Perak', display: { en: 'Sitiawan', ms: 'Sitiawan', zh: '实兆远' }, nearby: ['ipoh', 'lumut', 'teluk-intan', 'kampar', 'taiping'] },
  { slug: 'teluk-intan', state: 'Perak', display: { en: 'Teluk Intan', ms: 'Teluk Intan', zh: '安顺' }, nearby: ['sitiawan', 'kampar', 'tanjung-malim', 'ipoh', 'lumut'] },
  { slug: 'lumut', state: 'Perak', display: { en: 'Lumut', ms: 'Lumut', zh: '红土坎' }, nearby: ['sitiawan', 'ipoh', 'teluk-intan', 'kampar', 'taiping'] },
  { slug: 'kampar', state: 'Perak', display: { en: 'Kampar', ms: 'Kampar', zh: '金宝' }, nearby: ['ipoh', 'batu-gajah', 'tanjung-malim', 'teluk-intan', 'sitiawan'] },
  { slug: 'batu-gajah', state: 'Perak', display: { en: 'Batu Gajah', ms: 'Batu Gajah', zh: '华都牙也' }, nearby: ['ipoh', 'kampar', 'kuala-kangsar', 'teluk-intan', 'sitiawan'] },
  { slug: 'kuala-kangsar', state: 'Perak', display: { en: 'Kuala Kangsar', ms: 'Kuala Kangsar', zh: '江沙' }, nearby: ['ipoh', 'taiping', 'batu-gajah', 'parit-buntar', 'sungai-petani'] },
  { slug: 'parit-buntar', state: 'Perak', display: { en: 'Parit Buntar', ms: 'Parit Buntar', zh: '巴里文打' }, nearby: ['taiping', 'butterworth', 'sungai-petani', 'kuala-kangsar', 'ipoh'] },
  { slug: 'tanjung-malim', state: 'Perak', display: { en: 'Tanjung Malim', ms: 'Tanjung Malim', zh: '丹戎马林' }, nearby: ['kampar', 'rawang', 'ipoh', 'batu-gajah', 'teluk-intan'] },

  // ================== Penang (10) ==================
  { slug: 'georgetown', state: 'Penang', display: { en: 'George Town', ms: 'George Town', zh: '乔治市' }, nearby: ['bayan-lepas', 'butterworth', 'jelutong', 'air-itam', 'gelugor'] },
  { slug: 'bayan-lepas', state: 'Penang', display: { en: 'Bayan Lepas', ms: 'Bayan Lepas', zh: '峇央峇鲁' }, nearby: ['georgetown', 'balik-pulau', 'gelugor', 'air-itam', 'butterworth'] },
  { slug: 'butterworth', state: 'Penang', display: { en: 'Butterworth', ms: 'Butterworth', zh: '北海' }, nearby: ['georgetown', 'bukit-mertajam', 'seberang-jaya', 'simpang-ampat', 'sungai-petani'] },
  { slug: 'bukit-mertajam', state: 'Penang', display: { en: 'Bukit Mertajam', ms: 'Bukit Mertajam', zh: '大山脚' }, nearby: ['butterworth', 'seberang-jaya', 'simpang-ampat', 'georgetown', 'parit-buntar'] },
  { slug: 'seberang-jaya', state: 'Penang', display: { en: 'Seberang Jaya', ms: 'Seberang Jaya', zh: '北赖' }, nearby: ['butterworth', 'bukit-mertajam', 'simpang-ampat', 'georgetown', 'sungai-petani'] },
  { slug: 'simpang-ampat', state: 'Penang', display: { en: 'Simpang Ampat', ms: 'Simpang Ampat', zh: '双溪赖' }, nearby: ['bukit-mertajam', 'butterworth', 'seberang-jaya', 'parit-buntar', 'georgetown'] },
  { slug: 'balik-pulau', state: 'Penang', display: { en: 'Balik Pulau', ms: 'Balik Pulau', zh: '浮罗山背' }, nearby: ['bayan-lepas', 'georgetown', 'air-itam', 'gelugor', 'jelutong'] },
  { slug: 'jelutong', state: 'Penang', display: { en: 'Jelutong', ms: 'Jelutong', zh: '日落洞' }, nearby: ['georgetown', 'gelugor', 'air-itam', 'bayan-lepas', 'butterworth'] },
  { slug: 'air-itam', state: 'Penang', display: { en: 'Air Itam', ms: 'Air Itam', zh: '亚依淡' }, nearby: ['georgetown', 'jelutong', 'gelugor', 'balik-pulau', 'bayan-lepas'] },
  { slug: 'gelugor', state: 'Penang', display: { en: 'Gelugor', ms: 'Gelugor', zh: '峇都眼东' }, nearby: ['georgetown', 'jelutong', 'air-itam', 'bayan-lepas', 'butterworth'] },

  // ================== Kedah (10) ==================
  { slug: 'alor-setar', state: 'Kedah', display: { en: 'Alor Setar', ms: 'Alor Setar', zh: '亚罗士打' }, nearby: ['sungai-petani', 'jitra', 'pendang', 'kuala-kedah', 'kangar'] },
  { slug: 'sungai-petani', state: 'Kedah', display: { en: 'Sungai Petani', ms: 'Sungai Petani', zh: '双溪大年' }, nearby: ['alor-setar', 'kulim', 'butterworth', 'bayan-lepas', 'parit-buntar'] },
  { slug: 'kulim', state: 'Kedah', display: { en: 'Kulim', ms: 'Kulim', zh: '居林' }, nearby: ['sungai-petani', 'butterworth', 'bukit-mertajam', 'baling', 'alor-setar'] },
  { slug: 'langkawi', state: 'Kedah', display: { en: 'Langkawi', ms: 'Langkawi', zh: '浮罗交怡' }, nearby: ['kuala-kedah', 'alor-setar', 'kangar', 'jitra', 'sungai-petani'] },
  { slug: 'jitra', state: 'Kedah', display: { en: 'Jitra', ms: 'Jitra', zh: '日得拉' }, nearby: ['alor-setar', 'changlun', 'kangar', 'pendang', 'kuala-kedah'] },
  { slug: 'changlun', state: 'Kedah', display: { en: 'Changlun', ms: 'Changlun', zh: '樟仑' }, nearby: ['jitra', 'alor-setar', 'kangar', 'padang-besar', 'pendang'] },
  { slug: 'baling', state: 'Kedah', display: { en: 'Baling', ms: 'Baling', zh: '华玲' }, nearby: ['kulim', 'sungai-petani', 'alor-setar', 'sik', 'pendang'] },
  { slug: 'kuala-kedah', state: 'Kedah', display: { en: 'Kuala Kedah', ms: 'Kuala Kedah', zh: '瓜拉吉打' }, nearby: ['alor-setar', 'langkawi', 'pendang', 'jitra', 'sungai-petani'] },
  { slug: 'pendang', state: 'Kedah', display: { en: 'Pendang', ms: 'Pendang', zh: '本同' }, nearby: ['alor-setar', 'sungai-petani', 'kuala-kedah', 'jitra', 'yan'] },
  { slug: 'yan', state: 'Kedah', display: { en: 'Yan', ms: 'Yan', zh: '延' }, nearby: ['sungai-petani', 'alor-setar', 'pendang', 'kulim', 'kuala-kedah'] },
  { slug: 'sik', state: 'Kedah', display: { en: 'Sik', ms: 'Sik', zh: '锡' }, nearby: ['baling', 'alor-setar', 'sungai-petani', 'pendang', 'kulim'] },

  // ================== Perlis (10) ==================
  { slug: 'kangar', state: 'Perlis', display: { en: 'Kangar', ms: 'Kangar', zh: '加央' }, nearby: ['arau', 'kuala-perlis', 'simpang-empat', 'padang-besar', 'alor-setar'] },
  { slug: 'arau', state: 'Perlis', display: { en: 'Arau', ms: 'Arau', zh: '亚娄' }, nearby: ['kangar', 'simpang-empat', 'kuala-perlis', 'padang-besar', 'chuping'] },
  { slug: 'padang-besar', state: 'Perlis', display: { en: 'Padang Besar', ms: 'Padang Besar', zh: '巴东勿刹' }, nearby: ['kangar', 'arau', 'changlun', 'chuping', 'wang-kelian'] },
  { slug: 'kuala-perlis', state: 'Perlis', display: { en: 'Kuala Perlis', ms: 'Kuala Perlis', zh: '瓜拉玻璃市' }, nearby: ['kangar', 'arau', 'simpang-empat', 'sanglang', 'alor-setar'] },
  { slug: 'simpang-empat-perlis', state: 'Perlis', display: { en: 'Simpang Empat', ms: 'Simpang Empat', zh: '双溪亚齐' }, nearby: ['kangar', 'arau', 'kuala-perlis', 'sanglang', 'chuping'] },
  { slug: 'sanglang', state: 'Perlis', display: { en: 'Sanglang', ms: 'Sanglang', zh: '山朗' }, nearby: ['simpang-empat-perlis', 'kuala-perlis', 'kangar', 'arau', 'beseri'] },
  { slug: 'kaki-bukit', state: 'Perlis', display: { en: 'Kaki Bukit', ms: 'Kaki Bukit', zh: '加基武吉' }, nearby: ['wang-kelian', 'chuping', 'arau', 'kangar', 'padang-besar'] },
  { slug: 'wang-kelian', state: 'Perlis', display: { en: 'Wang Kelian', ms: 'Wang Kelian', zh: '玉漠' }, nearby: ['kaki-bukit', 'padang-besar', 'chuping', 'arau', 'kangar'] },
  { slug: 'beseri', state: 'Perlis', display: { en: 'Beseri', ms: 'Beseri', zh: '勿塞里' }, nearby: ['chuping', 'arau', 'kangar', 'sanglang', 'simpang-empat-perlis'] },
  { slug: 'chuping', state: 'Perlis', display: { en: 'Chuping', ms: 'Chuping', zh: '朱平' }, nearby: ['arau', 'padang-besar', 'kaki-bukit', 'beseri', 'wang-kelian'] },

  // ================== Kelantan (10) ==================
  { slug: 'kota-bharu', state: 'Kelantan', display: { en: 'Kota Bharu', ms: 'Kota Bharu', zh: '哥打巴鲁' }, nearby: ['tumpat', 'pasir-mas', 'bachok', 'pasir-puteh', 'rantau-panjang'] },
  { slug: 'pasir-mas', state: 'Kelantan', display: { en: 'Pasir Mas', ms: 'Pasir Mas', zh: '巴西马' }, nearby: ['kota-bharu', 'tumpat', 'rantau-panjang', 'tanah-merah', 'pasir-puteh'] },
  { slug: 'tanah-merah', state: 'Kelantan', display: { en: 'Tanah Merah', ms: 'Tanah Merah', zh: '丹那美拉' }, nearby: ['machang', 'pasir-mas', 'kuala-krai', 'kota-bharu', 'pasir-puteh'] },
  { slug: 'machang', state: 'Kelantan', display: { en: 'Machang', ms: 'Machang', zh: '马樟' }, nearby: ['tanah-merah', 'pasir-puteh', 'kuala-krai', 'kota-bharu', 'bachok'] },
  { slug: 'kuala-krai', state: 'Kelantan', display: { en: 'Kuala Krai', ms: 'Kuala Krai', zh: '瓜拉吉赖' }, nearby: ['gua-musang', 'tanah-merah', 'machang', 'kota-bharu', 'kuala-lipis'] },
  { slug: 'tumpat', state: 'Kelantan', display: { en: 'Tumpat', ms: 'Tumpat', zh: '东甲' }, nearby: ['kota-bharu', 'pasir-mas', 'rantau-panjang', 'bachok', 'pasir-puteh'] },
  { slug: 'bachok', state: 'Kelantan', display: { en: 'Bachok', ms: 'Bachok', zh: '巴朱' }, nearby: ['kota-bharu', 'pasir-puteh', 'tumpat', 'machang', 'pasir-mas'] },
  { slug: 'pasir-puteh', state: 'Kelantan', display: { en: 'Pasir Puteh', ms: 'Pasir Puteh', zh: '巴西富地' }, nearby: ['kota-bharu', 'machang', 'bachok', 'jerteh', 'tanah-merah'] },
  { slug: 'rantau-panjang', state: 'Kelantan', display: { en: 'Rantau Panjang', ms: 'Rantau Panjang', zh: '兰斗班让' }, nearby: ['pasir-mas', 'tumpat', 'kota-bharu', 'tanah-merah', 'machang'] },
  { slug: 'gua-musang', state: 'Kelantan', display: { en: 'Gua Musang', ms: 'Gua Musang', zh: '话望生' }, nearby: ['kuala-krai', 'kuala-lipis', 'tanah-merah', 'raub', 'machang'] },

  // ================== Terengganu (10) ==================
  { slug: 'kuala-terengganu', state: 'Terengganu', display: { en: 'Kuala Terengganu', ms: 'Kuala Terengganu', zh: '瓜拉丁加奴' }, nearby: ['marang', 'kuala-berang', 'setiu', 'dungun', 'kuantan'] },
  { slug: 'kemaman', state: 'Terengganu', display: { en: 'Kemaman', ms: 'Kemaman', zh: '甘马挽' }, nearby: ['kerteh', 'paka', 'dungun', 'kuantan', 'pekan'] },
  { slug: 'dungun', state: 'Terengganu', display: { en: 'Dungun', ms: 'Dungun', zh: '龙运' }, nearby: ['paka', 'kerteh', 'marang', 'kuala-terengganu', 'kemaman'] },
  { slug: 'marang', state: 'Terengganu', display: { en: 'Marang', ms: 'Marang', zh: '马朗' }, nearby: ['kuala-terengganu', 'dungun', 'kuala-berang', 'setiu', 'paka'] },
  { slug: 'kerteh', state: 'Terengganu', display: { en: 'Kerteh', ms: 'Kerteh', zh: '格地' }, nearby: ['kemaman', 'paka', 'dungun', 'kuantan', 'marang'] },
  { slug: 'besut', state: 'Terengganu', display: { en: 'Besut', ms: 'Besut', zh: '勿述' }, nearby: ['jerteh', 'setiu', 'kuala-terengganu', 'pasir-puteh', 'kota-bharu'] },
  { slug: 'setiu', state: 'Terengganu', display: { en: 'Setiu', ms: 'Setiu', zh: '实兆' }, nearby: ['besut', 'kuala-terengganu', 'jerteh', 'marang', 'kuala-berang'] },
  { slug: 'jerteh', state: 'Terengganu', display: { en: 'Jerteh', ms: 'Jerteh', zh: '日底' }, nearby: ['besut', 'setiu', 'kota-bharu', 'pasir-puteh', 'kuala-terengganu'] },
  { slug: 'paka', state: 'Terengganu', display: { en: 'Paka', ms: 'Paka', zh: '巴卡' }, nearby: ['dungun', 'kerteh', 'kemaman', 'marang', 'kuala-terengganu'] },
  { slug: 'kuala-berang', state: 'Terengganu', display: { en: 'Kuala Berang', ms: 'Kuala Berang', zh: '瓜拉勿浪' }, nearby: ['kuala-terengganu', 'marang', 'setiu', 'dungun', 'kuala-lipis'] },

  // ================== Pahang (10) ==================
  { slug: 'kuantan', state: 'Pahang', display: { en: 'Kuantan', ms: 'Kuantan', zh: '关丹' }, nearby: ['pekan', 'maran', 'temerloh', 'kerteh', 'kuala-terengganu'] },
  { slug: 'temerloh', state: 'Pahang', display: { en: 'Temerloh', ms: 'Temerloh', zh: '淡马鲁' }, nearby: ['mentakab', 'bentong', 'maran', 'jerantut', 'kuantan'] },
  { slug: 'bentong', state: 'Pahang', display: { en: 'Bentong', ms: 'Bentong', zh: '文冬' }, nearby: ['raub', 'temerloh', 'mentakab', 'rawang', 'jerantut'] },
  { slug: 'raub', state: 'Pahang', display: { en: 'Raub', ms: 'Raub', zh: '劳勿' }, nearby: ['bentong', 'kuala-lipis', 'jerantut', 'temerloh', 'mentakab'] },
  { slug: 'jerantut', state: 'Pahang', display: { en: 'Jerantut', ms: 'Jerantut', zh: '而连突' }, nearby: ['temerloh', 'mentakab', 'kuala-lipis', 'maran', 'raub'] },
  { slug: 'mentakab', state: 'Pahang', display: { en: 'Mentakab', ms: 'Mentakab', zh: '文德甲' }, nearby: ['temerloh', 'maran', 'jerantut', 'bentong', 'raub'] },
  { slug: 'maran', state: 'Pahang', display: { en: 'Maran', ms: 'Maran', zh: '马兰' }, nearby: ['kuantan', 'temerloh', 'mentakab', 'pekan', 'jerantut'] },
  { slug: 'pekan', state: 'Pahang', display: { en: 'Pekan', ms: 'Pekan', zh: '北根' }, nearby: ['kuantan', 'rompin', 'maran', 'temerloh', 'kerteh'] },
  { slug: 'kuala-lipis', state: 'Pahang', display: { en: 'Kuala Lipis', ms: 'Kuala Lipis', zh: '瓜拉立卑' }, nearby: ['raub', 'jerantut', 'bentong', 'temerloh', 'gua-musang'] },
  { slug: 'rompin', state: 'Pahang', display: { en: 'Rompin', ms: 'Rompin', zh: '云冰' }, nearby: ['pekan', 'kuantan', 'maran', 'mentakab', 'temerloh'] },
  { slug: 'cameron-highlands', state: 'Pahang', display: { en: 'Cameron Highlands', ms: 'Cameron Highlands', zh: '金马仑高原' }, nearby: ['raub', 'kuala-lipis', 'ipoh', 'tanjung-malim', 'tapah'] },
  { slug: 'genting-highlands', state: 'Pahang', display: { en: 'Genting Highlands', ms: 'Genting Highlands', zh: '云顶高原' }, nearby: ['bentong', 'raub', 'rawang', 'gombak', 'kuala-lumpur'] },

  // ================== Sabah (12) ==================
  { slug: 'kota-kinabalu', state: 'Sabah', display: { en: 'Kota Kinabalu', ms: 'Kota Kinabalu', zh: '亚庇' }, nearby: ['papar', 'ranau', 'tuaran', 'penampang', 'kudat'] },
  { slug: 'sandakan', state: 'Sabah', display: { en: 'Sandakan', ms: 'Sandakan', zh: '山打根' }, nearby: ['lahad-datu', 'kinabatangan', 'beluran', 'tawau', 'kota-kinabalu'] },
  { slug: 'tawau', state: 'Sabah', display: { en: 'Tawau', ms: 'Tawau', zh: '斗湖' }, nearby: ['lahad-datu', 'semporna', 'sandakan', 'kunak', 'kota-kinabalu'] },
  { slug: 'lahad-datu', state: 'Sabah', display: { en: 'Lahad Datu', ms: 'Lahad Datu', zh: '拿笃' }, nearby: ['sandakan', 'tawau', 'kunak', 'semporna', 'kinabatangan'] },
  { slug: 'keningau', state: 'Sabah', display: { en: 'Keningau', ms: 'Keningau', zh: '根地咬' }, nearby: ['tenom', 'tambunan', 'beaufort', 'kota-kinabalu', 'ranau'] },
  { slug: 'semporna', state: 'Sabah', display: { en: 'Semporna', ms: 'Semporna', zh: '仙本那' }, nearby: ['tawau', 'kunak', 'lahad-datu', 'sandakan', 'kota-kinabalu'] },
  { slug: 'kudat', state: 'Sabah', display: { en: 'Kudat', ms: 'Kudat', zh: '古达' }, nearby: ['kota-kinabalu', 'kota-marudu', 'pitas', 'tuaran', 'ranau'] },
  { slug: 'papar', state: 'Sabah', display: { en: 'Papar', ms: 'Papar', zh: '巴巴' }, nearby: ['kota-kinabalu', 'beaufort', 'penampang', 'tuaran', 'kuala-penyu'] },
  { slug: 'beaufort', state: 'Sabah', display: { en: 'Beaufort', ms: 'Beaufort', zh: '保佛' }, nearby: ['papar', 'sipitang', 'keningau', 'tenom', 'kuala-penyu'] },
  { slug: 'ranau', state: 'Sabah', display: { en: 'Ranau', ms: 'Ranau', zh: '兰瑙' }, nearby: ['kota-kinabalu', 'kudat', 'keningau', 'sandakan', 'tuaran'] },
  { slug: 'tuaran', state: 'Sabah', display: { en: 'Tuaran', ms: 'Tuaran', zh: '斗亚兰' }, nearby: ['kota-kinabalu', 'kudat', 'ranau', 'kota-marudu', 'papar'] },
  { slug: 'penampang', state: 'Sabah', display: { en: 'Penampang', ms: 'Penampang', zh: '兵南邦' }, nearby: ['kota-kinabalu', 'papar', 'tuaran', 'ranau', 'beaufort'] },

  // ================== Sarawak (12) ==================
  { slug: 'kuching', state: 'Sarawak', display: { en: 'Kuching', ms: 'Kuching', zh: '古晋' }, nearby: ['kota-samarahan', 'serian', 'bau', 'lundu', 'sri-aman'] },
  { slug: 'miri', state: 'Sarawak', display: { en: 'Miri', ms: 'Miri', zh: '美里' }, nearby: ['bintulu', 'marudi', 'limbang', 'lawas', 'kuching'] },
  { slug: 'sibu', state: 'Sarawak', display: { en: 'Sibu', ms: 'Sibu', zh: '诗巫' }, nearby: ['sarikei', 'bintulu', 'mukah', 'kapit', 'kuching'] },
  { slug: 'bintulu', state: 'Sarawak', display: { en: 'Bintulu', ms: 'Bintulu', zh: '民都鲁' }, nearby: ['miri', 'sibu', 'mukah', 'kapit', 'sarikei'] },
  { slug: 'sri-aman', state: 'Sarawak', display: { en: 'Sri Aman', ms: 'Sri Aman', zh: '诗里阿曼' }, nearby: ['kuching', 'sarikei', 'serian', 'kota-samarahan', 'sibu'] },
  { slug: 'kota-samarahan', state: 'Sarawak', display: { en: 'Kota Samarahan', ms: 'Kota Samarahan', zh: '哥打三马拉汉' }, nearby: ['kuching', 'serian', 'bau', 'sri-aman', 'lundu'] },
  { slug: 'sarikei', state: 'Sarawak', display: { en: 'Sarikei', ms: 'Sarikei', zh: '泗里街' }, nearby: ['sibu', 'sri-aman', 'mukah', 'bintulu', 'kapit'] },
  { slug: 'mukah', state: 'Sarawak', display: { en: 'Mukah', ms: 'Mukah', zh: '木胶' }, nearby: ['sibu', 'bintulu', 'sarikei', 'kapit', 'miri'] },
  { slug: 'limbang', state: 'Sarawak', display: { en: 'Limbang', ms: 'Limbang', zh: '林梦' }, nearby: ['miri', 'lawas', 'marudi', 'bintulu', 'sibu'] },
  { slug: 'lawas', state: 'Sarawak', display: { en: 'Lawas', ms: 'Lawas', zh: '老越' }, nearby: ['limbang', 'miri', 'marudi', 'bintulu', 'sibu'] },
  { slug: 'kapit', state: 'Sarawak', display: { en: 'Kapit', ms: 'Kapit', zh: '加帛' }, nearby: ['sibu', 'sarikei', 'bintulu', 'mukah', 'miri'] },
  { slug: 'serian', state: 'Sarawak', display: { en: 'Serian', ms: 'Serian', zh: '西连' }, nearby: ['kuching', 'kota-samarahan', 'sri-aman', 'bau', 'lundu'] },
]

export const STATES_ORDER = [
  'Selangor',
  'Kuala Lumpur',
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
]

export const STATES_DISPLAY: Record<string, { en: string; ms: string; zh: string }> = {
  Selangor: { en: 'Selangor', ms: 'Selangor', zh: '雪兰莪' },
  'Kuala Lumpur': { en: 'Kuala Lumpur', ms: 'Kuala Lumpur', zh: '吉隆坡' },
  'Negeri Sembilan': { en: 'Negeri Sembilan', ms: 'Negeri Sembilan', zh: '森美兰' },
  Melaka: { en: 'Melaka', ms: 'Melaka', zh: '马六甲' },
  Johor: { en: 'Johor', ms: 'Johor', zh: '柔佛' },
  Perak: { en: 'Perak', ms: 'Perak', zh: '霹雳' },
  Penang: { en: 'Penang', ms: 'Pulau Pinang', zh: '槟城' },
  Kedah: { en: 'Kedah', ms: 'Kedah', zh: '吉打' },
  Perlis: { en: 'Perlis', ms: 'Perlis', zh: '玻璃市' },
  Kelantan: { en: 'Kelantan', ms: 'Kelantan', zh: '吉兰丹' },
  Terengganu: { en: 'Terengganu', ms: 'Terengganu', zh: '登嘉楼' },
  Pahang: { en: 'Pahang', ms: 'Pahang', zh: '彭亨' },
  Sabah: { en: 'Sabah', ms: 'Sabah', zh: '沙巴' },
  Sarawak: { en: 'Sarawak', ms: 'Sarawak', zh: '砂拉越' },
}

export const TOP_FOOTER_LOCATIONS = [
  'kuala-lumpur',
  'petaling-jaya',
  'shah-alam',
  'subang-jaya',
  'johor-bahru',
  'georgetown',
  'ipoh',
  'melaka-city',
  'seremban',
  'kuantan',
  'kota-kinabalu',
  'kuching',
]

export function findLocation(slug: string): LocationEntry | undefined {
  return LOCATIONS.find((l) => l.slug === slug)
}

// Enforcement: every state must have at least 10 locations.
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const counts: Record<string, number> = {}
  for (const l of LOCATIONS) counts[l.state] = (counts[l.state] ?? 0) + 1
  for (const s of STATES_ORDER) {
    if ((counts[s] ?? 0) < 10) {
      throw new Error(`Location rule: state "${s}" has ${counts[s] ?? 0} locations, expected at least 10.`)
    }
  }
}
