import React from 'react';

const Page4 = () => {
  const data = {
    locatie: 'Ștefan Vodă, MD',
    coordonate: '46.51° N, 29.66° E',
    altitudine: '165 m',
    panta: '4–6°',
    expozitie: 'Sud-Est',
    distantaVale: '320 m',
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 4: EXPUNERE GEOSPAȚIALĂ</div>
        </div>
      </div>

      {/* DISCLAIMER BANNER */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '8px',
        backgroundColor: '#fffbeb', border: '1px solid #fcd34d',
        borderLeft: '3px solid #f59e0b', borderRadius: '4px',
        padding: '7px 10px', marginBottom: '4px',
      }}>
        <span style={{ fontSize: '12px', flexShrink: 0 }}>⚠️</span>
        <div>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#92400e', letterSpacing: '0.05em' }}>
            ESTIMARE REGIONALĂ v1.0 —{' '}
          </span>
          <span style={{ fontSize: '9px', color: '#78350f', lineHeight: '1.4' }}>
            Vizualizările de pe această pagină sunt <strong>scheme ilustrative</strong> bazate pe coordonate GPS și date ERA5 regionale.
            Profilul altimetric și zonele Frost Pocket sunt estimate, nu generate din date GIS reale.
            Modelul Digital al Terenului (DTM) la rezoluție 10m va fi integrat în <strong>AERISK v2.0</strong> prin API-ul Copernicus DEM.
          </span>
        </div>
      </div>

      {/* SECTION VIII — PROFIL MICRO-TOPOGRAFIC */}
      <div>
        <h2 style={sectionTitle}>VIII. Analiza Micro-Topografică (Profil Teren)</h2>
        <p style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', lineHeight: '1.5' }}>
          Aerul rece este mai dens decât cel cald și <strong>curge gravitațional la vale</strong>, exact ca apa.
          Livezile situate pe pante ușoare beneficiază de drenaj natural al aerului rece, reducând riscul de îngheț radiaționar față de fondurile de vale.
        </p>

        {/* TERRAIN CROSS-SECTION SVG */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px', marginBottom: '8px' }}>
          <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold', letterSpacing: '0.05em' }}>SECȚIUNE TRANSVERSALĂ — PROFIL ALTIMETRIC</div>
          <svg width="100%" viewBox="0 0 460 110" style={{ overflow: 'visible' }}>
            {/* Sky gradient area */}
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#bbf7d0" />
              </linearGradient>
              <linearGradient id="frostGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
            </defs>

            {/* Terrain fill */}
            <path d="M 0 30 L 60 25 L 120 35 L 180 50 L 230 60 L 280 68 L 340 78 L 380 90 L 420 95 L 460 98 L 460 110 L 0 110 Z"
              fill="url(#terrainGrad)" />

            {/* Terrain line */}
            <path d="M 0 30 L 60 25 L 120 35 L 180 50 L 230 60 L 280 68 L 340 78 L 380 90 L 420 95 L 460 98"
              fill="none" stroke="#16a34a" strokeWidth="1.5" />

            {/* Frost pocket zone (valley bottom) */}
            <path d="M 360 82 Q 410 95 460 98 L 460 110 L 360 110 Z"
              fill="url(#frostGrad)" opacity="0.7" />
            <text x="415" y="107" fontSize="8" fill="#1d4ed8" fontWeight="bold" textAnchor="middle">FROST</text>
            <text x="415" y="116" fontSize="7" fill="#1d4ed8" textAnchor="middle">POCKET</text>

            {/* Cold air flow arrows */}
            {[[100, 28, 140, 38], [170, 44, 210, 54], [240, 56, 280, 65], [300, 68, 340, 76]].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1 - 8} x2={x2} y2={y2 - 8} stroke="#93c5fd" strokeWidth="1.2" markerEnd="url(#arrow)" />
              </g>
            ))}
            <defs>
              <marker id="arrow" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
                <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="#93c5fd" />
              </marker>
            </defs>

            {/* Livada marker */}
            <rect x="175" y="38" width="70" height="18" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <text x="210" y="48" fontSize="8" fontWeight="bold" fill="#92400e" textAnchor="middle">🌸 LIVADĂ</text>
            <text x="210" y="57" fontSize="7" fill="#92400e" textAnchor="middle">165m alt.</text>

            {/* Altitude markers */}
            <line x1="0" y1="0" x2="0" y2="110" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x="5" y="28" fontSize="7" fill="#64748b">↑ 200m</text>
            <text x="5" y="65" fontSize="7" fill="#64748b">165m</text>
            <text x="430" y="96" fontSize="7" fill="#64748b">120m</text>

            {/* Cold air label */}
            <text x="260" y="18" fontSize="8" fill="#3b82f6" fontStyle="italic">← aer rece curge gravitațional</text>

            {/* X axis */}
            <line x1="0" y1="110" x2="460" y2="110" stroke="#94a3b8" strokeWidth="0.5" />
            <text x="0" y="118" fontSize="7" fill="#94a3b8">V (vest)</text>
            <text x="440" y="118" fontSize="7" fill="#94a3b8">E (est)</text>
          </svg>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { label: 'Altitudine', val: data.altitudine, note: 'medie livadă' },
            { label: 'Pantă', val: data.panta, note: 'gradient teren' },
            { label: 'Expozitie', val: data.expozitie, note: 'orientare versant' },
            { label: 'Dist. Vale', val: data.distantaVale, note: 'față de fond vale' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '2px' }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{s.val}</div>
              <div style={{ fontSize: '8px', color: '#64748b' }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION IX — FROST POCKETS */}
      <div>
        <h2 style={sectionTitle}>IX. Harta Zonelor de Acumulare a Aerului Rece (Frost Pockets)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'start' }}>

          {/* Frost pocket map SVG */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px' }}>
            <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold', letterSpacing: '0.05em' }}>SCHEMĂ ZONARE — ESTIMARE REGIONALĂ</div>
            <svg width="100%" viewBox="0 0 200 130">
              <rect width="200" height="130" fill="#f0fdf4" />
              {/* Contour lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <ellipse key={i} cx="100" cy="65" rx={90 - i * 12} ry={55 - i * 8}
                  fill="none" stroke="#bbf7d0" strokeWidth="0.8" />
              ))}
              {/* Frost pocket zones */}
              <ellipse cx="145" cy="100" rx="30" ry="18" fill="#bfdbfe" opacity="0.8" />
              <ellipse cx="30" cy="105" rx="22" ry="14" fill="#93c5fd" opacity="0.7" />
              {/* Livada */}
              <rect x="80" y="50" width="45" height="30" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
              <text x="102" y="65" fontSize="8" fontWeight="bold" fill="#92400e" textAnchor="middle">LIVADĂ</text>
              <text x="102" y="75" fontSize="7" fill="#92400e" textAnchor="middle">Ștefan Vodă</text>
              {/* North arrow */}
              <text x="185" y="15" fontSize="10" fill="#475569" fontWeight="bold">N↑</text>
              {/* Labels */}
              <text x="145" y="103" fontSize="7" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">FROST</text>
              <text x="30" y="108" fontSize="7" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">FROST</text>
            </svg>
          </div>

          {/* Legend + analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>LEGENDĂ HARTĂ RISC</div>
            {[
              { color: '#93c5fd', label: 'Frost Pocket — Risc Critic', desc: 'Aer rece stagnant, inversie termică nocturnă.' },
              { color: '#bfdbfe', label: 'Zonă Tampon — Risc Mediu', desc: 'Acumulare parțială, drenaj natural limitat.' },
              { color: '#fef3c7', label: 'Livadă Analizată', desc: 'Pantă 4–6°, drenaj bun, risc moderat.' },
              { color: '#bbf7d0', label: 'Versant Aerisit — Risc Scăzut', desc: 'Circulație activă a aerului, fără stagnare.' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: l.color, borderRadius: '2px', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1e293b' }}>{l.label}</div>
                  <div style={{ fontSize: '8px', color: '#64748b', lineHeight: '1.3' }}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION X — VENTILATION */}
      <div>
        <h2 style={sectionTitle}>X. Factorul de Ventilație Naturală</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            {
              icon: '⛰️',
              titlu: 'Pantă Teren: FAVORABIL',
              scoreColor: '#16a34a',
              score: '▲ Pozitiv',
              text: 'Panta de 4–6° asigură drenaj gravitațional al aerului rece. Livada nu se află în fond de vale — risc de frost pocket redus.',
            },
            {
              icon: '🌲',
              titlu: 'Obstacole: MODERAT',
              scoreColor: '#d97706',
              score: '◆ Neutru',
              text: 'Perdea forestieră parțială la NV (200m). Blochează vântul protector dar reduce și schimbul de aer cald din straturile superioare.',
            },
            {
              icon: '💨',
              titlu: 'Ventilație: ACTIVĂ',
              scoreColor: '#16a34a',
              score: '▲ Pozitiv',
              text: 'Expunerea SE favorizează brizele diurne de pe câmpie. Circulația naturală a aerului reduce probabilitatea inversiei termice nocturne.',
            },
          ].map((c, i) => (
            <div key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e293b', marginBottom: '3px' }}>{c.icon} {c.titlu}</div>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: c.scoreColor, marginBottom: '4px' }}>{c.score}</div>
              <div style={{ fontSize: '9px', color: '#475569', lineHeight: '1.4' }}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 4 DIN 8</span>
      </div>
    </div>
  );
};

export default Page4;
