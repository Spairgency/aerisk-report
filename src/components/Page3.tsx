import React, { useState, useEffect } from 'react';
import { REPORT_PARAMS, API_BASE_URL, PRECOMPUTED_METRICS, REPORT_CONTEXT } from '../config/reportParams';

// ─── Tipuri ──────────────────────────────────────────────────────────────────
interface PunctEP { loss: number; exceedance_probability: number; }
interface RaspunsEP {
  ep_points: PunctEP[];
  aal: number; var_90: number; var_95: number; var_99: number;
  n_simulations: number;
}

// ─── Fallback hardcodat (folosit dacă backend-ul nu răspunde) ─────────────────
const FALLBACK: RaspunsEP = {
  ep_points: [],
  aal: 427.58, var_90: 1850.20, var_95: 4258.24, var_99: 5706.67,
  n_simulations: 10000,
};

// ─── Helper: construiește path-ul SVG din punctele EP live ───────────────────
function buildEpPath(
  epPoints: PunctEP[], maxLoss: number, svgW: number, svgH: number
): string {
  if (!epPoints.length || maxLoss <= 0) return '';
  const nonZero = epPoints.filter(p => p.loss > 0);
  if (!nonZero.length) return `M 0 0 L 0 ${svgH}`;
  const startY = (1 - nonZero[0].exceedance_probability) * svgH;
  let d = `M 0 0 L 0 ${startY.toFixed(1)}`;
  for (const p of nonZero) {
    const x = Math.min((p.loss / maxLoss) * svgW, svgW);
    const y = (1 - p.exceedance_probability) * svgH;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

// ─── Componentă principală ────────────────────────────────────────────────────
const Page3 = () => {
  const [liveData, setLiveData] = useState<RaspunsEP | null>(null);
  const [loading, setLoading]   = useState(true);

  const currency      = REPORT_CONTEXT.currency ?? 'MDL';
  const currencyLabel = currency === 'MDL' ? 'MDL' : currency === 'EUR' ? 'EUR' : 'USD';
  const areaHa        = REPORT_CONTEXT.areaHa ?? 1;

  const fmtVal = (v: number) =>
    `${currencyLabel} ${v.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtPct = (v: number) =>
    `${(v * 100).toLocaleString('ro-RO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

  // ── Fetch EP Curve live ────────────────────────────────────────────────────
  useEffect(() => {
    const body = {
      hazard_probability: REPORT_PARAMS.hazardProbability,
      loss_ratio_min:     REPORT_PARAMS.lossRatioMin,
      loss_ratio_mode:    REPORT_PARAMS.lossRatioMode,
      loss_ratio_max:     REPORT_PARAMS.lossRatioMax,
      exposure_value:     REPORT_PARAMS.exposureValue,
      n_points:           150,
    };
    fetch(`${API_BASE_URL}/api/analytics/ep-curve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((json: RaspunsEP) => setLiveData(json))
      .catch(() => {/* fallback silențios */})
      .finally(() => setLoading(false));
  }, []);

  const d = liveData ?? FALLBACK;

  // Metrici — prioritate: PRECOMPUTED (din URL/dashboard) › live fetch › fallback
  const met = PRECOMPUTED_METRICS ?? {
    aal: d.aal, var_90: d.var_90, var_95: d.var_95, var_99: d.var_99,
  };

  // ── Pierdere Anuală Medie per hectar ──────────────────────────────────────
  const pamPerHa = met.aal > 0 && areaHa > 0 ? met.aal / areaHa : null;

  // ── Tabel perioade de revenire ────────────────────────────────────────────
  const randuri = [
    { eticheta: 'Pierdere Anuală Medie (PAM)', prob: '—', perioada: '—',             val: met.aal,    bg: '#f8fafc', bold: false, rosu: false },
    { eticheta: 'VaR 90% — Eveniment Frecvent',prob: '10,0%', perioada: '1 din 10 ani',  val: met.var_90, bg: 'white',   bold: false, rosu: false },
    { eticheta: 'VaR 95% — Bază Tarifare',     prob: '5,0%',  perioada: '1 din 20 ani',  val: met.var_95, bg: '#f8fafc', bold: false, rosu: false },
    { eticheta: 'VaR 99% — Capital Subscriere (Solvency II)', prob: '1,0%', perioada: '1 din 100 ani', val: met.var_99, bg: '#fff1f2', bold: true, rosu: true },
  ];

  // ── Scenarii solvabilitate 3 ani ─────────────────────────────────────────
  const rezervaInitiala = met.var_95 ?? 4258.24;
  const pierdereAnuala  = met.aal    ?? 427.58;
  const scenariiSolv = [0, 1, 2, 3].map(an => {
    const pierdere = an === 0 ? 0 : pierdereAnuala * (1 + (an - 1) * 0.5);
    const sold     = rezervaInitiala - pierdere;
    return { an, pierdere, sold, insolvent: sold < 0 };
  });

  // ── SVG EP Curve ──────────────────────────────────────────────────────────
  const svgW = 480; const svgH = 170;
  const maxLoss = d.ep_points.length
    ? Math.max(...d.ep_points.map(p => p.loss))
    : (met.var_99 ?? d.var_99) * 1.1;

  const epPath = d.ep_points.length
    ? buildEpPath(d.ep_points, maxLoss, svgW, svgH)
    : `M 0 2 C 40 8 80 30 130 78 C 180 126 230 150 290 160 C 350 168 400 171 ${svgW} 172`;

  const varXFn = (val: number) =>
    maxLoss > 0 ? Math.min((val / maxLoss) * svgW, svgW - 4) : 0;

  const puncteVar = [
    { cx: varXFn(met.var_90 ?? d.var_90), cy: svgH * 0.90, eticheta: 'VaR 90', culoare: '#fbbf24' },
    { cx: varXFn(met.var_95 ?? d.var_95), cy: svgH * 0.95, eticheta: 'VaR 95', culoare: '#f87171' },
    { cx: varXFn(met.var_99 ?? d.var_99), cy: svgH * 0.99, eticheta: 'VaR 99', culoare: '#991b1b' },
  ];

  const eticheteY = [
    { y: 0,           label: '100%' },
    { y: svgH * 0.5,  label: '50%'  },
    { y: svgH * 0.9,  label: '10%'  },
    { y: svgH * 0.95, label: '5%'   },
    { y: svgH * 0.99, label: '1%'   },
  ];

  // ── Stiluri ───────────────────────────────────────────────────────────────
  const pageStyle: React.CSSProperties = {
    width: '210mm', height: '297mm', boxSizing: 'border-box', padding: '16mm 20mm', margin: '0',
    backgroundColor: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.3)', position: 'relative',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    pageBreakAfter: 'always', breakAfter: 'page',
    color: '#1a202c', fontFamily: 'serif', fontSize: '12px', lineHeight: '1.5',
  };
  const titluSectiune: React.CSSProperties = {
    fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', borderBottom: '1px solid #000',
    paddingBottom: '5px', marginBottom: '9px', marginTop: '12px',
  };

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '14px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>
            PAGINA 3: DISTRIBUȚIA STATISTICĂ A RISCULUI
            {loading  && <span style={{ color: '#fbbf24', marginLeft: '8px' }}>● calculând…</span>}
            {!loading && liveData && <span style={{ color: '#16a34a', marginLeft: '8px' }}>● LIVE</span>}
          </div>
        </div>
      </div>

      {/* SECTION I — EP CURVE */}
      <div>
        <h2 style={titluSectiune}>I. Curba Probabilității de Depășire (EP Curve)</h2>
        <p style={{ fontSize: '10px', color: '#475569', marginBottom: '8px', lineHeight: '1.5' }}>
          Probabilitatea ca o pierdere financiară să fie <strong>depășită</strong> — obținută prin simulare{' '}
          <strong>Monte Carlo ({d.n_simulations.toLocaleString('ro-RO')} iterații, seed=42)</strong>.
          Axa Y: probabilitate de depășire; Axa X: severitate pierdere ({currencyLabel}).
        </p>

        <div style={{ position: 'relative', paddingLeft: '38px', paddingBottom: '20px' }}>
          <div style={{ position: 'absolute', left: 0, top: '45%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '8px', color: '#64748b', whiteSpace: 'nowrap', transformOrigin: 'center center' }}>
            Prob. Depășire (%)
          </div>

          <svg width="100%" viewBox={`-44 -8 ${svgW + 60} ${svgH + 28}`} style={{ overflow: 'visible' }}>
            {eticheteY.map((el, i) => (
              <g key={i}>
                <line x1="0" y1={el.y} x2={svgW} y2={el.y} stroke="#f1f5f9" strokeWidth="1" />
                <text x="-4" y={el.y + 3} fontSize="8" textAnchor="end" fill="#94a3b8">{el.label}</text>
              </g>
            ))}
            <line x1="0" y1="0" x2="0" y2={svgH + 2} stroke="#1e293b" strokeWidth="1.5" />
            <line x1="0" y1={svgH} x2={svgW + 2} y2={svgH} stroke="#1e293b" strokeWidth="1.5" />
            {epPath && <>
              <path d={epPath} fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d={`${epPath} L ${svgW} ${svgH} L 0 ${svgH} Z`} fill="#f1f5f9" opacity="0.5" />
            </>}
            {puncteVar.filter(p => p.cx > 0).map((p, i) => {
              const textX = Math.min(p.cx + 4, svgW - 42);
              return (
                <g key={i}>
                  <line x1={p.cx} y1={p.cy} x2={p.cx} y2={svgH} stroke={p.culoare} strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx={p.cx} cy={p.cy} r="5" fill={p.culoare} />
                  <text x={textX} y={p.cy - 6} fontSize="8" fontWeight="bold" fill={p.culoare}>{p.eticheta}</text>
                </g>
              );
            })}
            <text x={svgW / 2} y={svgH + 20} fontSize="8" textAnchor="middle" fill="#64748b">Severitate Pierdere ({currencyLabel})</text>
          </svg>
        </div>
      </div>

      {/* SECTION II — TABEL PERIOADE REVENIRE + card aal/ha */}
      <div>
        <h2 style={titluSectiune}>II. Perioade de Revenire și Indicatori de Capital</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '10px', alignItems: 'start' }}>

          {/* Tabel */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Indicator</th>
                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 600 }}>Prob. Anuală</th>
                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 600 }}>Perioadă</th>
                <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>Pierdere ({currencyLabel})</th>
              </tr>
            </thead>
            <tbody>
              {randuri.map((r, i) => (
                <tr key={i} style={{ backgroundColor: r.bg }}>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', fontWeight: r.bold ? 'bold' : 'normal', color: r.rosu ? '#b91c1c' : '#1a202c', fontSize: '10px' }}>{r.eticheta}</td>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: r.rosu ? '#b91c1c' : '#64748b' }}>{r.prob}</td>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: r.rosu ? '#b91c1c' : '#64748b' }}>{r.perioada}</td>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', color: r.rosu ? '#b91c1c' : '#1a202c' }}>
                    {r.val > 0 ? fmtVal(r.val) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Card PAM/ha */}
          <div style={{ border: '1.5px solid #16a34a', borderRadius: '6px', padding: '10px 12px', backgroundColor: '#f0fdf4' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              PAM per Hectar
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d', lineHeight: 1.2 }}>
              {pamPerHa != null ? fmtVal(pamPerHa) : '—'}
            </div>
            <div style={{ fontSize: '9px', color: '#166534', marginTop: '4px' }}>
              Pierdere medie / ha / an
            </div>
            <div style={{ fontSize: '8.5px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
              Suprafață asigurată: <strong>{areaHa.toLocaleString('ro-RO')} ha</strong>
            </div>
            <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
              PAM total: {fmtVal(met.aal ?? 0)}
            </div>
          </div>

        </div>

        <div style={{ fontSize: '8.5px', color: '#94a3b8', fontStyle: 'italic', marginTop: '5px' }}>
          * VaR 99% = Capital Cerut de Subscriere (SCR) conform Art. 101 al Directivei Solvency II (2009/138/CE).
          {liveData && <span> | Sursă: AERISK Engine v1 — Monte Carlo live ({liveData.n_simulations.toLocaleString('ro-RO')} simulări)</span>}
        </div>
      </div>

      {/* SECTION III — SCENARII SOLVABILITATE 3 ANI */}
      <div>
        <h2 style={titluSectiune}>III. Proiecție Solvabilitate — Rezervă pe 3 Ani</h2>
        <p style={{ fontSize: '10px', color: '#475569', marginBottom: '8px' }}>
          Evoluția rezervei tehnice inițiale (egală cu VaR 95%) în scenariul de pierdere anuală medie cumulată,
          cu escaladare de 50% pe an (condiții climatice adverse progresive).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {scenariiSolv.map((s) => {
            const culoare = s.insolvent ? '#b91c1c' : s.sold < rezervaInitiala * 0.5 ? '#ea580c' : '#15803d';
            const fundal  = s.insolvent ? '#fff1f2' : s.sold < rezervaInitiala * 0.5 ? '#fff7ed' : '#f0fdf4';
            const border  = s.insolvent ? '#fca5a5' : s.sold < rezervaInitiala * 0.5 ? '#fdba74' : '#86efac';
            return (
              <div key={s.an} style={{ border: `1.5px solid ${border}`, borderRadius: '5px', padding: '8px', backgroundColor: fundal }}>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: culoare, textTransform: 'uppercase', marginBottom: '3px' }}>
                  {s.an === 0 ? 'Start (Rezervă)' : `Anul ${s.an}`}
                </div>
                {s.an > 0 && (
                  <div style={{ fontSize: '8.5px', color: '#475569', marginBottom: '4px' }}>
                    Pierdere: {fmtVal(s.pierdere)}
                  </div>
                )}
                <div style={{ fontSize: '14px', fontWeight: 900, color: culoare, lineHeight: 1.2 }}>
                  {fmtVal(Math.abs(s.sold))}
                </div>
                <div style={{ fontSize: '8px', color: culoare, marginTop: '2px' }}>
                  {s.an === 0 ? 'Rezervă inițială' : s.insolvent ? '⚠ INSOLVABILITATE' : 'Sold rezervă'}
                </div>
                {s.an > 0 && !s.insolvent && (
                  <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '3px' }}>
                    Acoperire: {fmtPct(s.sold / rezervaInitiala)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '7px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Subscriere</span>
        <span>PAGINA 3 DIN 5</span>
      </div>
    </div>
  );
};

export default Page3;
