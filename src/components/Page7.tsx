import React from 'react';

// ─────────────────────────────────────────────────────────────────
// BACKEND TODO — aerisk-engine + aerisk-backend
//
// 1. GET /mitigation/measures
//    → aerisk-engine/services/mitigation_calculator.py (fișier nou)
//    → Calculează reducerea AAL per măsură pe baza parametrilor locali
//    → Returnează: { measures: [{name, cost_eur, aal_reduction_pct, var99_after}] }
//
// 2. GET /mitigation/risk-curve-impact
//    → Compară VaR 90/95/99 înainte și după fiecare măsură
//    → Returnează: { before: {var90,var95,var99}, after: {var90,var95,var99} }
// ─────────────────────────────────────────────────────────────────

const Page7 = () => {

  // Date înainte/după protecție
  const varBefore = { var90: 1850, var95: 4258, var99: 5707 };
  const varAfter  = { var90: 462,  var95: 1064, var99: 1426 }; // -75% aspersiune

  const measures = [
    {
      icon: '💧',
      name: 'Sistem de Aspersiune Antifrost',
      desc: 'Protecție prin eliberarea căldurii latente de fuziune (0°C). Apa pulverizată formează un strat de gheață care menține mugurii la exact 0°C.',
      cost: '€ 3.500 / Ha',
      aalReduce: '-75%',
      var99After: '€ 1.426',
      eficienta: 75,
      color: '#2563eb',
    },
    {
      icon: '📡',
      name: 'Senzori IoT (Monitorizare Real-Time)',
      desc: 'Alerte automate la -0.5°C permit intervenție manuală (fumigație, biostimulatori) cu 45–90 minute înainte de atingerea pragului LT50.',
      cost: '€ 450 / senzor',
      aalReduce: '-15%',
      var99After: '€ 4.851',
      eficienta: 15,
      color: '#7c3aed',
    },
    {
      icon: '🛡️',
      name: 'Asigurare Parametrică',
      desc: 'Transferul riscului rezidual. Plata automată la depășirea pragului de temperatură — fără inspecție de daune, lichiditate imediată.',
      cost: 'Primă variabilă',
      aalReduce: 'Transfer',
      var99After: '€ 0 (acoperit)',
      eficienta: 100,
      color: '#059669',
    },
  ];

  // Bar chart data: VaR înainte vs după (grouped)
  const varLabels = ['VaR 90%\n1:10 ani', 'VaR 95%\n1:20 ani', 'VaR 99%\n1:100 ani (SCR)'];
  const beforeVals = [varBefore.var90, varBefore.var95, varBefore.var99];
  const afterVals  = [varAfter.var90,  varAfter.var95,  varAfter.var99];
  const maxVal = Math.max(...beforeVals);
  const chartH = 80;
  const barW = 18;
  const gap = 4;
  const groupW = barW * 2 + gap + 20;

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

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 7: MITIGAREA RISCULUI</div>
        </div>
      </div>

      {/* SECTION XVII — MĂSURI DE PROTECȚIE */}
      <div>
        <h2 style={sectionTitle}>XVII. Eficiența Măsurilor de Protecție Activă</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {measures.map((m, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', border: '1px solid #e2e8f0', borderLeft: `3px solid ${m.color}`, borderRadius: '4px', padding: '8px 10px', backgroundColor: '#f8fafc', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e293b', marginBottom: '3px' }}>{m.icon} {m.name}</div>
                <div style={{ fontSize: '9px', color: '#475569', lineHeight: '1.4' }}>{m.desc}</div>
                {/* Efficiency bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                  <div style={{ flex: 1, height: '5px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${m.eficienta}%`, height: '100%', backgroundColor: m.color, borderRadius: '999px' }} />
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: m.color }}>{m.aalReduce} AAL</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '2px' }}>Cost</div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1e293b' }}>{m.cost}</div>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '4px', marginBottom: '2px' }}>VaR 99% după</div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: m.color }}>{m.var99After}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION XVIII — IOT */}
      <div>
        <h2 style={sectionTitle}>XVIII. Monitorizare IoT — Fereastră de Intervenție</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { temp: '-0.5°C', timp: '90 min', actiune: 'Alertă SMS', risc: '#22c55e', label: 'PREGĂTIRE' },
            { temp: '-0.8°C', timp: '45 min', actiune: 'Pornire aspersoare', risc: '#f59e0b', label: 'INTERVENȚIE' },
            { temp: '-1.0°C', timp: '20 min', actiune: 'Fumigație + biostimulatori', risc: '#f97316', label: 'URGENȚĂ' },
            { temp: '-1.2°C', timp: '0 min', actiune: 'Daună ireversibilă (LT100)', risc: '#ef4444', label: 'PREA TÂRZIU' },
          ].map((s, i) => (
            <div key={i} style={{ border: `1px solid ${s.risc}`, borderTop: `3px solid ${s.risc}`, borderRadius: '4px', padding: '7px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', fontWeight: 'bold', color: s.risc, letterSpacing: '0.04em', marginBottom: '3px' }}>{s.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{s.temp}</div>
              <div style={{ fontSize: '8px', color: '#64748b', margin: '3px 0' }}>⏱ {s.timp} disponibil</div>
              <div style={{ fontSize: '8px', color: '#475569', lineHeight: '1.3' }}>{s.actiune}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '9px', color: '#64748b', fontStyle: 'italic', marginTop: '5px' }}>
          * Intervenția rapidă la -0.8°C poate salva 15–20% din recoltă față de un scenariu fără monitorizare.
        </div>
      </div>

      {/* SECTION XIX — IMPACT PE CURBA DE RISC */}
      <div>
        <h2 style={sectionTitle}>XIX. Impactul Aspersiunii asupra Curbei de Risc (VaR Înainte vs. După)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>

          {/* Grouped bar chart */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px 10px 6px 10px' }}>
            <svg width="100%" viewBox={`0 0 ${varLabels.length * groupW + 20} ${chartH + 36}`} style={{ overflow: 'visible' }}>
              {/* Grid */}
              {[0, 25, 50, 75, 100].map((pct) => {
                const y = chartH - (pct / 100) * chartH;
                const eurVal = Math.round((pct / 100) * maxVal);
                return (
                  <g key={pct}>
                    <line x1="0" y1={y} x2={varLabels.length * groupW + 20} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                    <text x="-2" y={y + 3} fontSize="7" textAnchor="end" fill="#94a3b8">€{(eurVal/1000).toFixed(1)}k</text>
                  </g>
                );
              })}
              {/* Bars */}
              {varLabels.map((label, i) => {
                const x = i * groupW + 10;
                const hB = (beforeVals[i] / maxVal) * chartH;
                const hA = (afterVals[i]  / maxVal) * chartH;
                return (
                  <g key={i}>
                    <rect x={x} y={chartH - hB} width={barW} height={hB} fill="#ef4444" opacity="0.7" rx="1" />
                    <rect x={x + barW + gap} y={chartH - hA} width={barW} height={hA} fill="#22c55e" opacity="0.8" rx="1" />
                    <text x={x + barW} y={chartH + 10} fontSize="7" textAnchor="middle" fill="#64748b">{label.split('\n')[0]}</text>
                    <text x={x + barW} y={chartH + 18} fontSize="6.5" textAnchor="middle" fill="#94a3b8">{label.split('\n')[1]}</text>
                  </g>
                );
              })}
              <line x1="0" y1={chartH} x2={varLabels.length * groupW + 20} y2={chartH} stroke="#1e293b" strokeWidth="1" />
            </svg>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8px', color: '#64748b' }}>
                <div style={{ width: '10px', height: '8px', backgroundColor: '#ef4444', opacity: 0.7, borderRadius: '1px' }} />Fără protecție
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8px', color: '#64748b' }}>
                <div style={{ width: '10px', height: '8px', backgroundColor: '#22c55e', opacity: 0.8, borderRadius: '1px' }} />Cu aspersiune
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div style={{ width: '95px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#166534', fontWeight: 'bold', marginBottom: '2px' }}>SCR REDUS</div>
              <div style={{ fontSize: '9px', color: '#64748b', textDecoration: 'line-through' }}>€ 5.707</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a' }}>€ 1.426</div>
              <div style={{ fontSize: '8px', color: '#16a34a', fontWeight: 'bold' }}>−75%</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px', fontSize: '8px', color: '#475569', lineHeight: '1.4' }}>
              ROI aspersiune: investiție €35.000 vs. risc evitat €4.281 / an (AAL × 10 ani).
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 7 DIN 8</span>
      </div>
    </div>
  );
};

export default Page7;
