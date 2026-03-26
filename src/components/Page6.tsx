import React from 'react';
import { REPORT_CONTEXT } from '../config/reportParams';

// ─────────────────────────────────────────────────────────────────
// BACKEND TODO — aerisk-engine + aerisk-backend
//
// 1. GET /stress-test/scenarios
//    → aerisk-engine/hazard/frost/stress_test.py
//    → Parametrii scenariilor (temp, durată, BBCH) calculați din
//      percentile extreme ale distribuției ERA5 (P99.5, P99.9)
//    → Returnează: { scenario_id, temp, duration_h, bbch, dauna_pct, pierdere_eur }
//
// 2. GET /stress-test/cash-flow
//    → aerisk-backend/app/routers/stress_test.py
//    → Input client: venituri_anuale, cheltuieli_fixe (salarii, rate, inputuri)
//      vin din UIInputContractV1 (câmpuri noi: annual_revenue, fixed_costs[])
//    → Returnează: { components: [{label, normal, scenA, scenB}], totals }
//
// 3. GET /stress-test/solvability
//    → aerisk-engine/services/solvability_simulator.py (fișier nou)
//    → Simulare N ani consecutivi de frost pe baza rezervelor declarate de client
//    → Returnează: { years: [{an, rezerve, pierdere, sold, insolvent: bool}] }
// ─────────────────────────────────────────────────────────────────

const Page6 = () => {
  const ctx = REPORT_CONTEXT;

  const exposure     = ctx.exposureValue ?? 10000;
  const currency     = ctx.currency ?? 'MDL';
  const currencyLbl  = currency === 'MDL' ? 'MDL' : currency === 'EUR' ? 'EUR' : 'USD';

  // Scenariile se calculează ca % din valoarea asigurată
  const pierdereA = Math.round(exposure * 1.00);   // 100%
  const pierdereB = Math.round(exposure * 0.65);   // 65%

  const scenarios = [
    {
      id: 'A',
      titlu: 'Scenariu A — Îngheț Sever Radiaționar (Black Swan)',
      headerBg: '#1e293b',
      params: [
        { label: 'Temperatură', val: '-5.5°C' },
        { label: 'Durată expunere', val: '10 ore' },
        { label: 'Stadiu BBCH', val: '65 — Înflorire Deplină' },
        { label: 'Tip îngheț', val: 'Radiaționar (aer uscat)' },
      ],
      impact: 'Necroză totală a organelor de reproducere. Compromitere ireversibilă a recoltei.',
      dauna: 100,
      pierdere: pierdereA,
      color: '#b91c1c',
      bg: '#fff1f2',
    },
    {
      id: 'B',
      titlu: 'Scenariu B — Îngheț Târziu Persistent (Accumulated Stress)',
      headerBg: '#475569',
      params: [
        { label: 'Temperatură', val: '-1.5°C' },
        { label: 'Durată expunere', val: '3 nopți consecutive' },
        { label: 'Stadiu BBCH', val: '71 — Fructe Legate' },
        { label: 'Tip îngheț', val: 'Advecție (masă de aer rece)' },
      ],
      impact: 'Avortarea fructelor proaspăt legate. Pierdere parțială irecuperabilă.',
      dauna: 65,
      pierdere: pierdereB,
      color: '#c2410c',
      bg: '#fff7ed',
    },
  ];

  // CFaR: componente cash-flow — venit din valoarea asigurată, costuri fixe estimate
  const salarii  = Math.round(exposure * 0.24);
  const motorina = Math.round(exposure * 0.08);
  const rate     = Math.round(exposure * 0.12);
  const inputuri = Math.round(exposure * 0.15);

  const cfComponents = [
    { label: 'Venit Recoltă',     normal: exposure,   scenA: 0,                        scenB: Math.round(exposure * 0.35) },
    { label: 'Salarii personal',  normal: -salarii,   scenA: -salarii,                  scenB: -salarii  },
    { label: 'Motorină / utilaje',normal: -motorina,  scenA: -motorina,                 scenB: -motorina },
    { label: 'Rate bancă',        normal: -rate,      scenA: -rate,                     scenB: -rate     },
    { label: 'Inputuri agricole', normal: -inputuri,  scenA: -inputuri,                 scenB: -inputuri },
  ];
  const totalNormal = cfComponents.reduce((s, r) => s + r.normal, 0);
  const totalA      = cfComponents.reduce((s, r) => s + r.scenA, 0);
  const totalB      = cfComponents.reduce((s, r) => s + r.scenB, 0);

  // Solvability: rezerve estimate = 80% din valoarea asigurată, deficit = pierdere netă Scenariu A
  const rezerveInitiale = Math.round(exposure * 0.80);
  const deficitAnual    = Math.abs(totalA);
  const sold1           = rezerveInitiale - deficitAnual;
  const sold2           = sold1 - deficitAnual;
  const deficit2        = Math.abs(Math.min(sold2, 0));

  const solvability = [
    { an: 'Anul 0 (bază)',  rezerve: rezerveInitiale, pierdere: 0,           sold: rezerveInitiale },
    { an: 'Anul 1 (frost)', rezerve: rezerveInitiale, pierdere: deficitAnual, sold: sold1          },
    { an: 'Anul 2 (frost)', rezerve: Math.max(sold1, 0), pierdere: deficitAnual, sold: sold2       },
  ];

  const pageStyle: React.CSSProperties = {
    width: '210mm', height: '297mm', boxSizing: 'border-box', padding: '18mm 20mm', margin: '0',
    backgroundColor: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.3)', position: 'relative',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    pageBreakAfter: 'always', breakAfter: 'page',
    color: '#1a202c', fontFamily: 'serif', fontSize: '12px', lineHeight: '1.5',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', borderBottom: '1px solid #000',
    paddingBottom: '6px', marginBottom: '10px', marginTop: '14px',
  };

  const fmt = (v: number) =>
    (v >= 0 ? '+ ' : '− ') + Math.abs(v).toLocaleString('ro-RO') + ' ' + currencyLbl;
  const fmtPos = (v: number) => v.toLocaleString('ro-RO') + ' ' + currencyLbl;

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 6: STRESS TESTING</div>
        </div>
      </div>

      {/* SECTION XIV — SCENARII DETERMINISTE */}
      <div>
        <h2 style={sectionTitle}>XIV. Scenarii Deterministe — What-If Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {scenarios.map((s) => (
            <div key={s.id} style={{ border: `1px solid ${s.color}`, borderRadius: '4px', overflow: 'hidden', backgroundColor: s.bg }}>
              <div style={{ backgroundColor: s.headerBg, color: 'white', padding: '6px 10px', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.04em' }}>
                {s.titlu}
              </div>
              <div style={{ padding: '8px 10px' }}>
                {/* Params grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginBottom: '6px' }}>
                  {s.params.map((p, i) => (
                    <div key={i} style={{ fontSize: '8px' }}>
                      <span style={{ color: '#64748b' }}>{p.label}: </span>
                      <strong style={{ color: '#1e293b' }}>{p.val}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '9px', color: '#475569', marginBottom: '6px', lineHeight: '1.4' }}>
                  {s.impact}
                </div>
                {/* Dauna bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${s.dauna}%`, height: '100%', backgroundColor: s.color, borderRadius: '999px' }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: s.color, whiteSpace: 'nowrap' }}>
                    {s.dauna}% — {s.pierdere.toLocaleString('ro-RO')} {currencyLbl}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION XV — CASH-FLOW AT RISK */}
      <div>
        <h2 style={sectionTitle}>XV. Analiza Cash-Flow at Risk (CFaR)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 600 }}>Componentă</th>
              <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 600 }}>An Normal</th>
              <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 600, backgroundColor: '#7f1d1d' }}>Scenariu A (−100%)</th>
              <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 600, backgroundColor: '#431407' }}>Scenariu B (−65%)</th>
            </tr>
          </thead>
          <tbody>
            {cfComponents.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white' }}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>{row.label}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: row.normal > 0 ? 'bold' : 'normal', color: row.normal > 0 ? '#16a34a' : '#475569' }}>
                  {fmt(row.normal)}
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', backgroundColor: '#fff1f2', fontWeight: row.scenA > 0 ? 'bold' : 'normal', color: row.scenA > 0 ? '#16a34a' : row.scenA < 0 ? '#b91c1c' : '#94a3b8' }}>
                  {row.scenA === 0 ? `0 ${currencyLbl}` : fmt(row.scenA)}
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', backgroundColor: '#fff7ed', fontWeight: row.scenB > 0 ? 'bold' : 'normal', color: row.scenB > 0 ? '#16a34a' : '#c2410c' }}>
                  {fmt(row.scenB)}
                </td>
              </tr>
            ))}
            {/* TOTAL row */}
            <tr style={{ backgroundColor: '#1e293b', color: 'white', fontWeight: 'bold' }}>
              <td style={{ padding: '5px 8px' }}>SOLD NET</td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#4ade80' }}>{fmt(totalNormal)}</td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#fca5a5' }}>{fmt(totalA)}</td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#fdba74' }}>{fmt(totalB)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION XVI — TEST SOLVABILITATE */}
      <div>
        <h2 style={sectionTitle}>XVI. Test de Solvabilitate — 2 Ani Consecutivi de Îngheț</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'start' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '5px 8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Perioadă</th>
                <th style={{ padding: '5px 8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Rezerve Inițiale</th>
                <th style={{ padding: '5px 8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Deficit Anual</th>
                <th style={{ padding: '5px 8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Sold Final</th>
              </tr>
            </thead>
            <tbody>
              {solvability.map((row, i) => {
                const insolvent = row.sold < 0;
                return (
                  <tr key={i} style={{ backgroundColor: insolvent ? '#fff1f2' : i % 2 === 0 ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', color: insolvent ? '#b91c1c' : '#1a202c' }}>{row.an}</td>
                    <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', color: '#475569' }}>{fmtPos(row.rezerve)}</td>
                    <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', color: row.pierdere > 0 ? '#b91c1c' : '#16a34a' }}>
                      {row.pierdere > 0 ? `− ${row.pierdere.toLocaleString('ro-RO')} ${currencyLbl}` : '—'}
                    </td>
                    <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 'bold', color: insolvent ? '#b91c1c' : '#16a34a' }}>
                      {insolvent ? `⚠ − ${Math.abs(row.sold).toLocaleString('ro-RO')} ${currencyLbl}` : `${row.sold.toLocaleString('ro-RO')} ${currencyLbl}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Verdict card */}
          <div style={{ width: '100px', backgroundColor: '#fff1f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>⚠️</div>
            <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '4px' }}>INSOLVENȚĂ AN 2</div>
            <div style={{ fontSize: '8px', color: '#7f1d1d', lineHeight: '1.4' }}>Deficit de {deficit2.toLocaleString('ro-RO')} {currencyLbl} fără rezerve sau asigurare</div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 6 DIN 8</span>
      </div>
    </div>
  );
};

export default Page6;
