/**
 * AERISK RAPORT PRO — Page 1: Sumar Executiv
 * Layout bazat pe schița utilizatorului:
 *   Stânga: tabel date activ (raion, sat, coordonate, tip, cultură, soi, stadiu, suprafață, valoare, hazard)
 *   Dreapta: panou STATUS RISC (probabilitate, fereastră critică, nivel, scor, încredere)
 *   Jos: tabel indicatori financiari Solvency II (AAL / VaR90/95/99 / PML99)
 */
import React from 'react';
import { REPORT_CONTEXT, PRECOMPUTED_METRICS } from '../config/reportParams';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ASSET_LABELS: Record<string, string> = {
  orchard:  'Livadă',
  vineyard: 'Vie',
  crop:     'Cultură de câmp',
  field:    'Cultură de câmp',
};

const HAZARD_LABELS: Record<string, string> = {
  FROST:   'Îngheț Târziu',
  HAIL:    'Grindină',
  DROUGHT: 'Secetă',
  HEAT:    'Stres Termic',
  FLOOD:   'Inundație',
};

const STAGE_LABELS: Record<string, string> = {
  // stadii generice
  dormant:        'Repaus vegetativ',
  budbreak:       'Dezmugurire',
  emergence:      'Răsărire',
  tillering:      'Înfrățire',
  flowering:      'Înflorire',
  full_bloom:     'Înflorire deplină',
  fruit_set:      'Legarea fructelor',
  grain_fill:     'Umplerea boabelor',
  veraison:       'Pârgă',
  harvest:        'Recoltare',
  petal_fall:     'Căderea petalelor',
  // stadii BBCH specifice măr/piersic/prun
  mouse_ear:      'Urechiușe de șoarece',
  green_tip:      'Vârf verde',
  half_inch:      'Dezmugurire ½ inch',
  tight_cluster:  'Butonaș strâns',
  open_cluster:   'Butonaș deschis',
  pink_bud:       'Buton roz',
  first_pink:     'Prim roz',
  white_bud:      'Buton alb',
  full_pink:      'Roz complet',
  // stadii viță-de-vie
  woolly_bud:     'Mugur lânos',
  green_shoot:    'Lăstar verde',
  leaf_5_6:       '5–6 frunze desfăcute',
  bunch_visible:  'Ciorchine vizibil',
  pre_flowering:  'Pre-înflorire',
  // stadii cereale
  germination:    'Germinare',
  heading:        'Spicuire',
  ripening:       'Maturare',
};

const RISK_COLOR: Record<string, string> = {
  HIGH:   '#b91c1c',   // red-700
  MEDIUM: '#ea580c',   // orange-600
  LOW:    '#16a34a',   // green-600
};

const RISK_BG: Record<string, string> = {
  HIGH:   '#fef2f2',   // red tint
  MEDIUM: '#fff7ed',   // orange tint
  LOW:    '#f0fdf4',   // green tint
};

const RISK_BORDER: Record<string, string> = {
  HIGH:   '#fca5a5',   // red-300 — vizibil
  MEDIUM: '#fdba74',   // orange-300 — vizibil
  LOW:    '#86efac',   // green-300 — vizibil
};

const RISK_EMOJI: Record<string, string> = {
  HIGH:   '🔴',
  MEDIUM: '🟠',
  LOW:    '🟢',
};

function fmt(v: number | undefined | null, cur = 'EUR'): string {
  if (v === undefined || v === null) return '—';
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(v) + ' ' + cur;
}

function genRef(): string {
  const d = new Date();
  const yy = d.getFullYear();
  const mm  = String(d.getMonth() + 1).padStart(2, '0');
  const dd  = String(d.getDate()).padStart(2, '0');
  const region = REPORT_CONTEXT.region.replace(/\s+/g, '').slice(0, 6).toUpperCase();
  const hazard = (REPORT_CONTEXT.hazardType ?? 'XX').slice(0, 2);
  return `AERISK-${yy}${mm}${dd}-${region}-${hazard}`;
}

function genDate(): string {
  return new Date().toLocaleString('ro-RO', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC';
}

/**
 * calcRiskScore — Scor de risc unificat 0–100
 *
 * Logică: fiecare nivel de risc definește un interval [floor, ceiling].
 * Probabilitatea hazardului determină poziția în acel interval.
 *
 *   LOW    → [ 10,  40]   hazard rar, impact limitat
 *   MEDIUM → [ 40,  70]   hazard moderat
 *   HIGH   → [ 70, 100]   hazard frecvent, impact sever
 *
 * Exemple:
 *   42% prob + HIGH   → 70 + round(0.42 × 30) = 83 / 100  ✅ RIDICAT
 *   20% prob + MEDIUM → 40 + round(0.20 × 30) = 46 / 100  ✅ MEDIU
 *    5% prob + LOW    → 10 + round(0.05 × 30) = 12 / 100  ✅ SCĂZUT
 *   80% prob + HIGH   → 70 + round(0.80 × 30) = 94 / 100  ✅ RIDICAT
 */
function calcRiskScore(hazardProbability: number, riskLevel: string): number {
  const FLOOR:   Record<string, number> = { HIGH: 70, MEDIUM: 40, LOW: 10 };
  const CEILING: Record<string, number> = { HIGH: 100, MEDIUM: 70, LOW: 40 };
  const lvl     = (riskLevel ?? 'MEDIUM').toUpperCase();
  const floor   = FLOOR[lvl]   ?? 40;
  const ceiling = CEILING[lvl] ?? 70;
  const p       = Math.min(1, Math.max(0, hazardProbability));
  return Math.round(floor + p * (ceiling - floor));
}

// ─── Componentă ──────────────────────────────────────────────────────────────
const Page1 = () => {
  const ctx = REPORT_CONTEXT;
  const met = PRECOMPUTED_METRICS;

  const riskLevelUp  = (ctx.riskLevel ?? 'MEDIUM').toUpperCase();
  const riskColor    = RISK_COLOR[riskLevelUp]  ?? '#ea580c';
  const riskBg       = RISK_BG[riskLevelUp]     ?? '#fff7ed';
  const riskBorder   = RISK_BORDER[riskLevelUp] ?? '#fdba74';
  const riskEmoji    = RISK_EMOJI[riskLevelUp]  ?? '🟠';
  const riskLevelRo  = riskLevelUp === 'HIGH' ? 'RIDICAT' : riskLevelUp === 'LOW' ? 'SCĂZUT' : 'MEDIU';
  const hazardProb01 = ctx.hazardProbability ?? 0.20;
  const hazardProb   = Math.round(hazardProb01 * 100);
  // Scor 0–100 calculat dinamic — consistent cu riskLevel + hazardProbability
  const riskScore100 = calcRiskScore(hazardProb01, riskLevelUp);
  const ref          = genRef();
  const dateGen      = genDate();

  const coordStr = (ctx.lat && ctx.lon)
    ? `${Number(ctx.lat).toFixed(2)}° N, ${Number(ctx.lon).toFixed(2)}° E`
    : '—';

  const assetLabel  = ASSET_LABELS[ctx.assetType ?? ''] ?? ctx.assetType ?? '—';
  const hazardLabel = HAZARD_LABELS[ctx.hazardType ?? ''] ?? ctx.hazardType ?? '—';
  const stageLabel  = STAGE_LABELS[ctx.phenophase ?? ''] ?? ctx.phenophase ?? '—';
  const activLabel  = `${assetLabel}${ctx.variety ? ` — Soiul ${ctx.variety}` : ''}`;
  // Elimină denumirea soiului din paranteză (ex: "Piersic (Cardinal)" → "Piersic")
  const cropDisplay = (ctx.crop || '—').replace(/\s*\([^)]*\)\s*$/, '').trim() || '—';

  // Fereastră critică aproximativă (simplificată per hazard + fenofaza)
  const critWindow = ctx.hazardType === 'FROST'
    ? 'Mar – Mai (Înflorire)'
    : ctx.hazardType === 'HAIL'
    ? 'Apr – Aug (Vegetație activă)'
    : ctx.hazardType === 'DROUGHT'
    ? 'Iun – Sep (Sezon uscat)'
    : ctx.hazardType === 'HEAT'
    ? 'Iul – Aug (Caniculă)'
    : 'Apr – Oct';

  // ── Stiluri ────────────────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    width: '210mm', height: '297mm', boxSizing: 'border-box',
    padding: '16mm 18mm', margin: 0, backgroundColor: 'white',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)', position: 'relative',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    pageBreakAfter: 'always', breakAfter: 'page',
    color: '#1a202c', fontFamily: 'serif', fontSize: '11.5px', lineHeight: '1.6',
  };

  const secTitle: React.CSSProperties = {
    fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase',
    letterSpacing: '0.09em', borderBottom: '1px solid #000',
    paddingBottom: '5px', marginBottom: '12px', marginTop: '2px',
  };

  const cell = (label: string, value: string, last = false): React.ReactNode => (
    <div key={label} style={{
      display: 'grid', gridTemplateColumns: '130px 1fr',
      borderBottom: last ? 'none' : '1px solid #f1f5f9',
      padding: '4px 0',
    }}>
      <span style={{ color: '#64748b', fontWeight: 600, fontSize: '10.5px' }}>{label}</span>
      <span style={{ color: '#1a202c', fontSize: '10.5px' }}>{value}</span>
    </div>
  );

  return (
    <div style={page}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-1px' }}>AERISK</div>
          <div style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.05em', marginTop: '1px' }}>PLATFORMĂ DE RISC CLIMATIC AGRICOL</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 1: SUMAR EXECUTIV</div>
          <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{ref}</div>
        </div>
      </div>

      {/* ── SECȚIUNEA I: DATE ACTIV + STATUS RISC ────────────────────────── */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={secTitle}>I. Rezumatul Evaluării</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px' }}>

          {/* STÂNGA — tabel date activ (layout schiță) */}
          <div>
            {/* Locație */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', marginBottom: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>Locație</div>
              {cell('Raion', ctx.region)}
              {cell('Sat / Comună', ctx.locality || '—')}
              {cell('Coordonate GPS', coordStr, true)}
            </div>

            {/* Activ */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>Activ Asigurat</div>
              {cell('Tip activ', assetLabel)}
              {cell('Cultură', cropDisplay)}
              {cell('Soi', ctx.variety || '—')}
              {cell('Stadiu fenologic', stageLabel)}
              {cell('Suprafață', `${ctx.areaHa ?? '—'} ha`)}
              {cell('Valoare asigurată', fmt(ctx.exposureValue, ctx.currency))}
              {cell('Hazard evaluat', hazardLabel, true)}
            </div>
          </div>

          {/* DREAPTA — STATUS RISC (layout schiță) */}
          <div style={{ backgroundColor: riskBg, border: `2px solid ${riskBorder}`, borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Probabilitate — același stil ca panoul de risc */}
            <div style={{ backgroundColor: 'white', border: `1px solid ${riskBorder}`, borderRadius: '4px', padding: '8px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '9px', letterSpacing: '0.06em', color: '#64748b', fontWeight: 700 }}>PROBABILITATE HAZARD</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: riskColor }}>{hazardProb}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: `${riskColor}22`, borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${hazardProb}%`, height: '100%', backgroundColor: riskColor, borderRadius: '99px' }} />
              </div>
              <div style={{ marginTop: '5px', fontSize: '8.5px', color: '#64748b' }}>
                📅 Fereastră critică: <strong style={{ color: riskColor }}>{critWindow}</strong>
              </div>
            </div>

            {/* Status risc */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.08em', marginBottom: '4px' }}>STATUS RISC AERISK</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: riskColor, marginBottom: '8px' }}>
                {riskEmoji} {riskLevelRo}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '3px' }}>
                Scor: <strong style={{ color: '#1a202c' }}>{riskScore100} / 100</strong>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: `${riskColor}22`, borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${riskScore100}%`, height: '100%', backgroundColor: riskColor, borderRadius: '99px' }} />
              </div>
            </div>

            {/* Nivel încredere */}
            <div style={{ borderTop: `1px solid ${riskBorder}`, paddingTop: '8px', fontSize: '9px', color: '#64748b', textAlign: 'center' }}>
              Nivel Încredere Date: <strong style={{ color: '#1a202c' }}>78%</strong>
              <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '2px' }}>Open-Meteo ERA5 · 90 zile</div>
            </div>

            {/* Primă de Risc Recomandată (AAL) */}
            <div style={{
              borderTop: `1px solid ${riskBorder}`,
              paddingTop: '10px',
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '10px 8px',
              border: `1px solid ${riskBorder}`,
            }}>
              <div style={{ fontSize: '8.5px', color: '#64748b', letterSpacing: '0.06em', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                Primă de Risc Recomandată (AAL)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: riskColor }}>
                {met ? fmt(met.aal, ctx.currency) : '—'}
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '3px' }}>
                / anual · bază calcul primă
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECȚIUNEA II: INDICATORI FINANCIARI ──────────────────────────── */}
      <div style={{ marginBottom: '14px' }}>
        <h2 style={secTitle}>II. Indicatori Financiari (Solvency II)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 600 }}>Indicator</th>
              <th style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 600 }}>Definiție</th>
              <th style={{ padding: '7px 10px', textAlign: 'center', fontWeight: 600 }}>Perioadă</th>
              <th style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600 }}>Valoare ({ctx.currency ?? 'EUR'})</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'AAL',     label: 'Pierdere Anuală Medie',                       period: '—',           val: met?.aal,    bg: '#f8fafc', bold: false },
              { key: 'VaR 90%', label: 'Valoare la Risc — Scenariu de Bază',           period: '1 din 10 ani', val: met?.var_90, bg: 'white',   bold: false },
              { key: 'VaR 95%', label: 'Valoare la Risc — Bază de Tarifare',          period: '1 din 20 ani', val: met?.var_95, bg: '#f8fafc', bold: false },
              { key: 'VaR 99%', label: 'Capital Subscriere (SCR) — Solvency II',      period: '1 din 100 ani', val: met?.var_99, bg: '#fff1f2', bold: true, red: true },
              { key: 'PML 99%', label: 'Pierdere Maximă Probabilă — SCR Calculat',   period: 'Percentila 99', val: met?.pml_99, bg: '#f8fafc', bold: true },
            ].map(r => (
              <tr key={r.key} style={{ backgroundColor: r.bg }}>
                <td style={{ padding: '6px 10px', fontWeight: 'bold', color: r.red ? '#b91c1c' : '#1a202c', borderBottom: '1px solid #e2e8f0' }}>{r.key}</td>
                <td style={{ padding: '6px 10px', color: r.red ? '#b91c1c' : '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '10.5px' }}>{r.label}</td>
                <td style={{ padding: '6px 10px', textAlign: 'center', color: r.red ? '#b91c1c' : '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '10.5px' }}>{r.period}</td>
                <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: r.bold ? 'bold' : 'normal', color: r.red ? '#b91c1c' : '#1a202c', borderBottom: '1px solid #e2e8f0' }}>
                  {met ? fmt(r.val, ctx.currency) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!met && (
          <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
            * Indicatorii financiari vor fi disponibili după rularea analizei din dashboard.
          </div>
        )}
      </div>

      {/* ── SECȚIUNEA III: METADATE AUDIT ─────────────────────────────────── */}
      <div>
        <h2 style={secTitle}>III. Metadate de Audit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '10.5px' }}>
          {[
            ['ID RAPORT',      ref],
            ['DATA GENERARE',  dateGen],
            ['VERSIUNE ENGINE', 'AERISK ENGINE v1.0.0'],
            ['ANALIST',        ctx.analystId],
            ['DATE SURSĂ',     ctx.isLiveData ? '✅ Date live (dashboard)' : '⚠️ Date demo'],
            ['STANDARD',       'Solvency II / EIOPA'],
          ].map(([label, value]) => (
            <div key={label} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px' }}>
              <div style={{ color: '#64748b', fontSize: '8.5px', letterSpacing: '0.06em', marginBottom: '3px' }}>{label}</div>
              <div style={{ fontWeight: 'bold', fontSize: '9.5px', wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '7px', fontSize: '8.5px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Subscriere | {ctx.region}, {ctx.country}</span>
        <span>PAGINA 1 DIN 5</span>
      </div>
    </div>
  );
};

export default Page1;
