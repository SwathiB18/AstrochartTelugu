'use client';

import React from 'react';

// దక్షిణాది చక్రంలో రాశుల స్థానాలు మరియు వాటి సింబల్స్ (తెలుగు + పూర్తి ఇంగ్లీష్)
const GRID_LAYOUT = [
  { rshiIndex: 11, name: 'మీనం(Pisces)', symbol: '♓', row: 0, col: 0 },
  { rshiIndex: 0, name: 'మేష(Aries)', symbol: '♈', row: 0, col: 1 },
  { rshiIndex: 1, name: 'వృషభ(Taurus)', symbol: '♉', row: 0, col: 2 },
  { rshiIndex: 2, name: 'మిధున(Gemini)', symbol: '♊', row: 0, col: 3 },
  { rshiIndex: 3, name: 'కర్కాటక(Cancer)', symbol: '♋', row: 1, col: 3 },
  { rshiIndex: 4, name: 'సింహ(Leo)', symbol: '♌', row: 2, col: 3 },
  { rshiIndex: 5, name: 'కన్య(Virgo)', symbol: '♍', row: 3, col: 3 },
  { rshiIndex: 6, name: 'తుల(Libra)', symbol: '♎', row: 3, col: 2 },
  { rshiIndex: 7, name: 'వృశ్చిక(Scorpio)', symbol: '♏', row: 3, col: 1 },
  { rshiIndex: 8, name: 'ధనుస్సు(Sagittarius)', symbol: '♐', row: 3, col: 0 },
  { rshiIndex: 9, name: 'మకర(Capricorn)', symbol: '♑', row: 2, col: 0 },
  { rshiIndex: 10, name: 'కుంభ(Aquarius)', symbol: '♒', row: 1, col: 0 },
];

// గ్రహాల పేరును తెలుగు + ఇంగ్లీష్ లో ఫార్మాట్ చేయడానికి
function formatBilingualPlanetName(fullName) {
  if (!fullName) return '';
  return String(fullName).trim();
}

// తేదీని DD-MM-YYYY ఫార్మాట్‌లోకి మార్చడానికి
function formatDateToDdMmYyyy(dateStr) {
  if (!dateStr) return '';
  const cleanStr = String(dateStr).trim().split('T')[0];

  const isoMatch = cleanStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  const dmyMatch = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${day}-${month}-${year}`;
  }

  return cleanStr;
}

// 24-hour సమయాన్ని AM/PM ఫార్మాట్‌లోకి మార్చడానికి
function formatTimeToAmPm(timeStr) {
  if (!timeStr) return '';
  const parts = String(timeStr).trim().split(':');
  if (parts.length < 2) return timeStr;

  const hours24 = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  const seconds = parts[2] ? `:${parts[2].padStart(2, '0')}` : '';

  if (Number.isNaN(hours24)) return timeStr;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${minutes}${seconds} ${period}`;
}

export default function SouthIndianChart({ chartData, selectedItem, onSelectItem }) {
  const { ascendant = 0, planets = [], subject = '', meta = {}, houses = [] } = chartData || {};

  // లగ్నం ఏ రాశిలో ఉందో లెక్కించడం (0 - 11)
  const lagnamRashiIndex = Math.floor((((ascendant % 360) + 360) % 360) / 30);

  // ప్రతీ రాశిలో ఏయే గ్రహాలు ఉన్నాయో గ్రూప్ చేయడం
  const rashiPlanets = {};
  for (let i = 0; i < 12; i++) rashiPlanets[i] = [];

  const getHouse = (lon) => {
    const norm = (d) => ((d % 360) + 360) % 360;
    const l = norm(lon);
    if (!Array.isArray(houses) || houses.length !== 12) return 1;
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

  planets.forEach((p) => {
    const rIndex = Math.floor((((p.longitude % 360) + 360) % 360) / 30);
    if (rashiPlanets[rIndex]) {
      rashiPlanets[rIndex].push(p);
    }
  });

  const CELL_SIZE = 150;
  const TOTAL_SIZE = CELL_SIZE * 4; // 600px

  // లగ్నం ఉన్న రాశి గడి (box) క్లిక్ చేసినప్పుడు Chart Inspector కి సమాచారం పంపడం
  const handleSelectLagnam = (cell, e) => {
    if (e) e.stopPropagation();
    if (!onSelectItem) return;
    onSelectItem({
      type: 'lagnam',
      name: 'లగ్నం (Lagnam)',
      title: '↑ లగ్నం (Lagnam)',
      rashiName: cell.name,
      position: `లగ్నం: ${cell.name}`,
      houseNum: 1,
      retrograde: false,
    });
  };

  const formattedDob = meta?.date ? formatDateToDdMmYyyy(meta.date) : '';

  return (
    <div className="wheel-container text-center">
      <svg
        viewBox={`0 0 ${TOTAL_SIZE} ${TOTAL_SIZE}`}
        className="astro-svg"
        style={{ maxWidth: '540px', width: '100%', height: 'auto' }}
      >
        {/* బాహ్య ఫ్రేమ్ */}
        <rect
          x="0"
          y="0"
          width={TOTAL_SIZE}
          height={TOTAL_SIZE}
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="3"
        />

        {/* 4x4 గ్రిడ్ గీతలు మరియు రాశుల పెట్టెలు */}
        {GRID_LAYOUT.map((cell) => {
          const x = cell.col * CELL_SIZE;
          const y = cell.row * CELL_SIZE;
          const isLagnam = cell.rshiIndex === lagnamRashiIndex;
          const isLagnamSelected = isLagnam && selectedItem?.type === 'lagnam';
          const planetsInRashi = rashiPlanets[cell.rshiIndex] || [];

          return (
            <g
              key={cell.name}
              transform={`translate(${x}, ${y})`}
              style={{ cursor: isLagnam ? 'pointer' : 'default' }}
              onClick={isLagnam ? (e) => handleSelectLagnam(cell, e) : undefined}
            >
              {/* గడి బ్యాక్‌గ్రౌండ్ */}
              <rect
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={isLagnam ? '#e0f2fe' : '#ffffff'}
                stroke={isLagnamSelected ? '#0284c7' : '#cbd5e1'}
                strokeWidth={isLagnamSelected ? '2.5' : '1.5'}
              />

              {/* 1. సింబల్ + తెలుగు & పూర్తి ఇంగ్లీష్ రాశి పేరు */}
              <text x="8" y="17" fill="#334155" fontSize="12" fontWeight="bold">
                <tspan fill="#0284c7" fontSize="12.5">
                  {cell.symbol}
                </tspan>{' '}
                {cell.name}
              </text>

              {/* 2. లగ్నం(lag) బ్యాడ్జ్ */}
              {isLagnam && (
                <g transform="translate(8, 24)" style={{ pointerEvents: 'none' }}>
                  <rect width="66" height="16" rx="4" fill="#0284c7" />
                  <text
                    x="33"
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

              {/* 3. గ్రహాల పేర్లు (తెలుగు + ఇంగ్లీష్) */}
              <g transform={`translate(9, ${isLagnam ? 58 : 38})`}>
                {planetsInRashi.map((p, idx) => {
                  const pY = idx * 16.5;
                  const houseNum = getHouse(p.longitude);
                  const planetLabel = formatBilingualPlanetName(p.name);

                  return (
                    <g
                      key={p.name}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem &&
                          onSelectItem({
                            type: 'planet',
                            name: p.name,
                            title: `${p.symbol} ${p.name}`,
                            position: `${cell.symbol} ${cell.name} రాశి`,
                            houseNum: houseNum,
                            retrograde: p.retrograde,
                          });
                      }}
                    >
                      <text
                        x="0"
                        y={pY}
                        fill="#1e293b"
                        fontSize="12"
                        fontWeight="600"
                        className="zodiac-glyph"
                      >
                        {p.symbol} {planetLabel} {p.retrograde ? '℞' : ''}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
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
            y="56"
            fill="#0284c7"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            {subject || 'జాతక చక్రం'}
          </text>

          {/* 2. తేదీ (DD-MM-YYYY) / సమయం */}
          <text
            x={CELL_SIZE}
            y="96"
            fill="#334155"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            {[
              formattedDob,
              meta?.time ? formatTimeToAmPm(meta.time) : '',
            ]
              .filter(Boolean)
              .join(' / ')}
          </text>

          {/* 3. ఊరు */}
          <text
            x={CELL_SIZE}
            y="134"
            fill="#475569"
            fontSize="12"
            textAnchor="middle"
          >
            {meta?.location?.split(',')[0] || ''}
          </text>

          {/* చార్ట్ శైలి */}
          <text
            x={CELL_SIZE}
            y="174"
            fill="#d97706"
            fontSize="12"
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