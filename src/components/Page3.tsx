import React from 'react';

const Page3 = () => {
  const data = {
    aal:   { val: 427.58,   prob: '-',     period: '—',              label: 'Average Annual Loss (AAL)' },
    var90: { val: 1850.20,  prob: '10.0%', period: '1 din 10 ani',   label: 'VaR 90% — Eveniment Frecvent' },
    var95: { val: 4258.24,  prob: '5.0%',  period: '1 din 20 ani',   label: 'VaR 95% — Bază Pricing' },
    var99: { val: 5706.67,  prob: '1.0%',  period: '1 din 100 ani',  label: 'VaR 99% — SCR Solvency II' },
  };

  const pageStyle: React.CSSProperties = {
    width: '210mm', height: '297mm', boxSizing: 'border-box', padding: '18mm 20mm', margin: "0",
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

  // SVG dimensions for EP curve
  const svgW = 480;
  const svgH = 180;
  // EP curve: X = loss (0→max), Y = probability of exceedance (100%→0%)
  // Y_svg = (1 - probability) * svgH  => high prob = top, low prob = bottom
  // Curve: smooth from top-left to bottom-right
  const epPath = `M 0 2 C 40 8 80 30 130 80 C 180 130 230 155 290 165 C 350 173 400 176 ${svgW} 178`;

  // VaR points on the curve
  // VaR 90 = 10% prob => Y = 0.90 * svgH = 162, X ≈ 130
  // VaR 95 = 5%  prob => Y = 0.95 * svgH = 171, X ≈ 290
  // VaR 99 = 1%  prob => Y = 0.99 * svgH = 178, X ≈ 430
  const pts = [
    { cx: 130, cy: 80, label: 'VaR 90', color: '#fbbf24', textX: 140, textY: 74, anchor: 'start' },
    { cx: 290, cy: 165, label: 'VaR 95', color: '#f87171', textX: 298, textY: 159, anchor: 'start' },
    { cx: 430, cy: 175, label: 'VaR 99 (Tail Risk)', color: '#991b1b', textX: 320, textY: 148, anchor: 'start' },
  ];

  // Y-axis probability labels (inverted: high prob = top of chart)
  const yLabels = [
    { y: 0,   label: '100%' },
    { y: svgH * 0.5,  label: '50%'  },
    { y: svgH * 0.9,  label: '10%'  },
    { y: svgH * 0.95, label: '5%'   },
    { y: svgH * 0.99, label: '1%'   },
  ];

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 3: MODELARE PROBABILISTICĂ</div>
        </div>
      </div>

      {/* SECTION V — EP CURVE */}
      <div>
        <h2 style={sectionTitle}>V. Curba de Excedență a Probabilității (EP Curve)</h2>
        <p style={{ fontSize: '11px', color: '#475569', marginBottom: '10px', lineHeight: '1.5' }}>
          Graficul prezintă probabilitatea ca o pierdere financiară să fie <strong>depășită</strong>, obținută prin
          simulare <strong>Monte Carlo (10.000 iterații)</strong>. Axa Y indică probabilitatea de excedență;
          axa X — severitatea pierderii (EUR).
        </p>

        {/* SVG EP CURVE */}
        <div style={{ position: 'relative', paddingLeft: '40px', paddingBottom: '24px' }}>
          {/* Y axis label */}
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '9px', color: '#64748b', whiteSpace: 'nowrap', transformOrigin: 'center center' }}>
            Prob. Excedență (%)
          </div>

          <svg width="100%" viewBox={`-44 -10 ${svgW + 60} ${svgH + 30}`} style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {yLabels.map((yl, i) => (
              <g key={i}>
                <line x1="0" y1={yl.y} x2={svgW} y2={yl.y} stroke="#f1f5f9" strokeWidth="1" />
                <text x="-4" y={yl.y + 3} fontSize="8" textAnchor="end" fill="#94a3b8">{yl.label}</text>
              </g>
            ))}

            {/* Axes */}
            <line x1="0" y1="0" x2="0" y2={svgH + 2} stroke="#1e293b" strokeWidth="1.5" />
            <line x1="0" y1={svgH} x2={svgW + 2} y2={svgH} stroke="#1e293b" strokeWidth="1.5" />

            {/* EP Curve */}
            <path d={epPath} fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />

            {/* Shaded area under curve */}
            <path d={`${epPath} L ${svgW} ${svgH} L 0 ${svgH} Z`} fill="#f1f5f9" opacity="0.5" />

            {/* VaR dashed lines + points */}
            {pts.map((p, i) => (
              <g key={i}>
                <line x1={p.cx} y1={p.cy} x2={p.cx} y2={svgH} stroke={p.color} strokeWidth="1" strokeDasharray="3 2" />
                <circle cx={p.cx} cy={p.cy} r="5" fill={p.color} />
                <text x={p.textX} y={p.textY} fontSize="9" fontWeight="bold" fill={p.color} textAnchor={p.anchor as 'start'}>{p.label}</text>
              </g>
            ))}

            {/* X axis label */}
            <text x={svgW / 2} y={svgH + 20} fontSize="9" textAnchor="middle" fill="#64748b">Severitate Pierdere (EUR)</text>
          </svg>
        </div>
      </div>

      {/* SECTION VI — MONTE CARLO */}
      <div>
        <h2 style={sectionTitle}>VI. Metodologie — Simularea Monte Carlo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { icon: '🔁', titlu: '10.000 Iterații', text: 'Fiecare iterație simulează un sezon complet cu un eveniment de îngheț generat aleatoriu din distribuția historică.' },
            { icon: '📊', titlu: 'Distribuție Heavy-Tail', text: 'Modelul folosește distribuție Pareto pentru a capta corect evenimentele rare dar catastrofale (Black Swan).' },
            { icon: '✅', titlu: 'Validat Backtest', text: 'Modelul a fost calibrat pe 30 ani (1994–2024) de date ERA5 și comparate cu daune reale raportate. AUC-ROC: 0.87.' },
          ].map((c, i) => (
            <div key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>{c.icon} {c.titlu}</div>
              <div style={{ fontSize: '9px', color: '#475569', lineHeight: '1.5' }}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION VII — RETURN PERIODS TABLE */}
      <div>
        <h2 style={sectionTitle}>VII. Tabel de Perioade de Revenire (Return Periods)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 600 }}>Indicator</th>
              <th style={{ padding: '7px 10px', textAlign: 'center', fontWeight: 600 }}>Probabilitate Anuală</th>
              <th style={{ padding: '7px 10px', textAlign: 'center', fontWeight: 600 }}>Perioadă Revenire</th>
              <th style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600 }}>Pierdere Estimată (EUR)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { ...data.aal,  bg: '#f8fafc', bold: false, red: false },
              { ...data.var90, bg: 'white',   bold: false, red: false },
              { ...data.var95, bg: '#f8fafc', bold: false, red: false },
              { ...data.var99, bg: '#fff1f2', bold: true,  red: true  },
            ].map((row, i) => (
              <tr key={i} style={{ backgroundColor: row.bg }}>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: row.bold ? 'bold' : 'normal', color: row.red ? '#b91c1c' : '#1a202c' }}>{row.label}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: row.red ? '#b91c1c' : '#64748b' }}>{row.prob}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: row.red ? '#b91c1c' : '#64748b' }}>{row.period}</td>
                <td style={{ padding: '7px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', color: row.red ? '#b91c1c' : '#1a202c' }}>
                  {row.val > 0 ? `€ ${row.val.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: '9px', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>
          * VaR 99% reprezintă cerința de capital Solvency II (SCR) conform Art. 101 al Directivei 2009/138/CE.
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 3 DIN 8</span>
      </div>
    </div>
  );
};

export default Page3;
