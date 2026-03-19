import React from 'react';

const Page1 = () => {
  const data = {
    ref: "AERISK-ASSESS-2026-0452",
    client: "Agro-Enterprise Moldova",
    locatie: "Ștefan Vodă, MD",
    coordonate: "46.51° N, 29.66° E",
    activ: "Livadă Mere — Soiul Idared",
    suprafata: "10 Ha",
    valoare_asigurata: "€ 10,000 EUR",
    hazard: "Îngheț Târziu (Frost)",
    data_generare: "19 Martie 2026, 10:21 UTC",
    engine_version: "v1.0.0",
    confidence: "78%",
    risk_level: "MEDIU",
    risk_score: 427,
    risk_max: 1000,
    aal: "427.58",
    var90: "0.00",
    var95: "4,258.24",
    var99: "5,706.67",
    pml95: "4,258.24",
    pml99: "5,706.67",
  };

  const pageStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    boxSizing: 'border-box',
    padding: '18mm 20mm',
    margin: "0",
    backgroundColor: 'white',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    pageBreakAfter: 'always',
    breakAfter: 'page',
    color: '#1a202c',
    fontFamily: 'serif',
    fontSize: '12px',
    lineHeight: '1.6',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    borderBottom: '1px solid #000',
    paddingBottom: '6px',
    marginBottom: '16px',
    marginTop: '4px',
  };

  const riskColor = '#c2410c';
  const riskBg = '#fff7ed';
  const scorePercent = Math.round((data.risk_score / data.risk_max) * 100);

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 1: SUMAR EXECUTIV</div>
        </div>
      </div>

      {/* SECTION I — REZUMATUL EVALUĂRII */}
      <div style={{ marginBottom: '22px' }}>
        <h2 style={sectionTitle}>I. Rezumatul Evaluării</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Stânga — Date activ */}
          <div style={{ fontSize: '12px' }}>
            {[
              ['Referință Raport', data.ref],
              ['Client', data.client],
              ['Locație', data.locatie],
              ['Coordonate', data.coordonate],
              ['Activ Analizat', data.activ],
              ['Suprafață', data.suprafata],
              ['Valoare Asigurată', data.valoare_asigurata],
              ['Hazard Evaluat', data.hazard],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', borderBottom: '1px solid #f1f5f9', padding: '5px 0' }}>
                <span style={{ color: '#64748b', fontWeight: 600, fontSize: '11px' }}>{label}</span>
                <span style={{ color: '#1a202c', fontSize: '11px' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Dreapta — Status Risc */}
          <div style={{ backgroundColor: riskBg, border: `1px solid ${riskColor}`, borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.08em', marginBottom: '6px' }}>STATUS RISC AERISK</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: riskColor, marginBottom: '10px' }}>
              🟠 {data.risk_level}
            </div>
            {/* Bara scor */}
            <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>
              Scor: <strong style={{ color: '#1a202c' }}>{data.risk_score} / {data.risk_max}</strong>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${scorePercent}%`, height: '100%', backgroundColor: riskColor, borderRadius: '999px' }} />
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '8px' }}>
              Nivel Încredere Date: <strong style={{ color: '#1a202c' }}>{data.confidence}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION II — INDICATORI FINANCIARI */}
      <div style={{ marginBottom: '22px' }}>
        <h2 style={sectionTitle}>II. Indicatori Financiari (Solvency II)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Indicator</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Definiție</th>
              <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Perioadă Revenire</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>Valoare (EUR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '7px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>AAL</td>
              <td style={{ padding: '7px 12px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Pierdere Anuală Medie</td>
              <td style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>—</td>
              <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>€ {data.aal}</td>
            </tr>
            <tr>
              <td style={{ padding: '7px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>VaR 90%</td>
              <td style={{ padding: '7px 12px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Valoare la Risc — Nivel Baseline</td>
              <td style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>1 din 10 ani</td>
              <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>€ {data.var90}</td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '7px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>VaR 95%</td>
              <td style={{ padding: '7px 12px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Valoare la Risc — Bază Pricing</td>
              <td style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>1 din 20 ani</td>
              <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>€ {data.var95}</td>
            </tr>
            <tr style={{ backgroundColor: '#fff1f2' }}>
              <td style={{ padding: '7px 12px', fontWeight: 'bold', color: '#b91c1c', borderBottom: '1px solid #fecaca' }}>VaR 99%</td>
              <td style={{ padding: '7px 12px', color: '#b91c1c', borderBottom: '1px solid #fecaca' }}>Capital Subscriere (SCR) — Solvency II Art. 101</td>
              <td style={{ padding: '7px 12px', textAlign: 'center', color: '#b91c1c', borderBottom: '1px solid #fecaca' }}>1 din 100 ani</td>
              <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', color: '#b91c1c', borderBottom: '1px solid #fecaca' }}>€ {data.var99}</td>
            </tr>
            <tr>
              <td style={{ padding: '7px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>PML 95%</td>
              <td style={{ padding: '7px 12px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Pierdere Maximă Probabilă — ORSA</td>
              <td style={{ padding: '7px 12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Percentila 95</td>
              <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>€ {data.pml95}</td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '7px 12px', fontWeight: 'bold' }}>PML 99%</td>
              <td style={{ padding: '7px 12px', color: '#475569' }}>Pierdere Maximă Probabilă — SCR Calculat</td>
              <td style={{ padding: '7px 12px', textAlign: 'center' }}>Percentila 99</td>
              <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold' }}>€ {data.pml99}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION III — METADATE AUDIT */}
      <div>
        <h2 style={sectionTitle}>III. Metadate de Audit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '11px' }}>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
            <div style={{ color: '#64748b', fontSize: '9px', letterSpacing: '0.06em', marginBottom: '4px' }}>ID RAPORT</div>
            <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{data.ref}</div>
          </div>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
            <div style={{ color: '#64748b', fontSize: '9px', letterSpacing: '0.06em', marginBottom: '4px' }}>DATA GENERARE</div>
            <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{data.data_generare}</div>
          </div>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
            <div style={{ color: '#64748b', fontSize: '9px', letterSpacing: '0.06em', marginBottom: '4px' }}>VERSIUNE ENGINE</div>
            <div style={{ fontWeight: 'bold', fontSize: '10px' }}>AERISK ENGINE {data.engine_version}</div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE {data.engine_version} | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 1 DIN 8</span>
      </div>
    </div>
  );
};

export default Page1;
