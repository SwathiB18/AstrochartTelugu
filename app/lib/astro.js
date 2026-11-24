import * as Astronomy from 'astronomy-engine';

export const NAKSHATRAS = [
  'అశ్విని(Ashwini)', 'భరణి(Bharani)', 'కృత్తిక(Krittika)', 'రోహిణి(Rohini)', 'మృగశిర(Mrigashira)', 'ఆర్ద్ర(Ardra)',
  'పునర్వసు(Punarvasu)', 'పుష్యమి(Pushyami)', 'ఆశ్లేష(Aslesha)', 'మఖ(Magha)', 'పూర్వఫల్గుని (పుబ్బ)(Poorva phalguni)', 'ఉత్తరఫల్గుని (ఉత్తర)(Uttara phalguni)',
  'హస్త(Hastha)', 'చిత్త(Chitra)', 'స్వాతి(Swathi)', 'విశాఖ(Visakha)', 'అనూరాధ(Anuradha)', 'జ్యేష్ట(Jyestha)',
  'మూల(Mula)', 'పూర్వాషాఢ(Poorvashadha)', 'ఉత్తరాషాఢ(Uttarshada)', 'శ్రవణం(Shravana)', 'ధనిష్ట(Dhanistha)', 'శతభిషం(Shatbhisha)',
  'పూర్వాభాద్ర(Poorva bhadrapada)', 'ఉత్తరాభాద్ర(Uttara bhadrapada)', 'రేవతి(Revathi)'
];

export const RASHIS = [
  'మేష (Aries)', 'వృషభ (Taurus)', 'మిథున (Gemini)', 'కర్కాటక(Cancer)', 'సింహ (Leo)', 'కన్య(Virgo)',
  'తుల(Libra)', 'వృశ్చిక(Scorpio)', 'ధనుస్సు(Sagittarius)', 'మకర(Capricorn)', 'కుంభ(Aquarius)', 'మీన(Pisces)'
];

export function getNakshatraInfo(moonLongitude) {
  const normLon = ((moonLongitude % 360) + 360) % 360;
  const rashiIndex = Math.floor(normLon / 30);
  const rashiName = RASHIS[rashiIndex];

  const nakshatraSpan = 360 / 27;
  const nakIndex = Math.floor(normLon / nakshatraSpan);

  const remainder = normLon % nakshatraSpan;
  const padaSpan = nakshatraSpan / 4;
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
    houseSystem: 'రాశి భావ చక్రం (Whole Sign Nirayana)',
    source: 'Astronomy Engine Ephemeris',
  },
  ascendant: 120.50,
  midheaven: 30.20,
  houses: [120, 150, 180, 210, 240, 270, 300, 330, 0, 30, 60, 90],
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

function norm(deg) {
  return ((deg % 360) + 360) % 360;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

// Lahiri (Chitrapaksha) Ayanamsa approximation around J2000
function getLahiriAyanamsa(astroTime) {
  const daysSinceJ2000 = astroTime.tt;
  return 23.853 + (daysSinceJ2000 / 365.25) * 0.013969;
}

function getGeocentricTropicalLon(body, astroTime) {
  if (body === Astronomy.Body.Moon) {
    return norm(Astronomy.EclipticGeoMoon(astroTime).lon);
  }
  const geoVec = Astronomy.GeoVector(body, astroTime, true);
  return norm(Astronomy.Ecliptic(geoVec).elon);
}

function isRetrograde(body, astroTime) {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;
  const t1 = astroTime.AddDays(-0.5);
  const t2 = astroTime.AddDays(0.5);
  const lon1 = getGeocentricTropicalLon(body, t1);
  const lon2 = getGeocentricTropicalLon(body, t2);
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function calculateVedicChart({ name, date, time, location, latitude, longitude }) {
  const [year, month, day] = (date || '1995-08-24').split('-').map(Number);
  const [hours = 12, minutes = 0, seconds = 0] = (time || '12:00:00').split(':').map(Number);

  // IST (UTC+5:30) -> UTC
  const utcMillis = Date.UTC(year, month - 1, day, hours - 5, minutes - 30, seconds);
  const dt = new Date(Number.isNaN(utcMillis) ? Date.now() : utcMillis);
  const astroTime = new Astronomy.AstroTime(dt);

  const ayanamsa = getLahiriAyanamsa(astroTime);
  const latDeg = Number(latitude ?? 17.385);
  const lonDeg = Number(longitude ?? 78.4867);

  // Local Sidereal Time (hours -> degrees)
  const gmstHours = Astronomy.SiderealTime(astroTime);
  const lstDeg = norm(gmstHours * 15 + lonDeg);
  const lstRad = toRad(lstDeg);
  const latRad = toRad(latDeg);
  const epsRad = toRad(23.4393 - 0.00000036 * astroTime.tt);

  const ascY = Math.cos(lstRad);
  const ascX = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const tropicalAsc = norm(toDeg(Math.atan2(ascY, ascX)));
  const ascendant = norm(tropicalAsc - ayanamsa);

  const planetSpecs = [
    { name: 'సూర్యుడు (Sun)', symbol: '☉', body: Astronomy.Body.Sun },
    { name: 'చంద్రుడు (Moon)', symbol: '☽', body: Astronomy.Body.Moon },
    { name: 'కుజుడు (Mars)', symbol: '♂', body: Astronomy.Body.Mars },
    { name: 'బుధుడు (Mercury)', symbol: '☿', body: Astronomy.Body.Mercury },
    { name: 'గురుడు (Jupiter)', symbol: '♃', body: Astronomy.Body.Jupiter },
    { name: 'శుక్రుడు (Venus)', symbol: '♀', body: Astronomy.Body.Venus },
    { name: 'శని (Saturn)', symbol: '♄', body: Astronomy.Body.Saturn },
  ];

  const planets = planetSpecs.map((spec) => {
    const tropLon = getGeocentricTropicalLon(spec.body, astroTime);
    const sidLon = norm(tropLon - ayanamsa);
    return {
      name: spec.name,
      symbol: spec.symbol,
      longitude: Number(sidLon.toFixed(4)),
      retrograde: isRetrograde(spec.body, astroTime),
    };
  });

  // Mean Lunar Node (Rahu / Ketu)
  const d = astroTime.tt;
  const meanNodeTropical = norm(125.0445479 - 0.05295377 * d);
  const rahuLon = norm(meanNodeTropical - ayanamsa);
  const ketuLon = norm(rahuLon + 180);

  planets.push(
    { name: 'రాహువు (Rahu)', symbol: '☊', longitude: Number(rahuLon.toFixed(4)), retrograde: true },
    { name: 'కేతువు (Ketu)', symbol: '☋', longitude: Number(ketuLon.toFixed(4)), retrograde: true }
  );

  const lagnaRashiStart = Math.floor(ascendant / 30) * 30;
  const houses = Array.from({ length: 12 }, (_, idx) => norm(lagnaRashiStart + idx * 30));

  return {
    subject: name || 'జాతకుడు',
    meta: {
      date,
      time,
      location: location || 'Hyderabad',
      latitude: latDeg,
      longitude: lonDeg,
      houseSystem: 'రాశి భావ చక్రం (Whole Sign Nirayana)',
      source: 'Astronomy Engine Ephemeris',
    },
    ascendant: Number(ascendant.toFixed(4)),
    midheaven: norm(ascendant + 270),
    houses,
    planets,
  };
}

export async function fetchNatalChart(birthData) {
  return calculateVedicChart(birthData);
}