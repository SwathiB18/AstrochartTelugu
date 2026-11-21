// 27 నక్షత్రాల జాబితా
export const NAKSHATRAS = [
  'అశ్విని Ash', 'భరణి Bha', 'కృత్తిక Kri', 'రోహిణి Roh', 'మృగశిర Mri', 'ఆర్ద్ర Ard',
  'పునర్వసు Pun', 'పుష్యమి Pus', 'ఆశ్లేష Asl', 'మఖ Mag', 'పూర్వఫల్గుని (పుబ్బ) P.Pha', 'ఉత్తరఫల్గుని (ఉత్తర) U.pha',
  'హస్త Has', 'చిత్త Chi', 'స్వాతి Swa', 'విశాఖ Vis', 'అనూరాధ Anu', 'జ్యేష్ట Jye',
  'మూల Mul', 'పూర్వాషాఢ P.Ash', 'ఉత్తరాషాఢ U.Ash', 'శ్రవణం Shr', 'ధనిష్ట Dha', 'శతభిషం Sha',
  'పూర్వాభాద్ర P.Bha', 'ఉత్తరాభాద్ర U.Bha', 'రేవతి Rev'
];

// 12 రాశుల జాబితా
export const RASHIS = [
  'మేష(Ari)', 'వృషభ(Tau)', 'మిథున(Gem)', 'కర్కాటక(Can)', 'సింహ(Leo)', 'కన్య(Vir)',
  'తుల(Lib)', 'వృశ్చిక(Sco)', 'ధనుస్సు(Sag)', 'మకర(Cap)', 'కుంభ(Aqu)', 'మీన(Pis)'
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
    source: 'వేద జ్యోతిష్య ఇంజిన్',
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

function calculateVedicChart({ name, date, time, location, latitude, longitude }) {
  const [year, month, day] = (date || '1995-08-24').split('-').map(Number);
  const [hours = 12, minutes = 0, seconds = 0] = (time || '12:00:00').split(':').map(Number);

  // IST (UTC+5:30) -> UTC
  const utcMillis = Date.UTC(year, month - 1, day, hours - 5, minutes - 30, seconds);
  const dt = new Date(Number.isNaN(utcMillis) ? Date.now() : utcMillis);

  // Days since J2000.0
  const d = (dt.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;

  const norm = (deg) => ((deg % 360) + 360) % 360;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  // Lahiri / Chitrapaksha Ayanamsa
  const ayanamsa = 23.853 + (d / 365.25) * 0.013969;

  const latDeg = Number(latitude ?? 17.385);
  const lonDeg = Number(longitude ?? 78.4867);
  const latRad = toRad(latDeg);
  const epsDeg = 23.4393 - 0.00000036 * d;
  const epsRad = toRad(epsDeg);

  // 1. లగ్నం (Ascendant)
  const gmst = norm(280.46061837 + 360.98564736629 * d);
  const lstDeg = norm(gmst + lonDeg);
  const lstRad = toRad(lstDeg);

  const ascY = Math.cos(lstRad);
  const ascX = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const tropicalAsc = norm(toDeg(Math.atan2(ascY, ascX)));
  const ascendant = norm(tropicalAsc - ayanamsa);

  // 2. సూర్యుడు (Sun)
  const sunMeanAnomaly = norm(357.5291092 + 0.98560028 * d);
  const sunM = toRad(sunMeanAnomaly);
  const sunEqCenter =
    1.9148 * Math.sin(sunM) +
    0.0200 * Math.sin(2 * sunM) +
    0.0003 * Math.sin(3 * sunM);
  const sunPerihelion = 102.937348 + 0.00004708 * d;
  const tropicalSun = norm(sunPerihelion + sunMeanAnomaly + sunEqCenter + 180);
  const sunLon = norm(tropicalSun - ayanamsa);

  const earthR = 1.00014 - 0.01671 * Math.cos(sunM) - 0.00014 * Math.cos(2 * sunM);

  // 3. చంద్రుడు (Moon)
  const moonMeanLon = norm(218.3164477 + 13.176396468 * d);
  const moonMeanAnomaly = norm(134.9633964 + 13.06499295 * d);
  const moonArgLat = norm(93.2720950 + 13.22935045 * d);
  const moonElong = norm(297.8501921 + 12.19074912 * d);

  const Mm = toRad(moonMeanAnomaly);
  const D = toRad(moonElong);
  const F = toRad(moonArgLat);
  const Ms = sunM;

  const tropicalMoon = norm(
    moonMeanLon +
      6.289 * Math.sin(Mm) +
      1.274 * Math.sin(2 * D - Mm) +
      0.658 * Math.sin(2 * D) +
      0.214 * Math.sin(2 * Mm) -
      0.186 * Math.sin(Ms) -
      0.114 * Math.sin(2 * F)
  );
  const moonLon = norm(tropicalMoon - ayanamsa);

  // 4. ఇతర గ్రహాలు (Heliocentric -> Geocentric + Perturbations)
  function calcPlanetGeocentricLon(elems, pertDeg = 0) {
    const N = toRad(norm(elems.N0 + elems.Nd * d));
    const i = toRad(elems.i0 + elems.id * d);
    const w = toRad(norm(elems.w0 + elems.wd * d));
    const a = elems.a;
    const e = elems.e0 + elems.ed * d;
    const M = toRad(norm(elems.M0 + elems.Md * d));

    let E = M;
    for (let iter = 0; iter < 8; iter++) {
      E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    }

    const xv = a * (Math.cos(E) - e);
    const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);

    const v = Math.atan2(yv, xv);
    const r = Math.hypot(xv, yv);

    const cosN = Math.cos(N);
    const sinN = Math.sin(N);
    const cosVW = Math.cos(v + w);
    const sinVW = Math.sin(v + w);
    const cosi = Math.cos(i);

    const xh = r * (cosN * cosVW - sinN * sinVW * cosi);
    const yh = r * (sinN * cosVW + cosN * sinVW * cosi);

    const earthLonRad = toRad(norm(tropicalSun + 180));
    const xe = earthR * Math.cos(earthLonRad);
    const ye = earthR * Math.sin(earthLonRad);

    const xg = xh - xe;
    const yg = yh - ye;

    const geoLonDeg = norm(toDeg(Math.atan2(yg, xg)) + pertDeg);
    return norm(geoLonDeg - ayanamsa);
  }

  // గురుడు మరియు శని మధ్య గురుత్వాకర్షణ సవరణ (Perturbation terms)
  const Mj = toRad(norm(19.8950 + 0.0830853001 * d));
  const Ms_sat = toRad(norm(316.9670 + 0.0334442282 * d));

  const jupPert =
    -0.332 * Math.sin(2 * Mj - 5 * Ms_sat - toRad(67.6)) -
    0.056 * Math.sin(2 * Mj - 2 * Ms_sat + toRad(21)) +
    0.042 * Math.sin(3 * Mj - 5 * Ms_sat + toRad(21));

  const satPert =
    0.812 * Math.sin(2 * Mj - 5 * Ms_sat - toRad(67.6)) -
    0.229 * Math.cos(2 * Mj - 4 * Ms_sat - toRad(2)) +
    0.119 * Math.sin(Mj - 2 * Ms_sat - toRad(3)) +
    0.046 * Math.sin(2 * Mj - 6 * Ms_sat - toRad(69));

  const orbitalElements = {
    mercury: { N0: 48.3313, Nd: 3.24587e-5, i0: 7.0047, id: 5.00e-8, w0: 29.1241, wd: 1.01444e-5, a: 0.387098, e0: 0.205635, ed: 5.59e-10, M0: 168.6562, Md: 4.0923344368 },
    venus:   { N0: 76.6799, Nd: 2.46590e-5, i0: 3.3946, id: 2.75e-8, w0: 54.8910, wd: 1.38374e-5, a: 0.723330, e0: 0.006773, ed: -1.302e-9, M0: 48.0052, Md: 1.6021303444 },
    mars:    { N0: 49.5574, Nd: 2.11081e-5, i0: 1.8497, id: -1.78e-8, w0: 286.5016, wd: 2.92961e-5, a: 1.523688, e0: 0.093405, ed: 2.516e-9, M0: 18.6021, Md: 0.5240207766 },
    jupiter: { N0: 100.4542, Nd: 2.76854e-5, i0: 1.3030, id: -1.557e-7, w0: 273.8777, wd: 1.64505e-5, a: 5.20256, e0: 0.048498, ed: 4.469e-9, M0: 19.8950, Md: 0.0830853001 },
    saturn:  { N0: 113.6634, Nd: 2.38980e-5, i0: 2.4886, id: -1.081e-7, w0: 339.3939, wd: 2.97661e-5, a: 9.55475, e0: 0.055546, ed: -9.499e-9, M0: 316.9670, Md: 0.0334442282 },
  };

  const mercuryLon = calcPlanetGeocentricLon(orbitalElements.mercury);
  const venusLon   = calcPlanetGeocentricLon(orbitalElements.venus);
  const marsLon    = calcPlanetGeocentricLon(orbitalElements.mars);
  const jupiterLon = calcPlanetGeocentricLon(orbitalElements.jupiter, jupPert);
  const saturnLon  = calcPlanetGeocentricLon(orbitalElements.saturn, satPert);

  // 5. రాహువు & కేతువు
  const meanNodeTropical = norm(125.0445479 - 0.05295377 * d);
  const rahuLon = norm(meanNodeTropical - ayanamsa);
  const ketuLon = norm(rahuLon + 180);

  const planets = [
    { name: 'సూర్యుడు (Sun)', symbol: '☉', longitude: Number(sunLon.toFixed(4)), retrograde: false },
    { name: 'చంద్రుడు (Moon)', symbol: '☽', longitude: Number(moonLon.toFixed(4)), retrograde: false },
    { name: 'కుజుడు (Mars)', symbol: '♂', longitude: Number(marsLon.toFixed(4)), retrograde: false },
    { name: 'బుధుడు (Mercury)', symbol: '☿', longitude: Number(mercuryLon.toFixed(4)), retrograde: false },
    { name: 'గురుడు (Jupiter)', symbol: '♃', longitude: Number(jupiterLon.toFixed(4)), retrograde: false },
    { name: 'శుక్రుడు (Venus)', symbol: '♀', longitude: Number(venusLon.toFixed(4)), retrograde: false },
    { name: 'శని (Saturn)', symbol: '♄', longitude: Number(saturnLon.toFixed(4)), retrograde: false },
    { name: 'రాహువు (Rahu)', symbol: '☊', longitude: Number(rahuLon.toFixed(4)), retrograde: true },
    { name: 'కేతువు (Ketu)', symbol: '☋', longitude: Number(ketuLon.toFixed(4)), retrograde: true },
  ];

  // Whole Sign House System: లగ్న రాశి 0° నుండి 1వ భావం మొదలవుతుంది
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
      source: 'వేద కక్ష్యా గణిత ఇంజిన్',
    },
    ascendant: Number(ascendant.toFixed(4)),
    midheaven: norm(ascendant + 270),
    houses,
    planets,
  };
}

export async function fetchNatalChart(birthData) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return calculateVedicChart(birthData);
}