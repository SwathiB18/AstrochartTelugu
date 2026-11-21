'use client';

import React, { useState, useEffect } from 'react';
import SouthIndianChart from './components/SouthIndianChart.tsx';

import AstroWheel, {
  formatZodiacPosition,
  getHousePlacement,
} from './components/AstroWheel.tsx';
import { getNakshatraInfo, fetchNatalChart, SAMPLE_CHART_DATA } from './lib/astro.js';

function formatDisplayTime(timeStr?: string): string {
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

function formatGenderLabel(gender?: string): string {
  if (gender === 'Female') return 'స్త్రీ  (Female)';
  return 'పురుషుడు (Male)';
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: 'Sri Ram',
    gender: 'Male',
    date: '1995-08-24',
    time: '14:30:00',
    location: 'Hyderabad, India',
    latitude: '17.3850',
    longitude: '78.4867',
  });

  const [chartData, setChartData] = useState<any>({
    ...SAMPLE_CHART_DATA,
    meta: { ...SAMPLE_CHART_DATA.meta, gender: 'Male' },
  });
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const placeName = formData.location.trim();
    if (placeName.length < 3) return;

    const timer = setTimeout(async () => {
      setFetchingLocation(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(placeName)}`
        );
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data && data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(data[0].lat).toFixed(4),
            longitude: parseFloat(data[0].lon).toFixed(4),
          }));
        }
      } catch (error) {
        console.warn('Network offline or OpenStreetMap unreachable.');
      } finally {
        setFetchingLocation(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.location]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSelectedItem(null);
    const result = await fetchNatalChart(formData);
    setChartData({
      ...result,
      meta: {
        ...result.meta,
        gender: formData.gender,
      },
    });
    setLoading(false);
  };

  const handleDownloadChart = () => {
    const svgElement = document.querySelector('#south-indian-chart-box svg') as SVGSVGElement | null;
    if (!svgElement) return;

    const exportSize = 1200;
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

    if (!clonedSvg.getAttribute('xmlns')) {
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    clonedSvg.removeAttribute('style');
    clonedSvg.setAttribute('width', String(exportSize));
    clonedSvg.setAttribute('height', String(exportSize));

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportSize, exportSize);
        ctx.drawImage(img, 0, 0, exportSize, exportSize);

        const pngUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `${formData.name || 'kundli'}-south-indian-chart.png`;
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      console.error('Failed to render chart image.');
    };

    img.src = url;
  };

  const moonPlanet = chartData?.planets?.find(
    (p: any) => p.name.includes('చంద్రుడు') || p.symbol === '☽'
  );
  const nakshatraInfo = moonPlanet
    ? getNakshatraInfo(moonPlanet.longitude)
    : { rashi: 'సింహం', nakshatra: 'పూర్వఫల్గుని (పుబ్బ)', pada: 1 };

  return (
    <main className="container-fluid py-4 px-lg-5 bg-light min-vh-100 text-dark">
      <header className="mb-4 pb-3 border-bottom border-secondary-subtle">
        <h1 className="h3 mb-1 fw-bold" style={{ color: '#312e81' }}>
          దక్షిణాది వేద జ్యోతిష్య చక్రం (South Indian Kundli)
        </h1>
        <p className="fw-bold small mb-0" style={{ color: '#312e81' }}>
          తెలుగు / దక్షిణాది సంప్రదాయ గ్రిడ్ పద్ధతిలో రాశి చక్రం మరియు గ్రహాల అమరిక (Zodiac and planetary alignment in the traditional Telugu/South Indian grid format)
        </p>
      </header>

      <div className="row g-4">
        {/* ఎడమ వైపు ఫామ్ మరియు వివరాలు */}
        <div className="col-lg-4">
          {/* 1. జన్మ వివరాల ఫామ్ */}
          <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
            <div className="card-body p-4">
              <h2 className="h5 card-title mb-3 text-primary fw-bolder">జన్మ వివరాలు(Birth Details)</h2>

              <form onSubmit={handleCalculate}>
                <div className="mb-3">
                  <label className="form-label small text-dark">జాతకుని పేరు(Name)</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control bg-light border-secondary-subtle text-dark"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* లింగం (Gender: Male / Female) */}
                <div className="mb-3">
                  <label className="form-label small text-dark">లింగం (Gender)</label>
                  <select
                    name="gender"
                    className="form-select bg-light border-secondary-subtle text-dark"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">పురుషుడు (Male)</option>
                    <option value="Female">స్త్రీ (Female)</option>
                  </select>
                </div>

                {/* Date & Time సమాంతర అలైన్‌మెంట్ */}
                <div className="row g-2 mb-3 align-items-stretch">
                  <div className="col-6 d-flex flex-column justify-content-between">
                    <label className="form-label small text-dark mb-1">
                      పుట్టిన తేదీ(Date of birth)
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="form-control bg-light border border-secondary-subtle text-dark mt-auto"
                      style={{
                        colorScheme: 'light',
                        borderColor: '#cbd5e1',
                      }}
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-6 d-flex flex-column justify-content-between">
                    <label className="form-label small text-dark mb-1">
                      సమయం (Time in IST)
                    </label>
                    <input
                      type="time"
                      step="1"
                      name="time"
                      className="form-control bg-light border border-secondary-subtle text-dark shadow-none mt-auto"
                      style={{
                        colorScheme: 'light',
                        borderColor: '#cbd5e1',
                      }}
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small text-dark mb-1">
                      పుట్టిన ప్రదేశం (Place of Birth)
                    </label>
                    {fetchingLocation && (
                      <span className="small text-primary" style={{ fontSize: '0.75rem' }}>
                        వెతుకుతోంది...(Searching)
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="location"
                    className="form-control bg-light border-secondary-subtle text-dark"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="ఉదా: Hyderabad"
                    required
                  />
                  <div className="form-text text-dark" style={{ fontSize: '0.7rem' }}>
                    - నెట్‌వర్క్ లేకపోతే కింద ఉన్న అక్షాంశ, రేఖాంశాలను మీరే మార్చుకోండి .(Enter latitude & longitude manually if network is unavailable)
                  </div>
                </div>

                <div className="row g-2 mb-4 align-items-stretch">
                  <div className="col-6 d-flex flex-column justify-content-between">
                    <label className="form-label small text-dark mb-1">అక్షాంశం (Latitude)</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      className="form-control bg-light border-secondary-subtle text-dark mt-auto"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-6 d-flex flex-column justify-content-between">
                    <label className="form-label small text-dark mb-1">రేఖాంశం (Longitude)</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      className="form-control bg-light border-secondary-subtle text-dark mt-auto"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary fw-bolder"
                    disabled={loading || fetchingLocation}
                  >
                    {loading ? 'గణిస్తోంది...' : 'చక్రం రూపొందించండి(Create chart)'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 2. జన్మ రాశి మరియు నక్షత్ర సారాంశం */}
          <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white border-start border-primary border-4">
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-primary mb-3">ముఖ్య విశేషాలు (Key Highlights)</h3>
              <div>
                <p className="mb-2">
                  <strong className="text-dark">జన్మ రాశి(Zodiac sign):</strong>{' '}
                  <span className="text-info fw-bold">{nakshatraInfo.rashi}</span>
                </p>
                <p className="mb-2">
                  <strong className="text-dark">జన్మ నక్షత్రం(Birth star):</strong>{' '}
                  <span className="text-success fw-bold">{nakshatraInfo.nakshatra}</span>
                </p>
                <p className="mb-0">
                  <strong className="text-dark">పాదము(Pada):</strong>{' '}
                  <span className="text-warning fw-bold">{nakshatraInfo.pada} వ పాదం</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3. ఇన్‌స్పెక్టర్ ప్యానెల్ */}
          <div className="card shadow-sm border-0 rounded-4 bg-white">
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-dark mb-3">ఎంచుకున్న అంశం(Chart Inspector)</h3>
              {selectedItem ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="text-info mb-0">{selectedItem.title}</h5>
                    {selectedItem.retrograde && (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                        వక్రం (℞)
                      </span>
                    )}
                  </div>
                  <p className="text-primary fw-semibold mb-1">{selectedItem.position}</p>
                  {selectedItem.houseNum && (
                    <p className="small text-dark mb-0">
                      స్థానం: <strong>{selectedItem.houseNum}వ భావం</strong>
                    </p>
                  )}
                </div>
              ) : (
                <p className="small text-dark mb-0">
                  చక్రంపై లేదా పట్టికలో ఏదైనా గ్రహంపై క్లిక్ చేయండి.(Click any planet glyph on the Astrochart/table to
                  inspect exact coordinates and placements).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* కుడి వైపు దక్షిణాది రాశి చక్రం మరియు పట్టిక */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 bg-white">
            <div className="card-body p-4 text-center">
              <h2 className="h5 mb-2 text-dark fw-bold">
                {chartData.subject} - నమూనా చార్ట్ డేటా
              </h2>

              {/* Print & Download బటన్లు */}
              <div className="d-flex flex-wrap justify-content-center gap-2 my-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline-primary btn-sm px-3"
                >
                  🖨️ Print / PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownloadChart}
                  className="btn btn-outline-primary btn-sm px-3"
                >
                  ⬇️ Download Chart
                </button>
              </div>

              {/* బటన్ల తర్వాత లింగం / తేదీ / సమయం / ఊరు సారాంశ బార్ */}
              <div className="d-inline-flex flex-wrap justify-content-center align-items-center gap-2 px-3 py-2 mb-4 rounded-3 bg-light border border-secondary-subtle small text-dark">
                <span>👤 <strong>{formatGenderLabel(chartData.meta?.gender)}</strong></span>
                <span className="text-secondary">•</span>
                <span>📅 <strong>{chartData.meta?.date}</strong></span>
                {chartData.meta?.time && (
                  <>
                    <span className="text-secondary">•</span>
                    <span>🕒 <strong>{formatDisplayTime(chartData.meta.time)}</strong></span>
                  </>
                )}
                {chartData.meta?.location && (
                  <>
                    <span className="text-secondary">•</span>
                    <span>📍 <strong>{chartData.meta.location}</strong></span>
                  </>
                )}
              </div>

              {/* దక్షిణాది చతురస్రాకార గ్రిడ్ చార్ట్ */}
              <div id="south-indian-chart-box">
                <SouthIndianChart
                  chartData={chartData}
                  selectedItem={selectedItem}
                  onSelectItem={setSelectedItem}
                />
              </div>

              {/* గ్రహాల పట్టిక */}
              <div className="table-responsive mt-4 text-start">
                <table className="table table-hover table-sm align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>గ్రహం(Planet)</th>
                      <th>రాశి మరియు డిగ్రీలు(Zodiac sign &amp; degrees)</th>
                      <th>భావం (House)</th>
                      <th>స్థితి(Position)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.planets.map((p: any) => {
                      const pos = formatZodiacPosition(p.longitude);
                      const house = getHousePlacement(p.longitude, chartData.houses);
                      return (
                        <tr
                          key={p.name}
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            setSelectedItem({
                              type: 'planet',
                              name: p.name,
                              title: `${p.symbol} ${p.name}`,
                              position: pos.formatted,
                              houseNum: house,
                              retrograde: p.retrograde,
                            })
                          }
                        >
                          <td className="fw-semibold">
                            <span className="text-primary me-2">{p.symbol}</span>
                            {p.name}
                          </td>
                          <td>{pos.formatted}</td>
                          <td>{house}వ భావం</td>
                          <td>
                            {p.retrograde ? (
                              <span className="text-danger">వక్రం (Retrograde)</span>
                            ) : (
                              <span className="text-muted">సమస్థితి (Direct)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-5 py-4 bg-white border-top border-secondary-subtle">
        <div className="container-fluid px-lg-5 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span className="text-dark small">
            &copy; 2026 by <strong className="text-dark fw-semibold">Swathi Bommaraju</strong> | All rights reserved.
          </span>
          <span className="text-dark small">
            దక్షిణాది వేద జ్యోతిష్య చక్రం(South Indian Kundli)
          </span>
        </div>
      </footer>
    </main>
  );
}