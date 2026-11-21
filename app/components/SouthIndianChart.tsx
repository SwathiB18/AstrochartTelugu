'use client';

import React from 'react';

// దక్షిణాది చక్రంలో రాశుల స్థానాలు మరియు వాటి సింబల్స్ (Light Theme)
const GRID_LAYOUT = [
  { rshiIndex: 11, name: 'మీనం(Pis)', symbol: '♓', row: 0, col: 0 },
  { rshiIndex: 0, name: 'మేషం(Ari)', symbol: '♈', row: 0, col: 1 },
  { rshiIndex: 1, name: 'వృషభం(Tau)', symbol: '♉', row: 0, col: 2 },
  { rshiIndex: 2, name: 'మిధునం(Gem)', symbol: '♊', row: 0, col: 3 },
  { rshiIndex: 3, name: 'కర్కాటకం(Can)', symbol: '♋', row: 1, col: 3 },
  { rshiIndex: 4, name: 'సింహం(Leo)', symbol: '♌', row: 2, col: 3 },
  { rshiIndex: 5, name: 'కన్య(Vir)', symbol: '♍', row: 3, col: 3 },
  { rshiIndex: 6, name: 'తుల(Lib)', symbol: '♎', row: 3, col: 2 },
  { rshiIndex: 7, name: 'వృశ్చికం(Sco)', symbol: '♏', row: 3, col: 1 },
  { rshiIndex: 8, name: 'ధనుస్సు(Sag)', symbol: '♐', row: 3, col: 0 },
  { rshiIndex: 9, name: 'మకరం(Cap)', symbol: '♑', row: 2, col: 0 },
  { rshiIndex: 10, name: 'కుంభం(Aqu)', symbol: '♒', row: 1, col: 0 },
];

export default function SouthIndianChart({ chartData, selectedItem, onSelectItem }: any) {
  const { ascendant, planets, subject, meta, houses } = chartData;

  // లగ్నం ఏ రాశిలో ఉందో లెక్కించడం (0 - 11)
  const lagnamRashiIndex = Math.floor((((ascendant % 360) + 360) % 360) / 30);
  // ప్రతీ రాశిలో ఏయే గ్రహాలు ఉన్నాయో గ్రూప్ చేయడం
  const rashiPlanets: { [key: number]: any[] } = {};
  for (let i = 0; i < 12; i++) rashiPlanets[i] = [];

  const getHouse = (lon: number) => {
    const norm = (d: number) => ((d % 360) + 360) % 360;
    const l = norm(lon);
    if (!houses || houses.length !== 12) return 1;
    for (let i = 0; i < 12; i++) {
      const start = norm(houses[i]);
      const end = norm(houses[(i + 1) % 12]);
      if (start < end) {
        if (l >= start && l < end) return i + 1;
      } else {
        if (l >= start || l < end) return i + 1;
      }
    }
    return 1;
  };

  planets.forEach((p: any) => {
    const rIndex = Math.floor((((p.longitude % 360) + 360) % 360) / 30);
    rashiPlanets[rIndex].push(p);
  });

  const CELL_SIZE = 130;
  const TOTAL_SIZE = CELL_SIZE * 4; // 520px
function formatTimeToAmPm(timeStr?: string): string {
  if (!timeStr) return '';
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;

  const hours24 = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  const seconds = parts[2] ? `:${parts[2].padStart(2, '0')}` : '';

  if (Number.isNaN(hours24)) return timeStr;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${minutes}${seconds} ${period}`;
}
  return (
    <div className="wheel-container text-center">
      <svg viewBox={`0 0 ${TOTAL_SIZE} ${TOTAL_SIZE}`} className="astro-svg" style={{ maxWidth: '520px', width: '100%', height: 'auto' }}>
        {/* బాహ్య ఫ్రేమ్ */}
        <rect x="0" y="0" width={TOTAL_SIZE} height={TOTAL_SIZE} fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />

        {/* 4x4 గ్రిడ్ గీతలు మరియు రాశుల పెట్టెలు */}
        {GRID_LAYOUT.map((cell) => {
          const x = cell.col * CELL_SIZE;
          const y = cell.row * CELL_SIZE;
          const isLagnam = cell.rshiIndex === lagnamRashiIndex;
          const planetsInRashi = rashiPlanets[cell.rshiIndex] || [];

          return (
            <g key={cell.name} transform={`translate(${x}, ${y})`}>
              {/* గడి బ్యాక్‌గ్రౌండ్ (లగ్నానికి లైట్ బ్లూ షేడ్, మిగతావి స్వచ్ఛమైన తెలుపు) */}
              <rect
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={isLagnam ? '#e0f2fe' : '#ffffff'}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

            {/* 1. సింబల్ + తెలుగు & ఇంగ్లీష్ రాశి పేరు */}
<text x="10" y="17" fill="#334155" fontSize="10.5" fontWeight="bold">
  <tspan fill="#0284c7" fontSize="12">{cell.symbol}</tspan> {cell.name}
</text>

{/* 2. లగ్నం(lag) బ్యాడ్జ్ — రాశి పేరు కింద స్పష్టమైన గ్యాప్‌తో */}
{isLagnam && (
  <g transform="translate(10, 24)">
    <rect
      width="64"
      height="16"
      rx="4"
      fill="#0284c7"
    />
    <text
      x="32"
      y="8"
      fill="#ffffff"
      fontSize="8.8"
      fontWeight="bold"
      textAnchor="middle"
      dominantBaseline="central"
    >
      లగ్నం(lag)
    </text>
  </g>
)}

{/* 3. గ్రహాల పేర్లు — లగ్నం ఉన్నప్పుడు y=58 నుండి, లేనప్పుడు y=40 నుండి */}
<g transform={`translate(14, ${isLagnam ? 58 : 40})`}>
  {planetsInRashi.map((p, idx) => {
    const pY = idx * 18;
    const houseNum = getHouse(p.longitude);

    return (
      <g
        key={p.name}
        style={{ cursor: 'pointer' }}
        onClick={() =>
          onSelectItem &&
          onSelectItem({
            type: 'planet',
            name: p.name,
            title: `${p.symbol} ${p.name}`,
            position: `${cell.symbol} ${cell.name} రాశి`,
            houseNum: houseNum,
            retrograde: p.retrograde,
          })
        }
      >
        <text x="0" y={pY} fill="#1e293b" fontSize="12" fontWeight="600" className="zodiac-glyph">
          {p.symbol} {p.name.split(' ')[0]} {p.retrograde ? '℞' : ''}
        </text>
      </g>
    );
  })}
</g>          </g>
          );
        })}

        {/* మధ్యలోని 2x2 బాక్స్ */}
        <g transform={`translate(${CELL_SIZE}, ${CELL_SIZE})`}>
  <rect
    width={CELL_SIZE * 2}
    height={CELL_SIZE * 2}
    fill="#f8fafc"
    stroke="#cbd5e1"
    strokeWidth="2"
  />

  {/* 1. పేరు */}
  <text
    x={CELL_SIZE}
    y="48"
    fill="#0284c7"
    fontSize="15"
    fontWeight="bold"
    textAnchor="middle"
  >
    {subject || 'జాతక చక్రం'}
  </text>

  {/* 2. తేదీ / సమయం */}
  <text
    x={CELL_SIZE}
    y="82"
    fill="#334155"
    fontSize="11"
    fontWeight="600"
    textAnchor="middle"
  >
    {[meta?.date, meta?.time ? formatTimeToAmPm(meta.time) : '']
      .filter(Boolean)
      .join(' / ')}
  </text>

  {/* 3. ఊరు */}
  <text
    x={CELL_SIZE}
    y="116"
    fill="#475569"
    fontSize="11"
    textAnchor="middle"
  >
    {meta?.location?.split(',')[0] || ''}
  </text>

  {/* చార్ట్ శైలి */}
  <text
    x={CELL_SIZE}
    y="152"
    fill="#d97706"
    fontSize="11"
    fontWeight="bold"
    textAnchor="middle"
  >
    దక్షిణాది రాశి చక్రం
  </text>
</g>
         </svg>
    </div>
  );
}