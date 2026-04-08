import React from 'react';
import { REPORT_CONTEXT, PRECOMPUTED_METRICS } from '../config/reportParams';

// ─── Pagina 4: Reziliență și Măsuri de Atenuare a Riscului ───────────────────
// Fuzionează conținutul din fostele pagini 6 (scenarii) și 7 (atenuare)
// în format consolidat de 5 pagini.
// ──────────────────────────────────────────────────────────────────────────────

const Page4 = () => {
  const ctx = REPORT_CONTEXT;

  const exposure     = ctx.exposureValue ?? 10000;
  const currency     = ctx.currency ?? 'MDL';
  const currencyLbl  = currency === 'MDL' ? 'MDL' : currency === 'EUR' ? 'EUR' : 'USD';
  const areaHa       = ctx.areaHa ?? 1;
  const cultura      = ctx.crop ?? 'apple';
  const fenofaza     = ctx.phenophase ?? 'flowering';

  const fmtVal = (v: number) =>
    `${currencyLbl} ${v.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // VaR-uri: PRECOMPUTED (din dashboard) → fallback estimat
  const var99 = PRECOMPUTED_METRICS?.var_99 ?? Math.round(exposure * 0.57);
  const var95 = PRECOMPUTED_METRICS?.var_95 ?? Math.round(exposure * 0.43);
  const aal   = PRECOMPUTED_METRICS?.aal    ?? Math.round(exposure * 0.15);

  // Scenarii deterministe de reziliență (ca % din valoarea expusă)
  const pierdereA = Math.round(exposure * 1.00); // 100% — Black Swan
  const pierdereB = Math.round(exposure * 0.65); // 65% — Stres acumulat

  const scenarii = [
    {
      id: 'A',
      titlu: 'Scenariu A — Îngheț Sever Radiaționar',
      subtitlu: 'Eveniment extrem (Black Swan) — 1 din 100 ani',
      headerBg: '#1e293b',
      params: [
        { eticheta: 'Temperatură minimă', val: '-5,5°C' },
        { eticheta: 'Durată expunere',    val: '10 ore' },
        { eticheta: 'Stadiu fenologic',   val: '65 — Înflorire Deplină' },
        { eticheta: 'Tip îngheț',         val: 'Radiaționar (noapte senină)' },
      ],
      impact: 'Necroză totală a organelor de reproducere. Compromitere ireversibilă a recoltei. LT100 atins.',
      dauna: 100,
      pierdere: pierdereA,
      culoare: '#b91c1c',
      bg: '#fff1f2',
      border: '#fca5a5',
    },
    {
      id: 'B',
      titlu: 'Scenariu B — Îngheț Persistent Acumulat',
      subtitlu: 'Eveniment frecvent (1 din 5–10 ani)',
      headerBg: '#475569',
      params: [
        { eticheta: 'Temperatură minimă', val: '-1,5°C' },
        { eticheta: 'Durată expunere',    val: '3 nopți consecutive' },
        { eticheta: 'Stadiu fenologic',   val: '71 — Fructe Legate' },
        { eticheta: 'Tip îngheț',         val: 'Advecție (masă de aer rece)' },
      ],
      impact: 'Avortarea fructelor proaspăt legate. Pierdere parțială irecuperabilă (65% din recoltă).',
      dauna: 65,
      pierdere: pierdereB,
      culoare: '#c2410c',
      bg: '#fff7ed',
      border: '#fdba74',
    },
  ];

  // Măsuri de atenuare a riscului
  const costMultiplier = currency === 'MDL' ? 20 : currency === 'USD' ? 1.08 : 1;
  const costAspersiune = Math.round(3500 * areaHa * costMultiplier);
  const costIoT        = Math.round(450  * costMultiplier);

  const masuri = [
    {
      icon: '💧',
      denumire: 'Sistem de Aspersiune Antifrost',
      descriere: 'Protecție prin căldura latentă de fuziune (0°C). Apa pulverizată formează un strat de gheață protector care menține mugurii la exact 0°C — indiferent de temperatura exterioară.',
      cost: `${costAspersiune.toLocaleString('ro-RO')} ${currencyLbl} / ${areaHa} ha`,
      reduceAAL: '−75%',
      var99Dupa: fmtVal(Math.round(var99 * 0.25)),
      eficienta: 75,
      culoare: '#2563eb',
      efBg: '#eff6ff',
    },
    {
      icon: '📡',
      denumire: 'Senzori IoT — Monitorizare în Timp Real',
      descriere: 'Alerte automate la −0,5°C permit intervenție manuală (fumigație, biostimulatori) cu 45–90 minute înainte de atingerea pragului LT50. ROI pozitiv din primul an.',
      cost: `${costIoT.toLocaleString('ro-RO')} ${currencyLbl} / senzor`,
      reduceAAL: '−15%',
      var99Dupa: fmtVal(Math.round(var99 * 0.85)),
      eficienta: 15,
      culoare: '#7c3aed',
      efBg: '#f5f3ff',
    },
    {
      icon: '🛡️',
      denumire: 'Asigurare Parametrică AERISK',
      descriere: 'Transfer integral al riscului rezidual. Plată automată la depășirea pragului termic — fără inspecție de daune, lichiditate imediată la fermier.',
      cost: 'Primă variabilă (% din valoarea asigurată)',
      reduceAAL: 'Transfer complet',
      var99Dupa: `${currencyLbl} 0 (acoperit)`,
      eficienta: 100,
      culoare: '#059669',
      efBg: '#f0fdf4',
    },
  ];

  // Recomandări
  const recomandari = [
    { prio: '1', text: 'Instalați minimum 2 senzori IoT la periferia livezii pentru alerte nocturne automate.' },
    { prio: '2', text: 'Evaluați costul-beneficiu al aspersiunii antifrost: la livezi >5 ha ROI se atinge în 2–3 sezoane.' },
    { prio: '3', text: 'Subscrieți asigurare parametrică AERISK pentru riscul rezidual rămas după atenuare.' },
    { prio: '4', text: 'Monitorizați stadiile BBCH în aplicația AERISK UI — alertele se declanșează automat la schimbare de fază.' },
  ];

  // ── Stiluri ───────────────────────────────────────────────────────────────
  const pageStyle: React.CSSProperties = {
    width: '210mm', height: '297mm', boxSizing: 'border-box', padding: '15mm 20mm', margin: '0',
    backgroundColor: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.3)', position: 'relative',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    pageBreakAfter: 'always', breakAfter: 'page',
    color: '#1a202c', fontFamily: 'serif', fontSize: '12px', lineHeight: '1.5',
  };
  const titluSectiune: React.CSSProperties = {
    fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', borderBottom: '1px solid #000',
    paddingBottom: '5px', marginBottom: '9px', marginTop: '11px',
  };

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>
            PAGINA 4: REZILIENȚĂ ȘI ATENUAREA RISCULUI
          </div>
        </div>
      </div>

      {/* SECTION I — SCENARII DETERMINISTE */}
      <div>
        <h2 style={titluSectiune}>I. Scenarii Critice de Reziliență</h2>
        <p style={{ fontSize: '10px', color: '#475569', marginBottom: '8px', lineHeight: '1.5' }}>
          Scenariile de mai jos simulează impactul financiar al unor episoade de îngheț asupra exploatației{' '}
          <strong>{ctx.locality ?? ctx.region ?? 'analizate'}</strong> ({cultura}, {fenofaza}).
          Valorile sunt calculate ca procent din expunerea declarată: <strong>{fmtVal(exposure)}</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '4px' }}>
          {scenarii.map((s) => (
            <div key={s.id} style={{ border: `1.5px solid ${s.border}`, borderRadius: '5px', overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{ backgroundColor: s.headerBg, color: 'white', padding: '7px 10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{s.titlu}</div>
                <div style={{ fontSize: '8.5px', color: '#94a3b8', marginTop: '1px' }}>{s.subtitlu}</div>
              </div>
              {/* Card body */}
              <div style={{ backgroundColor: s.bg, padding: '8px 10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginBottom: '6px' }}>
                  {s.params.map((p, i) => (
                    <div key={i} style={{ fontSize: '9px' }}>
                      <span style={{ color: '#94a3b8' }}>{p.eticheta}: </span>
                      <strong style={{ color: '#1e293b' }}>{p.val}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '9px', color: '#475569', fontStyle: 'italic', marginBottom: '7px', lineHeight: '1.4' }}>
                  {s.impact}
                </div>
                {/* Impact bar */}
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
                    <span style={{ color: '#475569' }}>Pierdere estimată recoltă</span>
                    <strong style={{ color: s.culoare }}>{s.dauna}%</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${s.dauna}%`, height: '100%', backgroundColor: s.culoare, borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>Pierdere financiară absolută:</span>
                  <strong style={{ fontSize: '11px', color: s.culoare }}>{fmtVal(s.pierdere)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparativ cu VaR */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 10px', fontSize: '9px', color: '#475569' }}>
          Scenariu A ({fmtVal(pierdereA)}) depășește VaR 99% ({fmtVal(var99)}) —
          capital de subscriere insuficient fără măsuri de atenuare. ·
          Scenariu B ({fmtVal(pierdereB)}) se situează între VaR 95% ({fmtVal(var95)}) și VaR 99%.
        </div>
      </div>

      {/* SECTION II — MASURI DE ATENUARE */}
      <div>
        <h2 style={titluSectiune}>II. Măsuri de Atenuare a Riscului</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {masuri.map((m, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 90px 90px 70px', gap: '8px', alignItems: 'center', backgroundColor: m.efBg, border: `1px solid #e2e8f0`, borderRadius: '4px', padding: '7px 10px' }}>
              <div style={{ fontSize: '16px', textAlign: 'center' }}>{m.icon}</div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: m.culoare, marginBottom: '2px' }}>{m.denumire}</div>
                <div style={{ fontSize: '8.5px', color: '#475569', lineHeight: '1.4' }}>{m.descriere}</div>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '2px' }}>Cost: {m.cost}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '1px' }}>Reducere PAM</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: m.culoare }}>{m.reduceAAL}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '1px' }}>VaR 99% după</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e293b' }}>{m.var99Dupa}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '3px', textAlign: 'center' }}>Eficacitate</div>
                <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${m.eficienta}%`, height: '100%', backgroundColor: m.culoare, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '8px', fontWeight: 'bold', color: m.culoare, textAlign: 'center', marginTop: '2px' }}>{m.eficienta}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION III — RECOMANDARI */}
      <div>
        <h2 style={titluSectiune}>III. Recomandări Operative pentru Fermier</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {recomandari.map((r) => (
            <div key={r.prio} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '7px 9px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                {r.prio}
              </div>
              <div style={{ fontSize: '9.5px', color: '#1e293b', lineHeight: '1.45' }}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '7px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Subscriere</span>
        <span>PAGINA 4 DIN 5</span>
      </div>
    </div>
  );
};

export default Page4;
