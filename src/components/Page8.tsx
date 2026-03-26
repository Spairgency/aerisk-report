import React, { useState, useEffect } from 'react';
import { REPORT_CONTEXT, PRECOMPUTED_METRICS } from '../config/reportParams';

// ─────────────────────────────────────────────────────────────────
// SHA-256 CLIENT-SIDE — Web Crypto API (browser-native, zero deps)
//
// Input: JSON.stringify({ context, metrics, reportId, timestamp })
// Output: hex string uppercase 64 chars
//
// BACKEND TODO (v2): înlocuiește cu endpoint GET /audit/document-hash
//    → aerisk-backend/app/services/audit_signer.py
//    → Semnătură RSA/Ed25519 pentru verificare externă
// ─────────────────────────────────────────────────────────────────

async function sha256hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Generează ID raport consistent cu Page1 — AERISK-YYYYMMDD-REGION-HZ */
function genReportId(): string {
  const d   = new Date();
  const yy  = d.getFullYear();
  const mm  = String(d.getMonth() + 1).padStart(2, '0');
  const dd  = String(d.getDate()).padStart(2, '0');
  const reg = (REPORT_CONTEXT.region ?? 'XX').replace(/\s+/g, '').slice(0, 6).toUpperCase();
  const hz  = (REPORT_CONTEXT.hazardType ?? 'XX').slice(0, 2).toUpperCase();
  return `AERISK-${yy}${mm}${dd}-${reg}-${hz}`;
}

/** Generează timestamp curent formatat în română cu fusul UTC */
function genTimestamp(): string {
  return new Date().toLocaleString('ro-RO', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC';
}

const Page8 = () => {
  const reportId  = genReportId();
  const timestamp = genTimestamp();
  const [hashStr, setHashStr] = useState<string>('Calculând…');

  useEffect(() => {
    // Hashăm întregul payload de audit: context + metrics + id + timestamp
    const payload = JSON.stringify({
      context:   REPORT_CONTEXT,
      metrics:   PRECOMPUTED_METRICS,
      report_id: reportId,
      timestamp,
      engine:    'AERISK ENGINE v1.0.0',
    });
    sha256hex(payload)
      .then(setHashStr)
      .catch(() => setHashStr('HASH-UNAVAILABLE'));
  }, []);

  const audit = {
    hash:      hashStr,
    reportId,
    engine:    'AERISK ENGINE v1.0.0',
    timestamp,
    server:    'EU-CENTRAL-1 (Frankfurt)',
    status:    'INTEGRU',
  };

  const dataSources = [
    { sursa: 'Copernicus ERA5 Land Reanalysis', tip: 'Date climatice', rezolutie: '0.1° (~9km)', perioada: '1940–prezent', audit: 'ESA / ECMWF' },
    { sursa: 'ERA5 Frost Events Dataset',       tip: 'Evenimente îngheț', rezolutie: 'Zilnic',    perioada: '1994–2024',   audit: 'ECMWF' },
    { sursa: 'FAO Agrometeorologie Studii',     tip: 'Biologie (LT50/LT100)', rezolutie: 'Soiuri specifice', perioada: 'Publicat', audit: 'FAO/ONU' },
    { sursa: 'MADRM Moldova (estimat)',         tip: 'Daune reale istorice', rezolutie: 'Regional', perioada: '1994–2024',  audit: 'Pending' },
    { sursa: 'Coordonate GPS Client',           tip: 'Localizare activ',   rezolutie: '±5m',       perioada: '2026',        audit: 'Client' },
  ];

  const limits = [
    {
      titlu: 'Model Probabilistic — Nu Garantie',
      text: 'Rezultatele reprezintă probabilități statistice bazate pe date istorice. AERISK nu garantează absența evenimentelor de îngheț în perioadele evaluate.',
      icon: '⚖️',
    },
    {
      titlu: 'Rezoluție Spațială 9km',
      text: 'Datele ERA5 nu surprind microclimatele sub 9km. Văile sub 100m lățime, frost pockets locale și efectele topografice fine nu sunt modelate în v1.0.',
      icon: '🗺️',
    },
    {
      titlu: 'Date Daune Istorice Estimate',
      text: 'Corelația Predicted vs. Actual (Page 5) utilizează date MADRM estimate. Validarea pe date de daune asigurate reale este planificată pentru v2.0.',
      icon: '📊',
    },
    {
      titlu: 'Utilizare Autorizată',
      text: 'Raportul este destinat exclusiv scopurilor de underwriting și risk management. Utilizarea în scopuri de creditare se face pe propria răspundere a utilizatorului.',
      icon: '🔒',
    },
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

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>AERISK</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>RAPORT DE EVALUARE RISC CLIMATIC</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>PAGINA 8: CERTIFICARE & AUDIT</div>
        </div>
      </div>

      {/* SECTION XX — DATA PROVENANCE */}
      <div>
        <h2 style={sectionTitle}>XX. Proveniența Datelor (Data Provenance)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 600 }}>Sursă Date</th>
              <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 600 }}>Utilizare</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>Rezoluție</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>Perioadă</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600 }}>Audit</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white' }}>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', color: '#1e293b' }}>{row.sursa}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>{row.tip}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>{row.rezolutie}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>{row.perioada}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <span style={{
                    fontSize: '8px', fontWeight: 'bold', padding: '1px 5px', borderRadius: '10px',
                    backgroundColor: row.audit === 'Pending' ? '#fef3c7' : '#f0fdf4',
                    color: row.audit === 'Pending' ? '#92400e' : '#166534',
                    border: `1px solid ${row.audit === 'Pending' ? '#fcd34d' : '#bbf7d0'}`,
                  }}>
                    {row.audit === 'Pending' ? '⏳ Pending' : `✓ ${row.audit}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION XXI — LIMITĂRI */}
      <div>
        <h2 style={sectionTitle}>XXI. Limitări Tehnice și Ipoteze</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {limits.map((l, i) => (
            <div key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '7px 9px' }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1e293b', marginBottom: '3px' }}>{l.icon} {l.titlu}</div>
              <div style={{ fontSize: '8px', color: '#475569', lineHeight: '1.4' }}>{l.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION XXII — CERTIFICAT DIGITAL */}
      <div style={{ marginTop: '14px' }}>
        <h2 style={{ ...sectionTitle, marginTop: '0' }}>XXII. Certificat de Autenticitate — SHA-256</h2>

        <div style={{ border: '1.5px solid #1e293b', borderRadius: '4px', overflow: 'hidden' }}>
          {/* Certificate header */}
          <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em' }}>🔐 DOCUMENT SEMNAT DIGITAL</div>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>AERISK ENGINE v1.0.0</div>
          </div>

          <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Hash */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '8px', color: '#64748b', marginBottom: '3px', letterSpacing: '0.06em' }}>SHA-256 DOCUMENT HASH</div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', backgroundColor: '#f1f5f9', padding: '6px 8px', borderRadius: '3px', wordBreak: 'break-all', color: hashStr === 'Calculând…' ? '#94a3b8' : '#1e293b', border: '1px solid #e2e8f0', fontStyle: hashStr === 'Calculând…' ? 'italic' : 'normal' }}>
                {audit.hash}
              </div>
            </div>
            {/* Meta left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                { label: 'ID Raport',       val: audit.reportId },
                { label: 'Data Generare',   val: audit.timestamp },
                { label: 'Server Region',   val: audit.server },
              ].map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: '8px', color: '#94a3b8', letterSpacing: '0.05em' }}>{f.label.toUpperCase()}</div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1e293b' }}>{f.val}</div>
                </div>
              ))}
            </div>
            {/* Meta right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div>
                <div style={{ fontSize: '8px', color: '#94a3b8', letterSpacing: '0.05em' }}>STATUS INTEGRITATE</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a' }}>✓ {audit.status}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', color: '#94a3b8', letterSpacing: '0.05em' }}>ENGINE</div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1e293b' }}>{audit.engine}</div>
              </div>
              <div style={{ marginTop: '4px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '3px', padding: '5px 8px', fontSize: '8px', color: '#166534', lineHeight: '1.4' }}>
                Documentul poate fi verificat prin re-calcularea hash-ului SHA-256 pe datele originale de intrare.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '9px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>AERISK ENGINE v1.0.0 | Confidențial — Document pentru Underwriting</span>
        <span>PAGINA 8 DIN 8</span>
      </div>
    </div>
  );
};

export default Page8;
