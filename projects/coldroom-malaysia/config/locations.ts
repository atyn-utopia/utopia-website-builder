// config/locations.ts
// 153 real, populated Peninsular Malaysia sub-locations across 13 states.

export interface Location {
  slug: string;
  name: string;
  name_ms?: string;
  name_zh: string;
  state: string;
  stateSlug: string;
  nearby: string[];
}

export interface State {
  slug: string;
  name: string;
  name_ms: string;
  name_zh: string;
}

export const STATES: State[] = [
  { slug: 'kuala-lumpur',     name: 'Kuala Lumpur',     name_ms: 'Kuala Lumpur',     name_zh: '吉隆坡' },
  { slug: 'selangor',         name: 'Selangor',         name_ms: 'Selangor',         name_zh: '雪兰莪' },
  { slug: 'putrajaya',        name: 'Putrajaya',        name_ms: 'Putrajaya',        name_zh: '布城' },
  { slug: 'johor',            name: 'Johor',            name_ms: 'Johor',            name_zh: '柔佛' },
  { slug: 'penang',           name: 'Penang',           name_ms: 'Pulau Pinang',     name_zh: '槟城' },
  { slug: 'perak',            name: 'Perak',            name_ms: 'Perak',            name_zh: '霹雳' },
  { slug: 'negeri-sembilan',  name: 'Negeri Sembilan',  name_ms: 'Negeri Sembilan',  name_zh: '森美兰' },
  { slug: 'melaka',           name: 'Melaka',           name_ms: 'Melaka',           name_zh: '马六甲' },
  { slug: 'kedah',            name: 'Kedah',            name_ms: 'Kedah',            name_zh: '吉打' },
  { slug: 'kelantan',         name: 'Kelantan',         name_ms: 'Kelantan',         name_zh: '吉兰丹' },
  { slug: 'terengganu',       name: 'Terengganu',       name_ms: 'Terengganu',       name_zh: '登嘉楼' },
  { slug: 'pahang',           name: 'Pahang',           name_ms: 'Pahang',           name_zh: '彭亨' },
  { slug: 'perlis',           name: 'Perlis',           name_ms: 'Perlis',           name_zh: '玻璃市' },
];

export const locations: Location[] = [
  // Kuala Lumpur (15)
  { slug: 'cheras',         name: 'Cheras',         name_zh: '蕉赖',     state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['ampang','pudu','bukit-bintang','sri-petaling','seputeh','setapak'] },
  { slug: 'setapak',        name: 'Setapak',        name_zh: '泗岩沫',   state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['wangsa-maju','sentul','batu-caves','kepong','ampang','cheras'] },
  { slug: 'pudu',           name: 'Pudu',           name_zh: '富都',     state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['bukit-bintang','cheras','brickfields','seputeh','sentul','ampang'] },
  { slug: 'kepong',         name: 'Kepong',         name_zh: '甲洞',     state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['batu-caves','sentul','setapak','mont-kiara','sungai-buloh','selayang'] },
  { slug: 'bangsar',        name: 'Bangsar',        name_zh: '孟沙',     state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['brickfields','seputeh','mont-kiara','ttdi','bukit-bintang','petaling-jaya'] },
  { slug: 'sri-petaling',   name: 'Sri Petaling',   name_zh: '斯里白沙罗',state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['seputeh','cheras','puchong','sungai-buloh','setapak','pudu'] },
  { slug: 'brickfields',    name: 'Brickfields',    name_zh: '十五碑',   state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['bangsar','pudu','seputeh','bukit-bintang','sentul','mont-kiara'] },
  { slug: 'wangsa-maju',    name: 'Wangsa Maju',    name_zh: '旺沙玛珠', state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['setapak','sentul','ampang','batu-caves','cheras','kepong'] },
  { slug: 'ttdi',           name: 'TTDI',           name_zh: '哥打白沙罗',state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['mont-kiara','bangsar','petaling-jaya','kepong','seputeh','sungai-buloh'] },
  { slug: 'seputeh',        name: 'Seputeh',        name_zh: '士布爹',   state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['bangsar','brickfields','sri-petaling','pudu','cheras','mont-kiara'] },
  { slug: 'mont-kiara',     name: 'Mont Kiara',     name_zh: '满家乐',   state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['ttdi','bangsar','kepong','sentul','petaling-jaya','sungai-buloh'] },
  { slug: 'bukit-bintang',  name: 'Bukit Bintang',  name_zh: '武吉免登', state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['pudu','cheras','brickfields','bangsar','sentul','ampang'] },
  { slug: 'sentul',         name: 'Sentul',         name_zh: '增江',     state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['setapak','kepong','wangsa-maju','batu-caves','pudu','bukit-bintang'] },
  { slug: 'ampang',         name: 'Ampang',         name_zh: '安邦',     state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['cheras','wangsa-maju','setapak','pudu','bukit-bintang','kajang'] },
  { slug: 'batu-caves',     name: 'Batu Caves',     name_zh: '黑风洞',   state: 'Kuala Lumpur', stateSlug: 'kuala-lumpur', nearby: ['kepong','setapak','sentul','selayang','wangsa-maju','rawang'] },

  // Selangor (21)
  { slug: 'petaling-jaya',  name: 'Petaling Jaya',  name_zh: '八打灵再也',state: 'Selangor', stateSlug: 'selangor', nearby: ['shah-alam','subang-jaya','bangsar','ttdi','puchong','kelana-jaya'] },
  { slug: 'shah-alam',      name: 'Shah Alam',      name_zh: '莎阿南',   state: 'Selangor', stateSlug: 'selangor', nearby: ['petaling-jaya','klang','subang-jaya','setia-alam','puchong','sungai-buloh'] },
  { slug: 'klang',          name: 'Klang',          name_zh: '巴生',     state: 'Selangor', stateSlug: 'selangor', nearby: ['port-klang','shah-alam','setia-alam','bukit-kemuning','puchong','kota-kemuning'] },
  { slug: 'port-klang',     name: 'Port Klang',     name_zh: '巴生港',   state: 'Selangor', stateSlug: 'selangor', nearby: ['klang','shah-alam','bukit-kemuning','kota-kemuning','setia-alam','puchong'] },
  { slug: 'subang-jaya',    name: 'Subang Jaya',    name_zh: '梳邦再也', state: 'Selangor', stateSlug: 'selangor', nearby: ['petaling-jaya','puchong','shah-alam','kelana-jaya','setia-alam','sungai-buloh'] },
  { slug: 'puchong',        name: 'Puchong',        name_zh: '蒲种',     state: 'Selangor', stateSlug: 'selangor', nearby: ['subang-jaya','sri-petaling','cyberjaya','kajang','shah-alam','serdang'] },
  { slug: 'cyberjaya',      name: 'Cyberjaya',      name_zh: '赛城',     state: 'Selangor', stateSlug: 'selangor', nearby: ['putrajaya','sepang','puchong','bangi','kajang','serdang'] },
  { slug: 'kajang',         name: 'Kajang',         name_zh: '加影',     state: 'Selangor', stateSlug: 'selangor', nearby: ['bangi','semenyih','serdang','cheras','puchong','ampang'] },
  { slug: 'bangi',          name: 'Bangi',          name_zh: '万宜',     state: 'Selangor', stateSlug: 'selangor', nearby: ['kajang','semenyih','serdang','cyberjaya','sepang','puchong'] },
  { slug: 'sepang',         name: 'Sepang',         name_zh: '雪邦',     state: 'Selangor', stateSlug: 'selangor', nearby: ['cyberjaya','putrajaya','bangi','kajang','semenyih','nilai'] },
  { slug: 'rawang',         name: 'Rawang',         name_zh: '万挠',     state: 'Selangor', stateSlug: 'selangor', nearby: ['selayang','sungai-buloh','serendah','batu-caves','rasa','kepong'] },
  { slug: 'selayang',       name: 'Selayang',       name_zh: '士拉央',   state: 'Selangor', stateSlug: 'selangor', nearby: ['batu-caves','rawang','sungai-buloh','kepong','setapak','wangsa-maju'] },
  { slug: 'setia-alam',     name: 'Setia Alam',     name_zh: '实达阿南', state: 'Selangor', stateSlug: 'selangor', nearby: ['shah-alam','klang','sungai-buloh','kota-kemuning','bukit-kemuning','puchong'] },
  { slug: 'semenyih',       name: 'Semenyih',       name_zh: '士毛月',   state: 'Selangor', stateSlug: 'selangor', nearby: ['kajang','bangi','serdang','cheras','sepang','nilai'] },
  { slug: 'serdang',        name: 'Serdang',        name_zh: '沙登',     state: 'Selangor', stateSlug: 'selangor', nearby: ['kajang','puchong','sri-petaling','bangi','cheras','cyberjaya'] },
  { slug: 'bukit-kemuning', name: 'Bukit Kemuning', name_zh: '武吉甘文', state: 'Selangor', stateSlug: 'selangor', nearby: ['kota-kemuning','klang','shah-alam','setia-alam','puchong','port-klang'] },
  { slug: 'kota-kemuning',  name: 'Kota Kemuning',  name_zh: '哥打甘文宁',state: 'Selangor', stateSlug: 'selangor', nearby: ['bukit-kemuning','klang','shah-alam','puchong','port-klang','setia-alam'] },
  { slug: 'sungai-buloh',   name: 'Sungai Buloh',   name_zh: '双溪毛糯', state: 'Selangor', stateSlug: 'selangor', nearby: ['rawang','selayang','setia-alam','kepong','shah-alam','mont-kiara'] },
  { slug: 'serendah',       name: 'Serendah',       name_zh: '双文丹',   state: 'Selangor', stateSlug: 'selangor', nearby: ['rawang','rasa','selayang','sungai-buloh','batu-caves','tanjung-malim'] },
  { slug: 'rasa',           name: 'Rasa',           name_zh: '叻沙',     state: 'Selangor', stateSlug: 'selangor', nearby: ['rawang','serendah','selayang','batu-caves','sungai-buloh','tanjung-malim'] },
  { slug: 'kelana-jaya',    name: 'Kelana Jaya',    name_zh: '格拉那再也',state: 'Selangor', stateSlug: 'selangor', nearby: ['petaling-jaya','subang-jaya','shah-alam','ttdi','setia-alam','puchong'] },

  // Putrajaya (10)
  { slug: 'putrajaya',           name: 'Putrajaya',           name_zh: '布城',         state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['cyberjaya','sepang','bangi','kajang','sri-petaling','serdang'] },
  { slug: 'precinct-1',          name: 'Precinct 1',          name_zh: '布城第1区',    state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-2','precinct-5','precinct-7','putrajaya','cyberjaya','sepang'] },
  { slug: 'precinct-2',          name: 'Precinct 2',          name_zh: '布城第2区',    state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-1','precinct-5','precinct-7','putrajaya','cyberjaya','sepang'] },
  { slug: 'precinct-5',          name: 'Precinct 5',          name_zh: '布城第5区',    state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-1','precinct-2','precinct-7','putrajaya','cyberjaya','sepang'] },
  { slug: 'precinct-7',          name: 'Precinct 7',          name_zh: '布城第7区',    state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-5','precinct-8','precinct-9','putrajaya','cyberjaya','bangi'] },
  { slug: 'precinct-8',          name: 'Precinct 8',          name_zh: '布城第8区',    state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-7','precinct-9','precinct-11','putrajaya','cyberjaya','bangi'] },
  { slug: 'precinct-9',          name: 'Precinct 9',          name_zh: '布城第9区',    state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-8','precinct-11','precinct-14','putrajaya','cyberjaya','sepang'] },
  { slug: 'precinct-11',         name: 'Precinct 11',         name_zh: '布城第11区',   state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-9','precinct-14','precinct-16','putrajaya','cyberjaya','sepang'] },
  { slug: 'precinct-14',         name: 'Precinct 14',         name_zh: '布城第14区',   state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-11','precinct-16','precinct-9','putrajaya','cyberjaya','sepang'] },
  { slug: 'precinct-16',         name: 'Precinct 16',         name_zh: '布城第16区',   state: 'Putrajaya', stateSlug: 'putrajaya', nearby: ['precinct-14','precinct-11','precinct-9','putrajaya','cyberjaya','sepang'] },

  // Johor (14)
  { slug: 'johor-bahru',     name: 'Johor Bahru',     name_zh: '新山',     state: 'Johor', stateSlug: 'johor', nearby: ['pasir-gudang','iskandar-puteri','skudai','kulai','senai','pontian'] },
  { slug: 'pasir-gudang',    name: 'Pasir Gudang',    name_zh: '巴西古当', state: 'Johor', stateSlug: 'johor', nearby: ['johor-bahru','kulai','senai','iskandar-puteri','skudai','mersing'] },
  { slug: 'iskandar-puteri', name: 'Iskandar Puteri', name_zh: '依斯干达公主城',state: 'Johor', stateSlug: 'johor', nearby: ['johor-bahru','skudai','senai','kulai','pontian','pasir-gudang'] },
  { slug: 'kulai',           name: 'Kulai',           name_zh: '古来',     state: 'Johor', stateSlug: 'johor', nearby: ['senai','johor-bahru','skudai','kluang','pasir-gudang','iskandar-puteri'] },
  { slug: 'skudai',          name: 'Skudai',          name_zh: '士古来',   state: 'Johor', stateSlug: 'johor', nearby: ['johor-bahru','iskandar-puteri','senai','kulai','pasir-gudang','pontian'] },
  { slug: 'senai',           name: 'Senai',           name_zh: '士乃',     state: 'Johor', stateSlug: 'johor', nearby: ['kulai','skudai','johor-bahru','iskandar-puteri','pasir-gudang','kluang'] },
  { slug: 'muar',            name: 'Muar',            name_zh: '麻坡',     state: 'Johor', stateSlug: 'johor', nearby: ['batu-pahat','tangkak','segamat','yong-peng','melaka-city','jasin'] },
  { slug: 'batu-pahat',      name: 'Batu Pahat',      name_zh: '峇株巴辖', state: 'Johor', stateSlug: 'johor', nearby: ['muar','kluang','yong-peng','pontian','segamat','tangkak'] },
  { slug: 'kluang',          name: 'Kluang',          name_zh: '居銮',     state: 'Johor', stateSlug: 'johor', nearby: ['batu-pahat','segamat','kulai','yong-peng','mersing','muar'] },
  { slug: 'pontian',         name: 'Pontian',         name_zh: '笨珍',     state: 'Johor', stateSlug: 'johor', nearby: ['iskandar-puteri','johor-bahru','batu-pahat','kulai','skudai','muar'] },
  { slug: 'segamat',         name: 'Segamat',         name_zh: '昔加末',   state: 'Johor', stateSlug: 'johor', nearby: ['muar','kluang','batu-pahat','tangkak','yong-peng','jasin'] },
  { slug: 'tangkak',         name: 'Tangkak',         name_zh: '东甲',     state: 'Johor', stateSlug: 'johor', nearby: ['muar','segamat','jasin','batu-pahat','melaka-city','yong-peng'] },
  { slug: 'mersing',         name: 'Mersing',         name_zh: '丰盛港',   state: 'Johor', stateSlug: 'johor', nearby: ['kluang','segamat','kuantan','pekan','batu-pahat','muar'] },
  { slug: 'yong-peng',       name: 'Yong Peng',       name_zh: '永平',     state: 'Johor', stateSlug: 'johor', nearby: ['batu-pahat','muar','segamat','kluang','tangkak','pontian'] },

  // Penang (11)
  { slug: 'george-town',      name: 'George Town',      name_zh: '乔治市',     state: 'Penang', stateSlug: 'penang', nearby: ['air-itam','jelutong','tanjung-tokong','tanjung-bungah','butterworth','bayan-lepas'] },
  { slug: 'bayan-lepas',      name: 'Bayan Lepas',      name_zh: '峇央峇鲁',   state: 'Penang', stateSlug: 'penang', nearby: ['george-town','jelutong','air-itam','balik-pulau','butterworth','bukit-mertajam'] },
  { slug: 'butterworth',      name: 'Butterworth',      name_zh: '北海',       state: 'Penang', stateSlug: 'penang', nearby: ['seberang-perai','bukit-mertajam','george-town','nibong-tebal','sungai-petani','parit-buntar'] },
  { slug: 'bukit-mertajam',   name: 'Bukit Mertajam',   name_zh: '大山脚',     state: 'Penang', stateSlug: 'penang', nearby: ['butterworth','seberang-perai','nibong-tebal','parit-buntar','sungai-petani','kulim'] },
  { slug: 'seberang-perai',   name: 'Seberang Perai',   name_zh: '威省',       state: 'Penang', stateSlug: 'penang', nearby: ['butterworth','bukit-mertajam','nibong-tebal','parit-buntar','sungai-petani','kulim'] },
  { slug: 'tanjung-tokong',   name: 'Tanjung Tokong',   name_zh: '丹绒道光',   state: 'Penang', stateSlug: 'penang', nearby: ['george-town','tanjung-bungah','air-itam','jelutong','butterworth','balik-pulau'] },
  { slug: 'air-itam',         name: 'Air Itam',         name_zh: '亚依淡',     state: 'Penang', stateSlug: 'penang', nearby: ['george-town','jelutong','bayan-lepas','tanjung-tokong','balik-pulau','tanjung-bungah'] },
  { slug: 'jelutong',         name: 'Jelutong',         name_zh: '日落洞',     state: 'Penang', stateSlug: 'penang', nearby: ['george-town','air-itam','bayan-lepas','tanjung-tokong','butterworth','balik-pulau'] },
  { slug: 'tanjung-bungah',   name: 'Tanjung Bungah',   name_zh: '丹绒武雅',   state: 'Penang', stateSlug: 'penang', nearby: ['tanjung-tokong','george-town','air-itam','balik-pulau','jelutong','butterworth'] },
  { slug: 'balik-pulau',      name: 'Balik Pulau',      name_zh: '浮罗山背',   state: 'Penang', stateSlug: 'penang', nearby: ['bayan-lepas','air-itam','tanjung-bungah','george-town','tanjung-tokong','butterworth'] },
  { slug: 'nibong-tebal',     name: 'Nibong Tebal',     name_zh: '高渊',       state: 'Penang', stateSlug: 'penang', nearby: ['bukit-mertajam','butterworth','parit-buntar','seberang-perai','sungai-petani','kulim'] },

  // Perak (12)
  { slug: 'ipoh',             name: 'Ipoh',             name_zh: '怡保',       state: 'Perak', stateSlug: 'perak', nearby: ['batu-gajah','kampar','kuala-kangsar','taiping','tanjung-malim','sitiawan'] },
  { slug: 'taiping',          name: 'Taiping',          name_zh: '太平',       state: 'Perak', stateSlug: 'perak', nearby: ['kuala-kangsar','ipoh','parit-buntar','bagan-serai','manjung','sitiawan'] },
  { slug: 'teluk-intan',      name: 'Teluk Intan',      name_zh: '安顺',       state: 'Perak', stateSlug: 'perak', nearby: ['sitiawan','manjung','kampar','batu-gajah','tanjung-malim','lumut'] },
  { slug: 'sitiawan',         name: 'Sitiawan',         name_zh: '实兆远',     state: 'Perak', stateSlug: 'perak', nearby: ['lumut','manjung','teluk-intan','kampar','ipoh','taiping'] },
  { slug: 'lumut',            name: 'Lumut',            name_zh: '红土坎',     state: 'Perak', stateSlug: 'perak', nearby: ['sitiawan','manjung','teluk-intan','ipoh','taiping','kampar'] },
  { slug: 'manjung',          name: 'Manjung',          name_zh: '曼绒',       state: 'Perak', stateSlug: 'perak', nearby: ['sitiawan','lumut','teluk-intan','ipoh','taiping','kampar'] },
  { slug: 'kampar',           name: 'Kampar',           name_zh: '金宝',       state: 'Perak', stateSlug: 'perak', nearby: ['batu-gajah','ipoh','tanjung-malim','sitiawan','teluk-intan','manjung'] },
  { slug: 'tanjung-malim',    name: 'Tanjung Malim',    name_zh: '丹绒马林',   state: 'Perak', stateSlug: 'perak', nearby: ['kampar','ipoh','rasa','serendah','rawang','batu-gajah'] },
  { slug: 'parit-buntar',     name: 'Parit Buntar',     name_zh: '巴里文打',   state: 'Perak', stateSlug: 'perak', nearby: ['bagan-serai','taiping','nibong-tebal','butterworth','sungai-petani','kuala-kangsar'] },
  { slug: 'bagan-serai',      name: 'Bagan Serai',      name_zh: '峇眼色海',   state: 'Perak', stateSlug: 'perak', nearby: ['parit-buntar','taiping','kuala-kangsar','ipoh','sungai-petani','butterworth'] },
  { slug: 'kuala-kangsar',    name: 'Kuala Kangsar',    name_zh: '江沙',       state: 'Perak', stateSlug: 'perak', nearby: ['taiping','ipoh','bagan-serai','parit-buntar','batu-gajah','kampar'] },
  { slug: 'batu-gajah',       name: 'Batu Gajah',       name_zh: '华都牙也',   state: 'Perak', stateSlug: 'perak', nearby: ['ipoh','kampar','tanjung-malim','kuala-kangsar','taiping','sitiawan'] },

  // Negeri Sembilan (10)
  { slug: 'seremban',         name: 'Seremban',         name_zh: '芙蓉',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['nilai','senawang','mantin','port-dickson','rembau','kajang'] },
  { slug: 'nilai',            name: 'Nilai',            name_zh: '汝来',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['seremban','mantin','semenyih','bangi','sepang','senawang'] },
  { slug: 'port-dickson',     name: 'Port Dickson',     name_zh: '波德申',     state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['seremban','rembau','lukut','melaka-city','tampin','sepang'] },
  { slug: 'bahau',            name: 'Bahau',            name_zh: '马口',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['kuala-pilah','seremban','tampin','rembau','jasin','segamat'] },
  { slug: 'rembau',           name: 'Rembau',           name_zh: '林茂',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['seremban','tampin','port-dickson','bahau','kuala-pilah','melaka-city'] },
  { slug: 'tampin',           name: 'Tampin',           name_zh: '淡边',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['rembau','melaka-city','bahau','jasin','alor-gajah','seremban'] },
  { slug: 'kuala-pilah',      name: 'Kuala Pilah',      name_zh: '瓜拉庇朥',   state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['bahau','seremban','rembau','tampin','jasin','segamat'] },
  { slug: 'senawang',         name: 'Senawang',         name_zh: '新那旺',     state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['seremban','mantin','nilai','rembau','port-dickson','bangi'] },
  { slug: 'mantin',           name: 'Mantin',           name_zh: '文丁',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['nilai','seremban','senawang','bangi','semenyih','kajang'] },
  { slug: 'lukut',            name: 'Lukut',            name_zh: '芦骨',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', nearby: ['port-dickson','seremban','rembau','sepang','tampin','melaka-city'] },

  // Melaka (10)
  { slug: 'melaka-city',      name: 'Melaka City',      name_zh: '马六甲市',   state: 'Melaka', stateSlug: 'melaka', nearby: ['ayer-keroh','batu-berendam','bukit-beruang','klebang','alor-gajah','jasin'] },
  { slug: 'ayer-keroh',       name: 'Ayer Keroh',       name_zh: '爱极乐',     state: 'Melaka', stateSlug: 'melaka', nearby: ['melaka-city','bukit-beruang','batu-berendam','cheng','alor-gajah','klebang'] },
  { slug: 'bukit-beruang',    name: 'Bukit Beruang',    name_zh: '武吉波浪',   state: 'Melaka', stateSlug: 'melaka', nearby: ['ayer-keroh','melaka-city','batu-berendam','cheng','klebang','jasin'] },
  { slug: 'klebang',          name: 'Klebang',          name_zh: '吉里望',     state: 'Melaka', stateSlug: 'melaka', nearby: ['melaka-city','batu-berendam','alor-gajah','masjid-tanah','cheng','ayer-keroh'] },
  { slug: 'alor-gajah',       name: 'Alor Gajah',       name_zh: '亚罗牙也',   state: 'Melaka', stateSlug: 'melaka', nearby: ['masjid-tanah','tampin','melaka-city','klebang','ayer-keroh','tangkak'] },
  { slug: 'jasin',            name: 'Jasin',            name_zh: '野新',       state: 'Melaka', stateSlug: 'melaka', nearby: ['merlimau','tangkak','melaka-city','tampin','bahau','segamat'] },
  { slug: 'masjid-tanah',     name: 'Masjid Tanah',     name_zh: '马接',       state: 'Melaka', stateSlug: 'melaka', nearby: ['alor-gajah','klebang','melaka-city','batu-berendam','tampin','ayer-keroh'] },
  { slug: 'merlimau',         name: 'Merlimau',         name_zh: '马林峇',     state: 'Melaka', stateSlug: 'melaka', nearby: ['jasin','melaka-city','muar','tangkak','batu-berendam','ayer-keroh'] },
  { slug: 'batu-berendam',    name: 'Batu Berendam',    name_zh: '峇株安南',   state: 'Melaka', stateSlug: 'melaka', nearby: ['melaka-city','ayer-keroh','klebang','bukit-beruang','cheng','alor-gajah'] },
  { slug: 'cheng',            name: 'Cheng',            name_zh: '振林山',     state: 'Melaka', stateSlug: 'melaka', nearby: ['ayer-keroh','batu-berendam','bukit-beruang','melaka-city','klebang','alor-gajah'] },

  // Kedah (10)
  { slug: 'alor-setar',       name: 'Alor Setar',       name_zh: '亚罗士打',   state: 'Kedah', stateSlug: 'kedah', nearby: ['kuala-kedah','jitra','pendang','sungai-petani','kubang-pasu','yan'] },
  { slug: 'sungai-petani',    name: 'Sungai Petani',    name_zh: '双溪大年',   state: 'Kedah', stateSlug: 'kedah', nearby: ['kulim','butterworth','bukit-mertajam','alor-setar','yan','baling'] },
  { slug: 'kulim',            name: 'Kulim',            name_zh: '居林',       state: 'Kedah', stateSlug: 'kedah', nearby: ['sungai-petani','bukit-mertajam','butterworth','baling','seberang-perai','parit-buntar'] },
  { slug: 'langkawi',         name: 'Langkawi',         name_zh: '浮罗交怡',   state: 'Kedah', stateSlug: 'kedah', nearby: ['kuala-perlis','alor-setar','kangar','kuala-kedah','padang-besar','jitra'] },
  { slug: 'jitra',            name: 'Jitra',            name_zh: '日得拉',     state: 'Kedah', stateSlug: 'kedah', nearby: ['alor-setar','kubang-pasu','kangar','arau','padang-besar','pendang'] },
  { slug: 'pendang',          name: 'Pendang',          name_zh: '本同',       state: 'Kedah', stateSlug: 'kedah', nearby: ['alor-setar','sungai-petani','yan','baling','jitra','kubang-pasu'] },
  { slug: 'yan',              name: 'Yan',              name_zh: '燕',         state: 'Kedah', stateSlug: 'kedah', nearby: ['sungai-petani','alor-setar','pendang','kuala-kedah','kulim','baling'] },
  { slug: 'kuala-kedah',      name: 'Kuala Kedah',      name_zh: '瓜拉吉打',   state: 'Kedah', stateSlug: 'kedah', nearby: ['alor-setar','jitra','yan','langkawi','kuala-perlis','kubang-pasu'] },
  { slug: 'baling',           name: 'Baling',           name_zh: '巴林',       state: 'Kedah', stateSlug: 'kedah', nearby: ['kulim','sungai-petani','pendang','yan','kuala-kangsar','jitra'] },
  { slug: 'kubang-pasu',      name: 'Kubang Pasu',      name_zh: '古邦巴素',   state: 'Kedah', stateSlug: 'kedah', nearby: ['jitra','alor-setar','arau','kangar','padang-besar','pendang'] },

  // Kelantan (10)
  { slug: 'kota-bharu',       name: 'Kota Bharu',       name_zh: '哥打巴鲁',   state: 'Kelantan', stateSlug: 'kelantan', nearby: ['tumpat','pasir-mas','wakaf-bharu','pengkalan-chepa','bachok','tanah-merah'] },
  { slug: 'tumpat',           name: 'Tumpat',           name_zh: '丹普',       state: 'Kelantan', stateSlug: 'kelantan', nearby: ['kota-bharu','pasir-mas','wakaf-bharu','pengkalan-chepa','bachok','pasir-puteh'] },
  { slug: 'pasir-mas',        name: 'Pasir Mas',        name_zh: '巴西马',     state: 'Kelantan', stateSlug: 'kelantan', nearby: ['kota-bharu','tumpat','tanah-merah','machang','wakaf-bharu','pengkalan-chepa'] },
  { slug: 'bachok',           name: 'Bachok',           name_zh: '巴佐',       state: 'Kelantan', stateSlug: 'kelantan', nearby: ['kota-bharu','pasir-puteh','tumpat','pengkalan-chepa','machang','wakaf-bharu'] },
  { slug: 'tanah-merah',      name: 'Tanah Merah',      name_zh: '丹那美拉',   state: 'Kelantan', stateSlug: 'kelantan', nearby: ['pasir-mas','machang','kuala-krai','kota-bharu','jerteh','besut'] },
  { slug: 'kuala-krai',       name: 'Kuala Krai',       name_zh: '瓜拉吉赖',   state: 'Kelantan', stateSlug: 'kelantan', nearby: ['tanah-merah','machang','jerteh','kuala-lipis','besut','pasir-mas'] },
  { slug: 'pasir-puteh',      name: 'Pasir Puteh',      name_zh: '巴西富地',   state: 'Kelantan', stateSlug: 'kelantan', nearby: ['bachok','machang','kota-bharu','besut','jerteh','tumpat'] },
  { slug: 'machang',          name: 'Machang',          name_zh: '马江',       state: 'Kelantan', stateSlug: 'kelantan', nearby: ['pasir-puteh','tanah-merah','kuala-krai','pasir-mas','kota-bharu','jerteh'] },
  { slug: 'wakaf-bharu',      name: 'Wakaf Bharu',      name_zh: '哇卡巴鲁',   state: 'Kelantan', stateSlug: 'kelantan', nearby: ['kota-bharu','tumpat','pasir-mas','pengkalan-chepa','bachok','machang'] },
  { slug: 'pengkalan-chepa',  name: 'Pengkalan Chepa',  name_zh: '班卡兰芝坡', state: 'Kelantan', stateSlug: 'kelantan', nearby: ['kota-bharu','tumpat','wakaf-bharu','bachok','pasir-mas','pasir-puteh'] },

  // Terengganu (10)
  { slug: 'kuala-terengganu', name: 'Kuala Terengganu', name_zh: '瓜拉登嘉楼', state: 'Terengganu', stateSlug: 'terengganu', nearby: ['marang','kemaman','dungun','setiu','besut','hulu-terengganu'] },
  { slug: 'kemaman',          name: 'Kemaman',          name_zh: '甘马挽',     state: 'Terengganu', stateSlug: 'terengganu', nearby: ['chukai','dungun','paka','kuala-terengganu','kuantan','marang'] },
  { slug: 'dungun',           name: 'Dungun',           name_zh: '龙运',       state: 'Terengganu', stateSlug: 'terengganu', nearby: ['paka','kemaman','marang','kuala-terengganu','chukai','hulu-terengganu'] },
  { slug: 'marang',           name: 'Marang',           name_zh: '马朗',       state: 'Terengganu', stateSlug: 'terengganu', nearby: ['kuala-terengganu','dungun','paka','setiu','hulu-terengganu','kemaman'] },
  { slug: 'hulu-terengganu',  name: 'Hulu Terengganu',  name_zh: '上登嘉楼',   state: 'Terengganu', stateSlug: 'terengganu', nearby: ['kuala-terengganu','setiu','marang','dungun','besut','jerteh'] },
  { slug: 'setiu',            name: 'Setiu',            name_zh: '士迪乌',     state: 'Terengganu', stateSlug: 'terengganu', nearby: ['kuala-terengganu','besut','jerteh','marang','hulu-terengganu','dungun'] },
  { slug: 'besut',            name: 'Besut',            name_zh: '勿述',       state: 'Terengganu', stateSlug: 'terengganu', nearby: ['jerteh','setiu','kuala-terengganu','tanah-merah','kuala-krai','pasir-puteh'] },
  { slug: 'chukai',           name: 'Chukai',           name_zh: '朱盖',       state: 'Terengganu', stateSlug: 'terengganu', nearby: ['kemaman','paka','dungun','kuantan','marang','kuala-terengganu'] },
  { slug: 'paka',             name: 'Paka',             name_zh: '巴卡',       state: 'Terengganu', stateSlug: 'terengganu', nearby: ['dungun','kemaman','chukai','marang','kuala-terengganu','hulu-terengganu'] },
  { slug: 'jerteh',           name: 'Jerteh',           name_zh: '日里',       state: 'Terengganu', stateSlug: 'terengganu', nearby: ['besut','setiu','kuala-terengganu','kuala-krai','tanah-merah','hulu-terengganu'] },

  // Pahang (10)
  { slug: 'kuantan',          name: 'Kuantan',          name_zh: '关丹',       state: 'Pahang', stateSlug: 'pahang', nearby: ['pekan','maran','kemaman','chukai','temerloh','jerantut'] },
  { slug: 'temerloh',         name: 'Temerloh',         name_zh: '淡马鲁',     state: 'Pahang', stateSlug: 'pahang', nearby: ['mentakab','jerantut','maran','bentong','raub','kuala-lipis'] },
  { slug: 'bentong',          name: 'Bentong',          name_zh: '文冬',       state: 'Pahang', stateSlug: 'pahang', nearby: ['raub','temerloh','mentakab','rawang','tanjung-malim','cameron-highlands'] },
  { slug: 'raub',             name: 'Raub',             name_zh: '劳勿',       state: 'Pahang', stateSlug: 'pahang', nearby: ['bentong','kuala-lipis','jerantut','temerloh','cameron-highlands','tanjung-malim'] },
  { slug: 'mentakab',         name: 'Mentakab',         name_zh: '文德甲',     state: 'Pahang', stateSlug: 'pahang', nearby: ['temerloh','jerantut','maran','bentong','raub','kuala-lipis'] },
  { slug: 'pekan',            name: 'Pekan',            name_zh: '北根',       state: 'Pahang', stateSlug: 'pahang', nearby: ['kuantan','maran','mersing','temerloh','chukai','jerantut'] },
  { slug: 'jerantut',         name: 'Jerantut',         name_zh: '而连突',     state: 'Pahang', stateSlug: 'pahang', nearby: ['temerloh','mentakab','kuala-lipis','raub','maran','cameron-highlands'] },
  { slug: 'cameron-highlands',name: 'Cameron Highlands',name_zh: '金马伦高原', state: 'Pahang', stateSlug: 'pahang', nearby: ['raub','kuala-lipis','tanjung-malim','ipoh','bentong','jerantut'] },
  { slug: 'kuala-lipis',      name: 'Kuala Lipis',      name_zh: '瓜拉立卑',   state: 'Pahang', stateSlug: 'pahang', nearby: ['raub','jerantut','cameron-highlands','temerloh','mentakab','bentong'] },
  { slug: 'maran',            name: 'Maran',            name_zh: '马兰',       state: 'Pahang', stateSlug: 'pahang', nearby: ['temerloh','mentakab','kuantan','pekan','jerantut','bentong'] },

  // Perlis (10)
  { slug: 'kangar',           name: 'Kangar',           name_zh: '加央',       state: 'Perlis', stateSlug: 'perlis', nearby: ['arau','kuala-perlis','padang-besar','simpang-empat','beseri','jitra'] },
  { slug: 'arau',             name: 'Arau',             name_zh: '亚娄',       state: 'Perlis', stateSlug: 'perlis', nearby: ['kangar','padang-besar','simpang-empat','jitra','kubang-pasu','beseri'] },
  { slug: 'padang-besar',     name: 'Padang Besar',     name_zh: '巴东勿刹',   state: 'Perlis', stateSlug: 'perlis', nearby: ['kangar','arau','kuala-perlis','kaki-bukit','wang-kelian','jitra'] },
  { slug: 'kuala-perlis',     name: 'Kuala Perlis',     name_zh: '瓜拉玻璃市', state: 'Perlis', stateSlug: 'perlis', nearby: ['kangar','simpang-empat','arau','langkawi','kuala-kedah','padang-besar'] },
  { slug: 'beseri',           name: 'Beseri',           name_zh: '勿斯里',     state: 'Perlis', stateSlug: 'perlis', nearby: ['kangar','arau','simpang-empat','padang-besar','sanglang','mata-ayer'] },
  { slug: 'simpang-empat',    name: 'Simpang Empat',    name_zh: '新光镇',     state: 'Perlis', stateSlug: 'perlis', nearby: ['kangar','arau','beseri','sanglang','kuala-perlis','mata-ayer'] },
  { slug: 'sanglang',         name: 'Sanglang',         name_zh: '双兰',       state: 'Perlis', stateSlug: 'perlis', nearby: ['simpang-empat','kuala-perlis','beseri','kangar','mata-ayer','arau'] },
  { slug: 'mata-ayer',        name: 'Mata Ayer',        name_zh: '玛达阿耶',   state: 'Perlis', stateSlug: 'perlis', nearby: ['arau','beseri','padang-besar','kaki-bukit','sanglang','kangar'] },
  { slug: 'kaki-bukit',       name: 'Kaki Bukit',       name_zh: '加基武吉',   state: 'Perlis', stateSlug: 'perlis', nearby: ['padang-besar','wang-kelian','mata-ayer','arau','beseri','kangar'] },
  { slug: 'wang-kelian',      name: 'Wang Kelian',      name_zh: '王吉连',     state: 'Perlis', stateSlug: 'perlis', nearby: ['kaki-bukit','padang-besar','mata-ayer','arau','beseri','kangar'] },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getLocationsByState(stateSlug: string): Location[] {
  return locations.filter((l) => l.stateSlug === stateSlug);
}

export function getNearbyLocations(slug: string, n: number = 6): Location[] {
  const loc = getLocation(slug);
  if (!loc) return [];
  return loc.nearby
    .map((s) => getLocation(s))
    .filter((l): l is Location => Boolean(l))
    .slice(0, n);
}

export function getState(stateSlug: string): State | undefined {
  return STATES.find((s) => s.slug === stateSlug);
}
