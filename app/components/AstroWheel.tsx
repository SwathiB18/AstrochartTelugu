'use client';

import React, { useMemo } from 'react';

// తెలుగు రాశుల పేర్లు
export const RASHIS = [
  { name: 'మేష(Ari)', symbol: '♈', color: '#2b1922' },
  { name: 'వృషభ(Tau)', symbol: '♉', color: '#172620' },
  { name: 'మిథున (Gem)', symbol: '♊', color: '#262518' },
  { name: 'కర్కాటక(Can)', symbol: '♋', color: '#152232' },
  { name: 'సింహ(Leo)', symbol: '♌', color: '#2b1922' },
  { name: 'కన్య(Vir)', symbol: '♍', color: '#172620' },
  { name: 'తుల(Lib)', symbol: '♎', color: '#262518' },
  { name: 'వృశ్చిక(Sco)', symbol: '♏', color: '#152232' },
  { name: 'ధనుస్సు(Sag)', symbol: '♐', color: '#2b1922' },
  { name: 'మకర(Cap)', symbol: '♑', color: '#172620' },
  { name: 'కుంభ(Aqu)', symbol: '♒', color: '#262518' },
  { name: 'మీన(Pis)', symbol: '♓', color: '#152232' },
];

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const eclipticToSvgAngle = (longitude: number, ascendant: number) => 180 - (longitude - ascendant);

export const polarToCartesian = (cx: number, cy: number, radius: number, longitude: number, ascendant: number) => {
  const svgAngleDeg = eclipticToSvgAngle(longitude, ascendant);
  const rad = degToRad(svgAngleDeg);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
};

export const formatZodiacPosition = (longitude: number) => {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degInSign = normalized % 30;
  const deg = Math.floor(degInSign);
  const min = Math.floor((degInSign - deg) * 60);
  const rashi = RASHIS[signIndex];

  return {
    rashiName: rashi.name,
    formatted: ` ${rashi.name } రాశిలో ${deg}° ${min}'`,
    shortDeg: `${deg}°`,
  };
};

export const getHousePlacement = (longitude: number, houses: number[]) => {
  const norm = (d: number) => ((d % 360) + 360) % 360;
  const lon = norm(longitude);

  for (let i = 0; i < 12; i++) {
    const start = norm(houses[i]);
    const end = norm(houses[(i + 1) % 12]);
    if (start < end) {
      if (lon >= start && lon < end) return i + 1;
    } else {
      if (lon >= start || lon < end) return i + 1;
    }
  }
  return 1;
};

export default function AstroWheel({ chartData, selectedItem, onSelectItem }: any) {
  const { ascendant, houses, planets } = chartData;

  const CX = 320;
  const CY = 320;
  const R_OUTER = 300;
  const R_ZODIAC_INNER = 258;
  const R_PLANET_RING = 210;
  const R_HOUSE_LABEL = 150;
  const R_ASPECT_RING = 130;

  const positionedPlanets = useMemo(() => {
    return planets.map((planet: any) => ({
      ...planet,
      house: getHousePlacement(planet.longitude, houses),
      posInfo: formatZodiacPosition(planet.longitude),
    }));
  }, [planets, houses]);

  return (
    <div className="wheel-container">
      <svg viewBox="0 0 640 640" className="astro-svg">
        <circle cx={CX} cy={CY} r={R_OUTER} fill="#0f1422" stroke="#39486e" strokeWidth="2" />

        {/* రాశి చక్ర వలయం */}
        <g id="rashi-ring">
          {RASHIS.map((rashi, index) => {
            const startLon = index * 30;
            const midLon = startLon + 15;
            const labelPos = polarToCartesian(CX, CY, (R_OUTER + R_ZODIAC_INNER) / 2, midLon, ascendant);

            return (
              <g key={rashi.name}>
                <text x={labelPos.x} y={labelPos.y} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  {rashi.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* భావాలు (Houses) మరియు లగ్న గుర్తింపు */}
        <g id="house-cusps">
          <circle cx={CX} cy={CY} r={R_ASPECT_RING} fill="#0b0f1a" stroke="#39486e" strokeWidth="1.5" />
          {houses.map((cuspLon: number, idx: number) => {
            const houseNum = idx + 1;
            const pStart = polarToCartesian(CX, CY, R_ASPECT_RING, cuspLon, ascendant);
            const pEnd = polarToCartesian(CX, CY, R_ZODIAC_INNER, cuspLon, ascendant);
            const numPos = polarToCartesian(CX, CY, R_HOUSE_LABEL, cuspLon + 15, ascendant);

            return (
              <g key={houseNum} onClick={() => onSelectItem({ type: 'house', houseNum, title: `${houseNum}వ భావం (House)`, position: formatZodiacPosition(cuspLon).formatted })}>
                <line x1={Number(pStart.x.toFixed(2))} 
  y1={Number(pStart.y.toFixed(2))} 
  x2={Number(pEnd.x.toFixed(2))} 
  y2={Number(pEnd.y.toFixed(2))}  stroke={houseNum === 1 ? '#38bdf8' : '#2d3748'} strokeWidth={houseNum === 1 ? '2' : '1'} />
                <text x={Number(numPos.x.toFixed(2))} 
  y={Number(numPos.y.toFixed(2))}  fill={houseNum === 1 ? '#38bdf8' : '#64748b'} fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  {houseNum === 1 ? 'లగ్నం (1)' : houseNum}
                </text>
              </g>
            );
          })}
        </g>

        {/* గ్రహాలు (Planets) */}
        <g id="planet-markers">
          {positionedPlanets.map((planet: any, index: number) => {
            // ఒకే భావంలో একাধিক గ్రహాలు ఉంటే కొద్దిగా దూరం సర్దుబాటు చేయడానికి
            const offsetLon = planet.longitude + (index * 3);
            const glyphPos = polarToCartesian(CX, CY, R_PLANET_RING, offsetLon, ascendant);

            return (
              <g key={planet.name} onClick={() => onSelectItem({ type: 'planet', name: planet.name, title: planet.name, position: planet.posInfo.formatted, houseNum: planet.house, retrograde: planet.retrograde })}>
                <circle cx={glyphPos.x} cy={glyphPos.y} r="15" fill="#182034" stroke="#38bdf8" strokeWidth="1.2" />
                <text x={glyphPos.x} y={glyphPos.y} fill="#f8fafc" fontSize="13" textAnchor="middle" dominantBaseline="central">
                  {planet.symbol}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}