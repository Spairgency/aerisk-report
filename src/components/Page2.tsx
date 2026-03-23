import React from 'react';

const Page2 = () => {

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
    marginBottom: '12px',
    marginTop: '16px',
  };

  const valoareAsigurata = 10000;

  const damageRows = [
    { temp: '0°C → -0.5°C',   daunaP: 15,  desc: 'Cristale de gheață în spații intercelulare. Daune parțial reversibile.', lt: 'Sub LT15' },
    { temp: '-0.5°C → -1.0°C', daunaP: 55, desc: 'Distrugerea stilului și ovarului florii. Pierdere majoră de producție.',  lt: 'LT50'    },
    { temp: 'sub -1.2°C',      daunaP: 100, desc: 'Punct critic de îngheț al celulei. Compromitere totală a recoltei.',       lt: 'LT100'   },
  ];

  const bbchStages = [
    { luna: 'Ianuarie–Februarie', stadiu: 'Repaus Vegetativ',   vulnerabilitate: 0,   color: '#e2e8f0', textColor: '#475569' },
    { luna: 'Martie',             stadiu: 'Umflare Muguri',     vulnerabilitate: 10,  color: '#fef9c3', textColor: '#92400e' },
    { luna: 'Aprilie',            stadiu: 'Înflorire',          vulnerabilitate: 100, color: '#ef4444', textColor: '#ffffff' },
    { luna: 'Mai',                stadiu: 'Cădere Petale',      vulnerabilitate: 75,  color: '#fed7aa', textColor: '#c2410c' },
    { luna: 'Iunie–August',       stadiu: 'Fructificare',       vulnerabilitate: 20,  color: '#bbf7d0', textColor: '#166534' },
  ];

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 2: ANALIZA VULNERABILITĂȚII</div>
        </div>
      </div>

      {/* SECTION I — DAMAGE FUNCTION */}
      <div>
        <h2 style={sectionTitle}>I. Matricea de Vulnerabilitate (Damage Function)</h2>
        <p style={{ fontSize: '11px', color: '#475569', marginBottom: '12px', lineHeight: '1.6' }}>
          Corelația dintre temperatura minimă înregistrată și severitatea pierderii economice,
          bazată pe pragurile critice biologice ale soiului <strong>Idared</strong> în faza de înflorire
          (Aprilie — stadiul BBCH 60–69).
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Prag Temperatură</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Prag Biologic</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Daună (%)</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Pierdere (EUR)</th>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Impact Biologic</th>
            </tr>
          </thead>
          <tbody>
            {damageRows.map((row, i) => {
              const pierdere = Math.round(valoareAsigurata * row.daunaP / 100);
              const isTotal = row.daunaP === 100;
              return (
                <tr key={i} style={{ backgroundColor: isTotal ? '#fff1f2' : i % 2 === 0 ? '#f8fafc' : 'white' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', color: isTotal ? '#b91c1c' : '#1a202c' }}>{row.temp}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: isTotal ? '#b91c1c' : '#64748b' }}>{row.lt}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      <div style={{ width: '50px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.daunaP}%`, height: '100%', backgroundColor: isTotal ? '#ef4444' : '#f97316', borderRadius: '999px' }} />
                      </div>
                      <span style={{ fontWeight: 'bold', color: isTotal ? '#b91c1c' : '#1a202c' }}>{row.daunaP}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', color: isTotal ? '#b91c1c' : '#1a202c' }}>
                    € {pierdere.toLocaleString('ro-RO')}
                  </td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '10px', lineHeight: '1.4' }}>{row.desc}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SECTION II — BBCH CALENDAR */}
      <div>
        <h2 style={sectionTitle}>II. Calendarul Sensibilității Fenologice (BBCH)</h2>
        <p style={{ fontSize: '11px', color: '#475569', marginBottom: '10px', lineHeight: '1.6' }}>
          Vulnerabilitatea activului variază radical în funcție de stadiul de dezvoltare al culturii.
          Riscul este concentrat în fereastra de <strong>înflorire (Aprilie)</strong> când orice îngheț cauzează daune ireversibile:
        </p>
        <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          {bbchStages.map((s, i) => (
            <div key={i} style={{
              flex: s.vulnerabilitate === 100 ? 2 : 1,
              backgroundColor: s.color,
              padding: '9px 6px',
              textAlign: 'center',
              borderRight: i < bbchStages.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
            }}>
              <div style={{ fontSize: '8px', color: s.textColor, opacity: 0.8, marginBottom: '2px' }}>{s.luna}</div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: s.textColor }}>{s.stadiu}</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '3px', color: s.textColor }}>{s.vulnerabilitate}%</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>
          * Procentul reprezintă vulnerabilitatea maximă posibilă în acel stadiu fenologic.
        </div>
      </div>

      {/* SECTION III — S-CURVE + NOTE EXPERT */}
      <div>
        <h2 style={sectionTitle}>III. Factori de Precizie — Note Metodologice</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Curba S */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Curba S de Vulnerabilitate</div>
            {[
              { temp: '0°C',    val: 0   },
              { temp: '-0.5°C', val: 15  },
              { temp: '-0.8°C', val: 35  },
              { temp: '-1.0°C', val: 55  },
              { temp: '-1.1°C', val: 80  },
              { temp: '-1.2°C', val: 100 },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '9px', color: '#64748b', width: '42px', textAlign: 'right' }}>{r.temp}</span>
                <div style={{ flex: 1, height: '9px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.val}%`, height: '100%', backgroundColor: r.val === 100 ? '#ef4444' : r.val > 50 ? '#f97316' : '#fbbf24', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '9px', fontWeight: 'bold', width: '28px', color: r.val === 100 ? '#b91c1c' : '#475569' }}>{r.val}%</span>
              </div>
            ))}
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>Accelerare non-liniară sub -0.8°C</div>
          </div>

          {/* Note expert */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                icon: '🍎',
                titlu: 'Soiul Idared — Specificitate',
                text: 'Soiul Idared înflorește cu 5–7 zile mai devreme față de Golden Delicious, extinzând fereastra de expunere. Modelul calibrează pragurile LT50/LT100 per soi.',
              },
              {
                icon: '⏱️',
                titlu: 'Durata Înghețului (Ore-Grad)',
                text: 'Dauna biologică depinde și de durata expunerii, nu doar de temperatură. O expunere de 5 ore la -1°C produce daune semnificativ mai mari decât 20 minute la aceeași temperatură.',
              },
              {
                icon: '💧',
                titlu: 'Tipul Înghețului (Umed vs. Uscat)',
                text: 'Îngheț negru (aer uscat, fără brumă) este mai periculos — bruma formează un strat protector. Modelul utilizează umiditatea relativă regională pentru a diferenția tipul de eveniment.',
              },
            ].map((n, i) => (
              <div key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e293b', marginBottom: '3px' }}>{n.icon} {n.titlu}</div>
                <div style={{ fontSize: '10px', color: '#475569', lineHeight: '1.5' }}>{n.text}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 2 DIN 8</span>
      </div>
    </div>
  );
};

export default Page2;
