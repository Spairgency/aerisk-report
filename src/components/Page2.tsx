/**
 * AERISK RAPORT — Pagina 2: Analiza Biologică — Fenologie și Praguri Critice
 *
 * Conținut:
 *   I.  Calendar Fenologic BBCH — 14 stadii pentru cultura selectată
 *   II. Matricea de Vulnerabilitate Comparativă — 5 culturi × stadii cheie
 *   III. Praguri Biologice Critice (LT50) per cultură × perioadă de risc
 *
 * Limbă: exclusiv română tehnică
 * Constrângere: fără termeni englezi
 */
import React from 'react';
import { REPORT_CONTEXT } from '../config/reportParams';

// ─── Date biologice calibrate ─────────────────────────────────────────────────

const CULTURI_LABEL: Record<string, string> = {
  apple: 'Măr', plum: 'Prun', cherry: 'Cireș',
  peach: 'Piersic', grape: 'Viță de vie',
  mar: 'Măr', prun: 'Prun', cires: 'Cireș',
  piersic: 'Piersic', vita: 'Viță de vie',
};

function cropLabel(c: string): string {
  return CULTURI_LABEL[c?.toLowerCase?.()] ?? c ?? 'Cultură';
}

// 14 stadii BBCH cu vulnerabilitate (mode%) pentru fiecare cultură
// Ordinea = cronologică (ian → oct)
const STADII_BBCH = [
  { id: 'dormant',          label: 'Repaus Vegetativ',     bbch: '00–03',  luna: 'Ian–Feb',   culori: { apple:5, plum:5,  cherry:5,  peach:7,  grape:5  } },
  { id: 'budbreak',         label: 'Dezmugurire',          bbch: '07–09',  luna: 'Mar',       culori: { apple:22, plum:26, cherry:30, peach:35, grape:26 } },
  { id: 'mouse_ear',        label: 'Frunzuliță (Mugure)',  bbch: '10–15',  luna: 'Mar–Apr',   culori: { apple:28, plum:32, cherry:38, peach:45, grape:32 } },
  { id: 'pink_bud',         label: 'Buton Floral',         bbch: '57–59',  luna: 'Apr',       culori: { apple:40, plum:44, cherry:48, peach:55, grape:42 } },
  { id: 'early_flowering',  label: 'Înflorire Incipientă', bbch: '60–61',  luna: 'Apr',       culori: { apple:50, plum:52, cherry:58, peach:65, grape:50 } },
  { id: 'flowering',        label: 'ÎNFLORIRE DEPLINĂ',    bbch: '65',     luna: 'Apr–Mai',   culori: { apple:68, plum:72, cherry:75, peach:78, grape:52 } },
  { id: 'petal_fall',       label: 'Căderea Petalelor',    bbch: '67–69',  luna: 'Mai',       culori: { apple:60, plum:62, cherry:65, peach:68, grape:40 } },
  { id: 'fruit_set',        label: 'Legarea Fructelor',    bbch: '71–74',  luna: 'Mai',       culori: { apple:35, plum:38, cherry:42, peach:45, grape:30 } },
  { id: 'june_drop',        label: 'Cădere Fiziologică',   bbch: '74–75',  luna: 'Iun',       culori: { apple:15, plum:18, cherry:22, peach:22, grape:20 } },
  { id: 'fruit_growth',     label: 'Creșterea Fructelor',  bbch: '75–79',  luna: 'Iun–Aug',   culori: { apple:20, plum:24, cherry:28, peach:26, grape:25 } },
  { id: 'veraison',         label: 'Pârgă / Maturare',     bbch: '81–85',  luna: 'Aug–Sep',   culori: { apple:16, plum:16, cherry:20, peach:18, grape:20 } },
  { id: 'harvest',          label: 'Recoltare',             bbch: '87–89',  luna: 'Sep–Oct',   culori: { apple:11, plum:12, cherry:18, peach:12, grape:14 } },
  { id: 'leaf_fall',        label: 'Căderea Frunzelor',    bbch: '91–97',  luna: 'Oct–Nov',   culori: { apple:2,  plum:2,  cherry:2,  peach:2,  grape:2  } },
];

// Praguri LT50 la înflorire deplină per cultură (sursa: INCDH Pitești + KU Leuven)
const LT50_CULTURI = [
  { cultură: 'Piersic',      lt50: '-1,0°C',  lt100: '-2,0°C',  dezmug: 'Mar 10–25',  infl: 'Apr 1–15',  sensib: 'MAXIM',   color: '#b91c1c' },
  { cultură: 'Cireș',        lt50: '-1,0°C',  lt100: '-2,0°C',  dezmug: 'Mar 15–28',  infl: 'Apr 5–20',  sensib: 'RIDICAT', color: '#dc2626' },
  { cultură: 'Prun',         lt50: '-1,8°C',  lt100: '-3,5°C',  dezmug: 'Mar 20–Apr5', infl: 'Apr 8–22',  sensib: 'RIDICAT', color: '#ea580c' },
  { cultură: 'Măr',          lt50: '-1,8°C',  lt100: '-3,2°C',  dezmug: 'Mar 28–Apr8', infl: 'Apr 15–30', sensib: 'MODERAT', color: '#f97316' },
  { cultură: 'Viță de vie',  lt50: '-0,5°C',  lt100: '-1,2°C',  dezmug: 'Apr 1–15',   infl: 'Mai 15–30', sensib: 'SCĂZUT',  color: '#16a34a' },
];

// Culturi comparate în tabelul matricial
const CULTURI_COMP = ['apple', 'plum', 'cherry', 'peach', 'grape'];

// Stadii cheie afișate în tabelul comparativ
const STADII_COMP = ['budbreak', 'pink_bud', 'flowering', 'petal_fall', 'fruit_set'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CropKey = 'apple' | 'plum' | 'cherry' | 'peach' | 'grape';

function vuln(stadiu: typeof STADII_BBCH[number], crop: string): number {
  const k = crop as CropKey;
  return stadiu.culori[k] ?? 5;
}

function vulnColor(pct: number): string {
  if (pct >= 60) return '#b91c1c';
  if (pct >= 45) return '#dc2626';
  if (pct >= 30) return '#f97316';
  if (pct >= 15) return '#fbbf24';
  return '#16a34a';
}

function vulnBg(pct: number): string {
  if (pct >= 60) return '#fef2f2';
  if (pct >= 45) return '#fff1f2';
  if (pct >= 30) return '#fff7ed';
  if (pct >= 15) return '#fffbeb';
  return '#f0fdf4';
}

// ─── Componentă ──────────────────────────────────────────────────────────────

const Page2 = () => {
  const ctx = REPORT_CONTEXT;
  const cropRaw   = (ctx.crop ?? 'apple').toLowerCase();
  const cropNorm  = CULTURI_LABEL[cropRaw] ? cropRaw : 'apple';
  const labelCrop = cropLabel(cropRaw);
  const variety   = ctx.variety || '';

  const page: React.CSSProperties = {
    width: '210mm', height: '297mm', boxSizing: 'border-box',
    padding: '14mm 18mm', margin: 0, backgroundColor: 'white',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)', position: 'relative',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    pageBreakAfter: 'always', breakAfter: 'page',
    color: '#1a202c', fontFamily: 'serif', fontSize: '10.5px', lineHeight: '1.55',
  };

  const secTitle: React.CSSProperties = {
    fontSize: '9.5px', fontWeight: 'bold', textTransform: 'uppercase',
    letterSpacing: '0.09em', borderBottom: '1px solid #000',
    paddingBottom: '4px', marginBottom: '10px', marginTop: '12px',
  };

  const currentPhase = STADII_BBCH.find(s => s.id === ctx.phenophase)
    ?? STADII_BBCH.find(s => s.id === 'flowering')!;
  const currentVuln = vuln(currentPhase, cropNorm);

  return (
    <div style={page}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '12px' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-1px' }}>AERISK</div>
          <div style={{ fontSize: '8.5px', color: '#64748b', letterSpacing: '0.05em' }}>PLATFORMĂ DE RISC CLIMATIC AGRICOL</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '8.5px', color: '#94a3b8', letterSpacing: '0.05em', marginTop: '2px' }}>PAGINA 2: ANALIZĂ BIOLOGICĂ — FENOLOGIE ȘI PRAGURI CRITICE</div>
        </div>
      </div>

      {/* SECȚIUNEA I — CALENDAR FENOLOGIC BBCH */}
      <div>
        <h2 style={secTitle}>I. Calendar Fenologic BBCH — {labelCrop}{variety ? ` (${variety})` : ''}</h2>

        {/* Bara de stadii */}
        <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
          {STADII_BBCH.map((s, i) => {
            const pct     = vuln(s, cropNorm);
            const isActive = s.id === ctx.phenophase;
            const bg       = isActive ? vulnBg(pct) : i % 2 === 0 ? '#f8fafc' : 'white';
            const border   = isActive ? `2px solid ${vulnColor(pct)}` : 'none';
            return (
              <div key={s.id} style={{
                flex: s.id === 'flowering' ? 1.6 : 1,
                backgroundColor: bg,
                border,
                padding: '5px 2px', textAlign: 'center',
                borderRight: i < STADII_BBCH.length - 1 ? '1px solid #e2e8f0' : 'none',
                position: 'relative',
              }}>
                {isActive && (
                  <div style={{ fontSize: '6px', color: vulnColor(pct), fontWeight: 900, marginBottom: '1px' }}>▼ STADIU ACTUAL</div>
                )}
                <div style={{ fontSize: '7px', color: '#94a3b8', marginBottom: '1px' }}>{s.luna}</div>
                <div style={{ fontSize: '7.5px', fontWeight: isActive ? 'bold' : 600, color: isActive ? vulnColor(pct) : '#334155', lineHeight: '1.3' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '7px', color: '#94a3b8', marginTop: '1px' }}>BBCH {s.bbch}</div>
                {/* Bara vulnerabilitate */}
                <div style={{ width: '80%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '99px', margin: '3px auto 0' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: vulnColor(pct), borderRadius: '99px' }} />
                </div>
                <div style={{ fontSize: '8px', fontWeight: 'bold', color: vulnColor(pct), marginTop: '1px' }}>{pct}%</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: '8px', color: '#64748b', fontStyle: 'italic', marginBottom: '2px' }}>
          * Vulnerabilitate (%) = pierdere estimată la hazard ÎNGHEȚ în stadiul respectiv ·
          Stadiu actual evaluat: <strong style={{ color: vulnColor(currentVuln) }}>{currentPhase.label} — {currentVuln}%</strong>
        </div>
      </div>

      {/* SECȚIUNEA II — MATRICEA DE VULNERABILITATE COMPARATIVĂ */}
      <div>
        <h2 style={secTitle}>II. Matricea de Vulnerabilitate Comparativă — Toate Culturile (Îngheț Primar)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 600 }}>Stadiu Fenologic</th>
              {CULTURI_COMP.map(c => (
                <th key={c} style={{
                  padding: '5px 8px', textAlign: 'center', fontWeight: 600,
                  backgroundColor: c === cropNorm ? '#334155' : '#1e293b',
                }}>
                  {cropLabel(c)}
                  {c === cropNorm && <div style={{ fontSize: '7px', color: '#94a3b8', fontWeight: 400 }}>← evaluat</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STADII_COMP.map((sid, idx) => {
              const stadiu = STADII_BBCH.find(s => s.id === sid)!;
              const isActiveRow = sid === ctx.phenophase;
              return (
                <tr key={sid} style={{ backgroundColor: isActiveRow ? '#fef9c3' : idx % 2 === 0 ? '#f8fafc' : 'white' }}>
                  <td style={{ padding: '5px 8px', fontWeight: isActiveRow ? 'bold' : 'normal', borderBottom: '1px solid #e2e8f0', fontSize: '9px' }}>
                    {isActiveRow && '▶ '}{stadiu.label}
                    <div style={{ fontSize: '7.5px', color: '#94a3b8' }}>BBCH {stadiu.bbch} · {stadiu.luna}</div>
                  </td>
                  {CULTURI_COMP.map(c => {
                    const pct = vuln(stadiu, c);
                    const isSelected = c === cropNorm;
                    return (
                      <td key={c} style={{
                        padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0',
                        backgroundColor: isSelected ? vulnBg(pct) : 'transparent',
                        fontWeight: isSelected ? 'bold' : 'normal',
                      }}>
                        <span style={{
                          color: vulnColor(pct), fontWeight: 'bold',
                          fontSize: isSelected ? '10.5px' : '9.5px',
                        }}>{pct}%</span>
                        <div style={{ width: '40px', height: '3px', backgroundColor: '#e2e8f0', borderRadius: '99px', margin: '2px auto 0' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: vulnColor(pct), borderRadius: '99px' }} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ fontSize: '7.5px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
          Valorile reprezintă rata de pierdere modală (%) pentru eveniment ÎNGHEȚ în stadiul respectiv.
          Calibrate din CROP_VULNERABILITY_V1 (LAB v1.0.0, commit c7b7a52) × 17 stadii BBCH.
        </div>
      </div>

      {/* SECȚIUNEA III — PRAGURI BIOLOGICE LT50 */}
      <div>
        <h2 style={secTitle}>III. Praguri Biologice Critice (LT50) — Rezistența la Îngheț per Cultură</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 600 }}>Cultură</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>LT50 la Înflorire</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>LT100 (Pierdere Totală)</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>Dezmugurire (RM)</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>Înflorire (RM)</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>Sensibilitate</th>
            </tr>
          </thead>
          <tbody>
            {LT50_CULTURI.map((r, i) => {
              const isSelected = cropLabel(cropNorm) === r.cultură ||
                (cropNorm === 'grape' && r.cultură === 'Viță de vie');
              return (
                <tr key={i} style={{ backgroundColor: isSelected ? '#fef9c3' : i % 2 === 0 ? '#f8fafc' : 'white' }}>
                  <td style={{ padding: '5px 8px', borderBottom: '1px solid #e2e8f0', fontWeight: isSelected ? 'bold' : 'normal' }}>
                    {isSelected && '▶ '}{r.cultură}
                  </td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: r.color }}>{r.lt50}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', color: '#b91c1c', fontWeight: 'bold' }}>{r.lt100}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '8.5px' }}>{r.dezmug}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '8.5px' }}>{r.infl}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{
                      fontSize: '8px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '10px',
                      backgroundColor: r.color + '20', color: r.color, border: `1px solid ${r.color}50`,
                    }}>{r.sensib}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ fontSize: '7.5px', color: '#64748b', marginTop: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <div>⚠️ <strong>LT50</strong> = temperatura la care 50% din flori sunt distruse ireversibil</div>
          <div>🔴 <strong>LT100</strong> = temperatura la care paguba este totală (100% din organe florale)</div>
          <div>📅 Date fenologice calibrate pe bazinul Moldova (1991–2020), ERA5 Open-Meteo</div>
          <div>📚 Surse: INCDH Pitești · KU Leuven Frost Database · FAO Agrometeorologie</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '6px', fontSize: '8.5px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 · Confidențial — Document pentru Subscriere Asigurări Agricole</span>
        <span>PAGINA 2 DIN 5</span>
      </div>
    </div>
  );
};

export default Page2;
