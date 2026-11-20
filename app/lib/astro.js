// 27 నక్షత్రాల జాబితా
export const NAKSHATRAS = [
  'అశ్విని Ash', 'భరణి Bha', 'కృత్తిక Kri', 'రోహిణి Roh', 'మృగశిర Mri', 'ఆర్ద్ర Ard',
  'పునర్వసు Pun', 'పుష్యమి Pus', 'ఆశ్లేష Asl', 'మఖ Mag', 'పూర్వఫల్గుని (పుబ్బ) P.Pha', 'ఉత్తరఫల్గుని (ఉత్తర) U.pha',
  'హస్త Has', 'చిత్త Chi', 'స్వాతి Swa', 'విశాఖ Vis', 'అనూరాధ Anu', 'జ్యేష్ట Jye',
  'మూల Mul', 'పూర్వాషాఢ P.Ash', 'ఉత్తరాషాఢ U.Ash' , 'శ్రవణం Shr', 'ధనిష్ట Dha', 'శతభిషం Sha',
  'పూర్వాభాద్ర P.Bha', 'ఉత్తరాభాద్ర U.Bha', 'రేవతి Rev'
];

// 12 రాశుల జాబితా
export const RASHIS = [
  'మేష (Ari)', 'వృషభ (Tau)', 'మిథున (Gem) ', 'కర్కాటక(Can)', 'సింహ (Leo)', 'కన్య(Vir)',
  'తుల(Lib)', 'వృశ్చిక(Sco)', 'ధనుస్సు(Sag)', 'మకర(Cap)', 'కుంభ(Aqu)', 'మీన(Pis)'
];

// చంద్రుని డిగ్రీల ఆధారంగా జన్మ రాశి, నక్షత్రం మరియు పాదం కనుగొనే ఫంక్షన్
export function getNakshatraInfo(moonLongitude) {
  const normLon = ((moonLongitude % 360) + 360) % 360;
  
  // రాశి నిర్ధారణ (ప్రతీ రాశికి 30 డిగ్రీలు)
  const rashiIndex = Math.floor(normLon / 30);
  const rashiName = RASHIS[rashiIndex];

  // నక్షత్ర నిర్ధారణ (ప్రతీ నక్షత్రానికి 13° 20' అనగా 13.3333 డిగ్రీలు)
  const nakshatraSpan = 360 / 27;
  const nakIndex = Math.floor(normLon / nakshatraSpan);
  
  const remainder = normLon % nakshatraSpan;
  const padaSpan = nakshatraSpan / 4; // ప్రతీ పాదానికి 3° 20'
  const pada = Math.floor(remainder / padaSpan) + 1;

  return {
    rashi: rashiName,
    nakshatra: NAKSHATRAS[nakIndex] || 'అశ్విని',
    pada: pada > 4 ? 4 : pada,
  };
}

export const SAMPLE_CHART_DATA = {
  subject: 'Sample chart data',
  meta: {
    date: '1995-08-24',
    time: '14:30:00',
    location: 'Hyderabad, India',
    latitude: 17.3850,
    longitude: 78.4867,
    houseSystem: 'Equal House (Vedic Nirayana)',
    source: 'వేద జ్యోతిష్య ఇంజిన్',
  },
  ascendant: 120.50,
  midheaven: 30.20,
  houses: [120.5, 150.5, 180.5, 210.5, 240.5, 270.5, 300.5, 330.5, 360.5, 30.5, 60.5, 90.5],
  planets: [
    { name: 'సూర్యుడు (Sun)', symbol: '☉', longitude: 135.20, retrograde: false },
    { name: 'చంద్రుడు (Moon)', symbol: '☽', longitude: 85.40, retrograde: false },
    { name: 'కుజుడు (Mars)', symbol: '♂', longitude: 210.15, retrograde: false },
    { name: 'బుధుడు (Mercury)', symbol: '☿', longitude: 125.80, retrograde: false },
    { name: 'గురుడు (Jupiter)', symbol: '♃', longitude: 290.40, retrograde: false },
    { name: 'శుక్రుడు (Venus)', symbol: '♀', longitude: 105.10, retrograde: false },
    { name: 'శని (Saturn)', symbol: '♄', longitude: 320.60, retrograde: true },
    { name: 'రాహువు (Rahu)', symbol: '☊', longitude: 45.20, retrograde: true },
    { name: 'కేతువు (Ketu)', symbol: '☋', longitude: 225.20, retrograde: true },
  ],
};

function calculateVedicChart({ name, date, time, location, latitude, longitude }) {
  // IST (UTC+5:30) సమయాన్ని సరిదిద్దడానికి 5.5 గంటలు మైనస్ చేయడం
  const [hours, minutes, seconds] = (time || '12:00:00').split(':').map(Number);
  let totalSeconds = hours * 3600 + minutes * 60 + (seconds || 0) - (5 * 3600 + 30 * 60);
  
  if (totalSeconds < 0) totalSeconds += 24 * 3600; // ఒకవేళ రోజు మళ్లీ వెనక్కి వెళ్తే
  
  const adjHours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const adjMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const adjSeconds = (totalSeconds % 60).toString().padStart(2, '0');
  
  const isoString = `${date}T${adjHours}:${adjMinutes}:${adjSeconds}Z`;
  const timestamp = Date.parse(isoString);
  const dt = Number.isNaN(timestamp) ? new Date() : new Date(timestamp);

  const d = (dt.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
  const norm = (deg) => ((deg % 360) + 360) % 360;

  const ayanamsa = 23.85 + (d / 365.25) * 0.01397;

  const tropicalSun = norm(280.460 + 0.9856474 * d);
  const sunLon = norm(tropicalSun - ayanamsa);

  // చంద్రుని ఖచ్చితమైన స్థానం
  const tropicalMoon = norm(218.316 + 13.176396 * d + 6.29 * Math.sin(norm(134.9 + 13.0649 * d) * Math.PI / 180));
  const moonLon = norm(tropicalMoon - ayanamsa);

  const planets = [
    { name: 'సూర్యుడు (Sun)', symbol: '☉', longitude: sunLon, retrograde: false },
    { name: 'చంద్రుడు (Moon)', symbol: '☽', longitude: moonLon, retrograde: false },
    { name: 'కుజుడు (Mars)', symbol: '♂', longitude: norm(355.433 + 0.5240207 * d - ayanamsa), retrograde: false },
    { name: 'బుధుడు (Mercury)', symbol: '☿', longitude: norm(sunLon + 22 * Math.sin((d / 115.88) * 2 * Math.PI)), retrograde: false },
    { name: 'గురుడు (Jupiter)', symbol: '♃', longitude: norm(34.351 + 0.0830853 * d - ayanamsa), retrograde: false },
    { name: 'శుక్రుడు (Venus)', symbol: '♀', longitude: norm(sunLon + 44 * Math.sin((d / 583.92) * 2 * Math.PI)), retrograde: false },
    { name: 'శని (Saturn)', symbol: '♄', longitude: norm(50.077 + 0.0334442 * d - ayanamsa), retrograde: true },
    { name: 'రాహువు (Rahu)', symbol: '☊', longitude: norm(100.0 - 0.05295 * d - ayanamsa), retrograde: true },
    { name: 'కేతువు (Ketu)', symbol: '☋', longitude: norm(280.0 - 0.05295 * d - ayanamsa), retrograde: true },
  ];

  const gmst = norm(280.46061837 + 360.98564736629 * d);
  const lst = norm(gmst + Number(longitude || 78.4867));
  const ascendant = norm(lst - ayanamsa);

  const houses = Array.from({ length: 12 }, (_, idx) => norm(ascendant + idx * 30));

  return {
    subject: name || 'జాతకుడు',
    meta: {
      date,
      time,
      location: location || 'Hyderabad',
      latitude: Number(latitude || 17.3850),
      longitude: Number(longitude || 78.4867),
      houseSystem: 'భావ చక్రం (Nirayana)',
      source: 'వేద అయనాంశ ఇంజిన్',
    },
    ascendant: Number(ascendant.toFixed(2)),
    midheaven: norm(ascendant + 270),
    houses,
    planets,
  };
}

export async function fetchNatalChart(birthData) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return calculateVedicChart(birthData);
}