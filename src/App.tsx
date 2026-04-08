import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { REPORT_CONTEXT } from './config/reportParams';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Page5 from './components/Page5';

// ─── Pages 6, 7, 8 sunt înghețate — conținutul lor a fost consolidat
// în Page4 (Reziliență + Atenuare) și Page5 (Metodologie + Audit SHA-256).
// Raportul PRO are acum 5 pagini funcționale, corelate 100% cu backend-ul.

const App = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const docTitle = (() => {
    const d = new Date();
    const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const region  = (REPORT_CONTEXT.region ?? 'MD').replace(/\s+/g,'').slice(0,6).toUpperCase();
    const hazard  = (REPORT_CONTEXT.hazardType ?? 'FT').slice(0,2).toUpperCase();
    return `AERISK-${date}-${region}-${hazard}`;
  })();

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: docTitle,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          width: 210mm !important;
        }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  return (
    <div style={{
      backgroundColor: '#525659',
      minHeight: '100vh',
      padding: '40px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>

      {/* BUTON DESCĂRCARE */}
      <div className="no-print" style={{
        position: 'fixed',
        top: '20px',
        right: '28px',
        zIndex: 1000,
      }}>
        <button
          onClick={() => handlePrint()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1e293b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f172a')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e293b')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Descarcă Raport PDF — 5 Pagini
        </button>
      </div>

      {/* RAPORT PRO — 5 pagini funcționale */}
      <div ref={reportRef}>
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
        <Page5 />
      </div>

    </div>
  );
};

export default App;
